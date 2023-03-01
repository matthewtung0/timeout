import { useFocusEffect } from '@react-navigation/native';
import React, { useState, useContext, useCallback } from 'react';
import { StyleSheet, Dimensions, Text, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker'
import { Dropdown } from 'react-native-element-dropdown';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Context as CategoryContext } from '../context/CategoryContext';
const constants = require('../components/constants.json')

const { height, width } = Dimensions.get('window');

const DropDownComponent2 = ({ catName, colorId, categoryId,
    setCatNameCallback, setColorIdCallback, setCategoryIdCallback, isInModal, allCategoriesOption }) => {
    const { state: categoryState } = useContext(CategoryContext)
    const [open, setOpen] = useState(false);

    const [items, setItems] = useState([])
    let selectedWidth = width * 0.8
    if (isInModal) selectedWidth = width * 0.8

    // refresh the data
    useFocusEffect(
        useCallback(() => {
            var category_array = []
            if (categoryState.userCategories) {
                category_array = categoryState.userCategories
                    .filter(item => item.archived !== true)
                    .map(item => {
                        return {
                            label: item.category_name,
                            value: item.category_id,
                            color: item.color_id,
                            /*containerStyle: {
                                backgroundColor: constants.colors[item.color_id]
                            }*/
                        }
                    })
            }
            category_array = category_array.sort(function (a, b) {
                return String(a.label).localeCompare(String(b.label))
            })

            var category_array_sorted = [
                ...category_array.filter(req => req.value == '3'),
                ...category_array.filter(req => req.value != '3'),
            ]
            /*category_array = category_array.reduce((acc, element) => {
                if (element.label == 'Unsorted') {
                    return [element, ...acc]
                }
                return [...acc, element]
            })*/
            if (allCategoriesOption) {
                category_array_sorted.unshift({
                    label: 'All categories',
                    value: 'All categories',
                    color: 'c10',
                })
            }
            setItems(category_array_sorted)
        }, [categoryState.userCategories])
    )

    const Item = (props) => {
        return (
            <TouchableOpacity
                style={{}}
                onPress={() => { props.onPress(props) }}>
                <View style={{ flexDirection: 'row', height: 45, alignItems: 'center', }}
                >
                    <View style={{
                        backgroundColor: constants.colors[props.item.color],
                        width: 20, height: 20, marginHorizontal: 10,
                    }} />
                    <Text style={[styles.textDefaultSemiBold, { color: '#67806D' }]}>{props.item.label}</Text>
                </View>
            </TouchableOpacity >

        )
    }

    const dropdownItem = (item) => {
        return (
            <View style={{ flexDirection: 'row', height: 45, alignItems: 'center', }}
            >
                <View style={{
                    backgroundColor: constants.colors[item.color],
                    width: 20, height: 20, marginHorizontal: 10,
                }} />
                <Text style={[styles.textDefault, { color: '#67806D' }]}>{item.label}</Text>
            </View>
        )
    }
    return (
        <Dropdown
            style={[
                {
                    width: selectedWidth,
                    margin: 0,
                    alignSelf: 'center', borderRadius: 15, paddingHorizontal: 17,
                    paddingVertical: 5,
                    backgroundColor: constants.colors[colorId],
                }]}
            data={items}
            value={categoryId}
            placeholderStyle={{ height: 0 }}
            inputSearchStyle={{ height: 0 }}
            dropdownPosition={'bottom'}
            autoScroll={false}
            labelField="label"
            valueField="value"
            search={false}
            onChange={item => {
                console.log("Changing to ", item)
                if (setCatNameCallback) { setCatNameCallback(item.label) }
                if (setColorIdCallback) { setColorIdCallback(item.color) }
                if (setCategoryIdCallback) { setCategoryIdCallback(item.value) }
            }}
            itemContainerStyle={{ borderBottomWidth: 0.3, }}
            containerStyle={{
                //borderWidth: 0,
                //width: selectedWidth,
            }}
            selectedTextStyle={
                [styles.textDefaultSemiBold, { color: 'white' }]
            }
            maxHeight={height * 0.25}
            renderItem={dropdownItem}
        />
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

export default DropDownComponent2;