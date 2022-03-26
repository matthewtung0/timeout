import React, { useEffect, useState, useRef, useContext } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Button } from 'react-native-elements';
import { addMinutes, fromUnixTime, getUnixTime, isThisSecond, format, differenceInSeconds } from 'date-fns';
import { Context as CategoryContext } from '../context/CategoryContext';

const SessionOngoingScreen = ({ navigation: { navigate }, route: { params } }) => {
    const { numMins, categoryId, categoryName, startTime } = params;
    console.log(numMins);
    console.log(categoryId);
    console.log(categoryName);
    console.log(startTime);
    /*let numMins = navigation.getParam('timerTime')
    let categoryId = navigation.getParam('buttonId')
    let categoryName = navigation.getParam('buttonName')
    let startTime = navigation.getParam('startTime')*/
    let endTime = getUnixTime(addMinutes(fromUnixTime(startTime), numMins)) // add 10 min to start time, return in Unix

    const [min, setMin] = useState(numMins);
    const [sec, setSec] = useState(0);

    const [time, setTime] = useState(startTime);
    const [secLeft, setSecLeft] = useState(numMins * 60);
    let endThis = false;
    const { state: categoryState, setEndTime } = useContext(CategoryContext)
    const increment = useRef(null);


    const handleStart = () => {
        console.log("handling start")
        increment.current = setInterval(() => {
            console.log("interval running");
            let dt = new Date();
            setTime(getUnixTime(dt));
            setSecLeft(differenceInSeconds(fromUnixTime(endTime), dt));
        }, 1000)
    }

    const handleReset = (endEarly) => {
        clearInterval(increment.current)

        if (endEarly) {
            let now_dt = getUnixTime(new Date())
            setEndTime(fromUnixTime(now_dt), true)
        } else {
            setEndTime(fromUnixTime(endTime), false)
        }
        alert('Time end')
    }


    useEffect(() => {
        console.log("useeffect running");
        if (isThisSecond(fromUnixTime(endTime))) {
            handleReset(false)
        }
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

    return (
        <View>
            <Text style={styles.title}>Session Ongoing Screen</Text>

            <Text style={styles.time}>{min + ":" + sec}</Text>
            <Text >{"Category id is " + categoryId}</Text>
            <Text >{"Category name is " + categoryName}</Text>
            <Text>{"Start time is " + format(fromUnixTime(startTime), 'M-dd-yyyy z')}</Text>
            <Text>{"End time is " + format(fromUnixTime(endTime), 'M-dd-yyyy z')}</Text>
            <Text>{"time is " + secLeft}</Text>

            <Button title="End Early"
                onPress={() => {
                    handleReset(true)
                    navigate('SessionEval')
                }}
            ></Button>
            <Text>You've got this!</Text>
        </View>
    )
}

SessionOngoingScreen.navigationOptions = () => { return { headerShown: false, }; }

const styles = StyleSheet.create({
    title: {
        margin: 30,
        fontSize: 40,
    },
    time: {
        fontSize: 40
    }
})

export default SessionOngoingScreen;