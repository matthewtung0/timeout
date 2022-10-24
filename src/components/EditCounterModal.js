import React, { useContext, useState } from 'react';
import {
    View, StyleSheet, Text, FlatList, Dimensions, ActivityIndicator,
    TouchableOpacity, Alert
} from 'react-native';
import { Icon } from 'react-native-elements'
import { Context as CategoryContext } from '../context/CategoryContext'
import { Context as CounterContext } from '../context/CounterContext'
const constants = require('../components/constants.json')

const EditCounterModal = ({ toggleFunction, colorArr, selectedColorId, selectedCounterName, selectedCounterId }) => {
    const { height, width } = Dimensions.get('window');
    const INPUT_WIDTH = width * 0.65
    const [editItem, setEditItem] = useState(null)
    const [chosenColorId, setChosenColorId] = useState(selectedColorId)

    const { state: catState, changeArchiveCategory,
        changeColorCategory, deleteCategory, changePublicCategory } = useContext(CategoryContext)

    const { deleteCounter, changeColorCounter, changeArchiveCounter } = useContext(CounterContext)
    const [isLoading, setIsLoading] = useState(false)
    const [isArchiving, setIsArchiving] = useState(false)


    let colorSquare = (item) => {
        return (
            <TouchableOpacity
                style={[styles.colorSquare, { backgroundColor: item[1] }]}
                onPress={() => {
                    setChosenColorId(item[0])
                    /*var chosenColorId = item[0]
                    callback(chosenColorId)
                    toggleFunction();*/
                }}
            />
        )
    }

    const submitColorChange = async () => {
        setIsLoading(true)
        await changeColorCounter(selectedCounterId, chosenColorId, colorChangeCallback)
        //toggleFunction();
    }

    const colorChangeCallback = () => {
        setIsLoading(false)
        alert("Color changed successfully")
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
    const deleteCallback = () => {
        setIsArchiving(false)
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
            <Text style={[styles.modalMargin, { fontSize: 18, marginBottom: 5, }]}>Color Selection</Text>
            < FlatList
                style={{ paddingBottom: 3, marginLeft: 5, width: width / 2 }}
                horizontal={true}
                data={colorArr}
                keyExtractor={(item) => item[0]}
                renderItem={({ item }) => {
                    return (
                        <View style={item[0] === chosenColorId ? [styles.selectOutline, { backgroundColor: 'gray' }] :
                            styles.selectOutline} >
                            {colorSquare(item)}
                        </View>
                    )
                }}
            >
            </FlatList>
            <View opacity={isLoading ? 0.3 : 1}>
                <TouchableOpacity style={[styles.updateColorButton, { width: width / 1.8 }]}
                    onPress={submitColorChange}>
                    <Text style={styles.addCategoryText}>Update Color</Text>
                </TouchableOpacity>
            </View>

            <Text style={{ alignSelf: 'center' }}>{isLoading ? "Updating Color.." : ""}</Text>
            {separator()}

            <TouchableOpacity style={[styles.updateColorButton, {
                width: width / 1.8, backgroundColor: '#F5BBAE',
            }]}
                onPress={() => { areYouSureDelete() }}>
                <Text style={styles.addCategoryText}>Delete Category</Text>
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
    container: {
        backgroundColor: '#f6F2DF',
        alignContent: 'center'
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
        shadowOpacity: 0.6,
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
})

export default EditCounterModal;