import React, { useRef, useState, Component } from 'react';
import { View, StyleSheet, Text, Dimensions, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
const constants = require('../components/constants.json')

const ToDoComponent = ({ item, callback, toggleFunction, show_error, editTask }) => {
    let bgColorHex = constants.colors[item.color_id]
    return (
        <View style={styles.container}>
            {/*<View style={styles.dummy} />*/}

            <TouchableOpacity
                style={styles.toDoComponent}
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

                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View style={[styles.categoryStyle, { backgroundColor: bgColorHex }]}>
                        <Text style={[styles.categoryText, styles.textDefaultBold]}>{item.category_name}</Text>
                    </View>
                    <View style={{ flex: 2.5, justifyContent: 'center' }}>
                        <Text style={[styles.text, styles.textDefaultBold,]}>{item.item_desc}</Text>
                    </View>
                </View>
            </TouchableOpacity>

            <View style={styles.editContainer}>
                <TouchableOpacity
                    onPress={() => {
                        if (show_error) {
                            alert("Currently unable to edit todo items. Please check your internet connection")
                        } else {
                            editTask(item)
                        }

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
    textDefault: {
        fontFamily: 'Inter-Regular',
    },
    text: {
        color: '#67806D',
        fontSize: 15,
    },
    categoryText: {
        color: 'white',
        fontSize: 11,
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

        flex: 1,
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