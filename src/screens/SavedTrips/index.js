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
} from 'react-native';
// import Geolocation from 'react-native-geolocation-service';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
// import Geocoder from 'react-native-geocoding';
import {styles} from './styles';
import {observer} from 'mobx-react';
import store from '../../store/index';
import utils from '../../utils/index';
import theme from '../../theme';
// import DynamicTabView from 'react-native-dynamic-tab-view';
// import ImageSlider from 'react-native-image-slider';
// import FastImage from 'react-native-fast-image';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-easy-toast';

import RBSheet from 'react-native-raw-bottom-sheet';
import {ActivityIndicator} from 'react-native-paper';
import {ScrollView} from 'react-native-gesture-handler';

export default observer(SavedTrips);

function SavedTrips(props) {
  const toast = useRef(null);
  const toastduration = 700;
  let headerTitle = 'Saved Trips';

  let internet = store.General.isInternet;
  let user = store.User.user;

  let loc = store.User.location;
  let cart = store.User.cart;
  let totalItems = cart.data.length > 0 ? cart.totalitems : 0;
  let tagLine = '';

  const renderStatusBar = () => {
    return (
      <>
        <StatusBar
          translucent={false}
          backgroundColor={theme.color.backgroundGreen}
          barStyle={Platform.OS == 'android' ? 'light-content' : 'dark-content'}
        />
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {!internet && <utils.InternetMessage />}
      {/* {tagLine != '' && <utils.TagLine tagLine={tagLine} />} */}
      <utils.DrawerHeader props={props} headerTitle={headerTitle} />
      <ScrollView contentContainerStyle={{padding: 20}}>
        {/* {renderMain()} */}
      </ScrollView>

      {renderStatusBar()}
      <Toast ref={toast} position="bottom" />
      {/* <utils.Loader2 load={Loader} /> */}
      <utils.Footer
        nav={props.navigation}
        screen={headerTitle}
        focusScreen={store.General.focusScreen}
      />
    </SafeAreaView>
  );
}
