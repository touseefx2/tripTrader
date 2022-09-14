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
} from 'react-native';
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
import {Utils} from '@react-native-firebase/app';
import RBSheet from 'react-native-raw-bottom-sheet';

export default observer(BottomModal);
function BottomModal(props) {
  let maxItem = 1;

  const rbSheet2 = useRef(null);

  const productAvlOption = [
    'Remove it from my order',
    'Cancel the entire order',
    'Call me & Confirm',
  ];
  const [s, sets] = useState(productAvlOption[0]);
  const [spa, setspa] = useState(productAvlOption[0]);

  const windowWidth = theme.window.Width;
  const imageAspectWidth = 375;
  const imageAspectHeight = 332;
  const curveAdjustment = 10;
  const maskHeight = responsiveHeight(26);
  const scaleFactor = imageAspectWidth / imageAspectHeight;
  const scaledHeight = scaleFactor * maskHeight;
  const controlPointX = windowWidth / 2.0;
  const controlPointY = scaledHeight + curveAdjustment;
  const curveCenterPointY = (controlPointY - maskHeight) / 2;

  let isVarReqFieldEmpty = false;

  const toast = useRef(null);
  const toastduration = 700;

  let cart = store.User.cart;

  const d = props.data;

  let resturant = props.resturant;

  let isinCart = props.isinCart;

  const closeBootomSheet = () => {
    props.closeBootomSheet();
  };

  let item = 0;

  let name = d.title;
  let pid = d._id;
  let detail = d.description || '----';
  let rs = d.price;
  let image = d.image
    ? {uri: d.image}
    : require('../../assets/images/burger/img.jpeg');
  let baseVV = d.base_variation.slice() || [];
  let addVV = d.additional_variation.slice() || [];
  let cztmzText = baseVV.length <= 0 && addVV.length <= 0 ? '' : 'Customize';
  let cztmz = baseVV.length <= 0 && addVV.length <= 0 ? false : true;

  let fvlist = store.User.fvrtList;
  let isFav = false;
  if (fvlist.length > 0) {
    fvlist.map((e, i, a) => {
      if (e._id == pid) {
        isFav = true;
      }
    });
  }
  if (addVV.length > 0) {
    addVV.sort((x, y) =>
      x.isRequired !== y.isRequired ? -1 : x.isRequired == y.isRequired ? 1 : 0,
    );
  }

  const [fullImgModal, setfullImgModal] = useState(false);
  const [fullImgUri, setfullImgUri] = useState('');
  const [fullImgLoad, setfullImgLoad] = useState(false);

  const [baseV, setbaseV] = useState([]);
  const [addV, setaddV] = useState([]);

  const [num, setNum] = useState(1);

  const [c, setc] = useState(false);

  let isReqFieldEmpty = false;

  // const d = props.data;
  // let pid = d._id;
  //  const cart = store.User.cart;
  //   let baseV = d.base_variation || [];
  //   let addV = d.additional_variation.slice() || [];
  //  if (addV.length > 0) {
  //     addV.sort((x, y) =>
  //       x.isRequired !== y.isRequired ? -1 : x.isRequired == y.isRequired ? 1 : 0,
  //     );
  //   }

  //   let itemName = d.title || '---';
  //   let itemPrice = d.price || 0;

  //   let totalPrice = baseV.length <= 0 ? itemPrice : 0;
  //   const [totalItems, settotalItems] = useState(1);

  //   let variations = store.Food.variations;

  //   let isVarReqFieldEmpty = false;

  //   let length = baseV.length + addV.length;

  if (cart.data.length > 0) {
    let arr = [];
    arr = cart.data.filter(function (item) {
      return item.productId === d._id;
    });

    isinCart = arr.length > 0 ? true : false;
    if (isinCart) {
      arr.map((e, i, a) => {
        item = item + e.quantity;
      });
    }
  } else {
    isinCart = false;
  }

  const goBack = () => {
    props.navigation.goBack();
  };

  // console.log('bseV: ', baseV);
  // console.log('addV: ', addV[0].details);
  // const onPressHeart = () => {};

  // const onPressAddcart = () => {
  //   if (cztmzText != '') {
  //     store.User.setisAddModal(true);
  //   }
  // };

  useEffect(() => {
    if (baseVV.length > 0) {
      let arr = [];
      baseVV.map((e, i, a) => {
        // console.log('e : ', e);
        // console.log('e  d: ', e.details);

        let d = {...e};
        d.viewmore = false;

        let c = [];
        let dtls = d.details;
        if (dtls.length > 0) {
          dtls.map((e, i, a) => {
            const y = {...e};
            y.isSel = false;
            c.push(y);
          });
        }
        delete d.details;
        d.details = c;

        arr.push(d);
      });
      setbaseV(arr);
    }

    if (addVV.length > 0) {
      let arr = [];
      addVV.map((e, i, a) => {
        // console.log('e : ', e);
        // console.log('e  d: ', e.details);

        let d = {...e};
        d.viewmore = false;

        let c = [];
        let dtls = d.details;
        if (dtls.length > 0) {
          dtls.map((e, i, a) => {
            const y = {...e};
            y.isSel = false;
            c.push(y);
          });
        }
        delete d.details;
        d.details = c;

        arr.push(d);
      });
      setaddV(arr);
    }
  }, []);

  const addProductinCart = () => {
    const objj = {
      resturant: resturant,

      productId: d._id,
      productName: d.title,
      description: d.description || '---',
      quantity: num,
      price: d.price,
      bill: d.price * num,
      firstBill: d.price * 1,
      variants: [],
      ifNotAvailable: spa,
    };
    // store.Food.setselectedProduct(d);
    const cartt = {...cart};

    if (cartt.data.length > 0) {
      let dd = cartt.data;
      let objIndex = false;
      let arr = dd.filter(function (item, index) {
        if (item.productId === pid) {
          objIndex = index;
        }
        return item.productId === pid;
      });
      console.log('arr  f: ', arr);
      console.log('i: ', objIndex);

      if (arr.length > 0) {
        if (objIndex !== false) {
          console.log('objIndex : ', objIndex);

          cartt.data[objIndex].ifNotAvailable = spa;
          let q = cartt.data[objIndex].quantity + num;
          cartt.data[objIndex].quantity = q;
          cartt.data[objIndex].bill = q * cartt.data[objIndex].firstBill;
          store.User.setcart(cartt);
          closeBootomSheet();
        }
      } else {
        objj.image = d.image || '';
        onaddIteminCart(cartt, objj, 'push');
        return;
      }
    } else {
      objj.image = d.image || '';
      onaddIteminCart(cartt, objj, '');

      return;
    }
  };

  const onaddIteminCart = (cartt, objj, ch) => {
    if (ch != 'push') {
      let arr = [];
      arr.push(objj);
      cartt.data = arr;
      store.User.setcart(cartt);
      closeBootomSheet();
    } else {
      cartt.data.push(objj);
      store.User.setcart(cartt);
      closeBootomSheet();
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
    // store.Food.setselectedProduct(d);
    let baseV = d.base_variation || [];
    let addV = d.additional_variation || [];
    console.log('baseV: ', baseV);
    console.log('ADDV: ', addV);

    addProductinCart();
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
            store.User.setcart(cartt);
          }
        }
      }
    }
  };

  const renderCoverImage = () => {
    return (
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
        <FastImage
          style={styles.image}
          source={image}
          resizeMode={FastImage.resizeMode.cover}
        />
      </MaskedView>
    );
  };

  const renderFullImage = () => {
    return (
      <Modal
        transparent
        visible={fullImgModal}
        onRequestClose={() => {
          setfullImgModal(false);
          setfullImgUri('');
        }}>
        <StatusBar
          animated={false}
          backgroundColor="black"
          barStyle={'light-content'}
        />

        <View style={styles.fullImageModalContainer}>
          <Image
            onLoadStart={() => setfullImgLoad(false)}
            onLoad={() => {
              setfullImgLoad(true);
            }}
            resizeMode="contain"
            style={styles.fullImageModalImage}
            source={fullImgUri}
          />

          {!fullImgLoad && (
            <ActivityIndicator
              size={35}
              color={'blue'}
              style={styles.fullImageModalLoader}
            />
          )}

          <TouchableOpacity
            onPress={() => {
              setfullImgModal(false);
              setfullImgUri('');
            }}
            style={styles.fullImageModalCross}>
            <utils.vectorIcon.Entypo name="cross" color="white" size={35} />
          </TouchableOpacity>
        </View>
      </Modal>
    );
  };

  const renderTitleSection = () => {
    return (
      <View style={{}}>
        <View style={styles.titleSection}>
          <View style={{width: '60%'}}>
            <Text style={styles.foodCardTitle1}>{name}</Text>
          </View>
          <View
            style={{
              width: '35%',
              alignItems: 'flex-end',
            }}>
            <Text style={styles.foodCardTitle2}>
              {baseV.length <= 0 ? 'Rs. ' : 'from Rs. '}
              {rs.toFixed()}
            </Text>
          </View>
        </View>

        <View style={styles.descriptionSection}>
          <Text style={styles.foodCardDetails}>{detail}</Text>
        </View>
      </View>
    );
  };

  const sep = () => {
    return (
      <View
        style={{
          width: '95%',
          alignSelf: 'center',
          height: 1.5,
          backgroundColor: theme.color.subTitle,
          marginTop: 15,
          opacity: 0.1,
        }}
      />
    );
  };

  const renderShowVariationDetails = (data, more, ci, b, ismulti) => {
    const c = data.map((e, i, a) => {
      let isVeiwMore = more;
      let name = e.name || '---';
      let price = parseFloat(e.price) || 0;
      let priceText = price > 0 ? `Rs. ${price}` : 'Free';
      let ischk = e.isSel || false;

      // if (sel) {
      //   ischk = sel._id == e._id ? true : false;
      // }

      return (
        <>
          {(i <= maxItem || (i > maxItem && isVeiwMore)) && (
            <>
              <TouchableOpacity
                activeOpacity={0.5}
                style={[
                  styles.varaintDetailsCard,
                  {marginBottom: i < a.length - 1 ? 5 : 0},
                ]}
                onPress={() => {
                  if (b == 'base') {
                    const data = baseV.slice();

                    if (!ismulti) {
                      data[ci].details[i].isSel = true;
                      data[ci].details.map((e, ii, a) => {
                        if (ii !== i) {
                          data[ci].details[ii].isSel = false;
                        }
                      });
                    } else {
                      data[ci].details[i].isSel = !ischk;
                    }

                    setbaseV(data);
                  } else {
                    const data = addV.slice();
                    if (!ismulti) {
                      data[ci].details[i].isSel = true;
                      data[ci].details.map((e, ii, a) => {
                        if (ii !== i) {
                          data[ci].details[ii].isSel = false;
                        }
                      });
                    } else {
                      data[ci].details[i].isSel = !ischk;
                    }

                    setaddV(data);
                  }
                }}>
                {!ismulti && (
                  <utils.vectorIcon.FontAwesome
                    name={!ischk ? 'circle-thin' : 'circle-o'}
                    size={18}
                    style={{
                      top: -1,
                    }}
                    color={!ischk ? theme.color.subTitle : theme.color.button1}
                  />
                )}

                {ismulti && (
                  <utils.vectorIcon.Fontisto
                    name={!ischk ? 'checkbox-passive' : 'checkbox-active'}
                    size={15}
                    style={{top: -1.5}}
                    color={!ischk ? theme.color.subTitle : theme.color.button1}
                  />
                )}

                <View
                  style={{
                    width: '58%',
                  }}>
                  <Text style={styles.variationDeatlsText}>{name}</Text>
                </View>

                <View
                  style={{
                    width: '30%',
                    alignItems: 'flex-end',
                  }}>
                  <Text style={styles.variationDeatlsText}>{priceText}</Text>
                </View>
              </TouchableOpacity>
            </>
          )}

          {i > maxItem && !isVeiwMore && (
            <>
              <TouchableOpacity
                activeOpacity={0.5}
                style={[
                  styles.varaintDetailsCard,
                  {marginBottom: i < a.length - 1 ? 20 : 0},
                ]}
                onPress={() => {
                  if (b == 'base') {
                    const data = baseV.slice();
                    data[ci].viewmore = true;
                    setbaseV(data);
                  } else {
                    const data = addV.slice();
                    data[ci].viewmore = true;
                    setaddV(data);
                  }
                }}>
                <utils.vectorIcon.AntDesign
                  name={'down'}
                  size={18}
                  color={theme.color.button1}
                />

                <View
                  style={{
                    width: '58%',
                  }}>
                  <Text
                    style={[
                      styles.variationDeatlsText,
                      {color: theme.color.button1, textTransform: 'none'},
                    ]}>
                    View more ({a.length - (maxItem + 1)})
                  </Text>
                </View>

                <View
                  style={{
                    width: '30%',
                  }}
                />
              </TouchableOpacity>
            </>
          )}
        </>
      );
    });

    return c;
  };

  const renderShowVariation = (data, b) => {
    const c = data.map((e, i, a) => {
      let d = e.details || [];
      // console.log('var e :  ', e);
      // console.log('var e details :  ', d);

      let isinVar = false;
      let name = e.name || '----';
      let isrequire = e.isRequired;
      let t = isrequire ? 'Required' : 'Optional';
      let isMulti = e.multi_selection || false;
      let option = !isMulti ? 'Select one' : 'Select multiple options';
      let isViewMore = e.viewmore || false;
      // let obj = {
      //   name: e.name,
      //   index: i,
      //   data: e.details,
      //   multi: e.multi_selection,
      // };

      // if (variations.length > 0) {
      //   let arr = [];
      //   arr = variations.filter(function (item) {
      //     return item.variant.toLowerCase() === e.name.toLowerCase();
      //   });

      //   if (arr.length > 0) {
      //     isinVar = true;
      //     d = arr.length > 1 ? arr : arr[0];
      //   }
      // }
      // if (!isinVar) {
      //   isVarReqFieldEmpty = true;
      // }
      // return !isinVar
      //   ? showUNselectVariationCard(e, i, a)
      //   : showSelectedVariationCard(d, obj, '');

      // if (t == 'Required') {
      //   isReqFieldEmpty = true;
      // }

      // let obj = {
      //   name: e.name,
      //   index: i,
      //   data: e.details,
      //   multi: e.multi_selection,
      // };

      if (d.length > 0) {
        return (
          <View>
            <View style={styles.selectionSection1}>
              <View style={{width: '75%'}}>
                <Text style={styles.headerSectionText1}>{name}</Text>
                <Text style={styles.headerSectionText11}>{option}</Text>
              </View>
              <View style={styles.chooseButton}>
                <Text style={styles.chooseButtonText}>{t}</Text>
              </View>
            </View>

            <View style={styles.selectionSection2}>
              {renderShowVariationDetails(d, isViewMore, i, b, isMulti)}
            </View>
          </View>
        );
      }
    });

    return c;
  };

  const renderVariantSection = () => {
    return (
      <View
        style={{
          paddingHorizontal: 15,
          // backgroundColor: 'yellow',
        }}>
        {baseV.length > 0 && renderShowVariation(baseV, 'base')}
        {addV.length > 0 && renderShowVariation(addV, 'add')}
      </View>
    );
  };

  const renderBottom = () => {
    return (
      <View
        style={
          Platform.OS == 'android' ? styles.bContainer : styles.bContainerios
        }>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            // backgroundColor: 'blue',
            alignSelf: 'center',
            width: '100%',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-evenly',
              width: '35%',
              // backgroundColor: 'red',
            }}>
            <TouchableOpacity
              disabled={num <= 1 ? true : false}
              style={[
                styles.buttomIcon,
                {
                  backgroundColor:
                    num <= 1
                      ? theme.color.disableBackDark
                      : theme.color.button1,
                },
              ]}
              activeOpacity={0.6}
              onPress={() => {
                let c = num;
                --c;
                setNum(c);
              }}>
              <utils.vectorIcon.AntDesign
                name="minus"
                color={theme.color.background}
                size={22}
              />
            </TouchableOpacity>
            <View style={{width: '30%'}}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.cartCountText}>
                {num}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.buttomIcon}
              activeOpacity={0.6}
              onPress={() => {
                let c = num;
                ++c;
                setNum(c);
              }}>
              <utils.vectorIcon.AntDesign
                name="plus"
                color={theme.color.background}
                size={22}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onPressAddcart}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: '58%',
              borderRadius: 8,
              height: responsiveHeight(6),
              backgroundColor: theme.color.button1,
              elevation: 1,
            }}>
            <Text style={styles.ButtonText}>Add to cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderBottomSheet2 = () => {
    const Apply = () => {
      let txt = s;
      setspa(txt);
      rbSheet2?.current?.close();
    };

    const renderApplyButton = () => {
      return (
        <>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
              Apply();
            }}
            style={styles.BottomButton}>
            <Text style={styles.buttonTextBottom}>Apply</Text>
          </TouchableOpacity>
        </>
      );
    };

    return (
      <>
        <RBSheet
          ref={rbSheet2}
          height={responsiveHeight(42)}
          closeOnPressBack={true}
          openDuration={250}
          screen={''}
          onOpen={() => sets(spa)}
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
          <ScrollView
            contentContainerStyle={{marginHorizontal: 15, paddingTop: 10}}>
            <View>
              <Text
                style={{
                  fontFamily: theme.fonts.fontMedium,
                  color: theme.color.title,
                  fontSize: 20,
                  marginBottom: 12,
                }}>
                If this product is not available
              </Text>

              {productAvlOption.length > 0 &&
                productAvlOption.map((e, i, a) => {
                  return (
                    <TouchableOpacity
                      activeOpacity={0.6}
                      onPress={() => {
                        sets(e);
                      }}
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: '100%',
                        paddingVertical: 5,
                        marginVertical: 6,
                      }}>
                      <View
                        style={{
                          width: '10%',
                        }}>
                        <utils.vectorIcon.FontAwesome5
                          name={
                            e.toLowerCase() == s.toLowerCase()
                              ? 'dot-circle'
                              : 'circle'
                          }
                          color={theme.color.button1}
                          size={20}
                        />
                      </View>
                      <View style={{width: '89%'}}>
                        <Text
                          numberOfLines={2}
                          ellipsizeMode="tail"
                          style={{
                            color: theme.color.title,
                            fontSize: 15,
                            lineHeight: 18,
                            fontFamily: theme.fonts.fontNormal,
                          }}>
                          {e}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
            </View>
          </ScrollView>

          <View style={{padding: 15}}>{renderApplyButton()}</View>
        </RBSheet>
      </>
    );
  };

  const renderProductAvailability = () => {
    return (
      <>
        {renderBottomSheet2()}
        <View style={{marginTop: 20}}>
          <Text
            style={{
              color: theme.color.title,
              fontSize: 16,
              lineHeight: 19,
              fontFamily: theme.fonts.fontMedium,
            }}>
            If this product is not available
          </Text>

          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              rbSheet2?.current?.open();
            }}
            style={{
              marginTop: 12,
              width: '100%',
              paddingVertical: 12,
              alignSelf: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderRadius: 6,
              borderWidth: 0.8,
              borderColor: theme.color.subTitleLight,
              paddingHorizontal: 10,
            }}>
            <View style={{width: '80%'}}>
              <Text
                numberOfLines={2}
                ellipsizeMode="tail"
                style={{
                  color: theme.color.subTitle,
                  fontSize: 13,
                  lineHeight: 16,
                  fontFamily: theme.fonts.fontMedium,
                }}>
                {spa}
              </Text>
            </View>

            <View
              style={{
                width: '15%',
                alignItems: 'flex-end',
              }}>
              <utils.vectorIcon.AntDesign
                name="right"
                color={theme.color.button1}
                size={17}
              />
            </View>
          </TouchableOpacity>
        </View>
      </>
    );
  };

  return (
    <>
      <View style={{flex: 1}}>
        {renderCoverImage()}
        <ScrollView contentContainerStyle={{paddingBottom: 15}}>
          <View style={{paddingHorizontal: 20}}>
            {renderTitleSection()}
            {renderProductAvailability()}
          </View>
        </ScrollView>
        {renderFullImage()}
        {renderBottom()}
        <Toast ref={toast} position="bottom" />
      </View>
    </>
  );
}
