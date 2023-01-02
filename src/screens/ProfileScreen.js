import React, { useContext, useCallback, useState } from 'react';
import { View, StyleSheet, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import { Button, Text, Icon } from 'react-native-elements';
import { Context as UserContext } from '../context/userContext';
import { Context as CategoryContext } from '../context/CategoryContext';
import { Context as SessionContext } from '../context/SessionContext';
import { useFocusEffect } from '@react-navigation/native';
import {
    differenceInDays, differenceInYears, differenceInMonths, differenceInHours,
    parseISO, differenceInSeconds, differenceInMinutes
} from 'date-fns';
import AvatarComponent from '../components/AvatarComponent';
import timeoutApi from '../api/timeout';
import Header from '../components/Header';
import Modal from 'react-native-modal'
import PFPModal from '../components/PFPModal';

const constants = require('../components/constants.json')
const BANNER_HEIGHT = 230;

const ProfileScreen = ({ navigation }) => {
    const { width, height } = Dimensions.get('window')
    const [pfpModalVisible, setPFPModalVisible] = useState(false)
    const { state, fetchSelf, fetchAvatar } = useContext(UserContext)
    const { state: catState, } = useContext(CategoryContext)
    const { state: sessionState, fetchSessionsSelf, fetchSessionsNextBatchSelf } = useContext(SessionContext)
    const [offset, setOffset] = useState(0)
    const [privateVisible, setPrivateVisible] = useState(false)
    const [isMe, setIsMe] = useState(false)
    const [profileSessions, setProfileSessions] = useState([])
    const [profileCategories, setProfileCategories] = useState([])
    const [profileStats, setProfileStats] = useState({
        totalTime: { hours: 0, minutes: 0, seconds: 0 },
        totalTasks: 0,
        last_signin: '',
        bio: '',
        time_created: '',
        username: ''
    })

    useFocusEffect(
        useCallback(() => {
            console.log("Getting feed with", state.idToView)
            getFeed()

            return () => {
                console.log("cleaning up")
                setProfileStats({
                    totalTime: { hours: 0, minutes: 0, seconds: 0 },
                    totalTasks: 0, last_signin: '', time_created: '', username: ''
                })
                setProfileSessions([])
                setProfileCategories([])
                setIsMe(false)
            }
        }, [state.idToView])
    )

    const togglePrivateVisible = () => { setPrivateVisible(!privateVisible) }

    const fetchStatsProfile = async (id) => {
        console.log("Fetching stats")
        try {
            const response = await timeoutApi.get(`/stats/${id}`)
            console.log("stats", response.data)
            setProfileStats({
                totalTime: response.data.total_time,
                totalTasks: response.data.num_tasks,
                last_signin: response.data.last_signin,
                bio: response.data.bio,
                time_created: response.data.time_created,
                username: response.data.username
            })

            if (response.data.username == state.username) { setIsMe(true) }
        } catch (err) { console.log("PROBLEM FETCHING STATS", err) }
    }

    const fetchCategoriesProfile = async (id, getPrivate) => {
        console.log("trying to fetch user categories");
        try {
            const response = await timeoutApi.get(`/category/${id}`, { params: { getPrivate } })
            setProfileCategories(response.data)
        } catch (err) {
            console.log("error fetching categories", err);
        }
    }

    const fetchSessionsProfile = async (id, getPrivate) => {
        const response = await timeoutApi.get('/session', { params: { id, getPrivate } })
        setProfileSessions(response.data)
    }

    const fetchAllSessions = async (id) => {
        const response = await timeoutApi.get(`/session/${id}`)
        setProfileSessions(response.data)
    }

    const getFeed = async () => {
        try {
            setOffset(0)
            //await fetchSessionsProfile(state.idToView, state.idToView == state.user_id)
            //await fetchAllSessions(state.user_id);
            await fetchAllSessions(state.idToView);
            setOffset(offset + 10)
            await fetchStatsProfile(state.idToView)
            await fetchCategoriesProfile(state.idToView, state.idToView == state.user_id)
        } catch (err) {
            console.log("Problem retrieving self feed", err)
        }
    }

    const getData = async () => {
        console.log("Loading 10 more..");
        try {
            let temp2 = await fetchSessionsNextBatchSelf(offset, state.user_id)
            setOffset(offset + 10)
        } catch (err) {
            console.log("Problem loading more self sessions", err)
        }
    }

    const duration = (startTime, endTime) => {
        return differenceInSeconds(parseISO(endTime), parseISO(startTime))
    }

    const duration_min = (startTime, endTime) => {
        return differenceInMinutes(parseISO(endTime), parseISO(startTime))
    }

    const daysAgo = (endTime) => {
        return differenceInDays(new Date(), parseISO(endTime))
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

    const togglePFPModal = () => {
        setPFPModalVisible(!pfpModalVisible)
    }

    const renderHeader = () => {
        return (
            <>

                <View style={[styles.banner, { height: BANNER_HEIGHT }]} />

                {/* MAIN PROFILE PICTURE HERE */}
                <TouchableOpacity
                    style={[styles.pfp, { marginLeft: (width - 120) / 1.08, marginTop: BANNER_HEIGHT - 60, }]}
                    onPress={togglePFPModal}>
                    <View>
                        <AvatarComponent w={115} pfpSrc={state.base64pfp} //isSelf={false}
                            id={state.idToView} />

                    </View>
                </TouchableOpacity>

                <Text style={[styles.username, styles.textDefaultBold, { marginTop: BANNER_HEIGHT - 65, }]}>{profileStats.username}</Text>
                <View style={[styles.textContainer, { marginTop: BANNER_HEIGHT - 30, }]}>
                    <Text style={[styles.text, styles.textDefault]}>{profileStats.totalTasks} Tasks</Text>
                    <Text style={[styles.text, styles.textDefaultBold]}> · </Text>
                    {profileStats.totalTime ?
                        <Text style={[styles.text, styles.textDefault]}>
                            {profileStats.totalTime.hours ? profileStats.totalTime.hours + 'h ' : '0h '}
                            {profileStats.totalTime.minutes ? profileStats.totalTime.minutes + 'm ' : '0m '}
                            {profileStats.totalTime.seconds ? profileStats.totalTime.seconds + 's ' : '0s '}</Text>
                        : <Text style={styles.text}>0h 0m 0s</Text>}
                </View>
                <Header
                    navigation={navigation} />

                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        position: 'absolute',
                        alignSelf: 'flex-end',
                        marginTop: 55,
                        paddingHorizontal: 15,
                    }}>
                    {isMe ?
                        <TouchableOpacity
                            style={{ marginHorizontal: 15, }}
                            onPress={togglePrivateVisible}>
                            {privateVisible ? <Icon name="eye-outline" type='ionicon' color='white' /> :
                                <Icon name="eye-off-outline" type='ionicon' color='white' />}
                        </TouchableOpacity> : null}
                    {isMe ?
                        <TouchableOpacity
                            onPress={() => { navigation.navigate('EditProfile') }}>
                            <Icon
                                name='pencil-outline'
                                type='ionicon'
                                size={24}
                                color='white' />
                        </TouchableOpacity> : null}

                </View>


                <View style={{ flexDirection: 'row', flex: 1, }}>
                    <Text style={[styles.bioText, styles.textDefault]}>{profileStats.bio}</Text>

                    <View style={{
                        flex: 1,
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                    }}>


                    </View>
                </View>

                <View style={styles.categoryContainer}>
                    {profileCategories.map((item) => {
                        return (
                            <View
                                key={item.category_id}
                                style={[styles.categoryStyle, { backgroundColor: constants.colors[item['color_id']] }]}>

                                {(privateVisible || item['public']) ?
                                    <Text style={[styles.categoryText, styles.textDefaultBold]}>{item['category_name']}</Text>
                                    :
                                    <Text style={[styles.categoryText, styles.textDefaultBold,
                                    { color: constants.colors[item['color_id']] }]}>{item['category_name']}</Text>}

                            </View>
                        )

                    })}
                </View>

                <View
                    style={{
                        borderBottomColor: '#B3B2B3',
                        //borderBottomWidth: StyleSheet.hairlineWidth,
                        borderBottomWidth: 1,
                        marginTop: 10,
                        marginHorizontal: 30,
                    }}
                />

                {/*{state.base64pfp ?
                    <Image style={{ width: 100, height: 100, borderWidth: 1 }} source={{ uri: state.base64pfp }} />
                    :
                    <Text>No image yet!</Text>
                }*/}
                <Text style={[styles.recent, styles.textDefaultBold]}>Recent</Text>
            </>
        )
    }

    return (
        <View style={styles.outerContainer}>

            <Modal isVisible={pfpModalVisible}
                animationIn='slideInUp'
                animationOut='slideOutUp'>

                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}>
                    <View style={{
                        height: 500
                    }}>
                        <PFPModal
                            toggleFunction={togglePFPModal}
                        />
                    </View></View>
            </Modal>

            {/*<DrawerProfileView
                friends={state.friends}
                username={state.username}
                totalTasks={state.totalTasks}
    totalTime={state.totalTime} />*/}

            <FlatList
                style={styles.flatlistStyle}
                //data={sessionState.selfOnlySessions}
                data={profileSessions}
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
                                    {/*<AvatarComponent w={48} pfpSrc={state.base64pfp} isSelf={true} />*/}
                                    <AvatarComponent w={48} pfpSrc={state.base64pfp} //isSelf={false} 
                                        id={state.idToView} />
                                </View>
                            </View>
                            <View style={styles.listItem}>
                                <Text>
                                    <Text style={[styles.bolded, styles.textDefaultBold, { color: '#67806D' }]}>{item.username}</Text>
                                    <Text style={[styles.textDefault, { color: '#67806D' }]}> worked on </Text>
                                    <Text style={[styles.bolded, styles.textDefaultBold, { color: '#67806D' }]}>{duration_min(item.time_start, item.time_end)}</Text>
                                    <Text style={[styles.textDefault, { color: '#67806D' }]}> minutes</Text>
                                </Text>
                                <Text>
                                    <Text style={[styles.textDefault, { color: '#67806D' }]}>of </Text>
                                    {/*[styles.bolded, { color: constants.colors[item.color_id] }]*/}
                                    {privateVisible || item.public ?
                                        <Text style={[styles.bolded, styles.textDefaultBold, { color: constants.colors[item['color_id']] }]}>{item.category_name}</Text>
                                        :
                                        <Text style={[styles.bolded, styles.textDefaultBold, { color: '#67806D' }]}>[REDACTED]</Text>
                                    }
                                </Text>
                                <Text style={[styles.textDefault,
                                { fontSize: 11, color: '#949494', marginTop: 5, }]}> {timeAgo(item.time_end)}</Text>

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
    textDefaultBold: {
        fontFamily: 'Inter-Bold',
    },
    textDefault: {
        fontFamily: 'Inter-Regular',
    },
    outerContainer: {
    },
    banner: {
        width: '100%',
        backgroundColor: '#fdd696',
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
        marginTop: 55,
        paddingHorizontal: 25,
    },
    eyeButton: {
        position: 'absolute',
        alignSelf: 'center',
        //borderWidth: 1,
        marginTop: 55,

    },
    pfp: {
        position: 'absolute',
        //backgroundColor: '#C3E6E7',
        width: 120,
        height: 120,
        borderRadius: 100,
        borderColor: 'white',
        borderWidth: 3,
    },
    username: {
        position: 'absolute',
        marginLeft: 25,
        fontWeight: 'bold',
        fontSize: 26,
        color: 'white',
        marginBottom: 5,
    },
    textContainer: {
        position: 'absolute',
        flexDirection: 'row',
        marginLeft: 25,
    },
    text: {
        fontSize: 18,
        color: 'white',
    },
    bioText: {
        flex: 1.1,
        fontSize: 14,
        marginLeft: 25,
        color: '#67806C'
    },
    categoryContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 40,
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
        color: 'white',
        fontSize: 12,
        paddingHorizontal: 2,
    },
    recent: {
        marginLeft: 25,
        marginTop: 10,
        color: '#D0993D',
        fontSize: 21,
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
        fontSize: 15,
        fontColor: '#67806D',
    },
    pfpcontainerTEMP: {
        flex: 0.25,
        //backgroundColor: 'green',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pfpTEMP: {
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