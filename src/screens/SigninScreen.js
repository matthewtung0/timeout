import React, { useContext, useState } from 'react';
import {
    View, StyleSheet, TouchableOpacity, ImageBackground, Dimensions, Image,
    Keyboard, TouchableWithoutFeedback
} from 'react-native';
import { Input, Button, Text } from 'react-native-elements';
import { Context as AuthContext } from '../context/AuthContext';

import { Context as CategoryContext } from '../context/CategoryContext'
import { Context as UserContext } from '../context/userContext'

const img_src = require('../../assets/signin_background.png');

const HideKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>
);

const SigninScreen = ({ navigation }) => {
    const { height, width } = Dimensions.get('window');
    const { state, signin, signout, tryLocalSignin, clearErrorMessage } = useContext(AuthContext);

    const { fetchUserCategories, fetchUserTodoItems } = useContext(CategoryContext)
    const { fetchOutgoingRequests, fetchIncomingRequests, fetchFriends, fetchSelf } = useContext(UserContext)

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const imgWidth = Image.resolveAssetSource(img_src).width
    const imgHeight = Image.resolveAssetSource(img_src).height
    const heightSet = width * (imgHeight / imgWidth)

    const signInCallback = async () => {
        console.log("SIGN IN CALLBACK??")
        await fetchSelf()
        console.log('fetched self');
        await fetchUserCategories();
        console.log('fetched categories');
        await fetchUserTodoItems();
        console.log('fetched todo items');
        await fetchFriends();
        console.log('fetched friends');
        await fetchOutgoingRequests();
        console.log('fetched outgoing friend requests');
        await fetchIncomingRequests();
        console.log('fetched incoming friend requests');

    }

    return (
        <HideKeyboard>
            <View style={{ flex: 1 }}>

                <View style={styles.inputContainer}>
                    <Input
                        style={[styles.inputStyle, { marginBottom: 10, }]}
                        inputContainerStyle={styles.inputStyleContainer}
                        autoCapitalize='none'
                        autoCorrect={false}
                        value={email}
                        placeholder="Email"
                        onChangeText={setEmail}
                    />

                    <Input

                        style={styles.inputStyle}
                        inputContainerStyle={styles.inputStyleContainer}
                        secureTextEntry={true}
                        placeholder="Password"
                        autoCapitalize='none'
                        autoCorrect={false}
                        value={password}
                        onChangeText={setPassword}
                    />
                    <TouchableOpacity onPress={() =>
                        navigation.navigate('ForgotPassword')
                    }
                    >
                        <Text style={styles.button}>Forgot your password?</Text>

                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.signInBoxStyle}
                        onPress={() => {
                            console.log("pressed sign in button")
                            signin(email, password, signInCallback)
                        }}>
                        <Text style={styles.signInTextStyle}>Sign In</Text>
                    </TouchableOpacity>
                    {state.errorMessage ? <Text style={styles.errorMessage}>{state.errorMessage}</Text> : null}

                    <TouchableOpacity
                        onPress={() => navigation.navigate('SignUp')}
                    >

                        <Text style={styles.redirectToSignInStyleWhite}>Don't have an account?
                            <Text style={styles.redirectToSignInStyleYellow}> Sign up here!</Text>
                        </Text>
                    </TouchableOpacity>
                </View>


                <View style={{ flex: 2 }}>

                    <Image
                        style={{ width: width, height: height / 2.5, }}
                        source={img_src}
                        resizeMode="stretch"
                    />
                </View>

                <View style={{
                    position: 'absolute', top: height * 3.7 / 5, left: 50, right: 125, bottom: height * 0.8 / 5,
                    borderWidth: 1, borderColor: 'gray',
                }}>
                    <Text>Message here</Text>
                </View>
            </View>
        </HideKeyboard>
    )
}

const styles = StyleSheet.create({
    container: {
    },
    image: {
    },
    title: {
        fontSize: 30,
        justifyContent: 'center',
        margin: 20,
    },
    inputStyle: {
        backgroundColor: 'white',
        borderRadius: 15,
        marginHorizontal: 25,
        paddingHorizontal: 17,
    },
    inputContainer: {
        backgroundColor: '#67806D',
        flex: 3,
        justifyContent: 'center',
    },
    errorMessage: {
        fontSize: 16,
        color: 'red',
        marginTop: 10,
        alignSelf: 'center'
    },
    button: {
        color: 'orange',
        alignSelf: 'center',
        marginBottom: 15,
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
        borderRadius: 10
    },
    signInTextStyle: {
        color: '#F6F2DF',
        fontSize: 18,
        fontWeight: 'bold'

    },
    redirectToSignInStyleWhite: {
        color: '#F6F2DF',
        alignSelf: 'center',
        marginTop: 10
    },
    redirectToSignInStyleYellow: {
        color: 'orange',
        alignSelf: 'center',
        marginTop: 10
    }

})

export default SigninScreen;
