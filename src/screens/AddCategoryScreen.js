import React, { useState, useContext } from 'react';
import {
    View, StyleSheet, Text, TouchableOpacity, ScrollView,
    Keyboard, TouchableWithoutFeedback, Image, Dimensions
} from 'react-native';
import { Icon } from 'react-native-elements';
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
    const { state: catState } = useContext(CategoryContext)

    const [selectedCatId, setSelectedCatId] = useState('')
    const [selectedColorId, setSelectedColorId] = useState('')
    const [selectedName, setSelectedName] = useState('')
    const [modalVisible, setModalVisible] = useState(false)
    const [addCategoryModalVisible, setAddCategoryModalVisible] = useState(false)

    var colorArr = []
    //let colors = JSON.parse(constants.colors)
    for (var i in constants['colors']) {
        colorArr.push([i, constants['colors'][i]])
    }
    console.log("User categories", catState.userCategories)

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    const toggleAddCategoryModal = () => {
        setAddCategoryModalVisible(!addCategoryModalVisible)
    }

    return (
        <HideKeyboard>
            <>
                <ScrollView
                    style={{ backgroundColor: '#F9EAD3', }}>


                    <Modal isVisible={modalVisible}
                        animationIn='slideInLeft'
                        animationOut='slideOutLeft'>

                        <View style={{
                            flex: 1,
                            flexDirection: 'column',
                            justifyContent: 'center'
                        }}>
                            <View style={{
                                height: 500
                            }}>
                                <ColorSelectModal
                                    toggleFunction={toggleModal}
                                    colorArr={colorArr}
                                    selectedColorId={selectedColorId}
                                    selectedCategoryName={selectedName}
                                    selectedCatId={selectedCatId} />
                            </View>

                        </View>

                    </Modal>

                    <Modal isVisible={addCategoryModalVisible}
                        animationIn='slideInUp'
                        animationOut='slideOutUp'>

                        <View style={{
                            flex: 1,
                            flexDirection: 'column',
                            justifyContent: 'center'
                        }}>
                            <View style={{
                                height: 500
                            }}>
                                <AddCategoryModal
                                    toggleFunction={toggleAddCategoryModal}
                                    colorArr={colorArr}

                                />
                            </View></View>
                    </Modal>

                    <Text style={{ marginLeft: 25, marginTop: 120, fontSize: 20, }}>Active Categories</Text>
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
                                                        setSelectedColorId(item.color_id)
                                                        setSelectedName(item.category_name)
                                                        toggleModal()
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
                    style={{ maxHeight: 100, position: 'absolute' }} />
                    <Text style={{
                        position: 'absolute',
                        alignSelf: 'center',
                        marginTop: 60,
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