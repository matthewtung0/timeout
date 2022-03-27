import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements';
import Modal from 'react-native-modal'

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';

import { setNavigator } from './src/navigationRef';

import SessionSelectScreen from './src/screens/SessionSelectScreen';
import FriendFeedScreen from './src/screens/FriendFeedScreen'
import ProfileScreen from './src/screens/ProfileScreen';
import SessionOngoingScreen from './src/screens/SessionOngoingScreen';
import SessionEvalScreen from './src/screens/SessionEvalScreen';
import HistoryDailyScreen from './src/screens/HistoryDailyScreen';
import HistoryMonthlyScreen from './src/screens/HistoryMonthlyScreen';

import SignupScreen from './src/screens/SignupScreen';
import SigninScreen from './src/screens/SigninScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import ResolveAuthScreen from './src/screens/ResolveAuthScreen';

import FriendListScreen from './src/screens/FriendListScreen';
import AddFriendScreen from './src/screens/AddFriendScreen';
import TodoListScreen from './src/screens/TodoListScreen';
import AddTodoItemScreen from './src/screens/AddTodoItemScreen';
import FriendProfileScreen from './src/screens/FriendProfileScreen';
import AddCategoryScreen from './src/screens/AddCategoryScreen'

import { Provider as SessionProvider } from './src/context/SessionContext';
import { Provider as AuthProvider } from './src/context/AuthContext';
import { Provider as UserProvider } from './src/context/userContext';
import { Provider as CategoryProvider } from './src/context/CategoryContext';

import { Ionicons } from "@expo/vector-icons";
import FriendScreen from './src/screens/FriendScreen';

import { Context as AuthContext } from './src/context/AuthContext';
import { Context as CategoryContext } from './src/context/CategoryContext';

const defaultOptions = {
  headerRight: () => (
    <Button
      onPress={() => { }}
      title="Settings"
      color="#fff"
    />
  ),
}

const pageOptions = {
  headerShown: false,
}

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const [modalVis, setModalVis] = useState(false)
  return (
    <DrawerContentScrollView {...props}>
      <Modal
        style={{ flex: 1, backgroundColor: 'red' }}
        isVisible={modalVis}>
        <Text>modal text</Text>
        <Button title="Close" onPress={() => setModalVis(false)} />
      </Modal>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Open modal"
        onPress={() => setModalVis(true)}
      />
      <DrawerItem
        label="Toggle drawer"
        onPress={() => props.navigation.toggleDrawer()}
      />
    </DrawerContentScrollView>
  );
}
function CreateDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}

    >
      <Drawer.Screen name="mainFlow"
        component={CreateMainFlowTab}
        options={{ drawerLabel: 'Back', title: '', }} />
      <Drawer.Screen name="AddTodo"
        component={AddTodoItemScreen}
        options={{ drawerLabel: 'Add Todo Item', title: '', }} />
      <Drawer.Screen name="AddCategory"
        component={AddCategoryScreen}
        options={{ drawerLabel: 'Add Category', title: '', }} />
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
    <Stack.Navigator>
      <Stack.Screen
        name="SessionSelect"
        component={SessionSelectScreen}
        options={pageOptions}
      />
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
    </Stack.Navigator>
  )
}
function CreateFriendFeedStack() {
  return (
    <Stack.Navigator
      options={pageOptions}>
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
function CreateProfileStack() {
  return (
    <Stack.Navigator
      options={pageOptions}>
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={pageOptions}
      />
      <Stack.Screen
        name="HistoryDaily"
        component={HistoryDailyScreen}
        options={pageOptions}
      />
      <Stack.Screen
        name="HistoryMonthly"
        component={HistoryMonthlyScreen}
        options={pageOptions}
      />
      <Stack.Screen
        name="AddCategory"
        component={AddCategoryScreen}
        options={pageOptions}
      />
      <Stack.Screen
        name="Friend"
        component={FriendScreen}
        options={pageOptions}
      />
      <Stack.Screen
        name="userFriendsFlow"
        component={CreateFriendsFlowStack}
        options={pageOptions}
      />
      <Stack.Screen
        name="TodoFlow"
        component={CreateToDoFlowStack}
        options={pageOptions}
      />
    </Stack.Navigator>
  )
}

function CreateMainFlowTab() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="sessionFlow" component={CreateSessionStack}
        options={pageOptions} />
      <Tab.Screen name="friendFeedFlow" component={CreateFriendsFlowStack}
        options={pageOptions} />
      <Tab.Screen name="profileFlow" component={CreateProfileStack}
        options={pageOptions} />
    </Tab.Navigator>
  )
}
function CreateMainNavigator() {
  const { state, tryLocalSignin, tempVarSet } = useContext(AuthContext);
  const { fetchUserCategories, fetchUserTodoItems } = useContext(CategoryContext)

  useEffect(async () => {
    console.log("trying local sign in ")
    let res = await tryLocalSignin();
    let firstTime = new Date()
    let splashDisplayTime = 2000;
    if (res) {
      await fetchUserCategories();
      await fetchUserTodoItems();
      let secondTime = new Date();
      let timeDiff = (secondTime.getTime() - firstTime.getTime());
      console.log("Splash time reduced by", timeDiff);
      splashDisplayTime = splashDisplayTime - timeDiff;

      // adjust splash display time
    }
    setTimeout(
      () => {
        tempVarSet()
      }, splashDisplayTime);
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
          name="drawer"
          component={CreateDrawer}
          options={pageOptions}
        />

      )}
    </Stack.Navigator>

  )
}

// OLD STUFF REACT NAVIGATION V4

/*const mainNavigator = createSwitchNavigator({
  ResolveAuth: ResolveAuthScreen,


  loginFlow: loginStack,
  mainFlow: createBottomTabNavigator({
    sessionFlow: {
      screen: sessionStack,
      navigationOptions: {
        tabBarLabel: "Timer",
        tabBarIcon: (tabInfo) => {
          return (
            <Ionicons
              name="alarm"
              size={24}
              color={tabInfo.focused ? "#FCE9B9" : "#67806D"}
            />
          )
        }
      }
    },
    friendFeedFlow: {
      screen: friendFeedStack,
      navigationOptions: {
        tabBarLabel: "Community",
        tabBarIcon: (tabInfo) => {
          return (
            <Ionicons
              name="people"
              size={24}
              color={tabInfo.focused ? "#FCE9B9" : "#67806D"}
            />
          )
        }
      }
    },
    profileFlow: {
      screen: profileStack,
      navigationOptions: {
        tabBarLabel: "Calendar",
        tabBarIcon: (tabInfo) => {
          return (
            <Ionicons
              name="calendar"
              size={24}
              color={tabInfo.focused ? "#FCE9B9" : "#67806D"}
            />
          )
        }
      }
    }

  }, // end of bottomtabnavigator
  ) // end of mainflow bottom tab
})*/

export default () => {

  return (

    <UserProvider>
      <AuthProvider>
        <CategoryProvider>

          <SessionProvider>

            <NavigationContainer>

              <Stack.Navigator
                options={pageOptions}
              >
                <Stack.Screen
                  name="MainStack"
                  component={CreateMainNavigator}
                  options={pageOptions}
                />
              </Stack.Navigator>

              {/*<Drawer.Navigator initialRouteName='MainStack'
                options={pageOptions}>
                <Drawer.Screen name='MainStack' component={CreateMainNavigator} />
                <Drawer.Screen name='AddTodo' component={CreateToDoFlowStack} />
              </Drawer.Navigator>*/}

            </NavigationContainer>
          </SessionProvider>
        </CategoryProvider>
      </AuthProvider>
    </UserProvider>
  )
}