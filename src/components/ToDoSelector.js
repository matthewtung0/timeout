import React, { useRef, useState } from 'react';
import { View, StyleSheet, Text, Button, TouchableOpacity, FlatList } from 'react-native';
import ToDoComponent from './ToDoComponent';
import AddTodoComponent from './AddTodoComponent';

const ToDoSelector = ({ todoItems, toggleFunction, callback }) => {
    const [showChild, setShowChild] = useState(false)

    const parentView = () => {
        return (
            <>
                <Text style={styles.title}>What's On Your Plate:</Text>
                <FlatList
                    style
                    horizontal={false}
                    data={todoItems}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(result) => result.item_id}
                    renderItem={({ item }) => {
                        return (
                            // on press go back to session select screen with the clicked item id, item name and cat id
                            <TouchableOpacity
                                onPress={() => {
                                    callback({
                                        "item_desc": item.item_desc,
                                        "cat_id": item.category_id,
                                        "item_id": item.item_id,
                                        "cat_name": item.category_name,
                                    })
                                    toggleFunction()
                                }}>
                                <View style={styles.toDoComponent}>
                                    <ToDoComponent
                                        itemName={item.item_desc}
                                        category={item.category_name}
                                        timeCreated={item.time_created} />
                                </View>
                            </TouchableOpacity>
                        )
                    }}
                    ListFooterComponent={() =>
                        <View>
                            <Button
                                onPress={() => {
                                    setShowChild(true)
                                }}
                                title="Add item" />
                        </View>
                    }
                />
            </>
        )
    }

    const childView = () => {

        // callback for after a new to-do item is added
        const addTodoCallback = () => {
            setShowChild(false)
        }
        return (
            <>
                <AddTodoComponent
                    callback={addTodoCallback} />
                <Button
                    onPress={() => {
                        setShowChild(false)
                    }}
                    title="Go back" />
            </>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.dummy} />
            <View style={styles.modal}>
                {showChild ? childView() : parentView()}

            </View>
            <View style={styles.backContainer}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={toggleFunction}>
                    <Text style={styles.backButtonText}>X</Text>
                </TouchableOpacity>
            </View>
        </View>
    )


    if (showChild) {
        return childView()
    } else {
        return parentView()
    }

}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        flex: 1,
    },
    modal: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'black',
        backgroundColor: '#FFFFFF',
    },
    title: {
        fontSize: 20,
        margin: 15,
        color: '#67806D',
    },
    toDoComponent: {
        marginHorizontal: 15,
    },
    backButton: {
        width: 40,
        height: 40,
        backgroundColor: 'green',
        justifyContent: 'center',
        borderRadius: 500,
    },
    backButtonText: {
        alignSelf: 'center',
    },
    backContainer: {
        flex: 1,
        width: '100%',
        position: 'absolute',
        justifyContent: 'flex-start',
        alignItems: 'flex-end'
    },
    dummy: {
        flex: 0.03,
    }
})

export default ToDoSelector;