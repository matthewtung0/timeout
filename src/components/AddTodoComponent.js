import React, { useState, useContext, useCallback } from 'react';
import {
    View, StyleSheet, Alert, Text, TextInput, TouchableOpacity, Dimensions, Keyboard, TouchableWithoutFeedback,
    ActivityIndicator, Image
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Context as CategoryContext } from '../context/CategoryContext';
import DropDownComponent2 from './DropDownComponent2';
const yellowCheckmark = require('../../assets/yellow_checkmark.png')

const HideKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>
);

// double as add new item and editing existing items
const AddTodoComponent = ({ title, buttonText, callback, item, deleteCallback, editCallback, BORDER_RADIUS }) => {
    const { height, width } = Dimensions.get('window');
    const [isLoading, setIsLoading] = useState(false)

    const [toDoItemName, setToDoItemName] = useState('')

    const [categoryName, setCategoryName] = useState(item ? item.category_name : 'Unsorted')
    const [colorId, setColorId] = useState(item ? item.color_id : 'c10')
    const [categoryId, setCategoryId] = useState(item ? item.category_id : '3')

    const { state, addTodoItem, editTodoItem, fetchUserTodoItems, deleteTodoItem } = useContext(CategoryContext)

    const [notes, setNotes] = useState('')
    const [toggleDelete, setToggleDelete] = useState(false)

    const INPUT_WIDTH = width * 0.8

    const errorReset = () => {
        setIsLoading(false)
    }

    const resetInputs = async (msg) => {
        setToDoItemName('')
        setIsLoading(false)
        if (msg) {
            alert(msg)
        } else {
            alert("Task added successfully")
        }


        // repull the list now that we've added to it
        await fetchUserTodoItems();
        if (callback) { callback() }
    }

    const resetInputsEdit = async (msg) => {
        setToDoItemName('')
        setNotes('')
        setCategoryName('Unsorted')
        setCategoryId("3")
        setColorId("c10")
        setIsLoading(false)

        await fetchUserTodoItems();
        if (callback) { callback() }
        if (editCallback) { editCallback() }

        alert("Task edited successfully!")
    }

    const resetInputsDelete = async () => {
        setToDoItemName('')
        setNotes('')
        setCategoryName('Unsorted')
        setCategoryId("3")
        setColorId("c10")
        setIsLoading(false)
        alert("Task deleted successfully!")

        // repull the list now that we've edited it
        await fetchUserTodoItems();
        if (callback) { callback() }
        if (deleteCallback) { deleteCallback() }
    }

    const toggleDeleteFunction = () => {
        setToggleDelete(!toggleDelete);
    }

    const validateInputs = () => {
        if (toDoItemName == '') {
            alert("Please enter a task name")
            return false
        }

        // check if we already have a task with the same name
        for (var i in state.userTodoItems) {
            var item_name = state.userTodoItems[i].item_desc.toLowerCase()
            if (toDoItemName.toLowerCase() == item_name) {
                alert("You already have a task with that name!")
                return false
            }
        }
        return true
    }

    const areYouSureDelete = (item_id, reset_msg, errorReset) => {
        Alert.alert(
            "Are you sure you want to delete this task?",
            "",
            [
                {
                    text: "Go back",
                    onPress: () => { setIsLoading(false) },
                    style: "cancel"
                },
                {
                    text: "Delete", onPress: () => {
                        setIsLoading(true)
                        deleteTodoItem(item_id, resetInputsDelete, errorReset)
                    }
                }
            ]
        );
    }


    // initialize data if this is an edit of existing task
    useFocusEffect(
        useCallback(() => {
            setIsLoading(false)
            if (item) {
                setToDoItemName(item.item_desc)
                setNotes(item.notes)
            }
        }, [])
    )
    const setNotesFunc = (txt) => {
        var num_lines = txt.split(/\r\n|\r|\n/).length
        if (num_lines <= 4) {
            setNotes(txt)
        }
    }

    return (
        <HideKeyboard>
            <View style={[styles.container, { minHeight: 300, borderRadius: BORDER_RADIUS }]}>
                <><Text style={styles.title}></Text>

                    < TextInput
                        inputContainerStyle={[styles.inputStyleContainer, styles.textDefault,]}
                        style={[styles.inputStyle, { width: INPUT_WIDTH, height: 45, }]}
                        placeholder='Task name'
                        placeholderTextColor={'#90AB72'}
                        maxLength={30}
                        autoCorrect={false}
                        value={toDoItemName}
                        onChangeText={setToDoItemName}
                    />
                    <TextInput
                        style={[styles.notes, styles.textDefault, { width: INPUT_WIDTH }]}
                        multiline={true}
                        numberOfLines={4}
                        maxHeight={120}
                        editable
                        maxLength={150}
                        placeholderTextColor={'#90AB72'}
                        placeholder={'Enter notes (optional)'}
                        value={notes}
                        textAlignVertical='top'
                        onChangeText={(notesText) => { setNotesFunc(notesText) }}

                    />
                </>

                <View style={{ minHeight: 50, }}>
                    <DropDownComponent2
                        isInModal={true}
                        categoryId={categoryId}
                        catName={categoryName}
                        colorId={colorId}
                        setCatNameCallback={setCategoryName}
                        setColorIdCallback={setColorId}
                        setCategoryIdCallback={setCategoryId}
                    />
                </View>

                {/* toggle delete the item */}

                {item ?
                    <View style={{
                        flexDirection: 'row', marginTop: 15, marginHorizontal: 20, alignItems: 'center',
                    }}>

                        <TouchableOpacity
                            onPress={() => {
                                toggleDeleteFunction();
                                //areYouSureDelete(item.item_id, "Task deleted successfully")
                            }}>
                            {toggleDelete ?

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
                            Delete task from your to-do list. You can add it again later if you change your mind.</Text>
                    </View>

                    : null}

                {/* add or edit the item */}
                <View opacity={isLoading ? 0.3 : 1}>
                    <TouchableOpacity
                        style={[styles.plus, { width: width / 2.5, }]}
                        onPress={() => {
                            if (isLoading) { return; }
                            setIsLoading(true)
                            if (item) {
                                if (toggleDelete) {
                                    areYouSureDelete(item.item_id, "Task deleted successfully", errorReset)
                                } else {
                                    editTodoItem(toDoItemName, categoryId, notes, item.item_desc,
                                        resetInputsEdit, errorReset)
                                }

                            } else {
                                if (!validateInputs()) {
                                    setIsLoading(false)
                                    return
                                }
                                addTodoItem(toDoItemName, new Date(), categoryId, notes, resetInputs, errorReset);
                            }
                        }}>
                        <Text style={styles.plusText}>{buttonText}</Text>
                    </TouchableOpacity>
                </View>

                {isLoading ?
                    <ActivityIndicator size="large" color="white" /> : null}

            </View>

        </HideKeyboard>


    )
}

const styles = StyleSheet.create({
    textDefaultBold: {
        fontFamily: 'Inter-Bold',
    },
    textDefaultSemiBold: {
        fontFamily: 'Inter-SemiBold',
    },
    textDefault: {
        fontFamily: 'Inter-Regular',
    },
    container: {
        flex: 1,
        backgroundColor: '#83B569'
    },
    title: {
        alignSelf: 'center',
        marginTop: 70,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#F6F2DF',
    },
    inputStyle: {
        marginTop: 5,
        backgroundColor: 'white',
        borderRadius: 15,
        paddingHorizontal: 10,
        alignSelf: 'center',
        marginBottom: 20,
        color: '#67806D',
        fontSize: 16,
    },
    notes: {
        alignSelf: 'center',
        backgroundColor: 'white',
        padding: 10,
        paddingTop: 12,
        borderRadius: 10,
        marginHorizontal: 25,
        marginBottom: 20,
        height: 120,
        color: '#67806D',
        fontSize: 16,
    }, inputStyleContainer: {
        borderBottomWidth: 0,
    },
    nameContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    nameInputStyleContainer: {
        width: 230,
    },
    plus: {
        backgroundColor: '#FCC859',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        alignSelf: 'center',
        marginBottom: 10,
        marginTop: 30,
        shadowOffset: {
            width: 0.05,
            height: 0.05,
        },
        shadowOpacity: 0.1,
    },
    plusText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        paddingVertical: 10,
    },
    deleteText: {
        color: 'white',
        fontSize: 15,
        fontWeight: '400',
        paddingVertical: 5,
    },
    delete: {
        backgroundColor: '#F5BBAE',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        alignSelf: 'center',
        marginTop: 10,
        shadowOffset: {
            width: 0.05,
            height: 0.05,
        },
        shadowOpacity: 0.1,
    },
})

export default AddTodoComponent;