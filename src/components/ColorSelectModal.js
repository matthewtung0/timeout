import React, { useContext, useState } from 'react';
import {
    View, StyleSheet, Text, FlatList, Dimensions, ActivityIndicator,
    TouchableOpacity, Alert, Image
} from 'react-native';
import { startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { Icon } from 'react-native-elements'
import { Context as CategoryContext } from '../context/CategoryContext';
import { Context as SessionContext } from '../context/SessionContext';
const img = require('../../assets/tasks_topbar.png')
const yellowCheckmark = require('../../assets/yellow_checkmark.png')

const ColorSelectModal = ({ toggleFunction, colorArr, selectedColorId,
    selectedCategoryName, selectedCategoryPublic, selectedCatId }) => {
    const { height, width } = Dimensions.get('window');
    const INPUT_WIDTH = width * 0.65
    const BORDER_RADIUS = 20;
    const COLOR_WIDTH = 40;
    const [chosenColorId, setChosenColorId] = useState(selectedColorId)
    const [publicToggle, setPublicToggle] = useState(selectedCategoryPublic)
    const { fetchMultipleMonths, resetCalendarDate, setOffsetFetched, setCurOffset } = useContext(SessionContext)
    const [archiveToggle, setArchiveToggle] = useState(false)
    const [deleteToggle, setDeleteToggle] = useState(false)

    const { state: catState, deleteCategory, editCategory } = useContext(CategoryContext)
    const [isLoading, setIsLoading] = useState(false)
    const [isArchiving, setIsArchiving] = useState(false)
    const errorReset = () => {
        setIsLoading(false)
    }
    const submitEdit = async () => {
        setIsLoading(true)
        // handle changes to public setting and color
        await editCategory({
            categoryId: selectedCatId,
            newColorId: chosenColorId, toPublic: publicToggle, toArchive: archiveToggle, callback: editCallback,
            errorCallback: errorReset,
        })
    }

    const editCallback = async () => {
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
            toggleFunction(true)
        } else {

            toggleFunction(true)
        }
        setIsLoading(false)
        alert("Category edited successfully")
    }

    const colorChangeCallback = async () => {
        var endTime = endOfMonth(state.calendarDate)
        var startTime = startOfMonth(subMonths(startOfMonth(state.calendarDate), 3))
        await fetchMultipleMonths(startTime, endTime, null, true).then(
            setIsLoading(false)
        )
        alert("Color changed successfully")
    }
    // can only delete category if user does not currently have to-do items with that category
    const validateDelete = () => {
        var userItems = catState.userTodoItems
        var userItemsSameCat = userItems.filter((req) => (req.category_id == selectedCatId && req.is_active == true))
        if (userItemsSameCat.length > 0) {
            console.log("VALIDATE IS FALSE")
            return false
        }
        console.log("VALIDATE IS TRUE")
        return true
    }

    const submitDelete = async () => {
        setIsArchiving(true)
        setIsLoading(true)
        try {
            await deleteCategory(selectedCatId, deleteCallback, errorReset)
        } catch (e) {
            console.log(e)
        }
    }

    const archiveCallback = () => {
        setIsArchiving(false)
        setIsLoading(false)
        alert("Archived successfully")
    }
    const deleteCallback = () => {
        setIsArchiving(false)
        toggleFunction(true)
        setIsLoading(false);
        alert("Deleted successfully")
    }


    const areYouSureArchive = () => {
        Alert.alert(
            "Are you sure you want to archive this?",
            "",
            [
                {
                    text: "Go back", onPress: () => { return false }, style: "cancel"
                },
                {
                    text: "Archive", onPress: () => { submitEdit(); }//submitArchive(true) }
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
                    text: "Go back", onPress: () => { return false }, style: "cancel"
                },
                {
                    text: "Delete", onPress: () => { submitDelete(); }
                }
            ]
        );
    }

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

    const togglePublic = async () => {
        //setIsLoading(true)
        var toChangeTo = !publicToggle
        setPublicToggle(toChangeTo)
        //await changePublicCategory(selectedCatId, toChangeTo, publicChangeCallback)
    }

    const toggleArchive = () => {
        var toChangeTo = !archiveToggle
        setArchiveToggle(!archiveToggle)
        // cannot have both archive and delete selected
        if (toChangeTo == true && deleteToggle == true) {
            setDeleteToggle(false)
        }
    }

    const toggleDelete = () => {
        var toChangeTo = !deleteToggle
        setDeleteToggle(!deleteToggle)
        // cannot have both archive and delete selected
        if (toChangeTo == true && archiveToggle == true) {
            setArchiveToggle(false)
        }
    }

    return (
        <>
            <View style={[styles.container, { borderRadius: BORDER_RADIUS }]}>

                {/*<View style={{ backgroundColor: '#abc57e' }}>
                <Text style={{
                    alignSelf: 'center', margin: 20, fontSize: 25, fontWeight: 'bold', color: 'white',
                }}>Edit Category</Text>
            </View>*/}

                <View style={{ marginHorizontal: 20, marginTop: 90 }}>


                    <Text style={[styles.textDefaultBold, {
                        fontSize: 16, color: '#67806D',
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
                                {selectedCategoryName}</Text>

                        </View>
                    </View>

                    {separator()}

                    <Text style={[styles.textDefaultBold, styles.labelText, { fontSize: 16, color: '#67806D' }]}>Color</Text>

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
                                    marginVertical: 5, marginHorizontal: COLOR_WIDTH / 2,
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
                        marginTop: 10,
                    }]}>Public Setting</Text>

                    <View style={{ flexDirection: 'row', marginVertical: 10, marginHorizontal: 10, }}>

                        <TouchableOpacity
                            onPress={() => {
                                togglePublic()
                            }}>
                            {publicToggle ?

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
                        { color: '#67806D', marginHorizontal: 5, fontSize: 12, }]}>
                            Category is public - your friends will be able to see it on their feed and your profile.</Text>
                    </View>
                    {separator()}
                    <Text style={[styles.textDefaultBold, {
                        fontSize: 16, color: '#67806D',
                    }]}>Archive Category</Text>
                    <View style={{ flexDirection: 'row', marginVertical: 10, marginHorizontal: 10, }}>
                        <TouchableOpacity
                            onPress={() => {
                                toggleArchive();
                            }}>
                            {archiveToggle ?

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
                        { color: '#67806D', marginHorizontal: 5, fontSize: 12, }]}>
                            Archive category to hide from your summary view and dropdown list. They will still be inclued in your statistics.</Text>
                    </View>
                    {separator()}
                    <Text style={[styles.textDefaultBold, {
                        fontSize: 16, color: '#67806D',
                    }]}>Delete Category</Text>
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
                            Remove category. Previous tasks will still be included in summary view and statistics.</Text>
                    </View>

                    <View opacity={isLoading ? 0.2 : 1}>
                        <TouchableOpacity style={[styles.updateColorButton, {
                            width: width / 2, backgroundColor: 'white',
                        }]}
                            onPress={() => {
                                if (deleteToggle) {
                                    if (validateDelete() === false) {
                                        Alert.alert(
                                            "You currently have to-do items with this category. Delete those first before deleting this category"
                                        )
                                        return
                                    }
                                    var res = areYouSureDelete()
                                    if (res == false) { return }

                                } else if (archiveToggle) {
                                    if (validateDelete() === false) {
                                        Alert.alert(
                                            "You currently have to-do items with this category. Delete those first before archiving this category"
                                        )
                                        return
                                    }
                                    var res = areYouSureArchive()
                                    if (res == false) { return }
                                }
                                else {
                                    submitEdit();
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

            <Text style={[styles.title, { position: 'absolute' }]}>Edit Category</Text>

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

export default ColorSelectModal;