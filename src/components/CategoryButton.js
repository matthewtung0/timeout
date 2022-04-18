import React, { useRef, useState, Component } from 'react';
import { View, StyleSheet, Text, Dimensions, TouchableOpacity } from 'react-native';
const constants = require('../components/constants.json')

const { height, width } = Dimensions.get('window');


const CategoryButton = ({ id, catName, colorId, callback }) => {
    let bgColorHex = constants.colors[colorId]
    return (

        <TouchableOpacity
            onPress={() => { callback({ buttonName: catName, buttonId: id, buttonColor: colorId }) }}>
            <View style={[styles.square, { backgroundColor: bgColorHex }]}>
                <Text style={styles.text} >{catName}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    square: {
        width: width / 3.7,
        height: width / 5.5,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        margin: 3,
        padding: 2,
    },
    text: {
        textAlign: 'center',
        alignSelf: 'center',
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    }

})

export default CategoryButton;