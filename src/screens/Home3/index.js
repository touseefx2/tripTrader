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
import Geolocation from 'react-native-geolocation-service';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import Geocoder from 'react-native-geocoding';
import {styles} from './styles';
import {observer} from 'mobx-react';
import store from '../../store/index';
import utils from '../../utils/index';
import theme from '../../theme';
import DynamicTabView from 'react-native-dynamic-tab-view';
import ImageSlider from 'react-native-image-slider';
import FastImage from 'react-native-fast-image';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-easy-toast';
import MaskedView from '@react-native-community/masked-view';
import Svg, {Path} from 'react-native-svg';
import RBSheet from 'react-native-raw-bottom-sheet';

export default observer(Home3);
function Home3(props) {
  const rbSheet = useRef(null);
  const toast = useRef(null);
  const window = Dimensions.get('window');
  const {width, height} = window;
  const LATITUDE_DELTA = 0.0922;
  const LONGITUDE_DELTA = LATITUDE_DELTA + width / height;

  const windowWidth = theme.window.Width;
  const imageAspectWidth = 375;
  const imageAspectHeight = 332;
  const curveAdjustment = 10;
  const maskHeight = responsiveHeight(28);
  const scaleFactor = imageAspectWidth / imageAspectHeight;
  const scaledHeight = scaleFactor * maskHeight;
  const controlPointX = windowWidth / 2.0;
  const controlPointY = scaledHeight + curveAdjustment;
  const curveCenterPointY = (controlPointY - maskHeight) / 2;

  let screen = props.route.params.screen || '';
  let d = props.route.params.data || [];
  let cart = store.User.cart;
  let img = d.slider_images || [];

  let internet = store.General.isInternet;
  let tagLine = d.tagline || '';
  let foodCategory = d.food_menu || [];

  let resturant = {...d};
  delete resturant.food_menu;

  let distance = d.total_distance || 0;
  let rs = d.price || '';
  let deliverTime = d.estimatedDeliveryTime || '';
  let averageRating = d.rating.average_rating || 0;
  let totalReviews = d.rating.total_reviews || 0;

  const renderTab = e => {
    let d = e;

    if (d.name != 'empty') {
      return (
        <utils.FoodCard
          resturant={resturant}
          data={d}
          nav={props.navigation}
          call="home"
          toast={toast}
          screen=""
        />
      );
    } else {
      return (
        <View style={styles.emptySECTION}>
          <Image
            style={styles.emptyImg}
            source={require('../../assets/images/empty/img.png')}
          />
          <Text style={styles.emptyText}>Sorry!</Text>
          <Text style={[styles.emptyText, {marginTop: -5}]}>
            Currently no items are available here
          </Text>
        </View>
      );
    }
  };

  const onChangeTab = e => {
    console.log('selected tab : ', e);
  };

  useEffect(() => {
    if (cart.data.length <= 0) {
      cart.totalbill = 0;
      cart.totalitems = 0;
    }
    if (cart.data.length > 0) {
      let tb = 0;
      let ti = 0;

      cart.data.map((e, i, a) => {
        tb = tb + parseFloat(e.bill);
        ti = ti + parseFloat(e.quantity);
      });

      cart.totalbill = tb;
      cart.totalitems = ti;
    }
  }, [cart]);

  const renderHeader = () => {
    const goBack = () => {
      props.navigation.goBack();
    };

    return (
      <View
        style={[
          styles.header,
          {
            marginTop:
              internet && tagLine == ''
                ? theme.window.STATUSBAR_HEIGHT + 10
                : 10,
          },
        ]}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={goBack}
          style={[styles.icon, {marginLeft: 0}]}>
          <utils.vectorIcon.Ionicons
            name="arrow-back-sharp"
            color={theme.color.button1}
            size={22}
          />
        </TouchableOpacity>

        <View style={styles.headerSection2} />
      </View>
    );
  };

  const renderImageSliderBox = () => {
    return (
      <>
        {Platform.OS == 'ios' && (
          <MaskedView
            style={[
              styles.mask,
              {
                height: controlPointY - curveCenterPointY,
              },
            ]}
            maskElement={
              <Svg height="100%" width="100%">
                <Path
                  d={`M0 0 L${windowWidth} 0 L${windowWidth} ${maskHeight} Q${controlPointX} ${controlPointY} 0 ${maskHeight} Z`}
                  fill={'#fff'}
                />
              </Svg>
            }>
            <ImageSlider
              autoPlayWithInterval={2000}
              images={img}
              style={{
                backgroundColor: theme.color.background,
                elevation: 5,
              }}
              customSlide={({index, item, style, width}) => (
                <TouchableOpacity
                  style={style}
                  activeOpacity={0.7}
                  disabled
                  key={index}>
                  <FastImage
                    style={{
                      flex: 1,
                      resizeMode: 'stretch',
                    }}
                    source={{
                      uri: item,
                      priority: FastImage.priority.high,
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                </TouchableOpacity>
              )}
            />
            {renderHeader()}
          </MaskedView>
        )}

        {Platform.OS == 'android' && (
          <View style={styles.imageConatiner}>
            <ImageSlider
              autoPlayWithInterval={2000}
              images={img}
              style={{
                backgroundColor: theme.color.background,
              }}
              customSlide={({index, item, style, width}) => (
                <TouchableOpacity
                  style={style}
                  activeOpacity={0.7}
                  disabled
                  key={index}>
                  <FastImage
                    style={{
                      flex: 1,
                      resizeMode: 'stretch',
                    }}
                    source={{
                      uri: item,
                      priority: FastImage.priority.high,
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                </TouchableOpacity>
              )}
            />
            {renderHeader()}
          </View>
        )}
      </>
    );
  };

  const renderTitleSection = () => {
    const renderLine = () => {
      return (
        <View
          style={{
            width: 1,
            height: '60%',
            backgroundColor: theme.color.subTitleLight,
            marginHorizontal: 12,
          }}
        />
      );
    };

    const goToResturantDetails = () => {
      const obj = {...d};
      delete d.food_menu;
      props.navigation.navigate('ResturantDetails', {
        screen: 'home3',
        data: obj,
      });
    };

    return (
      <View
        style={{
          paddingHorizontal: 12,
          marginTop: 10,
          marginBottom: 5,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View style={{width: '78%'}}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                fontSize: 18,
                fontFamily: theme.fonts.fontMedium,
                color: theme.color.title,
                // textTransform: 'capitalize',
                lineHeight: 22,
              }}>
              {d.name}
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.5}
            onPress={goToResturantDetails}
            style={{
              width: '19%',
              alignItems: 'flex-end',
            }}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                fontSize: 13,
                fontFamily: theme.fonts.fontMedium,
                color: theme.color.button1,
              }}>
              More info
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 8,
          }}>
          <Text
            style={{
              fontSize: 12,
              fontFamily: theme.fonts.fontMedium,
              color: theme.color.subTitleLight,
            }}>
            {parseFloat(distance).toFixed(1)} km
          </Text>
          {renderLine()}
          <Text
            style={{
              fontSize: 12,
              fontFamily: theme.fonts.fontMedium,
              color: theme.color.subTitleLight,
            }}>
            {rs}
          </Text>
          {renderLine()}
          <Text
            style={{
              fontSize: 12,
              fontFamily: theme.fonts.fontMedium,
              color: theme.color.subTitleLight,
            }}>
            {deliverTime} min delivery
          </Text>
          {renderLine()}
          <View style={{flexDirection: 'row'}}>
            <utils.vectorIcon.Entypo
              name="star"
              color={theme.color.rate}
              size={15}
            />
            <Text
              style={{
                fontSize: 12,
                fontFamily: theme.fonts.fontMedium,
                color: theme.color.title,
                marginLeft: 3,
              }}>
              {averageRating}
            </Text>
            <Text
              style={{
                fontSize: 11,
                fontFamily: theme.fonts.fontMedium,
                color: theme.color.subTitleLight,
                marginLeft: 3,
              }}>
              ({totalReviews <= 500 ? totalReviews : '500+'})
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderBottomSheet = () => {
    const Login = () => {
      rbSheet?.current?.close();
      props.navigation.navigate('Login', {s: ''});
    };

    const Guest = () => {
      rbSheet?.current?.close();
      props.navigation.goBack();
    };

    const renderLoginButton = () => {
      return (
        <>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
              Login();
            }}
            style={styles.BottomButton}>
            <Text style={styles.buttonTextBottom}>
              Continue with phone number
            </Text>
          </TouchableOpacity>
        </>
      );
    };

    const renderGuestButton = () => {
      return (
        <>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
              Guest();
            }}
            style={styles.BottomButton2}>
            <Text
              style={[styles.buttonTextBottom, {color: theme.color.button1}]}>
              Continue as Guest
            </Text>
          </TouchableOpacity>
        </>
      );
    };

    return (
      <>
        <RBSheet
          ref={rbSheet}
          height={responsiveHeight(35)}
          closeOnPressBack={true}
          openDuration={250}
          screen={''}
          closeOnDragDown={true}
          closeOnPressMask={true}
          KeyboardAvoidingView={true}
          customStyles={{
            wrapper: {
              flex: 1,
              // backgroundColor: 'transparent',
            },
            container: {
              backgroundColor: theme.color.background,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              elevation: 5,
            },
            draggableIcon: {
              // backgroundColor: theme.color.cartbutton,
            },
          }}>
          <StatusBar
            translucent={false}
            backgroundColor={theme.color.button1}
            barStyle={'light-content'}
          />
          <View
            style={{
              marginHorizontal: 15,
            }}>
            <Text
              style={{
                fontFamily: theme.fonts.fontBold,
                color: theme.color.title,
                fontSize: 18,
              }}>
              Sign up or log in
            </Text>

            <View style={{marginTop: 30}}>
              {renderLoginButton()}

              <Text style={styles.titleText2}>or</Text>
              {renderGuestButton()}
            </View>
          </View>
        </RBSheet>
      </>
    );
  };

  const renderStatusBar = () => {
    if (internet && tagLine == '') {
      return (
        <StatusBar
          translucent={Platform.OS == 'ios' ? false : true}
          backgroundColor={
            Platform.OS == 'ios' ? theme.color.background : 'transparent'
          }
          barStyle={Platform.OS == 'ios' ? 'dark-content' : 'light-content'}
        />
      );
    } else {
      return (
        <StatusBar
          translucent={false}
          backgroundColor={theme.color.background}
          barStyle={'dark-content'}
        />
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderStatusBar()}
      {!internet && (
        <utils.InternetMessage
          color={tagLine != '' ? 'red' : theme.color.button1}
        />
      )}
      {tagLine != '' && <utils.TagLine tagLine={tagLine} />}
      {renderBottomSheet()}
      {img.length > 0 && (
        <View>
          {renderImageSliderBox()}
          {renderTitleSection()}
        </View>
      )}

      {foodCategory.length > 0 && (
        <>
          <DynamicTabView
            data={foodCategory}
            defaultIndex={0}
            renderTab={renderTab}
            onChangeTab={onChangeTab}
            headerTextStyle={{
              fontFamily: theme.fonts.fontMedium,
            }}
            headerBackgroundColor={theme.color.background}
            headerUnderlayColor={theme.color.button1}
            containerStyle={{
              backgroundColor: theme.color.background,
              paddingBottom: cart.data.length > 0 ? responsiveHeight(10) : 0,
              overflow: 'hidden',
            }}
          />
        </>
      )}

      {foodCategory.length <= 0 && (
        <View style={styles.emptySECTION2}>
          <Image
            style={styles.emptyImg}
            source={require('../../assets/images/empty/img.png')}
          />
          <Text style={styles.emptyText}>Sorry!</Text>
          <Text style={[styles.emptyText, {marginTop: -5}]}>
            Currently no products are available here
          </Text>
        </View>
      )}

      {cart.data.length > 0 && <utils.FooterCart nav={props.navigation} />}

      <Toast ref={toast} position="bottom" />
    </SafeAreaView>
  );
}
