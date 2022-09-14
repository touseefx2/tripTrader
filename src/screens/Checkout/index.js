import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Linking,
  ScrollView,
  TextInput as Ti,
  PermissionsAndroid,
  Dimensions,
  Alert,
  Keyboard,
  StatusBar,
  BackHandler,
  Modal,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import db from '../../database/index';
import {styles} from './styles';
import {inject, observer} from 'mobx-react';
import store from '../../store/index';
import utils from '../../utils/index';
import theme from '../../theme';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Toast from 'react-native-easy-toast';
import NetInfo from '@react-native-community/netinfo';
import {TextInput} from 'react-native-paper';
import Geolocation from 'react-native-geolocation-service';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import Geocoder from 'react-native-geocoding';
import ProgressiveFastImage from '@freakycoder/react-native-progressive-fast-image';
import RBSheet from 'react-native-raw-bottom-sheet';

export default observer(Checkout);
function Checkout(props) {
  const gapikey = 'AIzaSyC75RWT0q9xkASq2YhX2vGi1R-e_p2pnWU';
  const toast = useRef(null);
  const toastduration = 700;
  let rl = store.User.rl;

  let imgLoader = require('../../assets/images/imgLoader/img.gif');
  const window = Dimensions.get('window');
  const {width, height} = window;
  const LATITUDE_DELTA = 0.0922;
  const LONGITUDE_DELTA = LATITUDE_DELTA + width / height;

  let islOCATION = store.General.isLocation;

  let contact = store.Food.sliderImages;

  let cart = store.User.cart;
  let screen = props.route.params.screen || '';
  let subtotal = cart.totalbill;
  let tax = 0;

  let totalItems = cart.totalitems;

  let internet = store.General.isInternet;
  let user = store.User.user;
  console.log('cart  : ', cart.data);

  const mobileReg = /^[3]\d{9}$/ || /^[0][3]\d{9}$/;

  const [load, setload] = useState(false);

  const [load2, setload2] = useState(false);

  const [name, setname] = useState(user?.username || '');
  const [phone, setphone] = useState(user?.mobile?.toString().slice(2) || '');
  const [address, setaddress] = useState(''); //street adress
  const [loc, setloc] = useState(false);
  const [si, setsi] = useState('');

  const [isShowItems, setisShowItems] = useState(false);
  const [isModal, setisModal] = useState(false);
  const [isVerify, setisVerify] = useState(false);

  const [isMenu, setisMenu] = useState(true);
  const [isCart, setisCart] = useState(false);
  const [isCheckout, setisCheckout] = useState(false);
  const [status, setstatus] = useState('');

  const [dType, setdType] = useState('delivery');
  const [isConfirm, setisConfirm] = useState(false);

  const [edt, setedt] = useState(
    dType == 'delivery'
      ? cart.data[0].resturant.estimatedDeliveryTime
      : cart.data[0].resturant.estimatedPickupTime,
  );
  let resturantName = cart.data[0].resturant.name || '';

  const [promoCode, setpromoCode] = useState('');
  const [isPromoApply, setisPromoApply] = useState(false);

  const [dc, setdc] = useState(cart.data[0].resturant.delivery_charges || 0);
  const [t, sett] = useState(cart.data[0].resturant.tax || 0);

  const [tP, settP] = useState(parseFloat(0)); //tax price;
  const [discount, setdiscount] = useState(0); //promo discount price;
  const [total, settotal] = useState(parseFloat(0)); //tax price;

  const rbSheet = useRef(null);
  const OpenSheet = () => {
    rbSheet?.current?.open();
  };
  const CloseSheet = () => {
    rbSheet?.current?.close();
  };

  useEffect(
    () => {
      // setedt(
      //   dType == 'delivery'
      //     ? contact.estimatedDeliveryTime
      //     : contact.estimatedPickupTime,
      // );
      // setdc(dType == 'delivery' ? parseFloat(contact.deliveryCharges) : 0);
      // sett(parseFloat(contact.tax || 0));
    },
    [
      // contact, dType
    ],
  );

  useEffect(() => {
    let d = isPromoApply ? subtotal - discount : subtotal;
    let yt = (t / 100) * d;
    settP(yt.toFixed());
  }, [t, discount, isPromoApply]);

  useEffect(() => {
    if (isPromoApply) {
      let type = isPromoApply.type;
      let discountPercent = isPromoApply.percentage;

      let v = 0;
      // if (type == 'food') {
      v = (parseFloat(discountPercent).toFixed() / 100) * subtotal;
      // }

      setdiscount(v.toFixed());
    }
  }, [isPromoApply]);

  useEffect(() => {
    let tt = parseFloat(subtotal) + parseFloat(dc) + parseFloat(tP);
    settotal(tt.toFixed() - discount);
  }, [tP, dc, subtotal, discount]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackButtonClick,
    );

    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );
      subscription.remove();
    };
  }, [isCart]);

  function handleBackButtonClick() {
    if (!props.navigation.isFocused()) {
      return false;
    }

    if (!isCart) {
      goBack();
    }

    if (isCart) {
      setisCart(false);
      setpromoCode('');
      setisPromoApply(false);
      setdiscount(0);
    }

    // props.navigation.navigate('Home');
    return true;
  }

  useEffect(() => {
    if (user) {
      setname(user?.username || '');
      setphone(user?.mobile?.toString().slice(2) || '');
    }
  }, [user]);

  useEffect(() => {
    if (isMenu) {
      setstatus('menu');
    }
    if (isMenu && isCart) {
      setstatus('cart');
    }

    if (isMenu && isCart && isCheckout) {
      setstatus('checkout');
    }
  }, [isMenu, isCart, isCheckout]);

  const goBack = () => {
    props.navigation.goBack();
  };

  useEffect(() => {
    Geocoder.init(gapikey, {language: 'en'});
  }, []);

  useEffect(() => {
    if (islOCATION) {
      getCurrentLocationOne('c');
    }
    // if (!islOCATION) {
    //   requestPermissions('');
    // }
  }, [islOCATION]);

  useEffect(() => {
    if (cart.data.length <= 0) {
      goBack();
    }
  }, [cart]);

  const deleteCart = () => {
    store.User.setcart({totalbill: 0, totalitems: 0, data: []});
    props.navigation.navigate('Home');
  };

  const sep = () => {
    return (
      <View
        style={{
          width: '100%',
          backgroundColor: 'silver',
          height: 0.6,
          alignSelf: 'center',
        }}
      />
    );
  };

  const sepVar = () => {
    return (
      <View
        style={{
          width: '100%',
          backgroundColor: theme.color.subTitleLight,
          height: 0.6,
          marginVertical: 15,
          alignSelf: 'center',
          opacity: 0.4,
        }}
      />
    );
  };

  const sepVarSummary = () => {
    return (
      <View
        style={{
          width: '100%',
          backgroundColor: theme.color.subTitleLight,
          height: 0,
          marginVertical: 5,
          alignSelf: 'center',
        }}
      />
    );
  };

  const showSuccesOrder = c => {
    console.log('show sucs call');
    if (store.User.user) {
      store.Orders.getOrderById();
    }
    store.User.setcart({totalbill: 0, totalitems: 0, data: []});
    setload2(false);
    props.navigation.navigate('OrderIndication', {data: c});
  };

  const attempToPlaceOrder = Order => {
    setload2(true);
    db.hitApi(db.apis.PLACE_ORDER, 'post', Order, null)
      ?.then(resp => {
        console.log(`response  ${db.apis.PLACE_ORDER} : `, resp.data);
        showSuccesOrder(resp.data);
      })
      .catch(err => {
        setload2(false);

        let msg = err.response.data.message || err.response.status;
        console.log(`Error in ${db.apis.PLACE_ORDER} : `, msg);
        if (msg == 503 || msg == 500) {
          store.General.setisServerError(true);
          return;
        }
        Alert.alert('', msg);
      });
  };

  const attempToCheckPromo = () => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        setload2(true);
        let body = {
          code: promoCode,
          city: store.User.location.city._id,
          customer: store.User.user._id,
        };
        console.warn(`${db.apis.CHECK_PROMO} body : `, body);
        db.hitApi(db.apis.CHECK_PROMO, 'post', body, store.User.authToken)
          ?.then(resp => {
            setload2(false);
            console.log(`response  ${db.apis.CHECK_PROMO} : `, resp.data);
            let dt = resp.data.doc[0];
            if (dt) {
              let mp = parseFloat(dt.minPurchase).toFixed() || 0;

              if (subtotal < mp) {
                Alert.alert(
                  '',
                  `To use this promo code, minimum order amount is Rs. ${mp}`,
                );
                return;
              }

              setisPromoApply(dt);
            }
          })
          .catch(err => {
            setload2(false);
            setisPromoApply(false);
            let msg = err.response.data.message || err.response.status;
            console.log(`Error in ${db.apis.CHECK_PROMO} : `, msg);
            if (msg == 503 || msg == 500) {
              store.General.setisServerError(true);
              return;
            }
            Alert.alert('', msg.toString());
          });
      } else {
        toast?.current?.show('Please connect internet', toastduration);
      }
    });
  };

  const getCurrentLocationOne = c => {
    if (c != 'c') {
      setload(true);
    }

    Geolocation.getCurrentPosition(
      //Will give you the current location
      async position => {
        const cl = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        };

        console.log('get c loc one res true');

        const loc = {
          city_name: '',
          coords: cl,
        };

        store.User.setcl(loc);

        Geocoder.from({
          latitude: cl.latitude,
          longitude: cl.longitude,
        })
          .then(json => {
            let results = json.results;

            console.log('geocoder json data true : ');
            let cityName = '';
            if (results[0]) {
              var add = results[0].formatted_address;
              var value = add.split(',');
              let count = value.length;
              let country = value[count - 1];
              let state = value[count - 2];
              let city = value[count - 3];
              cityName = city;
            } else {
              console.log(' geocoder json  res : ', 'address not found');
            }

            const locc = {
              city_name: cityName,
              coords: cl,
            };
            store.User.setcl(locc);

            if (c != 'c') {
              setload(false);
              let locc = store.User.location;
              props.navigation.navigate('OrderLocation', {
                city: locc.city,
                area: locc.area,
                loc: locc,
                l: loc,
                setloc: c => setloc(c),
                setaddress: c => setaddress(c),
              });
            }

            return;
          })
          .catch(error => {
            setload(false);
            // if (error.code == 4) {
            //   Alert.alert(
            //     '',
            //     'Please enable billing account on your google map api key',
            //   );
            // }
            console.warn('geocoder error : ', error);
            return;
          });
      },
      error => {
        setload(false);
        if (error.code == 3) {
          if (!store.User.cl) {
            getCurrentLocationOne(c);
          }
        }

        if (error.code == 1) {
          // locationEnabler()
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

  const gotoMap = () => {
    if (!store.User.cl) {
      getCurrentLocationOne('');
      return;
    }
    let locc = store.User.location;
    props.navigation.navigate('OrderLocation', {
      city: locc.city,
      area: locc.area,
      loc: locc,
      l: loc,
      address: address,
      setloc: c => setloc(c),
      setaddress: c => setaddress(c),
    });
  };

  const hasPermissionIOS = async c => {
    console.log('In request iOS permissions');
    const status = await Geolocation.requestAuthorization('whenInUse');
    console.log(status);
    if (status === 'granted') {
      store.General.setLocation(true);

      if (c == 'l') {
        gotoMap();
      }

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

  const androidLocationEnablerDialog = c => {
    RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
      interval: 10000,
      fastInterval: 5000,
    })
      .then(data => {
        store.General.setLocation(true);
        if (c == 'l') {
          gotoMap();
        }
      })
      .catch(err => {
        toast?.current?.show('Please turn on location');
        console.log('location enabler popup error : ', err);
      });
  };

  const hasPermissionAndroid = async c => {
    let g = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    console.log('permission result : ', g);

    if (g === PermissionsAndroid.RESULTS.GRANTED) {
      androidLocationEnablerDialog(c);
      return;
    }

    store.General.setLocation(false);
    let msg = 'permisiion location';
    if (g === 'denied') {
      msg = 'Please allow permision to use location';
    }

    if (g === 'never_ask_again') {
      msg =
        'Please allow permision to use location in  app setting in device allow location permission to continue';
    }

    Alert.alert(``, msg, [
      {
        text: 'Go to Settings',
        onPress: () => {
          openSetting();
        },
      },
      {text: "Don't Use Location", onPress: () => {}},
    ]);

    const openSetting = () => {
      Linking.openSettings().catch(() => {
        Alert.alert('Unable to open settings');
      });
    };

    return;
  };

  async function requestPermissions(c) {
    if (Platform.OS === 'ios') {
      console.log('Requesting iOS Permissions');
      hasPermissionIOS(c);
      return;
    }
    if (Platform.OS === 'android') {
      console.log('Requesting Android Permissions');
      hasPermissionAndroid(c);
    }
  }

  const selectLocation = () => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        requestPermissions('l');
      } else {
        toast?.current?.show('Please connect internet');
      }
    });
  };

  const placeOrder = chk => {
    Keyboard.dismiss();

    if (name == '') {
      toast?.current?.show('Please enter your name');
      return;
    }

    if (phone == '') {
      toast?.current?.show('Please enter your phone number');
      return;
    }

    if (mobileReg.test(phone) === false) {
      toast?.current?.show('Your phone number is inavlid');
      return;
    }

    if (address === '' && dType == 'delivery') {
      toast?.current?.show('Please select your delivery address');
      return;
    }

    let pids = [];
    let p = [];
    if (cart.data.length > 0) {
      cart.data.map((e, i, a) => {
        pids.push(e.productId);

        let v = [];

        let vr = e.variants;
        if (vr.length > 0) {
          vr.map((d, i, a) => {
            let g = {...d};
            g.value = g.name;
            delete g.name;
            v.push(g);
          });
        }
        const obj = {
          productId: e.productId,
          productName: e.productName,
          quantity: e.quantity,
          totalprice: e.bill,
          variants: v,
        };

        p.push(obj);
      });
    }

    let citydata = store.User.location.city;
    let areadata = store.User.location.area;
    let branchName = 'branch name';
    let txtt = areadata.name + ', ' + citydata.name;

    let adr = dType == 'delivery' ? address : txtt;
    let lc = dType == 'delivery' ? loc : [];
    let crntloc = store.User.cl;

    const order = user
      ? {
          username: name,
          usermobile: '+92' + phone,
          usertype: 'customer',
          customer: user._id,
          instructions: si,
          paymentMethod: 'cash',
          city: store.User.location.city._id,
          address: adr, //user enter in  end street adress
          quantity: totalItems,
          location: lc, //user delivery location
          productsIds: pids,
          products: p,
          deliveryType: dType,
          orderDeviceLoc: {
            latitude: crntloc?.coords?.latitude || 0,
            longitude: crntloc?.coords?.longitude || 0,
          },
          isPromoCodeApplied: isPromoApply ? true : false,
          promoCode: isPromoApply ? isPromoApply.code : '',
          promoType: isPromoApply ? isPromoApply.type || '' : '',
          promoDiscountPercentage: isPromoApply ? isPromoApply.percentage : '',
          promoDiscountAmount: isPromoApply ? discount : '', //amount that will minus in your total bill
          taxpercent: t,
          tax: tP,
          deliveryCharges: dc,
          bill: subtotal, //total bill of all food prdoucts
          finalBill: total, //total bill include discount/tsx.deliverycharges
        }
      : {
          username: name,
          usermobile: '+92' + phone,
          usertype: 'guest',
          instructions: si,
          paymentMethod: 'cash',
          city: store.User.location.city._id,
          registrationToken: store.User.notificationToken,
          address: adr, //user enter in  end street adress
          quantity: totalItems,
          location: lc,
          productsIds: pids,
          products: p,
          deliveryType: dType,
          orderDeviceLoc: {
            latitude: crntloc?.coords?.latitude || 0,
            longitude: crntloc?.coords?.longitude || 0,
          },
          isPromoCodeApplied: isPromoApply ? true : false,
          promoCode: isPromoApply ? isPromoApply.code || '' : '',
          promoType: isPromoApply ? isPromoApply.type || '' : '',
          promoDiscountPercentage: isPromoApply
            ? isPromoApply.percentage || ''
            : '',
          promoDiscountAmount: isPromoApply ? discount : '', //amount that will minus in your total bill
          taxpercent: t,
          tax: tP,
          deliveryCharges: dc,
          bill: subtotal, //total bill of all food prdoucts
          finalBill: total, //total bill include discount/tsx.deliverycharges
        };

    console.log('order body : ', order);
    // console.log('order productsIds array : ', order.productsIds);
    // console.log('order products : ', order.products);
    // console.log('order Vairant : ', order.products[1].variants);

    if (user) {
      NetInfo.fetch().then(state => {
        if (state.isConnected) {
          if (dType == 'pickup') {
            if (chk == 'continue') {
              setisConfirm(false);
              attempToPlaceOrder(order);
              return;
            }
            setisConfirm(true);
            return;
          }
          attempToPlaceOrder(order);
        } else {
          toast?.current?.show('Please connect internet', toastduration);
        }
      });
    } else {
      if (!isVerify) {
        setisModal(true);
        return;
      }
      NetInfo.fetch().then(state => {
        if (state.isConnected) {
          attempToPlaceOrder(order);
        } else {
          toast?.current?.show('Please connect internet', toastduration);
        }
      });
    }
  };

  const onPressAddItem = ind => {
    let objIndex = ind;

    const cartt = {...cart};

    if (cartt.data.length > 0) {
      let q = cartt.data[objIndex].quantity + 1;
      cartt.data[objIndex].quantity = q;
      cartt.data[objIndex].bill = q * cartt.data[objIndex].firstBill;
      store.User.setcart(cartt);
    }
  };

  const onPressSubItem = ind => {
    let objIndex = ind;

    const cartt = {...cart};

    if (cartt.data.length > 0) {
      if (cartt.data[objIndex].quantity == 1) {
        cartt.data.splice(objIndex, 1);
        store.User.setcart(cartt);
        return;
      }

      let q = cartt.data[objIndex].quantity - 1;
      cartt.data[objIndex].quantity = q;
      cartt.data[objIndex].bill = q * cartt.data[objIndex].firstBill;
      store.User.setcart(cartt);
    }
  };

  const renderBottomButton = () => {
    let txt = !isCart ? ' Review payment and address' : 'Place Order';

    const pressButton = () => {
      if (!isCart) {
        if (!user) {
          rbSheet?.current?.open();
          return;
        }

        if (!islOCATION) {
          requestPermissions('');
          return;
        }
        setisCart(true);
        return;
      }

      if (isCart) {
        placeOrder('');
        // setisCheckout(true);
        return;
      }
    };

    return (
      <View style={styles.foodCard}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '90%',
            alignSelf: 'center',
            marginBottom: 10,
          }}>
          <View style={{width: '40%'}}>
            <Text style={styles.sectionsTitle}>
              Total{' '}
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.sectionsTitlee}>
                (incl. Tax)
              </Text>
            </Text>
          </View>
          <View style={{width: '55%', alignItems: 'flex-end'}}>
            <Text
              numberOfLines={2}
              ellipsizeMode="tail"
              style={styles.sectionsTitle}>
              Rs. {total}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={pressButton}
          style={styles.foodCardLinear}>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.t1}>
            {txt}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderVaR = vart => {
    const valueArr = vart.map(item => {
      return item.variant;
    });

    let uniqueArray = valueArr.filter(function (item, pos) {
      return valueArr.indexOf(item) == pos;
    });

    let farr = [];
    if (uniqueArray.length > 0) {
      uniqueArray.map((e, i, a) => {
        let baseVar = e;
        let value = '';

        if (vart.length > 0) {
          vart.filter(function (item) {
            if (item.variant.toLowerCase() === baseVar.toLowerCase()) {
              value = value + item.name + ', ';
            }
          });
        }

        let v = value.replace(/,\s*$/, '');
        farr.push({variant: baseVar, value: v});
      });
    }

    const v = farr.map((e, i, a) => {
      let BaseVar = e.variant;
      let Value = e.value;

      return (
        <>
          <View
            style={{
              marginTop: 5,
              flexDirection: 'row',

              justifyContent: 'space-between',
            }}>
            <View style={{width: '40%'}}>
              <Text
                style={{
                  textTransform: 'capitalize',
                  fontFamily: theme.fonts.fontNormal,
                  fontSize: 12,
                  color: theme.color.title,
                  lineHeight: 15,
                }}>
                {BaseVar}:
              </Text>
            </View>

            <View style={{width: '55%'}}>
              <Text
                style={{
                  fontFamily: theme.fonts.fontMedium,
                  fontSize: 12,
                  color: theme.color.subTitleLight,
                  lineHeight: 15,
                }}>
                {Value}
              </Text>
            </View>
          </View>
        </>
      );
    });

    return v;
  };

  const renderShowItem = () => {
    const f = cart.data.map((e, i, a) => {
      let index = i;
      let ItemName = e.productName;
      let firstPrice = e.firstBill || e.price;
      let totalPrice = e.bill;
      let ItemDesc = e.description;
      let quantity = e.quantity;
      let vartns = e.variants;
      let img = e.image || '';

      return (
        <>
          <View style={styles.itemCard}>
            <View style={styles.foodCardImgConatiner}>
              <ProgressiveFastImage
                source={{uri: img}}
                style={styles.foodCardImg}
                loadingSource={imgLoader}
                loadingImageStyle={styles.ImageLoader}
                // thumbnailSource={image}
                // thumbnailAnimationDuration={2000}
              />
            </View>

            <View style={{width: '70%'}}>
              <Text
                style={{
                  fontFamily: theme.fonts.fontMedium,
                  fontSize: 12,
                  color: theme.color.title,
                  lineHeight: 20,
                }}>
                {ItemName}
              </Text>

              <Text
                style={{
                  fontFamily: theme.fonts.fontMedium,
                  fontSize: 12,
                  color: theme.color.subTitleLight,
                  lineHeight: 20,
                }}>
                {ItemDesc}
              </Text>
              {vartns.length > 0 && renderVaR(vartns)}

              <View
                style={{
                  flexDirection: 'row',
                  // alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 7,
                }}>
                <View
                  style={{
                    width: '55%',
                    flexDirection: 'row',
                    // alignItems: 'center',
                    // backgroundColor: 'red',
                  }}>
                  <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => onPressSubItem(index)}>
                    <utils.vectorIcon.AntDesign
                      name="minussquare"
                      color={theme.color.cartbutton}
                      size={24}
                    />
                  </TouchableOpacity>

                  <View
                    style={{
                      width: '30%',
                      // backgroundColor: 'red',
                    }}>
                    <Text
                      style={[styles.addTitle1, {textAlign: 'center', top: 2}]}>
                      {quantity}
                    </Text>
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => onPressAddItem(index)}>
                    <utils.vectorIcon.AntDesign
                      name="plussquare"
                      color={theme.color.cartbutton}
                      size={24}
                    />
                  </TouchableOpacity>

                  {/* <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={styles.addTitle2}>
                    * Rs. {firstPrice.toFixed()}
                  </Text> */}
                </View>

                <View
                  style={{
                    width: '40%',
                    alignItems: 'flex-end',

                    // backgroundColor: 'red',
                  }}>
                  <Text style={styles.addTitle1}>Rs. {totalPrice}</Text>
                </View>
              </View>
            </View>
          </View>
          {sepVar()}
        </>
      );
    });

    return f;
  };

  const renderDeliverInput = () => {
    const navigatetoGoogleMaps = () => {
      let citydata = store.User.location.city;
      let areadata = store.User.location.area;
      let branchName = 'branch name';
      let txtt = areadata.name + ', ' + citydata.name + ', ' + branchName;

      let label = resturantName + ', ' + txtt;

      let dest = rl;

      const scheme = Platform.select({
        ios: 'maps:0,0?q=',
        android:
          'https://www.google.com/maps/dir/?api=1&travelmode=driving&destination=',
      });
      let latLng = `${dest.latitude},${dest.longitude}`;

      const url = Platform.select({
        ios: `https://www.google.com/maps/?api=1&query=${label}&center=${latLng}`,
        android: `${scheme}${latLng}`,
      });

      Linking.canOpenURL(url)
        .then(supported => {
          console.log('start google map support', supported);
          return Linking.openURL(url);
          // if (supported) {
          //   let browser_url =
          //     "https://www.google.de/maps/@" +
          //     dest.latitude +
          //     "," +
          //     dest.longitude +
          //     "?q=" +
          //     label;
          //   return Linking.openURL(browser_url);
          // } else {
          //   return Linking.openURL(url);
          // }
        })
        .catch(err => {
          console.log('error open google map', err);
          Alert.alert('', err);
        });
    };

    let citydata = store.User.location.city;
    let areadata = store.User.location.area;
    let branchName = 'branch name';
    let txtt = areadata.name + ', ' + citydata.name;

    return (
      <>
        {user ? (
          <>
            <Text
              style={{
                marginTop: 5,
                fontSize: 12,
                color: theme.color.title,
                fontFamily: theme.fonts.fontMedium,
                textTransform: 'capitalize',
              }}>
              {name}
            </Text>

            <Text
              style={{
                marginTop: 5,
                fontSize: 12,
                color: theme.color.subTitle,
                fontFamily: theme.fonts.fontMedium,
                textTransform: 'capitalize',
              }}>
              +92{phone}
            </Text>

            <View>
              <Image
                style={styles.mapimg}
                source={require('../../assets/images/map/img.png')}
              />
              <utils.vectorIcon.Ionicons
                style={{position: 'absolute', top: 40, right: 100}}
                name="md-location"
                color={theme.color.button1}
                size={25}
              />
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 5,
              }}>
              {dType == 'delivery' && (
                <>
                  <View style={{width: '75%'}}>
                    <Text
                      style={{
                        fontSize: 12,
                        color:
                          address == ''
                            ? theme.color.subTitle
                            : theme.color.subTitleLight,
                        fontFamily: theme.fonts.fontBold,
                        textTransform: address != '' ? 'capitalize' : 'none',
                      }}>
                      {address != ''
                        ? address + ', ' + loc.address
                        : 'Select your delivery address'}
                    </Text>
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={selectLocation}
                    style={{
                      paddingHorizontal: 7,
                      paddingVertical: 5,
                      backgroundColor: theme.color.button1,
                      borderRadius: 5,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: 12,
                        color: theme.color.buttonText,
                        fontFamily: theme.fonts.fontMedium,
                      }}>
                      {address == '' ? 'Select' : 'Change'}
                    </Text>
                  </TouchableOpacity>
                </>
              )}

              {dType == 'pickup' && (
                <>
                  <View style={{width: '80%'}}>
                    <Text
                      style={{
                        fontSize: 12,
                        color: theme.color.subTitleLight,
                        fontFamily: theme.fonts.fontBold,
                        textTransform: 'capitalize',
                      }}>
                      {txtt}
                    </Text>
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => {
                      navigatetoGoogleMaps();
                    }}
                    // onPress={selectLocation}
                    style={{
                      alignItems: 'flex-end',
                    }}>
                    <Image
                      source={require('../../assets/images/navigate/img.png')}
                      style={{width: 27, height: 27, opacity: 0.9}}
                    />
                    {/* <Text
                      style={{
                        fontSize: 12,
                        color: theme.color.buttonText,
                        fontFamily: theme.fonts.fontMedium,
                      }}>
                      {address == '' ? 'Select' : 'Change'}
                    </Text> */}
                  </TouchableOpacity>
                </>
              )}
            </View>
          </>
        ) : (
          <>
            <Ti
              editable={user ? false : true}
              style={{
                borderBottomWidth: !user ? 0.5 : 0,
                borderColor: theme.color.subTitleLight,
                marginTop: 5,
                borderRadius: 4,
                backgroundColor: !user
                  ? theme.color.background
                  : theme.color.disableField,
                fontSize: 12,
                fontFamily: theme.fonts.fontNormal,
                height: 40,
                color: theme.color.title,
                paddingHorizontal: 7,
              }}
              placeholderTextColor={theme.color.subTitle}
              placeholder="Enter your name"
              value={name}
              onChangeText={val => {
                setname(val);
                // setIsEmptyMobile(false);
                // setInValidMobile(false);
              }}
            />
            <View style={styles.Input}>
              <Image
                source={require('../../assets/images/flag/pakistan.png')}
                style={styles.CountryLogo}
              />

              <Text
                style={{
                  fontSize: 12,
                  fontFamily: theme.fonts.fontNormal,
                  color: theme.color.title,
                  top: -1,
                }}>
                +92
              </Text>

              <Ti
                editable={user ? false : true}
                style={[
                  styles.MobileInput,
                  {
                    backgroundColor: !user
                      ? theme.color.background
                      : theme.color.disableField,
                  },
                ]}
                maxLength={10}
                placeholderTextColor={theme.color.subTitle}
                keyboardType="phone-pad"
                placeholder="3123456789"
                value={phone}
                onChangeText={val => {
                  setphone(val.replace(/[^0-9]/, ''));
                }}
              />

              {isVerify ? (
                <utils.vectorIcon.AntDesign
                  name="checkcircle"
                  color={'green'}
                  size={18}
                />
              ) : (
                <View style={{width: 17}} />
              )}

              <View></View>
            </View>

            <View>
              <Image
                style={styles.mapimg}
                source={require('../../assets/images/map/img.png')}
              />
              <utils.vectorIcon.Ionicons
                style={{position: 'absolute', top: 40, right: 100}}
                name="md-location"
                color={theme.color.button1}
                size={25}
              />
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 15,
              }}>
              {dType == 'delivery' && (
                <>
                  <View style={{width: '75%'}}>
                    <Text
                      style={{
                        fontSize: 12,
                        color:
                          address == ''
                            ? theme.color.subTitle
                            : theme.color.subTitleLight,
                        fontFamily: theme.fonts.fontBold,
                        textTransform: address != '' ? 'capitalize' : 'none',
                      }}>
                      {address != ''
                        ? address + ', ' + loc.address
                        : 'Select your delivery address'}
                    </Text>
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={selectLocation}
                    style={{
                      paddingHorizontal: 7,
                      paddingVertical: 5,
                      backgroundColor: theme.color.button1,
                      borderRadius: 5,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: 12,
                        color: theme.color.buttonText,
                        fontFamily: theme.fonts.fontMedium,
                      }}>
                      {address == '' ? 'Select' : 'Change'}
                    </Text>
                  </TouchableOpacity>
                </>
              )}

              {dType == 'pickup' && (
                <>
                  <View style={{width: '80%'}}>
                    <Text
                      style={{
                        fontSize: 12,
                        color: theme.color.subTitleLight,
                        fontFamily: theme.fonts.fontBold,
                        textTransform: 'capitalize',
                      }}>
                      {txtt}
                    </Text>
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => {
                      navigatetoGoogleMaps();
                    }}
                    // onPress={selectLocation}
                    style={{
                      alignItems: 'flex-end',
                    }}>
                    <Image
                      source={require('../../assets/images/navigate/img.png')}
                      style={{width: 27, height: 27, opacity: 0.9}}
                    />
                    {/* <Text
                      style={{
                        fontSize: 12,
                        color: theme.color.buttonText,
                        fontFamily: theme.fonts.fontMedium,
                      }}>
                      {address == '' ? 'Select' : 'Change'}
                    </Text> */}
                  </TouchableOpacity>
                </>
              )}
            </View>
          </>
        )}
      </>
    );
  };

  const renderVaRSummary = vart => {
    const valueArr = vart.map(item => {
      return item.variant;
    });

    const isDuplicate = valueArr.some((item, idx) => {
      return valueArr.indexOf(item) !== idx;
    });

    let uniqueArray = valueArr.filter(function (item, pos) {
      return valueArr.indexOf(item) == pos;
    });

    let farr = [];
    if (uniqueArray.length > 0) {
      uniqueArray.map((e, i, a) => {
        let baseVar = e;
        let value = '';

        if (vart.length > 0) {
          vart.filter(function (item) {
            if (item.variant.toLowerCase() === baseVar.toLowerCase()) {
              value = value + item.name + ', ';
            }
          });
        }

        let v = value.replace(/,\s*$/, '');
        farr.push({variant: baseVar, value: v});
      });
    }

    const v = farr.map((e, i, a) => {
      let BaseVar = e.variant;
      let Value = e.value;

      return (
        <>
          <View style={{marginTop: 3, flexDirection: 'row'}}>
            <Text
              style={{
                textTransform: 'capitalize',
                fontFamily: theme.fonts.fontBold,
                fontSize: 11,
                lineHeight: 13,
                color: theme.color.subTitle,
              }}>
              {BaseVar}:{' '}
            </Text>
            <Text
              style={{
                fontFamily: theme.fonts.fontMedium,
                fontSize: 11,
                lineHeight: 13,
                color: theme.color.subTitleLight,
              }}>
              {Value}
            </Text>
          </View>
        </>
      );
    });

    return v;
  };

  const renderShowItemSummary = () => {
    const f = cart.data.map((e, i, a) => {
      console.log('e : ', e);

      let index = i;
      let ItemName = e.productName;
      // let firstPrice = e.firstBill || e.price;
      let totalPrice = parseFloat(e.bill) || 0;
      let ItemDesc = e.productId.description || '---';
      let quantity = e.quantity;
      let vartns = e.variants;

      return (
        <>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              marginTop: i == 0 ? 10 : 0,
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                width: '77%',
              }}>
              <Text
                style={{
                  fontFamily: theme.fonts.fontBold,
                  fontSize: 12,
                  lineHeight: 14,
                  color: theme.color.subTitle,
                }}>
                {quantity} x{'  '} {ItemName}
              </Text>
              <Text
                style={{
                  fontFamily: theme.fonts.fontNormal,
                  fontSize: 11,
                  lineHeight: 13,
                  color: theme.color.subTitle,
                }}>
                {ItemDesc}
              </Text>
              {vartns.length > 0 && renderVaRSummary(vartns)}
            </View>
            <View
              style={{
                width: '20%',
                alignItems: 'flex-end',
              }}>
              <Text
                style={{
                  fontFamily: theme.fonts.fontBold,
                  fontSize: 12,
                  lineHeight: 13,
                  color: theme.color.subTitle,
                }}>
                {totalPrice.toFixed()}
              </Text>
            </View>
          </View>

          {i < a.length - 1 && sepVarSummary()}
          {i == a.length - 1 && sepVar()}
          {i == a.length - 1 && (
            <>
              <View
                style={{
                  flexDirection: 'row',
                  // alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <View style={{width: '30%'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={styles.sectionsTitleS}>
                    Subtotal
                  </Text>
                </View>
                <View style={{width: '65%', alignItems: 'flex-end'}}>
                  <Text style={styles.sectionsTitleS}>Rs. {subtotal}</Text>
                </View>
              </View>
              {isPromoApply && (
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 5,
                    justifyContent: 'space-between',
                  }}>
                  <View style={{width: '30%'}}>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={styles.sectionsTitleS}>
                      promo discount
                    </Text>
                  </View>
                  <View style={{width: '65%', alignItems: 'flex-end'}}>
                    <Text style={styles.sectionsTitleS}>- Rs. {discount}</Text>
                  </View>
                </View>
              )}

              <View
                style={{
                  flexDirection: 'row',
                  // alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 5,
                }}>
                <View style={{width: '45%'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={styles.sectionsTitleS}>
                    Tax ({t}%)
                  </Text>
                </View>
                <View style={{width: '50%', alignItems: 'flex-end'}}>
                  <Text style={styles.sectionsTitleS}>Rs. {tP}</Text>
                </View>
              </View>
              {dType == 'delivery' && (
                <View
                  style={{
                    flexDirection: 'row',
                    // alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 5,
                  }}>
                  <View style={{width: '45%'}}>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={styles.sectionsTitleS}>
                      Delivery Charges
                    </Text>
                  </View>
                  <View style={{width: '50%', alignItems: 'flex-end'}}>
                    <Text style={styles.sectionsTitleS}>Rs. {dc}</Text>
                  </View>
                </View>
              )}
            </>
          )}
        </>
      );
    });

    return f;
  };

  const renderConfirmation = () => {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={isConfirm}
        onRequestClose={() => {
          setisConfirm(false);
        }}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.4)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              borderRadius: 15,
              backgroundColor: theme.color.background,
              padding: 15,
              elevation: 3,
              width: '80%',
            }}>
            <Text
              style={{
                color: theme.color.title,
                marginTop: 10,
                fontSize: 18,
                lineHeight: 20,
                fontFamily: theme.fonts.fontBold,
              }}>
              This is a pick-up order
            </Text>

            <Text
              style={{
                color: theme.color.subTitleLight,
                marginTop: 10,
                fontSize: 15,
                lineHeight: 22,
                width: '95%',
                fontFamily: theme.fonts.fontMedium,
                marginTop: 15,
              }}>
              You’ll have to pick it up from the restaurant by yourself.
            </Text>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 20,
              }}>
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => {
                  setisConfirm(false);
                }}
                style={{
                  width: '45%',
                  paddingVertical: 12,
                  borderRadius: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  elevation: 3,
                  backgroundColor:
                    dType == 'delivery'
                      ? theme.color.button1
                      : theme.color.background,
                  borderWidth: dType == 'delivery' ? 0 : 0.7,
                  borderColor: theme.color.button1,
                }}>
                <Text
                  style={{
                    color: theme.color.button1,
                    fontSize: 15,
                    fontFamily: theme.fonts.fontBold,
                    lineHeight: 17,
                  }}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => {
                  placeOrder('continue');
                }}
                style={{
                  width: '45%',
                  paddingVertical: 12,
                  borderRadius: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  elevation: 3,
                  backgroundColor:
                    dType == 'pickup'
                      ? theme.color.button1
                      : theme.color.background,
                  borderWidth: dType == 'pickup' ? 0 : 0.7,
                  borderColor: theme.color.button1,
                }}>
                <Text
                  style={{
                    color: theme.color.buttonText,

                    fontSize: 15,
                    fontFamily: theme.fonts.fontBold,
                    lineHeight: 17,
                  }}>
                  Continue
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <View style={styles.header1}>
          <View style={styles.header11}>
            <TouchableOpacity activeOpacity={0.6} onPress={goBack}>
              <utils.vectorIcon.AntDesign
                name="close"
                color={theme.color.subTitle}
                size={20}
              />
            </TouchableOpacity>

            <View style={{marginLeft: 15}}>
              <Text style={styles.htitle}>Cart</Text>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.htitle2}>
                {resturantName}
              </Text>
            </View>
          </View>

          <TouchableOpacity activeOpacity={0.6} onPress={deleteCart}>
            <utils.vectorIcon.AntDesign
              name="delete"
              color={theme.color.subTitle}
              size={20}
            />
          </TouchableOpacity>
        </View>

        <utils.StatusIndicator2
          data={['menu', 'cart', 'checkout']}
          status={status}
        />
      </View>
    );
  };

  let pstyle = isPromoApply
    ? {
        marginTop: 10,
      }
    : {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
      };

  //delivery style
  let dsty =
    Platform.OS == 'android'
      ? {
          elevation: 5,
        }
      : {
          shadowColor: '#000',
          shadowOffset: {width: 1, height: 3},
          shadowOpacity: 0.2,
        };

  return (
    <SafeAreaView style={styles.container}>
      <utils.BottomModalLogin
        rbSheet={rbSheet}
        nav={props.navigation}
        OpenSheet={() => OpenSheet()}
        CloseSheet={() => CloseSheet()}
        screen={'checkout'}
      />
      {isConfirm && renderConfirmation()}
      <StatusBar
        translucent={false}
        backgroundColor={theme.color.background}
        barStyle={'dark-content'}
      />

      {isModal && (
        <utils.OtpModal
          isModal={isModal}
          setisModal={c => {
            setisModal(c);
          }}
          setisVerify={c => {
            setisVerify(c);
          }}
          phone={phone}
        />
      )}
      <utils.Loader
        text={load2 ? 'Please wait' : 'Getting Current Location'}
        load={load2 || load}
      />
      {!internet && <utils.InternetMessage />}
      {renderHeader()}
      <KeyboardAvoidingView style={{flex: 1}}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {!isCart && (
            <>
              {/* <View style={[styles.mainSeccDelivery, {dsty}]}>
                <Text
                  style={[
                    styles.mainSeccText2,
                    {fontSize: 16, lineHeight: 20},
                  ]}>
                  Delivery Type
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 10,
                  }}>
                  <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => {
                      setdType('delivery');
                    }}
                    style={{
                      width: '45%',
                      paddingVertical: 10,
                      borderRadius: 6,
                      alignItems: 'center',
                      justifyContent: 'center',
                      elevation: 3,
                      backgroundColor:
                        dType == 'delivery'
                          ? theme.color.button1
                          : theme.color.background,
                      borderWidth: dType == 'delivery' ? 0 : 0.7,
                      borderColor: theme.color.button1,
                    }}>
                    <Text
                      style={{
                        color:
                          dType == 'delivery'
                            ? theme.color.buttonText
                            : theme.color.button1,
                        fontSize: 15,
                        fontFamily: theme.fonts.fontBold,
                        lineHeight: 17,
                      }}>
                      Delivery
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => {
                      setdType('pickup');
                    }}
                    style={{
                      width: '45%',
                      paddingVertical: 10,
                      borderRadius: 6,
                      alignItems: 'center',
                      justifyContent: 'center',
                      elevation: 3,
                      backgroundColor:
                        dType == 'pickup'
                          ? theme.color.button1
                          : theme.color.background,
                      borderWidth: dType == 'pickup' ? 0 : 0.7,
                      borderColor: theme.color.button1,
                    }}>
                    <Text
                      style={{
                        color:
                          dType == 'pickup'
                            ? theme.color.buttonText
                            : theme.color.button1,
                        fontSize: 15,
                        fontFamily: theme.fonts.fontBold,
                        lineHeight: 17,
                      }}>
                      Pick-up
                    </Text>
                  </TouchableOpacity>
                </View>
              </View> */}

              <View
                style={
                  Platform.OS == 'android'
                    ? styles.mainSeccD
                    : styles.mainSeccDios
                }>
                <Image
                  style={styles.dimg}
                  source={require('../../assets/images/delivery/img.png')}
                />
                <View style={{width: '80%'}}>
                  <Text
                    style={styles.mainSeccText1}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    Estimated {dType == 'delivery' ? 'delivery' : 'picked-up'}
                  </Text>
                  <Text
                    style={styles.mainSeccText2}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    Now ({edt} min)
                  </Text>
                </View>
              </View>

              <View style={styles.mainSec}>
                {cart.data.length > 0 && renderShowItem()}
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={goBack}
                  style={{flexDirection: 'row', alignItems: 'center'}}>
                  <utils.vectorIcon.Entypo
                    name="plus"
                    color={theme.color.button1}
                    size={13}
                  />
                  <Text style={styles.ami}>Add more items</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.mainSec}>
                <View
                  style={{
                    flexDirection: 'row',
                    // alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <View style={{width: '30%'}}>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={styles.sectionsTitle}>
                      Subtotal
                    </Text>
                  </View>
                  <View style={{width: '65%', alignItems: 'flex-end'}}>
                    <Text style={styles.sectionsTitle}>Rs. {subtotal}</Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    // alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 5,
                  }}>
                  <View style={{width: '45%'}}>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={styles.sectionsTitle2}>
                      Tax ({t}%)
                    </Text>
                  </View>
                  <View style={{width: '50%', alignItems: 'flex-end'}}>
                    <Text style={styles.sectionsTitle2}>Rs. {tP}</Text>
                  </View>
                </View>
                {dType == 'delivery' && (
                  <View
                    style={{
                      flexDirection: 'row',
                      // alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: 5,
                    }}>
                    <View style={{width: '45%'}}>
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={styles.sectionsTitle2}>
                        Delivery Charges
                      </Text>
                    </View>
                    <View style={{width: '50%', alignItems: 'flex-end'}}>
                      <Text style={styles.sectionsTitle2}>Rs. {dc}</Text>
                    </View>
                  </View>
                )}
              </View>
            </>
          )}

          {isCart && (
            <>
              <View
                style={
                  Platform.OS == 'android'
                    ? styles.mainSeccDelivery
                    : styles.mainSeccDeliveryios
                }>
                <Text style={styles.sectionsTitle}>
                  Your {dType == 'delivery' ? 'Delivery ' : 'Pick up '}Details
                </Text>
                {renderDeliverInput()}
              </View>

              <View
                style={
                  Platform.OS == 'android'
                    ? styles.mainSeccDelivery
                    : styles.mainSeccDeliveryios
                }>
                <Text style={styles.sectionsTitle}>Payment method</Text>
                <Text
                  style={{
                    fontSize: 12,
                    marginTop: 10,
                    color: theme.color.subTitleLight,
                    fontFamily: theme.fonts.fontBold,
                  }}>
                  Cash on Delivery
                </Text>
              </View>

              <View
                style={
                  Platform.OS == 'android'
                    ? styles.mainSeccDelivery
                    : styles.mainSeccDeliveryios
                }>
                <Text style={styles.sectionsTitle}>Promo</Text>
                <View style={pstyle}>
                  {!isPromoApply && (
                    <>
                      <Ti
                        editable={!user ? false : true}
                        style={{
                          width: '77%',
                          paddingHorizontal: 5,
                          backgroundColor: theme.color.background,
                          height: 36,
                          color: theme.color.subTitle,
                          borderRadius: 5,
                          borderWidth: 0.6,
                          borderColor: theme.color.subTitleLight,
                          fontSize: 12,
                          fontFamily: theme.fonts.fontMedium,
                        }}
                        onChangeText={t => {
                          setpromoCode(t);
                        }}
                        value={promoCode}
                        placeholderTextColor={theme.color.subTitleLight}
                        placeholder={
                          !user
                            ? 'Please login to apply promo code'
                            : 'Enter promo here (if any)'
                        }
                      />

                      <View
                        style={{
                          width: '20%',
                          alignItems: 'flex-end',
                          // backgroundColor: 'red',
                        }}>
                        <TouchableOpacity
                          onPress={() => {
                            attempToCheckPromo();
                          }}
                          activeOpacity={0.5}
                          disabled={!user || promoCode == '' ? true : false}
                          style={{
                            backgroundColor:
                              !user || promoCode == ''
                                ? theme.color.disableField
                                : theme.color.button1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 5,
                            elevation: 2,
                            width: 60,
                            height: 30,
                          }}>
                          <Text
                            style={{
                              fontSize: 12,
                              color: theme.color.buttonText,
                              fontFamily: theme.fonts.fontBold,
                              lineHeight: 15,
                            }}>
                            Apply
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  )}

                  {isPromoApply && (
                    <>
                      <View
                        style={{
                          width: '100%',
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}>
                        <Text
                          style={{
                            fontSize: 12,
                            width: '70%',
                            color: theme.color.subTitleLight,
                            fontFamily: theme.fonts.fontBold,
                          }}>
                          {isPromoApply.code}
                        </Text>

                        <TouchableOpacity
                          style={{width: '20%', alignItems: 'flex-end'}}
                          activeOpacity={0.4}
                          onPress={() => {
                            setisPromoApply(false), setpromoCode('');
                            setdiscount(0);
                          }}>
                          <Text
                            style={{
                              fontSize: 12,
                              color: theme.color.button1,
                              fontFamily: theme.fonts.fontBold,
                            }}>
                            (Remove)
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View
                        style={{
                          width: '100%',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <Text
                          style={{
                            fontSize: 12,
                            width: '35%',

                            color: theme.color.subTitleLight,
                            fontFamily: theme.fonts.fontBold,
                          }}>
                          Discount ({isPromoApply.percentage || 0}%)
                        </Text>
                        <View
                          style={{
                            width: '60%',
                            alignItems: 'flex-end',
                          }}>
                          <Text
                            style={{
                              fontSize: 12,

                              color: theme.color.subTitleLight,
                              fontFamily: theme.fonts.fontBold,
                              textTransform: 'capitalize',
                            }}>
                            Rs. {discount}
                          </Text>
                        </View>
                      </View>
                    </>
                  )}
                </View>
              </View>

              <View
                style={
                  Platform.OS == 'android'
                    ? styles.mainSeccDelivery
                    : styles.mainSeccDeliveryios
                }>
                <Text style={styles.sectionsTitle}>Order Summary</Text>
                {cart.data.length > 0 && renderShowItemSummary()}
              </View>

              <View
                style={
                  Platform.OS == 'android'
                    ? styles.mainSeccDelivery
                    : styles.mainSeccDeliveryios
                }>
                <Text style={styles.sectionsTitle}>
                  SPECIAL INSTRUCTION (OPTIONAL)
                </Text>

                <TextInput
                  multiline
                  style={{
                    marginTop: 5,
                    backgroundColor: theme.color.background,
                    fontSize: 13,
                    fontFamily: theme.fonts.fontNormal,
                    color: theme.color.subTitle,
                  }}
                  placeholderTextColor={theme.color.subTitleLight}
                  placeholder="Add any comments, e.g. about allergies, or delivery instructions here."
                  value={si}
                  onChangeText={val => {
                    setsi(val);
                  }}
                />
              </View>

              <View style={{height: responsiveHeight(2)}} />
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
      {renderBottomButton()}
      <Toast ref={toast} position="center" />
    </SafeAreaView>
  );
}
