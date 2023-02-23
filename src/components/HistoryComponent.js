import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { parseISO, differenceInSeconds, format } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import { Icon } from 'react-native-elements'

import Icon_rating_null from '../../assets/icon_rating-null.svg'
import Icon_rating from '../../assets/icon_rating.svg'

const constants = require('../components/constants.json')
const PRODUCTIVITY_WIDTH = 100
const STAR_SIZE = 16;
const ICON_LENGTH = 16;

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
    //var date = new Date(dt).toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' });
    var date = format(parseISO(dt), "h:mm aaaa", { locale: enUS })
    return date;
}

// round rating to nearest 25
const roundRating = (rating) => {
    var numToRoundTo = 1 / 25;

    return Math.round(rating * numToRoundTo) / numToRoundTo;
}

const HistoryComponent = ({ session_obj, is_active }) => {
    //console.log(`Rendering component with name ${session_obj.activity_name}`)
    let bgColorHex = constants.colors[session_obj.color_id]
    return (
        <>
            <View style={{ flex: 1, flexDirection: 'row', marginTop: 10, }}>
                {session_obj.is_private ?

                    <View style={{ flex: 0.5, }}>
                        <Icon
                            name="lock-closed-outline"
                            type='ionicon'
                            size={15}
                            color='green' />
                    </View> : null}


                <View opacity={is_active ? 1 : 0.3} style={{ flex: 5, }}>
                    <Text numberOfLines={1}
                        style={[styles.textDefaultMed, { color: '#013220', fontSize: 15, }]}>{session_obj.activity_name}</Text>
                </View>
                <View style={{ flex: 2.5, }}>
                    <View style={[styles.categoryStyle, { backgroundColor: bgColorHex, justifyContent: 'center', }]}>
                        <Text numberOfLines={1}
                            style={[styles.textDefault, { alignSelf: 'center', color: 'white', fontSize: 11, }]}>{session_obj.category_name}</Text>
                    </View>
                </View>

            </View>

            <View style={{ flex: 1, flexDirection: 'row', marginTop: 5, marginBottom: 15, }}>
                <View opacity={is_active ? 1 : 0.3} style={{ flex: 5, alignItems: 'flex-start' }}>
                    <Text numberOfLines={1} style={[styles.textDefaultMed,
                    { color: '#90AB72', fontSize: 14, }]}>
                        {timeFormat(session_obj.time_start)} - {timeDifference(session_obj.time_start, session_obj.time_end)}</Text>
                </View>
                <View style={{ flex: 3, }}></View>

                <View style={{ flex: 1, alignItems: 'flex-end', }}>
                    {/* 5 STARS */}
                    {session_obj.prod_rating < 0 ? null :
                        <View style={{ flex: 1, flexDirection: 'row' }}>

                            {session_obj.prod_rating >= 20 ?

                                <Icon_rating style={styles.svgDefault} fill={bgColorHex}
                                    width={STAR_SIZE} height={STAR_SIZE} />

                                : <Icon_rating_null style={styles.svgDefault} fill={bgColorHex}
                                    width={STAR_SIZE} height={STAR_SIZE} />
                            }

                            {session_obj.prod_rating >= 40 ?
                                <Icon_rating style={styles.svgDefault} fill={bgColorHex}
                                    width={STAR_SIZE} height={STAR_SIZE} />

                                : <Icon_rating_null style={styles.svgDefault} fill={bgColorHex}
                                    width={STAR_SIZE} height={STAR_SIZE} />
                            }

                            {session_obj.prod_rating >= 60 ?
                                <Icon_rating style={styles.svgDefault} fill={bgColorHex}
                                    width={STAR_SIZE} height={STAR_SIZE} />

                                : <Icon_rating_null style={styles.svgDefault} fill={bgColorHex}
                                    width={STAR_SIZE} height={STAR_SIZE} />
                            }

                            {session_obj.prod_rating >= 80 ?
                                <Icon_rating style={styles.svgDefault} fill={bgColorHex}
                                    width={STAR_SIZE} height={STAR_SIZE} />

                                : <Icon_rating_null style={styles.svgDefault} fill={bgColorHex}
                                    width={STAR_SIZE} height={STAR_SIZE} />
                            }

                            {session_obj.prod_rating >= 100 ?
                                <Icon_rating style={styles.svgDefault} fill={bgColorHex}
                                    width={STAR_SIZE} height={STAR_SIZE} />

                                : <Icon_rating_null style={styles.svgDefault} fill={bgColorHex}
                                    width={STAR_SIZE} height={STAR_SIZE} />
                            }
                        </View>
                    }
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

const equal = (prevItem, nextItem) => {
    if (prevItem.session_obj.activity_id != nextItem.session_obj.activity_id) {
        return false;
    }
    return true;
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
    textDefaultMed: {
        fontFamily: 'Inter-Medium',
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

export default React.memo(HistoryComponent, equal)