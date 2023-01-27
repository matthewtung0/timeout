import React, { useContext, useState, useCallback, useRef } from 'react';
import {
    View, StyleSheet, Text, FlatList,
    TouchableOpacity, ActivityIndicator, Dimensions
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { Context as SessionContext } from '../context/SessionContext';
import { Context as UserContext } from '../context/userContext';
import FriendScreen from './FriendScreen'
import { SceneMap, TabBar } from 'react-native-tab-view';

import timeoutApi from '../api/timeout';
import AvatarComponent from '../components/AvatarComponent';
import FriendNotificationScreen from './FriendNotificationScreen';
import { FriendFeedComponent, MemoizedComponent } from '../components/FriendFeedComponent';

const REFRESH_THRESHOLD_POSITION = -50;
const SCROLL_THROTTLE_RATE = 200;

const FriendFeedScreen = ({ navigation }) => {
    const { width, height } = Dimensions.get('window');
    const { state: sessionState, fetchUserReactions,
        reactToActivity, fetchAvatars } = useContext(SessionContext)
    const { state: userState, setIdToView } = useContext(UserContext)
    const [disableTouch, setDisableTouch] = useState(false)
    const [refreshToken, setRefreshToken] = useState(0)
    const [offset, setOffset] = useState(0)
    const [atEnd, setAtEnd] = useState(false)
    const [friendsPfpMap, setFriendsPfpMap] = useState({})
    const [feed, setFeed] = useState([])
    const [isOnline, setIsOnline] = useState(true)


    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingRefresh, setIsLoadingRefresh] = useState(false)


    useFocusEffect(
        useCallback(() => {
            setIsLoadingRefresh(true)
            console.log("REFRESHING")
            //buildFriendsMap();
            getFeed();

            return () => {
                //console.log("cleaning up")
                setIsLoading(false)
                setOffset(0)
                setDisableTouch(false)
                setAtEnd(false)
            }
        }, [refreshToken])
    )
    console.log(sessionState.userReaction)


    const fetchSessions = async (friends) => {
        // clean up friends array
        var friendsArr = []
        for (var i in friends) {
            friendsArr.push(friends[i]['friend'])
        }
        if (friendsArr.length > 0) {
            try {
                const response = await timeoutApi.get('/sessionFeed', { params: { friends: friendsArr } })
                //console.log("got this response", response.data)
                setFeed(response.data)
            } catch (err) {
                setIsOnline(false)
            }
        }


    }

    const fetchSessionsNextBatch = async (startIndex = 0, friends) => {
        var friendsArr = []
        for (var i in friends) {
            friendsArr.push(friends[i]['friend'])
        }
        const response = await timeoutApi.get('/sessionFeed', { params: { startIndex, friends: friendsArr } })
        setFeed(prevState => [...prevState, ...response.data])

        //setFeed([...feed, ...response.data])
        return response.data
    }

    const buildFriendsMap = () => {
        var j = {}
        for (var i = 0; i < userState.friends.length; i++) {
            j[userState.friends[i].friend] = 'unknown'
        }
        setFriendsPfpMap(j)
    }

    const getFeed = async () => {
        try {
            setOffset(0)
            let temp = await fetchSessions(userState.friends)
            setOffset(offset + 10)

            await fetchUserReactions()
            setIsLoadingRefresh(false)
        } catch (err) {
            console.log("Problem retrieving feed", err)
        }
    }

    const scrollEvent = (e) => {
        var scrollPos = e.nativeEvent.contentOffset.y

        if (scrollPos < REFRESH_THRESHOLD_POSITION) {
            setRefreshToken(Math.random())
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

    const getData = async () => {
        console.log("Loading 10 more..");
        setIsLoading(true)
        try {
            let temp2 = await fetchSessionsNextBatch(offset, userState.friends)
            //console.log("temp2 is", temp2)
            if (temp2.length == 0) { setAtEnd(true) } else {
                setOffset(offset + 10)
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
                    <Text style={styles.textDefault}>All caught up!</Text> :
                    <>{isLoading ? <ActivityIndicator
                        style={{ marginTop: 15 }}
                        size="large" /> :

                        <TouchableOpacity style={styles.loadMore}
                            onPress={getData}>
                            <Text style={[styles.loadMoreText, styles.textDefault]}>Load More</Text>
                        </TouchableOpacity>
                    }
                    </>
                }
            </View>
        )
    }

    const flatListRef = useRef();

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
                                        navigation.navigate('Notifications')
                                    }}>
                                    <Text style={[styles.tabBarText, styles.textDefaultBold,
                                    { color: 'grey' }]}>Me</Text>
                                </TouchableOpacity>
                                <View style={styles.tabBarButton}>
                                    <Text style={[styles.tabBarText, styles.textDefaultBold,]}>Feed</Text>
                                </View>

                                <TouchableOpacity style={[styles.tabBarButton, , { backgroundColor: '#C0C0C0', }]}
                                    onPress={() => { navigation.navigate('Friend') }}>
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


                        {feed.length == 0 ?
                            <View style={{ alignItems: 'center' }}>
                                <Text style={[styles.textDefault, {
                                    marginTop: 20, marginBottom: 10,
                                    color: '#67806D', fontSize: 16, textAlign: 'center', marginHorizontal: 10,
                                }]}>
                                    Nothing in your feed yet. Tell your friends to start getting productive!</Text>
                            </View>
                            :
                            <View style={styles.flatListContainer}>
                                <FlatList
                                    ref={flatListRef}
                                    style={styles.flatlistStyle}
                                    horizontal={false}
                                    onScroll={scrollEvent}
                                    scrollEventThrottle={SCROLL_THROTTLE_RATE}
                                    data={feed}
                                    ItemSeparatorComponent={renderSeparator}
                                    showsHorizontalScrollIndicator={false}
                                    keyExtractor={(item) => item.activity_id}
                                    ListFooterComponent={renderFooter}
                                    renderItem={({ item }) =>
                                        <MemoizedComponent item={item} navigation={navigation} />
                                    }
                                >
                                </FlatList>
                            </View>
                        }
                    </>}
            </View>
        )
    }

    const firstRoute = () => {
        return (
            <FriendNotificationScreen />
        )
    }
    const thirdRoute = () => {
        return (
            <FriendScreen />
        )
    }
    const renderScene = SceneMap({
        first: firstRoute,
        second: secondRoute,
        third: thirdRoute
    });
    const [index, setIndex] = useState(1);
    const [routes] = useState([
        { key: 'first', title: 'Me' },
        { key: 'second', title: 'Feed' },
        { key: 'third', title: 'Friends' },
    ]);

    const renderTabBar = props => (
        <TabBar
            {...props}
            activeColor='white'
            inactiveColor='grey'
            indicatorStyle={{ backgroundColor: 'white' }}
            style={{ backgroundColor: '#ABC57E' }}
            labelStyle={{ fontWeight: 'bold', }}
        />
    )

    return (
        secondRoute()
        /*<TabView
            style={styles.outerContainer}
            renderTabBar={renderTabBar}
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}>
    </TabView>*/
    )
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