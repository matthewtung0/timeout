import React, { useContext, useState, useRef } from 'react';
import {
    View, StyleSheet, Text, Dimensions, TouchableOpacity, TextInput, Keyboard, TouchableWithoutFeedback
} from 'react-native';
import { Icon, Button } from 'react-native-elements';
import { Context as userContext } from '../context/userContext';

const AddFriendModal = ({ toggleFunction, callback }) => {
    const { height, width } = Dimensions.get('window');
    const [friendCode, setFriendCode] = useState(null)
    const [friendCode2, setFriendCode2] = useState(null)
    const [friendCode3, setFriendCode3] = useState(null)
    const { state, requestFriend, fetchOutgoingRequests } = useContext(userContext)

    const firstRef = useRef();
    const secondRef = useRef();
    const thirdRef = useRef();
    const [firstEditable, setFirstEditable] = useState(true)
    const [secondEditable, setSecondEditable] = useState(false)
    const [thirdEditable, setThirdEditable] = useState(false)

    //firstRef.current.focus()

    const requestFriendCallback = async () => {
        await fetchOutgoingRequests()
        toggleFunction()
        alert("Friend request successfully sent.");
    }

    const HideKeyboard = ({ children }) => (
        <TouchableWithoutFeedback onPress={() => {
            Keyboard.dismiss()
        }}>
            {children}
        </TouchableWithoutFeedback>
    );

    //const cleanNumber = number.replace(/[^0-9]/g, "");

    return (
        <View style={styles.container}>

            <View style={{ flex: 1, borderRadius: 5, margin: 5, padding: 5, marginBottom: 10 }}>
                <Text style={{ flex: 0.2, marginBottom: 10, }}>Enter friend code here:</Text>

                <View style={{ flex: 0.5, flexDirection: 'row', }}>
                    <View style={{ flex: 1 }}>
                        <TextInput
                            //ref={(input) => { this.textInput = input; }}
                            ref={firstRef}
                            style={styles.codeInput}
                            keyboardType={"number-pad"}
                            returnKeyType="done"
                            editable={true}
                            autoFocus={true}
                            maxLength={4}
                            inputContainerStyle={styles.inputStyleContainer}
                            //placeholder='Friend Code to add'
                            value={friendCode}
                            onChangeText={(text) => {
                                setFriendCode(text)
                                if (text.length === 4) {
                                    //setFirstEditable(false)
                                    //setSecondEditable(true)
                                    secondRef.current.focus();
                                }
                            }}
                        />
                    </View>
                    <View style={{ flex: 0.4, justifyContent: 'center', }}>
                        <Text style={{ textAlign: 'center' }}>-</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <TextInput
                            ref={secondRef}
                            style={styles.codeInput}
                            keyboardType={"number-pad"}
                            returnKeyType="done"
                            editable={true}
                            maxLength={4}
                            inputContainerStyle={styles.inputStyleContainer}
                            //placeholder='Friend Code to add'
                            value={friendCode2}
                            onChangeText={(text) => {
                                setFriendCode2(text)
                                if (text.length === 0) {
                                    //setSecondEditable(false)
                                    //setFirstEditable(true)
                                    firstRef.current.focus()

                                }
                                else if (text.length === 4) {
                                    //setSecondEditable(false)
                                    //setThirdEditable(true)
                                    thirdRef.current.focus();

                                }
                            }
                            }
                        />
                    </View>
                    <View style={{ flex: 0.4, justifyContent: 'center', }}>
                        <Text style={{ textAlign: 'center' }}>-</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <TextInput
                            ref={thirdRef}
                            style={styles.codeInput}
                            keyboardType={"number-pad"}
                            returnKeyType="done"
                            editable={true}
                            maxLength={4}
                            inputContainerStyle={styles.inputStyleContainer}
                            //placeholder='Friend Code to add'
                            value={friendCode3}
                            onChangeText={(text) => {
                                setFriendCode3(text)
                                if (text.length === 0) {
                                    //setSecondEditable(true)
                                    //setThirdEditable(false)
                                    secondRef.current.focus()

                                }
                            }}
                        />
                    </View>
                </View>

                <View style={{ flex: 1, marginVertical: 20, }}>
                    <TouchableOpacity
                        style={[styles.addFriend, { width: width / 2.5, height: height / 15 }]}
                        onPress={() => {
                            var fullFC = friendCode + friendCode2 + friendCode3
                            if (fullFC) {
                                requestFriend(fullFC, requestFriendCallback)
                            }

                        }}>
                        <View style={styles.addFriendContainer}>
                            <Icon
                                name="person-add"
                                type='ionicon'
                                color='white' />
                            <Text style={styles.addFriendText}>Add Friend</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ alignItems: 'center', }}
                        onPress={toggleFunction}>
                        <Text style={{ color: 'blue', }}>Go back</Text>
                    </TouchableOpacity>

                    {state.errorMessage ? <Text>Error message here:{state.errorMessage}</Text> : null}
                </View>


            </View>

        </View>

    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    addFriendContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    addFriend: {
        backgroundColor: '#ABC57E',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        alignSelf: 'center',
        marginBottom: 20,
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.9,
    },
    addFriendText: {
        color: 'white',
        fontSize: 17,
        fontWeight: '600',
        marginLeft: 10,
    },
    codeInput: { flex: 1, borderWidth: 1, textAlign: 'center', fontSize: 20, fontWeight: '400', },
})

export default AddFriendModal;