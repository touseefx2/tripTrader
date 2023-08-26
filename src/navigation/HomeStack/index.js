import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import screens from "../../screens/index";
import stack from "../index";

const Stack = createNativeStackNavigator();

export default HomeStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Homee"
      screenOptions={{
        animationEnabled: false,
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Homee"
        component={screens.Home}
        options={(props) => {
          let parent = props.navigation.getParent();
          parent.setOptions({
            swipeEnabled: true,
          });
        }}
      />

      <Stack.Screen
        name="UserProfile"
        component={stack.UserProfileStack}
        options={(props) => {
          let parent = props.navigation.getParent();
          parent.setOptions({
            swipeEnabled: false,
          });
        }}
      />
    </Stack.Navigator>
  );
};
