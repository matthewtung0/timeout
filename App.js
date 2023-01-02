import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Button } from 'react-native-elements';
import Modal from 'react-native-modal'

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import {
  createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem,
} from '@react-navigation/drawer';

import { setNavigator } from './src/navigationRef';

import SessionSelectScreen from './src/screens/SessionSelectScreen';
import CounterScreen from './src/screens/CounterScreen';
import SessionRewardScreen from './src/screens/SessionRewardScreen';
import FriendFeedScreen from './src/screens/FriendFeedScreen'
import ProfileScreen from './src/screens/ProfileScreen';
import SessionOngoingScreen from './src/screens/SessionOngoingScreen';
import SessionEvalScreen from './src/screens/SessionEvalScreen';
import HistoryDailyScreen from './src/screens/HistoryDailyScreen';

import SignupScreen from './src/screens/SignupScreen';
import SignupScreen2 from './src/screens/SignupScreen2';
import SignupScreen3 from './src/screens/SignupScreen3';

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

import EditAvatarScreen from './src/screens/EditAvatarScreen';
import ShopScreen from './src/screens/InviteScreen';

import DrawerProfileView from './src/components/DrawerProfileView';

import { Provider as SessionProvider } from './src/context/SessionContext';
import { Provider as AuthProvider } from './src/context/AuthContext';
import { Provider as UserProvider } from './src/context/userContext';
import { Provider as CategoryProvider } from './src/context/CategoryContext';
import { Provider as CounterProvider } from './src/context/CounterContext'

import { Ionicons } from "@expo/vector-icons";
import FriendScreen from './src/screens/FriendScreen';

import { Context as AuthContext } from './src/context/AuthContext';
import { Context as CategoryContext } from './src/context/CategoryContext';
import { Context as CounterContext } from './src/context/CounterContext'
import { Context as UserContext } from './src/context/userContext';
import { Context as SessionContext } from './src/context/SessionContext'

import { useFonts } from 'expo-font';

const drawer_bg = require('./assets/background_sidebar.png');

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
    headerTitle: () => {
      return (
        <View style={{
          backgroundColor: '#F6F2DF', padding: 5, borderTopRightRadius: 50, borderBottomRightRadius: 50, flexDirection: 'row', borderWidth: 1,
          borderColor: '#EAD39E'
        }}>
          <View style={{ backgroundColor: '#ABC57E', height: 20, width: 20, }}></View>
          <Text style={{ fontSize: 15, color: '#67806D', marginHorizontal: 5, }}>{parseInt(points).toLocaleString()}</Text>
        </View>
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
        name="AddCategory"
        component={AddCategoryScreen}
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
        /*headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.navigate('mainFlow')}>
            <Ionicons
              name='arrow-back-outline'
              size={24}
              color='black' />

          </TouchableOpacity>
        ),
        headerTransparent: true,
        headerTitle: '',*/
      })}>
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
      />
      <Stack.Screen
        name="EditAvatar"
        component={EditAvatarScreen}
      />
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
  const { clearUserContext, setIdToView } = useContext(UserContext)
  const { clearSessionContext } = useContext(SessionContext)

  const signoutCallback = async () => {
    await clearCategoryContext
    await clearUserContext
    await clearSessionContext
    console.log("all context cleared!")
  }
  return (
    <><DrawerContentScrollView
      style={{}}
      contentContainerStyle={{ flex: 1, }}
      {...props}
    >
      <View style={{ flex: 5, }}>
        <View style={{}}>
          <TouchableOpacity
            onPress={() => {
              setIdToView({ username: props.username, user_id: props.userId })
              props.navigation.navigate('Profile temp')
            }}>
            <DrawerProfileView friends={props.friends} username={props.username}
              totalTasks={props.totalTasks} totalTime={props.totalTime} pfpSrc={props.pfpSrc} />
          </TouchableOpacity>


          <DrawerItemList {...props} />
          <Modal
            style={{ flex: 1, backgroundColor: 'red' }}
            isVisible={modalVis}>
            <Text>modal text</Text>
            <Button title="Close" onPress={() => setModalVis(false)} />
          </Modal>
        </View>


        {/*<DrawerItem
        label="Open modal"
        onPress={() => setModalVis(true)}
      />
      <DrawerItem

        label="Toggle drawer"
        onPress={() => props.navigation.toggleDrawer()}
  />*/}
        <View
          style={{
            borderBottomColor: 'grey',
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}
        />
        <DrawerItem
          label="Help and Support"
          onPress={() => { }} />
        <DrawerItem
          label="Privacy Policy"
          onPress={() => { }} />
        <DrawerItem
          label="Terms of Use"
          onPress={() => { }} />

      </View>
      <View style={{ flex: 1, }} />
      <View style={{ flex: 1, }}>
        <DrawerItem
          labelStyle={{ color: 'pink', }}
          style={{}}
          label="Sign out"
          onPress={() => {
            signout(signoutCallback)
          }} />
      </View>

      <View style={{ flex: 1, justifyContent: 'flex-end', }}>
        <Image
          style={{ position: 'absolute', }}
          source={drawer_bg}
          resizeMode="contain"></Image>
        <View style={{ alignContent: 'center', justifyContent: 'center', marginBottom: 10, }}>
          <Text style={{ textAlign: 'center', alignSelf: 'center', }}>Time Out ver. 0.01</Text>
        </View>
      </View>

    </DrawerContentScrollView>


    </>

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
      screenOptions={{ headerTintColor: '#67806D', }}
    >

      <Drawer.Screen name="mainFlow"
        component={CreateMainFlowTab}
        options={mainOptions(userState.points)}
      //options={[{ drawerLabel: 'Back', title: '', drawerItemStyle: { display: "flex" } },]} />
      />

      <Drawer.Screen name="categoryFlow"
        component={CreateCategoryStack}
        options={{
          drawerLabel: 'My Categories',
          title: 'My Categories',
          headerShown: false,
        }} />

      {/* this one is hidden */}
      <Drawer.Screen name="Profile temp"
        component={CreateProfileStack}
        options={{ drawerLabel: 'Profile temp', title: '', drawerItemStyle: { display: "none" }, headerShown: false }} />

      {/*<Drawer.Screen name="notificationFlow"
        component={CreateCategoryStack}
        options={{
          drawerLabel: 'Notifications',
          title: 'Notifications',
          headerShown: false,
        }} />*/}

      <Drawer.Screen name="testFlow"
        component={CreateTestSvgStack}
        options={{
          drawerLabel: 'Customize Avatar',
          title: 'Customize Avatar',
          headerShown: false,
        }} />

      <Drawer.Screen name="inviteFlow"
        component={CreateInvitationStack}
        options={{
          drawerLabel: 'Invite a Friend',
          title: 'Invite a Friend',
          headerShown: false,
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
        name="SignUp2"
        component={SignupScreen2}
        options={pageOptions}
      />
      <Stack.Screen
        name="SignUp3"
        component={SignupScreen3}
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

function CreateSessionStack() {
  return (
    <Stack.Navigator
      screenOptions={pageOptions}>

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
        name="SessionOngoing"
        component={SessionOngoingScreen}
        options={pageOptions}
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
          options={pageOptions}
        />

      </Stack.Group>
      <Stack.Group
      >
        <Stack.Screen
          name="Notifications"
          component={FriendNotificationScreen}
          options={pageOptions}
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
          options={pageOptions}
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
            style={{ flex: 1, backgroundColor: '#67806D', alignItems: 'center', paddingBottom: 30, paddingTop: 10, }}
          >

            <Ionicons
              name={iconLabel}
              size={24}
              color={isFocused ? '#673ab7' : 'white'} />
            <Text style={{ color: isFocused ? '#673ab7' : 'white' }}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
//options={mainOptions(userState.points)}
function CreateMainFlowTab() {
  return (
    <Tab.Navigator tabBar={(props) => <MyTabBar {...props} />}
      screenOptions={pageOptions}
    >
      {/*<Tab.Navigator>*/}

      {/*<Tab.Screen name="sessionFlow" component={CreateSessionStack}
        options={{
          tabBarLabel: 'Timer',
          tabBarIconLabel: 'time-outline',
        }} />*/}
      <Tab.Screen name="SessionSelect" component={SessionSelectScreen}
        options={{
          tabBarLabel: 'Timer',
          tabBarIconLabel: 'time-outline'
        }} />
      <Tab.Screen name="CounterFlow" component={CounterScreen}
        options={{
          tabBarLabel: 'Counter',
          tabBarIconLabel: 'copy-outline',
        }} />
      <Tab.Screen name="friendFeedFlow" component={CreateFriendFeedStack}
        options={{
          tabBarLabel: 'Friends',
          tabBarIconLabel: 'people-outline',
        }} />
      <Tab.Screen name="profileFlow" component={HistoryDailyScreen}
        options={{
          tabBarLabel: 'History',
          tabBarIconLabel: 'calendar-outline',
        }} />
    </Tab.Navigator>
  )
}
function CreateMainNavigator() {
  const { state, tryLocalSignin, tempVarSet } = useContext(AuthContext);
  const { fetchUserCategories, fetchUserTodoItems } = useContext(CategoryContext)
  const { fetchUserCounters } = useContext(CounterContext)
  const { state: userState, fetchAvatar, updateLastSignin, fetchOutgoingRequests,
    fetchIncomingRequests, fetchFriends, fetchSelf, fetchAvatarItemsOwned } = useContext(UserContext)
  const [fontsLoaded] = useFonts({
    'Inter-Regular': require('./assets/fonts/Inter-Regular.ttf'),
    'Inter-Bold': require('./assets/fonts/Inter-Bold.ttf'),
  });
  useEffect(() => {
    async function startup() {
      console.log("trying local sign in ")


      let res = await tryLocalSignin();
      let firstTime = new Date()
      let splashDisplayTime = 5000;
      if (res) {
        await updateLastSignin()
        await fetchSelf()
        console.log('fetched self');
        await fetchAvatar(forceRetrieve = false)
        await fetchUserCategories(userState.user_id, getPrivate = true, isSelf = true);
        console.log('fetched categories');
        await fetchUserCounters();
        console.log('fetched counters')
        await fetchAvatarItemsOwned();
        console.log('fetched avatar items owned')
        await fetchUserTodoItems(isSelf = true);
        console.log('fetched todo items');
        await fetchFriends();
        console.log('fetched friends');
        await fetchOutgoingRequests();
        console.log('fetched outgoing friend requests');
        await fetchIncomingRequests();
        console.log('fetched incoming friend requests');

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

      ) : (
        <Stack.Screen
          name="sessionFlow"
          component={CreateSessionStack}
          options={pageOptions} />)}
      {/*<Stack.Screen
          name="drawer"
          component={CreateDrawer}
          options={pageOptions}
      />*/}

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

              <NavigationContainer>

                <Stack.Navigator>

                  <Stack.Screen
                    name="MainStack"
                    component={CreateMainNavigator}
                    options={pageOptions} />

                </Stack.Navigator>

              </NavigationContainer>
            </SessionProvider>
          </CategoryProvider>

        </CounterProvider>

      </AuthProvider>
    </UserProvider>
  )
}