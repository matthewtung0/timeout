import React, { useRef, useState, useCallback } from 'react';
import { View, StyleSheet, Text, Dimensions, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { useFocusEffect } from '@react-navigation/native';

const DrawerProfileView = ({ friends, username, totalTasks, totalTime }) => {
    const [h, setH] = useState(0)
    const [m, setM] = useState(0)
    const [s, setS] = useState(0)
    var { hours, minutes, seconds } = totalTime

    useFocusEffect(
        useCallback(() => {
            if (hours) { setH(hours) }
            if (minutes) { setM(minutes) }
            if (seconds) { setS(seconds) }
        }, [hours, minutes, seconds])
    )
    return (
        <View style={styles.outerContainer}>
            <View style={styles.pfp}>

            </View>
            <Text style={styles.username}>{username}</Text>
            <Text style={styles.text}>{h}h {m}m {s}s</Text>
            <Text style={styles.text}>{totalTasks} tasks completed</Text>
            <Text style={[styles.text, { marginBottom: 20, }]}>{friends.length} Friends</Text>
        </View>

    )
}

const styles = StyleSheet.create({
    outerContainer: {
        backgroundColor: '#67806D',
        alignItems: 'center',
    },
    pfp: {
        backgroundColor: '#C3E6E7',
        height: 80,
        width: 80,
        borderRadius: 100,
        borderColor: 'white',
        borderWidth: 3,
        marginVertical: 15,
    },
    username: {
        fontWeight: 'bold',
        fontSize: 18,
        color: 'white',
        marginBottom: 5,
    },
    text: {
        color: 'white',
    }
})

export default DrawerProfileView;