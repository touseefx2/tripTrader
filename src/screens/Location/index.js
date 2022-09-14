import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  Keyboard,
  Linking,
  Platform,
  Dimensions,
  PermissionsAndroid,
  StatusBar,
} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {styles} from './styles';
import {observer} from 'mobx-react';
import store from '../../store/index';
import utils from '../../utils/index';
import theme from '../../theme';
import Toast from 'react-native-easy-toast';
import Geolocation from 'react-native-geolocation-service';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import Geocoder from 'react-native-geocoding';
import NetInfo from '@react-native-community/netinfo';

export default observer(Location);

function Location(props) {
  const window = Dimensions.get('window');
  const {width, height} = window;
  const LATITUDE_DELTA = 0.0922;
  const LONGITUDE_DELTA = LATITUDE_DELTA + width / height;
  let loc = store.User.location;

  const toast = useRef(null);
  const toastduration = 500;

  const [loader, setloader] = useState(false); //for drop down relted to city

  let internet = store.General.isInternet;
  let isLocation = store.General.isLocation;

  useEffect(() => {
    if (Platform.OS == 'ios') {
      store.General.setLocation(false);
    }
  }, []);

  // const setLoader = c => {
  //   setloader(c);
  // };

  useEffect(() => {
    if (loc) {
      // store.Resturants.getData(loc, c => setLoader(c));
      setloader(true);
      setTimeout(() => {
        setloader(false);
        store.Resturants.setisLocOnce(true);
      }, 2500);
    }
  }, [loc]);

  const gotoMap = () => {
    // if (!internet) {
    //   toast?.current?.show('Please connect internet.', 600);
    //   return;
    // }

    if (isLocation) {
      props.navigation.navigate('Map', {screen: 'location'});
    } else {
      requestPermissions();
    }
  };

  async function requestPermissions() {
    const androidLocationEnablerDialog = c => {
      RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
        interval: 10000,
        fastInterval: 5000,
      })
        .then(data => {
          store.General.setLocation(true);
        })
        .catch(err => {
          toast?.current?.show('Please turn on location');
          console.log('location enabler popup error : ', err);
        });
    };

    const hasPermissionIOS = async c => {
      const status = await Geolocation.requestAuthorization('whenInUse');

      console.log('In request iOS permissions : ', status);
      if (status === 'granted') {
        store.General.setLocation(true);

        return true;
      }

      store.General.setLocation(false);
      if (status === 'denied') {
        Alert.alert('Location permission denied');
      }

      if (status === 'disabled') {
        Alert.alert(
          `Turn on Location Services to allow Karblock to determine your location.`,
          '',
          [
            {
              text: 'Go to Settings',
              onPress: () => {
                openSetting();
              },
            },
            {text: "Don't Use Location", onPress: () => {}},
          ],
        );
      }
      const openSetting = () => {
        Linking.openSettings().catch(() => {
          Alert.alert('Unable to open settings');
        });
      };

      return false;
    };

    const hasPermissionAndroid = async c => {
      let g = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      console.log('permission result : ', g);

      if (g === PermissionsAndroid.RESULTS.GRANTED) {
        store.General.setGLocation(true);
        androidLocationEnablerDialog();
        return;
      }

      store.General.setLocation(false);
      let msg = 'permisiion location';
      if (g === 'denied') {
        msg = 'Please allow permision to use location';
        toast?.current?.show(
          'Please allow permisiion to turn on location',
          1000,
        );
      }

      if (g === 'never_ask_again') {
        msg =
          'Please allow permision to use location in  app setting in device allow location permission to continue';
        Alert.alert(``, msg, [
          {
            text: 'Go to Settings',
            onPress: () => {
              openSetting();
            },
          },
          {text: "Don't Use Location", onPress: () => {}},
        ]);
      }

      const openSetting = () => {
        Linking.openSettings().catch(() => {
          Alert.alert('Unable to open settings');
        });
      };

      return;
    };

    if (Platform.OS === 'ios') {
      console.log('Requesting iOS Permissions');
      hasPermissionIOS();
      return;
    }
    if (Platform.OS === 'android') {
      console.log('Requesting Android Permissions');
      hasPermissionAndroid();
    }
  }

  const onRefresh = () => {
    console.log('onrefresh cal');
    store.User.getAllData(store.User.user ? 'user' : '');
  };

  const cross = () => {
    props.navigation.goBack();
  };

  const confirm = () => {
    // if (city.length == 0) {
    //   toast?.current?.show('Please select city', toastduration);
    //   return;
    // }
    // if (area.length == 0) {
    //   toast?.current?.show('Please select area', toastduration);
    //   return;
    // }
    // if (loc) {
    //   NetInfo.fetch().then(state => {
    //     if (state.isConnected) {
    //       store.User.setLocation(loc);
    //       if (screen == 'home') {
    //         props.route.params.setisReferesh(true);
    //         props.navigation.goBack();
    //         store.User.setcart({totalbill: 0, totalitems: 0, data: []});
    //       }
    //     } else {
    //       toast?.current?.show('Please connect internet', toastduration);
    //     }
    //   });
    //   return;
    // }
  };

  const locationAccessCheck = () => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        requestPermissions();
      } else {
        toast?.current?.show('Please connect internet', toastduration);
      }
    });
  };

  const renderLocationAccessButton = () => {
    return (
      <>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={locationAccessCheck}
          style={styles.BottomButton}>
          <Text style={styles.buttonTextBottom}>Allow Location Access</Text>
        </TouchableOpacity>
      </>
    );
  };

  const renderLocateButton = () => {
    return (
      <>
        <TouchableOpacity
          disabled={!isLocation ? true : false}
          activeOpacity={0.6}
          onPress={gotoMap}
          style={[
            styles.BottomButton2,
            {
              backgroundColor: !isLocation
                ? theme.color.disableBack
                : theme.color.background,
              borderWidth: !isLocation ? 0 : 0.6,
            },
          ]}>
          <Text
            style={[
              styles.buttonTextBottom2,
              {
                color: !isLocation
                  ? theme.color.subTitleLight
                  : theme.color.button1,
                fontFamily: !isLocation
                  ? theme.fonts.fontNormal
                  : theme.fonts.fontMedium,
              },
            ]}>
            Enter my location
          </Text>
        </TouchableOpacity>
      </>
    );
  };

  const renderStatusBar = () => {
    return (
      <>
        <StatusBar
          translucent={false}
          backgroundColor={theme.color.background}
          barStyle={'dark-content'}
        />
      </>
    );
  };

  return (
    <SafeAreaProvider style={styles.container}>
      {renderStatusBar()}
      <utils.ServerRes load={store.General.isServerError} />
      <utils.Loader2 load={loader} />
      {/* {!internet && <utils.InternetMessage />} */}

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.scrollContainer}>
        <View style={styles.section1}>
          <Image
            style={styles.logo}
            source={require('../../assets/images/logo/img.png')}
          />
        </View>

        <View style={styles.section2}>
          <Text style={styles.title1}>Find restaurants near you!</Text>
          <Text style={styles.title2}>
            By allowing location access, you can search for restaurant near you
            and receive more accurate delivery.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.section3}>
        {!isLocation && renderLocationAccessButton()}
        {renderLocateButton()}
      </View>
      <Toast ref={toast} position="center" />
    </SafeAreaProvider>
  );
}
