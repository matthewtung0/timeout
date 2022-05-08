import React, { useState, useContext, useRef } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import { Text, Input, Button, Icon } from 'react-native-elements';
import { Context as CounterContext } from '../context/CounterContext';
import Slider from '@react-native-community/slider'
const constants = require('../components/constants.json')


const CounterScreen = () => {
    const [counterName, setCounterName] = useState('')
    const [resMessage, setResMessage] = useState('')
    const { state: counterState, addCounter, fetchUserCounters, addTally } = useContext(CounterContext)
    const [chosenColor, setChosenColor] = useState('c0')
    const [isEnabled, setIsEnabled] = useState(true);
    const [addBy, setAddBy] = useState(1)
    const [isLoading, setIsLoading] = useState(false)

    //const [myCounters, setMyCounters] = useState(counterState.userCounters)

    const [selectedCatId, setSelectedCatId] = useState('')
    var colorArr = []
    //let colors = JSON.parse(constants.colors)
    for (var i in constants['colors']) {
        colorArr.push([i, constants['colors'][i]])
    }

    const resetInputs = async () => {
        setCounterName('')
        setResMessage("Category set successfully!")

        // repull the list now that we've added to it
        await fetchUserCounters();
    }

    const addTallyValidation = async (counter_id, add_by, cur_tally) => {
        if (isLoading) return;
        if ((cur_tally + add_by) < 0) {
            alert("Can't decrease any more!")
        } else {
            setIsLoading(true)
            await addTally(counter_id, add_by, addTallyCallback)
            setIsLoading(false)
        }

    }

    const addTallyCallback = () => {
        //console.log("COUNTERS IS NOW", counterState.userCounters)
        console.log("Added!")
    }
    return (
        <View>
            <Text style={styles.title}>Counter Screen</Text>

            <Input
                style={styles.input}
                placeholder="Counter type to add"
                rightIconContainerStyle={styles.rightIconInput}
                inputContainerStyle={styles.inputStyleContainer}
                autoCorrect={true}
                //value={counterName}
                onChangeText={(text) => {
                    setCounterName(text)
                }}
            />
            <Text>Add by {addBy}</Text>
            <Slider
                style={styles.slider}
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
            <View style={{ width: 40, height: 40, backgroundColor: constants.colors[chosenColor] }}></View>
            <Text>Choose a color:</Text>
            < FlatList
                style
                horizontal={true}
                data={colorArr}
                keyExtractor={(item) => item[0]}
                renderItem={({ item }) => {
                    return (
                        < >
                            <TouchableOpacity
                                style={[styles.colorSquare, { backgroundColor: item[1] }]}
                                onPress={() => { setChosenColor(item[0]) }}
                            />
                        </>
                    )
                }}
            >
            </FlatList>
            <Button onPress={() => { addCounter(counterName, new Date(), chosenColor, isEnabled, resetInputs) }}
                title="Add this counter" />

            <Text style={{ margin: 20, }}>My counters:</Text>

            {counterState.userCounters.length > 0 ?

                <FlatList
                    data={counterState.userCounters}
                    keyExtractor={(item) => item.counter_id}
                    renderItem={({ item }) => {
                        return (
                            <View
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
                                                addTallyValidation(item.counter_id, addBy, item.point_count)
                                            }}>
                                            <Icon name='add-outline' type='ionicon' size={25} color='#67806D' />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ flex: 1, }}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                addTallyValidation(item.counter_id, -addBy, item.point_count)
                                            }}>
                                            <Icon name='remove-outline' type='ionicon' size={25} color='#67806D' />
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
                    }}></FlatList>


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
    }

})

export default CounterScreen;