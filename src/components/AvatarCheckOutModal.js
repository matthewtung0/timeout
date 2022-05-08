import React, { useRef, useState, useCallback, useContext } from 'react';
import { View, StyleSheet, Text, Button, Image } from 'react-native';
const constants = require('../components/constants.json')
import * as DIR from '../components/AvatarSelection';
import { useFocusEffect } from '@react-navigation/native';
import { Context as UserContext } from '../context/userContext';

const AvatarCheckOutModal = ({ selectedItems, selectedColors, toggleFunction, ownedItems, itemsOn, callback }) => {
    let freeItems = constants.avatarItemsFree
    const [nonOwnedItems, setNonOwnedItems] = useState([])
    const { purchaseItems } = useContext(UserContext)
    const [anyUnowned, setAnyUnowned] = useState({
        'mouth': false, 'base': false, 'eyebrows': false, 'eyes': false, 'makeup': false,
        'back': false, 'front': false, 'general': false, 'side': false, 'accessories': false, 'hairAccessories': false, 'piercings': false, 'glasses': false,
        'background': false, 'outerwear': false, 'top': false, 'under': false
    })

    // buy unowned items and set avatar
    const purchaseItemsHelper = async () => {
        await purchaseItems(nonOwnedItems, resetStuff)
    }

    const resetStuff = () => {
        console.log("avatar items owned", ownedItems)
        checkEquippedItems()
    }


    // check if equipped items are either owned or free, if not need to prompt user to buy
    const checkEquippedItems = () => {
        var nonOwnedItems = []
        setAnyUnowned({
            'mouth': false, 'base': false, 'eyebrows': false, 'eyes': false, 'makeup': false,
            'back': false, 'front': false, 'general': false, 'side': false, 'accessories': false, 'hairAccessories': false, 'piercings': false, 'glasses': false,
            'background': false, 'outerwear': false, 'top': false, 'under': false
        })
        if (!freeItems.face.mouth.includes(selectedItems.face.mouth) && !ownedItems.face.mouth.includes(selectedItems.face.mouth)) {
            nonOwnedItems.push({ 'item_cat_lvl_1': 'face', 'item_cat_lvl_2': 'mouth', 'item_id': selectedItems.face.mouth })
            setAnyUnowned({ ...anyUnowned, 'mouth': true })
        }
        if (!freeItems.face.base.includes(selectedItems.face.base) && !ownedItems.face.base.includes(selectedItems.face.base)) {
            nonOwnedItems.push({ 'item_cat_lvl_1': 'face', 'item_cat_lvl_2': 'base', 'item_id': selectedItems.face.base })
            setAnyUnowned({ ...anyUnowned, 'base': true })
        }
        if (!freeItems.face.eyebrows.includes(selectedItems.face.eyebrows) && !ownedItems.face.eyebrows.includes(selectedItems.face.eyebrows)) {
            nonOwnedItems.push({ 'item_cat_lvl_1': 'face', 'item_cat_lvl_2': 'eyebrows', 'item_id': selectedItems.face.eyebrows })
            setAnyUnowned({ ...anyUnowned, 'eyebrows': true })
        }
        if (!freeItems.face.eyes.includes(selectedItems.face.eyes) && !ownedItems.face.eyes.includes(selectedItems.face.eyes)) {
            nonOwnedItems.push({ 'item_cat_lvl_1': 'face', 'item_cat_lvl_2': 'eyes', 'item_id': selectedItems.face.eyes })
            setAnyUnowned({ ...anyUnowned, 'eyes': true })
        }
        if (!freeItems.face.makeup.includes(selectedItems.face.makeup) && !ownedItems.face.makeup.includes(selectedItems.face.makeup)) {
            nonOwnedItems.push({ 'item_cat_lvl_1': 'face', 'item_cat_lvl_2': 'makeup', 'item_id': selectedItems.face.makeup })
            setAnyUnowned({ ...anyUnowned, 'makeup': true })
        }
        if (!freeItems.hair.back.includes(selectedItems.hair.back) && !ownedItems.hair.back.includes(selectedItems.hair.back)) {
            nonOwnedItems.push({ 'item_cat_lvl_1': 'hair', 'item_cat_lvl_2': 'back', 'item_id': selectedItems.hair.back })
            setAnyUnowned({ ...anyUnowned, 'back': true })
        }
        if (!freeItems.hair.front.includes(selectedItems.hair.front) && !ownedItems.hair.front.includes(selectedItems.hair.front)) {
            nonOwnedItems.push({ 'item_cat_lvl_1': 'hair', 'item_cat_lvl_2': 'front', 'item_id': selectedItems.hair.front })
            setAnyUnowned({ ...anyUnowned, 'front': true })
        }
        if (!freeItems.hair.general.includes(selectedItems.hair.general) && !ownedItems.hair.general.includes(selectedItems.hair.general)) {
            nonOwnedItems.push({ 'item_cat_lvl_1': 'hair', 'item_cat_lvl_2': 'general', 'item_id': selectedItems.hair.general })
            setAnyUnowned({ ...anyUnowned, 'general': true })
        }
        if (!freeItems.hair.side.includes(selectedItems.hair.side) && !ownedItems.hair.side.includes(selectedItems.hair.side)) {
            nonOwnedItems.push({ 'item_cat_lvl_1': 'hair', 'item_cat_lvl_2': 'side', 'item_id': selectedItems.hair.side })
            setAnyUnowned({ ...anyUnowned, 'side': true })
        }
        if (!freeItems.accessories.accessories.includes(selectedItems.accessories.accessories) && !ownedItems.accessories.accessories.includes(selectedItems.accessories.accessories)) {
            nonOwnedItems.push({ 'item_cat_lvl_1': 'accessories', 'item_cat_lvl_2': 'accessories', 'item_id': selectedItems.accessories.accessories })
            setAnyUnowned({ ...anyUnowned, 'accessories': true })
        }
        if (!freeItems.accessories.hairAccessories.includes(selectedItems.accessories.hairAccessories) && !ownedItems.accessories.hairAccessories.includes(selectedItems.accessories.hairAccessories)) {
            nonOwnedItems.push({ 'item_cat_lvl_1': 'accessories', 'item_cat_lvl_2': 'hairAccessories', 'item_id': selectedItems.accessories.hairAccessories })
            setAnyUnowned({ ...anyUnowned, 'hairAccessories': true })
        }
        if (!freeItems.accessories.piercings.includes(selectedItems.accessories.piercings) && !ownedItems.accessories.piercings.includes(selectedItems.accessories.piercings)) {
            nonOwnedItems.push({ 'item_cat_lvl_1': 'accessories', 'item_cat_lvl_2': 'piercings', 'item_id': selectedItems.accessories.piercings })
            setAnyUnowned({ ...anyUnowned, 'piercings': true })
        }
        if (!freeItems.accessories.glasses.includes(selectedItems.accessories.glasses) && !ownedItems.accessories.glasses.includes(selectedItems.accessories.glasses)) {
            nonOwnedItems.push({ 'item_cat_lvl_1': 'accessories', 'item_cat_lvl_2': 'glasses', 'item_id': selectedItems.accessories.glasses })
            setAnyUnowned({ ...anyUnowned, 'glasses': true })
        }
        if (!freeItems.background.includes(selectedItems.background) && !ownedItems.background.includes(selectedItems.background)) {
            nonOwnedItems.push({ 'item_cat_lvl_1': 'background', 'item_cat_lvl_2': '', 'item_id': selectedItems.background })
            setAnyUnowned({ ...anyUnowned, 'background': true })
        }

        if (!freeItems.clothing.outerwear.includes(selectedItems.clothing.outerwear) && !ownedItems.clothing.outerwear.includes(selectedItems.clothing.outerwear)) {
            nonOwnedItems.push({ 'item_cat_lvl_1': 'clothing', 'item_cat_lvl_2': 'outerwear', 'item_id': selectedItems.clothing.outerwear })
            setAnyUnowned({ ...anyUnowned, 'outerwear': true })
        }
        if (!freeItems.clothing.top.includes(selectedItems.clothing.top) && !ownedItems.clothing.top.includes(selectedItems.clothing.top)) {
            nonOwnedItems.push({ 'item_cat_lvl_1': 'clothing', 'item_cat_lvl_2': 'top', 'item_id': selectedItems.clothing.top })
            setAnyUnowned({ ...anyUnowned, 'top': true })
        }
        if (!freeItems.clothing.under.includes(selectedItems.clothing.under) && !ownedItems.clothing.under.includes(selectedItems.clothing.under)) {
            nonOwnedItems.push({ 'item_cat_lvl_1': 'clothing', 'item_cat_lvl_2': 'under', 'item_id': selectedItems.clothing.under })
            setAnyUnowned({ ...anyUnowned, 'under': true })
        }
        /*if (!freeItems.overlay.includes(selectedItems.overlay)) {
            nonOwnedItems.push({ 'item_cat_lvl_1': overlay, 'item_cat_lvl_2': '', 'item_id': selectedItems.overlay })
        }*/
        setNonOwnedItems(nonOwnedItems)

    }

    useFocusEffect(
        useCallback(() => {
            checkEquippedItems()
            console.log("any unowned", anyUnowned)
        }, [])
    )



    return (
        <View style={styles.container}>
            <Button onPress={toggleFunction} title="Cancel"></Button>
            <Text>Items:</Text>
            <Text>{JSON.stringify(selectedItems)}</Text>
            <Text>Owned items:</Text>
            <Text>{JSON.stringify(ownedItems)}</Text>

            <Text>You've equipped these items but you don't own them:</Text>

            {anyUnowned.background ?
                <Image
                    style={styles.default}
                    source={DIR.bgTypes[selectedItems.background][0]} /> : null}

            {anyUnowned.back ?
                <Image
                    style={styles.default}
                    source={DIR.backHairTypes[selectedItems.hair.back][selectedColors.hair.back]} /> : null}

            {anyUnowned.hairAccessories ?
                <Image
                    style={styles.default}
                    source={DIR.hairAccessoryTypes[selectedItems.accessories.hairAccessories][selectedColors.accessories.hairAccessories]} /> : null}

            {anyUnowned.base ?
                <Image
                    style={styles.default}
                    source={DIR.baseTypes[selectedColors.face.base]} /> : null}

            {anyUnowned.eyebrows ?
                <Image
                    style={styles.default}
                    source={DIR.browTypes[selectedItems.face.eyebrows][selectedColors.face.eyebrows]} /> : null}


            {anyUnowned.makeup ?
                <Image
                    style={styles.default}
                    source={DIR.makeupTypes[selectedItems.face.makeup][0]} /> : null}

            {anyUnowned.eyes ?
                <Image
                    style={styles.default}
                    source={DIR.eyeTypes[selectedItems.face.eyes][selectedColors.face.eyes]} /> : null}

            {anyUnowned.mouth ?
                <Image
                    style={styles.default}
                    source={DIR.mouthTypes[selectedItems.face.mouth][selectedColors.face.mouth]} /> : null}

            {anyUnowned.under ?
                <Image
                    style={styles.default}
                    source={DIR.underlayerTypes[selectedItems.clothing.under][selectedColors.clothing.under]} /> : null}

            {anyUnowned.top ?
                <Image
                    style={styles.default}
                    source={DIR.topTypes[selectedItems.clothing.top][selectedColors.clothing.top]} />
                : null}

            {anyUnowned.accessories ?
                <Image
                    style={styles.default}
                    source={DIR.accessoryTypes[selectedItems.accessories.accessories][0]} /> : null}


            {anyUnowned.outerwear ?
                <Image
                    style={styles.default}
                    source={DIR.outerwearTypes[selectedItems.clothing.outerwear][selectedColors.clothing.outerwear]} />
                : null}

            {anyUnowned.general ?
                <Image
                    style={styles.default}
                    source={DIR.hairTypes[selectedItems.hair.general][selectedColors.hair.general]} /> : null}

            {anyUnowned.side ?
                <Image
                    style={styles.default}
                    source={DIR.hairSideTypes[selectedItems.hair.side][selectedColors.hair.side]} /> : null}


            {anyUnowned.front ?
                <Image
                    style={styles.default}
                    source={DIR.hairFrontTypes[selectedItems.hair.front][selectedColors.hair.front]} /> : null}

            {anyUnowned.background ?
                <Image
                    style={styles.default}
                    source={DIR.piercingsTypes[selectedItems.accessories.piercings][selectedColors.accessories.piercings]} />
                : null}

            {anyUnowned.glasses ?
                <Image
                    style={styles.default}
                    source={DIR.glassesTypes[selectedItems.accessories.glasses][0]} />
                : null}

            <Text>{JSON.stringify(nonOwnedItems)}</Text>

            <Button onPress={purchaseItemsHelper} title="Purchase Items"></Button>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    default: {
        width: 100, height: 100,
    },

})

export default AvatarCheckOutModal;

/*

new table user_owned
user_id varchar FOREIGN KEY,
item_cat_lvl_1 varchar,
item_cat_lvl_2 varchar,
item_id integer,
time_created timestamp with time zone,

lvl_1: face, accessories, clothing, hair, background, overlay
lvl_2: mouth, eyes, etc.

avatarItems: {
            face: { mouth: 0, eyes: 0, makeup: 0, eyebrows: 0, base: 0, },
            accessories: { glasses: 1, piercings: 1, accessories: 0, hairAccessories: 0, },
            clothing: { outerwear: 1, top: 1, under: 0, },
            hair: { front: 1, back: 1, side: 1, general: 0, },
            background: 0, overlay: 0,
        },

*/