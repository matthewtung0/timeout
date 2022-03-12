import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

const SessionOngoingScreen = () => {

    return (
        <View>
            <Text style={styles.title}>Session Ongoing Screen</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        margin:30,
        fontSize:40,
    }
})

export default SessionOngoingScreen;