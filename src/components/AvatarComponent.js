import React, { useState, useCallback, useContext, useMemo } from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Context as userContext } from '../context/userContext';
//import { Context as UserContext } from '../context/userContext';
//const default_img = require('../../assets/avatar/16_base/2.png')
import { defaultPfp } from './Images.js'
import AsyncStorage from '@react-native-async-storage/async-storage';

const AvatarComponent = ({ w, pfpSrc, id, modalView, useCache = false }) => {
    const { width, height } = Dimensions.get('window')
    const [pngData, setPngData] = useState(pfpSrc)
    const { state: userState, fetchAvatarGeneral } = useContext(userContext)

    const pullPfp = async () => {
        try {
            console.log("calling fetchAvatarGeneral")
            var startTime = performance.now()
            const base64Icon = await fetchAvatarGeneral(id, false)
            //const response = await timeoutApi.get(`/avatar12345/${id}`)

            //var base64Icon = `data:image/png;base64,${data}`
            setPngData(base64Icon)
            //console.log("Image data received length: " + base64Icon.length)
            var endTime = performance.now()
            //console.log(`Call to pull pfp took ${endTime - startTime} milliseconds`)
        } catch (err) {
            console.log(err)
        }
    }

    //console.log("Rerendering avatar component");

    const focusEffectFunc = async () => {
        if (useCache) {
            console.log("Using cache straight away")
            var base64Icon_cached = await AsyncStorage.getItem(`avatar_${id}`);
            setPngData(base64Icon_cached)
        } else {
            if (!pfpSrc) {
                pullPfp()
            }
        }

    }

    useFocusEffect(
        useCallback(() => {
            focusEffectFunc()
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