import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

const AddTodoItemScreen = () => {

    return (
        <View>
            <Text style={styles.title}>Add Todo Item Screen</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        margin:30,
        fontSize:40,
    }
})

export default AddTodoItemScreen;