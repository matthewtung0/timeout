import React, { useContext, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Input, Button, Text } from 'react-native-elements';
import { Context as AuthContext } from '../context/AuthContext';
import { NavigationEvents } from 'react-navigation';

const ForgotPasswordScreen = ({ navigation }) => {
    const { state, forgot_password, clearErrorMessage } = useContext(AuthContext);
    const [email, setEmail] = useState('');

    return (
        <View style={styles.container}>
            <NavigationEvents
                onWillFocus={clearErrorMessage}
            />

            <Text style={styles.title}> Enter your email to get a reset link.</Text>

            <Input
                label='Email'
                autoCapitalize='none'
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
            />
            {state.errorMessage ? <Text style={styles.errorMessage}>{state.errorMessage}</Text> : null}

            <Button
                style={styles.button}
                title="Send email to reset password!"
                onPress={() => forgot_password(email)} />

            <TouchableOpacity onPress={() =>
                navigation.navigate('SignIn')
            }
            >
                <Text style={styles.button}>Go back to sign in page</Text>

            </TouchableOpacity>


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
        justifyContent: 'center',
        marginBottom: 200
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
})

export default ForgotPasswordScreen;
