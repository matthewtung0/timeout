import React, { useState, useContext, useCallback, useMemo } from 'react';
import {
    View, StyleSheet, Text, TouchableOpacity, FlatList, Dimensions, Image, Platform
} from 'react-native';
import { Icon } from 'react-native-elements'
import { useFocusEffect } from '@react-navigation/native';
import ToDoComponent from './ToDoComponent';
import AddTodoComponent from './AddTodoComponent';
import { Context as CategoryContext } from '../context/CategoryContext';
import tinycolor from 'tinycolor2';
import { Shadow } from 'react-native-shadow-2';

const img = require('../../assets/tasks_topbar.png')
const BANNER_IMG_HEIGHT = 75;
const BORDER_RADIUS = 20;

const ToDoSelector = ({ toggleFunction, show_error, callback }) => {
    const [showChild, setShowChild] = useState(false)
    const { height, width } = Dimensions.get('window');
    const [childTitle, setChildTitle] = useState('Add Task')
    const [buttonText, setButtonText] = useState('Submit')
    const [editItem, setEditItem] = useState(null)
    const [visibleOffset, setVisibleOffset] = useState(10);
    const { state: categoryState } = useContext(CategoryContext)
    const [sortBy, setSortBy] = useState(0); // 0 -> old to new; 1-> new to old; 2-> alphabetical; 3-> category; 
    const [sortedTodoItems, setSortedTodoItems] = useState(categoryState.userTodoItems ?
        categoryState.userTodoItems.sort(function (a, b) {
            if (a.is_pinned && !b.is_pinned) { return -1 }
            if (b.is_pinned && !a.is_pinned) { return 1 }
            if (sortBy == 0) {
                return String(b.time_created).localeCompare(String(a.time_created))
            }
            else if (sortBy == 1) {
                return String(a.time_created).localeCompare(String(b.time_created))
            }
            else if (sortBy == 2) {
                var comp_a = String(a.item_desc) + String(a.category_name)
                var comp_b = String(b.item_desc) + String(b.category_name)
                return comp_a.localeCompare(comp_b)
            } else if (sortBy == 3) {
                var comp_a = String(a.category_name) + String(a.item_desc)
                var comp_b = String(b.category_name) + String(b.item_desc)
                return comp_a.localeCompare(comp_b)
            }

            return a.time_created - b.time_created;
        }) : [])


    useFocusEffect(
        useCallback(() => {
            setSortedTodoItems(toSort(categoryState.userTodoItems, sortBy))
            return () => {
            }
        }, [categoryState.userTodoItems])
    )

    const editTask = (item) => {
        setEditItem(item)
        setChildTitle('Edit Task')
        setButtonText('Save Changes')
        setShowChild(true)
    }
    const sortOptions = [
        { label: 'Old to new', id: 0 },
        { label: 'New to old', id: 1 },
        { label: 'A-Z', id: 2 },
        { label: 'Category', id: 3 },
    ]

    const toSort = (todoItems, sortBy) => {
        return todoItems ? todoItems.sort(function (a, b) {
            if (a.is_pinned && !b.is_pinned) { return -1 }
            if (b.is_pinned && !a.is_pinned) { return 1 }
            if (sortBy == 0) {
                return String(b.time_created).localeCompare(String(a.time_created))
            }
            else if (sortBy == 1) {
                return String(a.time_created).localeCompare(String(b.time_created))
            }
            else if (sortBy == 2) {
                var comp_a = String(a.item_desc) + String(a.category_name)
                var comp_b = String(b.item_desc) + String(b.category_name)
                return comp_a.localeCompare(comp_b)
            } else if (sortBy == 3) {
                var comp_a = String(a.category_name) + String(a.item_desc)
                var comp_b = String(b.category_name) + String(b.item_desc)
                return comp_a.localeCompare(comp_b)
            }

            return a.time_created - b.time_created;
        }) : []
    }

    const addNewTaskButton = () => {
        return (
            <TouchableOpacity
                style={[styles.plus, {
                    width: width / 2.2, shadowOffset: {
                        width: 0,
                        height: 6,
                    },
                    shadowOpacity: 1,
                    shadowRadius: 0,
                    shadowColor: tinycolor('#ABC57E').darken(25).toString()
                }]}
                onPress={() => {

                    setChildTitle('Add Task')
                    setButtonText('Submit')
                    setShowChild(true)
                }}>
                <View style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Text style={[styles.textDefaultSemiBold, styles.plusText]}>Add New Task</Text>
                </View>

            </TouchableOpacity>
        )
    }

    const flatListItself = () => {
        return (
            <FlatList
                style
                horizontal={false}
                onEndReached={getMoreData}
                onEndReachedThreshold={0.6}
                data={sortedTodoItems.slice(0, visibleOffset)}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(result) => result.item_id}
                ItemSeparatorComponent={() => {
                    return (<View
                        style={{
                            borderBottomColor: '#A7BEAD',
                            //borderBottomWidth: StyleSheet.hairlineWidth,
                            borderBottomWidth: 0.8,
                            marginHorizontal: 20,
                        }}
                    />)
                }}
                renderItem={({ item }) => {
                    var categoryColor = categoryState.userCategories.filter(req => req.category_id == item.category_id)
                    if (categoryColor.length > 0) {
                        var color = categoryColor[0].color_id
                    } else {
                        color = item.color_id
                    }
                    return (
                        // SELECT THE OBJECT, TO GO BACK TO SESSION SELECT SCREEN

                        <View style={styles.toDoComponent}>
                            <ToDoComponent
                                item={item}
                                color={color}
                                callback={callback}
                                toggleFunction={toggleFunction}
                                show_error={show_error}
                                editTask={editTask}
                            />
                        </View>
                    )
                }}
                ListFooterComponent={() =>
                    <View style={{}}>

                        {/* button to add a new todo item */}
                        {Platform.OS === 'ios' ?
                            addNewTaskButton()
                            :
                            <View style={{
                                alignSelf: 'center',
                                marginBottom: 20,
                                marginTop: 20,
                            }}>
                                <Shadow distance={1}
                                    offset={[2.5, 5]}
                                    style={[{
                                        width: width / 2.2 - 5,
                                    }]}
                                    paintInside={true}
                                    startColor={tinycolor('#ABC57E').darken(25).toString()}
                                    endColor={tinycolor('#ABC57E').darken(25).toString()}
                                    sides={{
                                        'bottom': true,
                                        'start': true,
                                        'end': true,
                                        'top': true
                                    }}
                                    corners={{
                                        'topStart': true,
                                        'topEnd': true,
                                        'bottomStart': true,
                                        'bottomEnd': true
                                    }}
                                >
                                    <TouchableOpacity
                                        style={[{
                                            backgroundColor: '#ABC57E', borderRadius: 15,
                                            width: width / 2.2, shadowOffset: {
                                                width: 0,
                                                height: 6,
                                            },
                                            shadowOpacity: 1,
                                            shadowRadius: 0,
                                            shadowColor: tinycolor('#ABC57E').darken(25).toString()
                                        }]}
                                        onPress={() => {

                                            setChildTitle('Add Task')
                                            setButtonText('Submit')
                                            setShowChild(true)
                                        }}>
                                        <View style={{
                                            flex: 1,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
                                            <Text style={[styles.textDefaultSemiBold, styles.plusText]}>Add New Task</Text>
                                        </View>

                                    </TouchableOpacity>
                                </Shadow>

                            </View>

                        }
                    </View>
                }
            />
        )
    }

    const getMoreData = () => {
        if (visibleOffset >= categoryState.userTodoItems.length) {
            return;
        }
        if (visibleOffset + 10 >= categoryState.userTodoItems.length) {
            setVisibleOffset(categoryState.userTodoItems.length)
        } else {
            setVisibleOffset(visibleOffset + 10)
        }
    }

    const memoizedFlatList = useMemo(flatListItself, [sortedTodoItems, visibleOffset, sortBy, categoryState.userCategories])

    const parentView = () => {
        return (
            <View style={[styles.parentContainer, { borderRadius: BORDER_RADIUS, }]}>

                <View style={[styles.title, { height: BANNER_IMG_HEIGHT }]} />

                <View style={{ paddingBottom: 10, flexDirection: 'row', paddingHorizontal: 12, backgroundColor: '#83B569' }}>
                    {sortBy == 0 ?
                        <TouchableOpacity
                            style={[styles.sortContainer,
                            { borderRightWidth: 0, borderTopLeftRadius: 15, borderBottomLeftRadius: 15, },
                            styles.sortContainerSelected]}
                            onPress={() => {
                                setSortBy(0)
                                setSortedTodoItems(toSort(categoryState.userTodoItems, 0))
                            }}>
                            <Text style={[styles.textDefault, styles.sortText]}>Newest</Text>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity
                            style={[styles.sortContainer,
                            { borderRightWidth: 0, borderTopLeftRadius: 15, borderBottomLeftRadius: 15, }]}
                            onPress={() => {
                                setSortBy(0)
                                setSortedTodoItems(toSort(categoryState.userTodoItems, 0))
                            }}>
                            <Text style={[styles.textDefault, styles.sortText]}>Newest</Text>
                        </TouchableOpacity>
                    }
                    {sortBy == 1 ?
                        <TouchableOpacity style={[styles.sortContainer, styles.sortContainerSelected,
                        { borderRightWidth: 0, }]}
                            onPress={() => {
                                setSortBy(1)
                                setSortedTodoItems(toSort(categoryState.userTodoItems, 1))
                            }}>
                            <Text style={[styles.textDefault, styles.sortText,]}>Oldest</Text>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity style={[styles.sortContainer,
                        { borderRightWidth: 0, }]}
                            onPress={() => {
                                setSortBy(1)
                                setSortedTodoItems(toSort(categoryState.userTodoItems, 1))
                            }}>
                            <Text style={[styles.textDefault, styles.sortText]}>Oldest</Text>
                        </TouchableOpacity>
                    }
                    {sortBy == 2 ?
                        <TouchableOpacity style={[styles.sortContainer, styles.sortContainerSelected,
                        { borderRightWidth: 0, }]}
                            onPress={() => {
                                setSortBy(2)
                                setSortedTodoItems(toSort(categoryState.userTodoItems, 2))
                            }}>
                            <Text style={[styles.textDefault, styles.sortText]}>A-Z</Text>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity style={[styles.sortContainer,
                        { borderRightWidth: 0, }]}
                            onPress={() => {
                                setSortBy(2)
                                setSortedTodoItems(toSort(categoryState.userTodoItems, 2))
                            }}>
                            <Text style={[styles.textDefault, styles.sortText]}>A-Z</Text>
                        </TouchableOpacity>
                    }
                    {sortBy == 3 ?
                        <TouchableOpacity style={[styles.sortContainer, styles.sortContainerSelected,
                        { borderTopRightRadius: 15, borderBottomRightRadius: 15, }]}
                            onPress={() => {
                                setSortBy(3)
                                setSortedTodoItems(toSort(categoryState.userTodoItems, 3))
                            }}>
                            <Text style={[styles.textDefault, styles.sortText]}>Category</Text>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity style={[styles.sortContainer,
                        { borderTopRightRadius: 15, borderBottomRightRadius: 15, }]}
                            onPress={() => {
                                setSortBy(3)
                                setSortedTodoItems(toSort(categoryState.userTodoItems, 3))
                            }}>
                            <Text style={[styles.textDefault, styles.sortText]}>Category</Text>
                        </TouchableOpacity>
                    }

                </View>

                {sortedTodoItems.length == 0 ?
                    <View style={{ alignItems: 'center' }}>
                        <Text style={[styles.textDefault, {
                            marginTop: 20, marginBottom: 10,
                            color: '#67806D', fontSize: 16, textAlign: 'center',
                        }]}>
                            You have no tasks yet! Save your recurring tasks here for quick access.</Text>
                    </View>

                    : null}
                {memoizedFlatList}


            </View >
        )
    }

    const childView = () => {

        // callback for after a new to-do item is added
        const addTodoCallback = () => {
            setShowChild(false)
        }
        // callback for after deleting an item, so list will update
        const deleteCallback = () => {
            setEditItem(null)
            //setSortedTodoItems(toSort(categoryState.userTodoItems, sortBy))
        }

        const editCallback = () => {
            setEditItem(null)
        }
        return (
            <>
                <AddTodoComponent
                    BORDER_RADIUS={BORDER_RADIUS}
                    title={childTitle}
                    buttonText={buttonText}
                    item={editItem}
                    callback={addTodoCallback}
                    deleteCallback={deleteCallback}
                    editCallback={editCallback} />
            </>
        )
    }

    return (
        <View style={[styles.container, { width: width * 0.9, alignSelf: 'center' }]}>

            <View style={[styles.modal, { borderRadius: BORDER_RADIUS }]}>

                {show_error && 0 ?
                    <View style={{
                        flex: 1, marginTop: BANNER_IMG_HEIGHT,
                        justifyContent: 'center',
                    }}>
                        <Text style={[styles.textDefault,
                        { textAlign: 'center', fontSize: 18, color: 'gray', }]}>Cannot retrieve your tasks at this time. Please check your internet connection</Text>
                    </View>
                    :
                    showChild ? childView() : parentView()
                }
            </View>

            <Image
                source={img}
                resizeMode='stretch'
                style={{
                    maxWidth: width * 0.9, maxHeight: BANNER_IMG_HEIGHT, position: 'absolute',
                    borderTopLeftRadius: BORDER_RADIUS, borderTopRightRadius: BORDER_RADIUS,
                }} />

            <Text style={[styles.title, styles.textDefaultBold,
            { position: 'absolute', marginTop: BANNER_IMG_HEIGHT * 0.3, marginBottom: BANNER_IMG_HEIGHT * 0.7 }]}>
                {showChild ? childTitle : "Tasks"}</Text>
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
}

const styles = StyleSheet.create({
    textDefaultBold: {
        fontFamily: 'Inter-Bold',
    },
    textDefaultSemiBold: {
        fontFamily: 'Inter-SemiBold',
    },
    textDefault: {
        fontFamily: 'Inter-Regular',
    },
    textDefaultMed: {
        fontFamily: 'Inter-Medium',
    },
    sortText: {
        textAlign: 'center', fontSize: 12, justifyContent: 'center', color: 'white',
    },
    sortContainer: {
        borderWidth: 1, flex: 1,
        paddingVertical: 7, borderColor: 'white',
    },
    sortContainerSelected: {
        backgroundColor: '#8DC867',
    },
    container: {
        flex: 1,
    },
    parentContainer: {
        flex: 1,
        justifyContent: 'space-around',
        //backgroundColor: '#F9EAD3',
    },
    modal: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    title: {
        alignSelf: 'center',
        //marginTop: 20,
        //marginBottom: 50,
        fontSize: 25,
        color: 'white',
    },
    toDoComponent: {
        marginRight: 15,
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
    },
    plusText: {
        color: 'white',
        fontSize: 20,
        paddingVertical: 10,
    },
    sortButton: {
        borderWidth: 1, borderRadius: 5, padding: 5, borderColor: 'grey'
    }
})

export default ToDoSelector;