import React from "react";
import { Image } from "react-native";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import theme from "../../theme";

const drawerScreenOption = {
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
};

const stackScreenOption = {
  animationEnabled: false,
  headerShown: false,
};

const styles = {
  icon: {
    width: responsiveFontSize(3.2),
    height: responsiveFontSize(3.2),
    resizeMode: "contain",
  },
};

const Homeicon = {
  drawerLabel: "Home",
  drawerIcon: ({ focused, size }) => (
    <Image
      style={styles.icon}
      source={require("../../assets/images/drawer/home/img.png")}
    />
  ),
};

const Inboxicon = {
  drawerLabel: "Inbox",
  drawerIcon: ({ focused, size }) => (
    <Image
      style={styles.icon}
      source={require("../../assets/images/drawer/inbox/img.png")}
    />
  ),
};

const NewTripicon = {
  drawerLabel: "New Trip",
  unmountOnBlur: true,
  drawerIcon: ({ focused, size }) => (
    <Image
      style={styles.icon}
      source={require("../../assets/images/drawer/newtrip/img.png")}
    />
  ),
};

const MyProfileicon = {
  drawerLabel: "My Profile",
  drawerIcon: ({ focused, size }) => (
    <Image
      style={styles.icon}
      source={require("../../assets/images/drawer/myprofile/img.png")}
    />
  ),
};

const EditProfileicon = {
  drawerLabel: "Edit Profile",
  unmountOnBlur: true,
  drawerIcon: ({ focused, size }) => (
    <Image
      style={styles.icon}
      source={require("../../assets/images/drawer/myprofile/img.png")}
    />
  ),
};

const TradeOffersicon = {
  drawerLabel: "Trade Offers",
  drawerIcon: ({ focused, size }) => (
    <Image
      style={styles.icon}
      source={require("../../assets/images/drawer/tradeoffers/img.png")}
    />
  ),
};

const ConfirmedTripsicon = {
  drawerLabel: "Confirmed Trips",
  unmountOnBlur: true,
  drawerIcon: ({ focused, size }) => (
    <Image
      style={styles.icon}
      source={require("../../assets/images/drawer/confirmedtrips/img.png")}
    />
  ),
};

const SavedTripsicons = {
  drawerLabel: "Saved Trips",

  unmountOnBlur: false,
  drawerIcon: ({ focused, size }) => (
    <Image
      style={styles.icon}
      source={require("../../assets/images/drawer/savedtrips/img.png")}
    />
  ),
};

const Supporticon = {
  drawerLabel: "Support",
  unmountOnBlur: true,
  drawerIcon: ({ focused, size }) => (
    <Image
      style={styles.icon}
      source={require("../../assets/images/drawer/support/img.png")}
    />
  ),
};

const Settingsicons = {
  drawerLabel: "Settings",
  unmountOnBlur: true,
  drawerIcon: ({ focused, size }) => (
    <Image
      style={styles.icon}
      source={require("../../assets/images/drawer/settings/img.png")}
    />
  ),
};

const icon = {
  drawerScreenOption,
  stackScreenOption,
  Homeicon,
  Inboxicon,
  TradeOffersicon,
  SavedTripsicons,
  MyProfileicon,
  EditProfileicon,
  NewTripicon,
  ConfirmedTripsicon,
  Supporticon,
  Settingsicons,
};
export default icon;
