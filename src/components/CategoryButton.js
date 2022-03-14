import React, { useRef, useState, Component } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');


const CategoryButton = ({ catName, bgColor }) => {
    return (

        <View style={[styles.square, { backgroundColor: bgColor }]}>
            <Text style={styles.text} >{catName}</Text>
        </View>
    )

}

const styles = StyleSheet.create({
    square: {
        width: width / 3.3,
        height: width / 3.3,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    text: {
        color: 'white',
        fontSize: 20,
    }

})

export default CategoryButton;