import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AvatarComponent from './AvatarComponent';
const { height } = Dimensions.get('window');
const PFP_SIZE = height / 7;

const DrawerProfileView = ({ friends, username, totalTasks, totalTime, userId }) => {
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
        <View style={[styles.outerContainer]}>
            <View style={[{
                height: PFP_SIZE, width: PFP_SIZE, marginTop: 15,
                marginBottom: 10,
            }]}>
                <AvatarComponent
                    w={PFP_SIZE}
                    id={userId}
                    isMe={true}
                />
            </View>
            <Text style={[styles.textDefaultBold, styles.username]}>{username}</Text>
            <Text style={[styles.textDefault, styles.text]}>{h}h {m}m {s}s</Text>
            <Text style={[styles.textDefault, styles.text]}>{totalTasks} tasks completed</Text>
            <Text style={[styles.textDefault, styles.text, { marginBottom: 20, }]}>{friends.length} Friends</Text>
        </View >

    )
}

const styles = StyleSheet.create({
    textDefaultBold: {
        fontFamily: 'Inter-Bold',
    },
    textDefaultSemiBold: {
        fontFamily: 'Inter-SemiBold',
    },
    textDefault: {
        fontFamily: 'Inter-Regular',
    },
    outerContainer: {
        backgroundColor: '#67806D',
        alignItems: 'center',
    },
    default: {
        marginTop: 15,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: 'white',
    },
    username: {
        fontSize: 18,
        color: 'white',
        marginBottom: 5,
    },
    text: {
        color: 'white',
        marginBottom: 2,
    }
})

export default DrawerProfileView;