import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import screens from "../../screens/index";
import icon from "./styles";
import CustomDrawerContent from "./conponents/CustomDrawerContent";
import { stack } from "./conponents/stack";

const Drawer = createDrawerNavigator();
// react navigation v5 work dangerouslyGetParent()
// react navigation v6 work getParent()

export default MainStack = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={icon.drawerScreenOption}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="Home"
        component={screens.Home}
        options={icon.Homeicon}
      />
      <Drawer.Screen
        name="Inbox"
        component={stack.InboxStack}
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
        component={stack.SettingsStack}
        options={icon.Settingsicons}
      />
    </Drawer.Navigator>
  );
};
