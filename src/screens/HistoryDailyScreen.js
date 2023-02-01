import React, { useContext, useState, useCallback, useMemo } from 'react';
import {
    View, StyleSheet, Text, Dimensions, ActivityIndicator, TouchableOpacity, FlatList, TextInput, //Modal
} from 'react-native';
import {
    startOfMonth, endOfMonth, addMonths, subMonths, compareAsc, format,
} from 'date-fns';
import { Icon } from 'react-native-elements'
import MonthlySumComponent from '../components/MonthlySumComponent';
import { useFocusEffect } from '@react-navigation/native';
import { Context as SessionContext } from '../context/SessionContext';
import { Context as CounterContext } from '../context/CounterContext';
import HistoryComponent from '../components/HistoryComponent';
import HistoryCounterComponent from '../components/HistoryCounterComponent';
import MonthlyCounterComponent from '../components/MonthlyCounterComponent';
import Modal from 'react-native-modal'
import HistoryDailyModal from '../components/HistoryDetailModal'
import enUS from 'date-fns/locale/en-US';
const constants = require('../components/constants.json')

const HistoryDailyScreen = ({ navigation }) => {

    console.log("History daily screen rerender")
    const MARGIN_HORIZONTAL = 10;
    const { height, width } = Dimensions.get('window');
    const { state, setOffsetFetched, fetchMultipleMonths, resetCalendarDate,
        setCurOffset, setHardReset, resetMostCurrentDate } = useContext(SessionContext)
    const { state: counterState } = useContext(CounterContext);

    const [displayedMonth, setDisplayedMonth] = useState(format(state.calendarDate, 'MMMM', { locale: enUS }))
    const [displayMonthKey, setDisplayedMonthKey] = useState(format(state.calendarDate, 'M/yyyy', { locale: enUS }).toString())
    const [displayedYear, setDisplayedYear] = useState(state.calendarDate.getFullYear())


    const [isLoading, setIsLoading] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [selectedObject, setSelectedObject] = useState({})
    const [searchField, setSearchField] = useState('');

    // number of months prior to current month that is currently fetched from server

    //const [offsetFetched, setOffsetFetched] = useState(3);
    //const [curOffset, setCurOffset] = useState(0);

    const longMonth = (date) => { return format(date, 'MMMM', { locale: enUS }) }


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
        setDisplayedMonth(longMonth(dt))
        var monthKey = format(dt, 'M/yyyy', { locale: enUS }).toString()
        setDisplayedMonthKey(monthKey)
        setDisplayedYear(dt.getFullYear())

        await resetCalendarDate(dt)

        if (state.curOffset + 1 > state.offsetFetched) { // need to fetch more 
            setIsLoading(true)
            var endTime = endOfMonth(dt)
            var startTime = startOfMonth(subMonths(startOfMonth(dt), 3))
            //await fetchMultipleMonths(startTime, endTime, groupMonthlyTasks)
            await fetchMultipleMonths(startTime, endTime)
            await setOffsetFetched(state.offsetFetched + 4)
        }

        await setCurOffset(state.curOffset + 1)

        setIsLoading(false)
    }

    const getDayFromFormatted = (dt) => {
        var actual_parts = dt.split('/')
        var month = actual_parts[0]
        var day = actual_parts[1]
        var yr = actual_parts[2]
        return day
    }

    const getDayOFWeekFromFormatted = (dt) => {
        var actual_dt = new Date(dt);
        return format(actual_dt, 'E');
    }

    const focusEffectMonthChange = async () => {
        // check if it is the next month
        var comp = compareAsc(state.mostCurrentDate, startOfMonth(new Date()))
        if (comp < 0) {
            console.log("New month, do hard reset");
            await resetMostCurrentDate(new Date());
            // is the next month, need to recalibrate the view
            var dt = new Date()
            var endTime = endOfMonth(dt)
            var startTime = startOfMonth(subMonths(startOfMonth(dt), 3))
            await fetchMultipleMonths(startTime, endTime, null, true).then(
                await resetCalendarDate(startOfMonth(dt)).then(
                    await setOffsetFetched(3).then(
                        await setCurOffset(0)
                    )
                )
            )
        }
    }

    const focusEffectFunc = async () => {

        console.log(`Focus effect with calendar date ${state.calendarDate} and offset ${state.curOffset}, 
        counter tables locked: ${counterState.counterTablesLocked}, needReset: ${state.needHardReset}`)

        if (state.needHardReset && !counterState.counterTablesLocked) {
            setIsLoading(true)
            // if reset needed, refresh most recent month
            var endTime = endOfMonth(new Date())
            var startTime = startOfMonth(new Date())
            await fetchMultipleMonths(startTime, endTime).then(
                setHardReset(false)
            )
            setIsLoading(false)
        }
        setDisplayedMonth(longMonth(state.calendarDate))
        setDisplayedYear(state.calendarDate.getFullYear())
        setDisplayedMonthKey(format(state.calendarDate, 'M/yyyy', { locale: enUS }).toString());

    }

    useFocusEffect(
        useCallback(() => {
            focusEffectMonthChange()
            return () => {
            }
        }, [])
    )

    useFocusEffect(
        useCallback(() => {
            focusEffectFunc();
            return () => {
            }
        }, [state.calendarDate, state.curOffset, state.needHardReset, counterState.counterTablesLocked]
        )
    )

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

    const renderHeader = () => {
        return (
            <>
                {/* ======= SUMMARY CONTAINER ======== */}
                {searchField != '' ?
                    null :
                    <View style={{
                        backgroundColor: 'white', borderBottomLeftRadius: 10, borderBottomRightRadius: 10, paddingVertical: 10,
                        borderTopWidth: 0,
                        borderWidth: 3, borderColor: '#8CC768', marginBottom: 20,
                    }}>
                        <View style={{ flex: 1, flexDirection: 'row', }}>
                            <View>
                                {/*<Text style={[styles.overviewTitle, styles.textDefaultBold,
                            {
                                fontSize: 22, alignSelf: 'auto',
                                marginBottom: 0, color: '#67806D', marginHorizontal: 10,
                            }]}>{displayedMonth} Overview</Text>*/}
                            </View>
                        </View>
                        <>

                            <Text style={[styles.overviewTitle, styles.textDefaultBold,
                            {
                                fontSize: 17, alignSelf: 'auto', marginHorizontal: 10,
                                marginTop: 2, marginBottom: 10, color: '#67806D', marginTop: 5,
                            }]}>
                                {typeof (state.batchDataForSummary[displayMonthKey]) !== 'undefined' ?
                                    state.batchDataForSummary[displayMonthKey].filter(
                                        (req) => req.entry_type == 0).length : 0} Tasks</Text>

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
                            <View
                                style={{
                                    borderBottomColor: 'grey',
                                    borderBottomWidth: 0.8,
                                    marginTop: 15,
                                    marginHorizontal: MARGIN_HORIZONTAL
                                }}
                            />
                            <Text style={[styles.overviewTitle, styles.textDefaultBold, {
                                fontSize: 17, alignSelf: 'auto',
                                marginHorizontal: MARGIN_HORIZONTAL, marginBottom: 3, color: '#67806D', marginTop: 10,
                            }]}>{typeof (state.batchDataForSummary[displayMonthKey]) !== 'undefined' ?
                                state.batchDataForSummary[displayMonthKey].filter(
                                    (req) => req.entry_type == 1).length : 0} Counters</Text>


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

                }
            </>
        )
    }

    const flatListItem = (item) => {
        if (item[1].filter(req => req.activity_name.toLowerCase().includes(
            searchField.toLowerCase())).length == 0) {
            return null
        }
        return (
            <View
                style={{ flex: 1, flexDirection: 'row', }}>
                <View
                    style={{ width: width * 0.1, alignItems: 'center', }}>

                    <Text style={[styles.textDefault, { color: '#013220', fontSize: 14, marginTop: 5, }]}>
                        {getDayOFWeekFromFormatted(item[0])}
                    </Text>
                    <Text style={[styles.overviewTitle, styles.textDefaultBold, {
                        fontSize: 20, color: '#013220',
                        alignSelf: 'auto',
                    }]}>{getDayFromFormatted(item[0])}</Text>

                </View>
                <View style={{ flex: 0.3, alignItems: 'center', marginLeft: MARGIN_HORIZONTAL / 2 }}>
                    <View style={{
                        width: 15, height: 15, borderRadius: 7.5,
                        borderWidth: 2, borderColor: '#8CC768',
                        backgroundColor: '#8CC768'
                    }} />
                    <View style={{
                        height: '100%', width: 4, backgroundColor: '#8CC768',
                        borderWidth: 2, borderColor: '#8CC768',
                    }}></View>

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
                        {item[1]
                            .filter(req => (req.activity_name.toLowerCase().includes(searchField.toLowerCase())))
                            .map((j) => {
                                if (j.entry_type == 0) {
                                    return (
                                        <View
                                            key={j.activity_id}
                                            style={{ marginRight: MARGIN_HORIZONTAL, paddingLeft: MARGIN_HORIZONTAL * 2, }}>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    setSelectedObject(j)
                                                    toggleModal()
                                                }}
                                                style={{}}
                                            >
                                                <HistoryComponent
                                                    session_obj={j}
                                                    is_active={true}>
                                                </HistoryComponent>
                                            </TouchableOpacity>

                                        </View>
                                    )
                                } else {
                                    return (
                                        <View
                                            key={j.counter_id}
                                            style={{
                                                marginRight: MARGIN_HORIZONTAL, marginLeft: MARGIN_HORIZONTAL,
                                                paddingLeft: MARGIN_HORIZONTAL,
                                                backgroundColor: constants.colors[j.color_id]
                                            }}>
                                            <HistoryCounterComponent
                                                session_obj={j}
                                                is_active={true}>
                                            </HistoryCounterComponent>
                                        </View>
                                    )
                                }

                            })
                        }
                    </View>
                </View>
            </View>
        )
    }

    const flatListItself = () => {
        return (
            <FlatList
                ListHeaderComponent={renderHeader}
                style={{}}
                horizontal={false}
                //initialNumToRender={5}
                //data={monthlyTasksGrouped}
                //data={batchTasksGrouped[displayMonthKey]}
                data={state.batchData[displayMonthKey]}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item[0]}
                renderItem={({ item }) =>
                    flatListItem(item)
                }
            >
            </FlatList>
        )
    }

    const memoizedFlatList = useMemo(flatListItself, [state.batchData[displayMonthKey], searchField])

    return (
        <><View style={styles.viewContainer}>
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
                    flex: 0.7, flexDirection: 'row', alignItems: 'center', borderTopLeftRadius: 15, borderTopRightRadius: 15,
                    backgroundColor: '#8CC768', marginHorizontal: MARGIN_HORIZONTAL,
                }}>
                    <View style={{ flex: 1, }}>
                        <TouchableOpacity
                            onPress={() => { if (!isLoading) { goToPrevMonth() } }
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
                        <Text style={[styles.overviewTitle, styles.textDefaultBold, { fontSize: 20, }]}>{displayedMonth} {displayedYear}</Text>
                    </View>

                    <View style={{ flex: 1, }}>
                        <TouchableOpacity
                            onPress={() => { if (!isLoading) { goToNextMonth() } }
                            }>
                            {compareAsc(new Date(), addMonths(startOfMonth(state.calendarDate), 1)) <= 0 ?
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


                <View style={{ flex: 12, borderWidth: 0 }}>


                    {/*/ =============== TASKS DETAIL CONTAINER ===============*/}
                    <View style={{
                        backgroundColor: 'white', borderRadius: 0,
                        paddingVertical: 0, marginHorizontal: MARGIN_HORIZONTAL,
                        marginTop: 0,
                        flex: 1,
                    }}>

                        <View style={{ flex: 1, }}>
                            {isLoading ? null :
                                memoizedFlatList
                            }

                        </View>
                    </View>
                </View>
            </View>

            {
                isLoading ?
                    <View style={{
                        width: '100%', height: '100%', position: 'absolute',
                        justifyContent: 'center', alignItems: 'center',
                    }}>
                        <ActivityIndicator style={{ width: 100, height: 100 }} size="large" color="black" />
                    </View>
                    :
                    null
            }


        </View >
            <View

                style={{ position: 'absolute', alignSelf: 'flex-end', marginTop: height / 10 }}>
                <TouchableOpacity
                    style={{
                        borderWidth: 1, borderRadius: 10,
                        paddingHorizontal: 5, paddingVertical: 5, backgroundColor: '#67806D', marginRight: 10,
                        borderColor: '#67806D'
                    }}
                    onPress={() => { navigation.navigate('HistorySearch') }}>
                    <Text style={[styles.textDefault, { color: 'white', }]}>Go to search</Text>
                </TouchableOpacity>
            </View>


        </>

    )
}
HistoryDailyScreen.navigationOptions = () => { return { headerShown: false, }; }
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
        backgroundColor: 'white',
    },
    overviewTitle: {
        fontWeight: 'bold',
        fontSize: 22,
        color: 'white',
    },
    inputStyle: {
        marginTop: 5,
        backgroundColor: 'white',
        borderRadius: 15,
        paddingHorizontal: 10,
        alignSelf: 'center',
        color: 'gray',
        fontSize: 18,
        fontWeight: '600',
    }
})

export default HistoryDailyScreen;