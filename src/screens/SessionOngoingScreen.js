import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Button } from 'react-native-elements'

const SessionOngoingScreen = ({ navigation }) => {
    let timeLeft = navigation.getParam('time')

    const [min, setMin] = useState(timeLeft);
    const [sec, setSec] = useState(0);

    const [time, setTime] = useState(timeLeft);

    useEffect(() => {
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

    }, [min, sec])

    return (
        <View>
            <Text style={styles.title}>Session Ongoing Screen</Text>

            <Text style={styles.time}>{min + ":" + sec}</Text>

            <Button title="End Early"
                onPress={() => navigation.navigate('SessionEval')}
            ></Button>
            <Text>You've got this!</Text>
        </View>
    )
}

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