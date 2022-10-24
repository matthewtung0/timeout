import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
const constants = require('../components/constants.json')

// simple header component containing back button to the mainflow
const Header = ({ navigation }) => {
    return (
        <TouchableOpacity
            style={styles.backButton}
            onPress={() => { navigation.navigate('mainFlow') }}>
            <Icon
                name='arrow-back-outline'
                type='ionicon'
                size={35}
                color='black' />
        </TouchableOpacity>

    )
}

const styles = StyleSheet.create({
    backButton: {
        position: 'absolute',
        width: 50, height: 50,
        marginTop: 50,
        marginLeft: 5,
    },

})

export default Header;