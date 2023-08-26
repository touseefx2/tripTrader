import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import screens from "../../screens/index";
import icon from "./styles";
import CustomDrawerContent from "./CustomDrawerContent";
import theme from "../../theme";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import stack from "..";

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();
// react navigation v5 work dangerouslyGetParent()
// react navigation v6 work getParent()

export default MainStack = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      // backBehavior=''
      screenOptions={{
        // swipeEnabled: true,
        // unmountOnBlur: true,
        headerShown: false,
        drawerStyle: {
          backgroundColor: theme.color.background,
          width: theme.window.Width - 50,
          height: theme.window.Height,
        },
        drawerLabelStyle: {
          color: theme.color.backgroundGreenText,
          fontSize: responsiveFontSize(1.9),
        },
        drawerItemStyle: {},
        // drawerActiveBackgroundColor: theme.color.backgroundGreen,
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="Home"
        component={stack.HomeStack}
        options={icon.Homeicon}
      />
      <Drawer.Screen
        name="Inbox"
        component={InboxStack}
        options={icon.Inboxicon}
      />

      <Drawer.Screen
        name="NewTrip"
        component={screens.NewTrips}
        options={icon.NewTripicon}
      />
      <Drawer.Screen
        name="MyProfile"
        component={screens.MyProfile}
        options={icon.MyProfileicon}
      />
      <Drawer.Screen
        name="EditProfile"
        component={screens.EditProfile}
        options={icon.EditProfileicon}
      />
      {/* sec */}
      <Drawer.Screen
        name="TradeOffers"
        component={screens.TradeOffers}
        options={icon.TradeOffersicon}
      />
      <Drawer.Screen
        name="ConfirmedTrips"
        component={screens.ConfirmTrips}
        options={icon.ConfirmedTripsicon}
      />
      <Drawer.Screen
        name="SavedTrips"
        component={screens.SavedTrips}
        options={icon.SavedTripsicons}
      />
      {/* sctn */}

      <Drawer.Screen
        name="Support"
        component={screens.Support}
        options={icon.Supporticon}
      />

      <Drawer.Screen
        name="Settings"
        component={SettingsStack}
        options={icon.Settingsicons}
      />
    </Drawer.Navigator>
  );
};

const InboxStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Inboxe"
      screenOptions={{
        animationEnabled: false,
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Inboxe"
        component={screens.Inbox}
        options={(props) => {
          let parent = props.navigation.getParent();
          parent.setOptions({
            swipeEnabled: true,
          });
        }}
      />
      <Stack.Screen
        name="Chat"
        component={screens.Chat}
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

const SettingsStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Settingss"
      screenOptions={{
        animationEnabled: false,
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Settingss"
        component={screens.Settings}
        options={(props) => {
          let parent = props.navigation.getParent();
          parent.setOptions({
            swipeEnabled: true,
          });
        }}
      />

      <Stack.Screen
        name="BlockUsers"
        component={screens.BlockUsers}
        options={(props) => {
          let parent = props.navigation.getParent();
          parent.setOptions({
            swipeEnabled: false,
          });
        }}
      />

      <Stack.Screen
        name="ChangePassword"
        component={ChangePasswordStack}
        options={(props) => {
          let parent = props.navigation.getParent();
          parent.setOptions({
            swipeEnabled: false,
          });
        }}
      />

      <Stack.Screen
        name="ManageSubscription"
        component={screens.ManageSubscription}
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

const ChangePasswordStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="ChangePasswordd"
      screenOptions={{
        animationEnabled: false,
        headerShown: false,
      }}
    >
      <Stack.Screen name="ChangePasswordd" component={screens.ChangePassword} />
      <Stack.Screen name="ForgotPassword" component={screens.ForgotPassword} />
      <Stack.Screen name="VerifyCode" component={screens.VerifyCode} />
      <Stack.Screen name="ResetPassword" component={screens.ResetPassword} />
    </Stack.Navigator>
  );
};
