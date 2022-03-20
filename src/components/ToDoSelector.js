import React, { useRef, useState } from 'react';
import { View, StyleSheet, Text, Button, TouchableOpacity, FlatList } from 'react-native';

const ToDoSelector = ({ todoItems, toggleFunction, callback }) => {
    return (
        <View style={styles.modal}>
            <Text style={styles.title}>Pick an existing to-do item to work on</Text>

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
                            <View style={styles.listItem}>
                                <Text>Item name: {item.item_desc}</Text>
                                <Text>Category: {item.category_name}</Text>
                                <Text>Time created: {item.time_created}</Text>
                            </View>
                        </TouchableOpacity>



                    )
                }}

                ListFooterComponent={() =>
                    <Button title="Go back"
                        onPress={toggleFunction} />
                }
            >
            </FlatList>

        </View>
    )
}

const styles = StyleSheet.create({
    modal: {
        flex: 1,
        backgroundColor: '#ABC57E',
        margin: 20,
    },
    title: {
        fontSize: 20,
        marginBottom: 10,
    },
    listItem: {
        margin: 5,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
        padding: 5,
    }
})

export default ToDoSelector;