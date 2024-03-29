import React, { } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import { Icon } from 'react-native-elements'


const OnboardingScreen2 = ({ navigation, route: { params } }) => {
    const { width, height } = Dimensions.get('window');
    var touchX = 0
    return (
        <>
            <View style={{ height: '100%', width: '100%', }}>
                <View style={{ height: '100%', width: '100%', borderWidth: 0, position: 'absolute' }}>
                    <ImageBackground
                        source={require('../../assets/animation_02_onboarding-2.gif')}
                        style={{ height: '100%', width: '100%', borderWidth: 0, }}>
                    </ImageBackground>
                </View>


                <View
                    onTouchStart={e => {
                        touchX = e.nativeEvent.pageX
                    }}
                    onTouchEnd={e => {
                        if (touchX - e.nativeEvent.pageX > (width / 5)) {
                            navigation.navigate('Onboarding3')
                        }
                    }}

                    style={{ flex: 1, borderWidth: 0, }}>
                    <View style={{ flex: 2 }}>

                    </View>

                    <View style={{ flex: 1, alignItems: 'center', }}>

                        <Text style={[styles.textDefaultBold, { fontSize: 22, marginTop: 30, }]}>Start counting things!</Text>
                        <Text style={[styles.textDefault, {
                            marginTop: 20, marginHorizontal: 30, fontSize: 17,
                            textAlign: 'center',
                        }]}>
                            Keep track of things you want to consistently do, like drinking cups of water, or doing pushups each day.
                        </Text>
                    </View>



                    <View style={{ flex: 1 }}>

                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 10, }}>
                            <TouchableOpacity style={{ marginHorizontal: 5, paddingVertical: 10, paddingHorizontal: 5, }}
                                onPress={() => {
                                    navigation.navigate('Onboarding1')
                                }}>
                                <Icon
                                    name='caret-back'
                                    size={24}
                                    type='ionicon'
                                    color='#B3B2B3' />
                            </TouchableOpacity>

                            <View
                                style={[styles.subItemSelector]}>

                            </View>
                            <View
                                style={[styles.subItemSelectorActive]}>

                            </View>
                            <View
                                style={[styles.subItemSelector]}>

                            </View>
                            <View
                                style={[styles.subItemSelector]}>

                            </View>
                            <TouchableOpacity
                                onPress={() => {
                                    navigation.navigate('Onboarding3')
                                }}
                                style={{ marginHorizontal: 5, paddingVertical: 10, paddingHorizontal: 5, }}>
                                <Icon
                                    name='caret-forward'
                                    size={24}
                                    type='ionicon'
                                    color='#B3B2B3' />
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>











                {/*<TouchableOpacity
                onPress={() => { setShowOnboarding(false) }}
                style={{ height: 100, borderWidth: 1, }}>
                <Text>Go to app ?</Text>
    </TouchableOpacity>*/}

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

export default OnboardingScreen2;