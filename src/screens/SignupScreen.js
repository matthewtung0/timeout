import React, { useContext, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, ImageBackground } from 'react-native';
import { Input, Button, Text } from 'react-native-elements';
import { Context as AuthContext } from '../context/AuthContext';
import { NavigationEvents } from 'react-navigation';

const img_src = require('../../assets/signin_background.png');

const SignupScreen = ({ navigation }) => {
    const { height, width } = Dimensions.get('window');
    const { state, signup, clearErrorMessage } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    return (
        <View style={styles.container}>
            <NavigationEvents
                onWillFocus={clearErrorMessage}
            />

            <ImageBackground
                source={img_src}
                style={[styles.image,
                { width: width, height: height }]}
                resizeMode='stretch'>

                <View style={styles.inputContainer}>
                    <View style={{ flex: 15 }} />
                    <View style={{ flex: 11 }}>


                        <View style={styles.nameContainer}>
                            <Input
                                style={styles.inputStyle}
                                containerStyle={styles.nameInputStyleContainer}
                                inputContainerStyle={styles.inputStyleContainer}
                                placeholder='First Name'
                                autoCorrect={false}
                                value={firstName}
                                onChangeText={setFirstName}
                            />
                            <Input
                                style={styles.inputStyle}
                                containerStyle={styles.nameInputStyleContainer}
                                inputContainerStyle={styles.inputStyleContainer}
                                placeholder='Last Name'
                                autoCorrect={false}
                                value={lastName}
                                onChangeText={setLastName}
                            />

                        </View>

                        <Input
                            style={styles.inputStyle}
                            inputContainerStyle={styles.inputStyleContainer}
                            placeholder='Email'
                            autoCapitalize='none'
                            autoCorrect={false}
                            value={email}
                            onChangeText={setEmail}
                        />

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
                    </View>

                    <View style={{ flex: 4 }}>

                        <TouchableOpacity
                            style={styles.signUpBoxStyle}
                            onPress={() => signup({ email, password, username, firstName, lastName })}>
                            <Text style={styles.signUpTextStyle}>Sign Up</Text>
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

                    </View>

                </View>

                {/*{state.errorMessage ? <Text style={styles.errorMessage}>{state.errorMessage}</Text> : null}*/}


            </ImageBackground>
        </View>
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
    }

})

export default SignupScreen;
