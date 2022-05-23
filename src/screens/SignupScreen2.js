import React, { useContext, useState } from 'react';
import {
    View, StyleSheet, TouchableOpacity, Dimensions, ImageBackground,
    KeyboardAvoidingView, Image, ScrollView, TextInput, Keyboard, TouchableWithoutFeedback
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { Input, Button, Text } from 'react-native-elements';

//import OneSignal from 'react-native-onesignal'

const img_src = require('../../assets/signin_background.png');
const img = require('../../assets/signup_plant.png')

const HideKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>
);

const SignupScreen2 = ({ navigation, route: { params } }) => {
    const { height, width } = Dimensions.get('window');
    const { email, firstName, lastName } = params;
    const [bio, setBio] = useState('')
    return (
        <HideKeyboard>

            <View style={{
                flex: 1,
            }}>
                <Image
                    source={img}
                    resizeMode='stretch'
                    style={[styles.img, { maxWidth: width, maxHeight: height / 4 }]} />
                <View style={styles.inner}>


                    <Input
                        style={styles.inputStyle}
                        multiline={true}
                        numberOfLines={4}
                        maxHeight={120}
                        editable
                        maxLength={150}
                        //containerStyle={styles.nameInputStyleContainer}
                        inputContainerStyle={styles.inputStyleContainer}
                        placeholder='Write a quick optional bio (visible to everyone)'
                        autoCorrect={false}
                        value={bio}
                        onChangeText={setBio}
                    />

                    <TouchableOpacity
                        style={styles.signUpBoxStyle}
                        onPress={() => {
                            navigation.navigate('SignUp3', { email, firstName, lastName, bio })
                        }}>
                        <Text style={styles.signUpTextStyle}>Next</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            alignSelf: 'center',
                        }}
                        onPress={() => { navigation.navigate('SignUp') }}>
                        <Text style={{
                            color: '#F6F2DF',
                            alignSelf: 'center',
                            marginTop: 10
                        }}>Go Back</Text>
                    </TouchableOpacity>

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
