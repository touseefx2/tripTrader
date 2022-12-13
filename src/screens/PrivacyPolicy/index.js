import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TouchableHighlight,
  StatusBar,
  BackHandler,
  Alert,
  Linking,
  PermissionsAndroid,
  Platform,
  Dimensions,
  Pressable,
  TextInput,
  FlatList,
  ScrollView,
  Keyboard,
  Modal,
  RefreshControl,
} from 'react-native';
import ProgressiveFastImage from '@freakycoder/react-native-progressive-fast-image';
// import ImageSlider from 'react-native-image-slider';
import {styles} from './styles';
import {observer} from 'mobx-react';
import store from '../../store/index';
import utils from '../../utils/index';
import theme from '../../theme';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-easy-toast';
import {ActivityIndicator} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import {ImageSlider} from 'react-native-image-slider-banner';
import {Calendar} from 'react-native-calendars';
import moment, {duration} from 'moment/moment';
import {SwipeListView} from 'react-native-swipe-list-view';

export default observer(PrivacyPolicy);

function PrivacyPolicy(props) {
  let headerTitle = 'Privacy Policy';
  let internet = store.General.isInternet;
  let user = store.User.user;

  const data = [];

  useEffect(() => {
    if (user == 'guest') {
      store.General.setgoto('guestaccess');
      store.User.Logout();
      return;
    }
  }, []);

  return (
    <>
      <View style={styles.container}>
        <utils.StackHeader
          bell={true}
          props={props}
          headerTitle={headerTitle}
        />
        {!internet && <utils.InternetMessage />}
        <SafeAreaView style={styles.container2}>
          <View style={styles.container3}></View>

          <utils.Footer
            nav={props.navigation}
            screen={headerTitle}
            focusScreen={store.General.focusScreen}
          />

          {store.Notifications.isShowNotifcation && <utils.ShowNotifications />}
        </SafeAreaView>
      </View>
    </>
  );
}
