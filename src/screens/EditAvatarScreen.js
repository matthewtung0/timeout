import React, { useState } from 'react';
import { View, StyleSheet, Text, Image, Dimensions, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements';
//import Images from 'images'

const flagpfp1 = require('../../assets/avatar/17_BACKGROUND/1_lgbtq-01.png');
const flagpfpUrl = '../../assets/avatar/17_BACKGROUND/1_lgbtq-01.png'
const hairback = require('../../assets/avatar/16_hair_back/3_down-fluffy_brown-01.png');
const hairbackUrl = '../../assets/avatar/16_hair_back/3_down-fluffy_brown-01.png'

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

const base1 = require('../../assets/avatar/15_base/1.png');
const base2 = require('../../assets/avatar/15_base/2.png');
const base3 = require('../../assets/avatar/15_base/3.png');
const base4 = require('../../assets/avatar/15_base/4.png');
const base5 = require('../../assets/avatar/15_base/5.png');

const ear1 = require('../../assets/avatar/3_ear/1.png')
const ear2 = require('../../assets/avatar/3_ear/2.png')
const ear3 = require('../../assets/avatar/3_ear/3.png')
const ear4 = require('../../assets/avatar/3_ear/4.png')
const ear5 = require('../../assets/avatar/3_ear/5.png')

const eyesWide1 = require('../../assets/avatar/12_eyes/1_wide_1_brown.png')
const eyesWide2 = require('../../assets/avatar/12_eyes/1_wide_2_black.png')
const eyesWide3 = require('../../assets/avatar/12_eyes/1_wide_3_blue.png')
const eyesWide4 = require('../../assets/avatar/12_eyes/1_wide_4_green.png')
const eyesWide5 = require('../../assets/avatar/12_eyes/1_wide_5_gold.png')
const eyesWide6 = require('../../assets/avatar/12_eyes/1_wide_6_red.png')
const eyesWide7 = require('../../assets/avatar/12_eyes/1_wide_7_allwhite.png')
const eyesWide8 = require('../../assets/avatar/12_eyes/1_wide_8_allblack.png')

const eyesNeutral1 = require('../../assets/avatar/12_eyes/2_neutral_1_brown.png')
const eyesNeutral2 = require('../../assets/avatar/12_eyes/2_neutral_2_black.png')
const eyesNeutral3 = require('../../assets/avatar/12_eyes/2_neutral_3_blue.png')
const eyesNeutral4 = require('../../assets/avatar/12_eyes/2_neutral_4_green.png')
const eyesNeutral5 = require('../../assets/avatar/12_eyes/2_neutral_5_gold.png')
const eyesNeutral6 = require('../../assets/avatar/12_eyes/2_neutral_6_red.png')
const eyesNeutral7 = require('../../assets/avatar/12_eyes/2_neutral_7_allwhite.png')
const eyesNeutral8 = require('../../assets/avatar/12_eyes/2_neutral_8_allblack.png')

const baseColor = [base1, base2, base3, base4, base5]
const eyesWide = [eyesWide1, eyesWide2, eyesWide3, eyesWide4, eyesWide5, eyesWide6, eyesWide7, eyesWide8,]
const eyesNeutral = [eyesNeutral1, eyesNeutral2, eyesNeutral3, eyesNeutral4, eyesNeutral5, eyesNeutral6, eyesNeutral7, eyesNeutral8,]

const eyeTypes = [eyesWide, eyesNeutral]

const earAll = [ear1, ear2, ear3, ear4, ear5]

const piercings = require('../../assets/avatar/2_piercings/7_earcuff-chain_black.png')
const glasses = require('../../assets/avatar/1_glasses/2_rectangle_shade-01.png')


const EditAvatarScreen = ({ navigation }) => {
    const { width, height } = Dimensions.get('window')
    const [avatarItems, setAvatarItems] = useState(
        {
            face: { ears: 0, mouth: 0, eyes: 0, makeup: 0, eyebrows: 0, base: 0, },
            accessories: { glasses: 0, piercings: 0, accessories: 0 },
            clothing: { outewear: 0, toplayer: 0, underlayer: 0, },
            hair: { front: 0, back: 0, side: 0, },
            background: 0
        })

    const [avatarColors, setAvatarColors] = useState(
        {
            face: { ears: ear1, mouth: 0, eyes: 0, makeup: 0, eyebrows: 0, base: 0, },
            accessories: { glasses: 0, piercings: 0, accessories: 0 },
            clothing: { outewear: 0, toplayer: 0, underlayer: 0, },
            hair: { front: 0, back: 0, side: 0, },
            background: 0
        })

    const setFace = (earId, mouthId, eyeId, makeupId, eyebrowId,
        earColor, mouthColor, eyeColor, makeupColor, eyebrowColor) => {
        setAvatarItems(...avatarItems, { face: { ears: earId, mouth: mouthId, eyes: eyeId, makeup: makeupId, eyebrows: eyebrowId } })
        setAvatarColors(...avatarColors, { face: { ears: earColor, mouth: mouthColor, eyes: eyeColor, makeup: makeupColor, eyebrows: eyebrowColor } })
    }

    const setEarColor = (earColor) => {
        setAvatarColors({ ...avatarColors, face: { ...avatarColors.face, ears: earColor } })
    }

    const setEyeColor = (eyeColor) => {
        setAvatarColors({ ...avatarColors, face: { ...avatarColors.face, eyes: eyeColor } })
    }

    const setEyeType = (eyeType) => {
        setAvatarItems({ ...avatarColors, face: { ...avatarColors.face, eyes: eyeType } })
    }

    const setBaseColor = (baseColor) => {
        setAvatarColors({ ...avatarColors, face: { ...avatarColors.face, base: baseColor } })
    }

    console.log(avatarColors)


    //Images(hairbackUrl).draw(Images(flagpfpUrl), 0, 0).save("imagesTesting.png");
    return (
        <ScrollView>
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
                source={baseColor[avatarColors.face.base]} />
            <Image
                style={styles.default}
                source={eyebrows} />
            <Image
                style={styles.default}
                source={makeup} />
            <Image
                style={styles.default}
                source={eyeTypes[avatarItems.face.eyes][avatarColors.face.eyes]} />
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
                source={avatarColors.face.ears} />
            <Image
                style={styles.default}
                source={piercings} />
            {/*<Image
                style={styles.default}
    source={glasses} />*/}
            <View style={{ marginTop: 350, }}>
                {/*Face */}
                <View>
                    <Text>Pick ear color</Text>
                    < FlatList
                        style={{ borderWidth: 1 }}
                        horizontal={true}
                        data={earAll}
                        //numColumns='3'
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => {
                            return (<View>
                                <TouchableOpacity
                                    onPress={() => { setEarColor(item) }}>
                                    <Image
                                        style={styles.preview}
                                        source={item} />
                                </TouchableOpacity>
                            </View>
                            )
                        }}
                    />

                    <Text>Ears</Text>
                    <Text>Mouth</Text>

                    <Text>Eyes</Text>
                    <Text>Pick eye color</Text>
                    < FlatList
                        style={{ borderWidth: 1 }}
                        horizontal={true}
                        data={eyesWide}
                        //numColumns='3'
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => item}
                        renderItem={({ item, index }) => {
                            return (<View>
                                <TouchableOpacity
                                    onPress={() => {
                                        console.log("clicked index", index)
                                        setEyeColor(index)
                                    }}>
                                    <Image
                                        style={styles.preview}
                                        source={item} />
                                </TouchableOpacity>
                            </View>
                            )
                        }}
                    />

                    <Text>Pick eye type</Text>
                    < FlatList
                        style={{ borderWidth: 1 }}
                        horizontal={true}
                        data={eyeTypes}
                        //numColumns='3'
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => item}
                        renderItem={({ item, index }) => {
                            return (<View>
                                <TouchableOpacity
                                    onPress={() => {
                                        console.log("clicked index", index)
                                        setEyeType(index)
                                    }}>
                                    <Image
                                        style={styles.preview}
                                        source={item[0]} />
                                </TouchableOpacity>
                            </View>
                            )
                        }}
                    />


                    <Text>Makeup</Text>
                    <Text>Eyebrows</Text>
                    <Text>base (skin color)</Text>
                    <Text>Pick body color</Text>
                    < FlatList
                        style={{ borderWidth: 1 }}
                        horizontal={true}
                        data={baseColor}
                        //numColumns='3'
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => item}
                        renderItem={({ item, index }) => {
                            return (<View>
                                <TouchableOpacity
                                    onPress={() => {
                                        console.log("clicked index", index)
                                        setBaseColor(index)
                                    }}>
                                    <Image
                                        style={styles.preview}
                                        source={item} />
                                </TouchableOpacity>
                            </View>
                            )
                        }}
                    />
                </View>
                {/* Accessories */}
                <View>
                    <Text>Glasses</Text>
                    <Text>Piercings</Text>
                    <Text>Accessories</Text>
                </View>

                {/* Clothing */}
                <View>
                    <Text>Outerwear</Text>
                    <Text>Top layer</Text>
                    <Text>Underlayer</Text>
                </View>

                {/* Hair  */}
                <View>
                    <Text>Hair (front)</Text>
                    <Text>Hair(side)</Text>
                    <Text>Hair(back)</Text>
                </View>

                {/* Background */}
                <View>
                    <Text>Background</Text>
                </View>






            </View>

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    title: {
        margin: 30,
        fontSize: 40,
    },
    default: {
        width: 300, height: 300, position: 'absolute', marginTop: 170, marginLeft: 50
    },
    preview: {
        borderWidth: 1, width: 60, height: 60,
    }
})

export default EditAvatarScreen;