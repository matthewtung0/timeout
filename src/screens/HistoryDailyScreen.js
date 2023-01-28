import React, { useContext, useState, useCallback } from 'react';
import {
    View, StyleSheet, Text, Dimensions, ActivityIndicator, TouchableOpacity, FlatList, //Modal
} from 'react-native';
import {
    startOfMonth, endOfMonth, addMonths, subMonths, compareAsc, format, parseISO, differenceInMonths,
    addDays
} from 'date-fns';
import { Icon } from 'react-native-elements'
import MonthlySumComponent from '../components/MonthlySumComponent';
import timeoutApi from '../api/timeout';
import { useFocusEffect } from '@react-navigation/native';
import { Context as SessionContext } from '../context/SessionContext';
import { Context as CounterContext } from '../context/CounterContext';
const MARGIN_HORIZONTAL = 0
import HistoryComponent from '../components/HistoryComponent';
import HistoryCounterComponent from '../components/HistoryCounterComponent';
import MonthlyCounterComponent from '../components/MonthlyCounterComponent';
import Modal from 'react-native-modal'
import HistoryDailyModal from '../components/HistoryDetailModal'
import enUS from 'date-fns/locale/en-US';

const HistoryDailyScreen = ({ navigation }) => {

    console.log("History daily screen rerender")
    const { height, width } = Dimensions.get('window');
    const [scrollPosition, setScrollPosition] = useState(0);
    const [viewableArray, setViewableArray] = useState([0]);
    const { state, setOffsetFetched, fetchMultipleMonths, resetCalendarDate,
        setCurOffset, setHardReset } = useContext(SessionContext)
    const { state: counterState, fetchMultipleMonthsCounters } = useContext(CounterContext);

    const [displayedMonth, setDisplayedMonth] = useState(format(state.calendarDate, 'MMMM', { locale: enUS }))
    const [displayMonthKey, setDisplayedMonthKey] = useState(format(state.calendarDate, 'M/yyyy', { locale: enUS }).toString())
    const [displayedYear, setDisplayedYear] = useState(state.calendarDate.getFullYear())


    const [isLoading, setIsLoading] = useState(true)
    const [modalVisible, setModalVisible] = useState(false)
    const [selectedObject, setSelectedObject] = useState({})

    // number of months prior to current month that is currently fetched from server

    //const [offsetFetched, setOffsetFetched] = useState(3);
    //const [curOffset, setCurOffset] = useState(0);

    const longMonth = (date) => { return format(date, 'MMMM', { locale: enUS }) }

    const [monthlyCounters, setMonthlyCounters] = useState([])
    const [monthlyCountersGrouped, setMonthlyCountersGrouped] = useState([])

    const [monthlyTasksGrouped, setMonthlyTasksGrouped] = useState([])

    const [batchTasksGrouped, setBatchTasksGrouped] = useState({})


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
        await resetCalendarDate(dt)
        //await fetchMonthly(dt)
        //await fetchMonthlyCounters(dt)

        setDisplayedMonth(longMonth(dt))
        setDisplayedMonthKey(format(dt, 'M/yyyy', { locale: enUS }).toString())
        await setCurOffset(state.curOffset - 1)
        setDisplayedYear(dt.getFullYear())
        //setTestMonth(month)
        setIsLoading(false)
    }

    const goToPrevMonth = async () => {
        if (isLoading) { return }
        var dt = subMonths(startOfMonth(state.calendarDate), 1)
        setIsLoading(true)
        await resetCalendarDate(dt)

        //await fetchMonthly(dt)
        //await fetchMonthlyCounters(dt)
        setDisplayedMonth(longMonth(dt))
        var monthKey = format(dt, 'M/yyyy', { locale: enUS }).toString()
        setDisplayedMonthKey(monthKey)

        if (state.curOffset + 1 > state.offsetFetched) { // need to fetch more 
            setIsLoading(true)
            var endTime = endOfMonth(dt)
            var startTime = startOfMonth(subMonths(startOfMonth(dt), 3))
            //await fetchMultipleMonths(startTime, endTime, groupMonthlyTasks)
            await fetchMultipleMonths(startTime, endTime)
            await setOffsetFetched(state.offsetFetched + 4)
        }

        await setCurOffset(state.curOffset + 1)
        setDisplayedYear(dt.getFullYear())
        setIsLoading(false)
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
    }
    const getDayOFWeekFromFormatted = (dt) => {
        var actual_dt = new Date(dt);
        return format(actual_dt, 'E');
    }

    const focusEffectFunc = async () => {
        setIsLoading(true)
        console.log(`Focus effect with calendar date ${state.calendarDate} and offset ${state.curOffset}, 
        counter tables locked: ${counterState.counterTablesLocked}, needReset: ${state.needHardReset}`)

        if (state.needHardReset && !counterState.counterTablesLocked) {
            // if reset needed, refresh most recent month
            var endTime = endOfMonth(new Date())
            var startTime = startOfMonth(new Date())
            await fetchMultipleMonths(startTime, endTime).then(
                setHardReset(false)
            )
        }


        //await fetchMonthly(state.calendarDate, groupMonthlyTasks)

        //await fetchMonthlyCounters(state.calendarDate)

        setDisplayedMonth(longMonth(state.calendarDate))
        setDisplayedYear(state.calendarDate.getFullYear())
        setDisplayedMonthKey(format(state.calendarDate, 'M/yyyy', { locale: enUS }).toString());

        setIsLoading(false)
    }

    useFocusEffect(

        useCallback(() => {
            focusEffectFunc();
            return () => {
            }
        }, [state.calendarDate, state.curOffset, state.needHardReset, counterState.counterTablesLocked]
            //[state.calendarDate])
        )
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
    }

    const modalCallback = async (item_deleted = false) => {
        if (item_deleted) {
            //console.log("CALLING MODAL CALLBACK")

            var endTime = endOfMonth(state.calendarDate)
            var startTime = startOfMonth(state.calendarDate)
            await fetchMultipleMonths(startTime, endTime)

            //fetchMonthly(state.calendarDate, groupMonthlyTasks)
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
                            marginTop: 2, marginBottom: 3, color: '#67806D', marginTop: 5,
                        }]}>
                            {typeof (state.batchDataForSummary[displayMonthKey]) !== 'undefined' ?
                                state.batchDataForSummary[displayMonthKey].filter(
                                    (req) => req.entry_type == 0).length : 0} Tasks</Text>
                        <View
                            style={{
                                borderBottomColor: 'grey',
                                borderBottomWidth: 1,
                                marginHorizontal: MARGIN_HORIZONTAL,
                                marginBottom: 5,
                            }}
                        />

                        {typeof (state.batchDataForSummary[displayMonthKey]) !== 'undefined' &&
                            state.batchDataForSummary[displayMonthKey].filter(
                                (req) => req.entry_type == 0).length > 0 ?
                            <MonthlySumComponent
                                //monthBatch={state.monthSessions} 
                                monthBatch={state.batchDataForSummary[displayMonthKey]}
                            />
                            :
                            <View style={{ marginHorizontal: 10, marginTop: 5, }}>
                                <Text style={{ color: '#67806D' }}>No tasks for this month</Text>
                            </View>
                        }

                        <Text style={[styles.overviewTitle, styles.textDefault, {
                            fontSize: 17, alignSelf: 'auto',
                            marginHorizontal: MARGIN_HORIZONTAL, marginBottom: 3, color: '#67806D', marginTop: 10,
                        }]}>Counters</Text>
                        <View
                            style={{
                                borderBottomColor: 'grey',
                                borderBottomWidth: 1,
                                marginHorizontal: MARGIN_HORIZONTAL
                            }}
                        />

                        {typeof (state.batchDataForSummary[displayMonthKey]) !== 'undefined' &&
                            state.batchDataForSummary[displayMonthKey].filter(
                                (req) => req.entry_type == 1).length > 0 ?
                            <MonthlyCounterComponent
                                monthBatch={state.batchDataForSummary[displayMonthKey]}
                            />
                            :
                            <View style={{ marginHorizontal: MARGIN_HORIZONTAL, marginTop: 5, }}>
                                <Text style={{ color: '#67806D' }}>No counters for this month</Text>
                            </View>}
                    </>

                </View>
            </>
        )
    }

    console.log(new Date().getTimezoneOffset() / 60)

    return (
        <View style={styles.viewContainer}>
            <Modal
                //ref={modalVis}
                //transparent={true}
                isVisible={modalVisible}
                //animationType="fade"
                animationIn='slideInLeft'
                animationOut='slideOutLeft'
                backdropTransitionOutTiming={0}
            >

                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}>
                    <View style={{
                        height: height * 0.6
                    }}>

                        <HistoryDailyModal
                            toggleFunction={toggleModal}
                            selectedObject={selectedObject}
                            displayMonthKey

                            callback={modalCallback}>
                        </HistoryDailyModal>

                    </View>
                </View>
            </Modal>

            <View opacity={isLoading || modalVisible ? 0.3 : 1}
                style={modalVisible ? { flex: 1 } : { flex: 1, }}
            >
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
                                //data={monthlyTasksGrouped}
                                //data={batchTasksGrouped[displayMonthKey]}
                                data={state.batchData[displayMonthKey]}
                                //onViewableItemsChanged={_onViewableItemsChanged}
                                //viewabilityConfig={_viewabilityConfig}
                                showsHorizontalScrollIndicator={false}
                                keyExtractor={(item) => item[0]}
                                renderItem={({ item, index }) =>
                                    <View
                                        style={{ flex: 1, flexDirection: 'row', }}>
                                        <View opacity={Math.min(...viewableArray) == index || 1 ? 1 : 0.7}
                                            style={{ width: width * 0.1, alignItems: 'center', }}>
                                            <Text style={{ color: '#013220', fontWeight: '500', fontSize: 16, marginTop: 5, }}>
                                                {getDayOFWeekFromFormatted(item[0])}
                                            </Text>
                                            <Text style={[styles.overviewTitle, {
                                                fontSize: 26, color: '#013220', fontWeight: '700',
                                                alignSelf: 'auto',
                                                marginBottom: 2,
                                            }]}>{getDayFromFormatted(item[0])}</Text>
                                            {/*<Text style={{ color: '#013220', fontWeight: '550', fontSize: 13, }}
                                            >{getMonthFromFormatted(item[0])}</Text>*/}

                                        </View>
                                        <View style={{ flex: 0.5, borderWidth: 0, alignItems: 'center', }}>
                                            {(Math.min(...viewableArray) == index ||
                                                (viewableArray.includes(monthlyTasksGrouped.length - 1) && viewableArray.includes(index))) || 1 ?
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
                                                (viewableArray.includes(monthlyTasksGrouped.length - 1) && viewableArray.includes(index))) || 1 ?
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
                                                    if (j.entry_type == 0) {
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
                                                                            (viewableArray.includes(monthlyTasksGrouped.length - 1) && viewableArray.includes(index)) || 1}>
                                                                    </HistoryComponent>
                                                                </TouchableOpacity>

                                                            </View>
                                                        )
                                                    } else {
                                                        return (
                                                            <View
                                                                key={j.counter_id}
                                                                style={{ marginHorizontal: MARGIN_HORIZONTAL }}>
                                                                <HistoryCounterComponent
                                                                    session_obj={j}
                                                                    is_active={Math.min(...viewableArray) == index ||
                                                                        (viewableArray.includes(monthlyTasksGrouped.length - 1) && viewableArray.includes(index)) || 1}>
                                                                </HistoryCounterComponent>
                                                            </View>
                                                        )
                                                    }

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