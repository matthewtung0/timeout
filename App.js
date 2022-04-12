import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements';
import Modal from 'react-native-modal'

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';

import { setNavigator } from './src/navigationRef';

import SessionSelectScreen from './src/screens/SessionSelectScreen';
import SessionRewardScreen from './src/screens/SessionRewardScreen';
import FriendFeedScreen from './src/screens/FriendFeedScreen'
import ProfileScreen from './src/screens/ProfileScreen';
import SessionOngoingScreen from './src/screens/SessionOngoingScreen';
import SessionEvalScreen from './src/screens/SessionEvalScreen';
import HistoryDailyScreen from './src/screens/HistoryDailyScreen';

import SignupScreen from './src/screens/SignupScreen';
import SigninScreen from './src/screens/SigninScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import ResolveAuthScreen from './src/screens/ResolveAuthScreen';

import FriendListScreen from './src/screens/FriendListScreen';
import AddFriendScreen from './src/screens/AddFriendScreen';
import TodoListScreen from './src/screens/TodoListScreen';
import AddTodoItemScreen from './src/screens/AddTodoItemScreen';
import FriendProfileScreen from './src/screens/FriendProfileScreen';
import AddCategoryScreen from './src/screens/AddCategoryScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';

import DrawerProfileView from './src/components/DrawerProfileView';

import { Provider as SessionProvider } from './src/context/SessionContext';
import { Provider as AuthProvider } from './src/context/AuthContext';
import { Provider as UserProvider } from './src/context/userContext';
import { Provider as CategoryProvider } from './src/context/CategoryContext';

import { Ionicons } from "@expo/vector-icons";
import FriendScreen from './src/screens/FriendScreen';

import { Context as AuthContext } from './src/context/AuthContext';
import { Context as CategoryContext } from './src/context/CategoryContext';
import { Context as UserContext } from './src/context/userContext';

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
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.navigate('mainFlow')}>
            <Ionicons
              name='arrow-back-outline'
              size={24}
              color='black' />

          </TouchableOpacity>
        ),
        headerTransparent: false,
        headerTitle: 'My Categories',
      })}>
      <Stack.Screen
        name="AddCategory"
        component={AddCategoryScreen}
      />


    </Stack.Navigator>
  )
}

function CreateProfileStack() {
  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.navigate('mainFlow')}>
            <Ionicons
              name='arrow-back-outline'
              size={24}
              color='black' />

          </TouchableOpacity>
        ),
        headerTransparent: true,
        headerTitle: '',
      })}>
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
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
  return (
    <DrawerContentScrollView {...props}>
      <Modal
        style={{ flex: 1, backgroundColor: 'red' }}
        isVisible={modalVis}>
        <Text>modal text</Text>
        <Button title="Close" onPress={() => setModalVis(false)} />
      </Modal>
      <TouchableOpacity
        onPress={() => props.navigation.navigate('Profile temp')}>
        <DrawerProfileView friends={props.friends} username={props.username}
          totalTasks={props.totalTasks} totalTime={props.totalTime} />
      </TouchableOpacity>


      <DrawerItemList {...props} />
      {/*<DrawerItem
        label="Open modal"
        onPress={() => setModalVis(true)}
      />
      <DrawerItem

        label="Toggle drawer"
        onPress={() => props.navigation.toggleDrawer()}
  />*/}
      <DrawerItem
        label="Sign out"
        onPress={signout} />
    </DrawerContentScrollView>
  );
}

function CreateDrawer() {
  const { state: userState } = useContext(UserContext)
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent
        {...props}
        friends={userState.friends}
        username={userState.username}
        totalTime={userState.totalTime}
        totalTasks={userState.totalTasks} />}
      screenOptions={{ headerTintColor: '#67806D', }}
    >
      {/*<Drawer.Screen
        name="SessionSelect"
        component={SessionSelectScreen}
        options={mainOptions(userState.points)}
      />*/}
      {/*<Drawer.Screen 
      name="sessionFlow"
        component={CreateSessionStack}
        options={mainOptions(userState.points)}
      />*/}

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
      <Drawer.Screen name="Profile temp"
        component={CreateProfileStack}
        options={{ drawerLabel: 'Profile temp', title: '', drawerItemStyle: { display: "none" }, headerShown: false }} />
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
function CreateFriendFeedStack() {
  return (
    <Stack.Navigator
      screenOptions={pageOptions}>
      <Stack.Screen
        name="FriendFeed"
        component={FriendFeedScreen}
        options={pageOptions}
      />
      <Stack.Screen
        name="FriendProfile"
        component={FriendProfileScreen}
        options={pageOptions}
      />
      <Stack.Screen
        name="Friend"
        component={FriendScreen}
      />

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
            style={{ flex: 1, backgroundColor: '#67806D', alignItems: 'center', }}
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
          tabBarIconLabel: 'time-outline',
        }} />
      <Tab.Screen name="friendFeedFlow" component={CreateFriendFeedStack}
        options={{
          tabBarLabel: 'Friends',
          tabBarIconLabel: 'people-outline',
        }} />
      <Tab.Screen name="profileFlow" component={HistoryDailyScreen}
        options={{
          tabBarLabel: 'Calendar',
          tabBarIconLabel: 'calendar-outline',
        }} />
    </Tab.Navigator>
  )
}
function CreateMainNavigator() {
  const { state, tryLocalSignin, tempVarSet } = useContext(AuthContext);
  const { fetchUserCategories, fetchUserTodoItems } = useContext(CategoryContext)
  const { fetchOutgoingRequests, fetchIncomingRequests, fetchFriends, fetchSelf } = useContext(UserContext)

  useEffect(async () => {
    console.log("trying local sign in ")
    let res = await tryLocalSignin();
    let firstTime = new Date()
    let splashDisplayTime = 2000;
    if (res) {
      await fetchUserCategories();
      console.log('fetched categories');
      await fetchUserTodoItems();
      console.log('fetched todo items');
      await fetchFriends();
      console.log('fetched friends');
      await fetchOutgoingRequests();
      console.log('fetched outgoing friend requests');
      await fetchIncomingRequests();
      console.log('fetched incoming friend requests');
      await fetchSelf()
      console.log('fetched self');
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
    }
  }, [])

  return (
    <Stack.Navigator>
      {state.tempVar ? (
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
      </AuthProvider>
    </UserProvider>
  )
}