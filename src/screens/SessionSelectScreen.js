import React, { useState, useContext, useRef, useCallback } from 'react';
import {
    View, StyleSheet, TouchableOpacity, Dimensions, Image, TextInput,
    Keyboard, TouchableWithoutFeedback, ActivityIndicator
} from 'react-native';
import { Text } from 'react-native-elements';
import CircularSelector from '../components/CircularSelector';
import { Context as UserContext } from '../context/userContext';
import { Context as CategoryContext } from '../context/CategoryContext';
import Modal from 'react-native-modal'
import ToDoSelector from '../components/ToDoSelector';
import DropDownComponent2 from '../components/DropDownComponent2';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import timeoutApi from '../api/timeout';

const constants = require('../components/constants.json')

const table_bg = require('../../assets/sessionselect_tablebg.png');
const background_desk = require('../../assets/background_desk.png')

const clock_bottom = require('../../assets/clock_bottom.png');
const clock_top = require('../../assets/clock_top.png');

const HideKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>
);

const SessionSelectScreen = ({ navigation: { navigate }, }) => {
    const { height, width } = Dimensions.get('window');
    const [time, setTime] = useState(0);
    const [selectedButton, setSelectedButton] = useState({ buttonName: 'unsorted', buttonId: 3 });
    const { state, fetchSelf } = useContext(UserContext)
    const { state: categoryState, setChosen, setActivityName, setStartTime } = useContext(CategoryContext)
    const [customActivity, setCustomActivity] = useState('')

    const [catId, setCatId] = useState(3)
    const [catName, setCatName] = useState('unsorted')
    const [colorId, setColorId] = useState('c6')
    const [isLoading, setIsLoading] = useState(false)

    const [introPosition, setIntroPosition] = useState(5)
    const [pageOpacity, setPageOpacity] = useState(1)
    const [categoryId, setCategoryId] = useState("3");

    const [newCatName, setNewCatName] = useState('unsorted')
    const [newColorId, setNewColorId] = useState('c9')

    const [modalVisible, setModalVisible] = useState(false)

    const updateTime = (a) => {
        setTime(a);
    }

    const checkStoredSessions = async () => {
        var storedSessions = await AsyncStorage.getItem('storedSessions')
        var num_stored = 0
        if (storedSessions) {
            setIsLoading(true)

            storedSessions = JSON.parse(storedSessions)

            // attempt to submit these sessions now
            try {
                const response = await timeoutApi.post('/save_session', storedSessions)
                console.log("Session save successful!")

                await AsyncStorage.removeItem('storedSessions');
                // after save session, fetch self to update stats, and then update the points
                await fetchSelf()



                // add points
                await addPoints(state.user_id, 100000)

                alert(String(storedSessions.length) + " stored sessions now updated!")
                setIsLoading(false)
            } catch (err) {
                console.log("Can't upload stored sessions", err)
            }


            num_stored = storedSessions.length
        }
        console.log("nUMBER STORED SESSIONS ", String(num_stored))
        console.log(JSON.stringify(storedSessions))
        return num_stored
    }

    useFocusEffect(
        useCallback(() => {
            console.log("FOCUS EFFECT SESSION SELECT")

            AsyncStorage.removeItem('storedSessions'); // TEMP
            //checkStoredSessions()
        }, [])
    )
    console.log("Error message: ", state.errorMessage);

    const clearInputs = () => {
        setSelectedButton({ buttonName: 'unsorted', buttonId: 3 })
        setCatId(3)
        setCatName('unsorted')

        setCategoryId("3")

        setTime(0)
        updateTime(0)
        setNewColorId('c9')
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

    const goToSecondIntroGraphic = () => {
        setIntroPosition(2)
    }
    const goToThirdIntroGraphic = () => {
        setIntroPosition(3)
    }
    const goToFourthIntroGraphic = () => {
        setIntroPosition(4)
    }
    const finishIntroGraphic = () => {
        setIntroPosition(-1)
        setPageOpacity(1)
    }

    return (
        <HideKeyboard>
            <>
                <View style={[styles.viewContainer, { opacity: pageOpacity }]}>

                    {/* TO-DO SELECTOR MODAL */}
                    <View>
                        <Modal isVisible={modalVisible}
                            animationIn='slideInLeft'
                            animationOut='slideOutLeft'
                            backdropTransitionOutTiming={0}
                        >

                            <View style={{
                                flex: 1,
                                flexDirection: 'column',
                                justifyContent: 'center',
                            }}>
                                <View style={{
                                    height: height * 0.7,
                                    borderRadius: 20,
                                }}>

                                    <ToDoSelector
                                        toggleFunction={toggleModal}
                                        todoItems={categoryState.userTodoItems}
                                        show_error={state.errorMessage}
                                        callback={fillInWithItem} />

                                </View>
                            </View>
                        </Modal>
                    </View>

                    <View>
                        <View style={{ position: 'absolute', flex: 1, width: '100%', height: '100%', }}>
                            <View style={{ flex: 1, }}>

                            </View>
                            <View style={{ flex: 1, }}>
                                <Image
                                    source={background_desk}
                                    style={{ width: '100%', height: '100%', }}
                                //resizeMode='contain'
                                />
                            </View>

                        </View>
                        <Image
                            source={clock_top}
                            style={{
                                //width: 235, 
                                width: width / 2 / 0.80,
                                height: (width / 2 / 0.80) * 0.22, alignSelf: "center", borderWidth: 0.3, borderColor: 'yellow',
                                marginTop: 30,
                            }}
                            resizeMode="contain" />
                        <CircularSelector
                            minSet={0}
                            updateCallback={updateTime}
                            ref={circularRef} />
                        <Image
                            source={clock_bottom}
                            style={{
                                width: width / 2 / 0.80,
                                height: (width / 2 / 0.80) * 0.085, alignSelf: "center", borderWidth: 0.3, borderColor: 'yellow'
                            }}
                            resizeMode="contain" />
                        {/* some space for desk */}
                        <View style={{ height: height * 0.05, }} />


                    </View>
                    <View style={{
                        //flex: 1
                        paddingTop: 15, backgroundColor: '#F8E9D2'
                    }}>
                        <TextInput
                            style={[styles.input, { width: width * 0.8, marginBottom: 20, height: 45 }]}
                            placeholder="Task"
                            placeholderTextColor={'#DCDBDB'}
                            rightIconContainerStyle={styles.rightIconInput}
                            inputContainerStyle={styles.inputStyleContainer}
                            autoCorrect={true}
                            maxLength={30}
                            value={customActivity}
                            onChangeText={(text) => {
                                setCustomActivity(text)
                                setActivityName(text)
                            }
                            }
                        />
                    </View>


                    <View style={{ minHeight: 50, backgroundColor: '#F8E9D2', paddingBottom: 20, }}>
                        <DropDownComponent2
                            isInModal={false}
                            categoryId={categoryId}
                            catName={newCatName}
                            colorId={newColorId}
                            setCatNameCallback={setNewCatName}
                            setColorIdCallback={setNewColorId}
                            setCategoryIdCallback={setCategoryId}
                        />
                    </View>



                    <TouchableOpacity
                        style={[styles.start, { width: width / 2.2, height: height / 12 }]}
                        onPress={() => {
                            if (!validateInputs() || isLoading) {
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
                        <Text style={[styles.startText, styles.textDefaultBold]}>Start</Text>

                    </TouchableOpacity>

                    {state.errorMessage ?
                        <View style={{ height: height * 0.2, backgroundColor: '#F5BBAE', width: '100%', paddingHorizontal: 10, }}>
                            <Text style={[styles.textDefault, { textAlign: 'center', color: 'red', fontSize: 18 }]}>
                                No internet connection - will attempt to be save any sessions once connection is restored.
                            </Text>
                        </View>

                        : null}
                    {isLoading ?
                        <ActivityIndicator size="large" color="black" /> : null}

                    <View style={styles.modalContainer}>
                        <View style={styles.modalDummy} />

                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={toggleModal}>
                            <Text style={[styles.modalButtonText, styles.textDefaultBold]}>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {/*<View style={{ position: 'absolute', height: 100, backgroundColor: 'green', width: '100%', }} />*/}


                {/* INTRO GRAPHIC 1 */}
                {introPosition == 1 ?
                    <View
                        style={{ position: 'absolute', height: '100%', width: '100%', }}>
                        <TouchableOpacity
                            style={{ flex: 1, }}
                            onPress={goToSecondIntroGraphic}>
                            <><View style={{ flex: 1 }}></View>
                                <View style={{ flex: 1 }}></View>
                                <View style={{ flex: 1 }}>

                                    <Text style={{ fontSize: 20, }}>Welcome to TimeOut! We hope this app will help you be productive!</Text>
                                </View>
                            </>

                        </TouchableOpacity>
                    </View> : null}

                {introPosition == 2 ?
                    <View
                        style={{ position: 'absolute', height: '100%', width: '100%', }}>
                        <TouchableOpacity
                            style={{ flex: 1, }}
                            onPress={goToThirdIntroGraphic}>
                            <><View style={{ flex: 1 }}></View>

                                <View style={{ flex: 1 }}>

                                    <Text style={{ fontSize: 20, }}>SECOND BLURB</Text>
                                </View><View style={{ flex: 1 }}></View>
                            </>

                        </TouchableOpacity>
                    </View> : null}
                {introPosition == 3 ?
                    <View
                        style={{ position: 'absolute', height: '100%', width: '100%', }}>
                        <TouchableOpacity
                            style={{ flex: 1, }}
                            onPress={goToFourthIntroGraphic}>
                            <><View style={{ flex: 1 }}></View>

                                <View style={{ flex: 1 }}>

                                    <Text style={{ fontSize: 20, }}>THIRD BLURB</Text>
                                </View><View style={{ flex: 1 }}></View>
                            </>

                        </TouchableOpacity>
                    </View> : null}
                {introPosition == 4 ?
                    <View
                        style={{ position: 'absolute', height: '100%', width: '100%', }}>
                        <TouchableOpacity
                            style={{ flex: 1, }}
                            onPress={finishIntroGraphic}>
                            <><View style={{ flex: 1 }}></View>

                                <View style={{ flex: 1 }}>

                                    <Text style={{ fontSize: 20, }}>FOURTH BLURB</Text>
                                </View><View style={{ flex: 1 }}></View>
                            </>

                        </TouchableOpacity>
                    </View> : null}

            </>

        </HideKeyboard>
    )
}

SessionSelectScreen.navigationOptions = () => {
    return {
        headerShown: false,
    };
}

const styles = StyleSheet.create({
    textDefaultBold: {
        fontFamily: 'Inter-Bold',
    },
    textDefault: {
        fontFamily: 'Inter-Regular',
    },
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
        marginTop: 55,
        flex: 1
    },
    input: {
        alignSelf: 'center',
        backgroundColor: 'white',
        borderRadius: 15,
        paddingHorizontal: 17,
        paddingVertical: 10,
        shadowOffset: {
            width: 0.05,
            height: 0.05,
        },
        shadowOpacity: 0.1,
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
        flex: 0.2,
    },
    clockBackground: {
    },
    start: {
        backgroundColor: '#ABC57E',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        alignSelf: 'center',
        marginBottom: 20,
        marginTop: 20,
        shadowOffset: {
            width: 0.3,
            height: 0.3,
        },
        shadowOpacity: 0.2,

    },
    startText: {
        color: 'white',
        fontFamily: 'Inter-Regular',
        fontSize: 25,
        fontWeight: 'bold'
    }
})

export default SessionSelectScreen;