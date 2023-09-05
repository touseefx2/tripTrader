import React from "react";
import icon from "../styles";
import screens from "../../../screens/index";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
const Stack = createNativeStackNavigator();

const swipeDrawer = (props, swipe) => {
  const parent = props.navigation.getParent();
  parent.setOptions({
    swipeEnabled: swipe,
  });
};

const InboxStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Inboxe"
      screenOptions={icon.stackScreenOption}
    >
      <Stack.Screen
        name="Inboxe"
        component={screens.Inbox}
        options={(props) => swipeDrawer(props, true)}
      />
      <Stack.Screen
        name="Chat"
        component={screens.Chat}
        options={(props) => swipeDrawer(props, false)}
      />
    </Stack.Navigator>
  );
};

const SettingsStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Settingss"
      screenOptions={icon.stackScreenOption}
    >
      <Stack.Screen
        name="Settingss"
        component={screens.Settings}
        options={(props) => swipeDrawer(props, true)}
      />

      <Stack.Screen
        name="BlockUsers"
        component={screens.BlockUsers}
        options={(props) => swipeDrawer(props, false)}
      />

      <Stack.Screen
        name="ChangePassword"
        component={ChangePasswordStack}
        options={(props) => swipeDrawer(props, false)}
      />

      <Stack.Screen
        name="ManageSubscription"
        component={screens.ManageSubscription}
        options={(props) => swipeDrawer(props, false)}
      />

      <Stack.Screen
        name="Cards"
        component={screens.Cards}
        options={(props) => swipeDrawer(props, false)}
      />
    </Stack.Navigator>
  );
};

const ChangePasswordStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="ChangePasswordd"
      screenOptions={icon.stackScreenOption}
    >
      <Stack.Screen name="ChangePasswordd" component={screens.ChangePassword} />
      <Stack.Screen name="ForgotPassword" component={screens.ForgotPassword} />
      <Stack.Screen name="VerifyCode" component={screens.VerifyCode} />
      <Stack.Screen name="ResetPassword" component={screens.ResetPassword} />
    </Stack.Navigator>
  );
};

export const stack = {
  InboxStack,
  SettingsStack,
};
