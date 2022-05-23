import React, { useState, useContext, useRef } from 'react';
import {
    View, StyleSheet, FlatList, TouchableOpacity, ImageBackground, Dimensions, Image, TextInput,
    Keyboard, TouchableWithoutFeedback
} from 'react-native';
import { Text, Input } from 'react-native-elements';
import CircularSelector from '../components/CircularSelector';
import CategoryButton from '../components/CategoryButton';
import { Context as CategoryContext } from '../context/CategoryContext';
import Modal from 'react-native-modal'
import ToDoSelector from '../components/ToDoSelector';
import DropDownComponent from '../components/DropDownComponent';
const constants = require('../components/constants.json')

const table_bg = require('../../assets/sessionselect_tablebg.png');

const clock_bottom = require('../../assets/clock_bottom.png');
const clock_top = require('../../assets/clock_top.png');

const HideKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>
);

const SessionSelectScreen = ({ navigation: { navigate } }) => {
    const { height, width } = Dimensions.get('window');
    const [time, setTime] = useState(0);
    const [selectedButton, setSelectedButton] = useState({ buttonName: 'unsorted', buttonId: 3 });
    //const { state, fetchSelf } = useContext(UserContext)
    const { state: categoryState, setChosen, setActivityName, setStartTime } = useContext(CategoryContext)
    const [customActivity, setCustomActivity] = useState('')

    const [catId, setCatId] = useState(3)
    const [catName, setCatName] = useState('unsorted')
    const [colorId, setColorId] = useState('c6')

    const [open, setOpen] = useState(false);
    const [categoryId, setCategoryId] = useState("3");

    const [items, setItems] = useState(
        categoryState.userCategories.map(item => {
            return {
                label: item.category_name,
                value: item.category_id,
                color: item.color_id,
                containerStyle: { backgroundColor: constants.colors[item.color_id] }
            }
        })
    )

    const [newCatName, setNewCatName] = useState('unsorted')
    const [newColorId, setNewColorId] = useState('c6')

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

        // for new dropdown selector
        setNewCatName(cat_name)
        setNewColorId(color_id)
        setCategoryId(cat_id)
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
        <HideKeyboard>
            <View style={styles.viewContainer}>

                <View>
                    <Modal isVisible={modalVisible}
                        animationIn='slideInLeft'
                        animationOut='slideOutLeft'
                    >
                        <ToDoSelector
                            toggleFunction={toggleModal}
                            todoItems={categoryState.userTodoItems}
                            callback={fillInWithItem} />
                    </Modal>
                </View>
                <Image
                    source={clock_top}
                    style={{
                        width: 235, height: 52, alignSelf: "center", borderWidth: 1, borderColor: 'yellow',
                        marginTop: 30,
                    }}
                    resizeMode="contain" />
                <CircularSelector
                    minSet={0}
                    updateCallback={updateTime}
                    ref={circularRef} />
                <Image
                    source={clock_bottom}
                    style={{ width: 175, height: 23, alignSelf: "center", borderWidth: 1, borderColor: 'yellow' }}
                    resizeMode="contain" />

                {/*</ImageBackground>*/}

                <Text>{categoryId}</Text>
                <Text>{"Category name: " + newCatName}</Text>
                <Text>{"Color id: " + newColorId}</Text>
                <TextInput
                    style={[styles.input, { width: width * 0.9, marginBottom: 20, height: 45 }]}
                    placeholder="Activity"
                    rightIconContainerStyle={styles.rightIconInput}
                    inputContainerStyle={styles.inputStyleContainer}
                    autoCorrect={true}
                    value={customActivity}
                    onChangeText={(text) => {
                        setCustomActivity(text)
                        setActivityName(text)
                    }
                    }
                />
                <DropDownComponent
                    isInModal={false}
                    categoryId={categoryId}
                    catName={newCatName}
                    colorId={newColorId}
                    setCatNameCallback={setNewCatName}
                    setColorIdCallback={setNewColorId}
                    setCategoryIdCallback={setCategoryId}
                />

                <TouchableOpacity
                    style={[styles.start, { width: width / 2.2, height: height / 12 }]}
                    onPress={() => {
                        if (!validateInputs()) {
                            return;
                        }
                        let cat_Name = newCatName
                        let cat_Id = categoryId
                        let timer_Time = time

                        clearInputs()
                        circularRef.current.resetSlider()

                        navigate('SessionOngoing', {
                            numMins: timer_Time,
                            categoryId: cat_Id,
                            categoryName: cat_Name,
                            activityName: customActivity,
                            colorId: newColorId,
                        })
                    }}>
                    <Text style={styles.startText}>Start</Text>

                </TouchableOpacity>

                <View style={styles.modalContainer}>
                    <View style={styles.modalDummy} />

                    <TouchableOpacity
                        style={styles.modalButton}
                        onPress={toggleModal}>
                        <Text style={styles.modalButtonText}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </HideKeyboard>
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
        alignSelf: 'center',
        backgroundColor: 'white',
        borderRadius: 15,
        paddingHorizontal: 17,
        paddingVertical: 10,
        shadowOffset: {
            width: 0.1,
            height: 0.1,
        },
        shadowOpacity: 0.2,
        color: 'gray',
        fontSize: 18,
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
            width: 0.5,
            height: 0.5,
        },
        shadowOpacity: 0.5,

    },
    startText: {
        color: 'white',
        fontSize: 25,
        fontWeight: 'bold'
    }
})

export default SessionSelectScreen;