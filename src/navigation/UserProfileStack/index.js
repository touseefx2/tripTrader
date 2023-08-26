import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import screens from "../../screens/index";

const Stack = createNativeStackNavigator();

export const UserProfileStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="UserProfile"
      screenOptions={{
        animationEnabled: false,
        headerShown: false,
      }}
    >
      <Stack.Screen name="UserProfile" component={screens.UserProfile} />
      <Stack.Screen
        name="ShowOtherFollowers"
        component={ShowOtherFollowersStack}
      />
    </Stack.Navigator>
  );
};

const ShowOtherFollowersStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="ShowOtherFollowerss"
      screenOptions={{
        animationEnabled: false,
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="ShowOtherFollowerss"
        component={screens.ShowOtherFollowers}
      />
      <Stack.Screen name="UserProfile" component={UserProfileStack} />
    </Stack.Navigator>
  );
};
