import React, { useState, useRef, useCallback } from 'react';
import {
    View, StyleSheet, TouchableOpacity, Dimensions,
    Image, Keyboard, TouchableWithoutFeedback, Animated, TextInput
} from 'react-native';
import { Icon } from 'react-native-elements'
import { useFocusEffect } from '@react-navigation/native';
import { Text } from 'react-native-elements';
import timeoutApi from '../api/timeout';
import tinycolor from 'tinycolor2';
import { Easing } from 'react-native-reanimated';
import { normalize } from '../components/FormatUtils';

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
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [isEmailTaken, setIsEmailTaken] = useState(0)
    var message0 = "Nice to meet you!\nI'm Poot!";
    var message1 = "I can't wait to get productive!\nWe hope this app will help.";
    var message2 = "Choose a username below.\nThis is what your friends will see on your profile.";
    const [activeMenu, setActiveMenu] = useState(params.defaultMenuNum)
    const [activeDialogue, setActiveDialogue] = useState(params.defaultMenuNum == 2 ? message2 : message0)

    const [bio, setBio] = useState('')
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const [username, setUsername] = useState('');
    const [passwordMismatch, setPasswordMismatch] = useState(false)

    const [passwordVisible, setPasswordVisible] = useState(false)
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false)

    const togglePasswordVisible = () => {
        setPasswordVisible(!passwordVisible)
    }

    const toggleConfirmPasswordVisible = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible)
    }

    const checkEmailAndNext = async () => {
        try {
            var lowerCaseEmail = email.toLowerCase();
            const emailTaken = await timeoutApi.get('/email_exists', { params: { lowerCaseEmail } })
            setIsEmailTaken(emailTaken.data)
            if (emailTaken.data == 0) {
                //navigation.navigate('SignUp2', { email, firstName, lastName })
                setActiveDialogue(message1)
                setActiveMenu(1);
            } else {
                alert("Email is aleady taken. Please use another")
            }
        } catch (err) {
            alert("Something went wrong. Please check your internet connection.")
            console.log(err)
        }
    }

    const validateInputs = () => {
        if ((firstName == '') || (lastName == '') || (email == '')) {
            alert("Please fill in all fields")
            return false
        }
        // simple email check: anystring@anystring.any
        var re = /\S+@\S+\.\S+/;
        var res = re.test(email)
        if (!res) {
            alert("Email not in a proper format")
            return false
        }
        return true;
    }

    const checkValidations = async () => {

        if (password == '' || passwordConfirm == '' || username == '') {
            alert("Please fill in all fields")
            return;
        }
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

    const setBioFunc = (txt) => {
        var num_lines = txt.split(/\r\n|\r|\n/).length
        if (num_lines <= 6) {
            setBio(txt)
        }
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
                <View style={{ flex: 0.6, backgroundColor: '#FCC759' }}>

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
                        <View style={{ width: '60%', height: '45%', paddingHorizontal: 10, paddingVertical: 5, }}>
                            <Text style={[styles.textDefaultSemiBold, {
                                color: '#67806D',
                                fontSize: normalize(13)
                            }]}>{activeDialogue}</Text>
                        </View>

                    </View>
                </View>
                <View style={{ flex: 1.5 }}>
                    {activeMenu == 0 ?
                        <View style={styles.inner}>
                            <Text style={[styles.textDefault, {
                                marginHorizontal: 40, color: 'white', marginBottom: 5,
                                fontSize: 14
                            }]}>
                                First Name</Text>
                            <TextInput
                                style={[styles.inputStyle, styles.textDefault, {
                                    fontSize: 18, color: '#67806D', marginHorizontal: 35, paddingVertical: 7,
                                }]}
                                inputContainerStyle={styles.inputStyleContainer}
                                placeholder='First Name'
                                placeholderTextColor='grey'
                                maxLength={30}
                                autoCorrect={'name'}
                                value={firstName}
                                onChangeText={setFirstName}
                            />
                            <Text style={[styles.textDefault, {
                                marginHorizontal: 40, color: 'white', marginBottom: 5,
                                marginTop: 10,
                                fontSize: 14
                            }]}>
                                Last Name</Text>
                            <TextInput
                                style={[styles.inputStyle, styles.textDefault, {
                                    fontSize: 18, color: '#67806D',
                                    marginHorizontal: 35, paddingVertical: 7,
                                }]}
                                inputContainerStyle={styles.inputStyleContainer}
                                placeholder='Last Name'
                                placeholderTextColor='grey'
                                maxLength={30}
                                autoCorrect={'family-name'}
                                value={lastName}
                                onChangeText={setLastName}
                            />
                            <Text style={[styles.textDefault, {
                                marginHorizontal: 40, color: 'white', marginBottom: 5,
                                marginTop: 10,
                                fontSize: 14
                            }]}>
                                Email Address</Text>
                            <TextInput
                                style={[styles.inputStyle, styles.textDefault, {
                                    fontSize: 18, marginBottom: 25,
                                    color: '#67806D', marginHorizontal: 35, paddingVertical: 7,
                                }]}
                                inputContainerStyle={styles.inputStyleContainer}
                                placeholder='Email'
                                placeholderTextColor='grey'
                                autoCapitalize='none'
                                autoCorrect={'email'}
                                maxLength={50}
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
                                style={[styles.signUpBoxStyle,
                                {
                                    shadowColor: tinycolor('#FCC859').darken(25).toString(),
                                    marginTop: 18
                                }]}
                                onPress={() => {
                                    if (validateInputs()) {
                                        checkEmailAndNext()
                                    }
                                }}>
                                <Text style={[styles.signUpTextStyle, { fontSize: 18 }]}>Next</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{ marginTop: 24, }}
                                onPress={() =>
                                    navigation.navigate('SignIn')
                                }
                            >
                                <Text style={[styles.redirectToSignInStyleWhite, styles.textDefault, { fontSize: 16, }]}>Already have an account?
                                    <Text style={[styles.redirectToSignInStyleYellow, styles.textDefault, { fontSize: 16, }]}> Sign in here!</Text>
                                </Text>

                            </TouchableOpacity>

                            {/*{state.errorMessage ? <Text style={styles.errorMessage}>{state.errorMessage}</Text> : null}*/}
                            {/*</ImageBackground>*/}

                        </View>
                        : null}
                    {activeMenu == 1 ?
                        <View style={styles.inner}>

                            <TextInput
                                style={[styles.inputStyleBio, styles.textDefault, {
                                    fontSize: 18,
                                    paddingHorizontal: 14,
                                    paddingTop: 12,
                                    color: '#67806D',
                                    height: height * 0.2,
                                }]}
                                multiline={true}
                                numberOfLines={6}
                                editable
                                maxLength={150}
                                //containerStyle={styles.nameInputStyleContainer}
                                inputContainerStyle={styles.inputStyleContainer}
                                textAlignVertical={"top"}
                                textAlign={"left"}
                                placeholder='Write a quick bio (visible to everyone). This part is optional.'
                                placeholderTextColor={'gray'}
                                autoCorrect={false}
                                value={bio}
                                onChangeText={(bioText) => {
                                    setBioFunc(bioText)
                                }}
                            />

                            <TouchableOpacity
                                style={[styles.signUpBoxStyle, {
                                    shadowColor: tinycolor('#FCC859').darken(25).toString(),
                                    marginTop: height * 0.04, marginBottom: height * 0.04,
                                }]}
                                onPress={() => {
                                    setActiveDialogue(message2)
                                    setActiveMenu(2)
                                }}>
                                <Text style={[styles.signUpTextStyle, styles.textDefaultBold, { fontSize: 18, }]}>Next</Text>
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
                                    marginTop: 24,
                                    fontSize: 14,
                                }]}>Go Back</Text>
                            </TouchableOpacity>

                        </View>
                        : null}
                    {activeMenu == 2 ?
                        <View style={styles.inner}>
                            <Text style={[styles.textDefault, {
                                marginHorizontal: 40, color: 'white', marginBottom: 7,
                                fontSize: 14
                            }]}>
                                Username</Text>
                            <TextInput
                                style={[styles.inputStyle, styles.textDefault, {
                                    color: '#67806D',
                                    marginHorizontal: 35, paddingVertical: 7,
                                    fontSize: 18,
                                }]}
                                inputContainerStyle={styles.inputStyleContainer}
                                secureTextEntry={false}
                                placeholder="Username"
                                placeholderTextColor='gray'
                                autoCapitalize='none'
                                autoCorrect={false}
                                value={username}
                                onChangeText={setUsername}
                            />
                            <Text style={[styles.textDefault, {
                                marginHorizontal: 40, color: 'white',
                                marginBottom: 7,
                                fontSize: 14, marginTop: 10,
                            }]}>
                                Password</Text>
                            <View style={{ flexDirection: 'row', marginHorizontal: 35, }}>
                                <TextInput
                                    style={[styles.inputStyle, styles.textDefault, {
                                        color: '#67806D',
                                        marginHorizontal: 0, flex: 5, paddingVertical: 7,
                                        fontSize: 18,
                                    }]}
                                    inputContainerStyle={styles.inputStyleContainer}
                                    secureTextEntry={!passwordVisible}
                                    placeholder="Password"
                                    placeholderTextColor='gray'
                                    autoCapitalize='none'
                                    autoCorrect={false}
                                    value={password}
                                    onChangeText={setPassword}
                                />
                                <View style={{ flex: 1, justifyContent: 'center', }}>
                                    <TouchableOpacity onPress={togglePasswordVisible}>
                                        <Icon
                                            name={passwordVisible ? "eye-outline" : "eye-off-outline"}
                                            type='ionicon'
                                            size={24}
                                            color='white' />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <Text style={[styles.textDefaultMed, {
                                marginHorizontal: 40, color: 'white', marginBottom: 7,
                                fontSize: 14,
                                marginTop: 10,
                            }]}>
                                Confirm Password</Text>
                            <View style={{ flexDirection: 'row', marginHorizontal: 35, }}>

                                <TextInput
                                    style={[styles.inputStyle, styles.textDefault, {
                                        marginHorizontal: 0,
                                        color: '#67806D', flex: 5, paddingVertical: 7,
                                        fontSize: 18,
                                    }]}
                                    inputContainerStyle={styles.inputStyleContainer}
                                    secureTextEntry={!confirmPasswordVisible}
                                    placeholder="Confirm Password"
                                    placeholderTextColor='gray'
                                    autoCapitalize='none'
                                    autoCorrect={false}
                                    value={passwordConfirm}
                                    onChangeText={(value) => {
                                        setPasswordConfirm(value)
                                        setPasswordMismatch(false)
                                    }}
                                    errorStyle={[styles.textDefault, { marginHorizontal: 30, fontSize: 14, color: '#F5BBAE' }]}
                                    errorMessage={passwordMismatch ? "Passwords don't match!" : null}
                                />
                                <View style={{ flex: 1, justifyContent: 'center', }}>
                                    <TouchableOpacity onPress={toggleConfirmPasswordVisible}>
                                        <Icon
                                            name={confirmPasswordVisible ? "eye-outline" : "eye-off-outline"}
                                            type='ionicon'
                                            size={24}
                                            color='white' />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <TouchableOpacity
                                style={[styles.textDefaultBold, styles.signUpBoxStyle,
                                {
                                    shadowColor: tinycolor('#FCC859').darken(25).toString(),
                                    marginTop: 34
                                }]}
                                onPress={() => {
                                    checkValidations()
                                }}>
                                <Text style={[styles.signUpTextStyle, { fontSize: 18 }]}>Next</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{
                                    alignSelf: 'center', marginTop: 15,
                                }}
                                onPress={() => {
                                    setActiveDialogue(1)
                                    setActiveMenu(1)
                                }}>
                                <Text style={[styles.textDefault, {
                                    color: '#F6F2DF',
                                    alignSelf: 'center',
                                    marginTop: 30,
                                    fontSize: 15,
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
    }, textDefaultMed: {
        fontFamily: 'Inter-Medium',
    },
    textDefaultSemiBold: {
        fontFamily: 'Inter-SemiBold',
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
        paddingHorizontal: 40,
        paddingVertical: 15,
        backgroundColor: '#FCC859',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 1,
        shadowRadius: 0,
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
