import React, { useState, useRef, useCallback } from 'react';
import { View, StyleSheet, Text, Dimensions, TouchableOpacity, Alert } from 'react-native';
import {
    fromUnixTime, getUnixTime, isThisSecond, format,
    differenceInMilliseconds, addSeconds
} from 'date-fns';
import { useFocusEffect } from '@react-navigation/native';
const constants = require('../components/constants.json')

const SessionOngoingScreen = ({ navigation: { navigate }, route: { params } }) => {
    const { height, width } = Dimensions.get('window');
    const { numMins, categoryId, categoryName, activityName, colorId } = params;
    let bgColorHex = constants.colors[colorId]

    const [plannedMin, setPlannedMin] = useState(numMins)

    const [secLeft, setSecLeft] = useState(numMins * 60);

    const increment = useRef(null);
    let now_dt = getUnixTime(new Date())
    const [endTime, setEndTime] = useState(getUnixTime(addSeconds(fromUnixTime(now_dt), numMins * 60 + 1)))
    const [startTime, setStartTime] = useState(new Date())

    //let bgColorHex = constants.colors[bgColor]

    const [sessionObj, setSessionObj] = useState({
        chosenCategory: categoryName,
        chosenCatId: categoryId,
        customActivity: activityName,
        //sessionStartTime: '',
        //sessionEndTime: '',
        //endEarlyFlag: '',
        prodRating: '',
    })

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

    const handleReset = (endEarly = false, plannedNumMinutes) => {
        clearInterval(increment.current)

        if (endEarly) {
            let now_dt = getUnixTime(new Date())
            navigate('SessionEval', {
                sessionObj, sessionEndTime: getUnixTime(new Date()),
                endEarlyFlag: true, plannedMin: plannedNumMinutes, sessionStartTime: getUnixTime(startTime)
            })
            //setEndTime(fromUnixTime(now_dt), true)
        } else {
            navigate('SessionEval', {
                sessionObj, sessionEndTime: getUnixTime(new Date()),
                endEarlyFlag: false, plannedMin: plannedNumMinutes, sessionStartTime: getUnixTime(startTime)
            })
            //setEndTime(fromUnixTime(endTime), false)
        }
        alert('Time end')
    }

    useFocusEffect(

        useCallback(() => {
            setStartTime(new Date())
            //setSessionObj({ ...sessionObj, sessionStartTime: now_dt })

            if (isThisSecond(fromUnixTime(endTime))) {
                handleReset(false, numMins)
            }

            // temporary comment this out to work on it
            handleStart(endTime, numMins);

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
                    onPress: {},
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

            <Text style={styles.timeLeft}>Time Left</Text>
            {/*<Text style={styles.time}>{twoDigits(Math.floor(secLeft / 60)) + ":" + twoDigits(secLeft % 60)}</Text>*/}

            <View style={{
                flex: 1, flexDirection: 'row', alignItems: 'center',
                marginBottom: 50, marginTop: 50,
            }}>
                <View style={{ flex: 1.2 }} />
                <Text style={{ flex: 1, height: 100, textAlign: 'center', fontSize: 90, color: "#90AB72", fontWeight: '500', }}>
                    {twoDigits(Math.floor(secLeft / 60))[0]}
                </Text>
                <Text style={{ flex: 1, height: 100, textAlign: 'center', fontSize: 90, color: "#90AB72", fontWeight: '500', }}>
                    {twoDigits(Math.floor(secLeft / 60))[1]}
                </Text>
                <Text style={{ flex: 0.5, height: 100, textAlign: 'center', fontSize: 90, color: "#90AB72", fontWeight: '500', }}>:</Text>
                <Text style={{ flex: 1, height: 100, textAlign: 'center', fontSize: 90, color: "#90AB72", fontWeight: '500', }}>
                    {twoDigits(secLeft % 60)[0]}
                </Text>
                <Text style={{ flex: 1, height: 100, textAlign: 'center', fontSize: 90, color: "#90AB72", fontWeight: '500', }}>
                    {twoDigits(secLeft % 60)[1]}
                </Text>
                <View style={{ flex: 1.2 }} />
            </View>


            <View style={[styles.gotThisContainer, { width: width / 1.5, height: height / 10 }]}>
                <Text style={styles.gotThis}>You got this!</Text>
            </View>

            <View style={{ height: 70 }}>

                <View style={styles.activityContainer}>
                    <View style={{ flex: 3, alignContent: 'center' }}>
                        <Text style={styles.activityName}>{activityName}</Text>
                    </View>

                    <View style={[styles.categoryStyle, { backgroundColor: bgColorHex, flex: 1 }]}>
                        <Text style={[styles.categoryText]}>{categoryName}</Text>
                    </View>
                </View>
            </View>

            <View style={{ height: 70 }}>

                <View style={styles.activityContainer}>

                    <TouchableOpacity style={[styles.button, { backgroundColor: '#D7B4D5' }]}
                        onPress={areYouSureEndEarly}>
                        <Text style={styles.buttonText}>End Early</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.button, { backgroundColor: '#ABC57E' }]}
                        onPress={areYouSureAddTime}>
                        <Text style={styles.buttonText}>+5 Min</Text>
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
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        margin: 20,
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
        fontSize: 14,
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
            width: 0.4,
            height: 0.4,
        },
        shadowOpacity: 0.5,
    },
    buttonText: {
        fontWeight: 'bold',
        color: 'white',
        fontSize: 13,
    },
})

export default SessionOngoingScreen;