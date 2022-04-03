import React, { useRef, useState, Component } from 'react';
import { View, StyleSheet, Text, Dimensions, TouchableOpacity } from 'react-native';
const constants = require('../components/constants.json')

const { height, width } = Dimensions.get('window');


const CategoryButton = ({ id, catName, bgColor, callback }) => {
    let bgColorHex = constants.colors[bgColor]
    return (

        <TouchableOpacity
            onPress={() => { callback({ buttonName: catName, buttonId: id }) }}>
            <View style={[styles.square, { backgroundColor: bgColorHex }]}>
                <Text style={styles.text} >{catName}</Text>
            </View>
        </TouchableOpacity>


    )

}

const styles = StyleSheet.create({
    square: {
        width: width / 3.5,
        height: width / 6.5,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    text: {
        color: 'white',
        fontSize: 17,
        fontWeight: 'bold',
    }

})

export default CategoryButton;