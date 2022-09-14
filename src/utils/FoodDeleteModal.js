import React, {useRef, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Image,
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

export default observer(FoodDeleteModal);
function FoodDeleteModal(props) {
  const d = props.data;
  let pid = d._id;
  const toast = useRef(null);
  const toastduration = 700;
  let isSubModal = store.User.isSubModal;
  const cart = store.User.cart;
  let baseV = d.base_variation || [];
  let addV = d.additional_variation || [];
  let itemName = d.title || '---';

  let totalPrice = 0;
  let items = 0;

  const [cartt, setcartt] = useState({...cart});
  const [data, setdata] = useState([]);

  useEffect(() => {
    if (cartt.data.length > 0) {
      let dd = cartt.data;
      let arr = [];

      dd.filter(function (item, index) {
        if (item.productId === pid) {
          const obj = {...item, cindex: index};
          arr.push(obj);
        }
      });

      setdata(arr);
    }
  }, [cartt]);

  if (data.length > 0) {
    data.map((e, i, a) => {
      if (e.quantity > 0) {
        totalPrice = totalPrice + e.bill;
      }
    });
  }

  const onPressModalCancel = () => {
    store.User.setisSubModal(false);
  };

  const onPressSubItem = (dind, cind) => {
    let objIndex = dind;
    const da = data.slice();

    if (objIndex >= 0) {
      let q = da[objIndex].quantity - 1;
      da[objIndex].quantity = q;
      da[objIndex].cindex = cind;
      da[objIndex].bill = q * da[objIndex].firstBill || da[objIndex].price;
      setdata(da);
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

  const onPressModalUpdatecart = () => {
    let di = [];
    let crt = {...cart};

    data.map((e, i, a) => {
      let ci = e.cindex;
      const obj = {...e};
      delete obj.cindex;

      if (e.quantity == 0) {
        di.push(ci);
      } else {
        if (crt.data.length > 0) {
          crt.data[ci] = obj;
        }
      }
    });

    if (di.length > 0) {
      let c = 0;
      di.map((e, i, a) => {
        c = e;
        if (crt.data.length > 0) {
          if (i > 0) {
            c = e - 1;
          }
          crt.data.splice(c, 1);
        }
      });
      store.User.setcart(crt);
      store.User.setisSubModal(false);
    } else {
      store.User.setcart(crt);
      store.User.setisSubModal(false);
    }
  };

  const renderShowItem = () => {
    const f = data.map((e, i, a) => {
      let index = i;
      let cindex = e.cindex;
      let quantity = e.quantity;
      let vartns = e.variants;

      if (quantity > 0) {
        return (
          <>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 7,
                marginTop: i == 0 ? 10 : 0,
                // backgroundColor: 'yellow',
              }}>
              <View
                style={{
                  width: '65%',
                  // backgroundColor: 'red',
                }}>
                {vartns.length > 0 && renderVaR(vartns)}
              </View>

              <TouchableOpacity
                activeOpacity={0.6}
                disabled={quantity <= 0 ? true : false}
                onPress={() => onPressSubItem(index, cindex)}>
                <utils.vectorIcon.AntDesign
                  name="minussquare"
                  color={theme.color.cartbutton}
                  size={27}
                />
              </TouchableOpacity>

              <View
                style={{
                  width: 34,
                  height: 27,
                  padding: 3,
                  borderRadius: 3,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 0.6,
                  borderColor: theme.color.addcartModalText,
                }}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={[styles.title2, {fontFamily: theme.fonts.fontBold}]}>
                  {quantity}
                </Text>
              </View>

              <Image
                style={{
                  width: 30,
                  height: 27,

                  borderRadius: 3,
                }}
                resizeMode="contain"
                source={require('../assets/images/gif/delete.gif')}
              />
            </View>

            {i < a.length - 1 && sep()}
          </>
        );
      }
    });

    return f;
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
              value = value + item.value + ', ';
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
          <Text
            style={{
              textTransform: 'capitalize',
              fontFamily: theme.fonts.fontMedium,
              fontSize: 12,
              color: theme.color.title,
            }}>
            {BaseVar}:{' '}
          </Text>
          <Text
            style={{
              fontFamily: theme.fonts.fontNormal,
              fontSize: 12,
              color: theme.color.subTitle,
            }}>
            {Value}
          </Text>
        </>
      );
    });

    return v;
  };

  return (
    <>
      <Modal
        style={{padding: 0, margin: 0}}
        backdropOpacity={0.4}
        onRequestClose={() => {
          store.User.setisSubModal(false);
        }}
        isVisible={isSubModal}>
        <View style={data.length < 3 ? styles.modalCont : styles.modalCont2}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalHeaderText}>Customize item</Text>
          </View>

          {data.length > 0 ? (
            <ScrollView>
              <View style={styles.headerSection}>
                <Text style={styles.headerSectionText1}>{itemName}</Text>
                <View style={styles.headerSection2}></View>
              </View>
              {data.length > 0 && renderShowItem()}
            </ScrollView>
          ) : (
            <View style={styles.headerSection}>
              <Text style={styles.dataSectionEmpty}>No item found.</Text>
            </View>
          )}

          {data.length > 0 && (
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
                  {totalPrice.toFixed()}
                </Text>
              </View>
            </View>
          )}

          <View style={styles.modalBottomButton}>
            <TouchableOpacity
              onPress={onPressModalCancel}
              activeOpacity={0.7}
              style={styles.modalBottomButton1}>
              <Text style={styles.modalBottomButton1Text}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onPressModalUpdatecart}
              activeOpacity={0.7}
              style={styles.modalBottomButton2}>
              <Text style={styles.modalBottomButton2Text}>Update</Text>
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
  headerSection2: {},
  headerSectionText1: {
    color: theme.color.addcartModalText,
    fontSize: 15,
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
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectionSection2: {
    // flexDirection: 'row',
    // alignItems: 'center',
    // justifyContent: 'space-between',
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
    marginTop: 12,
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
    backgroundColor: theme.color.addcartModalButton,
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
    width: 50,
    height: 22,
    borderRadius: 4,
    backgroundColor: theme.color.addcartModalButton,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chooseButtonText: {
    color: theme.color.addcartModalButtonText,
    fontSize: 10,
    fontFamily: theme.fonts.fontMedium,
    textTransform: 'capitalize',
  },

  selectionSectionshow: {},
  selectionSectionshow2: {
    flexDirection: 'row',
    alignItem: 'center',
    justifyContent: 'space-between',
  },
  dataSectionEmpty: {
    textAlign: 'center',
    marginVertical: '5%',
    color: theme.color.addcartModalSubText,
  },
  varCard: {
    width: '100%',
    padding: 10,
    flexDirection: 'row',

    justifyContent: 'space-between',
  },
  title: {
    fontSize: 12,
    color: theme.color.addcartModalText,
    fontFamily: theme.fonts.fontMedium,
    textTransform: 'capitalize',
    lineHeight: 20,
  },
  title2: {
    fontSize: 12,
    color: theme.color.addcartModalText,
    fontFamily: theme.fonts.fontNormal,
    textTransform: 'capitalize',
    lineHeight: 18,
  },
});
