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
  TextInput,
  StatusBar,
} from 'react-native';
import styles from './styles';
import {inject, observer} from 'mobx-react';
import store from '../../store/index';
import utils from '../../utils/index';
import theme from '../../theme';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-easy-toast';
import MapView, {PROVIDER_GOOGLE, Marker, Polygon} from 'react-native-maps';
import {isPointInPolygon} from 'geolib';

export default observer(OrderLocation);

function OrderLocation(props) {
  const toast = useRef(null);
  const toastduration = 700;

  let mapRef = useRef(null);
  const window = Dimensions.get('window');
  const {width, height} = window;
  const LATITUDE_DELTA = 0.0922;
  const LONGITUDE_DELTA = LATITUDE_DELTA + width / height;
  let cl = store.User.cl;
  let internet = store.General.isInternet;

  let citydata = props.route.params.city;
  let areadata = props.route.params.area;
  let l = props.route.params.l;
  let loc = props.route.params.loc;

  let point = {
    latitude: l?.latitude || loc.coords.lat,
    longitude: l?.longitude || loc.coords.long,
    latitudeDelta: LATITUDE_DELTA * Number(30 / 1000),
    longitudeDelta: LONGITUDE_DELTA * Number(30 / 1000),
  };

  const setloc = c => {
    props.route.params.setloc(c);
  };
  const setaddress = c => {
    props.route.params.setaddress(c);
  };

  const [issetRegion, setissetRegion] = useState(false);
  const [isNoarea, setisNoarea] = useState(false); //rate captain sheet

  const [isMapReady, setIsMapReady] = useState(false); //is map is ready check

  const [polygons, setpolygons] = useState([]);

  const [adress, setadress] = useState(props.route.params.address || '');
  const [coords, setcoords] = useState(point);

  useEffect(() => {
    if (isMapReady) {
      gotoLoc();
    }
  }, [isMapReady]);

  useEffect(() => {
    let p = store.User.polygons;

    let arr = [];
    if (p.length > 0) {
      p.map((e, i, a) => {
        if (e.area._id == areadata._id) {
          const obj = {...e};

          const latlngs = [];
          if (e.latlngs.length > 0) {
            e.latlngs.map((e, i, a) => {
              latlngs.push(e);
            });
          }
          delete obj.latlngs;
          obj.latlngs = latlngs;
          arr.push(obj);
        }
      });
    }

    setpolygons(arr);
  }, [store.User.polygons]);

  const closeMap = () => {
    props.navigation.goBack();
  };

  const googleSearch = () => {};

  const gotoCurrentLoc = () => {
    mapRef?.current?.animateToRegion(
      {
        latitude: cl.coords.latitude,
        longitude: cl.coords.longitude,
        latitudeDelta: LATITUDE_DELTA * Number(30 / 1000),
        longitudeDelta: LONGITUDE_DELTA * Number(30 / 1000),
      },
      1200,
    );
    // setTimeout(() => {
    //   setissetRegion(true);
    // }, 1500);
  };

  const gotoLoc = p => {
    mapRef?.current?.animateToRegion(coords, 1200);
    setTimeout(() => {
      setissetRegion(true);
    }, 1500);
  };

  const ISPointInPolygon = point => {
    if (polygons.length > 0) {
      for (let index = 0; index < polygons.length; index++) {
        const e = polygons[index];
        let p = e.latlngs.length;

        if (p > 0) {
          const c = isPointInPolygon(point, e.latlngs);
          console.log('is region in polygons : ', c);
          if (c) {
            setisNoarea(false);
            setcoords(point);
            break;
          }
          setisNoarea(true);
        }
      }
    }
  };

  const confirmLocation = () => {
    Keyboard.dismiss();
    if (adress == '') {
      Alert.alert('', 'Please enter your complete street address');
      // toast?.current?.show('Please enter your street address', 500);
      return;
    }

    let branchName = 'branch name';
    let obj = {
      latitude: coords.latitude,
      longitude: coords.longitude,
      address: areadata.name + ', ' + citydata.name,
    };

    // console.log('obj : ', obj);

    setloc(obj);
    setaddress(adress);

    props.navigation.goBack();
  };

  const rendercross = () => {
    return (
      <TouchableOpacity style={styles.crossButton} onPress={closeMap}>
        <utils.vectorIcon.Ionicons
          name="chevron-back"
          color={theme.color.button1}
          size={26}
        />
      </TouchableOpacity>
    );
  };

  const renderGoogleSearch = () => {
    return (
      <TouchableOpacity style={styles.googleSearchBar} onPress={googleSearch}>
        <utils.vectorIcon.FontAwesome5
          name="search-location"
          color="#0E47A1"
          size={20}
        />
        <Text style={styles.googleSearchBarText}>Search By Google</Text>
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
          size={27}
        />
      </TouchableOpacity>
    );
  };

  const renderHeader = () => {
    return (
      <View style={styles.headerPosition}>
        {rendercross()}
        <View style={{marginTop: 10}}>
          <Text
            style={{
              fontSize: 12,
              color: theme.color.title,
              fontFamily: theme.fonts.fontMedium,
              marginBottom: 5,
            }}>
            ADDRESS
          </Text>

          <TextInput
            style={{
              backgroundColor: theme.color.background,
              fontSize: 11,
              fontFamily: theme.fonts.fontNormal,
              borderWidth: 0.6,
              borderColor: theme.color.subTitle,
              height: 40,
              borderRadius: 5,
              paddingHorizontal: 10,
              marginBottom: 10,
            }}
            placeholderTextColor={theme.color.subTitle}
            placeholder="Enter your complete street address"
            value={adress}
            onChangeText={val => {
              setadress(val);
            }}
          />

          <Text
            style={{
              fontSize: 12,
              color: theme.color.title,
              fontFamily: theme.fonts.fontMedium,
              marginBottom: 5,
            }}>
            REGION
          </Text>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 10,
            }}>
            <View style={{width: '85%'}}>
              <Text
                style={{
                  fontSize: 13,
                  color: theme.color.button1,
                  fontFamily: theme.fonts.fontBold,
                }}>
                {areadata.name + ', ' + citydata.name}
              </Text>
            </View>
            <TouchableOpacity
              disabled={!isNoarea}
              activeOpacity={0.5}
              onPress={() => {
                gotoLoc();
              }}
              style={{
                width: '10%',

                alignItems: 'flex-end',
              }}>
              {isNoarea && (
                <Image
                  source={require('../../assets/images/navigate/img.png')}
                  style={{width: 22, height: 22, opacity: 0.9}}
                />
              )}
            </TouchableOpacity>
          </View>

          <Text
            style={{
              fontSize: 10,
              color: theme.color.subTitleLight,
              fontFamily: theme.fonts.fontBold,
              marginTop: 5,
              marginBottom: 10,
              letterSpacing: -0.2,
              paddingHorizontal: 10,
            }}>
            To change your area, please do it from the main menu screen.
          </Text>
        </View>
      </View>
    );
  };

  const renderFooter = () => {
    let txt = !isNoarea
      ? 'Save Address'
      : 'Oops! This location is outside of our service area';
    return (
      <TouchableOpacity
        style={styles.BottomView}
        onPress={confirmLocation}
        disabled={isNoarea}
        activeOpacity={0.8}>
        <Text
          numberOfLines={2}
          ellipsizeMode="tail"
          style={!isNoarea ? styles.section2Text : styles.section2DisbaleText}>
          {txt}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderCurrentPositionMarker = () => {
    return (
      <Marker
        identifier="current location"
        coordinate={cl.coords}
        pinColor={theme.color.button1}>
        <utils.vectorIcon.Ionicons
          name="md-navigate-circle"
          color={theme.color.button1}
          size={22}
        />
      </Marker>
    );
  };

  const rednerDot = () => {
    return (
      <View style={styles.dotPosition}>
        {!internet && (
          <View style={styles.dotWarningMessage}>
            <Text style={styles.dotWarningMessageText}>
              No internet connection !
            </Text>
          </View>
        )}

        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}>
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
      const point = {latitude: e.latitude, longitude: e.longitude};
      ISPointInPolygon(point);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* <StatusBar
        translucent={false}
        backgroundColor={theme.color.background}
        barStyle={'dark-content'}
      /> */}
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
        {polygons.length > 0 &&
          polygons.map(polygon => (
            <Polygon
              key={polygon._id}
              coordinates={polygon.latlngs}
              fillColor="rgba(0,0,0,0.1)"
              strokeColor="silver"
            />
          ))}
        {cl && renderCurrentPositionMarker()}
      </MapView>
      {renderHeader()}
      {renderCurrentLocationIndactor()}
      {renderFooter()}
      {coords && rednerDot()}
      <Toast ref={toast} position="center" opacity={0.8} />
    </SafeAreaView>
  );
}
