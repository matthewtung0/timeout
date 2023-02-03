import React from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
const constants = require('../components/constants.json')

const MonthlyCounterComponent = ({ monthBatch }) => {
    const { height, width } = Dimensions.get('window');
    const BAR_MAX_WIDTH = width * 0.6
    let map = {}
    let colorMap = {}
    let act = 0
    let total_count = 0
    let maxCount = -1
    for (var i = 0; i < monthBatch.length; i++) {
        act = monthBatch[i]
        if (act.entry_type == 1) {
            total_count = parseInt(act.daily_count)
            if (act.activity_name in map) {
                map[act.activity_name] = map[act.activity_name] + parseInt(total_count)
                if (map[act.activity_name] > maxCount) { maxCount = map[act.activity_name] }

            } else {
                colorMap[act.activity_name] = act.color_id
                map[act.activity_name] = total_count
                if (total_count > maxCount) { maxCount = total_count }
            }
        }
    }

    //console.log(Object.entries(map))
    let sortedRes = Object.entries(map).sort((a, b) => { return b[1] - a[1] })

    const getColor = (category_name) => {
        var color_id = Object.entries(colorMap).find(k => k[0] == category_name)[1]
        return constants.colors[color_id]
    }

    return (
        <View style={{ marginHorizontal: 20, }}>
            <>
                {sortedRes
                    .map((item) => {
                        return (
                            <View
                                style={[styles.container, {}]}
                                key={item[0]}>
                                <View style={{ flexDirection: 'row', width: '100%', }}>
                                    <View style={[styles.textContainer, { flex: 1, }]}>
                                        <Text
                                            numberOfLines={1}
                                            style={[styles.barLabel, styles.textDefaultSemiBold]}>
                                            {item[0]}</Text>
                                    </View>

                                    <View style={[styles.barContainer, { flex: 2, alignItems: 'flex-start', }]}>
                                        <View>
                                            <Text style={[styles.timeLabel, styles.textDefault,]}>{item[1]}</Text>
                                        </View>

                                    </View>
                                </View>

                            </View>

                        )
                    })}
            </>
        </View >

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
        //width: 75,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
    }, barLabel: {
        //lex: 1,
        flexWrap: 'wrap',
        textAlign: 'right',
        color: '#67806D',
        fontSize: 11,
        fontWeight: '600',
    }, timeLabel: {
        //position: 'absolute',
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

export default MonthlyCounterComponent;