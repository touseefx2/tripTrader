import React from 'react';
import {Image} from 'react-native';
import theme from '../../theme';
import utils from '../../utils';

const iconSize = 19;
const focusColor = theme.color.backgroundGreenText;
const unfocusColor = theme.color.backgroundGreenText;
const styles = {
  icon: {
    width: 21,
    height: 21,
    resizeMode: 'contain',
  },
};

const Homeicon = {
  drawerLabel: 'Home',
  // headerShown: false,
  // swipeEnabled: true,
  // unmountOnBlur: true,
  drawerIcon: ({focused, size}) => (
    <Image
      style={styles.icon}
      source={require('../../assets/images/drawer/home/img.png')}
    />
  ),
};

const Inboxicon = {
  drawerLabel: 'Inbox',
  // headerShown: false,
  // swipeEnabled: true,
  // unmountOnBlur: true,
  drawerIcon: ({focused, size}) => (
    <Image
      style={styles.icon}
      source={require('../../assets/images/drawer/inbox/img.png')}
    />
  ),
};

const NewTripicon = {
  drawerLabel: 'New Trip',
  // headerShown: false,
  // swipeEnabled: true,
  // unmountOnBlur: true,
  drawerIcon: ({focused, size}) => (
    <Image
      style={styles.icon}
      source={require('../../assets/images/drawer/newtrip/img.png')}
    />
  ),
};

const MyProfileicon = {
  drawerLabel: 'My Profile',
  // headerShown: false,
  // swipeEnabled: true,
  // unmountOnBlur: true,
  drawerIcon: ({focused, size}) => (
    <Image
      style={styles.icon}
      source={require('../../assets/images/drawer/myprofile/img.png')}
    />
  ),
};

const TradeOffersicon = {
  drawerLabel: 'Trade Offers',
  // headerShown: false,
  // swipeEnabled: true,
  // unmountOnBlur: true,
  drawerIcon: ({focused, size}) => (
    <Image
      style={styles.icon}
      source={require('../../assets/images/drawer/tradeoffers/img.png')}
    />
  ),
};

const ConfirmedTripsicon = {
  drawerLabel: 'Confirmed Trips',
  // headerShown: false,
  // swipeEnabled: true,
  // unmountOnBlur: true,
  drawerIcon: ({focused, size}) => (
    <Image
      style={styles.icon}
      source={require('../../assets/images/drawer/confirmedtrips/img.png')}
    />
  ),
};

const SavedTripsicons = {
  drawerLabel: 'Saved Trips',
  // headerShown: false,
  // swipeEnabled: true,
  // unmountOnBlur: true,
  drawerIcon: ({focused, size}) => (
    <Image
      style={styles.icon}
      source={require('../../assets/images/drawer/savedtrips/img.png')}
    />
  ),
};

const Supporticon = {
  drawerLabel: 'Support',
  // headerShown: false,
  // swipeEnabled: true,
  // unmountOnBlur: true,
  drawerIcon: ({focused, size}) => (
    <Image
      style={styles.icon}
      source={require('../../assets/images/drawer/support/img.png')}
    />
  ),
};

const LatestNewsicon = {
  drawerLabel: 'Latest News',
  // headerShown: false,
  // swipeEnabled: true,
  // unmountOnBlur: true,
  drawerIcon: ({focused, size}) => (
    <Image
      style={styles.icon}
      source={require('../../assets/images/drawer/latestnews/img.png')}
    />
  ),
};

const PrivacyPolicyicon = {
  drawerLabel: 'Privacy Policy',
  // headerShown: false,
  // swipeEnabled: true,
  // unmountOnBlur: true,
  drawerIcon: ({focused, size}) => (
    <Image
      style={styles.icon}
      source={require('../../assets/images/drawer/privacypolicy/img.png')}
    />
  ),
};

const Settingsicons = {
  drawerLabel: 'Settings',
  // headerShown: false,
  // swipeEnabled: true,
  // unmountOnBlur: true,

  drawerIcon: ({focused, size}) => (
    <Image
      style={styles.icon}
      source={require('../../assets/images/drawer/settings/img.png')}
    />
  ),
};

const Notificationsicons = {
  drawerLabel: 'Notifications',
  // headerShown: false,
  swipeEnabled: false,
  // unmountOnBlur: true,

  drawerIcon: ({focused, size}) => (
    <Image
      style={styles.icon}
      source={require('../../assets/images/drawer/settings/img.png')}
    />
  ),
};

const icon = {
  Homeicon,
  Inboxicon,
  NewTripicon,
  TradeOffersicon,
  ConfirmedTripsicon,
  SavedTripsicons,
  MyProfileicon,

  Supporticon,
  LatestNewsicon,
  PrivacyPolicyicon,

  Settingsicons,
  Notificationsicons,
};

export default icon;
