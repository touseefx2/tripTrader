import React, {useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import theme from '../theme/index';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import utils from '.';
import ProgressiveFastImage from '@freakycoder/react-native-progressive-fast-image';
import store from '../store/index';
import {observer} from 'mobx-react';
import NetInfo from '@react-native-community/netinfo';
import RBSheet from 'react-native-raw-bottom-sheet';

export default observer(FoodCard);
function FoodCard(props) {
  const rbSheet = useRef(null);
  const rbSheet2 = useRef(null);

  const productAvlOption = [
    'Remove it from my order',
    'Cancel the entire order',
    'Call me & Confirm',
  ];
  const [s, sets] = useState(productAvlOption[0]);
  const [spa, setspa] = useState(productAvlOption[0]);

  const toast = props.toast || null;
  const call = props.call || '';
  const d = props.data;
  // console.log('ddd : ', d);
  let pid = d._id;

  let nav = props.nav;
  let name = d.title || '';
  let detail = d.description || '---';
  let rs = d.price || 0;
  let image = d.image
    ? {uri: d.image}
    : require('../assets/images/burger/img.jpeg');
  let imgLoader = require('../assets/images/imgLoader/img.gif');
  let search = props.search || false;

  let resturant = props.resturant;

  let baseV = d.base_variation || [];
  let addV = d.additional_variation || [];
  let cztmzText = baseV.length <= 0 && addV.length <= 0 ? '' : 'Customize';
  let cztmz = baseV.length <= 0 && addV.length <= 0 ? false : true;

  let screen = props.screen || '';

  let cart = store.User.cart;
  let isinCart = false;
  let item = 0;

  let fvlist = store.User.fvrtList;
  let isFav = false;
  if (fvlist.length > 0) {
    fvlist.map((e, i, a) => {
      if (e._id == pid) {
        isFav = true;
      }
    });
  }

  if (cart.data.length > 0) {
    let arr = [];
    arr = cart.data.filter(function (item) {
      return item.productId === d._id;
    });

    console.log('arr filter : ', arr);

    isinCart = arr.length > 0 ? true : false;

    if (isinCart) {
      arr.map((e, i, a) => {
        item = item + e.quantity;
      });
    }
  } else {
    isinCart = false;
  }

  const onPressFoodCard = data => {
    if (baseV.length <= 0 && addV.length <= 0) {
      rbSheet?.current?.open();
      return;
    }

    nav.navigate('Food', {
      food: data,
      isinCart: isinCart,
      item: item,
      screen: screen,
      resturant: resturant,
    });
  };

  const addProductinCart = () => {
    let fb = parseInt((d.price * 1).toFixed());

    const objj = {
      productId: d._id,
      productName: d.title,
      description: d.description || '---',
      quantity: 1,
      price: d.price,
      firstBill: fb,
      bill: d.price,
      variants: [],
    };

    store.Food.setselectedProduct(d);
    const cartt = {...cart};

    if (cartt.data.length > 0) {
      let dd = cartt.data;
      let arr = dd.filter(function (item) {
        return item.productId === pid;
      });
      console.log('arr  f: ', arr);

      if (arr.length > 0) {
      } else {
        onaddIteminCart(cartt, objj, 'push');
        return;
      }
    } else {
      // onaddIteminCart(cartt, objj, '');

      return;
    }
  };

  const onaddIteminCart = (cartt, objj, ch) => {
    if (ch != 'push') {
      let arr = [];
      arr.push(objj);

      cartt.data = arr;
      store.User.setcart(cartt);
    } else {
      cartt.data.push(objj);
      store.User.setcart(cartt);
    }
  };

  const onPressHeart = c => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        if (!store.User.user) {
          toast?.current?.show('Please login to mark favourite', 500);
          return;
        }
        let dd = store.User.fvrtList.slice();
        if (c == 'add') {
          dd.push(d);
          store.User.setfvrtList(dd);
          // store.User.attemptToAddFavtList(pid);
          return;
        } else {
          const index = dd.findIndex(object => {
            return object._id === pid;
          });
          if (index >= 0) {
            dd.splice(index, 1);
            store.User.setfvrtList(dd);
          }
          // store.User.attemptToRemoveFavtList(pid);
          return;
        }
      } else {
        toast?.current?.show('Please connect internet', 500);
      }
    });
  };

  const onPressAddcart = () => {
    store.Food.setselectedProduct(d);
    let baseV = d.base_variation || [];
    let addV = d.additional_variation || [];
    console.log('baseV: ', baseV);
    console.log('ADDV: ', addV);

    if (cztmz) {
      store.User.setisAddModal(true);
    } else {
      addProductinCart();
    }
  };

  const onPressAddItem = () => {
    store.Food.setselectedProduct(d);
    const cartt = {...cart};

    if (cartt.data.length > 0) {
      if (cztmz) {
        store.User.setisAddModal(true);
      } else {
        let objIndex = false;
        objIndex = cartt.data.findIndex(obj => obj.productId == d._id);
        if (objIndex !== false) {
          console.log('objIndex : ', objIndex);
          let q = cartt.data[objIndex].quantity + 1;
          cartt.data[objIndex].quantity = q;
          cartt.data[objIndex].bill = q * cartt.data[objIndex].firstBill;
          store.User.setcart(cartt);
        }
      }
    }
  };

  const onPressSubItem = () => {
    store.Food.setselectedProduct(d);
    const cartt = {...cart};
    if (cartt.data.length > 0) {
      let dd = cartt.data;
      let arr = dd.filter(function (item) {
        return item.productId === pid;
      });

      console.log('arr : ', arr);

      if (arr.length > 0) {
        if (arr.length > 1) {
          store.User.setisSubModal(true);
        } else {
          let objIndex = false;
          objIndex = cartt.data.findIndex(obj => obj.productId == d._id);

          if (objIndex >= 0) {
            console.log('objIndex : ', objIndex);
            if (cartt.data[objIndex].quantity == 1) {
              cartt.data.splice(objIndex, 1);
              store.User.setcart(cartt);
              return;
            }
            let q = cartt.data[objIndex].quantity - 1;
            cartt.data[objIndex].quantity = q;
            cartt.data[objIndex].bill = q * cartt.data[objIndex].firstBill;
            // || cartt.data[objIndex].price;
            store.User.setcart(cartt);
          }
        }
      }
    }
  };

  const sep = () => {
    return (
      <View
        style={{
          width: '100%',
          alignSelf: 'center',
          height: 1.5,
          backgroundColor: theme.color.subTitle,
          top: 13,
          opacity: 0.1,
        }}
      />
    );
  };

  const renderBottomSheet = () => {
    return (
      <>
        <RBSheet
          ref={rbSheet}
          height={responsiveHeight(70)}
          closeOnPressBack={true}
          openDuration={250}
          screen={screen}
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
          <utils.BotomModal
            resturant={resturant}
            data={d}
            screen={screen}
            isinCart={isinCart}
            closeBootomSheet={() => rbSheet?.current?.close()}
          />
        </RBSheet>
      </>
    );
  };

  return (
    <>
      {renderBottomSheet()}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onPressFoodCard(d)}
        style={styles.foodCard}>
        <View style={styles.foodCardTxtConatiner}>
          <Text
            style={styles.foodCardTitle1}
            numberOfLines={1}
            ellipsizeMode="tail">
            {name}
          </Text>
          <Text
            style={styles.foodCardTitle2}
            numberOfLines={2}
            ellipsizeMode="tail">
            {detail}
          </Text>

          <View style={styles.fcBottom}>
            <TouchableOpacity
              disabled
              activeOpacity={0.6}
              style={styles.addcart}>
              <Text
                style={styles.foodCardTitle3}
                numberOfLines={2}
                ellipsizeMode="tail">
                {baseV.length <= 0 ? 'Rs. ' : 'from Rs. '}
                {rs.toFixed()}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.foodCardImgConatiner}>
          <ProgressiveFastImage
            source={image}
            style={styles.foodCardImg}
            loadingSource={imgLoader}
            loadingImageStyle={styles.ImageLoader}
            // thumbnailSource={image}
            // thumbnailAnimationDuration={2000}
          />
        </View>

        {item > 0 && (
          <View style={styles.section1}>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.t1}>
              {item <= 99 ? item : '99+'}
            </Text>
          </View>
        )}
      </TouchableOpacity>
      {sep()}
    </>
  );
}

const styles = StyleSheet.create({
  foodCard: {
    width: '100%',
    backgroundColor: theme.color.background,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 25,
    // backgroundColor: 'red',
    height: 100,
  },

  foodCardTxtConatiner: {
    width: '60%',
    height: '100%',
    // backgroundColor: 'blue',
  },
  foodCardImgConatiner: {
    width: '40%',
    height: '100%',
    //  backgroundColor: 'yellow',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  foodCardImg: {
    width: 100,
    height: 100,
    borderRadius: 8,
    resizeMode: 'cover',
    backgroundColor: theme.color.background,
    elevation: 1.5,
  },
  ImageLoader: {
    height: '30%',
    width: '30%',
    resizeMode: 'contain',
  },
  foodCardTitle1: {
    fontSize: 15,
    fontFamily: theme.fonts.fontMedium,
    color: theme.color.subTitle,
    lineHeight: 18,
    textTransform: 'capitalize',
  },
  foodCardTitle2: {
    fontSize: 12,
    fontFamily: theme.fonts.fontNormal,
    color: theme.color.subTitle,
    lineHeight: 15,
    marginTop: 5,
  },
  foodCardTitle3: {
    fontSize: 13,
    fontFamily: theme.fonts.fontNormal,
    color: theme.color.subTitle,
    lineHeight: 16,
  },
  foodCardTitle3cztmz: {
    fontSize: 10,
    fontFamily: theme.fonts.fontMedium,
    color: theme.color.button1,
    lineHeight: 20,
  },
  fcBottom: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
  },

  addcart: {
    width: '100%',
    // backgroundColor: 'red',
  },
  addcart2Container: {
    width: '50%',
    height: responsiveHeight(3.3),
    // backgroundColor: 'yellow',
    borderRadius: 7,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  foodCardButtonText: {
    fontSize: 14,
    fontFamily: theme.fonts.fontMedium,
    color: theme.color.cartbuttonText,
    lineHeight: 20,
    marginLeft: 3,
  },
  likecart: {
    // backgroundColor: 'yellow',
    alignItems: 'center',
    justifyContent: 'center',
  },

  section1: {
    borderColor: theme.color.background,
    width: 18,
    height: 18,
    borderRadius: 18 / 2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: -2,
    top: -2,
    backgroundColor: theme.color.button1,
    elevation: 3,
  },
  t1: {
    fontSize: 10,
    color: theme.color.buttonText,

    fontFamily: theme.fonts.fontNormal,
    lineHeight: 15,
  },
});
