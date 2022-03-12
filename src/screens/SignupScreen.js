import React, { useContext, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Input, Button, Text } from 'react-native-elements';
import { Context as AuthContext } from '../context/AuthContext';
import { NavigationEvents } from 'react-navigation';

const SignupScreen = ({ navigation }) => {
    const { state, signup, clearErrorMessage } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <View style={styles.container}>
            <NavigationEvents
                onWillFocus={clearErrorMessage}
            />
            <Text style={styles.title}>Sign up for TimeOut!</Text>
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
            <Text>{email}</Text>
            <Text>{password}</Text>

            {state.errorMessage ? <Text style={styles.errorMessage}>{state.errorMessage}</Text> : null}

            <Button
                style={styles.button}
                title="Sign Up"
                onPress={() => signup({ email, password })} />

            <TouchableOpacity onPress={() =>
                navigation.navigate('SignIn')
            }
            >
                <Text style={styles.button}>Have an account? Sign in instead.</Text>

            </TouchableOpacity>

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
        justifyContent: 'center',
        marginBottom: 200
    },
    errorMessage: {
        fontSize: 16,
        color: 'red',
        marginLeft: 15,
        marginTop: 15
    },
    title: {
        fontSize: 30,
        justifyContent: 'center',
        margin: 20,
    },
    button: {
        color: 'blue',
        justifyContent: 'center',
        margin: 10,
    }
})

export default SignupScreen;
