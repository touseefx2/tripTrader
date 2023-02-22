import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import screens from '../../screens/index';

const Stack = createNativeStackNavigator();
// react navigation v5 work dangerouslyGetParent()
// react navigation v6 work getParent()

export default AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        animationEnabled: false,
        headerShown: false,
      }}>
      <Stack.Screen name="Login" component={screens.Login} />
      <Stack.Screen name="Signin" component={screens.Signin} />
      <Stack.Screen name="Signup" component={screens.Signup} />
      <Stack.Screen name="ForgotPasswords" component={ForgotPasswordStack} />
      <Stack.Screen name="GuestAccess" component={screens.GuestAccess} />
    </Stack.Navigator>
  );
};

const ForgotPasswordStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="ForgotPassword"
      screenOptions={{
        animationEnabled: false,
        headerShown: false,
      }}>
      <Stack.Screen name="ForgotPassword" component={screens.ForgotPassword} />
      <Stack.Screen name="VerifyCode" component={screens.VerifyCode} />
      <Stack.Screen name="ResetPassword" component={screens.ResetPassword} />
    </Stack.Navigator>
  );
};
