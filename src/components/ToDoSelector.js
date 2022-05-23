import React, { useRef, useState } from 'react';
import {
    View, StyleSheet, Text, Button, TouchableOpacity, FlatList, Dimensions, Image,
    Keyboard, TouchableWithoutFeedback
} from 'react-native';
import { Icon } from 'react-native-elements'
import ToDoComponent from './ToDoComponent';
import AddTodoComponent from './AddTodoComponent';

const img = require('../../assets/tasks_topbar.png')

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
                <Text style={styles.title}></Text>
                <FlatList
                    style
                    horizontal={false}
                    data={todoItems}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(result) => result.item_id}
                    ItemSeparatorComponent={() => {
                        return (<View
                            style={{
                                borderBottomColor: 'white',
                                //borderBottomWidth: StyleSheet.hairlineWidth,
                                borderBottomWidth: 0.8,
                                marginHorizontal: 15,
                            }}
                        />)

                    }}
                    renderItem={({ item }) => {
                        return (
                            // SELECT THE OBJECT, TO GO BACK TO SESSION SELECT SCREEN
                            <TouchableOpacity
                                onPress={() => {
                                    callback({
                                        "item_desc": item.item_desc,
                                        "cat_id": item.category_id,
                                        "item_id": item.item_id,
                                        "cat_name": item.category_name,
                                        "color_id": item.color_id,
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

                            {/* button to add a new todo item */}
                            <TouchableOpacity
                                style={[styles.plus, { width: width / 2.2, height: height / 12 }]}
                                onPress={() => {
                                    setChildTitle('Add Task')
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

            </>
        )
    }

    return (
        <View style={[styles.container, { width: width * 0.9, alignSelf: 'center' }]}>


            {/*<View style={styles.dummy} />*/}
            <View style={styles.modal}>


                {showChild ? childView() : parentView()}
            </View>

            <Image
                source={img}
                resizeMode='stretch'
                style={{ maxWidth: width * 0.9, maxHeight: 75, position: 'absolute' }} />

            <Text style={[styles.title, { position: 'absolute', }]}>{showChild ? childTitle : "Tasks"}</Text>
            <View style={styles.backContainer}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={toggleFunction}>

                    <Icon
                        name="close-outline"
                        type='ionicon'
                        size={35}
                        color='white' />
                    {/*<Text style={styles.backButtonText}>X</Text>*/}
                </TouchableOpacity>
            </View>

            {/* go back button */}
            {showChild ?
                <View style={{
                    flex: 1, position: 'absolute', width: '50%',
                    alignItems: 'flex-start', justifyContent: 'flex-start',
                }}>

                    <TouchableOpacity
                        style={styles.goBackChild}
                        onPress={() => {
                            setShowChild(false)
                            setEditItem(null)
                        }}>
                        <Icon
                            name="arrow-back-outline"
                            type='ionicon'
                            size={35}
                            color='white' />
                        {/*<Text style={styles.goBackText}>Go back</Text>*/}

                    </TouchableOpacity>
                </View> : null}


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
        backgroundColor: '#FFFFFF',
    },
    title: {
        alignSelf: 'center',
        margin: 20,
        marginBottom: 50,
        fontSize: 25,
        fontWeight: 'bold',
        color: 'white',
    },
    toDoComponent: {
        marginHorizontal: 15,
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
    goBackText: {
        color: 'white',
        paddingBottom: 3,
        fontSize: 20,
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