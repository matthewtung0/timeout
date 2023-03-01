import React, { useState, useCallback, useContext } from 'react';
import {
    View, StyleSheet, Text, FlatList, TouchableOpacity, Image, Dimensions, ActivityIndicator,
    Platform
} from 'react-native';
import { Icon } from 'react-native-elements';
const constants = require('../components/constants.json')
import { useFocusEffect } from '@react-navigation/native';
import tinycolor from 'tinycolor2';
import Modal from 'react-native-modal'
import OnboardCategoriesModal from '../components/OnboardCategoriesModal';
import { Context as AuthContext } from '../context/AuthContext';
import { Context as CategoryContext } from '../context/CategoryContext'
import { Context as CounterContext } from '../context/CounterContext'
import { Context as ReactionContext } from '../context/ReactionContext'
import { Context as SessionContext } from '../context/SessionContext'
import { Context as UserContext } from '../context/userContext'
import { subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { normalize } from '../components/FormatUtils';

import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
const bg_bottom = require('../../assets/border.png')

const OnboardCategoryScreen = ({ navigation, route: { params } }) => {
    const { height, width } = Dimensions.get('window');
    const { email, password, username, firstName, lastName, bio } = params;
    console.log(params)

    const { signup, setToken } = useContext(AuthContext);
    // [0, defaultCat[0], chosen or not (t/f), colorId]
    const [categoryArr, setCategoryArr] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const [modalVisible, setModalVisible] = useState(false)
    const [selectedItem, setSelectedItem] = useState(null)
    const { fetchUserCategories, fetchUserTodoItems } = useContext(CategoryContext)
    const { fetchUserReactions } = useContext(ReactionContext)
    const { state: sessionState, fetchMultipleMonths, setOffsetFetched } = useContext(SessionContext)
    const { fetchUserCounters } = useContext(CounterContext)
    const { fetchAvatarGeneral, updateLastSignin, fetchOutgoingRequests,
        fetchIncomingRequests, fetchFriends, fetchSelf, fetchAvatarItemsOwned,
        postNotificationToken } = useContext(UserContext)
    var colorArr = []
    for (var x in constants['colors']) {
        colorArr.push([x, constants['colors'][x]])
    }
    useFocusEffect(
        useCallback(() => {
            var catArrTemp = []
            for (var i in constants.defaultCategories) {
                catArrTemp.push([i, constants.defaultCategories[i], false, 'c0'])
            }
            setCategoryArr(catArrTemp)
        }, [])
    )

    const toggleSelected = (id) => {
        setCategoryArr(categoryArr.map(item => {
            if (item[0] == id) {
                return [item[0], item[1], !item[2], item[3]]
            }
            return item
        }))
    }

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    const modalCallback = (chosenColorId) => {
        console.log(chosenColorId)
        setCategoryArr(categoryArr.map(item => {
            if (item[0] == selectedItem[0]) {
                return [item[0], item[1], item[2], chosenColorId]
            }
            return item
        }))
    }

    const errorCallback = () => {
        setIsLoading(false)
        alert("Something went wrong with sign up. Please try again later")
    }

    async function registerForPushNotificationsAsync(userId, postNotificationToken) {
        let token;

        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                //alert('Failed to get push token for push notification!');
                return;
            }
            if (Platform.OS === 'android') {
                const token_FCM = (await Notifications.getDevicePushTokenAsync());
                token = await Notifications.getExpoPushTokenAsync({
                    applicationId: '1:581261737423:android:d2b8f65c0ffd4a2221e6ba',
                    experienceId: '@mtung0219/timeout',
                })
                console.log(`ANDROID TOKEN IS ${JSON.stringify(token_FCM)}`)
                //eYByL5AtSWyHwLgErS1EuS:APA91bExyOYgvYyqkkNVfq8eI6rjJCLiaEVhquEuqbeoMb7VYaqVgMO6USvWaIBnAS9MJ2IHmjcE2TX55SzHInO5yKW_lApk-NdzUeEMdu6cgc5ZUW04kirDrgP0ZPJoVhjCqvGt6kXS
            } else {
                const token_APN = (await Notifications.getDevicePushTokenAsync());
                token = await Notifications.getExpoPushTokenAsync({
                    experienceId: '@mtung0219/timeout',
                })
                console.log(`APPLE TOKEN IS ${JSON.stringify(token_APN)}`)
            }
        } else {
            //alert('Must use physical device for Push Notifications');
        }

        var toPost = JSON.stringify({
            userId,
            token,
        })

        postNotificationToken(toPost)
        console.log(`Posted token: ${token}`);
        return token;
    }

    const signupCallback = async (token) => {
        console.log("At sign up callback")
        await updateLastSignin()
            .then((res) => fetchSelf().then(
                (res) => {
                    fetchAvatarGeneral(res.user_id, forceRetrieve = true, isSelf = true)
                    fetchUserCategories(res.user_id, getPrivate = true, isSelf = true);

                    registerForPushNotificationsAsync(res.user_id, postNotificationToken)
                }
            ))

        var endTime = endOfMonth(sessionState.calendarDate)
        var startTime = startOfMonth(subMonths(startOfMonth(sessionState.calendarDate), 3))
        await fetchMultipleMonths(startTime, endTime).then(
            await setOffsetFetched(3)
        )
        await fetchUserCounters()
        await fetchUserReactions();
        //await fetchMultipleMonthsCounters(startTime, endTime);
        await fetchAvatarItemsOwned();
        await fetchUserTodoItems(isSelf = true);
        await fetchFriends();
        await fetchOutgoingRequests();
        await fetchIncomingRequests();

        // safe to update token now

        setToken(token)
        setIsLoading(false)

    }

    return (
        <View style={{ flex: 1, }}>
            <Modal isVisible={modalVisible}
                animationIn='slideInLeft'
                animationOut='slideOutLeft'
                backdropTransitionOutTiming={0}>
                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}>
                    <View style={{
                        height: height * 0.6,
                    }}>
                        <OnboardCategoriesModal
                            toggleFunction={toggleModal}
                            colorArr={colorArr}
                            selectedColorId={selectedItem ? selectedItem[3] : "c0"}
                            categoryArr={categoryArr}
                            item={selectedItem}
                            callback={modalCallback} />
                    </View>
                </View>

            </Modal>

            <>

                <View style={{
                    position: 'absolute', flex: 1, width: '100%', height: '100%',
                    justifyContent: 'flex-end',
                }}>
                    <Image
                        source={bg_bottom}
                        style={{ width: '100%', height: normalize(45), }}
                        resizeMode="cover"
                    />
                </View>

                <View
                    style={{ flex: 1, }}>
                    <View style={{ flex: 1.3, }} />
                    <View style={{ flex: 0.8 }}>
                        <Text style={[styles.textDefaultSemiBold,
                        { marginLeft: 25, fontSize: 18, color: '#67806D' }]}>Select some categories to track.</Text>
                        <Text style={[styles.textDefaultSemiBold,
                        { marginLeft: 25, fontSize: 17, color: '#67806D' }]}>You can add your own later in the app.</Text>
                    </View>


                    <View style={[styles.categoryContainer, { borderWidth: 0, flex: 8 }]}>
                        <FlatList
                            style={{}}
                            //data={sessionState.selfOnlySessions}
                            data={categoryArr}
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item) => item[0]}
                            renderItem={({ item, index }) => (
                                <View
                                    key={item[0]}
                                    style={{ height: height * 0.06, }}>
                                    <View style={item[2] ?
                                        {
                                            flexDirection: 'row', flex: 1, paddingBottom: 5,
                                            borderWidth: 0, borderRadius: 20, borderColor: '#67806D',
                                            backgroundColor: '#DCDBDB'
                                        } :
                                        { flexDirection: 'row', flex: 1, paddingBottom: 5, borderRadius: 20, }}>
                                        <View style={{ flex: 8, justifyContent: 'center', paddingLeft: 10, }}>
                                            <TouchableOpacity
                                                style={{ borderWidth: 0, flex: 1, justifyContent: 'center', }}
                                                onPress={() => { toggleSelected(item[0]) }}>
                                                <View style={{ justifyContent: 'center', }}>
                                                    <Text style={[styles.textDefault,
                                                    { color: '#67806D', fontSize: 16 }]}>{item[1]}</Text>
                                                </View>

                                            </TouchableOpacity>

                                        </View>

                                        <View style={{ flex: 1, justifyContent: 'center', }}>
                                            <View style={{
                                                backgroundColor: constants.colors[item[3]],
                                                height: 23, width: 23,
                                            }} />
                                        </View>

                                        <View style={{ flex: 1, justifyContent: 'center', }}>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    if (isLoading) { return }
                                                    setSelectedItem(item)
                                                    toggleModal()
                                                }}>
                                                <Icon name='pencil-outline' type='ionicon' size={20} color='#67806D' />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View
                                        style={{
                                            borderBottomColor: '#DCDBDB',
                                            //borderBottomWidth: StyleSheet.hairlineWidth,
                                            borderBottomWidth: 1.5,
                                            marginBottom: 0,
                                        }}
                                    />
                                </View>
                            )}
                        >
                        </FlatList>

                    </View>
                    <View opacity={isLoading ? 0.2 : 1} style={{ flex: 1.5, }}>
                        <TouchableOpacity
                            style={[styles.signUpBoxStyle, {
                                backgroundColor: '#FCC859', shadowColor: tinycolor('#FCC859').darken(25).toString()
                            }]}
                            onPress={() => {
                                if (isLoading) { return; }
                                setIsLoading(true)
                                var lowerCaseEmail = email.toLowerCase();
                                console.log("Sending email: ", lowerCaseEmail);
                                signup({
                                    email: lowerCaseEmail,
                                    password,
                                    username,
                                    firstName,
                                    lastName,
                                    categoryArr,
                                    bio,
                                    callback: signupCallback,
                                    errorCallback: errorCallback
                                })
                            }}>
                            <Text style={[styles.textDefaultMed, styles.signUpTextStyle, {
                                fontSize: 17,
                                paddingHorizontal: 20,
                            }]}>
                                Complete Sign Up</Text>
                        </TouchableOpacity>
                        {isLoading ?
                            <ActivityIndicator
                                style={{ marginTop: 15, }}
                                size="large" color="gray" />
                            : null}
                    </View>



                    <View style={{ height: 30 }} />
                </View>


            </>


            <TouchableOpacity
                style={styles.backButton}
                onPress={() => {
                    if (isLoading) { return; }
                    navigation.navigate('SignUp', { email, firstName, lastName, bio, password, username })
                }}>
                <Icon
                    name='arrow-back-outline'
                    type='ionicon'
                    size={35}
                    color='#67806D' />
            </TouchableOpacity>
        </View >
    )
}

const styles = StyleSheet.create({
    textDefaultBold: {
        fontFamily: 'Inter-Bold',
    },
    textDefault: {
        fontFamily: 'Inter-Regular',
    }, textDefaultMed: {
        fontFamily: 'Inter-Medium',
    },
    textDefaultSemiBold: {
        fontFamily: 'Inter-SemiBold',
    },
    signUpBoxStyle: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 1,
        shadowRadius: 0,
    },
    signUpTextStyle: {
        color: '#F6F2DF',
    },
    categoryContainer: {
        marginVertical: 20,
        marginHorizontal: 25,
    },
    addCategoryButton: {
        flex: 1,
        paddingVertical: 15,
        margin: 10,
        backgroundColor: '#ABC57E',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    addCategoryText: {
        fontWeight: '600',
        color: 'white',
        fontSize: 18,
    },
    backButton: {
        position: 'absolute',
        width: 50, height: 50,
        marginTop: 30,
        marginLeft: 5,
    },
})

export default OnboardCategoryScreen;