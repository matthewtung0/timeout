import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider'
import { useFocusEffect } from '@react-navigation/native';
import { fromUnixTime } from 'date-fns';

const SessionEvalScreen = ({ navigation: { navigate }, route: { params } }) => {
    const { sessionObj, sessionEndTime, sessionStartTime, endEarlyFlag, plannedMin } = params;
    const [sessionObjEval, setSessionObjEval] = useState({
        ...sessionObj,
        //sessionEndTime: sessionEndTime,
        endEarlyFlag: endEarlyFlag,
        plannedMin: plannedMin,
        prodRating: 50, // 50 if user doesn't pick productivity


        //sessionStartTime: fromUnixTime(sessionObj.sessionStartTime),
        //sessionEndTime: fromUnixTime(sessionEndTime)
    })
    console.log(sessionObjEval)
    console.log("planned min:", plannedMin)
    console.log("End time:", sessionEndTime)
    const [prodRatingNum, setProdRatingNum] = useState(50)

    return (
        <View style={styles.container}>

            <View style={{ flex: 0.3 }} />
            <View style={{ flex: 3 }}>
                <Text style={styles.text}>Congratulations for finishing!</Text>
            </View>
            <View style={{ flex: 1 }}>
                <Text style={[styles.text, { fontSize: 27, }]}>Now be honest..</Text>
            </View>

            <View style={{ flex: 2 }}>
                <Text style={[styles.text, { fontSize: 35, }]}>How productive were you?</Text>
            </View>


            <View style={{ flex: 1.7 }}>
                <Text>{Math.round(prodRatingNum)}</Text>
                <View style={{ alignItems: 'center' }}>
                    <Slider
                        style={styles.slider}
                        minimumValue={0}
                        maximumValue={100}
                        minimumTrackTintColor="#90AB72"
                        maximumTrackTintColor="#F5BBAE"
                        value={50}
                        onSlidingStart={() => {
                        }}
                        onSlidingComplete={() => {
                            setSessionObjEval({
                                ...sessionObjEval, prodRating: Math.round(prodRatingNum),
                            })
                            //setProdRating(Math.round(prodRatingNum))
                        }}
                        onValueChange={setProdRatingNum}
                    />
                </View>
            </View>

            <View style={{ flex: 1 }}>
                <TouchableOpacity
                    style={styles.buttonStyle}
                    onPress={() => {
                        //saveSession()
                        navigate('SessionReward', {
                            sessionObjEval,
                            sessionStartTime: sessionStartTime,
                            sessionEndTime: sessionEndTime
                        })
                    }
                    }>
                    <Text style={styles.buttonTextStyle}>Continue</Text>
                </TouchableOpacity>
            </View>

            <View style={{ flex: 2 }} />

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 70,
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
    },
    slider: {
        width: 300,
        height: 40,
    },
    text: {
        fontWeight: '500',
        fontSize: 40,
        color: '#67806D',
        alignSelf: 'center',
        textAlign: 'center',
    },
    buttonStyle: {
        backgroundColor: '#FCC859',
        width: 150,
        height: 40,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        shadowOffset: {
            width: 0.1,
            height: 0.1,
        },
        shadowOpacity: 0.2,
        color: 'gray',
        fontSize: 18,
    },
    buttonTextStyle: {
        color: '#F6F2DF',
        fontSize: 18,
        fontWeight: 'bold',


    },
})

export default SessionEvalScreen;