import React, { useState, useCallback, useContext, useMemo } from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Icon } from 'react-native-elements';
import { Context as userContext } from '../context/userContext';
import { Context as SessionContext } from '../context/SessionContext';
import { FriendNotificationItem } from '../components/FriendNotificationComponent';
const NUM_TO_RETRIEVE = 50

const FriendNotificationScreen = ({ navigation, route: { params } }) => {
    const [isOnline, setIsOnline] = useState(true)
    const { state: sessionState,
        fetchNotifications, fetchNotificationsBatch } = useContext(SessionContext)
    const { state, requestFriend, fetchOutgoingRequests, fetchIncomingRequests,
        acceptFriendRequest, rejectFriendRequest, fetchFriends } = useContext(userContext)

    const [visibleOffset, setVisibleOffset] = useState(0)
    const [offset, setOffset] = useState(0)
    const [atEnd, setAtEnd] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [outgoingRequestsVisible, setOutgoingRequestsVisible] = useState(true)
    const [incomingRequestsVisible, setIncomingRequestsVisible] = useState(true)

    const toggleOutgoingRequestsVisible = () => {
        setOutgoingRequestsVisible(!outgoingRequestsVisible)
    }
    const toggleIncomingRequestsVisible = () => {
        setIncomingRequestsVisible(!incomingRequestsVisible)
    }

    const areYouSureUndoSend = (friend, callback, errorCallback_) => {
        Alert.alert(
            "Are you sure you want to unsend this friend request?",
            "",
            [
                {
                    text: "Go back", onPress: () => { return false }, style: "cancel"
                },
                {
                    text: "Undo send", onPress: () => { rejectFriendRequest(friend, callback, errorCallback_) }
                }
            ]
        );
    }

    const areYouSureReject = (friend, callback, errorCallback_) => {
        Alert.alert(
            "Are you sure you want to reject this friend request?",
            "",
            [
                {
                    text: "Go back", onPress: () => { return false }, style: "cancel"
                },
                {
                    text: "Reject", onPress: () => { rejectFriendRequest(friend, callback, errorCallback_) }
                }
            ]
        );
    }

    const getNotifications = async () => {
        setIsLoading(true)
        var initialBatchSize = 10
        await fetchNotificationsBatch(0, initialBatchSize, true);
        setVisibleOffset(initialBatchSize)
        setOffset(initialBatchSize);
        setIsLoading(false)
    }

    const getNextBatch = async () => {
        if (atEnd) {
            return;
        }
        setIsLoading(true)
        console.log("Loading 10 more..");
        if (visibleOffset < offset) {
            // no need to retrieve, just reveal more items
            setVisibleOffset(visibleOffset + 10);
            setIsLoading(false)
            return;
        }

        setIsLoading(true)
        var numToRetrieve = NUM_TO_RETRIEVE
        try {
            const response2 = await fetchNotificationsBatch(offset, numToRetrieve, false);

            //let temp2 = await fetchSessionsNextBatchSelf(offset, state.user_id)
            if (response2.length == 0) { setAtEnd(true) } else {
                setOffset(offset + Math.min(response2.length, numToRetrieve))
                setVisibleOffset(visibleOffset + Math.min(response2.length, 10))
            }
            setIsLoading(false);
        } catch (err) {
            setIsLoading(false)
            console.log("Problem loading more notifications", err)
        }

    }

    const undoSendCallback = async () => {
        alert("Unsent friend request successfully.")
    }

    const rejectFriendCallback = async () => {
        //await fetchFriends()
        alert("Rejected successfully.");

    }
    const acceptFriendCallback = async () => {
        await fetchFriends()
        alert("Friend request successfully accepted.");
    }

    const errorCallback = async () => {
        alert("Something went wrong - please try again later.")
        setIsLoading(false)
    }

    useFocusEffect(
        useCallback(() => {
            fetchOutgoingRequests();
            fetchIncomingRequests();
            getNotifications()

            return () => {
                console.log("cleaning up")
                setOffset(0)
                setVisibleOffset(0)
                setAtEnd(false)
            }
        }, [])
    )
    console.log("CACHE CHECKER IS ", params)

    const renderFooter = () => {
        return (
            <View>
                {atEnd ?
                    <View style={styles.loadMore}>
                        <Text>At end</Text>
                    </View>
                    :
                    null
                    /*<TouchableOpacity style={styles.loadMore}
                        onPress={getData}>
                        <Text style={styles.loadMoreText}>Load More</Text>
                </TouchableOpacity>*/
                }
            </View>
        )
    }

    const flatListItself = () => {
        return (
            <FlatList
                style={{ marginBottom: 20, flex: 1, }}
                data={sessionState.userNotifications.slice(0, visibleOffset)}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.interaction_id}
                onEndReached={getNextBatch}
                ItemSeparatorComponent={renderSeparator}
                ListFooterComponent={renderFooter}
                renderItem={({ item, index }) => (
                    <FriendNotificationItem
                        cacheChecker={params.cacheChecker}
                        item={item}
                        navigation={navigation} />
                )}
            >
            </FlatList>
        )
    }

    const memoizedFlatList = useMemo(flatListItself, [sessionState.userNotifications, params.cacheChecker,
        offset,
        visibleOffset, atEnd])

    const renderSeparator = () => (
        <View
            style={{
                backgroundColor: '#C0C0C0',
                height: 0.5,
                marginVertical: 5,
            }}
        />
    );
    return (
        <View style={styles.outerContainer}>

            {!isOnline ?
                <View style={{ flex: 1, alignContent: 'center', justifyContent: 'center', }}>
                    <Text style={[styles.textDefault, { textAlign: 'center', color: 'gray', fontSize: 18, }]}>Friend feed is currently unavailable. Please check your internet connection</Text>
                </View>
                :
                <>
                    {isLoading ?

                        <View style={{
                            position: 'absolute', flex: 1, width: '100%', height: '100%',
                            justifyContent: 'center', alignItems: 'center', backgroundColor: 'white',
                            opacity: 0.7,
                        }}>

                            <ActivityIndicator size="large" color="gray" />
                        </View>
                        : null}
                    <View style={{ flex: 1, }}>

                        <View style={styles.makeshiftTabBarContainer}>
                            <View style={styles.makeshiftTabBar}>
                                <View style={styles.tabBarButton}>
                                    <Text style={[styles.tabBarText, styles.textDefaultBold,]}>Me</Text>
                                </View>
                                <TouchableOpacity style={[styles.tabBarButton, , { backgroundColor: '#C0C0C0', }]}
                                    onPress={() => { navigation.navigate('FriendFeed') }}>
                                    <Text style={[styles.tabBarText, styles.textDefaultBold, { color: 'grey' }]}>Feed</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={[styles.tabBarButton, , { backgroundColor: '#C0C0C0', }]}
                                    onPress={() => { navigation.navigate('Friend', params) }}>
                                    <Text style={[styles.tabBarText, styles.textDefaultBold,
                                    { color: 'grey' }]}>Friends</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={[styles.bodyContainer, { flex: 1, }]}>
                            <Text style={[styles.textDefaultSemiBold, styles.title, { color: '#67806D' }]}>Friend Requests</Text>

                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ flex: 8 }}>
                                    <Text style={[styles.textDefaultSemiBold, { color: '#67806D' }]}>Outgoing requests:</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <TouchableOpacity
                                        onPress={() => { toggleOutgoingRequestsVisible() }}
                                        style={{ borderWidth: 1, borderRadius: 15, borderColor: '#67806D' }}>
                                        <Icon
                                            name={outgoingRequestsVisible ? "remove" : "add"}
                                            type='ionicon'
                                            size={15}
                                            color='#67806D' />
                                    </TouchableOpacity>

                                </View>
                            </View>

                            <View
                                style={{
                                    backgroundColor: '#C0C0C0',
                                    height: 1.5,
                                    marginVertical: 5,
                                }}
                            />

                            {outgoingRequestsVisible ?
                                <View style={{ marginTop: 5, marginBottom: 15, }}>
                                    {state.outgoingFriendReqs
                                        .map((item) => {
                                            return (
                                                <View
                                                    key={item.friend_b}
                                                    style={[styles.categoryStyle, { height: 35, }]}>
                                                    <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', }}>

                                                        <View style={{ flex: 8, paddingLeft: 5, }}>
                                                            <Text style={[styles.categoryText, styles.textDefaultSemiBold, { color: 'gray' }]}>{item['username']}</Text>
                                                        </View>

                                                        <View style={{ flex: 3, paddingRight: 5, }}>
                                                            <TouchableOpacity
                                                                style={{
                                                                    borderWidth: 1, borderRadius: 10,
                                                                    alignItems: 'center', borderColor: 'gray',
                                                                }}
                                                                onPress={() => {
                                                                    areYouSureUndoSend(item.friend_b, undoSendCallback, errorCallback);

                                                                }}>
                                                                <View style={{}}>
                                                                    <Text style={[styles.textDefault, { color: 'gray' }]}>Undo send</Text>
                                                                </View>

                                                            </TouchableOpacity>
                                                        </View>

                                                    </View>
                                                    {renderSeparator()}
                                                </View>
                                            )
                                        })}
                                </View>
                                :
                                null}

                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ flex: 8 }}>
                                    <Text style={[styles.textDefaultSemiBold, { color: '#67806D' }]}>Incoming friend requests:</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <TouchableOpacity
                                        onPress={() => { toggleIncomingRequestsVisible() }}
                                        style={{ borderWidth: 1, borderRadius: 15, borderColor: '#67806D' }}>
                                        <Icon
                                            name={incomingRequestsVisible ? "remove" : "add"}
                                            type='ionicon'
                                            size={15}
                                            color='#67806D' />
                                    </TouchableOpacity>

                                </View>
                            </View>

                            <View
                                style={{
                                    backgroundColor: '#C0C0C0',
                                    height: 1.5,
                                    marginVertical: 5,
                                }}
                            />

                            {incomingRequestsVisible ?
                                <View style={{ marginTop: 5, marginBottom: 15, borderWidth: 0, }}>
                                    {state.incomingFriendReqs
                                        .map((item) => {
                                            return (
                                                <View
                                                    key={item.friend_a}
                                                    style={[styles.categoryStyle, { height: 35, }]}>
                                                    <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', }}>

                                                        <View style={{ flex: 8, paddingLeft: 5, }}>
                                                            <Text style={[styles.categoryText, styles.textDefaultSemiBold, { color: 'gray', }]}>{item['username']}</Text>
                                                        </View>

                                                        <View style={{ flex: 3, }}>
                                                            <TouchableOpacity
                                                                style={{
                                                                    borderWidth: 1, borderRadius: 10,
                                                                    alignItems: 'center', marginRight: 5, borderColor: 'gray'
                                                                }}
                                                                onPress={() => {
                                                                    acceptFriendRequest(item.friend_a, item.username, acceptFriendCallback, errorCallback)
                                                                }}>
                                                                <View>
                                                                    <Text style={[styles.textDefault, { color: 'gray' }]}>Accept</Text>
                                                                </View>

                                                            </TouchableOpacity>
                                                        </View>

                                                        <View style={{ flex: 3, paddingRight: 5, }}>
                                                            <TouchableOpacity
                                                                style={{
                                                                    borderWidth: 1, borderRadius: 10,
                                                                    alignItems: 'center', borderColor: 'gray'
                                                                }}
                                                                onPress={() => {
                                                                    areYouSureReject(item.friend_a, rejectFriendCallback, errorCallback)

                                                                }}>
                                                                <View>
                                                                    <Text style={[styles.textDefault, { color: 'gray' }]}>Reject</Text>
                                                                </View>


                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>

                                                    {renderSeparator()}
                                                </View>
                                            )
                                        })}
                                </View>
                                : null}

                            <Text style={[styles.textDefaultSemiBold, styles.title, { color: '#67806D' }]}>Notifications</Text>

                            {/*<Text>{JSON.stringify(sessionState.userNotifications)}</Text>*/}
                            <View style={{ flex: 1, borderWidth: 0, }}>
                                {memoizedFlatList}
                            </View>
                        </View>

                    </View>
                </>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    textDefaultBold: {
        fontFamily: 'Inter-Bold',
    },
    textDefaultSemiBold: {
        fontFamily: 'Inter-SemiBold',
    },
    textDefault: {
        fontFamily: 'Inter-Regular',
    },
    title: {
        fontSize: 20, marginBottom: 10,
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
    },
    bodyContainer: {
        marginHorizontal: 20,
        marginTop: 10,
    }
})

export default FriendNotificationScreen;