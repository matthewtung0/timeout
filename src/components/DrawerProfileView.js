import React, { useState, useCallback, useContext } from 'react';
import { View, StyleSheet, Text, Dimensions, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Context as UserContext } from '../context/userContext';
import { defaultPfp } from './Images.js'
const { height, width } = Dimensions.get('window');
const PFP_SIZE = height / 7;

const DrawerProfileView = ({ friends, username, totalTasks, totalTime, userId }) => {
    const [h, setH] = useState(0)
    const [m, setM] = useState(0)
    const [s, setS] = useState(0)
    var { hours, minutes, seconds } = totalTime
    const { state: userState, fetchAvatarGeneral } = useContext(UserContext)

    useFocusEffect(
        useCallback(() => {
            fetchAvatarGeneral(userId, forceRetrieve = true, isSelf = true, isThumbnail = false)
            console.log("Drawer updating:")
            if (hours) { setH(hours) }
            if (minutes) { setM(minutes) }
            if (seconds) { setS(seconds) }
        }, [hours, minutes, seconds])
    )
    return (
        <View style={styles.outerContainer}>
            <View>
                {userState.base64pfp == 'default' || userState.base64pfp == '' ?
                    <Image
                        style={[styles.default, {
                            borderRadius: PFP_SIZE / 2,
                            height: PFP_SIZE,
                            width: PFP_SIZE,
                        }]}
                        source={defaultPfp} /> :
                    <Image
                        style={[styles.default, {
                            borderRadius: PFP_SIZE / 2,
                            height: PFP_SIZE,
                            width: PFP_SIZE,
                        }]}
                        source={{ uri: userState.base64pfp }} />
                }

            </View>
            <Text style={[styles.textDefaultBold, styles.username]}>{username}</Text>
            <Text style={[styles.textDefault, styles.text]}>{h}h {m}m {s}s</Text>
            <Text style={[styles.textDefault, styles.text]}>{totalTasks} tasks completed</Text>
            <Text style={[styles.textDefault, styles.text, { marginBottom: 20, }]}>{friends.length} Friends</Text>
        </View>

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