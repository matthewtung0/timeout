import React, { useContext, useState, useRef, useCallback } from 'react';
import {
    View, StyleSheet, TouchableOpacity, Dimensions, ImageBackground,
    KeyboardAvoidingView, Image, ScrollView, Keyboard, TouchableWithoutFeedback, Animated
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { useFocusEffect } from '@react-navigation/native';
import { Input, Button, Text } from 'react-native-elements';
import { Context as AuthContext } from '../context/AuthContext';
import timeoutApi from '../api/timeout';
import { Easing } from 'react-native-reanimated';

const img_src = require('../../assets/signin_background.png');
const img = require('../../assets/signup_plant.png')
const cloud = require('../../assets/cloud.png');
const character = require('../../assets/character.png');
const speechBubbleMore = require('../../assets/speech_bubble_more.png');
const speechBubbleThin = require('../../assets/speech_bubble_thin.png');

const HideKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>
);
const SignupScreen = ({ navigation, route: { params } }) => {
    const { height, width } = Dimensions.get('window');
    const { state, signup, clearErrorMessage } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [isEmailTaken, setIsEmailTaken] = useState(0)
    var message0 = "Nice to meet you!\nI'm Poot!";
    var message1 = "I can't wait to get productive!\nI hope this app will help.";
    var message2 = "Just a few more steps!\nYou're almost there, I promise.";
    const [activeMenu, setActiveMenu] = useState(params.defaultMenuNum)
    const [activeDialogue, setActiveDialogue] = useState(params.defaultMenuNum == 2 ? message2 : message0)

    const [bio, setBio] = useState('')
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const [username, setUsername] = useState('');
    const [passwordMismatch, setPasswordMismatch] = useState(false)

    const checkEmailAndNext = async () => {
        try {
            const emailTaken = await timeoutApi.get('/email_exists', { params: { email } })
            setIsEmailTaken(emailTaken.data)
            if (emailTaken.data == 0) {
                //navigation.navigate('SignUp2', { email, firstName, lastName })
                setActiveDialogue(message1)
                setActiveMenu(1);
            } else {
                alert("Email is aleady taken. Please use another")
            }
        } catch (err) {
            console.log(err)
        }
    }

    const validateInputs = () => {
        if ((firstName == '') || (lastName == '') || (email == '')) {
            alert("Please fill in all fields")
            return false
        }
        return true
    }
    const checkValidations = async () => {
        if (password != passwordConfirm) {
            setPasswordMismatch(true)
            return;
        }
        navigation.navigate('OnboardCategory', { email, firstName, lastName, bio, password, username })
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


            <View style={{
                flex: 1,
            }}>
                <View style={{ flex: 0.8, backgroundColor: '#FCC759' }}>

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
                                width: '60%', height: '45%',
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
                            <Text style={[styles.textDefaultBold, { color: '#67806D' }]}>{activeDialogue}</Text>
                        </View>

                    </View>
                </View>
                <View style={{ flex: 1.5 }}>
                    {activeMenu == 0 ?
                        <View style={styles.inner}>
                            <Input
                                style={[styles.inputStyle, styles.textDefault, { fontSize: 16, }]}
                                inputContainerStyle={styles.inputStyleContainer}
                                placeholder='First Name'
                                autoCorrect={false}
                                value={firstName}
                                onChangeText={setFirstName}
                            />
                            <Input
                                style={[styles.inputStyle, styles.textDefault, { fontSize: 16, }]}
                                inputContainerStyle={styles.inputStyleContainer}
                                placeholder='Last Name'
                                autoCorrect={false}
                                value={lastName}
                                onChangeText={setLastName}
                            />

                            <Input
                                style={[styles.inputStyle, styles.textDefault, { fontSize: 16, }]}
                                inputContainerStyle={styles.inputStyleContainer}
                                placeholder='Email'
                                autoCapitalize='none'
                                autoCorrect={false}
                                value={email}
                                onChangeText={(value) => {
                                    setEmail(value)
                                    setIsEmailTaken(0)
                                }}
                                errorStyle={[styles.textDefault, { marginHorizontal: 30, fontSize: 14, color: '#F5BBAE' }]}
                                errorMessage={isEmailTaken == 0 ?
                                    null :
                                    'Email taken! Please choose another.'}
                            />

                            <TouchableOpacity
                                style={styles.signUpBoxStyle}
                                onPress={() => {
                                    if (validateInputs()) {
                                        checkEmailAndNext()
                                    }
                                }}>
                                <Text style={styles.signUpTextStyle}>Next</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() =>
                                navigation.navigate('SignIn')
                            }
                            >
                                <Text style={styles.redirectToSignInStyleWhite}>Already have an account?
                                    <Text style={styles.redirectToSignInStyleYellow}> Sign in here!</Text>
                                </Text>

                            </TouchableOpacity>

                            {/*{state.errorMessage ? <Text style={styles.errorMessage}>{state.errorMessage}</Text> : null}*/}
                            {/*</ImageBackground>*/}

                        </View>
                        : null}
                    {activeMenu == 1 ?
                        <View style={styles.inner}>


                            <Input
                                style={[styles.inputStyleBio, styles.textDefault, { fontSize: 16, }]}
                                multiline={true}
                                numberOfLines={4}
                                maxHeight={120}
                                editable
                                maxLength={150}
                                //containerStyle={styles.nameInputStyleContainer}
                                inputContainerStyle={styles.inputStyleContainer}
                                placeholder='Write a quick bio (visible to everyone). This part is optional.'
                                autoCorrect={false}
                                value={bio}
                                onChangeText={setBio}
                            />

                            <TouchableOpacity
                                style={styles.signUpBoxStyle}
                                onPress={() => {
                                    setActiveDialogue(message2)
                                    setActiveMenu(2)
                                }}>
                                <Text style={[styles.signUpTextStyle, styles.textDefaultBold,]}>Next</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{
                                    alignSelf: 'center',
                                }}
                                onPress={() => {
                                    setActiveDialogue(message0)
                                    setActiveMenu(0)
                                }}>
                                <Text style={[styles.textDefault, {
                                    color: '#F6F2DF',
                                    alignSelf: 'center',
                                    marginTop: 10,
                                    fontSize: 16,
                                }]}>Go Back</Text>
                            </TouchableOpacity>

                        </View>
                        : null}
                    {activeMenu == 2 ?
                        <View style={styles.inner}>

                            <Input
                                style={[styles.inputStyle, styles.textDefault, { fontSize: 16, }]}
                                inputContainerStyle={styles.inputStyleContainer}
                                secureTextEntry={false}
                                placeholder="Username"
                                autoCapitalize='none'
                                autoCorrect={false}
                                value={username}
                                onChangeText={setUsername}
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

                            <Input
                                style={[styles.inputStyle, styles.textDefault, { fontSize: 16, }]}
                                inputContainerStyle={styles.inputStyleContainer}
                                secureTextEntry={true}
                                placeholder="Confirm Password"
                                autoCapitalize='none'
                                autoCorrect={false}
                                value={passwordConfirm}
                                onChangeText={(value) => {
                                    setPasswordConfirm(value)
                                    setPasswordMismatch(false)
                                }}
                                errorStyle={[styles.textDefault, { marginHorizontal: 30, fontSize: 16, color: '#F5BBAE' }]}
                                errorMessage={passwordMismatch ? "Passwords don't match!" : null}
                            />

                            <TouchableOpacity
                                style={[styles.textDefaultBold, styles.signUpBoxStyle]}
                                onPress={() => {
                                    checkValidations()
                                }}>
                                <Text style={styles.signUpTextStyle}>Next</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{
                                    alignSelf: 'center',
                                }}
                                onPress={() => {
                                    setActiveDialogue(1)
                                    setActiveMenu(1)
                                }}>
                                <Text style={[styles.textDefault, {
                                    color: '#F6F2DF',
                                    alignSelf: 'center',
                                    marginTop: 10,
                                    fontSize: 16,
                                }]}>Go Back</Text>
                            </TouchableOpacity>

                        </View>
                        : null}



                </View>


            </View>
        </HideKeyboard>
    )

}

SignupScreen.navigationOptions = () => {
    return {
        headerShown: false,
    };
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
        backgroundColor: '#FCC859'
    },
    inner: {
        backgroundColor: '#67806D',
        flex: 1,
        paddingVertical: 20,
    },
    errorMessage: {
        fontSize: 16,
        color: 'red',
        marginTop: 5,
        alignSelf: 'center'
    },
    title: {
        fontSize: 30,
        justifyContent: 'center',
        margin: 20,
    },
    button: {
        color: 'orange',
        marginHorizontal: 30,
    },
    inputStyle: {
        backgroundColor: 'white',
        borderRadius: 15,
        marginHorizontal: 25,
        paddingHorizontal: 17,
    },
    inputStyleBio: {
        backgroundColor: 'white',
        borderRadius: 15,
        marginHorizontal: 25,
        paddingHorizontal: 17,
        marginBottom: 20,
        height: 110,
    },
    inputContainer: {
        flex: 1,
        flexDirection: 'column',
    },
    inputStyleContainer: {
        borderBottomWidth: 0,
    },
    nameContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    nameInputStyleContainer: {
        width: 230,
    },
    signUpBoxStyle: {
        backgroundColor: '#FCC859',
        width: 150,
        height: 40,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10
    },
    signUpTextStyle: {
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
    },
    img: {
        marginTop: 50,
    }

})

export default SignupScreen;
