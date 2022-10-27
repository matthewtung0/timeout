import React, { useRef, useState } from 'react';
import {
    View, StyleSheet, Text, Button, TouchableOpacity, FlatList, Dimensions, Image,
    Keyboard, TouchableWithoutFeedback
} from 'react-native';
import { Icon } from 'react-native-elements'
import ToDoComponent from './ToDoComponent';
import AddTodoComponent from './AddTodoComponent';

const img = require('../../assets/tasks_topbar.png')
const BANNER_IMG_HEIGHT = 75;

const ToDoSelector = ({ todoItems, toggleFunction, show_error, callback }) => {
    const [showChild, setShowChild] = useState(false)
    const { height, width } = Dimensions.get('window');
    const [childTitle, setChildTitle] = useState('Add Task')
    const [buttonText, setButtonText] = useState('Submit')
    const [editItem, setEditItem] = useState(null)
    const [sortBy, setSortBy] = useState(0); // 0 -> time created, 1-> alphabetical 2-> category

    const editTask = (item) => {
        setEditItem(item)
        setChildTitle('Edit Task')
        setButtonText('Save Changes')
        setShowChild(true)
    }
    //

    const sorted_todoItems = todoItems.sort(function (a, b) {
        if (sortBy == 0) {
            return String(a.time_created).localeCompare(String(b.time_created))
        } else if (sortBy == 1) {
            var comp_a = String(a.item_desc) + String(a.category_name)
            var comp_b = String(b.item_desc) + String(b.category_name)
            return comp_a.localeCompare(comp_b)
        } else if (sortBy == 2) {
            var comp_a = String(a.category_name) + String(a.item_desc)
            var comp_b = String(b.category_name) + String(b.item_desc)
            return comp_a.localeCompare(comp_b)
        }

        return a.time_created - b.time_created;
    })
    console.log(sorted_todoItems)
    const parentView = () => {
        return (

            <View style={styles.parentContainer}>
                <Text style={styles.title}></Text>

                <View style={{ marginVertical: 5, flexDirection: 'row', justifyContent: 'space-around' }}>
                    <Text>Sort by:</Text>
                    <View style={{ borderWidth: 1 }}>
                        <Text> time created</Text>
                    </View>

                    <View style={{ borderWidth: 1 }}>
                        <Text>A-Z</Text>
                    </View>

                    <View style={{ borderWidth: 1 }}>
                        <Text>Category</Text>
                    </View>

                </View>

                <FlatList
                    style
                    horizontal={false}
                    data={sorted_todoItems}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(result) => result.item_id}
                    ItemSeparatorComponent={() => {
                        return (<View
                            style={{
                                borderBottomColor: '#DCDBDB',
                                //borderBottomWidth: StyleSheet.hairlineWidth,
                                borderBottomWidth: 1.5,
                                marginHorizontal: 15,
                            }}
                        />)

                    }}
                    renderItem={({ item }) => {
                        return (
                            // SELECT THE OBJECT, TO GO BACK TO SESSION SELECT SCREEN

                            <View style={styles.toDoComponent}>
                                <ToDoComponent
                                    item={item}
                                    callback={callback}
                                    toggleFunction={toggleFunction}
                                    show_error={show_error}
                                    editTask={editTask}
                                />
                            </View>
                        )
                    }}
                    ListFooterComponent={() =>
                        <View>

                            {/* button to add a new todo item */}
                            <TouchableOpacity
                                style={[styles.plus, { width: width / 2.2, }]}
                                onPress={() => {

                                    if (show_error) {
                                        alert("Currently unable to add todo items. Please check your internet connection")
                                    } else {
                                        setChildTitle('Add Task')
                                        setButtonText('Submit')
                                        setShowChild(true)
                                    }




                                }}>
                                <View style={{
                                    flex: 1,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <Text style={styles.plusText}>Add New Task</Text>
                                </View>

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
                    buttonText={buttonText}
                    item={editItem}
                    callback={addTodoCallback} />

            </>
        )
    }

    return (
        <View style={[styles.container, { width: width * 0.9, alignSelf: 'center' }]}>


            {/*<View style={styles.dummy} />*/}
            <View style={styles.modal}>

                {show_error && 0 ?
                    <View style={{
                        flex: 1, marginTop: BANNER_IMG_HEIGHT,
                        justifyContent: 'center',
                    }}>
                        <Text style={{ textAlign: 'center', fontSize: 18, color: 'gray', }}>Cannot retrieve your tasks at this time. Please check your internet connection</Text>
                    </View>
                    :
                    showChild ? childView() : parentView()
                }
            </View>

            <Image
                source={img}
                resizeMode='stretch'
                style={{ maxWidth: width * 0.9, maxHeight: BANNER_IMG_HEIGHT, position: 'absolute' }} />

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
        borderRadius: 15,
        alignSelf: 'center',
        marginBottom: 20,
        marginTop: 20,
        shadowOffset: {
            width: 0.05,
            height: 0.05,
        },
        shadowOpacity: 0.3,
    },
    plusText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        paddingVertical: 10,
    },
})

export default ToDoSelector;