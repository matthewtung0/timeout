import React, { useState, useContext } from 'react';
import {
    View, StyleSheet, Text, TouchableOpacity, FlatList, Dimensions, Image,
    Keyboard, TouchableWithoutFeedback, TextInput, Switch, ActivityIndicator,
} from 'react-native';
import { Icon } from 'react-native-elements'
import { Context as CounterContext } from '../context/CounterContext';
const constants = require('../components/constants.json')
const img = require('../../assets/tasks_topbar.png')

const AddCounterModal = ({ toggleFunction, colorArr }) => {
    const { height, width } = Dimensions.get('window');
    const [resMessage, setResMessage] = useState('')
    const INPUT_WIDTH = width * 0.8
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
        return true;
    }

    return (
        <View style={[styles.container, { width: width * 0.9, alignSelf: 'center' }]}>
            <View style={{ flex: 1, backgroundColor: '#F9EAD3' }}>
                <View style={{ marginHorizontal: 20, marginTop: 90, }}>
                    <Text style={styles.labelText}>Counter Name</Text>
                    <TextInput
                        style={[styles.inputStyle, {
                            width: INPUT_WIDTH, height: 45,
                            backgroundColor: constants.colors[chosenColor],
                        }]}
                        inputContainerStyle={styles.inputStyleContainer}
                        placeholder='Counter name here'
                        autoCorrect={false}
                        value={counterName}
                        onChangeText={(text) => {
                            setCounterName(text)
                        }}
                    />
                    <Text style={styles.labelText}>Choose a color:</Text>
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

                    <View opacity={isLoading ? 0.3 : 1}>
                        <TouchableOpacity
                            style={[styles.submit, { width: width / 2.6, }]}
                            onPress={() => {
                                if (!validateInputs()) { return }
                                setIsLoading(true)
                                addCounter(counterName, new Date(), chosenColor, true, resetInputs)

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
                style={{ maxWidth: width * 0.9, maxHeight: 75, position: 'absolute' }} />

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
        marginBottom: 40,
        marginTop: 30,
        shadowOffset: {
            width: 0.05,
            height: 0.05,
        },
        shadowOpacity: 0.3,
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

export default AddCounterModal;