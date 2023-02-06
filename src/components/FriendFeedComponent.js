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
import { Context as ReactionContext } from '../context/ReactionContext';
import FriendFeedReactorsModal from '../components/FriendFeedReactorsModal'

const FriendFeedComponent = ({ item, index, cacheChecker, navigation, userReaction, reactToActivity_ }) => {
  const { height, width } = Dimensions.get('window');
  const { setIdToView } = useContext(UserContext)

  //const { state: reactionState, reactToActivity, } = useContext(ReactionContext)
  const [reactionCount, setReactionCount] = useState(item.reaction_count)
  const [modalVisible, setModalVisible] = useState(false)

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


      <View style={styles.pfpcontainer}>
        <View style={styles.pfp}>
          {/* friend thumbnails */}
          <TouchableOpacity
            onPress={() => {
              setIdToView({ username: item.username, user_id: item.user_id })
              navigation.navigate('Profile temp')
            }}>
            <AvatarComponent w={50}
              id={item.user_id}
            //useCache={cacheChecker[item.user_id] == false}
            //cacheChecker={cacheChecker}
            //setCacheChecker={setCacheChecker}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.listItem}>
        <View style={{ flex: 1, borderWidth: 0, }}>
          <Text numberOfLines={2}>
            <Text style={[styles.textDefaultBold, { fontSize: 15, }]}>{item.username}</Text>
            <Text style={[styles.textDefault, { fontSize: 15, }]}> worked on </Text>
            <Text style={[styles.textDefaultBold, { fontSize: 15, }]}>{duration(item.time_start, item.time_end)}</Text>
            <Text style={[styles.textDefault, { fontSize: 15, }]}> of </Text>
            {/*[styles.bolded, { color: constants.colors[item.color_id] }]*/}
            <Text style={[styles.textDefaultBold, { fontSize: 15, }]}>{item.category_name}</Text>
          </Text>



        </View>
        <View style={{ flex: 1, borderWidth: 0, }}>
          <View style={{ flexDirection: 'row' }}>
            <View>
              <Text style={[styles.textDefault, { fontSize: 10, color: '#949494', marginTop: 8, }]}> {timeAgo(item.time_end)}</Text>

            </View>

            <View style={[styles.likeContainer, { borderWidth: 0, }]}>
              <TouchableOpacity
                onPress={toggleModal}>
                <Text style={[styles.likeCount, { borderWidth: 0, paddingHorizontal: 5, }]}>
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
                }}>
                {JSON.stringify(userReaction).includes(item.activity_id) ?
                  <Icon
                    name="heart"
                    type='font-awesome'
                    color='#F5BBAE' /> :
                  <Icon
                    name="heart-o"
                    type='font-awesome' />}
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
    //height: 75,
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

export default React.memo(FriendFeedComponent, equal)