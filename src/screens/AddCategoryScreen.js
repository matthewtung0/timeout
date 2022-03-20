import React, { useState, useContext } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { Context as CategoryContext } from '../context/CategoryContext';

const AddCategoryScreen = () => {
    const [categoryName, setCategoryName] = useState('')
    const [resMessage, setResMessage] = useState('')
    const { state, addCategory, fetchUserCategories } = useContext(CategoryContext)

    const resetInputs = async () => {
        setCategoryName('')
        setResMessage("Category set successfully!")

        // repull the list now that we've added to it
        await fetchUserCategories();
    }


    return (
        <View>
            <Text style={styles.title}>Add Category Screen</Text>

            <Input
                containerStyle={styles.nameInputStyleContainer}
                inputContainerStyle={styles.inputStyleContainer}
                placeholder='Category'
                autoCorrect={false}
                value={categoryName}
                onChangeText={setCategoryName}
            />

            <Button title="Add category"
                onPress={() => {
                    addCategory(categoryName, new Date(), resetInputs)
                }}></Button>

            {resMessage ? <Text>{resMessage}</Text> : null}
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        margin: 30,
        fontSize: 40,
    }
})

export default AddCategoryScreen;