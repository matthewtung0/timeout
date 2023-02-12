import React from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { parseISO, differenceInSeconds } from 'date-fns';
const constants = require('../components/constants.json')


const MonthlySumComponent = ({ monthBatch }) => {
    const { height, width } = Dimensions.get('window');
    const BAR_MAX_WIDTH = width * 0.6
    let map = {}
    let colorMap = {}
    let act = 0
    let timeDiffSec = 0
    let maxTime = -1
    for (var i = 0; i < monthBatch.length; i++) {
        act = monthBatch[i]
        if (act.entry_type == 0) {
            timeDiffSec = differenceInSeconds(parseISO(act.time_end), parseISO(act.time_start))
            if (act.category_name in map) {
                map[act.category_name] = map[act.category_name] + timeDiffSec
                if (map[act.category_name] > maxTime) { maxTime = map[act.category_name] }

            } else {
                colorMap[act.category_name] = act.color_id
                map[act.category_name] = timeDiffSec
                if (timeDiffSec > maxTime) { maxTime = timeDiffSec }
            }
        }

    }

    //console.log(Object.entries(map))
    let sortedRes = Object.entries(map).sort((a, b) => { return b[1] - a[1] })

    const getColor = (category_name) => {
        var color_id = Object.entries(colorMap).find(k => k[0] == category_name)[1]
        return constants.colors[color_id]
    }

    const formatTime = (sec) => {
        if (sec >= 7200) {
            return String(Math.round(sec / 60 / 60)) + "h"
        }
        if (sec > 120) {
            return String(Math.round(sec / 60)) + "m"
        } else {
            return String(sec) + "s"
        }
    }

    const getBarPct = (num) => {
        return num / maxTime
    }
    return (

        <View>
            <>
                {sortedRes
                    .map((item) => {
                        return (
                            <View
                                style={styles.container}
                                key={item[0]}>
                                <View style={styles.textContainer}>
                                    <Text numberOfLines={2}
                                        style={[styles.barLabel, styles.textDefaultSemiBold]}>{item[0]}</Text>
                                </View>

                                {BAR_MAX_WIDTH * getBarPct(item[1]) > 40 ?
                                    <View style={styles.barContainer}>
                                        <View style={[styles.bar, { backgroundColor: getColor(item[0]), width: BAR_MAX_WIDTH * getBarPct(item[1]) }]} />
                                        <Text style={[styles.timeLabel, styles.textDefault]}>{formatTime(item[1])}</Text>
                                    </View> :
                                    <View style={styles.barContainerRelative}>
                                        <View style={[styles.bar, { backgroundColor: getColor(item[0]), width: BAR_MAX_WIDTH * getBarPct(item[1]) }]} />
                                        <Text style={[styles.timeLabelRelative, styles.textDefault]}>{formatTime(item[1])}</Text>
                                    </View>}
                            </View>

                        )
                    })}
            </>
        </View>
    )
}

const styles = StyleSheet.create({
    textDefaultBold: {
        fontFamily: 'Inter-Bold',
    }, textDefaultSemiBold: {
        fontFamily: 'Inter-SemiBold',
    },
    textDefault: {
        fontFamily: 'Inter-Regular',
    },
    title: {
        margin: 30,
        fontSize: 25,
    }, bar: {
        height: 23,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
    }, container: {
        flex: 1,
        flexDirection: 'row',
        height: 28,
    }, textContainer: {
        width: 75,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
    }, barLabel: {
        flex: 1,
        flexWrap: 'wrap',
        textAlign: 'right',
        color: '#67806D',
        fontSize: 11,
        fontWeight: '600',
    }, timeLabel: {
        position: 'absolute',
        alignSelf: 'flex-end',
        paddingRight: 5,
        color: '#67806D',
        fontSize: 13,
        fontWeight: '600',
    }, barContainer: {
        justifyContent: 'center',
    }, barContainerRelative: {
        flexDirection: 'row',
        alignItems: 'center',
    }, timeLabelRelative: {
        paddingLeft: 5,
        color: '#67806D',
    },
})

export default MonthlySumComponent;