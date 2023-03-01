import React, { useState, useContext, useCallback, useMemo } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Dimensions, Image, Platform } from 'react-native';
import { Text } from 'react-native-elements';
import { Context as CounterContext } from '../context/CounterContext';
import { useFocusEffect } from '@react-navigation/native';
import Modal from 'react-native-modal'
import { useHeaderHeight } from '@react-navigation/elements';
import { startOfDay, compareAsc } from 'date-fns';
import AddCounterModal from '../components/AddCounterModal';
import EditCounterModal from '../components/EditCounterModal';
import tinycolor from 'tinycolor2';
const constants = require('../components/constants.json')
const img = require('../../assets/tasks_topbar.png')
import { Shadow } from 'react-native-shadow-2';
import CounterComponent from '../components/CounterComponent';
const BANNER_IMG_HEIGHT = 90;
const BORDER_RADIUS = 20;

const CounterScreen = () => {
    const { height, width } = Dimensions.get('window');
    const headerHeight = useHeaderHeight();
    const BANNER_IMG_HEIGHT = headerHeight ? headerHeight : 90;
    const { state: counterState, setCounterTablesLocked, fetchUserCounters } = useContext(CounterContext)

    const [addCounterModalVisible, setAddCounterModalVisible] = useState(false)
    const [editCounterModalVisible, setEditCounterModalVisible] = useState(false)
    const [selectedCounterId, setSelectedCounterId] = useState('')
    const [selectedColorId, setSelectedColorId] = useState('')
    const [selectedName, setSelectedName] = useState('')
    const [selectedCurrentCount, setSelectedCurrentCount] = useState(0)
    const [sortBy, setSortBy] = useState(0);

    const [sortedCounters, setSortedCounters] = useState(counterState.userCounters ? counterState.userCounters.sort(function (a, b) {
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
    }) : [])

    const toSort = (counterArray, sortBy) => {
        return counterArray ? counterArray.sort(function (a, b) {
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
    }
    var colorArr = []
    for (var i in constants['colors']) {
        colorArr.push([i, constants['colors'][i]])
    }

    const updateColorCallbackPart2 = (chosenColorId) => {
        console.log("Sorting these", counterState.userCounters)
        setSortedCounters(toSort(counterState.userCounters, sortBy))
    }

    const deleteCounterCallbackPart2 = async (chosenCounterId) => {
        await fetchUserCounters()
        //setCounterInfo(counterInfo.filter((req) => req.counter_id != chosenCounterId))
    }

    const addTallyCallback = async () => {
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

    const focusEffectFunc = async (temp = false) => {

        var comp = compareAsc(counterState.lastUpdated, startOfDay(new Date()))
        console.log(`Checking comparison ${comp}`)
        if (comp < 0 || temp) { // need updating
            console.log("Refreshing counters for new day")
            await fetchUserCounters()
        }
    }
    const addCounterCallback = async () => {
        // repull the list now that we've added to it
        await fetchUserCounters()
        toggleAddCounterModal();
        alert("Counter added successfully!")
    }

    const addNewCounterButton = () => {
        return (
            <TouchableOpacity style={[styles.addCounterButton, {
                width: width / 1.8, justifyContent: 'center', marginBottom: 25,
                shadowOffset: {
                    width: 0,
                    height: 6,
                },
                shadowOpacity: 1,
                shadowRadius: 0,
                shadowColor: tinycolor('#8CC768').darken(25).toString()
            }]}
                onPress={() => {
                    toggleAddCounterModal();

                    //addCategory(categoryName, new Date(), chosenColor, isEnabled, resetInputs)
                }}>
                <View style={{ height: '100%', justifyContent: 'center', }}>
                    <Text style={[styles.textDefaultMed, styles.addCounterText, {}]}>
                        Add New Counter</Text>
                </View>


            </TouchableOpacity>
        )
    }

    useFocusEffect(
        useCallback(() => {
            focusEffectFunc();
            return () => {
            }
        }, []
        )
    )
    useFocusEffect(
        useCallback(() => {
            console.log("SETTING SORTED COUNTERS");
            setSortedCounters(toSort(counterState.userCounters, sortBy))
            return () => {
            }
        }, [counterState.userCounters])
    )

    const flatListItself = () => {
        return (
            <FlatList
                style={{ marginTop: 25, marginHorizontal: 20, borderWidth: 0 }}
                //data={sortedCounters}
                data={counterState.userCounters}
                keyExtractor={(item) => item.counter_id}
                renderItem={({ item }) => {
                    return (
                        <CounterComponent
                            item={item}
                            colorArr={colorArr}
                            addTallyCallback={addTallyCallback}
                            setSelectedCounterId={setSelectedCounterId}
                            setSelectedColorId={setSelectedColorId}
                            setSelectedName={setSelectedName}
                            setSelectedCurrentCount={setSelectedCurrentCount}
                            toggleEditCounterModal={toggleEditCounterModal}
                        />
                    )
                }}>
            </FlatList >
        )
    }

    //const memoizedFlatList = useMemo(flatListItself, [sortedCounters, sortBy])

    return (
        <View style={{ flex: 1, }}>

            {/*<View style={{
                position: 'absolute',
                height: '100%',
                width: '100%',
            }}>
                <Image source={test_bg7}
                    style={{ height: '100%', width: '100%' }}
                    resizeMode='stretch'
                />
        </View>*/}

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
                            currentCounters={counterState.userCounters}
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

            <View style={{ marginTop: Platform.OS === 'ios' ? 0 : 0 }}>
                <Image
                    source={img}
                    resizeMode='stretch'
                    style={{
                        width: width, height: BANNER_IMG_HEIGHT,
                        //borderTopLeftRadius: BORDER_RADIUS, borderTopRightRadius: BORDER_RADIUS,
                    }} />
                <View style={{
                    position: 'absolute', width: '100%', height: '100%',
                    alignItems: 'center', justifyContent: 'flex-end',
                    paddingBottom: 10,
                }}>
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
                        onPress={() => {
                            setSortBy(0)
                            setSortedCounters(toSort(counterState.userCounters, 0))
                        }}>
                        <Text style={[styles.textDefault, styles.sortText]}>Newest</Text>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity
                        style={[styles.sortContainer,
                        { borderRightWidth: 0, borderTopLeftRadius: 15, borderBottomLeftRadius: 15, }]}
                        onPress={() => {
                            setSortBy(0)
                            setSortedCounters(toSort(counterState.userCounters, 0))
                        }}>
                        <Text style={[styles.textDefault, styles.sortText]}>Newest</Text>
                    </TouchableOpacity>
                }
                {sortBy == 1 ?
                    <TouchableOpacity style={[styles.sortContainer, styles.sortContainerSelected,
                    { borderRightWidth: 0, }]}
                        onPress={() => {
                            setSortBy(1)
                            setSortedCounters(toSort(counterState.userCounters, 1))
                        }}>
                        <Text style={[styles.textDefault, styles.sortText,]}>Oldest</Text>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity style={[styles.sortContainer,
                    { borderRightWidth: 0, }]}
                        onPress={() => {
                            setSortBy(1)
                            setSortedCounters(toSort(counterState.userCounters, 1))
                        }}>
                        <Text style={[styles.textDefault, styles.sortText]}>Oldest</Text>
                    </TouchableOpacity>
                }
                {sortBy == 2 ?
                    <TouchableOpacity style={[styles.sortContainer, styles.sortContainerSelected,
                    { borderRightWidth: 0, }]}
                        onPress={() => {
                            setSortBy(2)
                            setSortedCounters(toSort(counterState.userCounters, 2))
                        }}>
                        <Text style={[styles.textDefault, styles.sortText]}>A-Z</Text>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity style={[styles.sortContainer,
                    { borderRightWidth: 0, }]}
                        onPress={() => {
                            setSortBy(2)
                            setSortedCounters(toSort(counterState.userCounters, 2))
                        }}>
                        <Text style={[styles.textDefault, styles.sortText]}>A-Z</Text>
                    </TouchableOpacity>
                }
                {sortBy == 3 ?
                    <TouchableOpacity style={[styles.sortContainer, styles.sortContainerSelected,
                    { borderRightWidth: 0, }]}
                        onPress={() => {
                            setSortBy(3)
                            setSortedCounters(toSort(counterState.userCounters, 3))
                        }}>
                        <Text style={[styles.textDefault, styles.sortText]}>Lifetime</Text>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity style={[styles.sortContainer,
                    { borderRightWidth: 0, }]}
                        onPress={() => {
                            setSortBy(3)
                            setSortedCounters(toSort(counterState.userCounters, 3))
                        }}>
                        <Text style={[styles.textDefault, styles.sortText]}>Lifetime</Text>
                    </TouchableOpacity>
                }
                {sortBy == 4 ?
                    <TouchableOpacity style={[styles.sortContainer, styles.sortContainerSelected,
                    { borderTopRightRadius: 15, borderBottomRightRadius: 15, }]}
                        onPress={() => {
                            setSortBy(4)
                            setSortedCounters(toSort(counterState.userCounters, 4))
                        }}>
                        <Text style={[styles.textDefault, styles.sortText]}>Today</Text>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity style={[styles.sortContainer,
                    { borderTopRightRadius: 15, borderBottomRightRadius: 15, }]}
                        onPress={() => {
                            setSortBy(4)
                            setSortedCounters(toSort(counterState.userCounters, 4))
                        }}>
                        <Text style={[styles.textDefault, styles.sortText]}>Today</Text>
                    </TouchableOpacity>
                }

            </View>

            {counterState.userCounters.length > 0 ?
                flatListItself()
                : null}
            {Platform.OS === 'ios' ?
                addNewCounterButton()
                :
                <View style={{ alignItems: 'center', margin: 10, }}>

                    <Shadow distance={2}
                        offset={[0, 5]}
                        style={{ width: width / 1.8 - 5 }}
                        paintInside={true}
                        startColor={tinycolor('#8CC768').darken(25).toString()}
                        endColor={tinycolor('#8CC768').darken(25).toString()}
                        sides={{
                            'bottom': true,
                            'start': true,
                            'end': true,
                            'top': true
                        }}
                        corners={{
                            'topStart': true,
                            'topEnd': true,
                            'bottomStart': true,
                            'bottomEnd': true
                        }}

                    >
                        <TouchableOpacity style={[{
                            height: 40,
                            backgroundColor: '#8CC768',
                            alignItems: 'center',
                            alignSelf: 'center',
                            justifyContent: 'center',
                            borderRadius: 10,
                            width: width / 1.8, justifyContent: 'center', marginBottom: 25,
                            shadowOffset: {
                                width: 0,
                                height: 6,
                            },
                            shadowOpacity: 1,
                            shadowRadius: 0,
                            shadowColor: tinycolor('#8CC768').darken(25).toString()
                        }]}
                            onPress={() => {
                                toggleAddCounterModal();

                                //addCategory(categoryName, new Date(), chosenColor, isEnabled, resetInputs)
                            }}>
                            <View style={{ height: '100%', justifyContent: 'center', }}>
                                <Text style={[styles.textDefaultMed, styles.addCounterText, {}]}>
                                    Add New Counter</Text>
                            </View>


                        </TouchableOpacity>
                    </Shadow>
                </View>
            }

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
    textDefaultMed: {
        fontFamily: 'Inter-Medium',
    },
    title: {
        fontSize: 20,
        marginTop: 70,
    },
    addCounterButton: {
        margin: 10,
        height: 40,
        backgroundColor: '#8CC768',
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