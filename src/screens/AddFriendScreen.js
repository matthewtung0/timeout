import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

const AddFriendScreen = () => {

    return (
        <View>
            <Text style={styles.title}>Add Friend Screen</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        margin:30,
        fontSize:40,
    }
})

export default AddFriendScreen;