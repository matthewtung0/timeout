import React from 'react';

import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
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

import { Provider as SessionProvider } from './src/context/SessionContext';
import { Provider as AuthProvider } from './src/context/AuthContext';
import { Provider as UserProvider } from './src/context/userContext';
import { Provider as CategoryProvider } from './src/context/CategoryContext';

import { Ionicons } from "@expo/vector-icons";

const sessionStack = createStackNavigator({
  SessionSelect: SessionSelectScreen,
  SessionOngoing: SessionOngoingScreen,
  SessionEval: SessionEvalScreen
})

const friendFeedStack = createStackNavigator({
  FriendFeed: FriendFeedScreen,
  FriendProfile: FriendProfileScreen
})

const profileStack = createStackNavigator({
  Profile: ProfileScreen,
  HistoryDaily: HistoryDailyScreen,
  HistoryMonthly: HistoryMonthlyScreen,
  userFriendsFlow: createStackNavigator({
    FriendList: FriendListScreen,
    AddFriend: AddFriendScreen,
  }),
  TodoFlow: createStackNavigator({
    TodoList: TodoListScreen,
    AddTodoItem: AddTodoItemScreen
  })
})


const switchNavigator = createSwitchNavigator({
  ResolveAuth: ResolveAuthScreen,

  loginFlow: createStackNavigator({
    SignIn: SigninScreen,
    SignUp: SignupScreen,
    ForgotPassword: ForgotPasswordScreen,
  }),
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

  })
})

const App = createAppContainer(switchNavigator);

export default () => {
  return (

    <UserProvider>
      <CategoryProvider>
        <AuthProvider>
          <SessionProvider>
            <App ref={(navigator) => { setNavigator(navigator) }} />
          </SessionProvider>
        </AuthProvider>
      </CategoryProvider>

    </UserProvider>




  )
}