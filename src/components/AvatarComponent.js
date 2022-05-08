import React, { useState, useCallback, useContext } from 'react';
import { View, StyleSheet, Text, Image, Dimensions } from 'react-native';
import timeoutApi from '../api/timeout';
import { useFocusEffect } from '@react-navigation/native';
//import { Context as UserContext } from '../context/userContext';

const AvatarComponent = ({ w, pfpSrc, isSelf, id }) => {
    const { width, height } = Dimensions.get('window')
    const [pngData, setPngData] = useState('../../assets/avatar/20_BACKGROUND/1_pink.png')
    const [idDisplay, setIdDisplay] = useState('')
    //const { state: { idToView } } = useContext(UserContext)

    const pullPfp = async () => {
        try {
            const response = await timeoutApi.get('/avatar1', { params: { friend: id } })

            var base64Icon = `data:image/png;base64,${response.data}`
            console.log(base64Icon)
            setPngData(base64Icon)
            //console.log(base64Icon.length)
        } catch (err) {
            console.log(err)
        }
    }

    useFocusEffect(
        useCallback(() => {
            setIdDisplay(id)
            if (!isSelf) {
                pullPfp()
            }

            return () => {
                setPngData('../../assets/avatar/20_BACKGROUND/1_pink.png')
            }

        }, [id])
    )

    return (
        <View>
            {isSelf ?
                <Image
                    style={[styles.default, { width: w, height: w }]}
                    source={{ uri: pfpSrc }}
                />
                :
                <Image
                    style={[styles.default, { width: w, height: w }]}
                    source={{ uri: pngData }}
                />
            }
        </View>
    )
}

const styles = StyleSheet.create({
    default: {
        position: 'absolute', borderRadius: 100, //marginTop: 170, marginLeft: 50
    }
})

export default AvatarComponent;