import React, { useContext, useState, useCallback } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Switch } from 'react-native';
import { Context as CategoryContext } from '../context/CategoryContext';
import { Context as UserContext } from '../context/userContext';
import timeoutApi from '../api/timeout';
import { useFocusEffect } from '@react-navigation/native';

const SessionRewardScreen = ({ navigation: { navigate }, route: { params } }) => {
    const { sessionObjEval } = params;
    console.log("This object made it here", sessionObjEval);
    const { state: s, deleteTodoItem, addTodoItem, fetchUserTodoItems } = useContext(CategoryContext)
    const { state: userState, addPoints, fetchSelf } = useContext(UserContext)

    let energyBase = 100;

    // handle adding to Todo List or not
    const [existingItem, setExistingItem] = useState(false)
    const [existingId, setExistingId] = useState('')

    const [toKeep, setToKeep] = useState(true);
    const [toAdd, setToAdd] = useState(false)
    const toggleRemoveTodo = () => setToKeep(previousState => !previousState);
    const toggleAddTodo = () => setToAdd(previousState => !previousState);

    const saveSession = async () => {



        try {
            const response = await timeoutApi.post('/save_session', sessionObjEval)
            console.log("Session save successful!")

            // deleting an existing task
            if (existingItem && !toKeep) {
                await deleteItem()
                // adding a new task
            } else if (!existingItem && toAdd) {
                await addItem()
            }

            // after save session, fetch self to update stats, and then update the points
            await fetchSelf()
            await fetchUserTodoItems()
            const res = addPoints(100000, offBoard())
        } catch (err) {
            console.log("Problem adding session", err)
        }
    }

    const checkTodoMatch = () => {
        // check if this was an existing ToDo item
        var curTodoItems = s.userTodoItems
        for (var i = 0; i < curTodoItems.length; i++) {
            var _catId = curTodoItems[i]['category_id']
            var _itemDesc = curTodoItems[i]['item_desc']

            if (_catId == sessionObjEval.chosenCatId && _itemDesc == sessionObjEval.customActivity) {
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
        await addTodoItem(s.customActivity, new Date(), s.chosenCatId)
        console.log("Added this task from todo list")
    }

    const offBoard = () => {
        navigate('SessionSelect')
    }


    useFocusEffect(
        useCallback(() => {
            checkTodoMatch()
        }, [])
    )
    return (
        <View style={styles.container}>
            <View style={{ flex: 1 }}>
                <Text style={styles.text}>You have earned {energyBase.toString()} energy!</Text>
            </View>


            {existingItem ? (<View style={styles.toggleContainer}>

                <Switch
                    style={styles.toggleSwitch}
                    trackColor={{ false: "#ABC57E", true: "#ABC57E" }}
                    thumbColor={toKeep ? "#67806D" : "#67806D"}
                    ios_backgroundColor="#ABC57E"
                    onValueChange={toggleRemoveTodo}
                    value={toKeep}
                />
                <Text style={styles.toggleText}>Disable this if you want to take this off your tasks list.</Text>
            </View>) :
                (<View style={styles.toggleContainer}>

                    <Switch
                        style={styles.toggleSwitch}
                        trackColor={{ false: "#ABC57E", true: "#ABC57E" }}
                        thumbColor={toAdd ? "#67806D" : "#67806D"}
                        ios_backgroundColor="#ABC57E"
                        onValueChange={toggleAddTodo}
                        value={toAdd}
                    />
                    <Text>Enable this if you want to add this to your tasks list.</Text>
                </View>)
            }

            <View style={{ flex: 1 }}>
                <TouchableOpacity
                    style={styles.buttonStyle}
                    onPress={() => {
                        saveSession()
                    }
                    }>
                    <Text style={styles.buttonTextStyle}>Done</Text>
                </TouchableOpacity>
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
            width: 1,
            height: 1,
        },
        shadowOpacity: 0.5,
    },
    buttonTextStyle: {
        color: '#F6F2DF',
        fontSize: 18,
        fontWeight: 'bold'
    },
    toggleContainer: {
        flex: 1,
        flexDirection: 'row',
        margin: 30,

    },
    toggleText: {
        flex: 1,
        marginHorizontal: 20,
        fontSize: 16,
        color: '#67806D'
    },
    toggleSwitch: {
    }

})

export default SessionRewardScreen;