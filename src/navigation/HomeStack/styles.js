import React from 'react';
import {Image} from 'react-native';
import {responsiveFontSize} from 'react-native-responsive-dimensions';

const styles = {
  icon: {
    width: responsiveFontSize(3.2),
    height: responsiveFontSize(3.2),
    resizeMode: 'contain',
  },
};

const Homeicon = {
  drawerLabel: 'Home',
  drawerIcon: ({focused, size}) => (
    <Image
      style={styles.icon}
      source={require('../../assets/images/drawer/home/img.png')}
    />
  ),
};

const Inboxicon = {
  drawerLabel: 'Inbox',
  drawerIcon: ({focused, size}) => (
    <Image
      style={styles.icon}
      source={require('../../assets/images/drawer/inbox/img.png')}
    />
  ),
};

const NewTripicon = {
  drawerLabel: 'New Trip',
  unmountOnBlur: true,
  drawerIcon: ({focused, size}) => (
    <Image
      style={styles.icon}
      source={require('../../assets/images/drawer/newtrip/img.png')}
    />
  ),
};

const MyProfileicon = {
  drawerLabel: 'My Profile',
  drawerIcon: ({focused, size}) => (
    <Image
      style={styles.icon}
      source={require('../../assets/images/drawer/myprofile/img.png')}
    />
  ),
};

const EditProfileicon = {
  drawerLabel: 'Edit Profile',
  unmountOnBlur: true,
  drawerIcon: ({focused, size}) => (
    <Image
      style={styles.icon}
      source={require('../../assets/images/drawer/myprofile/img.png')}
    />
  ),
};

const TradeOffersicon = {
  drawerLabel: 'Trade Offers',
  drawerIcon: ({focused, size}) => (
    <Image
      style={styles.icon}
      source={require('../../assets/images/drawer/tradeoffers/img.png')}
    />
  ),
};

const ConfirmedTripsicon = {
  drawerLabel: 'Confirmed Trips',
  unmountOnBlur: true,
  drawerIcon: ({focused, size}) => (
    <Image
      style={styles.icon}
      source={require('../../assets/images/drawer/confirmedtrips/img.png')}
    />
  ),
};

const SavedTripsicons = {
  drawerLabel: 'Saved Trips',

  unmountOnBlur: false,
  drawerIcon: ({focused, size}) => (
    <Image
      style={styles.icon}
      source={require('../../assets/images/drawer/savedtrips/img.png')}
    />
  ),
};

const Supporticon = {
  drawerLabel: 'Support',
  unmountOnBlur: true,
  drawerIcon: ({focused, size}) => (
    <Image
      style={styles.icon}
      source={require('../../assets/images/drawer/support/img.png')}
    />
  ),
};

const LatestNewsicon = {
  drawerLabel: 'Latest News',
  unmountOnBlur: true,
  drawerIcon: ({focused, size}) => (
    <Image
      style={styles.icon}
      source={require('../../assets/images/drawer/latestnews/img.png')}
    />
  ),
};

const PrivacyPolicyicon = {
  drawerLabel: 'Privacy Policy',
  unmountOnBlur: true,
  drawerIcon: ({focused, size}) => (
    <Image
      style={styles.icon}
      source={require('../../assets/images/drawer/privacypolicy/img.png')}
    />
  ),
};

const Settingsicons = {
  drawerLabel: 'Settings',
  unmountOnBlur: true,
  drawerIcon: ({focused, size}) => (
    <Image
      style={styles.icon}
      source={require('../../assets/images/drawer/settings/img.png')}
    />
  ),
};

const Notificationsicons = {
  drawerLabel: 'Notifications',

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
  TradeOffersicon,
  SavedTripsicons,

  MyProfileicon,
  EditProfileicon,
  NewTripicon,
  ConfirmedTripsicon,

  Supporticon,
  LatestNewsicon,
  PrivacyPolicyicon,

  Settingsicons,
  Notificationsicons,
};

export default icon;
