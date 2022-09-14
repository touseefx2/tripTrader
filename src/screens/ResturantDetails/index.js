import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  StatusBar,
  ScrollView,
  Modal,
  ActivityIndicator,
  Platform,
  Alert,
  Linking,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {styles} from './styles';
import {observer} from 'mobx-react';
import store from '../../store/index';
import utils from '../../utils/index';
import theme from '../../theme';
import FastImage from 'react-native-fast-image';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-easy-toast';
import MaskedView from '@react-native-community/masked-view';
import Svg, {Path} from 'react-native-svg';
import {responsiveHeight} from 'react-native-responsive-dimensions';
import ImageSlider from 'react-native-image-slider';

export default observer(ResturantDetails);
function ResturantDetails(props) {
  const rbSheet = useRef(null);
  const scrollRef = useRef(null);
  const scroll2Ref = useRef(null);
  let maxItem = 5;

  const [num, setNum] = useState(1);

  const [isScrollDisable, setisScrollDisable] = useState(false);

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

  const toast = useRef(null);
  const toastduration = 700;

  let cart = store.User.cart;

  let screen = props.route.params.screen || '';
  let d = props.route.params.data || [];

  const data = [
    {
      img: d.slider_images || [],
      name: d.name || '',
      avgRate: d.rating.average_rating || 0,
      totalRaters: d.rating.total_reviews || 0,
      reviews: d.rating.details || [],
      coords: d.loc.coords || [],
      address: d.loc.address || '',
      times: d.opening_times || [],
    },
  ];

  const renderTitleSection = item => {
    const renderTimes = () => {
      const t = times.map((e, i, a) => {
        let title = e.day || '';
        let ft = e.open || '';
        let st = e.close || '';
        let fnlt = ft != '' && st != '' ? ft + ' - ' + st : '';

        return (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 5,
            }}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                fontSize: 14,
                fontFamily: theme.fonts.fontNormal,
                color: theme.color.subTitle,
                lineHeight: 22,
                textTransform: 'capitalize',
              }}>
              {title}
            </Text>

            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                fontSize: 14,
                fontFamily: theme.fonts.fontNormal,
                color: theme.color.subTitle,
                lineHeight: 22,
                textTransform: 'capitalize',
              }}>
              {fnlt != '' ? fnlt : 'Close'}
            </Text>
          </View>
        );
      });

      return t;
    };

    const navigatetoGoogleMaps = () => {
      let label = name;
      let dest = coords;
      let latLng = `${dest.latitude},${dest.longitude}`;

      const scheme = Platform.select({
        ios: 'maps:0,0?q=',
        android: 'geo:0,0?q=',
      });

      const url = Platform.select({
        ios: `${scheme}${label}&ll=${latLng}`,
        android: `${scheme}${latLng}(${label})`,
      });

      Linking.canOpenURL(url)
        .then(supported => {
          console.log('start google map support', supported);
          if (supported) {
            return Linking.openURL(url);
          } else {
            const browser_url =
              Platform.OS == 'ios'
                ? `https://www.google.de/maps/@${latLng}?q=${label}`
                : `https://www.google.com/maps/dir/?api=1&travelmode=driving&destination=${latLng}`;
            return Linking.openURL(browser_url);
          }
        })
        .catch(err => {
          console.log('error open google map', err);
          Alert.alert('', err);
        });
    };

    let sty = {
      paddingHorizontal: 15,
      backgroundColor: theme.color.background,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
      elevation: 3,
    };

    let styy = {
      backgroundColor: theme.color.background,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
      elevation: 5,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 15,
      paddingVertical: 15,
    };

    let name = item.name || '';
    let avgRate = item.avgRate;
    let totalRaters = item.totalRaters;
    let coords = item.coords;
    let address = item.address || '';
    let times = item.times;

    return (
      <>
        <View style={sty}>
          {renderSep()}
          <View style={{width: '100%'}}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                fontSize: 19,
                fontFamily: theme.fonts.fontMedium,
                color: theme.color.title,
                // textTransform: 'capitalize',
                lineHeight: 22,
              }}>
              {name}
            </Text>
          </View>
          {renderSep()}
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <utils.vectorIcon.Entypo
              name="star-outlined"
              color={theme.color.button1}
              size={22}
            />
            <View style={{width: '92%'}}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  fontSize: 15,
                  fontFamily: theme.fonts.fontMedium,
                  color: theme.color.subTitle,
                  textTransform: 'capitalize',
                  lineHeight: 22,
                }}>
                {avgRate}
              </Text>

              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  fontSize: 14,
                  fontFamily: theme.fonts.fontNormal,
                  color: theme.color.subTitle,
                  lineHeight: 22,
                }}>
                {totalRaters} people rated
              </Text>
            </View>
          </View>
          {renderSep()}
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <utils.vectorIcon.Ionicons
              name="ios-location-outline"
              color={theme.color.button1}
              size={22}
            />
            <View style={{width: '92%'}}>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={navigatetoGoogleMaps}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{
                    fontSize: 15,
                    fontFamily: theme.fonts.fontMedium,
                    color: theme.color.subTitle,
                    lineHeight: 22,
                  }}>
                  {address}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {renderSep()}
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <utils.vectorIcon.Ionicons
              name="time-outline"
              color={theme.color.button1}
              size={22}
            />
            <View style={{width: '92%', paddingRight: 15}}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  fontSize: 15,
                  fontFamily: theme.fonts.fontMedium,
                  color: theme.color.subTitle,
                  lineHeight: 22,
                }}>
                Opening times
              </Text>
              {times.length > 0 && renderTimes()}
              {times.length <= 0 && (
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{
                    fontSize: 15,
                    fontFamily: theme.fonts.fontNormal,
                    color: theme.color.subTitleLight,
                    lineHeight: 22,
                  }}>
                  Null
                </Text>
              )}
            </View>
          </View>
          {renderSep()}
        </View>
      </>
    );
  };

  const renderSep = () => {
    return (
      <View
        style={{
          width: 0,
          height: 15,
        }}
      />
    );
  };

  const renderStatusBar = () => {
    return (
      <>
        {!isScrollDisable && (
          <StatusBar
            translucent={Platform.OS == 'ios' ? false : true}
            backgroundColor={
              Platform.OS == 'ios' ? theme.color.background : 'transparent'
            }
            barStyle={Platform.OS == 'ios' ? 'dark-content' : 'light-content'}
          />
        )}

        {isScrollDisable && (
          <StatusBar
            translucent={false}
            backgroundColor={theme.color.background}
            barStyle={'dark-content'}
          />
        )}
      </>
    );
  };

  const renderImageSliderBox = image => {
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
              images={image}
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
          </MaskedView>
        )}

        {Platform.OS == 'android' && (
          <View style={styles.imageConatiner}>
            <ImageSlider
              autoPlayWithInterval={2000}
              images={image}
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
          </View>
        )}
      </>
    );
  };

  const goBack = () => {
    props.navigation.goBack();
  };
  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.icon}
          activeOpacity={0.6}
          onPress={goBack}>
          <utils.vectorIcon.Ionicons
            name="arrow-back-sharp"
            color={theme.color.button1}
            size={25}
          />
        </TouchableOpacity>
        <TouchableOpacity
          disabled
          activeOpacity={0.6}
          // onPress={() => onPressHeart(!isFav ? 'add' : 'remove')}
          style={styles.icondisable}>
          {/* <utils.vectorIcon.AntDesign
          name={!isFav ? 'hearto' : 'heart'}
          color={theme.color.heart}
          size={23}
        /> */}
        </TouchableOpacity>
      </View>
    );
  };

  const renderMainData = (item, index) => {
    let img = item.img || [];
    let reviews = item.reviews;

    return (
      <>
        <View>
          {renderImageSliderBox(img)}
          {renderTitleSection(item)}
        </View>

        {reviews.length > 0 && (
          <>
            {renderSep()}
            {renderRatings(reviews)}
          </>
        )}
      </>
    );
  };

  const renderRatings = reviews => {
    const formateDateTime = d => {
      let date = new Date(d);
      var tt = moment(date).format('hh:mm a');
      var dd = moment(date).format('D MMM Y');
      return dd;
    };

    const renderSepLine = () => {
      return (
        <View
          style={{
            width: '100%',
            alignSelf: 'center',
            height: 0.6,
            backgroundColor: theme.color.subTitleLight,
            marginVertical: 10,
            opacity: 0.5,
          }}
        />
      );
    };

    const renderData = (item, index) => {
      let name = item.user_name || '';
      let rate = item.rate || 0;
      let date = item.created_at || '';
      let comment = item.comment || 'No review';

      return (
        <>
          <View style={{}}>
            <View style={styles.rsec1}>
              <View style={styles.rsec11}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles.rsec11Text}>
                  {name}
                </Text>
              </View>

              <View style={styles.rsec12}>
                <View style={styles.rsec121}>
                  <utils.vectorIcon.Entypo
                    name="star"
                    color={theme.color.rate}
                    size={15}
                  />

                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={styles.rsec121Text}>
                    {rate.toFixed(1)}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.rsec2}>
              <Text style={styles.rsec2Text1}>
                {date != '' ? date : '----'}
              </Text>
              <Text style={styles.rsec2Text2}>{comment}</Text>
            </View>
          </View>
          {renderSepLine()}
        </>
      );
    };

    return (
      <>
        <Text style={styles.sec2Ttitle}>Reviews & Ratings</Text>
        <FlatList
          ref={scroll2Ref}
          style={{
            paddingHorizontal: 15,
            paddingVertical: 15,
          }}
          // onScrollEndDrag={handleScroll2}
          showsVerticalScrollIndicator={false}
          data={reviews}
          renderItem={({item, index}) => renderData(item, index)}
          keyExtractor={(item, index) => {
            return index.toString();
          }}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          removeClippedSubviews={true}
        />
      </>
    );
  };

  const handleScroll = event => {
    let num = event.nativeEvent.contentOffset.y;
    // if (num <= 172) {
    //   scrollRef?.current.scrollTo(0);
    // }
    // if (num > 172) {
    //   setisScrollDisable(true);
    // }
    console.log('scrol 1 : ', num);
  };

  const handleScroll2 = event => {
    let num = event.nativeEvent.contentOffset.y;
    // if (num <= 0) {
    //   setisScrollDisable(false);
    // }

    console.log('scrol 2 : ', num);
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderStatusBar()}

      <FlatList
        ref={scrollRef}
        nestedScrollEnabled={true}
        // onScrollEndDrag={handleScroll}
        showsVerticalScrollIndicator={false}
        data={data}
        renderItem={({item, index}) => renderMainData(item, index)}
        keyExtractor={(item, index) => {
          return index.toString();
        }}
      />

      {renderHeader()}

      <Toast ref={toast} position="bottom" />
    </SafeAreaView>
  );
}
