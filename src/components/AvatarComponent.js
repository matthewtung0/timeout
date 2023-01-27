import React, { useState, useCallback, useContext } from 'react';
import { View, StyleSheet, Text, Image, Dimensions } from 'react-native';
import timeoutApi from '../api/timeout';
import { useFocusEffect } from '@react-navigation/native';
import { Context as userContext } from '../context/userContext';
//import { Context as UserContext } from '../context/userContext';
//const default_img = require('../../assets/avatar/16_base/2.png')
import { defaultPfp } from './Images.js'

const AvatarComponent = ({ w, pfpSrc, id, modalView, checkForNew }) => {
    const { width, height } = Dimensions.get('window')
    const [pngData, setPngData] = useState(pfpSrc)
    const [idDisplay, setIdDisplay] = useState('')
    const { state: userState, fetchAvatarGeneral } = useContext(userContext)

    const pullPfp = async () => {
        try {
            console.log("retrieving avatar")
            var startTime = performance.now()
            const base64Icon = await fetchAvatarGeneral(id, false)
            //const response = await timeoutApi.get(`/avatar12345/${id}`)

            //var base64Icon = `data:image/png;base64,${data}`
            setPngData(base64Icon)
            console.log("Image data received length: " + base64Icon.length)
            var endTime = performance.now()
            console.log(`Call to pull pfp took ${endTime - startTime} milliseconds`)
        } catch (err) {
            console.log(err)
        }
    }

    useFocusEffect(
        useCallback(() => {
            setIdDisplay(id)
            if (!pfpSrc) {
                pullPfp()
            }
            return () => {
                setPngData('')
            }

        }, [id])
    )

    return (
        <View>
            {pngData == 'default' || pngData == '' ?
                <Image
                    style={modalView ? [styles.modalView, { width: w, height: w, borderRadius: w / 2, }] :
                        [styles.default, { width: w, height: w, borderRadius: w / 2, }]}
                    source={defaultPfp}
                />
                :
                <Image
                    style={modalView ? [styles.modalView, { width: w, height: w, borderRadius: w / 2, }] :
                        [styles.default, { width: w, height: w, borderRadius: w / 2, }]}
                    source={{ uri: pngData }}
                />
            }
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