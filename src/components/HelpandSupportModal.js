import React, { useState } from 'react';
import {
    View, StyleSheet, Text, TouchableOpacity, Dimensions, Image,
} from 'react-native';
import { Icon } from 'react-native-elements'
const constants = require('../components/constants.json')
const img = require('../../assets/tasks_topbar.png')
const yellowCheckmark = require('../../assets/yellow_checkmark.png')

const HelpandSupportModal = ({ toggleFunction, selectedObject, callback }) => {
    const { height, width } = Dimensions.get('window');
    const BORDER_RADIUS = 20;

    return (
        <View style={[styles.container, { width: width * 0.9, alignSelf: 'center' }]}>

            <View style={{ flex: 1, backgroundColor: 'white', borderRadius: BORDER_RADIUS, alignItems: 'center' }}>
                <View style={{ height: 85 }} />
                <Text style={[styles.textDefault, {
                    marginHorizontal: 20, fontSize: 16,
                    marginTop: 20, color: '#67806D',
                }]}><Text>Thank you for using TimeOut!
                    If you have any questions or comments, you can contact us at:</Text>
                </Text>
                <Text style={[styles.textDefault, {
                    marginHorizontal: 20, fontSize: 16,
                    marginTop: 20, color: '#67806D',
                }]}>
                    <Text>nofuss.exe@gmail.com</Text>
                </Text>
                <Text style={[styles.textDefault, {
                    marginHorizontal: 20, fontSize: 16,
                    marginTop: 20, color: '#67806D',
                }]}>
                    <Text>We're always on the lookout for ways to improve the app.</Text>
                </Text>



            </View>

            <Image
                source={img}
                resizeMode='stretch'
                style={{
                    maxWidth: width * 0.9, maxHeight: 75, position: 'absolute',
                    borderTopLeftRadius: BORDER_RADIUS, borderTopRightRadius: BORDER_RADIUS
                }} />

            <Text style={[styles.title, { position: 'absolute' }]}>Help and Support</Text>
            <View style={styles.backContainer}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={toggleFunction}>

                    <Icon
                        name="close-outline"
                        type='ionicon'
                        size={35}
                        color='white' />
                    {/*<Text style={styles.backButtonText}>X</Text>*/}
                </TouchableOpacity>
            </View>



        </View>


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
        flex: 1,
    },
    parentContainer: {
        flex: 1,
        justifyContent: 'space-around',
        backgroundColor: '#F9EAD3'
    },
    labelText: { marginLeft: 5, color: 'gray', },
    colorSquare: {
        width: 50,
        height: 50,
        marginHorizontal: 5,
        marginTop: 5,
        marginBottom: 15,
    },
    title: {
        alignSelf: 'center',
        margin: 20,
        marginBottom: 50,
        fontSize: 25,
        fontWeight: 'bold',
        color: 'white',
    },
    backButton: {
        width: 50,
        height: 50,
        justifyContent: 'center',
    },
    backButtonText: {
        alignSelf: 'center',
        fontWeight: 'bold',
        fontSize: 25,
        color: 'white',

    },
    backContainer: {
        flex: 1,
        width: '50%',
        position: 'absolute',
        alignSelf: 'flex-end',
        justifyContent: 'flex-end',
        alignItems: 'flex-end'
    },
    dummy: {
        flex: 0.03,
    },
    goBackChild: {
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center',
    },
    submit: {
        backgroundColor: '#FCC859',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        alignSelf: 'center',
        marginBottom: 40,
        marginTop: 30,
        shadowOffset: {
            width: 0.05,
            height: 0.05,
        },
        shadowOpacity: 0.3,
    },
    submitText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        padding: 10,
    },
    inputStyleContainer: {
        borderBottomWidth: 0,
    },
    inputStyle: {
        marginTop: 5,
        backgroundColor: 'white',
        borderRadius: 15,
        paddingHorizontal: 10,
        alignSelf: 'center',
        marginBottom: 20,
        color: 'gray',
        fontSize: 18,
        fontWeight: '600',
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
        shadowOpacity: 0.3,
    }, notes: {
        alignSelf: 'center',
        backgroundColor: 'white',
        padding: 10,
        paddingTop: 12,
        borderRadius: 10,
        marginHorizontal: 25,
        marginBottom: 20,
        height: 120,
    }, inputStyleContainer: {
        borderBottomWidth: 0,
    },
})

export default HelpandSupportModal;