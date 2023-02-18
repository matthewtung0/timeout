import React, { useContext, useState, useCallback, useMemo } from 'react';
import {
    View, StyleSheet, Text, FlatList,
    TouchableOpacity, ActivityIndicator, Dimensions, Platform
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Context as ReactionContext } from '../context/ReactionContext';
import { Context as UserContext } from '../context/userContext';
import FriendFeedComponent from '../components/FriendFeedComponent';

//const REFRESH_THRESHOLD_POSITION = -50;
const SCROLL_THROTTLE_RATE = 200;
const NUM_TO_RETRIEVE = 50;

const FriendFeedScreen = ({ navigation, route: { params } }) => {
    const { width, height } = Dimensions.get('window');
    //const { fetchUserReactions } = useContext(SessionContext)
    const { state: reactionState, fetchSessions, reactToActivity, sendLikeNotification } = useContext(ReactionContext)
    const { state } = useContext(UserContext)
    //const [refreshToken, setRefreshToken] = useState(0)

    const [offset, setOffset] = useState(0)
    const [visibleOffset, setVisibleOffset] = useState(0);

    const [atEnd, setAtEnd] = useState(false)
    const [isOnline, setIsOnline] = useState(true)

    const [cacheChecker, setCacheChecker] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingRefresh, setIsLoadingRefresh] = useState(false)
    const [blankMessage, setBlankMessage] = useState('Nothing in your feed yet. Tell your friends to start getting productive!')

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
                setBlankMessage('Nothing in your feed yet. Tell your friends to start getting productive!')
                setAtEnd(false)
            }
        }, [state.friends])
    )

    const getFeed = async () => {
        try {
            let temp = await fetchSessions(state.friends, 0, 10, true)
            console.log(temp)

            console.log(`Right now, offset is ${offset}`)
            setOffset(10)
            setVisibleOffset(10)

            setBlankMessage('Nothing in your feed yet. Tell your friends to start getting productive!')

            setIsLoadingRefresh(false)
        } catch (err) {
            setIsLoadingRefresh(false)
            setBlankMessage("Problem retrieving friend feed. Please try again later")
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
                        <View style={{}}>
                            <View style={styles.loadMore}>
                                <Text style={[styles.textDefault, { color: '#67806D', fontSize: 20, }]}>All caught up!</Text>
                            </View>
                            <View style={{ height: 50 }}></View>
                        </View>
                    </>
                    :
                    <View style={{ height: 50 }}></View>
                }
            </View>
        )
    }

    console.log(`visible offset is ${visibleOffset} and data offset is ${offset}`)
    const renderSeparator = () => (
        <View style={{ backgroundColor: '#C0C0C0', height: 1, marginHorizontal: 10, }} />
    );
    const flatListItself = () => {
        return (
            <FlatList
                style={[styles.flatlistStyle, { borderWidth: 0, }]}
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
                        myUsername={state.username}
                        setCacheChecker={setCacheChecker}
                        navigation={navigation}
                        userReaction={reactionState.userReaction}
                        reactToActivity_={reactToActivity}
                        sendLikeNotification_={sendLikeNotification} />
                }
            >
            </FlatList>
        )
    }


    const memoizedFlatList = useMemo(flatListItself, [reactionState.userSessions, visibleOffset, atEnd,
    reactionState.userReaction, state.friends])



    return (
        <View style={{ flex: 1, }}>
            <View style={{ marginTop: Platform.OS === 'ios' ? 100 : 80 }}>

                {!isOnline ?
                    <View style={{ flex: 1, alignContent: 'center', justifyContent: 'center', }}>
                        <Text style={[styles.textDefault, { textAlign: 'center', color: 'gray', fontSize: 18, }]}>Friend feed is currently unavailable. Please check your internet connection</Text>
                    </View>
                    :
                    null}
                <>
                    <View style={{ marginHorizontal: 20, flexDirection: 'row', paddingBottom: 10, }}>
                        <TouchableOpacity style={[styles.tabBarButton,
                        {
                            backgroundColor: '#83B569', borderTopLeftRadius: 15, borderBottomLeftRadius: 15,
                            borderWidth: 1, borderColor: '#8DC867', borderRightWidth: 0, paddingVertical: 5,
                        }]}
                            onPress={() => {
                                navigation.navigate('Notifications', { cacheChecker })
                            }}>
                            <Text style={[styles.tabBarText, styles.textDefault,]}>Me</Text>
                        </TouchableOpacity>
                        <View style={[styles.tabBarButton, {
                            backgroundColor: '#8DC867',
                            borderWidth: 1, borderColor: '#8DC867', paddingVertical: 5,
                        }]}>
                            <Text style={[styles.tabBarText, styles.textDefault,]}>Feed</Text>
                        </View>

                        <TouchableOpacity style={[styles.tabBarButton, , {
                            backgroundColor: '#83B569',
                            borderTopRightRadius: 15, borderBottomRightRadius: 15,
                            borderWidth: 1, borderColor: '#8DC867', borderLeftWidth: 0, paddingVertical: 5,
                        }]}
                            onPress={() => { navigation.navigate('Friend', { cacheChecker }) }}>
                            <Text style={[styles.tabBarText, styles.textDefault,]}>Friends</Text>
                        </TouchableOpacity>
                    </View>

                    {isLoadingRefresh ? <ActivityIndicator
                        style={{ marginTop: 15 }}
                        size="large"
                        color='#67806D' /> : null}


                    {reactionState.userSessions.length == 0 ?
                        <View style={{ alignItems: 'center' }}>
                            <Text style={[styles.textDefault, {
                                marginTop: 20, marginBottom: 10,
                                color: '#67806D', fontSize: 16, textAlign: 'center', marginHorizontal: 10,
                            }]}>
                                {blankMessage}</Text>
                        </View>
                        :
                        memoizedFlatList
                    }
                </>
            </View>
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
    outerContainer: {
        marginTop: 110, //here because header is transparent
        //flex: 1,
        //flexDirection: 'column',
    },
    makeshiftTabBarContainer: {
        //flex: 0.08,
    },
    flatListContainer: {
        //flex: 0.9,
    },
    makeshiftTabBar: {
        flex: 1,
        flexDirection: 'row',
    },
    flatlistStyle: {
        margin: 5,
        borderRadius: 5,
        padding: 5,
        //height: '100%',
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
        //height: 50,
        backgroundColor: '#ABC57E',
        alignItems: 'center',
        justifyContent: 'center'
    },
    tabBarText: {
        //color: 'white',
        //fontSize: 17,
        textAlign: 'center', fontSize: 17, justifyContent: 'center', color: 'white',
    }

})

export default FriendFeedScreen;