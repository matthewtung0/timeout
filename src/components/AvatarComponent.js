import React from 'react';
import { View, StyleSheet, Text, Image, Dimensions } from 'react-native';
import { Button } from 'react-native-elements';

const AvatarComponent = ({ w, pfpSrc }) => {
    const { width, height } = Dimensions.get('window')

    return (
        <View>
            <Image
                style={[styles.default, { width: w, height: w }]}
                source={{ uri: pfpSrc }} />
        </View>
    )
}

const styles = StyleSheet.create({
    default: {
        position: 'absolute', borderRadius: 100, //marginTop: 170, marginLeft: 50
    }
})

export default AvatarComponent;