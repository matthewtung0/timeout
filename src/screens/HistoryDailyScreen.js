import React, { useContext, useState, useCallback } from 'react';
import { View, StyleSheet, Text, FlatList, Dimensions, ActivityIndicator, ScrollView } from 'react-native';
import {
    compareAsc, format, endOfDay, startOfDay, parseISO, startOfMonth, endOfMonth
} from 'date-fns';
import { Calendar } from 'react-native-calendars';
import CalendarComponent from '../components/CalendarComponent';
import PastActivityCard from '../components/PastActivityCard';
import MonthlySumComponent from '../components/MonthlySumComponent';
import timeoutApi from '../api/timeout';
import { useFocusEffect } from '@react-navigation/native';
import { Context as SessionContext } from '../context/SessionContext';
const MARGIN_HORIZONTAL = 20
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

    const [daySessions, setDaySessions] = useState([])

    const [calendarDate, setCalendarDate] = useState(format(new Date(), 'yyyy-MM-dd'))
    const [useMonthly, setUseMonthly] = useState(true);

    const { state, fetchMonthly, resetCalendarDate } = useContext(SessionContext)

    const [isLoading, setIsLoading] = useState(true)
    const [markedDatesTemp, setMarkedDatesTemp] = useState({})

    const longMonth = (date) => {
        return new Intl.DateTimeFormat('en-US', options).format(date)
    }

    const [monthlyCounters, setMonthlyCounters] = useState([])
    const [monthlyCountersGrouped, setMonthlyCountersGrouped] = useState([])
    const [dayCounters, setDayCounters] = useState([])

    console.log("Calendar Date", state.calendarDate)

    const fetchMonthlyCounters = async (date) => {
        //let date = parseISO(dayObject.dateString)
        let startOfMonthTemp = startOfMonth(date)
        try {
            let startRange = startOfMonth(date)
            let endRange = endOfMonth(date)

            console.log("Monthly counter start", startRange)
            console.log("Monthly counter end", endRange)

            const response = await timeoutApi.get('/counter/month', { params: { startTime: startRange, endTime: endRange } })
            //console.log("mONTHLY COUNTERS:", response.data)
            setMonthlyCounters(response.data)
            groupMonthlyCounters(response.data);
        } catch (err) {
            console.log("Problem getting month's counters", err)
        }
    }

    const groupMonthlyCounters = (ungroupedArr) => {
        const map = new Map();
        for (const { counter_name, daily_count } of ungroupedArr) {
            const currSum = map.get(counter_name) || 0
            map.set(counter_name, +currSum + +daily_count)
        }
        const res = Array.from(map, ([counter_name, daily_count]) => ({ counter_name, daily_count }))
        console.log("Grouped monthly data", res)
        setMonthlyCountersGrouped(res)
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

        filterCounterOnDay(dayObject)
    }

    const filterCounterOnDay = (dayObject) => {
        let date = parseISO(dayObject.dateString)
        //console.log("BEFORE FILTERING", monthlyCounters)

        let startTime = startOfDay(date)
        let endTime = endOfDay(date)
        console.log("start", startTime)
        console.log("end", endTime)
        let dayCounters = monthlyCounters.filter(a => {
            let compare_dt = parseISO(a.time_created)
            return (compareAsc(compare_dt, startTime) >= 0 &&
                compareAsc(endTime, compare_dt) > 0)
        })
        //setUseMonthly(false)
        setDayCounters(dayCounters);
    }

    const fetchMonthlyCallback = async (month) => {
        setIsLoading(true)
        setUseMonthly(true)
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
        await fetchMonthlyCounters(month_dateObj)

        setDisplayedMonth(longMonth(month_dateObj))
        setDisplayedYear(month_dateObj.getFullYear())

        setTestMonth(month)
        setIsLoading(false)
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
            console.log("date is", state.calendarDate)
            //setUseMonthly(true)
            setIsLoading(true)

            fetchMonthly(state.calendarDate)

            fetchMonthlyCounters(state.calendarDate)

            setDisplayedMonth(longMonth(state.calendarDate))
            setDisplayedYear(state.calendarDate.getFullYear())
            setIsLoading(false)

            return () => {
                //setMarkedDatesTemp({})
                //setCalendarDate(format(new Date(), 'yyyy-MM-dd'))
                //resetCalendarDate(format(new Date(), 'yyyy-MM-dd'))
            }
        }, [state.calendarDate])
    )

    return (
        <ScrollView style={styles.viewContainer}>

            <Calendar
                current={calendarDate}
                markedDates={markedDatesTemp}
                onDayPress={day => {
                    var temp = {}
                    temp[day.dateString] = { selected: true, selectedColor: '#F5BBAE' }
                    setMarkedDatesTemp(temp)
                    filterOnDay(day);
                }}
                onMonthChange={month => {
                    console.log("Setting calendar date to", month.dateString)

                    resetCalendarDate(new Date(month.dateString))

                    setCalendarDate(month.dateString)
                    //fetchMonthlyCallback(month);
                    setUseMonthly(true)
                    setMarkedDatesTemp({})
                }}
                style={{
                    borderRadius: 10, width: width / 1.1, alignSelf: 'center'
                }}
                theme={{
                    calendarBackground: '#F6F2DF',
                    textDayFontSize: 15,
                    textMonthFontSize: 18,
                    textDayHeaderFontSize: 15,
                    todayTextColor: 'black',
                    dayTextColor: '#67806D',
                    monthTextColor: '#67806D',
                    arrowColor: '#67806D',
                    textSectionTitleColor: '#67806D',
                    selectedDayTextColor: 'black',
                    textMonthFontWeight: 'bold',
                }}>

            </Calendar>

            {useMonthly ?
                /*<View style={styles.cal}>
                    <CalendarComponent
                        curDate={state.calendarDate}
                        updateCallback={filterOnDay}
                        updateMonth={fetchMonthlyCallback}
                        setMonthlyCallback={setMonthlyCallback} />
        </View>*/
                // MONTHLY VIEW

                <View>
                    {isLoading ?
                        <ActivityIndicator size="large" />
                        :
                        <><Text style={[styles.overviewTitle, { marginHorizontal: MARGIN_HORIZONTAL }]}>
                            {displayedMonth} {displayedYear} Overview</Text>
                            <Text style={[styles.overviewTitle, { fontSize: 18, alignSelf: 'auto', marginHorizontal: MARGIN_HORIZONTAL }]}>{state.monthSessions.length} Timed Tasks</Text>
                            <View
                                style={{
                                    borderBottomColor: 'grey',
                                    borderBottomWidth: StyleSheet.hairlineWidth,
                                    marginHorizontal: MARGIN_HORIZONTAL,
                                    marginBottom: 5,
                                }}
                            />
                            {state.monthSessions.length > 0 ?
                                <MonthlySumComponent monthBatch={state.monthSessions} />
                                : null}


                            <Text style={[styles.overviewTitle, {
                                fontSize: 18, alignSelf: 'auto',
                                marginHorizontal: MARGIN_HORIZONTAL
                            }]}>{monthlyCountersGrouped.length} Counters Worked On</Text>
                            <View
                                style={{
                                    borderBottomColor: 'grey',
                                    borderBottomWidth: StyleSheet.hairlineWidth,
                                    marginHorizontal: MARGIN_HORIZONTAL
                                }}
                            />

                            <View style={{ marginHorizontal: MARGIN_HORIZONTAL, marginTop: 5, }}>
                                {monthlyCountersGrouped
                                    .map((item) => {
                                        return (
                                            <View
                                                key={item.counter_name}
                                                style={{ flex: 1, flexDirection: 'row', }}>
                                                <Text style={{ flex: 1, }}>{item.counter_name}:</Text>
                                                <Text style={{ flex: 1, }}>{item.daily_count}</Text>
                                            </View>
                                        )
                                    })}
                            </View>


                        </>

                    }
                </View>

                // DAILY VIEW
                :
                <>
                    <Text style={[styles.overviewTitle, { marginHorizontal: MARGIN_HORIZONTAL }]}>
                        {selectedDay.month}/{selectedDay.day}/{selectedDay.year}</Text>
                    <Text style={{
                        fontSize: 20, marginHorizontal: MARGIN_HORIZONTAL,
                        marginBottom: 5,
                    }}>{daySessions.length} Timed Tasks:</Text>
                    <View
                        style={{
                            borderBottomColor: 'grey',
                            borderBottomWidth: 2,
                            marginHorizontal: MARGIN_HORIZONTAL,
                        }}
                    />
                    <View
                        style={{ marginBottom: 10, }}>

                        {daySessions
                            .map((item) => {
                                return (
                                    <View
                                        key={item.activity_id}
                                        style={{ marginHorizontal: MARGIN_HORIZONTAL, }}>
                                        <PastActivityCard session={item} />
                                        <View
                                            style={{
                                                borderBottomColor: 'grey',
                                                borderBottomWidth: StyleSheet.hairlineWidth,
                                            }}
                                        />
                                    </View>

                                )
                            })}
                    </View>
                    <Text style={{
                        fontSize: 20, marginHorizontal: MARGIN_HORIZONTAL,
                        marginBottom: 5,
                    }}>{dayCounters.length} Counters:</Text>
                    <View
                        style={{
                            borderBottomColor: 'grey',
                            borderBottomWidth: 2,
                            marginHorizontal: MARGIN_HORIZONTAL,
                        }}
                    />
                    <View>
                        {dayCounters
                            .map((item) => {
                                return (
                                    <View
                                        key={item.counter_id}>
                                        <Text>{item.counter_name}: {item.daily_count} tallies today</Text>
                                    </View>
                                )
                            })}
                    </View>
                </>
            }

        </ScrollView>
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
    calTwo: {
        marginHorizontal: 20,
        marginBottom: 5,
        height: 150,
    },
    viewContainer: {
        flex: 1,
        marginTop: 110,
    },
    overviewTitle: {
        fontWeight: 'bold',
        fontSize: 22,
        color: '#67806D',
        marginTop: 10,
        marginBottom: 8,
    },
})

export default HistoryDailyScreen;