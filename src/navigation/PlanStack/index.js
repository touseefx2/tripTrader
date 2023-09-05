import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import screens from "../../screens/index";

const Stack = createNativeStackNavigator();

export default PlanStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Plan"
      screenOptions={{
        animationEnabled: false,
        headerShown: false,
      }}
    >
      <Stack.Screen name="Plan" component={screens.Plan} />
      <Stack.Screen name="Welcome" component={screens.Welcome} />
    </Stack.Navigator>
  );
};
