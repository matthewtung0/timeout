import React, { useState, useCallback, useMemo } from 'react';
import {
    View, StyleSheet, Text, TouchableOpacity, TextInput, FlatList, Dimensions, ActivityIndicator,
    TouchableWithoutFeedback, Keyboard, Alert, Platform
} from 'react-native';
import timeoutApi from '../api/timeout';
import { useFocusEffect } from '@react-navigation/native';
import { format, parseISO, startOfMonth, endOfMonth } from 'date-fns';
import { Icon } from 'react-native-elements';
import DropDownComponent2 from '../components/DropDownComponent2';
import HistoryCounterComponent from '../components/HistoryCounterComponent';
import Modal from 'react-native-modal'
import HistoryComponent from '../components/HistoryComponent';
import HistoryDailyModal from '../components/HistoryDetailModal'
import enUS from 'date-fns/locale/en-US';
const constants = require('../components/constants.json')

const HideKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>
);
const HistorySearchScreen = ({ navigation, route: { params } }) => {
    //const { } = params;
    const { height, width } = Dimensions.get('window');
    const [searchTerm, setSearchTerm] = useState('')
    const [searchCatId, setSearchCatId] = useState('All categories')
    const [searchCatName, setSearchCatName] = useState('All categories')
    const [searchCatColorId, setSearchCatColorId] = useState('c10')
    const [isLoading, setIsLoading] = useState(false)
    const [noResultsMessage, setNoResultsMessage] = useState('');

    var toRefresh = true;

    const [batchData, setBatchData] = useState({})
    const [batchDataForSummary, setBatchDataForSummary] = useState({})
    const [selectedObject, setSelectedObject] = useState({})
    const [modalVisible, setModalVisible] = useState(false)
    const MARGIN_HORIZONTAL = 20;

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    }
    const modalCallback = async (item_deleted = false) => {
        if (item_deleted) {
            toRefresh = true;
        }
        if (item_deleted && 0) {
            var endTime = endOfMonth(state.calendarDate)
            var startTime = startOfMonth(state.calendarDate)
            await fetchMultipleMonths(startTime, endTime)
        }
    }

    const byDayKey = (dt, parse = true) => {
        if (parse) {
            var actual_date = format(parseISO(dt), 'M/dd/yyyy', { locale: enUS })
            var actual_parts = actual_date.split('/')
            var yr = actual_parts[2]
            var month = actual_parts[0]
            var day = actual_parts[1]
            return month + "/" + day + "/" + yr
        } else {
            var actual_date = format(dt, 'M/dd/yyyy', { locale: enUS })
            var actual_parts = actual_date.split('/')
            var yr = actual_parts[2]
            var month = actual_parts[0]
            var day = actual_parts[1]

            return month + "/" + day + "/" + yr
        }
    }

    // only group by day, since we will include all months together
    const groupMonthlyTasksForSearch = (monthSessions) => {
        var overallMap = {}
        for (var i = 0; i < monthSessions.length; i++) {
            var session = monthSessions[i]
            console.log(session)

            if (session.entry_type == 1) { // if counter type
                var dayKey = session.date_key
            } else {
                var dayKey = byDayKey(session.time_start)
            }
            //var monthKey = byMonthKey(session.time_start)

            if (dayKey in overallMap) {
                overallMap[dayKey].push(session)
            } else {
                overallMap[dayKey] = [session]
            }
        }
        var mapToArray = Object.keys(overallMap).map((key) => [key, overallMap[key]])
        mapToArray.sort((a, b) => {
            var a_split = a[0].split('/');
            var b_split = b[0].split('/');
            var a_yr = parseInt(a_split[2])
            var a_month = parseInt(a_split[0])
            var a_day = parseInt(a_split[1])
            var b_yr = parseInt(b_split[2])
            var b_month = parseInt(b_split[0])
            var b_day = parseInt(b_split[1])

            if (a_yr > b_yr) {
                return -1
            }
            if (b_yr > a_yr) {
                return 1
            }
            if (a_month > b_month) {
                return -1
            }
            if (b_month > a_month) {
                return 1
            }
            if (a_day > b_day) {
                return -1
            }
            return 1
        })
        console.log("OVERALL MAP ", mapToArray)
        return mapToArray
    }



    const searchSessions = async () => {
        if (searchCatId == 'All categories' && searchTerm == '') {
            // do not let search return all - may be too many
            alert("Please enter some search terms or categories.")
            return;
        }
        try {
            setIsLoading(true)

            /* TEMPORARY */
            const results = await timeoutApi.get('/searchSessionsAndCounters',
                { params: { searchTerm: searchTerm.toLowerCase(), searchCatId: searchCatId } })



            console.log("Results are now", results.data.combinedData)

            //console.log("RESULTS ARE : ", results.data.groupedData)
            if (results.data.combinedData.length == 0) {
                setNoResultsMessage("No results")
            } else {
                setNoResultsMessage("")
            }
            let groupedData = groupMonthlyTasksForSearch(results.data.combinedData)

            setBatchData(groupedData)
            //setBatchDataForSummary(results.data.groupedDataForSummary)
            setIsLoading(false)

        } catch (err) {
            alert("Something went wrong. Please try again later")
            setIsLoading(false)
            console.log("Problem getting multiple month sessions", err)
        }
    }


    useFocusEffect(
        useCallback(() => {
        }, [])
    )


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
    const getYearFromFormatted = (dt) => {
        var actual_dt = new Date(dt)
        return format(actual_dt, 'y')
    }

    const flatListItem = (item) => {
        return (
            <View
                style={{ flex: 1, flexDirection: 'row', }}>
                <View
                    style={{ width: width * 0.1, alignItems: 'center', }}>

                    <Text style={[styles.textDefault, { color: '#013220', fontSize: 12, marginTop: 5, }]}>
                        {getMonthFromFormatted(item[0])} {getDayFromFormatted(item[0])}
                    </Text>

                    <Text style={[styles.overviewTitle, styles.textDefaultBold, {
                        fontSize: 12, color: '#013220',
                        alignSelf: 'auto',
                    }]}>{getYearFromFormatted(item[0])}</Text>
                    {/*<Text style={[styles.textDefault, { color: '#013220', fontSize: 14, marginTop: 5, }]}>
                        {getDayOFWeekFromFormatted(item[0])}
                </Text>*/}


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
        if (batchData.length == 0) {
            return (
                <View style={{ alignContent: 'center', marginTop: 20, }}>
                    <Text style={[styles.textDefault, {
                        textAlign: 'center', color: '#67806D',
                        fontSize: 16,
                    }]}>{noResultsMessage}</Text>
                </View>

            )
        }
        return (
            <FlatList
                //ListHeaderComponent={renderHeader}
                style={{ borderWidth: 0, marginHorizontal: 10, marginTop: 15, }}
                horizontal={false}
                //initialNumToRender={5}
                //data={monthlyTasksGrouped}
                //data={batchTasksGrouped[displayMonthKey]}
                data={batchData}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item[0]}
                renderItem={({ item }) =>
                    flatListItem(item)
                }
            >
            </FlatList>
        )
    }

    const memoizedFlatList = useMemo(flatListItself, [batchData])
    return (
        <HideKeyboard>
            <View style={[styles.container, { paddingTop: Platform.OS === 'ios' ? 120 : 120 }]}>


                <Modal
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
                            height: height * 0.7
                        }}>

                            <HistoryDailyModal
                                toggleFunction={toggleModal}
                                selectedObject={selectedObject}

                                callback={modalCallback}>
                            </HistoryDailyModal>

                        </View>
                    </View>
                </Modal>

                <View style={{ marginHorizontal: 20, }}>
                    <Text style={[styles.textDefaultSemiBold, { color: '#67806D' }]}>
                        Search by keyword:</Text>

                    <TextInput
                        style={[styles.inputStyle, styles.textDefault, {
                            borderWidth: 1, marginHorizontal: MARGIN_HORIZONTAL,
                            borderColor: '#8CC768', fontSize: 16, color: '#67806D', borderRadius: 20, paddingHorizontal: 20,
                            backgroundColor: 'white',
                            height: height * 0.04, marginTop: 10,
                        }]}
                        inputContainerStyle={styles.inputStyleContainer}
                        placeholder='Search test'
                        placeholderTextColor={'#C0C0C0'}
                        autoCorrect={false}
                        value={searchTerm}
                        onChangeText={setSearchTerm}
                    />

                    <Text style={[styles.textDefaultSemiBold, { marginVertical: 10, color: '#67806D', }]}>
                        Search by specific category:</Text>

                    <DropDownComponent2
                        allCategoriesOption={true}
                        isInModal={false}
                        categoryId={searchCatId}
                        catName={searchCatName}
                        colorId={searchCatColorId}
                        setCatNameCallback={setSearchCatName}
                        setColorIdCallback={setSearchCatColorId}
                        setCategoryIdCallback={setSearchCatId}
                    />
                    <TouchableOpacity
                        style={{
                            borderWidth: 1, paddingVertical: 10, width: '30%', alignItems: 'center', alignSelf: 'center',
                            marginTop: 20, borderRadius: 10, borderColor: '#67806D',
                        }}
                        onPress={() => { searchSessions() }}>
                        <View>
                            <Text style={[styles.textDefaultBold, { fontSize: 16, color: '#67806D' }]}>Search</Text>
                        </View>

                    </TouchableOpacity>
                </View>


                {/*<Text>Batch data: {JSON.stringify(batchData)}</Text>*/}
                <View style={{ flex: 1 }}>
                    {isLoading ?
                        <ActivityIndicator
                            style={{ marginTop: 20, }}
                            size="large" color="#67806D"></ActivityIndicator>
                        :
                        memoizedFlatList
                    }
                </View>
                <TouchableOpacity
                    style={[styles.backButton, { marginTop: Platform.OS === 'ios' ? 80 : 80 }]}
                    onPress={() => { navigation.navigate('HistoryDaily', { toRefresh }) }}>
                    <Icon
                        name='arrow-back-outline'
                        type='ionicon'
                        size={35}
                        color={'#67806D'} />
                </TouchableOpacity>

            </View>
        </HideKeyboard>


    )
}
HistorySearchScreen.navigationOptions = () => { return { headerShown: false, }; }
const styles = StyleSheet.create({
    textDefaultBold: {
        fontFamily: 'Inter-Bold',
    },
    textDefaultSemiBold: {
        fontFamily: 'Inter-SemiBold',
    },
    textDefault: {
        fontFamily: 'Inter-Regular',
    },
    container: {
        flex: 1,
    },
    backButton: {
        position: 'absolute',
        width: 50, height: 50,
        marginLeft: 5,
    },

})

export default HistorySearchScreen;