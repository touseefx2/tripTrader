import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import screens from "../../screens/index";

const Stack = createNativeStackNavigator();

export default ShowFollowersStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="ShowFollowers"
      screenOptions={{
        animationEnabled: false,
        headerShown: false,
      }}
    >
      <Stack.Screen name="ShowFollowers" component={screens.ShowFollowers} />
    </Stack.Navigator>
  );
};
