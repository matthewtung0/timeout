import React, { useState, useContext, useCallback } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Dimensions, ActivityIndicator, Image, Platform } from 'react-native';
import { Text, Icon } from 'react-native-elements';
import { Context as CounterContext } from '../context/CounterContext';
import { Context as SessionContext } from '../context/SessionContext'
import { useFocusEffect } from '@react-navigation/native';
import Modal from 'react-native-modal'
import { startOfDay, compareAsc } from 'date-fns';
import AddCounterModal from '../components/AddCounterModal';
import EditCounterModal from '../components/EditCounterModal';
import CounterAddCustomModal from '../components/CounterAddCustomModal';
const constants = require('../components/constants.json')
const img = require('../../assets/tasks_topbar.png')
const BANNER_IMG_HEIGHT = 75;
const BORDER_RADIUS = 20;

const CounterScreen = () => {
    const { height, width } = Dimensions.get('window');
    const { state: counterState, addCounter, setCounterTablesLocked, addTally, fetchUserCounters } = useContext(CounterContext)
    const { setHardReset, } = useContext(SessionContext)

    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingSubtract, setIsLoadingSubtract] = useState(false)
    const [isLoadingCustom, setIsLoadingCustom] = useState(false)

    const [addCounterModalVisible, setAddCounterModalVisible] = useState(false)
    const [editCounterModalVisible, setEditCounterModalVisible] = useState(false)
    const [customNumberModalVisible, setCustomNumberModalVisible] = useState(false);
    const [selectedCounterId, setSelectedCounterId] = useState('')
    const [selectedColorId, setSelectedColorId] = useState('')
    const [selectedName, setSelectedName] = useState('')
    const [selectedCurrentCount, setSelectedCurrentCount] = useState(0)
    const [sortBy, setSortBy] = useState(0);


    const [counterInfo, setCounterInfo] = useState(counterState.userCounters)

    var colorArr = []
    for (var i in constants['colors']) {
        colorArr.push([i, constants['colors'][i]])
    }

    const sortedCounterInfo = counterInfo ? counterInfo.sort(function (a, b) {
        if (sortBy == 0) {
            return String(b.time_created).localeCompare(String(a.time_created))
        }
        else if (sortBy == 1) {
            return String(a.time_created).localeCompare(String(b.time_created))
        }
        else if (sortBy == 2) {
            var comp_a = String(a['activity_name'])
            var comp_b = String(b['activity_name'])
            return comp_a.localeCompare(comp_b)
        } else if (sortBy == 3) {
            var comp_a = parseInt(a['cur_count'])
            var comp_b = parseInt(b['cur_count'])
            return comp_b - comp_a
            //return comp_a.localeCompare(comp_b)
        } else if (sortBy == 4) {
            var comp_a = parseInt(a['point_count'])
            var comp_b = parseInt(b['point_count'])
            var comp_a_second = parseInt(a['cur_count'])
            var comp_b_second = parseInt(b['cur_count'])
            if (comp_b == comp_a) {
                return comp_b_second - comp_a_second
            }
            return comp_b - comp_a
            //return comp_a.localeCompare(comp_b)
        }

        return a.time_created - b.time_created;
    }) : []

    const updateColorCallbackPart2 = (chosenColorId) => {
        setCounterInfo(counterInfo.map(item => {
            if (item.counter_id == selectedCounterId) {
                return { ...item, color_id: chosenColorId }
            }
            return item
        }))
    }

    const deleteCounterCallbackPart2 = (chosenCounterId) => {
        setCounterInfo(counterInfo.filter((req) => req.counter_id != chosenCounterId))
    }


    const customIncrementCallback = async (counter_id, add_by) => {
        if (isLoading || isLoadingSubtract) return;

        if (add_by > 0) {
            setIsLoading(true)
        } else {
            setIsLoadingSubtract(true)
        }
        // preemptively set the cur_count for smoother UI
        setCounterInfo(counterInfo.map(item => {

            if (item.counter_id == counter_id) {
                return {
                    ...item, cur_count: parseInt(item.cur_count) + parseInt(add_by),
                    point_count: parseInt(item.point_count) + parseInt(add_by),
                }
            }
            return item;
        }))
        await setHardReset(true)
        await setCounterTablesLocked(true).then(
            await addTally(counter_id, add_by, addTallyCallback)
        )
        setIsLoading(false)
        setIsLoadingSubtract(false)
    }

    const addTallyValidation = async (counter_id, add_by, cur_tally) => {

        console.log(`Counter id ${counter_id} and cur_tally ${cur_tally} and add_by ${add_by}`)
        if (isLoading || isLoadingSubtract) return;
        if ((parseInt(cur_tally) + parseInt(add_by)) < 0) {
            alert("Can't decrease any more!")
        } else {
            if (add_by > 0) {
                setIsLoading(true)
            } else {
                setIsLoadingSubtract(true)
            }
            // preemptively set the cur_count for smoother UI
            setCounterInfo(counterInfo.map(item => {

                if (item.counter_id == counter_id) {
                    return {
                        ...item, cur_count: parseInt(item.cur_count) + parseInt(add_by),
                        point_count: parseInt(item.point_count) + parseInt(add_by),
                    }
                }
                return item;
            }))
            await setHardReset(true)
            await setCounterTablesLocked(true).then(
                await addTally(counter_id, add_by, addTallyCallback)
            )

            setIsLoading(false)
            setIsLoadingSubtract(false)
        }

    }

    const addTallyCallback = async () => {
        //console.log("COUNTERS IS NOW", counterState.userCounters)
        console.log("Added!")
        setCounterTablesLocked(false)
        await focusEffectFunc() // reset today's counters if it is the next day
    }

    const toggleAddCounterModal = () => {
        setAddCounterModalVisible(!addCounterModalVisible)
    }

    const toggleEditCounterModal = () => {
        setEditCounterModalVisible(!editCounterModalVisible);
    };

    const toggleCustomNumberModal = () => {
        setCustomNumberModalVisible(!customNumberModalVisible);
    };

    const focusEffectFunc = async (temp = false) => {
        var comp = compareAsc(counterState.lastUpdated, startOfDay(new Date()))
        if (comp < 0 || temp) { // need updating
            console.log("Refreshing counters for new day")
            await fetchUserCounters().then(
                (res) => {
                    console.log("RES is ", res)
                    setCounterInfo(res)
                }
            )
        }
    }
    const addCounterCallback = async () => {
        // repull the list now that we've added to it
        await fetchUserCounters().then(
            (res) => {
                console.log("RES is ", res)
                setCounterInfo(res)
            }
        )
        toggleAddCounterModal();
        alert("Counter added successfully!")
    }

    useFocusEffect(
        useCallback(() => {
            focusEffectFunc();
            return () => {
            }
        }, []
        )
    )

    return (
        <View style={{ flex: 1, }}>

            <Modal isVisible={addCounterModalVisible}
                animationIn='slideInUp'
                animationOut='slideOutUp'
                backdropTransitionOutTiming={0}>

                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}>
                    <View style={{ height: 500 }}>
                        <AddCounterModal
                            toggleFunction={toggleAddCounterModal}
                            colorArr={colorArr}
                            currentCounters={counterInfo}
                            callback={addCounterCallback}
                        />
                    </View></View>
            </Modal>

            <Modal isVisible={editCounterModalVisible}
                animationIn='slideInUp'
                animationOut='slideOutUp'
                backdropTransitionOutTiming={0}>

                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}>
                    <View style={{ height: 500 }}>
                        <EditCounterModal
                            toggleFunction={toggleEditCounterModal}
                            colorArr={colorArr}
                            selectedColorId={selectedColorId}
                            selectedCounterName={selectedName}
                            selectedCounterId={selectedCounterId}
                            updateColorCallback2={updateColorCallbackPart2}
                            deleteCounterCallback2={deleteCounterCallbackPart2}
                        />
                    </View></View>
            </Modal>

            <Modal isVisible={customNumberModalVisible}
                animationIn='slideInUp'
                animationOut='slideOutUp'
                backdropTransitionOutTiming={0}>

                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}>
                    <View style={{ height: height * 0.4 }}>
                        <CounterAddCustomModal
                            toggleFunction={toggleCustomNumberModal}
                            colorArr={colorArr}
                            selectedColorId={selectedColorId}
                            selectedCounterName={selectedName}
                            selectedCounterId={selectedCounterId}
                            selectedCurrentCount={selectedCurrentCount}
                            customIncrementCallback={customIncrementCallback}
                        />
                    </View></View>
            </Modal>

            <View style={{ marginTop: Platform.OS === 'ios' ? 100 : 80 }}>
                <Image
                    source={img}
                    resizeMode='stretch'
                    style={{
                        width: width, height: BANNER_IMG_HEIGHT,
                        //borderTopLeftRadius: BORDER_RADIUS, borderTopRightRadius: BORDER_RADIUS,
                    }} />
                <View style={{ position: 'absolute', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', }}>
                    <Text style={[styles.textDefaultBold,
                    { fontSize: 25, color: 'white' }]}>My Counters</Text>
                </View>

            </View>

            <View style={{ paddingBottom: 10, flexDirection: 'row', paddingHorizontal: 12, backgroundColor: '#83B569' }}>
                {sortBy == 0 ?
                    <TouchableOpacity
                        style={[styles.sortContainer,
                        { borderRightWidth: 0, borderTopLeftRadius: 15, borderBottomLeftRadius: 15, },
                        styles.sortContainerSelected]}
                        onPress={() => { setSortBy(0) }}>
                        <Text style={[styles.textDefault, styles.sortText]}>Newest</Text>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity
                        style={[styles.sortContainer,
                        { borderRightWidth: 0, borderTopLeftRadius: 15, borderBottomLeftRadius: 15, }]}
                        onPress={() => { setSortBy(0) }}>
                        <Text style={[styles.textDefault, styles.sortText]}>Newest</Text>
                    </TouchableOpacity>
                }
                {sortBy == 1 ?
                    <TouchableOpacity style={[styles.sortContainer, styles.sortContainerSelected,
                    { borderRightWidth: 0, }]}
                        onPress={() => { setSortBy(1) }}>
                        <Text style={[styles.textDefault, styles.sortText,]}>Oldest</Text>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity style={[styles.sortContainer,
                    { borderRightWidth: 0, }]}
                        onPress={() => { setSortBy(1) }}>
                        <Text style={[styles.textDefault, styles.sortText]}>Oldest</Text>
                    </TouchableOpacity>
                }
                {sortBy == 2 ?
                    <TouchableOpacity style={[styles.sortContainer, styles.sortContainerSelected,
                    { borderRightWidth: 0, }]}
                        onPress={() => { setSortBy(2) }}>
                        <Text style={[styles.textDefault, styles.sortText]}>A-Z</Text>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity style={[styles.sortContainer,
                    { borderRightWidth: 0, }]}
                        onPress={() => { setSortBy(2) }}>
                        <Text style={[styles.textDefault, styles.sortText]}>A-Z</Text>
                    </TouchableOpacity>
                }
                {sortBy == 3 ?
                    <TouchableOpacity style={[styles.sortContainer, styles.sortContainerSelected,
                    { borderRightWidth: 0, }]}
                        onPress={() => { setSortBy(3) }}>
                        <Text style={[styles.textDefault, styles.sortText]}>Lifetime</Text>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity style={[styles.sortContainer,
                    { borderRightWidth: 0, }]}
                        onPress={() => { setSortBy(3) }}>
                        <Text style={[styles.textDefault, styles.sortText]}>Lifetime</Text>
                    </TouchableOpacity>
                }
                {sortBy == 4 ?
                    <TouchableOpacity style={[styles.sortContainer, styles.sortContainerSelected,
                    { borderTopRightRadius: 15, borderBottomRightRadius: 15, }]}
                        onPress={() => { setSortBy(4) }}>
                        <Text style={[styles.textDefault, styles.sortText]}>Today</Text>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity style={[styles.sortContainer,
                    { borderTopRightRadius: 15, borderBottomRightRadius: 15, }]}
                        onPress={() => { setSortBy(4) }}>
                        <Text style={[styles.textDefault, styles.sortText]}>Today</Text>
                    </TouchableOpacity>
                }

            </View>

            {counterState.userCounters.length > 0 ?

                <FlatList
                    style={{ marginTop: 25, marginHorizontal: 20, borderWidth: 0, }}
                    //data={counterInfo}
                    data={sortedCounterInfo}
                    keyExtractor={(item) => item.counter_id}
                    renderItem={({ item }) => {
                        return (
                            <View
                                style={[{ marginBottom: 20, }]}>
                                <View style={{ flexDirection: 'row', flex: 1, }}>

                                    <View style={{
                                        flex: 4, borderWidth: 0, borderRadius: 5, marginStart: 5,
                                        borderColor: constants.colors[item['color_id']]
                                    }}>

                                        <View style={{
                                        }}>

                                            <Text style={[styles.categoryText, styles.textDefault, {
                                                color: 'black',//constants.colors[item['color_id']],
                                                fontSize: 15,
                                            }]}>
                                                {item['activity_name']}</Text>
                                            <Text>
                                                <Text style={[styles.categoryText, styles.textDefaultBold,
                                                {
                                                    color: 'black',//constants.colors[item['color_id']],
                                                    fontSize: 18,
                                                }]}>
                                                    {item['point_count']}

                                                </Text><Text> today </Text>
                                                <Text style={[styles.categoryText, styles.textDefault,
                                                {
                                                    color: 'gray',
                                                    fontSize: 12,
                                                }]}>({item['cur_count']} lifetime)
                                                </Text>
                                            </Text>


                                        </View>
                                    </View>

                                    <View style={{ flex: 1, justifyContent: 'center', }}>
                                        {isLoading && selectedCounterId == item.counter_id ?
                                            <ActivityIndicator
                                                style={{ justifyContent: 'center', }}
                                                size="large" /> :
                                            <TouchableOpacity
                                                style={{
                                                    borderWidth: 1, alignItems: 'center', borderRadius: 10,
                                                    backgroundColor: constants.colors[item['color_id']], height: '100%',
                                                    paddingVertical: 5,
                                                    borderColor: '#A7BEAD'
                                                }}
                                                onPress={() => {
                                                    setSelectedCounterId(item.counter_id)
                                                    addTallyValidation(item.counter_id, 1, item['point_count'])
                                                }}>
                                                <View style={{ height: '100%', justifyContent: 'center' }}>
                                                    <Text style={[styles.textDefaultBold,
                                                    { color: '#67806D', fontSize: 14, }]}>+1</Text>
                                                </View>

                                            </TouchableOpacity>
                                        }
                                    </View>

                                    <View style={{ flex: 2, justifyContent: 'center', }}>
                                        {isLoadingCustom && selectedCounterId == item.counter_id ?
                                            <ActivityIndicator
                                                style={{ justifyContent: 'center', }}
                                                size="large" /> :
                                            <TouchableOpacity
                                                style={{
                                                    borderWidth: 1, alignItems: 'center', borderRadius: 10, marginHorizontal: 5,
                                                    backgroundColor: constants.colors[item['color_id']], height: '100%',
                                                    borderColor: '#A7BEAD'

                                                }}
                                                onPress={() => {
                                                    setSelectedCounterId(item['counter_id'])
                                                    setSelectedColorId(item['color_id'])
                                                    setSelectedName(item['activity_name'])
                                                    setSelectedCurrentCount(item['point_count'])
                                                    toggleCustomNumberModal()
                                                }}>
                                                <View style={{
                                                    flexDirection: 'row', flex: 1, alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}>
                                                    <View style={{ flex: 1, alignItems: 'center' }}>
                                                        <Text style={[styles.textDefault, { color: '#67806D', fontSize: 13, }]}>custom</Text>
                                                    </View>
                                                </View>


                                            </TouchableOpacity>
                                        }
                                    </View>
                                    <View style={{ flex: 1, justifyContent: 'center', }}>
                                        {isLoadingSubtract && selectedCounterId == item.counter_id ?
                                            <ActivityIndicator
                                                style={{ justifyContent: 'center', }}
                                                size="large" /> :
                                            <TouchableOpacity
                                                style={{
                                                    borderWidth: 1, alignItems: 'center', borderRadius: 10,
                                                    paddingVertical: 5,
                                                    backgroundColor: constants.colors[item['color_id']],
                                                    height: '100%', borderColor: '#A7BEAD'
                                                }}
                                                onPress={() => {
                                                    setSelectedCounterId(item.counter_id)
                                                    addTallyValidation(item.counter_id, -1, item['point_count'])
                                                }}>
                                                <View style={{ height: '100%', justifyContent: 'center', }}>
                                                    <Text style={[styles.textDefaultBold,
                                                    { color: '#67806D', fontSize: 14, }]}>-1</Text>
                                                </View>

                                            </TouchableOpacity>
                                        }
                                    </View>

                                    <View style={{ flex: 1, justifyContent: 'center', }}>
                                        <TouchableOpacity
                                            style={{ height: '100%', justifyContent: 'center', }}
                                            onPress={() => {
                                                setSelectedCounterId(item.counter_id)
                                                setSelectedColorId(item.color_id)
                                                setSelectedName(item.activity_name)
                                                toggleEditCounterModal()
                                            }

                                            }>
                                            <Icon name='ellipsis-horizontal' type='ionicon' size={20} color='#A7BEAD' />
                                        </TouchableOpacity>
                                    </View>

                                </View>

                                <View style={{
                                    height: 2, borderWidth: 1, marginTop: 10,
                                    //borderColor: constants.colors[item['color_id']]
                                    borderColor: '#DCDBDB',
                                }}>

                                </View>
                            </View >
                        )
                    }}>
                </FlatList >
                : null}

            <TouchableOpacity style={[styles.addCounterButton, {
                width: width / 1.8, justifyContent: 'center',
            }]}
                onPress={() => {
                    toggleAddCounterModal();

                    //addCategory(categoryName, new Date(), chosenColor, isEnabled, resetInputs)
                }}>
                <View style={{ height: '100%', justifyContent: 'center', }}>
                    <Text style={[styles.textDefault, styles.addCounterText, {}]}>
                        Add New Counter</Text>
                </View>


            </TouchableOpacity>
        </View >
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
        fontSize: 20,
        marginTop: 70,
    },
    input: {
        backgroundColor: 'white',
        borderRadius: 15,
        marginHorizontal: 27,
        paddingHorizontal: 17,
    },
    inputStyleContainer: {
        borderBottomWidth: 0,
    },
    rightIconInput: {
        backgroundColor: 'brown',
    },
    colorSquare: {
        width: 50,
        height: 50,
        marginHorizontal: 5,
        marginVertical: 20,
    },
    categoryText: {
        marginBottom: 1,
    },
    addCounterButton: {
        margin: 10,
        height: 40,
        backgroundColor: '#ABC57E',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    addCounterText: {
        fontWeight: '600',
        color: 'white',
        fontSize: 18,
    },
    sortText: {
        textAlign: 'center', fontSize: 12, justifyContent: 'center', color: 'white',
    },
    sortContainer: {
        borderWidth: 1, flex: 1,
        paddingVertical: 7, borderColor: 'white',
    },
    sortContainerSelected: {
        backgroundColor: '#8DC867',
    },

})

export default CounterScreen;