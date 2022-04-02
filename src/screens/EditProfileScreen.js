import React, { useContext, useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Input, Button, Text } from 'react-native-elements';
import { Context as UserContext } from '../context/userContext';
import { Context as AuthContext } from '../context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';

const EditProfileScreen = () => {
    const { state, fetchSelf, editSelf, clearResponseMessage } = useContext(UserContext)
    const { changePassword } = useContext(AuthContext)
    const [firstName, setFirstName] = useState(state.firstName)
    const [lastName, setLastName] = useState(state.lastName)
    const [username, setUsername] = useState(state.username)

    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [passwordMessage, setPasswordMessage] = useState('')

    useFocusEffect(

        useCallback(() => {
            clearResponseMessage();
            //return () => test();
        }, [])
    )
    const resultCallback = () => {
        setPasswordMessage('Password change successful!')
        setOldPassword('')
        setNewPassword('')
    }

    const areYouSure = () =>
        Alert.alert(
            "Are you sure?",
            "All your data will be deleted. This is not un-doable.",
            [
                {
                    text: "Go back",
                    onPress: () => { },
                    style: "cancel"
                },
                { text: "Delete", onPress: () => { } }
            ]
        );

    // firstname, lastname, username, password
    return (
        <View>
            <ScrollView>

                <Text style={styles.title}>Edit Profile Screen</Text>

                <Input
                    style={styles.inputStyle}
                    inputContainerStyle={styles.inputStyleContainer}
                    autoCapitalize='none'
                    autoCorrect={false}
                    value={firstName}
                    placeholder="First Name"
                    label="First Name"
                    onChangeText={setFirstName}
                />
                <Input
                    style={styles.inputStyle}
                    inputContainerStyle={styles.inputStyleContainer}
                    autoCapitalize='none'
                    autoCorrect={false}
                    value={lastName}
                    placeholder="Last Name"
                    label="Last Name"
                    onChangeText={setLastName}
                />
                <Input
                    style={styles.inputStyle}
                    inputContainerStyle={styles.inputStyleContainer}
                    autoCapitalize='none'
                    autoCorrect={false}
                    value={username}
                    placeholder="username"
                    label="Username"
                    onChangeText={setUsername}
                />
                <TouchableOpacity
                    style={styles.signInBoxStyle}
                    onPress={() => {
                        editSelf({ firstName, lastName, username })
                    }}>
                    <Text style={styles.signInTextStyle}>Update Information</Text>
                </TouchableOpacity>

                {state.responseMessage ? <Text>{state.responseMessage}</Text> : null}

                <Input
                    style={styles.inputStyle}
                    inputContainerStyle={styles.inputStyleContainer}
                    autoCapitalize='none'
                    autoCorrect={false}
                    value={oldPassword}
                    placeholder="Current Password"
                    label="Current Password"
                    onChangeText={setOldPassword}
                />
                <Input
                    style={styles.inputStyle}
                    inputContainerStyle={styles.inputStyleContainer}
                    autoCapitalize='none'
                    autoCorrect={false}
                    value={newPassword}
                    placeholder="New Password"
                    label="New Password"
                    onChangeText={setNewPassword}
                />
                <TouchableOpacity
                    style={styles.signInBoxStyle}
                    onPress={() => {
                        changePassword(oldPassword, newPassword, resultCallback)
                    }}>
                    <Text style={styles.signInTextStyle}>Change Password</Text>
                </TouchableOpacity>

                {passwordMessage ? <Text>{passwordMessage}</Text> : null}

                <TouchableOpacity
                    style={styles.signInBoxStyle}
                    onPress={areYouSure}>
                    <Text style={styles.signInTextStyle}>DELETE ACCOUNT</Text>
                </TouchableOpacity>

            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        margin: 15,
        fontSize: 25,
    },
    inputStyle: {
        backgroundColor: 'white',
        borderRadius: 15,
        marginHorizontal: 25,
        paddingHorizontal: 17,
    },
    inputContainer: {
        flex: 1,
        flexDirection: 'column',
    },
    inputStyleContainer: {
        borderBottomWidth: 0,
    },
    signInBoxStyle: {
        backgroundColor: '#FCC859',
        width: 150,
        height: 40,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginBottom: 10,
    },
    signInTextStyle: {
        color: '#F6F2DF',
        fontSize: 14,
        fontWeight: 'bold'

    },
})

export default EditProfileScreen;