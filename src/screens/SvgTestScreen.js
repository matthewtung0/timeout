import React, { useState, useContext, useEffect, useCallback } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, FlatList, Image, ActivityIndicator, Alert, Dimensions } from 'react-native';
import * as DIR from '../components/AvatarSelection';
import { Icon } from 'react-native-elements'
import { useFocusEffect } from '@react-navigation/native';
import { Context as UserContext } from '../context/userContext';
import Header from '../components/Header';

import {
    SvgTestScreen2,
    Piercing1_svg, Piercing2_svg, Piercing3_svg, Piercing4_svg, Piercing5_svg, Piercing6_svg, Piercing7_svg,
    Hairfront1_svg, Hairfront2_svg, Hairfront3_svg,
    Hairside1_svg, Hairside2_svg,
    Outerwear1_svg,
    Top1_svg, Top3_svg,
    Accessories1_svg, Accessories2_svg, Accessories3_svg,
    Underlayer1_svg, Underlayer2_svg, Underlayer3_svg, Underlayer4_svg, Underlayer5_svg, Underlayer6_svg, Underlayer7_svg, Underlayer9_svg,
    Mouth1_svg, Mouth2_svg, Mouth3_svg,
    EyeMakeup1_svg,
    Base1_svg, Base2_svg, Base3_svg, Base4_svg, Base5_svg,
    Eyebrows1_svg, Eyebrows2_svg,
    HairAccessories1_svg,
    Hairback1_svg, Hairback2_svg,
    Bg1_svg, Bg1_1_svg, Bg1_2_svg, Bg1_3_svg, Bg1_4_svg, Bg1_5_svg,
    Bg2_svg, Bg2_1_svg, Bg3_svg, Bg4_svg, Bg5_svg, Bg6_svg, Bg7_svg, Bg8_svg, Bg9_svg, Bg10_svg,
    NoItem1_svg,
} from '../components/AvatarSelection2';

const THUMBNAIL_SIZE = 50;
const AVATAR_SIZE = 250;
const THUMBNAIL_COLOR = "#000000";
const ITEM_R = 52;
const ITEM_G = 52;
const ITEM_B = 52;

const SvgTestScreen = ({ navigation }) => {
    const { height, width } = Dimensions.get('window');
    const [isLoading, setIsLoading] = useState(false)
    const [activeMenu, setActiveMenu] = useState(0)
    const { state, saveAvatar2, fetchAvatarItemsOwned } = useContext(UserContext)

    const piercing_types = (size, c) => {
        return [{
            svg: <Piercing1_svg
                colorFill={c} len={size} />, id: 1,
            owned: true
        }, {
            svg: <Piercing2_svg
                colorFill={c} len={size} />, id: 2,
            owned: true
        }, {
            svg: <Piercing3_svg
                colorFill={c} len={size} />, id: 3,
            owned: true
        }, {
            svg: <Piercing4_svg
                colorFill={c} len={size} />, id: 4,
            owned: true
        }, {
            svg: <Piercing5_svg
                colorFill={c} len={size} />, id: 5,
            owned: true
        }, {
            svg: <Piercing6_svg
                colorFill={c} len={size} />, id: 6,
            owned: true
        }, {
            svg: <Piercing7_svg
                colorFill={c} len={size} />, id: 7,
            owned: true
        },]
    }

    const hair_front_types = (size, c) => {
        return [{
            svg: <Hairfront1_svg
                colorFill={c} len={size} />, id: 1,
            owned: true
        },
        {
            svg: <Hairfront2_svg
                colorFill={c} len={size} />, id: 2,
            owned: true
        },
        {
            svg: <Hairfront3_svg
                colorFill={c} len={size} />, id: 3,
            owned: true
        },
        ]
    }

    const base_types = (size, c) => {
        return [{
            svg: <Base1_svg
                colorFill={c} len={size} />, id: 1,
            owned: true
        }, {
            svg: <Base2_svg
                colorFill={c} len={size} />, id: 2,
            owned: true
        }, {
            svg: <Base3_svg
                colorFill={c} len={size} />, id: 3,
            owned: true
        }, {
            svg: <Base4_svg
                colorFill={c} len={size} />, id: 4,
            owned: true
        }, {
            svg: <Base5_svg
                colorFill={c} len={size} />, id: 5,
            owned: true
        },]
    }

    const underlayer_types = (size, c) => {
        return [{
            svg: <Underlayer1_svg
                colorFill={c} len={size} />, id: 'Underlayer1',
            owned: true
        }, {
            svg: <Underlayer2_svg
                colorFill={c} len={size} />, id: 'Underlayer2',
            owned: true
        }, {
            svg: <Underlayer3_svg
                colorFill={c} len={size} />, id: 'Underlayer3',
            owned: true
        }, {
            svg: <Underlayer4_svg
                colorFill={c} len={size} />, id: 'Underlayer4',
            owned: true
        }, {
            svg: <Underlayer5_svg
                colorFill={c} len={size} />, id: 'Underlayer5',
            owned: true
        }, {
            svg: <Underlayer6_svg
                colorFill={c} len={size} />, id: 'Underlayer6',
            owned: true
        }, {
            svg: <Underlayer7_svg
                colorFill={c} len={size} />, id: 'Underlayer7',
            owned: state.avatarItemsOwned.filter(e => e.item_id === 'Underlayer7').length > 0,
            cost: 100,
        }, {
            svg: <Underlayer9_svg
                colorFill={c} len={size} />, id: 'Underlayer9',
            owned: state.avatarItemsOwned.filter(e => e.item_id === 'Underlayer9').length > 0,
            cost: 100,
        },
        ]
    }

    const top_types = (size, c) => {
        return [
            {
                svg: <Top1_svg
                    colorFill={c} len={size} />, id: 1,
                owned: true
            }, {
                svg: <Top3_svg
                    colorFill={c} len={size} />, id: 3,
                owned: true
            },
        ]
    }

    const accessories_types = (size, c) => {
        return [
            {
                svg: <Accessories1_svg
                    colorFill={c} len={size} />, id: 1,
                owned: true
            }, {
                svg: <Accessories2_svg
                    colorFill={c} len={size} />, id: 2,
                owned: true
            }, {
                svg: <Accessories3_svg
                    colorFill={c} len={size} />, id: 3,
                owned: true
            },
        ]
    }

    const outerwear_types = (size, c) => {
        return [
            {
                svg: <Outerwear1_svg
                    colorFill={c} len={size} />, id: 1,
                owned: true
            }
        ]
    }

    const mouth_types = (size, c) => {
        return [
            {
                svg: <Mouth1_svg
                    colorFill={c} len={size} />, id: 1,
                owned: true
            }, {
                svg: <Mouth2_svg
                    colorFill={c} len={size} />, id: 2,
                owned: true
            }, {
                svg: <Mouth3_svg
                    colorFill={c} len={size} />, id: 3,
                owned: true
            }
        ]
    }

    const eye_makeup_types = (size, c) => {
        return [{
            svg: <EyeMakeup1_svg
                colorFill={c} len={size} />, id: 1,
            owned: true
        },]
    }

    const eyebrow_types = (size, c) => {
        return [{
            svg: <Eyebrows1_svg
                colorFill={c} len={size} />, id: 1,
            owned: true
        }, {
            svg: <Eyebrows2_svg
                colorFill={c} len={size} />, id: 2,
            owned: true
        },]
    }

    const hair_accessories_types = (size, c) => {
        return [{
            svg: <HairAccessories1_svg
                colorFill={c} len={size} />, id: 1,
            owned: true
        }]
    }

    const hair_back_types = (size, c) => {
        return [{
            svg: <Hairback1_svg
                colorFill={c} len={size} />, id: 1,
            owned: true
        }, {
            svg: <Hairback2_svg
                colorFill={c} len={size} />, id: 2,
            owned: true
        }]
    }

    const hair_side_types = (size, c) => {
        return [{
            svg: <Hairside1_svg
                colorFill={c} len={size} />, id: 1,
            owned: true
        }, {
            svg: <Hairside2_svg
                colorFill={c} len={size} />, id: 2,
            owned: true
        }]
    }

    const bg_types = (size, c) => {
        return [{
            svg: <Bg1_svg
                colorFill={c} len={size} />, id: 'Bg1',
            owned: true
        }, {
            svg: <Bg1_1_svg
                colorFill={c} len={size} />, id: 'Bg1.1',
            owned: true
        }, {
            svg: <Bg1_2_svg
                colorFill={c} len={size} />, id: 'Bg1.2',
            owned: true
        }, {
            svg: <Bg1_3_svg
                colorFill={c} len={size} />, id: 'Bg1.3',
            owned: true
        }, {
            svg: <Bg1_4_svg
                colorFill={c} len={size} />, id: 'Bg1.4',
            owned: true
        }, {
            svg: <Bg1_5_svg
                colorFill={c} len={size} />, id: 'Bg1.5',
            owned: true
        }, {
            svg: <Bg2_svg
                colorFill={c} len={size} />, id: 'Bg2',
            owned: true
        }, {
            svg: <Bg2_1_svg
                colorFill={c} len={size} />, id: 'Bg2.1',
            owned: true
        }, {
            svg: <Bg3_svg
                colorFill={c} len={size} />, id: 'Bg3',
            owned: true
        }, {
            svg: <Bg4_svg
                colorFill={c} len={size} />, id: 'Bg4',
            owned: true
        }, {
            svg: <Bg5_svg
                colorFill={c} len={size} />, id: 'Bg5',
            owned: true
        }, {
            svg: <Bg6_svg
                colorFill={c} len={size} />, id: 'Bg6',
            owned: true
        }, {
            svg: <Bg7_svg
                colorFill={c} len={size} />, id: 'Bg7',
            owned: true
        }, {
            svg: <Bg8_svg
                colorFill={c} len={size} />, id: 'Bg8',
            owned: state.avatarItemsOwned.filter(e => e.item_id === 'Bg8').length > 0,
            cost: 100,
        }, {
            svg: <Bg9_svg
                colorFill={c} len={size} />, id: 'Bg9',
            owned: state.avatarItemsOwned.filter(e => e.item_id === 'Bg9').length > 0,
            cost: 100,
        }, {
            svg: <Bg10_svg
                colorFill={c} len={size} />, id: 'Bg10',
            owned: state.avatarItemsOwned.filter(e => e.item_id === 'Bg10').length > 0,
            cost: 100,
        },]
    }

    const no_item = (size, c) => {
        return [{
            svg: <NoItem1_svg
                colorFill={c} len={size} />, id: -1,
            owned: true
        }]
    }

    // black, white, pink, red, purple, darkblue, lightblue, darkyellow, lightyellow, green
    // used for clothes, hair accessories
    const underlayer_colors = [
        { id: 1, hex: '#000000' },
        { id: 2, hex: '#ffffff' },
        { id: 3, hex: '#FFC0CB' },
        { id: 4, hex: '#FF0000' },
        { id: 5, hex: '#A020F0' },
        { id: 6, hex: '#00008B' },
        { id: 7, hex: '#ADD8E6' },
        { id: 8, hex: '#8B8000' },
        { id: 9, hex: '#FFFFE0' },
        { id: 10, hex: '#00FF00' },
    ]
    // black, brown, blonde, white, blue, green
    const hair_colors = [
        { id: 1, hex: '#000000' },
        { id: 2, hex: '#964B00' },
        { id: 3, hex: '#F0E2B6' },
        { id: 4, hex: '#FFFFFF' },
        { id: 5, hex: '#00FFFF' },
        { id: 6, hex: '#00FF00' },
    ]
    // gray, black, red, pink, green
    const mouth_colors = [
        { id: 1, hex: '#808080' },
        { id: 2, hex: '#000000' },
        { id: 3, hex: '#FF0000' },
        { id: 4, hex: '#FFC0CB' },
        { id: 5, hex: '#00FF00' },
    ]
    // silver, black, gold, pink
    const eye_makeup_colors = [
        { id: 1, hex: '#C0C0C0' },
        { id: 2, hex: '#000000' },
        { id: 3, hex: '#FFD700' },
        { id: 4, hex: '#FFC0CB' },
    ]

    const piercing_colors = [
        { id: 1, hex: '#000000' },
    ]

    const [underlayerPickerVisible, setUnderlayerPickerVisible] = useState(true)
    const [topPickerVisible, setTopPickerVisible] = useState(false)
    const [outerwearPickerVisible, setOuterwearlayerPickerVisible] = useState(false)
    const [hairSidePickerVisible, setHairSidePickerVisible] = useState(false)
    const [hairBackPickerVisible, setHairBackPickerVisible] = useState(false)
    const [hairFrontPickerVisible, setHairFrontPickerVisible] = useState(false)
    const [hairAccessoriesPickerVisible, setHairAccessoriesPickerVisible] = useState(true)
    const [accessoriesPickerVisible, setAccessoriesPickerVisible] = useState(false)
    const [mouthPickerVisible, setMouthPickerVisible] = useState(false)
    const [eyePickerVisible, setEyePickerVisible] = useState(false)
    const [eyeMakeupPickerVisible, setEyeMakeupPickerVisible] = useState(false)
    const [eyebrowPickerVisible, setEyebrowPickerVisible] = useState(false)
    const [backgroundPickerVisible, setBackgroundPickerVisible] = useState(false)
    const [hairPickerVisible, setHairPickerVisible] = useState(true)
    const [skinPickerVisible, setSkinPickerVisible] = useState(true)
    const [piercingPickerVisible, setPiercingPickerVisible] = useState(false)
    const [glassesPickerVisible, setGlassesPickerVisible] = useState(false)

    const [baseIndex, setBaseIndex] = useState(state.avatarJSON.face.base.item)
    const [underlayerIndex, setUnderlayerIndex] = useState(state.avatarJSON.clothing.under.item);
    const [outerwearIndex, setOuterwearIndex] = useState(state.avatarJSON.clothing.outer.item);
    const [topIndex, setTopIndex] = useState(state.avatarJSON.clothing.top.item);
    const [underlayerColorIndex, setUnderlayerColorIndex] = useState(state.avatarJSON.clothing.under.color);
    const [outerwearColorIndex, setOuterwearColorIndex] = useState(state.avatarJSON.clothing.outer.color);
    const [topColorIndex, setTopColorIndex] = useState(state.avatarJSON.clothing.top.color);
    const [piercingIndex, setPiercingIndex] = useState(state.avatarJSON.accessories.piercings.item);
    const [piercingColorIndex, setPiercingColorIndex] = useState(state.avatarJSON.accessories.piercings.color);
    const [glassesIndex, setGlassesIndex] = useState(state.avatarJSON.accessories.glasses.item);
    const [glassesColorIndex, setGlassesColorIndex] = useState(state.avatarJSON.accessories.glasses.color);

    const [hairSideIndex, setHairSideIndex] = useState(state.avatarJSON.hair.side.item);
    const [hairBackIndex, setHairBackIndex] = useState(state.avatarJSON.hair.back.item);
    const [hairFrontIndex, setHairFrontIndex] = useState(state.avatarJSON.hair.front.item);
    const [hairColorIndex, setHairColorIndex] = useState(state.avatarJSON.hair.base.color);

    const [accessoriesIndex, setAccessoriesIndex] = useState(state.avatarJSON.accessories.general.item);
    const [hairAccessoriesIndex, setHairAccessoriesIndex] = useState(state.avatarJSON.accessories.hair.item);
    const [hairAccessoriesColorIndex, setHairAccessoriesColorIndex] = useState(state.avatarJSON.accessories.hair.color);

    const [mouthIndex, setMouthIndex] = useState(state.avatarJSON.face.mouth.item);
    const [mouthColorIndex, setMouthColorIndex] = useState(state.avatarJSON.face.mouth.color);

    const [eyeMakeupIndex, setEyeMakeupIndex] = useState(state.avatarJSON.face.makeup.item);
    const [eyeMakeupColorIndex, setEyeMakeupColorIndex] = useState(state.avatarJSON.face.makeup.color);
    const [eyebrowIndex, setEyebrowIndex] = useState(state.avatarJSON.face.eyebrows.item);
    const [eyebrowColorIndex, setEyebrowColorIndex] = useState(state.avatarJSON.face.eyebrows.color);
    const [eyeIndex, setEyeIndex] = useState(state.avatarJSON.face.eyes.item)
    const [eyeColorIndex, setEyeColorIndex] = useState(state.avatarJSON.face.eyes.color)

    const [hairIndex, setHairIndex] = useState(state.avatarJSON.hair.base.item)

    const [backgroundIndex, setBackgroundIndex] = useState(state.avatarJSON.accessories.background.item)

    // for optional items to toggle on/off
    const [hasOuterwear, setHasOuterwear] = useState(state.avatarJSON.clothing.outer.active)
    const [hasTop, setHasTop] = useState(state.avatarJSON.clothing.top.active)
    const [hasHairAccessories, setHasHairAccessories] = useState(state.avatarJSON.accessories.hair.active)
    const [hasHairBack, setHasHairBack] = useState(state.avatarJSON.hair.back.active)
    const [hasHairSide, setHasHairSide] = useState(state.avatarJSON.hair.side.active)
    const [hasHairFront, setHasHairFront] = useState(state.avatarJSON.hair.front.active)
    const [hasAccessories, setHasAccessories] = useState(state.avatarJSON.accessories.general.active)
    const [hasEyeMakeup, setHasEyeMakeup] = useState(state.avatarJSON.face.makeup.active)
    const [hasPiercings, setHasPiercings] = useState(state.avatarJSON.accessories.piercings.active)
    const [hasGlasses, setHasGlasses] = useState(state.avatarJSON.accessories.glasses.active)

    const [unownedMouth, setUnownedMouth] = useState(0)
    const [unownedEyes, setUnownedEyes] = useState(0)
    const [unownedMakeup, setUnownedMakeup] = useState(0)
    const [unownedEyebrows, setUnownedEyebrows] = useState(0)
    const [unownedBase, setUnownedBase] = useState(0)
    const [unownedHairAccessories, setUnownedHairAccessories] = useState(0)
    const [unownedGenAccessories, setUnownedGenAccessories] = useState(0)
    const [unownedPiercings, setUnownedPiercings] = useState(0)
    const [unownedGlasses, setUnownedGlasses] = useState(0)
    const [unownedBackground, setUnownedBackground] = useState(0)
    const [unownedUnder, setUnownedUnder] = useState(0)
    const [unownedTop, setUnownedTop] = useState(0)
    const [unownedOuter, setUnownedOuter] = useState(0)
    const [unownedHairBase, setUnownedHairBase] = useState(0)
    const [unownedHairFront, setUnownedHairFront] = useState(0)
    const [unownedHairSide, setUnownedHairSide] = useState(0)
    const [unownedHairBack, setUnownedHairBack] = useState(0)

    const [unownedCost, setUnownedCost] = useState({
        face: {
            mouth: 0,
            eyes: 0,
            makeup: 0,
            eyebrows: 0,
            base: 0,
        },
        accessories: {
            hair: 0,
            general: 0,
            piercings: 0,
            glasses: 0,
            background: 0,
        },
        clothing: {
            under: 0,
            top: 0,
            outer: 0,
        },
        hair: {
            base: 0,
            front: 0,
            back: 0,
            side: 0,
        }
    })

    const [totalUnowned, setTotalUnowned] = useState(0)
    /* JSON data to produce to represent avatar */
    const [avatarJSON, setAvatarJSON] = useState({});

    useEffect(() => {
        setTotalUnowned(unownedMouth + unownedEyes + unownedMakeup + unownedEyebrows + unownedBase +
            unownedHairAccessories + unownedGenAccessories + unownedPiercings + unownedGlasses +
            unownedBackground + unownedUnder + unownedTop + unownedOuter + unownedHairBase + unownedHairFront +
            unownedHairSide + unownedHairBack)
    }, [unownedMouth, unownedEyes, unownedMakeup, unownedEyebrows, unownedBase,
        unownedHairAccessories, unownedGenAccessories, unownedPiercings, unownedGlasses,
        unownedBackground, unownedUnder, unownedTop, unownedOuter, unownedHairBase, unownedHairFront,
        unownedHairSide, unownedHairBack])

    /* Reset avatar menu selections when user exits the screen */
    useFocusEffect(
        useCallback(() => {

            setBaseIndex(state.avatarJSON.face.base.item)
            setUnderlayerIndex(state.avatarJSON.clothing.under.item)
            setOuterwearIndex(state.avatarJSON.clothing.outer.item)
            setTopIndex(state.avatarJSON.clothing.top.item)
            setUnderlayerColorIndex(state.avatarJSON.clothing.under.color)
            setOuterwearColorIndex(state.avatarJSON.clothing.outer.color)
            setTopColorIndex(state.avatarJSON.clothing.top.color)
            setPiercingIndex(state.avatarJSON.accessories.piercings.item)
            setPiercingColorIndex(state.avatarJSON.accessories.piercings.color)
            setGlassesIndex(state.avatarJSON.accessories.glasses.item)
            setGlassesColorIndex(state.avatarJSON.accessories.glasses.color)
            setHairSideIndex(state.avatarJSON.hair.side.item)
            setHairBackIndex(state.avatarJSON.hair.back.item)
            setHairFrontIndex(state.avatarJSON.hair.front.item)
            setHairColorIndex(state.avatarJSON.hair.base.color)
            setAccessoriesIndex(state.avatarJSON.accessories.general.item)
            setHairAccessoriesIndex(state.avatarJSON.accessories.hair.item)
            setHairAccessoriesColorIndex(state.avatarJSON.accessories.hair.color)
            setMouthIndex(state.avatarJSON.face.mouth.item)
            setMouthColorIndex(state.avatarJSON.face.mouth.color)
            setEyeMakeupIndex(state.avatarJSON.face.makeup.item)

            setEyeMakeupColorIndex(state.avatarJSON.face.makeup.color)
            setEyebrowIndex(state.avatarJSON.face.eyebrows.item)
            setEyebrowColorIndex(state.avatarJSON.face.eyebrows.color)
            setEyeIndex(state.avatarJSON.face.eyes.item)
            setEyeColorIndex(state.avatarJSON.face.eyes.color)
            setHairIndex(state.avatarJSON.hair.base.item)
            setBackgroundIndex(state.avatarJSON.accessories.background.item)

            setHasOuterwear(state.avatarJSON.clothing.outer.active)
            setHasTop(state.avatarJSON.clothing.top.active)
            setHasHairAccessories(state.avatarJSON.accessories.hair.active)
            setHasHairBack(state.avatarJSON.hair.back.active)
            setHasHairSide(state.avatarJSON.hair.side.active)
            setHasHairFront(state.avatarJSON.hair.front.active)
            setHasAccessories(state.avatarJSON.accessories.general.active)
            setHasEyeMakeup(state.avatarJSON.face.makeup.active)
            setHasPiercings(state.avatarJSON.accessories.piercings.active)
            setHasGlasses(state.avatarJSON.accessories.glasses.active)




            console.log("test focus effect")
        }, [state.avatarJSON, state.avatarItemsOwned])
    )

    const updateUnowned = (item_state_setter, item_state, item_id, item_owned, item_cost) => {
        var cur_item_state = item_state
        if (!item_owned) {
            var cost = item_cost
            item_state_setter(cost)
        } else {
            item_state_setter(0)
        }
        /*setTotalUnowned(unownedMouth + unownedEyes + unownedMakeup + unownedEyebrows + unownedBase +
            unownedHairAccessories + unownedGenAccessories + unownedPiercings + unownedGlasses +
            unownedBackground + unownedUnder + unownedTop + unownedOuter + unownedHairBase + unownedHairFront +
            unownedHairSide + unownedHairBack)*/
    }


    const saveAvatarCallback = async () => {
        if (totalUnowned > 0) {
            await fetchAvatarItemsOwned();
        }
        setTotalUnowned(0);
        console.log("AVATAR SUCCESSFULLY SAVED")
        alert("Avatar successfully saved!")
        setIsLoading(false)
    }

    const saveAvatarCallbackFail = () => {
        alert("Something went wrong. Please try again later.")
        setIsLoading(false)
    }

    const areYouSureRedeem = () => {
        Alert.alert(
            "Your points will be redeemed. Continue?",
            "",
            [
                {
                    text: "No, go back",
                    onPress: () => { },
                    style: "cancel"
                },
                {
                    text: "Confirm", onPress: () => {
                        saveAvatar()
                    }
                }
            ]
        );
    }

    const saveAvatarEntry = async () => {
        if (state.points < totalUnowned || 0) {
            alert("Sorry, you don't have enough points. Keep using the app to earn more :)")
            return
        }
        if (totalUnowned == 0) {
            saveAvatar()
        } else {
            areYouSureRedeem()
        }

    }

    const identifyItemsToRedeem = () => {
        var itemsToRedeem = new Array(); // list of item id's to redeem

        if (unownedMouth > 0) { itemsToRedeem.push(mouth_types(1, 1)[mouthIndex].id) }
        //if (unownedEyes > 0) {itemsToRedeem.push(eyes_types[mouthIndex].id)}
        if (unownedMakeup > 0) { itemsToRedeem.push(eye_makeup_types(1, 1)[eyeMakeupIndex].id) }
        if (unownedEyebrows > 0) { itemsToRedeem.push(eyebrow_types(1, 1)[eyebrowIndex].id) }
        //if (unownedBase > 0) {itemsToRedeem.push(base_types[mouthIndex].id)}

        if (unownedHairAccessories > 0) { itemsToRedeem.push(hair_accessories_types(1, 1)[hairAccessoriesIndex].id) }
        if (unownedGenAccessories > 0) { itemsToRedeem.push(accessories_types(1, 1)[accessoriesIndex].id) }
        if (unownedPiercings > 0) { itemsToRedeem.push(piercing_types(1, 1)[piercingIndex].id) }
        //if (unownedGlasses > 0) {itemsToRedeem.push(mouth_types[mouthIndex].id)}
        if (unownedBackground > 0) { itemsToRedeem.push(bg_types(1, 1)[backgroundIndex].id) }

        if (unownedUnder > 0) { itemsToRedeem.push(underlayer_types(1, 1)[underlayerIndex].id) }
        if (unownedTop > 0) { itemsToRedeem.push(top_types(1, 1)[topIndex].id) }
        if (unownedOuter > 0) { itemsToRedeem.push(outerwear_types(1, 1)[outerwearIndex].id) }

        //if (unownedHairBase > 0) {itemsToRedeem.push(hair_b[mouthIndex].id)}
        if (unownedHairFront > 0) { itemsToRedeem.push(hair_front_types(1, 1)[hairFrontIndex].id) }
        if (unownedHairSide > 0) { itemsToRedeem.push(hair_side_types(1, 1)[hairSideIndex].id) }
        if (unownedHairBack > 0) { itemsToRedeem.push(hair_back_types(1, 1)[hairBackIndex].id) }

        return itemsToRedeem

    }

    const saveAvatar = async () => {
        setIsLoading(true)
        var items_to_redeem = identifyItemsToRedeem()
        console.log("Items to redeem", items_to_redeem)
        var avatarJSON_to_send = {
            face: {
                mouth: {
                    item: mouthIndex,
                    color: mouthColorIndex,
                    active: true,
                },
                eyes: {
                    item: eyeIndex,
                    color: eyeColorIndex,
                    active: true,
                },
                makeup: {
                    item: eyeMakeupIndex,
                    color: eyeMakeupColorIndex,
                    active: hasEyeMakeup,
                },
                eyebrows: {
                    item: eyebrowIndex,
                    color: eyebrowColorIndex,
                    active: true,
                },
                base: {
                    item: baseIndex,
                    color: -1,
                    active: true,
                },
            },
            accessories: {
                hair: {
                    item: hairAccessoriesIndex,
                    color: hairAccessoriesColorIndex,
                    active: hasHairAccessories,
                },
                general: {
                    item: accessoriesIndex,
                    color: -1,
                    active: hasAccessories,
                },
                piercings: {
                    item: piercingIndex,
                    color: piercingColorIndex,
                    active: hasPiercings,
                },
                glasses: {
                    item: glassesIndex,
                    color: glassesColorIndex,
                    active: hasGlasses,
                }, background: {
                    item: backgroundIndex,
                    color: -1,
                    active: true,
                },
            },
            clothing: {
                under: {
                    item: underlayerIndex,
                    color: underlayerColorIndex,
                    active: true,
                },
                top: {
                    item: topIndex,
                    color: topColorIndex,
                    active: hasTop,
                },
                outer: {
                    item: outerwearIndex,
                    color: outerwearColorIndex,
                    active: hasOuterwear,
                },
            },
            hair: {
                base: {
                    item: hairIndex,
                    color: hairColorIndex,
                    active: true,
                },
                front: {
                    item: hairFrontIndex,
                    color: hairColorIndex,
                    active: hasHairFront,
                },
                back: {
                    item: hairBackIndex,
                    color: hairColorIndex,
                    active: hasHairBack,
                },
                side: {
                    item: hairSideIndex,
                    color: hairColorIndex,
                    active: hasHairSide,
                },
            },
        }
        await saveAvatar2(state.user_id, avatarJSON_to_send, items_to_redeem, totalUnowned, saveAvatarCallback, saveAvatarCallbackFail)
    }
    const createAvatarJSON = () => {
        setAvatarJSON({
            face: {
                mouth: {
                    item: mouthIndex,
                    color: mouthColorIndex,
                    active: true,
                },
                eyes: {
                    item: eyeIndex,
                    color: eyeColorIndex,
                    active: true,
                },
                makeup: {
                    item: eyeMakeupIndex,
                    color: eyeMakeupColorIndex,
                    active: hasEyeMakeup,
                },
                eyebrows: {
                    item: eyebrowIndex,
                    color: eyebrowColorIndex,
                    active: true,
                },
                base: {
                    item: baseIndex,
                    color: -1,
                    active: true,
                },
            },
            accessories: {
                hair: {
                    item: hairAccessoriesIndex,
                    color: hairAccessoriesColorIndex,
                    active: hasHairAccessories,
                },
                general: {
                    item: accessoriesIndex,
                    color: -1,
                    active: hasAccessories,
                },
                piercings: {
                    item: piercingIndex,
                    color: piercingColorIndex,
                    active: hasPiercings,
                },
                glasses: {
                    item: glassesIndex,
                    color: glassesColorIndex,
                    active: hasGlasses,
                }, background: {
                    item: backgroundIndex,
                    color: -1,
                    active: true,
                },
            },
            clothing: {
                under: {
                    item: underlayerIndex,
                    color: underlayerColorIndex,
                    active: true,
                },
                top: {
                    item: topIndex,
                    color: topColorIndex,
                    active: hasTop,
                },
                outer: {
                    item: outerwearIndex,
                    color: outerwearColorIndex,
                    active: hasOuterwear,
                },
            },
            hair: {
                base: {
                    item: hairIndex,
                    color: hairColorIndex,
                    active: true,
                },
                front: {
                    item: hairFrontIndex,
                    color: hairColorIndex,
                    active: hasHairFront,
                },
                back: {
                    item: hairBackIndex,
                    color: hairColorIndex,
                    active: hasHairBack,
                },
                side: {
                    item: hairSideIndex,
                    color: hairColorIndex,
                    active: hasHairSide,
                },
            },
        })
    }

    return (
        <>
            <View style={{ marginTop: 80, }}>
                <View style={{ height: AVATAR_SIZE, alignItems: 'center', marginBottom: 10, }}>

                    <View style={{ position: 'absolute' }}>
                        {bg_types(AVATAR_SIZE, hair_colors[hairColorIndex].hex)[backgroundIndex].svg}
                    </View>

                    {hasHairBack ?
                        <View style={{ position: 'absolute' }}>
                            {hair_back_types(AVATAR_SIZE, hair_colors[hairColorIndex].hex)[hairBackIndex].svg}
                        </View> : null}
                    {hasHairAccessories ?
                        <View style={{ position: 'absolute' }}>
                            {hair_accessories_types(AVATAR_SIZE, underlayer_colors[hairAccessoriesColorIndex].hex)[hairAccessoriesIndex].svg}
                        </View> : null}
                    {/*<View style={{ position: 'absolute' }}>
                        {base_types(AVATAR_SIZE, mouth_colors[0].hex)[baseIndex].svg}
                    </View>*/}
                    <Image
                        style={{ width: AVATAR_SIZE, height: AVATAR_SIZE, position: 'absolute', }}
                        source={DIR.baseTypes[baseIndex]} />

                    <View style={{ position: 'absolute' }}>
                        {eyebrow_types(AVATAR_SIZE, mouth_colors[eyebrowColorIndex].hex)[eyebrowIndex].svg}
                    </View>
                    {hasEyeMakeup ?
                        <View style={{ position: 'absolute' }}>
                            {eye_makeup_types(AVATAR_SIZE, mouth_colors[eyeMakeupColorIndex].hex)[eyeMakeupIndex].svg}
                        </View> : null}

                    <Image
                        style={{ width: AVATAR_SIZE, height: AVATAR_SIZE, position: 'absolute', }}
                        source={DIR.eyeTypes[eyeIndex][eyeColorIndex]} />


                    <View style={{ position: 'absolute' }}>
                        {mouth_types(AVATAR_SIZE, mouth_colors[mouthColorIndex].hex)[mouthIndex].svg}
                    </View>
                    <View style={{ position: 'absolute' }}>
                        {underlayer_types(AVATAR_SIZE, underlayer_colors[underlayerColorIndex].hex)[underlayerIndex].svg}
                    </View>
                    {hasTop ?
                        <View style={{ position: 'absolute' }}>
                            {top_types(AVATAR_SIZE, underlayer_colors[topColorIndex].hex)[topIndex].svg}
                        </View> : null}

                    {hasAccessories ?
                        <View style={{ position: 'absolute' }}>
                            {accessories_types(AVATAR_SIZE, underlayer_colors[0].hex)[accessoriesIndex].svg}
                        </View>
                        : null}
                    {hasOuterwear ?
                        <View style={{ position: 'absolute' }}>
                            {outerwear_types(AVATAR_SIZE, underlayer_colors[outerwearColorIndex].hex)[outerwearIndex].svg}
                        </View> : null}

                    {/* 6_HAIR */}
                    <Image
                        style={{ width: AVATAR_SIZE, height: AVATAR_SIZE, position: 'absolute', }}
                        source={DIR.hairTypes[hairIndex][hairColorIndex]} />

                    {hasHairSide ?
                        <View style={{ position: 'absolute' }}>
                            {hair_side_types(AVATAR_SIZE, hair_colors[hairColorIndex].hex)[hairSideIndex].svg}
                        </View> : null}

                    {hasHairFront ?
                        <View style={{ position: 'absolute' }}>
                            {hair_front_types(AVATAR_SIZE, hair_colors[hairColorIndex].hex)[hairFrontIndex].svg}
                        </View> : null}

                    {hasPiercings ?
                        <View style={{ position: 'absolute' }}>
                            {piercing_types(AVATAR_SIZE, piercing_colors[piercingColorIndex].hex)[piercingIndex].svg}
                        </View> : null}

                    {hasGlasses ?
                        <Image
                            style={{ width: AVATAR_SIZE, height: AVATAR_SIZE, position: 'absolute', }}
                            source={DIR.glassesTypes[glassesIndex][glassesColorIndex]} />
                        : null}

                </View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                {totalUnowned > 0 ?
                    <View><Text>This outfit will cost {totalUnowned} points</Text>
                    </View>
                    :
                    <View opacity='0'><Text>This outfit will cost {totalUnowned} points</Text></View>}
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                <TouchableOpacity style={[activeMenu == 0 ? styles.itemSelectorNewActive :
                    styles.itemSelectorNew, { width: width / 4 }]} onPress={() => { setActiveMenu(0) }}>
                    <View style={{ width: 50, height: 50, backgroundColor: 'white', borderRadius: 25, }}>
                        <Text>Face</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={[activeMenu == 1 ? styles.itemSelectorNewActive :
                    styles.itemSelectorNew, { width: width / 4 }]} onPress={() => { setActiveMenu(1) }}>
                    <View style={{ width: 50, height: 50, backgroundColor: 'white', borderRadius: 25, }}>
                        <Text>Accessories</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={[activeMenu == 2 ? styles.itemSelectorNewActive :
                    styles.itemSelectorNew, { width: width / 4 }]} onPress={() => { setActiveMenu(2) }}>
                    <View style={{ width: 50, height: 50, backgroundColor: 'white', borderRadius: 25, }}>
                        <Text>Clothes</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={[activeMenu == 3 ? styles.itemSelectorNewActive :
                    styles.itemSelectorNew, { width: width / 4 }]} onPress={() => { setActiveMenu(3) }}>
                    <View style={{ width: 50, height: 50, backgroundColor: 'white', borderRadius: 25, }}>
                        <Text>Hair</Text>
                    </View>
                </TouchableOpacity>
            </View>

            <View>
                {activeMenu == 0 ?
                    <View>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1, borderWidth: 1, }}>
                                <TouchableOpacity
                                    style={skinPickerVisible ? [styles.itemSelectorActive] :
                                        styles.itemSelector}
                                    onPress={() => {
                                        setSkinPickerVisible(true)
                                        setEyePickerVisible(false)
                                        setMouthPickerVisible(false)
                                        setEyeMakeupPickerVisible(false)
                                        setEyebrowPickerVisible(false)
                                    }}>
                                    <Text style={{ textAlign: 'center', }}>Skin</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={eyePickerVisible ? [styles.itemSelectorActive] :
                                        styles.itemSelector}
                                    onPress={() => {
                                        setSkinPickerVisible(false)
                                        setEyePickerVisible(true)
                                        setMouthPickerVisible(false)
                                        setEyeMakeupPickerVisible(false)
                                        setEyebrowPickerVisible(false)
                                    }}>
                                    <Text style={{ textAlign: 'center', }}>Eyes</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={mouthPickerVisible ? [styles.itemSelectorActive] :
                                        styles.itemSelector}
                                    onPress={() => {
                                        setSkinPickerVisible(false)
                                        setEyePickerVisible(false)
                                        setMouthPickerVisible(true)
                                        setEyeMakeupPickerVisible(false)
                                        setEyebrowPickerVisible(false)
                                    }}>
                                    <Text style={{ textAlign: 'center', }}>Mouth</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={eyeMakeupPickerVisible ? [styles.itemSelectorActive] :
                                        styles.itemSelector}
                                    onPress={() => {
                                        setSkinPickerVisible(false)
                                        setEyePickerVisible(false)
                                        setMouthPickerVisible(false)
                                        setEyeMakeupPickerVisible(true)
                                        setEyebrowPickerVisible(false)
                                    }}>
                                    <Text style={{ textAlign: 'center', }}>Eye Makeup</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={eyebrowPickerVisible ? [styles.itemSelectorActive] :
                                        styles.itemSelector}
                                    onPress={() => {
                                        setSkinPickerVisible(false)
                                        setEyePickerVisible(false)
                                        setMouthPickerVisible(false)
                                        setEyeMakeupPickerVisible(false)
                                        setEyebrowPickerVisible(true)
                                    }}>
                                    <Text style={{ textAlign: 'center', }}>Eyebrows</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flex: 3 }}>

                                {/* skin */}
                                {skinPickerVisible ?
                                    <><Text>Skin Types</Text>
                                        <FlatList
                                            style={{}}
                                            horizontal={true}
                                            //data={base_types(THUMBNAIL_SIZE, THUMBNAIL_COLOR)}
                                            data={DIR.baseTypes}
                                            showsHorizontalScrollIndicator={false}
                                            keyExtractor={(item) => item}
                                            renderItem={({ item, index }) => {
                                                return (<View>
                                                    <TouchableOpacity
                                                        style={[styles.menuItemDefault,
                                                        {
                                                            borderColor: `rgba(
                                                            ${ITEM_R},
                                                            ${ITEM_G},
                                                            ${ITEM_B},
                                                            ${baseIndex == index ? 1.00 : 0.00})`
                                                        }]}
                                                        onPress={() => {
                                                            setBaseIndex(index)
                                                        }}>
                                                        {/*{item.svg}*/}
                                                        <Image
                                                            style={{ width: THUMBNAIL_SIZE, height: THUMBNAIL_SIZE }}
                                                            source={item} />

                                                    </TouchableOpacity>
                                                </View>
                                                )
                                            }}
                                        />
                                    </>
                                    : null}

                                {/* eyes */}
                                {eyePickerVisible ?
                                    <>
                                        <Text>Eye Types</Text>
                                        <FlatList
                                            style={{}}
                                            horizontal={true}
                                            data={DIR.eyeTypes}
                                            showsHorizontalScrollIndicator={false}
                                            keyExtractor={(item) => item}
                                            renderItem={({ item, index }) => {
                                                return (<View>
                                                    <TouchableOpacity
                                                        style={[styles.menuItemDefault,
                                                        {
                                                            borderColor: `rgba(
                                                            ${ITEM_R},
                                                            ${ITEM_G},
                                                            ${ITEM_B},
                                                            ${eyeIndex == index ? 1.00 : 0.00})`
                                                        }]}
                                                        onPress={() => {
                                                            setEyeIndex(index)
                                                        }}>
                                                        <Image
                                                            style={{ width: THUMBNAIL_SIZE, height: THUMBNAIL_SIZE }}
                                                            source={item[0]} />

                                                    </TouchableOpacity>
                                                </View>
                                                )
                                            }}
                                        />
                                        <Text>Eye Colors</Text>
                                        <ScrollView
                                            horizontal
                                            showsVerticalScrollIndicator={false}
                                            showsHorizontalScrollIndicator={true}
                                            style={{}}>
                                            <FlatList
                                                style={{}}
                                                //horizontal={true}
                                                scrollEnabled={false}
                                                numColumns={Math.ceil(DIR.eyeColors.length / 2)}
                                                data={DIR.eyeColors}
                                                showsHorizontalScrollIndicator={false}
                                                keyExtractor={(item) => item}
                                                renderItem={({ item, index }) => {
                                                    return (<View>
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                setEyeColorIndex(index)
                                                            }}>
                                                            <View style={{
                                                                width: 50, height: 50, borderRadius: 100, margin: 2, backgroundColor: item,
                                                                borderWidth: 2,
                                                                borderColor: `rgba(
                                                        ${ITEM_R},
                                                        ${ITEM_G},
                                                        ${ITEM_B},
                                                        ${eyeColorIndex == index ? 1.00 : 0.00})`
                                                            }} />

                                                        </TouchableOpacity>
                                                    </View>
                                                    )
                                                }}
                                            /></ScrollView>
                                    </>
                                    : null}

                                {/* mouth */}
                                {mouthPickerVisible ? <>
                                    <Text>Mouth Types</Text>
                                    <FlatList
                                        style={{}}
                                        horizontal={true}
                                        data={mouth_types(THUMBNAIL_SIZE, THUMBNAIL_COLOR)}
                                        showsHorizontalScrollIndicator={false}
                                        keyExtractor={(item) => item.id}
                                        renderItem={({ item, index }) => {
                                            return (<View>
                                                <TouchableOpacity
                                                    style={[styles.menuItemDefault,
                                                    {
                                                        borderColor: `rgba(
                                                        ${ITEM_R},
                                                        ${ITEM_G},
                                                        ${ITEM_B},
                                                        ${mouthIndex == index ? 1.00 : 0.00})`
                                                    }]}
                                                    onPress={() => {
                                                        setMouthIndex(index)
                                                    }}>
                                                    {item.svg}

                                                </TouchableOpacity>
                                            </View>
                                            )
                                        }}
                                    />
                                    <Text>Mouth Colors</Text>
                                    <ScrollView
                                        horizontal
                                        showsVerticalScrollIndicator={false}
                                        showsHorizontalScrollIndicator={true}
                                        style={{}}>
                                        <FlatList
                                            style={{}}
                                            //horizontal={true}
                                            scrollEnabled={false}
                                            numColumns={Math.ceil(mouth_colors.length / 2)}
                                            data={mouth_colors}
                                            showsHorizontalScrollIndicator={false}
                                            keyExtractor={(item) => item.id}
                                            renderItem={({ item, index }) => {
                                                return (<View>
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            console.log("Mouth color index ", index)
                                                            setMouthColorIndex(index)
                                                        }}>
                                                        <View style={{
                                                            width: 50, height: 50, borderRadius: 100, margin: 2, backgroundColor: item.hex,
                                                            borderWidth: 2,
                                                            borderColor: `rgba(
                                                        ${ITEM_R},
                                                        ${ITEM_G},
                                                        ${ITEM_B},
                                                        ${mouthColorIndex == index ? 1.00 : 0.00})`
                                                        }} />

                                                    </TouchableOpacity>
                                                </View>
                                                )
                                            }}
                                        /></ScrollView>
                                </>
                                    : null}

                                {/* eye makeup */}
                                {eyeMakeupPickerVisible ?
                                    <>
                                        <Text>Eye Makeup Types</Text><FlatList
                                            style={{}}
                                            horizontal={true}
                                            data={no_item(THUMBNAIL_SIZE, THUMBNAIL_COLOR).concat(
                                                eye_makeup_types(THUMBNAIL_SIZE, THUMBNAIL_COLOR))}
                                            showsHorizontalScrollIndicator={false}
                                            keyExtractor={(item) => item.id}
                                            renderItem={({ item, index }) => {
                                                return (<View>
                                                    <TouchableOpacity
                                                        style={[styles.menuItemDefault,
                                                        {
                                                            borderColor: `rgba(
                                                            ${ITEM_R},
                                                            ${ITEM_G},
                                                            ${ITEM_B},
                                                            ${eyeMakeupIndex == index ? 1.00 : 0.00})`
                                                        }]}
                                                        onPress={() => {
                                                            setHasEyeMakeup(index > 0)
                                                            if (index > 0) {
                                                                setEyeMakeupIndex(index - 1)
                                                            }
                                                        }}>
                                                        {item.svg}

                                                    </TouchableOpacity>
                                                </View>
                                                )
                                            }}
                                        />

                                        <Text>Eye Makeup Colors</Text>
                                        <FlatList
                                            style={{}}
                                            horizontal={true}
                                            data={eye_makeup_colors}
                                            showsHorizontalScrollIndicator={false}
                                            keyExtractor={(item) => item.id}
                                            renderItem={({ item, index }) => {
                                                return (<View>
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            setEyeMakeupColorIndex(index)
                                                        }}>
                                                        <View style={{
                                                            width: 50, height: 50, borderRadius: 100, margin: 2, backgroundColor: item.hex,
                                                            borderWidth: 2,
                                                            borderColor: `rgba(
                                                        ${ITEM_R},
                                                        ${ITEM_G},
                                                        ${ITEM_B},
                                                        ${eyeMakeupColorIndex == index ? 1.00 : 0.00})`
                                                        }} />

                                                    </TouchableOpacity>
                                                </View>
                                                )
                                            }}
                                        />
                                    </> : null}


                                {/* Eyebrows */}
                                {eyebrowPickerVisible ?
                                    <>
                                        <Text>Eyebrow Types</Text><FlatList
                                            style={{}}
                                            horizontal={true}
                                            data={eyebrow_types(THUMBNAIL_SIZE, THUMBNAIL_COLOR)}
                                            showsHorizontalScrollIndicator={false}
                                            keyExtractor={(item) => item.id}
                                            renderItem={({ item, index }) => {
                                                return (<View>
                                                    <TouchableOpacity
                                                        style={[styles.menuItemDefault,
                                                        {
                                                            borderColor: `rgba(
                                                            ${ITEM_R},
                                                            ${ITEM_G},
                                                            ${ITEM_B},
                                                            ${eyebrowIndex == index ? 1.00 : 0.00})`
                                                        }]}
                                                        onPress={() => {
                                                            setEyebrowIndex(index)
                                                        }}>
                                                        {item.svg}

                                                    </TouchableOpacity>
                                                </View>
                                                )
                                            }}
                                        />
                                        <Text>Eyebrow Colors</Text>
                                        <FlatList
                                            style={{}}
                                            horizontal={true}
                                            data={eye_makeup_colors}
                                            showsHorizontalScrollIndicator={false}
                                            keyExtractor={(item) => item.id}
                                            renderItem={({ item, index }) => {
                                                return (<View>
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            setEyebrowColorIndex(index)
                                                        }}>
                                                        <View style={{
                                                            width: 50, height: 50, borderRadius: 100, margin: 2, backgroundColor: item.hex,
                                                            borderWidth: 2,
                                                            borderColor: `rgba(
                                                        ${ITEM_R},
                                                        ${ITEM_G},
                                                        ${ITEM_B},
                                                        ${eyebrowColorIndex == index ? 1.00 : 0.00})`
                                                        }} />

                                                    </TouchableOpacity>
                                                </View>
                                                )
                                            }}
                                        />
                                    </> : null}

                            </View>
                        </View>
                    </View>
                    : null}

                {activeMenu == 1 ?
                    <View>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1, borderWidth: 1, }}>
                                <TouchableOpacity
                                    style={hairAccessoriesPickerVisible ? [styles.itemSelectorActive] :
                                        styles.itemSelector}
                                    onPress={() => {
                                        setHairAccessoriesPickerVisible(true)
                                        setAccessoriesPickerVisible(false)
                                        setBackgroundPickerVisible(false)
                                        setPiercingPickerVisible(false)
                                        setGlassesPickerVisible(false)
                                    }}>
                                    <Text style={{ textAlign: 'center', }}>Hair accessories</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={accessoriesPickerVisible ? [styles.itemSelectorActive] :
                                        styles.itemSelector}
                                    onPress={() => {
                                        setHairAccessoriesPickerVisible(false)
                                        setAccessoriesPickerVisible(true)
                                        setBackgroundPickerVisible(false)
                                        setPiercingPickerVisible(false)
                                        setGlassesPickerVisible(false)
                                    }}>
                                    <Text style={{ textAlign: 'center', }}>General accessories</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={piercingPickerVisible ? [styles.itemSelectorActive] :
                                        styles.itemSelector}
                                    onPress={() => {
                                        setHairAccessoriesPickerVisible(false)
                                        setAccessoriesPickerVisible(false)
                                        setPiercingPickerVisible(true)
                                        setBackgroundPickerVisible(false)
                                        setGlassesPickerVisible(false)

                                    }}>
                                    <Text style={{ textAlign: 'center', }}>Piercings</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={glassesPickerVisible ? [styles.itemSelectorActive] :
                                        styles.itemSelector}
                                    onPress={() => {
                                        setHairAccessoriesPickerVisible(false)
                                        setAccessoriesPickerVisible(false)
                                        setPiercingPickerVisible(false)
                                        setBackgroundPickerVisible(false)
                                        setGlassesPickerVisible(true)
                                    }}>
                                    <Text style={{ textAlign: 'center', }}>Glasses</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={backgroundPickerVisible ? [styles.itemSelectorActive] :
                                        styles.itemSelector}
                                    onPress={() => {
                                        setHairAccessoriesPickerVisible(false)
                                        setAccessoriesPickerVisible(false)
                                        setBackgroundPickerVisible(true)
                                        setPiercingPickerVisible(false)
                                        setGlassesPickerVisible(false)
                                    }}>
                                    <Text style={{ textAlign: 'center', }}>Background</Text>
                                </TouchableOpacity>


                            </View>

                            <View style={{ flex: 3, borderWidth: 1, }}>
                                {/* hair accessories */}
                                {hairAccessoriesPickerVisible ? <>
                                    <Text>Hair Accessory Types</Text>
                                    <FlatList
                                        style={{}}
                                        horizontal={true}
                                        data={no_item(THUMBNAIL_SIZE, THUMBNAIL_COLOR).concat(
                                            hair_accessories_types(THUMBNAIL_SIZE, THUMBNAIL_COLOR))}
                                        showsHorizontalScrollIndicator={false}
                                        keyExtractor={(item) => item.id}
                                        renderItem={({ item, index }) => {
                                            return (<View>
                                                <TouchableOpacity
                                                    style={[styles.menuItemDefault,
                                                    {
                                                        borderColor: `rgba(
                                                        ${ITEM_R},
                                                        ${ITEM_G},
                                                        ${ITEM_B},
                                                        ${(hairAccessoriesIndex == index - 1 && index > 0 && hasHairAccessories)
                                                                || !hasHairAccessories && index == 0 ? 1.00 : 0.00})`
                                                    }]}
                                                    onPress={() => {
                                                        setHasHairAccessories(index > 0)
                                                        if (index > 0) {
                                                            setHairAccessoriesIndex(index - 1)
                                                        }

                                                    }}>
                                                    {item.svg}

                                                </TouchableOpacity>
                                            </View>
                                            )
                                        }}
                                    />
                                    <Text>Hair Accessory Colors</Text>
                                    <ScrollView
                                        horizontal
                                        showsVerticalScrollIndicator={false}
                                        showsHorizontalScrollIndicator={true}
                                        style={{}}>
                                        <FlatList
                                            style={{}}
                                            //horizontal={true}
                                            scrollEnabled={false}
                                            numColumns={Math.ceil(underlayer_colors.length / 2)}
                                            data={underlayer_colors}
                                            showsHorizontalScrollIndicator={false}
                                            keyExtractor={(item) => item.id}
                                            renderItem={({ item, index }) => {
                                                return (<View>
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            setHairAccessoriesColorIndex(index)
                                                        }}>
                                                        <View style={{
                                                            width: 50, height: 50, borderRadius: 100, margin: 2, backgroundColor: item.hex,
                                                            borderWidth: 2,
                                                            borderColor: `rgba(
                                                    ${ITEM_R},
                                                    ${ITEM_G},
                                                    ${ITEM_B},
                                                    ${hairAccessoriesColorIndex == index ? 1.00 : 0.00})`
                                                        }} />

                                                    </TouchableOpacity>
                                                </View>
                                                )
                                            }}
                                        />
                                    </ScrollView>
                                </> : null}

                                {/* accessories */}
                                {accessoriesPickerVisible ?
                                    <>
                                        <Text>General Accessory Types</Text>
                                        <FlatList
                                            style={{}}
                                            horizontal={true}
                                            data={no_item(THUMBNAIL_SIZE, THUMBNAIL_COLOR).concat(
                                                accessories_types(THUMBNAIL_SIZE, THUMBNAIL_COLOR))}
                                            showsHorizontalScrollIndicator={false}
                                            keyExtractor={(item) => item.id}
                                            renderItem={({ item, index }) => {
                                                return (<View>
                                                    <TouchableOpacity
                                                        style={[styles.menuItemDefault,
                                                        {
                                                            borderColor: `rgba(
                                                            ${ITEM_R},
                                                            ${ITEM_G},
                                                            ${ITEM_B},
                                                            ${(accessoriesIndex == index - 1 && index > 0 && hasAccessories)
                                                                    || !hasAccessories && index == 0 ? 1.00 : 0.00})`
                                                        }]}
                                                        onPress={() => {
                                                            setHasAccessories(index > 0)
                                                            if (index > 0) {
                                                                setAccessoriesIndex(index - 1)
                                                            }
                                                        }}>
                                                        {item.svg}
                                                    </TouchableOpacity>
                                                </View>
                                                )
                                            }}
                                        />
                                    </>
                                    : null}
                                {/* background */}
                                {backgroundPickerVisible ?
                                    <>
                                        <Text>Background Types</Text>
                                        <ScrollView
                                            horizontal
                                            showsVerticalScrollIndicator={false}
                                            showsHorizontalScrollIndicator={true}
                                            style={{}}>
                                            <FlatList
                                                style={{}}
                                                //horizontal={true}
                                                scrollEnabled={false}
                                                numColumns={Math.ceil(bg_types(THUMBNAIL_SIZE, THUMBNAIL_COLOR).length / 3)}
                                                data={bg_types(THUMBNAIL_SIZE, THUMBNAIL_COLOR)}
                                                showsHorizontalScrollIndicator={false}
                                                keyExtractor={(item) => item.id}
                                                renderItem={({ item, index }) => {
                                                    return (<View>
                                                        <TouchableOpacity
                                                            style={[styles.menuItemDefault,
                                                            {
                                                                borderColor: `rgba(
                                                            ${ITEM_R},
                                                            ${ITEM_G},
                                                            ${ITEM_B},
                                                            ${backgroundIndex == index ? 1.00 : 0.00})`
                                                            }]}
                                                            onPress={() => {
                                                                setBackgroundIndex(index)
                                                                updateUnowned(setUnownedBackground, unownedBackground,
                                                                    item.id, item.owned, item.cost)
                                                            }}>
                                                            <View>

                                                                {item.svg}
                                                                {!item.owned ?
                                                                    <Text style={{ position: 'absolute' }}>Locked</Text>
                                                                    : null}


                                                            </View>


                                                        </TouchableOpacity>
                                                    </View>
                                                    )
                                                }}
                                            />
                                        </ScrollView>
                                    </>
                                    : null}

                                {piercingPickerVisible ? <>
                                    <Text>Piercing Types</Text>
                                    <FlatList
                                        style={{}}
                                        horizontal={true}
                                        data={no_item(THUMBNAIL_SIZE, THUMBNAIL_COLOR).concat(
                                            piercing_types(THUMBNAIL_SIZE, THUMBNAIL_COLOR))}
                                        showsHorizontalScrollIndicator={false}
                                        keyExtractor={(item) => item.id}
                                        renderItem={({ item, index }) => {
                                            return (<View>
                                                <TouchableOpacity
                                                    style={[styles.menuItemDefault,
                                                    {
                                                        borderColor: `rgba(
                                                        ${ITEM_R},
                                                        ${ITEM_G},
                                                        ${ITEM_B},
                                                        ${(piercingIndex == index - 1 && index > 0 && hasPiercings)
                                                                || !hasPiercings && index == 0 ? 1.00 : 0.00})`
                                                    }]}
                                                    onPress={() => {
                                                        setHasPiercings(index > 0)
                                                        if (index > 0) {
                                                            setPiercingIndex(index - 1)
                                                        }
                                                    }}>
                                                    {item.svg}

                                                </TouchableOpacity>
                                            </View>
                                            )
                                        }}
                                    />
                                    <Text>Piercing Colors</Text>
                                    <FlatList
                                        style={{}}
                                        horizontal={true}
                                        data={piercing_colors}
                                        showsHorizontalScrollIndicator={false}
                                        keyExtractor={(item) => item.id}
                                        renderItem={({ item, index }) => {
                                            return (<View>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        setPiercingColorIndex(index)
                                                    }}>
                                                    <View style={{
                                                        width: 50, height: 50, borderRadius: 100, margin: 2, backgroundColor: item.hex,
                                                        borderWidth: 2,
                                                        borderColor: `rgba(
                                                    ${ITEM_R},
                                                    ${ITEM_G},
                                                    ${ITEM_B},
                                                    ${piercingColorIndex == index ? 1.00 : 0.00})`
                                                    }} />

                                                </TouchableOpacity>
                                            </View>
                                            )
                                        }}
                                    />
                                </> : null}

                                {glassesPickerVisible ? <>
                                    <Text>Glasses Types</Text>
                                    <FlatList
                                        style={{}}
                                        horizontal={true}
                                        data={no_item(THUMBNAIL_SIZE, THUMBNAIL_COLOR).concat(
                                            DIR.glassesTypes)}
                                        showsHorizontalScrollIndicator={false}
                                        keyExtractor={(item) => item}
                                        renderItem={({ item, index }) => {
                                            return (<View>
                                                <TouchableOpacity
                                                    style={[styles.menuItemDefault,
                                                    {
                                                        borderColor: `rgba(
                                                        ${ITEM_R},
                                                        ${ITEM_G},
                                                        ${ITEM_B},
                                                        ${(glassesIndex == index - 1 && index > 0 && hasGlasses)
                                                                || !hasGlasses && index == 0 ? 1.00 : 0.00})`
                                                    }]}
                                                    onPress={() => {
                                                        setHasGlasses(index > 0)
                                                        if (index > 0) {
                                                            setGlassesIndex(index - 1)
                                                        }
                                                    }}>
                                                    {index == 0 ? item.svg :
                                                        <Image
                                                            style={{ width: THUMBNAIL_SIZE, height: THUMBNAIL_SIZE }}
                                                            source={item[0]} />}

                                                </TouchableOpacity>
                                            </View>
                                            )
                                        }}
                                    />
                                    <Text>Glasses Colors</Text>
                                    <FlatList
                                        style={{}}
                                        horizontal={true}
                                        data={piercing_colors}
                                        showsHorizontalScrollIndicator={false}
                                        keyExtractor={(item) => item.id}
                                        renderItem={({ item, index }) => {
                                            return (<View>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        setGlassesColorIndex(index)
                                                    }}>
                                                    <View style={{
                                                        width: 50, height: 50, borderRadius: 100, margin: 2, backgroundColor: item.hex,
                                                        borderWidth: 2,
                                                        borderColor: `rgba(
                                                    ${ITEM_R},
                                                    ${ITEM_G},
                                                    ${ITEM_B},
                                                    ${glassesColorIndex == index ? 1.00 : 0.00})`
                                                    }} />

                                                </TouchableOpacity>
                                            </View>
                                            )
                                        }}
                                    />
                                </> : null}
                            </View>
                        </View>
                    </View>
                    : null}

                {activeMenu == 2 ?
                    <View>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1, borderWidth: 1, }}>
                                <TouchableOpacity
                                    style={underlayerPickerVisible ? [styles.itemSelectorActive] :
                                        styles.itemSelector}
                                    onPress={() => {
                                        setUnderlayerPickerVisible(true)
                                        setTopPickerVisible(false)
                                        setOuterwearlayerPickerVisible(false)
                                    }}>
                                    <Text style={{ textAlign: 'center', }}>Under layer</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={topPickerVisible ? [styles.itemSelectorActive] :
                                        styles.itemSelector}
                                    onPress={() => {
                                        setUnderlayerPickerVisible(false)
                                        setTopPickerVisible(true)
                                        setOuterwearlayerPickerVisible(false)
                                    }}>
                                    <Text style={{ textAlign: 'center', }}>Top layer</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={outerwearPickerVisible ? [styles.itemSelectorActive] :
                                        styles.itemSelector}
                                    onPress={() => {
                                        setUnderlayerPickerVisible(false)
                                        setTopPickerVisible(false)
                                        setOuterwearlayerPickerVisible(true)
                                    }}>
                                    <Text style={{ textAlign: 'center', }}>Outer wear</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={{ flex: 3, borderWidth: 1, }}>
                                {/* underlayer */}

                                {underlayerPickerVisible ?
                                    <>
                                        <Text>Underlayer Types</Text>
                                        <ScrollView
                                            horizontal
                                            showsVerticalScrollIndicator={false}
                                            showsHorizontalScrollIndicator={true}
                                            style={{ marginBottom: 10, }}>
                                            <FlatList
                                                style={{}}
                                                scrollEnabled={false}
                                                numColumns={Math.ceil(underlayer_types(THUMBNAIL_SIZE, THUMBNAIL_COLOR).length / 2)}
                                                //horizontal={true}
                                                data={underlayer_types(THUMBNAIL_SIZE, THUMBNAIL_COLOR)}
                                                showsHorizontalScrollIndicator={false}
                                                keyExtractor={(item) => item.id}
                                                renderItem={({ item, index }) => {
                                                    return (<View>
                                                        <TouchableOpacity
                                                            style={[styles.menuItemDefault,
                                                            {
                                                                borderColor: `rgba(
                                                            ${ITEM_R},
                                                            ${ITEM_G},
                                                            ${ITEM_B},
                                                            ${underlayerIndex == index ? 1.00 : 0.00})`
                                                            }]}
                                                            onPress={() => {
                                                                setUnderlayerIndex(index)
                                                                updateUnowned(setUnownedUnder, unownedUnder,
                                                                    item.id, item.owned, item.cost)
                                                            }}>
                                                            {item.svg}
                                                            {!item.owned ?
                                                                <Text style={{ position: 'absolute' }}>Locked</Text>
                                                                : null}

                                                        </TouchableOpacity>
                                                    </View>
                                                    )
                                                }}
                                            />
                                        </ScrollView>
                                        <Text>Underlayer Colors</Text>
                                        <ScrollView
                                            horizontal
                                            showsVerticalScrollIndicator={false}
                                            showsHorizontalScrollIndicator={true}
                                            style={{}}>
                                            <FlatList
                                                style={{}}
                                                //horizontal={true}
                                                scrollEnabled={false}
                                                numColumns={Math.ceil(underlayer_colors.length / 2)}
                                                data={underlayer_colors}
                                                showsHorizontalScrollIndicator={false}
                                                keyExtractor={(item) => item.id}
                                                renderItem={({ item, index }) => {
                                                    return (<View>
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                setUnderlayerColorIndex(index)
                                                            }}>
                                                            <View style={{
                                                                width: 50, height: 50, borderRadius: 100, margin: 2, backgroundColor: item.hex,
                                                                borderWidth: 2,
                                                                borderColor: `rgba(
                                                        ${ITEM_R},
                                                        ${ITEM_G},
                                                        ${ITEM_B},
                                                        ${underlayerColorIndex == index ? 1.00 : 0.00})`
                                                            }} />

                                                        </TouchableOpacity>
                                                    </View>
                                                    )
                                                }}
                                            /></ScrollView>
                                    </> : null}

                                {/* top layer */}
                                {topPickerVisible ?
                                    <>
                                        <Text>Top Types</Text>
                                        <FlatList
                                            style={{}}
                                            horizontal={true}
                                            data={no_item(THUMBNAIL_SIZE, THUMBNAIL_COLOR).concat(
                                                top_types(THUMBNAIL_SIZE, THUMBNAIL_COLOR))}
                                            showsHorizontalScrollIndicator={false}
                                            keyExtractor={(item) => item.id}
                                            renderItem={({ item, index }) => {
                                                return (<View>
                                                    <TouchableOpacity
                                                        style={[styles.menuItemDefault,
                                                        {
                                                            borderColor: `rgba(
                                                            ${ITEM_R},
                                                            ${ITEM_G},
                                                            ${ITEM_B},
                                                            ${(topIndex == index - 1 && index > 0 && hasTop)
                                                                    || !hasTop && index == 0 ? 1.00 : 0.00})`
                                                        }]}
                                                        onPress={() => {

                                                            setHasTop(index > 0)
                                                            if (index > 0) {
                                                                setTopIndex(index - 1)
                                                            }
                                                        }}>
                                                        {item.svg}

                                                    </TouchableOpacity>
                                                </View>
                                                )
                                            }}
                                        />
                                        <Text>Top Colors</Text>
                                        <ScrollView
                                            horizontal
                                            showsVerticalScrollIndicator={false}
                                            showsHorizontalScrollIndicator={true}
                                            style={{}}>
                                            <FlatList
                                                style={{}}
                                                //horizontal={true}
                                                scrollEnabled={false}
                                                numColumns={Math.ceil(underlayer_colors.length / 2)}
                                                data={underlayer_colors}
                                                showsHorizontalScrollIndicator={false}
                                                keyExtractor={(item) => item.id}
                                                renderItem={({ item, index }) => {
                                                    return (<View>
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                setTopColorIndex(index)
                                                            }}>
                                                            <View style={{
                                                                width: 50, height: 50, borderRadius: 100, margin: 2, backgroundColor: item.hex,
                                                                borderWidth: 2,
                                                                borderColor: `rgba(
                                                        ${ITEM_R},
                                                        ${ITEM_G},
                                                        ${ITEM_B},
                                                        ${topColorIndex == index ? 1.00 : 0.00})`
                                                            }} />

                                                        </TouchableOpacity>
                                                    </View>
                                                    )
                                                }}
                                            /></ScrollView>
                                    </> : null}

                                {/* outerwear */}
                                {outerwearPickerVisible ?
                                    <>
                                        <Text>Outerwear Types</Text>
                                        <FlatList
                                            style={{}}
                                            horizontal={true}
                                            data={no_item(THUMBNAIL_SIZE, THUMBNAIL_COLOR).concat(
                                                outerwear_types(THUMBNAIL_SIZE, THUMBNAIL_COLOR))}
                                            showsHorizontalScrollIndicator={false}
                                            keyExtractor={(item) => item.id}
                                            renderItem={({ item, index }) => {
                                                return (<View>
                                                    <TouchableOpacity
                                                        style={[styles.menuItemDefault,
                                                        {
                                                            borderColor: `rgba(
                                                            ${ITEM_R},
                                                            ${ITEM_G},
                                                            ${ITEM_B},
                                                            ${(outerwearIndex == index - 1 && index > 0 && hasOuterwear)
                                                                    || !hasOuterwear && index == 0 ? 1.00 : 0.00})`
                                                        }]}
                                                        onPress={() => {
                                                            setHasOuterwear(index > 0)
                                                            if (index > 0) {
                                                                setOuterwearIndex(index - 1)
                                                            }
                                                        }}>
                                                        {item.svg}

                                                    </TouchableOpacity>
                                                </View>
                                                )
                                            }}
                                        />
                                        <Text>Outerwear Colors</Text>
                                        <ScrollView
                                            horizontal
                                            showsVerticalScrollIndicator={false}
                                            showsHorizontalScrollIndicator={true}
                                            style={{}}>
                                            <FlatList
                                                style={{}}
                                                //horizontal={true}
                                                scrollEnabled={false}
                                                numColumns={Math.ceil(underlayer_colors.length / 2)}
                                                data={underlayer_colors}
                                                showsHorizontalScrollIndicator={false}
                                                keyExtractor={(item) => item.id}
                                                renderItem={({ item, index }) => {
                                                    return (<View>
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                setOuterwearColorIndex(index)
                                                            }}>
                                                            <View style={{
                                                                width: 50, height: 50, borderRadius: 100, margin: 2, backgroundColor: item.hex,
                                                                borderWidth: 2,
                                                                borderColor: `rgba(
                                                        ${ITEM_R},
                                                        ${ITEM_G},
                                                        ${ITEM_B},
                                                        ${outerwearColorIndex == index ? 1.00 : 0.00})`
                                                            }} />

                                                        </TouchableOpacity>
                                                    </View>
                                                    )
                                                }}
                                            /></ScrollView>
                                    </> : null}
                            </View>
                        </View>

                    </View>
                    : null}

                {activeMenu == 3 ?
                    <View>

                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1, borderWidth: 1, }}>
                                <TouchableOpacity
                                    style={hairPickerVisible ? [styles.itemSelectorActive] :
                                        styles.itemSelector}
                                    onPress={() => {
                                        setHairPickerVisible(true)
                                        setHairFrontPickerVisible(false)
                                        setHairBackPickerVisible(false)
                                        setHairSidePickerVisible(false)
                                    }}>
                                    <Text style={{ textAlign: 'center', }}>Hair base</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={hairFrontPickerVisible ? [styles.itemSelectorActive] :
                                        styles.itemSelector}
                                    onPress={() => {
                                        setHairPickerVisible(false)
                                        setHairFrontPickerVisible(true)
                                        setHairBackPickerVisible(false)
                                        setHairSidePickerVisible(false)
                                    }}>
                                    <Text style={{ textAlign: 'center', }}>Hair front</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={hairBackPickerVisible ? [styles.itemSelectorActive] :
                                        styles.itemSelector}
                                    onPress={() => {
                                        setHairPickerVisible(false)
                                        setHairFrontPickerVisible(false)
                                        setHairBackPickerVisible(true)
                                        setHairSidePickerVisible(false)
                                    }}>
                                    <Text style={{ textAlign: 'center', }}>Hair back</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={hairSidePickerVisible ? [styles.itemSelectorActive] :
                                        styles.itemSelector}
                                    onPress={() => {
                                        setHairPickerVisible(false)
                                        setHairFrontPickerVisible(false)
                                        setHairBackPickerVisible(false)
                                        setHairSidePickerVisible(true)
                                    }}>
                                    <Text style={{ textAlign: 'center', }}>Hair side</Text>
                                </TouchableOpacity>

                            </View>
                            <View style={{ flex: 3, borderWidth: 1, }}>

                                {/* hair base */}
                                {hairPickerVisible ?
                                    <>
                                        <Text>Hair Base Types</Text>
                                        <FlatList
                                            style={{}}
                                            horizontal={true}
                                            data={DIR.hairTypes}
                                            showsHorizontalScrollIndicator={false}
                                            keyExtractor={(item) => item}
                                            renderItem={({ item, index }) => {
                                                return (<View>
                                                    <TouchableOpacity
                                                        style={[styles.menuItemDefault,
                                                        {
                                                            borderColor: `rgba(
                                                            ${ITEM_R},
                                                            ${ITEM_G},
                                                            ${ITEM_B},
                                                            ${hairIndex == index ? 1.00 : 0.00})`
                                                        }]}
                                                        onPress={() => {
                                                            setHairIndex(index)
                                                        }}>
                                                        <Image
                                                            style={{ width: THUMBNAIL_SIZE, height: THUMBNAIL_SIZE }}
                                                            source={item[0]} />

                                                    </TouchableOpacity>
                                                </View>
                                                )
                                            }}
                                        />
                                        <Text>Hair Colors</Text>
                                        <ScrollView
                                            horizontal
                                            showsVerticalScrollIndicator={false}
                                            showsHorizontalScrollIndicator={true}
                                            style={{}}>
                                            <FlatList
                                                style={{}}
                                                //horizontal={true}
                                                scrollEnabled={false}
                                                numColumns={Math.ceil(hair_colors.length / 2)}
                                                data={hair_colors}
                                                showsHorizontalScrollIndicator={false}
                                                keyExtractor={(item) => item.id}
                                                renderItem={({ item, index }) => {
                                                    return (<View>
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                setHairColorIndex(index)
                                                            }}>
                                                            <View style={{
                                                                width: 50, height: 50, borderRadius: 100, margin: 2, backgroundColor: item.hex,
                                                                borderWidth: 2,
                                                                borderColor: `rgba(
                                                        ${ITEM_R},
                                                        ${ITEM_G},
                                                        ${ITEM_B},
                                                        ${hairColorIndex == index ? 1.00 : 0.00})`
                                                            }} />

                                                        </TouchableOpacity>
                                                    </View>
                                                    )
                                                }}
                                            /></ScrollView>
                                    </> : null}
                                {/* hair front */}
                                {hairFrontPickerVisible ?
                                    <>
                                        <Text>Hair Front Types</Text>
                                        <FlatList
                                            style={{}}
                                            horizontal={true}
                                            data={no_item(THUMBNAIL_SIZE, THUMBNAIL_COLOR).concat(
                                                hair_front_types(THUMBNAIL_SIZE, THUMBNAIL_COLOR))}
                                            showsHorizontalScrollIndicator={false}
                                            keyExtractor={(item) => item.id}
                                            renderItem={({ item, index }) => {
                                                return (<View>
                                                    <TouchableOpacity
                                                        style={[styles.menuItemDefault,
                                                        {
                                                            borderColor: `rgba(
                                                                ${ITEM_R},
                                                                ${ITEM_G},
                                                                ${ITEM_B},
                                                                ${(hairFrontIndex == index - 1 && index > 0 && hasHairFront)
                                                                    || !hasHairFront && index == 0 ? 1.00 : 0.00})`
                                                        }]}
                                                        onPress={() => {
                                                            setHasHairFront(index > 0)
                                                            if (index > 0) {
                                                                setHairFrontIndex(index - 1)
                                                            }
                                                        }}>
                                                        {item.svg}

                                                    </TouchableOpacity>
                                                </View>
                                                )
                                            }}
                                        />
                                        <Text>Hair Colors</Text>
                                        <ScrollView
                                            horizontal
                                            showsVerticalScrollIndicator={false}
                                            showsHorizontalScrollIndicator={true}
                                            style={{}}>
                                            <FlatList
                                                style={{}}
                                                //horizontal={true}
                                                scrollEnabled={false}
                                                numColumns={Math.ceil(hair_colors.length / 2)}
                                                data={hair_colors}
                                                showsHorizontalScrollIndicator={false}
                                                keyExtractor={(item) => item.id}
                                                renderItem={({ item, index }) => {
                                                    return (<View>
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                setHairColorIndex(index)
                                                            }}>
                                                            <View style={{
                                                                width: 50, height: 50, borderRadius: 100, margin: 2, backgroundColor: item.hex,
                                                                borderWidth: 2,
                                                                borderColor: `rgba(
                                                        ${ITEM_R},
                                                        ${ITEM_G},
                                                        ${ITEM_B},
                                                        ${hairColorIndex == index ? 1.00 : 0.00})`
                                                            }} />

                                                        </TouchableOpacity>
                                                    </View>
                                                    )
                                                }}
                                            /></ScrollView>
                                    </> : null}
                                {/* hair back */}
                                {hairBackPickerVisible ?
                                    <>
                                        <Text>Hair Back Types</Text>
                                        <FlatList
                                            style={{}}
                                            horizontal={true}
                                            data={no_item(THUMBNAIL_SIZE, THUMBNAIL_COLOR).concat(
                                                hair_back_types(THUMBNAIL_SIZE, THUMBNAIL_COLOR))}
                                            showsHorizontalScrollIndicator={false}
                                            keyExtractor={(item) => item.id}
                                            renderItem={({ item, index }) => {
                                                return (<View>
                                                    <TouchableOpacity
                                                        style={[styles.menuItemDefault,
                                                        {
                                                            borderColor: `rgba(
                                                            ${ITEM_R},
                                                            ${ITEM_G},
                                                            ${ITEM_B},
                                                            ${(hairBackIndex == index - 1 && index > 0 && hasHairBack)
                                                                    || !hasHairBack && index == 0 ? 1.00 : 0.00})`
                                                        }]}
                                                        onPress={() => {
                                                            setHasHairBack(index > 0)
                                                            if (index > 0) {
                                                                setHairBackIndex(index - 1)
                                                            }
                                                        }}>
                                                        {item.svg}

                                                    </TouchableOpacity>
                                                </View>
                                                )
                                            }}
                                        />
                                        <Text>Hair Colors</Text>
                                        <ScrollView
                                            horizontal
                                            showsVerticalScrollIndicator={false}
                                            showsHorizontalScrollIndicator={true}
                                            style={{}}>
                                            <FlatList
                                                style={{}}
                                                //horizontal={true}
                                                scrollEnabled={false}
                                                numColumns={Math.ceil(hair_colors.length / 2)}
                                                data={hair_colors}
                                                showsHorizontalScrollIndicator={false}
                                                keyExtractor={(item) => item.id}
                                                renderItem={({ item, index }) => {
                                                    return (<View>
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                setHairColorIndex(index)
                                                            }}>
                                                            <View style={{
                                                                width: 50, height: 50, borderRadius: 100, margin: 2, backgroundColor: item.hex,
                                                                borderWidth: 2,
                                                                borderColor: `rgba(
                                                        ${ITEM_R},
                                                        ${ITEM_G},
                                                        ${ITEM_B},
                                                        ${hairColorIndex == index ? 1.00 : 0.00})`
                                                            }} />

                                                        </TouchableOpacity>
                                                    </View>
                                                    )
                                                }}
                                            /></ScrollView>
                                    </> : null}
                                {/* hair side */}
                                {hairSidePickerVisible ?
                                    <>
                                        <Text>Hair Side Types</Text>
                                        <FlatList
                                            style={{}}
                                            horizontal={true}
                                            data={no_item(THUMBNAIL_SIZE, THUMBNAIL_COLOR).concat(
                                                hair_side_types(THUMBNAIL_SIZE, THUMBNAIL_COLOR))}
                                            showsHorizontalScrollIndicator={false}
                                            keyExtractor={(item) => item.id}
                                            renderItem={({ item, index }) => {
                                                return (<View>
                                                    <TouchableOpacity
                                                        style={[styles.menuItemDefault,
                                                        {
                                                            borderColor: `rgba(
                                                                ${ITEM_R},
                                                                ${ITEM_G},
                                                                ${ITEM_B},
                                                                ${(hairSideIndex == index - 1 && index > 0 && hasHairSide)
                                                                    || !hasHairSide && index == 0 ? 1.00 : 0.00})`
                                                        }]}
                                                        onPress={() => {
                                                            setHasHairSide(index > 0)
                                                            if (index > 0) {
                                                                setHairSideIndex(index - 1)
                                                            }
                                                        }}>
                                                        {item.svg}

                                                    </TouchableOpacity>
                                                </View>
                                                )
                                            }}
                                        />
                                        <Text>Hair Colors</Text>
                                        <ScrollView
                                            horizontal
                                            showsVerticalScrollIndicator={false}
                                            showsHorizontalScrollIndicator={true}
                                            style={{}}>
                                            <FlatList
                                                style={{}}
                                                //horizontal={true}
                                                scrollEnabled={false}
                                                numColumns={Math.ceil(hair_colors.length / 2)}
                                                data={hair_colors}
                                                showsHorizontalScrollIndicator={false}
                                                keyExtractor={(item) => item.id}
                                                renderItem={({ item, index }) => {
                                                    return (<View>
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                setHairColorIndex(index)
                                                            }}>
                                                            <View style={{
                                                                width: 50, height: 50, borderRadius: 100, margin: 2, backgroundColor: item.hex,
                                                                borderWidth: 2,
                                                                borderColor: `rgba(
                                                        ${ITEM_R},
                                                        ${ITEM_G},
                                                        ${ITEM_B},
                                                        ${hairColorIndex == index ? 1.00 : 0.00})`
                                                            }} />

                                                        </TouchableOpacity>
                                                    </View>
                                                    )
                                                }}
                                            /></ScrollView>
                                    </> : null}

                            </View>

                        </View>
                    </View>
                    : null}
            </View>

            <View style={{ flex: 1, flexDirection: 'row' }}>
                <View style={{ flex: 1 }}></View>
                <View style={{ flex: 2, }}
                    opacity={isLoading ? 0.3 : 1}>
                    <TouchableOpacity
                        style={{
                            justifyContent: 'center', marginVertical: 20,
                            paddingVertical: 10, borderRadius: 5, backgroundColor: '#ABC57E'
                        }}
                        disabled={isLoading}
                        onPress={() => {
                            if (!isLoading) {
                                saveAvatarEntry()
                            }

                        }}>
                        {totalUnowned > 0 ?
                            <Text style={{ textAlign: 'center', }}>Redeem and Save Avatar</Text> :
                            <Text style={{ textAlign: 'center', }}>Save Avatar</Text>}
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1 }}></View>

            </View>
            {isLoading ?
                <ActivityIndicator size="large" color="gray" /> : null}

            <Header
                navigation={navigation}
                header={'#67806D'} />
        </>

    )
}

SvgTestScreen.navigationOptions = () => {
    return {
        headerShown: false,
    };
}

const styles = StyleSheet.create({
    title: {
        margin: 30,
        fontSize: 40,
    },
    itemSelector: {
        borderWidth: 1, padding: 5, borderRadius: 10, marginHorizontal: 10, marginVertical: 5,
    },
    itemSelectorActive: {
        borderWidth: 1, padding: 5, borderRadius: 10, marginHorizontal: 10, marginVertical: 5,
        backgroundColor: 'pink',
    },
    menuItemDefault: {
        margin: 2, borderWidth: 2,
    },
    itemSelectorNew: {
        backgroundColor: '#E6F4DB', alignItems: 'center',
    },
    itemSelectorNewActive: {
        alignItems: 'center',
        backgroundColor: '#CAE3B7',
    }
})

export default SvgTestScreen;