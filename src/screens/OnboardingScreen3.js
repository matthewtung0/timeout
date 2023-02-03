import React, { useContext } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import { Context as AuthContext } from '../context/AuthContext';
import { Icon } from 'react-native-elements'


const OnboardingScreen3 = ({ navigation, route: { params } }) => {
    const { height, width } = Dimensions.get('window');

    const { state, signin, setShowOnboarding } = useContext(AuthContext);
    return (
        <>
            <View style={{ height: '100%', width: '100%', }}>
                <View style={{ height: '100%', width: '100%', borderWidth: 0, position: 'absolute' }}>
                    <ImageBackground
                        source={require('../../assets/animation_02_onboarding-1.gif')}
                        style={{ height: '100%', width: '100%', borderWidth: 0, }}>
                    </ImageBackground>
                </View>


                <View style={{ flex: 1, borderWidth: 0, }}>
                    <View style={{ flex: 2 }}>

                    </View>

                    <View style={{ flex: 1, alignItems: 'center', }}>

                        <Text style={[styles.textDefaultBold, { fontSize: 22, marginTop: 30, }]}>Start tracking your time!</Text>
                        <Text style={[styles.textDefault, {
                            marginTop: 20, marginHorizontal: 30, fontSize: 17,
                            textAlign: 'center',
                        }]}>
                            Add a new task or choose from your to-do list, rate how productive each session was, and earn points!
                        </Text>
                    </View>



                    <View style={{ flex: 1 }}>

                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 10, }}>
                            <TouchableOpacity style={{ marginHorizontal: 5, paddingVertical: 10, paddingHorizontal: 5, }}
                                onPress={() => {
                                    navigation.navigate('Onboarding2')
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
                                style={[styles.subItemSelectorActive]}>

                            </View>
                            <View
                                style={[styles.subItemSelector]}>

                            </View>
                            <TouchableOpacity
                                onPress={() => {
                                }}
                                style={{ marginHorizontal: 5, paddingVertical: 10, paddingHorizontal: 5, }}>
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
                                marginTop: 15, borderRadius: 20, backgroundColor: '#90AB72', borderColor: '#90AB72'
                            }}>
                            <Text style={[styles.textDefault, { textAlign: 'center', color: 'white', fontSize: 16, }]}>Go to app</Text>
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

export default OnboardingScreen3;