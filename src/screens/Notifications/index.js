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

export default observer(Notifications);

function Notifications(props) {
  const toast = useRef(null);
  const toastduration = 700;
  let headerTitle = 'Notifications';

  let internet = store.General.isInternet;
  let user = store.User.user;
  let goto = store.General.goto;
  let loc = store.User.location;
  let cart = store.User.cart;
  let totalItems = cart.data.length > 0 ? cart.totalitems : 0;
  let tagLine = '';

  useEffect(() => {
    if (goto == 'profile') {
      props.navigation.navigate('MyProfile');
    }
  }, []);

  const goBack = () => {
    props.navigation.goBack();
  };

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

  const renderHeader = () => {
    const render1 = () => {
      const onClick = () => {
        goBack();
      };
      return (
        <TouchableOpacity activeOpacity={0.4} onPress={onClick}>
          <utils.vectorIcon.Ionicons
            name="ios-chevron-back"
            color={theme.color.backgroundGreenText}
            size={24}
          />
        </TouchableOpacity>
      );
    };

    const render2 = () => {
      return (
        <View style={{width: '75%'}}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.headerTitle}>
            {headerTitle}
          </Text>
        </View>
      );
    };

    const render3 = () => {
      const onClick = () => {};
      return (
        <View style={{width: 22}} />
        // <TouchableOpacity disabled activeOpacity={0.4}>
        //   <utils.vectorIcon.SimpleLineIcons
        //     name="bell"
        //     color={theme.color.backgroundGreenText}
        //     size={22}
        //   />
        //   <View
        //     style={{
        //       width: 8,
        //       height: 8,
        //       borderRadius: 8 / 2,
        //       position: 'absolute',
        //       right: 0,
        //       top: 2,
        //       backgroundColor: theme.color.ntfctnClr,
        //     }}></View>
        // </TouchableOpacity>
      );
    };

    return (
      <View style={styles.headerConatainer}>
        {render1()}
        {render2()}
        {render3()}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* {tagLine != '' && <utils.TagLine tagLine={tagLine} />} */}
      {renderHeader()}
      {!internet && <utils.InternetMessage />}
      <ScrollView contentContainerStyle={{padding: 20}}>
        {/* {renderMain()} */}
      </ScrollView>

      {renderStatusBar()}
      <Toast ref={toast} position="bottom" />
      {/* <utils.Loader2 load={Loader} /> */}
    </SafeAreaView>
  );
}
