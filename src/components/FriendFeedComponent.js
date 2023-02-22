import React, { useContext, useState } from 'react';
import {
  View, StyleSheet, Text, Pressable, TouchableOpacity, Dimensions
} from 'react-native';
import { Icon } from 'react-native-elements';
import {
  differenceInDays, differenceInYears, differenceInMonths, differenceInHours,
  differenceInMinutes, parseISO, differenceInSeconds,
} from 'date-fns';
import Modal from 'react-native-modal'
import { Context as UserContext } from '../context/userContext';
import AvatarComponent from '../components/AvatarComponent';
import FriendFeedReactorsModal from '../components/FriendFeedReactorsModal'

const FriendFeedComponent = ({ item, index, cacheChecker, myUsername, navigation, userReaction, reactToActivity_,
  sendLikeNotification_ }) => {
  const { height } = Dimensions.get('window');
  const { setIdToView } = useContext(UserContext)
  const [reactionCount, setReactionCount] = useState(item.reaction_count)
  const [modalVisible, setModalVisible] = useState(false)

  const duration = (startTime, endTime) => {
    var diff_in_min = differenceInMinutes(parseISO(endTime), parseISO(startTime))
    if (diff_in_min >= 60) {
      return `${Math.floor(diff_in_min / 60)} hours ${diff_in_min % 60} minutes`
    } else if (diff_in_min <= 1) {
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

  // make buttons enabled again after api calls done
  const reactCallback = () => {
  }

  const toggleModal = () => {
    setModalVisible(!modalVisible)
  }

  console.log("Rendered " + index)

  return (
    <View style={styles.container}>
      {/*{console.log("item rendering..", item.activity_id)}*/}


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
              cacheChecker={cacheChecker}
            />
          </View>
        </View>
      </Modal>


      <View style={[styles.pfpcontainer, { paddingTop: 15, }]}>
        <View style={styles.pfp}>
          {/* friend thumbnails */}
          <TouchableOpacity
            onPress={() => {
              setIdToView({ username: item.username, user_id: item.user_id })
              navigation.navigate('Profile temp')
            }}>
            <AvatarComponent w={50}
              id={item.user_id}
              isThumbnail={true}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.listItem}>
        <View style={{ flex: 1, borderWidth: 0, }}>
          <View style={{ flexDirection: 'row', borderWidth: 0, alignItems: 'flex-end', }}>

            <TouchableOpacity style={{ borderWidth: 0 }}
              onPress={() => {
                setIdToView({ username: item.username, user_id: item.user_id })
                navigation.navigate('Profile temp')
              }}>
              <Text style={[styles.textDefaultSemiBold, { fontSize: 15, color: "#67806D" }]}>{item.username}</Text>
            </TouchableOpacity>
            <Text numberOfLines={1} style={{}}>
              <Text style={[styles.textDefault, { fontSize: 13, }]}> worked on </Text>
            </Text>
            {item.is_private ?
              <>
                <View style={[styles.categoryStyle, {
                  borderColor: "grey", backgroundColor: '#C0C0C0',
                  justifyContent: 'center', paddingHorizontal: 7,
                }]}>
                  <Text style={[styles.textDefault, { fontSize: 15, color: "#67806D", color: 'white', }]}>{item.category_name}</Text>
                </View>
              </>
              :
              <>
                {item.public ?
                  <View style={[styles.categoryStyle, {
                    borderColor: "grey", backgroundColor: '#C0C0C0',
                    justifyContent: 'center', paddingHorizontal: 7,
                  }]}>
                    <Text style={[styles.textDefault, { fontSize: 15, color: "#67806D", color: 'white', }]}>{item.category_name}</Text>
                  </View>

                  :
                  <Text style={[styles.textDefaultMed, { fontSize: 15, color: "#67806D" }]}>[REDACTED]</Text>
                }
              </>
            }
          </View>


          {item.is_private ? null :
            <Text style={{ marginTop: 5, }}>
              <Text style={[styles.textDefaultMed, { fontSize: 15, color: "#67806D" }]}>{item.activity_name}</Text>
            </Text>
          }
          <View style={{ flexDirection: 'row', marginTop: 4, }}>
            <View style={{ borderWidth: 0 }}>
              <Icon
                name="time-outline"
                type='ionicon'
                size={18}
                color='#67806D' />
            </View>
            <View style={{ borderWidth: 0, }}>
              <Text style={[styles.textDefaultMed, { fontSize: 14, color: "#67806D" }]}> {duration(item.time_start, item.time_end)}</Text>

            </View>
          </View>

        </View>
        <View style={{ borderWidth: 0, }}>
          <View style={{ flexDirection: 'row' }}>
            <View>
              <Text style={[styles.textDefault, { fontSize: 13, color: '#949494', marginTop: 5, }]}> {timeAgo(item.time_end)}</Text>

            </View>

            <View style={[styles.likeContainer, { borderWidth: 0, }]}>
              <TouchableOpacity
                onPress={toggleModal}>
                <Text style={[styles.likeCount, styles.textDefault,
                { borderWidth: 0, paddingHorizontal: 5, color: "#67806D" }]}>
                  {item.reaction_count == null ? 0 : reactionCount}</Text>
              </TouchableOpacity>

              <Pressable
                onPress={() => {
                  let is_like = true
                  if (JSON.stringify(userReaction).includes(item.activity_id)) {
                    is_like = false
                    setReactionCount(reactionCount - 1)
                  } else {
                    setReactionCount(reactionCount + 1)
                  }
                  reactToActivity_(item.activity_id, is_like, reactCallback)
                  if (item.expo_token && is_like) {
                    var tokenJSON = JSON.parse(item.expo_token)
                    console.log(`Sending notification to token ${tokenJSON}`)
                    sendLikeNotification_(myUsername, tokenJSON['token']['data'], item.activity_name)
                  }

                }}>
                {JSON.stringify(userReaction).includes(item.activity_id) ?
                  <Icon
                    name="heart"
                    type='font-awesome'
                    color='#F5BBAE' /> :
                  <Icon
                    name="heart-o"
                    type='font-awesome'
                    color='#F5BBAE' />}
              </Pressable>
            </View>
          </View>

        </View>

      </View>
    </View >
  );
}

const equal = (prevItem, nextItem) => {
  if (prevItem.item.activity_id != nextItem.item.activity_id) {
    return false;
  }
  // activity id's are equal

  if (JSON.stringify(prevItem.userReaction).includes(prevItem.item.activity_id) !=
    JSON.stringify(nextItem.userReaction).includes(prevItem.item.activity_id)) {
    return false;
  }

  return true;
}

const styles = StyleSheet.create({
  textDefaultBold: {
    fontFamily: 'Inter-Bold',
  },
  textDefaultMed: {
    fontFamily: 'Inter-Medium',
  }, textDefaultSemiBold: {
    fontFamily: 'Inter-SemiBold',
  },
  textDefault: {
    fontFamily: 'Inter-Regular',
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
    //height: 75,
  },
  pfpcontainer: {
    flex: 0.25,
    //justifyContent: 'center',
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
  }, categoryStyle: {
    borderRadius: 10,
    paddingHorizontal: 4,
  },

})

export default React.memo(FriendFeedComponent, equal)