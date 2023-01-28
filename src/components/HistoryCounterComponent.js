import React from 'react';
import { View, StyleSheet, Text, } from 'react-native';
import { parseISO, differenceInSeconds, format } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import { Icon } from 'react-native-elements';
const constants = require('../components/constants.json')
const PRODUCTIVITY_WIDTH = 100
const STAR_SIZE = 16;


const HistoryCounterComponent = ({ session_obj, is_active }) => {
    let bgColorHex = constants.colors[session_obj.color_id]
    return (
        <>
            <View style={{ flex: 1, flexDirection: 'row', paddingVertical: 10, backgroundColor: bgColorHex }}>

                <View opacity={is_active ? 1 : 0.3} style={{ flex: 4, }}>
                    <Text numberOfLines={1}
                        style={[styles.textDefaultBold, { fontWeight: '700', color: '#013220', fontSize: 16, }]}>{session_obj.counter_name}</Text>
                </View>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <Text style={[styles.textDefaultBold, { alignSelf: 'center', color: '#013220', fontSize: 16, }]}>
                        {session_obj.daily_count} </Text>
                    <Text style={[styles.textDefault, { alignSelf: 'center', color: '#013220', fontSize: 12, }]}>
                        times</Text>
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

export default HistoryCounterComponent;