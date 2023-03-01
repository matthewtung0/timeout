import React, { useContext } from 'react';
import {
    View, StyleSheet, Text, TouchableOpacity, Dimensions, Image, FlatList, Pressable
} from 'react-native';
import { Icon } from 'react-native-elements'
import { Context as CategoryContext } from '../context/CategoryContext';
const img = require('../../assets/tasks_topbar.png')
const constants = require('../components/constants.json')

const InformationalModal = ({ toggleFunction, setCatNameCallback,
    setColorIdCallback, setCategoryIdCallback }) => {
    const { height, width } = Dimensions.get('window');
    const { state: categoryState } = useContext(CategoryContext)
    const BORDER_RADIUS = 20;

    var sortedCategoriesTemp = categoryState.userCategories
        .filter(item => item.archived !== true)
        .sort(function (a, b) {
            return String(a.category_name).localeCompare(String(b.category_name))
        })
    var sortedCategories = [
        ...sortedCategoriesTemp.filter(req => req.category_id == '3'),
        ...sortedCategoriesTemp.filter(req => req.category_id != '3'),
    ]
    return (
        <View style={[styles.container, { width: width * 0.9, alignSelf: 'center' }]}>
            <View style={{
                flex: 1,
                backgroundColor: '#F9EAD3',
                borderRadius: BORDER_RADIUS
            }}>
                <View style={{ marginHorizontal: 20, marginTop: 90, }}>

                    <FlatList
                        style
                        horizontal={false}
                        //onEndReached={getMoreData}
                        onEndReachedThreshold={0.6}
                        data={sortedCategories}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(result) => result.category_id}
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
                            return (
                                <View>
                                    <Pressable
                                        style={({ pressed }) => [styles.toDoComponent, { opacity: pressed ? 0.5 : 1 }]}
                                        onPress={() => {
                                            if (setCatNameCallback) { setCatNameCallback(item.category_name) }
                                            if (setColorIdCallback) { setColorIdCallback(item.color_id) }
                                            if (setCategoryIdCallback) { setCategoryIdCallback(item.category_id) }
                                            toggleFunction()
                                        }}>


                                        <View style={{
                                            flex: 1, flexDirection: 'row', alignItems: 'center',
                                            borderWidth: 0,
                                        }}>

                                            <View style={[styles.categoryStyle, {
                                                backgroundColor: constants.colors[item.color_id],
                                                alignSelf: 'center', width: 30, height: 30, marginRight: 20,
                                            }]}>
                                            </View>
                                            <Text numberOfLines={1}
                                                style={[
                                                    styles.textDefaultMed,
                                                    { fontSize: 20, color: '#67806D', }]}>{item.category_name}</Text>

                                        </View>


                                    </Pressable>
                                </View>
                            )
                        }}
                    />
                </View>
            </View>

            <Image
                source={img}
                resizeMode='stretch'
                style={{
                    maxWidth: width * 0.9, maxHeight: 75, position: 'absolute', borderTopLeftRadius: BORDER_RADIUS,
                    borderTopRightRadius: BORDER_RADIUS,
                }} />

            <Text style={[styles.title, { position: 'absolute' }]}>Choose a Category</Text>
            <View style={styles.backContainer}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={toggleFunction}>

                    <Icon
                        name="close-outline"
                        type='ionicon'
                        size={35}
                        color='white' />
                </TouchableOpacity>
            </View>


        </View >
    )

}

const styles = StyleSheet.create({
    textDefaultBold: {
        fontFamily: 'Inter-Bold',
    },
    textDefault: {
        fontFamily: 'Inter-Regular',
    },
    textDefaultMed: {
        fontFamily: 'Inter-Medium',
    },
    textDefaultSemiBold: {
        fontFamily: 'Inter-SemiBold'
    },
    container: {
        flex: 1,
    },
    parentContainer: {
        flex: 1,
        justifyContent: 'space-around',
    },
    labelText: { marginLeft: 5, color: 'gray', },
    colorSquare: {
        marginHorizontal: 5,
        marginTop: 5,
        marginBottom: 5,
    },
    title: {
        alignSelf: 'center',
        margin: 20,
        marginBottom: 50,
        fontSize: 25,
        fontWeight: 'bold',
        color: 'white',
    },
    backButton: {
        width: 50,
        height: 50,
        justifyContent: 'center',
    },
    backContainer: {
        flex: 1,
        width: '50%',
        position: 'absolute',
        alignSelf: 'flex-end',
        justifyContent: 'flex-end',
        alignItems: 'flex-end'
    },
    toDoComponent: {
        justifyContent: 'center',
        flex: 1,
        paddingVertical: 12,
        marginRight: 15,
        alignContent: 'center',
    },
})

export default InformationalModal;