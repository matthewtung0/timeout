import React, { useContext, useState } from 'react';
import {
    View, StyleSheet, Text,
    TouchableOpacity,
} from 'react-native';
import {
    differenceInDays, differenceInYears, differenceInMonths, differenceInHours,
    differenceInMinutes,
    parseISO, differenceInSeconds,
} from 'date-fns';
import { Context as UserContext } from '../context/userContext';
import AvatarComponent from '../components/AvatarComponent';

const FriendNotificationComponent = ({ item, navigation }) => {
    const { state: userState, setIdToView } = useContext(UserContext)

    const [disableTouch, setDisableTouch] = useState(false)
    const [reactionCount, setReactionCount] = useState(item.reaction_count)

    const duration = (startTime, endTime) => {
        var diff_in_min = differenceInMinutes(parseISO(endTime), parseISO(startTime))
        if (diff_in_min <= 1) {
            return `${differenceInSeconds(parseISO(endTime), parseISO(startTime))} seconds`
        }
        return `${diff_in_min} minutes`
    }
    const timeAgo = (endTime) => {
        var parsedTime = parseISO(endTime)
        var diffInYears = differenceInYears(new Date(), parsedTime)
        var diffInMonths = differenceInMonths(new Date(), parsedTime)
        var diffInDays = differenceInDays(new Date(), parsedTime)
        var diffInHours = differenceInHours(new Date(), parsedTime)
        var diffInMinutes = differenceInMinutes(new Date(), parsedTime)

        if (diffInYears >= 1) {
            return `${diffInYears} years ago`
        } else if (diffInMonths >= 1) {
            return `${diffInMonths} months ago`
        } else if (diffInDays >= 1) {
            return `${diffInDays} days ago`
        } else if (diffInHours >= 1) {
            return `${diffInHours} hours ago`
        } else if (diffInMinutes >= 1) {
            return `${diffInMinutes} minutes ago`
        } else {
            return `Just now`
        }
    }
    // make buttons enabled again after api calls done
    const reactCallback = () => {
        setDisableTouch(false)
    }

    //console.log("Rendered ", item)

    return (

        <View style={styles.container}>
            <View style={styles.pfpcontainer}>

                <View style={styles.pfp}>
                    <TouchableOpacity
                        onPress={() => {
                            setIdToView({ username: item.username, user_id: item.user_id })
                            navigation.navigate('Profile temp')
                        }}>
                        <AvatarComponent w={50}
                            id={item.user_id}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.listItem}>
                <View style={{ flex: 1 }}>
                    <Text>
                        <Text style={[styles.textDefaultSemiBold, { fontSize: 15, color: '#67806D', }]}>{item.username}</Text>
                        <Text style={[styles.textDefault, { fontSize: 13, }]}> liked your activity </Text>
                        <Text style={[styles.textDefaultBold, { fontSize: 15, color: '#67806D', }]}>{item.activity_name}</Text>
                        <Text style={[styles.textDefault, { fontSize: 13, }]}> for </Text>
                        <Text style={[styles.textDefaultSemiBold, { fontSize: 15, color: '#67806D', }]}>{duration(item.time_start, item.time_end)}</Text>
                    </Text>
                    {/*<Text>
                        <Text style={[styles.textDefaultBold, { fontSize: 15, }]}>{item.category_name}</Text>
                    </Text>*/}
                    <Text style={[styles.textDefault, { fontSize: 13, color: '#949494', marginTop: 4, }]}> {timeAgo(item.time_created)}</Text>

                </View>
                <View style={{ flex: 1 }}>

                </View>

            </View>
        </View>
    );
}
const equal = (prevItem, nextItem) => {
    if (prevItem.item.interaction_id != nextItem.item.interaction_id) {
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
    }, textDefaultMed: {
        fontFamily: 'Inter-Medium',
    }, textDefaultSemiBold: {
        fontFamily: 'Inter-SemiBold',
    },
    outerContainer: {
        marginTop: 110, //here because header is transparent
        flex: 1,
        flexDirection: 'column',
    },
    makeshiftTabBarContainer: {
        flex: 0.1,
    },
    flatListContainer: {
        flex: 0.9,
    },
    makeshiftTabBar: {
        flex: 1,
        flexDirection: 'row',
    },
    flatlistStyle: {
        margin: 5,
        borderRadius: 5,
        padding: 5,
        height: '100%',
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        borderBottomWidth: 0.2,
        borderBottomColor: 'gray',
    },
    pfpcontainer: {
        flex: 0.25,
        //backgroundColor: 'green',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pfp: {
        height: 50,
        width: 50,
        borderRadius: 100,
    },
    title: {
        margin: 10,
        fontSize: 20,
    },
    listItem: {
        flex: 1,
        margin: 5,
        padding: 5,
        //backgroundColor: 'red',
    },
    likeContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    likeCount: {
        marginHorizontal: 5,
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
    tabBarButton: {
        flex: 1,
        padding: 10,
        height: 50,
        backgroundColor: '#ABC57E',
        alignItems: 'center',
        justifyContent: 'center'
    },
    tabBarText: {
        color: 'white',
        fontSize: 17,
    }

})

export const FriendNotificationItem = React.memo(FriendNotificationComponent, equal);