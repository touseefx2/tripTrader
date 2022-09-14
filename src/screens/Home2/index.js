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
  FlatList,
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
import {ActivityIndicator} from 'react-native-paper';
import {ScrollView} from 'react-native-gesture-handler';

export default observer(Home2);
function Home2(props) {
  const toast = useRef(null);
  const toastduration = 700;

  const [Loader, setLoader] = useState(false);

  const [dataf, setDataf] = useState([]); //all resturants
  const [data, setData] = useState(false); //all resturants
  const [exclusiveData, setexclusiveData] = useState([]);
  const [summerDealsData, setsummerDealsData] = useState([]);

  const gapikey = 'AIzaSyC75RWT0q9xkASq2YhX2vGi1R-e_p2pnWU';
  let Resturants = store.Resturants.Resturants;
  let isDataLoad = store.Resturants.dataLoader;
  let filter = store.Resturants.filter;

  const [FilterData, setFilterData] = useState([]);
  const [FilterLength, setFilterLength] = useState(0);

  let screen = props.route.params.screen || '';
  let type = props.route.params.type || '';
  let internet = store.General.isInternet;
  let loc = store.User.location;
  let cart = store.User.cart;

  let totalItems = cart.data.length > 0 ? cart.totalitems : 0;

  useEffect(() => {
    if (filter.length > 0) {
      let l = 0;
      let arr = [];
      filter.map((e, i, a) => {
        if (e.d.length > 0) {
          let c = [];
          e.d.map((ee, ii, aa) => {
            if (ee.isSel == true) {
              console.log('sel : ', ee.isSel);
              if (ee.name != 'recommended') {
                l++;

                c.push(ee.name);
              }
            }
          });

          if (c.length > 0) {
            arr.push({name: e.name, value: c});
          }
        }
      });

      setFilterLength(l);
      setFilterData(arr);
    } else {
      setFilterLength(0);
      setFilterData([]);
    }
  }, [filter]);

  useEffect(() => {
    store.Resturants.setResturants(false);
    return () => {
      store.Resturants.setfilter([]);
      store.Resturants.setResturants(false);
    };
  }, []);

  useEffect(
    () => {
      // if (internet) {
      store.Resturants.getData(loc, type);
      // }
    },
    [
      // internet
    ],
  );

  useEffect(() => {
    if (Resturants.length > 0) {
      getTravelTime();
    } else if (Resturants.length <= 0) {
      setData([]);
      store.Resturants.setdatLaoader(false);
    }
  }, [Resturants]);

  useEffect(() => {
    if (FilterData.length > 0) {
      let ar = data.slice();

      let cuisines = FilterData.filter(d => d.name === 'cuisines');
      let price = FilterData.filter(d => d.name === 'price');

      if (cuisines.length > 0 || price.length > 0) {
        if (ar.length > 0) {
          ar = ar.filter(function (d) {
            if (cuisines.length > 0 && price.length <= 0) {
              return cuisines[0].value.includes(d.type.toLowerCase());
            } else if (cuisines.length <= 0 && price.length > 0) {
              return price[0].value.includes(d.price);
            } else if (cuisines.length > 0 && price.length > 0) {
              return (
                cuisines[0].value.includes(d.type.toLowerCase()) &&
                price[0].value.includes(d.price)
              );
            }
          });

          console.log('g  : ', ar.length);
        }
      }

      //sort
      let sort = FilterData.filter(d => d.name === 'sort');
      if (sort.length > 0) {
        let value = sort[0].value[0];
        if (value == 'distance') {
          if (ar.length > 0) {
            ar.sort(function (a, b) {
              return a.travel_time - b.travel_time;
            });
          }
        } else {
          if (ar.length > 0) {
            ar.sort(function (a, b) {
              return b.rating.average_rating - a.rating.average_rating;
            });
          }
        }
      }

      setDataf(ar);
    }
  }, [FilterData]);

  useEffect(() => {
    if (data.length > 0) {
      let er = [];
      let sd = [];
      data.map((e, i, a) => {
        if (e.promotions == true) {
          er.push(e);
        }
        if (e.deals == 'Summer deals & discounts') {
          sd.push(e);
        }
      });
      setexclusiveData(er);
      setsummerDealsData(sd);
      store.Resturants.setdatLaoader(false);
    }
  }, [data]);

  const renderHeader = () => {
    const onClickBack = () => {
      store.Resturants.setResturants(false);
      store.Resturants.setfilter([]);
      props.navigation.goBack();
    };

    const onClickLoc = () => {
      props.navigation.navigate('Map', {screen: 'home2'});
    };

    const onClickCart = () => {
      if (cart.data.length <= 0) {
        props.navigation.navigate('CheckoutEmpty', {screen: 'home2'});
        return;
      }
      props.navigation.navigate('Checkout', {screen: 'home2'});
    };

    const onClickSearch = () => {
      props.navigation.navigate('Search', {data: data});
    };

    const onClickOption = () => {
      props.navigation.navigate('Filter', {screen: 'home2', type: type});
    };

    const renderBack = () => {
      return (
        <TouchableOpacity
          style={{width: '10%'}}
          activeOpacity={0.6}
          onPress={onClickBack}>
          <utils.vectorIcon.Ionicons
            name="arrow-back-sharp"
            color={theme.color.button1}
            size={24}
          />
        </TouchableOpacity>
      );
    };

    const renderLoc = () => {
      let adrs = loc.adrs;
      let city = loc.city_name;
      let orderType =
        type == 'delivery'
          ? 'Food delivery'
          : type == 'pickup'
          ? 'Pick-Up'
          : '';

      return (
        <TouchableOpacity
          disabled
          activeOpacity={0.7}
          onPress={onClickLoc}
          style={styles.locContainer}>
          <View style={{width: '100%'}}>
            <Text style={styles.locText} numberOfLines={1} ellipsizeMode="tail">
              {adrs}
            </Text>
            <Text
              style={[styles.locText2, {textTransform: 'none'}]}
              numberOfLines={1}
              ellipsizeMode="tail">
              {orderType}
            </Text>
          </View>
        </TouchableOpacity>
      );
    };

    const renderCart = () => {
      const renderCirclecart = () => {
        return (
          <View style={styles.circleCart}>
            <Text style={styles.circleCartText}>
              {totalItems > 99 ? '99+' : totalItems}
            </Text>
          </View>
        );
      };

      return (
        <TouchableOpacity activeOpacity={0.6} onPress={onClickCart}>
          <utils.vectorIcon.Ionicons
            name="ios-cart-outline"
            color={theme.color.button1}
            size={26}
          />
          {totalItems > 0 && renderCirclecart()}
        </TouchableOpacity>
      );
    };

    const renderSeacrh = () => {
      const renderCircle = () => {
        return (
          <View style={styles.circleC}>
            <Text style={styles.circleCText}>
              {FilterLength > 99 ? '99+' : FilterLength}
            </Text>
          </View>
        );
      };

      return (
        <View style={styles.header2}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={onClickSearch}
            style={styles.searchContainer}>
            <utils.vectorIcon.AntDesign
              name="search1"
              color={theme.color.subTitleLight}
              size={20}
            />
            <Text style={styles.searchContainerText}>
              Search for restaurants
            </Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.6} onPress={onClickOption}>
            <utils.vectorIcon.Ionicons
              name="options-outline"
              color={theme.color.button1}
              size={26}
            />
            {FilterLength > 0 && renderCircle()}
          </TouchableOpacity>
        </View>
      );
    };

    let styl =
      Platform.OS == 'android'
        ? {}
        : {
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.6,
            shadowRadius: 1,
          };

    return (
      <View style={styles.headerConatainer}>
        <View style={[styles.header1, styl]}>
          {renderBack()}
          {renderLoc()}
          {renderCart()}
        </View>
        {!isDataLoad && data && data.length > 0 && renderSeacrh()}
      </View>
    );
  };

  const getTravelTime = () => {
    let arr = [];
    for (let i = 0; i < Resturants.length; i++) {
      const e = Resturants[i];
      let a = Resturants;

      //static
      e.total_distance = 30 - i;
      e.travel_time = 20 - i;
      arr.push(e);
      if (i == a.length - 1) {
        console.log('arr :  ', arr);
        setData(arr);
        break;
      }

      //proper dynamic
      // var urlToFetchDistance =
      //   'https://maps.googleapis.com/maps/api/distancematrix/json?units=metric?mode=driving&origins=' +
      //   loc.coords.latitude +
      //   ',' +
      //   loc.coords.longitude +
      //   '&destinations=' +
      //   e.loc.coords.latitude +
      //   '%2C' +
      //   e.loc.coords.longitude +
      //   '&key=' +
      //   gapikey;

      // try {
      //   fetch(urlToFetchDistance)
      //     .then(res => {
      //       return res.json();
      //     })
      //     .then(res => {
      //       if (res) {
      //         console.log('fetchdsistancematric res true ');
      //         if (res?.rows.length > 0) {
      //           let distanceInMeter = res.rows[0].elements[0].distance.value; //in meter
      //           let distanceInKm = distanceInMeter / 1000; //in meter to km
      //           e.total_distance = distanceInKm.toFixed(1) || 0; //meter to km
      //           var timeSecond = res.rows[0].elements[0].duration.value;
      //           e.travel_time = (timeSecond / 60).toFixed(); //sec to min
      //           arr.push(e);
      //         }
      //       }
      //       if (i == a.length - 1) {
      //         console.log('arr :  ', arr);
      //         setData(arr);
      //       }
      //     })
      //     .catch(error => {
      //       // utils.AlertMessage(
      //       //   "fetchdsistancematric api error ",
      //       //   "Network request failed"
      //       // );
      //       console.log('fetchdsistancematric catch error : ', error);
      //       return;
      //     });
      // } catch (error) {
      //   console.log('fetchdsistancematric catch error ', error);
      // }
    }
  };

  const onClickResturant = item => {
    props.navigation.navigate('Home3', {screen: 'home2', data: item});
  };

  const renderResturants = (item, index, dt, c) => {
    let chk = c || '';
    let name = item.name || '';
    let ar = item.rating.average_rating || 0;
    let tr = item.rating.total_reviews;
    let type = item.type || '';
    let dc = item.delivery_charges || 0;
    let distance = item.distance || 0;
    let travel_time = item.travel_time || 0;
    let img = item.image;
    let price = item.price || '';

    const rednerDistance = () => {
      return (
        <View style={styles.disContaniner}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.disContaninerText}>
            {travel_time} min
          </Text>
        </View>
      );
    };

    const renderHeart = () => {
      return (
        <View style={styles.heartContaniner}>
          <utils.vectorIcon.AntDesign
            name="hearto"
            color={theme.color.subTitle}
            size={15}
          />
        </View>
      );
    };

    let styl =
      chk == ''
        ? [
            styles.efcContainer,
            {
              marginLeft: index <= 0 ? 20 : 10,
              marginRight: index == dt.length - 1 ? 20 : 0,
            },
          ]
        : [
            styles.efcContainerAll,
            {
              // marginLeft: index <= 0 ? 20 : 10,
              // marginRight: index == dt.length - 1 ? 20 : 0,
            },
          ];
    let efc1sty = chk == '' ? styles.efc1 : styles.efc1All;

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onClickResturant(item)}
        style={styl}>
        <View style={efc1sty}>
          <Image source={img} style={styles.efcImage} />
          {rednerDistance()}
          {renderHeart()}
        </View>

        <View style={styles.efc2}>
          <View style={styles.efc21}>
            <View style={{width: '63%'}}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.efc21Text1}>
                {name}
              </Text>
            </View>
            <View
              style={{
                width: '35%',
                justifyContent: 'flex-end',
                flexDirection: 'row',
              }}>
              <utils.vectorIcon.Entypo
                name="star"
                color={theme.color.rate}
                size={14}
              />
              <Text style={styles.efc21Text2}>{ar}</Text>
              <Text
                style={[styles.efc21Text2, {color: theme.color.subTitleLight}]}>
                ({tr > 500 ? '500+' : tr})
              </Text>
            </View>
          </View>

          <View style={styles.efc22}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.efc22Text1}>
              {price} • {type}
            </Text>
          </View>

          <View style={styles.efc33}>
            <utils.vectorIcon.MaterialIcons
              name="delivery-dining"
              color={theme.color.subTitleLight}
              size={18}
            />
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.efc33Text1}>
              Rs. {dc}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderMain = () => {
    return (
      <>
        <ScrollView contentContainerStyle={{paddingVertical: 20}}>
          {exclusiveData.length > 0 && FilterLength <= 0 && (
            <>
              <View style={styles.mainSec1}>
                <Text style={styles.mainSecText}>Exclusives</Text>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={exclusiveData}
                  renderItem={({item, index}) =>
                    renderResturants(item, index, exclusiveData)
                  }
                  keyExtractor={(item, index) => {
                    return index.toString();
                  }}
                  initialNumToRender={10}
                  maxToRenderPerBatch={10}
                  removeClippedSubviews={true}
                />
              </View>
              <View style={{height: 15}} />
            </>
          )}

          {summerDealsData.length > 0 && FilterLength <= 0 && (
            <>
              <View style={styles.mainSec2}>
                <Text style={styles.mainSecText}>Summer deals & discounts</Text>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={summerDealsData}
                  renderItem={({item, index}) =>
                    renderResturants(item, index, summerDealsData)
                  }
                  keyExtractor={(item, index) => {
                    return index.toString();
                  }}
                  initialNumToRender={10}
                  maxToRenderPerBatch={10}
                  removeClippedSubviews={true}
                />
              </View>
              <View style={{height: 15}} />
            </>
          )}

          <>
            <View style={styles.mainSec2}>
              {FilterLength <= 0 ? (
                <Text style={styles.mainSecText}>All Resturants</Text>
              ) : (
                <Text style={styles.mainSecText}>
                  "{dataf.length}" filter result
                </Text>
              )}
              <FlatList
                contentContainerStyle={{paddingHorizontal: 20}}
                showsVerticalScrollIndicator
                data={FilterLength <= 0 ? data : dataf}
                renderItem={({item, index}) =>
                  renderResturants(
                    item,
                    index,
                    FilterLength <= 0 ? data : dataf,
                    'all',
                  )
                }
                keyExtractor={(item, index) => {
                  return index.toString();
                }}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                removeClippedSubviews={true}
              />
            </View>
          </>
        </ScrollView>
      </>
    );
  };

  const renderEmptyShow = () => {
    return (
      <View style={styles.emptySECTION}>
        <Image
          style={styles.emptyImg}
          source={require('../../assets/images/empty/img.png')}
        />
        <Text style={styles.emptyText}>Sorry!</Text>
        <Text
          style={[
            styles.emptyText,
            {fontSize: 17, fontFamily: theme.fonts.fontNormal},
          ]}>
          We're currently not available in your area
        </Text>
      </View>
    );
  };

  const renderLoader = () => {
    return (
      <View style={styles.loaderSECTION}>
        <Image
          source={require('../../assets/gif/burger.gif')}
          style={styles.loaderImg}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {!internet && <utils.InternetMessage color={theme.color.button1} />}
      {renderHeader()}
      {isDataLoad && renderLoader()}
      {!isDataLoad && data && data.length <= 0 && renderEmptyShow()}
      {!isDataLoad && data && data.length > 0 && renderMain()}

      <Toast ref={toast} position="bottom" />
    </SafeAreaView>
  );
}
