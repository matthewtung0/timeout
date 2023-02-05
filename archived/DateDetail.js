import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const DateDetail = ({ result, updateCallback }) => {

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() =>
                updateCallback(result)
            }
            >
                <Text>{result}</Text>
            </TouchableOpacity>

        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        margin: 5,
        padding: 5,
        borderWidth: 1,
    },
    name: {
        fontWeight: 'bold',
    }
});

export default DateDetail;