import React, { useContext } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import { Context as AuthContext } from '../context/AuthContext';
import { Icon } from 'react-native-elements'
import tinycolor from 'tinycolor2';

const OnboardingScreen4 = ({ navigation, route: { params } }) => {
    const { height, width } = Dimensions.get('window');

    const { setShowOnboarding } = useContext(AuthContext);
    return (
        <>
            <View style={{ height: '100%', width: '100%', }}>
                <View style={{ height: '100%', width: '100%', borderWidth: 0, position: 'absolute' }}>
                    <ImageBackground
                        source={require('../../assets/animation_02_onboarding-4.gif')}
                        style={{ height: '100%', width: '100%', borderWidth: 0, }}>
                    </ImageBackground>
                </View>


                <View style={{ flex: 1, borderWidth: 0, }}>
                    <View style={{ flex: 2 }}>

                    </View>

                    <View style={{ flex: 1, alignItems: 'center', }}>

                        <Text style={[styles.textDefaultBold, { fontSize: 22, marginTop: 30, }]}>
                            Look back on past sessions!</Text>
                        <Text style={[styles.textDefault, {
                            marginTop: 20, marginHorizontal: 30, fontSize: 17,
                            textAlign: 'center',
                        }]}>
                            Review and search through all that you've done. Compare stats for each month.
                        </Text>
                    </View>

                    <View style={{ flex: 1 }}>

                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 10, }}>
                            <TouchableOpacity style={{ marginHorizontal: 5, paddingVertical: 10, paddingHorizontal: 5, }}
                                onPress={() => {
                                    navigation.navigate('Onboarding3')
                                }}>
                                <Icon
                                    name='caret-back'
                                    size={20}
                                    type='ionicon'
                                    color='#B3B2B3' />
                            </TouchableOpacity>

                            <View
                                style={[styles.subItemSelector]}>

                            </View>
                            <View
                                style={[styles.subItemSelector]}>

                            </View>
                            <View
                                style={[styles.subItemSelector]}>

                            </View>
                            <View
                                style={[styles.subItemSelectorActive]}>

                            </View>
                            <TouchableOpacity
                                onPress={() => {
                                }}
                                style={{
                                    opacity: 0,
                                    marginHorizontal: 5, paddingVertical: 10, paddingHorizontal: 5,
                                }}>
                                <Icon
                                    name='caret-forward'
                                    size={20}
                                    type='ionicon'
                                    color='#B3B2B3' />
                            </TouchableOpacity>
                        </View>



                        <TouchableOpacity
                            onPress={() => { setShowOnboarding(false) }}
                            style={{
                                width: width / 2, alignSelf: 'center', borderWidth: 1, paddingVertical: 10,
                                marginTop: 15, borderRadius: 10, backgroundColor: '#90AB72', borderColor: '#90AB72',
                                shadowOffset: {
                                    width: 0,
                                    height: 5,
                                },
                                shadowOpacity: 1,
                                shadowRadius: 0,
                                shadowColor: tinycolor('#90AB72').darken(25).toString()
                            }}>
                            <Text style={[styles.textDefaultSemiBold, { textAlign: 'center', color: 'white', fontSize: 20, }]}>
                                Go to app</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

        </>

    )
}

const styles = StyleSheet.create({
    textDefaultBold: {
        fontFamily: 'Inter-Bold',
        color: '#67806D',
    },
    textDefault: {
        fontFamily: 'Inter-Regular',
        color: '#67806D',
    },
    textDefaultMed: {
        fontFamily: 'Inter-Medium',
        color: '#67806D',
    }, textDefaultSemiBold: {
        fontFamily: 'Inter-SemiBold',
        color: '#67806D',
    },
    title: {
        margin: 30,
        fontSize: 40,
        marginTop: 70,
    },
    colorSquare: {
        width: 30,
        height: 30,
        backgroundColor: 'green',
    },
    signUpBoxStyle: {
        backgroundColor: '#FCC859',
        width: 150,
        height: 40,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10
    },
    signUpTextStyle: {
        color: '#F6F2DF',
        fontSize: 15,
        fontWeight: 'bold'
    },
    subItemSelector: {
        width: 15, height: 15, borderRadius: 7.5, borderWidth: 1, marginHorizontal: 5,
        borderColor: '#B3B2B3'
    },
    subItemSelectorActive: {
        width: 15, height: 15, borderRadius: 7.5, borderWidth: 1, marginHorizontal: 5,
        borderColor: '#B3B2B3', backgroundColor: '#B3B2B3'
    }
})

export default OnboardingScreen4;