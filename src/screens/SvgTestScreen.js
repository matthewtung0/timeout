import React, { useState, useContext } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, FlatList, Image } from 'react-native';
import * as DIR from '../components/AvatarSelection';
import { Icon } from 'react-native-elements'
import { Context as UserContext } from '../context/userContext';

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
    Bg1_svg, Bg2_svg, Bg3_svg, Bg4_svg, Bg5_svg, Bg6_svg, Bg7_svg, Bg8_svg, Bg9_svg, Bg10_svg,
    NoItem1_svg,
} from '../components/AvatarSelection2';

const THUMBNAIL_SIZE = 50;
const AVATAR_SIZE = 300;
const THUMBNAIL_COLOR = "#000000";

/*face: { mouth: 0, eyes: 0, makeup: 0, eyebrows: 0, base: 0, },
accessories: { glasses: 1, piercings: 1, accessories: 0 },
clothing: { outerwear: 1, top: 1, under: 0, },
hair: { front: 1, back: 1, side: 1, general: 0, },
background: 0, overlay: 0,*/

const SvgTestScreen = () => {
    const [color, setColor] = useState("#000000")
    const [activeMenu, setActiveMenu] = useState(0)
    const { state: userState, saveAvatar2, fetchAvatarItemsOwned } = useContext(UserContext)

    const piercing_types = (size, c) => {
        return [{
            svg: <Piercing1_svg
                colorFill={c} len={size} />, id: 1
        }, {
            svg: <Piercing2_svg
                colorFill={c} len={size} />, id: 2
        }, {
            svg: <Piercing3_svg
                colorFill={c} len={size} />, id: 3
        }, {
            svg: <Piercing4_svg
                colorFill={c} len={size} />, id: 4
        }, {
            svg: <Piercing5_svg
                colorFill={c} len={size} />, id: 5
        }, {
            svg: <Piercing6_svg
                colorFill={c} len={size} />, id: 6
        }, {
            svg: <Piercing7_svg
                colorFill={c} len={size} />, id: 7
        },]
    }

    const hair_front_types = (size, c) => {
        return [{
            svg: <Hairfront1_svg
                colorFill={c} len={size} />, id: 1
        },
        {
            svg: <Hairfront2_svg
                colorFill={c} len={size} />, id: 2
        },
        {
            svg: <Hairfront3_svg
                colorFill={c} len={size} />, id: 3
        },
        ]
    }

    const base_types = (size, c) => {
        return [{
            svg: <Base1_svg
                colorFill={c} len={size} />, id: 1
        }, {
            svg: <Base2_svg
                colorFill={c} len={size} />, id: 2
        }, {
            svg: <Base3_svg
                colorFill={c} len={size} />, id: 3
        }, {
            svg: <Base4_svg
                colorFill={c} len={size} />, id: 4
        }, {
            svg: <Base5_svg
                colorFill={c} len={size} />, id: 5
        },]
    }

    const underlayer_types = (size, c) => {
        return [{
            svg: <Underlayer1_svg
                colorFill={c} len={size} />, id: 1
        }, {
            svg: <Underlayer2_svg
                colorFill={c} len={size} />, id: 2
        }, {
            svg: <Underlayer3_svg
                colorFill={c} len={size} />, id: 3
        }, {
            svg: <Underlayer4_svg
                colorFill={c} len={size} />, id: 4
        }, {
            svg: <Underlayer5_svg
                colorFill={c} len={size} />, id: 5
        }, {
            svg: <Underlayer6_svg
                colorFill={c} len={size} />, id: 6
        }, {
            svg: <Underlayer7_svg
                colorFill={c} len={size} />, id: 7
        }, {
            svg: <Underlayer9_svg
                colorFill={c} len={size} />, id: 9
        },
        ]
    }

    const top_types = (size, c) => {
        return [
            {
                svg: <Top1_svg
                    colorFill={c} len={size} />, id: 1
            }, {
                svg: <Top3_svg
                    colorFill={c} len={size} />, id: 3
            },
        ]
    }

    const accessories_types = (size, c) => {
        return [
            {
                svg: <Accessories1_svg
                    colorFill={c} len={size} />, id: 1
            }, {
                svg: <Accessories2_svg
                    colorFill={c} len={size} />, id: 2
            }, {
                svg: <Accessories3_svg
                    colorFill={c} len={size} />, id: 3
            },
        ]
    }

    const outerwear_types = (size, c) => {
        return [
            {
                svg: <Outerwear1_svg
                    colorFill={c} len={size} />, id: 1
            }
        ]
    }

    const mouth_types = (size, c) => {
        return [
            {
                svg: <Mouth1_svg
                    colorFill={c} len={size} />, id: 1
            }, {
                svg: <Mouth2_svg
                    colorFill={c} len={size} />, id: 2
            }, {
                svg: <Mouth3_svg
                    colorFill={c} len={size} />, id: 3
            }
        ]
    }

    const eye_makeup_types = (size, c) => {
        return [{
            svg: <EyeMakeup1_svg
                colorFill={c} len={size} />, id: 1
        },]
    }

    const eyebrow_types = (size, c) => {
        return [{
            svg: <Eyebrows1_svg
                colorFill={c} len={size} />, id: 1
        }, {
            svg: <Eyebrows2_svg
                colorFill={c} len={size} />, id: 2
        },]
    }

    const hair_accessories_types = (size, c) => {
        return [{
            svg: <HairAccessories1_svg
                colorFill={c} len={size} />, id: 1
        }]
    }

    const hair_back_types = (size, c) => {
        return [{
            svg: <Hairback1_svg
                colorFill={c} len={size} />, id: 1
        }, {
            svg: <Hairback2_svg
                colorFill={c} len={size} />, id: 2
        }]
    }

    const hair_side_types = (size, c) => {
        return [{
            svg: <Hairside1_svg
                colorFill={c} len={size} />, id: 1
        }, {
            svg: <Hairside2_svg
                colorFill={c} len={size} />, id: 2
        }]
    }

    const bg_types = (size, c) => {
        return [{
            svg: <Bg1_svg
                colorFill={c} len={size} />, id: 1
        }, {
            svg: <Bg2_svg
                colorFill={c} len={size} />, id: 2
        }, {
            svg: <Bg3_svg
                colorFill={c} len={size} />, id: 3
        }, {
            svg: <Bg4_svg
                colorFill={c} len={size} />, id: 4
        }, {
            svg: <Bg5_svg
                colorFill={c} len={size} />, id: 5
        }, {
            svg: <Bg6_svg
                colorFill={c} len={size} />, id: 6
        }, {
            svg: <Bg7_svg
                colorFill={c} len={size} />, id: 7
        }, {
            svg: <Bg8_svg
                colorFill={c} len={size} />, id: 8
        }, {
            svg: <Bg9_svg
                colorFill={c} len={size} />, id: 9
        }, {
            svg: <Bg10_svg
                colorFill={c} len={size} />, id: 10
        },]
    }

    const no_item = (size, c) => {
        return [{
            svg: <NoItem1_svg
                colorFill={c} len={size} />, id: -1
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

    const [underlayerPickerVisible, setUnderlayerPickerVisible] = useState(false)
    const [topPickerVisible, setTopPickerVisible] = useState(false)
    const [outerwearPickerVisible, setOuterwearlayerPickerVisible] = useState(false)
    const [hairSidePickerVisible, setHairSidePickerVisible] = useState(false)
    const [hairBackPickerVisible, setHairBackPickerVisible] = useState(false)
    const [hairFrontPickerVisible, setHairFrontPickerVisible] = useState(false)
    const [hairAccessoriesPickerVisible, setHairAccessoriesPickerVisible] = useState(false)
    const [accessoriesPickerVisible, setAccessoriesPickerVisible] = useState(false)
    const [mouthPickerVisible, setMouthPickerVisible] = useState(false)
    const [eyePickerVisible, setEyePickerVisible] = useState(false)
    const [eyeMakeupPickerVisible, setEyeMakeupPickerVisible] = useState(false)
    const [eyebrowPickerVisible, setEyebrowPickerVisible] = useState(false)
    const [backgroundPickerVisible, setBackgroundPickerVisible] = useState(false)
    const [hairPickerVisible, setHairPickerVisible] = useState(false)
    const [skinPickerVisible, setSkinPickerVisible] = useState(false)
    const [piercingPickerVisible, setPiercingPickerVisible] = useState(false)
    const [glassesPickerVisible, setGlassesPickerVisible] = useState(false)

    const [baseIndex, setBaseIndex] = useState(0)
    const [underlayerIndex, setUnderlayerIndex] = useState(0);
    const [outerwearIndex, setOuterwearIndex] = useState(0);
    const [topIndex, setTopIndex] = useState(0);
    const [underlayerColorIndex, setUnderlayerColorIndex] = useState(0);
    const [outerwearColorIndex, setOuterwearColorIndex] = useState(0);
    const [topColorIndex, setTopColorIndex] = useState(0);
    const [piercingIndex, setPiercingIndex] = useState(0);
    const [piercingColorIndex, setPiercingColorIndex] = useState(0);
    const [glassesIndex, setGlassesIndex] = useState(0);
    const [glassesColorIndex, setGlassesColorIndex] = useState(0);

    const [hairSideIndex, setHairSideIndex] = useState(0);
    const [hairBackIndex, setHairBackIndex] = useState(0);
    const [hairFrontIndex, setHairFrontIndex] = useState(0);
    const [hairColorIndex, setHairColorIndex] = useState(0);

    const [accessoriesIndex, setAccessoriesIndex] = useState(0);
    const [hairAccessoriesIndex, setHairAccessoriesIndex] = useState(0);
    const [hairAccessoriesColorIndex, setHairAccessoriesColorIndex] = useState(0);

    const [mouthIndex, setMouthIndex] = useState(0);
    const [mouthColorIndex, setMouthColorIndex] = useState(0);

    const [eyeMakeupIndex, setEyeMakeupIndex] = useState(0);
    const [eyeMakeupColorIndex, setEyeMakeupColorIndex] = useState(0);
    const [eyebrowIndex, setEyebrowIndex] = useState(0);
    const [eyebrowColorIndex, setEyebrowColorIndex] = useState(0);
    const [eyeIndex, setEyeIndex] = useState(0)
    const [eyeColorIndex, setEyeColorIndex] = useState(0)

    const [hairIndex, setHairIndex] = useState(0)

    const [backgroundIndex, setBackgroundIndex] = useState(0)

    // for optional items to toggle on/off
    const [hasOuterwear, setHasOuterwear] = useState(false)
    const [hasTop, setHasTop] = useState(false)
    const [hasHairAccessories, setHasHairAccessories] = useState(false)
    const [hasHairBack, setHasHairBack] = useState(false)
    const [hasHairSide, setHasHairSide] = useState(false)
    const [hasHairFront, setHasHairFront] = useState(false)
    const [hasAccessories, setHasAccessories] = useState(false)
    const [hasEyeMakeup, setHasEyeMakeup] = useState(false)
    const [hasPiercings, setHasPiercings] = useState(false)
    const [hasGlasses, setHasGlasses] = useState(false)

    /* JSON data to produce to represent avatar */
    const [avatarJSON, setAvatarJSON] = useState({});

    const saveAvatarCallback = () => {
        console.log("AVATAR SUCCESSFULLY SAVED")
        //alert("Avatar successfully saved!")
    }
    const saveAvatar = async () => {
        await saveAvatar2(avatarJSON, saveAvatarCallback)

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
            <View style={{ marginTop: 50, }}>
                <Text>testing SVG</Text>
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

            <View style={{ flexDirection: 'row', borderWidth: 1, justifyContent: 'space-around' }}>
                <TouchableOpacity style={activeMenu == 0 ? [styles.itemSelectorActive] :
                    styles.itemSelector}
                    onPress={() => { setActiveMenu(0) }}
                ><Text >Face</Text></TouchableOpacity>
                <TouchableOpacity style={activeMenu == 1 ? [styles.itemSelectorActive] :
                    styles.itemSelector}
                    onPress={() => { setActiveMenu(1) }}
                ><Text >Accessories</Text></TouchableOpacity>
                <TouchableOpacity style={activeMenu == 2 ? [styles.itemSelectorActive] :
                    styles.itemSelector}
                    onPress={() => { setActiveMenu(2) }}
                ><Text >Clothes</Text></TouchableOpacity>
                <TouchableOpacity style={activeMenu == 3 ? [styles.itemSelectorActive] :
                    styles.itemSelector}
                    onPress={() => { setActiveMenu(3) }}
                ><Text >Hair</Text></TouchableOpacity>
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
                                    <FlatList
                                        style={{ borderWidth: 1 }}
                                        horizontal={true}
                                        data={base_types(THUMBNAIL_SIZE, THUMBNAIL_COLOR)}
                                        showsHorizontalScrollIndicator={false}
                                        keyExtractor={(item) => item.id}
                                        renderItem={({ item, index }) => {
                                            return (<View>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        setBaseIndex(index)
                                                    }}>
                                                    {item.svg}

                                                </TouchableOpacity>
                                            </View>
                                            )
                                        }}
                                    /> : null}

                                {/* eyes */}
                                {eyePickerVisible ?
                                    <><FlatList
                                        style={{ borderWidth: 1 }}
                                        horizontal={true}
                                        data={DIR.eyeTypes}
                                        showsHorizontalScrollIndicator={false}
                                        keyExtractor={(item) => item}
                                        renderItem={({ item, index }) => {
                                            return (<View>
                                                <TouchableOpacity
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

                                        <FlatList
                                            style={{ borderWidth: 1 }}
                                            horizontal={true}
                                            data={DIR.eyeColors}
                                            showsHorizontalScrollIndicator={false}
                                            keyExtractor={(item) => item}
                                            renderItem={({ item, index }) => {
                                                return (<View>
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            setEyeColorIndex(index)
                                                        }}>
                                                        <View style={{ width: 50, height: 50, backgroundColor: item }} />

                                                    </TouchableOpacity>
                                                </View>
                                                )
                                            }}
                                        />
                                    </>
                                    : null}

                                {/* mouth */}
                                {mouthPickerVisible ? <><FlatList
                                    style={{ borderWidth: 1 }}
                                    horizontal={true}
                                    data={mouth_types(THUMBNAIL_SIZE, THUMBNAIL_COLOR)}
                                    showsHorizontalScrollIndicator={false}
                                    keyExtractor={(item) => item.id}
                                    renderItem={({ item, index }) => {
                                        return (<View>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    setMouthIndex(index)
                                                }}>
                                                {item.svg}

                                            </TouchableOpacity>
                                        </View>
                                        )
                                    }}
                                />
                                    <FlatList
                                        style={{ borderWidth: 1 }}
                                        horizontal={true}
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
                                                    <View style={{ width: 50, height: 50, backgroundColor: item.hex }} />

                                                </TouchableOpacity>
                                            </View>
                                            )
                                        }}
                                    />
                                </>
                                    : null}

                                {/* eye makeup */}
                                {eyeMakeupPickerVisible ?
                                    <><FlatList
                                        style={{ borderWidth: 1 }}
                                        horizontal={true}
                                        data={no_item(THUMBNAIL_SIZE, THUMBNAIL_COLOR).concat(
                                            eye_makeup_types(THUMBNAIL_SIZE, THUMBNAIL_COLOR))}
                                        showsHorizontalScrollIndicator={false}
                                        keyExtractor={(item) => item.id}
                                        renderItem={({ item, index }) => {
                                            return (<View>
                                                <TouchableOpacity
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
                                        <FlatList
                                            style={{ borderWidth: 1 }}
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
                                                        <View style={{ width: 50, height: 50, backgroundColor: item.hex }} />

                                                    </TouchableOpacity>
                                                </View>
                                                )
                                            }}
                                        />
                                    </> : null}


                                {/* Eyebrows */}
                                {eyebrowPickerVisible ?
                                    <><FlatList
                                        style={{ borderWidth: 1 }}
                                        horizontal={true}
                                        data={eyebrow_types(THUMBNAIL_SIZE, THUMBNAIL_COLOR)}
                                        showsHorizontalScrollIndicator={false}
                                        keyExtractor={(item) => item.id}
                                        renderItem={({ item, index }) => {
                                            return (<View>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        setEyebrowIndex(index)
                                                    }}>
                                                    {item.svg}

                                                </TouchableOpacity>
                                            </View>
                                            )
                                        }}
                                    />
                                        <FlatList
                                            style={{ borderWidth: 1 }}
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
                                                        <View style={{ width: 50, height: 50, backgroundColor: item.hex }} />

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
                                {hairAccessoriesPickerVisible ? <><FlatList
                                    style={{ borderWidth: 1 }}
                                    horizontal={true}
                                    data={no_item(THUMBNAIL_SIZE, THUMBNAIL_COLOR).concat(
                                        hair_accessories_types(THUMBNAIL_SIZE, THUMBNAIL_COLOR))}
                                    showsHorizontalScrollIndicator={false}
                                    keyExtractor={(item) => item.id}
                                    renderItem={({ item, index }) => {
                                        return (<View>
                                            <TouchableOpacity
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
                                    <FlatList
                                        style={{ borderWidth: 1 }}
                                        horizontal={true}
                                        data={underlayer_colors}
                                        showsHorizontalScrollIndicator={false}
                                        keyExtractor={(item) => item.id}
                                        renderItem={({ item, index }) => {
                                            return (<View>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        setHairAccessoriesColorIndex(index)
                                                    }}>
                                                    <View style={{ width: 50, height: 50, backgroundColor: item.hex }} />

                                                </TouchableOpacity>
                                            </View>
                                            )
                                        }}
                                    />
                                </> : null}

                                {/* accessories */}
                                {accessoriesPickerVisible ?
                                    <FlatList
                                        style={{ borderWidth: 1 }}
                                        horizontal={true}
                                        data={no_item(THUMBNAIL_SIZE, THUMBNAIL_COLOR).concat(
                                            accessories_types(THUMBNAIL_SIZE, THUMBNAIL_COLOR))}
                                        showsHorizontalScrollIndicator={false}
                                        keyExtractor={(item) => item.id}
                                        renderItem={({ item, index }) => {
                                            return (<View>
                                                <TouchableOpacity
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
                                    /> : null}
                                {/* background */}
                                {backgroundPickerVisible ?
                                    <FlatList
                                        style={{ borderWidth: 1 }}
                                        horizontal={true}
                                        data={bg_types(THUMBNAIL_SIZE, THUMBNAIL_COLOR)}
                                        showsHorizontalScrollIndicator={false}
                                        keyExtractor={(item) => item.id}
                                        renderItem={({ item, index }) => {
                                            return (<View>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        setBackgroundIndex(index)
                                                    }}>
                                                    {item.svg}

                                                </TouchableOpacity>
                                            </View>
                                            )
                                        }}
                                    /> : null}

                                {piercingPickerVisible ? <><FlatList
                                    style={{ borderWidth: 1 }}
                                    horizontal={true}
                                    data={no_item(THUMBNAIL_SIZE, THUMBNAIL_COLOR).concat(
                                        piercing_types(THUMBNAIL_SIZE, THUMBNAIL_COLOR))}
                                    showsHorizontalScrollIndicator={false}
                                    keyExtractor={(item) => item.id}
                                    renderItem={({ item, index }) => {
                                        return (<View>
                                            <TouchableOpacity
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
                                    <FlatList
                                        style={{ borderWidth: 1 }}
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
                                                    <View style={{ width: 50, height: 50, backgroundColor: item.hex }} />

                                                </TouchableOpacity>
                                            </View>
                                            )
                                        }}
                                    />
                                </> : null}

                                {glassesPickerVisible ? <><FlatList
                                    style={{ borderWidth: 1 }}
                                    horizontal={true}
                                    data={no_item(THUMBNAIL_SIZE, THUMBNAIL_COLOR).concat(
                                        DIR.glassesTypes)}
                                    showsHorizontalScrollIndicator={false}
                                    keyExtractor={(item) => item}
                                    renderItem={({ item, index }) => {
                                        return (<View>
                                            <TouchableOpacity
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
                                    <FlatList
                                        style={{ borderWidth: 1 }}
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
                                                    <View style={{ width: 50, height: 50, backgroundColor: item.hex }} />

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
                                    <><FlatList
                                        style={{ borderWidth: 1 }}
                                        horizontal={true}
                                        data={underlayer_types(THUMBNAIL_SIZE, THUMBNAIL_COLOR)}
                                        showsHorizontalScrollIndicator={false}
                                        keyExtractor={(item) => item.id}
                                        renderItem={({ item, index }) => {
                                            return (<View>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        setUnderlayerIndex(index)
                                                        console.log(index)
                                                    }}>
                                                    {item.svg}

                                                </TouchableOpacity>
                                            </View>
                                            )
                                        }}
                                    />

                                        <FlatList
                                            style={{ borderWidth: 1 }}
                                            horizontal={true}
                                            data={underlayer_colors}
                                            showsHorizontalScrollIndicator={false}
                                            keyExtractor={(item) => item.id}
                                            renderItem={({ item, index }) => {
                                                return (<View>
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            setUnderlayerColorIndex(index)
                                                        }}>
                                                        <View style={{ width: 50, height: 50, backgroundColor: item.hex }} />

                                                    </TouchableOpacity>
                                                </View>
                                                )
                                            }}
                                        />
                                    </> : null}

                                {/* top layer */}
                                {topPickerVisible ?
                                    <><FlatList
                                        style={{ borderWidth: 1 }}
                                        horizontal={true}
                                        data={no_item(THUMBNAIL_SIZE, THUMBNAIL_COLOR).concat(
                                            top_types(THUMBNAIL_SIZE, THUMBNAIL_COLOR))}
                                        showsHorizontalScrollIndicator={false}
                                        keyExtractor={(item) => item.id}
                                        renderItem={({ item, index }) => {
                                            return (<View>
                                                <TouchableOpacity
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

                                        <FlatList
                                            style={{ borderWidth: 1 }}
                                            horizontal={true}
                                            data={underlayer_colors}
                                            showsHorizontalScrollIndicator={false}
                                            keyExtractor={(item) => item.id}
                                            renderItem={({ item, index }) => {
                                                return (<View>
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            setTopColorIndex(index)
                                                        }}>
                                                        <View style={{ width: 50, height: 50, backgroundColor: item.hex }} />

                                                    </TouchableOpacity>
                                                </View>
                                                )
                                            }}
                                        />
                                    </> : null}

                                {/* outerwear */}
                                {outerwearPickerVisible ?
                                    <><FlatList
                                        style={{ borderWidth: 1 }}
                                        horizontal={true}
                                        data={no_item(THUMBNAIL_SIZE, THUMBNAIL_COLOR).concat(
                                            outerwear_types(THUMBNAIL_SIZE, THUMBNAIL_COLOR))}
                                        showsHorizontalScrollIndicator={false}
                                        keyExtractor={(item) => item.id}
                                        renderItem={({ item, index }) => {
                                            return (<View>
                                                <TouchableOpacity
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
                                        <FlatList
                                            style={{ borderWidth: 1 }}
                                            horizontal={true}
                                            data={underlayer_colors}
                                            showsHorizontalScrollIndicator={false}
                                            keyExtractor={(item) => item.id}
                                            renderItem={({ item, index }) => {
                                                return (<View>
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            setOuterwearColorIndex(index)
                                                        }}>
                                                        <View style={{ width: 50, height: 50, backgroundColor: item.hex }} />

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
                                        <FlatList
                                            style={{ borderWidth: 1 }}
                                            horizontal={true}
                                            data={DIR.hairTypes}
                                            showsHorizontalScrollIndicator={false}
                                            keyExtractor={(item) => item}
                                            renderItem={({ item, index }) => {
                                                return (<View>
                                                    <TouchableOpacity
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
                                        <FlatList
                                            style={{ borderWidth: 1 }}
                                            horizontal={true}
                                            data={hair_colors}
                                            showsHorizontalScrollIndicator={false}
                                            keyExtractor={(item) => item.id}
                                            renderItem={({ item, index }) => {
                                                return (<View>
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            setHairColorIndex(index)
                                                        }}>
                                                        <View style={{ width: 50, height: 50, backgroundColor: item.hex }} />

                                                    </TouchableOpacity>
                                                </View>
                                                )
                                            }}
                                        />
                                    </> : null}
                                {/* hair front */}
                                {hairFrontPickerVisible ?
                                    <>
                                        <FlatList
                                            style={{ borderWidth: 1 }}
                                            horizontal={true}
                                            data={no_item(THUMBNAIL_SIZE, THUMBNAIL_COLOR).concat(
                                                hair_front_types(THUMBNAIL_SIZE, THUMBNAIL_COLOR))}
                                            showsHorizontalScrollIndicator={false}
                                            keyExtractor={(item) => item.id}
                                            renderItem={({ item, index }) => {
                                                return (<View>
                                                    <TouchableOpacity
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

                                        <FlatList
                                            style={{ borderWidth: 1 }}
                                            horizontal={true}
                                            data={hair_colors}
                                            showsHorizontalScrollIndicator={false}
                                            keyExtractor={(item) => item.id}
                                            renderItem={({ item, index }) => {
                                                return (<View>
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            setHairColorIndex(index)
                                                        }}>
                                                        <View style={{ width: 50, height: 50, backgroundColor: item.hex }} />

                                                    </TouchableOpacity>
                                                </View>
                                                )
                                            }}
                                        />
                                    </> : null}
                                {/* hair back */}
                                {hairBackPickerVisible ?
                                    <><FlatList
                                        style={{ borderWidth: 1 }}
                                        horizontal={true}
                                        data={no_item(THUMBNAIL_SIZE, THUMBNAIL_COLOR).concat(
                                            hair_back_types(THUMBNAIL_SIZE, THUMBNAIL_COLOR))}
                                        showsHorizontalScrollIndicator={false}
                                        keyExtractor={(item) => item.id}
                                        renderItem={({ item, index }) => {
                                            return (<View>
                                                <TouchableOpacity
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
                                        <FlatList
                                            style={{ borderWidth: 1 }}
                                            horizontal={true}
                                            data={hair_colors}
                                            showsHorizontalScrollIndicator={false}
                                            keyExtractor={(item) => item.id}
                                            renderItem={({ item, index }) => {
                                                return (<View>
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            setHairColorIndex(index)
                                                        }}>
                                                        <View style={{ width: 50, height: 50, backgroundColor: item.hex }} />

                                                    </TouchableOpacity>
                                                </View>
                                                )
                                            }}
                                        />
                                    </> : null}
                                {/* hair side */}
                                {hairSidePickerVisible ?
                                    <>
                                        <FlatList
                                            style={{ borderWidth: 1 }}
                                            horizontal={true}
                                            data={no_item(THUMBNAIL_SIZE, THUMBNAIL_COLOR).concat(
                                                hair_side_types(THUMBNAIL_SIZE, THUMBNAIL_COLOR))}
                                            showsHorizontalScrollIndicator={false}
                                            keyExtractor={(item) => item.id}
                                            renderItem={({ item, index }) => {
                                                return (<View>
                                                    <TouchableOpacity
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
                                        <FlatList
                                            style={{ borderWidth: 1 }}
                                            horizontal={true}
                                            data={hair_colors}
                                            showsHorizontalScrollIndicator={false}
                                            keyExtractor={(item) => item.id}
                                            renderItem={({ item, index }) => {
                                                return (<View>
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            setHairColorIndex(index)
                                                        }}>
                                                        <View style={{ width: 50, height: 50, backgroundColor: item.hex }} />

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




            </View>

            <TouchableOpacity
                style={{ borderWidth: 1, }}
                onPress={() => {
                    createAvatarJSON()
                }}>
                <Text>Create Data</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={{ borderWidth: 1, }}
                onPress={() => {
                    saveAvatar()
                }}>
                <Text>Save Avatar 2</Text>
            </TouchableOpacity>
            <Text>{JSON.stringify(avatarJSON)}</Text>
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
    }
})

export default SvgTestScreen;