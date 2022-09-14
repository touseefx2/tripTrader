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
  Dimensions,
  StatusBar,
  Linking,
  PermissionsAndroid,
} from 'react-native';
import styles from './styles';
import {observer} from 'mobx-react';
import store from '../../store/index';
import utils from '../../utils/index';
import theme from '../../theme';
import Toast from 'react-native-easy-toast';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from '@timwangdev/react-native-geocoder';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';

export default observer(Map);

function Map(props) {
  navigator.geolocation = require('react-native-geolocation-service');
  let mapRef = useRef(null);
  const gapikey = 'AIzaSyC75RWT0q9xkASq2YhX2vGi1R-e_p2pnWU';
  const window = Dimensions.get('window');
  const {width, height} = window;
  const LATITUDE_DELTA = 0.0922;
  const LONGITUDE_DELTA = LATITUDE_DELTA + width / height;
  const refGp = useRef();
  let internet = store.General.isInternet;
  let isLoc = store.General.isLocation;

  let screen = props.route.params.screen || '';

  const toast = useRef(null);
  const toastduration = 500;

  const [issetRegion, setissetRegion] = useState(false);

  const [isMapReady, setIsMapReady] = useState(false); //is map is ready check

  const [cl, setcl] = useState(false);
  const [loc, setloc] = useState(store.User.location || false);
  const [isFirstCal, setisFirstCal] = useState(false);

  const [hideList, sethideList] = useState('auto');
  const [search, setsearch] = useState('');

  const [loader, setloader] = useState(false);

  useEffect(() => {
    if (isLoc) {
      getCurrentLocation();
    }
  }, [isLoc]);

  useEffect(() => {
    if (loc) {
      refGp?.current?.setAddressText(loc.adrs);
      setsearch(loc.adrs);
    }
  }, [loc]);

  useEffect(() => {
    if (isMapReady && cl && !loc) {
      gotoCurrentLoc();
    }
  }, [isMapReady, cl, loc]);

  useEffect(() => {
    if (isMapReady && loc && !isFirstCal) {
      gotoLoc(loc.coords.latitude, loc.coords.longitude);
      setisFirstCal(true);
    }
  }, [isMapReady, loc, isFirstCal]);

  const googleSearch = (data, details = null) => {
    // 'details' is provided when fetchDetails = true
    let l = details.geometry.location;
    let t = data.description || '';
    let add = details.formatted_address;
    var value = add.split(',');
    let count = value.length;
    let country = value[count - 1];
    let state = value[count - 2];
    let city = value[count - 3];
    const cl = {
      latitude: l.lat,
      longitude: l.lng,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    };
    const loc = {
      state: state,
      city_name: city,
      country_name: country,
      adrs: t,
      coords: cl,
    };

    setloc(loc);
    gotoLoc(loc.coords.latitude, loc.coords.longitude);
  };

  const renderGooglePlacesInput = () => {
    return (
      <GooglePlacesAutocomplete
        ref={refGp}
        // currentLocation={true}
        // currentLocationLabel="Current location"
        enablePoweredByContainer={false}
        listViewDisplayed={hideList}
        textInputProps={{
          onFocus: () => sethideList(false),
          onBlur: () => sethideList(true),
          onChangeText: d => setsearch(d),
        }}
        nearbyPlacesAPI={'GoogleReverseGeocoding'}
        placeholder="Set delivery address"
        onPress={googleSearch}
        query={{
          key: 'AIzaSyC75RWT0q9xkASq2YhX2vGi1R-e_p2pnWU',
          language: 'en',
          components: 'country:pk',
        }}
        returnKeyType={'default'}
        fetchDetails={true}
        styles={{
          container: {},
          textInputContainer: {
            width: '100%',
            height: 37,
            borderRadius: 6,
            paddingRight: 55,
            backgroundColor: '#E8E8E899',
          },
          textInput: {
            height: 37,
            color: theme.color.subTitleLight,
            fontSize: 13,
            fontFamily: theme.fonts.fontNormal,
            backgroundColor: '#E8E8E899',
            borderRadius: 6,
          },
          row: {
            backgroundColor: theme.color.background,
          },
        }}
      />
    );
  };

  const gotoCurrentLoc = () => {
    Keyboard.dismiss();
    if (cl?.coords) {
      setissetRegion(true);
      refGp?.current?.blur();
      mapRef?.current?.animateToRegion(
        {
          latitude: cl.coords.latitude,
          longitude: cl.coords.longitude,
          latitudeDelta: LATITUDE_DELTA * Number(30 / 1000),
          longitudeDelta: LONGITUDE_DELTA * Number(30 / 1000),
        },
        1200,
      );
    } else {
      if (!isLoc) {
        requestPermissions();
      } else {
        getCurrentLocation();
      }
    }
  };

  const gotoLoc = (lat, lng) => {
    setissetRegion(false);
    mapRef?.current?.animateToRegion(
      {
        latitude: lat,
        longitude: lng,
        latitudeDelta: LATITUDE_DELTA * Number(30 / 1000),
        longitudeDelta: LONGITUDE_DELTA * Number(30 / 1000),
      },
      1200,
    );
    setTimeout(() => {
      setissetRegion(true);
    }, 1500);
  };

  async function requestPermissions() {
    const androidLocationEnablerDialog = () => {
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

    const hasPermissionIOS = async () => {
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

    const hasPermissionAndroid = async () => {
      let g = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      console.log('permission result : ', g);

      if (g === PermissionsAndroid.RESULTS.GRANTED) {
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

  const getCurrentLocation = () => {
    setloader(true);
    Geolocation.getCurrentPosition(
      async position => {
        console.log('get c loc one res true');

        const cl = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        };

        const locc = {
          city_name: '',
          country_name: '',
          adrs: '',
          state: '',
          coords: cl,
        };

        setcl(locc);
        setloader(false);

        if (!loc) {
          getCountryCityName(locc.coords, '');
        }
      },
      error => {
        setloader(false);
        if (error.code == 3) {
          if (!cl) {
            getCurrentLocation();
          }
        }

        if (error.code == 1) {
          // Location permission not granted
          toast?.current?.show('Please turn on location first', toastduration);
          // requestPermissions();
        }

        console.log('get crnt loc one error : ', error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 10000,
      },
    );
  };

  const getCountryCityName = async (c, chk) => {
    try {
      setloader(true);
      const position = {lat: c.latitude, lng: c.longitude};
      const option = {apiKey: gapikey};
      const res = await Geocoder.geocodePosition(position, option);
      setloader(false);
      if (res[0]) {
        let d = res[0];
        console.log('geocoder get name adress : ', d);
        const loc = {
          city_name: d.locality,
          state: d.adminArea,
          country_name: d.country,
          adrs: d.formattedAddress,
          coords: c,
        };
        setloc(loc);
        if (chk == '') {
          gotoLoc(loc.coords.latitude, loc.coords.longitude);
        }
      }
    } catch (err) {
      setloader(false);
      console.log('geocoder get name adress error : ', err);
    }
  };

  const confirmLocation = () => {
    if (!internet) {
      toast?.current?.show('Please connect internet', toastduration);
      return;
    }

    if (!isLoc) {
      toast?.current?.show('Please turn on location first', toastduration);
      return;
    }

    store.User.setLocation(loc);
    if (screen == 'home') {
      props.route.params.setloader(true);
    }
    closeMap();
  };

  const closeMap = () => {
    props.navigation.goBack();
  };

  const rendercross = () => {
    return (
      <TouchableOpacity style={styles.crossButton} onPress={closeMap}>
        <utils.vectorIcon.Ionicons
          name="arrow-back-sharp"
          color={theme.color.button1}
          size={27}
        />
      </TouchableOpacity>
    );
  };

  const renderCurrentLocationIndactor = () => {
    return (
      <TouchableOpacity
        style={styles.currentLocationButton}
        onPress={gotoCurrentLoc}>
        <utils.vectorIcon.MaterialIcons
          name="my-location"
          color={theme.color.button1}
          size={20}
        />
      </TouchableOpacity>
    );
  };

  const renderClear = () => {
    return (
      <TouchableOpacity
        style={styles.clearButton}
        onPress={() => {
          refGp?.current?.clear();
          refGp?.current?.blur();
          refGp?.current?.setAddressText('');
          setsearch('');
        }}>
        <View style={styles.clearButton2}>
          <utils.vectorIcon.Entypo
            name="cross"
            color={theme.color.subTitleLight}
            size={15}
          />
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => {
    return (
      <View style={styles.headerPosition}>
        {rendercross()}
        <View
          style={{
            width: '90%',
            backgroundColor: '#E8E8E899',
            borderRadius: 6,
          }}>
          {renderGooglePlacesInput()}
          {search != '' && renderClear()}
          {renderCurrentLocationIndactor()}
        </View>
      </View>
    );
  };

  const renderConfirmButton = () => {
    let text = loader ? 'Loading... ' : 'Confirm';

    return (
      <>
        <TouchableOpacity
          disabled={loader}
          activeOpacity={0.6}
          onPress={confirmLocation}
          style={[
            styles.BottomButton,
            {
              backgroundColor: loader
                ? theme.color.disableField
                : theme.color.button1,
            },
          ]}>
          <Text
            style={[
              styles.buttonTextBottom,
              {
                color: loader
                  ? theme.color.disableTextColor
                  : theme.color.buttonText,
              },
            ]}>
            {text}
          </Text>
        </TouchableOpacity>
      </>
    );
  };

  const renderCurrentPositionMarker = () => {
    return (
      <Marker
        identifier="current location"
        coordinate={cl.coords}
        pinColor={'blue'}>
        <utils.vectorIcon.Ionicons
          name="md-navigate-circle"
          color={'blue'}
          size={22}
        />
      </Marker>
    );
  };

  const rednerDot = () => {
    let warnText =
      !internet && isLoc
        ? 'No internet connection !'
        : internet && !isLoc
        ? 'Please turn on loction'
        : 'No internet connection !';
    return (
      <View style={styles.dotPosition}>
        {(!internet || !isLoc) && (
          <View style={styles.dotWarningMessage}>
            <Text style={styles.dotWarningMessageText}>{warnText}</Text>
          </View>
        )}

        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {loc?.coords && internet && isLoc && (
            <View
              style={{
                position: 'absolute',
                opacity: 0.8,
                bottom: 5,
                width: 24,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <utils.vectorIcon.MaterialIcons
                name="location-pin"
                color={'red'}
                size={25}
              />
            </View>
          )}
          <View
            style={{
              width: 6,
              height: 6,
              borderRadius: 6,
              backgroundColor: 'black',
            }}
          />
        </View>
      </View>
    );
  };

  const RegionChangeComplete = e => {
    if (issetRegion) {
      console.log('on region change cal');
      const point = {
        latitude: e.latitude,
        longitude: e.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      };
      getCountryCityName(point, 'nill');
    }
  };

  console.log('loader : ', loader);
  console.log('loc : ', loc);
  console.log('cl : ', cl);

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
    <SafeAreaView style={styles.container}>
      {renderStatusBar()}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        ref={mapRef}
        initialRegion={{
          latitude: 33.64186666892545,
          longitude: 73.03620575372447,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
        showsBuildings={true}
        zoomEnabled={true}
        showsCompass={false}
        onMapReady={() => {
          setIsMapReady(true);
        }}
        onRegionChangeComplete={e => {
          RegionChangeComplete(e);
        }}>
        {cl?.coords && renderCurrentPositionMarker()}
      </MapView>
      {rednerDot()}
      {renderHeader()}
      {loc?.coords && renderConfirmButton()}
      <Toast ref={toast} position="center" />
    </SafeAreaView>
  );
}
