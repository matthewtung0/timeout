import React, { useState, useContext, useEffect, useCallback } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, ActivityIndicator, Alert, Dimensions } from 'react-native';
import * as DIR from '../components/AvatarSelection';
import { Icon } from 'react-native-elements'
import { useFocusEffect } from '@react-navigation/native';
import { Context as UserContext } from '../context/userContext';
import Header from '../components/Header';
import AvatarMenuComponent from '../components/AvatarMenuComponent';
import AvatarColorMenuComponent from '../components/AvatarColorMenuComponent';
import colorWheelIcon from '../../assets/color_wheel_icon.png';
import hairIconActive from '../../assets/hair_icon_active.png';
import clothesIconInactive from '../../assets/clothes_icon_inactive.png';
import accessoriesIconInactive from '../../assets/accessories_icon_inactive.png';
import backgroundIconInactive from '../../assets/background_icon_inactive.png';
import pointSquares from '../../assets/point_squares.png';


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
    Base1_svg, Base2_svg, Base2_new_svg, Base3_svg, Base4_svg, Base5_svg,
    Eyebrows1_svg, Eyebrows2_svg,
    HairAccessories1_svg,
    Hairback1_svg, Hairback2_svg,
    Bg1_svg, Bg1_1_svg, Bg1_2_svg, Bg1_3_svg, Bg1_4_svg, Bg1_5_svg,
    Bg2_svg, Bg2_1_svg, Bg3_svg, Bg4_svg, Bg5_svg, Bg6_svg, Bg7_svg, Bg8_svg, Bg9_svg, Bg10_svg,
    NoItem1_svg,
} from '../components/AvatarSelection2';
import { color } from 'react-native-reanimated';



const SvgTestScreen = ({ navigation }) => {
    const { height, width } = Dimensions.get('window');
    const THUMBNAIL_SIZE = width / 8;
    const AVATAR_SIZE = 250;
    const THUMBNAIL_COLOR = "#000000";
    const ITEM_R = 52;
    const ITEM_G = 52;
    const ITEM_B = 52;
    const [isLoading, setIsLoading] = useState(false)
    const [activeMenu, setActiveMenu] = useState(0)
    const [colorMenuActive, setColorMenuActive] = useState(false)
    const { state, saveAvatar2, fetchAvatarItemsOwned } = useContext(UserContext)

    const toggleColorMenuActive = () => {
        setColorMenuActive(!colorMenuActive);
    }

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
            svg: <Base2_new_svg
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
        console.log("Setting total unowned from useEffect")
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

    console.log("total unowned: ", totalUnowned)

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
                    <View style={{ position: 'absolute' }}>
                        {base_types(AVATAR_SIZE, mouth_colors[0].hex)[baseIndex].svg}
                    </View>
                    {/*<Image
                        style={{ width: AVATAR_SIZE, height: AVATAR_SIZE, position: 'absolute', }}
                        source={DIR.baseTypes[baseIndex][0]} />*/}

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
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 5, }}>
                {totalUnowned > 0 ?
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[styles.textDefault, { color: '#67806D' }]}>Total cost: {totalUnowned} points</Text>
                        <Image
                            style={{ width: 20, height: 20, marginLeft: 10, }}
                            source={pointSquares} />
                    </View>
                    :
                    <View style={{ flexDirection: 'row', opacity: 0, }}>
                        <Text style={[styles.textDefault, { color: '#67806D' }]}>Total cost: {totalUnowned} points</Text>
                        <Image
                            style={{ width: 20, height: 20, marginLeft: 10, }}
                            source={pointSquares} />
                    </View>
                }
            </View>


            <View style={{ flex: 3, }}>

                {colorMenuActive ?
                    <View>
                        <View style={{ flex: 1, backgroundColor: '#CAE3B7', }} />
                        {/*<TouchableOpacity
                            style={{
                                backgroundColor: '#A7BEAD', width: 40, height: 40, borderRadius: 25,
                                justifyContent: 'center', alignItems: 'center',
                            }}
                        onPress={() => { toggleColorMenuActive() }}><Text>X</Text></TouchableOpacity>*/}
                    </View>
                    :
                    <View style={{ flex: 0.2, flexDirection: 'row', justifyContent: 'space-around' }}>
                        <TouchableOpacity style={[activeMenu == 0 ? styles.itemSelectorNewActive :
                            styles.itemSelectorNew, { width: width / 4 }]} onPress={() => { setActiveMenu(0) }}>
                            <View style={{
                                paddingVertical: 0, justifyContent: 'center', alignItems: 'center',
                                alignContent: 'center'
                            }}>
                                <Image
                                    style={{ height: 40, }}
                                    resizeMode="contain"
                                    source={hairIconActive} />
                            </View>

                        </TouchableOpacity>
                        <TouchableOpacity style={[activeMenu == 1 ? styles.itemSelectorNewActive :
                            styles.itemSelectorNew, { width: width / 4 }]} onPress={() => { setActiveMenu(1) }}>
                            <View style={{
                                paddingVertical: 0, justifyContent: 'center', alignItems: 'center',
                                alignContent: 'center'
                            }}>
                                <Image
                                    style={{ height: 40, }}
                                    resizeMode="contain"
                                    source={clothesIconInactive} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={[activeMenu == 2 ? styles.itemSelectorNewActive :
                            styles.itemSelectorNew, { width: width / 4 }]} onPress={() => { setActiveMenu(2) }}>
                            <View style={{
                                paddingVertical: 0, justifyContent: 'center', alignItems: 'center',
                                alignContent: 'center'
                            }}>
                                <Image
                                    style={{ height: 40, }}
                                    resizeMode="contain"
                                    source={accessoriesIconInactive} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={[activeMenu == 3 ? styles.itemSelectorNewActive :
                            styles.itemSelectorNew, { width: width / 4 }]} onPress={() => { setActiveMenu(3) }}>
                            <View style={{
                                paddingVertical: 0, justifyContent: 'center', alignItems: 'center',
                                alignContent: 'center'
                            }}>
                                <Image
                                    style={{ height: 40, }}
                                    resizeMode="contain"
                                    source={backgroundIconInactive} />
                            </View>
                        </TouchableOpacity>
                    </View>
                }

                {activeMenu == 0 ?
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'column', flex: 1, }}>
                            {!colorMenuActive ?
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 10, }}>
                                    <TouchableOpacity style={{ marginHorizontal: 5, borderWidth: 1, }}
                                        onPress={() => {
                                            if (eyePickerVisible) {
                                                setEyePickerVisible(false)
                                                setSkinPickerVisible(true)
                                            } else if (mouthPickerVisible) {
                                                setMouthPickerVisible(false)
                                                setEyePickerVisible(true)
                                            } else if (eyeMakeupPickerVisible) {
                                                setEyeMakeupPickerVisible(false)
                                                setMouthPickerVisible(true)
                                            } else if (eyebrowPickerVisible) {
                                                setEyebrowPickerVisible(false)
                                                setEyeMakeupPickerVisible(true)
                                            }
                                        }}>
                                        <Icon
                                            name='caret-back'
                                            size={20}
                                            type='ionicon'
                                            color='#B3B2B3' />
                                    </TouchableOpacity>

                                    <View
                                        style={skinPickerVisible ? [styles.subItemSelectorActive] :
                                            styles.subItemSelector}>

                                    </View>
                                    <View
                                        style={eyePickerVisible ? [styles.subItemSelectorActive] :
                                            styles.subItemSelector}>

                                    </View>
                                    <View
                                        style={mouthPickerVisible ? [styles.subItemSelectorActive] :
                                            styles.subItemSelector}>

                                    </View>
                                    <View
                                        style={eyeMakeupPickerVisible ? [styles.subItemSelectorActive] :
                                            styles.subItemSelector}>

                                    </View>
                                    <View
                                        style={eyebrowPickerVisible ? [styles.subItemSelectorActive] :
                                            styles.subItemSelector}>

                                    </View>
                                    <TouchableOpacity
                                        onPress={() => {
                                            if (skinPickerVisible) {
                                                setSkinPickerVisible(false)
                                                setEyePickerVisible(true)
                                            } else if (eyePickerVisible) {
                                                setEyePickerVisible(false)
                                                setMouthPickerVisible(true)
                                            } else if (mouthPickerVisible) {
                                                setMouthPickerVisible(false)
                                                setEyeMakeupPickerVisible(true)
                                            } else if (eyeMakeupPickerVisible) {
                                                setEyeMakeupPickerVisible(false)
                                                setEyebrowPickerVisible(true)
                                            }
                                        }}
                                        style={{ marginHorizontal: 5, borderWidth: 1, }}>
                                        <Icon
                                            name='caret-forward'
                                            size={20}
                                            type='ionicon'
                                            color='#B3B2B3' />
                                    </TouchableOpacity>

                                </View>
                                : null}

                            <View style={{ flex: 1, }}>

                                {/* skin */}
                                {skinPickerVisible ?
                                    <>
                                        {!colorMenuActive ?
                                            <AvatarMenuComponent
                                                title={"Skin tone"}
                                                //data={DIR.baseTypes}
                                                data={base_types(THUMBNAIL_SIZE, THUMBNAIL_COLOR)}
                                                noItemOption={false}
                                                //pngOption={true}
                                                pngOption={false}
                                                thumbnailSize={THUMBNAIL_SIZE}
                                                setIndexCallback={setBaseIndex}
                                                itemIndex={baseIndex}
                                                updateUnownedCallback={updateUnowned}
                                                unownedIndex={unownedBase}
                                                setUnownedCallback={setUnownedBase}
                                            />
                                            : null}
                                    </>
                                    : null}

                                {/* eyes */}
                                {eyePickerVisible ?
                                    <>
                                        {!colorMenuActive ?
                                            <AvatarMenuComponent
                                                title={"Eyes"}
                                                data={DIR.eyeTypes}
                                                noItemOption={false}
                                                pngOption={true}
                                                thumbnailSize={THUMBNAIL_SIZE}
                                                //hasItem={}
                                                //setHasItemCallback={}
                                                setIndexCallback={setEyeIndex}
                                                itemIndex={eyeIndex}
                                                updateUnownedCallback={updateUnowned}
                                                unownedIndex={unownedEyes}
                                                setUnownedCallback={setUnownedEyes}
                                            />
                                            :
                                            <AvatarColorMenuComponent
                                                title={"Eye Colors"}
                                                usesPng={true}
                                                data={DIR.eyeColors}
                                                setIndexCallback={setEyeColorIndex}
                                                colorIndex={eyeColorIndex}
                                            />
                                        }
                                    </>
                                    : null}

                                {/* mouth */}
                                {mouthPickerVisible ? <>
                                    {!colorMenuActive ?
                                        <AvatarMenuComponent
                                            title={"Mouth"}
                                            data={mouth_types(THUMBNAIL_SIZE, THUMBNAIL_COLOR)}
                                            noItemOption={false}
                                            pngOption={false}
                                            thumbnailSize={THUMBNAIL_SIZE}
                                            //hasItem={}
                                            //setHasItemCallback={}
                                            setIndexCallback={setMouthIndex}
                                            itemIndex={mouthIndex}
                                            updateUnownedCallback={updateUnowned}
                                            unownedIndex={unownedMouth}
                                            setUnownedCallback={setUnownedMouth}
                                        />
                                        :
                                        <AvatarColorMenuComponent
                                            title={"Mouth Colors"}
                                            usesPng={false}
                                            data={mouth_colors}
                                            setIndexCallback={setMouthColorIndex}
                                            colorIndex={mouthColorIndex}
                                        />
                                    }
                                </>
                                    : null}

                                {/* eye makeup */}
                                {eyeMakeupPickerVisible ?
                                    <>
                                        {!colorMenuActive ?
                                            <AvatarMenuComponent
                                                title={"Eye Makeup"}
                                                data={no_item(THUMBNAIL_SIZE, THUMBNAIL_COLOR).concat(
                                                    eye_makeup_types(THUMBNAIL_SIZE, THUMBNAIL_COLOR))}
                                                noItemOption={true}
                                                pngOption={false}
                                                thumbnailSize={THUMBNAIL_SIZE}
                                                hasItem={hasEyeMakeup}
                                                setHasItemCallback={setHasEyeMakeup}
                                                setIndexCallback={setEyeMakeupIndex}
                                                itemIndex={eyeMakeupIndex}
                                                updateUnownedCallback={updateUnowned}
                                                unownedIndex={unownedMakeup}
                                                setUnownedCallback={setUnownedMakeup}
                                            />
                                            :
                                            <AvatarColorMenuComponent
                                                title={"Eye Makeup Colors"}
                                                usesPng={false}
                                                data={eye_makeup_colors}
                                                setIndexCallback={setEyeMakeupColorIndex}
                                                colorIndex={eyeMakeupColorIndex}
                                            />
                                        }
                                    </> : null}


                                {/* Eyebrows */}
                                {eyebrowPickerVisible ?
                                    <>
                                        {!colorMenuActive ?
                                            <AvatarMenuComponent
                                                title={"Eyebrows"}
                                                data={eyebrow_types(THUMBNAIL_SIZE, THUMBNAIL_COLOR)}
                                                noItemOption={false}
                                                pngOption={false}
                                                thumbnailSize={THUMBNAIL_SIZE}
                                                //hasItem={}
                                                //setHasItemCallback={}
                                                setIndexCallback={setEyebrowIndex}
                                                itemIndex={eyebrowIndex}
                                                updateUnownedCallback={updateUnowned}
                                                unownedIndex={unownedEyebrows}
                                                setUnownedCallback={setUnownedEyebrows}
                                            />
                                            :
                                            <AvatarColorMenuComponent
                                                title={"Eyebrow Colors"}
                                                usesPng={false}
                                                data={eye_makeup_colors}
                                                setIndexCallback={setEyebrowColorIndex}
                                                colorIndex={eyebrowColorIndex}
                                            />
                                        }
                                    </> : null}

                            </View>
                        </View>
                    </View>
                    : null}

                {activeMenu == 1 ?
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'column', flex: 1, }}>
                            {!colorMenuActive ?
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 10, }}>
                                    <TouchableOpacity style={{ marginHorizontal: 5, borderWidth: 1, }}
                                        onPress={() => {
                                            if (accessoriesPickerVisible) {
                                                setAccessoriesPickerVisible(false)
                                                setHairAccessoriesPickerVisible(true)
                                            } else if (piercingPickerVisible) {
                                                setPiercingPickerVisible(false)
                                                setAccessoriesPickerVisible(true)
                                            } else if (glassesPickerVisible) {
                                                setGlassesPickerVisible(false)
                                                setPiercingPickerVisible(true)
                                            } else if (backgroundPickerVisible) {
                                                setBackgroundPickerVisible(false)
                                                setGlassesPickerVisible(true)
                                            }
                                        }}>
                                        <Icon
                                            name='caret-back'
                                            size={20}
                                            type='ionicon'
                                            color='#B3B2B3' />
                                    </TouchableOpacity>

                                    <View
                                        style={hairAccessoriesPickerVisible ? [styles.subItemSelectorActive] :
                                            styles.subItemSelector}>

                                    </View>
                                    <View
                                        style={accessoriesPickerVisible ? [styles.subItemSelectorActive] :
                                            styles.subItemSelector}>

                                    </View>
                                    <View
                                        style={piercingPickerVisible ? [styles.subItemSelectorActive] :
                                            styles.subItemSelector}>

                                    </View>
                                    <View
                                        style={glassesPickerVisible ? [styles.subItemSelectorActive] :
                                            styles.subItemSelector}>

                                    </View>
                                    <View
                                        style={backgroundPickerVisible ? [styles.subItemSelectorActive] :
                                            styles.subItemSelector}>

                                    </View>
                                    <TouchableOpacity
                                        onPress={() => {
                                            if (glassesPickerVisible) {
                                                setGlassesPickerVisible(false)
                                                setBackgroundPickerVisible(true)
                                            } else if (piercingPickerVisible) {
                                                setPiercingPickerVisible(false)
                                                setGlassesPickerVisible(true)
                                            } else if (accessoriesPickerVisible) {
                                                setAccessoriesPickerVisible(false)
                                                setPiercingPickerVisible(true)
                                            } else if (hairAccessoriesPickerVisible) {
                                                setHairAccessoriesPickerVisible(false)
                                                setAccessoriesPickerVisible(true)
                                            }
                                        }}
                                        style={{ marginHorizontal: 5, borderWidth: 1, }}>
                                        <Icon
                                            name='caret-forward'
                                            size={20}
                                            type='ionicon'
                                            color='#B3B2B3' />
                                    </TouchableOpacity>

                                </View>
                                : null}

                            <View style={{ flex: 1, }}>
                                {/* hair accessories */}
                                {hairAccessoriesPickerVisible ? <>
                                    {!colorMenuActive ?
                                        <AvatarMenuComponent
                                            title={"Hair Accessories"}
                                            data={no_item(THUMBNAIL_SIZE, THUMBNAIL_COLOR).concat(
                                                hair_accessories_types(THUMBNAIL_SIZE, THUMBNAIL_COLOR))}
                                            noItemOption={true}
                                            hasItem={hasHairAccessories}
                                            setHasItemCallback={setHasHairAccessories}
                                            setIndexCallback={setHairAccessoriesIndex}
                                            itemIndex={hairAccessoriesIndex}
                                            updateUnownedCallback={updateUnowned}
                                            unownedIndex={unownedHairAccessories}
                                            setUnownedCallback={setUnownedHairAccessories}
                                        />
                                        :
                                        <AvatarColorMenuComponent
                                            title={"Hair Accessory Colors"}
                                            usesPng={false}
                                            data={underlayer_colors}
                                            setIndexCallback={setHairAccessoriesColorIndex}
                                            colorIndex={hairAccessoriesColorIndex}
                                        />
                                    }


                                </> : null}

                                {/* accessories */}
                                {accessoriesPickerVisible ?
                                    <>
                                        <AvatarMenuComponent
                                            title={"General Accessories"}
                                            data={no_item(THUMBNAIL_SIZE, THUMBNAIL_COLOR).concat(
                                                accessories_types(THUMBNAIL_SIZE, THUMBNAIL_COLOR))}
                                            noItemOption={true}
                                            hasItem={hasAccessories}
                                            setHasItemCallback={setHasAccessories}
                                            setIndexCallback={setAccessoriesIndex}
                                            itemIndex={accessoriesIndex}
                                            updateUnownedCallback={updateUnowned}
                                            unownedIndex={unownedGenAccessories}
                                            setUnownedCallback={setUnownedGenAccessories}
                                        />
                                    </>
                                    : null}
                                {/* background */}
                                {backgroundPickerVisible ?
                                    <>
                                        <AvatarMenuComponent
                                            title={"Background"}
                                            data={bg_types(THUMBNAIL_SIZE, THUMBNAIL_COLOR)}
                                            //hasItemCallback={}
                                            setIndexCallback={setBackgroundIndex}
                                            itemIndex={backgroundIndex}
                                            updateUnownedCallback={updateUnowned}
                                            unownedIndex={unownedBackground}
                                            setUnownedCallback={setUnownedBackground}
                                        />
                                    </>
                                    : null}

                                {piercingPickerVisible ? <>
                                    {!colorMenuActive ?
                                        <AvatarMenuComponent
                                            title={"Piercings"}
                                            data={no_item(THUMBNAIL_SIZE, THUMBNAIL_COLOR).concat(
                                                piercing_types(THUMBNAIL_SIZE, THUMBNAIL_COLOR))}
                                            noItemOption={true}
                                            hasItem={hasPiercings}
                                            setHasItemCallback={setHasPiercings}
                                            setIndexCallback={setPiercingIndex}
                                            itemIndex={piercingIndex}
                                            updateUnownedCallback={updateUnowned}
                                            unownedIndex={unownedPiercings}
                                            setUnownedCallback={setUnownedPiercings}
                                        />
                                        :
                                        <AvatarColorMenuComponent
                                            title={"Piercing Colors"}
                                            usesPng={false}
                                            data={piercing_colors}
                                            setIndexCallback={setPiercingColorIndex}
                                            colorIndex={piercingColorIndex}
                                        />
                                    }
                                </> : null}

                                {glassesPickerVisible ? <>
                                    {!colorMenuActive ?
                                        <AvatarMenuComponent
                                            title={"Glasses"}
                                            data={no_item(THUMBNAIL_SIZE, THUMBNAIL_COLOR).concat(
                                                DIR.glassesTypes)}
                                            noItemOption={true}
                                            pngOption={true}
                                            thumbnailSize={THUMBNAIL_SIZE}
                                            hasItem={hasGlasses}
                                            setHasItemCallback={setHasGlasses}
                                            setIndexCallback={setGlassesIndex}
                                            itemIndex={glassesIndex}
                                            updateUnownedCallback={updateUnowned}
                                            unownedIndex={unownedGlasses}
                                            setUnownedCallback={setUnownedGlasses}
                                        />
                                        :
                                        <AvatarColorMenuComponent
                                            title={"Glasses Colors"}
                                            usesPng={false}
                                            data={piercing_colors}
                                            setIndexCallback={setGlassesColorIndex}
                                            colorIndex={glassesColorIndex}
                                        />
                                    }
                                </> : null}
                            </View>
                        </View>
                    </View>
                    : null}

                {activeMenu == 2 ?
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'column', flex: 1, }}>
                            {!colorMenuActive ?
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 10, }}>
                                    <TouchableOpacity style={{ marginHorizontal: 5, borderWidth: 1, }}
                                        onPress={() => {
                                            if (topPickerVisible) {
                                                setTopPickerVisible(false)
                                                setUnderlayerPickerVisible(true)
                                            } else if (outerwearPickerVisible) {
                                                setOuterwearlayerPickerVisible(false)
                                                setTopPickerVisible(true)
                                            }
                                        }}>
                                        <Icon
                                            name='caret-back'
                                            size={20}
                                            type='ionicon'
                                            color='#B3B2B3' />
                                    </TouchableOpacity>

                                    <View
                                        style={underlayerPickerVisible ? [styles.subItemSelectorActive] :
                                            styles.subItemSelector}>

                                    </View>
                                    <View
                                        style={topPickerVisible ? [styles.subItemSelectorActive] :
                                            styles.subItemSelector}>

                                    </View>
                                    <View
                                        style={outerwearPickerVisible ? [styles.subItemSelectorActive] :
                                            styles.subItemSelector}>

                                    </View>
                                    <TouchableOpacity
                                        onPress={() => {
                                            if (underlayerPickerVisible) {
                                                setUnderlayerPickerVisible(false)
                                                setTopPickerVisible(true)
                                            } else if (topPickerVisible) {
                                                setTopPickerVisible(false)
                                                setOuterwearlayerPickerVisible(true)
                                            }
                                        }}
                                        style={{ marginHorizontal: 5, borderWidth: 1, }}>
                                        <Icon
                                            name='caret-forward'
                                            size={20}
                                            type='ionicon'
                                            color='#B3B2B3' />
                                    </TouchableOpacity>

                                </View>
                                : null}

                            <View style={{ flex: 1, }}>
                                {/* underlayer */}

                                {underlayerPickerVisible ?
                                    <>
                                        {!colorMenuActive ?
                                            <AvatarMenuComponent
                                                title={"Underlayer"}
                                                data={underlayer_types(THUMBNAIL_SIZE, THUMBNAIL_COLOR)}
                                                noItemOption={false}
                                                pngOption={false}
                                                thumbnailSize={THUMBNAIL_SIZE}
                                                //hasItem={}
                                                //setHasItemCallback={}
                                                setIndexCallback={setUnderlayerIndex}
                                                itemIndex={underlayerIndex}
                                                updateUnownedCallback={updateUnowned}
                                                unownedIndex={unownedUnder}
                                                setUnownedCallback={setUnownedUnder}
                                            />
                                            :
                                            <AvatarColorMenuComponent
                                                title={"Underlayer Colors"}
                                                usesPng={false}
                                                data={underlayer_colors}
                                                setIndexCallback={setUnderlayerColorIndex}
                                                colorIndex={underlayerColorIndex}
                                            />
                                        }
                                    </> : null}

                                {/* top layer */}
                                {topPickerVisible ?
                                    <>
                                        {!colorMenuActive ?
                                            <AvatarMenuComponent
                                                title={"Tops"}
                                                data={no_item(THUMBNAIL_SIZE, THUMBNAIL_COLOR).concat(
                                                    top_types(THUMBNAIL_SIZE, THUMBNAIL_COLOR))}
                                                noItemOption={true}
                                                pngOption={false}
                                                thumbnailSize={THUMBNAIL_SIZE}
                                                hasItem={hasTop}
                                                setHasItemCallback={setHasTop}
                                                setIndexCallback={setTopIndex}
                                                itemIndex={topIndex}
                                                updateUnownedCallback={updateUnowned}
                                                unownedIndex={unownedTop}
                                                setUnownedCallback={setUnownedTop}
                                            />
                                            :
                                            <AvatarColorMenuComponent
                                                title={"Top Colors"}
                                                usesPng={false}
                                                data={underlayer_colors}
                                                setIndexCallback={setTopColorIndex}
                                                colorIndex={topColorIndex}
                                            />
                                        }
                                    </> : null}

                                {/* outerwear */}
                                {outerwearPickerVisible ?
                                    <>
                                        {!colorMenuActive ?
                                            <AvatarMenuComponent
                                                title={"Outerwear"}
                                                data={no_item(THUMBNAIL_SIZE, THUMBNAIL_COLOR).concat(
                                                    outerwear_types(THUMBNAIL_SIZE, THUMBNAIL_COLOR))}
                                                noItemOption={true}
                                                pngOption={false}
                                                thumbnailSize={THUMBNAIL_SIZE}
                                                hasItem={hasOuterwear}
                                                setHasItemCallback={setHasOuterwear}
                                                setIndexCallback={setOuterwearIndex}
                                                itemIndex={outerwearIndex}
                                                updateUnownedCallback={updateUnowned}
                                                unownedIndex={unownedOuter}
                                                setUnownedCallback={setUnownedOuter}
                                            />
                                            :
                                            <AvatarColorMenuComponent
                                                title={"Outerwear Colors"}
                                                usesPng={false}
                                                data={underlayer_colors}
                                                setIndexCallback={setOuterwearColorIndex}
                                                colorIndex={outerwearColorIndex}
                                            />
                                        }
                                    </> : null}
                            </View>
                        </View>

                    </View>
                    : null}

                {activeMenu == 3 ?
                    <View style={{ flex: 1 }}>

                        <View style={{ flexDirection: 'column', flex: 1, }}>
                            {!colorMenuActive ?
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 10, }}>
                                    <TouchableOpacity style={{ marginHorizontal: 5, borderWidth: 1, }}
                                        onPress={() => {
                                            if (hairFrontPickerVisible) {
                                                setHairFrontPickerVisible(false)
                                                setHairPickerVisible(true)
                                            } else if (hairBackPickerVisible) {
                                                setHairBackPickerVisible(false)
                                                setHairFrontPickerVisible(true)
                                            } else if (hairSidePickerVisible) {
                                                setHairSidePickerVisible(false)
                                                setHairBackPickerVisible(true)
                                            }
                                        }}>
                                        <Icon
                                            name='caret-back'
                                            size={20}
                                            type='ionicon'
                                            color='#B3B2B3' />
                                    </TouchableOpacity>

                                    <View
                                        style={hairPickerVisible ? [styles.subItemSelectorActive] :
                                            styles.subItemSelector}>

                                    </View>
                                    <View
                                        style={hairFrontPickerVisible ? [styles.subItemSelectorActive] :
                                            styles.subItemSelector}>

                                    </View>
                                    <View
                                        style={hairBackPickerVisible ? [styles.subItemSelectorActive] :
                                            styles.subItemSelector}>

                                    </View>
                                    <View
                                        style={hairSidePickerVisible ? [styles.subItemSelectorActive] :
                                            styles.subItemSelector}>

                                    </View>
                                    <TouchableOpacity
                                        onPress={() => {
                                            if (hairPickerVisible) {
                                                setHairPickerVisible(false)
                                                setHairFrontPickerVisible(true)
                                            } else if (hairFrontPickerVisible) {
                                                setHairFrontPickerVisible(false)
                                                setHairBackPickerVisible(true)
                                            } else if (hairBackPickerVisible) {
                                                setHairBackPickerVisible(false)
                                                setHairSidePickerVisible(true)
                                            }
                                        }}
                                        style={{ marginHorizontal: 5, borderWidth: 1, }}>
                                        <Icon
                                            name='caret-forward'
                                            size={20}
                                            type='ionicon'
                                            color='#B3B2B3' />
                                    </TouchableOpacity>
                                </View>
                                : null}

                            <View style={{ flex: 1, }}>

                                {/* hair base */}
                                {hairPickerVisible ?
                                    <>
                                        {!colorMenuActive ?
                                            <AvatarMenuComponent
                                                title={"Hair base"}
                                                data={DIR.hairTypes}
                                                noItemOption={false}
                                                pngOption={true}
                                                thumbnailSize={THUMBNAIL_SIZE}
                                                //hasItem={}
                                                //setHasItemCallback={}
                                                setIndexCallback={setHairIndex}
                                                itemIndex={hairIndex}
                                                updateUnownedCallback={updateUnowned}
                                                unownedIndex={unownedHairBase}
                                                setUnownedCallback={setUnownedHairBase}
                                            />
                                            :
                                            <AvatarColorMenuComponent
                                                title={"Hair base colors"}
                                                usesPng={false}
                                                data={hair_colors}
                                                setIndexCallback={setHairColorIndex}
                                                colorIndex={hairColorIndex}
                                            />
                                        }


                                    </> : null}
                                {/* hair front */}
                                {hairFrontPickerVisible ?
                                    <>
                                        {!colorMenuActive ?
                                            <AvatarMenuComponent
                                                title={"Hair front"}
                                                data={no_item(THUMBNAIL_SIZE, THUMBNAIL_COLOR).concat(
                                                    hair_front_types(THUMBNAIL_SIZE, THUMBNAIL_COLOR))}
                                                noItemOption={true}
                                                pngOption={false}
                                                thumbnailSize={THUMBNAIL_SIZE}
                                                hasItem={hasHairFront}
                                                setHasItemCallback={setHasHairFront}
                                                setIndexCallback={setHairFrontIndex}
                                                itemIndex={hairFrontIndex}
                                                updateUnownedCallback={updateUnowned}
                                                unownedIndex={unownedHairFront}
                                                setUnownedCallback={setUnownedHairFront}
                                            />
                                            :
                                            <AvatarColorMenuComponent
                                                title={"Hair colors"}
                                                usesPng={false}
                                                data={hair_colors}
                                                setIndexCallback={setHairColorIndex}
                                                colorIndex={hairColorIndex}
                                            />
                                        }
                                    </> : null}
                                {/* hair back */}
                                {hairBackPickerVisible ?
                                    <>
                                        {!colorMenuActive ?
                                            <AvatarMenuComponent
                                                title={"Hair back"}
                                                data={no_item(THUMBNAIL_SIZE, THUMBNAIL_COLOR).concat(
                                                    hair_back_types(THUMBNAIL_SIZE, THUMBNAIL_COLOR))}
                                                noItemOption={true}
                                                pngOption={false}
                                                thumbnailSize={THUMBNAIL_SIZE}
                                                hasItem={hasHairBack}
                                                setHasItemCallback={setHasHairBack}
                                                setIndexCallback={setHairBackIndex}
                                                itemIndex={hairBackIndex}
                                                updateUnownedCallback={updateUnowned}
                                                unownedIndex={unownedHairBack}
                                                setUnownedCallback={setUnownedHairBack}
                                            />
                                            :
                                            <AvatarColorMenuComponent
                                                title={"Hair colors"}
                                                usesPng={false}
                                                data={hair_colors}
                                                setIndexCallback={setHairColorIndex}
                                                colorIndex={hairColorIndex}
                                            />
                                        }
                                    </> : null}
                                {/* hair side */}
                                {hairSidePickerVisible ?
                                    <>
                                        {!colorMenuActive ?
                                            <AvatarMenuComponent
                                                title={"Hair side"}
                                                data={no_item(THUMBNAIL_SIZE, THUMBNAIL_COLOR).concat(
                                                    hair_side_types(THUMBNAIL_SIZE, THUMBNAIL_COLOR))}
                                                noItemOption={true}
                                                pngOption={false}
                                                thumbnailSize={THUMBNAIL_SIZE}
                                                hasItem={hasHairSide}
                                                setHasItemCallback={setHasHairSide}
                                                setIndexCallback={setHairSideIndex}
                                                itemIndex={hairSideIndex}
                                                updateUnownedCallback={updateUnowned}
                                                unownedIndex={unownedHairSide}
                                                setUnownedCallback={setUnownedHairSide}
                                            />
                                            :
                                            <AvatarColorMenuComponent
                                                title={"Hair colors"}
                                                usesPng={false}
                                                data={hair_colors}
                                                setIndexCallback={setHairColorIndex}
                                                colorIndex={hairColorIndex}
                                            />
                                        }
                                    </> : null}
                            </View>

                        </View>
                    </View>
                    : null}

            </View>

            <View style={{ flex: 1, flexDirection: 'row', borderWidth: 2, }}>
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
                            <Text style={[styles.textDefault, { textAlign: 'center', }]}>Redeem and Save Avatar</Text> :
                            <Text style={[styles.textDefault, { textAlign: 'center', }]}>Save Avatar</Text>}
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1 }}></View>

            </View>
            {isLoading ?
                <ActivityIndicator size="large" color="gray" /> : null}

            <Header
                navigation={navigation}
                header={'#67806D'} />
            <TouchableOpacity
                style={{ position: 'absolute', marginTop: height - 100, }}
                onPress={toggleColorMenuActive}>
                <Image
                    style={{ width: 60, height: 60, marginLeft: 15, }}
                    source={colorWheelIcon}
                />
            </TouchableOpacity>
        </>

    )
}

SvgTestScreen.navigationOptions = () => {
    return {
        headerShown: false,
    };
}

const styles = StyleSheet.create({
    textDefaultBold: {
        fontFamily: 'Inter-Bold',
    },
    textDefault: {
        fontFamily: 'Inter-Regular',
    },
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
        backgroundColor: '#E6F4DB', alignItems: 'center', justifyContent: 'center'
    },
    itemSelectorNewActive: {
        alignItems: 'center',
        backgroundColor: '#CAE3B7', justifyContent: 'center',
    },
    subItemSelector: {
        width: 15, height: 15, borderRadius: 7.5, borderWidth: 1, marginHorizontal: 5,
        borderColor: '#B3B2B3'
    },
    subItemSelectorActive: {
        width: 15, height: 15, borderRadius: 7.5, borderWidth: 1, marginHorizontal: 5,
        borderColor: '#B3B2B3', backgroundColor: '#B3B2B3'
    }
})

export default SvgTestScreen;