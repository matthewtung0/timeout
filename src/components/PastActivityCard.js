import React from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { parseISO, differenceInSeconds } from 'date-fns';
const constants = require('../components/constants.json')

const PastActivityCard = ({ session }) => {
    const { height, width } = Dimensions.get('window');
    let timeDiffSec = differenceInSeconds(parseISO(session.time_end), parseISO(session.time_start))
    let bgColorHex = constants.colors[session.color_id]

    return (

        <View style={[styles.container]}>
            {/*<View style={[styles.overlapContainer, {
                width: width * 0.8,
                height: height * 0.1,
                backgroundColor: bgColorHex
            }]}>
            <View style={[styles.tab, { width: width * 0.08, backgroundColor: bgColorHex }]}></View>*/}

            <View style={{
                backgroundColor: bgColorHex, justifyContent: 'center',
                borderRadius: 10, flex: 1, alignItems: 'center', padding: 4,
            }}>
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 13, }}>{session.category_name}</Text>
            </View>
            <View style={[styles.bg, { flex: 3, }]}>
                <Text style={[styles.title, { color: bgColorHex }]}>{session.activity_name}</Text>
                <Text style={styles.time}>{timeDiffSec} sec</Text>
            </View>
        </View>



    )
}


const styles = StyleSheet.create({
    container: {
        paddingVertical: 12,
        flex: 1,
        flexDirection: 'row',
        alignSelf: 'center',
        borderRadius: 10,
    },
    overlapContainer: {
        flexDirection: 'row',
        borderRadius: 10,
    },
    tab: {
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
    },
    bg: {
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        alignSelf: 'center',
        justifyContent: 'space-around',
    },
    title: {
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 6,
    },
    time: {
        color: 'gray',
        marginLeft: 6,
    },
})

export default PastActivityCard;