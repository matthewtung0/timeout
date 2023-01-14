import React, { useRef, useCallback, useState } from 'react';
import {
    View, StyleSheet, TouchableOpacity, Dimensions,
    Image, TextInput, Keyboard, TouchableWithoutFeedback, Animated
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';
import { Input, Text } from 'react-native-elements';
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


const SignupScreen2 = ({ navigation, route: { params } }) => {
    const { height, width } = Dimensions.get('window');
    const { email, firstName, lastName } = params;
    const [bio, setBio] = useState('')
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
                            <Text style={[styles.textDefaultBold, { color: '#67806D' }]}>I can't wait to get productive!</Text>
                            <Text style={[styles.textDefaultBold, { color: '#67806D' }]}>I hope this app will help.</Text>
                        </View>

                    </View>

                </View>
                <View style={{ flex: 1.5 }}>
                    <View style={styles.inner}>


                        <Input
                            style={[styles.inputStyle, styles.textDefault, { fontSize: 16, }]}
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
                                navigation.navigate('SignUp3', { email, firstName, lastName, bio })
                            }}>
                            <Text style={[styles.signUpTextStyle, styles.textDefaultBold,]}>Next</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                alignSelf: 'center',
                            }}
                            onPress={() => { navigation.navigate('SignUp') }}>
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

SignupScreen2.navigationOptions = () => {
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
    inner: {
        backgroundColor: '#67806D',
        flex: 1,
        paddingVertical: 20,
    },
    img: {
        marginTop: 50,
    }
})

export default SignupScreen2;
