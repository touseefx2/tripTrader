import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import screens from '../../screens/index';
import {
  Image
} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import icon from './styles';
import CustomDrawerContent from './CustomDrawerContent';
import theme from '../../theme';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import utils from '../../utils';



// react navigation v5 work dangerouslyGetParent()
// react navigation v6 work getParent()
const Drawer = createDrawerNavigator();
export default Home = () => {
  return (
    <Drawer.Navigator
      initialRouteName="HomeTab"
      screenOptions={{
        // swipeEnabled: true,
        // unmountOnBlur: true,
        headerShown: false,
        drawerStyle: {
          backgroundColor: theme.color.background,
          width: theme.window.Width - 80,
          height: theme.window.Height,
        },
        drawerLabelStyle: {
          color: theme.color.backgroundGreenText,
          fontSize: 13,
        },
        drawerItemStyle: {},
                drawerActiveBackgroundColor: "transparent"
        // drawerActiveBackgroundColor: theme.color.backgroundGreen,
      }}
      drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen
        name="HomeTab"
        component={HomeTab}
        options={icon.Homeicon}
      />
      <Drawer.Screen
        name="InboxTab"
        component={InboxTab}
        options={icon.Inboxicon}
      />
      <Drawer.Screen
        name="MyProfileTab"
        component={MyProfileTab}
        options={icon.MyProfileicon}
      />
      {/* sec */}
      <Drawer.Screen
        name="NewTrip"
        component={screens.NewTrips}
        options={icon.NewTripicon}
      />
      <Drawer.Screen
        name="OffersTab"
        component={OffersTab}
        options={icon.TradeOffersicon}
      />
      <Drawer.Screen
        name="ConfirmedTrips"
        component={screens.ConfirmTrips}
        options={icon.ConfirmedTripsicon}
      />
      <Drawer.Screen
        name="SavedTab"
        component={SavedTab}
        options={icon.SavedTripsicons}
      />
      {/* sctn */}

      <Drawer.Screen
        name="LatestNews"
        component={screens.LatestNews}
        options={icon.LatestNewsicon}
      />
      <Drawer.Screen
        name="Support"
        component={screens.Support}
        options={icon.Supporticon}
      />
      <Drawer.Screen
        name="PrivacyPolicy"
        component={screens.PrivacyPolicy}
        options={icon.PrivacyPolicyicon}
      />
      <Drawer.Screen
        name="Settings"
        component={screens.Settings}
        options={icon.Settingsicons}
      />
      
    </Drawer.Navigator>
  );
};



const Tab = createBottomTabNavigator();
let HomeTab = () => {
  return (
    <Tab.Navigator 
    initialRouteName='Home'
    screenOptions={icon.TabBar} >
   <Tab.Screen name="Home"  component={HomeStack} />
   <Tab.Screen name="Inbox"   component={InboxStack} />
   <Tab.Screen name="Offers"   component={TradeOfferStack} />
   <Tab.Screen name="Saved"   component={SavedTripsStack} />
    <Tab.Screen name="Profile" component={ProfileStack} />
  </Tab.Navigator>
  );
};

let InboxTab = () => {
  return (
    <Tab.Navigator 
    initialRouteName='Inbox'
    screenOptions={icon.TabBar} >
   <Tab.Screen name="Home"  component={HomeStack} />
   <Tab.Screen name="Inbox"   component={InboxStack} />
   <Tab.Screen name="Offers"   component={TradeOfferStack} />
   <Tab.Screen name="Saved"   component={SavedTripsStack} />
    <Tab.Screen name="Profile" component={ProfileStack} />
  </Tab.Navigator>

  );
};

let OffersTab = () => {
  return (
    <Tab.Navigator 
    initialRouteName='Offers'
    screenOptions={icon.TabBar} >
   <Tab.Screen name="Home"  component={HomeStack} />
   <Tab.Screen name="Inbox"   component={InboxStack} />
   <Tab.Screen name="Offers"   component={TradeOfferStack} />
   <Tab.Screen name="Saved"   component={SavedTripsStack} />
    <Tab.Screen name="Profile" component={ProfileStack} />
  </Tab.Navigator>

  
  );
};

let SavedTab = () => {
  return (
    <Tab.Navigator 
    initialRouteName='Saved'
    screenOptions={icon.TabBar} >
   <Tab.Screen name="Home"  component={HomeStack} />
   <Tab.Screen name="Inbox"   component={InboxStack} />
   <Tab.Screen name="Offers"   component={TradeOfferStack} />
   <Tab.Screen name="Saved"   component={SavedTripsStack} />
    <Tab.Screen name="Profile" component={ProfileStack} />
  </Tab.Navigator>

  
  );
};

let MyProfileTab = () => {
  return (
    <Tab.Navigator 
    initialRouteName='Profile'
    screenOptions={icon.TabBar} >
   <Tab.Screen name="Home"  component={HomeStack} />
   <Tab.Screen name="Inbox"   component={InboxStack} />
   <Tab.Screen name="Offers"   component={TradeOfferStack} />
   <Tab.Screen name="Saved"   component={SavedTripsStack} />
    <Tab.Screen name="Profile" component={ProfileStack} />
  </Tab.Navigator>

  
  );
};

const Stack = createNativeStackNavigator();
let HomeStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Homee"
      screenOptions={{
        animationEnabled: false,
        headerShown: false,
      }}>
      <Stack.Screen
        name="Homee"
        component={screens.Home}
        options={props => {
          let parent = props.navigation.getParent();
          parent.setOptions({
            swipeEnabled: true,
          });
        }}
      />
      <Stack.Screen
        name="Notifications"
        component={screens.Notifications}
        options={props => {
          let parent = props.navigation.getParent();
          parent.setOptions({
            swipeEnabled: false,
          });
        }}
      />
    </Stack.Navigator>
  );
};

let InboxStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Inboxe"
      screenOptions={{
        animationEnabled: false,
        headerShown: false,
      }}>
      <Stack.Screen
        name="Inboxe"
        component={screens.Inbox}
        options={props => {
          let parent = props.navigation.getParent();
          parent.setOptions({
            swipeEnabled: true,
          });
        }}
      />
      <Stack.Screen
        name="Notifications"
        component={screens.Notifications}
        options={props => {
          let parent = props.navigation.getParent();
          parent.setOptions({
            swipeEnabled: false,
          });
        }}
      />
    </Stack.Navigator>
  );
};

let TradeOfferStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="TradeOfferse"
      screenOptions={{
        animationEnabled: false,
        headerShown: false,
      }}>
      <Stack.Screen
        name="TradeOfferse"
        component={screens.TradeOffers}
        options={props => {
          let parent = props.navigation.getParent();
          parent.setOptions({
            swipeEnabled: true,
          });
        }}
      />
      <Stack.Screen
        name="Notifications"
        component={screens.Notifications}
        options={props => {
          let parent = props.navigation.getParent();
          parent.setOptions({
            swipeEnabled: false,
          });
        }}
      />
    </Stack.Navigator>
  );
};

let SavedTripsStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="SavedTripse"
      screenOptions={{
        animationEnabled: false,
        headerShown: false,
      }}>
      <Stack.Screen
        name="SavedTrips"
        component={screens.SavedTrips}
        options={props => {
          let parent = props.navigation.getParent();
          parent.setOptions({
            swipeEnabled: true,
          });
        }}
      />
      <Stack.Screen
        name="Notifications"
        component={screens.Notifications}
        options={props => {
          let parent = props.navigation.getParent();
          parent.setOptions({
            swipeEnabled: false,
          });
        }}
      />
    </Stack.Navigator>
  );
};

let ProfileStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="MyProfilee"
      screenOptions={{
        animationEnabled: false,
        headerShown: false,
      }}>
      <Stack.Screen
        name="MyProfilee"
        component={screens.MyProfile}
        options={props => {
          let parent = props.navigation.getParent();
          parent.setOptions({
            swipeEnabled: true,
          });
        }}
      />
      <Stack.Screen
        name="EditProfile"
        component={screens.EditProfile}
        options={props => {
          let parent = props.navigation.getParent();
          parent.setOptions({
            swipeEnabled: false,
          });
        }}
      />
       <Stack.Screen
        name="Notifications"
        component={screens.Notifications}
        options={props => {
          let parent = props.navigation.getParent();
          parent.setOptions({
            swipeEnabled: false,
          });
        }}
      />
    </Stack.Navigator>
  );
};
