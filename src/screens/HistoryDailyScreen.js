import React, { useContext, useState, useCallback } from 'react';
import { View, StyleSheet, Text, FlatList, Dimensions } from 'react-native';
import {
    compareAsc, format, endOfDay, startOfDay, parseISO
} from 'date-fns';
import CalendarComponent from '../components/CalendarComponent';
import PastActivityCard from '../components/PastActivityCard';
import MonthlySumComponent from '../components/MonthlySumComponent';
import timeoutApi from '../api/timeout';
import { useFocusEffect } from '@react-navigation/native';
import { Context as SessionContext } from '../context/SessionContext';

const today_date = () => {
    let date = format(new Date(), 'M-dd-yyyy z')
    return date;

}

const getDaySession = async (dayObject) => {
    // get list of sessions you did that day
    let date = parseISO(JSON.parse(dayObject).dateString)
    try {
        let startRange = startOfDay(date)
        let endRange = endOfDay(date)

        const response = await timeoutApi.get('/daySessions', { params: { startTime: startRange, endTime: endRange } })
        return response.data
        //
    } catch (err) {
        console.log("Problem getting day's sessions", err)
    }
}

const HistoryDailyScreen = ({ navigation }) => {
    var options = { month: 'long' };
    const { height, width } = Dimensions.get('window');
    const [displayed_dt, setDisplayedDt] = useState(today_date());
    const [selectedDay, setSelectedDay] = useState('uninitiated');
    const [testMonth, setTestMonth] = useState('uninitiated month')
    const [displayedMonth, setDisplayedMonth] = useState(new Intl.DateTimeFormat('en-US', options).format(new Date()))
    const [displayedYear, setDisplayedYear] = useState(new Date().getFullYear())

    const [dispMessage, setDispMessage] = useState('')

    const [daySessions, setDaySessions] = useState([])
    const [monthSessions, setMonthSessions] = useState([])

    const [calendarDate, setCalendarDate] = useState(format(new Date(), 'yyyy-MM-dd'))
    const [useMonthly, setUseMonthly] = useState(true);

    const { state, fetchMonthly } = useContext(SessionContext)

    const longMonth = (date) => {
        return new Intl.DateTimeFormat('en-US', options).format(date)
    }

    const filterOnDay = (dayObject) => {
        setSelectedDay(dayObject)
        /* format:
        Object {
            "dateString": "2022-03-10",
            "day": 10,
            "month": 3,
            "timestamp": 1646870400000,
            "year": 2022,
        }
        */
        let date = parseISO(dayObject.dateString)
        let startTime = startOfDay(date)
        let endTime = endOfDay(date)

        let daySessions = state.monthSessions.filter(a => {
            let compare_dt = parseISO(a.time_start)
            return (compareAsc(compare_dt, startTime) >= 0 &&
                compareAsc(endTime, compare_dt) > 0)
        })
        setUseMonthly(false)
        setDaySessions(daySessions);
    }

    const fetchMonthlyCallback = async (month) => {
        console.log("Month is", month)
        var month_dateObj = parseISO(month.dateString)
        // format is:
        /*Object {
            "dateString": "2022-03-01",
            "day": 1,
            "month": 3,
            "timestamp": 1646092800000,
            "year": 2022,
        }*/
        await fetchMonthly(month_dateObj)

        setDisplayedMonth(longMonth(month_dateObj))
        setDisplayedYear(month_dateObj.getFullYear())

        setTestMonth(month)
    }

    const setMonthlyCallback = () => {
        setUseMonthly(true);
    }

    const updateSelectedDay = async (a) => {
        setSelectedDay(a);
        let res = await getDaySession(a);
        setDaySessions(res)
    }

    useFocusEffect(

        useCallback(() => {
            var dt = new Date()
            fetchMonthly(dt)
            setDisplayedMonth(longMonth(dt))
            setDisplayedYear(dt.getFullYear())
        }, [])
    )

    return (
        <View style={styles.viewContainer}>

            {useMonthly ?
                <FlatList
                    horizontal={false}
                    data={undefined}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(result) => result.activity_id}
                    renderItem={({ item }) => {
                        return (
                            <></>
                        )
                    }}
                    ListHeaderComponent={() =>
                        <View style={styles.cal}>
                            <CalendarComponent
                                curDate={state.calendarDate}
                                updateCallback={filterOnDay}
                                updateMonth={fetchMonthlyCallback}
                                setMonthlyCallback={setMonthlyCallback} />
                        </View>

                    }

                    ListFooterComponent={() =>
                        <View>
                            <Text style={styles.overviewTitle}>
                                {displayedMonth} {displayedYear} Overview</Text>
                            {state.monthSessions.length > 0 ?
                                <MonthlySumComponent monthBatch={state.monthSessions} />
                                :
                                <Text style={styles.overviewTitle}>Nothing for this month!</Text>}
                        </View>
                    }
                />
                :
                <FlatList
                    horizontal={false}
                    data={daySessions}
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
                            <Text style={styles.overviewTitle}>
                                {selectedDay.month}/{selectedDay.day}/{selectedDay.year}</Text>
                        </View>
                    }

                    ListFooterComponent={() =>
                        <View>
                            {daySessions.length > 0 ?
                                null : <Text style={[styles.overviewTitle, { fontSize: 16 }]}>Nothing for this day!</Text>}
                        </View>
                    }
                />}

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
    viewContainer: {
        flex: 1,
        marginTop: 70,
    },
    overviewTitle: {
        fontWeight: 'bold',
        fontSize: 22,
        alignSelf: 'center',
        color: '#67806D',
        marginTop: 10,
        marginBottom: 8,
    },
})

export default HistoryDailyScreen;