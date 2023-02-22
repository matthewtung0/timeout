import React, { useContext, useState } from 'react';
import {
    View, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator,
    TouchableWithoutFeedback
} from 'react-native';
import { Input, Text, Icon } from 'react-native-elements';
import tinycolor from 'tinycolor2';
import { Context as UserContext } from '../context/userContext';
import { Context as AuthContext } from '../context/AuthContext';
const MARGIN_HORIZONTAL = 20

const HideKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>
);

const EditProfileScreen = ({ navigation }) => {
    const { state, editSelf, } = useContext(UserContext)
    const { changePassword } = useContext(AuthContext)
    const [firstName, setFirstName] = useState(state.firstName)
    const [lastName, setLastName] = useState(state.lastName)
    const [username, setUsername] = useState(state.username)
    const [bio, setBio] = useState(state.bio)
    const [isLoading, setIsLoading] = useState(false)

    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [passwordMessage, setPasswordMessage] = useState('')

    const resultCallback = () => {
        setPasswordMessage('Password change successful!')
        setOldPassword('')
        setNewPassword('')
    }

    const errorReset = () => {
        setIsLoading(false)
    }

    const areYouSure = () => {
        Alert.alert(
            "Are you sure?",
            "All your data will be deleted. This is not un-doable.",
            [{
                text: "Go back",
                onPress: () => { },
                style: "cancel"
            },
            { text: "Delete", onPress: () => { } }]
        );
    }

    const updateInfoCallback = () => {
        setIsLoading(false)
        alert("Information successfuly updated!")
    }

    const setBioFunc = (txt) => {
        var num_lines = txt.split(/\r\n|\r|\n/).length
        if (num_lines <= 6) {
            setBio(txt)
        }
    }

    // firstname, lastname, username, password
    return (

        <HideKeyboard>
            <>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => { navigation.navigate('Profile') }}>
                    <Icon
                        name='arrow-back-outline'
                        type='ionicon'
                        size={35}
                        color='black' />
                </TouchableOpacity>

                <View style={[styles.viewContainer, { marginHorizontal: MARGIN_HORIZONTAL }]}>

                    <ScrollView>

                        <Text style={[styles.title, styles.textDefaultSemiBold, { fontSize: 20, }]}>Edit my information:</Text>

                        <Input
                            style={[styles.inputStyle, styles.textDefault, { fontSize: 16, color: '#67806D' }]}
                            inputContainerStyle={styles.inputStyleContainer}
                            autoCapitalize='none'
                            autoCorrect={false}
                            value={firstName}
                            placeholder="First name"
                            placeholderTextColor={'#67806D'}
                            labelStyle={[styles.textDefault, { fontSize: 15, color: '#67806D' }]}
                            input
                            label="First name"
                            onChangeText={setFirstName}
                        />
                        <Input
                            style={[styles.inputStyle, styles.textDefault, { fontSize: 16, color: '#67806D' }]}
                            inputContainerStyle={styles.inputStyleContainer}
                            autoCapitalize='none'
                            autoCorrect={false}
                            value={lastName}
                            placeholder="Last name"
                            placeholderTextColor={'#67806D'}
                            labelStyle={[styles.textDefault, { fontSize: 15, color: '#67806D' }]}
                            label="Last name"
                            onChangeText={setLastName}
                        />
                        <Input
                            style={[styles.inputStyle, styles.textDefault, { fontSize: 16, color: '#67806D' }]}
                            inputContainerStyle={styles.inputStyleContainer}
                            autoCapitalize='none'
                            autoCorrect={false}
                            value={username}
                            placeholder="username"
                            placeholderTextColor={'#67806D'}
                            labelStyle={[styles.textDefault, { fontSize: 15, color: '#67806D' }]}
                            label="Username"
                            onChangeText={setUsername}
                        />

                        <Input
                            style={[styles.inputStyle, styles.textDefault, { fontSize: 16, color: '#67806D' }]}
                            inputContainerStyle={styles.inputStyleContainer}
                            autoCapitalize='none'
                            autoCorrect={false}
                            value={bio}
                            multiline={true}
                            numberOfLines={6}
                            maxHeight={120}
                            editable
                            maxLength={150}
                            placeholder="bio"
                            placeholderTextColor={'#67806D'}
                            labelStyle={[styles.textDefault, { fontSize: 15, color: '#67806D' }]}
                            label="Bio"
                            onChangeText={(bioText) => {
                                setBioFunc(bioText)
                            }}
                        />
                        <TouchableOpacity
                            style={[styles.signInBoxStyle,
                            {
                                shadowOffset: {
                                    width: 0,
                                    height: 6,
                                },
                                shadowOpacity: 1,
                                shadowRadius: 0,
                                shadowColor: tinycolor('#FCC859').darken(25).toString(),
                                padding: 15,
                            }]}
                            onPress={() => {
                                setIsLoading(true)
                                editSelf(firstName, lastName, username, bio, updateInfoCallback, errorReset)
                            }}>
                            <Text style={[styles.signInTextStyle, styles.textDefaultSemiBold, { fontSize: 16, }]}>Update Information</Text>
                        </TouchableOpacity>

                        {isLoading ?
                            <ActivityIndicator size="large" color="gray" /> : null}

                        {/*{state.responseMessage ? <Text>{state.responseMessage}</Text> : null}*/}

                        <Text style={[styles.title, styles.textDefaultSemiBold, { marginTop: 15, fontSize: 20 }]}>Change password:</Text>

                        <Input
                            style={[styles.inputStyle, styles.textDefault, { fontSize: 14, color: '#67806D' }]}
                            inputContainerStyle={styles.inputStyleContainer}
                            autoCapitalize='none'
                            autoCorrect={false}
                            value={oldPassword}
                            placeholder="Current Password"
                            placeholderTextColor={'#67806D'}
                            labelStyle={[styles.textDefault, { fontSize: 15, color: '#67806D' }]}
                            label="Current Password"
                            onChangeText={setOldPassword}
                        />
                        <Input
                            style={[styles.inputStyle, styles.textDefault, { fontSize: 14, color: '#67806D' }]}
                            inputContainerStyle={styles.inputStyleContainer}
                            autoCapitalize='none'
                            autoCorrect={false}
                            value={newPassword}
                            placeholder="New Password"
                            placeholderTextColor={'#67806D'}
                            labelStyle={[styles.textDefault, { fontSize: 15, color: '#67806D' }]}
                            label="New Password"
                            onChangeText={setNewPassword}
                        />
                        <TouchableOpacity
                            style={[styles.signInBoxStyle, {
                                shadowOffset: {
                                    width: 0,
                                    height: 6,
                                },
                                shadowOpacity: 1,
                                shadowRadius: 0,
                                shadowColor: tinycolor('#FCC859').darken(25).toString(),
                                padding: 15,
                            }]}
                            onPress={() => {
                                if (oldPassword == '' || newPassword == '') { return }
                                changePassword(oldPassword, newPassword, resultCallback, errorReset)
                            }}>
                            <Text style={[styles.signInTextStyle, styles.textDefaultSemiBold, { fontSize: 16, }]}>Change Password</Text>
                        </TouchableOpacity>


                        {passwordMessage ? <Text>{passwordMessage}</Text> : null}


                        <Text style={[styles.title, styles.textDefaultSemiBold, { marginTop: 25, fontSize: 20, marginBottom: 10, }]}>
                            Option to delete data</Text>

                        <Text style={[styles.title, styles.textDefault, { marginTop: 15, fontSize: 14, marginBottom: 30, }]}>
                            If you would like for us to permanently delete all data that we have collected through Time Out,
                            please send an email to exe@nofuss.xyz using the email address you have on file with Time Out stating your request.
                        </Text>

                        {/*<TouchableOpacity
                            style={[styles.signInBoxStyle, { marginTop: 15, }]}
                            onPress={areYouSure}>
                            <Text style={styles.signInTextStyle}>DELETE ACCOUNT</Text>
                        </TouchableOpacity>*/}

                    </ScrollView>
                </View>
            </>

        </HideKeyboard>

    )
}

const styles = StyleSheet.create({
    textDefaultBold: {
        fontFamily: 'Inter-Bold',
    },
    textDefaultSemiBold: {
        fontFamily: 'Inter-SemiBold',
    },
    textDefault: {
        fontFamily: 'Inter-Regular',
    },
    title: {
        color: '#67806D',
        fontSize: 24,
        marginBottom: 10,
    },
    inputStyle: {
        backgroundColor: 'white',
        borderRadius: 15,
        paddingHorizontal: 10,
        marginTop: 5,
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

    }, viewContainer: {
        flex: 1,
        marginTop: 100,
    }, backButton: {
        position: 'absolute',
        width: 50, height: 50,
        marginTop: 50,
        marginLeft: 5,
    },
})

export default EditProfileScreen;