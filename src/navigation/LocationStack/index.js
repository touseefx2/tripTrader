import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import screens from '../../screens/index';

const Stack = createNativeStackNavigator();

export default LocationStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Location"
      screenOptions={{animationEnabled: false, headerShown: false}}>
      <Stack.Screen name="Location" component={screens.Location} />
      <Stack.Screen name="Map" component={screens.Map} />
    </Stack.Navigator>
  );
};
