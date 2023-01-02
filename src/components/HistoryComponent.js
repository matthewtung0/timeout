import React from 'react';
import { View, StyleSheet, Text, } from 'react-native';
import { parseISO, differenceInSeconds } from 'date-fns';
import { Icon } from 'react-native-elements';
const constants = require('../components/constants.json')
const PRODUCTIVITY_WIDTH = 100
const STAR_SIZE = 16;

const timeDifference = (timeStart, timeEnd) => {
    var timeDiff = differenceInSeconds(parseISO(timeEnd), parseISO(timeStart))

    if (timeDiff >= 7200) {
        return String(Math.round(timeDiff / 60 / 60)) + " hrs"
    }
    if (timeDiff > 120) {
        return String(Math.round(timeDiff / 60)) + " min"
    } else {
        return String(timeDiff) + " sec"
    }
}

const timeFormat = (dt) => {
    var date = new Date(dt).toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' });
    return date;
}

// round rating to nearest 25
const roundRating = (rating) => {
    var numToRoundTo = 1 / 25;

    return Math.round(rating * numToRoundTo) / numToRoundTo;
}

const HistoryComponent = ({ session_obj, is_active }) => {
    let bgColorHex = constants.colors[session_obj.color_id]
    return (
        <>
            <View style={{ flex: 1, flexDirection: 'row', marginTop: 10, }}>

                <View opacity={is_active ? 1 : 0.3} style={{ flex: 4, }}>
                    <Text numberOfLines={1}
                        style={[styles.textDefaultBold, { fontWeight: '700', color: '#013220', fontSize: 16, }]}>{session_obj.activity_name}</Text>
                </View>
                <View style={{ flex: 2, }}>
                    <View style={[styles.categoryStyle, { backgroundColor: bgColorHex, justifyContent: 'center', }]}>
                        <Text numberOfLines={1}
                            style={[styles.textDefault, { alignSelf: 'center', color: 'white', fontWeight: '700', fontSize: 11, }]}>{session_obj.category_name}</Text>
                    </View>
                </View>

            </View>

            <View style={{ flex: 1, flexDirection: 'row', marginTop: 5, marginBottom: 10, }}>
                <View opacity={is_active ? 1 : 0.3} style={{ flex: 5, alignItems: 'flex-start' }}>
                    <Text numberOfLines={1} style={[styles.textDefault,
                    { fontWeight: '300', color: '#013220', fontSize: 13, }]}>
                        {timeDifference(session_obj.time_start, session_obj.time_end)} @ {timeFormat(session_obj.time_start)}</Text>
                </View>
                <View style={{ flex: 3, }}></View>

                <View style={{ flex: 1, alignItems: 'flex-end', }}>
                    {/* 5 STARS */}
                    <View style={{ flex: 1, flexDirection: 'row' }}>

                        {roundRating(session_obj.prod_rating) >= 20 ?
                            <Icon
                                style={{ marginHorizontal: 0.2, }}
                                size={STAR_SIZE}
                                name="star"
                                type='ionicon'
                                color={bgColorHex} />
                            : <Icon
                                style={{ marginHorizontal: 0.2, }}
                                size={STAR_SIZE}
                                name="star-outline"
                                type='ionicon'
                                color={bgColorHex} />
                        }

                        {roundRating(session_obj.prod_rating) >= 40 ?
                            <Icon
                                style={{ marginHorizontal: 0.2, }}
                                size={STAR_SIZE}
                                name="star"
                                type='ionicon'
                                color={bgColorHex} />
                            : <Icon
                                style={{ marginHorizontal: 0.2, }}
                                size={STAR_SIZE}
                                name="star-outline"
                                type='ionicon'
                                color={bgColorHex} />
                        }

                        {roundRating(session_obj.prod_rating) >= 60 ?
                            <Icon
                                style={{ marginHorizontal: 0.2, }}
                                size={STAR_SIZE}
                                name="star"
                                type='ionicon'
                                color={bgColorHex} />
                            : <Icon
                                style={{ marginHorizontal: 0.2, }}
                                size={STAR_SIZE}
                                name="star-outline"
                                type='ionicon'
                                color={bgColorHex} />
                        }

                        {roundRating(session_obj.prod_rating) >= 80 ?
                            <Icon
                                style={{ marginHorizontal: 0.2, }}
                                size={STAR_SIZE}
                                name="star"
                                type='ionicon'
                                color={bgColorHex} />
                            : <Icon
                                style={{ marginHorizontal: 0.2, }}
                                size={STAR_SIZE}
                                name="star-outline"
                                type='ionicon'
                                color={bgColorHex} />
                        }

                        {roundRating(session_obj.prod_rating) >= 100 ?
                            <Icon
                                style={{ marginHorizontal: 0.2, }}
                                size={STAR_SIZE}
                                name="star"
                                type='ionicon'
                                color={bgColorHex} />
                            : <Icon
                                style={{ marginHorizontal: 0.2, }}
                                size={STAR_SIZE}
                                name="star-outline"
                                type='ionicon'
                                color={bgColorHex} />
                        }
                    </View>

                    {/* progress bar type option */}
                    {/*<View style={{ marginTop: 3, }}>
                        <View style={{
                            height: 15, width: PRODUCTIVITY_WIDTH, borderWidth: 1,
                            borderRadius: 3,
                        }}></View>
                        <View style={{
                            position: 'absolute', height: 15,
                            width: PRODUCTIVITY_WIDTH * session_obj.prod_rating / 100,
                            backgroundColor: bgColorHex, borderRadius: 3,
                        }}></View>
                    </View>*/}

                </View>

            </View>


            <View
                style={{
                    borderBottomColor: 'grey',
                    borderBottomWidth: StyleSheet.hairlineWidth,
                }}
            />

        </>



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
        fontSize: 18,
        fontWeight: '600',
    },
    categoryText: {
        color: 'white',
        fontSize: 14,
        textAlign: 'center',
        fontWeight: '800',
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
        borderRadius: 10,
        paddingHorizontal: 4,
    },

})

export default HistoryComponent;