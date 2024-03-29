import React, { useState, useContext } from 'react';
import { View, StyleSheet, Text, Image, Dimensions, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements';
import { Context as UserContext } from '../src/context/userContext';
import Modal from 'react-native-modal'
import AvatarCheckOutModal from '../src/components/AvatarCheckOutModal';
import * as DIR from '../src/components/AvatarSelection2';
//import Images from 'images'

/*const unknown = require('../../assets/avatar/20_BACKGROUND/1_pink.png')

const base1 = require('../../assets/avatar/16_base/1.png');
const base2 = require('../../assets/avatar/16_base/2.png');
const base3 = require('../../assets/avatar/16_base/3.png');
const base4 = require('../../assets/avatar/16_base/4.png');
const base5 = require('../../assets/avatar/16_base/5.png');
const baseTypes = [base1, base2, base3, base4, base5]

const ear1 = require('../../assets/avatar/3_ear/1.png')
const ear2 = require('../../assets/avatar/3_ear/2.png')
const ear3 = require('../../assets/avatar/3_ear/3.png')
const ear4 = require('../../assets/avatar/3_ear/4.png')
const ear5 = require('../../assets/avatar/3_ear/5.png')
const earTypes = [ear1, ear2, ear3, ear4, ear5]

// ---------------------------------------- Eyes ----------------------------------------------
const eyesWide1 = require('../../assets/avatar/12_eyes/1_wide_1_brown.png')
const eyesWide2 = require('../../assets/avatar/12_eyes/1_wide_2_black.png')
const eyesWide3 = require('../../assets/avatar/12_eyes/1_wide_3_blue.png')
const eyesWide4 = require('../../assets/avatar/12_eyes/1_wide_4_green.png')
const eyesWide5 = require('../../assets/avatar/12_eyes/1_wide_5_gold.png')
const eyesWide6 = require('../../assets/avatar/12_eyes/1_wide_6_red.png')
const eyesWide7 = require('../../assets/avatar/12_eyes/1_wide_7_allwhite.png')
const eyesWide8 = require('../../assets/avatar/12_eyes/1_wide_8_allblack.png')
const eyesWide = [eyesWide1, eyesWide2, eyesWide3, eyesWide4, eyesWide5, eyesWide6, eyesWide7, eyesWide8,]

const eyesNeutral1 = require('../../assets/avatar/12_eyes/2_neutral_1_brown.png')
const eyesNeutral2 = require('../../assets/avatar/12_eyes/2_neutral_2_black.png')
const eyesNeutral3 = require('../../assets/avatar/12_eyes/2_neutral_3_blue.png')
const eyesNeutral4 = require('../../assets/avatar/12_eyes/2_neutral_4_green.png')
const eyesNeutral5 = require('../../assets/avatar/12_eyes/2_neutral_5_gold.png')
const eyesNeutral6 = require('../../assets/avatar/12_eyes/2_neutral_6_red.png')
const eyesNeutral7 = require('../../assets/avatar/12_eyes/2_neutral_7_allwhite.png')
const eyesNeutral8 = require('../../assets/avatar/12_eyes/2_neutral_8_allblack.png')
const eyesNeutral = [eyesNeutral1, eyesNeutral2, eyesNeutral3, eyesNeutral4, eyesNeutral5,
    eyesNeutral6, eyesNeutral7, eyesNeutral8,]

const eyeTypes = [eyesWide, eyesNeutral]
const eyeColors = ['brown', 'black', 'blue', 'green', 'gold', 'red', 'light-grey', 'grey']


// ---------------------------------------- GLASSES ----------------------------------------------
const glasses1 = require('../../assets/avatar/1_glasses/1_round_1_black-01.png')
const glasses2 = require('../../assets/avatar/1_glasses/2_rectangle-clear_1_black-01.png')
const glasses3 = require('../../assets/avatar/1_glasses/2_rectangle-shade-1_black.png')
const glassesTypes = [[unknown], [glasses1], [glasses2], [glasses3]]

// ---------------------------------------- PIERCINGS ----------------------------------------------
const piercingsHoop1 = require('../../assets/avatar/2_piercings/1_brow-hoop_1_black.png')
const piercingsHoop2 = require('../../assets/avatar/2_piercings/1_brow-hoop_2_silver.png')
const piercingsHoop3 = require('../../assets/avatar/2_piercings/1_brow-hoop_3_gold.png')
const piercingsHoop = [piercingsHoop1, piercingsHoop2, piercingsHoop3]

const piercingsBarbell1 = require('../../assets/avatar/2_piercings/2_brow-curvedbarbell_1_black.png')
const piercingsBarbell2 = require('../../assets/avatar/2_piercings/2_brow-curvedbarbell_2_silver.png')
const piercingsBarbell3 = require('../../assets/avatar/2_piercings/2_brow-curvedbarbell_3_gold.png')
const piercingsBarbell = [piercingsBarbell1, piercingsBarbell2, piercingsBarbell3]

const piercingsIndustrial1 = require('../../assets/avatar/2_piercings/3_industrial_1_black.png')
const piercingsIndustrial2 = require('../../assets/avatar/2_piercings/3_industrial_2_silver.png')
const piercingsIndustrial3 = require('../../assets/avatar/2_piercings/3_industrial_3_gold.png')
const piercingsIndustrial = [piercingsIndustrial1, piercingsIndustrial2, piercingsIndustrial3]

const piercingsEarcuff1 = require('../../assets/avatar/2_piercings/4_earcuff_1_black.png')
const piercingsEarcuff2 = require('../../assets/avatar/2_piercings/4_earcuff_2_silver.png')
const piercingsEarcuff3 = require('../../assets/avatar/2_piercings/4_earcuff_3_gold.png')
const piercingsEarcuff = [piercingsEarcuff1, piercingsEarcuff2, piercingsEarcuff3]

const piercingsHeart1 = require('../../assets/avatar/2_piercings/5_daith-heart_1_black.png')
const piercingsHeart2 = require('../../assets/avatar/2_piercings/5_daith-heart_2_silver.png')
const piercingsHeart3 = require('../../assets/avatar/2_piercings/5_daith-heart_3_gold.png')
const piercingsHeart = [piercingsHeart1, piercingsHeart2, piercingsHeart3]

const piercingsCross1 = require('../../assets/avatar/2_piercings/6_dangle-cross_1_black.png')
const piercingsCross2 = require('../../assets/avatar/2_piercings/6_dangle-cross_2_silver.png')
const piercingsCross3 = require('../../assets/avatar/2_piercings/6_dangle-cross_3_gold.png')
const piercingsCross = [piercingsCross1, piercingsCross2, piercingsCross3]

const piercingsChain1 = require('../../assets/avatar/2_piercings/7_earcuff-chain_1_black.png')
const piercingsChain2 = require('../../assets/avatar/2_piercings/7_earcuff-chain_2_silver.png')
const piercingsChain3 = require('../../assets/avatar/2_piercings/7_earcuff-chain_3_gold.png')
const piercingsChain = [piercingsChain1, piercingsChain2, piercingsChain3]

const piercingsTypes = [[unknown], piercingsHoop, piercingsBarbell, piercingsIndustrial,
    piercingsEarcuff, piercingsHeart, piercingsCross, piercingsChain]
const piercingsColors = ['#000', '#C0C0C0', '#FFD700']



// ---------------------------------------- HAIR FRONT ----------------------------------------------
const frontBangsPart1 = require('../../assets/avatar/4_hair_front/1_bangs-part_1_black.png')
const frontBangsPart2 = require('../../assets/avatar/4_hair_front/1_bangs-part_2_brown.png')
const frontBangsPart3 = require('../../assets/avatar/4_hair_front/1_bangs-part_3_blonde.png')
const frontBangsPart4 = require('../../assets/avatar/4_hair_front/1_bangs-part_4_white.png')
const frontBangsPart5 = require('../../assets/avatar/4_hair_front/1_bangs-part_5_blue.png')
const frontBangsPart6 = require('../../assets/avatar/4_hair_front/1_bangs-part_6_green.png')
const frontBangsPart = [frontBangsPart1, frontBangsPart2, frontBangsPart3, frontBangsPart4, frontBangsPart5, frontBangsPart6]

const frontBangsFull1 = require('../../assets/avatar/4_hair_front/2_bangs-full_1_black.png')
const frontBangsFull2 = require('../../assets/avatar/4_hair_front/2_bangs-full_2_brown.png')
const frontBangsFull3 = require('../../assets/avatar/4_hair_front/2_bangs-full_3_blonde.png')
const frontBangsFull4 = require('../../assets/avatar/4_hair_front/2_bangs-full_4_white.png')
const frontBangsFull5 = require('../../assets/avatar/4_hair_front/2_bangs-full_5_blue.png')
const frontBangsFull6 = require('../../assets/avatar/4_hair_front/2_bangs-full_6_green.png')
const frontBangsFull = [frontBangsFull1, frontBangsFull2, frontBangsFull3, frontBangsFull4, frontBangsFull5, frontBangsFull6]

const frontMidpart1 = require('../../assets/avatar/4_hair_front/3_midpart_1_black.png')
const frontMidpart2 = require('../../assets/avatar/4_hair_front/3_midpart_2_brown.png')
const frontMidpart3 = require('../../assets/avatar/4_hair_front/3_midpart_3_blonde.png')
const frontMidpart4 = require('../../assets/avatar/4_hair_front/3_midpart_4_white.png')
const frontMidpart5 = require('../../assets/avatar/4_hair_front/3_midpart_5_blue.png')
const frontMidpart6 = require('../../assets/avatar/4_hair_front/3_midpart_6_green.png')
const frontMidpart = [frontMidpart1, frontMidpart2, frontMidpart3, frontMidpart4, frontMidpart5, frontMidpart6]

const hairFrontTypes = [[unknown], frontBangsPart, frontBangsFull, frontMidpart]
const hairFrontColors = ['black', 'brown', 'yellow', 'white', 'blue', 'green']

// ---------------------------------------- HAIR SIDE ----------------------------------------------
const sideburn1 = require('../../assets/avatar/5_hair_side/1_sideburn_1_black-01.png')
const sideburn2 = require('../../assets/avatar/5_hair_side/1_sideburn_2_brown-01.png')
const sideburn3 = require('../../assets/avatar/5_hair_side/1_sideburn_3_blonde-01.png')
const sideburn4 = require('../../assets/avatar/5_hair_side/1_sideburn_4_white-01.png')
const sideburn5 = require('../../assets/avatar/5_hair_side/1_sideburn_5_blue-01.png')
const sideburn6 = require('../../assets/avatar/5_hair_side/1_sideburn_6_green-01.png')
const sideburn = [sideburn1, sideburn2, sideburn3, sideburn4, sideburn5, sideburn6]

const coversNeck1 = require('../../assets/avatar/5_hair_side/2_coversneck_1_black-01.png')
const coversNeck2 = require('../../assets/avatar/5_hair_side/2_coversneck_2_brown.png')
const coversNeck3 = require('../../assets/avatar/5_hair_side/2_coversneck_3_blonde-01.png')
const coversNeck4 = require('../../assets/avatar/5_hair_side/2_coversneck_4_white-01.png')
const coversNeck5 = require('../../assets/avatar/5_hair_side/2_coversneck_5_blue-01.png')
const coversNeck6 = require('../../assets/avatar/5_hair_side/2_coversneck_6_green-01.png')
const coversNeck = [coversNeck1, coversNeck2, coversNeck3, coversNeck4, coversNeck5, coversNeck6]

const hairSideTypes = [[unknown], sideburn, coversNeck]

// ---------------------------------------- HAIR  ----------------------------------------------
const sidesweep1 = require('../../assets/avatar/6_hair/1_sidesweep_1_black.png')
const sidesweep2 = require('../../assets/avatar/6_hair/1_sidesweep_2_brown.png')
const sidesweep3 = require('../../assets/avatar/6_hair/1_sidesweep_3_blonde.png')
const sidesweep4 = require('../../assets/avatar/6_hair/1_sidesweep_4_white.png')
const sidesweep5 = require('../../assets/avatar/6_hair/1_sidesweep_5_blue.png')
const sidesweep6 = require('../../assets/avatar/6_hair/1_sidesweep_6_green.png')
const sidesweep = [sidesweep1, sidesweep2, sidesweep3, sidesweep4, sidesweep5, sidesweep6]

const buzzcut1 = require('../../assets/avatar/6_hair/2_buzzcut_1_black-01.png')
const buzzcut2 = require('../../assets/avatar/6_hair/2_buzzcut_2_brown-01.png')
const buzzcut3 = require('../../assets/avatar/6_hair/2_buzzcut_3_blonde-01.png')
const buzzcut4 = require('../../assets/avatar/6_hair/2_buzzcut_4_white-01.png')
const buzzcut5 = require('../../assets/avatar/6_hair/2_buzzcut_5_blue-01.png')
const buzzcut6 = require('../../assets/avatar/6_hair/2_buzzcut_6_green-01.png')
const buzzcut = [buzzcut1, buzzcut2, buzzcut3, buzzcut4, buzzcut5, buzzcut6]

const hairTypes = [sidesweep, buzzcut]

// ---------------------------------------- HAIR BACK  --------------------------------------------
const ponytail1 = require('../../assets/avatar/18_hair_back/2_ponytail-fluffy_1_black.png')
const ponytail2 = require('../../assets/avatar/18_hair_back/2_ponytail-fluffy_2_brown-01.png')
const ponytail3 = require('../../assets/avatar/18_hair_back/2_ponytail-fluffy_3_blonde.png')
const ponytail4 = require('../../assets/avatar/18_hair_back/2_ponytail-fluffy_4_white.png')
const ponytail5 = require('../../assets/avatar/18_hair_back/2_ponytail-fluffy_5_blue.png')
const ponytail6 = require('../../assets/avatar/18_hair_back/2_ponytail-fluffy_6_green-01.png')
const ponytail = [ponytail1, ponytail2, ponytail3, ponytail4, ponytail5, ponytail6]

const down1 = require('../../assets/avatar/18_hair_back/3_down-fluffy_1_black.png')
const down2 = require('../../assets/avatar/18_hair_back/3_down-fluffy_2_brown.png')
const down3 = require('../../assets/avatar/18_hair_back/3_down-fluffy_3_blonde.png')
const down4 = require('../../assets/avatar/18_hair_back/3_down-fluffy_4_white.png')
const down5 = require('../../assets/avatar/18_hair_back/3_down-fluffy_5_blue.png')
const down6 = require('../../assets/avatar/18_hair_back/3_down-fluffy_6_green.png')
const down = [down1, down2, down3, down4, down5, down6]

const backHairTypes = [[unknown], ponytail, down]

// -------------------------------------- EYE MAKEUP  --------------------------------------
const makeup1 = require('../../assets/avatar/13_eye_makeup/1_silver.png')
const makeup2 = require('../../assets/avatar/13_eye_makeup/2_black.png')
const makeup3 = require('../../assets/avatar/13_eye_makeup/3_gold.png')
const makeup4 = require('../../assets/avatar/13_eye_makeup/4_pink.png')
const makeupTypes = [[unknown], [makeup1], [makeup2], [makeup3], [makeup4]]

// -------------------------------------- EYEBROWS  -----------------------------------------
const browThick1 = require('../../assets/avatar/15_eyebrows/1_neutral-thick_1_black-01.png')
const browThick2 = require('../../assets/avatar/15_eyebrows/1_neutral-thick_2_brown-01.png')
const browThick3 = require('../../assets/avatar/15_eyebrows/1_neutral-thick_3_blonde-01.png')
const browThick4 = require('../../assets/avatar/15_eyebrows/1_neutral-thick_4_white-01.png')
const browThick5 = require('../../assets/avatar/15_eyebrows/1_neutral-thick_5_blue-01.png')
const browThick6 = require('../../assets/avatar/15_eyebrows/1_neutral-thick_6_green-01.png')
const browThick = [browThick1, browThick2, browThick3, browThick4, browThick5, browThick6]

const browThin1 = require('../../assets/avatar/15_eyebrows/2_neutral-thin_1_black-01.png')
const browThin2 = require('../../assets/avatar/15_eyebrows/2_neutral-thin_2_brown-01.png')
const browThin3 = require('../../assets/avatar/15_eyebrows/2_neutral-thin_3_blonde-01.png')
const browThin4 = require('../../assets/avatar/15_eyebrows/2_neutral-thin_4_white-01.png')
const browThin5 = require('../../assets/avatar/15_eyebrows/2_neutral-thin_5_blue-01.png')
const browThin6 = require('../../assets/avatar/15_eyebrows/2_neutral-thin_6_green-01.png')
const browThin = [browThin1, browThin2, browThin3, browThin4, browThin5, browThin6]
const browTypes = [browThick, browThin]
//browColors use hairFrontColors

// -------------------------------------- MOUTH  --------------------------------------------
const pressed1 = require('../../assets/avatar/11_mouth/1_pressed_1_gray.png')
const pressed2 = require('../../assets/avatar/11_mouth/1_pressed_2_black.png')
const pressed3 = require('../../assets/avatar/11_mouth/1_pressed_3_red.png')
const pressed4 = require('../../assets/avatar/11_mouth/1_pressed_4_pink.png')
const pressed5 = require('../../assets/avatar/11_mouth/1_pressed_5_green.png')
const pressed = [pressed1, pressed2, pressed3, pressed4, pressed5]

const lipstick1 = require('../../assets/avatar/11_mouth/2_lipstick_1_gray.png')
const lipstick2 = require('../../assets/avatar/11_mouth/2_lipstick_2_black.png')
const lipstick3 = require('../../assets/avatar/11_mouth/2_lipstick_3_red.png')
const lipstick4 = require('../../assets/avatar/11_mouth/2_lipstick_4_pink-01.png')
const lipstick5 = require('../../assets/avatar/11_mouth/2_lipstick_5_green-01.png')
const lipstick = [lipstick1, lipstick2, lipstick3, lipstick4, lipstick5]

const lipstickSmile1 = require('../../assets/avatar/11_mouth/3_lipstick-smile_1_gray-01.png')
const lipstickSmile2 = require('../../assets/avatar/11_mouth/3_lipstick-smile_2_black-01.png')
const lipstickSmile3 = require('../../assets/avatar/11_mouth/3_lipstick-smile_3_red-01.png')
const lipstickSmile4 = require('../../assets/avatar/11_mouth/3_lipstick-smile_4_pink-01.png')
const lipstickSmile5 = require('../../assets/avatar/11_mouth/3_lipstick-smile_5_green-01.png')
const lipstickSmile = [lipstickSmile1, lipstickSmile2, lipstickSmile3, lipstickSmile4, lipstickSmile5]

const mouthColors = ['gray', 'black', 'red', 'pink', 'green']
const mouthTypes = [pressed, lipstick, lipstickSmile]

// ---------------------------------------- OUTERWEAR --------------------------------------------
const bomber1 = require('../../assets/avatar/7_outerwear/1_bomber_1_black.png')
const bomber2 = require('../../assets/avatar/7_outerwear/1_bomber_2_white.png')
const bomber3 = require('../../assets/avatar/7_outerwear/1_bomber_3_pink.png')
const bomber4 = require('../../assets/avatar/7_outerwear/1_bomber_4_red.png')
const bomber5 = require('../../assets/avatar/7_outerwear/1_bomber_5_purple.png')
const bomber6 = require('../../assets/avatar/7_outerwear/1_bomber_6_darkblue.png')
const bomber7 = require('../../assets/avatar/7_outerwear/1_bomber_7_lightblue.png')
const bomber8 = require('../../assets/avatar/7_outerwear/1_bomber_8_darkyellow.png')
const bomber9 = require('../../assets/avatar/7_outerwear/1_bomber_9_lightyellow.png')
const bomber10 = require('../../assets/avatar/7_outerwear/1_bomber_10_green.png')
const bomber = [bomber1, bomber2, bomber3, bomber4, bomber5, bomber6, bomber7, bomber8, bomber9, bomber10,]

const outerwearColors = ['black', 'white', 'pink', 'red', 'purple', 'dark-blue', 'light-blue', 'dark-yellow', 'light-yellow', 'green']
const outerwearTypes = [[unknown], bomber]

// ---------------------------------------- TOP --------------------------------------------
const overalls1 = require('../../assets/avatar/9_top/1_overalls_1_black.png')
const overalls2 = require('../../assets/avatar/9_top/1_overalls_2_white-01.png')
const overalls3 = require('../../assets/avatar/9_top/1_overalls_3_pink-01-01.png')
const overalls4 = require('../../assets/avatar/9_top/1_overalls_4_red-01.png')
const overalls5 = require('../../assets/avatar/9_top/1_overalls_5_purple-01.png')
const overalls6 = require('../../assets/avatar/9_top/1_overalls_6_darkblue-01.png')
const overalls7 = require('../../assets/avatar/9_top/1_overalls_7_lightblue.png')
const overalls8 = require('../../assets/avatar/9_top/1_overalls_8_darkyellow-01.png')
const overalls9 = require('../../assets/avatar/9_top/1_overalls_9_lightyellow-01.png')
const overalls10 = require('../../assets/avatar/9_top/1_overalls_10_green-01.png')
const overalls = [overalls1, overalls2, overalls3, overalls4, overalls5, overalls6, overalls7, overalls8, overalls9, overalls10]

const plaid1 = require('../../assets/avatar/9_top/2_plaid_1_black.png')
const plaid2 = require('../../assets/avatar/9_top/2_plaid_2_white.png')
const plaid3 = require('../../assets/avatar/9_top/2_plaid_3_pink.png')
const plaid4 = require('../../assets/avatar/9_top/2_plaid_4_red.png')
const plaid5 = require('../../assets/avatar/9_top/2_plaid_5_purple.png')
const plaid6 = require('../../assets/avatar/9_top/2_plaid_6_darkblue.png')
const plaid7 = require('../../assets/avatar/9_top/2_plaid_7_lightblue.png')
const plaid8 = require('../../assets/avatar/9_top/2_plaid_8_darkyellow.png')
const plaid9 = require('../../assets/avatar/9_top/2_plaid_9_lightyellow.png')
const plaid10 = require('../../assets/avatar/9_top/2_plaid_10_green.png')
const plaid = [plaid1, plaid2, plaid3, plaid4, plaid5, plaid6, plaid7, plaid8, plaid9, plaid10]

const spag1 = require('../../assets/avatar/9_top/3_spaghetti_1_black.png')
const spag2 = require('../../assets/avatar/9_top/3_spaghetti_2_white.png')
const spag3 = require('../../assets/avatar/9_top/3_spaghetti_3_pink.png')
const spag4 = require('../../assets/avatar/9_top/3_spaghetti_4_red.png')
const spag5 = require('../../assets/avatar/9_top/3_spaghetti_5_purple.png')
const spag6 = require('../../assets/avatar/9_top/3_spaghetti_6_darkblue.png')
const spag7 = require('../../assets/avatar/9_top/3_spaghetti_7_lightblue.png')
const spag8 = require('../../assets/avatar/9_top/3_spaghetti_8_darkyellow.png')
const spag9 = require('../../assets/avatar/9_top/3_spaghetti_9_lightyellow.png')
const spag10 = require('../../assets/avatar/9_top/3_spaghetti_10_green.png')
const spag = [spag1, spag2, spag3, spag4, spag5, spag6, spag7, spag8, spag9, spag10]
const topTypes = [[unknown], overalls, plaid, spag]
// topColors use outerwearColors

// ---------------------------------------- UNDERLAYER --------------------------------------------
const uspag1 = require('../../assets/avatar/10_underlayer/1_spaghetti_1_black.png')
const uspag2 = require('../../assets/avatar/10_underlayer/1_spaghetti_2_white.png')
const uspag3 = require('../../assets/avatar/10_underlayer/1_spaghetti_3_pink.png')
const uspag4 = require('../../assets/avatar/10_underlayer/1_spaghetti_4_red.png')
const uspag5 = require('../../assets/avatar/10_underlayer/1_spaghetti_5_purple.png')
const uspag6 = require('../../assets/avatar/10_underlayer/1_spaghetti_6_darkblue.png')
const uspag7 = require('../../assets/avatar/10_underlayer/1_spaghetti_7_lightblue.png')
const uspag8 = require('../../assets/avatar/10_underlayer/1_spaghetti_8_darkyellow.png')
const uspag9 = require('../../assets/avatar/10_underlayer/1_spaghetti_9_lightyellow.png')
const uspag10 = require('../../assets/avatar/10_underlayer/1_spaghetti_10_green.png')
const uspag = [uspag1, uspag2, uspag3, uspag4, uspag5, uspag6, uspag7, uspag8, uspag9, uspag10]

const tank1 = require('../../assets/avatar/10_underlayer/2_tank_1_black.png')
const tank2 = require('../../assets/avatar/10_underlayer/2_tank_2_white.png')
const tank3 = require('../../assets/avatar/10_underlayer/2_tank_3_pink.png')
const tank4 = require('../../assets/avatar/10_underlayer/2_tank_4_red.png')
const tank5 = require('../../assets/avatar/10_underlayer/2_tank_5_purple.png')
const tank6 = require('../../assets/avatar/10_underlayer/2_tank_6_darkblue.png')
const tank7 = require('../../assets/avatar/10_underlayer/2_tank_7_lightblue.png')
const tank8 = require('../../assets/avatar/10_underlayer/2_tank_8_darkyellow.png')
const tank9 = require('../../assets/avatar/10_underlayer/2_tank_9_lightyellow.png')
const tank10 = require('../../assets/avatar/10_underlayer/2_tank_10_green.png')
const tank = [tank1, tank2, tank3, tank4, tank5, tank6, tank7, tank8, tank9, tank10]

const turtleSleeveless1 = require('../../assets/avatar/10_underlayer/3_turtlesleeveless_1_black.png')
const turtleSleeveless2 = require('../../assets/avatar/10_underlayer/3_turtlesleeveless_2_white.png')
const turtleSleeveless3 = require('../../assets/avatar/10_underlayer/3_turtlesleeveless_3_pink.png')
const turtleSleeveless4 = require('../../assets/avatar/10_underlayer/3_turtlesleeveless_4_red.png')
const turtleSleeveless5 = require('../../assets/avatar/10_underlayer/3_turtlesleeveless_5_purple.png')
const turtleSleeveless6 = require('../../assets/avatar/10_underlayer/3_turtlesleeveless_6_darkblue.png')
const turtleSleeveless7 = require('../../assets/avatar/10_underlayer/3_turtlesleeveless_7_lightblue.png')
const turtleSleeveless8 = require('../../assets/avatar/10_underlayer/3_turtlesleeveless_8_darkyellow.png')
const turtleSleeveless9 = require('../../assets/avatar/10_underlayer/3_turtlesleeveless_9_lightyellow.png')
const turtleSleeveless10 = require('../../assets/avatar/10_underlayer/3_turtlesleeveless_10_green.png')
const turtleSleeveless = [turtleSleeveless1, turtleSleeveless2, turtleSleeveless3, turtleSleeveless4, turtleSleeveless5,
    turtleSleeveless6, turtleSleeveless7, turtleSleeveless8, turtleSleeveless9, turtleSleeveless10]

const widecut1 = require('../../assets/avatar/10_underlayer/4_widecut_1_black.png')
const widecut2 = require('../../assets/avatar/10_underlayer/4_widecut_2_white.png')
const widecut3 = require('../../assets/avatar/10_underlayer/4_widecut_3_pink.png')
const widecut4 = require('../../assets/avatar/10_underlayer/4_widecut_4_red.png')
const widecut5 = require('../../assets/avatar/10_underlayer/4_widecut_5_purple.png')
const widecut6 = require('../../assets/avatar/10_underlayer/4_widecut_6_darkblue.png')
const widecut7 = require('../../assets/avatar/10_underlayer/4_widecut_7_lightblue.png')
const widecut8 = require('../../assets/avatar/10_underlayer/4_widecut_8_darkyellow.png')
const widecut9 = require('../../assets/avatar/10_underlayer/4_widecut_9_lightyellow.png')
const widecut10 = require('../../assets/avatar/10_underlayer/4_widecut_10_green.png')
const widecut = [widecut1, widecut2, widecut3, widecut4, widecut5, widecut6, widecut7, widecut8, widecut9, widecut10]

const vneck1 = require('../../assets/avatar/10_underlayer/5_vneck_1_black.png')
const vneck2 = require('../../assets/avatar/10_underlayer/5_vneck_2_white.png')
const vneck3 = require('../../assets/avatar/10_underlayer/5_vneck_3_pink.png')
const vneck4 = require('../../assets/avatar/10_underlayer/5_vneck_4_red.png')
const vneck5 = require('../../assets/avatar/10_underlayer/5_vneck_5_purple.png')
const vneck6 = require('../../assets/avatar/10_underlayer/5_vneck_6_darkblue.png')
const vneck7 = require('../../assets/avatar/10_underlayer/5_vneck_7_lightblue.png')
const vneck8 = require('../../assets/avatar/10_underlayer/5_vneck_8_darkyellow.png')
const vneck9 = require('../../assets/avatar/10_underlayer/5_vneck_9_lightyellow.png')
const vneck10 = require('../../assets/avatar/10_underlayer/5_vneck_10_green.png')
const vneck = [vneck1, vneck2, vneck3, vneck4, vneck5, vneck6, vneck7, vneck8, vneck9, vneck10]

const tshirt1 = require('../../assets/avatar/10_underlayer/6_tshirt_1_black.png')
const tshirt2 = require('../../assets/avatar/10_underlayer/6_tshirt_2_white.png')
const tshirt3 = require('../../assets/avatar/10_underlayer/6_tshirt_3_pink.png')
const tshirt4 = require('../../assets/avatar/10_underlayer/6_tshirt_4_red.png')
const tshirt5 = require('../../assets/avatar/10_underlayer/6_tshirt_5_purple.png')
const tshirt6 = require('../../assets/avatar/10_underlayer/6_tshirt_6_darkblue.png')
const tshirt7 = require('../../assets/avatar/10_underlayer/6_tshirt_7_lightblue.png')
const tshirt8 = require('../../assets/avatar/10_underlayer/6_tshirt_8_darkyellow.png')
const tshirt9 = require('../../assets/avatar/10_underlayer/6_tshirt_9_lightyellow.png')
const tshirt10 = require('../../assets/avatar/10_underlayer/6_tshirt_10_green.png')
const tshirt = [tshirt1, tshirt2, tshirt3, tshirt4, tshirt5, tshirt6, tshirt7, tshirt8, tshirt9, tshirt10]

const turtleShort1 = require('../../assets/avatar/10_underlayer/7_turtle-short_1_black.png')
const turtleShort2 = require('../../assets/avatar/10_underlayer/7_turtle-short_2_white.png')
const turtleShort3 = require('../../assets/avatar/10_underlayer/7_turtle-short_3_pink.png')
const turtleShort4 = require('../../assets/avatar/10_underlayer/7_turtle-short_4_red.png')
const turtleShort5 = require('../../assets/avatar/10_underlayer/7_turtle-short_5_purple.png')
const turtleShort6 = require('../../assets/avatar/10_underlayer/7_turtle-short_6_darkblue.png')
const turtleShort7 = require('../../assets/avatar/10_underlayer/7_turtle-short_7_lightblue.png')
const turtleShort8 = require('../../assets/avatar/10_underlayer/7_turtle-short_8_darkyellow.png')
const turtleShort9 = require('../../assets/avatar/10_underlayer/7_turtle-short_9_lightyellow.png')
const turtleShort10 = require('../../assets/avatar/10_underlayer/7_turtle-short_10_green.png')
const turtleShort = [turtleShort1, turtleShort2, turtleShort3, turtleShort4, turtleShort5,
    turtleShort6, turtleShort7, turtleShort8, turtleShort9, turtleShort10]

const mesh1 = require('../../assets/avatar/10_underlayer/8_mesh_1_black.png')
const mesh2 = require('../../assets/avatar/10_underlayer/8_mesh_2_white.png')
const mesh3 = require('../../assets/avatar/10_underlayer/8_mesh_3_pink.png')
const mesh4 = require('../../assets/avatar/10_underlayer/8_mesh_4_red.png')
const mesh5 = require('../../assets/avatar/10_underlayer/8_mesh_5_purple.png')
const mesh6 = require('../../assets/avatar/10_underlayer/8_mesh_6_darkblue.png')
const mesh7 = require('../../assets/avatar/10_underlayer/8_mesh_7_lightblue.png')
const mesh8 = require('../../assets/avatar/10_underlayer/8_mesh_8_darkyellow.png')
const mesh9 = require('../../assets/avatar/10_underlayer/8_mesh_9_lightyellow.png')
const mesh10 = require('../../assets/avatar/10_underlayer/8_mesh_10_green.png')
const mesh = [mesh1, mesh2, mesh3, mesh4, mesh5, mesh6, mesh7, mesh8, mesh9, mesh10]

const turtleLong1 = require('../../assets/avatar/10_underlayer/9_turtle-long_1_black.png')
const turtleLong2 = require('../../assets/avatar/10_underlayer/9_turtle-long_2_white.png')
const turtleLong3 = require('../../assets/avatar/10_underlayer/9_turtle-long_3_pink.png')
const turtleLong4 = require('../../assets/avatar/10_underlayer/9_turtle-long_4_red.png')
const turtleLong5 = require('../../assets/avatar/10_underlayer/9_turtle-long_5_purple.png')
const turtleLong6 = require('../../assets/avatar/10_underlayer/9_turtle-long_6_darkblue.png')
const turtleLong7 = require('../../assets/avatar/10_underlayer/9_turtle-long_7_lightblue.png')
const turtleLong8 = require('../../assets/avatar/10_underlayer/9_turtle-long_8_darkyellow.png')
const turtleLong9 = require('../../assets/avatar/10_underlayer/9_turtle-long_9_lightyellow.png')
const turtleLong10 = require('../../assets/avatar/10_underlayer/9_turtle-long_10_green.png')
const turtleLong = [turtleLong1, turtleLong2, turtleLong3, turtleLong4, turtleLong5,
    turtleLong6, turtleLong7, turtleLong8, turtleLong9, turtleLong10]

const underlayerTypes = [uspag, tank, turtleSleeveless, widecut, vneck, tshirt, turtleShort, mesh, turtleLong]
//underlayercolors use outerwearColors

// ---------------------------------------- ACCESSORIES ----------------------------------------------
const accessoryChoker = require('../../assets/avatar/8_accessories/1_choker.png')
const accessoryPendant = require('../../assets/avatar/8_accessories/2_pendant.png')
const accessoryDogtag = require('../../assets/avatar/8_accessories/3_dogtags.png')
const accessoryTypes = [[unknown], [accessoryChoker], [accessoryPendant], [accessoryDogtag]]

// ------------------------------------HAIR ACCESSORIES ------------------------------------------
const ponytailRibbon1 = require('../../assets/avatar/17_hair_accessories/1_ponytail-ribbon_1_black.png')
const ponytailRibbon2 = require('../../assets/avatar/17_hair_accessories/1_ponytail-ribbon_2_white.png')
const ponytailRibbon3 = require('../../assets/avatar/17_hair_accessories/1_ponytail-ribbon_3_pink.png')
const ponytailRibbon4 = require('../../assets/avatar/17_hair_accessories/1_ponytail-ribbon_4_red.png')
const ponytailRibbon5 = require('../../assets/avatar/17_hair_accessories/1_ponytail-ribbon_5_purple.png')
const ponytailRibbon6 = require('../../assets/avatar/17_hair_accessories/1_ponytail-ribbon_6_darkblue.png')
const ponytailRibbon7 = require('../../assets/avatar/17_hair_accessories/1_ponytail-ribbon_7_lightblue.png')
const ponytailRibbon8 = require('../../assets/avatar/17_hair_accessories/1_ponytail-ribbon_8_darkyellow.png')
const ponytailRibbon9 = require('../../assets/avatar/17_hair_accessories/1_ponytail-ribbon_9_lightyellow.png')
const ponytailRibbon10 = require('../../assets/avatar/17_hair_accessories/1_ponytail-ribbon_10_green.png')
const ponytailRibbon = [ponytailRibbon1, ponytailRibbon2, ponytailRibbon3, ponytailRibbon4, ponytailRibbon5,
    ponytailRibbon6, ponytailRibbon7, ponytailRibbon8, ponytailRibbon9, ponytailRibbon10]

const hairAccessoryTypes = [[unknown], ponytailRibbon]
// same color as outerwearColors

// ---------------------------------------- BASE ----------------------------------------------
const baseColors = ['#FBE8D9', '#FFCDAA', '#C38168', '#75443D', '#3A231D']


// ---------------------------------------- OVERLAY  --------------------------------------------
const overlay1 = require('../../assets/avatar/19_BACKGROUND OVERLAY/1_darken-01.png')
const overlay2 = require('../../assets/avatar/19_BACKGROUND OVERLAY/2_grid-01.png')
const overlayTypes = [[overlay1], [overlay2]]

// ---------------------------------------- BACKGROUND  --------------------------------------------
const bg1 = require('../../assets/avatar/20_BACKGROUND/1_pink.png')
const bg2 = require('../../assets/avatar/20_BACKGROUND/2_orange.png')
const bg3 = require('../../assets/avatar/20_BACKGROUND/3_yellow.png')
const bg4 = require('../../assets/avatar/20_BACKGROUND/4_green.png')
const bg5 = require('../../assets/avatar/20_BACKGROUND/5_blue.png')
const bg6 = require('../../assets/avatar/20_BACKGROUND/6_purple.png')
const bg7 = require('../../assets/avatar/20_BACKGROUND/7_genderfluid.png')
const bg8 = require('../../assets/avatar/20_BACKGROUND/7_lgbtq.png')
const bg9 = require('../../assets/avatar/20_BACKGROUND/8_lesbian.png')
const bg10 = require('../../assets/avatar/20_BACKGROUND/8_nonbinary.png')
const bg11 = require('../../assets/avatar/20_BACKGROUND/9_agender.png')
const bg12 = require('../../assets/avatar/20_BACKGROUND/9_bisexual.png')
const bg13 = require('../../assets/avatar/20_BACKGROUND/10_genderqueer.png')
const bg14 = require('../../assets/avatar/20_BACKGROUND/10_pansexual.png')
const bg15 = require('../../assets/avatar/20_BACKGROUND/11_asexual.png')

const bgTypes = [[bg1], [bg2], [bg3], [bg4], [bg5], [bg6], [bg7], [bg8],
[bg9], [bg10], [bg11], [bg12], [bg13], [bg14], [bg15],]*/
//console.log("Dir is", DIR)

const colorView = ({ data, setCallback, select }) => {
    return (
        <View>
            < FlatList
                style={{ borderWidth: 1 }}
                horizontal={true}
                data={data}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item}
                renderItem={({ item, index }) => {
                    return (<View>
                        <TouchableOpacity
                            style={select(index) ? { padding: 5, backgroundColor: 'orange' } : { padding: 5, }}
                            onPress={() => { setCallback(index) }}>
                            <View style={[styles.preview, { backgroundColor: item }]}
                                source={item} />
                        </TouchableOpacity>
                    </View>
                    )
                }}
            />
        </View>
    )
}
const typeView = ({ data, setCallback, firstIsDisable = false,
    isActive = true, disableCallback = null, select }) => {
    return (
        <View>
            < FlatList
                style={{ borderWidth: 1 }}
                horizontal={true}
                data={data}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item}
                renderItem={({ item, index }) => {
                    return (<View>
                        <TouchableOpacity
                            style={(select(index) && isActive) || (!isActive && index == 0) ?
                                { padding: 5, backgroundColor: 'orange' } :
                                { padding: 5, }}
                            onPress={() => {
                                if (firstIsDisable && index == 0) {
                                    disableCallback(false)
                                } else {
                                    setCallback(index)
                                }
                            }}>
                            <Image
                                style={styles.preview}
                                source={item[0]} />

                        </TouchableOpacity>
                    </View>
                    )
                }}
            />

        </View>
    )
}

const EditAvatarScreen = ({ navigation }) => {
    const { width, height } = Dimensions.get('window')
    const [modalVisible, setModalVisible] = useState(false)
    const [activeMenu, setActiveMenu] = useState(1)
    const { state: userState, saveAvatar, fetchAvatarItemsOwned } = useContext(UserContext)
    const [hasOuterwear, setHasOuterwear] = useState(userState.hasItems.hasOuterwear)
    const [hasTop, setHasTop] = useState(userState.hasItems.hasTop)
    const [hasGlasses, setHasGlasses] = useState(userState.hasItems.hasGlasses)
    const [hasPiercings, setHasPiercings] = useState(userState.hasItems.hasPiercings)
    const [hasHairFront, setHasHairFront] = useState(userState.hasItems.hasHairFront)
    const [hasHairBack, setHasHairBack] = useState(userState.hasItems.hasHairBack)
    const [hasHairSide, setHasHairSide] = useState(userState.hasItems.hasHairSide)
    const [hasMakeup, setHasMakeup] = useState(userState.hasItems.hasMakeup)
    const [hasAccessories, setHasAccessories] = useState(userState.hasItems.hasAccessories)
    const [hasHairAccessories, setHasHairAccessories] = useState(userState.hasItems.hasHairAccessories)

    /*const [avatarItems, setAvatarItems] = useState(
        {
            face: { mouth: 0, eyes: 0, makeup: 0, eyebrows: 0, base: 0, },
            accessories: { glasses: 1, piercings: 1, accessories: 0 },
            clothing: { outerwear: 1, top: 1, under: 0, },
            hair: { front: 1, back: 1, side: 1, general: 0, },
            background: 0, overlay: 0,
        })
    const [avatarColors, setAvatarColors] = useState(
        {
            face: { mouth: 0, eyes: 0, eyebrows: 0, base: 0, },
            accessories: { piercings: 0 },
            clothing: { outerwear: 0, top: 0, under: 0, },
            hair: { front: 0, back: 0, side: 0, general: 0, },
            background: 0
        })*/

    const [avatarItems, setAvatarItems] = useState(userState.avatarItems)
    const [avatarColors, setAvatarColors] = useState(userState.avatarColors)
    const [avatarItemsOwned, setAvatarItemsOwned] = useState(userState.avatarItemsOwned)
    console.log("ITEMS:", avatarItems)
    console.log("COLORS:", avatarColors)


    const saveAvatarCallback = () => {
        console.log("AVATAR SUCCESSFULLY SAVED")
        //alert("Avatar successfully saved!")
    }

    const saveAvatarHelper = async () => {
        console.log("STARTING AVATAR SAVING")
        let hasItems = {
            hasOuterwear, hasTop, hasGlasses, hasPiercings, hasHairFront, hasHairBack,
            hasHairSide, hasMakeup, hasHairAccessories, hasAccessories,
        }
        await saveAvatar(avatarItems, avatarColors, hasItems, saveAvatarCallback)
    }

    const mouthSelectionColor = (id) => { return ((id == avatarColors.face.mouth) ? true : false) }
    const eyeSelectionColor = (id) => { return ((id == avatarColors.face.eyes) ? true : false) }
    const makeupSelectionColor = (id) => { return ((id == avatarColors.face.makeup) ? true : false) }
    const eyebrowSelectionColor = (id) => { return ((id == avatarColors.face.eyebrows) ? true : false) }
    const baseSelectionColor = (id) => { return ((id == avatarColors.face.base) ? true : false) }
    const piercingSelectionColor = (id) => { return ((id == avatarColors.accessories.piercings) ? true : false) }
    const outerwearSelectionColor = (id) => { return ((id == avatarColors.clothing.outerwear) ? true : false) }
    const hairAccessorySelectionColor = (id) => { return ((id == avatarColors.accessories.hairAccessories) ? true : false) }
    const topSelectionColor = (id) => { return ((id == avatarColors.clothing.top) ? true : false) }
    const underSelectionColor = (id) => { return ((id == avatarColors.clothing.under) ? true : false) }
    const hairGenSelectionColor = (id) => { return ((id == avatarColors.hair.general) ? true : false) }

    const eyeSelection = (id) => { return ((id == avatarItems.face.eyes) ? true : false) }
    const mouthSelection = (id) => { return ((id == avatarItems.face.mouth) ? true : false) }
    const makeupSelection = (id) => { return ((id == avatarItems.face.makeup) ? true : false) }
    const eyebrowSelection = (id) => { return ((id == avatarItems.face.eyebrows) ? true : false) }
    const baseSelection = (id) => { return ((id == avatarItems.face.base) ? true : false) }
    const glassesSelection = (id) => { return ((id == avatarItems.accessories.glasses) ? true : false) }
    const piercingSelection = (id) => { return ((id == avatarItems.accessories.piercings) ? true : false) }
    const accessorySelection = (id) => { return ((id == avatarItems.accessories.accessories) ? true : false) }
    const hairAccessorySelection = (id) => { return ((id == avatarItems.accessories.hairAccessories) ? true : false) }
    const outerwearSelection = (id) => { return ((id == avatarItems.clothing.outerwear) ? true : false) }
    const topSelection = (id) => { return ((id == avatarItems.clothing.top) ? true : false) }
    const underSelection = (id) => { return ((id == avatarItems.clothing.under) ? true : false) }
    const hairFrontSelection = (id) => { return ((id == avatarItems.hair.front) ? true : false) }
    const hairBackSelection = (id) => { return ((id == avatarItems.hair.back) ? true : false) }
    const hairSideSelection = (id) => { return ((id == avatarItems.hair.side) ? true : false) }
    const hairGenSelection = (id) => { return ((id == avatarItems.hair.general) ? true : false) }
    const bgSelection = (id) => { return ((id == avatarItems.background) ? true : false) }
    const overlaySelection = (id) => { return ((id == avatarItems.overlay) ? true : false) }

    const setBrowType = (browType) => {
        setAvatarItems({ ...avatarItems, face: { ...avatarItems.face, eyebrows: browType } })
    }
    const setBrowColor = (browColor) => {
        setAvatarColors({ ...avatarColors, face: { ...avatarColors.face, eyebrows: browColor } })
    }

    const setGlassesType = (glassesType) => {
        setHasGlasses(true)
        setAvatarItems({ ...avatarItems, accessories: { ...avatarItems.accessories, glasses: glassesType } })
    }
    const setAccessoryType = (accesoryType) => {
        setHasAccessories(true)
        setAvatarItems({ ...avatarItems, accessories: { ...avatarItems.accessories, accessories: accesoryType } })
    }

    const setHairAccessoryType = (accesoryType) => {
        setHasHairAccessories(true)
        setAvatarItems({ ...avatarItems, accessories: { ...avatarItems.accessories, hairAccessories: accesoryType } })
    }
    const setHairAccesoryColor = (accesoryColor) => {
        setAvatarColors({ ...avatarColors, accessories: { ...avatarColors.accessories, hairAccessories: accesoryColor } })
    }

    const setUnderColor = (underColor) => {
        setAvatarColors({ ...avatarColors, clothing: { ...avatarColors.clothing, under: underColor } })
    }
    const setUnderType = (underType) => {
        setAvatarItems({ ...avatarItems, clothing: { ...avatarItems.clothing, under: underType } })
    }

    const setTopColor = (topColor) => [
        setAvatarColors({ ...avatarColors, clothing: { ...avatarColors.clothing, top: topColor } })
    ]
    const setTopType = (topType) => {
        setHasTop(true)
        setAvatarItems({ ...avatarItems, clothing: { ...avatarItems.clothing, top: topType } })
    }

    const setOuterwearColor = (outerwearColor) => {
        setAvatarColors({ ...avatarColors, clothing: { ...avatarColors.clothing, outerwear: outerwearColor } })
    }

    const setOuterwearType = (outerwearType) => {
        setHasOuterwear(true)
        setAvatarItems({ ...avatarItems, clothing: { ...avatarItems.clothing, outerwear: outerwearType } })
    }

    const setEarColor = (earColor) => {
        setAvatarColors({ ...avatarColors, face: { ...avatarColors.face, ears: earColor } })
    }
    const setEyeColor = (eyeColor) => {
        setAvatarColors({ ...avatarColors, face: { ...avatarColors.face, eyes: eyeColor } })
    }
    const setEyeType = (eyeType) => {
        setAvatarItems({ ...avatarItems, face: { ...avatarItems.face, eyes: eyeType } })
    }
    const setMouthType = (mouthType) => {
        setAvatarItems({ ...avatarItems, face: { ...avatarItems.face, mouth: mouthType } })
    }
    const setMouthColor = (mouthColor) => {
        setAvatarColors({ ...avatarColors, face: { ...avatarColors.face, mouth: mouthColor } })
    }
    const setBaseColor = (baseColor) => {
        setAvatarColors({ ...avatarColors, face: { ...avatarColors.face, base: baseColor } })
    }
    const setPiercingType = (piercingType) => {
        setHasPiercings(true)
        setAvatarItems({ ...avatarItems, accessories: { ...avatarItems.accessories, piercings: piercingType } })
    }
    const setPiercingColor = (piercingColor) => {
        setAvatarColors({ ...avatarColors, accessories: { ...avatarColors.accessories, piercings: piercingColor } })
    }
    const setHairColor = (hairColor) => {
        setAvatarColors({
            ...avatarColors, hair: {
                ...avatarColors.hair, front: hairColor,
                back: hairColor, side: hairColor, general: hairColor
            }
        })
    }
    const setFrontHairType = (hairType) => {
        setHasHairFront(true)
        setAvatarItems({ ...avatarItems, hair: { ...avatarItems.hair, front: hairType } })
    }
    const setBackHairType = (hairType) => {
        setHasHairBack(true)
        setAvatarItems({ ...avatarItems, hair: { ...avatarItems.hair, back: hairType } })
    }
    const setSideHairType = (hairType) => {
        setHasHairSide(true)
        setAvatarItems({ ...avatarItems, hair: { ...avatarItems.hair, side: hairType } })
    }
    const setStdHairType = (hairType) => {
        setAvatarItems({ ...avatarItems, hair: { ...avatarItems.hair, general: hairType } })
    }
    const setBackgroundType = (backgroundType) => {
        setAvatarItems({ ...avatarItems, background: backgroundType })
    }
    const setMakeupType = (makeupType) => {
        setHasMakeup(true)
        setAvatarItems({ ...avatarItems, face: { ...avatarItems.face, makeup: makeupType } })
    }
    //console.log(avatarColors)

    //Images(hairbackUrl).draw(Images(flagpfpUrl), 0, 0).save("imagesTesting.png");
    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    const modalCallback = async () => {
        //await changeColorCategory(selectedCatId, chosenColorId)
    }

    return (
        <View style={{ flex: 1, }}>


            <Modal isVisible={modalVisible}
                animationIn='slideInLeft'
                animationOut='slideOutLeft'
                backdropTransitionOutTiming={0}>
                <AvatarCheckOutModal
                    selectedItems={avatarItems}
                    selectedColors={avatarColors}
                    itemsOn={
                        {
                            hasOuterwear, hasTop, hasGlasses, hasPiercings, hasHairFront, hasHairBack,
                            hasHairSide, hasMakeup, hasHairAccessories, hasAccessories,
                        }
                    }
                    ownedItems={userState.avatarItemsOwned}
                    toggleFunction={toggleModal}
                    callback={modalCallback} />
            </Modal>

            <Button title="Go back" onPress={() => { navigation.navigate('Profile') }} />
            <Image
                style={styles.default}
                source={DIR.bgTypes[avatarItems.background][0]} />
            {/*<Image
                style={styles.default}
                //source={overlayTypes[avatarItems.overlay][0]} />
    source={DIR.overlayTypes[0]} />*/}
            {hasHairBack ?
                <Image
                    style={styles.default}
                    source={DIR.backHairTypes[avatarItems.hair.back][avatarColors.hair.back]} /> : null}
            {hasHairAccessories ?
                <Image
                    style={styles.default}
                    source={DIR.hairAccessoryTypes[avatarItems.accessories.hairAccessories][avatarColors.accessories.hairAccessories]} /> : null}
            <Image
                style={styles.default}
                source={DIR.baseTypes[avatarColors.face.base]} />
            <Image
                style={styles.default}
                source={DIR.browTypes[avatarItems.face.eyebrows][avatarColors.face.eyebrows]} />
            {hasMakeup ?
                <Image
                    style={styles.default}
                    source={DIR.makeupTypes[avatarItems.face.makeup][0]} /> : null}
            <Image
                style={styles.default}
                source={DIR.eyeTypes[avatarItems.face.eyes][avatarColors.face.eyes]} />
            <Image
                style={styles.default}
                source={DIR.mouthTypes[avatarItems.face.mouth][avatarColors.face.mouth]} />
            <Image
                style={styles.default}
                source={DIR.underlayerTypes[avatarItems.clothing.under][avatarColors.clothing.under]} />
            {hasTop ?
                <Image
                    style={styles.default}
                    source={DIR.topTypes[avatarItems.clothing.top][avatarColors.clothing.top]} />
                : null}
            {hasAccessories ?
                <Image
                    style={styles.default}
                    source={DIR.accessoryTypes[avatarItems.accessories.accessories][0]} /> : null}
            {hasOuterwear ?
                <Image
                    style={styles.default}
                    source={DIR.outerwearTypes[avatarItems.clothing.outerwear][avatarColors.clothing.outerwear]} />
                : null}
            <Image
                style={styles.default}
                source={DIR.hairTypes[avatarItems.hair.general][avatarColors.hair.general]} />
            {hasHairSide ?
                <Image
                    style={styles.default}
                    source={DIR.hairSideTypes[avatarItems.hair.side][avatarColors.hair.side]} /> : null}
            {hasHairFront ?
                <Image
                    style={styles.default}
                    source={DIR.hairFrontTypes[avatarItems.hair.front][avatarColors.hair.front]} /> : null}
            <Image
                style={styles.default}
                source={DIR.earTypes[avatarColors.face.base]} />
            {hasPiercings ?
                <Image
                    style={styles.default}
                    source={DIR.piercingsTypes[avatarItems.accessories.piercings][avatarColors.accessories.piercings]} />
                : null}

            {hasGlasses ?
                <Image
                    style={styles.default}
                    source={DIR.glassesTypes[avatarItems.accessories.glasses][0]} />
                : null}

            <View style={{ marginTop: 320, height: 30 }}>
                <View style={{ flex: 1, flexDirection: 'row', }}>
                    <View
                        style={activeMenu == 1 ? styles.selected : styles.unselected}>
                        <TouchableOpacity
                            onPress={() => { setActiveMenu(1) }}>
                            <Text>Face</Text>
                        </TouchableOpacity>

                    </View>
                    <View style={activeMenu == 2 ? styles.selected : styles.unselected}>
                        <TouchableOpacity
                            onPress={() => { setActiveMenu(2) }}>
                            <Text>Hair</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={activeMenu == 3 ? styles.selected : styles.unselected}>
                        <TouchableOpacity
                            onPress={() => { setActiveMenu(3) }}>
                            <Text>Clothes</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={activeMenu == 4 ? styles.selected : styles.unselected}>
                        <TouchableOpacity
                            onPress={() => { setActiveMenu(4) }}>
                            <Text>Add-ons</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={activeMenu == 5 ? styles.selected : styles.unselected}>
                        <TouchableOpacity
                            onPress={() => { setActiveMenu(5) }}>
                            <Text>BG</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <View style={{ flex: 1, }}>
                <ScrollView style={{ padding: 10, marginBottom: 5, }}>
                    {/*Face */}
                    {activeMenu == 1 ?
                        <View>
                            <Text>Mouth</Text>
                            <Text>Pick mouth color</Text>
                            {colorView({ data: DIR.mouthColors, setCallback: setMouthColor, select: mouthSelectionColor })}
                            <Text>Pick mouth type</Text>
                            {typeView({ data: DIR.mouthTypes, setCallback: setMouthType, select: mouthSelection },)}

                            <Text>Eyes</Text>
                            <Text>Pick eye color</Text>
                            {colorView({ data: DIR.eyeColors, setCallback: setEyeColor, select: eyeSelectionColor },)}

                            <Text>Pick eye type</Text>
                            {typeView({ data: DIR.eyeTypes, setCallback: setEyeType, select: eyeSelection })}

                            <Text>Makeup</Text>
                            <Text>Pick makeup type</Text>
                            {typeView({
                                data: DIR.makeupTypes, setCallback: setMakeupType, select: makeupSelection, firstIsDisable: true,
                                isActive: hasMakeup, disableCallback: setHasMakeup, select: makeupSelection
                            })}

                            <Text>Eyebrows</Text>
                            <Text>Pick eyebrow color</Text>
                            {colorView({ data: DIR.hairFrontColors, setCallback: setBrowColor, select: eyebrowSelectionColor },)}

                            <Text>Pick eyebrow type</Text>
                            {typeView({ data: DIR.browTypes, setCallback: setBrowType, select: eyebrowSelection })}

                            <Text>base (skin color)</Text>
                            <Text>Pick body color</Text>
                            {colorView({ data: DIR.baseColors, setCallback: setBaseColor, select: baseSelectionColor })}
                        </View>
                        :
                        activeMenu == 2 ?
                            <View>
                                <Text>Pick hair</Text>
                                {colorView({ data: DIR.hairFrontColors, setCallback: setHairColor, select: hairGenSelectionColor },)}

                                <Text>Hair (general)</Text>

                                <Text>Pick hair type</Text>
                                {typeView({ data: DIR.hairTypes, setCallback: setStdHairType, select: hairGenSelection },)}

                                <Text>Hair (front)</Text>
                                <Text>Pick hair front type</Text>
                                {typeView({
                                    data: DIR.hairFrontTypes, setCallback: setFrontHairType, firstIsDisable: true,
                                    isActive: hasHairFront, disableCallback: setHasHairFront, select: hairFrontSelection
                                })}

                                <Text>Hair(side)</Text>
                                <Text>Pick hair side type</Text>
                                {typeView({
                                    data: DIR.hairSideTypes, setCallback: setSideHairType, firstIsDisable: true,
                                    isActive: hasHairSide, disableCallback: setHasHairSide, select: hairSideSelection
                                })}
                                <Text>Hair(back)</Text>

                                <Text>Pick hair back type</Text>
                                {typeView({
                                    data: DIR.backHairTypes, setCallback: setBackHairType, firstIsDisable: true,
                                    isActive: hasHairBack, disableCallback: setHasHairBack, select: hairBackSelection
                                })}
                            </View>


                            :
                            activeMenu == 3 ?
                                <View>
                                    <Text>Outerwear</Text>
                                    <Text>Pick outerwear color</Text>
                                    {colorView({ data: DIR.outerwearColors, setCallback: setOuterwearColor, select: outerwearSelectionColor },)}

                                    <Text>Pick outerwear type</Text>
                                    {typeView({
                                        data: DIR.outerwearTypes, setCallback: setOuterwearType, firstIsDisable: true,
                                        isActive: hasOuterwear, disableCallback: setHasOuterwear, select: outerwearSelection
                                    })}
                                    <Text>Top layer</Text>

                                    <Text>Pick top color</Text>
                                    {colorView({ data: DIR.outerwearColors, setCallback: setTopColor, select: topSelectionColor },)}

                                    <Text>Pick top type</Text>
                                    {typeView({
                                        data: DIR.topTypes, setCallback: setTopType, firstIsDisable: true,
                                        isActive: hasTop, disableCallback: setHasTop, select: topSelection
                                    })}

                                    <Text>Underlayer</Text>

                                    <Text>Pick underlayer color</Text>
                                    {colorView({ data: DIR.outerwearColors, setCallback: setUnderColor, select: underSelectionColor },)}

                                    <Text>Pick underlayer type</Text>
                                    {typeView({ data: DIR.underlayerTypes, setCallback: setUnderType, select: underSelection })}
                                </View>
                                :
                                activeMenu == 4 ?
                                    <View>
                                        <Text>Glasses</Text>

                                        <Text>Pick glasses type</Text>
                                        {typeView({
                                            data: DIR.glassesTypes, setCallback: setGlassesType, firstIsDisable: true,
                                            isActive: hasGlasses, disableCallback: setHasGlasses, select: glassesSelection
                                        })}

                                        <Text>Piercings</Text>

                                        <Text>Pick piercing color</Text>
                                        {colorView({ data: DIR.piercingsColors, setCallback: setPiercingColor, select: piercingSelectionColor })}

                                        <Text>Pick piercing type</Text>
                                        {typeView({
                                            data: DIR.piercingsTypes, setCallback: setPiercingType, firstIsDisable: true,
                                            isActive: hasPiercings, disableCallback: setHasPiercings, select: piercingSelection
                                        })}

                                        <Text>Accessories</Text>
                                        <Text>Pick accessory type</Text>
                                        {typeView({
                                            data: DIR.accessoryTypes, setCallback: setAccessoryType, firstIsDisable: true,
                                            isActive: hasAccessories, disableCallback: setHasAccessories, select: accessorySelection
                                        })}

                                        <Text>Hair Accessories</Text>
                                        <Text>Pick Hair Accessory color</Text>
                                        {colorView({ data: DIR.outerwearColors, setCallback: setHairAccesoryColor, select: hairAccessorySelectionColor })}


                                        <Text>Pick hair accessory type</Text>
                                        {typeView({
                                            data: DIR.hairAccessoryTypes, setCallback: setHairAccessoryType, firstIsDisable: true,
                                            isActive: hasHairAccessories, disableCallback: setHasHairAccessories, select: hairAccessorySelection
                                        })}
                                    </View>
                                    :
                                    <View>
                                        <Text>Background</Text>
                                        {typeView({ data: DIR.bgTypes, setCallback: setBackgroundType, select: bgSelection })}
                                    </View>
                    }


                </ScrollView>
            </View>
            <Button onPress={() => { saveAvatarHelper() }} title="Save selection" />
            {/*<Button onPress={toggleModal} title="Save selection" />*/}
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        margin: 30,
        fontSize: 40,
    },
    default: {
        width: 300, height: 300, position: 'absolute', marginTop: 50, marginLeft: 50
    },
    preview: {
        borderWidth: 1, width: 40, height: 40, borderRadius: 100,
    },
    unselected: { flex: 1, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
    selected: { flex: 1, borderWidth: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'yellow', }
})

export default EditAvatarScreen;