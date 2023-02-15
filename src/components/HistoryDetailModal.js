import React, { useState, useContext } from 'react';
import {
    View, StyleSheet, Text, TouchableOpacity, Dimensions, Image,
    Keyboard, TouchableWithoutFeedback, TextInput, ActivityIndicator, Alert
} from 'react-native';
import { Icon } from 'react-native-elements'
import { Context as SessionContext } from '../context/SessionContext';
const img = require('../../assets/tasks_topbar.png')
const yellowCheckmark = require('../../assets/yellow_checkmark.png')
const constants = require('../components/constants.json')

const HistoryDailyModal = ({ toggleFunction, selectedObject, callback }) => {
    const { width, height } = Dimensions.get('window');
    const INPUT_WIDTH = width * 0.8
    const BORDER_RADIUS = 20;
    const { deleteSession, patchSession } = useContext(SessionContext)
    const [isLoading, setIsLoading] = useState(false)
    const [itemDeleted, setItemDeleted] = useState(false)
    const [isPrivate, setIsPrivate] = useState(selectedObject.is_private);
    const [notes, setNotes] = useState(selectedObject.notes)

    const submitPatch = async () => {
        setIsLoading(true)
        try {
            await patchSession(selectedObject.activity_id, notes, isPrivate, patchCallback)
        } catch (e) {
            console.log(e)
        }
    }

    const submitDelete = async () => {
        setIsLoading(true)
        try {
            await deleteSession(selectedObject, deleteCallback)
        } catch (e) {
            console.log(e)
        }
    }
    const toggleDelete = () => {
        setItemDeleted(!itemDeleted)
    }
    const togglePrivate = () => {
        setIsPrivate(!isPrivate)
    }

    const patchCallback = () => {

        setIsLoading(false)
        callback(true)
        alert("Updated successfully")
        toggleFunction()
    }

    const deleteCallback = () => {

        setIsLoading(false)
        setItemDeleted(true)
        callback(true)
        alert("Deleted successfully")
        toggleFunction()



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
            "Are you sure you want to delete this task?",
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

    const setNotesFunc = (txt) => {
        var num_lines = txt.split(/\r\n|\r|\n/).length
        if (num_lines <= 4) {
            setNotes(txt)
        }
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
                <View style={{ flex: 1, backgroundColor: '#83B569', borderRadius: BORDER_RADIUS }}>

                    <View style={{ marginTop: height * 0.1, }}>

                        {/* ACTIVITY NAME CONTAINER */}
                        <View style={{ height: height * 0.13, marginHorizontal: 20, }}>
                            <View style={{ flex: 2, }} />
                            <View style={{
                                flex: 8,
                                backgroundColor: 'white', borderRadius: 10, paddingHorizontal: 15,
                                //justifyContent: 'center',
                            }}>
                                <Text
                                    numberOfLines={2}
                                    style={[styles.textDefaultSemiBold, {
                                        color: '#67806D', fontSize: 18, marginBottom: 5,
                                        marginTop: 10,
                                    }]}>
                                    {selectedObject.activity_name}</Text>

                                <Text style={[styles.textDefault, {
                                    color: '#B3B2B3', fontSize: 12,
                                }]}>{date_Subtitle(selectedObject.time_start)} {timeFormat(selectedObject.time_start)}</Text>

                            </View>

                            {/* category label absolute position layer */}
                            <View style={{ position: 'absolute', height: height * 0.15, width: '100%', }}>
                                <View style={{ flex: 0.1, }}></View>
                                <View style={{
                                    backgroundColor: constants.colors[selectedObject.color_id],
                                    borderRadius: 20, alignSelf: 'flex-end', flex: 1,
                                    paddingHorizontal: 10, paddingVertical: 5,
                                    justifyContent: 'center',
                                }}>
                                    <View style={{ height: '100%', }}><Text style={[styles.textDefaultSemiBold, { color: 'white', fontSize: 12, }]}>
                                        {selectedObject.category_name}</Text></View>


                                </View>
                                <View style={{ flex: 6 }} />
                            </View>
                        </View>


                        {/* NOTES CONTAINER */}
                        <View style={{
                            backgroundColor: 'white', borderRadius: 20,
                            paddingHorizontal: 20, marginTop: 20, marginHorizontal: 20,
                        }}>
                            <TextInput
                                style={[styles.notes, { width: INPUT_WIDTH, color: '#67806D' }]}
                                multiline={true}
                                numberOfLines={4}
                                editable
                                maxLength={150}
                                placeholder={'Enter any notes'}
                                value={notes}
                                textAlignVertical='top'
                                onChangeText={(notesText) => {
                                    setNotesFunc(notesText)
                                }}
                            />
                        </View>




                        <View style={{
                            flexDirection: 'row', marginTop: 15, marginHorizontal: 20,
                        }}>
                            <TouchableOpacity
                                onPress={() => {
                                    togglePrivate()
                                }}>
                                {!isPrivate ?
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
                                Task is public - task name will be visible on your friend feed.</Text>
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
                            { color: 'crimson', marginHorizontal: 5, flexWrap: 'wrap', flex: 1, }]}>
                                Delete task from your history. This action will be permanent.</Text>
                        </View>
                        <View opacity={isLoading ? 0.2 : 1}>
                            <TouchableOpacity style={[styles.updateColorButton, {
                                width: width / 3, backgroundColor: 'white', marginTop: 20,
                            }]}
                                onPress={() => {
                                    if (isLoading) { return }
                                    if (itemDeleted) {
                                        areYouSureDelete();
                                    } else {
                                        if (notes != selectedObject.notes || isPrivate != selectedObject.is_private) {
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

                        {isLoading ?
                            <ActivityIndicator style={{ marginTop: 10, }} size="large" color="black" />
                            :
                            null}


                    </View>


                </View>
            </TouchableWithoutFeedback>
            <Image
                source={img}
                resizeMode='stretch'
                style={{
                    maxWidth: width * 0.9, maxHeight: 75, position: 'absolute',
                    borderTopLeftRadius: BORDER_RADIUS, borderTopRightRadius: BORDER_RADIUS
                }} />

            <Text style={[styles.title, { position: 'absolute' }]}>Task Details</Text>
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

        </View>


    )
}

const styles = StyleSheet.create({
    textDefaultBold: {
        fontFamily: 'Inter-Bold',
    }, textDefaultSemiBold: {
        fontFamily: 'Inter-SemiBold',
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
        height: 80,
    }, inputStyleContainer: {
        borderBottomWidth: 0,
    },
})

export default HistoryDailyModal;