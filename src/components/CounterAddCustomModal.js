import React, { useState, useContext } from 'react';
import {
    View, StyleSheet, Text, TouchableOpacity, FlatList, Dimensions, Image, TextInput, ActivityIndicator,
} from 'react-native';
import { Icon } from 'react-native-elements'
import { Context as CounterContext } from '../context/CounterContext';
const constants = require('../components/constants.json')
const img = require('../../assets/tasks_topbar.png')

const CounterAddCustomModal = ({ toggleFunction, selectedColorId, selectedCounterName, selectedCounterId, colorArr,
    selectedCurrentCount, customIncrementCallback }) => {
    const BORDER_RADIUS = 20;
    const { height, width } = Dimensions.get('window');
    const [resMessage, setResMessage] = useState('')
    const [counterName, setCounterName] = useState('')
    const [chosenColor, setChosenColor] = useState('c0')

    const [isLoading, setIsLoading] = useState(false)
    const { addCounter, fetchUserCounters } = useContext(CounterContext)

    const [incrementBy, setIncrementBy] = useState(0)
    const [isAdd, setIsAdd] = useState(true)

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
        return true;
    }

    // make sure increment does not put count in the negative
    const validateSubtract = () => {
        if (isAdd) return true;
        if ((selectedCurrentCount - incrementBy) < 0) {
            return false
        }
        return true
    }

    return (
        <View style={[styles.container, { width: width * 0.9, alignSelf: 'center' }]}>
            <View style={{ flex: 1, backgroundColor: '#F9EAD3', borderRadius: BORDER_RADIUS }}>
                <View style={{ marginHorizontal: 20, marginTop: 90, alignItems: 'center', }}>
                    <View style={{ flexDirection: 'row', }}>
                        <TouchableOpacity
                            style={isAdd ? { borderTopLeftRadius: 15, borderBottomLeftRadius: 15, borderWidth: 1, borderColor: '#A7BEAD', flex: 1, alignItems: 'center', paddingVertical: 5, backgroundColor: '#A7BEAD' }
                                : { borderTopLeftRadius: 15, borderBottomLeftRadius: 15, borderTopWidth: 1, borderLeftWidth: 1, borderBottomWidth: 1, borderColor: '#C0C0C0', flex: 1, alignItems: 'center', paddingVertical: 5, backgroundColor: '#F9EAD3', }
                            }
                            onPress={() => { setIsAdd(true) }}
                        >
                            <View>
                                <Text style={[styles.textDefaultBold, { fontSize: 16, color: '#67806D' }]}>Add</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={!isAdd ? { borderTopRightRadius: 15, borderBottomRightRadius: 15, borderWidth: 1, borderColor: '#A7BEAD', flex: 1, alignItems: 'center', paddingVertical: 5, backgroundColor: '#A7BEAD' }
                                : { borderTopRightRadius: 15, borderBottomRightRadius: 15, borderTopWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, borderColor: '#C0C0C0', flex: 1, alignItems: 'center', paddingVertical: 5, backgroundColor: '#F9EAD3', }
                            }
                            onPress={() => { setIsAdd(false) }}
                        >
                            <View>
                                <Text style={[styles.textDefaultBold, { fontSize: 16, color: '#67806D' }]}>Subtract</Text>
                            </View>

                        </TouchableOpacity>
                    </View>
                    <View style={{ alignItems: 'center', marginVertical: 10, }}>
                        <Text style={[styles.textDefaultBold, { fontSize: 16, color: '#67806D' }]}>by</Text>
                    </View>
                    <TextInput
                        style={[styles.inputStyle, {
                            paddingVertical: 10, backgroundColor: '#F9EAD3', borderWidth: 1, borderColor: '#67806D',
                            fontSize: 40,//backgroundColor: constants.colors[chosenColor],
                        }]}
                        inputContainerStyle={styles.inputStyleContainer}
                        keyboardType={"number-pad"}
                        returnKeyType="done"
                        editable={true}
                        autoFocus={true}
                        maxLength={2}
                        placeholder='_ _'
                        placeholderTextColor={'#A7BEAD'}
                        value={incrementBy}
                        onChangeText={setIncrementBy}
                    />

                    <View opacity={isLoading ? 0.3 : 1}>
                        <TouchableOpacity
                            style={[styles.submit, { width: width / 2.6, }]}
                            onPress={async () => {
                                if (!validateSubtract()) {
                                    alert("Counter cannot go below 0!")
                                    return;
                                }
                                if (isAdd) {
                                    await customIncrementCallback(selectedCounterId, incrementBy)
                                } else {
                                    await customIncrementCallback(selectedCounterId, -incrementBy)
                                }
                                toggleFunction();
                                alert("Added!")
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

            <Text style={[styles.title, { position: 'absolute' }]}>{selectedCounterName}</Text>
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
        backgroundColor: '#F9EAD3'
    },
    labelText: { marginLeft: 5, color: 'gray', },
    colorSquare: {
        width: 50,
        height: 50,
        marginHorizontal: 5,
        marginTop: 5,
        marginBottom: 15,
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
        shadowOffset: {
            width: 0.05,
            height: 0.05,
        },
        shadowOpacity: 0.15,
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
        marginTop: 5,
        backgroundColor: 'white',
        borderRadius: 15,
        paddingHorizontal: 10,
        alignSelf: 'center',
        marginBottom: 20,
        color: 'gray',
        fontSize: 18,
        fontWeight: '600',
    }
})

export default CounterAddCustomModal;