
import Logo from '../../assets/image2vector.svg';
import { StyleSheet } from 'react-native';

/* 2_piercings */
import Piercing1 from '../../assets/avatar_thumbnail/2_piercings/piercing_1.svg'
import Piercing2 from '../../assets/avatar_thumbnail/2_piercings/piercing_2.svg'
import Piercing3 from '../../assets/avatar_thumbnail/2_piercings/piercing_3.svg'
import Piercing4 from '../../assets/avatar_thumbnail/2_piercings/piercing_4.svg'
import Piercing5 from '../../assets/avatar_thumbnail/2_piercings/piercing_5.svg'
import Piercing6 from '../../assets/avatar_thumbnail/2_piercings/piercing_6.svg'
import Piercing7 from '../../assets/avatar_thumbnail/2_piercings/piercing_7.svg'

/* 11 mouth */
import Mouth1 from '../../assets/avatar_thumbnail/11_mouth/mouth_1.svg'
import Mouth2 from '../../assets/avatar_thumbnail/11_mouth/mouth_2.svg'
import Mouth3 from '../../assets/avatar_thumbnail/11_mouth/mouth_3.svg'

/* 13 eye makeup */
import EyeMakeup1 from '../../assets/avatar_thumbnail/13_eye_makeup/eye_makeup1.svg'

/* 15 eyebrows*/
import Eyebrows1 from '../../assets/avatar_thumbnail/15_eyebrows/eyebrows_1.svg'
import Eyebrows2 from '../../assets/avatar_thumbnail/15_eyebrows/eyebrows_2.svg'

import NoItem_svg from '../../assets/avatar_svg/no_item.svg'

/* =========================== 2_piercings ============================= */
const Piercing1_thumbnail_svg = ({ colorFill, len }) => {
    return (<Piercing1 style={styles.svgDefault} fill={colorFill} width={len} height={len} />)
}
const Piercing2_thumbnail_svg = ({ colorFill, len }) => {
    return (<Piercing2 style={styles.svgDefault} fill={colorFill} width={len} height={len} />)
}
const Piercing3_thumbnail_svg = ({ colorFill, len }) => {
    return (<Piercing3 style={styles.svgDefault} fill={colorFill} width={len} height={len} />)
}
const Piercing4_thumbnail_svg = ({ colorFill, len }) => {
    return (<Piercing4 style={styles.svgDefault} fill={colorFill} width={len} height={len} />)
}
const Piercing5_thumbnail_svg = ({ colorFill, len }) => {
    return (<Piercing5 style={styles.svgDefault} fill={colorFill} width={len} height={len} />)
}
const Piercing6_thumbnail_svg = ({ colorFill, len }) => {
    return (<Piercing6 style={styles.svgDefault} fill={colorFill} width={len} height={len} />)
}
const Piercing7_thumbnail_svg = ({ colorFill, len }) => {
    return (<Piercing7 style={styles.svgDefault} fill={colorFill} width={len} height={len} />)
}


/* =========================== 11_mouth ============================= */

const Mouth1_thumbnail_svg = ({ colorFill, len }) => {
    return (<Mouth1 style={styles.svgDefault} fill={colorFill} width={len} height={len} />)
}
const Mouth2_thumbnail_svg = ({ colorFill, len }) => {
    return (<Mouth2 style={styles.svgDefault} fill={colorFill} width={len} height={len} />)
}
const Mouth3_thumbnail_svg = ({ colorFill, len }) => {
    return (<Mouth3 style={styles.svgDefault} fill={colorFill} width={len} height={len} />)
}
/* =========================== 13_eye_makeup ============================= */
const EyeMakeup1_thumbnail_svg = ({ colorFill, len }) => {
    return (<EyeMakeup1 style={styles.svgDefault} fill={colorFill} width={len} height={len} />)
}

/* =========================== 15_eyebrows ============================= */
const Eyebrows1_thumbnail_svg = ({ colorFill, len }) => {
    return (<Eyebrows1 style={styles.svgDefault} fill={colorFill} width={len} height={len} />)
}
const Eyebrows2_thumbnail_svg = ({ colorFill, len }) => {
    return (<Eyebrows2 style={styles.svgDefault} fill={colorFill} width={len} height={len} />)
}


const NoItem1_svg = ({ colorFill, len }) => {
    return (<NoItem_svg style={styles.svgDefault} fill={colorFill} width={len} height={len} />)
}


const styles = StyleSheet.create({
    svgDefault: {
    },
})

module.exports = {
    Piercing1_thumbnail_svg, Piercing2_thumbnail_svg, Piercing3_thumbnail_svg, Piercing4_thumbnail_svg, Piercing5_thumbnail_svg, Piercing6_thumbnail_svg, Piercing7_thumbnail_svg,
    Mouth1_thumbnail_svg, Mouth2_thumbnail_svg, Mouth3_thumbnail_svg,
    Eyebrows1_thumbnail_svg, Eyebrows2_thumbnail_svg,
    EyeMakeup1_thumbnail_svg,
    NoItem1_svg
}
//export default SvgTestScreen2;