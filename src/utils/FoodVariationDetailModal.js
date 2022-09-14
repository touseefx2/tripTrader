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
import store from '../store/index';
import {observer} from 'mobx-react';
import Modal from 'react-native-modal';
import Toast from 'react-native-easy-toast';

export default observer(FoodVariationDetailModal);
function FoodVariationDetailModal(props) {
  const toast = useRef(null);
  const toastduration = 700;

  const d = props.data?.data || [];
  const name = props.data?.name || '';
  let multiSel = props.data?.multi || false;
  const index = props.data?.index || 0;
  let optn = !multiSel
    ? 'Please select any one option'
    : 'You may select multiple options';
  let singleOption = !multiSel ? true : false;

  const [sel, setsel] = useState(false);

  let isVisible = store.User.isVarModal;

  const onPressModalCancel = () => {
    store.User.setisVarModal(false);
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

  const select = e => {
    setsel(e);
  };

  const selectMulti = e => {
    let cc = [];

    if (sel && sel.length > 0) {
      let index = sel.findIndex(item => item._id === e._id);
      console.log('index : ', index);
      if (index >= 0) {
        let r = sel.slice();
        r.splice(index, 1);
        setsel(r);
        return;
      }

      let a = sel.slice();
      a.push(e);
      setsel(a);
      return;
    }

    cc.push(e);
    setsel(cc);
  };

  const renderShowDataSingle = () => {
    const c = d.map((e, i, a) => {
      let name = e.name || '';
      let price = e.price || 0;

      let ischk = false;
      if (sel) {
        ischk = sel._id == e._id ? true : false;
      }

      return (
        <>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
              select(e);
            }}>
            <View style={styles.selectionSection1}>
              <View
                style={{
                  width: price > 0 ? '56%' : '80%',
                }}>
                <Text style={styles.headerSectionText1}>{name}</Text>
              </View>
              {price > 0 && (
                <View
                  style={{
                    width: '30%',
                    alignItems: 'flex-end',
                  }}>
                  <Text style={styles.headerSectionText1}>Rs. {price}</Text>
                </View>
              )}

              <View
                style={{
                  width: '8%',
                  alignItems: 'flex-end',
                }}>
                {ischk && (
                  <utils.vectorIcon.AntDesign
                    name="check"
                    size={17}
                    color="green"
                  />
                )}
              </View>
            </View>
          </TouchableOpacity>

          {i < a.length - 1 && sep()}
        </>
      );
    });
    return c;
  };

  const renderShowDataMulti = () => {
    const c = d.map((e, i, a) => {
      let name = e.name || '';
      let price = e.price || 0;

      let ischk = false;
      if (sel && sel.length > 0) {
        let arr = [];
        arr = sel.filter(function (item) {
          return item._id === e._id;
        });

        if (arr.length > 0) {
          ischk = true;
        }
      }

      return (
        <>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
              selectMulti(e);
            }}>
            <View style={styles.selectionSection1}>
              <View
                style={{
                  width: price > 0 ? '56%' : '80%',
                }}>
                <Text style={styles.headerSectionText1}>{name}</Text>
              </View>
              {price > 0 && (
                <View
                  style={{
                    width: '30%',
                    alignItems: 'flex-end',
                  }}>
                  <Text style={styles.headerSectionText1}>Rs. {price}</Text>
                </View>
              )}

              <View
                style={{
                  width: '8%',
                  alignItems: 'flex-end',
                }}>
                {ischk && (
                  <utils.vectorIcon.AntDesign
                    name="check"
                    size={17}
                    color="green"
                  />
                )}
              </View>
            </View>
          </TouchableOpacity>

          {i < a.length - 1 && sep()}
        </>
      );
    });
    return c;
  };

  const onPressConfirm = () => {
    if (!sel) {
      toast?.current?.show('Select an option', toastduration);
      return;
    }

    if (sel.length <= 0) {
      toast?.current?.show('Select an option', toastduration);
      return;
    }

    let variations = store.Food.variations;
    if (variations.length > 0) {
      if (singleOption) {
        const obj = {
          variant: name,
          value: sel.name,
          price: sel.price,
          _id: sel._id,
        };

        let d = variations.slice();
        let arr = [];
        arr = d.filter(function (item) {
          return item._id === obj._id;
        });

        if (arr.length > 0) {
          store.User.setisVarModal(false);
          return;
        }

        let index = d.findIndex(
          item => item.variant.toLowerCase() == obj.variant.toLowerCase(),
        );
        if (index >= 0) {
          variations.splice(index, 1);
        }

        let aarr = variations.slice();
        aarr.push(obj);
        store.Food.setvariations(aarr);
        store.User.setisVarModal(false);
      } else {
        if (sel.length > 0) {
          let varnt = name;

          let data = variations.slice();

          let adata = [];
          if (data.length > 0) {
            data.map((e, i, a) => {
              if (e.variant.toLowerCase() != varnt.toLowerCase()) {
                adata.push(e);
              }
            });
          }

          sel.map((e, i, a) => {
            const obj = {
              variant: name,
              value: e.name,
              price: e.price,
              _id: e._id,
            };
            adata.push(obj);
          });

          store.Food.setvariations(adata);
          store.User.setisVarModal(false);

          return;
        }
      }
    } else {
      if (singleOption) {
        const obj = {
          variant: name,
          value: sel.name,
          price: sel.price,
          _id: sel._id,
        };
        let arr = [];
        arr.push(obj);
        store.Food.setvariations(arr);
        store.User.setisVarModal(false);
        return;
      } else {
        if (sel.length > 0) {
          let arr = [];
          sel.map((e, i, a) => {
            const obj = {
              variant: name,
              value: e.name,
              price: e.price,
              _id: e._id,
            };
            arr.push(obj);
          });
          store.Food.setvariations(arr);
          store.User.setisVarModal(false);
          return;
        }
      }
    }
  };

  return (
    <>
      <Modal
        style={{padding: 0, margin: 0}}
        backdropOpacity={0.5}
        onRequestClose={() => {
          store.User.setisVarModal(false);
        }}
        isVisible={isVisible}>
        <View style={d.length <= 0 ? styles.modalCont : styles.modalCont2}>
          <View style={styles.modalHeader}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.modalHeaderText}>
              {name}
            </Text>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.modalHeaderText2}>
              {optn}
            </Text>
          </View>

          {d.length > 0 ? (
            <ScrollView>
              <View style={styles.dataSection}>
                {singleOption ? renderShowDataSingle() : renderShowDataMulti()}
              </View>
            </ScrollView>
          ) : (
            <View style={styles.dataSection}>
              <Text style={styles.dataSectionEmpty}>No item found.</Text>
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
              onPress={onPressConfirm}
              activeOpacity={0.7}
              style={styles.modalBottomButton2}>
              <Text style={styles.modalBottomButton2Text}>confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Toast ref={toast} position="center" opacity={0.8} />
      </Modal>
    </>
  );
}

let padding = 2;
let Contentpadding = 15;
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
  modalHeaderText2: {
    color: theme.color.addcartModalHeaderText,
    fontSize: 12,
    fontFamily: theme.fonts.fontMedium,
    lineHeight: 16,
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
    fontSize: 13,
    fontFamily: theme.fonts.fontMedium,
    textTransform: 'capitalize',
  },
  headerSectionText2: {
    color: theme.color.addcartModalSubText,
    fontSize: 13,
    fontFamily: theme.fonts.fontMedium,
    textTransform: 'capitalize',
    lineHeight: 15,
  },

  dataSection: {
    padding: Contentpadding,
  },
  dataSectionEmpty: {
    textAlign: 'center',
    marginVertical: '5%',
    color: theme.color.addcartModalSubText,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectionSectionText2: {
    color: theme.color.addcartModalButton,
    fontSize: 13,
    fontFamily: theme.fonts.fontMedium,
    textTransform: 'capitalize',
    lineHeight: 15,
  },
  totalSection: {
    backgroundColor: theme.color.addcartModalTotalBackground,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Contentpadding,
    marginTop: 15,
    width: '100%',
    paddingVertical: padding,
  },
  totalText: {
    color: theme.color.addcartModalButton,
    fontSize: 13,
    fontFamily: theme.fonts.fontMedium,
    textTransform: 'capitalize',
    lineHeight: 18,
  },

  modalBottomButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: responsiveHeight(height),
    width: '100%',
    marginTop: 15,
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
});
