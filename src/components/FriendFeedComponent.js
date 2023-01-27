import React, { useContext, useState } from 'react';
import {
  View, StyleSheet, Text, Pressable,
  TouchableOpacity, Dimensions
} from 'react-native';
import { Icon } from 'react-native-elements';
import {
  differenceInDays, differenceInYears, differenceInMonths, differenceInHours,
  differenceInMinutes,
  parseISO, differenceInSeconds, isThisMinute
} from 'date-fns';
import Modal from 'react-native-modal'
import { Context as UserContext } from '../context/userContext';
import AvatarComponent from '../components/AvatarComponent';
import { Context as SessionContext } from '../context/SessionContext';
import FriendFeedReactorsModal from '../components/FriendFeedReactorsModal'

export function FriendFeedComponent({ item, navigation }) {
  const { height, width } = Dimensions.get('window');
  const { state: userState, setIdToView } = useContext(UserContext)

  const [disableTouch, setDisableTouch] = useState(false)
  const { state: sessionState, fetchUserReactions,
    reactToActivity, fetchAvatars } = useContext(SessionContext)
  const [reactionCount, setReactionCount] = useState(item.reaction_count)
  const [modalVisible, setModalVisible] = useState(false)

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
      height: 75,
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

  const duration = (startTime, endTime) => {
    return differenceInSeconds(parseISO(endTime), parseISO(startTime))
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
  const toggleModal = () => {
    setModalVisible(!modalVisible)
  }

  console.log("Rendered " + item.activity_id + " which is " + item.activity_name)
  console.log(item.reaction_count);

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
              //isSelf={item.username == userState.username}
              id={item.user_id}
            //pfpSrc={userState.base64pfp} 
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.listItem}>
        <View style={{ flex: 1 }}>
          <Text>
            <Text style={[styles.textDefaultBold, { fontSize: 15, }]}>{item.username}</Text>
            <Text style={[styles.textDefault, { fontSize: 15, }]}> worked on </Text>
            <Text style={[styles.textDefaultBold, { fontSize: 15, }]}>{duration(item.time_start, item.time_end)}</Text>
            <Text style={[styles.textDefault, { fontSize: 15, }]}> seconds</Text>
          </Text>
          <Text>
            <Text style={[styles.textDefault, { fontSize: 15, }]}>of </Text>
            {/*[styles.bolded, { color: constants.colors[item.color_id] }]*/}
            <Text style={[styles.textDefaultBold, { fontSize: 15, }]}>{item.category_name}</Text>

          </Text>
          <Text style={[styles.textDefault, { fontSize: 10, color: '#949494', marginTop: 8, }]}> {timeAgo(item.time_end)}</Text>

        </View>
        <View style={{ flex: 1 }}>
          <View style={[styles.likeContainer, { borderWidth: 1, }]}>
            <TouchableOpacity
              onPress={toggleModal}>
              <Text style={[styles.likeCount, { borderWidth: 1, paddingHorizontal: 5, }]}>
                {item.reaction_count == null ? 0 : reactionCount}</Text>
            </TouchableOpacity>

            <Pressable
              onPress={() => {
                let is_like = true
                if (JSON.stringify(sessionState.userReaction).includes(item.activity_id)) {
                  is_like = false
                  setReactionCount(reactionCount - 1)
                } else {
                  setReactionCount(reactionCount + 1)
                }
                reactToActivity(item.activity_id, is_like, reactCallback)
              }}>
              {JSON.stringify(sessionState.userReaction).includes(item.activity_id) ?
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
    </View >
  );
}
export const MemoizedComponent = React.memo(FriendFeedComponent);