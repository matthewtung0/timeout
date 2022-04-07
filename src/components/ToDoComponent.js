import React, { useRef, useState, Component } from 'react';
import { View, StyleSheet, Text, Dimensions, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
const constants = require('../components/constants.json')

const { height, width } = Dimensions.get('window');

const ToDoComponent = ({ item, callback, toggleFunction, editTask }) => {
    let bgColorHex = constants.colors[item.color_id]
    return (
        <View style={styles.outerContainer}>
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
                        })
                        toggleFunction()
                    }}>
                    <Text style={styles.text}>{item.item_desc}</Text>
                </TouchableOpacity>


                <View style={styles.editContainer}>
                    <TouchableOpacity
                        onPress={() => { editTask(item) }}>
                        <Icon
                            name="create-outline"
                            type='ionicon'
                            color='#BC9869' />
                    </TouchableOpacity>

                </View>




                <View style={styles.categoryContainer}>
                    <View style={[styles.categoryStyle, { backgroundColor: bgColorHex }]}>
                        <Text style={[styles.categoryText]}>{item.category_name}</Text>
                    </View>
                </View>
            </View>
        </View>

    )
}

const styles = StyleSheet.create({
    text: {
        color: '#67806D',
        fontSize: 18,
    },
    categoryText: {
        color: '#67806D',
        fontSize: 14,
    },
    outerContainer: {
        width: '100%',
        height: 80,
        marginVertical: 5,
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
        backgroundColor: '#F6F2DF',
        padding: 15,
        borderRadius: 10,
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.3,

    },
    categoryContainer: {
        flex: 1,
        width: '100%',
        position: 'absolute',
        //borderWidth: 1,
        //borderColor: 'black',
    },
    categoryStyle: {
        flex: 1,
        alignSelf: 'flex-end',
        borderRadius: 5,
        padding: 7,
        marginRight: 12,
    },
    touchStyle: {
        backgroundColor: 'yellow',
    },
    editContainer: {
        justifyContent: 'flex-end',
    }

})

export default ToDoComponent;