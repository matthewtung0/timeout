import React, { useContext, useState, useCallback } from 'react';
import {
    View, StyleSheet, Text, Dimensions, ActivityIndicator, ScrollView, TouchableOpacity, FlatList,
    ImageBackground
} from 'react-native';
import {
    startOfMonth, endOfMonth, addMonths, subMonths, compareAsc, format, min
} from 'date-fns';
import { Icon } from 'react-native-elements'
import MonthlySumComponent from '../components/MonthlySumComponent';
import timeoutApi from '../api/timeout';
import { useFocusEffect } from '@react-navigation/native';
import { Context as SessionContext } from '../context/SessionContext';
const MARGIN_HORIZONTAL = 0
import HistoryComponent from '../components/HistoryComponent';
import Modal from 'react-native-modal'
import HistoryDailyModal from '../components/HistoryDetailModal'

//const background_desk = require('../../assets/background_desk.png');

const HistoryDailyScreen = ({ navigation }) => {
    console.log("History daily screen rerender")
    var options = { month: 'long' };
    const { height, width } = Dimensions.get('window');
    const [scrollPosition, setScrollPosition] = useState(0);
    const [viewableArray, setViewableArray] = useState([0]);
    const [displayedMonth, setDisplayedMonth] = useState(new Intl.DateTimeFormat('en-US', options).format(new Date()))
    const [displayedYear, setDisplayedYear] = useState(new Date().getFullYear())

    const [useMonthly, setUseMonthly] = useState(true);

    const { state, fetchMonthly, resetCalendarDate } = useContext(SessionContext)
    const [isLoading, setIsLoading] = useState(true)
    const [modalVisible, setModalVisible] = useState(false)
    const [selectedObject, setSelectedObject] = useState({})

    const longMonth = (date) => {
        return new Intl.DateTimeFormat('en-US', options).format(date)
    }

    const [monthlyCounters, setMonthlyCounters] = useState([])
    const [monthlyCountersGrouped, setMonthlyCountersGrouped] = useState([])

    const [monthlyTasksGrouped, setMonthlyTasksGrouped] = useState([])


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
        if (isLoading) { return }
        var dt = addMonths(startOfMonth(state.calendarDate), 1)
        if (compareAsc(new Date(), dt) < 0) {
            return
        }
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
        if (isLoading) { return }
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

    const date_Subtitle = (dt) => {
        var actual_date = new Date(dt).toLocaleDateString() // to compensate for being sent UTC times
        //var parts = dt.split('T')
        //var actual_date = parts[0]
        //var actual_parts = actual_date.split('-')
        var actual_parts = actual_date.split('/')
        var yr = actual_parts[2]
        var month = actual_parts[0]
        var day = actual_parts[1]

        return { formatted: month + "/" + day + "/" + yr }
    }

    const getDayFromFormatted = (dt) => {
        var actual_parts = dt.split('/')
        var month = actual_parts[0]
        var day = actual_parts[1]
        var yr = actual_parts[2]
        return day
    }
    const getMonthFromFormatted = (dt) => {
        var actual_dt = new Date(dt)
        return format(actual_dt, 'LLL')
        var actual_parts = dt.split('/')
        var month = actual_parts[0]
        var day = actual_parts[1]
        var yr = actual_parts[2]
    }

    const groupMonthlyTasks = (monthSessions) => {
        var taskMap = {}
        for (var i = 0; i < monthSessions.length; i++) {
            var session = monthSessions[i]
            var formattedTime = date_Subtitle(session.time_start)
            //timeDiffSec = differenceInSeconds(parseISO(act.time_end), parseISO(act.time_start))
            if (formattedTime.formatted in taskMap) {
                taskMap[formattedTime.formatted].push(session)
            } else {
                taskMap[formattedTime.formatted] = [session]
            }
        }

        let sortedTaskMap = Object.entries(taskMap).sort((a, b) => { return a })
        setMonthlyTasksGrouped(sortedTaskMap)
    }

    const focusEffectFunc = async () => {
        setIsLoading(true)
        await fetchMonthly(state.calendarDate, groupMonthlyTasks)
        await fetchMonthlyCounters(state.calendarDate)
        setDisplayedMonth(longMonth(state.calendarDate))
        setDisplayedYear(state.calendarDate.getFullYear())
        setIsLoading(false)
    }


    useFocusEffect(

        useCallback(() => {
            //setUseMonthly(true)

            focusEffectFunc();
            return () => {
            }
        }, [state.calendarDate])
    )

    const scrollEvent = (e) => {
        var scrollPos = e.nativeEvent.contentOffset.y
        setScrollPosition(scrollPos)

        /*if (scrollPos < REFRESH_THRESHOLD_POSITION) {
            setRefreshToken(Math.random())
        }*/
    }

    const _onViewableItemsChanged = useCallback(({ viewableItems, changed }) => {
        //console.log("Visible items are", viewableItems);
        var viewableArray_ = viewableItems.map((i) => { return i.index })
        //console.log("Viewable array: ", viewableArray_)
        setViewableArray(viewableArray_)
        //console.log("Changed in this iteration, ", changed);
    }, []);

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    const modalCallback = async (item_deleted = false) => {
        if (item_deleted) {
            //console.log("CALLING MODAL CALLBACK")
            fetchMonthly(state.calendarDate, groupMonthlyTasks)
        }

    }

    const _viewabilityConfig = {
        itemVisiblePercentThreshold: 90
    }

    const renderHeader = () => {
        return (
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
                        <View>
                            <Text style={[styles.overviewTitle, styles.textDefaultBold,
                            {
                                fontSize: 22, alignSelf: 'auto',
                                marginBottom: 0, color: '#67806D', marginHorizontal: 10,
                            }]}>{displayedMonth} Overview</Text>

                        </View>

                    </View>

                    <>

                        <Text style={[styles.overviewTitle, styles.textDefault,
                        {
                            fontSize: 17, alignSelf: 'auto', marginHorizontal: 10,
                            marginTop: 2, marginBottom: 3, color: '#67806D'
                        }]}>
                            {state.monthSessions.length} Tasks</Text>
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
                            <View style={{ marginHorizontal: 10, marginTop: 5, }}>
                                <Text style={{ color: '#67806D' }}>No tasks for this month</Text>
                            </View>
                        }

                        <Text style={[styles.overviewTitle, styles.textDefault, {
                            fontSize: 17, alignSelf: 'auto',
                            marginHorizontal: MARGIN_HORIZONTAL, marginBottom: 3, color: '#67806D'
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

                </View>
            </>
        )
    }

    return (
        <View style={styles.viewContainer}>
            <Modal isVisible={modalVisible}
                animationIn='slideInLeft'
                animationOut='slideOutLeft'
            >

                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}>
                    <View style={{
                        height: height * 0.6
                    }}>

                        <HistoryDailyModal toggleFunction={toggleModal}
                            selectedObject={selectedObject}
                            callback={modalCallback}>
                        </HistoryDailyModal>

                    </View>
                </View>
            </Modal>

            <View opacity={isLoading ? 0.3 : 1} style={{ flex: 1, }}>
                <View style={{
                    flex: 1, flexDirection: 'row', alignItems: 'center', height: 30, borderRadius: 15,
                    backgroundColor: '#90AB72', marginHorizontal: 20,
                }}>
                    <View style={{ flex: 1, }}>
                        <TouchableOpacity
                            onPress={() => {
                                if (!isLoading) {
                                    goToPrevMonth()
                                }
                            }
                            }>
                            <Icon
                                name="chevron-back-outline"
                                type='ionicon'
                                size={25}
                                color='white' />
                        </TouchableOpacity>
                    </View>
                    <View style={{
                        flex: 3,
                        alignItems: 'center', justifyContent: 'center', alignContent: 'center',
                    }}>
                        <Text style={[styles.overviewTitle, { fontSize: 22, }]}>{displayedMonth} {displayedYear}</Text>
                    </View>

                    <View style={{ flex: 1, }}>
                        <TouchableOpacity
                            onPress={() => {
                                if (!isLoading) {
                                    goToNextMonth()
                                }
                            }
                            }>
                            {compareAsc(new Date(), addMonths(startOfMonth(state.calendarDate), 1)) < 0 ?
                                <Icon
                                    name="chevron-forward-outline"
                                    type='ionicon'
                                    size={25}
                                    color='#E8D39E' />
                                :
                                <Icon
                                    name="chevron-forward-outline"
                                    type='ionicon'
                                    size={25}
                                    color='white' />}
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ flex: 12, }}>

                    {/*/ =============== TASKS DETAIL CONTAINER ===============*/}
                    <View style={{
                        backgroundColor: 'white', borderRadius: 10, shadowOffset: {
                            width: 0.05,
                            height: 0.05,
                        },
                        shadowOpacity: 0.1, paddingVertical: 10, marginHorizontal: MARGIN_HORIZONTAL / 2,
                        marginTop: 15,
                        flex: 1,
                    }}>

                        <View style={{ flex: 1, }}>

                            <FlatList
                                ListHeaderComponent={renderHeader}
                                style={{ marginHorizontal: 10, }}
                                horizontal={false}
                                data={monthlyTasksGrouped}
                                //onScroll={scrollEvent}
                                onViewableItemsChanged={_onViewableItemsChanged}
                                viewabilityConfig={_viewabilityConfig}
                                showsHorizontalScrollIndicator={false}
                                keyExtractor={(item) => item[0]}
                                renderItem={({ item, index }) =>
                                    <View
                                        style={{ flex: 1, flexDirection: 'row', }}>
                                        <View opacity={Math.min(...viewableArray) == index ? 1 : 0.7}>
                                            <Text style={[styles.overviewTitle, {
                                                fontSize: 20, color: '#013220', fontWeight: '700',
                                                alignSelf: 'auto',
                                                marginTop: 4, marginBottom: 2,
                                            }]}>{getDayFromFormatted(item[0])}</Text>
                                            <Text style={{ color: '#013220', fontWeight: '550', fontSize: 13, }}
                                            >{getMonthFromFormatted(item[0])}</Text>
                                        </View>
                                        <View style={{ flex: 0.7, borderWidth: 0, alignItems: 'center', }}>
                                            {(Math.min(...viewableArray) == index ||
                                                (viewableArray.includes(monthlyTasksGrouped.length - 1) && viewableArray.includes(index))) ?
                                                <View style={{
                                                    width: 15, height: 15, borderRadius: 7.5,
                                                    borderWidth: 2, borderColor: '#67806D',
                                                    backgroundColor: '#67806D'
                                                }} />
                                                :
                                                <View style={{
                                                    width: 15, height: 15, borderRadius: 7.5,
                                                    borderWidth: 2, borderColor: '#C0C0C0', backgroundColor: 'white'
                                                }} />
                                            }
                                            {(Math.min(...viewableArray) == index ||
                                                (viewableArray.includes(monthlyTasksGrouped.length - 1) && viewableArray.includes(index))) ?
                                                <View style={{
                                                    height: '100%', width: 4, backgroundColor: '#67806D',
                                                    borderWidth: 2, borderColor: '#67806D',
                                                }}></View>
                                                :
                                                <View style={{
                                                    height: '100%', width: 4,
                                                    borderWidth: 2, borderColor: '#C0C0C0', backgroundColor: '#C0C0C0'
                                                }}></View>
                                            }


                                        </View>
                                        <View style={{ flex: 5, }}>
                                            {/* separator */}
                                            <View
                                                style={{
                                                    borderBottomColor: 'grey',
                                                    borderBottomWidth: 1.5,
                                                    marginHorizontal: MARGIN_HORIZONTAL
                                                }}
                                            />
                                            {/* detail items */}
                                            <View>
                                                {item[1].map((j) => {
                                                    return (
                                                        <View
                                                            key={j.activity_id}
                                                            style={{ marginHorizontal: MARGIN_HORIZONTAL }}>
                                                            <TouchableOpacity
                                                                onPress={() => {
                                                                    setSelectedObject(j)
                                                                    toggleModal()
                                                                }}
                                                                style={{}}
                                                            >
                                                                <HistoryComponent
                                                                    session_obj={j}
                                                                    is_active={Math.min(...viewableArray) == index ||
                                                                        (viewableArray.includes(monthlyTasksGrouped.length - 1) && viewableArray.includes(index))}>
                                                                </HistoryComponent>
                                                            </TouchableOpacity>

                                                        </View>
                                                    )
                                                })
                                                }
                                            </View>
                                        </View>
                                    </View>
                                }
                            >
                            </FlatList>

                        </View>
                    </View>
                </View>
            </View>

            {isLoading ?
                <View style={{
                    width: '100%', height: '100%', position: 'absolute',
                    justifyContent: 'center', alignItems: 'center',
                }}>
                    <ActivityIndicator style={{ width: 100, height: 100 }} size="large" color="black" />
                </View>
                :
                null}


        </View>
    )
}

const styles = StyleSheet.create({
    textDefaultBold: {
        fontFamily: 'Inter-Bold',
    },
    textDefault: {
        fontFamily: 'Inter-Regular',
    },
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
        color: 'white',
    },
})

export default HistoryDailyScreen;