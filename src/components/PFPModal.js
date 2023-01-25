import React, { useState, useContext } from 'react';
import {
    View, StyleSheet, Text, TouchableOpacity, FlatList, Dimensions, Image,
    Keyboard, TouchableWithoutFeedback, TextInput, Switch, ActivityIndicator,
} from 'react-native';
import { Icon } from 'react-native-elements'
import { Context as CategoryContext } from '../context/CategoryContext';
import { Context as UserContext } from '../context/userContext'
import AvatarComponent from '../components/AvatarComponent';
const constants = require('../components/constants.json')
const img = require('../../assets/tasks_topbar.png')

const PFPModal = ({ toggleFunction, colorArr, idToView }) => {
    const { height, width } = Dimensions.get('window');
    const INPUT_WIDTH = width * 0.8
    console.log("ID to view: ", idToView)
    return (
        <View style={[styles.container, { width: width * 0.9, alignSelf: 'center', }]}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9EAD3' }}>
                <AvatarComponent w={INPUT_WIDTH}
                    modalView={true}
                    id={idToView} />
            </View>


            <View style={styles.backContainer}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={toggleFunction}>

                    <Icon
                        name="close-outline"
                        type='ionicon'
                        size={35}
                        color='black' />
                    {/*<Text style={styles.backButtonText}>X</Text>*/}
                </TouchableOpacity>
            </View>

        </View >
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    parentContainer: {
        flex: 1,
        justifyContent: 'space-around',
        backgroundColor: '#F9EAD3'
    },
    labelText: { marginLeft: 5, color: 'gray', },
    colorSquare: {
        width: 50,
        height: 50,
        marginHorizontal: 5,
        marginTop: 5,
        marginBottom: 15,
    },
    title: {
        alignSelf: 'center',
        margin: 20,
        marginBottom: 50,
        fontSize: 25,
        fontWeight: 'bold',
        color: 'white',
    },
    backButton: {
        width: 50,
        height: 50,
        justifyContent: 'center',
    },
    backButtonText: {
        alignSelf: 'center',
        fontWeight: 'bold',
        fontSize: 25,
        color: 'white',

    },
    backContainer: {
        flex: 1,
        width: '50%',
        position: 'absolute',
        alignSelf: 'flex-end',
        justifyContent: 'flex-end',
        alignItems: 'flex-end'
    },
    dummy: {
        flex: 0.03,
    },
    goBackChild: {
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center',
    },
    submit: {
        backgroundColor: '#FCC859',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        alignSelf: 'center',
        marginBottom: 40,
        marginTop: 30,
        shadowOffset: {
            width: 0.05,
            height: 0.05,
        },
        shadowOpacity: 0.3,
    },
    submitText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        padding: 10,
    },
    inputStyleContainer: {
        borderBottomWidth: 0,
    },
    inputStyle: {
        marginTop: 5,
        backgroundColor: 'white',
        borderRadius: 15,
        paddingHorizontal: 10,
        alignSelf: 'center',
        marginBottom: 20,
        color: 'gray',
        fontSize: 18,
        fontWeight: '600',
    },
})

export default PFPModal;