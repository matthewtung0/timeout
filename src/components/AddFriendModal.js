import React, { useContext, useState, useRef } from 'react';
import {
    View, StyleSheet, Text, Dimensions, TouchableOpacity, TextInput, Keyboard, TouchableWithoutFeedback, Image,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { Context as userContext } from '../context/userContext';
const addFriendPlant = require('../../assets/addFriendPlant.png');

const AddFriendModal = ({ toggleFunction, myFriendCode }) => {
    const { height, width } = Dimensions.get('window');
    const [friendCode, setFriendCode] = useState(null)
    const [friendCode2, setFriendCode2] = useState(null)
    const [friendCode3, setFriendCode3] = useState(null)
    const { requestFriend, fetchOutgoingRequests } = useContext(userContext)
    const [isLoading, setIsLoading] = useState(false)

    const firstRef = useRef();
    const secondRef = useRef();
    const thirdRef = useRef();

    const requestFriendCallback = async () => {
        await fetchOutgoingRequests()
        toggleFunction()
        setIsLoading(false)
        alert("Friend request successfully sent.");
    }
    const requestFriendCallbackInvalidCode = async () => {
        setIsLoading(false)
        alert("Friend code does not belong to any users")
    }

    const requestFriendCallbackInvalidRequest = async () => {
        setIsLoading(false)
        alert("Something went wrong. Please try again later or use another friend code")
    }

    const HideKeyboard = ({ children }) => (
        <TouchableWithoutFeedback onPress={() => {
            Keyboard.dismiss()
        }}>
            {children}
        </TouchableWithoutFeedback>
    );
    const formatFriendCode = (code) => {
        var firstThird = code.slice(0, 4);
        var secondThird = code.slice(4, 8);
        var thirdThird = code.slice(8, 12);
        return firstThird + " " + secondThird + " " + thirdThird;
    }

    //const cleanNumber = number.replace(/[^0-9]/g, "");

    return (
        <View style={{ flex: 1, }}>
            <View style={{ flex: 1, justifyContent: 'flex-end', }}></View>
            <View style={{ flex: 1, justifyContent: 'flex-end', }}>
                <View style={{ flexDirection: 'row', height: "100%", }}>
                    <Image
                        style={{ flex: 1, width: undefined, height: undefined, }}
                        source={addFriendPlant}
                        resizeMode="contain"
                    />
                    <View style={{ flex: 1, }} />
                </View>

            </View>
            <View style={styles.container}>

                <View style={{ flex: 1, borderRadius: 5, margin: 5, padding: 5, marginBottom: 10 }}>
                    <Text style={[styles.textDefault, {
                        color: '#67806D', marginLeft: 10, marginBottom: 10, marginTop: 30,
                    }]}>My friend code is:</Text>
                    <View style={{
                        borderWidth: 2, borderRadius: 20, paddingVertical: 7,
                        paddingHorizontal: 5, borderColor: '#A7BEAD', marginHorizontal: 10,
                    }}>
                        <Text style={[styles.textDefaultBold,
                        { color: '#67806D', textAlign: 'center', fontSize: 20, }]}>{formatFriendCode(myFriendCode)}</Text>

                        {/* COPY FUNCTION */}
                        <View style={{
                            position: 'absolute', alignItems: 'flex-end',
                            width: '100%', justifyContent: 'center', paddingVertical: 7,
                        }}>
                            <TouchableOpacity
                                onPress={() => { }}>
                                <Icon
                                    size={15}
                                    name="copy-outline"
                                    type='ionicon'
                                    color='green'></Icon>
                            </TouchableOpacity>

                        </View>

                    </View>
                    <Text style={[styles.textDefault, {
                        color: '#67806D', marginLeft: 10, marginBottom: 10, marginTop: 10,
                    }]}>Enter friend code here:</Text>

                    <View style={{
                        borderWidth: 2, borderRadius: 20, paddingVertical: 7,
                        paddingHorizontal: 5, borderColor: '#A7BEAD', marginHorizontal: 10,
                    }}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 0.4, }} />
                            <View style={{ flex: 1, }}>
                                <TextInput
                                    //ref={(input) => { this.textInput = input; }}
                                    ref={firstRef}
                                    style={[styles.textDefaultBold, styles.codeInput,]}
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
                            <View style={{ flex: 0.1, justifyContent: 'center', }}>
                                <Text style={[styles.textDefaultBold, { textAlign: 'center', color: '#67806D' }]}>-</Text>
                            </View>
                            <View style={{ flex: 1, }}>
                                <TextInput
                                    ref={secondRef}
                                    style={[styles.textDefaultBold, styles.codeInput]}
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
                            <View style={{ flex: 0.1, justifyContent: 'center', }}>
                                <Text style={[styles.textDefaultBold, { textAlign: 'center', color: '#67806D' }]}>-</Text>
                            </View>
                            <View style={{ flex: 1, }}>
                                <TextInput
                                    ref={thirdRef}
                                    style={[styles.textDefaultBold, styles.codeInput]}
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
                            <View style={{ flex: 0.4, }} />
                        </View>

                    </View>

                    <View opacity={isLoading ? 0.2 : 1}
                        style={{ marginVertical: 30, }}>
                        <TouchableOpacity
                            style={[styles.addFriend, { width: width / 2.5, height: height / 15, backgroundColor: '#83B569' }]}
                            onPress={() => {
                                var fullFC = friendCode + friendCode2 + friendCode3
                                if (fullFC) {
                                    setIsLoading(true)
                                    requestFriend(fullFC, requestFriendCallback,
                                        requestFriendCallbackInvalidCode,
                                        requestFriendCallbackInvalidRequest)
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
                    </View>
                    <View style={styles.backContainer}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={toggleFunction}>

                            <Icon
                                name="close-outline"
                                type='ionicon'
                                size={35}
                                color='black' />
                            {/*<Text style={styles.backButtonText}>X</Text>*/}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>


            <View style={{ flex: 1, justifyContent: 'flex-end', }}></View>
        </View >
    )

}

const styles = StyleSheet.create({
    textDefaultBold: {
        fontFamily: 'Inter-Bold',
    },
    textDefault: {
        fontFamily: 'Inter-Regular',
    },
    container: {
        flex: 3,
        backgroundColor: 'white',
        borderRadius: 20,
    },
    addFriendContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    addFriend: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        alignSelf: 'center',
        marginBottom: 20,
        shadowOffset: {
            width: 1,
            height: 1,
        },
        shadowOpacity: 0.2,
    },
    addFriendText: {
        color: 'white',
        fontSize: 17,
        fontWeight: '600',
        marginLeft: 10,
    },
    codeInput: { textAlign: 'center', color: '#67806D', textAlign: 'center', fontSize: 20, },
    backContainer: {
        width: '50%',
        position: 'absolute',
        alignSelf: 'flex-end',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },
    backButton: {
        width: 50,
        height: 50,
        justifyContent: 'center',
    },
})

export default AddFriendModal;