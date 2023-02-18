import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
    Animated, View, StyleSheet, Text, Dimensions, TouchableOpacity, Alert, Image, ImageBackground,
    AppState, BackHandler, Platform
} from 'react-native';
import { fromUnixTime, getUnixTime, isThisSecond, differenceInMilliseconds, addSeconds } from 'date-fns';
import uuid from 'uuid-random'
import Svg from 'react-native-svg';
import Modal from 'react-native-modal'

import { Text as TextSVG } from 'react-native-svg';
import { useFocusEffect } from '@react-navigation/native';
import SessionRatingModal from '../components/SessionRatingModal';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import * as NavigationBar from "expo-navigation-bar";

const constants = require('../components/constants.json')
const clock_middle = require('../../assets/clock_middle.png');
const clock_bottom = require('../../assets/clock_bottom.png');
const clock_top = require('../../assets/clock_top.png');
const bg_desk = require('../../assets/background_desk.png');
const { height, width } = Dimensions.get('window');
const picked_width = width / 2 / 0.8

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

const SessionOngoingScreen = ({ navigation, route: { params } }) => {

    const { numMins, categoryId, categoryName, activityName, colorId, token } = params;
    let bgColorHex = constants.colors[colorId]

    const [plannedMin, setPlannedMin] = useState(numMins)
    const [rewardModalVisible, setRewardModalVisible] = useState(false)

    const [secLeft, setSecLeft] = useState(numMins * 60);

    const increment = useRef(null);
    let now_dt = getUnixTime(new Date())
    const [endTime, setEndTime] = useState(getUnixTime(addSeconds(fromUnixTime(now_dt), numMins * 60 + 1)))
    const [startTime, setStartTime] = useState(new Date())

    //let bgColorHex = constants.colors[bgColor]
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const [onEnd, setOnEnd] = useState(false)
    const notificationListener = useRef();
    const responseListener = useRef();

    const appState = useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = useState(appState.current);

    const fadeInAndOut = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 3000,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 3000,
                    useNativeDriver: true,
                })
            ])).start();
    }

    const [sessionObj, setSessionObj] = useState({
        activity_id: uuid(),
        chosenCategory: categoryName,
        cat_id: categoryId,
        activity_name: activityName,
    })
    const toggleRewardModal = () => {
        setRewardModalVisible(!rewardModalVisible)
    }

    const handleStart = (_endTime, plannedNumMinutes) => {
        if (onEnd) {
            clearInterval(increment.current)
            return;
        }
        setPlannedMin(plannedNumMinutes)
        setEndTime(_endTime)
        increment.current = setInterval(() => {
            let dt = new Date();
            var diff = differenceInMilliseconds(fromUnixTime(_endTime), dt)
            if (diff < 0) {
                handleReset(false, plannedNumMinutes)
            }
            //console.log("difference in sec:", diff / 1000)
            setSecLeft(Math.floor(diff / 1000));
        }, 100)
    }
    const [sessionEndTime, setSessionEndTime] = useState('')
    const [endEarlyFlag, setEndEarlyFlag] = useState(false)
    const [sessionStartTime, setSessionStartTime] = useState('')


    const handleReset = (endEarly = false, plannedNumMinutes) => {
        clearInterval(increment.current)
        setOnEnd(true)
        if (endEarly) {
            let now_dt = getUnixTime(new Date())
            setSessionEndTime(getUnixTime(new Date()))
            setSessionStartTime(getUnixTime(startTime))
            setEndEarlyFlag(true)
            toggleRewardModal();
        } else {
            //setSessionEndTime(getUnixTime(new Date()))

            setSessionEndTime(endTime)
            setSessionStartTime(getUnixTime(startTime))
            setEndEarlyFlag(false)
            toggleRewardModal();
        }
    }

    const offBoardCallback = () => {
        navigation.navigate('SessionSelect')
    }


    const backAction = () => {
        Alert.alert('Hold on!', 'Are you sure you want to go back?', [
            {
                text: 'Cancel',
                onPress: () => null,
                style: 'cancel',
            },
            { text: 'YES', onPress: () => BackHandler.exitApp() },
        ]);
        return true;
    };

    useEffect(() => {
        /*const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction,
        );*/
        if (Platform.OS === 'android') { NavigationBar.setVisibilityAsync("hidden"); }

        navigation.addListener('beforeRemove', (e) => {

            // Prevent default behavior of leaving the screen
            e.preventDefault();

            /*Alert.alert(
                'Discard changes?',
                'You have unsaved changes. Are you sure to discard them and leave the screen?',
                [
                    { text: "Don't leave", style: 'cancel', onPress: () => { } },
                    {
                        text: 'Discard',
                        style: 'destructive',
                        // If the user confirmed, then we dispatch the action we blocked earlier
                        // This will continue the action that had triggered the removal of the screen
                        onPress: () => navigation.navigate('SessionSelect'),
                    },
                ]
            );*/
        })

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });

        const subscription = AppState.addEventListener('change', nextAppState => {
            if (appState.current.match(/inactive|background/) &&
                (nextAppState === 'active' || nextAppState === 'foreground')) {
                // cancel the notification if we are active again
                cancelPushNotification();

                console.log('App has come to the foreground!');
            } else if (appState.current.match(/active|foreground/) &&
                (nextAppState === 'background')) {
                //|| nextAppState === 'inactive'


                // schedule a notification if app is being minimized
                if (!onEnd) {
                    console.log(`SCHEDULING NOTIFICATION ${secLeft} seconds from now`)
                    schedulePushNotification(secLeft);
                }

                console.log('App has gone to the background!');
            }

            appState.current = nextAppState;
            setAppStateVisible(appState.current);
            console.log('AppState', appState.current);
        });
        return () => {
            //backHandler.remove();
            subscription.remove();
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    })

    useFocusEffect(

        useCallback(() => {
            //setStartTime(new Date())
            console.log(`Now: ${getUnixTime(new Date())}`)
            console.log(`End time: ${endTime}`)
            if (getUnixTime(new Date()) > endTime) { // session already done, we have come from a notif
                console.log("we are done")
                return;
            }

            if (isThisSecond(fromUnixTime(endTime))) {
                handleReset(false, numMins)
            }

            // temporary comment this out to work on it
            handleStart(endTime, numMins);

            fadeInAndOut()

            return () => {
                console.log("Cleaning up..?")
                setEndTime(0)

            }
        }, [])
    )

    async function cancelPushNotification() {
        await Notifications.cancelAllScheduledNotificationsAsync()
    }

    async function schedulePushNotification(numSec) {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "Session complete",
                body: `Your timer is up for ${activityName}. Go to Time Out to rate how you did.`,
                data: { data: 'goes here' },
            },
            trigger: { seconds: numSec },
        })
    }

    const twoDigits = (num) => {
        return ("0" + num).slice(-2)
    }

    const addFiveMin = () => {
        var newTime = getUnixTime(addSeconds(fromUnixTime(endTime), 5 * 60))
        // check to make sure adding 5 min does not bump the timer above 99 minutes
        let dt = new Date();
        var diff = differenceInMilliseconds(fromUnixTime(newTime), dt)
        var secondsLeft = Math.floor(diff / 1000)
        var minsLeft = Math.floor(secondsLeft / 60)
        console.log("Mins left: ", minsLeft)
        if (minsLeft > 99) {
            //if (parseInt(twoDigits(Math.floor(secondsLeft / 60))) > 99) {
            alert("Cannot add more time!")
        } else {
            console.log("Setting end time")

            //setEndTime(newTime)
            clearInterval(increment.current)
            handleStart(newTime, plannedMin + 5)
        }
    }

    const areYouSureEndEarly = () => {
        console.log("alert sounded..");
        Alert.alert(
            "Are you sure?",
            "You were doing so well..",
            [
                {
                    text: "No, keep going",
                    onPress: () => { },
                    style: "cancel"
                },
                {
                    text: "End early", onPress: () => {
                        handleReset(true, plannedMin)
                    }
                }
            ]
        );
    }

    const areYouSureAddTime = () => {
        Alert.alert(
            "Are you sure?",
            "Your time will increase by 5 minutes",
            [
                {
                    text: "Never mind, keep the same time",
                    onPress: () => { },
                    style: "cancel"
                },
                {
                    text: "Add 5 minutes",
                    onPress: () => { addFiveMin() }
                }
            ]
        );
    }

    return (
        <View style={styles.container}>
            <View style={{}}>

                {/* SESSION REWARD MODAL */}
                <View>
                    <Modal isVisible={rewardModalVisible}
                        animationIn='slideInLeft'
                        animationOut='slideOutLeft'
                        backdropTransitionOutTiming={0}
                    >

                        <View style={{
                            flex: 1,
                            flexDirection: 'column',
                            justifyContent: 'center',
                        }}>
                            <View style={{
                                height: height * 0.7,
                                borderRadius: 20,
                            }}>

                                <SessionRatingModal
                                    sessionObj={sessionObj}
                                    sessionEndTime={sessionEndTime}
                                    endEarlyFlag={endEarlyFlag}
                                    plannedMin={plannedMin}
                                    sessionStartTime={sessionStartTime}
                                    toggleFunction={toggleRewardModal}
                                    offBoardCallback={offBoardCallback} />

                            </View>
                        </View>
                    </Modal>
                </View>



                <View style={{
                    position: 'absolute', height: '100%', width: '100%', borderWidth: 0, borderColor: 'brown',
                }}>
                    <Image
                        source={bg_desk}
                        style={{ width: width, height: '170%', borderWidth: 0, borderColor: 'green' }}
                        resizeMode="contain" />
                </View>
                <Image
                    source={clock_top}
                    style={{
                        width: 235, height: 52, alignSelf: "center",
                        marginTop: 30,
                    }}
                    resizeMode="contain" />

                <View style={styles.clockContainer}>
                    <ImageBackground
                        source={clock_middle}
                        style={[styles.image]}
                        resizeMode='contain'>
                        <View style={[styles.clockWrappedView]}
                        >
                            <Svg style={[styles.svgStyle, { borderWidth: 0, }]}
                                height="100%" width="100%" viewBox={`0 0 100 100`}>
                                <TextSVG x={50} y={35} fontSize={8} textAnchor="middle" fill="#90AB72">time left</TextSVG>

                                {onEnd ? <>
                                    <TextSVG x={23} y={60} fontSize={25} textAnchor="middle" fill="#90AB72"
                                    >{0}</TextSVG>
                                    <TextSVG x={38} y={60} fontSize={25} textAnchor="middle" fill="#90AB72"
                                    >{0}</TextSVG>
                                    <TextSVG x={50} y={60} fontSize={25} textAnchor="middle" fill="#90AB72"
                                    >:</TextSVG>
                                    <TextSVG x={62} y={60} fontSize={25} textAnchor="middle" fill="#90AB72"
                                    >{0}</TextSVG>
                                    <TextSVG x={77} y={60} fontSize={25} textAnchor="middle" fill="#90AB72"
                                    >{0}</TextSVG>
                                </> :
                                    <>
                                        <TextSVG x={23} y={60} fontSize={25} textAnchor="middle" fill="#90AB72"
                                        >{twoDigits(Math.floor(secLeft / 60))[0]}</TextSVG>
                                        <TextSVG x={38} y={60} fontSize={25} textAnchor="middle" fill="#90AB72"
                                        >{twoDigits(Math.floor(secLeft / 60))[1]}</TextSVG>
                                        <TextSVG x={50} y={60} fontSize={25} textAnchor="middle" fill="#90AB72"
                                        >:</TextSVG>
                                        <TextSVG x={62} y={60} fontSize={25} textAnchor="middle" fill="#90AB72"
                                        >{twoDigits(secLeft % 60)[0]}</TextSVG>
                                        <TextSVG x={77} y={60} fontSize={25} textAnchor="middle" fill="#90AB72"
                                        >{twoDigits(secLeft % 60)[1]}</TextSVG>
                                    </>

                                }
                            </Svg>
                        </View>
                    </ImageBackground>
                </View>

                <Image
                    source={clock_bottom}
                    style={{ width: 175, height: 23, alignSelf: "center", borderWidth: 0, borderColor: 'yellow' }}
                    resizeMode="contain" />

                <View style={[styles.gotThisContainer,
                { position: 'absolute', height: '100%', width: '100%', flexDirection: 'row', borderWidth: 0, borderColor: 'green', }]}>
                    <View style={{ flex: 1, borderWidth: 0, }}>

                    </View>
                    <View style={{ flex: 1, borderWidth: 0, }}>
                        <Animated.View style={{ flex: 1, borderWidth: 0, opacity: fadeAnim }}>
                            <View style={{
                                backgroundColor: 'white', height: '100%', width: '100%', alignItems: 'center',
                                justifyContent: 'center', borderRadius: 30,
                            }}>
                                <View>
                                    <Text style={[styles.textDefaultBold, styles.gotThis]}>You got this!</Text>
                                </View>

                            </View>

                        </Animated.View>
                        <View style={{ flex: 1, borderWidth: 0, }} />
                        <View style={{ flex: 1, borderWidth: 0, }}>

                        </View>

                    </View>

                </View>
            </View>

            <View style={{ padding: 30, paddingTop: 10, }}>
                <View style={{
                    height: 70, marginTop: 50, borderRadius: 20,
                    backgroundColor: 'white', shadowOffset: {
                        width: 0.1,
                        height: 0.1,
                    },
                    shadowOpacity: 0.1,
                }}>
                    <View style={styles.activityContainer}>
                        <View style={{ flex: 3, alignContent: 'center', marginHorizontal: 10, }}>
                            <Text style={[styles.textDefaultBold, styles.activityName]}>{activityName}</Text>
                        </View>

                        <View style={[styles.categoryStyle, { backgroundColor: bgColorHex, flex: 1 }]}>
                            <Text style={[styles.textDefaultBold, styles.categoryText,
                            { color: 'white', }]}>{categoryName}</Text>
                        </View>
                    </View>
                </View>


            </View>

            <View style={{ height: 70 }}>

                <View style={styles.activityContainer}>

                    <TouchableOpacity style={[styles.button, { backgroundColor: '#D7B4D5' }]}
                        onPress={areYouSureEndEarly}>
                        <Text style={[styles.textDefaultBold, styles.buttonText]}>End Early</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.button, { backgroundColor: '#ABC57E' }]}
                        onPress={areYouSureAddTime}>
                        <Text style={[styles.textDefaultBold, styles.buttonText]}>+5 Min</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/*<Text>{"End time is " + format(fromUnixTime(endTime), 'M-dd-yyyy z')}</Text>
            <Text>{"time is " + secLeft}</Text>*/}

        </View>
    )
}

SessionOngoingScreen.navigationOptions = () => { return { headerShown: false, }; }

const styles = StyleSheet.create({
    textDefaultBold: {
        fontFamily: 'Inter-Bold',
    },
    textDefault: {
        fontFamily: 'Inter-Regular',
    },
    container: {
        marginTop: 70,
    },
    time: {
        fontSize: 40
    },
    time: {
        fontSize: 100,
        color: "#90AB72",
        alignSelf: 'center',
    },
    timeLeft: {
        color: '#90AB72',
        fontSize: 28,
        fontWeight: 'bold',
        alignSelf: 'center'
    },
    gotThis: {
        color: '#90AB72',
        fontSize: 26,
        fontWeight: 'bold',
    },
    gotThisContainer: {
        //backgroundColor: 'white',
        //borderRadius: 20,
        //padding: 5,
        //alignItems: 'center',
        //justifyContent: 'center',
        //alignSelf: 'center',
        //margin: 20,
    },
    activityName: {
        color: '#67806D',
        fontSize: 22,
        fontWeight: 'bold',
        alignSelf: 'center',
        marginVertical: 5,
    },
    categoryStyle: {
        borderRadius: 50,
        padding: 7,
        marginRight: 12,
        alignSelf: 'center',
        alignItems: 'center',
    },
    categoryText: {
        color: '#67806D',
        fontSize: 12,
    },
    activityContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        alignContent: 'center',
    },
    button: {
        flex: 1,
        padding: 10,
        margin: 25,
        height: 40,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset: {
            width: 0.1,
            height: 0.1,
        },
        shadowOpacity: 0.1,
    },
    buttonText: {
        fontWeight: 'bold',
        color: 'white',
        fontSize: 13,
    },
    clockContainer: {
        alignSelf: 'stretch',
        alignItems: 'center',
    },
    clockWrappedView: {
        aspectRatio: 1,
        width: picked_width,
    },
    svgStyle: {
        flex: 1,
    },
})

export default SessionOngoingScreen;