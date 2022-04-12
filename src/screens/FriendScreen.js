import React, { useState, useContext } from 'react';
import { View, StyleSheet, Text, FlatList, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Input, Button, Icon } from 'react-native-elements';
import { Context as userContext } from '../context/userContext';

const FriendScreen = ({ navigation }) => {
    const { height, width } = Dimensions.get('window');
    const [friendCode, setFriendCode] = useState('')
    const { state, requestFriend, fetchOutgoingRequests, fetchIncomingRequests,
        acceptFriendRequest, rejectFriendRequest, fetchFriends } = useContext(userContext)

    const resetInputs = async () => {
        setFriendCode('')
        alert("Success");
    }
    return (
        <View style={styles.container}>
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

                <View style={{ borderWidth: 1, borderRadius: 5, borderColor: 'black', margin: 5, padding: 5, marginBottom: 10 }}>
                    <Text>Add friend using friend code here:</Text>
                    <Input
                        containerStyle={styles.nameInputStyleContainer}
                        inputContainerStyle={styles.inputStyleContainer}
                        placeholder='Friend Code to add'
                        autoCorrect={false}
                        value={friendCode}
                        onChangeText={setFriendCode}
                    />

                    <TouchableOpacity
                        style={[styles.addFriend, { width: width / 1.8, height: height / 12 }]}
                        onPress={() => {
                            requestFriend(friendCode, resetInputs)
                        }}>
                        <View style={styles.addFriendContainer}>
                            <Icon
                                name="person-add"
                                type='ionicon'
                                color='white' />
                            <Text style={styles.addFriendText}>Add Friend</Text>
                        </View>
                    </TouchableOpacity>

                    {state.errorMessage ? <Text>Error message here:{state.errorMessage}</Text> : null}
                </View>

                <Text>My friend code is {state.friendCode}</Text>

                {/*<Button title="Get Current Friends"
                    onPress={() => {
                        fetchFriends(resetInputs)
                    }} />*/}
                <FlatList
                    style={styles.flatlistStyle}
                    horizontal={true}
                    data={state.friends}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(result) => result.friend}
                    renderItem={({ item }) => {
                        return (
                            <View style={styles.listItem}>
                                <Text>Username: {item.username}</Text>
                                <Text>Friend User Id: {item.friend}</Text>

                                {/* unfriending is equivalent of rejecting frnd request */}
                                <Button title="Remove friend"
                                    onPress={() => {
                                        rejectFriendRequest(item.friend, resetInputs)
                                    }} />
                            </View>


                        )
                    }}
                >
                </FlatList>


                {/*<Button title="See outgoing friend requests "
                    onPress={() => {
                        fetchOutgoingRequests(resetInputs)
                    }}></Button>*/}
                <Text>Sent friend requests, awaiting reply:</Text>

                <FlatList
                    style={styles.flatlistStyle}
                    horizontal={true}
                    data={state.outgoingFriendReqs}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(result) => result.friend_b}
                    renderItem={({ item }) => {
                        return (
                            <View style={styles.listItem}>
                                <Text>Username: {item.username}</Text>
                                <Text>User Id: {item.friend_b}</Text>

                                {/* undo frnd request is equivalent of rejecting it */}
                                <Button title="Undo sending this request "
                                    onPress={() => {
                                        rejectFriendRequest(item.friend_b, resetInputs)
                                    }} />
                            </View>
                        )
                    }}
                >
                </FlatList>

                {/*<Button title="See incoming friend requests "
                    onPress={() => {
                        fetchIncomingRequests(resetInputs)
                    }}></Button>*/}
                <Text>People who've sent you a friend request:</Text>
                <FlatList
                    style={styles.flatlistStyle}
                    horizontal={true}
                    data={state.incomingFriendReqs}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(result) => result.friend_a}
                    renderItem={({ item }) => {
                        return (
                            <View style={styles.listItem}>
                                <Text>Username: {item.username}</Text>
                                <Text>User Id: {item.friend_a}</Text>

                                <Button title="Accept this request "
                                    onPress={() => {
                                        acceptFriendRequest(item.friend_a, item.username, resetInputs)
                                    }} />

                                <Button title="Reject this request "
                                    onPress={() => {
                                        rejectFriendRequest(item.friend_a, resetInputs)
                                    }} />


                            </View>
                        )
                    }}
                />
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 70,
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
    }
})

export default FriendScreen;