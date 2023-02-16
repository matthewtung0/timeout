import React, { useState, useContext, useRef, useCallback } from 'react';
import {
    View, StyleSheet, TouchableOpacity, Dimensions, Image, TextInput,
    Keyboard, TouchableWithoutFeedback, ActivityIndicator, Platform,
} from 'react-native';
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
import { fromUnixTime, startOfMonth, endOfMonth } from 'date-fns';

const background_desk = require('../../assets/background_desk.png')
const clock_bottom = require('../../assets/clock_bottom.png');
const clock_top = require('../../assets/clock_top.png');
const PADDING_TOP = 55;

const HideKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>
);

const SessionSelectScreen = ({ navigation: { navigate }, }) => {
    const { height, width } = Dimensions.get('window');
    const [time, setTime] = useState(0);
    const { state, fetchSelf, fetchFriendsIfUpdate, addPoints } = useContext(UserContext)
    const { setChosen, setActivityName } = useContext(CategoryContext)
    const { saveSession, fetchMultipleMonths } = useContext(SessionContext)
    const [customActivity, setCustomActivity] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const [categoryId, setCategoryId] = useState("3");
    const [newCatName, setNewCatName] = useState('unsorted')
    const [newColorId, setNewColorId] = useState('c10')

    const [modalVisible, setModalVisible] = useState(false)

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


                alert(String(storedSessions.length) + " stored sessions now updated")
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
        //AsyncStorage.removeItem('storedSessions'); // TEMP

        /*AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: 'us-east-1:e7cd068c-97f2-48f2-a12b-8abf24e576e4' }, {region:'us-east-1'});
        AWS.config.credentials.getPromise();

        //register the device with the push service
        Notifications.registerRemoteNotifications();
        //setup the onRegistration listener (lambda for clarity)
        Notifications.events().registerRemoteNotificationsRegistered((token) => onRegistration(token))

        const sns = new AWS.SNS();
        sns.createPlatformEndpoint({ARN, Token}, callback);
*/
        setIsLoading(false)
    }

    useFocusEffect(
        useCallback(() => {
            focusEffectFunc()
        }, [])
    )

    const clearInputs = () => {
        setCategoryId("3")
        setTime(0)
        updateTime(0)
        setNewColorId('c10')
        setCustomActivity('')
    }

    const circularRef = useRef()

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

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

    return (
        <HideKeyboard>
            <>
                <View
                    style={[styles.viewContainer, { paddingTop: PADDING_TOP, }]}
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
                                    height: height * 0.7,
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

                    <View
                        //onLayout={({ nativeEvent }) => {
                        /*newRef?.current?.measure((x, y, pageX, pageY, width, height) => {
                            console.log('Component width is: ' + width)
                            console.log('Component height is: ' + height)
                            console.log('Component x is: ' + x)
                            console.log('Component y is: ' + y)
                            console.log('Component pageX is: ' + pageX)
                            console.log('Component pageY is: ' + pageY)
                        })
        
                        newRef?.current?.measureInWindow((fx, fy, width, height, px, py) => {
                            console.log('Component width is: ' + width)
                            console.log('Component height is: ' + height)
                            console.log('X offset to frame: ' + fx)
                            console.log('Y offset to frame: ' + fy)
                            console.log('X offset to page: ' + px)
                            console.log('Y offset to page: ' + py)
                        })*/
                        //console.log(nativeEvent.layout)
                        //}}
                        style={{ borderColor: 'pink', borderWidth: 0, }}
                    >
                        <View style={{ position: 'absolute', flex: 1, borderWidth: 0, width: '100%', height: '100%', }}>
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
                                height: (width / 2 / 0.80) * 0.22, alignSelf: "center", borderWidth: 0.1, borderColor: 'yellow',
                                marginTop: 30,
                            }}
                            resizeMode="contain" />
                        <View
                        >
                            <CircularSelector
                                minSet={0}
                                updateCallback={updateTime}
                                ref={circularRef} />
                        </View>

                        <Image
                            source={clock_bottom}
                            style={{
                                width: width / 2 / 0.80,
                                height: (width / 2 / 0.80) * 0.085, alignSelf: "center", borderWidth: 0.1, borderColor: 'yellow'
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
                            style={[styles.input, styles.textDefault,
                            { width: width * 0.8, marginBottom: 20, height: 45, color: '#67806D' }]}
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

                    {state.errorMessage && 0 ?
                        <View style={{ backgroundColor: '#F5BBAE', width: '100%', paddingHorizontal: 10, }}>
                            <Text style={[styles.textDefault, { textAlign: 'center', color: 'red', fontSize: 16 }]}>
                                No internet connection - will attempt to save any tasks done once connection is restored.
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

            </>

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
        alignSelf: 'center',
        backgroundColor: 'white',
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