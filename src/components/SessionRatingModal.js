import React, { useState, useContext, useCallback } from 'react';
import {
    View, StyleSheet, Text, TouchableOpacity, Dimensions, Image, ActivityIndicator,
    TouchableWithoutFeedback, Alert
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import timeoutApi from '../api/timeout';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Context as CategoryContext } from '../context/CategoryContext';
import { Context as UserContext } from '../context/userContext';
import { Context as SessionContext } from '../context/SessionContext';
import { fromUnixTime, startOfMonth, endOfMonth, differenceInSeconds } from 'date-fns';
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
    const [prodRatingNum, setProdRatingNum] = useState(0)
    const [ratingViewActive, setRatingViewActive] = useState(true)
    const [isPrivate, setIsPrivate] = useState(false);
    const [sessionObjFinal, setSessionObjFinal] = useState({
        ...sessionObj,
        //sessionEndTime: sessionEndTime,
        end_early: endEarlyFlag,
        plannedMin: plannedMin,
        prod_rating: -1, // 0 if user doesn't pick productivity
        time_start: fromUnixTime(sessionStartTime),
        time_end: fromUnixTime(sessionEndTime),
        is_private: false,
        //startRange: startOfDay(fromUnixTime(sessionStartTime)),
        //endRange: endOfDay(fromUnixTime(sessionStartTime)),
        //yesterdayStartRange: subDays(startOfDay(fromUnixTime(sessionStartTime)), 1),
        //yesterdayEndRange: subDays(endOfDay(fromUnixTime(sessionStartTime)), 1),
    })

    // handle adding to Todo List or not
    const [existingItem, setExistingItem] = useState(false)
    const [existingId, setExistingId] = useState('')
    const [toKeep, setToKeep] = useState(true);
    const [toAdd, setToAdd] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [pointsEarned, setPointsEarned] = useState(0);

    const { state: s, deleteTodoItem, addTodoItem, fetchUserTodoItems } = useContext(CategoryContext)
    const { state: userState, addPoints, fetchSelf } = useContext(UserContext)
    const { saveSession, fetchMultipleMonths } = useContext(SessionContext)

    const toggleRatingViewActive = () => {
        var num_stars = sessionObjFinal.prod_rating / 20
        var num_sec = differenceInSeconds(sessionObjFinal.time_end, sessionObjFinal.time_start)
        console.log(`num stars: ${num_stars}`)
        console.log(`num sec: ${num_sec}`)
        setPointsEarned(Math.ceil(1000 * (num_stars + 1) / 5 * num_sec / 3600));

        setRatingViewActive(!ratingViewActive)
    }
    const toggleRemoveTodo = () => {
        setToKeep(previousState => !previousState);
    }
    const toggleIsPrivate = () => {
        var toChange = !isPrivate
        setIsPrivate(toChange);
        setSessionObjFinal({ ...sessionObjFinal, is_private: toChange })
    }
    const toggleAddTodo = () => {
        setToAdd(previousState => !previousState);
    }

    console.log("sessionObj is ", sessionObjFinal)
    console.log("End early flag: ", endEarlyFlag)
    console.log("End time: ", sessionEndTime)

    const areYouSureDelete = () => {
        Alert.alert(
            "Deleting this from your to-do list will erase any notes you may have there. Continue?",
            "",
            [{ text: "Go back", onPress: () => { setIsLoading(false) }, style: "cancel" },
            {
                text: "Delete", onPress: () => {
                    setIsLoading(true)
                    saveSession(sessionObjFinal, saveSession_callback, saveSessionErrorCallback, false)
                }
            }]
        );
    }

    const saveSession_callback = async () => {
        console.log("sessionStartTime is ", fromUnixTime(sessionStartTime));
        var endTime = endOfMonth(fromUnixTime(sessionStartTime))
        var startTime = startOfMonth(fromUnixTime(sessionStartTime))
        try {
            await fetchMultipleMonths(startTime, endTime)
        } catch (err) {
            console.log("Problem fetching months")
            offBoard();
            return
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
            return
        }

        // setting num points earned: max of 1000 points for 60 min and 5 stars
        // 1000 * ((num_stars+1) / 5) * (num_mins / 60)
        try {
            await addPoints(userState.user_id, pointsEarned, offBoard())
        } catch (err) {
            console.log("Problem adding points")
            offBoard();
        }
    }

    const saveSessionErrorCallback = () => {
        offBoard();
    }

    const saveSession_TEMPDISABLE = async () => {

        try {
            const response = await timeoutApi.post('/save_session', [sessionObjFinal])
            console.log("Session save successful!")
            console.log("Response is ", response);

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
        await addTodoItem(sessionObjFinal.activity_name, new Date(), sessionObjFinal.cat_id)
        console.log("Added this task from todo list")
    }
    const offBoard = () => {
        setIsLoading(false)
        toggleFunction()
        offBoardCallback();
    }

    const checkTodoMatch = () => {
        // check if this was an existing ToDo item
        var curTodoItems = s.userTodoItems
        for (var i = 0; i < curTodoItems.length; i++) {
            var _catId = curTodoItems[i]['category_id']
            var _itemDesc = curTodoItems[i]['item_desc']

            if (_catId == sessionObjFinal.cat_id && _itemDesc == sessionObjFinal.activity_name) {
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
                borderWidth: 0, flex: 3, backgroundColor: 'white', alignItems: 'center',
                zIndex: 1, elevation: 1,
                borderBottomLeftRadius: BORDER_RADIUS, borderBottomRightRadius: BORDER_RADIUS,
            }}>
                <View style={{ flex: 1, alignItems: 'center', borderWidth: 0, }}>
                    <Text style={[styles.textDefault, { color: '#67806D', fontSize: 18, }]}>Now be honest...</Text>
                    <Text style={[styles.textDefaultBold, { color: '#67806D', marginTop: 10, fontSize: 18, }]}>How productive were you?</Text>
                    <View style={{ flexDirection: 'row', marginTop: 20, }}>
                        <TouchableWithoutFeedback
                            onPress={() => {
                                setProdRatingNum(20)
                                setSessionObjFinal({
                                    ...sessionObjFinal, prod_rating: Math.round(20),
                                })
                            }}>
                            {prodRatingNum >= 20 ?
                                <Image
                                    source={iconRating}
                                    style={{ width: ICON_LENGTH, height: ICON_LENGTH, marginHorizontal: 5, }}
                                />
                                :
                                <Image
                                    source={iconRatingNull}
                                    style={{ width: ICON_LENGTH, height: ICON_LENGTH, marginHorizontal: 5, }}
                                />
                            }
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback
                            onPress={() => {
                                setProdRatingNum(40)
                                setSessionObjFinal({
                                    ...sessionObjFinal, prod_rating: Math.round(40),
                                })
                            }}>
                            {prodRatingNum >= 40 ?
                                <Image
                                    source={iconRating}
                                    style={{ width: ICON_LENGTH, height: ICON_LENGTH, marginHorizontal: 5, }}
                                />
                                :
                                <Image
                                    source={iconRatingNull}
                                    style={{ width: ICON_LENGTH, height: ICON_LENGTH, marginHorizontal: 5, }}
                                />
                            }
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                            onPress={() => {
                                setProdRatingNum(60)
                                setSessionObjFinal({
                                    ...sessionObjFinal, prod_rating: Math.round(60),
                                })
                            }}>
                            {prodRatingNum >= 60 ?
                                <Image
                                    source={iconRating}
                                    style={{ width: ICON_LENGTH, height: ICON_LENGTH, marginHorizontal: 5, }}
                                />
                                :
                                <Image
                                    source={iconRatingNull}
                                    style={{ width: ICON_LENGTH, height: ICON_LENGTH, marginHorizontal: 5, }}
                                />
                            }
                        </TouchableWithoutFeedback>


                        <TouchableWithoutFeedback
                            onPress={() => {
                                setProdRatingNum(80)
                                setSessionObjFinal({
                                    ...sessionObjFinal, prod_rating: Math.round(80),
                                })
                            }}>
                            {prodRatingNum >= 80 ?
                                <Image
                                    source={iconRating}
                                    style={{ width: ICON_LENGTH, height: ICON_LENGTH, marginHorizontal: 5, }}
                                />
                                :
                                <Image
                                    source={iconRatingNull}
                                    style={{ width: ICON_LENGTH, height: ICON_LENGTH, marginHorizontal: 5, }}
                                />
                            }
                        </TouchableWithoutFeedback>


                        <TouchableWithoutFeedback
                            onPress={() => {
                                setProdRatingNum(100)
                                setSessionObjFinal({
                                    ...sessionObjFinal, prod_rating: Math.round(100),
                                })
                            }}>
                            {prodRatingNum >= 100 ?
                                <Image
                                    source={iconRating}
                                    style={{ width: ICON_LENGTH, height: ICON_LENGTH, marginHorizontal: 5, }}
                                />
                                :
                                <Image
                                    source={iconRatingNull}
                                    style={{ width: ICON_LENGTH, height: ICON_LENGTH, marginHorizontal: 5, }}
                                />
                            }
                        </TouchableWithoutFeedback>

                    </View>

                    <View style={{ marginTop: 20, }}>
                    </View>
                </View>
                <View style={{ flex: 1, alignItems: 'center', borderWidth: 0, }}>
                    <TouchableOpacity
                        style={{
                            backgroundColor: "#FCC759", alignItems: 'center', paddingVertical: 13,
                            borderRadius: 10, marginTop: 25, width: 150,
                            shadowOffset: {
                                width: 0,
                                height: 1,
                            },
                            shadowOpacity: 0.1,
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
                    borderWidth: 0, flex: 3, backgroundColor: 'white', alignItems: 'center',
                    zIndex: 1, elevation: 1,
                    borderBottomLeftRadius: BORDER_RADIUS, borderBottomRightRadius: BORDER_RADIUS,
                }}>
                <View style={{ alignItems: 'center', }}>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                        <Text style={[styles.textDefaultBold,
                        {
                            color: '#67806D', marginTop: 10, fontSize: 22,
                        }]}>You earned {pointsEarned} </Text>
                        <Image
                            source={pointSquares}
                            style={{ width: 22, height: 22, }}
                        />
                        <Text style={[styles.textDefaultBold,
                        { color: '#67806D', marginTop: 10, fontSize: 22, }]}>!</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 25, alignItems: 'center', marginHorizontal: 50, }}>
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
                                <View>
                                    <Text style={[styles.textDefault, { color: '#67806D', fontSize: 16, }]}>Add this to my task list!</Text>
                                </View>

                            </>}

                    </View>
                    {/*<Text>toKeep: {toKeep.toString()}</Text>
                    <Text>toAdd: {toAdd.toString()}</Text>*/}


                    <View style={{
                        flexDirection: 'row', alignItems: 'center', marginHorizontal: 50,
                        marginTop: 15
                    }}>
                        <TouchableOpacity
                            onPress={() => {
                                toggleIsPrivate()
                            }}>
                            {!isPrivate ?

                                <Image
                                    source={yellowCheckmark}
                                    style={{ width: 25, height: 25, marginRight: 10, }} />
                                :
                                <View style={{
                                    width: 23, height: 25, marginRight: 12, borderRadius: 5, borderColor: '#FCC759',
                                    borderWidth: 5
                                }}></View>}
                        </TouchableOpacity>

                        <Text style={[styles.textDefault, { color: '#67806D', fontSize: 15, }]}>Item is public (friends can see your category and activity name).</Text>

                    </View>

                </View>
                <View opacity={isLoading ? 0.3 : 1} style={{ alignItems: 'center', borderWidth: 0, }}>
                    <TouchableOpacity
                        style={{
                            backgroundColor: "#ABC57E", alignItems: 'center', paddingVertical: 13,
                            borderRadius: 10, marginTop: 25, width: 150,
                            shadowOffset: {
                                width: 0.1,
                                height: 0.1,
                            },
                            shadowOpacity: 0.2,
                            color: '#ABC57E',
                            fontSize: 18,
                        }}
                        onPress={() => {
                            if (!isLoading) {
                                // if deleting task from to-do list, ask for confirmation
                                if (existingItem && !toKeep) {
                                    areYouSureDelete()
                                } else {
                                    setIsLoading(true)
                                    saveSession(sessionObjFinal, saveSession_callback, saveSessionErrorCallback, false)
                                }

                            }

                        }}>
                        <Text style={[styles.textDefaultBold, { color: 'white', fontSize: 18, }]}>Finish</Text>

                    </TouchableOpacity>
                </View>
                {isPrivate ?
                    <View style={{ alignItems: 'center', marginHorizontal: 50, }}>
                        <Text style={{ textAlign: 'center', }}>Item is private. You can always change this later in your history.</Text>
                    </View>
                    : null}



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
            <View style={{ borderWidth: 0, flex: 1, }}>

            </View>
            <View style={{
                borderWidth: 0, flex: 1, backgroundColor: 'white',
                borderTopLeftRadius: BORDER_RADIUS, borderTopRightRadius: BORDER_RADIUS,
            }}>

            </View>
            {ratingViewActive ? sessionRatingView() : sessionRewardView()}
            <View style={{ borderWidth: 0, flex: 1, }}>

            </View>

            <View
                style={{ borderWidth: 0, position: 'absolute', borderColor: 'pink', flex: 1, width: '100%', height: '100%', }}>
                <View style={{ borderWidth: 0, borderColor: 'pink', flex: 1 }}>
                    <Image
                        source={sessionCompleteBanner}
                        resizeMode="contain"
                        style={{ width: '100%' }} />
                </View>
                <View style={{ borderWidth: 0, borderColor: 'pink', flex: 1, }}>

                </View>
                <View style={{ borderWidth: 0, borderColor: 'pink', flex: 1 }}></View>
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
        borderWidth: 0,
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