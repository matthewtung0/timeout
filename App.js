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

const switchNavigator = createSwitchNavigator({
  ResolveAuth: ResolveAuthScreen,

  mainFlow: createBottomTabNavigator({

    loginFlow: createStackNavigator({
      SignUp: SignupScreen,
      SignIn: SigninScreen,
      ForgotPassword: ForgotPasswordScreen,
    }),
    sessionFlow: createStackNavigator({
      SessionSelect: SessionSelectScreen,
      SessionOngoing: SessionOngoingScreen,
      SessionEval: SessionEvalScreen
    }),

    friendFeedFlow: createStackNavigator({
      FriendFeed: FriendFeedScreen,
      FriendProfile: FriendProfileScreen
    }),

    profileFlow: createStackNavigator({
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

  })
})

const App = createAppContainer(switchNavigator);

export default () => {
  return (
    <UserProvider>
      <AuthProvider>
        <SessionProvider>
          <App ref={(navigator) => { setNavigator(navigator) }} />
        </SessionProvider>
      </AuthProvider>
    </UserProvider>


  )
}