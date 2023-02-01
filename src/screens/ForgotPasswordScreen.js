import React, { useContext, useState, useCallback, useRef } from 'react';
import {
    View, StyleSheet, TouchableOpacity, ActivityIndicator, Dimensions, Animated, TouchableWithoutFeedback,
    Image, Keyboard,
} from 'react-native';
import { Input, Text } from 'react-native-elements';
import { Easing } from 'react-native-reanimated';
import { useFocusEffect } from '@react-navigation/native';
import { Context as AuthContext } from '../context/AuthContext';

const cloud = require('../../assets/cloud.png');
const character = require('../../assets/character.png');
const speechBubbleThin = require('../../assets/speech_bubble_thin.png');

const HideKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>
);

const ForgotPasswordScreen = ({ navigation }) => {
    const { height, width } = Dimensions.get('window');
    const { state, forgot_password, clearErrorMessage } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const forgotPasswordCallback = () => {
        setIsLoading(false)
        alert("An email has been sent with a link to reset your password.")
        navigation.navigate('SignIn')
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
            <View style={{ flex: 1 }}>
                {/*<NavigationEvents
                onWillFocus={clearErrorMessage}
    />*/}
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
                            <Text style={[styles.textDefaultBold, { color: '#67806D' }]}>Enter your email to get a password reset link.</Text>
                        </View>


                    </View>
                </View>

                <View style={{ flex: 1.5, backgroundColor: '#67806D' }}>
                    <View style={{ marginTop: 35, }} />
                    <Input
                        style={[styles.inputStyle, styles.textDefault, { marginBottom: 10, }]}
                        inputContainerStyle={styles.inputStyleContainer}
                        placeholder='Email'
                        autoCapitalize='none'
                        autoCorrect={false}
                        value={email}
                        onChangeText={setEmail}
                    />
                    {state.errorMessage ? <Text style={[styles.errorMessage, styles.textDefault,]}>{state.errorMessage}</Text> : null}

                    <TouchableOpacity
                        style={isLoading ? [styles.signUpBoxStyle, { paddingHorizontal: 20, paddingVertical: 10, backgroundColor: '#FFDA95' }] : [styles.signUpBoxStyle, { paddingHorizontal: 20, paddingVertical: 10, }]}
                        onPress={() => {
                            if (isLoading) { return }
                            setIsLoading(true)
                            forgot_password(email, forgotPasswordCallback)
                        }}>
                        <Text style={[styles.signUpTextStyle, styles.textDefaultBold,]}>Send Reset Link</Text>
                    </TouchableOpacity>


                    <TouchableOpacity onPress={() =>
                        navigation.navigate('SignIn')
                    }
                    >
                        <Text style={[styles.button, styles.textDefault,]}>Go back to sign in page</Text>

                    </TouchableOpacity>

                    {isLoading ?
                        <ActivityIndicator style={{ marginTop: 20, }} size="large" color="white" />
                        : null}
                </View>
            </View>
        </HideKeyboard>
    )
}

ForgotPasswordScreen.navigationOptions = () => {
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
    },
    inputStyle: {
        backgroundColor: 'white',
        borderRadius: 15,
        marginHorizontal: 25,
        paddingHorizontal: 17,
    },
    errorMessage: {
        fontSize: 16,
        color: 'red',
        marginLeft: 15,
        marginTop: 15
    },
    button: {
        color: 'orange',
        fontSize: 16,
        justifyContent: 'center',
        marginTop: 25,
        alignSelf: 'center',
    },
    title: {
        fontSize: 20,
        justifyContent: 'center',
        margin: 20,
        marginLeft: 35,
        color: 'white',
    },
    signUpBoxStyle: {
        backgroundColor: '#FCC859',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10
    },
    signUpTextStyle: {
        color: '#F6F2DF',
        fontSize: 16,
        fontWeight: 'bold'

    },
    inputStyleContainer: {
        borderBottomWidth: 0,
    },
})

export default ForgotPasswordScreen;
