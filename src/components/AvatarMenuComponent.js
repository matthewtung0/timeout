import React, { } from 'react';
import { View, StyleSheet, Text, Image, Dimensions, FlatList, TouchableOpacity } from 'react-native';
//import { Context as UserContext } from '../context/userContext';
const lock = require('../../assets/lock.png')

const AvatarMenuComponent = ({ title, data, hasItem, setIndexCallback, itemIndex, updateUnownedCallback,
    unownedIndex, setUnownedCallback, noItemOption, pngOption, setHasItemCallback, thumbnailSize }) => {
    const { width } = Dimensions.get('window')
    const ITEM_R = 103;
    const ITEM_G = 128;
    const ITEM_B = 109;
    const FLATLIST_MARGIN = 20
    const ITEM_BORDER_WIDTH = 4;
    const ITEM_PADDING = 3;

    return (
        <View style={{ flex: 1, }}>
            <Text style={[styles.textDefault, {
                marginHorizontal: FLATLIST_MARGIN, marginTop: 10, marginBottom: 10,
                color: '#67806D',
            }]}>{title}</Text>
            <FlatList
                style={{ marginHorizontal: FLATLIST_MARGIN, }}
                //horizontal={true}
                //columnWrapperStyle={{ justifyContent: 'space-around', flex: 1, }}
                scrollEnabled={true}
                numColumns={5}
                data={data}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => {
                    // space for margins: (2/7)*width - 3*5*2 (for borders horizontal) - whatever extra padding * 2
                    return (<View style={{
                        borderWidth: 0.3, borderRadius: 10, borderColor: '#67806D', marginVertical: 5,
                        marginHorizontal: (width * (3 / 8)
                            - (ITEM_BORDER_WIDTH * 5 * 2)
                            - (ITEM_PADDING * 5 * 2)
                            - (FLATLIST_MARGIN * 2)
                        ) / 11,
                    }}>
                        <TouchableOpacity
                            style={[styles.menuItemDefault,
                            {
                                borderWidth: ITEM_BORDER_WIDTH,
                                padding: ITEM_PADDING,
                                borderColor: `rgba(
                                                            ${ITEM_R},
                                                            ${ITEM_G},
                                                            ${ITEM_B},
                                                            ${noItemOption ?
                                        (itemIndex == index - 1 && index > 0 && hasItem)
                                            || !hasItem && index == 0 ? 1.00 : 0.00
                                        :
                                        itemIndex == index ? 1.00 : 0.00})`
                            }]}
                            onPress={() => {
                                if (noItemOption) {
                                    setHasItemCallback(index > 0)
                                    if (index > 0) {
                                        setIndexCallback(index - 1)
                                    }
                                } else {
                                    setIndexCallback(index)
                                }
                                if (typeof (item.owned) != 'undefined') {
                                    var item_owned = item.owned;
                                } else {
                                    var item_owned = true;
                                }
                                if (typeof (item.cost) != 'undefined') {
                                    var item_cost = item.cost;
                                } else {
                                    var item_cost = 0;
                                }

                                updateUnownedCallback(setUnownedCallback, unownedIndex,
                                    item.id, item_owned, item_cost)
                            }}>
                            <View>
                                {pngOption && !noItemOption ?
                                    <>
                                        <Image
                                            style={{ width: thumbnailSize, height: thumbnailSize }}
                                            source={item[0]} />
                                    </>
                                    : null}

                                {pngOption && noItemOption ?
                                    <>
                                        {index == 0 ? item.svg :
                                            <Image
                                                style={{ width: thumbnailSize, height: thumbnailSize }}
                                                source={item[0]} />}
                                    </>
                                    :
                                    <>
                                        {item.svg}
                                    </>
                                }


                                {!item.owned ?
                                    <View style={{
                                        position: 'absolute', width: '100%', height: '100%',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                        <Image
                                            style={{ width: 40, height: 40, }}
                                            resizeMode="contain"
                                            source={lock} />
                                    </View>

                                    : null}
                            </View>
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

export default AvatarMenuComponent;