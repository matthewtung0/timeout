import React, { useContext, useState, useCallback, useRef } from 'react';
import {
    View, SafeAreaView, StyleSheet, Text, FlatList, Pressable,
    TouchableOpacity, ActivityIndicator, Dimensions
} from 'react-native';
import { Icon } from 'react-native-elements';
import { useFocusEffect } from '@react-navigation/native';

import { Context as SessionContext } from '../context/SessionContext';
import { Context as UserContext } from '../context/userContext';
import FriendScreen from './FriendScreen'

import {
    differenceInDays, differenceInYears, differenceInMonths, differenceInHours,
    differenceInMinutes,
    parseISO, differenceInSeconds, isThisMinute
} from 'date-fns';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

import timeoutApi from '../api/timeout';
import AvatarComponent from '../components/AvatarComponent';

const FriendFeedScreen = ({ navigation }) => {
    const { width, height } = Dimensions.get('window');
    const { state: sessionState, fetchUserReactions,
        reactToActivity, fetchAvatars } = useContext(SessionContext)
    const { state: userState, setIdToView } = useContext(UserContext)
    const [disableTouch, setDisableTouch] = useState(false)
    const [offset, setOffset] = useState(0)
    const [atEnd, setAtEnd] = useState(false)
    const [friendsPfpMap, setFriendsPfpMap] = useState({})
    const [feed, setFeed] = useState([])
    const [isOnline, setIsOnline] = useState(true)


    const [isLoading, setIsLoading] = useState(false)


    useFocusEffect(
        useCallback(() => {
            //buildFriendsMap();
            getFeed();

            return () => {
                console.log("cleaning up")
                setIsLoading(false)
                setOffset(0)
                setDisableTouch(false)
                setAtEnd(false)
            }
        }, [])
    )
    console.log("rendering friend feeed")


    const fetchSessions = async (friends) => {
        // clean up friends array
        var friendsArr = []
        for (var i in friends) {
            friendsArr.push(friends[i]['friend'])
        }
        try {
            const response = await timeoutApi.get('/sessionFeed', { params: { friends: friendsArr } })
            //console.log("got this response", response.data)
            setFeed(response.data)
        } catch (err) {
            setIsOnline(false)
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
        console.log("Feed is now ", feed)
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

            //await fetchUserReactions()

            /*for (let i = 0; i < userState.friends.length; i++) {
                var friend_id = userState.friends[i].friend
                console.log("Fetching avatar for ", friend_id)

                try {
                    const response = await timeoutApi.get('/avatar', { params: { friend: friend_id } })

                    var base64Icon = `data:image/png;base64,${response.data}`
                    var friendsPfpMapTemp = friendsPfpMap
                    friendsPfpMapTemp[friend_id] = base64Icon
                    setFriendsPfpMap(friendsPfpMapTemp)
                    console.log(base64Icon.length)
                } catch (err) {
                    console.log(err)
                }

                //fetchAvatars(userState.friends[i].friend)
            }*/
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

    const timeAgo = (endTime) => {
        var parsedTime = parseISO(endTime)
        var diffInYears = differenceInYears(new Date(), parsedTime)
        var diffInMonths = differenceInMonths(new Date(), parsedTime)
        var diffInDays = differenceInDays(new Date(), parsedTime)
        var diffInHours = differenceInHours(new Date(), parsedTime)
        var diffInMinutes = differenceInMinutes(new Date(), parsedTime)

        if (diffInYears >= 1) {
            return `${diffInYears} years ago`
        } else if (diffInMonths >= 1) {
            return `${diffInMonths} months ago`
        } else if (diffInDays >= 1) {
            return `${diffInDays} days ago`
        } else if (diffInHours >= 1) {
            return `${diffInHours} hours ago`
        } else if (diffInMinutes >= 1) {
            return `${diffInMinutes} hours ago`
        } else {
            return `Just now`
        }
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
                    <Text>All caught up!</Text> :
                    <>{isLoading ? <ActivityIndicator
                        style={{ marginTop: 15 }}
                        size="large" /> :

                        <TouchableOpacity style={styles.loadMore}
                            onPress={getData}>
                            <Text style={styles.loadMoreText}>Load More</Text>
                        </TouchableOpacity>
                    }
                    </>
                }
            </View>
        )
    }

    const flatListRef = useRef();

    const Asdf = React.memo(({ item }) => (

        (
            <View style={styles.container}>
                {console.log("item rendering..", item.activity_id)}
                <View style={styles.pfpcontainer}>
                    <View style={styles.pfp}>
                        {/* friend thumbnails */}
                        <TouchableOpacity
                            onPress={() => {

                                setIdToView({ username: item.username, user_id: item.user_id })
                                navigation.navigate('Profile temp')
                            }}>
                            <AvatarComponent w={50}
                                isSelf={item.username == userState.username}
                                id={item.user_id}
                                pfpSrc={userState.base64pfp} />
                        </TouchableOpacity>

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

                    </Text>
                    <Text> {timeAgo(item.time_end)}</Text>
                    {/*<View style={styles.likeContainer}>
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
                            </View> */}
                </View>
            </View>
        )
    ), (() => { return true }))

    const secondRoute = () => {
        return (
            <View style={styles.outerContainer}>

                {!isOnline || 1 ?
                    <View style={{ flex: 1, alignContent: 'center', justifyContent: 'center', }}>
                        <Text style={{ textAlign: 'center', color: 'gray', fontSize: 18, }}>Friend feed is currently unavailable. Please check your internet connection</Text>
                    </View>

                    :
                    <>
                        <Text>{String(isOnline)}</Text>

                        <View style={styles.makeshiftTabBarContainer}>
                            <View style={styles.makeshiftTabBar}>
                                <TouchableOpacity style={styles.tabBarButton}>
                                    <Text style={styles.tabBarText}>Go to Me</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.tabBarButton}
                                    onPress={() => { navigation.navigate('Friend') }}>
                                    <Text style={styles.tabBarText}>Go to Friends</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        {/*<Text>{JSON.stringify(state.userReaction)}</Text>*/}
                        <View style={styles.flatListContainer}>
                            <FlatList
                                ref={flatListRef}
                                style={styles.flatlistStyle}
                                horizontal={false}
                                //data={sessionState.userSessions}
                                data={feed}
                                showsHorizontalScrollIndicator={false}
                                keyExtractor={(item) => item.activity_id}
                                ListFooterComponent={renderFooter}
                                renderItem={({ item }) => <Asdf item={item} />}
                            >
                            </FlatList>
                        </View>
                    </>}
            </View>
        )
    }

    const firstRoute = () => {
        return (
            <View>
                <Text>ME</Text>
            </View>
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
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        height: 80,
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
    tabBarButton: {
        flex: 1,
        padding: 10,
        margin: 10,
        height: 40,
        backgroundColor: '#ABC57E',
        alignItems: 'center',
        justifyContent: 'center'
    },
    tabBarText: {
        fontWeight: 'bold',
        color: 'white',
        fontSize: 13,
    }

})

export default FriendFeedScreen;