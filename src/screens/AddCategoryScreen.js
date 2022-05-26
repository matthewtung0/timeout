import React, { useState, useContext } from 'react';
import {
    View, StyleSheet, Text, TouchableOpacity, ScrollView,
    Keyboard, TouchableWithoutFeedback, Image, Dimensions
} from 'react-native';
import { Input, Icon } from 'react-native-elements';
import { Context as CategoryContext } from '../context/CategoryContext';
import ColorSelectModal from '../components/ColorSelectModal';
import Modal from 'react-native-modal'
import AddCategoryModal from '../components/AddCategoryModal';
import Header from '../components/Header';
const constants = require('../components/constants.json')
const img = require('../../assets/tasks_topbar.png')

const HideKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>
);

const AddCategoryScreen = ({ navigation }) => {
    const { height, width } = Dimensions.get('window');
    const { state: catState, changeArchiveCategory,
        changeColorCategory } = useContext(CategoryContext)

    const [selectedCatId, setSelectedCatId] = useState('')
    const [modalVisible, setModalVisible] = useState(false)
    const [addCategoryModalVisible, setAddCategoryModalVisible] = useState(false)

    var colorArr = []
    //let colors = JSON.parse(constants.colors)
    for (var i in constants['colors']) {
        colorArr.push([i, constants['colors'][i]])
    }
    console.log(catState.userCategories)

    const archiveCallback = () => {
        alert("Category successfully archived!");
    }

    const archiveCategory = async (categoryId, toArchive) => {
        try {
            await changeArchiveCategory(categoryId, toArchive, archiveCallback)
        } catch (err) {
            console.log("can't archive category", err);
        }
    }

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    const toggleAddCategoryModal = () => {
        setAddCategoryModalVisible(!addCategoryModalVisible)
    }

    const modalCallback = async (chosenColorId) => {
        await changeColorCategory(selectedCatId, chosenColorId)
    }

    return (
        <HideKeyboard>
            <>
                <ScrollView
                    style={{ backgroundColor: '#F9EAD3', }}>

                    <Modal isVisible={modalVisible}
                        animationIn='slideInLeft'
                        animationOut='slideOutLeft'>
                        <ColorSelectModal
                            toggleFunction={toggleModal}
                            colorArr={colorArr}
                            callback={modalCallback} />
                    </Modal>

                    <Modal isVisible={addCategoryModalVisible}
                        animationIn='slideInUp'
                        animationOut='slideOutUp'>
                        <AddCategoryModal
                            toggleFunction={toggleAddCategoryModal}
                            colorArr={colorArr}

                        />
                    </Modal>

                    <Text style={{ marginLeft: 25, marginTop: 90, fontSize: 20, }}>Active Categories</Text>
                    <View style={styles.categoryContainer}>
                        {catState.userCategories.filter((item) => !item.archived)
                            .map((item) => {
                                return (
                                    <View
                                        key={item.category_id}
                                        style={{ height: 35, }}>
                                        <View style={{ flexDirection: 'row', flex: 1, marginBottom: 5, }}>

                                            <View style={{ flex: 8, }}>
                                                <Text style={[styles.categoryText]}>{item['category_name']}</Text>
                                            </View>

                                            <View style={{ flex: 1, }}>
                                                <View style={{ backgroundColor: constants.colors[item['color_id']], height: 20, width: 20, }} />
                                            </View>

                                            <View style={{ flex: 1, }}>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        setSelectedCatId(item.category_id)
                                                        toggleModal()
                                                    }}>
                                                    <Icon name='pencil-outline' type='ionicon' size={20} color='#67806D' />
                                                </TouchableOpacity>
                                            </View>

                                            <View style={{ flex: 1, }}>
                                                <TouchableOpacity
                                                    onPress={() => { archiveCategory(item.category_id, true) }}>
                                                    <Icon name='archive-outline' type='ionicon' size={20} color='#67806D' />
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

                    <View
                        style={{
                            borderBottomColor: 'grey',
                            borderBottomWidth: StyleSheet.hairlineWidth,
                        }}
                    />

                    <Text style={{ marginLeft: 25, marginTop: 10, fontSize: 20, }}>Archived Categories</Text>

                    <View style={styles.categoryContainer}>
                        {catState.userCategories.filter((item) => item.archived)
                            .map((item) => {
                                return (
                                    <View
                                        key={item.category_id}
                                        style={{ height: 35, }}>
                                        <View style={{ flexDirection: 'row', flex: 1, marginBottom: 5, }}>

                                            <View style={{ flex: 8, }}>
                                                <Text style={[styles.categoryText]}>{item['category_name']}</Text>
                                            </View>

                                            <View style={{ flex: 1, }}>
                                                <TouchableOpacity>
                                                    <View style={{ backgroundColor: constants.colors[item['color_id']], height: 20, width: 20, }} />
                                                </TouchableOpacity>

                                            </View>

                                            <View style={{ flex: 1, }}>
                                                <Icon name='archive-outline' type='ionicon' size={20} color='#67806D' />
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
                            toggleAddCategoryModal();

                            //addCategory(categoryName, new Date(), chosenColor, isEnabled, resetInputs)
                        }}>
                        <Text style={styles.addCategoryText}>Add New Category</Text>
                    </TouchableOpacity>

                </ScrollView>

                <><Image
                    source={img}
                    resizeMode='stretch'
                    style={{ maxHeight: 75, position: 'absolute' }} />
                    <Text style={{
                        position: 'absolute',
                        alignSelf: 'center',
                        marginTop: 33,
                        marginBottom: 15,
                        fontSize: 23,
                        fontWeight: '600',
                        color: 'white',
                    }}>My Categories</Text>
                    <Header
                        navigation={navigation} />
                </>



            </>

        </HideKeyboard>
    )
}

const styles = StyleSheet.create({
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
        padding: 10,
        margin: 10,
        height: 40,
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