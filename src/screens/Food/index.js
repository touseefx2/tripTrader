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
import RBSheet from 'react-native-raw-bottom-sheet';

export default observer(Food);
function Food(props) {
  const rbSheet = useRef(null);
  let maxItem = 5;
  const scrollRef = useRef(null);
  const [num, setNum] = useState(1);

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

  let isVarReqFieldEmpty = false;

  const toast = useRef(null);
  const toastduration = 700;

  let cart = store.User.cart;

  const d = props.route.params.food;
  let isinCart = props.route.params.isinCart;
  let item = 0;

  let resturant = props.route.params.resturant;

  let name = d.title;
  let pid = d._id;
  let detail = d.description;
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

  const [isReqFieldEmpty, setisReqFieldEmpty] = useState(true);

  const productAvlOption = [
    'Remove it from my order',
    'Cancel the entire order',
    'Call me & Confirm',
  ];
  const [s, sets] = useState(productAvlOption[0]);
  const [spa, setspa] = useState(productAvlOption[0]);

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
            y.isRequire = d.isRequired;
            y.variant = d.name;
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
            y.variant = d.name;
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

  useEffect(() => {
    let ar = [];

    if (baseV.length > 0) {
      let arr = baseV.filter(function (item) {
        return item.isRequired === true;
      });
      if (arr.length > 0) {
        arr.map((e, i, a) => {
          ar.push(e);
        });
      }
    }

    if (addV.length > 0) {
      let arr = addV.filter(function (item) {
        return item.isRequired === true;
      });
      if (arr.length > 0) {
        arr.map((e, i, a) => {
          ar.push(e);
        });
      }
    }

    if (ar.length > 0) {
      let y = [];
      ar.map((e, i, a) => {
        let dd = {...e};
        dd.isS = false;
        let d = e.details;
        if (d.length > 0) {
          let arr = d.filter(function (item) {
            return item.isSel === true;
          });
          if (arr.length > 0) {
            dd.isS = true;
          } else {
            dd.isS = false;
          }
          y.push(dd);
        }
      });

      let c = false;

      if (y.length > 0) {
        for (let index = 0; index < y.length; index++) {
          const element = y[index];
          if (element.isS == false) {
            c = true;
            break;
          }
        }
      }

      setisReqFieldEmpty(c);
    } else {
      setisReqFieldEmpty(false);
    }
  }, [baseV, addV]);

  function checkObjEqual(obj1, obj2) {
    for (let key in obj1) {
      if (!(key in obj2)) return false;
      if (obj1[key] !== obj2[key]) return false;
    }
    return true;
  }

  const checkSameObjectinCart = (cartt, objj) => {
    if (cartt.data.length > 0) {
      let objIndex = 0;
      let chk = false;

      let array = cartt.data;

      for (let index = 0; index < array.length; index++) {
        const e = array[index];
        const i = index;
        const a = array;

        const o1 = {...e};
        const o1Var = o1.variants;
        o1.variants = '';
        o1.firstBill = 0;
        o1.bill = 0;
        o1.quantity = 0;

        const o2 = {...objj};
        const o2Var = o2.variants;
        o2.variants = '';
        o2.firstBill = 0;
        o2.bill = 0;
        o2.quantity = 0;

        chk = checkObjEqual(o1, o2);

        if (o1Var.length <= 0 && o2Var.length <= 0) {
        } else if (o1Var.length != o2Var.length) {
        } else if (o1Var.length == o2Var.length) {
          let t1 = o1Var.map((e, i, a) => {
            return Object.entries(e).sort().toString();
          });
          let t2 = o2Var.map((e, i, a) => {
            return Object.entries(e).sort().toString();
          });

          chk = t1.every(element => {
            return t2.includes(element);
          });
        }
        if (chk) {
          objIndex = i;
          break;
        }
      }

      if (chk) {
        cartt.data[objIndex].ifNotAvailable = spa.toLowerCase();
        let q = cartt.data[objIndex].quantity + num;

        cartt.data[objIndex].quantity = q;
        cartt.data[objIndex].bill = q * cartt.data[objIndex].firstBill;
        store.User.setcart(cartt);
        goBack();
      }
    }
  };

  const addProductinCart = () => {
    const cartt = {...cart};
    let ar = [];
    let isRequired = false;

    if (baseV.length > 0 && baseV[0].details.length > 0) {
      let arr = baseV[0].details.filter(function (item) {
        return item.isSel === true;
      });
      if (arr.length > 0) {
        arr.map((e, i, a) => {
          if (e.isRequire == true) {
            isRequired = true;
          }
          let c = {...e};
          delete c.isSel;
          ar.push(c);
        });
      }
    }
    if (addV.length > 0) {
      addV.map((e, i, a) => {
        let d = e.details;

        if (d.length > 0) {
          let arr = d.filter(function (item) {
            return item.isSel === true;
          });
          if (arr.length > 0) {
            arr.map((e, i, a) => {
              let c = {...e};
              delete c.isSel;
              ar.push(c);
            });
          }
        }
      });
    }
    let bill = 0;
    if (ar.length > 0) {
      ar.map((e, i, a) => {
        bill = bill + parseFloat(e.price);
      });
    }

    let ibill = bill;
    bill = isRequired ? bill * num : (bill + d.price) * num;
    let fb = isRequired ? ibill * 1 : (ibill + d.price) * 1;

    const objj = {
      resturant: resturant,
      productId: d._id,
      productName: d.title,
      description: d.description || '---',
      quantity: num,
      price: d.price,
      bill: bill,
      firstBill: fb,
      variants: ar,
      ifNotAvailable: spa.toLowerCase(),
    };
    console.warn('obj : ', objj);

    if (cartt.data.length > 0) {
      let dd = cartt.data;
      let arr = dd.filter(function (item) {
        return item.productId === pid;
      });

      if (arr.length > 0) {
        let chk = false;
        let data = [];

        for (let index = 0; index < arr.length; index++) {
          const e = arr[index];
          const i = index;
          const a = arr;

          data = e;
          const o1 = {...e};
          const o1Var = o1.variants;
          o1.variants = '';
          o1.firstBill = 0;
          o1.bill = 0;
          o1.quantity = 0;

          const o2 = {...objj};
          const o2Var = o2.variants;
          o2.variants = '';
          o2.firstBill = 0;
          o2.bill = 0;
          o2.quantity = 0;

          chk = checkObjEqual(o1, o2);

          if (o1Var.length <= 0 && o2Var.length <= 0) {
            chk = true;
            break;
          } else if (o1Var.length != o2Var.length) {
            chk = false;
            break;
          } else if (o1Var.length == o2Var.length) {
            let t1 = o1Var.map((e, i, a) => {
              return Object.entries(e).sort().toString();
            });
            let t2 = o2Var.map((e, i, a) => {
              return Object.entries(e).sort().toString();
            });

            // console.log('t1 : ', t1);
            // console.log('t2 : ', t2);

            chk = t1.every(element => {
              return t2.includes(element);
            });
          }
          if (chk) {
            break;
          }
        }

        console.log('chkkkk : ', chk);

        if (chk) {
          checkSameObjectinCart(cartt, data);
        } else {
          objj.image = d.image || '';
          onAddCartdftitem(cartt, objj, 'push');
        }
      } else {
        objj.image = d.image || '';
        onAddCartdftitem(cartt, objj, 'push');
        return;
      }
    } else {
      objj.image = d.image || '';
      onAddCartdftitem(cartt, objj, '');
      return;
    }
  };

  const onAddCartdftitem = (cartt, objj, chk) => {
    if (chk != 'push') {
      let arr = [];

      arr.push(objj);
      cartt.data = arr;
      store.User.setcart(cartt);
      goBack();
    } else {
      cartt.data.push(objj);
      store.User.setcart(cartt);
      goBack();
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
      <View style={styles.imageConatiner}>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {
            setfullImgUri(image);
            setfullImgModal(true);
          }}>
          <FastImage
            style={styles.image}
            source={image}
            resizeMode={FastImage.resizeMode.cover}
          />
        </TouchableOpacity>
      </View>
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

      if (i > maxItem + 1 && !isVeiwMore) {
        return null;
      } else {
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
                      color={
                        !ischk ? theme.color.subTitle : theme.color.button1
                      }
                    />
                  )}

                  {ismulti && (
                    <utils.vectorIcon.Fontisto
                      name={!ischk ? 'checkbox-passive' : 'checkbox-active'}
                      size={15}
                      style={{top: -1.5}}
                      color={
                        !ischk ? theme.color.subTitle : theme.color.button1
                      }
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
      }
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
      <View>
        {baseV.length > 0 && renderShowVariation(baseV, 'base')}
        {addV.length > 0 && renderShowVariation(addV, 'add')}
      </View>
    );
  };

  const renderBottom = () => {
    return (
      <View
        style={{
          width: '100%',
          height: responsiveHeight(Platform.OS == 'android' ? 10 : 14),
          backgroundColor: theme.color.background,
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          bottom: 0,

          paddingHorizontal: 15,
          paddingVertical: 5,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 7,
          },
          shadowOpacity: 0.41,
          shadowRadius: 9.11,

          elevation: 14,
        }}>
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
              disabled={num <= 1 ? true : false}
              onPress={() => {
                let c = num;
                --c;
                setNum(c);
              }}>
              {/* onPress={onPressSubItem}> */}
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
              {/* onPress={onPressAddItem}> */}
              <utils.vectorIcon.AntDesign
                name="plus"
                color={theme.color.background}
                size={22}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            disabled={isReqFieldEmpty}
            onPress={onPressAddcart}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: '58%',
              borderRadius: 8,
              height: responsiveHeight(6),
              backgroundColor: !isReqFieldEmpty
                ? theme.color.button1
                : theme.color.disableBackDark,
              elevation: 1,
            }}>
            <Text style={styles.ButtonText}>Add to cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderBottomSheet = () => {
    const Apply = () => {
      let txt = s;
      setspa(txt);
      rbSheet?.current?.close();
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
          ref={rbSheet}
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
        {renderBottomSheet()}
        <View style={{marginTop: 10}}>
          <Text
            style={{
              color: theme.color.title,
              fontSize: 17,
              lineHeight: 20,
              fontFamily: theme.fonts.fontMedium,
            }}>
            If this product is not available
          </Text>

          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              rbSheet?.current?.open();
            }}
            style={{
              marginTop: 15,
              width: '100%',
              paddingVertical: 15,
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
                  fontSize: 14,
                  lineHeight: 17,
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
                size={18}
              />
            </View>
          </TouchableOpacity>
        </View>
      </>
    );
  };

  const renderStatusBar = () => {
    return (
      <StatusBar
        animated={false}
        translucent={Platform.OS == 'ios' ? false : true}
        backgroundColor={
          Platform.OS == 'ios' ? theme.color.background : 'transparent'
        }
        barStyle={Platform.OS == 'ios' ? 'dark-content' : 'light-content'}
      />
    );
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

  return (
    <SafeAreaView style={styles.container}>
      {renderStatusBar()}

      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
        {renderCoverImage()}
        <View
          style={{
            paddingHorizontal: 15,
            paddingBottom: responsiveHeight(17),
          }}>
          {renderTitleSection()}
          {sep()}

          {(baseV.length > 0 || addV.length > 0) && renderVariantSection()}

          {renderProductAvailability()}
        </View>
      </ScrollView>
      {renderFullImage()}
      {renderBottom()}
      {renderHeader()}
      <Toast ref={toast} position="bottom" />
    </SafeAreaView>
  );
}
