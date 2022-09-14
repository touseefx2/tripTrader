import React from 'react';
import {Image} from 'react-native';
import theme from '../../theme';
import utils from '../../utils';

const iconSize = 20;
const focusColor = theme.color.button1;
const unfocusColor = theme.color.title;

const homeIcon = {
  drawerLabel: 'Home',
  // headerShown: false,
  // swipeEnabled: true,
  // unmountOnBlur: true,
  drawerIcon: ({focused, size}) => (
    <utils.vectorIcon.AntDesign
      name="home"
      size={iconSize}
      color={focused ? focusColor : unfocusColor}
    />
  ),
};

const helpIcon = {
  drawerLabel: 'Help',
  swipeEnabled: false,
  drawerIcon: ({focused, size}) => (
    <utils.vectorIcon.AntDesign
      name="questioncircleo"
      size={iconSize}
      color={focused ? focusColor : unfocusColor}
    />
  ),
};

const tcIcon = {
  drawerLabel: 'Terms & Conditions / Privacy',
  swipeEnabled: false,
  drawerIcon: ({focused, size}) => (
    <utils.vectorIcon.AntDesign
      name="questioncircleo"
      size={iconSize}
      color={focused ? focusColor : unfocusColor}
    />
  ),
};

// const profileIcon = {
//   // unmountOnBlur:true,
//   headerShown: false,
//   drawerIcon: ({ focused, size }) => (
//     <Image
//       style={{ width: 22, height: 22 }}
//       resizeMode="contain"
//       source={require("../../assets/drawer_items_icon/profile.png")}
//     />
//   ),
// };

// const skillIcon = {
//   headerShown: false,
//   // title:"Categories",
//   drawerIcon: ({ focused, size }) => (
//     <Image
//       style={{ width: 22, height: 22 }}
//       resizeMode="contain"
//       source={require("../../assets/drawer_items_icon/skills.png")}
//     />
//   ),
// };

// const cpIcon = {
//   headerShown: false,
//   unmountOnBlur: true,
//   // swipeEnabled: false,
//   // title:"Categories",
//   drawerIcon: ({ focused, size }) => (
//     <Image
//       style={{ width: 22, height: 22 }}
//       resizeMode="contain"
//       source={require("../../assets/drawer_items_icon/skills.png")}
//     />
//   ),
// };

// const carIcon = {
//   headerShown: false,
//   // title:"Categories",
//   drawerIcon: ({ focused, size }) => (
//     <utils.vectorIcon.Ionicons
//       name="ios-car-sport-outline"
//       color="white"
//       size={22}
//     />
//   ),
// };

// const nIcon = {
//   headerShown: false,
//   // title:"Categories",
//   drawerIcon: ({ focused, size }) => (
//     <utils.vectorIcon.SimpleLineIcons size={22} name="bell" color="white" />
//   ),
// };

// const reportIcon = {
//   headerShown: false,
//   drawerIcon: ({ focused, size }) => (
//     <Image
//       style={{ width: 22, height: 22 }}
//       resizeMode="contain"
//       source={require("../../assets/drawer_items_icon/reports.png")}
//     />
//   ),
// };

// const chatIcon = {
//   headerShown: false,
//   drawerIcon: ({ focused, size }) => (
//     <Image
//       style={{ width: 22, height: 22 }}
//       resizeMode="contain"
//       source={require("../../assets/drawer_items_icon/chat.png")}
//     />
//   ),
// };

// const rateIcon = {
//   headerShown: false,
//   title: "Rate the app",
//   drawerIcon: ({ focused, size }) => (
//     <Image
//       style={{ width: 22, height: 22 }}
//       resizeMode="contain"
//       source={require("../../assets/drawer_items_icon/star.png")}
//     />
//   ),
// };

// const logoutIcon = {
//   headerShown: false,
//   title: "Sign out",
//   drawerIcon: ({ focused, size }) => (
//     <Image
//       style={{ width: 22, height: 22 }}
//       resizeMode="contain"
//       source={require("../../assets/drawer_items_icon/exit.png")}
//     />
//   ),
// };

const icon = {
  homeIcon,
  helpIcon,
  tcIcon,
  // logoutIcon,
  // profileIcon,
  // chatIcon,
  // skillIcon,
  // reportIcon,
  // rateIcon,
  // nIcon,
  // carIcon,
  // cpIcon,
};

export default icon;
