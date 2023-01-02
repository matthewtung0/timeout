import React, { useContext, useState, useCallback } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, FlatList } from 'react-native';
import { Context as CategoryContext } from '../context/CategoryContext';
import { Context as UserContext } from '../context/userContext';
import timeoutApi from '../api/timeout';
import { useFocusEffect } from '@react-navigation/native';
import * as SMS from 'expo-sms';
import * as Contacts from 'expo-contacts';
import Header from '../components/Header';

const InviteScreen = ({ navigation, route: { params } }) => {
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

    const testSMS = async (phoneNumber) => {
        const isAvailable = await SMS.isAvailableAsync();
        if (isAvailable) {
            console.log("IS AVAILABLE")
            const { result } = await SMS.sendSMSAsync(
                [phoneNumber],
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

    // phoneNumbers[0].countryCode
    // phoneNumbers[0].digits
    return (
        <>
            <View style={styles.container}>

                <Text style={{ fontSize: 27, marginBottom: 10, }}>Choose a friend to invite:</Text>

                {/*<Text>{JSON.stringify(contactList)}</Text>*/}

                <FlatList
                    style={{}}
                    data={contactList}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item, index }) => {
                        return (<View>
                            <TouchableOpacity
                                style={[styles.inviteItemDefault,]}
                                onPress={() => {
                                    if (item.phoneNumbers.length > 0) {
                                        testSMS(item.phoneNumbers[0].digits)
                                    }

                                }}>
                                <Text>{item.firstName} {item.lastName}</Text>
                                {item.phoneNumbers.length > 0 ?
                                    <Text>{item.phoneNumbers[0].digits}</Text>
                                    :
                                    <Text>No Number</Text>
                                }


                            </TouchableOpacity>
                        </View>
                        )
                    }}
                />

            </View>

            <Header
                navigation={navigation} />
        </>

    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 110,
    },
    inviteItemDefault: {
        borderWidth: 1,
        marginBottom: 5,
        marginHorizontal: 10,
    }

})

export default InviteScreen;