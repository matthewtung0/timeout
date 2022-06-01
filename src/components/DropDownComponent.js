import { useFocusEffect } from '@react-navigation/native';
import React, { useState, useContext, useCallback } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker'
import { Context as CategoryContext } from '../context/CategoryContext';
const constants = require('../components/constants.json')

const { height, width } = Dimensions.get('window');

const DropDownComponent = ({ catName, colorId, categoryId,
    setCatNameCallback, setColorIdCallback, setCategoryIdCallback, isInModal }) => {
    const { state: categoryState } = useContext(CategoryContext)
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState(
        categoryState.userCategories.map(item => {
            return {
                label: item.category_name,
                value: item.category_id,
                color: item.color_id,
                containerStyle: { backgroundColor: constants.colors[item.color_id] }
            }
        })
    )
    let selectedWidth = width * 0.9
    if (isInModal) selectedWidth = width * 0.8

    // refresh the data
    useFocusEffect(
        useCallback(() => {
            console.log("Setting items to these categories", categoryState.userCategories)
            setItems(
                categoryState.userCategories.map(item => {
                    return {
                        label: item.category_name,
                        value: item.category_id,
                        color: item.color_id,
                        containerStyle: { backgroundColor: constants.colors[item.color_id] }
                    }
                })
            )

        }, [categoryState.userCategories])
    )

    return (
        <DropDownPicker
            items={items}
            setItems={setItems}
            setOpen={setOpen}
            open={open}
            value={categoryId}
            setValue={setCategoryIdCallback}
            labelStyle={{ color: 'white' }}
            textStyle={{ fontSize: 18, color: 'white', fontWeight: '600', }}
            containerStyle={{
                borderWidth: 0,
                width: selectedWidth,
                alignSelf: 'center',
            }}
            dropDownContainerStyle={{
                borderWidth: 0,
            }}
            style={[styles.dropdown, {
                backgroundColor: constants.colors[colorId],
            }]}
            onSelectItem={(item) => {
                setCatNameCallback(item.label)
                setColorIdCallback(item.color)
            }} />
    )
}

const styles = StyleSheet.create({
    dropdown: {
        alignSelf: 'center',
        borderWidth: 0,
        borderRadius: 15,
        paddingHorizontal: 17,
        shadowOffset: {
            width: 0.1,
            height: 0.1,
        },
        shadowOpacity: 0.2,
    },
})

export default DropDownComponent;