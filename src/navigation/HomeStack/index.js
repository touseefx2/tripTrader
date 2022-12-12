import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import screens from '../../screens/index';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import icon from './styles';
import CustomDrawerContent from './CustomDrawerContent';
import theme from '../../theme';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();
// react navigation v5 work dangerouslyGetParent()
// react navigation v6 work getParent()

export default HomeStack = () => {
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
          fontSize: 13,
        },
        drawerItemStyle: {},
        // drawerActiveBackgroundColor: theme.color.backgroundGreen,
      }}
      drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen
        name="Home"
        component={HomeStack}
        options={icon.Homeicon}
      />
      <Drawer.Screen
        name="Inbox"
        component={InboxStack}
        options={icon.Inboxicon}
      />

      <Drawer.Screen
        name="NewTrip"
        component={NewTripsStack}
        options={icon.NewTripicon}
      />
      <Drawer.Screen
        name="MyProfile"
        component={ProfileStack}
        options={icon.MyProfileicon}
      />
      <Drawer.Screen
        name="EditProfile"
        component={EditProfileStack}
        options={icon.EditProfileicon}
      />
      {/* sec */}
      <Drawer.Screen
        name="TradeOffers"
        component={TradeOfferStack}
        options={icon.TradeOffersicon}
      />
      <Drawer.Screen
        name="ConfirmedTrips"
        component={ConfirmedTripsStack}
        options={icon.ConfirmedTripsicon}
      />
      <Drawer.Screen
        name="SavedTrips"
        component={SavedTripsStack}
        options={icon.SavedTripsicons}
      />
      {/* sctn */}

      <Drawer.Screen
        name="Support"
        component={SupportStack}
        options={icon.Supporticon}
      />

      <Drawer.Screen
        name="LatestNews"
        component={LatestNewsstack}
        options={icon.LatestNewsicon}
      />

      <Drawer.Screen
        name="Settings"
        component={SettingsStack}
        options={icon.Settingsicons}
      />
    </Drawer.Navigator>
  );
};

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
        options={props => {
          let parent = props.navigation.getParent();
          parent.setOptions({
            swipeEnabled: false,
          });
        }}
        name="Plan"
        component={screens.Plan}
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
      <Stack.Screen
        name="NotificationsGuest"
        component={screens.NotificationsGuest}
        options={props => {
          let parent = props.navigation.getParent();
          parent.setOptions({
            swipeEnabled: false,
          });
        }}
      />

      <Stack.Screen
        name="UserProfile"
        component={UserProfileStack}
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
        name="Chat"
        component={ChatStack}
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

      <Stack.Screen
        name="NotificationsGuest"
        component={screens.NotificationsGuest}
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

let ChatStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Chats"
      screenOptions={{
        animationEnabled: false,
        headerShown: false,
      }}>
      <Stack.Screen
        name="Chats"
        component={screens.Chat}
        options={props => {
          let parent = props.navigation.getParent();
          parent.setOptions({
            swipeEnabled: false,
          });
        }}
      />

      <Stack.Screen
        name="UserProfile"
        component={UserProfileStack}
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
      <Stack.Screen
        name="NotificationsGuest"
        component={screens.NotificationsGuest}
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
        name="SavedTripse"
        component={screens.SavedTrips}
        options={props => {
          let parent = props.navigation.getParent();
          parent.setOptions({
            swipeEnabled: true,
          });
        }}
      />

      <Stack.Screen
        name="UserProfile"
        component={UserProfileStack}
        options={props => {
          let parent = props.navigation.getParent();
          parent.setOptions({
            swipeEnabled: false,
          });
        }}
      />

      <Stack.Screen
        options={props => {
          let parent = props.navigation.getParent();
          parent.setOptions({
            swipeEnabled: false,
          });
        }}
        name="Plan"
        component={screens.Plan}
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
      <Stack.Screen
        name="NotificationsGuest"
        component={screens.NotificationsGuest}
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
        name="ShowFollowers"
        component={ShowFollowersStack}
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

      <Stack.Screen
        name="NotificationsGuest"
        component={screens.NotificationsGuest}
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

let UserProfileStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="UserProfilee"
      screenOptions={{
        animationEnabled: false,
        headerShown: false,
      }}>
      <Stack.Screen
        name="UserProfilee"
        component={screens.UserProfile}
        // options={props => {
        //   let parent = props.navigation.getParent();
        //   parent.setOptions({
        //     swipeEnabled: true,
        //   });
        // }}
      />

      <Stack.Screen
        name="ShowFollowers"
        component={ShowOtherFollowersStack}
        // options={props => {
        //   let parent = props.navigation.getParent();
        //   parent.setOptions({
        //     swipeEnabled: false,
        //   });
        // }}
      />

      <Stack.Screen
        options={props => {
          let parent = props.navigation.getParent();
          parent.setOptions({
            swipeEnabled: false,
          });
        }}
        name="Plan"
        component={screens.Plan}
      />

      <Stack.Screen
        name="Notifications"
        component={screens.Notifications}
        // options={props => {
        //   let parent = props.navigation.getParent();
        //   parent.setOptions({
        //     swipeEnabled: false,
        //   });
        // }}
      />
      <Stack.Screen
        name="NotificationsGuest"
        component={screens.NotificationsGuest}
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

let EditProfileStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="EditProfilee"
      screenOptions={{
        animationEnabled: false,
        headerShown: false,
      }}>
      <Stack.Screen
        name="EditProfilee"
        component={screens.EditProfile}
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

      <Stack.Screen
        name="NotificationsGuest"
        component={screens.NotificationsGuest}
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

let SettingsStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Settingss"
      screenOptions={{
        animationEnabled: false,
        headerShown: false,
      }}>
      <Stack.Screen
        name="Settingss"
        component={screens.Settings}
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

      <Stack.Screen
        name="NotificationsGuest"
        component={screens.NotificationsGuest}
        options={props => {
          let parent = props.navigation.getParent();
          parent.setOptions({
            swipeEnabled: false,
          });
        }}
      />

      <Stack.Screen
        name="BlockUsers"
        component={BlockUserstack}
        options={props => {
          let parent = props.navigation.getParent();
          parent.setOptions({
            swipeEnabled: false,
          });
        }}
      />

      <Stack.Screen
        name="ChangePassword"
        component={ChangePasswordStack}
        options={props => {
          let parent = props.navigation.getParent();
          parent.setOptions({
            swipeEnabled: false,
          });
        }}
      />

      <Stack.Screen
        name="ManageSubscription"
        component={ManageSubscriptionStack}
        options={props => {
          let parent = props.navigation.getParent();
          parent.setOptions({
            swipeEnabled: false,
          });
        }}
      />

      <Stack.Screen
        name="ContactUs"
        component={ContactUsStack}
        options={props => {
          let parent = props.navigation.getParent();
          parent.setOptions({
            swipeEnabled: false,
          });
        }}
      />

      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicyStack}
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

let SupportStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Supportt"
      screenOptions={{
        animationEnabled: false,
        headerShown: false,
      }}>
      <Stack.Screen name="Supportt" component={screens.Support} />

      <Stack.Screen name="Notifications" component={screens.Notifications} />
      <Stack.Screen
        name="NotificationsGuest"
        component={screens.NotificationsGuest}
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

let ChangePasswordStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="ChangePasswordd"
      screenOptions={{
        animationEnabled: false,
        headerShown: false,
      }}>
      <Stack.Screen name="ChangePasswordd" component={screens.ChangePassword} />
      <Stack.Screen name="ForgotPassword" component={screens.ForgotPassword} />
      <Stack.Screen name="VerifyCode" component={screens.VerifyCode} />
      <Stack.Screen name="ResetPassword" component={screens.ResetPassword} />
      <Stack.Screen name="Notifications" component={screens.Notifications} />
      <Stack.Screen
        name="NotificationsGuest"
        component={screens.NotificationsGuest}
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

let BlockUserstack = () => {
  return (
    <Stack.Navigator
      initialRouteName="BlockUserss"
      screenOptions={{
        animationEnabled: false,
        headerShown: false,
      }}>
      <Stack.Screen name="BlockUserss" component={screens.BlockUsers} />
      <Stack.Screen name="Notifications" component={screens.Notifications} />
      <Stack.Screen
        name="NotificationsGuest"
        component={screens.NotificationsGuest}
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

let ManageSubscriptionStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="ManageSubscriptionn"
      screenOptions={{
        animationEnabled: false,
        headerShown: false,
      }}>
      <Stack.Screen
        name="ManageSubscriptionn"
        component={screens.ManageSubscription}
      />
      <Stack.Screen name="Plan" component={screens.Plan} />
      <Stack.Screen name="Notifications" component={screens.Notifications} />
      <Stack.Screen
        name="NotificationsGuest"
        component={screens.NotificationsGuest}
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

let PrivacyPolicyStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="PrivacyPolicyy"
      screenOptions={{
        animationEnabled: false,
        headerShown: false,
      }}>
      <Stack.Screen name="PrivacyPolicyy" component={screens.PrivacyPolicy} />

      <Stack.Screen name="Notifications" component={screens.Notifications} />
      <Stack.Screen
        name="NotificationsGuest"
        component={screens.NotificationsGuest}
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

let ContactUsStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="ContactUss"
      screenOptions={{
        animationEnabled: false,
        headerShown: false,
      }}>
      <Stack.Screen name="ContactUs" component={screens.ContactUs} />

      <Stack.Screen name="Notifications" component={screens.Notifications} />
      <Stack.Screen
        name="NotificationsGuest"
        component={screens.NotificationsGuest}
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

let ConfirmedTripsStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="ConfirmedTripss"
      screenOptions={{
        animationEnabled: false,
        headerShown: false,
      }}>
      <Stack.Screen
        name="ConfirmedTripss"
        component={screens.ConfirmTrips}
        options={props => {
          let parent = props.navigation.getParent();
          parent.setOptions({
            swipeEnabled: true,
          });
        }}
      />

      <Stack.Screen
        name="UserProfile"
        component={UserProfileStack}
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
      <Stack.Screen
        name="NotificationsGuest"
        component={screens.NotificationsGuest}
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

let NewTripsStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="NewTripss"
      screenOptions={{
        animationEnabled: false,
        headerShown: false,
      }}>
      <Stack.Screen
        name="NewTripss"
        component={screens.NewTrips}
        options={props => {
          let parent = props.navigation.getParent();
          parent.setOptions({
            swipeEnabled: true,
          });
        }}
      />

      <Stack.Screen
        options={props => {
          let parent = props.navigation.getParent();
          parent.setOptions({
            swipeEnabled: false,
          });
        }}
        name="Plan"
        component={screens.Plan}
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

      <Stack.Screen
        name="NotificationsGuest"
        component={screens.NotificationsGuest}
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

let ShowFollowersStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="ShowFollowerss"
      screenOptions={{
        animationEnabled: false,
        headerShown: false,
      }}>
      <Stack.Screen
        name="ShowFollowerss"
        component={screens.ShowFollowers}
        options={props => {
          let parent = props.navigation.getParent();
          parent.setOptions({
            swipeEnabled: false,
          });
        }}
      />

      <Stack.Screen
        name="UserProfile"
        component={UserProfileStack}
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

      <Stack.Screen
        name="NotificationsGuest"
        component={screens.NotificationsGuest}
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

let ShowOtherFollowersStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="ShowFollowersss"
      screenOptions={{
        animationEnabled: false,
        headerShown: false,
      }}>
      <Stack.Screen
        name="ShowFollowersss"
        component={screens.ShowOtherFollowers}
        options={props => {
          let parent = props.navigation.getParent();
          parent.setOptions({
            swipeEnabled: false,
          });
        }}
      />

      <Stack.Screen
        name="UserProfile"
        component={UserProfileStack}
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

      <Stack.Screen
        name="NotificationsGuest"
        component={screens.NotificationsGuest}
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

let LatestNewsstack = () => {
  return (
    <Stack.Navigator
      initialRouteName="LatestNewss"
      screenOptions={{
        animationEnabled: false,
        headerShown: false,
      }}>
      <Stack.Screen
        name="LatestNewss"
        component={screens.LatestNews}
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
      <Stack.Screen
        name="NotificationsGuest"
        component={screens.NotificationsGuest}
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

let PrivacyPolicystack = () => {
  return (
    <Stack.Navigator
      initialRouteName="PrivacyPolicyy"
      screenOptions={{
        animationEnabled: false,
        headerShown: false,
      }}>
      <Stack.Screen
        name="PrivacyPolicyy"
        component={screens.PrivacyPolicy}
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

      <Stack.Screen
        name="NotificationsGuest"
        component={screens.NotificationsGuest}
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
