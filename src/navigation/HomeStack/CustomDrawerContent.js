import React, {useState} from 'react';
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
import {observer} from 'mobx-react';
import utils from '../../utils/index';
import {responsiveFontSize} from 'react-native-responsive-dimensions';
import {ScrollView} from 'react-native-gesture-handler';
import store from '../../store';

export default observer(CustomDrawerContent);
function CustomDrawerContent(props) {
  let user = store.User.user;

  const {routes, index} = props.state;
  const focusedRoute = routes[index].name; // this is the active route
  store.General.setFocusScreen(focusedRoute);
  const [profileImageLoader, setprofileImageLoader] = useState(false);

  const goToLogout = () => {
    store.User.Logout();
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
    return (
      <ScrollView showsVerticalScrollIndicator={false} style={styles.Section2}>
        <DrawerItemList user={user} {...props} />
      </ScrollView>
    );
  };

  const renderBottom = () => {
    const renderProfile = () => {
      let title1 =
        user == 'guest' ? 'guest user' : user.firstName + ' ' + user.lastName;
      let title2 = user == 'guest' ? 'limited access' : 'member';
      let src = '';
      let gsrc = require('../../assets/images/drawer/guest/img.png');
      if (user == 'guest') {
        src = gsrc;
      }
      if (user != 'guest' && user) {
        src = user.image && user.image != '' ? {uri: user.image} : gsrc;
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
        {user && user !== 'guest' ? (
          <TouchableOpacity activeOpacity={0.7} onPress={goToLogout}>
            <Image
              style={[styles.icon, {width: 24, height: 24}]}
              source={require('../../assets/images/drawer/logout/img.png')}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            disabled
            style={{width: 24}}
            activeOpacity={0.7}
            onPress={goToLogout}>
            {/* <Image
            style={[styles.icon, {width: 24, height: 24}]}
            source={require('../../assets/images/drawer/logout/img.png')}
          /> */}
          </TouchableOpacity>
        )}
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
      {Platform.OS == 'ios' && <utils.navBarHeight />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.backgroundGreen,
    paddingTop: Platform.OS == 'ios' ? theme.window.STATUSBAR_HEIGHT + 12 : 25,
    paddingBottom: 25,
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
    // fontSize: 17,
    fontSize: responsiveFontSize(2.3),
    color: theme.color.buttonText,
    fontFamily: theme.fonts.titleFont,

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
    borderWidth: 1,
    borderColor: theme.color.photoBorderColor,
    alignItems: 'center',
    justifyContent: 'center',
  },

  ProfileImg: {
    width: '100%',
    height: '100%',
    // resizeMode: 'contain',
    borderRadius: 60 / 2,
  },

  ProfileTextContainer: {width: '70%'},
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
