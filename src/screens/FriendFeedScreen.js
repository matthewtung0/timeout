import React, { useContext, useState, useCallback } from 'react';
import { View, StyleSheet, Text, FlatList, Pressable } from 'react-native';
import { Input, Button, Icon } from 'react-native-elements';
import { useFocusEffect } from '@react-navigation/native';
import { Context as SessionContext } from '../context/SessionContext';

const FriendFeedScreen = ({ navigation }) => {
    const { state, fetchSessions, fetchUserReactions, reactToActivity } = useContext(SessionContext)
    const [disableTouch, setDisableTouch] = useState(false)

    useFocusEffect(

        useCallback(() => {
            console.log("use focus effect")
            getFeed();
        }, [])
    )

    const getFeed = async () => {
        try {
            await fetchSessions()
            await fetchUserReactions()
        } catch (err) {
            console.log("Problem retrieving feed", err)
        }
    }

    // add flag to identify which posts user likes, so dont need to re-search every state change
    /*const setUserLikes = () => {
        console.log("Setting user likes")
        let string_temp = JSON.stringify(state.userReaction)
        for (var i = 0; i < state.userSessions.length; i++) {
            if (string_temp.includes(state.userSessions[i].activity_id)) {
                state.userSessions[i].self_liked = true;
            } else {
                state.userSessions[i].self_liked = false;
            }
        }
    }*/

    // make buttons enabled again after api calls done
    const reactCallback = () => {
        setDisableTouch(false)
    }

    return (
        <View>

            <Text style={styles.title}>Friend Feed Screen</Text>
            {/*<Text>{JSON.stringify(state.userReaction)}</Text>*/}
            <FlatList
                style={styles.flatlistStyle}
                horizontal={false}
                data={state.userSessions}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(result) => result.activity_id}
                renderItem={({ item }) => {
                    return (
                        <View style={styles.listItem}>
                            <Text>Username: {item.username}</Text>
                            <Text>Activity: {item.activity_name}</Text>
                            <Text>Category: {item.category_name}</Text>
                            <Text>Time done: {item.time_start}</Text>
                            <View style={styles.likeContainer}>
                                <Text style={styles.likeCount}>{item.reaction_count}</Text>
                                <Pressable
                                    onPress={() => {
                                        let is_like = true
                                        if (JSON.stringify(state.userReaction).includes(item.activity_id)) {
                                            is_like = false
                                        }
                                        reactToActivity(item.activity_id, is_like, reactCallback)
                                    }}>
                                    {JSON.stringify(state.userReaction).includes(item.activity_id) ?
                                        <Icon
                                            name="heart"
                                            type='font-awesome'
                                            color='purple' /> :
                                        <Icon
                                            name="heart-o"
                                            type='font-awesome' />}

                                </Pressable>
                            </View>

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
        margin: 10,
        fontSize: 20,
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
    },
    likeContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    likeCount: {
        marginHorizontal: 5,
    }
})

export default FriendFeedScreen;