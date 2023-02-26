import React, { useState } from 'react';
import {
    View, StyleSheet, Text, FlatList, Dimensions,
    TouchableOpacity, Image
} from 'react-native';
import { Icon } from 'react-native-elements'
const img = require('../../assets/tasks_topbar.png')

const OnboardCategoriesModal = ({ toggleFunction, colorArr, categoryArr, selectedColorId, callback, item }) => {
    const { height, width } = Dimensions.get('window');
    const BORDER_RADIUS = 20;
    const COLOR_WIDTH = 35;
    const [chosenColorId, setChosenColorId] = useState(selectedColorId)

    const separator = () => {
        return (
            <View
                style={{
                    borderBottomColor: '#DCDBDB',
                    borderBottomWidth: 1.5,
                    marginBottom: 10,
                }}
            />

        )
    }

    const onSubmit = () => {
        if (callback) { callback(chosenColorId) }
        toggleFunction()
    }

    return (
        <>
            <View style={[styles.container, { borderRadius: BORDER_RADIUS }]}>

                <View style={{ marginHorizontal: 20, marginTop: 80 }}>


                    <Text style={[styles.textDefaultMed, {
                        fontSize: 15, color: '#67806D',
                        marginLeft: 5, color: 'gray',
                    }]}>Category Name</Text>

                    <View style={{ marginVertical: 10, marginHorizontal: 10, marginBottom: 20, }}>
                        <View style={[styles.inputStyle, {
                            borderRadius: 20,
                            backgroundColor: 'white', shadowOffset: {
                                width: 0,
                                height: -0.2,
                            },
                            shadowOpacity: 0.1,
                        }]}>
                            <Text style={[styles.textDefaultBold, { fontSize: 16, color: '#67806D', }]}>
                                {item[1]}</Text>

                        </View>
                    </View>

                    {separator()}

                    <Text style={[styles.textDefaultMed, styles.labelText, { fontSize: 15, color: '#67806D' }]}>Color</Text>

                    <View style={{ marginVertical: 10, marginHorizontal: 10, }}>
                        <View style={{
                            borderRadius: 50,
                            backgroundColor: 'white', shadowOffset: {
                                width: 0,
                                height: -0.2,
                            },
                            shadowOpacity: 0.1,
                        }}>

                            <View
                                style={[{
                                    marginVertical: 8, marginHorizontal: COLOR_WIDTH / 2,
                                    //backgroundColor: constants.colors[chosenColor],
                                }]}
                            >
                                <FlatList
                                    horizontal={true}
                                    data={colorArr}
                                    keyExtractor={(item) => item[0]}
                                    renderItem={({ item }) => {
                                        return (
                                            <>
                                                {chosenColorId == item[0] ?
                                                    <TouchableOpacity
                                                        style={[styles.colorSquare, {
                                                            backgroundColor: item[1],
                                                            width: COLOR_WIDTH, height: COLOR_WIDTH, borderRadius: COLOR_WIDTH / 2,
                                                            borderWidth: 3, borderColor: '#67806D'
                                                        }]}
                                                        onPress={() => {
                                                            console.log("Setting chosen color id to ", item[0])
                                                            setChosenColorId(item[0])
                                                        }}
                                                    />

                                                    :
                                                    <TouchableOpacity
                                                        style={[styles.colorSquare, {
                                                            backgroundColor: item[1],
                                                            width: COLOR_WIDTH, height: COLOR_WIDTH, borderRadius: COLOR_WIDTH / 2,
                                                        }]}
                                                        onPress={() => {
                                                            console.log("Setting chosen color id to ", item[0])
                                                            setChosenColorId(item[0])
                                                        }}
                                                    />
                                                }
                                            </>
                                        )
                                    }}
                                >
                                </FlatList>
                            </View>

                        </View>
                    </View>
                    {separator()}

                    <View>
                        <TouchableOpacity style={[styles.updateColorButton, {
                            width: width / 2, backgroundColor: 'white',
                        }]}
                            onPress={() => {

                                onSubmit();

                            }}>
                            <Text style={[styles.textDefaultBold, styles.addCategoryText, { color: '#90AB72', fontSize: 19 }]}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <Image
                source={img}
                resizeMode='stretch'
                style={{
                    maxWidth: width * 0.9, maxHeight: 60, position: 'absolute',
                    borderTopLeftRadius: BORDER_RADIUS, borderTopRightRadius: BORDER_RADIUS,
                }} />

            <Text style={[styles.title, { position: 'absolute', fontSize: 24, }]}>Choose Color</Text>

            <View style={styles.backContainer}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => { toggleFunction(false) }}>

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
    textDefault: {
        fontFamily: 'Inter-Regular',
    },
    textDefaultMed: {
        fontFamily: 'Inter-Medium',
    },
    container: {
        backgroundColor: '#f6F2DF',
        alignContent: 'center',
    }, colorSquare: {
        width: 35,
        height: 35,
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
        alignItems: 'flex-end',
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
    },
    addCategoryText: {
        fontWeight: '600',
        color: 'white',
        fontSize: 18,
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
    inputStyle: {
        borderRadius: 15,
        paddingHorizontal: 15,
        paddingTop: 15,
        paddingBottom: 15,
        color: 'gray',
        fontSize: 16,
    }, colorSquare: {
        marginHorizontal: 5,
        marginTop: 5,
        marginBottom: 5,
    },
})

export default OnboardCategoriesModal;