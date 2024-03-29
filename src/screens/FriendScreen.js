import React, { useState, useContext, useMemo, useCallback } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Dimensions, FlatList, Platform, Alert, Image } from 'react-native';
import { Icon } from 'react-native-elements';
import { Context as userContext } from '../context/userContext';
import { useHeaderHeight } from '@react-navigation/elements';
import Modal from 'react-native-modal'
import AddFriendModal from '../components/AddFriendModal';
import AvatarComponent from '../components/AvatarComponent';
import tinycolor from 'tinycolor2';
import { useFocusEffect } from '@react-navigation/native';
const img = require('../../assets/tasks_topbar.png')

const FriendScreen = ({ navigation, route: { params } }) => {
    const { height, width } = Dimensions.get('window');
    const headerHeight = useHeaderHeight();
    const BANNER_IMG_HEIGHT = headerHeight ? headerHeight : 90;
    const [friendCode, setFriendCode] = useState('')
    const { state, rejectFriendRequest, fetchFriends, setIdToView } = useContext(userContext)
    const [modalVisible, setModalVisible] = useState(false)

    const [visibleOffset, setVisibleOffset] = useState(0)
    const [offset, setOffset] = useState(0)
    const [atEnd, setAtEnd] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    useFocusEffect(
        useCallback(() => {
            setIsLoading(true)
            setOffset(state.friends.length)
            setVisibleOffset(10)

            return () => {
                console.log("cleaning up")
                setIsLoading(false)
                setOffset(state.friends.length)
                setVisibleOffset(0)
                setAtEnd(false)
            }
        }, [state.friends])
    )

    const getData = async () => {
        console.log("Loading more..")
        setVisibleOffset(visibleOffset + 10);
    }

    const resetInputs = async () => {
        setFriendCode('')
        await fetchFriends()
        alert('Unfriended successfully.')
    }

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    const modalCallback = () => {
    }

    const separator = () => {
        return (
            <View
                style={{
                    borderBottomColor: '#DCDBDB',
                    borderBottomWidth: 1.5,
                    marginBottom: 10,
                }}
            />
        )
    }

    const formatDate = (dt) => {
        var date = new Date(dt)
        return date.toLocaleDateString("en-US")
    }

    const areYouSureUnfriend = (friend, callback) => {
        Alert.alert(
            "Are you sure you want to unfriend?",
            "",
            [
                {
                    text: "Go back", onPress: () => { return false }, style: "cancel"
                },
                {
                    text: "Unfriend", onPress: () => { rejectFriendRequest(friend, callback) }
                }
            ]
        );
    }


    const flatListItself = () => {
        return (
            <FlatList
                style={styles.flatlistStyle}
                horizontal={false}
                onEndReached={getData}
                data={state.friends.slice(0, visibleOffset)}
                ItemSeparatorComponent={separator}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.friend}
                renderItem={({ item, index }) =>
                    <View
                        style={[styles.categoryStyle, { height: 70, }]}>
                        <View style={{ flexDirection: 'row', flex: 1, }}>

                            {/* AVATAR */}
                            <View style={{ flex: 2 }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        setIdToView({ username: item.username, user_id: item.friend })
                                        navigation.navigate('Profile temp')
                                    }}>
                                    <AvatarComponent
                                        w={50}
                                        id={item.friend}
                                        isThumbnail={true}
                                    />
                                </TouchableOpacity>
                            </View>

                            {/* NAME // FRIEND SINCE- */}
                            <View style={{ flex: 5, justifyContent: 'space-around' }}>
                                <TouchableOpacity onPress={() => {
                                    setIdToView({ username: item.username, user_id: item.friend })
                                    navigation.navigate('Profile temp')
                                }}>
                                    <Text style={[styles.textDefaultBold, { fontSize: 17, color: '#67806D' }]}>{item['username']}
                                    </Text>
                                </TouchableOpacity>


                                <Text style={[styles.textDefault, { fontSize: 14, color: 'gray' }]}>
                                    {"Friend since " + formatDate(item['time_created'])}
                                </Text>
                            </View>

                            {/* UNFRIEND BUTTON */}
                            <View style={{ flex: 2, justifyContent: 'flex-end' }}>
                                <TouchableOpacity
                                    style={{
                                        borderWidth: 1, borderRadius: 15, alignItems: 'center',
                                        marginBottom: 10, borderColor: '#67806D',
                                    }}
                                    onPress={() => {
                                        areYouSureUnfriend(item.friend, resetInputs)
                                    }}>
                                    <Text style={[styles.textDefault,
                                    { padding: 3, fontSize: 12, color: '#67806D' }]}>Unfriend</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>
                }
            >
            </FlatList>
        )
    }

    const memoizedFlatList = useMemo(flatListItself, [state.friends, visibleOffset, atEnd,])

    return (
        <View style={[styles.container, { marginTop: Platform.OS === 'ios' ? 0 : 0 }]}>

            <Modal isVisible={modalVisible}
                animationIn='slideInLeft'
                animationOut='slideOutLeft'
                backdropTransitionOutTiming={0}>
                <View style={{ height: height * 0.8, }}>
                    <AddFriendModal
                        toggleFunction={toggleModal}
                        //onShow={() => { firstRef.focus() }}
                        myFriendCode={state.friendCode}
                        callback={modalCallback} />
                </View>

            </Modal>

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
                    style={[styles.sortContainer,
                    { borderRightWidth: 0, borderTopLeftRadius: 15, borderBottomLeftRadius: 15, }]}
                    onPress={() => {
                        navigation.navigate('Notifications')
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
                <TouchableOpacity style={[styles.sortContainer, styles.sortContainerSelected,
                { borderTopRightRadius: 15, borderBottomRightRadius: 15, }]}
                    onPress={() => {
                    }}>
                    <Text style={[styles.textDefault, styles.sortText]}>Friends</Text>
                </TouchableOpacity>
            </View>


            <View>
                {/*
                <View style={{ marginHorizontal: 20, flexDirection: 'row', paddingBottom: 10, }}>
                    <TouchableOpacity style={[styles.tabBarButton, {
                        backgroundColor: '#83B569', borderTopLeftRadius: 15, borderBottomLeftRadius: 15,
                        borderWidth: 1, borderColor: '#83B569', borderRightWidth: 0, paddingVertical: 5,
                        shadowOffset: {
                            width: 0,
                            height: 4,
                        },
                        shadowOpacity: 1,
                        shadowRadius: 0,
                        shadowColor: tinycolor('#83B569').darken(15).toString()
                    }]}
                        onPress={() => { navigation.navigate('Notifications', params) }}>
                        <Text style={[styles.tabBarText, styles.textDefault,
                        {}]}>Me</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.tabBarButton, {
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
                    <View style={[styles.tabBarButton, {
                        backgroundColor: '#8DC867',
                        borderTopRightRadius: 15, borderBottomRightRadius: 15,
                        borderWidth: 1, borderColor: '#8DC867', borderLeftWidth: 0, paddingVertical: 5,
                        shadowOffset: {
                            width: 0,
                            height: 4,
                        },
                        shadowOpacity: 1,
                        shadowRadius: 0,
                        shadowColor: tinycolor('#8DC867').darken(15).toString()
                    }]}>
                        <Text style={[styles.tabBarText, styles.textDefault,]}>Friends</Text>
                    </View>
                </View>*/}

                <TouchableOpacity
                    style={[styles.addFriend, {
                        width: width / 1.8, height: height / 18, backgroundColor: '#83B569',
                        shadowOffset: {
                            width: 0,
                            height: 6,
                        },
                        shadowOpacity: 1,
                        shadowRadius: 0,
                        shadowColor: tinycolor('#83B569').darken(25).toString()
                    }]}
                    onPress={() => {
                        toggleModal()
                    }}>
                    <View style={styles.addFriendContainer}>
                        <Icon
                            name="person-add"
                            type='ionicon'
                            color='white' />
                        <Text style={[styles.textDefaultBold, styles.addFriendText]}>Add Friend</Text>
                    </View>
                </TouchableOpacity>

                <Text style={[styles.textDefaultBold, { marginLeft: 25, fontSize: 20, color: '#67806D', marginTop: 0, }]}>
                    My Friends:</Text>

                {state.friends.length == 0 ?
                    <View style={{ alignItems: 'center' }}>
                        <Text style={[styles.textDefault, {
                            marginTop: 20, marginBottom: 10,
                            color: '#67806D', fontSize: 16, textAlign: 'center', marginHorizontal: 10,
                        }]}>
                            No friends yet..</Text>
                    </View>
                    :

                    <View style={{ marginHorizontal: 20, }}>
                        {memoizedFlatList}
                    </View>
                }

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
    container: {
        flex: 1,
    },
    title: {
        margin: 30,
        fontSize: 40,
    },
    listItem: {
        width: 150,
        margin: 5,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
        padding: 5,
    },
    flatlistStyle: {
        margin: 5,
        borderWidth: 0,
        borderColor: 'black',
        borderRadius: 5,
        padding: 5,
    },
    addFriendContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    addFriend: {

        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        alignSelf: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    addFriendText: {
        color: 'white',
        fontSize: 20,
        marginLeft: 10,
    },
    makeshiftTabBarContainer: {
        height: 60,
    },
    makeshiftTabBar: {
        flex: 1,
        flexDirection: 'row',
    },
    tabBarButton: {
        flex: 1,

        backgroundColor: '#ABC57E',
        alignItems: 'center',
        justifyContent: 'center'
    },
    tabBarText: {
        //color: 'white',
        //fontSize: 17,
        textAlign: 'center', fontSize: 17, justifyContent: 'center', color: 'white',
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

export default FriendScreen;