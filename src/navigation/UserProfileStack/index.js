import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import screens from "../../screens/index";

const Stack = createNativeStackNavigator();

export default UserProfileStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="UserProfile"
      screenOptions={{
        animationEnabled: false,
        headerShown: false,
      }}
    >
      <Stack.Screen name="UserProfile" component={screens.UserProfile} />
    </Stack.Navigator>
  );
};
