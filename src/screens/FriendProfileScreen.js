import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

const FriendProfileScreen = () => {

    return (
        <View>
            <Text style={styles.title}>Friend Profile Screen</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        margin:30,
        fontSize:40,
    }
})

export default FriendProfileScreen;