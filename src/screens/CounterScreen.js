import React, { useState, useContext } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { Text, Icon } from 'react-native-elements';
import { Context as CounterContext } from '../context/CounterContext';
import { Context as SessionContext } from '../context/SessionContext'
import Slider from '@react-native-community/slider'
import Modal from 'react-native-modal'
import AddCounterModal from '../components/AddCounterModal';
import EditCounterModal from '../components/EditCounterModal';
const constants = require('../components/constants.json')


const CounterScreen = () => {
    const { height, width } = Dimensions.get('window');
    const { state: counterState, addCounter, setCounterTablesLocked, addTally, resetTally } = useContext(CounterContext)
    const { setHardReset } = useContext(SessionContext)

    const [addBy, setAddBy] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingSubtract, setIsLoadingSubtract] = useState(false)

    const [addCounterModalVisible, setAddCounterModalVisible] = useState(false)
    const [editCounterModalVisible, setEditCounterModalVisible] = useState(false)
    const [selectedCounterId, setSelectedCounterId] = useState('')
    const [selectedColorId, setSelectedColorId] = useState('')
    const [selectedName, setSelectedName] = useState('')


    const [counterInfo, setCounterInfo] = useState(counterState.userCounters)

    var colorArr = []
    //let colors = JSON.parse(constants.colors)
    for (var i in constants['colors']) {
        colorArr.push([i, constants['colors'][i]])
    }

    const addTallyValidation = async (counter_id, add_by, cur_tally) => {
        if (isLoading || isLoadingSubtract) return;
        if ((cur_tally + add_by) < 0) {
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

    const resetTallyValidation = async (counter_id) => {
        setIsLoading(true)
        await resetTally(counter_id);
        setIsLoading(false);
    }

    const addTallyCallback = () => {
        //console.log("COUNTERS IS NOW", counterState.userCounters)
        console.log("Added!")
        setCounterTablesLocked(false)
    }

    const toggleAddCounterModal = () => {
        setAddCounterModalVisible(!addCounterModalVisible)
    }

    const toggleEditCounterModal = () => {
        setEditCounterModalVisible(!editCounterModalVisible);
    };
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
                        />
                    </View></View>
            </Modal>

            <Text style={{ marginTop: 110, alignSelf: 'center', }}>Add by {addBy}</Text>

            <Slider
                style={[styles.slider, { width: width * 0.5, alignSelf: 'center', }]}
                minimumValue={1}
                maximumValue={10}
                minimumTrackTintColor="#90AB72"
                maximumTrackTintColor="#F5BBAE"
                value={1}
                onSlidingStart={() => {
                }}
                onValueChange={setAddBy}
                onSlidingComplete={() => {
                    setAddBy(Math.round(addBy))
                    //setProdRating(Math.round(prodRatingNum))
                }}
            />

            <Text>COUNTERS DONE SO FAR TODAY</Text>
            {counterState.userCounters.length > 0 ?

                <FlatList
                    data={counterInfo}
                    keyExtractor={(item) => item.counter_id}
                    renderItem={({ item }) => {
                        return (
                            <View
                                style={[styles.categoryStyle, { marginBottom: 10, }]}>
                                <View style={{ flexDirection: 'row', flex: 1, }}>
                                    <View style={{ flex: 1, }}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                resetTallyValidation(item.counter_id)
                                            }}>
                                            <Icon name='refresh-outline' type='ionicon' size={20} color='#67806D' />
                                        </TouchableOpacity>
                                    </View>

                                    <View style={{ flex: 1, justifyContent: 'center', }}>
                                        {isLoadingSubtract ?
                                            <ActivityIndicator
                                                style={{ justifyContent: 'center', }}
                                                size="large" />
                                            :
                                            <TouchableOpacity
                                                onPress={() => {
                                                    addTallyValidation(item.counter_id, -addBy, item.point_count)
                                                }}>
                                                <Icon name='remove-outline' type='ionicon' size={40} color='#67806D' />
                                            </TouchableOpacity>
                                        }
                                    </View>
                                    <View style={{
                                        flex: 4, alignItems: 'center', borderWidth: 1, borderRadius: 5,
                                        borderColor: constants.colors[item['color_id']]
                                    }}>

                                        <View style={{
                                            alignItems: 'center',

                                        }}>
                                            <Text style={[styles.categoryText,
                                            {
                                                color: constants.colors[item['color_id']],
                                                fontSize: 30, fontWeight: "700",
                                            }]}>
                                                {item['point_count']}
                                                {/*item['cur_count']*/}
                                            </Text>
                                            <Text style={[styles.categoryText, {
                                                color: constants.colors[item['color_id']],
                                                fontSize: 24, fontWeight: "600",
                                            }]}>
                                                {item['counter_name']}</Text>
                                            <Text style={[styles.categoryText,
                                            {
                                                color: 'gray',
                                                fontSize: 16, fontWeight: "400",
                                            }]}>Lifetime:
                                                {item['cur_count']}
                                            </Text>

                                            {/*<Text style={[styles.categoryText]}>Lifetime: {item['point_count']}</Text>*/}

                                        </View>
                                    </View>

                                    <View style={{ flex: 1, justifyContent: 'center', }}>
                                        {isLoading ?
                                            <ActivityIndicator
                                                style={{ justifyContent: 'center', }}
                                                size="large" /> :
                                            <TouchableOpacity
                                                onPress={() => {
                                                    addTallyValidation(item.counter_id, addBy, item.point_count)
                                                }}>
                                                <Icon name='add-outline' type='ionicon' size={40} color='#67806D' />
                                            </TouchableOpacity>
                                        }
                                    </View>


                                    <View style={{ flex: 1, }}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                setSelectedCounterId(item.counter_id)
                                                setSelectedColorId(item.color_id)
                                                setSelectedName(item.counter_name)
                                                toggleEditCounterModal()
                                            }

                                            }>
                                            <Icon name='archive-outline' type='ionicon' size={20} color='#67806D' />
                                        </TouchableOpacity>
                                    </View>

                                </View>
                            </View>
                        )
                    }}>
                </FlatList>


                /*<View style={styles.categoryContainer}>
                    {counterState.userCounters.filter((item) => !item.archived)
                        .map((item) => {
                            return (
                                <View
                                    key={item.counter_id}
                                    style={[styles.categoryStyle, { height: 30, }]}>
                                    <View style={{ flexDirection: 'row', flex: 1, }}>

                                        <View style={{ flex: 8, }}>
                                            <Text style={[styles.categoryText]}>{item['counter_name']}</Text>
                                            <Text style={[styles.categoryText]}>{item['point_count']}</Text>
                                        </View>

                                        <View style={{ flex: 1, }}>
                                            <View style={{ backgroundColor: constants.colors[item['color_id']], height: 20, width: 20, }} />
                                        </View>

                                        <View style={{ flex: 1, }}>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    addTally(item.counter_id, addBy, addTallyCallback)
                                                }}>
                                                <Icon name='add-outline' type='ionicon' size={25} color='#67806D' />
                                            </TouchableOpacity>
                                        </View>

                                        <View style={{ flex: 1, }}>
                                            <TouchableOpacity
                                                onPress={() => { }}>
                                                <Icon name='archive-outline' type='ionicon' size={20} color='#67806D' />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            )
                        })}
                    </View>*/ : null}

            <TouchableOpacity style={[styles.addCounterButton, { width: width / 1.8 }]}
                onPress={() => {
                    toggleAddCounterModal();

                    //addCategory(categoryName, new Date(), chosenColor, isEnabled, resetInputs)
                }}>
                <Text style={styles.addCounterText}>Add New Counter</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
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
        padding: 10,
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
    }

})

export default CounterScreen;