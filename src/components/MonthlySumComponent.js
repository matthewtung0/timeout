import React from 'react';
import { View, StyleSheet, Text, Dimensions, FlatList } from 'react-native';
import { addMinutes, fromUnixTime, getUnixTime, isThisSecond, parseISO, format, differenceInSeconds } from 'date-fns';

const MonthlySumComponent = ({ monthBatch }) => {
    const { height, width } = Dimensions.get('window');

    let map = {}
    let act = 0
    let timeDiffSec = 0
    for (var i = 0; i < monthBatch.length; i++) {
        act = monthBatch[i]
        timeDiffSec = differenceInSeconds(parseISO(act.time_end), parseISO(act.time_start))
        if (act.category_name in map) {
            map[act.category_name] = map[act.category_name] + timeDiffSec
        } else {
            map[act.category_name] = timeDiffSec
        }
    }

    console.log(Object.entries(map));

    return (
        <View>
            {/*<Text>{JSON.stringify(monthBatch)}</Text>*/}
            <Text>Monthly Summary (in seconds)</Text>
            <FlatList
                style
                horizontal={false}
                data={Object.entries(map)}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(arr) => arr[0]} //key
                renderItem={({ item }) => {
                    return (
                        <Text>{item[0]}: {item[1]} seconds</Text>
                    )
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
    },
})

export default MonthlySumComponent;