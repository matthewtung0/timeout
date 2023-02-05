import React, { useState, useRef, useCallback } from 'react';
import { Animated, View, StyleSheet, Text, Dimensions, TouchableOpacity, Alert, Image, ImageBackground } from 'react-native';
import {
    fromUnixTime, getUnixTime, isThisSecond, format,
    differenceInMilliseconds, addSeconds
} from 'date-fns';
import uuid from 'uuid-random'
import Svg from 'react-native-svg';
import Modal from 'react-native-modal'

import { Text as TextSVG } from 'react-native-svg';
import { useFocusEffect } from '@react-navigation/native';
import SessionRatingModal from '../components/SessionRatingModal';
const constants = require('../components/constants.json')
const clock_middle = require('../../assets/clock_middle.png');
const clock_bottom = require('../../assets/clock_bottom.png');
const clock_top = require('../../assets/clock_top.png');
const bg_desk = require('../../assets/background_desk.png');
const { height, width } = Dimensions.get('window');
const picked_width = width / 2 / 0.8

const SessionOngoingScreen = ({ navigation: { navigate }, route: { params } }) => {

    const { numMins, categoryId, categoryName, activityName, colorId } = params;
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
        prodRating: '',
    })
    const toggleRewardModal = () => {
        setRewardModalVisible(!rewardModalVisible)
    }

    const handleStart = (_endTime, plannedNumMinutes) => {
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

        if (endEarly) {
            let now_dt = getUnixTime(new Date())
            setSessionEndTime(getUnixTime(new Date()))
            setSessionStartTime(getUnixTime(startTime))
            setEndEarlyFlag(true)
            toggleRewardModal();
        } else {
            /*navigate('SessionEval', {
                sessionObj, sessionEndTime: getUnixTime(new Date()),
                endEarlyFlag: false, plannedMin: plannedNumMinutes, sessionStartTime: getUnixTime(startTime)
            })*/
            setSessionEndTime(getUnixTime(new Date()))
            setSessionStartTime(getUnixTime(startTime))
            setEndEarlyFlag(false)
            toggleRewardModal();
        }
        //alert('Time end')
    }

    const offBoardCallback = () => {
        navigate('SessionSelect')
    }

    useFocusEffect(

        useCallback(() => {
            setStartTime(new Date())

            if (isThisSecond(fromUnixTime(endTime))) {
                handleReset(false, numMins)
            }

            // temporary comment this out to work on it
            handleStart(endTime, numMins);

            fadeInAndOut()

            return () => {
                setEndTime(0)
            }
        }, [])
    )

    const twoDigits = (num) => {
        return ("0" + num).slice(-2)
    }

    const addFiveMin = () => {
        console.log("Setting end time")
        var newTime = getUnixTime(addSeconds(fromUnixTime(endTime), 5 * 60))
        //setEndTime(newTime)
        clearInterval(increment.current)
        handleStart(newTime, plannedMin + 5)
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
    const updateTime = (a) => {
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
                    position: 'absolute', height: '100%', width: '100%', borderWidth: 2, borderColor: 'brown',
                }}>
                    <Image
                        source={bg_desk}
                        style={{ width: width, height: '170%', borderWidth: 1, borderColor: 'green' }}
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
                            <Svg style={[styles.svgStyle, { borderWidth: 1, }]}
                                height="100%" width="100%" viewBox={`0 0 100 100`}>
                                <TextSVG x={50} y={35} fontSize={8} textAnchor="middle" fill="#90AB72">time left</TextSVG>
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
                            </Svg>
                        </View>
                    </ImageBackground>
                </View>

                <Image
                    source={clock_bottom}
                    style={{ width: 175, height: 23, alignSelf: "center", borderWidth: 1, borderColor: 'yellow' }}
                    resizeMode="contain" />

                <View style={[styles.gotThisContainer,
                { position: 'absolute', height: '100%', width: '100%', flexDirection: 'row', borderWidth: 1, borderColor: 'green', }]}>
                    <View style={{ flex: 1, borderWidth: 1, }}>

                    </View>
                    <View style={{ flex: 1, borderWidth: 1, }}>
                        <Animated.View style={{ flex: 1, borderWidth: 1, opacity: fadeAnim }}>
                            <View style={{ backgroundColor: 'white', height: '100%', width: '100%', }}>
                                <Text style={[styles.textDefaultBold, styles.gotThis]}>You got this!</Text>
                            </View>

                        </Animated.View>
                        <View style={{ flex: 1, borderWidth: 1, }} />
                        <View style={{ flex: 1, borderWidth: 1, }}>

                        </View>

                    </View>

                </View>
            </View>

            <View style={{ padding: 30, paddingTop: 10, }}>
                <View style={{
                    height: 70, marginTop: 50, borderRadius: 20,
                    backgroundColor: 'white', shadowOffset: {
                        width: 0.2,
                        height: 0.2,
                    },
                    shadowOpacity: 0.3,
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

            <Text>{"End time is " + format(fromUnixTime(endTime), 'M-dd-yyyy z')}</Text>
            <Text>{"time is " + secLeft}</Text>

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
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset: {
            width: 0.2,
            height: 0.2,
        },
        shadowOpacity: 0.2,
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