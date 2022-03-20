import React, { useRef, useState } from 'react';
import { View, StyleSheet, Text, Button, TouchableOpacity } from 'react-native';

const ToDoSelector = ({ toggleFunction }) => {

    return (
        <View style={styles.modal}>
            <Text>ToDo Selector Component</Text>

            <Button title="Hide modal"
                onPress={toggleFunction} />
        </View>
    )
}

const styles = StyleSheet.create({
    modal: {
        flex: 1,
        backgroundColor: 'yellow',
        margin: 50,
    }
})

export default ToDoSelector;