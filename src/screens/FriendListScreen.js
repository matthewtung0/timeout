import React, { useState, useCallback, useContext } from 'react';
import { View, SafeAreaView, StyleSheet, Text, FlatList, Pressable, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { useFocusEffect } from '@react-navigation/native';

import { Context as SessionContext } from '../context/SessionContext';
import { differenceInDays, parseISO, differenceInSeconds } from 'date-fns';
import timeoutApi from '../api/timeout';


// TEMPORARY TESTING GROUND TO SEE WHY FLATLIST IS RE-RENDERING IN FRIENDFEEDSCREEN
const FriendListScreen = () => {
    const [offset, setOffset] = useState(0)
    const [disableTouch, setDisableTouch] = useState(false)
    //const [userSessions, setUserSessions] = useState([])
    const { state: sessionState,
        fetchSessions, fetchSessionsNextBatch, fetchUserReactions, reactToActivity } = useContext(SessionContext)

    useFocusEffect(
        useCallback(() => {
            console.log("use focus effect")
            getFeed();
        }, [])
    )

    const getFeed = async () => {
        try {
            //await fetchSessions()
            // reset the offset
            setOffset(0)
            //setUserSessions([])
            let temp = await fetchSessions()
            //setUserSessions(temp)
            setOffset(offset + 10)
            await fetchUserReactions()
        } catch (err) {
            console.log("Problem retrieving feed", err)
        }
    }

    /*const fetchSessionsNextBatch = async (startIndex = 0) => {
        const response = await timeoutApi.get('/session', { params: { startIndex } })
        console.log(response.data)
        return response.data
    }

    const fetchSessions = async () => {
        const response = await timeoutApi.get('/session')
        return response.data
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

    const getData = async () => {
        console.log("Loading 10 more..");
        try {
            let temp2 = await fetchSessionsNextBatch(offset)
            //setUserSessions([...userSessions, ...temp2]);
            setOffset(offset + 10)
        } catch (err) {
            console.log("Problem loading more data", err)
        }
    }

    const renderFooter = () => {
        return (
            <View>
                <TouchableOpacity style={styles.loadMore}
                    onPress={getData}>
                    <Text style={styles.loadMoreText}>Load More</Text>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <View>
            {/*<Text>{JSON.stringify(state.userReaction)}</Text>*/}
            <FlatList
                style={styles.flatlistStyle}
                horizontal={false}
                data={sessionState.userSessions}
                //data={userSessions}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.activity_id}
                ListFooterComponent={renderFooter}
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
                                            if (JSON.stringify(sessionState.userReaction).includes(item.activity_id)) {
                                                is_like = false
                                            }
                                            reactToActivity(item.activity_id, is_like, reactCallback)
                                        }}>
                                        {JSON.stringify(sessionState.userReaction).includes(item.activity_id) ?
                                            <Icon
                                                name="heart"
                                                type='font-awesome'
                                                color='#F5BBAE' /> :
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
    outerContainer: {
        marginTop: 70, //here because header is transparent
    },
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
    },
    loadMore: {
        marginVertical: 20,
        padding: 10,
        backgroundColor: '#ABC57E',
        alignItems: 'center',
    },
    loadMoreText: {
        fontWeight: 'bold',
        color: 'white',
        fontSize: 18,
    },
})

export default FriendListScreen;