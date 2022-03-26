import React, { useContext, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Context as CategoryContext } from '../context/CategoryContext';
import Slider from '@react-native-community/slider'
import timeoutApi from '../api/timeout';
import { format } from 'date-fns';

const SessionEvalScreen = ({ navigation: { navigate } }) => {
    const { state: s, setProdRating } = useContext(CategoryContext)
    const [prodRatingNum, setProdRatingNum] = useState(50)

    // PUTTING THIS HERE TEMPORARILY ...
    const saveSession = async () => {
        try {
            const response = await timeoutApi.post('/save_session', s)
            console.log("Session save successful!")
            navigate('SessionSelect');
        } catch (err) {
            console.log("Problem adding session", err)
        }
    }

    return (
        <View>
            <Text>Congrats!</Text>
            <Text>You've finished!</Text>
            <Text>Now be honest..</Text>
            <Text>How productive were you?</Text>
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
                        console.log("sliding started")
                    }}
                    onSlidingComplete={() => {
                        setProdRating(Math.round(prodRatingNum))
                        console.log("sliding completed")
                    }}
                    onValueChange={setProdRatingNum}
                />
            </View>



            <Text>You just completed category:</Text>
            <Text>{s.chosenCategory}</Text>
            <Text>Your activity was {s.customActivity}</Text>
            <Text>starting at {format(s.sessionStartTime, 'M-dd-yyyy')}
                and ending at {format(s.sessionEndTime, 'M-dd-yyyy')}, for a duration of
            </Text>
            <Text>End early flag is {s.endEarlyFlag.toString()}</Text>

            <TouchableOpacity
                style={styles.buttonStyle}
                onPress={() => saveSession()}>
                <Text style={styles.buttonTextStyle}>Finish</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        margin: 30,
        fontSize: 40,
    },
    slider: {
        width: 300,
        height: 40,
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