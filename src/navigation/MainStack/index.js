import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import stack from "../index";

const Stack = createNativeStackNavigator();
export default MainStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="DrawerStack"
      screenOptions={{
        animationEnabled: false,
        headerShown: false,
      }}
    >
      <Stack.Screen name="DrawerStack" component={stack.DrawerStack} />

      <Stack.Screen
        name="ShowFollowersStack"
        component={stack.ShowFollowersStack}
      />

      <Stack.Screen
        name="UserProfileStack"
        component={stack.UserProfileStack}
      />

      <Stack.Screen name="PlanStack" component={stack.PlanStack} />
    </Stack.Navigator>
  );
};
