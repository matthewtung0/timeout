import React, { useEffect, useState, useRef, useContext } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Button } from 'react-native-elements';
import {
    fromUnixTime, getUnixTime, isThisSecond, format,
    differenceInMilliseconds, addSeconds
} from 'date-fns';
import { Context as CategoryContext } from '../context/CategoryContext';
const constants = require('../components/constants.json')

const SessionOngoingScreen = ({ navigation: { navigate }, route: { params } }) => {
    const { numMins, categoryId, categoryName } = params;

    const [min, setMin] = useState(numMins);
    const [sec, setSec] = useState(0);

    const [secLeft, setSecLeft] = useState(numMins * 60);
    let endThis = false;
    const { state: categoryState, setEndTime, setStartTime } = useContext(CategoryContext)
    const increment = useRef(null);

    let now_dt = getUnixTime(new Date())
    let endTime = getUnixTime(addSeconds(fromUnixTime(now_dt), numMins * 60 + 1))
    //let bgColorHex = constants.colors[bgColor]

    const handleStart = () => {
        increment.current = setInterval(() => {
            let dt = new Date();
            var diff = differenceInMilliseconds(fromUnixTime(endTime), dt)
            if (diff < 0) {
                handleReset(false)
                navigate('SessionEval')
            }
            //console.log("difference in sec:", diff / 1000)
            setSecLeft(Math.floor(diff / 1000));
        }, 100)
    }

    const handleReset = (endEarly = false) => {
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
        setStartTime(fromUnixTime(now_dt))
        if (isThisSecond(fromUnixTime(endTime))) {
            handleReset()
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

            <Text style={styles.time}>{Math.floor(secLeft / 60) + ":" + secLeft % 60}</Text>
            <Text >{"Category id is " + categoryId}</Text>
            <Text >{"Category name is " + categoryName}</Text>

            {/*<View style={[styles.category, { backgroundColor: bgColorHex }]}>
                <Text style={styles.text} >{catName}</Text>
    </View>*/}

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
        margin: 10,
        fontSize: 25,
    },
    time: {
        fontSize: 40
    }
})

export default SessionOngoingScreen;