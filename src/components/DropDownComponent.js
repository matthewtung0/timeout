import { useFocusEffect } from '@react-navigation/native';
import React, { useState, useContext, useCallback } from 'react';
import { StyleSheet, Dimensions, Text, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker'
import { BorderlessButton, TouchableOpacity } from 'react-native-gesture-handler';
import { Context as CategoryContext } from '../context/CategoryContext';
const constants = require('../components/constants.json')

const { height, width } = Dimensions.get('window');

const DropDownComponent = ({ catName, colorId, categoryId,
    setCatNameCallback, setColorIdCallback, setCategoryIdCallback, isInModal }) => {
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
                category_array = categoryState.userCategories.filter(item => item.archived !== true).map(item => {
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
            setItems(category_array)
        }, [categoryState.userCategories])
    )

    const Item = (props) => {
        return (
            <TouchableOpacity
                style={{}}
                onPress={() => { props.onPress(props) }}>
                <View style={{ flexDirection: 'row', height: 35, alignItems: 'center', }}
                >
                    <View style={{
                        backgroundColor: constants.colors[props.item.color],
                        width: 20, height: 20, marginHorizontal: 10,
                    }} />
                    <Text style={[styles.textDefault, { color: '#67806D' }]}>{props.item.label}</Text>
                </View>
            </TouchableOpacity >

        )
    }

    return (
        <DropDownPicker
            items={items}
            setItems={setItems}
            setOpen={setOpen}
            open={open}
            value={categoryId}
            listMode="SCROLLVIEW"
            zIndex={1000}
            zIndexInverse={7000}
            setValue={setCategoryIdCallback}
            itemSeparator={true}
            itemSeparatorStyle={{
                backgroundColor: "#DCDBDB",
            }}
            labelStyle={[styles.textDefaultBold, { color: 'white' }]}
            textStyle={[styles.textDefault, { fontSize: 16, color: 'gray', }]}
            containerStyle={{
                //borderWidth: 0,
                width: selectedWidth,
                alignSelf: 'center',
            }}
            dropDownContainerStyle={{
                //borderWidth: 0,
            }}
            style={[styles.dropdown, {
                backgroundColor: constants.colors[colorId],
            }]}

            renderListItem={(props) => <Item {...props} />}
            onSelectItem={(item) => {
                console.log("Item selected ..?")
                setCatNameCallback(item.item.label)
                setColorIdCallback(item.item.color)
            }} />
    )
}

const styles = StyleSheet.create({
    textDefaultBold: {
        fontFamily: 'Inter-Bold',
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

export default DropDownComponent;