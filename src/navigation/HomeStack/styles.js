import React from 'react';
import {Image} from 'react-native';
import theme from '../../theme';
import utils from '../../utils';

const iconSize = 19;
const backgroundColor='#f7f7f7'
let focusTextColor = theme.color.button1;
let unfocusTextColor = 'rgba(30, 54, 37, 0.4)';
const styles = {
  icon: {
    width: 21,
    height: 21,
    resizeMode: 'contain',
  },
};

const TabBar=({ route }) => ({
  tabBarIcon: ({ focused, color, size }) => {
  let img=""

    if (route.name === 'Home') {
     img = focused
     ? require('../../assets/images/drawer/home/image.png')
     : require('../../assets/images/drawer/home/image2.png');
    } else  if (route.name === 'Inbox')  {
     img = focused
     ? require('../../assets/images/drawer/inbox/image.png')
     : require('../../assets/images/drawer/inbox/image2.png');
    }
    else  if (route.name === 'Offers')  {
      img = focused
      ? require('../../assets/images/drawer/tradeoffers/image.png')
      : require('../../assets/images/drawer/tradeoffers/image2.png');
     }
     else  if (route.name === 'Saved')  {
      img = focused
      ? require('../../assets/images/drawer/savedtrips/image.png')
      : require('../../assets/images/drawer/savedtrips/image2.png');
     }
     else  if (route.name === 'Profile')  {
      img = focused
      ? require('../../assets/images/drawer/myprofile/image.png')
      : require('../../assets/images/drawer/myprofile/image2.png');
     }

    // You can return any component that you like here!
    return  <Image style={{
      width: size,
      height: size,
      resizeMode: 'contain',
    }} source={img} />
  },
  headerShown:false,
  tabBarActiveTintColor: focusTextColor,
  tabBarInactiveTintColor: unfocusTextColor,
tabBarStyle:{
  paddingBottom:2,
  backgroundColor:backgroundColor,
},
})


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
  drawerLabel: 'Create Trip',
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
  TabBar,
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
