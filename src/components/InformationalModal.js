import React, { } from 'react';
import {
    View, StyleSheet, Text, TouchableOpacity, Dimensions, Image,
} from 'react-native';
import { Icon } from 'react-native-elements'
const img = require('../../assets/tasks_topbar.png')

const InformationalModal = ({ toggleFunction, callback }) => {
    const { height, width } = Dimensions.get('window');
    const BORDER_RADIUS = 20;

    return (
        <View style={[styles.container, { width: width * 0.9, alignSelf: 'center' }]}>
            <View style={{ flex: 1, backgroundColor: '#F9EAD3', borderRadius: BORDER_RADIUS }}>
                <View style={{ marginHorizontal: 20, marginTop: 90, }}>
                    <Text style={[styles.textDefaultMed, styles.labelText, { fontSize: 16, color: '#67806D' }]}>
                        Use this option if you have a task you want to work on right now.
                    </Text>

                    <Text style={[styles.textDefaultMed, styles.labelText, { fontSize: 16, color: '#67806D', marginTop: 10, }]}>
                        Enter a new task and a category for that task, or pick from your existing to-do list (the "+" symbol
                        on the lefthand side).
                    </Text>

                </View>
            </View>

            <Image
                source={img}
                resizeMode='stretch'
                style={{
                    maxWidth: width * 0.9, maxHeight: 75, position: 'absolute', borderTopLeftRadius: BORDER_RADIUS,
                    borderTopRightRadius: BORDER_RADIUS,
                }} />

            <Text style={[styles.title, { position: 'absolute' }]}>Start a Task Now</Text>
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


        </View >
    )

}

const styles = StyleSheet.create({
    textDefaultBold: {
        fontFamily: 'Inter-Bold',
    },
    textDefault: {
        fontFamily: 'Inter-Regular',
    }, textDefaultMed: {
        fontFamily: 'Inter-Medium',
    },
    container: {
        flex: 1,
    },
    parentContainer: {
        flex: 1,
        justifyContent: 'space-around',
    },
    labelText: { marginLeft: 5, color: 'gray', },
    colorSquare: {
        marginHorizontal: 5,
        marginTop: 5,
        marginBottom: 5,
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
        shadowOpacity: 0.1,
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
        borderRadius: 15,
        paddingHorizontal: 15,
        paddingTop: 15,
        paddingBottom: 15,
        color: 'gray',
        fontSize: 16,
    },
})

export default InformationalModal;