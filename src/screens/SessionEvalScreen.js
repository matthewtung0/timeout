import React, { useContext } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Context as CategoryContext } from '../context/CategoryContext';

const SessionEvalScreen = () => {
    const { state: s } = useContext(CategoryContext)

    console.log("category context is,", s);

    return (
        <View>
            <Text style={styles.title}>Session Eval Screen</Text>
            <Text>Congrats!</Text>
            <Text>You've finished!</Text>
            <Text>Now be honest..</Text>
            <Text>How productive were you?</Text>


            <Text>You just completed category:</Text>
            <Text>{s.chosenCategory}</Text>
            <Text>Your activity was {s.customActivity}</Text>
            <Text>starting at {s.sessionStartTime} and ending at {s.sessionEndTime}, for a duration of
            </Text>
            <Text>End early flag is {s.endEarlyFlag.toString()}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        margin: 30,
        fontSize: 40,
    }
})

export default SessionEvalScreen;