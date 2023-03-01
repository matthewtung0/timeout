import React, { useContext, useState } from 'react';
import {
    View, StyleSheet, Text, Dimensions, Image,
    TouchableOpacity, TextInput
} from 'react-native';
import { Icon } from 'react-native-elements'
import tinycolor from 'tinycolor2';
import { Context as UserContext } from '../context/userContext'
import { Context as AuthContext } from '../context/AuthContext'
import { Context as CategoryContext } from '../context/CategoryContext';
import { Context as CounterContext } from '../context/CounterContext';
import { Context as SessionContext } from '../context/SessionContext';
import { Context as ReactionContext } from '../context/ReactionContext';
const BORDER_RADIUS = 20;
const img = require('../../assets/tasks_topbar.png')

const DeleteConfirmModal = ({ toggleFunction }) => {
    const { height, width } = Dimensions.get('window');
    const INPUT_WIDTH = width * 0.65
    const [deleteText, setDeleteText] = useState('')
    const [password, setPassword] = useState('')
    const { deleteSelf, clearUserContext } = useContext(UserContext)
    const { clearCategoryContext } = useContext(CategoryContext)
    const { clearCounterContext } = useContext(CounterContext)
    const { clearSessionContext } = useContext(SessionContext)
    const { clearReactionContext } = useContext(ReactionContext)
    const { signout } = useContext(AuthContext)

    const validateInputs = () => {
        if (deleteText === 'delete') {
            toggleFunction();
            console.log("deleting")
            deleteSelf(callback, errorCallback);
        }
    }
    const callback = () => {
        setTimeout(() => {
            signout(signoutCallback)
        }, 1000)

    }
    const signoutCallback = async () => {
        await clearCategoryContext()
        await clearUserContext()
        await clearSessionContext()
        await clearReactionContext()
        await clearCounterContext()

        console.log("all context cleared!")

        alert("Your account has been deleted.")
    }


    const errorCallback = () => {
        alert('Something went wrong. Please check your password or try again later')
    }

    return (
        <>
            <View style={[styles.container, { borderRadius: BORDER_RADIUS }]}>
                <View style={{ marginHorizontal: 20, marginTop: 90 }}>


                    <View style={{ marginVertical: 10, marginHorizontal: 10, marginBottom: 20, }}>

                        {/*<Text
                            style={[styles.titleLabel, styles.textDefault, { fontSize: 14, marginBottom: 10, }]}>
                            To delete your account, confirm your password:
                        </Text>
                        <TextInput
                            style={[styles.inputStyle, styles.textDefault, {
                                fontSize: 20, color: '#67806D',
                                borderWidth: 1,
                            }]}
                            inputContainerStyle={[styles.inputStyleContainer]}
                            autoCapitalize='none'
                            secureTextEntry="true"
                            autoCorrect={false}
                            value={password}
                            placeholder=""
                            placeholderTextColor={'#67806D'}
                            labelStyle={[styles.textDefault, { fontSize: 15, color: '#67806D' }]}
                            label="Current Password"
                            onChangeText={setPassword}
                        />*/}
                        <Text
                            style={[styles.titleLabel, styles.textDefault, { fontSize: 14, marginBottom: 10, }]}>
                            <Text>To confirm the delete, type </Text>
                            <Text style={{ fontStyle: 'italic', fontSize: 18 }}>delete</Text>
                            <Text> into the space below, and press Confirm.</Text>
                            <Text> This will be permanent.</Text>
                        </Text>

                        <TextInput
                            style={[styles.inputStyle, styles.textDefault, {
                                fontSize: 20, color: '#67806D',
                                borderWidth: 1,
                            }]}
                            inputContainerStyle={[styles.inputStyleContainer]}
                            autoCapitalize='none'
                            autoCorrect={false}
                            value={deleteText}
                            placeholder=""
                            placeholderTextColor={'#67806D'}
                            labelStyle={[styles.textDefault, { fontSize: 15, color: '#67806D' }]}
                            label="Current Password"
                            onChangeText={setDeleteText}
                        />


                        <TouchableOpacity
                            style={[styles.signInBoxStyle, {
                                shadowOffset: {
                                    width: 0,
                                    height: 6,
                                },
                                shadowOpacity: 1,
                                shadowRadius: 0,
                                shadowColor: tinycolor('#FCC859').darken(25).toString(),
                                padding: 15,
                                marginTop: 20,
                                paddingVertical: 7,
                            }]}
                            onPress={() => { validateInputs() }}>
                            <Text style={[styles.signInTextStyle, styles.textDefaultSemiBold, { fontSize: 16, }]}>
                                Confirm</Text>
                        </TouchableOpacity>

                    </View>

                </View>
            </View>

            <Image
                source={img}
                resizeMode='stretch'
                style={{
                    maxWidth: width * 0.9, maxHeight: 75, position: 'absolute',
                    borderTopLeftRadius: BORDER_RADIUS, borderTopRightRadius: BORDER_RADIUS,
                }} />

            <Text style={[styles.title, { position: 'absolute' }]}>Confirm Delete</Text>

            <View style={styles.backContainer}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={toggleFunction}>

                    <Icon
                        name="close-outline"
                        type='ionicon'
                        size={35}
                        color='white' />
                </TouchableOpacity>
            </View>
        </>

    )
}

const styles = StyleSheet.create({
    textDefaultBold: {
        fontFamily: 'Inter-Bold',
    },
    textDefaultSemiBold: {
        fontFamily: 'Inter-SemiBold',
    },
    textDefault: {
        fontFamily: 'Inter-Regular',
    },
    container: {
        backgroundColor: '#f6F2DF',
        alignContent: 'center'
    }, colorSquare: {
        marginHorizontal: 5,
        marginTop: 5,
        marginBottom: 5,
    },
    modalMargin: {
        marginHorizontal: 10,
    },
    selectOutline: {
        width: 40, height: 40, marginHorizontal: 5,
        marginVertical: 5, justifyContent: 'center', alignItems: 'center'
    },
    backContainer: {
        flex: 1,
        width: '50%',
        position: 'absolute',
        alignSelf: 'flex-end',
        justifyContent: 'flex-end',
        alignItems: 'flex-end'
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
    },
    updateColorButton: {
        marginVertical: 10,
        padding: 10,
        backgroundColor: '#ABC57E',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        shadowOffset: {
            width: 0.05,
            height: 0.05,
        },
        shadowOpacity: 0.2,
    }, signInTextStyle: {
        color: '#F6F2DF',
        fontSize: 14,
        fontWeight: 'bold'

    },
    addCategoryText: {
        fontWeight: '600',
        color: 'white',
        fontSize: 18,
    },
    titleLabel: {
        color: '#67806D',
        fontSize: 24,
        marginBottom: 10,
    },
    title: {
        alignSelf: 'center',
        margin: 20,
        marginBottom: 50,
        fontSize: 25,
        fontWeight: 'bold',
        color: 'white',
    },
    titleContainer: {
        marginTop: 20,
        backgroundColor: 'white',
        borderRadius: 15,
        paddingHorizontal: 10,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        color: 'gray',
        fontSize: 18,
        fontWeight: '600',
    },
    labelText: { marginLeft: 5, color: 'gray', },
    inputStyle: {
        borderRadius: 15,
        paddingHorizontal: 15,
        paddingTop: 15,
        paddingBottom: 15,
        color: 'gray',
        fontSize: 16,
    },
    inputStyleContainer: {
        borderBottomWidth: 0,
    }, signInBoxStyle: {
        backgroundColor: '#FCC859',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginBottom: 10,
    },
})

export default DeleteConfirmModal;