import React, {useRef, useEffect, useState} from 'react';
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
import store from '../store/index';
import {observer} from 'mobx-react';
import Modal from 'react-native-modal';
import Toast from 'react-native-easy-toast';

export default observer(FoodVariationModal);
function FoodVariationModal(props) {
  const d = props.data;
  let pid = d._id;
  let isReqFieldEmpty = false;
  const cart = store.User.cart;
  let baseV = d.base_variation || [];
  let addV = d.additional_variation.slice() || [];
  if (addV.length > 0) {
    addV.sort((x, y) =>
      x.isRequired !== y.isRequired ? -1 : x.isRequired == y.isRequired ? 1 : 0,
    );
  }

  let itemName = d.title || '---';
  let itemPrice = d.price || 0;

  let totalPrice = baseV.length <= 0 ? itemPrice : 0;
  const [totalItems, settotalItems] = useState(1);

  let variations = store.Food.variations;

  let isVarReqFieldEmpty = false;

  let length = baseV.length + addV.length;

  const toast = useRef(null);
  const toastduration = 700;

  let isAddModal = store.User.isAddModal;

  const onPressModalCancel = () => {
    store.User.setisAddModal(false);
    store.Food.setvariations([]);
    store.Food.setselectedvariationDetail([]);
    //  store.Food.setselectedProduct([]);
  };

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

        // console.log('o1 : ', o1);
        // console.log('o2 : ', o2);

        chk = checkObjEqual(o1, o2);

        // console.log('o1var : ', o1Var);
        // console.log('o2var : ', o2Var);

        if (o1Var.length <= 0 && o2Var.length <= 0) {
        } else if (o1Var.length != o2Var.length) {
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
          objIndex = i;
          break;
        }
      }

      // console.log('chk , ', chk);
      if (chk) {
        // console.log('index , ', objIndex);
        // console.log('cart.data , ', cart.data);
        let q = cartt.data[objIndex].quantity + totalItems;
        // console.log('q , ', q);
        cartt.data[objIndex].quantity = q;
        cartt.data[objIndex].bill = q * cartt.data[objIndex].firstBill;
        store.User.setcart(cartt);
        onPressModalCancel();
      }
    }
  };

  const addProductinCart = () => {
    const cartt = {...cart};

    let t = parseInt((totalPrice * totalItems).toFixed());
    let fb = parseInt((totalPrice * 1).toFixed());
    const objj = {
      productId: d._id,
      productName: d.title,
      description: d.description || '---',
      quantity: totalItems,
      price: itemPrice,
      firstBill: fb,
      bill: t,
      variants: variations,
    };

    console.log('pid : ', pid);
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

          // console.log('o1 : ', o1);
          // console.log('o2 : ', o2);

          chk = checkObjEqual(o1, o2);

          // console.log('o1var : ', o1Var);
          // console.log('o2var : ', o2Var);

          // console.log('o1var : ', o1Var.length);
          // console.log('o2var : ', o2Var.length);

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

        console.log('chkkkkk : ', chk);
        if (chk) {
          checkSameObjectinCart(cartt, data);
        } else {
          onAddCartdftitem(cartt, 'push', objj);
        }
      } else {
        onAddCartdftitem(cartt, 'push', objj);
        return;
      }
    } else {
      onAddCartdftitem(cartt, '', objj);
      return;
    }
  };

  const onAddCartdftitem = (cartt, chk, objj) => {
    if (chk != 'push') {
      let arr = [];
      arr.push(objj);
      cartt.data = arr;
      store.User.setcart(cartt);
      onPressModalCancel();
    } else {
      cartt.data.push(objj);
      store.User.setcart(cartt);
      onPressModalCancel();
    }
  };

  const onPressModaladdcart = () => {
    if (!isReqFieldEmpty) {
      addProductinCart();
    } else {
      toast?.current?.show('Select required options', toastduration);
    }
  };

  const sep = () => {
    return (
      <View
        style={{
          width: '100%',
          backgroundColor: 'silver',
          height: 0.6,
          marginVertical: 10,
          alignSelf: 'center',
        }}
      />
    );
  };

  const showUNselectVariationCard = (e, i, a) => {
    let name = e.name || '----';
    let isrequire = e.isRequired;
    let t = isrequire ? 'Required' : 'Optional';
    if (t == 'Required') {
      isReqFieldEmpty = true;
    }

    let obj = {
      name: e.name,
      index: i,
      data: e.details,
      multi: e.multi_selection,
    };

    return (
      <>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => {
            store.Food.setselectedvariationDetail(obj);
            store.User.setisVarModal(true);
          }}>
          <View style={styles.selectionSection1}>
            <View style={{width: '70%'}}>
              <Text style={styles.headerSectionText1}>{name}</Text>
            </View>
            <View
              style={{
                width: '25%',
                alignItems: 'flex-end',
              }}>
              <View style={styles.chooseButton}>
                <Text style={styles.chooseButtonText}>Choose</Text>
              </View>
            </View>
          </View>
          <View style={styles.selectionSection2}>
            <Text
              style={[
                styles.selectionSectionText2,
                {
                  color: isrequire
                    ? theme.color.addcartModalButton
                    : theme.color.addcartModalHeader,
                },
              ]}>
              {t}
            </Text>
          </View>
        </TouchableOpacity>
        {i < a.length - 1 && sep()}
      </>
    );
  };

  const showSelectedVariationCard = (e, obj, t) => {
    let name = '';
    let value = '';
    let price = 0;

    if (e.length > 0) {
      e.map((e, i, a) => {
        let coma = i < a.length - 1 ? ', ' : '';
        value = value + e.value + coma;
        price = price + e.price;
        name = e.variant;
      });
    } else {
      name = e.variant;
      value = e.value;
      price = e.price;
    }

    return (
      <>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => {
            store.Food.setselectedvariationDetail(obj);
            store.User.setisVarModal(true);
          }}>
          <View style={styles.selectionSection1}>
            <View style={{width: '70%'}}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.headerSectionText1}>
                {name}
              </Text>
            </View>
            <View
              style={{
                width: '25%',
                alignItems: 'flex-end',
              }}>
              <View style={styles.chooseButton}>
                <Text style={styles.chooseButtonText}>Change</Text>
              </View>
            </View>
          </View>
          <View style={styles.selectionSection2}>
            <Text
              style={[
                styles.selectionSectionText2,
                {color: theme.color.addcartModalSubText},
              ]}>
              {value}
            </Text>

            {price > 0 && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <View style={{width: '45%'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={[
                      styles.selectionSectionText2,
                      {color: theme.color.addcartModalSubText, fontSize: 12},
                    ]}>
                    Additional price
                  </Text>
                </View>
                <View
                  style={{
                    width: '50%',
                    alignItems: 'flex-end',
                  }}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={[
                      styles.selectionSectionText2,
                      {color: theme.color.addcartModalSubText, fontSize: 12},
                    ]}>
                    {price.toFixed()}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </TouchableOpacity>
        {t == 'a' && sep()}
      </>
    );
  };

  const renderVariation = () => {
    const c = baseV.map((e, i, a) => {
      let isinVar = false;

      let d = [];
      let obj = {
        name: e.name,
        index: i,
        data: e.details,
        multi: e.multi_selection,
      };

      if (variations.length > 0) {
        let arr = [];
        arr = variations.filter(function (item) {
          return item.variant.toLowerCase() === e.name.toLowerCase();
        });

        if (arr.length > 0) {
          isinVar = true;
          d = arr.length > 1 ? arr : arr[0];
        }
      }

      if (!isinVar) {
        isVarReqFieldEmpty = true;
      }

      return !isinVar
        ? showUNselectVariationCard(e, i, a)
        : showSelectedVariationCard(d, obj, '');
    });

    return c;
  };

  const renderAdditionalVariation = () => {
    const c = addV.map((e, i, a) => {
      let isinVar = false;
      let d = [];
      let obj = {
        name: e.name,
        index: i,
        data: e.details,
        multi: e.multi_selection,
      };

      if (variations.length > 0) {
        let arr = [];
        arr = variations.filter(function (item) {
          return item.variant.toLowerCase() === e.name.toLowerCase();
        });

        if (arr.length > 0) {
          isinVar = true;
          d = arr.length > 1 ? arr : arr[0];
        }
      }

      return !isinVar
        ? showUNselectVariationCard(e, i, a)
        : showSelectedVariationCard(d, obj, 'a');
    });

    return c;
  };

  const onPressAddItem = () => {
    let c = totalItems + 1;

    settotalItems(c);
  };

  const onPressSubItem = () => {
    if (totalItems > 1) {
      let c = totalItems - 1;
      settotalItems(c);
    }
  };

  if (variations.length > 0) {
    variations.map((e, i, a) => {
      totalPrice = totalPrice + e.price;
    });
  }

  return (
    <>
      <Modal
        style={{padding: 0, margin: 0}}
        backdropOpacity={0.4}
        onRequestClose={() => {
          store.User.setisAddModal(false);
        }}
        isVisible={isAddModal}>
        <View style={length > 5 ? styles.modalCont2 : styles.modalCont}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalHeaderText}>Customize item</Text>
          </View>

          <View style={styles.headerSection}>
            <Text style={styles.headerSectionText1}>{itemName}</Text>
            <View style={styles.headerSection2}>
              <View style={{width: '15%'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles.headerSectionText2}>
                  Price
                </Text>
              </View>
              <View style={{width: '75%', alignItems: 'flex-end'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={[styles.headerSectionText2, {textTransform: 'none'}]}>
                  {baseV.length <= 0 ? 'Rs. ' : 'from Rs. '}
                  {itemPrice.toFixed()}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.selectionHeader}>
            <Text style={styles.modalHeaderText}>please select</Text>
          </View>

          {length > 5 ? (
            <ScrollView style={styles.selectionSection}>
              {baseV.length > 0 && renderVariation()}
              {baseV.length > 0 && addV.length > 0 && sep()}
              {addV.length > 0 && renderAdditionalVariation()}
            </ScrollView>
          ) : (
            <View style={styles.selectionSection}>
              {baseV.length > 0 && renderVariation()}
              {baseV.length > 0 && addV.length > 0 && sep()}
              {addV.length > 0 && renderAdditionalVariation()}
            </View>
          )}

          {!isVarReqFieldEmpty && (
            <>
              <View style={styles.addSection}>
                <View style={{width: '30%'}}>
                  <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={onPressSubItem}>
                    <utils.vectorIcon.AntDesign
                      name="minussquare"
                      color={theme.color.cartbutton}
                      size={28}
                    />
                  </TouchableOpacity>
                </View>

                <View style={{width: '30%'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={styles.addSectionTitle}>
                    {totalItems}
                  </Text>
                </View>

                <View style={{width: '30%', alignItems: 'flex-end'}}>
                  <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={onPressAddItem}>
                    <utils.vectorIcon.AntDesign
                      name="plussquare"
                      color={theme.color.cartbutton}
                      size={28}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}

          <View style={styles.totalSection}>
            <View style={{width: '30%'}}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.totalText}>
                Total Price
              </Text>
            </View>

            <View style={{width: '60%', alignItems: 'flex-end'}}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.totalText}>
                {(totalPrice * totalItems).toFixed()}
              </Text>
            </View>
          </View>

          <View style={styles.modalBottomButton}>
            <TouchableOpacity
              onPress={onPressModalCancel}
              activeOpacity={0.7}
              style={styles.modalBottomButton1}>
              <Text style={styles.modalBottomButton1Text}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onPressModaladdcart}
              activeOpacity={0.7}
              style={styles.modalBottomButton2}>
              <Text style={styles.modalBottomButton2Text}>Add to cart</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Toast ref={toast} position="center" opacity={0.8} />
      </Modal>
    </>
  );
}

let padding = 2;
let Contentpadding = 7;
let br = 10;
let height = 4.5;

const styles = StyleSheet.create({
  modalCont: {
    borderRadius: br,
    backgroundColor: theme.color.addcartModalBackground,
    width: responsiveWidth(85),
    alignSelf: 'center',
  },
  modalCont2: {
    borderRadius: br,
    backgroundColor: theme.color.addcartModalBackground,
    width: responsiveWidth(85),
    height: responsiveHeight(50),
    alignSelf: 'center',
  },
  modalHeader: {
    backgroundColor: theme.color.addcartModalHeader,
    borderTopLeftRadius: br,
    borderTopRightRadius: br,
    paddingVertical: padding,
    paddingHorizontal: Contentpadding,
    justifyContent: 'center',
    width: '100%',
  },
  modalHeaderText: {
    color: theme.color.addcartModalHeaderText,
    fontSize: 16,
    fontFamily: theme.fonts.fontMedium,
    textTransform: 'uppercase',
  },
  headerSection: {
    padding: Contentpadding,
  },
  headerSection2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerSectionText1: {
    color: theme.color.addcartModalText,
    fontSize: 14,
    fontFamily: theme.fonts.fontMedium,
    textTransform: 'capitalize',
    width: '100%',
  },
  headerSectionText2: {
    color: theme.color.addcartModalSubText,
    fontSize: 13,
    fontFamily: theme.fonts.fontMedium,
    textTransform: 'capitalize',
    lineHeight: 15,
  },
  selectionHeader: {
    backgroundColor: theme.color.addcartModalHeader,

    paddingVertical: padding,
    paddingHorizontal: Contentpadding,
    justifyContent: 'center',
    width: '100%',
  },
  selectionSection: {
    paddingVertical: padding + 8,
    paddingHorizontal: Contentpadding,
  },
  selectionSection1: {
    flexDirection: 'row',

    justifyContent: 'space-between',
  },
  selectionSection2: {
    width: '100%',
  },
  selectionSectionText2: {
    color: theme.color.addcartModalButton,
    fontSize: 13,

    fontFamily: theme.fonts.fontMedium,
    textTransform: 'capitalize',
    lineHeight: 18,
  },
  totalSection: {
    backgroundColor: theme.color.addcartModalTotalBackground,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Contentpadding,
    marginTop: 15,
    width: '100%',
    paddingVertical: padding + 2,
  },
  totalText: {
    color: theme.color.addcartModalButton,
    fontSize: 13,
    fontFamily: theme.fonts.fontMedium,

    textTransform: 'capitalize',
    lineHeight: 18,
  },

  addSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Contentpadding,
    marginTop: 10,
    width: '100%',
    paddingVertical: padding,
    backgroundColor: theme.color.background,
  },

  addSectionTitle: {
    fontSize: 14,
    fontFamily: theme.fonts.fontMedium,
    color: theme.color.addcartModalText,
    lineHeight: 26,
    textTransform: 'capitalize',
    textAlign: 'center',
  },

  modalBottomButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: responsiveHeight(height),
    width: '100%',
  },
  modalBottomButton1: {
    width: '40%',
    height: '100%',
    backgroundColor: theme.color.addcartModalHeader,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: br,
  },
  modalBottomButton1Text: {
    color: theme.color.addcartModalHeaderText,
    fontSize: 16,
    fontFamily: theme.fonts.fontMedium,
    textTransform: 'capitalize',
  },
  modalBottomButton2: {
    width: '60%',
    height: '100%',

    backgroundColor: '#f27f33',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomRightRadius: br,
  },
  modalBottomButton2Text: {
    color: theme.color.addcartModalButtonText,
    fontSize: 16,
    fontFamily: theme.fonts.fontMedium,
    textTransform: 'capitalize',
  },
  chooseButton: {
    width: 52,
    height: 22,
    borderRadius: 4,
    backgroundColor: theme.color.button1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chooseButtonText: {
    color: theme.color.addcartModalButtonText,
    fontSize: 11,
    fontFamily: theme.fonts.fontMedium,
    textTransform: 'capitalize',
  },

  selectionSectionshow: {},
  selectionSectionshow2: {
    flexDirection: 'row',
    alignItem: 'center',
    justifyContent: 'space-between',
  },
});
