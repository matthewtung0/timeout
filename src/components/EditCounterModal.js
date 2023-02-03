import React, { useContext, useState } from 'react';
import {
    View, StyleSheet, Text, FlatList, Dimensions, ActivityIndicator, Image,
    TouchableOpacity, Alert
} from 'react-native';
import { Icon } from 'react-native-elements'
import { startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { Context as CounterContext } from '../context/CounterContext'
import { Context as SessionContext } from '../context/SessionContext'
const constants = require('../components/constants.json')
const COLOR_WIDTH = 40;
const BORDER_RADIUS = 20;
const img = require('../../assets/tasks_topbar.png')
const yellowCheckmark = require('../../assets/yellow_checkmark.png')

const EditCounterModal = ({ toggleFunction, colorArr, selectedColorId, selectedCounterName, selectedCounterId,
    updateColorCallback2, deleteCounterCallback2
}) => {
    const { height, width } = Dimensions.get('window');
    const INPUT_WIDTH = width * 0.65
    const [editItem, setEditItem] = useState(null)
    const [chosenColorId, setChosenColorId] = useState(selectedColorId)

    const { fetchMultipleMonths, resetCalendarDate, setOffsetFetched, setCurOffset, setHardReset } = useContext(SessionContext)
    const { deleteCounter, changeColorCounter, changeArchiveCounter } = useContext(CounterContext)
    const [isLoading, setIsLoading] = useState(false)
    const [deleteToggle, setDeleteToggle] = useState(false)
    const [isArchiving, setIsArchiving] = useState(false)

    const submitColorChange = async () => {
        setIsLoading(true)
        if (chosenColorId == selectedColorId) {
            setIsLoading(false)
            toggleFunction();
            alert("Counter edited successfully")
        } else {
            await changeColorCounter(selectedCounterId, chosenColorId, updateColorCallback)
        }
    }

    const updateColorCallback = async () => {
        if (selectedColorId != chosenColorId) {
            var dt = new Date()
            var endTime = endOfMonth(dt)
            var startTime = startOfMonth(subMonths(startOfMonth(dt), 3))

            // hard reset of the history screen needed
            await fetchMultipleMonths(startTime, endTime, null, true).then(
                await resetCalendarDate(startOfMonth(dt)).then(
                    await setOffsetFetched(3).then(
                        await setCurOffset(0)
                    )
                )
            )
            updateColorCallback2(chosenColorId);
        }
        setIsLoading(false)
        toggleFunction();
        alert("Counter edited successfully")

    }

    const submitDelete = async () => {
        setIsArchiving(true)
        try {
            await deleteCounter(selectedCounterId, deleteCallback)
        } catch (e) { console.log(e) }
    }

    const deleteCallback = async () => {
        setIsArchiving(false)
        await deleteCounterCallback2(selectedCounterId)
        toggleFunction()
        alert("Deleted successfully")
    }

    const toggleDelete = () => {
        setDeleteToggle(!deleteToggle)
    }

    const areYouSureDelete = () => {
        Alert.alert(
            "Are you sure you want to delete this counter?",
            "",
            [{ text: "Go back", onPress: () => { }, style: "cancel" },
            { text: "Delete", onPress: () => { submitDelete() } }]
        );
    }

    const separator = () => {
        return (
            <View
                style={{
                    borderBottomColor: '#DCDBDB',
                    //borderBottomWidth: StyleSheet.hairlineWidth,
                    borderBottomWidth: 1.5,
                    marginBottom: 10,
                }}
            />

        )
    }

    return (

        <>
            <View style={[styles.container, { borderRadius: BORDER_RADIUS }]}>

                <View style={{ marginHorizontal: 20, marginTop: 90 }}>

                    <Text style={[styles.textDefaultBold, {
                        fontSize: 16, color: '#67806D',
                        marginLeft: 5, color: 'gray',
                    }]}>Counter Name</Text>


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
                                {selectedCounterName}</Text>

                        </View>
                    </View>

                    <Text style={[styles.textDefaultBold, styles.labelText, { fontSize: 16, color: '#67806D' }]}>Color</Text>
                    <View style={{ marginVertical: 10, marginHorizontal: 10, marginBottom: 20, }}>
                        <View style={{
                            borderRadius: 50,
                            backgroundColor: 'white', shadowOffset: {
                                width: 0,
                                height: -0.2,
                            },
                            shadowOpacity: 0.3,
                        }}>

                            <View
                                style={[{
                                    marginVertical: 5, marginHorizontal: COLOR_WIDTH / 2,
                                    //backgroundColor: constants.colors[chosenColor],
                                }]}
                            >
                                < FlatList
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
                                                        onPress={() => { setChosenColorId(item[0]) }}
                                                    />

                                                    :
                                                    <TouchableOpacity
                                                        style={[styles.colorSquare, {
                                                            backgroundColor: item[1],
                                                            width: COLOR_WIDTH, height: COLOR_WIDTH, borderRadius: COLOR_WIDTH / 2,
                                                        }]}
                                                        onPress={() => { setChosenColorId(item[0]) }}
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
                    <Text style={[styles.textDefaultBold, {
                        fontSize: 16, color: '#67806D',
                    }]}>Delete Counter</Text>
                    <View style={{ flexDirection: 'row', marginVertical: 10, marginHorizontal: 10, }}>
                        <TouchableOpacity
                            onPress={() => {
                                toggleDelete();
                            }}>
                            {deleteToggle ?

                                <Image
                                    source={yellowCheckmark}
                                    style={{ width: 25, height: 25, marginRight: 10, }} />
                                :
                                <View style={{
                                    width: 23, height: 25, marginRight: 12, borderRadius: 5, borderColor: '#FCC759',
                                    borderWidth: 5
                                }}></View>}
                        </TouchableOpacity>

                        <Text style={[styles.textDefault,
                        { color: 'red', marginHorizontal: 5, fontSize: 12, }]}>
                            Remove counter. Previous tallies will still show in history view and statistics.</Text>
                    </View>
                    <View opacity={isLoading ? 0.2 : 1}>
                        <TouchableOpacity
                            style={[styles.updateColorButton, {
                                width: width / 2, backgroundColor: 'white',
                            }]}
                            onPress={() => {
                                if (isLoading) { return }
                                if (deleteToggle) {
                                    var res = areYouSureDelete()
                                    if (res == false) { return }
                                }
                                else {
                                    submitColorChange();
                                }
                            }}>
                            <Text style={[styles.textDefaultBold, styles.addCategoryText, { color: '#90AB72' }]}>OK</Text>
                        </TouchableOpacity>
                    </View>


                    {isLoading ? <ActivityIndicator
                        style={{ marginBottom: 10, }}
                        size="large"
                        color="gray" /> : null}
                </View>

            </View>

            <Image
                source={img}
                resizeMode='stretch'
                style={{
                    maxWidth: width * 0.9, maxHeight: 75, position: 'absolute',
                    borderTopLeftRadius: BORDER_RADIUS, borderTopRightRadius: BORDER_RADIUS,
                }} />

            <Text style={[styles.title, { position: 'absolute' }]}>Edit Counter</Text>

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
    labelText: { marginLeft: 5, color: 'gray', },
    inputStyle: {
        borderRadius: 15,
        paddingHorizontal: 15,
        paddingTop: 15,
        paddingBottom: 15,
        color: 'gray',
        fontSize: 16,
    },
})

export default EditCounterModal;