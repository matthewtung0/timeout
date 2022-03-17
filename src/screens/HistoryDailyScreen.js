import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, FlatList, Dimensions, Button } from 'react-native';
import { compareAsc, eachDayOfInterval, format, subDays, addDays } from 'date-fns';
import DateList from '../components/DateList';
import CalendarComponent from '../components/CalendarComponent';
import PastActivityCard from '../components/PastActivityCard';

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

const HistoryDailyScreen = ({ navigation }) => {
    const { height, width } = Dimensions.get('window');
    const [displayed_dt, setDisplayedDt] = useState(today_date());
    const [testSession, setTestSession] = useState('uninitiated');
    const [testMonth, setTestMonth] = useState('uninitiated month')

    const updateTestSession = (a) => {
        setTestSession(a);
    }

    const updateTestMonth = (a) => {
        setTestMonth(a);
    }

    // cut views
    /*<DateList
                dates_to_display={default_interval()}
                updateCallback={updateTestSession}>
            </DateList>*/

    return (
        <View style={styles.viewContainer}>
            <View>
                <Text>asdf</Text>
            </View>
            <ScrollView>
                <View style={styles.cal}>
                    <CalendarComponent
                        updateCallback={updateTestSession}
                        updateMonth={updateTestMonth} />
                </View>
                <Text style={styles.temp}>{testSession + " samplsse text"}</Text>
                <Text style={styles.temp}>{testMonth + " cur month"}</Text>
                <PastActivityCard />
                <PastActivityCard />
                <PastActivityCard />
                <PastActivityCard />
                <PastActivityCard />
                <PastActivityCard />

                <Button title="asdfadsfsd"></Button>
            </ScrollView>

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
    },
    cal: {
        marginHorizontal: 20,
        marginBottom: 5,
    },
    viewContainer: {
        flexDirection: 'column',
        flex: 1
    },
})

export default HistoryDailyScreen;