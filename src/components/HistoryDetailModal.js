import React, { useState, useContext, useCallback } from 'react';
import {
    View, StyleSheet, Text, TouchableOpacity, FlatList, Dimensions, Image,
    Keyboard, TouchableWithoutFeedback, TextInput, Switch, ActivityIndicator, Alert
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Icon } from 'react-native-elements'
import { Context as SessionContext } from '../context/SessionContext';
import { Context as UserContext } from '../context/userContext'
const constants = require('../components/constants.json')
const img = require('../../assets/tasks_topbar.png')
const yellowCheckmark = require('../../assets/yellow_checkmark.png')

const HistoryDailyModal = ({ toggleFunction, selectedObject, callback }) => {
    const { height, width } = Dimensions.get('window');
    const INPUT_WIDTH = width * 0.8
    const { state, deleteSession, patchSession } = useContext(SessionContext)
    const [isLoading, setIsLoading] = useState(false)
    const [itemDeleted, setItemDeleted] = useState(false)
    const [notes, setNotes] = useState(selectedObject.notes)

    const HideKeyboard = ({ children }) => (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            {children}
        </TouchableWithoutFeedback>
    );
    const submitPatch = async () => {
        setIsLoading(true)
        try {
            await patchSession(selectedObject.activity_id, notes, patchCallback)
        } catch (e) {
            console.log(e)
        }
    }

    const submitDelete = async () => {
        setIsLoading(true)
        try {
            await deleteSession(selectedObject.activity_id, deleteCallback)
        } catch (e) {
            console.log(e)
        }
    }
    const toggleDelete = () => {
        setItemDeleted(!itemDeleted)
    }

    const patchCallback = () => {

        setIsLoading(false)
        toggleFunction()
        callback(true)
        alert("Updated successfully")
    }

    const deleteCallback = () => {

        setIsLoading(false)
        setItemDeleted(true)
        toggleFunction()
        callback(true)
        alert("Deleted successfully")

    }
    const timeFormat = (dt) => {
        var date = new Date(dt).toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' });
        return date;
    }
    const date_Subtitle = (dt) => {
        var actual_date = new Date(dt).toLocaleDateString() // to compensate for being sent UTC times
        //var parts = dt.split('T')
        //var actual_date = parts[0]
        //var actual_parts = actual_date.split('-')
        var actual_parts = actual_date.split('/')
        var yr = actual_parts[2]
        var month = actual_parts[0]
        var day = actual_parts[1]

        return month + "/" + day + "/" + yr
    }

    const areYouSureDelete = () => {
        Alert.alert(
            "Are you sure you want to delete this category?",
            "",
            [
                {
                    text: "Go back", onPress: () => { return false }, style: "cancel"
                },
                {
                    text: "Delete", onPress: () => { submitDelete(); }
                }
            ]
        );
    }

    /*useFocusEffect(
        useCallback(() => {
            setIsLoading(false)
            if (selectedObject) {
                setNotes(selectedObject.notes)
            }
        }, [])
    )*/

    return (
        <View style={[styles.container, { width: width * 0.9, alignSelf: 'center' }]}>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View style={{ flex: 1, backgroundColor: '#83B569' }}>

                    <View style={{ marginTop: 80, }}>

                        {/* ACTIVITY NAME CONTAINER */}
                        <View style={{ height: 90, marginHorizontal: 20, }}>
                            <View style={{ flex: 2, }} />
                            <View style={{
                                flex: 6,
                                backgroundColor: 'white', borderRadius: 20, paddingHorizontal: 20,

                            }}>
                                <Text style={[styles.textDefaultBold, { color: '#67806D', fontSize: 20, marginTop: 5, }]}>
                                    {selectedObject.activity_name}</Text>
                            </View>

                            {/* category label absolute position layer */}
                            <View style={{ position: 'absolute', height: 100, width: '100%', }}>
                                <View style={{ flex: 1, }}></View>
                                <View style={{
                                    backgroundColor: 'pink', borderRadius: 20, alignSelf: 'flex-end', flex: 1,
                                    paddingHorizontal: 10, paddingVertical: 5,
                                }}>
                                    <Text style={[styles.textDefaultBold, { color: 'white', fontSize: 12, }]}>{selectedObject.category_name}</Text>
                                </View>
                                <View style={{ flex: 3 }} />
                                <View style={{ flex: 1, alignSelf: 'flex-end', marginBottom: 10, }}>
                                    <Text style={[styles.textDefault, {
                                        color: '#C0C0C0', fontSize: 12,
                                        paddingRight: 10,
                                    }]}>{date_Subtitle(selectedObject.time_start)} {timeFormat(selectedObject.time_start)}</Text>
                                </View>
                            </View>
                        </View>


                        {/* NOTES CONTAINER */}
                        <View style={{
                            backgroundColor: 'white', borderRadius: 20,
                            paddingHorizontal: 20, marginTop: 20, marginHorizontal: 20,
                        }}>
                            <TextInput
                                style={[styles.notes, { width: INPUT_WIDTH }]}
                                multiline={true}
                                numberOfLines={4}
                                maxHeight={120}
                                editable
                                maxLength={150}
                                placeholder={'Enter any notes'}
                                value={notes}
                                textAlignVertical='top'
                                onChangeText={setNotes}
                            />
                        </View>

                        <View style={{
                            flexDirection: 'row', marginTop: 15, marginHorizontal: 20,
                        }}>

                            <TouchableOpacity
                                onPress={() => {
                                    toggleDelete()
                                }}>
                                {itemDeleted ?

                                    <Image
                                        source={yellowCheckmark}
                                        style={{ width: 25, height: 25, marginRight: 10, }} />
                                    :
                                    <View style={{
                                        width: 23, height: 25, marginRight: 12, borderRadius: 5, borderColor: '#FCC759',
                                        borderWidth: 5
                                    }}></View>}
                            </TouchableOpacity>

                            <Text style={[styles.textDefault,
                            { color: 'black', marginHorizontal: 5, flexWrap: 'wrap', flex: 1, }]}>
                                Delete task from your history. This action will be permanent.</Text>
                        </View>

                        <TouchableOpacity style={[styles.updateColorButton, {
                            width: width / 3, backgroundColor: 'white', marginTop: 20,
                        }]}
                            onPress={() => {
                                if (itemDeleted) {
                                    areYouSureDelete();
                                } else {
                                    if (notes != selectedObject.notes) {
                                        submitPatch();
                                    } else {
                                        //reference.current = !reference.current
                                        toggleFunction();
                                    }

                                }
                            }}>
                            <Text style={[styles.textDefaultBold, styles.addCategoryText, { color: '#67806D' }]}>OK</Text>
                        </TouchableOpacity>


                    </View>


                </View>
            </TouchableWithoutFeedback>
            <Image
                source={img}
                resizeMode='stretch'
                style={{ maxWidth: width * 0.9, maxHeight: 75, position: 'absolute' }} />

            <Text style={[styles.title, { position: 'absolute' }]}>Task Details</Text>
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

        </View>


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
    updateColorButton: {
        marginVertical: 10,
        padding: 10,
        backgroundColor: '#ABC57E',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        shadowOffset: {
            width: 0.05,
            height: 0.05,
        },
        shadowOpacity: 0.3,
    }, notes: {
        alignSelf: 'center',
        backgroundColor: 'white',
        padding: 10,
        paddingTop: 12,
        borderRadius: 10,
        marginHorizontal: 25,
        marginBottom: 20,
        height: 120,
    }, inputStyleContainer: {
        borderBottomWidth: 0,
    },
})

export default HistoryDailyModal;