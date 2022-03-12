import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

const SessionEvalScreen = () => {

    return (
        <View>
            <Text style={styles.title}>Session Eval Screen</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        margin:30,
        fontSize:40,
    }
})

export default SessionEvalScreen;