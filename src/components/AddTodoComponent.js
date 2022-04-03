import React, { useState, useContext } from 'react';
import { View, StyleSheet, Text, FlatList } from 'react-native';
import { Input, Button } from 'react-native-elements'
import { Context as CategoryContext } from '../context/CategoryContext';
import CategoryButton from './CategoryButton';

const AddTodoComponent = ({ callback }) => {
    const [toDoItemName, setToDoItemName] = useState('')
    const [resMessage, setResMessage] = useState('')
    const { state, addTodoItem, fetchUserTodoItems } = useContext(CategoryContext)

    const [selectedButton, setSelectedButton] = useState({ buttonName: 'unsorted', buttonId: 3 });

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
        <View>
            <Text style={styles.title} > Add To-do Item Screen </Text>

            < Input
                containerStyle={styles.nameInputStyleContainer}
                inputContainerStyle={styles.inputStyleContainer}
                placeholder='To-do Item Name'
                autoCorrect={false}
                value={toDoItemName}
                onChangeText={setToDoItemName}
            />

            <Text>Choose a category for this to-do item.</Text>

            < FlatList
                columnWrapperStyle={{ justifyContent: 'space-between', flex: 1, marginVertical: 5, marginHorizontal: 10 }
                }
                style
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
            >
            </FlatList>

            < Button title="Add To-do Item"
                onPress={() => {
                    addTodoItem(toDoItemName, new Date(), selectedButton.buttonId, resetInputs);

                }} />
            {
                resMessage ? <Text>{resMessage} </Text> : null}
            {
                state.errorMessage ? <Text>{state.errorMessage} </Text> : null}

        </View>

    )
}

const styles = StyleSheet.create({
})

export default AddTodoComponent;