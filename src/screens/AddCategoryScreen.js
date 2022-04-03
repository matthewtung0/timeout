import React, { useState, useContext } from 'react';
import { View, StyleSheet, Text, FlatList } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Context as CategoryContext } from '../context/CategoryContext';
const constants = require('../components/constants.json')

const AddCategoryScreen = () => {
    const [categoryName, setCategoryName] = useState('')
    const [resMessage, setResMessage] = useState('')
    const { state, addCategory, fetchUserCategories } = useContext(CategoryContext)

    const [chosenColor, setChosenColor] = useState('c0')

    const resetInputs = async () => {
        setCategoryName('')
        setResMessage("Category set successfully!")

        // repull the list now that we've added to it
        await fetchUserCategories();
    }

    var colorArr = []
    //let colors = JSON.parse(constants.colors)
    for (var i in constants['colors']) {
        colorArr.push([i, constants['colors'][i]])
    }
    console.log(colorArr)

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
            <Text>Chosen Color: {chosenColor}</Text>
            <Text>Choose color assignment:</Text>
            < FlatList
                style
                horizontal={true}
                data={colorArr}
                keyExtractor={(item) => item[0]}
                renderItem={({ item }) => {
                    return (
                        < >
                            <TouchableOpacity
                                style={[styles.colorSquare, { backgroundColor: item[1] }]}
                                onPress={() => { setChosenColor(item[0]) }}
                            />
                        </>
                    )
                }}
            >
            </FlatList>



            <Button title="Add category"
                onPress={() => {
                    addCategory(categoryName, new Date(), chosenColor, resetInputs)
                }}></Button>

            {resMessage ? <Text>{resMessage}</Text> : null}
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        margin: 30,
        fontSize: 40,
    },
    colorSquare: {
        width: 50,
        height: 50,
        marginHorizontal: 5,
        marginVertical: 20,
    }
})

export default AddCategoryScreen;