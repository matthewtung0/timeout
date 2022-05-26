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

    const { state, addTodoItem, editTodoItem, fetchUserTodoItems } = useContext(CategoryContext)

    const [notes, setNotes] = useState('')

    const INPUT_WIDTH = width * 0.8

    const resetInputs = async () => {
        setToDoItemName('')
        setIsLoading(false)
        alert("Information added successfully!")

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

            <View style={[styles.container, { width: width * 0.9, alignSelf: 'center' }]}>
                <Text style={styles.title}></Text>

                {children}
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
        marginTop: 20,
        backgroundColor: 'white',
        borderRadius: 15,
        paddingHorizontal: 10,
        alignSelf: 'center',
        marginBottom: 40,
    },
    notes: {
        alignSelf: 'center',
        backgroundColor: 'white',
        padding: 10,
        paddingTop: 12,
        borderRadius: 10,
        marginHorizontal: 25,
        marginBottom: 40,
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
        marginBottom: 40,
        marginTop: 40,
        shadowOffset: {
            width: 0.05,
            height: 0.05,
        },
        shadowOpacity: 0.3,
    },
    plusText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold'
    }
})

export default AddTodoComponent;