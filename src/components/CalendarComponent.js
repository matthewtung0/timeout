import React, { useRef, useState } from 'react';
import { View, StyleSheet, Text, Button, ScrollView } from 'react-native';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';

const CalendarComponent = ({ updateCallback }) => {

    return (
        <View>

            <Calendar
                onDayPress={day => {
                    updateCallback(JSON.stringify(day));
                    console.log('selected day', day);
                }}>

            </Calendar>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        margin: 30,
        fontSize: 25,
    },
})

export default CalendarComponent;