import React, { useContext, useState, useCallback, useMemo } from 'react';
import {
    View, StyleSheet, Text, FlatList,
    TouchableOpacity, ActivityIndicator, Dimensions
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Context as ReactionContext } from '../context/ReactionContext';
import { Context as UserContext } from '../context/userContext';
import timeoutApi from '../api/timeout';
import { compareAsc } from 'date-fns';
import FriendFeedComponent from '../components/FriendFeedComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';

//const REFRESH_THRESHOLD_POSITION = -50;
const SCROLL_THROTTLE_RATE = 200;
const NUM_TO_RETRIEVE = 50;

const FriendFeedScreen = ({ navigation, route: { params } }) => {
    const { width, height } = Dimensions.get('window');
    //const { fetchUserReactions } = useContext(SessionContext)
    const { state: reactionState, fetchSessions, reactToActivity } = useContext(ReactionContext)
    const { state } = useContext(UserContext)
    //const [refreshToken, setRefreshToken] = useState(0)

    const [offset, setOffset] = useState(0)
    const [visibleOffset, setVisibleOffset] = useState(0);

    const [atEnd, setAtEnd] = useState(false)
    const [isOnline, setIsOnline] = useState(true)

    const [cacheChecker, setCacheChecker] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingRefresh, setIsLoadingRefresh] = useState(false)

    useFocusEffect(
        useCallback(() => {
            setIsLoadingRefresh(true)
            setOffset(0)
            setVisibleOffset(0)
            console.log("REFRESHING")
            getFeed();

            return () => {
                console.log("cleaning up")
                setIsLoading(false)
                setOffset(0)
                setVisibleOffset(0)
                setCacheChecker({})
                setAtEnd(false)
            }
        }, [state.friends])
        //[refreshToken])
    )

    const checkFriendsAvatarUpdate = async (user_id_list) => {
        // gets a list of user id
        user_id_list.push(state.user_id)
        let user_cache_dt_map = {}
        for (var i in user_id_list) {
            var avatar_dt = await AsyncStorage.getItem(`avatar_date_${user_id_list[i]}`)
            user_cache_dt_map[user_id_list[i]] = avatar_dt
            console.log(`For user_id ${user_id_list[i]}, ${avatar_dt}`)
        }

        let response = await timeoutApi.get(`/avatar12345/last_updated/multiple`,
            { params: { user_id_avatar_dt_map: user_cache_dt_map } })
        //console.log("rESPONSE IS ", response)

        var last_updated_dt = response.data.map((req) => { return { ...req, last_updated: new Date(req.last_updated) } })
        //console.log("RESPONSE IS ", last_updated_dt)

        //console.log("Actual dates are ", user_cache_dt_map)
        let avatars_need_to_update = {}
        for (var i in user_id_list) {
            var user_id = user_id_list[i]
            var cache_dt = new Date(user_cache_dt_map[user_id])
            var last_updated_Dt = last_updated_dt.filter(item => item.user_id == user_id)[0].last_updated
            //console.log(`cache_dt is ${cache_dt} and last_udpated_dt is ${last_updated_Dt}`)
            var comparison = compareAsc(last_updated_Dt, cache_dt)
            if (comparison < 0) { // < 0 if last updated is before we retrieve, means we are good
                avatars_need_to_update[user_id] = false
            } else {
                avatars_need_to_update[user_id] = true;
            }
        }
        setCacheChecker(avatars_need_to_update)
        console.log("Final cache Checker: ", avatars_need_to_update)

        /*Final cache Checker:  {"1d99de7c-a072-4732-8b47-3a8419230cf5": false, 
        "3c4b1f48-25a6-450a-a12c-6d4e67e2e27a": false, 
        "561bbe72-4658-435e-8c3d-959718b765b2": false, 
        "a8ae2254-95c3-4c8c-980b-a8a81dc51b49": false, 
        "ba94c57d-0c9f-4708-9b0e-9d76585d2f14": false, 
        "e87d16f9-1151-4a72-9233-c805502316ca": false}*/


        // return a map of user id's if we need to update

    }

    const getFeed = async () => {
        try {
            //await checkFriendsAvatarUpdate(state.friends.map(req => req.friend))
            let temp = await fetchSessions(state.friends, 0, 10, true)
            console.log("tEMP IS ", temp.map(req => { return req.user_id }))

            console.log(`Right now, offset is ${offset}`)
            setOffset(10)
            setVisibleOffset(10)

            setIsLoadingRefresh(false)
        } catch (err) {
            console.log("Problem retrieving feed", err)
        }
    }

    const getData = async () => {
        console.log("Loading 10 more..");
        if (atEnd) { return; }
        if (visibleOffset < offset) {
            // no need to retrieve, just reveal more items
            setVisibleOffset(visibleOffset + 10);
            return;
        }
        setIsLoading(true)
        try {
            let temp2 = await fetchSessions(state.friends, offset, NUM_TO_RETRIEVE)
            //let temp2 = await fetchSessionsNextBatch(offset, userState.friends)
            if (temp2.length == 0) { setAtEnd(true) } else {
                setOffset(offset + Math.min(temp2.length, NUM_TO_RETRIEVE))
                setVisibleOffset(visibleOffset + Math.min(temp2.length, 10))
            }

            setIsLoading(false)
        } catch (err) {
            console.log("Problem loading more data", err)
            setIsLoading(false)
        }
    }

    const renderFooter = () => {
        return (
            <View>
                {atEnd ?
                    <>
                        <Text style={styles.textDefault}>All caught up!</Text>
                        <View style={{ height: 50 }}></View>
                    </>
                    :
                    <View style={{ height: 50 }}></View>
                }
            </View>
        )
    }

    console.log(`visible offset is ${visibleOffset} and data offset is ${offset}`)

    const flatListItself = () => {
        return (
            <FlatList
                style={styles.flatlistStyle}
                horizontal={false}
                //onScroll={scrollEvent}
                onEndReached={getData}
                scrollEventThrottle={SCROLL_THROTTLE_RATE}
                data={reactionState.userSessions.slice(0, visibleOffset)}
                ItemSeparatorComponent={renderSeparator}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.activity_id}
                ListFooterComponent={renderFooter}
                renderItem={({ item, index }) =>
                    <FriendFeedComponent
                        item={item}
                        index={index}
                        cacheChecker={cacheChecker}
                        setCacheChecker={setCacheChecker}
                        navigation={navigation}
                        userReaction={reactionState.userReaction}
                        reactToActivity_={reactToActivity} />
                }
            >
            </FlatList>
        )
    }

    //console.log(reactionState.userReaction)

    const memoizedFlatList = useMemo(flatListItself, [reactionState.userSessions, visibleOffset, atEnd,
    reactionState.userReaction, state.friends])

    const renderSeparator = () => (
        <View
            style={{
                backgroundColor: '#C0C0C0',
                height: 0.1, marginHorizontal: 50,
            }}
        />
    );

    const secondRoute = () => {
        return (
            <View style={styles.outerContainer}>

                {!isOnline ?
                    <View style={{ flex: 1, alignContent: 'center', justifyContent: 'center', }}>
                        <Text style={[styles.textDefault, { textAlign: 'center', color: 'gray', fontSize: 18, }]}>Friend feed is currently unavailable. Please check your internet connection</Text>
                    </View>

                    :
                    <>
                        <View style={styles.makeshiftTabBarContainer}>
                            <View style={styles.makeshiftTabBar}>
                                <TouchableOpacity style={[styles.tabBarButton, { backgroundColor: '#C0C0C0', }]}
                                    onPress={() => {
                                        navigation.navigate('Notifications', { cacheChecker })
                                    }}>
                                    <Text style={[styles.tabBarText, styles.textDefaultBold,
                                    { color: 'grey' }]}>Me</Text>
                                </TouchableOpacity>
                                <View style={styles.tabBarButton}>
                                    <Text style={[styles.tabBarText, styles.textDefaultBold,]}>Feed</Text>
                                </View>

                                <TouchableOpacity style={[styles.tabBarButton, , { backgroundColor: '#C0C0C0', }]}
                                    onPress={() => { navigation.navigate('Friend', { cacheChecker }) }}>
                                    <Text style={[styles.tabBarText, styles.textDefaultBold,
                                    { color: 'grey' }]}>Friends</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/*<Text>{JSON.stringify(state.userReaction)}</Text>*/}
                        {isLoadingRefresh ? <ActivityIndicator
                            style={{ marginTop: 15 }}
                            size="large"
                            color='black' /> : null}


                        {reactionState.userSessions.length == 0 ?
                            <View style={{ alignItems: 'center' }}>
                                <Text style={[styles.textDefault, {
                                    marginTop: 20, marginBottom: 10,
                                    color: '#67806D', fontSize: 16, textAlign: 'center', marginHorizontal: 10,
                                }]}>
                                    Nothing in your feed yet. Tell your friends to start getting productive!</Text>
                            </View>
                            :
                            <>
                                <View style={styles.flatListContainer}>
                                    {memoizedFlatList}
                                </View>

                            </>

                        }
                    </>}
            </View>
        )
    }

    return (secondRoute())
}

const styles = StyleSheet.create({
    textDefaultBold: {
        fontFamily: 'Inter-Bold',
    },
    textDefault: {
        fontFamily: 'Inter-Regular',
    },
    outerContainer: {
        marginTop: 110, //here because header is transparent
        flex: 1,
        flexDirection: 'column',
    },
    makeshiftTabBarContainer: {
        flex: 0.1,
    },
    flatListContainer: {
        flex: 0.9,
    },
    makeshiftTabBar: {
        flex: 1,
        flexDirection: 'row',
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
        borderBottomWidth: 0.2,
        borderBottomColor: 'gray',
        height: 75,
    },
    pfpcontainer: {
        flex: 0.25,
        //backgroundColor: 'green',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pfp: {
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
    tabBarButton: {
        flex: 1,
        padding: 10,
        height: 50,
        backgroundColor: '#ABC57E',
        alignItems: 'center',
        justifyContent: 'center'
    },
    tabBarText: {
        color: 'white',
        fontSize: 17,
    }

})

export default FriendFeedScreen;