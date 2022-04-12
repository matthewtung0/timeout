import React, { useState, useContext, useRef } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import { Text, Input } from 'react-native-elements';
import CircularSelector from '../components/CircularSelector';
import CategoryButton from '../components/CategoryButton';
import { Context as CategoryContext } from '../context/CategoryContext';
import Modal from 'react-native-modal'
import ToDoSelector from '../components/ToDoSelector';

const table_bg = require('../../assets/sessionselect_tablebg.png');

const SessionSelectScreen = ({ navigation: { navigate } }) => {
    const { height, width } = Dimensions.get('window');
    const [time, setTime] = useState(0);
    const [selectedButton, setSelectedButton] = useState({ buttonName: 'unsorted', buttonId: 3 });
    //const { state, fetchSelf } = useContext(UserContext)
    const { state: categoryState, setChosen, setActivityName, setStartTime } = useContext(CategoryContext)
    const [customActivity, setCustomActivity] = useState('')
    const [catId, setCatId] = useState(3)
    const [catName, setCatName] = useState('unsorted')
    const [colorId, setColorId] = useState('c0')

    const [modalVisible, setModalVisible] = useState(false)

    const updateTime = (a) => {
        setTime(a);
    }

    const clearInputs = () => {
        setSelectedButton({ buttonName: 'unsorted', buttonId: 3 })
        setCatId(3)
        setCatName('unsorted')
        setTime(0)
        setCustomActivity('')
    }

    // callback from manually selecting category button
    const updateButton = (button) => {
        setCatId(button.buttonId)
        setCatName(button.buttonName)
        setSelectedButton(button);
        setChosen(button)
        setColorId(button.buttonColor)
    }

    const circularRef = useRef()

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    // callback from modal selection
    const fillInWithItem = (returned_info) => {
        const { item_desc, cat_id, item_id, cat_name, color_id } = returned_info
        setCustomActivity(item_desc)
        setCatId(cat_id)
        setCatName(cat_name)
        setColorId(color_id)

        // for context uses, might delete later
        setActivityName(item_desc)
        setChosen({ buttonName: cat_name, buttonId: cat_id, })
    }

    const validateInputs = () => {
        if (time == 0) {
            alert("You must set a time amount!")
            return false;
        } else if (customActivity == '') {
            alert("Please enter an activty to do!")
            return false;
        }
        return true
    }

    return (
        <View style={styles.viewContainer}>

            <View>
                <Modal isVisible={modalVisible}
                    animationIn='slideInLeft'
                    animationOut='slideOutLeft'>
                    <ToDoSelector
                        toggleFunction={toggleModal}
                        todoItems={categoryState.userTodoItems}
                        callback={fillInWithItem} />
                </Modal>
            </View>


            <ImageBackground
                source={table_bg}
                style={[styles.image]}
                resizeMode='stretch'>
                <CircularSelector
                    minSet={0}
                    updateCallback={updateTime}
                    ref={circularRef} />

            </ImageBackground>

            <Input
                style={styles.input}
                placeholder="Activity"
                rightIconContainerStyle={styles.rightIconInput}
                inputContainerStyle={styles.inputStyleContainer}
                autoCorrect={false}
                value={customActivity}
                onChangeText={(text) => {
                    setCustomActivity(text)
                    setActivityName(text)
                }
                }
            />

            {/*<Icon type='ionicon' name='create-outline' />*/}

            <FlatList
                columnWrapperStyle={{ justifyContent: 'space-between', flex: 1, marginVertical: 5, marginHorizontal: 10 }}
                style
                horizontal={false}
                data={categoryState.userCategories}
                numColumns='3'
                showsHorizontalScrollIndicator={false}
                keyExtractor={(result) => result.category_id}
                renderItem={({ item }) => {
                    return (
                        <View style={{
                            backgroundColor: (catId == item.category_id ? 'red' : 'white'),
                            padding: 5, borderRadius: 10,
                        }}>
                            <CategoryButton
                                id={item.category_id}
                                catName={item.category_name}
                                colorId={item.color_id}
                                callback={updateButton} />
                        </View>
                    )
                }}

                ListFooterComponent={() =>
                    <TouchableOpacity
                        style={[styles.start, { width: width / 2.2, height: height / 12 }]}
                        onPress={() => {
                            if (!validateInputs()) {
                                return;
                            }
                            let cat_Name = catName
                            let cat_Id = catId
                            let timer_Time = time

                            clearInputs()
                            circularRef.current.resetSlider()

                            navigate('SessionOngoing', {
                                numMins: timer_Time,
                                categoryId: cat_Id,
                                categoryName: cat_Name,
                                activityName: customActivity,
                                colorId: colorId,
                            })
                        }}>
                        <Text style={styles.startText}>Start</Text>

                    </TouchableOpacity>
                }

            >
            </FlatList>

            <View style={styles.modalContainer}>
                <View style={styles.modalDummy} />

                <TouchableOpacity
                    style={styles.modalButton}
                    onPress={toggleModal}>
                    <Text style={styles.modalButtonText}>+</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

SessionSelectScreen.navigationOptions = () => {
    return {
        headerShown: false,
    };
}

const styles = StyleSheet.create({
    title: {
        margin: 20,
        fontSize: 25,
    }, container: {
        flex: 1,
        margin: 10,
        borderWidth: 1,
        borderColor: 'green'
    },
    viewContainer: {
        marginTop: 35,
        flexDirection: 'column',
        flex: 1
    },
    input: {
        backgroundColor: 'white',
        borderRadius: 15,
        marginHorizontal: 27,
        paddingHorizontal: 17,
    },
    inputContainer: {
        flex: 1,
        flexDirection: 'column',
    },
    inputStyleContainer: {
        borderBottomWidth: 0,
    },
    rightIconInput: {
        backgroundColor: 'brown',
    },
    modal: {
        borderRadius: 10,
    },
    modalButton: {
        width: 40,
        height: 40,
        backgroundColor: '#ABC57E',
        borderBottomRightRadius: 10,
        borderTopRightRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalButtonText: {
        fontWeight: 'bold',
        fontSize: 25,
        color: 'white',
    },
    modalContainer: {
        flex: 1,
        height: '100%',
        position: 'absolute',
    },

    // decides how high up the modal tab is
    modalDummy: {
        flex: 0.1,
    },
    clockBackground: {
    },
    start: {
        backgroundColor: '#ABC57E',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        alignSelf: 'center',
        marginBottom: 20,
        marginTop: 20,
        shadowOffset: {
            width: 1,
            height: 1,
        },
        shadowOpacity: 0.8,

    },
    startText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold'
    }
})

export default SessionSelectScreen;