import React, { useContext, useEffect, useCallback, useState } from 'react';
import { View, StyleSheet, Dimensions, FlatList, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Button, Text, Icon } from 'react-native-elements';
import { Context as UserContext } from '../context/userContext';
import { Context as CategoryContext } from '../context/CategoryContext';
import { Context as SessionContext } from '../context/SessionContext';
import { useFocusEffect } from '@react-navigation/native';
import { differenceInDays, parseISO, differenceInSeconds } from 'date-fns';
import DrawerProfileView from '../components/DrawerProfileView';
import AvatarComponent from '../components/AvatarComponent';

const constants = require('../components/constants.json')

const ProfileScreen = ({ navigation }) => {
    const { width, height } = Dimensions.get('window')
    const { state, fetchSelf, fetchAvatar } = useContext(UserContext)
    const { state: catState } = useContext(CategoryContext)
    const { state: sessionState, fetchSessionsSelf, fetchSessionsNextBatchSelf } = useContext(SessionContext)
    const [h, setH] = useState(0)
    const [m, setM] = useState(0)
    const [s, setS] = useState(0)
    const [offset, setOffset] = useState(0)
    const [privateVisible, setPrivateVisible] = useState(false)
    var { hours, minutes, seconds } = state.totalTime

    useFocusEffect(
        useCallback(() => {
            getFeed()
        }, [])
    )

    //console.log(sessionState.selfOnlySessions)

    const togglePrivateVisible = () => { setPrivateVisible(!privateVisible) }

    const getFeed = async () => {
        try {

            if (hours) { setH(hours) }
            if (minutes) { setM(minutes) }
            if (seconds) { setS(seconds) }
            setOffset(0)
            let temp = await fetchSessionsSelf()
            setOffset(offset + 10)
            //await fetchUserReactions()
        } catch (err) {
            console.log("Problem retrieving self feed", err)
        }
    }

    const getData = async () => {
        console.log("Loading 10 more..");
        try {
            let temp2 = await fetchSessionsNextBatchSelf(offset)
            setOffset(offset + 10)
        } catch (err) {
            console.log("Problem loading more self sessions", err)
        }
    }

    const duration = (startTime, endTime) => {
        return differenceInSeconds(parseISO(endTime), parseISO(startTime))
    }
    const daysAgo = (endTime) => {
        return differenceInDays(new Date(), parseISO(endTime))
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

    const renderHeader = () => {
        return (
            <>
                <View style={styles.banner} />

                {/* MAIN PROFILE PICTURE HERE */}
                <View style={[styles.pfp, { marginLeft: (width - 120) / 1.08 }]}>
                    <AvatarComponent w={115} />
                </View>

                <Text style={styles.username}>{state.username}</Text>
                <View style={styles.textContainer}>
                    <Text style={styles.text}>{state.totalTasks} Tasks</Text>
                    <Text style={styles.text}> - </Text>
                    <Text style={styles.text}>{h}h {m}m {s}s</Text>

                </View>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => { navigation.navigate('mainFlow') }}>
                    <Icon
                        name='arrow-back-outline'
                        type='ionicon'
                        size={24}
                        color='#67806D' />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => { navigation.navigate('EditProfile') }}>
                    <Icon
                        name='pencil-outline'
                        type='ionicon'
                        size={24}
                        color='#67806D' />
                </TouchableOpacity>


                {/*<Text style={[styles.text, { marginBottom: 20, }]}>{state.friends.length} Friends</Text>*/}
                <View style={{ flexDirection: 'row', flex: 1, }}>
                    <Text style={styles.bioText}>Founder, CEO of Time Out. wish I had a bonded pair of cats to take care of but it'll happen when the time is right :)</Text>
                    <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', }}>
                        <TouchableOpacity
                            onPress={togglePrivateVisible}>
                            {privateVisible ? <Icon name="eye-outline" type='ionicon' color='#67806D' /> :
                                <Icon name="eye-off-outline" type='ionicon' color='#67806D' />}
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.categoryContainer}>
                    {catState.userCategories.map((item) => {
                        return (
                            <View
                                key={item.category_id}
                                style={[styles.categoryStyle, { backgroundColor: constants.colors[item['color_id']] }]}>

                                {(privateVisible || item['public']) ?
                                    <Text style={[styles.categoryText]}>{item['category_name']}</Text>
                                    :
                                    <Text style={[styles.categoryText, { color: constants.colors[item['color_id']] }]}>{item['category_name']}</Text>}

                            </View>
                        )

                    })}
                </View>

                <Button title="Test avatar" onPress={() => { navigation.navigate('EditAvatar') }} />
                <Button title="Test fetch avatar" onPress={() => {
                    fetchAvatar();
                }} />
                {state.base64pfp ?
                    <Image style={{ width: 100, height: 100, borderWidth: 1 }} source={{ uri: state.base64pfp }} />
                    :
                    <Text>No image yet!</Text>
                }
                <Text style={styles.recent}>Recent</Text>
            </>
        )
    }

    return (
        <View style={styles.outerContainer}>

            {/*<DrawerProfileView
                friends={state.friends}
                username={state.username}
                totalTasks={state.totalTasks}
    totalTime={state.totalTime} />*/}

            <FlatList
                style={styles.flatlistStyle}
                data={sessionState.selfOnlySessions}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.activity_id}
                ListHeaderComponent={renderHeader}
                ListFooterComponent={renderFooter}
                renderItem={({ item }) => {
                    return (
                        <View style={styles.recentItemContainer}>
                            <View style={styles.pfpcontainerTEMP}>

                                {/* SMALLER PROFILE PICS HERE */}
                                <View style={styles.pfpTEMP}>
                                    <AvatarComponent w={48} />
                                </View>
                            </View>
                            <View style={styles.listItem}>
                                <Text>
                                    <Text style={styles.bolded}>{item.username}</Text>
                                    <Text> worked on </Text>
                                    <Text style={styles.bolded}>{duration(item.time_start, item.time_end)}</Text>
                                    <Text> seconds</Text>
                                </Text>
                                <Text>
                                    <Text>of </Text>
                                    {/*[styles.bolded, { color: constants.colors[item.color_id] }]*/}
                                    {privateVisible || item.public ?
                                        <Text style={[styles.bolded]}>{item.category_name}</Text>
                                        :
                                        <Text style={[styles.bolded]}>***REDACTED***</Text>
                                    }

                                </Text>
                                <Text> {daysAgo(item.time_end)} days ago</Text>

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
                                </View>*/}
                            </View>
                        </View>
                    )
                }}
            >
            </FlatList>
            {/*<Button
                style={styles.button}
                title="See Todo Items (temp)"
                onPress={() => navigation.navigate('TodoFlow')} />

            <Button
                style={styles.button}
                title="Friends (temp)"
                onPress={() => navigation.navigate('Friend')} />
            <Button
                style={styles.button}
                title="Edit Profile (temp)"
                onPress={() => navigation.navigate('EditProfile')} />
            <Button
                style={styles.button}
                title="TESTING TEMPORARY"
    onPress={() => navigation.navigate('FriendList')} />*/}
        </View>
    )
}
/*ProfileScreen.navigationOptions = ( {navigation}) => {
    return {
        headerRight: () => (
            <Button
                onPress={() => navigation}
                title="Info"
                color="#fff"
            />
        ),
    }
}*/

const styles = StyleSheet.create({
    outerContainer: {
    },
    banner: {
        width: '100%',
        backgroundColor: '#fdd696',
        height: 150,
        marginBottom: 10,
    },
    backButton: {
        position: 'absolute',
        //borderWidth: 1,
        marginTop: 25,
        marginLeft: 25,
    },
    editButton: {
        position: 'absolute',
        alignSelf: 'flex-end',
        //borderWidth: 1,
        marginTop: 25,
        paddingHorizontal: 15,
    },
    pfp: {
        position: 'absolute',
        //backgroundColor: '#C3E6E7',
        width: 120,
        height: 120,
        marginTop: 90,
        borderRadius: 100,
        borderColor: 'white',
        borderWidth: 3,
        marginVertical: 15,
    },
    username: {
        position: 'absolute',
        marginLeft: 25,
        marginTop: 85,
        fontWeight: 'bold',
        fontSize: 26,
        color: 'white',
        marginBottom: 5,
    },
    textContainer: {
        position: 'absolute',
        flexDirection: 'row',
        marginLeft: 25,
        marginTop: 120,
    },
    text: {
        fontSize: 18,
        color: 'white',
    },
    bioText: {
        flex: 1.1,
        fontSize: 14,
        fontWeight: '200',
        marginLeft: 25,
    },
    categoryContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 10,
        padding: 2,
    },
    categoryStyle: {
        borderRadius: 50,
        padding: 7,
        margin: 4,
        alignSelf: 'center',
        alignItems: 'center',
    },
    categoryText: {
        color: '#67806D',
        fontSize: 14,
        paddingHorizontal: 3,
    },
    recent: {
        marginLeft: 25,
        marginTop: 10,
        color: '#D0993D',
        fontWeight: 'bold',
        fontSize: 24,
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
    pfpcontainerTEMP: {
        flex: 0.25,
        //backgroundColor: 'green',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pfpTEMP: {
        backgroundColor: '#C3E6E7',
        height: 50,
        width: 50,
        borderRadius: 100,
    },
    recentItemContainer: {
        flex: 1,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        marginHorizontal: 25,
    },
})

export default ProfileScreen;