import React, { useContext, useState, useCallback } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Switch } from 'react-native';
import { Context as CategoryContext } from '../context/CategoryContext';
import { Context as UserContext } from '../context/userContext';
import Slider from '@react-native-community/slider'
import timeoutApi from '../api/timeout';
import { format } from 'date-fns';
import { useFocusEffect } from '@react-navigation/native';

const SessionEvalScreen = ({ navigation: { navigate } }) => {
    const { state: s, setProdRating, deleteTodoItem, addTodoItem } = useContext(CategoryContext)
    const { state: userState, addPoints } = useContext(UserContext)
    const [prodRatingNum, setProdRatingNum] = useState(50)


    // handle adding to Todo List or not
    const [existingItem, setExistingItem] = useState(false)
    const [existingId, setExistingId] = useState('')

    const [toRemove, setToRemove] = useState(false);
    const [toAdd, setToAdd] = useState(false)
    const toggleRemoveTodo = () => setToRemove(previousState => !previousState);
    const toggleAddTodo = () => setToAdd(previousState => !previousState);

    // PUTTING THIS HERE TEMPORARILY ...
    const saveSession = async () => {
        try {
            const response = await timeoutApi.post('/save_session', s)
            console.log("Session save successful!")

            // after save session, update the points
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

            if (_catId == s.chosenCatId && _itemDesc == s.customActivity) {
                setExistingItem(true)
                setExistingId(s.item_id)
                return
            }
        }
    }

    // functions to add or remove from todo list if necessary
    const deleteItem = async () => {
        await deleteTodoItem(existingId)
    }

    const addItem = async () => {
        await addTodoItem(s.customActivity, new Date(), s.chosenCatId)
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
        <View>
            <Text>Congrats!</Text>
            <Text>You've finished!</Text>
            <Text>Now be honest..</Text>
            <Text>How productive were you?</Text>
            <Text>{prodRatingNum}</Text>
            <View style={{ alignItems: 'center' }}>
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={100}
                    minimumTrackTintColor="#90AB72"
                    maximumTrackTintColor="#F5BBAE"
                    value={50}
                    onSlidingStart={() => {
                        console.log("sliding started")
                    }}
                    onSlidingComplete={() => {
                        setProdRating(Math.round(prodRatingNum))
                        console.log("sliding completed")
                    }}
                    onValueChange={setProdRatingNum}
                />
            </View>


            <Text>You just completed category:</Text>
            <Text>{s.chosenCategory}</Text>
            <Text>Your activity was {s.customActivity}</Text>
            <Text>starting at {format(s.sessionStartTime, 'M-dd-yyyy')}
                and ending at {format(s.sessionEndTime, 'M-dd-yyyy')}, for a duration of
            </Text>
            <Text>End early flag is {s.endEarlyFlag.toString()}</Text>
            {/*if it was, show option to remove from todo items
            it it was not, show option to add this to todo item*/}
            {existingItem ? (<View>
                <Text>Enable if you want to remove this item from your todo list.</Text>
                <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={toRemove ? "#f5dd4b" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleRemoveTodo}
                    value={toRemove}
                />
            </View>) :
                (<View>
                    <Text>Check to add this item onto your todo list.</Text>
                    <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={toAdd ? "#f5dd4b" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleAddTodo}
                        value={toAdd}
                    />
                </View>)
            }

            <TouchableOpacity
                style={styles.buttonStyle}
                onPress={() => {
                    saveSession()
                }
                }>
                <Text style={styles.buttonTextStyle}>Finish</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        margin: 30,
        fontSize: 40,
    },
    slider: {
        width: 300,
        height: 40,
    },
    buttonStyle: {
        backgroundColor: '#FCC859',
        width: 150,
        height: 40,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10
    },
    buttonTextStyle: {
        color: '#F6F2DF',
        fontSize: 18,
        fontWeight: 'bold'

    },
})

export default SessionEvalScreen;