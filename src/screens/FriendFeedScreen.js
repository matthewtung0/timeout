import React, { useContext, useState } from 'react';
import { View, StyleSheet, Text, FlatList } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { Input, Button } from 'react-native-elements';

import timeoutApi from '../api/timeout';

const FriendFeedScreen = ({ navigation }) => {
    const [feed, setFeed] = useState([]);

    const getFeed = async () => {
        try {
            const response = await timeoutApi.get('/sessions')
            setFeed(response.data);
        } catch (err) {
            console.log("Problem retrieving feed", err)
        }
    }

    return (
        <View>
            <NavigationEvents
                onWillFocus={getFeed}
            />

            <Text style={styles.title}>Friend Feed Screen</Text>


            <FlatList
                style={styles.flatlistStyle}
                horizontal={false}
                data={feed}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(result) => result.activity_id}
                renderItem={({ item }) => {
                    return (
                        <View style={styles.listItem}>
                            <Text>Username: {item.username}</Text>
                            <Text>Activity: {item.activity_name}</Text>
                            <Text>Category: {item.category_name}</Text>
                            <Text>Time done: {item.time_start}</Text>
                        </View>
                    )
                }}
            >
            </FlatList>



        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        margin: 30,
        fontSize: 40,
    }, listItem: {
        margin: 5,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
        padding: 5,
    },
    flatlistStyle: {
        margin: 5,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
        padding: 5,
    }
})

export default FriendFeedScreen;