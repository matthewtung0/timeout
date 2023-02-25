import React, { useContext } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Pressable, Alert } from 'react-native';
import { Icon } from 'react-native-elements';
import { Context as CategoryContext } from '../context/CategoryContext';
const constants = require('../components/constants.json')

const ToDoComponent = ({ item, callback, toggleFunction, show_error, editTask }) => {
    let bgColorHex = constants.colors[item.color_id]
    const { editTodoItemPin } = useContext(CategoryContext)

    const editPin = (to_pin) => {
        if (to_pin) {
            editTodoItemPin(item.item_id, to_pin, editPinCallback, editPinCallbackError)
        } else {
            editTodoItemPin(item.item_id, to_pin, editUnpinCallback, editPinCallbackError)
        }
    }

    const editPinCallback = () => {
        alert("Item pinned")
    }

    const editUnpinCallback = () => {
        alert("Item unpinned")
    }

    const editPinCallbackError = () => {
        alert("Something went wrong. Please try again later")
    }

    return (
        <View style={[styles.container, {}]}>

            <Pressable
                style={({ pressed }) => [styles.toDoComponent, { opacity: pressed ? 0.5 : 1 }]}
                onLongPress={() => {
                    editPin(!item.is_pinned)
                }}
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

                <View style={{
                    flex: 1, flexDirection: 'row', alignItems: 'center',
                    justifyContent: 'center', borderWidth: 0,
                }}>
                    {item.is_pinned ?
                        <View style={{ flex: 0.3, }}>
                            <Icon
                                name="pin"
                                type='ionicon'
                                color='gray' />
                        </View>
                        : <View style={{ flex: 0.3 }}></View>}
                    <View style={[styles.categoryStyle, { flex: 1, backgroundColor: bgColorHex, alignSelf: 'center', }]}>
                        <Text numberOfLines={1}
                            style={[styles.categoryText, styles.textDefaultSemiBold,]}>{item.category_name}</Text>
                    </View>

                    <View style={{ flex: 2.5, justifyContent: 'center' }}>
                        <Text numberOfLines={2} style={[styles.text, styles.textDefaultMed,]}>{item.item_desc}</Text>
                    </View>
                </View>
            </Pressable>

            <View style={styles.editContainer}>
                <TouchableOpacity
                    onPress={() => {
                        editTask(item)
                    }}>
                    <Icon
                        name="ellipsis-horizontal"
                        type='ionicon'
                        color='#A7BEAD' />
                </TouchableOpacity>

            </View>


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
    text: {
        color: '#67806D',
        fontSize: 15,
    },
    categoryText: {
        color: 'white',
        fontSize: 10,
        textAlign: 'center',
    },
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    dummy: {
        flex: 0.35,
    },
    toDoComponent: {
        justifyContent: 'center',
        flex: 1,
        paddingVertical: 12,
        marginRight: 15,
        alignContent: 'center',
    },
    categoryStyle: {
        alignSelf: 'flex-end',
        borderRadius: 10,
        padding: 5,
        marginRight: 10,
    },
    touchStyle: {
        backgroundColor: 'yellow',
    },
    editContainer: {
        justifyContent: 'center',
    }

})

export default ToDoComponent;