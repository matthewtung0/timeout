import React, { } from 'react';
import { View, StyleSheet } from 'react-native';
import AddTodoComponent from '../components/AddTodoComponent';

const TodoListScreen = () => {

    return (
        <View>
            <AddTodoComponent />
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