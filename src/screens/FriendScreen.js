import React, { useState, useContext } from 'react';
import { View, StyleSheet, Text, FlatList, ScrollView } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { NavigationEvents } from 'react-navigation';
import { Context as userContext } from '../context/userContext';

const FriendScreen = ({ navigation }) => {
    const [friendCode, setFriendCode] = useState('')
    const { state, requestFriend, fetchOutgoingRequests, fetchIncomingRequests,
        acceptFriendRequest, rejectFriendRequest, fetchFriends } = useContext(userContext)

    const resetInputs = async () => {
        setFriendCode('')
        alert("Success");
    }
    return (
        <View>
            <ScrollView>
                <Text style={styles.title}>Friend Screen</Text>

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

                    <Button title="Add friend"
                        onPress={() => {
                            requestFriend(friendCode, resetInputs)
                        }}></Button>
                    {state.errorMessage ? <Text>Error message here:{state.errorMessage}</Text> : null}
                </View>

                <Button title="Get Current Friends"
                    onPress={() => {
                        fetchFriends(resetInputs)
                    }} />
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


                <Button title="See outgoing friend requests "
                    onPress={() => {
                        fetchOutgoingRequests(resetInputs)
                    }}></Button>
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

                <Button title="See incoming friend requests "
                    onPress={() => {
                        fetchIncomingRequests(resetInputs)
                    }}></Button>
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
    }
})

export default FriendScreen;