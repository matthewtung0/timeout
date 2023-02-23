import React, { useState, useContext } from 'react';
import {
    View, StyleSheet, Text, TouchableOpacity, Dimensions, Image, TextInput, ActivityIndicator,
} from 'react-native';
import { Icon } from 'react-native-elements'
const img = require('../../assets/tasks_topbar.png')

const EditSessionTimeModal = ({ toggleFunction,
    activityName, numMins, callback }) => {
    const BORDER_RADIUS = 20;
    const { height, width } = Dimensions.get('window');
    const [isLoading, setIsLoading] = useState(false)
    const [mins, setMins] = useState(numMins % 60);
    const [hours, setHours] = useState(Math.floor(numMins / 60));

    const [isAdd, setIsAdd] = useState(true)
    console.log(mins)

    const formatTwoDigits = (min_) => {
        /*(if (min_ < 10) {
            return "0" + String(min_)
        }*/
        return String(min_)
    }

    return (
        <View style={[styles.container, { width: width * 0.9, alignSelf: 'center' }]}>

            <View style={{ flex: 1, backgroundColor: '#F5F5F5', borderRadius: BORDER_RADIUS }}>

                <View style={{ marginHorizontal: 20, marginTop: 90, alignItems: 'center', }}>

                    <View>
                        {isLoading ?
                            <ActivityIndicator
                                style={[styles.inputStyle, {
                                    paddingVertical: 10, backgroundColor: '#F5F5F5',
                                    fontSize: 40,//backgroundColor: constants.colors[chosenColor],
                                }]}
                                size="large" color="gray" />
                            :
                            <View style={{
                                flexDirection: 'row', borderWidth: 0,
                                alignItems: 'center', width: '90%', justifyContent: 'center',
                            }}>

                                <TextInput
                                    style={[styles.inputStyle, {
                                        flex: 1,
                                        paddingVertical: 10, backgroundColor: '#F5F5F5', borderColor: '#67806D',
                                        fontSize: 40, borderWidth: 1,//backgroundColor: constants.colors[chosenColor],
                                    }]}
                                    inputContainerStyle={styles.inputStyleContainer}
                                    keyboardType={"number-pad"}
                                    returnKeyType="done"
                                    editable={true}
                                    autoFocus={false}
                                    maxLength={1}
                                    //placeholder={numMins == 60 ? "1" : "0"}
                                    placeholderTextColor={'gray'}
                                    defaultValue={String(hours)}
                                    value={hours}
                                    onChangeText={setHours}
                                />
                                <View style={[styles.textDefaultMed, {
                                    flex: 3, marginLeft: 5,
                                }]}><Text style={[styles.textDefaultMed, {
                                    fontSize: 18, color: '#67806D',
                                }]}>hours</Text>
                                </View>


                                <TextInput
                                    style={[styles.inputStyle, {
                                        paddingVertical: 10, backgroundColor: '#F5F5F5',
                                        flex: 2, borderWidth: 1, borderColor: '#67806D',
                                        fontSize: 40,//backgroundColor: constants.colors[chosenColor],
                                    }]}
                                    inputContainerStyle={styles.inputStyleContainer}
                                    keyboardType={"number-pad"}
                                    returnKeyType="done"
                                    editable={true}
                                    autoFocus={false}
                                    maxLength={2}
                                    //placeholder={String(numMins)}
                                    placeholderTextColor={'gray'}
                                    defaultValue={formatTwoDigits(mins)}

                                    value={numMins}
                                    onChangeText={setMins}
                                />
                                <View style={[styles.textDefaultMed, { flex: 3, marginLeft: 5, }]}>
                                    <Text style={[styles.textDefaultMed, {
                                        fontSize: 18, color: '#67806D',
                                    }]}>minutes</Text>
                                </View>


                            </View>

                        }
                    </View>


                    <View opacity={isLoading ? 0.3 : 1}>
                        <TouchableOpacity
                            style={[styles.submit, { width: width / 2.6, marginTop: 20, }]}
                            onPress={async () => {
                                callback(mins, hours);
                                toggleFunction();
                            }}>
                            <Text style={styles.submitText}>OK</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>

            <Image
                source={img}
                resizeMode='stretch'
                style={{
                    maxWidth: width * 0.9, maxHeight: 75, position: 'absolute', borderTopLeftRadius: BORDER_RADIUS,
                    borderTopRightRadius: BORDER_RADIUS,
                }} />

            <Text style={[styles.title, { position: 'absolute' }]}>Edit duration</Text>
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
    },
    textDefaultMed: {
        fontFamily: 'Inter-Medium',
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
        shadowOffset: {
            width: 0.05,
            height: 0.05,
        },
        shadowOpacity: 0.15,
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
    }
})

export default EditSessionTimeModal;