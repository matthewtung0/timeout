import React, { useState, useContext, useMemo, useCallback } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Dimensions, FlatList, Platform, Alert } from 'react-native';
import { Icon } from 'react-native-elements';
import { Context as userContext } from '../context/userContext';
import Modal from 'react-native-modal'
import AddFriendModal from '../components/AddFriendModal';
import AvatarComponent from '../components/AvatarComponent';
import { useFocusEffect } from '@react-navigation/native';

const FriendScreen = ({ navigation, route: { params } }) => {
    const { height, width } = Dimensions.get('window');
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
                                <Text style={[styles.textDefaultBold, { fontSize: 17, color: '#67806D' }]}>{item['username']}</Text>
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
        <View style={[styles.container, { marginTop: Platform.OS === 'ios' ? 100 : 80 }]}>

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

                <View style={{ marginHorizontal: 20, flexDirection: 'row', paddingBottom: 10, }}>
                    <TouchableOpacity style={[styles.tabBarButton, {
                        backgroundColor: '#83B569', borderTopLeftRadius: 15, borderBottomLeftRadius: 15,
                        borderWidth: 1, borderColor: '#8DC867', borderRightWidth: 0, paddingVertical: 5,
                    }]}
                        onPress={() => { navigation.navigate('Notifications', params) }}>
                        <Text style={[styles.tabBarText, styles.textDefault,
                        {}]}>Me</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.tabBarButton, {
                        backgroundColor: '#83B569',
                        borderWidth: 1, borderColor: '#8DC867', borderRightWidth: 0, paddingVertical: 5,
                    }]}
                        onPress={() => { navigation.navigate('FriendFeed') }}>
                        <Text style={[styles.tabBarText, styles.textDefault, {}]}>Feed</Text>
                    </TouchableOpacity>
                    <View style={[styles.tabBarButton, {
                        backgroundColor: '#8DC867',
                        borderTopRightRadius: 15, borderBottomRightRadius: 15,
                        borderWidth: 1, borderColor: '#8DC867', borderLeftWidth: 0, paddingVertical: 5,
                    }]}>
                        <Text style={[styles.tabBarText, styles.textDefault,]}>Friends</Text>
                    </View>
                </View>


                <TouchableOpacity
                    style={[styles.addFriend, { width: width / 1.8, height: height / 18, backgroundColor: '#83B569', }]}
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
        shadowOffset: {
            width: 0.3,
            height: 0.3,
        },
        shadowOpacity: 0.4,
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
    },
    categoryContainer: {
        marginVertical: 20,
        marginHorizontal: 25,
    },
})

export default FriendScreen;