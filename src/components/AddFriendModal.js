import React, { useContext, useState } from 'react';
import {
    View, StyleSheet, Text, FlatList, Dimensions, TouchableOpacity
} from 'react-native';
import { Input, Icon, Button } from 'react-native-elements';
import { Context as userContext } from '../context/userContext';

const AddFriendModal = ({ toggleFunction, callback }) => {
    const { height, width } = Dimensions.get('window');
    const [friendCode, setFriendCode] = useState('')
    const { state, requestFriend, fetchOutgoingRequests } = useContext(userContext)

    const requestFriendCallback = async () => {
        await fetchOutgoingRequests()
        toggleFunction()
        alert("Friend request successfully sent.");
    }


    return (
        <View style={styles.container}>

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
                        if (friendCode) {
                            requestFriend(friendCode, requestFriendCallback)
                        }

                    }}>
                    <View style={styles.addFriendContainer}>
                        <Icon
                            name="person-add"
                            type='ionicon'
                            color='white' />
                        <Text style={styles.addFriendText}>Add Friend</Text>
                    </View>
                </TouchableOpacity>
                <Button title="Go back"
                    onPress={toggleFunction}></Button>

                {state.errorMessage ? <Text>Error message here:{state.errorMessage}</Text> : null}
            </View>

        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignContent: 'center'
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
})

export default AddFriendModal;