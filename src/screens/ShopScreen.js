import React, { useContext, useState, useCallback } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Switch } from 'react-native';
import { Context as CategoryContext } from '../context/CategoryContext';
import { Context as UserContext } from '../context/userContext';
import timeoutApi from '../api/timeout';
import { useFocusEffect } from '@react-navigation/native';

const ShopScreen = ({ navigation: { navigate }, route: { params } }) => {
    const { } = params;

    useFocusEffect(
        useCallback(() => {
            checkTodoMatch()
        }, [])
    )
    return (
        <View style={styles.container}>
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

})

export default ShopScreen;