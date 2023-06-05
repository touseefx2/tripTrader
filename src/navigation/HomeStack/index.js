import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import screens from '../../screens/index';
import icon from './styles';
import CustomDrawerContent from './CustomDrawerContent';
import theme from '../../theme';
import {responsiveFontSize} from 'react-native-responsive-dimensions';

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
          fontSize: responsiveFontSize(1.9),
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
        component={screens.Support}
        options={icon.Supporticon}
      />

      {/* <Drawer.Screen
        name="LatestNews"
        component={LatestNewsstack}
        options={icon.LatestNewsicon}
      /> */}

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
    </Stack.Navigator>
  );
};

let NewTripsStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="NewTrips"
      screenOptions={{
        animationEnabled: false,
        headerShown: false,
      }}>
      <Stack.Screen
        name="NewTrips"
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
      <Stack.Screen name="UserProfilee" component={screens.UserProfile} />

      <Stack.Screen name="ShowFollowers" component={ShowOtherFollowersStack} />

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
        name="BlockUsers"
        component={screens.BlockUsers}
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
    </Stack.Navigator>
  );
};

// let LatestNewsstack = () => {
//   return (
//     <Stack.Navigator
//       initialRouteName="LatestNewss"
//       screenOptions={{
//         animationEnabled: false,
//         headerShown: false,
//       }}>
//       <Stack.Screen
//         name="LatestNewss"
//         component={screens.LatestNews}
//         options={props => {
//           let parent = props.navigation.getParent();
//           parent.setOptions({
//             swipeEnabled: true,
//           });
//         }}
//       />

//     </Stack.Navigator>
//   );
// };
