import React, { useContext, useState } from 'react';
import {
    View, StyleSheet, Text, FlatList, Dimensions, ActivityIndicator,
    TouchableOpacity, Alert
} from 'react-native';
import { Icon } from 'react-native-elements'
import { startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { Context as CounterContext } from '../context/CounterContext'
import { Context as SessionContext } from '../context/SessionContext'
const constants = require('../components/constants.json')
const COLOR_WIDTH = 40;
const BORDER_RADIUS = 20;
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

    const submitArchive = async (archiveBool) => {
        setIsArchiving(true)
        try {
            await changeArchiveCounter(selectedCounterId, archiveBool, archiveCallback)
        } catch (e) {
            console.log(e)
        }
    }

    const submitDelete = async () => {
        setIsArchiving(true)
        try {
            await deleteCounter(selectedCounterId, deleteCallback)
        } catch (e) {
            console.log(e)
        }
    }

    const archiveCallback = () => {
        setIsArchiving(false)
        alert("Archived successfully")
    }
    const deleteCallback = async () => {
        setIsArchiving(false)
        await deleteCounterCallback2(selectedCounterId)
        toggleFunction()
        alert("Deleted successfully")
    }

    const areYouSureArchive = () => {
        Alert.alert(
            "Are you sure you want to archive this?",
            "",
            [
                {
                    text: "Go back", onPress: () => { }, style: "cancel"
                },
                {
                    text: "Archive", onPress: () => { submitArchive(true) }
                }
            ]
        );
    }

    const areYouSureDelete = () => {
        Alert.alert(
            "Are you sure you want to delete this counter?",
            "",
            [
                {
                    text: "Go back", onPress: () => { }, style: "cancel"
                },
                {
                    text: "Delete", onPress: () => { submitDelete() }
                }
            ]
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
        <View style={styles.container}>
            <View
                style={[styles.titleContainer, {
                    width: INPUT_WIDTH, height: 45,
                    backgroundColor: constants.colors[chosenColorId],
                }]}>
                <Text style={styles.title}>{selectedCounterName}</Text>
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

            <View opacity={isLoading ? 0.3 : 1}>
                <TouchableOpacity style={[styles.updateColorButton, { width: width / 1.8 }]}
                    onPress={submitColorChange}>
                    <Text style={[styles.textDefaultBold, styles.addCategoryText]}>Update Color</Text>
                </TouchableOpacity>
            </View>

            <Text style={{ alignSelf: 'center' }}>{isLoading ? "Updating Color.." : ""}</Text>
            {separator()}

            <TouchableOpacity style={[styles.updateColorButton, {
                width: width / 1.8, backgroundColor: '#F5BBAE',
            }]}
                onPress={() => { areYouSureDelete() }}>
                <Text style={[styles.textDefaultBold, styles.addCategoryText]}>Delete Counter</Text>
            </TouchableOpacity>

            <View style={styles.backContainer}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={toggleFunction}>

                    <Icon
                        name="close-outline"
                        type='ionicon'
                        size={35}
                        color='black' />
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
        fontSize: 18,
        fontWeight: '600',
        color: 'gray',
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
})

export default EditCounterModal;