import React, { useState, useContext } from 'react';
import { View, StyleSheet, Text, FlatList, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Input, Button, Icon } from 'react-native-elements';
import { Context as userContext } from '../context/userContext';
import Modal from 'react-native-modal'
import AddFriendModal from '../components/AddFriendModal';
import AvatarComponent from '../components/AvatarComponent';

const FriendScreen = ({ navigation }) => {
    const { height, width } = Dimensions.get('window');
    const [friendCode, setFriendCode] = useState('')
    const { state, requestFriend, fetchOutgoingRequests, fetchIncomingRequests,
        acceptFriendRequest, rejectFriendRequest, fetchFriends } = useContext(userContext)
    const [modalVisible, setModalVisible] = useState(false)

    console.log(state.friends)
    const resetInputs = async () => {
        setFriendCode('')
        alert('Success!')
    }
    const acceptFriendCallback = async () => {
        await fetchFriends()
        alert("Friend req successfully accepted.");
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
                    //borderBottomWidth: StyleSheet.hairlineWidth,
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

    return (
        <View style={styles.container}>

            <Modal isVisible={modalVisible}
                animationIn='slideInLeft'
                animationOut='slideOutLeft'>
                <View style={{ height: 200, }}>
                    <AddFriendModal
                        toggleFunction={toggleModal}
                        //onShow={() => { firstRef.focus() }}
                        callback={modalCallback} />
                </View>

            </Modal>


            <ScrollView>

                <View style={styles.makeshiftTabBarContainer}>
                    <View style={styles.makeshiftTabBar}>
                        <TouchableOpacity style={styles.tabBarButton}>
                            <Text style={styles.tabBarText}>Go to Me</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.tabBarButton}
                            onPress={() => { navigation.navigate('FriendFeed') }}>
                            <Text style={styles.tabBarText}>Back to Feed</Text>
                        </TouchableOpacity>
                    </View>
                </View>


                <TouchableOpacity
                    style={[styles.addFriend, { width: width / 1.8, height: height / 12 }]}
                    onPress={() => {
                        toggleModal()
                    }}>
                    <View style={styles.addFriendContainer}>
                        <Icon
                            name="person-add"
                            type='ionicon'
                            color='white' />
                        <Text style={styles.addFriendText}>Add Friend</Text>
                    </View>
                </TouchableOpacity>

                {/* MY FRIEND CARD */}
                <View style={{
                    borderWidth: 1, borderColor: '#90AB72', borderRadius: 10,
                    alignItems: 'center', marginHorizontal: 50, backgroundColor: '#CDD5A0',
                    padding: 10, marginBottom: 10,
                }}>
                    <Text>Add me! My friend code is:</Text>
                    <Text style={{ fontSize: 30, }}>{state.friendCode}</Text>
                </View>


                <Text style={{ marginLeft: 25, fontSize: 20, }}>My Friends:</Text>

                <View style={{ marginHorizontal: 20, marginVertical: 20 }}>
                    {state.friends
                        .map((item) => {
                            return <View
                                key={item.friend}
                                style={[styles.categoryStyle, { height: 70, }]}>
                                <View style={{ flexDirection: 'row', flex: 1, }}>

                                    {/* AVATAR */}
                                    <View style={{ flex: 2 }}>
                                        <AvatarComponent
                                            w={50}
                                            isSelf={false}
                                            id={item.friend}
                                            pfpSrc={state.base64pfp} />
                                    </View>

                                    {/* NAME // FRIEND SINCE- */}
                                    <View style={{ flex: 5, justifyContent: 'space-around' }}>
                                        <Text style={{ fontWeight: '600', fontSize: 18, }}>{item['username']}</Text>
                                        <Text style={{ fontSize: 12, fontWeight: '300', }}>
                                            {"Friend since " + formatDate(item['time_created'])}
                                        </Text>
                                    </View>

                                    {/* UNFRIEND BUTTON */}
                                    <View style={{ flex: 2, justifyContent: 'flex-end' }}>
                                        <TouchableOpacity
                                            style={{
                                                borderWidth: 1, borderRadius: 15, alignItems: 'center',
                                                marginBottom: 10, borderColor: 'gray',
                                            }}
                                            onPress={() => {
                                                rejectFriendRequest(item.friend, resetInputs)
                                            }}>
                                            <Text style={{ padding: 3, fontSize: 12, fontWeight: '300', }}>Unfriend</Text>
                                        </TouchableOpacity>
                                    </View>

                                </View>
                                {separator()}
                            </View>



                        })}
                </View>


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
                                                    rejectFriendRequest(item.friend_a, resetInputs)
                                                }}>
                                                <Text>Reject</Text>
                                            </TouchableOpacity>
                                        </View>



                                    </View>
                                </View>
                            )
                        })}
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 70,
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
        borderWidth: 1,
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
        backgroundColor: '#ABC57E',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        alignSelf: 'center',
        marginTop: 10,
        marginBottom: 20,
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.9,
    },
    addFriendText: {
        color: 'white',
        fontSize: 25,
        fontWeight: 'bold',
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
    },
    categoryContainer: {
        marginVertical: 20,
        marginHorizontal: 25,
    },
})

export default FriendScreen;