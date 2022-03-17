import React, { useRef, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Calendar, CalendarList } from 'react-native-calendars';

const CalendarComponent = ({ updateCallback, updateMonth }) => {
    const { height, width } = Dimensions.get('window');

    let selectedMonth = ""
    return (
        <View>
            <View style={{ flex: 1 }}>
                <Calendar

                    onDayPress={day => {
                        updateCallback(JSON.stringify(day));
                        selectedMonth = day.month;
                        updateMonth(selectedMonth);
                        console.log('selected day', day);
                    }}
                    onMonthChange={month => {
                        console.log('month changed', month);
                        selectedMonth = month.month;
                        updateMonth(selectedMonth);
                    }}
                    theme={{
                        textDayFontSize: 15,
                        textMonthFontSize: 15,
                        textDayHeaderFontSize: 15,

                    }}>

                </Calendar>

                <TouchableOpacity
                    style={styles.monthTouch}
                    onPress={month => {
                        updateMonth(month)
                    }} />

            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        margin: 30,
        fontSize: 25,
    },
    monthTouch: {
        borderColor: 'pink',
        borderWidth: 1,
        width: 160,
        height: 50,
        position: 'absolute',
        top: 0,
        alignSelf: 'center'
    },
    monthContainer: {
        backgroundColor: 'red',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '50%',
    },
})

export default CalendarComponent;