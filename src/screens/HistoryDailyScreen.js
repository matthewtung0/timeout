import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, FlatList } from 'react-native';
import { compareAsc, eachDayOfInterval, format, subDays, addDays } from 'date-fns';
import DateList from '../components/DateList';
import CalendarComponent from '../components/CalendarComponent';

const today_date = () => {

    let date = format(new Date(), 'M-dd-yyyy z')

    return date;
}

const default_interval = () => {
    let interval = 20;
    //let startDate = format(subDays(new Date(), interval), 'M-dd-yyyy')
    //let endDate = format(addDays(new Date(), interval), 'M-dd-yyyy')

    let startDate = subDays(new Date(), interval)
    let endDate = addDays(new Date(), interval)
    let date_interval = eachDayOfInterval({ start: startDate, end: endDate })
    return date_interval
}

const HistoryDailyScreen = () => {
    const [displayed_dt, setDisplayedDt] = useState(today_date());
    const [testSession, setTestSession] = useState('uninitiated');

    const updateTestSession = (a) => {
        setTestSession(a);
    }

    // cut views
    /*<DateList
                dates_to_display={default_interval()}
                updateCallback={updateTestSession}>
            </DateList>*/

    return (
        <View>
            <Text style={styles.title}>History Daily Screen</Text>


            <CalendarComponent updateCallback={updateTestSession} />
            <Text style={styles.temp}>{testSession + " sample text"}</Text>
        </View>
    )
}

HistoryDailyScreen.navigationOptions = () => {
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

export default HistoryDailyScreen;