import React, { useContext, useState } from 'react';
import {
    View, StyleSheet, TouchableOpacity, ImageBackground, Dimensions,
    Image
} from 'react-native';
import { Input, Button, Text } from 'react-native-elements';
import { Context as AuthContext } from '../context/AuthContext';

const img_src = require('../../assets/signin_background.png');

const ForgotPasswordScreen = ({ navigation }) => {
    const { height, width } = Dimensions.get('window');
    const { state, forgot_password, clearErrorMessage } = useContext(AuthContext);
    const [email, setEmail] = useState('');

    return (
        <View style={styles.container}>
            {/*<NavigationEvents
                onWillFocus={clearErrorMessage}
    />*/}

            <View style={{ flex: 3, justifyContent: 'center', backgroundColor: '#67806D' }}>
                <Text style={styles.title}> Enter your email to reset password:</Text>
                <Input
                    style={[styles.inputStyle, { marginBottom: 10, }]}
                    inputContainerStyle={styles.inputStyleContainer}
                    placeholder='Email'
                    autoCapitalize='none'
                    autoCorrect={false}
                    value={email}
                    onChangeText={setEmail}
                />
                {state.errorMessage ? <Text style={styles.errorMessage}>{state.errorMessage}</Text> : null}

                <TouchableOpacity
                    style={styles.signUpBoxStyle}
                    onPress={() => forgot_password(email)}>
                    <Text style={styles.signUpTextStyle}>Send Reset Link</Text>
                </TouchableOpacity>


                <TouchableOpacity onPress={() =>
                    navigation.navigate('SignIn')
                }
                >
                    <Text style={styles.button}>Go back to sign in page</Text>

                </TouchableOpacity>
            </View>

            <View style={{ flex: 2 }}>
                <Image
                    style={{ width: width, height: height / 2.5, }}
                    source={img_src}
                    resizeMode="stretch"
                />

            </View>



        </View>
    )

}

ForgotPasswordScreen.navigationOptions = () => {
    return {
        headerShown: false,
    };
}

const styles = StyleSheet.create({
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
        color: 'purple',
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
        width: 150,
        height: 40,
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
