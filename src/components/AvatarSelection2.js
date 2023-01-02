
import Logo from '../../assets/image2vector.svg';
import { StyleSheet } from 'react-native';

/* 2_piercings */
import Piercing1 from '../../assets/avatar_svg/2_piercings/piercing_1.svg'
import Piercing2 from '../../assets/avatar_svg/2_piercings/piercing_2.svg'
import Piercing3 from '../../assets/avatar_svg/2_piercings/piercing_3.svg'
import Piercing4 from '../../assets/avatar_svg/2_piercings/piercing_4.svg'
import Piercing5 from '../../assets/avatar_svg/2_piercings/piercing_5.svg'
import Piercing6 from '../../assets/avatar_svg/2_piercings/piercing_6.svg'
import Piercing7 from '../../assets/avatar_svg/2_piercings/piercing_7.svg'


/* 4_hair_front */
import Hairfront1 from '../../assets/avatar_svg/4_hair_front/1_bangs-part_1.svg'
import Hairfront2 from '../../assets/avatar_svg/4_hair_front/2_bangs-full_1.svg'
import Hairfront3 from '../../assets/avatar_svg/4_hair_front/3_midpart_1.svg'

/* 5_hair_side */
import Hairside1 from '../../assets/avatar_svg/5_hair_side/1_sideburn_1.svg'
import Hairside2 from '../../assets/avatar_svg/5_hair_side/2_coversneck_1.svg'

/* 7_outerwear */
import Outerwear1 from '../../assets/avatar_svg/7_outerwear/1_bomber_1.svg'

/* 8_accessories */
import Accessories1 from '../../assets/avatar_svg/8_accessories/accessories_1.svg'
import Accessories2 from '../../assets/avatar_svg/8_accessories/accessories_2.svg'
import Accessories3 from '../../assets/avatar_svg/8_accessories/accessories_3.svg'

/* 9 top */
import Top1 from '../../assets/avatar_svg/9_top/1_overalls_1.svg'
import Top3 from '../../assets/avatar_svg/9_top/3_spaghetti_1.svg'

/* 10 underlayer */
import Underlayer1 from '../../assets/avatar_svg/10_underlayer/1_spaghetti_1.svg'
import Underlayer2 from '../../assets/avatar_svg/10_underlayer/2_tank_1.svg'
import Underlayer3 from '../../assets/avatar_svg/10_underlayer/3_turtlesleeveless_1.svg'
import Underlayer4 from '../../assets/avatar_svg/10_underlayer/4_widecut_1.svg'
import Underlayer5 from '../../assets/avatar_svg/10_underlayer/5_vneck_1.svg'
import Underlayer6 from '../../assets/avatar_svg/10_underlayer/6_tshirt_1.svg'
import Underlayer7 from '../../assets/avatar_svg/10_underlayer/7_turtle-short_1.svg'
import Underlayer9 from '../../assets/avatar_svg/10_underlayer/9_turtle-long_1.svg'

/* 11 mouth */
import Mouth1 from '../../assets/avatar_svg/11_mouth/1_pressed_1.svg'
import Mouth2 from '../../assets/avatar_svg/11_mouth/2_lipstick_1.svg'
import Mouth3 from '../../assets/avatar_svg/11_mouth/3_lipstick-smile_1.svg'

/* 13 eye makeup*/
import EyeMakeup1 from '../../assets/avatar_svg/13_eye_makeup/eye_makeup_1.svg'

/* 15 eyebrows*/
import Eyebrows1 from '../../assets/avatar_svg/15_eyebrows/1_neutral-thick_1.svg'
import Eyebrows2 from '../../assets/avatar_svg/15_eyebrows/2_neutral-thin_1.svg'

/* 16 base */
import Base1 from '../../assets/avatar_svg/16_base/base_1.svg'
import Base2 from '../../assets/avatar_svg/16_base/base_2.svg'
import Base3 from '../../assets/avatar_svg/16_base/base_3.svg'
import Base4 from '../../assets/avatar_svg/16_base/base_4.svg'
import Base5 from '../../assets/avatar_svg/16_base/base_5.svg'

/* 17 hair accessories*/
import HairAccessories1 from '../../assets/avatar_svg/17_hair_accessories/1_ponytail-ribbon_1.svg'

/* 18 hair back */
import Hairback1 from '../../assets/avatar_svg/18_hair_back/2_ponytail-fluffy_1.svg'
import Hairback2 from '../../assets/avatar_svg/18_hair_back/3_down-fluffy_1.svg'

/* 20 background */
import Bg1 from '../../assets/avatar_svg/20_background/bg_1.svg'

import Bg1_1 from '../../assets/avatar_svg/20_background/bg_1_1.svg'
import Bg1_2 from '../../assets/avatar_svg/20_background/bg_1_2.svg'
import Bg1_3 from '../../assets/avatar_svg/20_background/bg_1_3.svg'
import Bg1_4 from '../../assets/avatar_svg/20_background/bg_1_4.svg'
import Bg1_5 from '../../assets/avatar_svg/20_background/bg_1_5.svg'

import Bg2_1 from '../../assets/avatar_svg/20_background/bg_2_1.svg'
import Bg2 from '../../assets/avatar_svg/20_background/bg_2.svg'
import Bg3 from '../../assets/avatar_svg/20_background/bg_3.svg'
import Bg4 from '../../assets/avatar_svg/20_background/bg_4.svg'
import Bg5 from '../../assets/avatar_svg/20_background/bg_5.svg'
import Bg6 from '../../assets/avatar_svg/20_background/bg_6.svg'
import Bg7 from '../../assets/avatar_svg/20_background/bg_7.svg'
/* have these be locked */
import Bg8 from '../../assets/avatar_svg/20_background/bg_8.svg'
import Bg9 from '../../assets/avatar_svg/20_background/bg_9.svg'
import Bg10 from '../../assets/avatar_svg/20_background/bg_10.svg'

import NoItem_svg from '../../assets/avatar_svg/no_item.svg'

const SvgTestScreen2 = () => {

    return (<Logo style={styles.svgDefault} fill={"#000000"} fillSecondary="#000000" />)
}

/* =========================== 2_piercings ============================= */
const Piercing1_svg = ({ colorFill, len }) => {
    return (<Piercing1 style={styles.svgDefault} fill={colorFill} width={len} height={len} />)
}
const Piercing2_svg = ({ colorFill, len }) => {
    return (<Piercing2 style={styles.svgDefault} fill={colorFill} width={len} height={len} />)
}
const Piercing3_svg = ({ colorFill, len }) => {
    return (<Piercing3 style={styles.svgDefault} fill={colorFill} width={len} height={len} />)
}
const Piercing4_svg = ({ colorFill, len }) => {
    return (<Piercing4 style={styles.svgDefault} fill={colorFill} width={len} height={len} />)
}
const Piercing5_svg = ({ colorFill, len }) => {
    return (<Piercing5 style={styles.svgDefault} fill={colorFill} width={len} height={len} />)
}
const Piercing6_svg = ({ colorFill, len }) => {
    return (<Piercing6 style={styles.svgDefault} fill={colorFill} width={len} height={len} />)
}
const Piercing7_svg = ({ colorFill, len }) => {
    return (<Piercing7 style={styles.svgDefault} fill={colorFill} width={len} height={len} />)
}


/* =========================== 4_hair_front ============================= */
const Hairfront1_svg = ({ colorFill, len }) => {
    return (<Hairfront1 style={styles.svgDefault} fill={colorFill} width={len} height={len} />)
}
const Hairfront2_svg = ({ colorFill, len }) => {
    return (<Hairfront2 style={styles.svgDefault} fill={colorFill} width={len} height={len} />)
}
const Hairfront3_svg = ({ colorFill, len }) => {
    return (<Hairfront3 style={styles.svgDefault} fill={colorFill} width={len} height={len} />)
}

/* =========================== 5_hair_side ============================= */

const Hairside1_svg = ({ colorFill, len }) => {
    return (<Hairside1 style={styles.svgDefault} fill={colorFill} width={len} height={len} />)
}
const Hairside2_svg = ({ colorFill, len }) => {
    return (<Hairside2 style={styles.svgDefault} fill={colorFill} width={len} height={len} />)
}

/* =========================== 7_outerwear ============================= */
const Outerwear1_svg = ({ colorFill, len }) => {
    return (<Outerwear1 style={styles.svgDefault} fill={colorFill} width={len} height={len} />)
}

/* =========================== 8_accessories ============================= */
const Accessories1_svg = ({ colorFill, len }) => {
    return (<Accessories1 style={styles.svgDefault} fill={colorFill} width={len} height={len} />)
}
const Accessories2_svg = ({ colorFill, len }) => {
    return (<Accessories2 style={styles.svgDefault} fill={colorFill} width={len} height={len} />)
}
const Accessories3_svg = ({ colorFill, len }) => {
    return (<Accessories3 style={styles.svgDefault} fill={colorFill} width={len} height={len} />)
}



/* =========================== 9_top ============================= */
const Top1_svg = ({ colorFill, len }) => {
    return (<Top1 style={styles.svgDefault} fill={colorFill} width={len} height={len} />)
}
const Top3_svg = ({ colorFill, len }) => {
    return (<Top3 style={styles.svgDefault} fill={colorFill} width={len} height={len} />)
}

/* =========================== 10_underlayer ============================= */
const Underlayer1_svg = ({ colorFill, len }) => {
    return (<Underlayer1 style={styles.svgDefault} fill={colorFill} width={len} height={len} />)
}
const Underlayer2_svg = ({ colorFill, len }) => {
    return (<Underlayer2 style={styles.svgDefault} fill={colorFill} width={len} height={len} />)
}
const Underlayer3_svg = ({ colorFill, len }) => {
    return (<Underlayer3 style={styles.svgDefault} fill={colorFill} width={len} height={len} />)
}
const Underlayer4_svg = ({ colorFill, len }) => {
    return (<Underlayer4 style={styles.svgDefault} fill={colorFill} width={len} height={len} />)
}
const Underlayer5_svg = ({ colorFill, len }) => {
    return (<Underlayer5 style={styles.svgDefault} fill={colorFill} width={len} height={len} />)
}
const Underlayer6_svg = ({ colorFill, len }) => {
    return (<Underlayer6 style={styles.svgDefault} fill={colorFill} width={len} height={len} />)
}
const Underlayer7_svg = ({ colorFill, len }) => {
    return (<Underlayer7 style={styles.svgDefault} fill={colorFill} width={len} height={len} />)
}
const Underlayer9_svg = ({ colorFill, len }) => {
    return (<Underlayer9 style={styles.svgDefault} fill={colorFill} width={len} height={len} />)
}

/* =========================== 11_mouth ============================= */
const Mouth1_svg = ({ colorFill, len }) => {
    return (<Mouth1 style={styles.svgDefault} fill={colorFill} width={len} height={len} />)
}
const Mouth2_svg = ({ colorFill, len }) => {
    return (<Mouth2 style={styles.svgDefault} fill={colorFill} width={len} height={len} />)
}
const Mouth3_svg = ({ colorFill, len }) => {
    return (<Mouth3 style={styles.svgDefault} fill={colorFill} width={len} height={len} />)
}

/* =========================== 13_eye_makeup ============================= */
const EyeMakeup1_svg = ({ colorFill, len }) => {
    return (<EyeMakeup1 style={styles.svgDefault} fill={colorFill} width={len} height={len} />)
}

/* =========================== 15_eyebrows ============================= */
const Eyebrows1_svg = ({ colorFill, len }) => {
    return (<Eyebrows1 style={styles.svgDefault} fill={colorFill} width={len} height={len} />)
}
const Eyebrows2_svg = ({ colorFill, len }) => {
    return (<Eyebrows2 style={styles.svgDefault} fill={colorFill} width={len} height={len} />)
}

/* =========================== 16_base ============================= */
const Base1_svg = ({ colorFill, len }) => {
    return (<Base1 style={styles.svgDefault} fill={colorFill} width={len} height={len} />)
}
const Base2_svg = ({ colorFill, len }) => {
    return (<Base2 style={styles.svgDefault} fill={colorFill} width={len} height={len} />)
}
const Base3_svg = ({ colorFill, len }) => {
    return (<Base3 style={styles.svgDefault} fill={colorFill} width={len} height={len} />)
}
const Base4_svg = ({ colorFill, len }) => {
    return (<Base4 style={styles.svgDefault} fill={colorFill} width={len} height={len} />)
}
const Base5_svg = ({ colorFill, len }) => {
    return (<Base5 style={styles.svgDefault} fill={colorFill} width={len} height={len} />)
}


/* =========================== 17_hair_accessories ============================= */
const HairAccessories1_svg = ({ colorFill, len }) => {
    return (<HairAccessories1 style={styles.svgDefault} fill={colorFill} width={len} height={len} />)
}

/* =========================== 18_hair_back ============================= */
const Hairback1_svg = ({ colorFill, len }) => {
    return (<Hairback1 style={styles.svgDefault} fill={colorFill} width={len} height={len} />)
}
const Hairback2_svg = ({ colorFill, len }) => {
    return (<Hairback2 style={styles.svgDefault} fill={colorFill} width={len} height={len} />)
}


/* =========================== 20_background ============================= */

/* 6 solid color ones, 10 striped ones */

const Bg1_svg = ({ colorFill, len }) => {
    return (<Bg1 style={styles.svgDefault} fill={colorFill} width={len} height={len} />)
}
const Bg1_1_svg = ({ colorFill, len }) => {
    return (<Bg1_1 style={styles.svgDefault} fill={colorFill} width={len} height={len} />)
}
const Bg1_2_svg = ({ colorFill, len }) => {
    return (<Bg1_2 style={styles.svgDefault} fill={colorFill} width={len} height={len} />)
}
const Bg1_3_svg = ({ colorFill, len }) => {
    return (<Bg1_3 style={styles.svgDefault} fill={colorFill} width={len} height={len} />)
}
const Bg1_4_svg = ({ colorFill, len }) => {
    return (<Bg1_4 style={styles.svgDefault} fill={colorFill} width={len} height={len} />)
}
const Bg1_5_svg = ({ colorFill, len }) => {
    return (<Bg1_5 style={styles.svgDefault} fill={colorFill} width={len} height={len} />)
}

/* ========================================== */

const Bg2_svg = ({ colorFill, len }) => {
    return (<Bg2 style={styles.svgDefault} fill={colorFill} width={len} height={len} />)
}
const Bg2_1_svg = ({ colorFill, len }) => {
    return (<Bg2_1 style={styles.svgDefault} fill={colorFill} width={len} height={len} />)
}
const Bg3_svg = ({ colorFill, len }) => {
    return (<Bg3 style={styles.svgDefault} fill={colorFill} width={len} height={len} />)
}
const Bg4_svg = ({ colorFill, len }) => {
    return (<Bg4 style={styles.svgDefault} fill={colorFill} width={len} height={len} />)
}
const Bg5_svg = ({ colorFill, len }) => {
    return (<Bg5 style={styles.svgDefault} fill={colorFill} width={len} height={len} />)
}
const Bg6_svg = ({ colorFill, len }) => {
    return (<Bg6 style={styles.svgDefault} fill={colorFill} width={len} height={len} />)
}
const Bg7_svg = ({ colorFill, len }) => {
    return (<Bg7 style={styles.svgDefault} fill={colorFill} width={len} height={len} />)
}
const Bg8_svg = ({ colorFill, len }) => {
    return (<Bg8 style={styles.svgDefault} fill={colorFill} width={len} height={len} />)
}
const Bg9_svg = ({ colorFill, len }) => {
    return (<Bg9 style={styles.svgDefault} fill={colorFill} width={len} height={len} />)
}
const Bg10_svg = ({ colorFill, len }) => {
    return (<Bg10 style={styles.svgDefault} fill={colorFill} width={len} height={len} />)
}

const NoItem1_svg = ({ colorFill, len }) => {
    return (<NoItem_svg style={styles.svgDefault} fill={colorFill} width={len} height={len} />)
}


const styles = StyleSheet.create({
    svgDefault: {
    },
})

module.exports = {
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
    NoItem1_svg
}
//export default SvgTestScreen2;