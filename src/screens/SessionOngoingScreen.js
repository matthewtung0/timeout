import React, { useEffect, useState, useRef, useContext } from 'react';
import { View, StyleSheet, Text, Dimensions, TouchableOpacity, Alert } from 'react-native';
import {
    fromUnixTime, getUnixTime, isThisSecond, format,
    differenceInMilliseconds, addSeconds
} from 'date-fns';
import { Context as CategoryContext } from '../context/CategoryContext';
const constants = require('../components/constants.json')

const SessionOngoingScreen = ({ navigation: { navigate }, route: { params } }) => {
    const { height, width } = Dimensions.get('window');
    const { numMins, categoryId, categoryName, activityName, colorId } = params;
    let bgColorHex = constants.colors[colorId]

    const [min, setMin] = useState(numMins);
    const [sec, setSec] = useState(0);

    const [formattedTime, setFormattedTime] = useState('00:00');

    const [secLeft, setSecLeft] = useState(numMins * 60);
    let endThis = false;
    const { state: categoryState, setEndTime, setStartTime } = useContext(CategoryContext)
    const increment = useRef(null);



    let now_dt = getUnixTime(new Date())
    let endTime = getUnixTime(addSeconds(fromUnixTime(now_dt), numMins * 60 + 1))
    //let bgColorHex = constants.colors[bgColor]

    const [sessionObj, setSessionObj] = useState({
        chosenCategory: categoryName,
        chosenCatId: categoryId,
        customActivity: activityName,
        sessionStartTime: '',
        //sessionEndTime: '',
        //endEarlyFlag: '',
        prodRating: '',
    })

    const handleStart = () => {
        increment.current = setInterval(() => {
            let dt = new Date();
            var diff = differenceInMilliseconds(fromUnixTime(endTime), dt)
            if (diff < 0) {
                handleReset(false)
            }
            //console.log("difference in sec:", diff / 1000)
            setSecLeft(Math.floor(diff / 1000));
        }, 100)
    }

    const handleReset = (endEarly = false) => {
        clearInterval(increment.current)

        if (endEarly) {
            let now_dt = getUnixTime(new Date())
            navigate('SessionEval', { sessionObj, sessionEndTime: fromUnixTime(now_dt), endEarlyFlag: true })
            //setEndTime(fromUnixTime(now_dt), true)
        } else {
            navigate('SessionEval', { sessionObj, sessionEndTime: fromUnixTime(endTime), endEarlyFlag: false })
            //setEndTime(fromUnixTime(endTime), false)
        }
        alert('Time end')
    }

    useEffect(() => {
        //setStartTime(fromUnixTime(now_dt))
        setSessionObj({ ...sessionObj, sessionStartTime: fromUnixTime(now_dt) })

        if (isThisSecond(fromUnixTime(endTime))) {
            handleReset()
        }

        // temporary comment this out to work on it
        handleStart();

    }, [])

    // useEffect second try
    /*useEffect(() => {
        console.log("useEffect activiated and endThis is " + endThis)
        if (endThis || isThisSecond(fromUnixTime(endTime))) {
            if (timerId) {
                clearInterval(timerId)
            }
            alert('Time end')
            return
        }


        const timerId = setInterval(
            () => {
                let dt = new Date();
                setTime(getUnixTime(dt));
                setSecLeft(differenceInSeconds(fromUnixTime(endTime), dt));
            }, 1000)
        return () => {
            clearInterval(timerId);
        }
    }, [time])*/

    // useEffect first try
    /*useEffect(() => {
        if (min <= 0 && sec <= 0) {
            if (timerId) {
                clearInterval(timerId)
            }
            alert('Time end')
            return
        }
        console.log("useEffect activated")
        const timerId = setInterval(
            () => {
                if (sec > 0) {
                    setSec(s => s - 1)
                } else {
                    setSec(59)
                    setMin(m => m - 1)
                }
            },
            1000)

        return () => {
            clearInterval(timerId)
        }

    }, [min, sec])*/

    const twoDigits = (num) => {
        return ("0" + num).slice(-2)
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
                        handleReset(true)
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
                    text: "Add 5 minutes", onPress: () => {
                        console.log("add 5 min")
                    }
                }
            ]
        );
    }

    return (
        <View style={styles.container}>

            <Text style={styles.timeLeft}>Time Left</Text>
            <Text style={styles.time}>{twoDigits(Math.floor(secLeft / 60)) + ":" + twoDigits(secLeft % 60)}</Text>

            <View style={[styles.gotThisContainer, { width: width / 1.5, height: height / 10 }]}>
                <Text style={styles.gotThis}>You got this!</Text>
            </View>

            <View style={{ height: 70 }}>

                <View style={styles.activityContainer}>
                    <Text style={styles.activityName}>{activityName}</Text>
                    <View style={[styles.categoryStyle, { backgroundColor: bgColorHex, width: width / 3 }]}>
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
        fontSize: 18,
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
            width: 1,
            height: 1,
        },
        shadowOpacity: 0.7,
    },
    buttonText: {
        fontWeight: 'bold',
        color: 'white',
        fontSize: 13,
    },
})

export default SessionOngoingScreen;