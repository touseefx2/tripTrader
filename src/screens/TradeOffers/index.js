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
  Modal as MModal,
  Pressable,
} from 'react-native';

import {styles} from './styles';
import {observer} from 'mobx-react';
import store from '../../store/index';
import utils from '../../utils/index';
import theme from '../../theme';

import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-easy-toast';

import RBSheet from 'react-native-raw-bottom-sheet';
import {ActivityIndicator} from 'react-native-paper';

import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';
import {Image as ImageCompressor} from 'react-native-compressor';

import {TabView, SceneMap} from 'react-native-tab-view';
import Received from './Received';
import Sent from './Sent';

export default observer(TradeOffers);

function TradeOffers(props) {
  const toast = useRef(null);
  const toastduration = 700;
  let headerTitle = 'Trade Offers';
  let guestIcon = require('../../assets/images/drawer/guest/img.png');

  let internet = store.General.isInternet;
  let user = store.User.user;
  let loader = store.User.regLoader;

  let cart = store.User.cart;

  const [errorMessage, seterrorMessage] = useState('');

  const [isTabBarShow, setisTabBarShow] = useState(false);

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'sent', title: 'Sent'},
    {key: 'received', title: 'Received'},
  ]);
  const renderScene = SceneMap({
    sent: Sent,
    received: Received,
  });

  useEffect(() => {
    if (user == 'guest') {
      store.General.setgoto('guestaccess');
      store.User.Logout();
      return;
    }
  }, []);

  useEffect(() => {
    store.User.setOfferProfileProps(props);
    if (user && user !== 'guest') {
      setTimeout(() => {
        setisTabBarShow(true);
      }, 100);
    }
  }, []);

  const setErrMessage = c => {
    seterrorMessage(c);
  };

  const setPhoto = c => {
    setcphoto(c);
  };

  const renderTabBar = () => {
    return (
      <>
        <View
          style={{
            paddingHorizontal: 15,
            flex: 1,
            marginTop: 10,
          }}>
          <TabView
            navigationState={{index, routes}}
            renderScene={renderScene}
            onIndexChange={setIndex}
          />
        </View>

        <utils.Footer
          nav={props.navigation}
          screen={headerTitle}
          focusScreen={store.General.focusScreen}
        />
      </>
    );
  };

  return (
    <View style={styles.container}>
      {/* {tagLine != '' && <utils.TagLine tagLine={tagLine} />} */}
      <utils.DrawerHeader props={props} headerTitle={headerTitle} />
      {!internet && <utils.InternetMessage />}
      <SafeAreaView style={styles.container2}>
        <View style={styles.container3}>
          <View style={{flex: 1}}>{isTabBarShow && renderTabBar()}</View>
          <Toast ref={toast} position="bottom" />
          {/* <utils.Loader2 load={Loader} /> */}

          {!isTabBarShow && (
            <utils.Footer
              nav={props.navigation}
              screen={headerTitle}
              focusScreen={store.General.focusScreen}
            />
          )}
          {store.Notifications.isShowNotifcation && <utils.ShowNotifications />}
        </View>
      </SafeAreaView>
    </View>
  );
}
