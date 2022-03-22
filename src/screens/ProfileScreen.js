import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-elements';
import { NavigationEvents } from 'react-navigation';
import { Context as UserContext } from '../context/userContext';
import { Context as AuthContext } from '../context/AuthContext';

const ProfileScreen = ({ navigation }) => {
    const { state, fetchSelf } = useContext(UserContext)
    const { signout } = useContext(AuthContext);

    return (
        <View>
            <NavigationEvents onWillFocus={fetchSelf} />

            {state.errorMessage ? <Text style={styles.errorMessage}>{state.errorMessage}</Text> : null}
            <Text>First name: {state.self_info.first_name}</Text>
            <Text>Last name: {state.self_info.last_name}</Text>
            <Text>Username: {state.self_info.username}</Text>

            <Button
                style={styles.button}
                title="Daily Historical View"
                onPress={() => navigation.navigate('HistoryDaily')}
            />

            <Button
                style={styles.button}
                title="Monthly Historical View"
                onPress={() => navigation.navigate('HistoryMonthly')} />

            <Button
                style={styles.button}
                title="Sign Out (temp)"
                onPress={() => signout()} />

            <Button
                style={styles.button}
                title="Add category (temp)"
                onPress={() => navigation.navigate('AddCategory')} />

            <Button
                style={styles.button}
                title="See Todo Items (temp)"
                onPress={() => navigation.navigate('TodoFlow')} />

            <Button
                style={styles.button}
                title="Friends (temp)"
                onPress={() => navigation.navigate('Friend')} />
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        margin: 30,
        fontSize: 40,
    },
    button: {
        color: 'blue',
        justifyContent: 'center',
        margin: 10,
    }
})

export default ProfileScreen;