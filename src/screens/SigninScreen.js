import React, { useContext, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ImageBackground, Dimensions, Image } from 'react-native';
import { Input, Button, Text } from 'react-native-elements';
import { Context as AuthContext } from '../context/AuthContext';
import { NavigationEvents } from 'react-navigation';

const img_src = require('../../assets/signin_background.png');

const SigninScreen = ({ navigation }) => {
    const { height, width } = Dimensions.get('window');
    const { state, signin, signout, tryLocalSignin, clearErrorMessage } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const imgWidth = Image.resolveAssetSource(img_src).width
    const imgHeight = Image.resolveAssetSource(img_src).height
    const heightSet = width * (imgHeight / imgWidth)

    return (
        <View style={styles.container}>

            {/*<NavigationEvents onWillFocus={clearErrorMessage}/>*/}

            <ImageBackground
                source={img_src}
                style={[styles.image,
                { width: width, height: height }]}
                resizeMode='stretch'>

                <View style={styles.inputContainer}>
                    <View style={{ flex: 8 }} />
                    <View style={{ flex: 1.7 }}>
                        <Input
                            style={styles.inputStyle}
                            inputContainerStyle={styles.inputStyleContainer}
                            autoCapitalize='none'
                            autoCorrect={false}
                            value={email}
                            placeholder="Email"
                            onChangeText={setEmail}
                        />
                    </View>

                    <View style={{ flex: 3 }}>
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
                        <TouchableOpacity onPress={() =>
                            navigation.navigate('ForgotPassword')
                        }
                        >
                            <Text style={styles.button}>Forgot your password?</Text>

                        </TouchableOpacity>
                    </View>

                    <View style={{ flex: 3 }}>
                        <TouchableOpacity
                            style={styles.signInBoxStyle}
                            onPress={() => signin({ email, password })}>
                            <Text style={styles.signInTextStyle}>Sign In</Text>
                        </TouchableOpacity>
                        {state.errorMessage ? <Text style={styles.errorMessage}>{state.errorMessage}</Text> : null}

                        <TouchableOpacity onPress={() =>
                            navigation.navigate('SignUp')
                        }
                        >
                            <Text style={styles.redirectToSignInStyleWhite}>Don't have an account?
                                <Text style={styles.redirectToSignInStyleYellow}> Sign up here!</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
        </View >
    )
}

/*SigninScreen.navigationOptions = () => {
    return {
        headerShown: false,
    }
}*/

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-start'
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
        flex: 1,
        flexDirection: 'column',
    },
    errorMessage: {
        fontSize: 16,
        color: 'red',
        marginTop: 10,
        alignSelf: 'center'
    },
    button: {
        color: 'orange',
        marginHorizontal: 30,
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
        borderRadius: 10
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
