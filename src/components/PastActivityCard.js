import React from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { parseISO, differenceInSeconds } from 'date-fns';
const constants = require('../components/constants.json')

const PastActivityCard = ({ session }) => {
    const { height, width } = Dimensions.get('window');
    let timeDiffSec = differenceInSeconds(parseISO(session.time_end), parseISO(session.time_start))
    let bgColorHex = constants.colors[session.color_id]
    return (

        <View style={[styles.container, { width: width * 0.8 }]}>
            <View style={[styles.overlapContainer, {
                width: width * 0.8,
                height: height * 0.1,
                backgroundColor: bgColorHex
            }]}>
                <View style={[styles.tab, { width: width * 0.08, backgroundColor: bgColorHex }]}></View>

                <View style={[styles.bg, { width: width * 0.71, height: height * 0.09 }]}>
                    <Text style={styles.title}>{session.activity_name}</Text>
                    <Text style={styles.time}>{timeDiffSec} sec</Text>

                </View>
            </View>
        </View>



    )
}


const styles = StyleSheet.create({
    container: {
        margin: 5,
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
        backgroundColor: 'white',
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        alignSelf: 'center',
        justifyContent: 'space-around',
    },
    title: {
        fontWeight: 'bold',
        fontSize: 18,
        marginLeft: 6,
    },
    time: {
        marginLeft: 6,
    },
})

export default PastActivityCard;