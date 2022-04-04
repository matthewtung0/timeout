import React, { useRef, useState, Component } from 'react';
import { View, StyleSheet, Text, Dimensions, TouchableOpacity } from 'react-native';
const constants = require('../components/constants.json')

const { height, width } = Dimensions.get('window');


const ToDoComponent = ({ itemName, category, timeCreated, color, callback }) => {
    let bgColorHex = constants.colors[color]
    return (
        <View style={styles.outerContainer}>
            <View style={styles.container}>
                <View style={styles.dummy} />

                <TouchableOpacity
                    style={styles.toDoComponent}
                    onPress={() => { }}>
                    <Text style={styles.text}>{itemName}</Text>
                </TouchableOpacity>

                <View style={styles.categoryContainer}>
                    <View style={[styles.categoryStyle, { backgroundColor: bgColorHex }]}>
                        <Text style={[styles.categoryText]}>{category}</Text>
                    </View>
                </View>
            </View>
        </View>

    )
}

const styles = StyleSheet.create({
    text: {
        color: '#67806D',
        fontSize: 18,
    },
    categoryText: {
        color: '#67806D',
        fontSize: 14,
    },
    outerContainer: {
        width: '100%',
        height: 80,
        marginVertical: 5,
    },
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    dummy: {
        flex: 0.35,
    },
    toDoComponent: {
        justifyContent: 'center',
        flex: 1,
        backgroundColor: '#F6F2DF',
        padding: 15,
        borderRadius: 10,
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.3,

    },
    categoryContainer: {
        flex: 1,
        width: '100%',
        position: 'absolute',
        //borderWidth: 1,
        //borderColor: 'black',
    },
    categoryStyle: {
        flex: 1,
        alignSelf: 'flex-end',
        borderRadius: 5,
        padding: 7,
        marginRight: 12,
    },
    touchStyle: {
        backgroundColor: 'yellow',
    }

})

export default ToDoComponent;