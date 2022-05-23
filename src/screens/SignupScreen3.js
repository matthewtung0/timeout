import React, { useContext, useState } from 'react';
import {
    View, StyleSheet, TouchableOpacity, Dimensions, ImageBackground,
    KeyboardAvoidingView, Image, ScrollView, TextInput, Keyboard, TouchableWithoutFeedback
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { Input, Button, Text } from 'react-native-elements';
import { Context as AuthContext } from '../context/AuthContext';

const img_src = require('../../assets/signin_background.png');
const img = require('../../assets/signup_plant.png')

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
                        inputContainerStyle={styles.inputStyleContainer}
                        secureTextEntry={false}
                        placeholder="Username"
                        autoCapitalize='none'
                        autoCorrect={false}
                        value={username}
                        onChangeText={setUsername}
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

                    <Input
                        style={styles.inputStyle}
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
                        errorStyle={{ marginHorizontal: 30, fontSize: 17 }}
                        errorMessage={passwordMismatch ? "Passwords don't match!" : null}
                    />

                    <TouchableOpacity
                        style={styles.signUpBoxStyle}
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

SignupScreen3.navigationOptions = () => {
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
