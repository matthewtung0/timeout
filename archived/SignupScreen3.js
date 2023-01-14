import React, { useCallback, useRef, useState, useContext } from 'react';
import {
    View, StyleSheet, TouchableOpacity, Dimensions, Animated,
    Image, TextInput, Keyboard, TouchableWithoutFeedback
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';
import { Input, Button, Text } from 'react-native-elements';
import { Context as AuthContext } from '../src/context/AuthContext';
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

const SignupScreen3 = ({ navigation, route: { params } }) => {
    const { height, width } = Dimensions.get('window');
    const { email, firstName, lastName, bio } = params;

    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const [username, setUsername] = useState('');
    const [passwordMismatch, setPasswordMismatch] = useState(false)

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
                            <Text style={[styles.textDefaultBold, { color: '#67806D' }]}>Just a few more steps!</Text>
                            <Text style={[styles.textDefaultBold, { color: '#67806D' }]}>You're almost there, I promise.</Text>
                        </View>

                    </View>
                </View>
                <View style={{ flex: 1.5 }}>
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
                            onPress={() => { navigation.navigate('SignUp2', { email, firstName, lastName, bio }) }}>
                            <Text style={[styles.textDefault, {
                                color: '#F6F2DF',
                                alignSelf: 'center',
                                marginTop: 10,
                                fontSize: 16,
                            }]}>Go Back</Text>
                        </TouchableOpacity>

                    </View>
                </View>




            </View>
        </HideKeyboard>
    )

}

SignupScreen3.navigationOptions = () => {
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
    signUpBoxStyle: {
        backgroundColor: '#FCC859',
        width: 150,
        height: 40,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginTop: 5,
    },
    signUpTextStyle: {
        color: '#F6F2DF',
        fontSize: 18,
        fontWeight: 'bold'

    },
    inner: {
        backgroundColor: '#67806D',
        flex: 1,
        paddingVertical: 20,
    },
    img: {
        marginTop: 50,
    }
})

export default SignupScreen3;
