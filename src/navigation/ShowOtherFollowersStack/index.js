import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import screens from "../../screens/index";

const Stack = createNativeStackNavigator();

export default ShowOtherFollowersStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="ShowOtherFollowers"
      screenOptions={{
        animationEnabled: false,
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="ShowOtherFollowers"
        component={screens.ShowOtherFollowers}
      />
    </Stack.Navigator>
  );
};
