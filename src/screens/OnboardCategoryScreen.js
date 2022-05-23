import React, { useState, useCallback, useContext } from 'react';
import { View, StyleSheet, Text, FlatList, ScrollView, Button } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
const constants = require('../components/constants.json')
import { useFocusEffect } from '@react-navigation/native';
import Modal from 'react-native-modal'
import ColorSelectModal from '../components/ColorSelectModal';
import { Context as AuthContext } from '../context/AuthContext';

const OnboardCategoryScreen = ({ navigation, route: { params } }) => {
    const setHeight = 50
    const { email, password, username, firstName, lastName, bio } = params;

    const { signup } = useContext(AuthContext);
    // [0, defaultCat[0], chosen or not (t/f), colorId]
    const [categoryArr, setCategoryArr] = useState([])
    const [cat, setCat] = useState([])
    var colorArr = []
    const [modalVisible, setModalVisible] = useState(false)

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
        setCategoryArr(categoryArr.map(item => {
            if (item[0] == cat) {
                return [item[0], item[1], item[2], chosenColorId]
            }
            return item
        }))
    }

    console.log(colorArr)
    return (
        <ScrollView>

            <Modal isVisible={modalVisible}
                animationIn='slideInLeft'
                animationOut='slideOutLeft'>
                <ColorSelectModal
                    toggleFunction={toggleModal}
                    colorArr={colorArr}
                    categoryArr={categoryArr}
                    callback={modalCallback} />
            </Modal>


            <Text style={styles.title}>Onboard Category Screen</Text>
            <Button title="Go back"
                onPress={() => { navigation.navigate('SignUp3', { email, firstName, lastName, bio, password, username }) }} />
            <Text>Select some categories to track. You can always add more later.</Text>

            <View style={styles.categoryContainer}>
                {categoryArr
                    .map((item) => {

                        return (
                            <View
                                key={item[0]}
                                style={[styles.categoryStyle, {
                                    height: setHeight, marginHorizontal: 10, marginVertical: 5,
                                }]}>
                                {(item[2]) ?
                                    <View style={{
                                        flex: 1, flexDirection: 'row', alignItems: 'center',
                                        borderWidth: 1, borderRadius: 5, padding: 5,
                                    }}>
                                        <View style={{ flex: 5, }}>
                                            <TouchableOpacity
                                                onPress={() => { toggleSelected(item[0]) }}>
                                                <Text style={[styles.categoryText]}>{item[1]}</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ flex: 1, }}>
                                            <View style={[styles.colorSquare, {
                                                backgroundColor:
                                                    constants.colors[item[3]]
                                            }]} />
                                        </View>

                                        <View style={{ flex: 1, }}>
                                            <TouchableOpacity
                                                style={{
                                                    borderWidth: 1, height: setHeight,
                                                    justifyContent: 'center',
                                                }}
                                                onPress={() => {
                                                    setCat(item[0])
                                                    toggleModal()
                                                }}>
                                                <Text style={[styles.categoryText, { alignSelf: 'center' }]}>Pick color</Text>


                                            </TouchableOpacity>
                                        </View>

                                    </View>

                                    :

                                    <View style={{
                                        flex: 1, flexDirection: 'row', alignItems: 'center',
                                        padding: 5,
                                    }}>
                                        <View style={{ flex: 6, }}>
                                            <TouchableOpacity
                                                onPress={() => { toggleSelected(item[0]) }}>
                                                <Text style={[styles.categoryText]}>{item[1]}</Text>


                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ flex: 1, }}>
                                        </View>

                                        <View style={{ flex: 1, }}>
                                        </View>

                                    </View>

                                }

                            </View>
                        )
                    })}
            </View>

            <TouchableOpacity
                style={styles.signUpBoxStyle}
                onPress={() => {
                    signup({ email, password, username, firstName, lastName, categoryArr })
                }}>
                <Text style={styles.signUpTextStyle}>Complete Sign Up</Text>
            </TouchableOpacity>
        </ScrollView >
    )
}

const styles = StyleSheet.create({
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
})

export default OnboardCategoryScreen;