import React, { useState, useContext } from 'react';
import { View, StyleSheet, Text, FlatList } from 'react-native';
import { Input, Button } from 'react-native-elements'
import timeoutApi from '../api/timeout';
import { Context as CategoryContext } from '../context/CategoryContext';
import CategoryButton from '../components/CategoryButton';


const TodoListScreen = () => {
    const [toDoItemName, setToDoItemName] = useState('')
    const [resMessage, setResMessage] = useState('')
    const { state } = useContext(CategoryContext)

    const [selectedButton, setSelectedButton] = useState({ buttonName: 'unsorted', buttonId: 3 });

    const resetInputs = () => {
        setSelectedButton({ buttonName: 'unsorted', buttonId: 3 })
        setToDoItemName('')
    }

    const addItem = async () => {
        const response = await timeoutApi.post('/addItem', {
            toDoItemName: toDoItemName, timeSubmitted: new Date(),
            categoryId: selectedButton.buttonId
        })
        if (response.status == 200) {
            setResMessage("To-do item set successfully!")
            resetInputs()
        } else {
            setResMessage("Error adding to-do item! Changes not saved.")
        }
    }

    const updateButton = (button) => {
        setSelectedButton(button);
    }

    return (
        <View>
            <Text style={styles.title}>Add To-do Item Screen</Text>

            <Input
                containerStyle={styles.nameInputStyleContainer}
                inputContainerStyle={styles.inputStyleContainer}
                placeholder='To-do Item Name'
                autoCorrect={false}
                value={toDoItemName}
                onChangeText={setToDoItemName}
            />

            <Text>Choose a category for this to-do item.</Text>

            <FlatList
                columnWrapperStyle={{ justifyContent: 'space-between', flex: 1, marginVertical: 5, marginHorizontal: 10 }}
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
                            bgColor="#FDD696"
                            callback={updateButton} />
                    )
                }}


            >
            </FlatList>

            <Button title="Add To-do Item"
                onPress={() => {
                    addItem()
                }}></Button>

            {resMessage ? <Text>{resMessage}</Text> : null}

        </View>
    )
}

TodoListScreen.navigationOptions = () => {
    return {
        headerShown: false,
    };
}

const styles = StyleSheet.create({
    title: {
        margin: 30,
        fontSize: 40,
    }
})

export default TodoListScreen;