import React, { useState, useContext } from 'react';
import {
    View, StyleSheet, Text, TouchableOpacity, FlatList, Dimensions, Image,
    TextInput, ActivityIndicator,
} from 'react-native';
import { Icon } from 'react-native-elements'
import { Context as CounterContext } from '../context/CounterContext';
const img = require('../../assets/tasks_topbar.png')

const AddCounterModal = ({ toggleFunction, colorArr, currentCounters, callback }) => {
    const { height, width } = Dimensions.get('window');
    const [resMessage, setResMessage] = useState('')
    const COLOR_WIDTH = 40;
    const BORDER_RADIUS = 20;
    const [counterName, setCounterName] = useState('')
    const [chosenColor, setChosenColor] = useState('c0')

    const [isLoading, setIsLoading] = useState(false)
    const { addCounter, fetchUserCounters } = useContext(CounterContext)

    const resetInputs = async () => {
        setCounterName('')
        setResMessage("Counter set successfully!")

        // repull the list now that we've added to it
        await fetchUserCounters();
        alert("Category added successfuly!")
        setIsLoading(false)
        toggleFunction()
    }

    const validateInputs = () => {
        var counterNames = currentCounters.map((item) => { return item.activity_name })
        for (var i in counterNames) {
            if (counterNames[i].toLowerCase() == counterName.toLowerCase()) {
                return false
            }
        }
        return true;
    }
    const separator = () => {
        return (
            <View
                style={{
                    borderBottomColor: '#DCDBDB',
                    //borderBottomWidth: StyleSheet.hairlineWidth,
                    borderBottomWidth: 1.5,
                    marginBottom: 10,
                }}
            />

        )
    }

    return (
        <View style={[styles.container, { width: width * 0.9, alignSelf: 'center' }]}>
            <View style={{ flex: 1, backgroundColor: '#F9EAD3', borderRadius: BORDER_RADIUS }}>
                <View style={{ marginHorizontal: 20, marginTop: 90, }}>
                    <Text style={[styles.textDefaultBold, styles.labelText, { fontSize: 16, color: '#67806D' }]}>
                        Counter Name</Text>

                    <View style={{ marginVertical: 10, marginHorizontal: 10, marginBottom: 20, }}>
                        <View style={{
                            borderRadius: 20,
                            backgroundColor: 'white', shadowOffset: {
                                width: 0,
                                height: -0.2,
                            },
                            shadowOpacity: 0.1,
                        }}>
                            <TextInput
                                style={[styles.inputStyle, styles.textDefault, {
                                    //backgroundColor: constants.colors[chosenColor],
                                }]}
                                inputContainerStyle={styles.inputStyleContainer}
                                placeholder='Counter'
                                maxLength={30}
                                placeholderTextColor={'gray'}
                                autoCorrect={false}
                                value={counterName}
                                onChangeText={setCounterName}
                            />

                        </View>
                    </View>
                    < FlatList
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




                    {separator()}
                    <Text style={[styles.textDefaultBold, styles.labelText, { fontSize: 16, color: '#67806D' }]}>Color</Text>


                    <View style={{ marginVertical: 10, marginHorizontal: 10, marginBottom: 20, }}>
                        <View style={{
                            borderRadius: 50,
                            backgroundColor: 'white', shadowOffset: {
                                width: 0,
                                height: -0.2,
                            },
                            shadowOpacity: 0.1,
                        }}>

                            <View
                                style={[{
                                    marginVertical: 5, marginHorizontal: COLOR_WIDTH / 2,
                                    //backgroundColor: constants.colors[chosenColor],
                                }]}
                            >
                                < FlatList
                                    horizontal={true}
                                    data={colorArr}
                                    keyExtractor={(item) => item[0]}
                                    renderItem={({ item }) => {
                                        return (
                                            <>
                                                {chosenColor == item[0] ?
                                                    <TouchableOpacity
                                                        style={[styles.colorSquare, {
                                                            backgroundColor: item[1],
                                                            width: COLOR_WIDTH, height: COLOR_WIDTH, borderRadius: COLOR_WIDTH / 2,
                                                            borderWidth: 3, borderColor: '#67806D'
                                                        }]}
                                                        onPress={() => { setChosenColor(item[0]) }}
                                                    />

                                                    :
                                                    <TouchableOpacity
                                                        style={[styles.colorSquare, {
                                                            backgroundColor: item[1],
                                                            width: COLOR_WIDTH, height: COLOR_WIDTH, borderRadius: COLOR_WIDTH / 2,
                                                        }]}
                                                        onPress={() => { setChosenColor(item[0]) }}
                                                    />
                                                }
                                            </>
                                        )
                                    }}
                                >
                                </FlatList>
                            </View>
                        </View>
                    </View>



                    <View opacity={isLoading ? 0.3 : 1}>
                        <TouchableOpacity
                            style={[styles.submit, { width: width / 2.6, }]}
                            onPress={() => {
                                if (!validateInputs()) {
                                    alert("Counter name already exists!")
                                    return
                                }
                                if (counterName == '') {
                                    alert("Please enter a counter name")
                                    return
                                }
                                setIsLoading(true)
                                addCounter(counterName, new Date(), chosenColor, true, callback)

                            }}>
                            <Text style={styles.submitText}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                    {isLoading ?
                        <ActivityIndicator size="large" color="gray" /> : null}

                </View>
            </View>

            <Image
                source={img}
                resizeMode='stretch'
                style={{
                    maxWidth: width * 0.9, maxHeight: 75, position: 'absolute', borderTopLeftRadius: BORDER_RADIUS,
                    borderTopRightRadius: BORDER_RADIUS,
                }} />

            <Text style={[styles.title, { position: 'absolute' }]}>Add Counter</Text>
            <View style={styles.backContainer}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={toggleFunction}>

                    <Icon
                        name="close-outline"
                        type='ionicon'
                        size={35}
                        color='white' />
                    {/*<Text style={styles.backButtonText}>X</Text>*/}
                </TouchableOpacity>
            </View>


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
    container: {
        flex: 1,
    },
    parentContainer: {
        flex: 1,
        justifyContent: 'space-around',
    },
    labelText: { marginLeft: 5, color: 'gray', },
    colorSquare: {
        marginHorizontal: 5,
        marginTop: 5,
        marginBottom: 5,
    },
    title: {
        alignSelf: 'center',
        margin: 20,
        marginBottom: 50,
        fontSize: 25,
        fontWeight: 'bold',
        color: 'white',
    },
    backButton: {
        width: 50,
        height: 50,
        justifyContent: 'center',
    },
    backButtonText: {
        alignSelf: 'center',
        fontWeight: 'bold',
        fontSize: 25,
        color: 'white',

    },
    backContainer: {
        flex: 1,
        width: '50%',
        position: 'absolute',
        alignSelf: 'flex-end',
        justifyContent: 'flex-end',
        alignItems: 'flex-end'
    },
    dummy: {
        flex: 0.03,
    },
    goBackChild: {
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center',
    },
    submit: {
        backgroundColor: '#FCC859',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        alignSelf: 'center',
        marginBottom: 40,
        marginTop: 30,
        shadowOffset: {
            width: 0.05,
            height: 0.05,
        },
        shadowOpacity: 0.1,
    },
    submitText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        padding: 10,
    },
    inputStyleContainer: {
        borderBottomWidth: 0,
    },
    inputStyle: {
        borderRadius: 15,
        paddingHorizontal: 15,
        paddingTop: 15,
        paddingBottom: 15,
        color: 'gray',
        fontSize: 16,
    },
})

export default AddCounterModal;