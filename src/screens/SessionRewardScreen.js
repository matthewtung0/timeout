import React, { useContext, useState, useCallback } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Switch } from 'react-native';
import { Context as CategoryContext } from '../context/CategoryContext';
import { Context as UserContext } from '../context/userContext';
import timeoutApi from '../api/timeout';
import { useFocusEffect } from '@react-navigation/native';

const SessionRewardScreen = ({ navigation: { navigate }, route: { params } }) => {
    const { sessionObjEval } = params;
    console.log("This object made it here", sessionObjEval);
    let energyBase = 100;

    const saveSession = async () => { }

    const checkTodoMatch = () => { }

    // functions to add or remove from todo list if necessary
    const deleteItem = async () => {
        await deleteTodoItem(existingId)
    }

    const addItem = async () => {
        await addTodoItem(s.customActivity, new Date(), s.chosenCatId)
    }

    const offBoard = () => {
        navigate('SessionSelect')
    }



    return (
        <View style={styles.container}>
            <Text>Session Reward Screen</Text>
            <Text style={styles.text}>You have earned {energyBase.toString()} energy!</Text>



            <View>
                <TouchableOpacity
                    style={styles.buttonStyle}
                    onPress={() => {
                        //saveSession()
                    }
                    }>
                    <Text style={styles.buttonTextStyle}>Ok</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 70,
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
    },
    text: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#67806D'
    },
    buttonStyle: {
        backgroundColor: '#FCC859',
        width: 150,
        height: 40,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10
    },
    buttonTextStyle: {
        color: '#F6F2DF',
        fontSize: 18,
        fontWeight: 'bold'

    },
})

export default SessionRewardScreen;