import React, { useContext, useState, useCallback } from 'react';
import {
    View, StyleSheet, Text, FlatList, Dimensions, ActivityIndicator,
    TouchableOpacity, Image
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Icon } from 'react-native-elements'
import { Context as SessionContext } from '../context/SessionContext';
import AvatarComponent from './AvatarComponent';
const img = require('../../assets/tasks_topbar.png')
const BORDER_RADIUS = 20;


const FriendFeedReactorsModal = ({ toggleFunction, cacheChecker, activityId }) => {
    const { height, width } = Dimensions.get('window');
    const { state: sessionState, fetchLikersOfActivity } = useContext(SessionContext)
    const [isLoading, setIsLoading] = useState(false)
    const [res, setRes] = useState([])

    const getLikes = async () => {
        var likers = await fetchLikersOfActivity(activityId)
        setRes(likers);
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
                <View style={[styles.container, { height: height * 0.6, borderRadius: BORDER_RADIUS, }]}>
                    <Image
                        source={img}
                        resizeMode='stretch'
                        style={{
                            maxWidth: width * 0.9, maxHeight: 75, position: 'absolute',
                            borderTopLeftRadius: BORDER_RADIUS, borderTopRightRadius: BORDER_RADIUS,
                        }} />

                    <Text style={[styles.title, styles.textDefaultBold, { position: 'absolute' }]}>People who Liked This</Text>
                    <View style={{ marginTop: 90 }}>

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
                                        borderWidth: 0, flex: 1, flexDirection: 'row',
                                        alignItems: 'center', marginHorizontal: 20,
                                        paddingVertical: 5,
                                    }}>

                                        <View style={{
                                            flex: 0.25,
                                            height: 50,
                                            width: 50,
                                            borderRadius: 100,
                                        }}>
                                            <AvatarComponent w={50}
                                                useCache={cacheChecker[item.user_id] == false}
                                                id={item.user_id} />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={[styles.textDefaultSemiBold, { fontSize: 16, }]}>{item.username}</Text>
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
                                color='white' />
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
    },
    textDefaultSemiBold: {
        fontFamily: 'Inter-SemiBold',
    },
    textDefault: {
        fontFamily: 'Inter-Regular',
    },
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