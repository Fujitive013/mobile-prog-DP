import React from 'react';
import { createStackNavigator } from 'react-navigation';
import LoginScreen from './LoginScreen';
import SignUpScreen from './SignUpScreen';

const AppNavigator = createStackNavigator({
  Index: {
    screen: Index,
  },
  Login: {
    screen: LoginScreen,
  },
  SignUp: {
    screen: SignUpScreen,
  },
});

export default AppNavigator;