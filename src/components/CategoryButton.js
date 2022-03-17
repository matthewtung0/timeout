import React, { useRef, useState, Component } from 'react';
import { View, StyleSheet, Text, Dimensions, TouchableOpacity } from 'react-native';

const { height, width } = Dimensions.get('window');


const CategoryButton = ({ id, catName, bgColor, callback }) => {
    return (

        <TouchableOpacity
            onPress={() => { callback({ buttonName: catName, buttonId: id }) }}>
            <View style={[styles.square, { backgroundColor: bgColor }]}>
                <Text style={styles.text} >{catName}</Text>
            </View>
        </TouchableOpacity>


    )

}

const styles = StyleSheet.create({
    square: {
        width: width / 3.5,
        height: width / 3.5,
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