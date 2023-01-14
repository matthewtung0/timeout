import React, { useContext, useState, useCallback } from 'react';
import {
    View, StyleSheet, Text, FlatList, Dimensions, ActivityIndicator,
    TouchableOpacity, Alert, Switch, Image
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Icon } from 'react-native-elements'
import { Context as SessionContext } from '../context/SessionContext';
import AvatarComponent from './AvatarComponent';
const constants = require('../components/constants.json')
const img = require('../../assets/tasks_topbar.png')
const yellowCheckmark = require('../../assets/yellow_checkmark.png')


const FriendFeedReactorsModal = ({ toggleFunction, colorArr, activityId }) => {
    const { height, width } = Dimensions.get('window');
    const { state: sessionState, fetchLikersOfActivity } = useContext(SessionContext)
    const [isLoading, setIsLoading] = useState(false)
    const [res, setRes] = useState([])

    const getLikes = async () => {
        var asdf = await fetchLikersOfActivity(activityId)
        setRes(asdf);
    }

    useFocusEffect(
        useCallback(() => {
            setIsLoading(false)
            getLikes();
        }, [])
    )
    return (
        <>
            <View style={{
                flex: 1,
                justifyContent: 'center',
            }}>
                <View style={[styles.container, { height: height * 0.6 }]}>
                    <Image
                        source={img}
                        resizeMode='stretch'
                        style={{ maxWidth: width * 0.9, maxHeight: 75, position: 'absolute' }} />

                    <Text style={[styles.title, { position: 'absolute' }]}>People who Liked This</Text>
                    <View style={{ marginTop: 90 }}>
                        {/*<Text>Results: {JSON.stringify(res)}</Text>*/}

                        <FlatList
                            style={{}}
                            horizontal={false}
                            data={res}
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(result) => result.user_id}
                            ItemSeparatorComponent={() => {
                                return (<View
                                    style={{
                                        borderBottomColor: '#A7BEAD',
                                        //borderBottomWidth: StyleSheet.hairlineWidth,
                                        borderBottomWidth: 0.8,
                                        marginHorizontal: 20,
                                    }}
                                />)
                            }}
                            renderItem={({ item }) => {
                                return (
                                    <View style={{
                                        borderWidth: 1, flex: 1, flexDirection: 'row',
                                        height: 75, alignItems: 'center', marginHorizontal: 20,
                                    }}>

                                        <View style={{
                                            flex: 0.25,
                                            height: 50,
                                            width: 50,
                                            borderRadius: 100,
                                        }}>
                                            <AvatarComponent w={50}
                                                //isSelf={item.username == userState.username}
                                                id={item.user_id} />
                                        </View>
                                        <View style={{ flex: 0.75 }}>
                                            <Text style={[styles.textDefaultBold, { fontSize: 20, }]}>{item.username}</Text>
                                        </View>


                                    </View>
                                )
                            }}
                        />


                    </View>


                    <View style={styles.backContainer}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => { toggleFunction() }}>
                            <Icon
                                name="close-outline"
                                type='ionicon'
                                size={35}
                                color='black' />
                        </TouchableOpacity>
                    </View>
                </View>

            </View>



        </>

    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        alignContent: 'center',

    }, title: {
        alignSelf: 'center',
        margin: 20,
        marginBottom: 50,
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white',
    },
    backContainer: {
        flex: 1,
        width: '50%',
        position: 'absolute',
        alignSelf: 'flex-end',
        justifyContent: 'flex-end',
        alignItems: 'flex-end'
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
    },
    textDefaultBold: {
        fontFamily: 'Inter-Bold',
    },
    textDefault: {
        fontFamily: 'Inter-Regular',
    },

})

export default FriendFeedReactorsModal;