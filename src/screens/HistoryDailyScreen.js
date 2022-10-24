import React, { useContext, useState, useCallback } from 'react';
import { View, StyleSheet, Text, FlatList, Dimensions, ActivityIndicator, ScrollView, Button, TouchableOpacity } from 'react-native';
import {
    compareAsc, format, endOfDay, startOfDay, parseISO, startOfMonth,
    endOfMonth, addMonths, subMonths, differenceInSeconds
} from 'date-fns';
import { Icon } from 'react-native-elements'
import PastActivityCard from '../components/PastActivityCard';
import MonthlySumComponent from '../components/MonthlySumComponent';
import timeoutApi from '../api/timeout';
import { useFocusEffect } from '@react-navigation/native';
import { Context as SessionContext } from '../context/SessionContext';
const MARGIN_HORIZONTAL = 20
import HistoryComponent from '../components/HistoryComponent';

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

    const [monthlyTasksGrouped, setMonthlyTasksGrouped] = useState([])
    const [dayCounters, setDayCounters] = useState([])
    const [monthlySummaryVisible, setMonthlySummaryVisible] = useState(true)
    const [dailySummaryVisible, setDailySummaryVisible] = useState(true)

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
        setMonthlyCountersGrouped(res)
    }

    const goToNextMonth = async () => {
        var dt = addMonths(startOfMonth(state.calendarDate), 1)
        setIsLoading(true)
        setUseMonthly(true)
        resetCalendarDate(dt)
        await fetchMonthly(dt)
        await fetchMonthlyCounters(dt)
        setDisplayedMonth(longMonth(dt))
        setDisplayedYear(dt.getFullYear())
        //setTestMonth(month)
        setIsLoading(false)
    }

    const goToPrevMonth = async () => {
        var dt = subMonths(startOfMonth(state.calendarDate), 1)
        setIsLoading(true)
        setUseMonthly(true)
        resetCalendarDate(dt)
        await fetchMonthly(dt)
        await fetchMonthlyCounters(dt)
        setDisplayedMonth(longMonth(dt))
        setDisplayedYear(dt.getFullYear())
        //setTestMonth(month)
        setIsLoading(false)
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
        await fetchMonthly(month_dateObj, groupMonthlyTasks)
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

    const date_Subtitle = (dt) => {
        var parts = dt.split('T')
        var actual_date = parts[0]
        var actual_parts = actual_date.split('-')
        var yr = actual_parts[0]
        var month = actual_parts[1]
        var day = actual_parts[2]

        return (month + "/" + day + "/" + yr)

    }

    const toggleSummaryDisplay = () => {
        setMonthlySummaryVisible(!monthlySummaryVisible)
    }
    const toggleDailyDisplay = () => {
        setDailySummaryVisible(!dailySummaryVisible)
    }

    const groupMonthlyTasks = (monthSessions) => {
        var taskMap = {}
        for (var i = 0; i < monthSessions.length; i++) {
            var session = monthSessions[i]
            var formattedTime = date_Subtitle(session.time_start)
            //timeDiffSec = differenceInSeconds(parseISO(act.time_end), parseISO(act.time_start))
            if (formattedTime in taskMap) {
                taskMap[formattedTime].push(session)
            } else {
                taskMap[formattedTime] = [session]
            }
        }


        let sortedTaskMap = Object.entries(taskMap).sort((a, b) => { return a })
        setMonthlyTasksGrouped(sortedTaskMap)
        console.log("GROUPED TASKS", sortedTaskMap)
    }


    useFocusEffect(

        useCallback(() => {
            console.log("date is", state.calendarDate)
            //setUseMonthly(true)
            setIsLoading(true)

            fetchMonthly(state.calendarDate, groupMonthlyTasks)

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
    //console.log(state.monthSessions)

    return (
        <ScrollView style={styles.viewContainer}>
            <></>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1, }}>
                    <TouchableOpacity
                        onPress={goToPrevMonth}>
                        <Icon
                            name="chevron-back-outline"
                            type='ionicon'
                            size={35}
                            color='black' />
                    </TouchableOpacity>
                </View>
                <View style={{
                    flex: 3,
                    alignItems: 'center'
                }}>
                    <Text style={[styles.overviewTitle, { fontSize: 26, }]}>{displayedMonth} {displayedYear}</Text>
                </View>

                <View style={{ flex: 1, }}>
                    <TouchableOpacity
                        onPress={goToNextMonth}>
                        <Icon
                            name="chevron-forward-outline"
                            type='ionicon'
                            size={35}
                            color='black' />
                    </TouchableOpacity>
                </View>
            </View>

            <View>
                <>
                    {/* ======= SUMMARY CONTAINER ======== */}
                    <View style={{
                        backgroundColor: 'white', borderRadius: 10, shadowOffset: {
                            width: 0.05,
                            height: 0.05,
                        },
                        shadowOpacity: 0.1, paddingVertical: 10, marginHorizontal: MARGIN_HORIZONTAL / 2,
                        marginTop: 15,
                    }}>
                        <View style={{ flex: 1, flexDirection: 'row', }}>
                            <View style={{ flex: 4 }}>
                                <Text style={[styles.overviewTitle,
                                {
                                    fontSize: 22, alignSelf: 'auto', marginHorizontal: MARGIN_HORIZONTAL,
                                    marginBottom: 3,
                                }]}>Monthly Summary</Text>

                            </View>

                            <View style={{ flex: 1 }}>
                                <TouchableOpacity
                                    onPress={toggleSummaryDisplay}>
                                    {monthlySummaryVisible ?
                                        <Icon
                                            name="remove-outline"
                                            type='ionicon'
                                            size={23}
                                            color='grey'
                                            style={{
                                                justifyContent: 'center', borderWidth: 0.3, borderRadius: 7,
                                                marginHorizontal: MARGIN_HORIZONTAL, marginBottom: 3,
                                            }} />
                                        :
                                        <Icon
                                            name="add-outline"
                                            type='ionicon'
                                            size={23}
                                            color='grey'
                                            style={{
                                                justifyContent: 'center', borderWidth: 0.3, borderRadius: 7,
                                                marginHorizontal: MARGIN_HORIZONTAL, marginBottom: 3,
                                            }} />
                                    }
                                </TouchableOpacity>

                            </View>

                        </View>


                        <View
                            style={{
                                borderBottomColor: 'grey',
                                borderBottomWidth: 2,
                                marginHorizontal: MARGIN_HORIZONTAL,
                                marginBottom: 7,
                            }}
                        />

                        {monthlySummaryVisible ?
                            <>

                                <Text style={[styles.overviewTitle,
                                {
                                    fontSize: 17, alignSelf: 'auto', marginHorizontal: MARGIN_HORIZONTAL,
                                    marginTop: 2, marginBottom: 3,
                                }]}>
                                    Tasks ({state.monthSessions.length})</Text>
                                <View
                                    style={{
                                        borderBottomColor: 'grey',
                                        borderBottomWidth: 1,
                                        marginHorizontal: MARGIN_HORIZONTAL,
                                        marginBottom: 5,
                                    }}
                                />

                                {state.monthSessions.length > 0 ?
                                    <MonthlySumComponent monthBatch={state.monthSessions} />
                                    :
                                    <View style={{ marginHorizontal: MARGIN_HORIZONTAL, marginTop: 5, }}>
                                        <Text>No tasks for this month</Text>
                                    </View>
                                }

                                <Text style={[styles.overviewTitle, {
                                    fontSize: 17, alignSelf: 'auto',
                                    marginHorizontal: MARGIN_HORIZONTAL, marginBottom: 3,
                                }]}>Counters ({monthlyCountersGrouped.length}) </Text>
                                <View
                                    style={{
                                        borderBottomColor: 'grey',
                                        borderBottomWidth: 1,
                                        marginHorizontal: MARGIN_HORIZONTAL
                                    }}
                                />

                                {monthlyCountersGrouped.length > 0 ?

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
                                    :
                                    <View style={{ marginHorizontal: MARGIN_HORIZONTAL, marginTop: 5, }}>
                                        <Text>No counters for this month</Text>
                                    </View>}

                            </>
                            : null}

                    </View>



                    {/*/ =============== TASKS DETAIL CONTAINER ===============*/}
                    <View style={{
                        backgroundColor: 'white', borderRadius: 10, shadowOffset: {
                            width: 0.05,
                            height: 0.05,
                        },
                        shadowOpacity: 0.1, paddingVertical: 10, marginHorizontal: MARGIN_HORIZONTAL / 2,
                        marginTop: 15,
                    }}>

                        <View style={{ flex: 1, flexDirection: 'row', }}>
                            <View style={{ flex: 4 }}>
                                <Text style={[styles.overviewTitle,
                                {
                                    fontSize: 24, alignSelf: 'auto', marginHorizontal: MARGIN_HORIZONTAL,
                                    marginBottom: 3,
                                }]}>Tasks Detail</Text>

                            </View>

                            <View style={{ flex: 1 }}>

                                <TouchableOpacity
                                    onPress={toggleDailyDisplay}>
                                    {dailySummaryVisible ?
                                        <Icon
                                            name="remove-outline"
                                            type='ionicon'
                                            size={23}
                                            color='grey'
                                            style={{
                                                justifyContent: 'center', borderWidth: 0.3, borderRadius: 7,
                                                marginHorizontal: MARGIN_HORIZONTAL, marginBottom: 3,
                                            }} />
                                        :
                                        <Icon
                                            name="add-outline"
                                            type='ionicon'
                                            size={23}
                                            color='grey'
                                            style={{
                                                justifyContent: 'center', borderWidth: 0.3, borderRadius: 7,
                                                marginHorizontal: MARGIN_HORIZONTAL, marginBottom: 3,
                                            }} />
                                    }
                                </TouchableOpacity>

                            </View>

                        </View>
                        <View
                            style={{
                                borderBottomColor: 'grey',
                                borderBottomWidth: 2,
                                marginHorizontal: MARGIN_HORIZONTAL
                            }}
                        />

                        {dailySummaryVisible ?
                            <View>
                                {monthlyTasksGrouped.map((item) => {
                                    return (
                                        <View
                                            key={item[0]}>
                                            <Text style={[styles.overviewTitle, {
                                                fontSize: 16, alignSelf: 'auto',
                                                marginHorizontal: MARGIN_HORIZONTAL,
                                                marginTop: 4, marginBottom: 2,
                                            }]}>{item[0]}</Text>
                                            <View
                                                style={{
                                                    borderBottomColor: 'grey',
                                                    borderBottomWidth: 1.5,
                                                    marginHorizontal: MARGIN_HORIZONTAL
                                                }}
                                            />

                                            <View>
                                                {item[1].map((j) => {
                                                    return (
                                                        <View
                                                            key={j.activity_id}
                                                            style={{ marginHorizontal: MARGIN_HORIZONTAL }}>
                                                            <HistoryComponent
                                                                session_obj={j}>

                                                            </HistoryComponent>

                                                        </View>


                                                    )
                                                })

                                                }

                                            </View>
                                        </View>
                                    )

                                })}
                            </View>

                            : null}
                    </View>
                </>
            </View>

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
        marginBottom: 8,
    },
})

export default HistoryDailyScreen;