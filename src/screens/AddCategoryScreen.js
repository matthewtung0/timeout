import React, { useState, useContext } from 'react';
import {
    View, StyleSheet, Text, TouchableOpacity, ScrollView,
    Keyboard, TouchableWithoutFeedback, Image, Dimensions, Alert
} from 'react-native';
import { Icon } from 'react-native-elements';
import { Context as CategoryContext } from '../context/CategoryContext';
import { Context as UserContext } from '../context/userContext';
import ColorSelectModal from '../components/ColorSelectModal';
import Modal from 'react-native-modal'
import AddCategoryModal from '../components/AddCategoryModal';
import Header from '../components/Header';
const constants = require('../components/constants.json')
const img = require('../../assets/tasks_topbar.png')
const bg_bottom = require('../../assets/background_sidebar.png')

const HideKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>
);

const AddCategoryScreen = ({ navigation }) => {
    const { height, width } = Dimensions.get('window');
    const { state: catState, changeArchiveCategory } = useContext(CategoryContext)
    const { state: userState } = useContext(UserContext)
    const [selectedCatId, setSelectedCatId] = useState('')
    const [selectedColorId, setSelectedColorId] = useState('')
    const [selectedName, setSelectedName] = useState('')
    const [selectedCategoryPublic, setSelectedCategoryPublic] = useState('')
    const [modalVisible, setModalVisible] = useState(false)
    const [addCategoryModalVisible, setAddCategoryModalVisible] = useState(false)
    const [induceRender, setInduceRender] = useState(0)

    var colorArr = []
    //let colors = JSON.parse(constants.colors)
    for (var i in constants['colors']) {
        colorArr.push([i, constants['colors'][i]])
    }

    const toggleModal = (rerender) => {
        setModalVisible(!modalVisible);
        if (rerender) {
            setInduceRender(induceRender + 1)
        }
    };

    const toggleAddCategoryModal = () => {
        setAddCategoryModalVisible(!addCategoryModalVisible)
    }
    const unarchiveCallback = () => {
        alert("Category unarchived")
    }

    const areYouSureUnarchive = (category_id) => {
        Alert.alert(
            "Unarchive this category?",
            "",
            [{ text: "Go back", onPress: () => { }, style: "cancel" },
            { text: "Unarchive", onPress: () => { changeArchiveCategory(category_id, false, unarchiveCallback) } }]
        );
    }

    return (
        <HideKeyboard>
            {userState.errorMessage && 0 ?
                <><View style={{ flex: 1, marginTop: 50, alignContent: 'center', justifyContent: 'center', }}>
                    <Text style={{ color: 'grey', fontSize: 18, textAlign: 'center', }}>
                        Categories are currently unavailable. Please check your internet connection.</Text>
                </View>
                    <>
                        <Header
                            navigation={navigation} />
                    </>
                </>
                :
                <>
                    <View style={{
                        position: 'absolute', flex: 1, width: '100%', height: '100%',
                        justifyContent: 'flex-end',
                    }}>
                        <Image
                            source={bg_bottom}
                            style={{ width: '100%', height: 50, }}
                            resizeMode="cover"
                        />
                    </View>

                    <ScrollView
                        style={{}}>

                        <Modal isVisible={modalVisible}
                            animationIn='slideInLeft'
                            animationOut='slideOutLeft'
                            backdropTransitionOutTiming={0}>

                            <View style={{
                                flex: 1,
                                flexDirection: 'column',
                                justifyContent: 'center'
                            }}>
                                <View style={{
                                    height: height * 0.8
                                }}>
                                    <ColorSelectModal
                                        toggleFunction={toggleModal}
                                        colorArr={colorArr}
                                        selectedColorId={selectedColorId}
                                        selectedCategoryName={selectedName}
                                        selectedCategoryPublic={selectedCategoryPublic}
                                        selectedCatId={selectedCatId} />
                                </View>

                            </View>

                        </Modal>

                        <Modal isVisible={addCategoryModalVisible}
                            animationIn='slideInUp'
                            animationOut='slideOutUp'
                            backdropTransitionOutTiming={0}>

                            <View style={{
                                flex: 1,
                                flexDirection: 'column',
                                justifyContent: 'center'
                            }}>
                                <View style={{
                                    height: height * 0.7
                                }}>
                                    <AddCategoryModal
                                        toggleFunction={toggleAddCategoryModal}
                                        colorArr={colorArr}
                                    />
                                </View>
                            </View>
                        </Modal>

                        <Text style={[styles.textDefaultBold,
                        { marginLeft: 25, marginTop: 120, fontSize: 20, color: '#67806D' }]}>Active Categories</Text>
                        <View style={styles.categoryContainer}>
                            {catState.userCategories
                                .filter((item) => (!item['archived'] && item.category_name !== 'Unsorted'))
                                .sort(function (a, b) {
                                    return String(a.category_name).localeCompare(String(b.category_name))
                                })
                                .map((item) => {
                                    return (
                                        <View
                                            key={item.category_id}
                                            style={{ height: 40, }}>
                                            <View style={{ flexDirection: 'row', flex: 1, marginBottom: 5, }}>

                                                <View style={{ flex: 1, marginRight: 10, }}>
                                                    {item.public ?
                                                        <Icon name='eye-outline' type='ionicon' size={20} color='#67806D' />
                                                        :
                                                        <Icon name='eye-off-outline' type='ionicon' size={20} color='#67806D' />
                                                    }

                                                </View>

                                                <View style={{ flex: 8, }}>
                                                    <Text style={[styles.textDefault,
                                                    { color: '#67806D', fontSize: 15, }]}>{item['category_name']}</Text>
                                                </View>

                                                <View style={{ flex: 1, }}>
                                                    <View style={{ backgroundColor: constants.colors[item['color_id']], height: 20, width: 20, }} />
                                                </View>

                                                <View style={{ flex: 1, }}>
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            if (userState.errorMessage) {
                                                                alert("Currently unable to edit category. Please check your internet connection")
                                                            } else {
                                                                setSelectedCatId(item.category_id)
                                                                setSelectedColorId(item.color_id)
                                                                setSelectedName(item.category_name)
                                                                setSelectedCategoryPublic(item.public)
                                                                toggleModal()
                                                            }

                                                        }}>
                                                        <Icon name='pencil-outline' type='ionicon' size={20} color='#67806D' />
                                                    </TouchableOpacity>
                                                </View>

                                            </View>

                                            <View
                                                style={{
                                                    borderBottomColor: '#DCDBDB',
                                                    //borderBottomWidth: StyleSheet.hairlineWidth,
                                                    borderBottomWidth: 1.5,
                                                    marginBottom: 10,
                                                }}
                                            />
                                        </View>
                                    )
                                })}
                        </View>

                        <TouchableOpacity style={[styles.addCategoryButton, { width: width / 1.8 }]}
                            onPress={() => {
                                if (userState.errorMessage) {
                                    alert("Currently unable to add new category. Please check your internet connection")
                                } else {
                                    toggleAddCategoryModal();
                                }
                                //addCategory(categoryName, new Date(), chosenColor, isEnabled, resetInputs)
                            }}>
                            <Text style={styles.addCategoryText}>Add Category</Text>
                        </TouchableOpacity>

                        <Text style={[styles.textDefaultBold,
                        { marginLeft: 25, marginTop: 10, fontSize: 20, color: '#67806D' }]}>Archived Categories</Text>

                        <View style={styles.categoryContainer}>
                            {catState.userCategories.filter((item) => item['archived'])
                                .sort(function (a, b) {
                                    return String(a.category_name).localeCompare(String(b.category_name))
                                })
                                .map((item) => {
                                    return (
                                        <View
                                            key={item.category_id}
                                            style={{ height: 40, }}>
                                            <View style={{
                                                flexDirection: 'row', flex: 1, marginBottom: 5,
                                                alignItems: 'center',
                                            }}>

                                                <View style={{ flex: 8, }}>
                                                    <Text style={[styles.textDefault,
                                                    { color: '#67806D', fontSize: 15, }]}>{item['category_name']}</Text>
                                                </View>

                                                <View style={{ flex: 1, }}>
                                                    <TouchableOpacity>
                                                        <View style={{ backgroundColor: constants.colors[item['color_id']], height: 20, width: 20, }} />
                                                    </TouchableOpacity>

                                                </View>

                                                <View style={{ flex: 1, }}>
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            try {
                                                                // UNARCHIVE THIS CATEGORY
                                                                if (userState.errorMessage) {
                                                                    alert("Currently unable to edit category. Please check your internet connection")
                                                                } else {
                                                                    areYouSureUnarchive(item.category_id)
                                                                }

                                                            } catch (e) {
                                                                console.log(e)
                                                            }
                                                        }}>
                                                        <Icon name='archive-outline' type='ionicon' size={20} color='#67806D' />
                                                    </TouchableOpacity>
                                                </View>

                                            </View>

                                            <View
                                                style={{
                                                    borderBottomColor: '#DCDBDB',
                                                    //borderBottomWidth: StyleSheet.hairlineWidth,
                                                    borderBottomWidth: 1,
                                                }}
                                            />
                                        </View>
                                    )
                                })}
                        </View>

                    </ScrollView>

                    <>
                        <Header
                            navigation={navigation}
                            color={"#67806D"} />
                    </>
                </>
            }

        </HideKeyboard>
    )
}

const styles = StyleSheet.create({
    textDefaultBold: {
        fontFamily: 'Inter-Bold',
    },
    textDefault: {
        fontFamily: 'Inter-Regular',
    },
    title: {
        margin: 30,
        fontSize: 40,
    },
    categoryContainer: {
        marginVertical: 20,
        marginHorizontal: 25,
    },
    addCategoryButton: {
        flex: 1,
        paddingVertical: 15,
        margin: 10,
        backgroundColor: '#ABC57E',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    addCategoryText: {
        fontWeight: '600',
        color: 'white',
        fontSize: 18,
    }
})

export default AddCategoryScreen;