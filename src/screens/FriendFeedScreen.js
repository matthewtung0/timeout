import React, { useContext, useState, useCallback } from 'react';
import { View, StyleSheet, Text, FlatList, Pressable } from 'react-native';
import { Input, Button, Icon } from 'react-native-elements';
import { useFocusEffect } from '@react-navigation/native';
import { Context as SessionContext } from '../context/SessionContext';
import { differenceInDays, parseISO, differenceInSeconds } from 'date-fns';
const constants = require('../components/constants.json')

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

    const duration = (startTime, endTime) => {
        return differenceInSeconds(parseISO(endTime), parseISO(startTime))
    }
    const daysAgo = (endTime) => {
        return differenceInDays(new Date(), parseISO(endTime))
    }

    console.log(state.userSessions)
    return (
        <View>

            {/*<Text>{JSON.stringify(state.userReaction)}</Text>*/}
            <FlatList
                style={styles.flatlistStyle}
                horizontal={false}
                data={state.userSessions}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(result) => result.activity_id}
                renderItem={({ item }) => {
                    return (
                        <View style={styles.container}>
                            <View style={styles.pfpcontainer}>
                                <View style={styles.pfp}>

                                </View>
                            </View>
                            <View style={styles.listItem}>
                                <Text>
                                    <Text style={styles.bolded}>{item.username}</Text>
                                    <Text> finished </Text>
                                    <Text style={styles.bolded}>{duration(item.time_start, item.time_end)}</Text>
                                    <Text> seconds</Text>
                                </Text>
                                <Text>
                                    <Text>of </Text>
                                    {/*[styles.bolded, { color: constants.colors[item.color_id] }]*/}
                                    <Text style={[styles.bolded]}>{item.category_name}</Text>
                                    <Text> {daysAgo(item.time_end)} days ago</Text>
                                </Text>

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
                        </View>
                    )
                }}
            >
            </FlatList>
        </View>
    )
}

const styles = StyleSheet.create({
    flatlistStyle: {
        margin: 5,
        borderRadius: 5,
        padding: 5,
        height: '100%',
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
    },
    pfpcontainer: {
        flex: 0.25,
        //backgroundColor: 'green',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pfp: {
        backgroundColor: 'brown',
        height: 50,
        width: 50,
        borderRadius: 100,
    },
    title: {
        margin: 10,
        fontSize: 20,
    },
    listItem: {
        flex: 1,
        margin: 5,
        padding: 5,
        //backgroundColor: 'red',
    },
    likeContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    likeCount: {
        marginHorizontal: 5,
    },
    bolded: {
        fontWeight: 'bold',
    }
})

export default FriendFeedScreen;