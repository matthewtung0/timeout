import React, { useContext, useState, useCallback } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Switch, ActivityIndicator } from 'react-native';
import { Context as CategoryContext } from '../context/CategoryContext';
import { Context as UserContext } from '../context/userContext';
import timeoutApi from '../api/timeout';
import { useFocusEffect } from '@react-navigation/native';
import { fromUnixTime, toDate } from 'date-fns';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SessionRewardScreen = ({ navigation: { navigate }, route: { params } }) => {
    const { sessionObjEval, sessionStartTime, sessionEndTime } = params;
    console.log("This object made it here", sessionObjEval);
    console.log("Session start time", fromUnixTime(sessionStartTime));
    console.log("Session end time", fromUnixTime(sessionEndTime));

    const [sessionObjReward, setSessionObjReward] = useState({
        ...sessionObjEval,
        sessionStartTime: fromUnixTime(sessionStartTime),
        sessionEndTime: fromUnixTime(sessionEndTime)
    })

    const { state: s, deleteTodoItem, addTodoItem, fetchUserTodoItems } = useContext(CategoryContext)
    const { state: userState, addPoints, fetchSelf } = useContext(UserContext)

    let energyBase = 100;

    // handle adding to Todo List or not
    const [existingItem, setExistingItem] = useState(false)
    const [existingId, setExistingId] = useState('')

    const [toKeep, setToKeep] = useState(true);
    const [toAdd, setToAdd] = useState(false)
    const toggleRemoveTodo = () => {
        setToKeep(previousState => !previousState);
    }
    const toggleAddTodo = () => {
        setToAdd(previousState => !previousState);
    }

    const [isLoading, setIsLoading] = useState(false)

    console.log("tokeep is", toKeep);
    console.log("toAdd is ", toAdd)
    console.log("existing id", existingId)

    const saveSession = async () => {

        try {
            const response = await timeoutApi.post('/save_session', [sessionObjReward])
            console.log("Session save successful!")

            // after save session, fetch self to update stats, and then update the points
            await fetchSelf()
        } catch (err) {
            console.log("Problem adding session", err)

            // save session to asyncStorage to enter later
            var storedSessions = await AsyncStorage.getItem('storedSessions')
            if (storedSessions) {
                var temp = JSON.parse(storedSessions)
                temp.push(sessionObjReward)
                storedSessions = JSON.stringify(temp)
            } else {
                storedSessions = JSON.stringify([sessionObjReward])
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

    const checkTodoMatch = () => {
        // check if this was an existing ToDo item
        var curTodoItems = s.userTodoItems
        for (var i = 0; i < curTodoItems.length; i++) {
            var _catId = curTodoItems[i]['category_id']
            var _itemDesc = curTodoItems[i]['item_desc']

            if (_catId == sessionObjReward.chosenCatId && _itemDesc == sessionObjReward.customActivity) {
                setExistingItem(true)
                setExistingId(curTodoItems[i]['item_id'])
                return
            }
        }
    }

    // functions to add or remove from todo list if necessary
    const deleteItem = async () => {
        await deleteTodoItem(existingId)
        console.log("Deleted this task from todo list")
    }

    const addItem = async () => {
        await addTodoItem(sessionObjReward.customActivity, new Date(), sessionObjReward.chosenCatId)
        console.log("Added this task from todo list")
    }

    const offBoard = () => {
        setIsLoading(false)
        navigate('SessionSelect')
    }


    useFocusEffect(
        useCallback(() => {
            checkTodoMatch()
        }, [])
    )
    return (
        <View style={styles.container}>
            <View style={{ flex: 0.4 }}>
                <Text style={styles.text}>You have earned {energyBase.toString()} energy!</Text>
            </View>


            {existingItem ? (
                <View style={styles.toggleContainer}>
                    <Text style={{ marginBottom: 10, }}>This task is currently on your task list.</Text>
                    <Text>If you want to remove it, just disable the switch below. Otherwise, no action needed.</Text>
                    <View style={{ flex: 1, flexDirection: 'row', marginTop: 20, }}>
                        <Switch
                            style={{ flex: 0.3, marginRight: 20, }}
                            trackColor={{ false: "#ABC57E", true: "#ABC57E" }}
                            thumbColor={toKeep ? "#67806D" : "#67806D"}
                            //ios_backgroundColor="#ABC57E"
                            onValueChange={toggleRemoveTodo}
                            value={toKeep}
                        />
                        {toKeep ? <Text style={{ flex: 1, }}>Keep it, I'm still working on it!</Text> :
                            <Text style={{ flex: 1, }}>I'm done, remove this from my task list.</Text>}
                    </View>
                </View>) :
                (<View style={styles.toggleContainer}>
                    <Text style={{ marginBottom: 10, }}>This task isn't on your task list.</Text>
                    <Text>If you want to add it, just enable the switch below (you can always delete it again later).</Text>

                    <View style={{ flex: 1, flexDirection: 'row', marginTop: 20, }}>
                        <Switch
                            style={{ flex: 0.3, marginRight: 20, }}
                            trackColor={{ false: "#ABC57E", true: "#ABC57E" }}
                            thumbColor={toAdd ? "#67806D" : "#67806D"}
                            //ios_backgroundColor="#ABC57E"
                            onValueChange={toggleAddTodo}
                            value={toAdd}
                        />
                        {toAdd ? <Text style={{ flex: 1, }}>Yes, add it!</Text> :
                            <Text style={{ flex: 1, }}>I'm good for now.</Text>}


                    </View>


                </View>)
            }

            <View opacity={isLoading ? 0.3 : 1}
                style={{ flex: 0.5 }}>
                <TouchableOpacity
                    style={styles.buttonStyle}
                    onPress={() => {
                        setIsLoading(true)
                        saveSession()
                    }
                    }>
                    <Text style={styles.buttonTextStyle}>Done</Text>
                </TouchableOpacity>
            </View>
            <View style={{ flex: 0.5 }}>
                {isLoading ?
                    <><Text style={{ textAlign: 'center', marginBottom: 10, }}>Saving . . .</Text>
                        <ActivityIndicator size="large" />
                    </>
                    : null}
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 70,
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
    },
    text: {
        fontWeight: 'bold',
        fontSize: 24,
        color: '#67806D'
    },
    buttonStyle: {
        backgroundColor: '#FCC859',
        width: 150,
        height: 40,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        shadowOffset: {
            width: 0.5,
            height: 0.5,
        },
        shadowOpacity: 0.3,
    },
    buttonTextStyle: {
        color: '#F6F2DF',
        fontSize: 18,
        fontWeight: 'bold'
    },
    toggleContainer: {
        flex: 1,
        margin: 15,

    },
    toggleText: {
        flex: 1,
        marginHorizontal: 20,
        fontSize: 16,
        color: '#67806D'
    },

})

export default SessionRewardScreen;