import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

const TodoListScreen = () => {

    return (
        <View>
            <Text style={styles.title}>Todo List Screen</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        margin:30,
        fontSize:40,
    }
})

export default TodoListScreen;