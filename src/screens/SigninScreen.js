import React, { useContext, useState, useRef, useCallback } from 'react';
import {
    View, StyleSheet, TouchableOpacity, Dimensions, Image,
    Keyboard, TouchableWithoutFeedback, Animated, ActivityIndicator, TextInput
} from 'react-native';
import { Icon } from 'react-native-elements'
import { Text } from 'react-native-elements';
import { useFocusEffect } from '@react-navigation/native';
import { Context as AuthContext } from '../context/AuthContext';
import tinycolor from 'tinycolor2';
import { Context as CategoryContext } from '../context/CategoryContext'
import { Context as SessionContext } from '../context/SessionContext'
import { Context as CounterContext } from '../context/CounterContext'
import { Context as ReactionContext } from '../context/ReactionContext'
import { Context as UserContext } from '../context/userContext'
import { Easing } from 'react-native-reanimated';
import {
    subMonths, startOfMonth, endOfMonth
} from 'date-fns';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';


const img_src = require('../../assets/signin_background.png');
const cloud = require('../../assets/cloud.png');
const character = require('../../assets/character.png');
const speechBubbleThin = require('../../assets/speech_bubble_thin.png');


const HideKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>
);

const SigninScreen = ({ navigation }) => {
    const { height, width } = Dimensions.get('window');
    const { state, signin, clearErrorMessage } = useContext(AuthContext);
    const { fetchUserReactions } = useContext(ReactionContext)
    const { fetchUserCategories, fetchUserTodoItems } = useContext(CategoryContext)
    const { fetchOutgoingRequests, fetchIncomingRequests, fetchAvatarGeneral, fetchAvatarItemsOwned,
        fetchFriends, fetchSelf, postNotificationToken } = useContext(UserContext)
    const { fetchMultipleMonths, setOffsetFetched } = useContext(SessionContext)
    const { fetchUserCounters } = useContext(CounterContext)

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [showError, setShowError] = useState(false)

    const imgWidth = Image.resolveAssetSource(img_src).width
    const imgHeight = Image.resolveAssetSource(img_src).height
    const heightSet = width * (imgHeight / imgWidth)
    const [passwordVisible, setPasswordVisible] = useState(false)

    const signInCallbackFail = async () => {
        setPassword('')
        setIsLoading(false)
        setShowError(true)
    }

    const togglePasswordVisible = () => {
        setPasswordVisible(!passwordVisible)
    }


    async function registerForPushNotificationsAsync(userId, postNotificationToken) {
        let token;

        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                alert('Failed to get push token for push notification!');
                return;
            }
            if (Platform.OS === 'android') {
                const token_FCM = (await Notifications.getDevicePushTokenAsync());
                token = await Notifications.getExpoPushTokenAsync({
                    applicationId: '1:581261737423:android:d2b8f65c0ffd4a2221e6ba',
                    experienceId: '@mtung0219/timeout',
                })
                console.log(`ANDROID TOKEN IS ${JSON.stringify(token_FCM)}`)
                //eYByL5AtSWyHwLgErS1EuS:APA91bExyOYgvYyqkkNVfq8eI6rjJCLiaEVhquEuqbeoMb7VYaqVgMO6USvWaIBnAS9MJ2IHmjcE2TX55SzHInO5yKW_lApk-NdzUeEMdu6cgc5ZUW04kirDrgP0ZPJoVhjCqvGt6kXS
            } else {
                const token_APN = (await Notifications.getDevicePushTokenAsync());
                token = await Notifications.getExpoPushTokenAsync({
                    experienceId: '@mtung0219/timeout',
                })
                console.log(`APPLE TOKEN IS ${JSON.stringify(token_APN)}`)
            }


        } else {
            alert('Must use physical device for Push Notifications');
        }



        var toPost = JSON.stringify({
            userId,
            token,
        })

        postNotificationToken(toPost)
        console.log(`Posted token: ${token}`);
        return token;
    }

    const signInCallback = async () => {
        var tempDt = new Date()
        var endTime = endOfMonth(tempDt)
        var startTime = startOfMonth(subMonths(startOfMonth(tempDt), 3))
        await fetchSelf().then(
            (res) => {
                console.log('fetched self');
                fetchAvatarGeneral(res.user_id, true, true, false)
                fetchUserCategories(res.user_id, true, true);

                registerForPushNotificationsAsync(res.user_id, postNotificationToken)
            }
        )
        await fetchMultipleMonths(startTime, endTime).then(
            await setOffsetFetched(3)
        )
        await fetchUserCounters()
        await fetchUserReactions();
        await fetchAvatarItemsOwned();
        await fetchUserTodoItems(isSelf = true);
        await fetchFriends();
        await fetchOutgoingRequests();
        await fetchIncomingRequests();
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
                            flexDirection: 'row', height: '30%',
                            transform: [{ translateX: anim, }]
                        }}>
                            <Image
                                style={{ width: width, height: '130%', }}
                                source={cloud}
                                resizeMode="contain"
                            />
                            <Image
                                style={{ width: width, height: '130%', }}
                                source={cloud}
                                resizeMode="contain"
                            />
                            <Image
                                style={{ width: width, height: '130%', }}
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
                    <View style={{ marginTop: 10, }} />
                    <Text style={[styles.textDefaultMed, { marginHorizontal: 40, color: 'white', marginBottom: 3, }]}>
                        Email</Text>

                    <View style={{ flexDirection: 'row', marginHorizontal: 35, }}>

                        <TextInput
                            style={[styles.inputStyle, styles.textDefault, {
                                marginBottom: 10, fontSize: 16, marginHorizontal: 0, flex: 5,
                                paddingVertical: 7,
                                color: '#67806D'
                            }]}
                            inputContainerStyle={styles.inputStyleContainer}
                            autoComplete='email'
                            autoCorrect={false}
                            value={email}
                            placeholderTextColor="grey"
                            placeholder="Email"
                            onChangeText={setEmail}
                        />
                        {/*<View style={{ flex: 1, }} />*/}
                    </View>

                    <Text style={[styles.textDefaultMed, { marginHorizontal: 40, color: 'white', marginBottom: 3, }]}>
                        Password</Text>
                    <View style={{ flexDirection: 'row', marginHorizontal: 35, }}>
                        <TextInput
                            style={[styles.inputStyle, styles.textDefault, {
                                fontSize: 16, flex: 7, marginHorizontal: 0,
                                paddingVertical: 7,
                                color: '#67806D'
                            }]}
                            inputContainerStyle={styles.inputStyleContainer}
                            secureTextEntry={!passwordVisible}
                            placeholder="Password"
                            autoCapitalize='none'
                            placeholderTextColor="grey"
                            autoCorrect={false}
                            value={password}
                            onChangeText={setPassword}
                        />
                        <View style={{ flex: 1, }}>
                            <TouchableOpacity
                                style={{ marginLeft: 3, }}
                                onPress={togglePasswordVisible}>
                                <Icon
                                    name={passwordVisible ? "eye-outline" : "eye-off-outline"}
                                    type='ionicon'
                                    size={25}
                                    color='white' />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={isLoading ? [styles.signInBoxStyle,
                        { backgroundColor: '#FFDA95', shadowColor: tinycolor('#FFDA95').darken(25).toString() }] :
                            [styles.signInBoxStyle, { shadowColor: tinycolor('#FCC859').darken(25).toString() }]}
                        onPress={() => {
                            clearErrorMessage();
                            if (!isLoading) {
                                if (email == '' || password == '') {
                                    return;
                                }
                                setIsLoading(true)
                                var emailLowerCase = email.toLowerCase();

                                signin(emailLowerCase, password, signInCallback, signInCallbackFail)
                            }
                        }}>
                        {isLoading ?
                            <Text style={[styles.signInTextStyle, styles.textDefaultBold,]}>Signing in ...</Text>
                            :
                            <Text style={[styles.signInTextStyle, styles.textDefaultBold,]}>Sign In</Text>
                        }
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{}}
                        onPress={() => {
                            clearErrorMessage();
                            navigation.navigate('ForgotPassword')
                        }
                        }
                    >
                        <Text style={[styles.button, styles.textDefault, { fontSize: 15, }]}>Forgot your password?</Text>

                    </TouchableOpacity>

                    {state.errorMessage ? <Text style={[styles.errorMessage, styles.textDefault,]}>{state.errorMessage}</Text> : null}

                    <TouchableOpacity
                        style={{ marginTop: 10, }}
                        onPress={() => {
                            clearErrorMessage();
                            navigation.navigate('SignUp', { defaultMenuNum: 0 }
                            )
                        }}
                    >

                        <Text style={[styles.redirectToSignInStyleWhite, styles.textDefault, { fontSize: 17, }]}>Don't have an account?
                            <Text style={[styles.redirectToSignInStyleYellow, styles.textDefault, { fontSize: 17 }]}> Sign up here!</Text>
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
    }, textDefaultMed: {
        fontFamily: 'Inter-Medium',
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
        borderRadius: 10,
        marginBottom: 20,
        marginTop: 30,
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 1,
        shadowRadius: 0,
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
