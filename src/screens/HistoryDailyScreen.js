import React, { useContext, useState } from 'react';
import { View, StyleSheet, Text, FlatList, Dimensions, Button } from 'react-native';
import {
    compareAsc, eachDayOfInterval, format, subDays, addDays,
    endOfDay, startOfDay, parseISO, startOfMonth, endOfMonth
} from 'date-fns';
import CalendarComponent from '../components/CalendarComponent';
import PastActivityCard from '../components/PastActivityCard';
import MonthlySumComponent from '../components/MonthlySumComponent';
import timeoutApi from '../api/timeout';
import { Context as SessionContext } from '../context/SessionContext';

const today_date = () => {
    let date = format(new Date(), 'M-dd-yyyy z')
    return date;

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

const HistoryDailyScreen = ({ navigation }) => {
    const { height, width } = Dimensions.get('window');
    const [displayed_dt, setDisplayedDt] = useState(today_date());
    const [selectedDay, setSelectedDay] = useState('uninitiated');
    const [testMonth, setTestMonth] = useState('uninitiated month')

    const [dispMessage, setDispMessage] = useState('')

    const [daySessions, setDaySessions] = useState([])
    const [monthSessions, setMonthSessions] = useState([])

    const [calendarDate, setCalendarDate] = useState(format(new Date(), 'yyyy-MM-dd'))
    const [useMonthly, setUseMonthly] = useState(true);

    const { state, fetchMonthly } = useContext(SessionContext)

    const filterOnDay = (dayObject) => {
        let date = parseISO(dayObject.dateString)

        let startTime = startOfDay(date)
        let endTime = endOfDay(date)
        console.log("Start of day is", startTime);

        let daySessions = state.monthSessions.filter(a => {
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

    const setMonthlyCallback = () => {
        setUseMonthly(true);
    }

    const updateSelectedDay = async (a) => {
        setSelectedDay(a);
        let res = await getDaySession(a);
        console.log("RESULT IS", res)
        setDaySessions(res)
    }

    return (
        <View style={styles.viewContainer}>
            <View>
                <Text>asdf</Text>
            </View>

            <MonthlySumComponent monthBatch={state.monthSessions}>

            </MonthlySumComponent>

            <FlatList
                style={styles.flatlist}
                horizontal={false}
                data={useMonthly ? state.monthSessions : daySessions}
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
                            curDate={state.calendarDate}
                            updateCallback={filterOnDay}
                            updateMonth={fetchMonthly}
                            setMonthlyCallback={setMonthlyCallback} />
                    </View>
                }

                ListFooterComponent={() =>
                    <View>
                        {useMonthly ?
                            state.monthSessions.length > 0 ?
                                null : <Text>Nothing for this month!</Text>
                            : null}
                    </View>
                }
            />


        </View>
    )
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
    flatlist: {
    },
    viewContainer: {
        flex: 1,
    },
})

export default HistoryDailyScreen;