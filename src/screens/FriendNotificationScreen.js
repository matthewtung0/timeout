import React, { useState, useCallback, useContext, useMemo } from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert, Image, Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Icon } from 'react-native-elements';
import { Context as userContext } from '../context/userContext';
import { Context as SessionContext } from '../context/SessionContext';
import { useHeaderHeight } from '@react-navigation/elements';
import { FriendNotificationItem } from '../components/FriendNotificationComponent';
const NUM_TO_RETRIEVE = 50
const img = require('../../assets/tasks_topbar.png')

const FriendNotificationScreen = ({ navigation, route: { params } }) => {
    const { height, width } = Dimensions.get('window');
    const headerHeight = useHeaderHeight();
    const BANNER_IMG_HEIGHT = headerHeight ? headerHeight : 90;
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

    const notificationErrorCallback = () => {
        setIsLoading(false);
    }

    const getNotifications = async () => {
        setIsLoading(true)
        var initialBatchSize = 10
        await fetchNotificationsBatch(0, initialBatchSize, true, null, notificationErrorCallback);
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

    const renderFooter = () => {
        return (
            <View>
                {atEnd ?
                    <View style={styles.loadMore}>
                        <Text style={[styles.textDefault, { color: '#67806D', fontSize: 20, }]}>All caught up!</Text>
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
                        item={item}
                        navigation={navigation} />
                )}
            >
            </FlatList>
        )
    }

    const memoizedFlatList = useMemo(flatListItself, [sessionState.userNotifications,
        offset,
        visibleOffset, atEnd])

    const renderSeparator = () => (
        <View
            style={{
                backgroundColor: '#C0C0C0',
                height: 1.5,
                marginVertical: 5,
            }}
        />
    );
    return (
        <View style={[styles.outerContainer, { marginTop: Platform.OS === 'ios' ? 0 : 0 }]}>

            <View>
                <Image
                    source={img}
                    resizeMode='stretch'
                    style={{
                        width: width, height: BANNER_IMG_HEIGHT,
                        //borderTopLeftRadius: BORDER_RADIUS, borderTopRightRadius: BORDER_RADIUS,
                    }} />
                <View style={{
                    position: 'absolute', width: '100%', height: '100%',
                    alignItems: 'center', justifyContent: 'flex-end',
                    paddingBottom: 10,
                }}>
                    <Text style={[styles.textDefaultBold,
                    { fontSize: 25, color: 'white' }]}>Friends Center</Text>
                </View>
            </View>

            <View style={{ paddingBottom: 10, flexDirection: 'row', paddingHorizontal: 12, backgroundColor: '#83B569' }}>
                <TouchableOpacity
                    style={[styles.sortContainer, styles.sortContainerSelected,
                    { borderRightWidth: 0, borderTopLeftRadius: 15, borderBottomLeftRadius: 15, }]}
                    onPress={() => {
                    }}>
                    <Text style={[styles.textDefault, styles.sortText]}>Me</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.sortContainer,
                { borderRightWidth: 0, }]}
                    onPress={() => {
                        navigation.navigate('FriendFeed')
                    }}>
                    <Text style={[styles.textDefault, styles.sortText]}>Feed</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.sortContainer,
                { borderTopRightRadius: 15, borderBottomRightRadius: 15, }]}
                    onPress={() => {
                        navigation.navigate('Friend')
                    }}>
                    <Text style={[styles.textDefault, styles.sortText]}>Friends</Text>
                </TouchableOpacity>
            </View>

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
                        {/*
                        <View style={{ marginHorizontal: 20, flexDirection: 'row', paddingBottom: 10, }}>
                            <View style={[styles.tabBarButton, {
                                backgroundColor: '#8DC867', borderTopLeftRadius: 15, borderBottomLeftRadius: 15,
                                borderWidth: 1, borderColor: '#8DC867', borderRightWidth: 0, paddingVertical: 5,
                                shadowOffset: {
                                    width: 0,
                                    height: 4,
                                },
                                shadowOpacity: 1,
                                shadowRadius: 0,
                                shadowColor: tinycolor('#8DC867').darken(15).toString()
                            }]}>
                                <Text style={[styles.tabBarText, styles.textDefault,]}>Me</Text>
                            </View>
                            <TouchableOpacity style={[styles.tabBarButton, , {
                                backgroundColor: '#83B569',
                                borderWidth: 1, borderColor: '#83B569', borderRightWidth: 0, paddingVertical: 5,
                                shadowOffset: {
                                    width: 0,
                                    height: 4,
                                },
                                shadowOpacity: 1,
                                shadowRadius: 0,
                                shadowColor: tinycolor('#83B569').darken(15).toString()

                            }]}
                                onPress={() => { navigation.navigate('FriendFeed') }}>
                                <Text style={[styles.tabBarText, styles.textDefault, {}]}>Feed</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={[styles.tabBarButton, , {
                                backgroundColor: '#83B569',
                                borderTopRightRadius: 15, borderBottomRightRadius: 15,
                                borderWidth: 1, borderColor: '#83B569', borderLeftWidth: 0, paddingVertical: 5,
                                shadowOffset: {
                                    width: 0,
                                    height: 4,
                                },
                                shadowOpacity: 1,
                                shadowRadius: 0,
                                shadowColor: tinycolor('#83B569').darken(15).toString()
                            }]}
                                onPress={() => { navigation.navigate('Friend', params) }}>
                                <Text style={[styles.tabBarText, styles.textDefault,
                                {}]}>Friends</Text>
                            </TouchableOpacity>
                                </View>*/}

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
        //backgroundColor: '#ABC57E',
        alignItems: 'center',
    },
    loadMoreText: {
        fontWeight: 'bold',
        color: 'white',
        fontSize: 18,
    },
    tabBarButton: {
        flex: 1,
        backgroundColor: '#ABC57E',
        alignItems: 'center',
        justifyContent: 'center'
    },
    tabBarText: {
        textAlign: 'center', fontSize: 17, justifyContent: 'center', color: 'white',
    },
    bodyContainer: {
        marginHorizontal: 20,
        marginTop: 10,
    }, sortText: {
        textAlign: 'center', fontSize: 12, justifyContent: 'center', color: 'white',
    },
    sortContainer: {
        borderWidth: 1, flex: 1,
        paddingVertical: 7, borderColor: 'white',
    },
    sortContainerSelected: {
        backgroundColor: '#8DC867',
    },
})

export default FriendNotificationScreen;