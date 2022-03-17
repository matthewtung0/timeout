import React from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';

const PastActivityCard = () => {
    const { height, width } = Dimensions.get('window');

    return (
        <View style={[styles.cardStyle, { width: width * 0.8, height: height * 0.1 }]}>
            <Text>Activity #1</Text>
        </View>
    )
}


const styles = StyleSheet.create({
    title: {
        margin: 30,
        fontSize: 25,
    },
    cardStyle: {
        backgroundColor: 'darkorange',
        alignSelf: 'center',
        margin: 5,
        borderRadius: 10,
        padding: 10,
    }
})

export default PastActivityCard;