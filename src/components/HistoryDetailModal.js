import React, { useState, useContext } from 'react';
import {
    View, StyleSheet, Text, TouchableOpacity, FlatList, Dimensions, Image,
    Keyboard, TouchableWithoutFeedback, TextInput, Switch, ActivityIndicator,
} from 'react-native';
import { Icon } from 'react-native-elements'
import { Context as SessionContext } from '../context/SessionContext';
import { Context as UserContext } from '../context/userContext'
const constants = require('../components/constants.json')
const img = require('../../assets/tasks_topbar.png')

const HistoryDailyModal = ({ toggleFunction, colorArr, selectedObject, callback }) => {
    const { height, width } = Dimensions.get('window');
    const INPUT_WIDTH = width * 0.8
    console.log(selectedObject)
    const { state, deleteSession } = useContext(SessionContext)
    const [isLoading, setIsLoading] = useState(false)
    const [itemDeleted, setItemDeleted] = useState(false)


    const submitDelete = async () => {
        setIsLoading(true)
        try {
            await deleteSession(selectedObject.activity_id, deleteCallback)
        } catch (e) {
            console.log(e)
        }
    }

    const deleteCallback = () => {
        setIsLoading(false)
        setItemDeleted(true)
        toggleFunction()
        callback(true)
        alert("Deleted successfully")

    }

    return (
        <View style={[styles.container, { width: width * 0.9, alignSelf: 'center' }]}>
            <View style={{ flex: 1, backgroundColor: '#F9EAD3' }}>
                <Text>asdf</Text>
                <Text>{selectedObject.activity_name}</Text>
                <Text>{selectedObject.category_name}</Text>
                <Text>{selectedObject.prod_rating}</Text>
                <Text>{selectedObject.time_end}</Text>
                <Text>{selectedObject.time_start}</Text>

                <TouchableOpacity
                    onPress={submitDelete}>
                    <Text>Delete item</Text>

                </TouchableOpacity>
            </View>


            <View style={styles.backContainer}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={toggleFunction}>

                    <Icon
                        name="close-outline"
                        type='ionicon'
                        size={35}
                        color='black' />
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
    },
})

export default HistoryDailyModal;