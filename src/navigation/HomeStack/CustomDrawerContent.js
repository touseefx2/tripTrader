import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Image,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';

import theme from '../../theme/index';
import {inject, observer} from 'mobx-react';
import utils from '../../utils/index';
import {responsiveHeight} from 'react-native-responsive-dimensions';
import {ScrollView} from 'react-native-gesture-handler';
import store from '../../store';

export default observer(CustomDrawerContent);
function CustomDrawerContent(props) {
  let cS = store.General.focusScreen || '';
  let user = store.User.user;
  let focusItemColor = 'rgba(255, 255, 255, 0.1)';
  const {navigation, state, ...rest} = props;
  let newState = {...state}; //copy from state before applying any filter. do not change original state
  // if (user && user == 'guest') {
  //   newState.routes = newState.routes.filter(
  //     item =>
  //       item.name !== 'TradeOffers' &&
  //       item.name !== 'ConfirmedTrips' &&
  //       item.name !== 'SavedTrips',
  //   );
  // }

  // if (user && user !== 'guest') {
  //   newState.routes = newState.routes.filter(item => item.name !== 'MyProfile');
  // }
  const {routes, index} = state;
  const focusedRoute = routes[index].name; // this is the active route

  const [profileImageLoader, setprofileImageLoader] = useState(false);

  store.General.setFocusScreen(focusedRoute);

  const goToLogout = () => {
    store.User.setUser(false);
    store.User.setreview([]);
    store.User.settrips([]);
    store.User.setphotos([]);
  };

  const goToProfile = () => {
    props.navigation.navigate('MyProfile');
  };

  const renderSection1 = () => {
    return (
      <View style={styles.Section1}>
        <Image
          style={styles.logo}
          source={require('../../assets/images/logo/img.png')}
        />
        <View style={{width: '70%', marginLeft: 10}}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.Section1Text}>
            {store.General.AppName}
          </Text>
        </View>
      </View>
    );
  };

  const renderSection2 = () => {
    //methods

    // const goToHome = () => {
    //   props.navigation.navigate('Home');
    // };
    // const goToInbox = () => {
    //   props.navigation.navigate('Inbox');
    // };
    // const goToNewTrip = () => {
    //   props.navigation.navigate('NewTrip');
    // };
    // const goToProfile = () => {
    //   props.navigation.navigate('MyProfile');
    // };
    // const goToTradeOffers = () => {
    //   props.navigation.navigate('TradeOffers');
    // };
    // const goToConfirmedTrips = () => {
    //   props.navigation.navigate('onfirmedTrips');
    // };
    // const goToSavedTrips = () => {
    //   props.navigation.navigate('SavedTrips');
    // };
    // const goToSupport = () => {
    //   props.navigation.navigate('Support');
    // };
    // const goToLatestNews = () => {
    //   props.navigation.navigate('LatestNews');
    // };
    // const goToPrivacyPolicy = () => {
    //   props.navigation.navigate('PrivacyPolicy');
    // };
    // const goToSettings = () => {
    //   props.navigation.navigate('Settings');
    // };

    //render

    // const Homeicon = () => {
    //   return (
    //     <>
    //       <Image
    //         style={styles.icon}
    //         source={require('../../assets/images/drawer/home/img.png')}
    //       />

    //       <View style={styles.itemTextContainer}>
    //         <Text
    //           numberOfLines={1}
    //           ellipsizeMode="tail"
    //           style={styles.itemText}>
    //           Home
    //         </Text>
    //       </View>
    //     </>
    //   );
    // };

    // const Inboxicon = () => {
    //   return (
    //     <>
    //       <Image
    //         style={styles.icon}
    //         source={require('../../assets/images/drawer/inbox/img.png')}
    //       />
    //       <View style={styles.itemTextContainer}>
    //         <Text
    //           numberOfLines={1}
    //           ellipsizeMode="tail"
    //           style={styles.itemText}>
    //           Inbox
    //         </Text>
    //       </View>
    //     </>
    //   );
    // };

    // const NewTripicon = () => {
    //   return (
    //     <>
    //       <Image
    //         style={styles.icon}
    //         source={require('../../assets/images/drawer/newtrip/img.png')}
    //       />
    //       <View style={styles.itemTextContainer}>
    //         <Text
    //           numberOfLines={1}
    //           ellipsizeMode="tail"
    //           style={styles.itemText}>
    //           New Trip
    //         </Text>
    //       </View>
    //     </>
    //   );
    // };

    // const MyProfileicon = () => {
    //   return (
    //     <>
    //       <Image
    //         style={styles.icon}
    //         source={require('../../assets/images/drawer/myprofile/img.png')}
    //       />
    //       <View style={styles.itemTextContainer}>
    //         <Text
    //           numberOfLines={1}
    //           ellipsizeMode="tail"
    //           style={styles.itemText}>
    //           My Profile
    //         </Text>
    //       </View>
    //     </>
    //   );
    // };

    // const TradeOffersicon = () => {
    //   return (
    //     <>
    //       <Image
    //         style={styles.icon}
    //         source={require('../../assets/images/drawer/tradeoffers/img.png')}
    //       />
    //       <View style={styles.itemTextContainer}>
    //         <Text
    //           numberOfLines={1}
    //           ellipsizeMode="tail"
    //           style={styles.itemText}>
    //           Trade Offers
    //         </Text>
    //       </View>
    //     </>
    //   );
    // };

    // const ConfirmedTripsicon = () => {
    //   return (
    //     <>
    //       <Image
    //         style={styles.icon}
    //         source={require('../../assets/images/drawer/confirmedtrips/img.png')}
    //       />
    //       <View style={styles.itemTextContainer}>
    //         <Text
    //           numberOfLines={1}
    //           ellipsizeMode="tail"
    //           style={styles.itemText}>
    //           Confirmed Trips
    //         </Text>
    //       </View>
    //     </>
    //   );
    // };

    // const SavedTripsicons = () => {
    //   return (
    //     <>
    //       <Image
    //         style={styles.icon}
    //         source={require('../../assets/images/drawer/savedtrips/img.png')}
    //       />
    //       <View style={styles.itemTextContainer}>
    //         <Text
    //           numberOfLines={1}
    //           ellipsizeMode="tail"
    //           style={styles.itemText}>
    //           Saved Trips
    //         </Text>
    //       </View>
    //     </>
    //   );
    // };

    // const Supporticon = () => {
    //   return (
    //     <>
    //       <Image
    //         style={styles.icon}
    //         source={require('../../assets/images/drawer/support/img.png')}
    //       />
    //       <View style={styles.itemTextContainer}>
    //         <Text
    //           numberOfLines={1}
    //           ellipsizeMode="tail"
    //           style={styles.itemText}>
    //           Support
    //         </Text>
    //       </View>
    //     </>
    //   );
    // };

    // const LatestNewsicon = () => {
    //   return (
    //     <>
    //       <Image
    //         style={styles.icon}
    //         source={require('../../assets/images/drawer/latestnews/img.png')}
    //       />
    //       <View style={styles.itemTextContainer}>
    //         <Text
    //           numberOfLines={1}
    //           ellipsizeMode="tail"
    //           style={styles.itemText}>
    //           Latest News
    //         </Text>
    //       </View>
    //     </>
    //   );
    // };

    // const PrivacyPolicyicon = () => {
    //   return (
    //     <>
    //       <Image
    //         style={styles.icon}
    //         source={require('../../assets/images/drawer/privacypolicy/img.png')}
    //       />
    //       <View style={styles.itemTextContainer}>
    //         <Text
    //           numberOfLines={1}
    //           ellipsizeMode="tail"
    //           style={styles.itemText}>
    //           Privacy Policy
    //         </Text>
    //       </View>
    //     </>
    //   );
    // };

    // const Settingsicons = () => {
    //   return (
    //     <>
    //       <Image
    //         style={styles.icon}
    //         source={require('../../assets/images/drawer/settings/img.png')}
    //       />
    //       <View style={styles.itemTextContainer}>
    //         <Text
    //           numberOfLines={1}
    //           ellipsizeMode="tail"
    //           style={styles.itemText}>
    //           Settings
    //         </Text>
    //       </View>
    //     </>
    //   );
    // };

    return (
      <ScrollView showsVerticalScrollIndicator={false} style={styles.Section2}>
        <DrawerItemList user={user} {...props} />

        {/* section1 */}
        {/* <View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={goToHome}
            style={styles.itemContainer}>
            {Homeicon()}
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={goToInbox}
            style={styles.itemContainer}>
            {Inboxicon()}
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={goToNewTrip}
            style={styles.itemContainer}>
            {NewTripicon()}
          </TouchableOpacity>

          {user && user == 'guest' && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={goToProfile}
              style={styles.itemContainer}>
              {MyProfileicon()}
            </TouchableOpacity>
          )}

          {user && user != 'guest' && (
            <>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={goToTradeOffers}
                style={styles.itemContainer}>
                {TradeOffersicon()}
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={goToConfirmedTrips}
                style={styles.itemContainer}>
                {ConfirmedTripsicon()}
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={goToSavedTrips}
                style={styles.itemContainer}>
                {SavedTripsicons()}
              </TouchableOpacity>
            </>
          )}
        </View> */}
        {/* section2 */}
        {/* <View style={{marginTop: 15}}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={goToSupport}
            style={styles.itemContainer}>
            {Supporticon()}
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={goToLatestNews}
            style={styles.itemContainer}>
            {LatestNewsicon()}
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={goToPrivacyPolicy}
            style={styles.itemContainer}>
            {PrivacyPolicyicon()}
          </TouchableOpacity>
        </View> */}
        {/* section3 */}
        {/* <View style={{marginTop: 15}}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={goToSettings}
            style={styles.itemContainer}>
            {Settingsicons()}
          </TouchableOpacity>
        </View> */}
      </ScrollView>
    );
  };

  const renderBottom = () => {
    const renderProfile = () => {
      let title1 =
        user == 'guest' ? 'guest user' : user.first_name + ' ' + user.last_name;
      let title2 = user == 'guest' ? 'limited access' : 'memeber';
      let src = '';
      if (user == 'guest') {
        src = require('../../assets/images/drawer/guest/img.png');
      }
      if (user != 'guest' && user) {
        src =
          user.photo != ''
            ? {uri: user.photo}
            : require('../../assets/images/drawer/guest/img.png');
      }

      return (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={goToProfile}
          style={styles.Profile}>
          <View style={styles.ProfileImgContainer}>
            <Image
              onLoadStart={() => {
                setprofileImageLoader(false);
              }}
              onLoad={() => {
                setprofileImageLoader(true);
              }}
              style={styles.ProfileImg}
              source={src}
            />
            {!profileImageLoader && (
              <ActivityIndicator
                size={18}
                color={theme.color.buttonText}
                style={{top: 17, position: 'absolute'}}
              />
            )}
          </View>

          <View style={styles.ProfileTextContainer}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.profileTitle1}>
              {title1}
            </Text>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.profileTitle2}>
              {title2}
            </Text>
          </View>
        </TouchableOpacity>
      );
    };

    return (
      <View style={styles.bottomContainer}>
        {renderProfile()}
        <TouchableOpacity activeOpacity={0.7} onPress={goToLogout}>
          <Image
            style={[styles.icon, {width: 24, height: 24}]}
            source={require('../../assets/images/drawer/logout/img.png')}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.drwaerContentContainer}>
        {renderSection1()}
        {renderSection2()}
      </DrawerContentScrollView>
      {renderBottom()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.backgroundGreen,
    paddingVertical: 25,
  },
  drwaerContentContainer: {
    flex: 1,
  },
  Section1: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  Section1Text: {
    fontSize: 18,
    color: theme.color.buttonText,
    fontFamily: theme.fonts.fontBold,

    textTransform: 'uppercase',
  },
  Section2: {
    flex: 1,
    paddingHorizontal: 5,
    marginTop: 10,
    marginBottom: 10,
    paddingVertical: 10,
    // backgroundColor: 'blue',
  },

  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  bottomContainerText: {
    fontSize: 12,
    color: theme.color.subTitle,
    fontFamily: theme.fonts.fontNormal,
  },
  logo: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
  },
  itemContainer: {
    width: '85%',
    paddingVertical: 7,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 7,
    borderRadius: 8,
    paddingLeft: 15,
  },
  itemTextContainer: {width: '83%'},
  itemText: {
    fontSize: 15,
    color: theme.color.backgroundGreenText,
    fontFamily: theme.fonts.fontNormal,
    marginLeft: 7,
    textTransform: 'capitalize',
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  Profile: {
    width: '85%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  ProfileImgContainer: {
    width: 60,
    height: 60,
    borderRadius: 60 / 2,
    borderWidth: 2,
    borderColor: theme.color.photoBorderColor,
    alignItems: 'center',
    justifyContent: 'center',
  },

  ProfileImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: 60 / 2,
  },

  ProfileTextContainer: {width: '63%'},
  profileTitle1: {
    fontSize: 14,
    color: theme.color.backgroundGreenText,
    fontFamily: theme.fonts.fontBold,
    lineHeight: 15,
    textTransform: 'capitalize',
  },
  profileTitle2: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: theme.fonts.fontMedium,
    lineHeight: 15,
    marginTop: 3,
    textTransform: 'capitalize',
  },
});
