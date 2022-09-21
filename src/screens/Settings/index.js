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

export default observer(Settings);

function Settings(props) {
  const toast = useRef(null);
  const toastduration = 700;
  let headerTitle = 'Settings';

  let internet = store.General.isInternet;
  let user = store.User.user;

  let phn = '';
  if (user != 'guest' && user) {
    phn = user.phone;
  }
  const [phone, setPhone] = useState(phn);
  const [cntry, setcntry] = useState('');
  const [pwc, setpwc] = useState('');
  useEffect(() => {
    if (phone != '') {
      setTimeout(() => {
        let Countries = utils.Countries;
        for (let index = 0; index < Countries.length; index++) {
          const e = Countries[index];
          let result = phone.includes(e.dialCode);
          if (result) {
            setcntry(e.code);
            setpwc(phone.slice(e.dialCode.length));
            break;
          }
        }
      }, 1000);
    } else {
      setpwc('');
    }
  }, [phone]);
  useEffect(() => {
    store.User.setphn(phone);
    store.User.setcntr(cntry);
    store.User.setpwc(pwc);
  }, [phone, cntry, pwc]);

  useEffect(() => {
    if (user && user !== 'guest') {
      setPhone(user.phone);
    }
  }, [user]);

  const onClick = c => {};

  const renderMain = () => {
    let ao = 0.8;

    let editprofileIcon = require('../../assets/images/settings/editprofile/img.png');
    let cpIcon = require('../../assets/images/settings/cp/img.png');
    let notificationsIcon = require('../../assets/images/settings/notifications/img.png');
    let contactusIcon = require('../../assets/images/settings/contactus/img.png');
    let newsIcon = require('../../assets/images/settings/news/img.png');
    let privacyIcon = require('../../assets/images/settings/privacy/img.png');
    let logoutIcon = require('../../assets/images/settings/logout/img.png');

    const renderEditProfile = () => {
      let title = 'edit profile';
      return (
        <TouchableOpacity
          activeOpacity={ao}
          onPress={() => {
            onClick(title);
          }}
          style={styles.mainContainer}>
          <View style={styles.sec1Container}>
            <View style={styles.iconConatiner}>
              <Image source={editprofileIcon} style={styles.icon} />
            </View>
          </View>

          <View style={styles.sec2Container}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.sec2Title}>
              {title}
            </Text>
          </View>
        </TouchableOpacity>
      );
    };

    const rendercp = () => {
      let title = 'change password';
      return (
        <TouchableOpacity
          activeOpacity={ao}
          onPress={() => {
            onClick(title);
          }}
          style={styles.mainContainer}>
          <View style={styles.sec1Container}>
            <View style={styles.iconConatiner}>
              <Image source={cpIcon} style={styles.icon} />
            </View>
          </View>

          <View style={styles.sec2Container}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.sec2Title}>
              {title}
            </Text>
          </View>
        </TouchableOpacity>
      );
    };

    return (
      <>
        {renderEditProfile()}
        {rendercp()}
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
          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: 15,
              paddingVertical: 20,
            }}>
            {renderMain()}
          </ScrollView>
          {/* <utils.Loader2 load={Loader} /> */}
        </View>
        <utils.Footer
          nav={props.navigation}
          screen={headerTitle}
          focusScreen={store.General.focusScreen}
        />
      </SafeAreaView>

      <Toast ref={toast} position="bottom" />
    </View>
  );
}
