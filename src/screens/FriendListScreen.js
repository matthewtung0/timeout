import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

const FriendListScreen = () => {

    return (
        <View>
            <Text style={styles.title}>Friend List Screen</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        margin:30,
        fontSize:40,
    }
})

export default FriendListScreen;