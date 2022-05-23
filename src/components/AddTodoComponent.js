import React, { useState, useContext, useCallback } from 'react';
import {
    View, StyleSheet, Text, TextInput, TouchableOpacity, Dimensions, Keyboard, TouchableWithoutFeedback
} from 'react-native';
import { Input } from 'react-native-elements'
import { useFocusEffect } from '@react-navigation/native';
import { Context as CategoryContext } from '../context/CategoryContext';
import DropDownComponent from '../components/DropDownComponent';

const HideKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>
);

// double as add new item and editing existing items
const AddTodoComponent = ({ title, callback, item }) => {
    const { height, width } = Dimensions.get('window');

    const [toDoItemName, setToDoItemName] = useState('')

    const [categoryName, setCategoryName] = useState(item ? item.category_name : 'Unsorted')
    const [colorId, setColorId] = useState(item ? item.color_id : 'c6')
    const [categoryId, setCategoryId] = useState(item ? item.category_id : '3')

    const [resMessage, setResMessage] = useState('')
    const { state, addTodoItem, editTodoItem, fetchUserTodoItems } = useContext(CategoryContext)

    const [selectedButton, setSelectedButton] = useState({ buttonName: 'unsorted', buttonId: 3 });
    const [notes, setNotes] = useState('Enter notes (optional)')

    const resetInputs = async () => {
        setSelectedButton({ buttonName: 'unsorted', buttonId: 3 })
        setToDoItemName('')
        setResMessage('To-do Item successfully added.')

        // repull the list now that we've added to it
        await fetchUserTodoItems();
        if (callback) { callback() }

    }

    const updateButton = (button) => {
        setSelectedButton(button);
    }

    const validateInputs = () => {
        if (toDoItemName == '') {
            alert("Please enter a task name")
            return false
        }
        return true
    }
    console.log("this item is", item)


    // initialize data if this is an edit of existing task
    useFocusEffect(
        useCallback(() => {
            if (item) {

                setToDoItemName(item.item_desc)
                setNotes(item.notes)
                setSelectedButton({ buttonName: item.category_name, buttonId: item.category_id })
            }
        }, [])
    )

    return (

        <HideKeyboard>

            <View
                style={styles.container}
            >
                {/*<Text style={styles.title}>{title}</Text>*/}
                <Text style={styles.title}></Text>

                < Input
                    inputContainerStyle={styles.inputStyleContainer}
                    style={styles.inputStyle}
                    placeholder='Task'
                    autoCorrect={false}
                    value={toDoItemName}
                    onChangeText={setToDoItemName}
                />
                <TextInput
                    style={styles.notes}
                    multiline={true}
                    numberOfLines={4}
                    maxHeight={120}
                    editable
                    maxLength={150}
                    value={notes}
                    textAlignVertical='top'
                    onChangeText={setNotes}

                />

                {/*<Text>selected button is {selectedButton.buttonName}</Text>*/}

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
                <TouchableOpacity
                    style={[styles.plus, { width: width / 2.2, height: height / 12 }]}
                    onPress={() => {
                        if (!validateInputs()) { return }
                        if (item) {
                            //editTodoItem(toDoItemName, selectedButton.buttonId, notes, item.item_desc, resetInputs);
                            //toDoItemName, categoryId, notes, oldToDoName, callback = null

                            editTodoItem(toDoItemName, categoryId, notes, item.item_desc, resetInputs)
                        } else {
                            addTodoItem(toDoItemName, new Date(), categoryId, notes, resetInputs);
                        }

                    }}>
                    <Text style={styles.plusText}>+</Text>
                </TouchableOpacity>

                {
                    resMessage ? <Text>{resMessage} </Text> : null}
                {
                    state.errorMessage ? <Text>{state.errorMessage} </Text> : null}

            </View>
        </HideKeyboard>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-around',
        backgroundColor: '#83B569'
    },
    title: {
        alignSelf: 'center',
        margin: 15,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#F6F2DF',
    },
    inputStyle: {
        backgroundColor: 'white',
        borderRadius: 15,
        marginHorizontal: 25,
        paddingHorizontal: 17,
    },
    notes: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
        marginHorizontal: 25,
        marginVertical: 10,
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
        marginBottom: 20,
    },
    plusText: {
        color: 'white',
        fontSize: 50,
        fontWeight: 'bold'
    },
    catButtons: {
        marginHorizontal: 15,
        marginBottom: 10,
    }
})

export default AddTodoComponent;