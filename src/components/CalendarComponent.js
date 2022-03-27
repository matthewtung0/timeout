import React, { useRef, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Calendar, CalendarList } from 'react-native-calendars';
import { subMonths, addMonths, parseISO, format, startOfMonth, endOfMonth } from 'date-fns'
import timeoutApi from '../api/timeout';

const CalendarComponent = ({ curDate, updateCallback, updateMonth, setMonthlyCallback }) => {
    const { height, width } = Dimensions.get('window');

    const [curMonth, setCurMonth] = useState(format(new Date(), 'yyyy-MM-dd'))

    return (
        <View>
            <View style={{ flex: 1 }}>
                <Calendar
                    current={curDate}
                    onDayPress={day => {
                        updateCallback(day);
                    }}
                    onMonthChange={month => {
                        console.log('month changed', month);
                        setCurMonth(month.dateString)
                        updateMonth(month);
                    }}
                    theme={{
                        textDayFontSize: 15,
                        textMonthFontSize: 15,
                        textDayHeaderFontSize: 15,

                    }}>

                </Calendar>

                <TouchableOpacity
                    style={styles.monthTouch}
                    onPress={() => { setMonthlyCallback(curMonth) }} />

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