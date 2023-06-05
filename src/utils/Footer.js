import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import theme from '../theme/index';
import {observer} from 'mobx-react';
import {
  responsiveFontSize,
  responsiveHeight,
} from 'react-native-responsive-dimensions';

export default observer(Footer);
function Footer(props) {
  const nav = props.nav;
  const screen = props.screen || '';
  const focusScreen = props.focusScreen;
  const focusTextColor = theme.color.button1;
  const unfocusTextColor = 'rgba(30, 54, 37, 0.4)';
  const activeOpacity = 0.7;

  const goBack = () => {
    if (screen == 'Notifications') props.closeModal();
  };

  const specificScreen = () => {
    if (screen == 'Inbox') {
      props.setsearch();
      props.closeSwipe();
    }
  };

  const goToHome = () => {
    nav.navigate('Home');
    specificScreen();
    goBack();
  };

  const goToInbox = () => {
    nav.navigate('Inbox');
    specificScreen();
    goBack();
  };

  const goToTradeOffers = () => {
    nav.navigate('TradeOffers');
    specificScreen();
    goBack();
  };

  const goToSavedTrips = () => {
    specificScreen();
    nav.navigate('SavedTrips');
    goBack();
  };

  const goToProfile = () => {
    nav.navigate('MyProfile');
    specificScreen();
    goBack();
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
        activeOpacity={activeOpacity}>
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
        activeOpacity={activeOpacity}>
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
        activeOpacity={activeOpacity}>
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
        activeOpacity={activeOpacity}>
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
        activeOpacity={activeOpacity}>
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
    backgroundColor: theme.color.background,
    paddingHorizontal: 25,
    paddingVertical: responsiveHeight(0.82),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    borderColor: '#a3a3a3',
    borderTopWidth: 0.3,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 5,
    // },
    // shadowOpacity: 0.34,
    // shadowRadius: 6.27,
    // elevation: 10,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: responsiveFontSize(3.3),
    height: responsiveFontSize(3.3),
    resizeMode: 'contain',
  },
  Text: {
    fontSize: responsiveFontSize(1.5),
    fontFamily: theme.fonts.fontMedium,
    marginTop: responsiveHeight(0.7),
    textAlign: 'center',
    textTransform: 'uppercase',
  },
});
