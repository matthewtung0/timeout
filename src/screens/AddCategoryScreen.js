import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Input, Button } from 'react-native-elements';
import timeoutApi from '../api/timeout';

const AddCategoryScreen = () => {
    const [categoryName, setCategoryName] = useState('')
    const [resMessage, setResMessage] = useState('')

    const addCategory = async () => {
        const response = await timeoutApi.post('/addCategory', { categoryName: categoryName, timeSubmitted: new Date() })
        if (response.status == 200) {
            setResMessage("Category set successfully!")
        } else {
            setResMessage("Error adding category! Changes not saved.")
        }
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
                    addCategory()
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