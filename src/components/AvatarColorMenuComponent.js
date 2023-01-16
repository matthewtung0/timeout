import React, { useState, useCallback, useContext } from 'react';
import { View, StyleSheet, Text, Image, Dimensions, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import timeoutApi from '../api/timeout';
import { useFocusEffect } from '@react-navigation/native';
import { Context as userContext } from '../context/userContext';
//import { Context as UserContext } from '../context/userContext';
const default_img = require('../../assets/avatar/20_BACKGROUND/1_pink.png')
const lock = require('../../assets/lock.png')

const AvatarColorMenuComponent = ({ title, data, setIndexCallback, colorIndex, usesPng
}) => {
    const { width, height } = Dimensions.get('window')
    const COLOR_CIRCLE_DIAMETER = width / 10;
    const ITEM_R = 103;
    const ITEM_G = 128;
    const ITEM_B = 109;
    const FLATLIST_MARGIN = 20
    const ITEM_BORDER_WIDTH = 3;
    const ITEM_PADDING = 3;

    return (
        <View>
            <Text style={[styles.textDefault, {
                marginHorizontal: FLATLIST_MARGIN, marginTop: 10, marginBottom: 10,
                color: '#67806D',
            }]}>{title}</Text>
            <FlatList
                style={{ marginHorizontal: FLATLIST_MARGIN, }}
                //horizontal={true}
                //columnWrapperStyle={{ justifyContent: 'space-around', flex: 1, }}
                scrollEnabled={true}
                numColumns={6}
                data={data}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => {
                    // space for margins: (2/7)*width - 3*5*2 (for borders horizontal) - whatever extra padding * 2
                    return (<View style={{
                        marginVertical: 5,
                        marginHorizontal: (width * (4 / 10)
                            - (ITEM_BORDER_WIDTH * 6 * 2)
                            //- (ITEM_PADDING * 6 * 2)
                            - (FLATLIST_MARGIN * 2)
                        ) / 12,
                    }}>
                        <TouchableOpacity
                            style={!usesPng ?
                                [styles.menuItemDefault,
                                {
                                    width: COLOR_CIRCLE_DIAMETER, height: COLOR_CIRCLE_DIAMETER,
                                    borderRadius: COLOR_CIRCLE_DIAMETER / 2, margin: 2, backgroundColor: item.hex,
                                    borderWidth: ITEM_BORDER_WIDTH,
                                    borderColor: `rgba(
                                    ${ITEM_R},
                                    ${ITEM_G},
                                    ${ITEM_B},
                                    ${colorIndex == index ? 1.00 : 0.00})`
                                }] :
                                [{
                                    width: COLOR_CIRCLE_DIAMETER, height: COLOR_CIRCLE_DIAMETER,
                                    borderRadius: COLOR_CIRCLE_DIAMETER / 2, margin: 2, backgroundColor: item,
                                    borderWidth: ITEM_BORDER_WIDTH,
                                    borderColor: `rgba(
                ${ITEM_R},
                ${ITEM_G},
                ${ITEM_B},
                ${colorIndex == index ? 1.00 : 0.00})`
                                }]}
                            onPress={() => {
                                setIndexCallback(index)
                            }}>
                        </TouchableOpacity>
                    </View>
                    )
                }}
            />
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
    menuItemDefault: {
        borderRadius: 7
    },
})

export default AvatarColorMenuComponent;