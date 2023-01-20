import React, { useState, useContext, useCallback } from 'react';
import {
    View, StyleSheet, Text, TouchableOpacity, Dimensions, Image, ActivityIndicator
} from 'react-native';
import Slider from '@react-native-community/slider'
import { useFocusEffect } from '@react-navigation/native';
import timeoutApi from '../api/timeout';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Context as CategoryContext } from '../context/CategoryContext';
import { Context as UserContext } from '../context/userContext';
import { fromUnixTime } from 'date-fns';
const constants = require('../components/constants.json')
const sessionCompleteBanner = require('../../assets/sessionCompleteBanner.png');
const iconRatingNull = require('../../assets/icon_rating-null.png')
const iconRating = require('../../assets/icon_rating.png')
const yellowCheckmark = require('../../assets/yellow_checkmark.png')
const pointSquares = require('../../assets/point_squares.png')
const ICON_LENGTH = 30;
const BORDER_RADIUS = 20;



const SessionRatingModal = ({ toggleFunction, colorArr, sessionObj, sessionEndTime, endEarlyFlag,
    plannedMin, sessionStartTime, offBoardCallback }) => {
    const { height, width } = Dimensions.get('window');
    const [prodRatingNum, setProdRatingNum] = useState(50)
    const [ratingViewActive, setRatingViewActive] = useState(true)
    const [sessionObjFinal, setSessionObjFinal] = useState({
        ...sessionObj,
        //sessionEndTime: sessionEndTime,
        endEarlyFlag: endEarlyFlag,
        plannedMin: plannedMin,
        prodRating: 50, // 50 if user doesn't pick productivity
        sessionStartTime: fromUnixTime(sessionStartTime),
        sessionEndTime: fromUnixTime(sessionEndTime),

        //sessionStartTime: fromUnixTime(sessionObj.sessionStartTime),
        //sessionEndTime: fromUnixTime(sessionEndTime)
    })

    // handle adding to Todo List or not
    const [existingItem, setExistingItem] = useState(false)
    const [existingId, setExistingId] = useState('')
    const [toKeep, setToKeep] = useState(true);
    const [toAdd, setToAdd] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const { state: s, deleteTodoItem, addTodoItem, fetchUserTodoItems } = useContext(CategoryContext)
    const { state: userState, addPoints, fetchSelf } = useContext(UserContext)

    const toggleRatingViewActive = () => {
        setRatingViewActive(!ratingViewActive)
    }
    const toggleRemoveTodo = () => {
        setToKeep(previousState => !previousState);
    }
    const toggleAddTodo = () => {
        setToAdd(previousState => !previousState);
    }

    console.log("sessionObj is ", sessionObjFinal)
    console.log("End early flag: ", endEarlyFlag)
    console.log("End time: ", sessionEndTime)

    const saveSession = async () => {

        try {
            const response = await timeoutApi.post('/save_session', [sessionObjFinal])
            console.log("Session save successful!")

            // after save session, fetch self to update stats, and then update the points
            await fetchSelf()
        } catch (err) {
            console.log("Problem adding session", err)

            // save session to asyncStorage to enter later
            var storedSessions = await AsyncStorage.getItem('storedSessions')
            if (storedSessions) {
                var temp = JSON.parse(storedSessions)
                temp.push(sessionObjFinal)
                storedSessions = JSON.stringify(temp)
            } else {
                storedSessions = JSON.stringify([sessionObjFinal])
            }
            await AsyncStorage.setItem('storedSessions', storedSessions);

            alert("Sorry, we ran into a problem - your session will be saved when internet connection is stored")

            offBoard();
        }

        try {
            // deleting an existing task
            if (existingItem && !toKeep) {
                console.log("DELETING ITEM")
                await deleteItem()
                // adding a new task
            } else if (!existingItem && toAdd) {

                await addItem()
            }

            await fetchUserTodoItems()
        } catch (err) {
            console.log("Problem updating the todo lists");
            offBoard();
        }

        try {
            await addPoints(userState.user_id, 100000, offBoard())
        } catch (err) {
            console.log("Problem adding points")
            offBoard();
        }
    }
    // functions to add or remove from todo list if necessary
    const deleteItem = async () => {
        await deleteTodoItem(existingId)
        console.log("Deleted this task from todo list")
    }

    const addItem = async () => {
        await addTodoItem(sessionObjFinal.customActivity, new Date(), sessionObjFinal.chosenCatId)
        console.log("Added this task from todo list")
    }
    const offBoard = () => {
        setIsLoading(false)
        offBoardCallback();
        toggleFunction()
    }

    const checkTodoMatch = () => {
        // check if this was an existing ToDo item
        var curTodoItems = s.userTodoItems
        for (var i = 0; i < curTodoItems.length; i++) {
            var _catId = curTodoItems[i]['category_id']
            var _itemDesc = curTodoItems[i]['item_desc']

            if (_catId == sessionObjFinal.chosenCatId && _itemDesc == sessionObjFinal.customActivity) {
                console.log("This is an existing item")
                setExistingItem(true)
                setExistingId(curTodoItems[i]['item_id'])
                return
            } else {
                console.log("This is not an existing item")
            }
        }
    }


    const sessionRatingView = () => {
        return (
            <View style={{
                borderWidth: 1, flex: 3, backgroundColor: 'white', alignItems: 'center', zIndex: 1,
                borderBottomLeftRadius: BORDER_RADIUS, borderBottomRightRadius: BORDER_RADIUS,
            }}>
                <View style={{ flex: 1, alignItems: 'center', borderWidth: 1, }}>
                    <Text style={[styles.textDefault, { color: '#67806D', fontSize: 18, }]}>Now be honest...</Text>
                    <Text style={[styles.textDefaultBold, { color: '#67806D', marginTop: 10, fontSize: 18, }]}>How productive were you?</Text>
                    <View style={{ flexDirection: 'row', marginTop: 20, }}>
                        {prodRatingNum >= 20 ?
                            <Image
                                source={iconRating}
                                style={{ width: ICON_LENGTH, height: ICON_LENGTH, marginHorizontal: 3, }}
                            />
                            :
                            <Image
                                source={iconRatingNull}
                                style={{ width: ICON_LENGTH, height: ICON_LENGTH, marginHorizontal: 3, }}
                            />
                        }
                        {prodRatingNum >= 40 ?
                            <Image
                                source={iconRating}
                                style={{ width: ICON_LENGTH, height: ICON_LENGTH, marginHorizontal: 3, }}
                            />
                            :
                            <Image
                                source={iconRatingNull}
                                style={{ width: ICON_LENGTH, height: ICON_LENGTH, marginHorizontal: 3, }}
                            />
                        }
                        {prodRatingNum >= 60 ?
                            <Image
                                source={iconRating}
                                style={{ width: ICON_LENGTH, height: ICON_LENGTH, marginHorizontal: 3, }}
                            />
                            :
                            <Image
                                source={iconRatingNull}
                                style={{ width: ICON_LENGTH, height: ICON_LENGTH, marginHorizontal: 3, }}
                            />
                        }
                        {prodRatingNum >= 80 ?
                            <Image
                                source={iconRating}
                                style={{ width: ICON_LENGTH, height: ICON_LENGTH, marginHorizontal: 3, }}
                            />
                            :
                            <Image
                                source={iconRatingNull}
                                style={{ width: ICON_LENGTH, height: ICON_LENGTH, marginHorizontal: 3, }}
                            />
                        }
                        {prodRatingNum >= 100 ?
                            <Image
                                source={iconRating}
                                style={{ width: ICON_LENGTH, height: ICON_LENGTH, marginHorizontal: 3, }}
                            />
                            :
                            <Image
                                source={iconRatingNull}
                                style={{ width: ICON_LENGTH, height: ICON_LENGTH, marginHorizontal: 3, }}
                            />
                        }
                    </View>

                    <View style={{ marginTop: 20, }}>
                        <Slider
                            style={styles.slider}
                            minimumValue={0}
                            maximumValue={100}
                            minimumTrackTintColor="#CAE3B7"
                            maximumTrackTintColor="#C4C4C4"
                            value={50}
                            step={20}
                            thumbTintColor="#A7BEAD"
                            onSlidingStart={() => {
                            }}
                            onSlidingComplete={() => {
                                setSessionObjFinal({
                                    ...sessionObjFinal, prodRating: Math.round(prodRatingNum),
                                })
                            }}
                            onValueChange={setProdRatingNum}
                        />
                    </View>
                </View>
                <View style={{ flex: 1, alignItems: 'center', borderWidth: 1, }}>
                    <TouchableOpacity
                        style={{
                            backgroundColor: "#FCC759", alignItems: 'center', paddingVertical: 13,
                            borderRadius: 10, marginTop: 25, width: 150,
                            shadowOffset: {
                                width: 0,
                                height: 2,
                            },
                            shadowOpacity: 0.3,
                            color: '#FCC759',
                            fontSize: 18,
                        }}
                        onPress={toggleRatingViewActive}>
                        <Text style={[styles.textDefaultBold, { color: 'white', fontSize: 18, }]}>Continue</Text>

                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    const sessionRewardView = () => {
        return (
            <View
                style={{
                    borderWidth: 1, flex: 3, backgroundColor: 'white', alignItems: 'center', zIndex: 1,
                    borderBottomLeftRadius: BORDER_RADIUS, borderBottomRightRadius: BORDER_RADIUS,
                }}>
                <View style={{ flex: 1, alignItems: 'center', }}>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                        <Text style={[styles.textDefaultBold,
                        {
                            color: '#67806D', marginTop: 10, fontSize: 18,
                        }]}>You earned 100 </Text>
                        <Image
                            source={pointSquares}
                            style={{ width: 18, height: 18, }}
                        />
                        <Text style={[styles.textDefaultBold,
                        { color: '#67806D', marginTop: 10, fontSize: 18, }]}>!</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 50, alignItems: 'center', }}>
                        {existingItem ?
                            <><TouchableOpacity
                                onPress={() => {
                                    toggleRemoveTodo()
                                }}>
                                {toKeep ?

                                    <Image
                                        source={yellowCheckmark}
                                        style={{ width: 25, height: 25, marginRight: 10, }} />
                                    :
                                    <View style={{
                                        width: 23, height: 25, marginRight: 12, borderRadius: 5, borderColor: '#FCC759',
                                        borderWidth: 5
                                    }}></View>}
                            </TouchableOpacity>

                                <Text style={[styles.textDefault, { color: '#67806D', fontSize: 15, }]}>Keep this in my task list!</Text>

                            </>
                            :
                            <><TouchableOpacity
                                onPress={() => {
                                    toggleAddTodo()
                                }}>
                                {toAdd ?

                                    <Image
                                        source={yellowCheckmark}
                                        style={{ width: 25, height: 25, marginRight: 10, }} />
                                    :
                                    <View style={{
                                        width: 23, height: 25, marginRight: 12, borderRadius: 5, borderColor: '#FCC759',
                                        borderWidth: 5
                                    }}></View>}
                            </TouchableOpacity>

                                <Text style={[styles.textDefault, { color: '#67806D', fontSize: 15, }]}>Add this to my task list!</Text>

                            </>}

                    </View>
                    <Text>toKeep: {toKeep.toString()}</Text>
                    <Text>toAdd: {toAdd.toString()}</Text>
                </View>
                <View opacity={isLoading ? 0.3 : 1} style={{ flex: 1, alignItems: 'center', borderWidth: 1, }}>
                    <TouchableOpacity
                        style={{
                            backgroundColor: "#CAE3B7", alignItems: 'center', paddingVertical: 13,
                            borderRadius: 10, marginTop: 25, width: 150,
                            shadowOffset: {
                                width: 0,
                                height: 2,
                            },
                            shadowOpacity: 0.3,
                            color: '#CAE3B7',
                            fontSize: 18,
                        }}
                        onPress={() => {
                            if (!isLoading) {
                                setIsLoading(true)
                                saveSession()
                            }

                        }}>
                        <Text style={[styles.textDefaultBold, { color: 'white', fontSize: 18, }]}>OK</Text>

                    </TouchableOpacity>
                </View>



            </View>
        )
    }

    useFocusEffect(
        useCallback(() => {
            checkTodoMatch()
        }, [])
    )


    return (
        <><View
            style={[styles.container, { width: width * 0.9, flex: 1, }]}>
            <View style={{ borderWidth: 1, flex: 1, }}>

            </View>
            <View style={{
                borderWidth: 1, flex: 1, backgroundColor: 'white',
                borderTopLeftRadius: BORDER_RADIUS, borderTopRightRadius: BORDER_RADIUS,
            }}>

            </View>
            {ratingViewActive ? sessionRatingView() : sessionRewardView()}
            <View style={{ borderWidth: 1, flex: 1, }}>

            </View>

            <View
                style={{ borderWidth: 3, position: 'absolute', borderColor: 'pink', flex: 1, width: '100%', height: '100%', }}>
                <View style={{ borderWidth: 1, borderColor: 'pink', flex: 1 }}>
                    <Image
                        source={sessionCompleteBanner}
                        resizeMode="contain"
                        style={{ width: '100%' }} />
                </View>
                <View style={{ borderWidth: 1, borderColor: 'pink', flex: 1, }}>

                </View>
                <View style={{ borderWidth: 1, borderColor: 'pink', flex: 1 }}></View>
            </View>

        </View>
            {isLoading ?
                <View
                    style={{
                        width: '100%', height: '100%', position: 'absolute',
                        justifyContent: 'center', alignItems: 'center',
                    }}>
                    <ActivityIndicator style={{ width: 100, height: 100 }} size="large" color="black" />
                </View>
                :
                null}
        </>

    )

}

const styles = StyleSheet.create({
    textDefaultBold: {
        fontFamily: 'Inter-Bold',
    },
    textDefault: {
        fontFamily: 'Inter-Regular',
    },
    container: {
        flex: 1,
        borderWidth: 2,
    },
    parentContainer: {
        flex: 1,
        justifyContent: 'space-around',
        backgroundColor: '#F9EAD3'
    },
    labelText: { marginLeft: 5, color: 'gray', },
    colorSquare: {
        width: 50,
        height: 50,
        marginHorizontal: 5,
        marginTop: 5,
        marginBottom: 15,
    },
    title: {
        alignSelf: 'center',
        margin: 20,
        marginBottom: 50,
        fontSize: 25,
        fontWeight: 'bold',
        color: 'white',
    },
    backButton: {
        width: 50,
        height: 50,
        justifyContent: 'center',
    },
    backButtonText: {
        alignSelf: 'center',
        fontWeight: 'bold',
        fontSize: 25,
        color: 'white',

    },
    backContainer: {
        flex: 1,
        width: '50%',
        position: 'absolute',
        alignSelf: 'flex-end',
        justifyContent: 'flex-end',
        alignItems: 'flex-end'
    },
    dummy: {
        flex: 0.03,
    },
    goBackChild: {
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center',
    },
    submit: {
        backgroundColor: '#FCC859',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        alignSelf: 'center',
        marginBottom: 40,
        marginTop: 30,
        shadowOffset: {
            width: 0.05,
            height: 0.05,
        },
        shadowOpacity: 0.3,
    },
    submitText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        padding: 10,
    },
    inputStyleContainer: {
        borderBottomWidth: 0,
    },
    inputStyle: {
        marginTop: 5,
        backgroundColor: 'white',
        borderRadius: 15,
        paddingHorizontal: 10,
        alignSelf: 'center',
        marginBottom: 20,
        color: 'gray',
        fontSize: 18,
        fontWeight: '600',
    },
    slider: {
        width: 200,
    },
})

export default SessionRatingModal;