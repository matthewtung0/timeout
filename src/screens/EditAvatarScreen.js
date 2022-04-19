import React from 'react';
import { View, StyleSheet, Text, Image, Dimensions } from 'react-native';
import { Button } from 'react-native-elements';
//import Images from 'images'

const flagpfp1 = require('../../assets/avatar/17_BACKGROUND/1_lgbtq-01.png');
const flagpfpUrl = '../../assets/avatar/17_BACKGROUND/1_lgbtq-01.png'
const hairback = require('../../assets/avatar/16_hair_back/3_down-fluffy_brown-01.png');
const hairbackUrl = '../../assets/avatar/16_hair_back/3_down-fluffy_brown-01.png'
const base = require('../../assets/avatar/15_base/1.png');
const eyebrows = require('../../assets/avatar/14_eyebrows/1_neutral-thick_brown-01.png')
const makeup = require('../../assets/avatar/13_makeup/1_eyeliner_black-01.png')
const eyes = require('../../assets/avatar/12_eyes/1_wide_5_gold.png')
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
const glasses = require('../../assets/avatar/1_glasses/2_rectangle_shade-01.png')

const EditAvatarScreen = ({ navigation }) => {
    const { width, height } = Dimensions.get('window')

    //Images(hairbackUrl).draw(Images(flagpfpUrl), 0, 0).save("imagesTesting.png");
    return (
        <View>
            <Text style={styles.title}>Edit Avatar Screen</Text>
            <Button title="Go back" onPress={() => { navigation.navigate('Profile') }} />
            <Image
                style={styles.default}
                source={flagpfp1} />
            <Image
                style={styles.default}
                source={hairback} />
            <Image
                style={styles.default}
                source={base} />
            <Image
                style={styles.default}
                source={eyebrows} />
            <Image
                style={styles.default}
                source={makeup} />
            <Image
                style={styles.default}
                source={eyes} />
            <Image
                style={styles.default}
                source={mouth} />
            <Image
                style={styles.default}
                source={underlayer} />
            <Image
                style={styles.default}
                source={top} />
            <Image
                style={styles.default}
                source={accessories} />
            <Image
                style={styles.default}
                source={outerwear} />
            <Image
                style={styles.default}
                source={hair} />
            <Image
                style={styles.default}
                source={hair_side} />
            <Image
                style={styles.default}
                source={hair_front} />

            <Image
                style={styles.default}
                source={ear} />
            <Image
                style={styles.default}
                source={piercings} />
            {/*<Image
                style={styles.default}
    source={glasses} />*/}
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        margin: 30,
        fontSize: 40,
    },
    default: {
        width: 300, height: 300, position: 'absolute', marginTop: 170, marginLeft: 50
    }
})

export default EditAvatarScreen;