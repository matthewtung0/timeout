import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Icon } from 'react-native-elements';
const constants = require('../components/constants.json')

// simple header component containing back button to the mainflow
const Header = ({ navigation, color }) => {
    return (
        <TouchableOpacity
            style={[styles.backButton, { marginTop: Platform.OS === 'ios' ? 50 : 30 }]}
            onPress={() => { navigation.navigate('mainFlow') }}>
            <Icon
                name='arrow-back-outline'
                type='ionicon'
                size={35}
                color={color} />
        </TouchableOpacity>

    )
}

const styles = StyleSheet.create({
    backButton: {
        position: 'absolute',
        width: 50, height: 50,
        marginLeft: 5,
    },
})

export default Header;