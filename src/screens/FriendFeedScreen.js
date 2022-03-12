import React, {useContext} from 'react';
import {View, StyleSheet, Text, FlatList} from 'react-native';
import {NavigationEvents} from 'react-navigation';
import {Context as SessionContext} from '../context/SessionContext';

const FriendFeedScreen = ( {navigation} ) => {
    console.log("got here");
    const {state, fetchSessions} = useContext(SessionContext)
    console.log(state);
    return (
        <View>
            <NavigationEvents onWillFocus={fetchSessions} />
            <Text style={styles.title}>Friend Feed Screen</Text>

            <Text>{JSON.stringify(state)}</Text>

        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        margin:30,
        fontSize:40,
    }
})

export default FriendFeedScreen;