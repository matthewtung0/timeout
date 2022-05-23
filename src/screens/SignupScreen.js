import React, { useContext, useState } from 'react';
import {
    View, StyleSheet, TouchableOpacity, Dimensions, ImageBackground,
    KeyboardAvoidingView, Image, ScrollView, Keyboard, TouchableWithoutFeedback
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { Input, Button, Text } from 'react-native-elements';
import { Context as AuthContext } from '../context/AuthContext';
import timeoutApi from '../api/timeout';

const img_src = require('../../assets/signin_background.png');
const img = require('../../assets/signup_plant.png')

const HideKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>
);
const SignupScreen = ({ navigation }) => {
    const { height, width } = Dimensions.get('window');
    const { state, signup, clearErrorMessage } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [isEmailTaken, setIsEmailTaken] = useState(0)

    const checkEmailAndNext = async () => {
        try {
            const emailTaken = await timeoutApi.get('/email_exists', { params: { email } })
            setIsEmailTaken(emailTaken.data)
            if (emailTaken.data == 0) {
                navigation.navigate('SignUp2', { email, firstName, lastName })
            }
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <HideKeyboard>
            <View style={{
                flex: 1,
            }}>
                {/*<NavigationEvents
                onWillFocus={clearErrorMessage}
    />*/}

                {/*<ImageBackground
                source={img_src}
                style={[styles.image,
                { width: width, height: height }]}
                resizeMode='stretch'>*/}


                <Image
                    source={img}
                    resizeMode='stretch'
                    style={[styles.img, { maxWidth: width, maxHeight: height / 4 }]} />

                {/*<View style={styles.inputContainer}>
                <View style={{ flex: 15, }} />
                <View style={{ flex: 11 }}>*/}

                {/*<View style={styles.nameContainer}>*/}

                <View style={styles.inner}>
                    <Input
                        style={styles.inputStyle}
                        //containerStyle={styles.nameInputStyleContainer}
                        inputContainerStyle={styles.inputStyleContainer}
                        placeholder='First Name'
                        autoCorrect={false}
                        value={firstName}
                        onChangeText={setFirstName}
                    />
                    <Input
                        style={styles.inputStyle}
                        //containerStyle={styles.nameInputStyleContainer}
                        inputContainerStyle={styles.inputStyleContainer}
                        placeholder='Last Name'
                        autoCorrect={false}
                        value={lastName}
                        onChangeText={setLastName}
                    />

                    <Input
                        style={styles.inputStyle}
                        inputContainerStyle={styles.inputStyleContainer}
                        placeholder='Email'
                        autoCapitalize='none'
                        autoCorrect={false}
                        value={email}
                        onChangeText={(value) => {
                            setEmail(value)
                            setIsEmailTaken(0)
                        }}
                        errorStyle={{ marginHorizontal: 30, fontSize: 17 }}
                        errorMessage={isEmailTaken == 0 ?
                            null :
                            'Email taken! Please choose another.'}
                    />
                    {/*
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
                />

                {/*<View style={{ flex: 4 }}>*/}

                    <TouchableOpacity
                        style={styles.signUpBoxStyle}
                        onPress={() => {
                            //navigation.navigate('OnboardCategory', { email, password, username, firstName, lastName })
                            checkEmailAndNext()
                        }}>
                        <Text style={styles.signUpTextStyle}>Next</Text>
                    </TouchableOpacity>
                    {state.errorMessage ? <Text style={styles.errorMessage}>{state.errorMessage}</Text> : null}

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
