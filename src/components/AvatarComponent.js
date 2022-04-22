import React from 'react';
import { View, StyleSheet, Text, Image, Dimensions } from 'react-native';
import { Button } from 'react-native-elements';

const flagpfp1 = require('../../assets/avatar/20_BACKGROUND/7_lgbtq.png');
/*const hairback = require('../../assets/avatar/16_hair_back/3_down-fluffy_brown-01.png');
const base = require('../../assets/avatar/15_base/1.png');
const eyebrows = require('../../assets/avatar/14_eyebrows/1_neutral-thick_brown-01.png')
const makeup = require('../../assets/avatar/13_makeup/1_eyeliner_black-01.png')
const eyes = require('../../assets/avatar/12_eyes/1_wide_1_brown.png')
const mouth = require('../../assets/avatar/11_mouth/2_lipstick_red-01.png')
const underlayer = require('../../assets/avatar/10_underlayer/7_turtle-short_black-01.png')
const top = require('../../assets/avatar/9_top/2_plaid_black-01.png')
const accessories = require('../../assets/avatar/8_accessories/3_dogtags_silver-01.png')
const outerwear = require('../../assets/avatar/7_outerwear/1_bomber_black-01.png')
const hair = require('../../assets/avatar/6_hair/1_sidesweep_brown-01.png')
const hair_side = require('../../assets/avatar/5_hair_side/2_coversneck_brown-01.png')
const hair_front = require('../../assets/avatar/4_hair_front/2_bangs-full_brown.png')
const ear = require('../../assets/avatar/3_ear/1.png')
const piercings = require('../../assets/avatar/2_piercings/7_earcuff-chain_black.png')
const glasses = require('../../assets/avatar/1_glasses/2_rectangle_shade-01.png')*/

const AvatarComponent = ({ w }) => {
    const { width, height } = Dimensions.get('window')

    return (
        <View>
            <Image
                style={[styles.default, { width: w, height: w }]}
                source={flagpfp1} />
            {/*<Image
                style={[styles.default, { width: w, height: w }]}
                source={hairback} />
            <Image
                style={[styles.default, { width: w, height: w }]}
                source={base} />
            <Image
                style={[styles.default, { width: w, height: w }]}
                source={eyebrows} />
            <Image
                style={[styles.default, { width: w, height: w }]}
                source={makeup} />
            <Image
                style={[styles.default, { width: w, height: w }]}
                source={eyes} />
            <Image
                style={[styles.default, { width: w, height: w }]}
                source={mouth} />
            <Image
                style={[styles.default, { width: w, height: w }]}
                source={underlayer} />
            <Image
                style={[styles.default, { width: w, height: w }]}
                source={top} />
            <Image
                style={[styles.default, { width: w, height: w }]}
                source={accessories} />
            <Image
                style={[styles.default, { width: w, height: w }]}
                source={outerwear} />
            <Image
                style={[styles.default, { width: w, height: w }]}
                source={hair} />
            <Image
                style={[styles.default, { width: w, height: w }]}
                source={hair_side} />
            <Image
                style={[styles.default, { width: w, height: w }]}
                source={hair_front} />

            <Image
                style={[styles.default, { width: w, height: w }]}
                source={ear} />
            <Image
                style={[styles.default, { width: w, height: w }]}
                source={piercings} />
            <Image
                style={[styles.default, { width: w, height: w }]}
    source={glasses} />*/}
        </View>
    )
}

const styles = StyleSheet.create({
    default: {
        position: 'absolute', //marginTop: 170, marginLeft: 50
    }
})

export default AvatarComponent;