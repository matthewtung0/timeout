import React, { useRef, useState, Component } from 'react';
import { View, StyleSheet, Text, Dimensions, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { parseISO, differenceInSeconds } from 'date-fns';
const constants = require('../components/constants.json')

const timeDifference = (timeStart, timeEnd) => {
    var timeDiff = differenceInSeconds(parseISO(timeEnd), parseISO(timeStart))
    return timeDiff + " sec"
}

const HistoryComponent = ({ session_obj }) => {
    let bgColorHex = constants.colors[session_obj.color_id]
    return (
        <><View style={{ flex: 1, flexDirection: 'row', marginVertical: 5 }}>
            {/*<View style={styles.dummy} />*/}
            <View style={{ flex: 2, }}>
                <Text>{session_obj.activity_name}</Text>
            </View>

            <View style={[styles.categoryStyle, { backgroundColor: bgColorHex }]}>
                <Text>{session_obj.category_name}</Text>
            </View>

            <Text>{timeDifference(session_obj.time_start, session_obj.time_end)}</Text>
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
        alignSelf: 'flex-end',
        borderRadius: 10,
        padding: 7,
        marginRight: 12,
    },

})

export default HistoryComponent;