import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider'
import { useFocusEffect } from '@react-navigation/native';

const SessionEvalScreen = ({ navigation: { navigate }, route: { params } }) => {
    const { sessionObj, sessionEndTime, endEarlyFlag } = params;
    const [sessionObjEval, setSessionObjEval] = useState({
        ...sessionObj,
        sessionEndTime: sessionEndTime,
        endEarlyFlag: endEarlyFlag
    })
    const [prodRatingNum, setProdRatingNum] = useState(50)

    return (
        <View style={styles.container}>

            <View style={{ flex: 2 }} />
            <View style={{ flex: 1 }}>
                <Text style={styles.text}>Congratulations for finishing!</Text>
            </View>
            <View style={{ flex: 1 }}>
                <Text style={styles.text}>Now be honest..</Text>
            </View>

            <View style={{ flex: 1 }}>
                <Text style={styles.text}>How productive were you?</Text>
            </View>


            <View style={{ flex: 2 }}>
                <Text>{prodRatingNum}</Text>
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
                            setSessionObjEval({ ...sessionObjEval, prodRating: Math.round(prodRatingNum) })
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
                        navigate('SessionReward', { sessionObjEval })
                    }
                    }>
                    <Text style={styles.buttonTextStyle}>Ok</Text>
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
        fontWeight: 'bold',
        fontSize: 18,
        color: '#67806D'
    },
    buttonStyle: {
        backgroundColor: '#FCC859',
        width: 150,
        height: 40,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10
    },
    buttonTextStyle: {
        color: '#F6F2DF',
        fontSize: 18,
        fontWeight: 'bold'

    },
})

export default SessionEvalScreen;