import React, {useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
  Image,
} from 'react-native';
import theme from '../theme/index';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import utils from '.';

import store from '../store/index';
import {observer} from 'mobx-react';
import LinearGradient from 'react-native-linear-gradient';

export default observer(Footer);
function Footer(props) {
  let nav = props.nav;
  let user = store.User.user;
  let screen = props.screen;
  let focusScreen = props.focusScreen;
  let focusTextColor = theme.color.button1;
  let unfocusTextColor = 'rgba(30, 54, 37, 0.4)';
  let ao = 0.7;

  const goToHome = () => {
    nav.navigate('Home');
  };

  const goToInbox = () => {
    nav.navigate('Inbox');
  };

  const goToTradeOffers = () => {
    nav.navigate('TradeOffers');
  };

  const goToSavedTrips = () => {
    nav.navigate('SavedTrips');
  };

  const goToProfile = () => {
    nav.navigate('MyProfile');
  };

  const renderHome = () => {
    let isFocus = focusScreen == 'Home' ? true : false;
    let img = isFocus
      ? require('../assets/images/drawer/home/image.png')
      : require('../assets/images/drawer/home/image2.png');
    return (
      <TouchableOpacity
        onPress={goToHome}
        style={styles.iconContainer}
        activeOpacity={ao}>
        <Image style={styles.icon} source={img} />
        <Text
          style={[
            styles.Text,
            {color: isFocus ? focusTextColor : unfocusTextColor},
          ]}>
          Home
        </Text>
      </TouchableOpacity>
    );
  };

  const renderInbox = () => {
    let isFocus = focusScreen == 'Inbox' ? true : false;
    let img = isFocus
      ? require('../assets/images/drawer/inbox/image.png')
      : require('../assets/images/drawer/inbox/image2.png');
    return (
      <TouchableOpacity
        onPress={goToInbox}
        style={styles.iconContainer}
        activeOpacity={ao}>
        <Image style={styles.icon} source={img} />
        <Text
          style={[
            styles.Text,
            {color: isFocus ? focusTextColor : unfocusTextColor},
          ]}>
          Inbox
        </Text>
      </TouchableOpacity>
    );
  };

  const renderOffers = () => {
    let isFocus = focusScreen == 'TradeOffers' ? true : false;
    let img = isFocus
      ? require('../assets/images/drawer/tradeoffers/image.png')
      : require('../assets/images/drawer/tradeoffers/image2.png');
    return (
      <TouchableOpacity
        onPress={goToTradeOffers}
        style={styles.iconContainer}
        activeOpacity={ao}>
        <Image style={styles.icon} source={img} />
        <Text
          style={[
            styles.Text,
            {color: isFocus ? focusTextColor : unfocusTextColor},
          ]}>
          Offers
        </Text>
      </TouchableOpacity>
    );
  };

  const renderSaved = () => {
    let isFocus = focusScreen == 'SavedTrips' ? true : false;
    let img = isFocus
      ? require('../assets/images/drawer/savedtrips/image.png')
      : require('../assets/images/drawer/savedtrips/image2.png');
    return (
      <TouchableOpacity
        onPress={goToSavedTrips}
        style={styles.iconContainer}
        activeOpacity={ao}>
        <Image style={styles.icon} source={img} />
        <Text
          style={[
            styles.Text,
            {color: isFocus ? focusTextColor : unfocusTextColor},
          ]}>
          Saved
        </Text>
      </TouchableOpacity>
    );
  };

  const renderProfile = () => {
    let isFocus = focusScreen == 'MyProfile' ? true : false;
    let img = isFocus
      ? require('../assets/images/drawer/myprofile/image.png')
      : require('../assets/images/drawer/myprofile/image2.png');
    return (
      <TouchableOpacity
        onPress={goToProfile}
        style={styles.iconContainer}
        activeOpacity={ao}>
        <Image style={styles.icon} source={img} />
        <Text
          style={[
            styles.Text,
            {color: isFocus ? focusTextColor : unfocusTextColor},
          ]}>
          Profile
        </Text>
      </TouchableOpacity>
    );
  };
  return (
    <>
      <View style={styles.footerContainer}>
        {renderHome()}
        {renderInbox()}
        {renderOffers()}
        {renderSaved()}
        {renderProfile()}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    backgroundColor: '#f7f7f7',
    paddingHorizontal: 25,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.53,
    shadowRadius: 13.97,
    elevation: 21,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
  Text: {
    fontSize: 12,
    fontFamily: theme.fonts.fontMedium,
    textTransform: 'capitalize',
    marginTop: 5,
  },
});
