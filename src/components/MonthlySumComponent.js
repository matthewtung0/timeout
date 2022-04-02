import React from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';

const MonthlySumComponent = ({ monthBatch }) => {
    const { height, width } = Dimensions.get('window');

    return (
        <View>
            <Text>asdfsdf</Text>
        </View>
    )
}


const styles = StyleSheet.create({
    title: {
        margin: 30,
        fontSize: 25,
    },
})

export default MonthlySumComponent;