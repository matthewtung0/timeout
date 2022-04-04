import React, { useContext, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
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

            <ImageBackground
                source={img_src}
                style={[styles.image,
                { width: width, height: height }]}
                resizeMode='stretch'>

                <View style={{ flex: 1 }}>

                    <Text style={styles.title}> Enter your email to get a reset link.</Text>
                </View>



                <View style={{ flex: 1 }}>
                    <Input
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
            </ImageBackground>
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
    errorMessage: {
        fontSize: 16,
        color: 'red',
        marginLeft: 15,
        marginTop: 15
    },
    button: {
        color: 'blue',
        justifyContent: 'center',
        margin: 10,
    },
    title: {
        fontSize: 30,
        justifyContent: 'center',
        margin: 20,
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
})

export default ForgotPasswordScreen;
