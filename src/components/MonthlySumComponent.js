import React from 'react';
import { View, StyleSheet, Text, Dimensions, FlatList } from 'react-native';
import { parseISO, differenceInSeconds } from 'date-fns';
const constants = require('../components/constants.json')

const BAR_MAX_WIDTH = 200

const MonthlySumComponent = ({ monthBatch }) => {
    const { height, width } = Dimensions.get('window');
    let map = {}
    let colorMap = {}
    let act = 0
    let timeDiffSec = 0
    let maxTime = -1
    for (var i = 0; i < monthBatch.length; i++) {
        act = monthBatch[i]
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

    //console.log(Object.entries(map))
    let sortedRes = Object.entries(map).sort((a, b) => { return b[1] - a[1] })

    const getColor = (category_name) => {
        var color_id = Object.entries(colorMap).find(k => k[0] == category_name)[1]
        return constants.colors[color_id]
    }

    const getBarPct = (num) => {
        return num / maxTime
    }
    return (
        <View>
            {/*<Text>{JSON.stringify(monthBatch)}</Text>*/}
            <FlatList
                horizontal={false}
                data={sortedRes}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(arr) => arr[0]} //key
                renderItem={({ item }) => {
                    return (
                        <View style={styles.container}>
                            <View style={styles.textContainer}>
                                <Text style={styles.barLabel}>{item[0]}</Text>
                            </View>

                            {BAR_MAX_WIDTH * getBarPct(item[1]) > 40 ?
                                <View style={styles.barContainer}>
                                    <View style={[styles.bar, { backgroundColor: getColor(item[0]), width: BAR_MAX_WIDTH * getBarPct(item[1]) }]} />
                                    <Text style={styles.timeLabel}>{item[1]}s</Text>
                                </View> :
                                <View style={styles.barContainerRelative}>
                                    <View style={[styles.bar, { backgroundColor: getColor(item[0]), width: BAR_MAX_WIDTH * getBarPct(item[1]) }]} />
                                    <Text style={styles.timeLabelRelative}>{item[1]}s</Text>
                                </View>}
                        </View>)
                }}
            >
            </FlatList>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        margin: 30,
        fontSize: 25,
    }, bar: {
        height: 40,
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
    }, container: {
        flex: 1,
        flexDirection: 'row',
        height: 50,
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
    }, timeLabel: {
        position: 'absolute',
        alignSelf: 'flex-end',
        paddingRight: 5,
        color: '#67806D',
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