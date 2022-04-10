import React, { useRef, useState, Component } from 'react';
import { View, StyleSheet, Text, Dimensions, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';

const DrawerProfileView = ({ friends, username }) => {
    return (
        <View style={styles.outerContainer}>
            <View style={styles.pfp}>

            </View>
            <Text style={styles.username}>{username}</Text>
            <Text style={styles.text}>_ _ _H _ _M</Text>
            <Text style={styles.text}># tasks completed</Text>
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