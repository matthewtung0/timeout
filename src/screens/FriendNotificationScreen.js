import React, { useState, useCallback, useContext } from 'react';
import { View, SafeAreaView, StyleSheet, Text, FlatList, Pressable, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { useFocusEffect } from '@react-navigation/native';
import { Context as userContext } from '../context/userContext';
import { Context as SessionContext } from '../context/SessionContext';
import { differenceInDays, parseISO, differenceInSeconds } from 'date-fns';
import timeoutApi from '../api/timeout';
import AvatarComponent from '../components/AvatarComponent';
import startOfYesterday from 'date-fns/esm/startOfYesterday/index';
import { FriendNotificationItem } from '../components/FriendNotificationComponent';


const FriendNotificationScreen = ({ navigation }) => {
    const [offset, setOffset] = useState(0)
    const [disableTouch, setDisableTouch] = useState(false)
    const [isOnline, setIsOnline] = useState(true)
    //const [userSessions, setUserSessions] = useState([])
    const { state: sessionState,
        fetchSessions, fetchSessionsNextBatch, fetchUserReactions, reactToActivity,
        fetchNotifications } = useContext(SessionContext)
    const { state, requestFriend, fetchOutgoingRequests, fetchIncomingRequests,
        acceptFriendRequest, rejectFriendRequest, fetchFriends } = useContext(userContext)

    const getNotifications = async () => {
        await fetchNotifications();
    }

    const rejectFriendCallback = async () => {
        //await fetchFriends()
        alert("Rejected successfully.");
    }
    const acceptFriendCallback = async () => {
        await fetchFriends()
        alert("Friend req successfully accepted.");
    }
    useFocusEffect(
        useCallback(() => {
            getNotifications()
        }, [])
    )

    const renderSeparator = () => (
        <View
            style={{
                backgroundColor: '#C0C0C0',
                height: 0.1, marginHorizontal: 50,
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
                                onPress={() => { navigation.navigate('Friend') }}>
                                <Text style={[styles.tabBarText, styles.textDefaultBold,
                                { color: 'grey' }]}>Friends</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/*<Text>{JSON.stringify(state.userReaction)}</Text>*/}

                    <View style={styles.bodyContainer}>
                        <Text style={[styles.textDefaultBold, styles.title]}>Friend Requests</Text>

                        <Text>Outgoing friend requests, awaiting reply:</Text>

                        <View style={{ marginHorizontal: 20, marginVertical: 20, }}>
                            {state.outgoingFriendReqs
                                .map((item) => {
                                    return (
                                        <View
                                            key={item.friend_b}
                                            style={[styles.categoryStyle, { height: 30, }]}>
                                            <View style={{ flexDirection: 'row', flex: 1, }}>

                                                <View style={{ flex: 8, }}>
                                                    <Text style={[styles.categoryText]}>{item['username']}</Text>
                                                </View>

                                                <View style={{ flex: 3, }}>
                                                    <TouchableOpacity
                                                        style={{ borderWidth: 1, }}
                                                        onPress={() => {
                                                            rejectFriendRequest(item.friend_b, resetInputs)
                                                        }}>
                                                        <Text>Undo send</Text>
                                                    </TouchableOpacity>
                                                </View>

                                            </View>
                                        </View>
                                    )
                                })}
                        </View>


                        <Text>Incoming friend requests:</Text>

                        <View style={{ marginHorizontal: 20, marginVertical: 20, }}>
                            {state.incomingFriendReqs
                                .map((item) => {
                                    return (
                                        <View
                                            key={item.friend_a}
                                            style={[styles.categoryStyle, { height: 30, }]}>
                                            <View style={{ flexDirection: 'row', flex: 1, }}>

                                                <View style={{ flex: 8, }}>
                                                    <Text style={[styles.categoryText]}>{item['username']}</Text>
                                                </View>

                                                <View style={{ flex: 3, }}>
                                                    <TouchableOpacity
                                                        style={{ borderWidth: 1, }}
                                                        onPress={() => {
                                                            acceptFriendRequest(item.friend_a, item.username, acceptFriendCallback)
                                                        }}>
                                                        <Text>Accept</Text>
                                                    </TouchableOpacity>
                                                </View>

                                                <View style={{ flex: 3, }}>
                                                    <TouchableOpacity
                                                        style={{ borderWidth: 1, }}
                                                        onPress={() => {
                                                            rejectFriendRequest(item.friend_a, rejectFriendCallback)
                                                        }}>
                                                        <Text>Reject</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                    )
                                })}
                        </View>

                        <Text style={[styles.textDefaultBold, styles.title]}>Notifications</Text>

                        {/*<Text>{JSON.stringify(sessionState.userNotifications)}</Text>*/}
                        <View style={styles.flatListContainer}>
                            <FlatList
                                style={styles.flatlistStyle}
                                horizontal={false}
                                data={sessionState.userNotifications}
                                ItemSeparatorComponent={renderSeparator}
                                showsHorizontalScrollIndicator={false}
                                keyExtractor={(item) => item.interaction_id}
                                //ListFooterComponent={renderFooter}
                                renderItem={({ item }) =>
                                    <FriendNotificationItem item={item} />
                                }
                            >
                            </FlatList>
                        </View>
                    </View>

                </>}
        </View>
    )
}

const styles = StyleSheet.create({
    textDefaultBold: {
        fontFamily: 'Inter-Bold',
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
        marginTop: 70,
    }
})

export default FriendNotificationScreen;