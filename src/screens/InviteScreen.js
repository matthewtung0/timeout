import React, { useContext, useState, useCallback } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Switch } from 'react-native';
import { Context as CategoryContext } from '../context/CategoryContext';
import { Context as UserContext } from '../context/userContext';
import timeoutApi from '../api/timeout';
import { useFocusEffect } from '@react-navigation/native';
import * as SMS from 'expo-sms';
import * as Contacts from 'expo-contacts';

const InviteScreen = ({ navigation: { navigate }, route: { params } }) => {
    //const { } = params;
    const [contactList, setContactList] = useState([])

    const testContacts = async () => {
        const { status } = await Contacts.requestPermissionsAsync();
        console.log("CONTACTS STATUS ", status)
        if (status === 'granted') {
            const { data } = await Contacts.getContactsAsync({
                fields: [Contacts.Fields.FirstName, Contacts.Fields.LastName, Contacts.Fields.PhoneNumbers,],
            });
            console.log("CONTACT DATA: ", data)

            setContactList(data)
            if (data.length > 0) {
                const contact = data[0];
                console.log("CONTACT:", contact);
            }
        }
    }

    const testSMS = async () => {
        const isAvailable = await SMS.isAvailableAsync();
        if (isAvailable) {
            console.log("IS AVAILABLE")
            const { result } = await SMS.sendSMSAsync(
                ['5555555555',],
                'Come be productive with me on TimeOut!',
            );
            // do your SMS stuff here
        } else {
            console.log("NOT AVAILABLE")
            // misfortune... there's no SMS available on this device
        }
    }

    useFocusEffect(
        useCallback(() => {
            testContacts()
        }, [])
    )
    return (
        <View style={styles.container}>

            <Text>Invite a friend</Text>

            <Text>{JSON.stringify(contactList)}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 70,
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
    },

})

export default InviteScreen;