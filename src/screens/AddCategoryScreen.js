import React, { useState, useContext } from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { Input, Button, Icon } from 'react-native-elements';
import { Context as CategoryContext } from '../context/CategoryContext';
import ColorSelectModal from '../components/ColorSelectModal';
import Modal from 'react-native-modal'
const constants = require('../components/constants.json')

const AddCategoryScreen = () => {
    const [categoryName, setCategoryName] = useState('')
    const [resMessage, setResMessage] = useState('')
    const { state: catState, addCategory, fetchUserCategories, changeArchiveCategory,
        changeColorCategory } = useContext(CategoryContext)

    const [chosenColor, setChosenColor] = useState('c0')
    const [isEnabled, setIsEnabled] = useState(true);

    const [selectedCatId, setSelectedCatId] = useState('')
    const [modalVisible, setModalVisible] = useState(false)
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);


    const resetInputs = async () => {
        setCategoryName('')
        setResMessage("Category set successfully!")

        // repull the list now that we've added to it
        await fetchUserCategories();
    }

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

    const modalCallback = async (chosenColorId) => {
        await changeColorCategory(selectedCatId, chosenColorId)
    }

    return (
        <ScrollView>

            <Modal isVisible={modalVisible}
                animationIn='slideInLeft'
                animationOut='slideOutLeft'>
                <ColorSelectModal
                    toggleFunction={toggleModal}
                    colorArr={colorArr}
                    callback={modalCallback} />
            </Modal>


            <Text style={{ marginLeft: 25, marginTop: 10, fontSize: 20, }}>Active Categories</Text>

            <View style={styles.categoryContainer}>
                {catState.userCategories.filter((item) => !item.archived)
                    .map((item) => {
                        return (
                            <View
                                key={item.category_id}
                                style={[styles.categoryStyle, { height: 30, }]}>
                                <View style={{ flexDirection: 'row', flex: 1, }}>

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
                                style={[styles.categoryStyle, { height: 30, }]}>
                                <View style={{ flexDirection: 'row', flex: 1, }}>

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



            <Text style={{ marginLeft: 30, marginTop: 10, fontSize: 20, }}>Add a New Category</Text>

            <View style={{ marginHorizontal: 20, marginTop: 10, }}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 7 }}>
                        <Input
                            containerStyle={styles.nameInputStyleContainer}
                            inputContainerStyle={styles.inputStyleContainer}
                            placeholder='Category name'
                            autoCorrect={false}
                            value={categoryName}
                            onChangeText={setCategoryName}
                        />
                    </View>

                    <View style={{ flex: 1, height: 40, backgroundColor: constants.colors[chosenColor] }}></View>


                </View>

                <Text>Choose a color:</Text>
                < FlatList
                    style
                    horizontal={true}
                    data={colorArr}
                    keyExtractor={(item) => item[0]}
                    renderItem={({ item }) => {
                        return (
                            < >
                                <TouchableOpacity
                                    style={[styles.colorSquare, { backgroundColor: item[1] }]}
                                    onPress={() => { setChosenColor(item[0]) }}
                                />
                            </>
                        )
                    }}
                >
                </FlatList>

                <Text>Public Category (visible on your profile)</Text>
                <Switch
                    style={{ marginTop: 10, }}
                    trackColor={{ false: '#cdd5a0', true: '#90AB72' }}
                    thumbColor={isEnabled ? "#67806D" : "#f6F2DF"}
                    ios_backgroundColor="#f6F2DF"
                    onValueChange={toggleSwitch}
                    value={isEnabled} />

            </View>

            <TouchableOpacity style={styles.addCategoryButton}
                onPress={() => {
                    addCategory(categoryName, new Date(), chosenColor, isEnabled, resetInputs)
                }}>
                <Text style={styles.addCategoryText}>Add Category</Text>
            </TouchableOpacity>

            {resMessage ? <Text>{resMessage}</Text> : null}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    title: {
        margin: 30,
        fontSize: 40,
    },
    colorSquare: {
        width: 50,
        height: 50,
        marginHorizontal: 5,
        marginVertical: 20,
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
        justifyContent: 'center',
        borderRadius: 10,
    },
    addCategoryText: {
        fontWeight: 'bold',
        color: 'white',
        fontSize: 13,
    }
})

export default AddCategoryScreen;