import React, { useRef, useState } from 'react';
import { View, StyleSheet, Text, Button, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import ToDoComponent from './ToDoComponent';
import AddTodoComponent from './AddTodoComponent';

const ToDoSelector = ({ todoItems, toggleFunction, callback }) => {
    const [showChild, setShowChild] = useState(false)
    const { height, width } = Dimensions.get('window');
    const [childTitle, setChildTitle] = useState('Add Task')
    const [editItem, setEditItem] = useState(null)

    const editTask = (item) => {
        setEditItem(item)
        setChildTitle('Edit Task')
        setShowChild(true)

    }

    const parentView = () => {
        return (
            <View style={styles.parentContainer}>
                <Text style={styles.title}>Tasks</Text>
                <FlatList
                    style
                    horizontal={false}
                    data={todoItems}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(result) => result.item_id}
                    renderItem={({ item }) => {
                        return (
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
                                        item={item}
                                        callback={callback}
                                        toggleFunction={toggleFunction}
                                        editTask={editTask}
                                    />
                                </View>
                            </TouchableOpacity>
                        )
                    }}
                    ListFooterComponent={() =>
                        <View>

                            <TouchableOpacity
                                style={[styles.plus, { width: width / 2.2, height: height / 12 }]}
                                onPress={() => {
                                    setShowChild(true)

                                }}>
                                <Text style={styles.plusText}>+</Text>
                            </TouchableOpacity>
                        </View>
                    }
                />
            </View>
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
                    title={childTitle}
                    item={editItem}
                    callback={addTodoCallback} />
                <View style={{ backgroundColor: '#90AB72' }}>
                    <TouchableOpacity
                        style={styles.goBackChild}
                        onPress={() => {
                            setShowChild(false)
                            setEditItem(null)
                        }}>
                        <Text style={styles.goBackText}>Go back</Text>

                    </TouchableOpacity>
                </View>

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
        flex: 1,
    },
    parentContainer: {
        flex: 1,
        justifyContent: 'space-around',
        backgroundColor: '#F9EAD3'
    },
    modal: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'black',
        backgroundColor: '#FFFFFF',
    },
    title: {
        alignSelf: 'center',
        margin: 15,
        fontSize: 20,
        fontWeight: 'bold',
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
    },
    goBackChild: {
        backgroundColor: '#90AB72',
        alignItems: 'center',
        width: 60,
        borderRadius: 5,
        justifyContent: 'center',
        alignContent: 'center',
        alignSelf: 'center'
    },
    goBackText: {
        color: 'white',
        paddingBottom: 3,
    },
    plus: {
        backgroundColor: '#ABC57E',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        alignSelf: 'center',
        marginBottom: 20,
        marginTop: 20,
    },
    plusText: {
        color: 'white',
        fontSize: 50,
        fontWeight: 'bold'
    },
})

export default ToDoSelector;