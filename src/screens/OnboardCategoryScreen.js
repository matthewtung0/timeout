import React, { useState, useCallback, useContext } from 'react';
import { View, StyleSheet, Text, ScrollView, Button, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Icon } from 'react-native-elements';
const constants = require('../components/constants.json')
import { useFocusEffect } from '@react-navigation/native';
import Modal from 'react-native-modal'
import OnboardCategoriesModal from '../components/OnboardCategoriesModal';
import { Context as AuthContext } from '../context/AuthContext';
const bg_bottom = require('../../assets/background_sidebar.png')

const OnboardCategoryScreen = ({ navigation, route: { params } }) => {
    const { height, width } = Dimensions.get('window');
    const { email, password, username, firstName, lastName, bio } = params;

    const { signup } = useContext(AuthContext);
    // [0, defaultCat[0], chosen or not (t/f), colorId]
    const [categoryArr, setCategoryArr] = useState([])
    const [cat, setCat] = useState([])
    var colorArr = []
    const [modalVisible, setModalVisible] = useState(false)
    const [selectedItem, setSelectedItem] = useState(null)

    for (var x in constants['colors']) {
        colorArr.push([x, constants['colors'][x]])
    }
    useFocusEffect(
        useCallback(() => {
            var catArrTemp = []
            for (var i in constants.defaultCategories) {
                catArrTemp.push([i, constants.defaultCategories[i], false, 'c0'])
            }
            setCategoryArr(catArrTemp)
        }, [])
    )

    const toggleSelected = (id) => {
        setCategoryArr(categoryArr.map(item => {
            if (item[0] == id) {
                return [item[0], item[1], !item[2], item[3]]
            }
            return item
        }))
    }

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    const modalCallback = (chosenColorId) => {
        console.log(chosenColorId)
        setCategoryArr(categoryArr.map(item => {
            if (item[0] == selectedItem[0]) {
                return [item[0], item[1], item[2], chosenColorId]
            }
            return item
        }))
    }

    console.log("category Arr: ", categoryArr)
    return (
        <View>
            <Modal isVisible={modalVisible}
                animationIn='slideInLeft'
                animationOut='slideOutLeft'
                backdropTransitionOutTiming={0}>
                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}>
                    <View style={{
                        height: height * 0.6,
                    }}>
                        <OnboardCategoriesModal
                            toggleFunction={toggleModal}
                            colorArr={colorArr}
                            selectedColorId={selectedItem ? selectedItem[3] : "c0"}
                            categoryArr={categoryArr}
                            item={selectedItem}
                            callback={modalCallback} />
                    </View>
                </View>

            </Modal>

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

                    <Text style={[styles.textDefaultSemiBold,
                    { marginLeft: 25, marginTop: 80, fontSize: 16, color: '#67806D' }]}>Selected some categories to track.</Text>
                    <Text style={[styles.textDefaultSemiBold,
                    { marginLeft: 25, fontSize: 16, color: '#67806D' }]}>You can edit them later!</Text>

                    <View style={styles.categoryContainer}>
                        {categoryArr
                            //.sort(function (a, b) {return String(a.category_name).localeCompare(String(b.category_name))})
                            .map((item) => {
                                return (
                                    <View
                                        key={item[0]}
                                        style={{ height: 45, }}>
                                        <View style={item[2] ?
                                            { flexDirection: 'row', flex: 1, paddingBottom: 5, borderWidth: 1, borderRadius: 20, } :
                                            { flexDirection: 'row', flex: 1, paddingBottom: 5, borderRadius: 20, }}>
                                            <View style={{ flex: 8, justifyContent: 'center', paddingLeft: 10, }}>
                                                <TouchableOpacity
                                                    style={{ borderWidth: 0, flex: 1, justifyContent: 'center', }}
                                                    onPress={() => { toggleSelected(item[0]) }}>
                                                    <View style={{ justifyContent: 'center', }}>
                                                        <Text style={[styles.textDefault,
                                                        { color: '#67806D', fontSize: 15 }]}>{item[1]}</Text>
                                                    </View>

                                                </TouchableOpacity>

                                            </View>

                                            <View style={{ flex: 1, justifyContent: 'center', }}>
                                                <View style={{ backgroundColor: constants.colors[item[3]], height: 20, width: 20, }} />
                                            </View>

                                            <View style={{ flex: 1, justifyContent: 'center', }}>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        setSelectedItem(item)
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
                                                marginBottom: 0,
                                            }}
                                        />
                                    </View>
                                )
                            })}
                    </View>

                    <Button title="Go back"
                        onPress={() => { navigation.navigate('SignUp', { email, firstName, lastName, bio, password, username }) }} />

                    <TouchableOpacity
                        style={styles.signUpBoxStyle}
                        onPress={() => {
                            signup({ email, password, username, firstName, lastName, categoryArr, bio })
                        }}>
                        <Text style={styles.signUpTextStyle}>Complete Sign Up</Text>
                    </TouchableOpacity>

                    <View style={{ height: 30 }} />
                </ScrollView>


            </>


        </View >
    )
}

const styles = StyleSheet.create({
    textDefaultBold: {
        fontFamily: 'Inter-Bold',
    },
    textDefault: {
        fontFamily: 'Inter-Regular',
    },
    textDefaultSemiBold: {
        fontFamily: 'Inter-SemiBold',
    },
    title: {
        margin: 30,
        fontSize: 40,
        marginTop: 70,
    },
    colorSquare: {
        width: 30,
        height: 30,
        backgroundColor: 'green',
    },
    signUpBoxStyle: {
        backgroundColor: '#FCC859',
        width: 150,
        height: 40,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10
    },
    signUpTextStyle: {
        color: '#F6F2DF',
        fontSize: 15,
        fontWeight: 'bold'
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

export default OnboardCategoryScreen;