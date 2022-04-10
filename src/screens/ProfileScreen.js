import React, { useContext, useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-elements';
import { Context as UserContext } from '../context/userContext';
import { useFocusEffect } from '@react-navigation/native';

const ProfileScreen = ({ navigation }) => {
    const { state, fetchSelf } = useContext(UserContext)

    useFocusEffect(

        useCallback(() => {
            console.log("use focus effect")
            fetchSelf();
            //return () => test();
        }, [])
    )

    return (
        <View>

            {state.errorMessage ? <Text style={styles.errorMessage}>{state.errorMessage}</Text> : null}
            <Text>First name: {state.firstName}</Text>
            <Text>Last name: {state.lastName}</Text>
            <Text>Username: {state.username}</Text>
            <Text>Points: {state.points} </Text>

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
            <Button
                style={styles.button}
                title="Edit Profile (temp)"
                onPress={() => navigation.navigate('EditProfile')} />
        </View>
    )
}
/*ProfileScreen.navigationOptions = ( {navigation}) => {
    return {
        headerRight: () => (
            <Button
                onPress={() => navigation}
                title="Info"
                color="#fff"
            />
        ),
    }
}*/

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