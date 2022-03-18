import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, FlatList, Dimensions, Button } from 'react-native';
import {
    compareAsc, eachDayOfInterval, format, subDays, addDays, endOfDay, startOfDay, parseISO,
    startOfMonth, endOfMonth
} from 'date-fns';
import CalendarComponent from '../components/CalendarComponent';
import PastActivityCard from '../components/PastActivityCard';
import timeoutApi from '../api/timeout';


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



const getDaySession = async (dayObject) => {
    // get list of sessions you did that day
    let date = parseISO(JSON.parse(dayObject).dateString)
    console.log("Getting session for day ", date)
    try {
        let startRange = startOfDay(date)
        let endRange = endOfDay(date)

        console.log("Start range is", startRange)
        console.log("end range is", endRange)

        const response = await timeoutApi.get('/daySessions', { params: { startTime: startRange, endTime: endRange } })
        console.log(response.data);
        return response.data
        //
    } catch (err) {
        console.log("Problem getting day's sessions", err)
    }
}

const getMonthSession = async (dayObject) => {
    //console.log("Getting sessions for month of", dayObject);
    //let date = parseISO(JSON.parse(dayObject).dateString)
    let date = parseISO(dayObject.dateString)

    try {
        let startRange = startOfMonth(date)
        let endRange = endOfMonth(date)
        console.log("Start range is", startRange)

        const response = await timeoutApi.get('/monthSessions', { params: { startTime: startRange, endTime: endRange } })
        console.log(response.data);
        return response.data
        //
    } catch (err) {
        console.log("Problem getting month's sessions", err)
    }
}

const HistoryDailyScreen = ({ navigation }) => {
    const { height, width } = Dimensions.get('window');
    const [displayed_dt, setDisplayedDt] = useState(today_date());
    const [selectedDay, setSelectedDay] = useState('uninitiated');
    const [testMonth, setTestMonth] = useState('uninitiated month')
    const [daySessions, setDaySessions] = useState([])
    const [monthSessions, setMonthSessions] = useState([])
    const [calendarDate, setCalendarDate] = useState(format(new Date(), 'yyyy-MM-dd'))
    const [useMonthly, setUseMonthly] = useState(true);

    const monthStateHandle = async (date) => {
        let res = await getMonthSession(date)
        setMonthSessions(res)

    }

    useEffect(() => {
        //monthStateHandle(new Date())
    }, [])


    const filterOnDay = (dayObject) => {
        let date = parseISO(dayObject.dateString)

        let startTime = startOfDay(date)
        let endTime = endOfDay(date)
        console.log("Start of day is", startTime);

        let daySessions = monthSessions.filter(a => {
            console.log("activity time start is", a.time_start)
            let compare_dt = parseISO(a.time_start)
            //console.log("comparing " + compare_dt + " and " + startTime)
            return (compareAsc(compare_dt, startTime) >= 0 &&
                compareAsc(endTime, compare_dt) > 0)
        })
        setUseMonthly(false)
        console.log("USE MONTHLY IS FALSE FILTERED ON DAY", startTime);
        console.log("day session length", daySessions.length)
        setDaySessions(daySessions);

    }


    const updateSelectedDay = async (a) => {
        setSelectedDay(a);
        let res = await getDaySession(a);
        console.log("RESULT IS", res)
        setDaySessions(res)
    }

    const updateTestMonth = async (a) => {
        console.log("trying to update this month's sessions");
        console.log(a);
        setTestMonth(a);
        let res = await getMonthSession(a);
        setMonthSessions(res)

        let startOfMonthTemp = startOfMonth(parseISO(a.dateString))
        setCalendarDate(format(startOfMonthTemp, 'yyyy-MM-dd'))
    }

    return (
        <View style={styles.viewContainer}>
            <View>
                <Text>asdf</Text>
            </View>

            <FlatList
                horizontal={false}
                data={useMonthly ? monthSessions : daySessions}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(result) => result.activity_id}
                renderItem={({ item }) => {
                    return (
                        <PastActivityCard session={item} />
                    )
                }}

                ListHeaderComponent={() =>
                    <View style={styles.cal}>
                        <CalendarComponent
                            curDate={calendarDate}
                            updateCallback={filterOnDay}
                            updateMonth={updateTestMonth} />
                    </View>
                }
                ListFooterComponent={() =>
                    <Button title="asdfadsfsd"></Button>
                }

            >
            </FlatList>
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