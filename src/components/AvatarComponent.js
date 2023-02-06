import React, { useState, useCallback, useContext, useMemo } from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Context as userContext } from '../context/userContext';
import { defaultPfp } from './Images.js'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { differenceInMinutes } from 'date-fns';

const AvatarComponent = ({ w, pfpSrc, id, modalView, useCache = false, cacheChecker, setCacheChecker }) => {
    const { width, height } = Dimensions.get('window')
    const [pngData, setPngData] = useState(pfpSrc)
    const { fetchAvatarGeneral } = useContext(userContext)

    const pullPfp = async (forceRetrieve = false) => {
        try {
            console.log(`calling fetchAvatarGeneral with forceRetrieve = ${forceRetrieve}`)
            var startTime = performance.now()
            const base64Icon = await fetchAvatarGeneral(id, forceRetrieve)
            //const response = await timeoutApi.get(`/avatar12345/${id}`)

            //var base64Icon = `data:image/png;base64,${data}`

            // we pulled the pfp - if there is a cache checker, update that
            if (setCacheChecker && cacheChecker) {
                var newPair = { [id]: false }

                //console.log("Setting cache checker to : ", { ...cacheChecker, ...newPair })
                setCacheChecker({ ...cacheChecker, ...newPair })
            }

            setPngData(base64Icon)
            var endTime = performance.now()
            //console.log(`Call to pull pfp took ${endTime - startTime} milliseconds`)
        } catch (err) {
            console.log(err)
        }
    }

    //console.log("Rerendering avatar component");

    const focusEffectFunc = async () => {

        // use cache if less than 1 hour old, otherwise pull avatar
        try {
            var cache_time = await AsyncStorage.getItem(`avatar_date_${id}`)
            if (!cache_time) { // not in cache, need to pull it anyways
                if (!pfpSrc) { pullPfp(forceRetrieve = true) }
            }
            var now = new Date();
            var diffInMin = differenceInMinutes(now, new Date(cache_time))
            if (diffInMin >= 60) {
                if (!pfpSrc) { pullPfp(forceRetrieve = true) }
            } else {
                var base64Icon_cached = await AsyncStorage.getItem(`avatar_${id}`);
                setPngData(base64Icon_cached)
            }
        } catch (err) {
            console.log("ERROR IS ", err)
            if (!pfpSrc) { pullPfp(forceRetrieve = false) }
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