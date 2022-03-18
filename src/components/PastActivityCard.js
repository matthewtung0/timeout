import React from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';

const PastActivityCard = ({ session }) => {
    const { height, width } = Dimensions.get('window');
    let sesh = session

    return (
        <View style={[styles.cardStyle, { width: width * 0.8, height: height * 0.1 }]}>
            <Text>{sesh.activity_name}</Text>
            <Text>Productivity: {sesh.prod_rating}</Text>
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