import React, { useContext, useCallback, useState, useMemo, memo } from 'react';
import { View, StyleSheet, Dimensions, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text, Icon } from 'react-native-elements';
import { Context as UserContext } from '../context/userContext';
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
import ProfileComponent from '../components/ProfileComponent';

const constants = require('../components/constants.json')
const BANNER_HEIGHT = 230;
const BANNER_COLOR = '#fdd696';
const NUM_TO_RETRIEVE = 50;

const ProfileScreen = ({ navigation }) => {
    const { width, height } = Dimensions.get('window')
    const [pfpModalVisible, setPFPModalVisible] = useState(false)
    const { state, fetchAvatarGeneral } = useContext(UserContext)
    const [offset, setOffset] = useState(0)
    const [visibleOffset, setVisibleOffset] = useState(0);
    const [atEnd, setAtEnd] = useState(false);
    const [privateVisible, setPrivateVisible] = useState(false)
    const [isMe, setIsMe] = useState(false)
    const [profileSessions, setProfileSessions] = useState([[]])
    const [profileCategories, setProfileCategories] = useState([])
    const [pfpSrc, setPfpSrc] = useState('');
    const [isLoading, setIsLoading] = useState(false);
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
            setIsLoading(true);
            console.log("Getting feed with", state.idToView)
            if (state.idToView == state.user_id) {
                setIsMe(true)
            }
            getFeed()

            return () => {
                console.log("cleaning up")
                setProfileStats({
                    totalTime: { hours: 0, minutes: 0, seconds: 0 },
                    totalTasks: 0, last_signin: '', time_created: '', username: ''
                })
                setProfileSessions([[]])
                setProfileCategories([])
                setOffset(0)
                setVisibleOffset(0)
                setPfpSrc('')
                setIsMe(false)
            }
        }, [state.idToView])
    )
    const getFeed = async () => {
        try {
            setOffset(0)

            // try to get the pfp only once
            const pfpSrc_res = await fetchAvatarGeneral(state.idToView)
            setPfpSrc(pfpSrc_res);

            await fetchStatsProfile(state.idToView)
            await fetchCategoriesProfile(state.idToView, state.idToView == state.user_id)
            await fetchInitialBatch(state.idToView);
            setIsLoading(false);


        } catch (err) {
            console.log("Problem retrieving self feed", err)
        }
    }
    const togglePrivateVisible = () => { setPrivateVisible(!privateVisible) }

    const fetchStatsProfile = async (id) => {
        try {
            const response = await timeoutApi.get(`/stats/${id}`)
            //console.log("stats", response.data)
            setProfileStats({
                totalTime: response.data.total_time,
                totalTasks: response.data.num_tasks,
                last_signin: response.data.last_signin,
                bio: response.data.bio,
                time_created: response.data.time_created,
                username: response.data.username
            })
            /*console.log(`response username is ${response.data.username} and my username is ${state.username}`)
            if (response.data.username == state.username) {
                setIsMe(true)
            }*/
        } catch (err) { console.log("PROBLEM FETCHING STATS", err) }
    }

    const fetchCategoriesProfile = async (id, getPrivate) => {
        try {
            const response = await timeoutApi.get(`/category/${id}`, { params: { getPrivate } })
            setProfileCategories(response.data)
        } catch (err) {
            console.log("error fetching categories", err);
        }
    }

    const fetchSessionsProfile = async (id, getPrivate) => {
        const response = await timeoutApi.get('/session', { params: { id, getPrivate } })
        setProfileSessions([response.data])
    }

    const fetchInitialBatch = async (id) => {
        //const response = await timeoutApi.get(`/session/${id}`)
        var initialNumToRetrieve = 10;
        const response2 = await timeoutApi.get(`/sessionFeed`,
            { params: { startIndex: 0, friends: [id], numToRetrieve: initialNumToRetrieve, } })
        setOffset(offset + initialNumToRetrieve)
        setProfileSessions([response2.data])
        setVisibleOffset(visibleOffset + initialNumToRetrieve)
    }
    console.log(`Offset is ${offset}`)
    console.log(`Visible offset is ${visibleOffset}`)

    const getData = async () => {
        //if (isLoading) { return; }
        console.log("Loading 10 more..");

        if (atEnd) { return }
        if (visibleOffset < offset) {
            // no need to retrieve, just reveal more items
            setVisibleOffset(visibleOffset + 10);
            return;
        }

        setIsLoading(true)
        var numToRetrieve = NUM_TO_RETRIEVE
        try {
            const response2 = await timeoutApi.get(`/sessionFeed`, {
                params: {
                    startIndex: offset, friends: [state.idToView],
                    numToRetrieve: numToRetrieve
                }
            })
            //let temp2 = await fetchSessionsNextBatchSelf(offset, state.user_id)
            if (response2.data.length == 0) { setAtEnd(true) } else {
                setOffset(offset + Math.min(response2.data.length, numToRetrieve))
                setVisibleOffset(visibleOffset + Math.min(response2.data.length, 10))
            }
            setProfileSessions([[...profileSessions[0], ...response2.data]])
            setIsLoading(false);
        } catch (err) {
            setIsLoading(false)
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

    const togglePFPModal = () => {
        setPFPModalVisible(!pfpModalVisible)
    }

    const renderHeader = () => {
        return (
            <>

                <View style={[styles.banner, { height: BANNER_HEIGHT, backgroundColor: BANNER_COLOR }]} />

                {/* MAIN PROFILE PICTURE HERE */}
                <TouchableOpacity
                    style={[styles.pfp, { marginLeft: (width - 120) / 1.08, marginTop: BANNER_HEIGHT - 60, }]}
                    onPress={togglePFPModal}>
                    <View>
                        <AvatarComponent w={115} pfpSrc={pfpSrc}
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


                {/*
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
                    */}

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

                <Text style={[styles.recent, styles.textDefaultBold]}>Recent</Text>
            </>
        )
    }

    const flatListItself = () => {
        return (
            <FlatList
                style={{ marginBottom: 20, }}
                //data={sessionState.selfOnlySessions}
                data={profileSessions[0].slice(0, visibleOffset)}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.activity_id}
                onEndReached={getData}
                ListHeaderComponent={renderHeader}
                ListFooterComponent={renderFooter}
                renderItem={({ item, index }) => (
                    <ProfileComponent item={item} index={index} pfpSrc={pfpSrc} idToView={state.idToView}
                        privateVisible={privateVisible} />
                )}
            >
            </FlatList>
        )
    }

    const memoizedFlatList = useMemo(flatListItself, [profileSessions, privateVisible, isMe, profileStats, profileCategories,
        pfpSrc, visibleOffset, atEnd, state.idToView])

    return (
        <View style={styles.outerContainer}>

            <Modal isVisible={pfpModalVisible}
                animationIn='slideInUp'
                animationOut='slideOutUp'
                backdropTransitionOutTiming={0}>

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
                            idToView={state.idToView}
                        />
                    </View></View>
            </Modal>
            {memoizedFlatList}

            {isLoading ?

                <View style={{
                    position: 'absolute', flex: 1, width: '100%', height: '100%',
                    justifyContent: 'center', alignItems: 'center', backgroundColor: 'white',
                    opacity: 0.7,
                }}>

                    <ActivityIndicator size="large" color="black" />
                </View>
                : null}


            <View style={{ position: 'absolute', height: 100, backgroundColor: BANNER_COLOR, flex: 1, width: '100%' }}>

            </View>
            <Header
                navigation={navigation}
                color={'#67806D'} />

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
    outerContainer: {
        flex: 1,
    },
    banner: {
        width: '100%',
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