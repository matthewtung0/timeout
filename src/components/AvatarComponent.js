import React, { useState, useCallback, useContext, useMemo } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Context as userContext } from '../context/userContext';
import { defaultPfp } from './Images.js'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { differenceInMinutes } from 'date-fns';
const constants = require('../components/constants.json')

const AvatarComponent = ({ w, pfpSrc, id, modalView, isThumbnail = false, isMe = false }) => {
    const [pngData, setPngData] = useState(pfpSrc)
    const { fetchAvatarGeneral, state } = useContext(userContext)
    const pullPfp = async (forceRetrieve = false) => {
        try {
            var startTime = performance.now()
            const base64Icon = await fetchAvatarGeneral(id, forceRetrieve, false, isThumbnail)
            setPngData(base64Icon)
            var endTime = performance.now()
        } catch (err) {
            console.log(err)
            setPngData(constants.defaultBase64)
        }
    }

    //console.log("Rerendering avatar component");

    const focusEffectFunc = async () => {

        // use cache if less than 1 hour old, otherwise pull avatar
        try {
            if (isThumbnail) {
                var cache_time = await AsyncStorage.getItem(`thumbnail_avatar_date_${id}`)
            } else { var cache_time = await AsyncStorage.getItem(`avatar_date_${id}`) }

            if (!cache_time) { // not in cache, need to pull it anyways
                if (!pfpSrc) { pullPfp(true) }
            }
            var now = new Date();
            var diffInMin = differenceInMinutes(now, new Date(cache_time))
            if (diffInMin >= 240) {
                console.log(`${id} is ${diffInMin} min old, so force retrieve`)
                if (!pfpSrc) { pullPfp(true) }
            } else {
                console.log(`${id} is ${diffInMin} min old, so get from cache`)
                if (isThumbnail) { var base64Icon_cached = await AsyncStorage.getItem(`thumbnail_avatar_${id}`); }
                else { var base64Icon_cached = await AsyncStorage.getItem(`avatar_${id}`); }
                setPngData(base64Icon_cached)
            }
        } catch (err) {
            console.log("ERROR IS ", err)
            if (!pfpSrc) { pullPfp(false) }
        }

        /*if (useCache) {
            console.log("Using cache straight away")
            var base64Icon_cached = await AsyncStorage.getItem(`avatar_${id}`);
            setPngData(base64Icon_cached)
        } else {
            if (!pfpSrc) {pullPfp()}
        }*/
    }

    useFocusEffect(
        useCallback(() => {
            if (isMe && isThumbnail) {
                console.log("Is self, getting state thumbnail")
                setPngData(state.base64pfp)
            } else if (isMe) {
                console.log("Is self, getting state regular pfp")
                setPngData(state.base64pfp)
            } else {
                focusEffectFunc()
            }
            return () => {
                setPngData('')
            }

        }, [id])
    )

    const asdf = () => {
        //console.log("Rerendering avatar image")
        if (pngData == 'default' || pngData == '') {
            return (
                <Image
                    style={modalView ? [styles.modalView, { width: w, height: w, borderRadius: w / 2, }] :
                        [styles.default, { width: w, height: w, borderRadius: w / 2, }]}
                    source={defaultPfp}
                />
            )
        }
        return (
            <Image
                style={modalView ? [styles.modalView, { width: w, height: w, borderRadius: w / 2, }] :
                    [styles.default, { width: w, height: w, borderRadius: w / 2, }]}
                source={{ uri: pngData }}
            />
        )
    }

    const memoizedImage = useMemo(asdf, [pngData])

    return (
        <View>
            {memoizedImage}
        </View>
    )
}

const styles = StyleSheet.create({
    default: {
        position: 'absolute',//marginTop: 170, marginLeft: 50
    },
    modalView: {

    }
})

export default AvatarComponent;