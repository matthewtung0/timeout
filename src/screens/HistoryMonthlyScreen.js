import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, FlatList } from 'react-native';
import { compareAsc, eachDayOfInterval, format, subDays, addDays } from 'date-fns';

const HistoryMonthlyScreen = () => {

    return (
        <View>
            <Text style={styles.title}>History Monthly Screen</Text>
        </View>
    )
}

HistoryMonthlyScreen.navigationOptions = () => {
    return {
        headerShown: true,
    };
}

const styles = StyleSheet.create({
    title: {
        margin: 20,
        fontSize: 30,
    },
    temp: {
        margin: 20,
        fontSize: 15,
    }
})

export default HistoryMonthlyScreen;