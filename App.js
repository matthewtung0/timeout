//import 'react-native-gesture-handler';
import React, { useContext, useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert, Platform } from 'react-native';
import { Button, withTheme } from 'react-native-elements';
import { Icon } from 'react-native-elements'
import Modal from 'react-native-modal'
import { Ionicons } from "@expo/vector-icons";

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


import {
  createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem,
} from '@react-navigation/drawer';

import SessionSelectScreen from './src/screens/SessionSelectScreen';
import SessionBackfillScreen from './src/screens/SessionBackfillScreen';
import CounterScreen from './src/screens/CounterScreen';
import SessionRewardScreen from './src/screens/SessionRewardScreen';
import FriendFeedScreen from './src/screens/FriendFeedScreen'
import ProfileScreen from './src/screens/ProfileScreen';
import SessionOngoingScreen from './src/screens/SessionOngoingScreen';
import SessionEvalScreen from './src/screens/SessionEvalScreen';
import HistoryDailyScreen from './src/screens/HistoryDailyScreen';
import HistorySearchScreen from './src/screens/HistorySearchScreen';

import SignupScreen from './src/screens/SignupScreen';
import HelpandSupportModal from './src/components/HelpandSupportModal';

import SigninScreen from './src/screens/SigninScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import ResolveAuthScreen from './src/screens/ResolveAuthScreen';
import OnboardCategoryScreen from './src/screens/OnboardCategoryScreen'

import FriendListScreen from './src/screens/FriendListScreen';
import FriendNotificationScreen from './src/screens/FriendNotificationScreen';
import AddFriendScreen from './src/screens/AddFriendScreen';
import TodoListScreen from './src/screens/TodoListScreen';
import AddTodoItemScreen from './src/screens/AddTodoItemScreen';
import FriendProfileScreen from './src/screens/FriendProfileScreen';
import AddCategoryScreen from './src/screens/AddCategoryScreen';
import AddInviteScreen from './src/screens/InviteScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';

import TestSvgScreen from './src/screens/SvgTestScreen';

//import EditAvatarScreen from './src/screens/EditAvatarScreen';
import ShopScreen from './src/screens/InviteScreen';
import PrivacyPolicyScreen from './src/screens/PrivacyPolicyScreen'

import DrawerProfileView from './src/components/DrawerProfileView';

import { Provider as SessionProvider } from './src/context/SessionContext';
import { Provider as AuthProvider } from './src/context/AuthContext';
import { Provider as UserProvider } from './src/context/userContext';
import { Provider as CategoryProvider } from './src/context/CategoryContext';
import { Provider as CounterProvider } from './src/context/CounterContext'
import { Provider as ReactionProvider } from './src/context/ReactionContext'

import FriendScreen from './src/screens/FriendScreen';
import OnboardingScreen1 from './src/screens/OnboardingScreen1';
import OnboardingScreen2 from './src/screens/OnboardingScreen2';
import OnboardingScreen3 from './src/screens/OnboardingScreen3';
import OnboardingScreen4 from './src/screens/OnboardingScreen4';

import { Context as AuthContext } from './src/context/AuthContext';
import { Context as CategoryContext } from './src/context/CategoryContext';
import { Context as CounterContext } from './src/context/CounterContext'
import { Context as UserContext } from './src/context/userContext';
import { Context as SessionContext } from './src/context/SessionContext'
import { Context as ReactionContext } from './src/context/ReactionContext';

import { useFonts } from 'expo-font';
import {
  subMonths, startOfMonth, endOfMonth
} from 'date-fns';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

const drawer_bg = require('./assets/background_sidebar.png');
const pointSquares = require('./assets/point_squares.png')

const config = {
  animation: 'spring',
  config: {
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};

const defaultOptions = {
  headerLeft: () => (
    <Button
      onPress={() => navigation.navigate('mainFlow')}
      title="Go bakc"
      color="#fff"
    />
  ),
}

const pageOptions = {
  headerShown: false,
}

function mainOptions(points) {
  const mainOptions = {
    headerTransparent: true,
    //drawerStyle: { backgroundColor: '#c6cbef' },
    drawerLabelStyle: { color: '#67806D', fontSize: 18, fontWeight: 'bold', },
    drawerActiveTintColor: '#E8D39E',
    drawerItemStyle: { display: 'none', },
    headerTitleAlign: 'center',
    headerTitle: () => {
      return (
        <>
        </>
        /*<View style={{
          backgroundColor: '#F6F2DF', padding: 5, borderTopRightRadius: 50, borderBottomRightRadius: 50,
          flexDirection: 'row', borderWidth: 2, borderColor: '#EAD39E',
        }}>
          <Image
            source={pointSquares}
            style={{ width: 22, height: 22, }}
          />
          <Text style={[{
            fontSize: 17, color: '#67806D', marginHorizontal: 5,
            fontFamily: 'Inter-Medium',
          }]}>
            {points.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }

          </Text>
          </View>*/
      )
    },
  }
  return mainOptions;
}

function drawerOptions() {
  const drawerOptions = {
    drawerStyle: { backgroundColor: '#c6cbef' }
  }
  return drawerOptions
}

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function CreateCategoryStack() {
  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        headerShown: false,
      })}>
      <Stack.Screen
        name="AddCategory"
        component={AddCategoryScreen}
      />


    </Stack.Navigator>
  )
}

function CreatePrivacyPolicyStack() {
  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        headerShown: false,
      })}>
      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicyScreen}
      />


    </Stack.Navigator>
  )
}

function CreateInvitationStack() {
  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        headerShown: false,
        /*headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.navigate('mainFlow')}>
            <Ionicons
              name='arrow-back-outline'
              size={24}
              color='black' />

          </TouchableOpacity>
        ),
        headerTransparent: false,
        headerTitle: 'My Categories',*/
      })}>
      <Stack.Screen
        name="InviteFriend"
        component={AddInviteScreen}
      />


    </Stack.Navigator>
  )
}

function CreateTestSvgStack() {
  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        headerShown: false,
      })}>
      <Stack.Screen
        name="TestSvg"
        component={TestSvgScreen}
      />


    </Stack.Navigator>
  )
}

function CreateProfileStack() {
  return (
    <Stack.Navigator
      screenOptions={() => ({
        headerShown: false
      })}>
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
      />
      {/*<Stack.Screen
        name="EditAvatar"
        component={EditAvatarScreen}
    />*/}
      <Stack.Screen
        name="Shop"
        component={ShopScreen}
      />
      <Stack.Screen
        name="Friend"
        component={FriendScreen}
      />
      <Stack.Screen
        name="userFriendsFlow"
        component={CreateFriendsFlowStack}
      />
      <Stack.Screen
        name="FriendList"
        component={FriendListScreen}
        options={pageOptions}
      />
      <Stack.Screen
        name="TodoFlow"
        component={CreateToDoFlowStack}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
      />
    </Stack.Navigator>
  )
}

function CustomDrawerContent(props) {
  const [modalVis, setModalVis] = useState(false)
  const { signout } = useContext(AuthContext);

  const { clearCategoryContext } = useContext(CategoryContext)
  const { clearCounterContext } = useContext(CounterContext)
  const { clearUserContext, setIdToView } = useContext(UserContext)
  const { clearSessionContext } = useContext(SessionContext)
  const { clearReactionContext } = useContext(ReactionContext)

  const signoutCallback = async () => {
    await clearCategoryContext()
    await clearUserContext()
    await clearSessionContext()
    await clearReactionContext()
    await clearCounterContext()

    console.log("all context cleared!")
  }
  const helpAndSupportModalToggle = () => {
    setModalVis(!modalVis)
  }

  const areYouSureSignOut = () => {
    Alert.alert(
      "Are you sure you want to sign out?",
      "",
      [
        {
          text: "Go back",
          onPress: () => { },
          style: "cancel"
        },
        {
          text: "Sign out", onPress: () => {
            signout(signoutCallback)
          }
        }
      ]
    );
  }
  return (
    <View style={{ flex: 1, }}>
      <View style={{
        position: 'absolute', height: '100%', width: '100%',
        justifyContent: 'flex-end',
      }}>

        <View style={{ alignContent: 'center', justifyContent: 'center', marginBottom: 20, }}>
          <Text style={{ textAlign: 'center', alignSelf: 'center', fontFamily: 'Inter-Regular', color: '#67806D' }}>Time Out ver. 1.0.5</Text>
        </View>
      </View>
      <DrawerContentScrollView
        style={{
          marginBottom: 30,
          //backgroundColor: '#67806D' 
        }}
        contentContainerStyle={{

          //flex: 1, 
        }}
        {...props}
      >
        <View style={{
          //flex: 5, 

        }}>
          <View style={{}}>
            <TouchableOpacity
              onPress={() => {
                setIdToView({ username: props.username, user_id: props.userId })
                props.navigation.navigate('Profile temp')
              }}>
              <DrawerProfileView friends={props.friends} username={props.username}
                totalTasks={props.totalTasks} totalTime={props.totalTime} pfpSrc={props.pfpSrc} userId={props.userId} />
            </TouchableOpacity>


            <DrawerItemList {...props} />
            <Modal
              style={{}}
              isVisible={modalVis}
              backdropTransitionOutTiming={0}>

              <View style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center',
              }}>
                <View style={{
                  height: '70%',
                  borderRadius: 20,
                }}>
                  <HelpandSupportModal
                    toggleFunction={helpAndSupportModalToggle}>
                  </HelpandSupportModal>


                </View>

              </View>
            </Modal>
          </View>
          <View
            style={{
              borderBottomColor: 'grey',
              borderBottomWidth: StyleSheet.hairlineWidth,
            }}
          />
          <DrawerItem
            labelStyle={{ color: '#67806D', fontFamily: 'Inter-SemiBold', fontSize: 15, }}
            label="Help and Support"
            onPress={() => { setModalVis(true) }} />
          <DrawerItem
            labelStyle={{ color: '#67806D', fontFamily: 'Inter-SemiBold', fontSize: 15, }}
            label="Privacy Policy"
            onPress={() => {
              props.navigation.navigate("privacyPolicyFlow")
            }}
          />
        </View>
        <View style={{
          //flex: 1,
        }} />
        <View style={{
          //flex: 1, 
        }}>

        </View>

        <View style={{
          justifyContent: 'flex-end',
        }}>
          <DrawerItem
            labelStyle={{ color: 'crimson', fontFamily: 'Inter-SemiBold', fontSize: 15, }}
            style={{}}
            label="Sign out"
            onPress={() => {
              areYouSureSignOut()
            }} />
          {/*<Image
          style={{ position: 'absolute', borderWidth: 1, }}
          source={drawer_bg}
        resizeMode="contain"></Image>*/}
        </View>

      </DrawerContentScrollView>



    </View>

  );
}

function CreateDrawer() {
  const { state: userState } = useContext(UserContext)
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent
        {...props}
        userId={userState.user_id}
        friends={userState.friends}
        username={userState.username}
        totalTime={userState.totalTime}
        totalTasks={userState.totalTasks}
        pfpSrc={userState.base64pfp} />}
      screenOptions={({ navigation }) => ({
        headerLeft: props =>
          <TouchableOpacity
            style={{
              backgroundColor: '#8CC768',
              borderRadius: 10, paddingHorizontal: 6,
            }}
            onPress={navigation.toggleDrawer}>
            <Icon
              name="menu"
              type='ionicon'
              size={35}
              color='white'
            />
          </TouchableOpacity>
        ,
        //headerTintColor: 'white',
      })}
    >

      <Drawer.Screen name="mainFlow"
        component={CreateMainFlowTab}
        headerTitleAlign='center'
        options={mainOptions(userState.points)}
      //options={[{ drawerLabel: 'Back', title: '', drawerItemStyle: { display: "flex" } },]} />
      />

      <Drawer.Screen name="categoryFlow"
        component={CreateCategoryStack}
        options={{
          drawerLabelStyle: { color: '#67806D', fontFamily: 'Inter-SemiBold', fontSize: 15, },
          drawerLabel: 'Categories',
          title: 'My Categories',
          headerShown: false,
        }} />

      {/* this one is hidden */}
      <Drawer.Screen name="Profile temp"
        component={CreateProfileStack}
        options={{ drawerLabel: 'Profile temp', title: '', drawerItemStyle: { display: "none" }, headerShown: false }} />

      <Drawer.Screen name="testFlow"
        component={CreateTestSvgStack}
        options={{
          drawerLabelStyle: { color: '#67806D', fontFamily: 'Inter-SemiBold', fontSize: 15, },
          drawerLabel: 'Customize Avatar',
          title: 'Customize Avatar',
          headerShown: false,
        }} />

      <Drawer.Screen name="privacyPolicyFlow"
        component={CreatePrivacyPolicyStack}
        options={{
          drawerLabel: 'Privacy Policy',
          title: 'Privacy Policy',
          headerShown: false,
          drawerItemStyle: { display: 'none', },
        }} />


    </Drawer.Navigator>
  );
}

function CreateLoginStack() {
  return (
    <Stack.Navigator
      options={pageOptions}>
      <Stack.Screen
        name="SignIn"
        component={SigninScreen}
        options={pageOptions}
      />
      <Stack.Screen
        name="SignUp"
        component={SignupScreen}
        options={pageOptions}
      />
      <Stack.Screen
        name="OnboardCategory"
        component={OnboardCategoryScreen}
        options={pageOptions}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={pageOptions}
      />
    </Stack.Navigator>
  )
}

function CreateOnboardingStack() {
  return (
    <Stack.Navigator
      screenOptions={pageOptions}>
      <Stack.Screen
        name="Onboarding1"
        component={OnboardingScreen1}
        options={pageOptions}
      />
      <Stack.Screen
        name="Onboarding2"
        component={OnboardingScreen2}
        options={pageOptions}
      />
      <Stack.Screen
        name="Onboarding3"
        component={OnboardingScreen3}
        options={pageOptions}
      />
      <Stack.Screen
        name="Onboarding4"
        component={OnboardingScreen4}
        options={pageOptions}
      />

    </Stack.Navigator>
  )
}

function CreateSessionStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'none'
      }}>

      <Stack.Screen
        name="drawer"
        component={CreateDrawer}
        options={pageOptions} />
      {/*<Stack.Screen
        name="SessionSelect"
        component={SessionSelectScreen}
        options={pageOptions}
  />*/}
      {/*<Stack.Screen
        name="mainFlow"
        component={CreateMainFlowTab}
options={pageOptions} />*/}
      <Stack.Screen
        name="SessionBackfill"
        component={SessionBackfillScreen}
        options={pageOptions}>
      </Stack.Screen>
      <Stack.Screen
        name="SessionOngoing"
        component={SessionOngoingScreen}
        options={{
          headerShown: false,
          animation: 'none',
          gestureEnabled: false,
          /*transitionSpec: {
            open: config,
            close: config,
          }*/
        }}
      />
      <Stack.Screen
        name="SessionEval"
        component={SessionEvalScreen}
        options={pageOptions}
      />
      <Stack.Screen
        name="SessionReward"
        component={SessionRewardScreen}
        options={pageOptions}
      />
    </Stack.Navigator>
  )
}
const horizontalAnimation = {
  gestureDirection: 'horizontal',
  cardStyleInterpolator: ({ current, layouts }) => {
    return {
      cardStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.width, 0],
            }),
          },
        ],
      },
    };
  },
};
const horizontalInvertedAnimation = {
  gestureDirection: 'horizontal-inverted',
  cardStyleInterpolator: ({ current, layouts }) => {
    return {
      cardStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.width, 0],
            }),
          },
        ],
      },
    };
  },
};
const verticalAnimation = {
  gestureDirection: 'vertical',
  cardStyleInterpolator: ({ current, layouts }) => {
    return {
      cardStyle: {
        transform: [
          {
            translateY: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.height, 0],
            }),
          },
        ],
      },
    };
  },
};



function CreateHistoryStack() {
  return (
    <Stack.Navigator
      screenOptions={pageOptions}>
      <Stack.Screen
        name="HistoryDaily"
        component={HistoryDailyScreen}
        options={pageOptions}
      />
      <Stack.Screen
        name="HistorySearch"
        component={HistorySearchScreen}
        options={pageOptions}
        headerShown={false}
      />
    </Stack.Navigator>
  )
}

function CreateFriendFeedStack() {
  return (
    <Stack.Navigator
    //screenOptions={pageOptions}>
    >
      <Stack.Group
      >
        <Stack.Screen
          name="FriendFeed"
          component={FriendFeedScreen}
          options={{
            headerShown: false,
            animation: 'none',
          }}
        />

      </Stack.Group>
      <Stack.Group
      >
        <Stack.Screen
          name="Notifications"
          component={FriendNotificationScreen}
          options={{
            headerShown: false,
            animation: 'none'
          }}
        />
      </Stack.Group>
      <Stack.Group
        screenOptions={horizontalAnimation}
      >
        <Stack.Screen
          name="FriendProfile"
          component={FriendProfileScreen}
          options={pageOptions}
        />
        <Stack.Screen
          name="Friend"
          component={FriendScreen}
          options={{
            headerShown: false,
            animation: 'none'
          }}
        />
      </Stack.Group>

    </Stack.Navigator>
  )
}
function CreateToDoFlowStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="TodoList"
        component={TodoListScreen}
        options={pageOptions}
      />
      <Stack.Screen
        name="AddTodoItem"
        component={AddTodoItemScreen}
        options={pageOptions}
      />
    </Stack.Navigator>
  )
}
function CreateFriendsFlowStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="FriendList"
        component={FriendListScreen}
        options={pageOptions}
      />
      <Stack.Screen
        name="AddFriend"
        component={AddFriendScreen}
        options={pageOptions}
      />
    </Stack.Navigator>
  )
}

function MyTabBar({ state: tabState, descriptors, navigation }) {
  return (
    <View style={{ flexDirection: 'row' }}>
      {tabState.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;
        const iconLabel = options.tabBarIconLabel
        const iconLabelActive = options.tabBarIconLabelActive

        const isFocused = tabState.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            navigation.navigate({ name: route.name, merge: true });
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={index.toString()}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{
              flex: 1, backgroundColor: '#67806D', alignItems: 'center',
              paddingBottom: Platform.OS === 'ios' ? 30 : 10, paddingTop: 10,
            }}
          >

            <Ionicons
              name={isFocused ? iconLabelActive : iconLabel}
              size={24}
              color={'white'} />
            <Text style={{ color: 'white', fontFamily: 'Inter-SemiBold', fontSize: 16, }}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function CreateMainFlowTab() {
  return (
    <Tab.Navigator tabBar={(props) => <MyTabBar {...props} />}
    //screenOptions={pageOptions}
    >
      <Tab.Screen name="SessionSelect" component={SessionSelectScreen}
        options={{
          headerShown: false,
          labelStyle: { fontFamily: 'Inter-Bold', fontSize: 18, },
          tabBarLabel: 'Timer',
          tabBarIconLabel: 'time-outline',
          tabBarIconLabelActive: 'time'
        }} />
      <Tab.Screen name="CounterFlow" component={CounterScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Counter',
          tabBarIconLabel: 'copy-outline',
          tabBarIconLabelActive: 'copy'
        }} />
      <Tab.Screen name="friendFeedFlow" component={CreateFriendFeedStack}
        options={{
          headerShown: false,
          tabBarLabel: 'Friends',
          tabBarIconLabel: 'people-outline',
          tabBarIconLabelActive: 'people'
        }} />
      <Tab.Screen name="profileFlow" component={CreateHistoryStack}
        options={{
          headerShown: false,
          tabBarLabel: 'History',
          tabBarIconLabel: 'calendar-outline',
          tabBarIconLabelActive: 'calendar',
        }} />
    </Tab.Navigator>
  )
}

function CreateMainNavigator() {
  const { state, tryLocalSignin, tempVarSet } = useContext(AuthContext);
  const { fetchUserCategories, fetchUserTodoItems } = useContext(CategoryContext)
  const { fetchUserReactions } = useContext(ReactionContext)
  const { state: sessionState, fetchMultipleMonths, setOffsetFetched } = useContext(SessionContext)
  const { fetchUserCounters, fetchMultipleMonthsCounters } = useContext(CounterContext)
  const { fetchAvatarGeneral, updateLastSignin, fetchOutgoingRequests,
    fetchIncomingRequests, fetchFriends, fetchSelf,
    fetchAvatarItemsOwned } = useContext(UserContext)
  const [fontsLoaded] = useFonts({
    'Inter-Regular': require('./assets/fonts/Inter-Regular.ttf'),
    'Inter-Medium': require('./assets/fonts/Inter-Medium.ttf'),
    'Inter-Bold': require('./assets/fonts/Inter-Bold.ttf'),
    'Inter-SemiBold': require('./assets/fonts/Inter-SemiBold.ttf')
  });
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    async function startup() {
      console.log("trying local sign in ")
      notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        console.log(notification);
      });
      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        console.log(response);
      });

      let res = await tryLocalSignin();
      let firstTime = new Date()
      let splashDisplayTime = 5000;
      if (res) {

        await updateLastSignin()
          .then((res) => fetchSelf().then(
            (res) => {
              fetchAvatarGeneral(res.user_id, true, true, false)
              fetchUserCategories(res.user_id, true, true);
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
        await fetchUserTodoItems(true);
        await fetchFriends();
        await fetchOutgoingRequests();
        await fetchIncomingRequests();

        let secondTime = new Date();
        let timeDiff = (secondTime.getTime() - firstTime.getTime());
        console.log("millisec that api calls took up: ", timeDiff);
        splashDisplayTime = splashDisplayTime - timeDiff;

        // adjust splash display time
      }
      if (splashDisplayTime > 0) {
        setTimeout(
          () => {
            tempVarSet()
          }, splashDisplayTime);
      } else {
        tempVarSet()
      }
    }
    startup();

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    }

  }, [])

  return (
    // true || not false
    // turns to false || not true
    <Stack.Navigator>

      {(state.tempVar) ? (
        <Stack.Screen
          name="SplashScreen"
          component={ResolveAuthScreen}
          options={pageOptions} />

      ) : state.token == null ? (
        <Stack.Screen
          name="loginFlow"
          component={CreateLoginStack}
          options={pageOptions} />

      ) : (state.showOnboarding == true ? (
        <Stack.Screen
          name="onboardingFlow"
          component={CreateOnboardingStack}
          options={pageOptions} />)
        :
        (
          <Stack.Screen
            name="sessionFlow"
            component={CreateSessionStack}
            options={pageOptions} />
        ))

      }

    </Stack.Navigator>

  )
}
export default () => {
  return (
    <UserProvider>
      <AuthProvider>
        <CounterProvider>
          <CategoryProvider>
            <SessionProvider>
              <ReactionProvider>
                <NavigationContainer>
                  <Stack.Navigator>
                    <Stack.Screen
                      name="MainStack"
                      component={CreateMainNavigator}
                      options={pageOptions} />
                  </Stack.Navigator>
                </NavigationContainer>
              </ReactionProvider>
            </SessionProvider>
          </CategoryProvider>
        </CounterProvider>
      </AuthProvider>
    </UserProvider>
  )
}