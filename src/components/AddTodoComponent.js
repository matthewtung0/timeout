import React, { useState, useContext, useCallback } from 'react';
import {
    View, StyleSheet, Text, TextInput, TouchableOpacity, Dimensions, Keyboard, TouchableWithoutFeedback,
    ActivityIndicator
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Context as CategoryContext } from '../context/CategoryContext';
import DropDownComponent from '../components/DropDownComponent';

const HideKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>
);

// double as add new item and editing existing items
const AddTodoComponent = ({ title, buttonText, callback, item }) => {
    const { height, width } = Dimensions.get('window');
    const [isLoading, setIsLoading] = useState(false)

    const [toDoItemName, setToDoItemName] = useState('')

    const [categoryName, setCategoryName] = useState(item ? item.category_name : 'Unsorted')
    const [colorId, setColorId] = useState(item ? item.color_id : 'c6')
    const [categoryId, setCategoryId] = useState(item ? item.category_id : '3')

    const { state, addTodoItem, editTodoItem, fetchUserTodoItems, deleteTodoItem } = useContext(CategoryContext)

    const [notes, setNotes] = useState('')

    const INPUT_WIDTH = width * 0.8

    const resetInputs = async (msg) => {
        setToDoItemName('')
        setIsLoading(false)
        alert(msg)

        // repull the list now that we've added to it
        await fetchUserTodoItems();
        if (callback) { callback() }

    }

    const validateInputs = () => {
        if (toDoItemName == '') {
            alert("Please enter a task name")
            return false
        }
        return true
    }
    console.log("this item is", item)

    const areYouSureDelete = (item_id, reset_msg) => {
        Alert.alert(
            "Are you sure you want to delete this task?",
            "",
            [
                {
                    text: "Go back",
                    onPress: () => { },
                    style: "cancel"
                },
                {
                    text: "Delete", onPress: () => {
                        deleteTodoItem(item_id, resetInputs(reset_msg))
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

    return (

        <HideKeyboard>

            <View style={styles.container}>
                <Text style={styles.title}></Text>

                < TextInput
                    inputContainerStyle={styles.inputStyleContainer}
                    style={[styles.inputStyle, { width: INPUT_WIDTH, height: 45, }]}
                    placeholder='Task'
                    maxLength={30}
                    autoCorrect={false}
                    value={toDoItemName}
                    onChangeText={setToDoItemName}
                />
                <TextInput
                    style={[styles.notes, { width: INPUT_WIDTH }]}
                    multiline={true}
                    numberOfLines={4}
                    maxHeight={120}
                    editable
                    maxLength={150}
                    placeholder={'Enter notes (optional)'}
                    value={notes}
                    textAlignVertical='top'
                    onChangeText={setNotes}

                />

                <DropDownComponent
                    isInModal={true}
                    categoryId={categoryId}
                    catName={categoryName}
                    colorId={colorId}
                    setCatNameCallback={setCategoryName}
                    setColorIdCallback={setColorId}
                    setCategoryIdCallback={setCategoryId}
                />

                {/* add or edit the item */}
                <View opacity={isLoading ? 0.3 : 1}>
                    <TouchableOpacity
                        style={[styles.plus, { width: width / 2.5, }]}
                        onPress={() => {
                            if (!validateInputs()) { return }
                            setIsLoading(true)

                            if (item) {
                                editTodoItem(toDoItemName, categoryId, notes, item.item_desc, resetInputs("Task edited successfully"))
                            } else {
                                addTodoItem(toDoItemName, new Date(), categoryId, notes, resetInputs("Task added successfully"));
                            }

                        }}>
                        <Text style={styles.plusText}>{buttonText}</Text>
                    </TouchableOpacity>
                </View>

                {/* delete the item */}

                {item ?
                    <TouchableOpacity
                        style={[styles.delete, { width: width / 3.5, }]}
                        onPress={() => {
                            setIsLoading(true)
                            areYouSureDelete(item.item_id, resetInputs("Task deleted successfully"))
                        }}>
                        <Text style={styles.deleteText}>Delete task</Text>
                    </TouchableOpacity>
                    : null}


                {isLoading ?
                    <ActivityIndicator size="large" color="white" /> : null}

            </View>
        </HideKeyboard>

    )
}

const styles = StyleSheet.create({
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