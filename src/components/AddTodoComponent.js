import React, { useState, useContext } from 'react';
import {
    View, StyleSheet, Text, FlatList, TextInput,
    KeyboardAvoidingView, TouchableOpacity, Dimensions
} from 'react-native';
import { Input, Button } from 'react-native-elements'
import { Context as CategoryContext } from '../context/CategoryContext';
import CategoryButton from './CategoryButton';

const AddTodoComponent = ({ callback }) => {
    const { height, width } = Dimensions.get('window');
    const [toDoItemName, setToDoItemName] = useState('')
    const [resMessage, setResMessage] = useState('')
    const { state, addTodoItem, fetchUserTodoItems } = useContext(CategoryContext)

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

    return (

        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <Text style={styles.title}>Add Task</Text>

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
                maxLength={5}
                value={notes}
                textAlignVertical='top'
                onChangeText={setNotes}

            />

            < FlatList
                columnWrapperStyle={{ justifyContent: 'space-between', flex: 1, marginVertical: 5, marginHorizontal: 10 }}
                style={styles.catButtons}
                horizontal={false}
                data={state.userCategories}
                numColumns='3'
                showsHorizontalScrollIndicator={false}
                keyExtractor={(result) => result.category_id}
                renderItem={({ item }) => {
                    return (
                        <CategoryButton
                            id={item.category_id}
                            catName={item.category_name}
                            bgColor={item.color_id}
                            callback={updateButton} />
                    )
                }}
            />

            <TouchableOpacity
                style={[styles.plus, { width: width / 2.2, height: height / 12 }]}
                onPress={() => {
                    addTodoItem(toDoItemName, new Date(), selectedButton.buttonId, notes, resetInputs);

                }}>
                <Text style={styles.plusText}>+</Text>
            </TouchableOpacity>

            {
                resMessage ? <Text>{resMessage} </Text> : null}
            {
                state.errorMessage ? <Text>{state.errorMessage} </Text> : null}

        </KeyboardAvoidingView>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-around',
        backgroundColor: '#90AB72'
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