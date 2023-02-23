import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text } from 'react-native-elements';
import AvatarComponent from './AvatarComponent';
import {
    differenceInDays, differenceInYears, differenceInMonths, differenceInHours,
    parseISO, differenceInSeconds, differenceInMinutes
} from 'date-fns';
import Modal from 'react-native-modal'
import FriendFeedReactorsModal from '../components/FriendFeedReactorsModal'
import { TouchableOpacity } from 'react-native-gesture-handler';
const constants = require('../components/constants.json')

const profileComponent = ({ item, index, pfpSrc, idToView, privateVisible, isMe }) => {
    const [modalVisible, setModalVisible] = useState(false)
    const { height } = Dimensions.get('window');

    const duration = (startTime, endTime) => {
        var diff_in_min = differenceInMinutes(parseISO(endTime), parseISO(startTime))
        if (diff_in_min <= 1) {
            return `${differenceInSeconds(parseISO(endTime), parseISO(startTime))} seconds`
        }
        return `${diff_in_min} minutes`
    }
    const toggleModal = () => {
        setModalVisible(!modalVisible)
    }

    const timeAgo = (endTime) => {
        var parsedTime = parseISO(endTime)
        var diffInYears = differenceInYears(new Date(), parsedTime)
        var diffInMonths = differenceInMonths(new Date(), parsedTime)
        var diffInDays = differenceInDays(new Date(), parsedTime)
        var diffInHours = differenceInHours(new Date(), parsedTime)
        var diffInMinutes = differenceInMinutes(new Date(), parsedTime)

        if (diffInYears >= 1) {
            if (diffInYears == 1) {
                return `${diffInYears} year ago`
            } else {
                return `${diffInYears} years ago`
            }
        } else if (diffInMonths >= 1) {
            if (diffInMonths == 1) {
                return `${diffInMonths} month ago`
            } else {
                return `${diffInMonths} months ago`
            }
        } else if (diffInDays >= 1) {
            if (diffInDays == 1) {
                return `${diffInDays} day ago`
            } else {
                return `${diffInDays} days ago`
            }
        } else if (diffInHours >= 1) {
            if (diffInHours == 1) {
                return `${diffInHours} hour ago`
            } else {
                return `${diffInHours} hours ago`
            }
        } else if (diffInMinutes >= 1) {
            if (diffInMinutes == 1) {
                return `${diffInMinutes} minute ago`
            } else {
                return `${diffInMinutes} minutes ago`
            }
        } else {
            return `Just now`
        }
    }
    console.log(`I am rerendering: ${index} and isMe is ${isMe}`)
    return (
        <View style={styles.recentItemContainer}>

            <Modal isVisible={modalVisible}
                animationIn='slideInUp'
                animationOut='slideOutUp'
                backdropTransitionOutTiming={0}>

                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}>
                    <View style={{
                        height: height * 0.7
                    }}>
                        <FriendFeedReactorsModal
                            toggleFunction={toggleModal}
                            activityId={item.activity_id}
                        />
                    </View>
                </View>
            </Modal>


            <View style={styles.pfpcontainerTEMP}>

                {/* smaller pfp here */}
                <View style={styles.pfpTEMP}>
                    <AvatarComponent w={48}
                        //pfpSrc={pfpSrc}
                        id={idToView}
                        isThumbnail={true}
                        isMe={isMe} />
                </View>
            </View>
            <View style={{
                flex: 1,
                margin: 5,
                padding: 5, borderWidth: 0,
            }}>
                <Text>
                    <Text style={[styles.bolded, styles.textDefaultBold, { color: '#67806D' }]}>{item.username}</Text>
                    <Text style={[styles.textDefault, { color: '#67806D' }]}> worked on </Text>
                    <Text style={[styles.bolded, styles.textDefaultBold, { color: '#67806D' }]}>{duration(item.time_start, item.time_end)}</Text>
                </Text>
                <Text>
                    <Text style={[styles.textDefault, { color: '#67806D' }]}>of </Text>
                    {privateVisible || item.public ?
                        <Text style={[styles.bolded, styles.textDefaultBold, { color: constants.colors[item['color_id']] }]}>{item.category_name}</Text>
                        :
                        <Text style={[styles.bolded, styles.textDefaultBold, { color: '#67806D' }]}>[REDACTED]</Text>
                    }
                </Text>
                <View style={{ flexDirection: 'row' }}>


                    <View style={{ flex: 1, borderWidth: 0, }}><Text style={[styles.textDefault,
                    { fontSize: 14, color: '#949494', marginTop: 5, }]}> {timeAgo(item.time_end)}</Text>
                    </View>
                    {item.reaction_count > 0 ?
                        <TouchableOpacity
                            style={{ flex: 1, borderWidth: 0, marginRight: 10, marginTop: 5, }}
                            onPress={toggleModal}>
                            <Text style={[styles.bolded, styles.textDefault, { color: '#67806D' }]}>{item.reaction_count} {item.reaction_count == 1 ? 'like' : 'likes'}</Text>
                        </TouchableOpacity>
                        : null}
                </View>

            </View>
        </View>
    )
}

const equal = (prevItem, nextItem) => {
    if (prevItem.item.activity_id != nextItem.item.activity_id || prevItem.privateVisible != nextItem.privateVisible) {
        return false;
    }
    return true;
}


const styles = StyleSheet.create({
    textDefaultBold: {
        fontFamily: 'Inter-Bold',
    },
    textDefault: {
        fontFamily: 'Inter-Regular',
    },
    outerContainer: {
        flex: 1,
    },
    banner: {
        width: '100%',
        backgroundColor: '#fdd696',
        marginBottom: 10,
    },
    backButton: {
        position: 'absolute',
        //borderWidth: 1,
        marginTop: 25,
        marginLeft: 25,
    },
    editButton: {
        position: 'absolute',
        alignSelf: 'flex-end',
        //borderWidth: 1,
        marginTop: 55,
        paddingHorizontal: 25,
    },
    eyeButton: {
        position: 'absolute',
        alignSelf: 'center',
        //borderWidth: 1,
        marginTop: 55,

    },
    pfp: {
        position: 'absolute',
        //backgroundColor: '#C3E6E7',
        width: 120,
        height: 120,
        borderRadius: 100,
        borderColor: 'white',
        borderWidth: 3,
    },
    username: {
        position: 'absolute',
        marginLeft: 25,
        fontWeight: 'bold',
        fontSize: 26,
        color: 'white',
        marginBottom: 5,
    },
    textContainer: {
        position: 'absolute',
        flexDirection: 'row',
        marginLeft: 25,
    },
    text: {
        fontSize: 18,
        color: 'white',
    },
    bioText: {
        flex: 1.1,
        fontSize: 14,
        marginLeft: 25,
        color: '#67806C'
    },
    categoryContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 40,
        padding: 2,
    },
    categoryStyle: {
        borderRadius: 50,
        padding: 7,
        margin: 4,
        alignSelf: 'center',
        alignItems: 'center',
    },
    categoryText: {
        color: 'white',
        fontSize: 12,
        paddingHorizontal: 2,
    },
    recent: {
        marginLeft: 25,
        marginTop: 10,
        color: '#D0993D',
        fontSize: 21,
    },
    loadMore: {
        marginVertical: 20,
        padding: 10,
        backgroundColor: '#ABC57E',
        alignItems: 'center',
    },
    loadMoreText: {
        fontWeight: 'bold',
        color: 'white',
        fontSize: 18,
    },
    likeContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    likeCount: {
        marginHorizontal: 5,
    },
    bolded: {
        fontSize: 15,
        fontColor: '#67806D',
    },
    pfpcontainerTEMP: {
        flex: 0.25,
        //backgroundColor: 'green',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pfpTEMP: {
        height: 50,
        width: 50,
        borderRadius: 100,
    },
    recentItemContainer: {
        flex: 1,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        marginHorizontal: 25,
    },
})

export default React.memo(profileComponent, equal)