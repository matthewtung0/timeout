import React, { useContext, useState } from 'react';
import {
    View, StyleSheet, Text, FlatList, Dimensions, ActivityIndicator,
    TouchableOpacity, Alert, Switch
} from 'react-native';
import { Icon } from 'react-native-elements'
import { Context as CategoryContext } from '../context/CategoryContext';
const constants = require('../components/constants.json')

const ColorSelectModal = ({ toggleFunction, colorArr, selectedColorId, selectedCategoryName, selectedCategoryPublic, selectedCatId }) => {
    const { height, width } = Dimensions.get('window');
    const INPUT_WIDTH = width * 0.65
    const [editItem, setEditItem] = useState(null)
    const [chosenColorId, setChosenColorId] = useState(selectedColorId)
    const [publicToggle, setPublicToggle] = useState(selectedCategoryPublic)

    const { state: catState, changeArchiveCategory,
        changeColorCategory, deleteCategory, changePublicCategory } = useContext(CategoryContext)
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
        await changeColorCategory(selectedCatId, chosenColorId, colorChangeCallback)
        //toggleFunction();
    }

    const colorChangeCallback = () => {
        setIsLoading(false)
        alert("Color changed successfully")
    }
    // can only delete category if user does not currently have to-do items with that category
    const validateDelete = () => {
        var userItems = catState.userTodoItems
        userItemsSameCat = userItems.filter((req) => (req.category_id == selectedCatId && req.is_active == true))
        if (userItemsSameCat.length > 0) {
            console.log("VALIDATE IS FALSE")
            return false
        }
        console.log("VALIDATE IS TRUE")
        return true
    }
    const submitArchive = async (archiveBool) => {
        if (validateDelete() === false) {
            Alert.alert(
                "You currently have to-do items with this category. Delete those first before archiving this category"
            )
            return
        } else {
            setIsArchiving(true)
            try {
                await changeArchiveCategory(selectedCatId, archiveBool, archiveCallback)
            } catch (e) {
                console.log(e)
            }
        }

    }



    const submitDelete = async () => {
        if (validateDelete() === false) {
            Alert.alert(
                "You currently have to-do items with this category. Delete those first before deleting this category"
            )
            return
        } else {
            setIsArchiving(true)
            try {
                await deleteCategory(selectedCatId, deleteCallback)
            } catch (e) {
                console.log(e)
            }
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

    const publicChangeCallback = () => {
        setIsLoading(false)
        alert("Public setting updated successfully")
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
            "Are you sure you want to delete this category?",
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

    const togglePublic = async () => {
        setIsLoading(true)
        var toChangeTo = !publicToggle
        setPublicToggle(toChangeTo)
        await changePublicCategory(selectedCatId, toChangeTo, publicChangeCallback)
    }

    return (
        <>
            <View style={styles.container}>

                {/*<View style={{ backgroundColor: '#abc57e' }}>
                <Text style={{
                    alignSelf: 'center', margin: 20, fontSize: 25, fontWeight: 'bold', color: 'white',
                }}>Edit Category</Text>
            </View>*/}

                <View style={{}}>
                    <View
                        style={[styles.titleContainer, {
                            width: INPUT_WIDTH, height: 45,
                            backgroundColor: constants.colors[chosenColorId],
                        }]}>
                        <Text style={styles.title}>{selectedCategoryName}</Text>
                    </View>
                    <Text style={[styles.modalMargin, { fontSize: 18, marginBottom: 5, }]}>Color Selection</Text>
                    <FlatList
                        style={{
                            paddingBottom: 3, marginLeft: 5, width: width / 1.4,
                            borderWidth: 0.5, borderColor: 'gray', borderRadius: 5, alignSelf: 'center',
                        }}
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
                    />
                    <View opacity={isLoading ? 0.3 : 1}>
                        <TouchableOpacity style={[styles.updateColorButton, { width: width / 1.8 }]}
                            onPress={submitColorChange}>
                            <Text style={styles.addCategoryText}>Update Color</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={{ alignSelf: 'center' }}>{isLoading ? "Updating Color.." : ""}</Text>
                    {separator()}
                </View>


                <View style={{}}>
                    <Text style={[styles.modalMargin, { fontSize: 18, marginBottom: 10, }]}>Public Setting</Text>

                    <Switch
                        style={{ marginHorizontal: 10 }}
                        disabled={isLoading}
                        trackColor={{ false: "#ABC57E", true: "#ABC57E" }}
                        thumbColor={selectedCategoryPublic ? "#67806D" : "#67806D"}
                        //ios_backgroundColor="#ABC57E"
                        onValueChange={togglePublic}
                        value={publicToggle}
                    />
                    {publicToggle ?
                        <Text style={[styles.modalMargin, { marginBottom: 10, }]}>Category is public - your friends will be able to see it on your profile.</Text>
                        :
                        <Text style={[styles.modalMargin, { marginBottom: 10, }]}>Category is private - it will not be shown on your profile.</Text>
                    }

                    {separator()}
                </View>

                <View style={{}}>
                    <Text style={[styles.modalMargin, { fontSize: 18, marginBottom: 10, }]}>Archive Category</Text>
                    <Text style={[styles.modalMargin, { marginBottom: 10, }]}>You can archive categories to hide them from your summary views and dropdown list. They will still be counted in your statistics.</Text>

                    <TouchableOpacity style={[styles.updateColorButton, {
                        width: width / 1.8, backgroundColor: '#F5BBAE',
                    }]}
                        onPress={() => {

                            areYouSureArchive()
                        }}>
                        <Text style={styles.addCategoryText}>Archive Category</Text>
                    </TouchableOpacity>

                    <Text style={{ alignSelf: 'center' }}>{isArchiving ? "Archiving.." : ""}</Text>

                    {separator()}

                    <TouchableOpacity style={[styles.updateColorButton, {
                        width: width / 1.8, backgroundColor: '#F5BBAE',
                    }]}
                        onPress={() => {
                            areYouSureDelete()
                        }}>
                        <Text style={styles.addCategoryText}>Delete Category</Text>
                    </TouchableOpacity>
                </View>



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
                </TouchableOpacity>
            </View>
        </>

    )
}

const styles = StyleSheet.create({
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

export default ColorSelectModal;