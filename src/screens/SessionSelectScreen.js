import React, { useState, useContext, useRef, useCallback } from 'react';
import {
    View, StyleSheet, TouchableOpacity, Dimensions, Image, TextInput,
    Keyboard, TouchableWithoutFeedback, ActivityIndicator, Platform, Touchable, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from 'react-native-elements';
import CircularSelector from '../components/CircularSelector';
import { Context as UserContext } from '../context/userContext';
import { Context as CategoryContext } from '../context/CategoryContext';
import { Context as SessionContext } from '../context/SessionContext';
import Modal from 'react-native-modal'
import ToDoSelector from '../components/ToDoSelector';
import DropDownComponent2 from '../components/DropDownComponent2';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { startOfMonth, endOfMonth } from 'date-fns';
import tinycolor from 'tinycolor2';
import { Easing } from 'react-native-reanimated';
import { Shadow } from 'react-native-shadow-2';
import InformationalModal from '../components/InformationalModal';

const constants = require('../components/constants.json')

//const background_desk = require('../../assets/background_desk.png')
const clock_bottom = require('../../assets/clock_bottom.png');
const clock_top = require('../../assets/clock_top.png');
const transition_session_complete = require('../../assets/transition-session-complete.png')
//const test_bg7 = require('../../assets/test_bg7.png')
const test_bg8 = require('../../assets/test_bg8.png')
const SessionSelectDialog = require('../../assets/SessionSelectDialog.png')
const PADDING_TOP = 55;
const { height, width } = Dimensions.get('window');
const WIDTH_SETTING = height / 3.6
//
//width / 2 / 0.80


const HideKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>
);

const SessionSelectScreen = ({ navigation: { navigate }, route: { params } }) => {
    const anim = useRef(new Animated.Value(0)).current;
    const [time, setTime] = useState(0);
    const { state, fetchSelf, fetchFriendsIfUpdate, addPoints } = useContext(UserContext)
    const { setChosen, setActivityName } = useContext(CategoryContext)
    const { saveSession, fetchMultipleMonths } = useContext(SessionContext)
    const [customActivity, setCustomActivity] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const [categoryId, setCategoryId] = useState("3");
    const [newCatName, setNewCatName] = useState('unsorted')
    const [newColorId, setNewColorId] = useState('c10')
    const [token, setToken] = useState('')
    const [animStarted, setAnimStarted] = useState(false);

    const [modalVisible, setModalVisible] = useState(false)
    const [infoModalVisible, setInfoModalVisible] = useState(false)

    const updateTime = (a) => {
        setTime(a);
    }

    const saveSessionErrorCallback = async () => {
        console.log("Session save unsuccessful for now")
        //failed saving sessions, keep in storage to try again later
        setIsLoading(false)
    }

    const saveSession_callback = async () => {
        console.log("Session save successful!")
        var measureTime = new Date();
        var endTime = endOfMonth(measureTime)
        var startTime = startOfMonth(measureTime)
        await AsyncStorage.removeItem('storedSessions');

        try {
            await fetchMultipleMonths(startTime, endTime)
        } catch (err) {
            console.log("Problem fetching months")
            setIsLoading(false)
            return
        }

        try {
            await addPoints(state.user_id, 100)
        } catch (err) {
            setIsLoading(false)
            console.log("Problem adding points")
        }
        setIsLoading(false)
        alert("Offline sessions now updated")
    }

    const checkStoredSessions = async () => {
        var storedSessions = await AsyncStorage.getItem('storedSessions')

        var num_stored = 0
        if (storedSessions) {
            setIsLoading(true)

            storedSessions = JSON.parse(storedSessions)
            // attempt to submit these sessions now
            try {
                await saveSession(storedSessions, saveSession_callback, saveSessionErrorCallback, true)
                //const response = await timeoutApi.post('/save_session', storedSessions)


                // after save session, fetch self to update stats, and then update the points
                //await fetchSelf()



            } catch (err) {
                //alert("Error uploading stored sessions")
                setIsLoading(false)
                console.log("Error uploading stored sessions", err)
            }


            num_stored = storedSessions.length
        }
        console.log("# stored sessions:", String(num_stored))
        //console.log(JSON.stringify(storedSessions))
        return num_stored
    }

    const focusEffectFunc = async () => {
        setIsLoading(true)
        await fetchFriendsIfUpdate();
        checkStoredSessions()
        setIsLoading(false)
    }

    useFocusEffect(
        useCallback(() => {
            if (false) {
                anim.setValue(0)
                setAnimStarted(true)
                cloudAnim()
            } else {
                focusEffectFunc()
            }

        }, [])
    )

    const clearInputs = () => {
        setCategoryId("3")
        setNewCatName("unsorted")
        setTime(0)
        updateTime(0)
        setNewColorId('c10')
        setCustomActivity('')
    }

    const circularRef = useRef()

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    const toggleInfoModal = () => {
        setInfoModalVisible(!infoModalVisible);
    }

    // callback from modal selection
    const fillInWithItem = (returned_info) => {
        const { item_desc, cat_id, item_id, cat_name, color_id } = returned_info
        setCustomActivity(item_desc)

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

    const testFCMNotification = async () => {
        try {
            var asdf = await fetch('https://fcm.googleapis.com/fcm/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `key=${constants.fcmAuthorizationKey}`,
                },
                body: JSON.stringify({
                    to: "eYByL5AtSWyHwLgErS1EuS:APA91bExyOYgvYyqkkNVfq8eI6rjJCLiaEVhquEuqbeoMb7VYaqVgMO6USvWaIBnAS9MJ2IHmjcE2TX55SzHInO5yKW_lApk-NdzUeEMdu6cgc5ZUW04kirDrgP0ZPJoVhjCqvGt6kXS",
                    priority: 'high',
                    data: {
                        experienceId: '@mtung0219/timeout',
                        scopeKey: '@mtung0219/timeout',
                        title: "📧 You've got mail",
                        message: 'Hello world! 🌐',
                    },
                }),
            });
            console.log(JSON.stringify(asdf))
        } catch (err) {
            console.log(err)
        }

        console.log("Sent notif")
    }

    const startButton = () => {
        return (
            <TouchableOpacity
                style={[styles.start, {
                    height: height / 12,
                    width: width / 3,
                    shadowOffset: {
                        width: 0,
                        height: 6,
                    },
                    shadowOpacity: 1,
                    shadowRadius: 0,
                    shadowColor: tinycolor('#ABC57E').darken(25).toString(),
                    //elevation: 4,
                }]}
                onPress={() => {
                    if (!validateInputs() || isLoading) {
                        return;
                    }
                    let cat_Name = newCatName
                    let cat_Id = categoryId
                    let timer_Time = time


                    circularRef.current.resetSlider()

                    navigate('SessionOngoing', {
                        numMins: timer_Time,
                        categoryId: cat_Id,
                        categoryName: cat_Name,
                        activityName: customActivity,
                        colorId: newColorId,
                        token: token,
                    })
                    clearInputs()
                }}>
                <Text style={[styles.startText, styles.textDefaultSemiBold,
                { fontSize: 18, paddingHorizontal: 10, }]}>Start now</Text>

            </TouchableOpacity>
        )
    }

    const alreadyDidButton = () => {
        return (
            <TouchableOpacity
                style={[styles.start, {
                    backgroundColor: '#C0C0C0',
                    height: height / 12,
                    width: width / 3,
                    shadowOffset: {
                        width: 0,
                        height: 6,
                    },
                    shadowOpacity: 1,
                    shadowRadius: 0,
                    shadowColor: tinycolor('#C0C0C0').darken(25).toString()
                }]}
                onPress={() => {
                    if (!validateInputs() || isLoading) {
                        return;
                    }
                    let cat_Name = newCatName
                    let cat_Id = categoryId
                    let timer_Time = time
                    navigate('SessionBackfill', {
                        numMins: timer_Time,
                        categoryId: cat_Id,
                        categoryName: cat_Name,
                        activityName: customActivity,
                        colorId: newColorId,
                    })
                    clearInputs()
                    circularRef.current.resetSlider()
                }}>
                <Text style={[styles.startText, styles.textDefaultSemiBold, {
                    fontSize: 18, textAlign: 'center', paddingHorizontal: 10,
                }]}>
                    I already did this</Text>

            </TouchableOpacity>
        )
    }

    const todoTabIcon = () => {
        return (
            <TouchableOpacity
                style={[styles.modalButton,
                {
                    width: 40, height: 40,
                    shadowOffset: {
                        width: 0,
                        height: 5,
                    },
                    shadowOpacity: 1,
                    shadowRadius: 0,
                    shadowColor: tinycolor('#ABC57E').darken(25).toString()
                }
                ]}
                onPress={toggleModal}>
                <Text style={[styles.modalButtonText, styles.textDefaultBold]}>+</Text>
            </TouchableOpacity>
        )
    }


    const cloudAnim = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(anim, {
                    toValue: -height + 30,
                    duration: 300,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
                Animated.timing(anim, {
                    toValue: -height - 30,
                    duration: 900,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
                Animated.timing(anim, {
                    toValue: -height * 3,
                    duration: 300,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
            ])).start();
    }

    return (
        <HideKeyboard>
            <View
                style={[styles.viewContainer, {}]}
            >

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
                                height: height * 0.85,
                                borderRadius: 20,
                            }}>

                                <ToDoSelector
                                    toggleFunction={toggleModal}
                                    //todoItems={categoryState.userTodoItems}
                                    show_error={state.errorMessage}
                                    callback={fillInWithItem} />

                            </View>
                        </View>
                    </Modal>
                </View>

                <View>
                    <Modal isVisible={infoModalVisible}
                        animationIn='slideInDown'
                        animationOut='slideOutDown'
                        animationInTiming={1}
                        animationOutTiming={1}
                        backdropTransitionOutTiming={0}
                    >

                        <View style={{
                            flex: 1,
                            flexDirection: 'column',
                            justifyContent: 'center',
                        }}>
                            <View style={{
                                height: height * 0.6,
                                borderRadius: 20,
                            }}>

                                <InformationalModal
                                    toggleFunction={toggleInfoModal}
                                    setCatNameCallback={setNewCatName}
                                    setColorIdCallback={setNewColorId}
                                    setCategoryIdCallback={setCategoryId}
                                />

                            </View>
                        </View>
                    </Modal>
                </View>

                <View>
                    <View style={{
                        position: 'absolute', height: '100%', width: '100%',
                    }}>
                        <Image source={test_bg8}
                            style={{ height: '100%', width: '100%' }}
                            resizeMode='stretch'
                        />

                    </View>
                    <View style={{
                        height: height * 0.25,
                        justifyContent: 'flex-end',
                    }}>
                        <View style={{
                            alignItems: 'center', borderWidth: 0, position: 'absolute',
                            width: '100%', height: '100%', justifyContent: 'flex-end'
                        }}>
                            <Image
                                style={{ width: '90%', height: '40%' }}
                                resizeMode='stretch'
                                source={SessionSelectDialog} />
                        </View>

                        {/* task input */}
                        <View style={{
                            height: '40%', flexDirection: 'row', width: width * 0.9, justifyContent: 'center',
                            alignSelf: 'center',
                            //flex: 1
                            //backgroundColor: '#F8E9D2',
                        }}>
                            <TextInput
                                style={[styles.input, styles.textDefault,
                                { flex: 2, height: '65%', color: '#67806D', }]}
                                placeholder="Task"
                                placeholderTextColor={'#C0C0C0'}
                                rightIconContainerStyle={styles.rightIconInput}
                                inputContainerStyle={styles.inputStyleContainer}
                                autoCorrect={true}
                                maxLength={50}
                                value={customActivity}
                                onChangeText={(text) => {
                                    setCustomActivity(text)
                                    setActivityName(text)
                                }
                                }
                            />
                            {/* CATEGORY LABEL */}
                            <View style={{
                                flex: 1, height: '65%', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <TouchableOpacity
                                    style={{ width: '90%', borderRadius: 15, }}
                                    onPress={toggleInfoModal}>
                                    <View style={{
                                        backgroundColor: constants.colors[newColorId],
                                        width: '100%', justifyContent: 'center', alignItems: 'center',
                                        borderRadius: 25,
                                    }}>
                                        <Text style={[styles.textDefaultSemiBold, {
                                            color: 'white',
                                            paddingVertical: 10,
                                        }]}>{newCatName}</Text>
                                    </View>
                                </TouchableOpacity>


                            </View>
                        </View>

                    </View>

                    {/* Clock selector graphic */}
                    <View style={{ borderWidth: 0, borderColor: 'purple' }}>

                        {/* bg desk */}
                        {/*<View style={{
                            position: 'absolute', flex: 1,
                            //marginTop: PADDING_TOP, 
                            width: '100%', height: '100%',
                        }}>
                            <View style={{ flex: 0.6, }}>

                            </View>
                            <View style={{ flex: 1, borderWidth: 0, }}>
                                <Image
                                    source={background_desk}
                                    style={{ width: '100%', height: '100%', }}
                                    resizeMode='stretch'
                                //resizeMode='contain'
                                />
                            </View>

                    </View>*/}
                        {/* clock top */}
                        <Image
                            source={clock_top}
                            style={{
                                width: WIDTH_SETTING,
                                height: (WIDTH_SETTING) * 0.22,
                                alignSelf: "center",
                                marginTop: 20,
                            }}
                            resizeMode="contain" />

                        {/* circular selector */}
                        <View style={{ borderWidth: 0 }}
                        >
                            <CircularSelector
                                minSet={0}
                                updateCallback={updateTime}
                                ref={circularRef} />
                        </View>
                        {/* clock bottom - removed */}
                        <Image
                            source={clock_bottom}
                            style={{
                                width: WIDTH_SETTING,
                                height: (WIDTH_SETTING) * 0.0844,
                                alignSelf: "center",
                            }}
                            resizeMode="contain" />
                        {/* some space for desk */}
                        <View style={{ height: height * 0.05, }} />
                    </View>
                </View>

                {/* category dropdown - to remove 
                <View style={{
                    backgroundColor: '#F8E9D2', paddingBottom: 0,
                    paddingTop: 25,
                }}>
                    <DropDownComponent2
                        isInModal={false}
                        categoryId={categoryId}
                        catName={newCatName}
                        colorId={newColorId}
                        setCatNameCallback={setNewCatName}
                        setColorIdCallback={setNewColorId}
                        setCategoryIdCallback={setCategoryId}
                    />
                </View>*/}

                <View style={{
                    justifyContent: 'center',
                    borderWidth: 0, width: '100%', alignSelf: 'center', flex: 1,
                }}>
                    <View style={{
                        position: 'absolute', width: '100%', height: '100%',
                        backgroundColor: '#F8E9D2'
                    }}>
                    </View>
                    <View style={{
                        flexDirection: 'row', justifyContent: 'space-between',
                        marginHorizontal: '10%',
                    }}>
                        <View
                            style={{}}>
                            {Platform.OS === 'ios' ?

                                alreadyDidButton() :
                                <Shadow distance={2}
                                    offset={[0, 5]}
                                    style={{ width: width / 3 - 5 }}
                                    paintInside={true}
                                    startColor={tinycolor('#C0C0C0').darken(25).toString()}
                                    endColor={tinycolor('#C0C0C0').darken(25).toString()}
                                    sides={{
                                        'bottom': true,
                                        'start': true,
                                        'end': true,
                                        'top': true
                                    }}
                                    corners={{
                                        'topStart': true,
                                        'topEnd': true,
                                        'bottomStart': true,
                                        'bottomEnd': true
                                    }}

                                >
                                    {alreadyDidButton()}
                                </Shadow>
                            }
                        </View>

                        <View
                            style={{}}>
                            {Platform.OS === 'ios' ?
                                startButton() :
                                <Shadow distance={2}
                                    offset={[0, 5]}
                                    style={{ width: width / 3 - 5 }}
                                    paintInside={true}
                                    startColor={tinycolor('#ABC57E').darken(25).toString()}
                                    endColor={tinycolor('#ABC57E').darken(25).toString()}
                                    sides={{
                                        'bottom': true,
                                        'start': true,
                                        'end': true,
                                        'top': true
                                    }}
                                    corners={{
                                        'topStart': true,
                                        'topEnd': true,
                                        'bottomStart': true,
                                        'bottomEnd': true
                                    }}

                                >
                                    {startButton()}
                                </Shadow>
                            }
                        </View>

                    </View>

                    {state.errorMessage && 0 ?
                        <View style={{ backgroundColor: '#F5BBAE', width: '100%', paddingHorizontal: 10, }}>
                            <Text style={[styles.textDefault, { textAlign: 'center', color: 'red', fontSize: 16 }]}>
                                No internet connection - will attempt to save any tasks done once connection is restored.
                            </Text>
                        </View>

                        : null}

                </View>


                {/* to-do selector tab */}
                <View style={[{
                    marginTop: height * 0.27,
                    position: 'absolute',
                }]}>
                    {Platform.OS === 'ios' ?
                        todoTabIcon() :
                        <Shadow distance={2}
                            offset={[0, 4]}
                            style={{ width: 40 - 3 }}
                            paintInside={true}
                            startColor={tinycolor('#ABC57E').darken(25).toString()}
                            endColor={tinycolor('#ABC57E').darken(25).toString()}
                            sides={{
                                'bottom': true,
                                'start': true,
                                'end': true,
                                'top': true
                            }}
                            corners={{
                                'topStart': true,
                                'topEnd': true,
                                'bottomStart': true,
                                'bottomEnd': true
                            }}

                        >
                            {todoTabIcon()}
                        </Shadow>
                    }
                </View>

                {isLoading ?
                    <View style={{
                        position: 'absolute', width: '100%', height: '100%',
                        flex: 1, justifyContent: 'flex-end',
                    }}>
                        <View style={{ marginBottom: 10, }}>
                            <ActivityIndicator size="large" color="#67806D" />
                        </View>

                    </View>
                    : null}
                {/*<View style={{ position: 'absolute', height: 100, backgroundColor: 'green', width: '100%', }} />*/}

                {animStarted ?
                    <View style={{
                        position: 'absolute', borderWidth: 0, flex: 1, width: '100%', height: '100%',
                        alignItems: 'center',
                    }}>
                        <Animated.View style={{
                            width: width * 0.7,
                            height: height - 30,
                            transform: [{ translateY: anim, }]
                        }}>
                            <LinearGradient
                                // Button Linear Gradient
                                colors={['rgba(255,255,255,0.2)', '#8DC867']}
                                locations={[0.6, 0.9]}
                                start={{ x: 0.5, y: 0, }}
                                end={{ x: 0.5, y: 1, }}
                                style={{ width: '100%', height: '100%', }}
                            ></LinearGradient>
                        </Animated.View>
                        <Animated.View style={{
                            width: width * 0.7,
                            height: height + 60,
                            backgroundColor: "#8DC867",
                            justifyContent: 'center',
                            alignItems: 'center',
                            transform: [{ translateY: anim, }]
                        }}>
                            <LinearGradient
                                // Button Linear Gradient
                                colors={['#8DC867', '#8DC867', '#8DC867']}>

                                <View style={{ alignItems: 'center', width: width * 0.7, borderWidth: 0, }}>
                                    <Image
                                        source={transition_session_complete}
                                        style={{ width: width * 0.8 }}
                                        resizeMode='contain' />
                                </View>
                            </LinearGradient>


                        </Animated.View>
                        <Animated.View style={{
                            width: width * 0.7,
                            height: height - 30,
                            transform: [{ translateY: anim, }]
                        }}>
                            <LinearGradient
                                // Button Linear Gradient
                                colors={['#8DC867', 'rgba(255,255,255,0.2)']}
                                locations={[0.1, 0.4]}
                                start={{ x: 0.5, y: 0, }}
                                end={{ x: 0.5, y: 1, }}
                                style={{ width: '100%', height: '100%', }}
                            ></LinearGradient>
                        </Animated.View>
                    </View> : null}


            </View>
        </HideKeyboard >
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
    textDefaultSemiBold: {
        fontFamily: 'Inter-SemiBold',
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
        borderWidth: 0,
        borderColor: 'green'
    },
    viewContainer: {
        //marginTop: 55,
        flex: 1
    },
    input: {
        borderRadius: 15,
        paddingHorizontal: 17,
        paddingVertical: 10,
        //shadowOffset: { width: 0.05, height: 0.05, },
        //shadowOpacity: 0.05,
        color: 'gray',
        fontSize: 17,
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
        //backgroundColor: '#ABC57E',
        backgroundColor: '#8CC768',
        borderBottomRightRadius: 10,
        borderTopRightRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalButtonText: {
        fontSize: 30,
        color: 'white',
    },
    start: {
        //backgroundColor: '#ABC57E',
        backgroundColor: '#8CC768',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        alignSelf: 'center',
        marginBottom: 10,

    },
    startText: {
        color: 'white',
        fontFamily: 'Inter-Regular',
        fontSize: 25,
        fontWeight: 'bold'
    }
})

export default SessionSelectScreen;