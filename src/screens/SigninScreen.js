import React, { useContext, useState, useRef, useCallback } from 'react';
import {
    View, StyleSheet, TouchableOpacity, ImageBackground, Dimensions, Image,
    Keyboard, TouchableWithoutFeedback, Animated, ActivityIndicator,
} from 'react-native';
import { Input, Text } from 'react-native-elements';
import { useFocusEffect } from '@react-navigation/native';
import { Context as AuthContext } from '../context/AuthContext';

import { Context as CategoryContext } from '../context/CategoryContext'
import { Context as UserContext } from '../context/userContext'
import { Easing } from 'react-native-reanimated';

const img_src = require('../../assets/signin_background.png');
const cloud = require('../../assets/cloud.png');
const character = require('../../assets/character.png');
const speechBubbleMore = require('../../assets/speech_bubble_more.png');
const speechBubbleThin = require('../../assets/speech_bubble_thin.png');


const HideKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>
);

const SigninScreen = ({ navigation }) => {
    const { height, width } = Dimensions.get('window');
    const { state, signin, signout, tryLocalSignin, clearErrorMessage } = useContext(AuthContext);

    const { fetchUserCategories, fetchUserTodoItems } = useContext(CategoryContext)
    const { state: userState, fetchOutgoingRequests, fetchIncomingRequests, fetchAvatarGeneral,
        fetchFriends, fetchSelf } = useContext(UserContext)

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    const imgWidth = Image.resolveAssetSource(img_src).width
    const imgHeight = Image.resolveAssetSource(img_src).height
    const heightSet = width * (imgHeight / imgWidth)

    const signInCallbackFail = async () => {
        setPassword('')
        setIsLoading(false)
    }

    const signInCallback = async () => {
        console.log("SIGN IN CALLBACK??")
        await fetchSelf().then(
            (res) => {
                console.log('fetched self');
                fetchAvatarGeneral(res, forceRetrieve = true, isSelf = true)
                fetchUserCategories(res, getPrivate = true, isSelf = true);
            }
        )

        //await fetchUserCategories();
        console.log('fetched categories');
        await fetchUserTodoItems();
        console.log('fetched todo items');
        await fetchFriends();
        console.log('fetched friends');
        await fetchOutgoingRequests();
        console.log('fetched outgoing friend requests');
        await fetchIncomingRequests();
        console.log('fetched incoming friend requests');
        setIsLoading(false)
    }

    const anim = useRef(new Animated.Value(0)).current;
    const textBoxFactor = useRef(new Animated.Value(1)).current;

    const cloudAnim = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(anim, {
                    toValue: -width * 1,
                    duration: 8000,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
            ])).start();
    }

    const textBoxAnim = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(textBoxFactor, {
                    toValue: 1.05,
                    duration: 2000,
                    //easing: Easing.linear,
                    useNativeDriver: true,
                }),
                Animated.timing(textBoxFactor, {
                    toValue: 1,
                    duration: 2000,
                    //easing: Easing.linear,
                    useNativeDriver: true,
                }),
            ])).start();
    }

    /*const xVal = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 3],
    });*/

    useFocusEffect(
        useCallback(() => {
            cloudAnim()
            textBoxAnim()
            return () => {
            }
        }, [])
    )

    return (
        <HideKeyboard>
            <View style={{ flex: 1 }}>

                <View style={{ flex: 1, backgroundColor: '#FCC759' }}>

                    <View style={{
                        position: 'absolute', height: '100%', width: '100%',
                        justifyContent: 'flex-end',
                        //transform: [{ translateX: anim, }]
                    }}>
                        <Animated.View style={{
                            flexDirection: 'row', height: '40%',
                            transform: [{ translateX: anim, }]
                        }}>
                            <Image
                                style={{ width: width, height: '100%', }}
                                source={cloud}
                                resizeMode="contain"
                            />
                            <Image
                                style={{ width: width, height: '100%', }}
                                source={cloud}
                                resizeMode="contain"
                            />
                            <Image
                                style={{ width: width, height: '100%', }}
                                source={cloud}
                                resizeMode="contain"
                            />
                        </Animated.View>
                    </View>

                    <View style={{
                        position: 'absolute', height: '100%', width: '100%',
                        justifyContent: 'flex-end', alignItems: 'flex-end', marginTop: 15, paddingRight: 20,
                    }}>
                        <Animated.Image
                            style={{
                                width: width / 4, height: height / 6,
                                transform: [
                                    {
                                        scale: textBoxFactor
                                    }
                                ]
                            }}
                            source={character}
                            resizeMode="contain"
                        />
                    </View>
                    <View style={{
                        position: 'absolute', height: '100%', width: '100%',
                        justifyContent: 'center', alignItems: 'center',
                    }}>
                        <Animated.Image
                            style={{
                                width: width * 0.6, height: height * (1 / 2.5) * 0.45,
                                transform: [
                                    {
                                        scale: textBoxFactor
                                    }
                                ]
                            }}
                            source={speechBubbleThin}
                            resizeMode="stretch"

                        />
                    </View>
                    <View style={{
                        position: 'absolute', height: '100%', width: '100%',
                        justifyContent: 'center', alignItems: 'center',
                    }}>
                        <View style={{ width: '60%', height: '45%', padding: 10, }}>
                            <Text style={[styles.textDefaultBold, { color: '#67806D' }]}>Good morning!</Text>
                            <Text style={[styles.textDefaultBold, { color: '#67806D' }]}>I hope we all make the most out of our time!</Text>
                        </View>


                    </View>
                </View>

                <View style={[styles.inputContainer, { flex: 1.5 }]}>
                    <View style={{ marginTop: 35, }} />
                    <Input
                        style={[styles.inputStyle, styles.textDefault, { marginBottom: 10, fontSize: 16, }]}
                        inputContainerStyle={styles.inputStyleContainer}
                        autoCapitalize='none'
                        autoCorrect={false}
                        value={email}
                        placeholder="Email"
                        onChangeText={setEmail}
                    />

                    <Input
                        style={[styles.inputStyle, styles.textDefault, { fontSize: 16, }]}
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
                        <Text style={[styles.button, styles.textDefault, { fontSize: 16, }]}>Forgot your password?</Text>

                    </TouchableOpacity>

                    <TouchableOpacity
                        style={isLoading ? [styles.signInBoxStyle, { backgroundColor: '#FFDA95' }] : [styles.signInBoxStyle]}
                        onPress={() => {
                            if (!isLoading) {
                                setIsLoading(true)
                                console.log("pressed sign in button")
                                signin(email, password, signInCallback, signInCallbackFail)
                            }
                        }}>
                        {isLoading ?
                            <Text style={[styles.signInTextStyle, styles.textDefaultBold,]}>Signing in ...</Text>
                            :
                            <Text style={[styles.signInTextStyle, styles.textDefaultBold,]}>Sign In</Text>
                        }
                    </TouchableOpacity>

                    {state.errorMessage ? <Text style={[styles.errorMessage, styles.textDefault,]}>{state.errorMessage}</Text> : null}

                    <TouchableOpacity
                        style={{ marginTop: 10, }}
                        onPress={() => navigation.navigate('SignUp', { defaultMenuNum: 0 })}
                    >

                        <Text style={[styles.redirectToSignInStyleWhite, styles.textDefault,]}>Don't have an account?
                            <Text style={[styles.redirectToSignInStyleYellow, styles.textDefault]}> Sign up here!</Text>
                        </Text>
                    </TouchableOpacity>
                    {isLoading ? <ActivityIndicator style={{ marginTop: 10 }} size="large" color="white"></ActivityIndicator>
                        : null}
                </View>
                <View>

                </View>

            </View>
        </HideKeyboard>
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
