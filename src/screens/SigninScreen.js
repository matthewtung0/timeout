import React, { useContext, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Input, Button, Text } from 'react-native-elements';
import { Context as AuthContext } from '../context/AuthContext';
import { NavigationEvents } from 'react-navigation';

const SigninScreen = ({ navigation }) => {
    const { state, signin, signout, tryLocalSignin, clearErrorMessage } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <View style={styles.container}>
            <NavigationEvents
                onWillFocus={clearErrorMessage}
            />
            <Text style={styles.title}> Sign in here</Text>
            <Input
                label='Email'
                autoCapitalize='none'
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
            />
            <Input
                secureTextEntry={true}
                label="Password"
                autoCapitalize='none'
                autoCorrect={false}
                value={password}
                onChangeText={setPassword}
            />

            {state.errorMessage ? <Text style={styles.errorMessage}>{state.errorMessage}</Text> : null}

            <Button
                style={styles.button}
                title="Sign In"
                onPress={() => signin({ email, password })} />

            <Button
                style={styles.button}
                title="Sign Out"
                onPress={() => signout()} />

            <TouchableOpacity onPress={() =>
                navigation.navigate('SignUp')
            }
            >
                <Text style={styles.button}>Don't have an account? Create one here.</Text>

            </TouchableOpacity>

            <TouchableOpacity onPress={() =>
                navigation.navigate('ForgotPassword')
            }
            >
                <Text style={styles.button}>Forgot your password?</Text>

            </TouchableOpacity>
        </View>
    )

}

SigninScreen.navigationOptions = () => {
    return {
        headerShown: false,
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        marginBottom: 120,
    },
    title: {
        fontSize: 30,
        justifyContent: 'center',
        margin: 20,
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
    }
})

export default SigninScreen;
