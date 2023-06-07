import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  Alert,
  Keyboard,
  StatusBar,
  KeyboardAvoidingView,
  BackHandler,
  Platform,
} from 'react-native';
import {styles} from './styles';
import {observer} from 'mobx-react';
import store from '../../store/index';
import utils from '../../utils/index';
import theme from '../../theme';
import {
  responsiveFontSize,
  responsiveHeight,
} from 'react-native-responsive-dimensions';
import Toast from 'react-native-easy-toast';
import NetInfo from '@react-native-community/netinfo';
import {Notification} from '../../services/Notification';

import {
  StripeProvider,
  CardField,
  useStripe,
} from '@stripe/stripe-react-native';

export default observer(Plan);
function Plan(props) {
  const {confirmPayment} = useStripe();

  const mobileReg = /^[0][3]\d{9}$/;
  const emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
  const cnicReg = /\d{5}\d{8}\d/;

  const toast = useRef(null);
  const toastduration = 700;

  let user = store.User.user;
  let token = store.User.authToken;

  let loader = store.User.regLoader;

  const [isPage, setisPage] = useState(1);

  const [isShowTermsAndConditions, setIsShowTermsAndConditions] =
    useState(false);

  const [cfn, setcfn] = useState('');
  const [Emptycfn, setEmptycfn] = useState(false);
  const [isValidCard, setisValidCard] = useState('null');
  const [cardErr, setcardErr] = useState('');
  const [cn, setcn] = useState('');
  const [ld, setld] = useState(''); //last 4 digit
  const [ct, setct] = useState(''); //card type
  const [ce, setce] = useState('');
  const [ccvc, setccvc] = useState('');
  const [inValidcn, setinValidcn] = useState(false);
  const [inValidce, setinValidce] = useState(false);
  const [inValidccvc, setinValidccvc] = useState(false);
  const [pc, setpc] = useState('');
  const [isShowPromoFiled, setisShowPromoFiled] = useState(false);
  const [isPromoApply, setisPromoApply] = useState(false);
  const [promoValue, setpromoValue] = useState(0);

  const [iscTerms, setiscTerms] = useState(false);
  const [EmptycTerms, setEmptycTerms] = useState(false);
  const [errorMessage, seterrorMessage] = useState('');

  const [plan, setPlan] = useState(false);

  const [monthly, setmonthly] = useState(0);
  const [annualy, setannualy] = useState(0);
  const [save, setsave] = useState(0);
  const [totalAnually, settotalAnually] = useState(0);

  const plans = store.User.plans;

  function toFixed(num, fix) {
    var re = new RegExp('^-?\\d+(?:.\\d{0,' + (fix || -1) + '})?');
    return num.toString().match(re)[0];
  }

  useEffect(() => {
    if (plan) {
      let monthly = 0;
      let annualy = 0;
      if (plans && plans.data.length > 0) {
        plans.data.map((e, i, a) => {
          if (e.type == 'annual') {
            annualy = e.charges;
          }
          if (e.type == 'monthly') {
            monthly = e.charges;
          }
        });
      }
      let aa = annualy * 12;
      let ta = aa - 0.01;
      setmonthly(monthly);
      setannualy(annualy);
      settotalAnually(ta);

      if (isPromoApply) {
        let p = (isPromoApply.discount || 0) / 100;
        let discount = 0;
        if (plan.type == 'monthly') {
          discount = monthly - p * monthly;
        }
        if (plan.type == 'annual') {
          discount = totalAnually - p * totalAnually;
        }

        setpromoValue((discount + 0.01).toFixed(2));
      }
    }
  }, [plan, isPromoApply]);

  useEffect(() => {
    if (plans && plans.data.length > 0) {
      setPlan(plans.data[0]);
      if (plans.annual_discount) {
        setsave(plans.annual_discount);
      }
    }
  }, [plans]);

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
  }, [isPage]);

  function handleBackButtonClick() {
    if (!props.navigation.isFocused()) {
      return false;
    } else {
      goBack();

      return true;
    }
  }

  const goBack = () => {
    if (isPage == 1) {
      props.navigation.goBack();
    } else if (isPage == 2) {
      clearCard();
    }
  };

  const clearCard = () => {
    setisPage(1);
    setcfn('');
    setccvc('');
    setcn('');
    setce('');
    setct('');
    setld('');
    setpc('');
    setcardErr('');
    setEmptycfn(false);
    setisShowPromoFiled(false);
    setisPromoApply(false);
    setiscTerms(false);
    setpromoValue(0);
    setinValidccvc('null');
    setinValidce('null');
    setinValidcn('null');
    setisValidCard('null');
  };

  const setErrMessage = c => {
    seterrorMessage(c);
  };

  const subscribePlan = () => {
    Keyboard.dismiss();

    if (cfn == '') {
      setEmptycfn(true);
      return;
    }

    if (isValidCard == 'null') {
      setcardErr('Please enter card number');
      setisValidCard(false);
      return;
    }

    if (isValidCard == false) {
      if (!inValidcn) {
        setcardErr('Invalid card number');
        setisValidCard(false);
        return;
      }

      if (!inValidce) {
        setcardErr('Invalid card expiry');
        setisValidCard(false);
        return;
      }

      if (!inValidccvc) {
        setcardErr('Invalid card cvc');
        setisValidCard(false);
        return;
      }
    }

    if (isValidCard == true) {
      if (iscTerms == false) {
        setEmptycTerms(true);
        return;
      }

      let tv = plan.type == 'annual' ? totalAnually : monthly;
      tv = isPromoApply ? promoValue : tv;
      let pda = 0;
      if (isPromoApply) {
        let p = (isPromoApply.discount || 0) / 100;

        if (plan.type == 'monthly') {
          pda = p * monthly;
        }
        if (plan.type == 'annual') {
          pda = p * totalAnually;
        }
      }
      let subscription = !isPromoApply
        ? {
            title: plan.type,
            charges: plan.charges,
            discount: plan.discount,
            startDate: new Date(),
            endDate: addMonths(new Date(), plan.type == 'annual' ? 12 : 1),
            amtPaid: tv,
            status: 'active',
            lastDigit: ld,
            cardBrand: ct,
          }
        : {
            title: plan.type,
            charges: plan.charges,
            discount: plan.discount,
            startDate: new Date(),
            endDate: addMonths(new Date(), plan.type == 'annual' ? 12 : 1),
            amtPaid: tv,
            status: 'active',
            promoCode: isPromoApply.code,
            promoCodeDiscount: isPromoApply.discount,
            promoCodeDiscountAmt: pda,
            lastDigit: ld,
            cardBrand: ct,
          };

      const obj = {
        subscription: subscription,
        subscriptionStatus: 'paid',
      };

      NetInfo.fetch().then(state => {
        if (state.isConnected) {
          const body = {
            email: store.User.user.email,
            description: plan?.type,
            amount: tv * 100,
          };
          if (user.customerId && user.customerId != '') {
            body.customerId = user.customerId;
          }

          store.User.BuyPlan(body, obj, SucGetClientsecret);
        } else {
          // seterrorMessage('Please connect internet');
          Alert.alert('', 'Please connect internet');
        }
      });

      return;
    }
  };

  const SucGetClientsecret = async (dt, obj) => {
    try {
      const {error, paymentIntent} = await confirmPayment(dt.cs, {
        // paymentMethodType: 'Card', //strip > 0.5.0
        type: 'Card', //stripe <= 0.5.0
        billingDetails: {name: cn},
      });

      if (error) {
        store.User.setregLoader(false);
        Notification.sendPaymentFailedNotification(store.User.user._id);
        console.log(`confirmPayment error: `, error);
        Alert.alert(`Payment ${error.code}`, error.message);
      } else if (paymentIntent) {
        console.log(`confirmPayment response: true`);
        // paymentIntent
        // Alert.alert(`Success`, `Payment Succefull: ${paymentIntent.id}`);

        if (user.customerId && user.customerId != '') {
        } else {
          obj.customerId = dt.cid;
        }

        store.User.SubPlan(
          obj,
          user._id,
          dt.cid,
          token,
          setErrMessage,
          subPlanSuc,
        );
      }
    } catch (err) {
      store.User.setregLoader(false);
      Notification.sendPaymentFailedNotification(store.User.user._id);
      console.log(`confirmPayment cath error: `, err);
    }
  };

  const applyPromo = () => {
    Keyboard.dismiss();
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        store.User.applyPromo(pc, setErrMessage, applyPromoSuc);
      } else {
        // seterrorMessage('Please connect internet');
        Alert.alert('', 'Please connect internet');
      }
    });
  };

  function addMonths(date, months) {
    var d = date.getDate();
    date.setMonth(date.getMonth() + +months);
    if (date.getDate() != d) {
      date.setDate(0);
    }
    return date;
  }

  const subPlanSuc = c => {
    store.User.setUser(c);
    props.navigation.goBack();
    // clearCard();
  };

  const applyPromoSuc = res => {
    setisPromoApply(res);
  };

  const renderShowFieldError = c => {
    let text = c == 'card' ? cardErr : '';

    if (c == 'fn') {
      text = invalidfn
        ? 'First name is invalid'
        : Emptyfn
        ? 'Please enter a first name'
        : '';
    }

    if (c == 'ln') {
      text = invalidln
        ? 'Last name is invalid'
        : Emptyln
        ? 'Please enter a last name'
        : '';
    }

    if (c == 'email') {
      text = invalidemail
        ? 'Email contains invalid characters'
        : Emptyemail
        ? 'Please enter email'
        : '';
    }

    if (c == 'dob') {
      text = Emptydob ? 'Please select your birth date' : '';
    }

    if (c == 'pswd') {
      text = invalidpswd
        ? 'Password must contains 8 or more characters'
        : Emptypswd
        ? 'Please enter password'
        : '';
    }

    if (c == 'terms') {
      text = EmptyTerms ? 'Agreeing to Terms and Conditions is required' : '';
    }

    if (c == 'cfn') {
      text = Emptycfn ? 'Please enter a full name' : '';
    }

    if (c == 'cterms') {
      text = EmptycTerms ? 'Agreeing to Terms and Conditions is required' : '';
    }

    return (
      <View style={styles.errorMessageFieldContainer}>
        <Text style={styles.errorMessageFieldText}>{text}</Text>
      </View>
    );
  };

  const renderSection2 = () => {
    // Methods

    const entercFn = t => {
      setEmptycfn(false);

      setcfn(t);
    };

    const enterpc = t => {
      setpc(t);
    };

    // const onChangeCard = t => {
    //   console.log('card : ', t);
    //   let valid = t.valid;
    //   let cnvalid = t.status.number;
    //   let cevalid = t.status.expiry;
    //   let ccvcvalid = t.status.cvc;
    //   setisValidCard(valid);
    //   setinValidcn(cnvalid);
    //   setinValidce(cevalid);
    //   setinValidccvc(ccvcvalid);
    //   let cn = t.values.number;
    //   let ce = t.values.expiry;
    //   let ccvc = t.values.cvc;
    //   let ct = t.values.type;
    //   setcn(cn);
    //   setce(ce);
    //   setccvc(ccvc);
    //   setct(ct);
    // };

    const onChangeCard = t => {
      console.log('card detials : ', t);
      setcardErr('');
      // let valid = t.complete;
      let valid = false;
      let cnvalid = t.validNumber == 'Valid' ? true : false;
      let cevalid = t.validExpiryDate == 'Valid' ? true : false;
      let ccvcvalid = t.validCVC == 'Valid' ? true : false;

      if (cnvalid && cevalid && ccvcvalid) {
        valid = true;
      }

      setisValidCard(valid);
      setinValidcn(cnvalid);
      setinValidce(cevalid);
      setinValidccvc(ccvcvalid);

      let ct = t.brand;
      let l4 = t.last4;
      setct(ct);
      setld(l4);
      // let cn = t.values.number;
      // let ce = t.values.expiry;
      // let ccvc = t.values.cvc;
      // setcn(cn);
      // setce(ce);
      // setccvc(ccvc);
    };

    const Skip = () => {
      if (isPhoto1Upload == 0) {
        setisPhotoUpload(true);
        setisPhoto1Upload(1);
      }

      if (isPhoto1Upload == 1) {
        setisCnicFrontUplaod(true);
        setisPhoto1Upload(2);
      }
    };

    const clearCard = () => {
      setEmptycfn(false);
      setisPromoApply(false);
      setisShowPromoFiled(false);
      setpc('');
      setpromoValue(0);
      setcfn('');
      setcardErr('');
      setct('');
      setisValidCard('null');
      setinValidce('null');
      setinValidccvc('null');
      setinValidcn('null');
    };

    const changePlan = () => {
      goBack();
    };

    const TermsnCndtnClickCard = () => {
      NetInfo.fetch().then(state => {
        if (state.isConnected) {
          setIsShowTermsAndConditions(true);
        } else {
          Alert.alert('Network Error', 'Please connect internet.');
        }
      });
    };

    // Render

    const renderButtonPlan = () => {
      return (
        <>
          <TouchableOpacity
            onPress={() => {
              setisPage(2);
            }}
            activeOpacity={0.9}
            style={[
              styles.BottomButton,
              {marginTop: 0, width: '60%', height: 55},
            ]}>
            <Text style={[styles.buttonTextBottom, {fontSize: 14}]}>
              choose {plan.type} plan
            </Text>
          </TouchableOpacity>
        </>
      );
    };

    const renderButtonSubscribe = () => {
      return (
        <>
          <TouchableOpacity
            onPress={subscribePlan}
            activeOpacity={0.7}
            style={styles.BottomButton}>
            <Text style={styles.buttonTextBottom}>Subscribe</Text>
          </TouchableOpacity>
        </>
      );
    };

    // const renderCross = c => {

    //   return (
    //     <TouchableOpacity
    //       onPress={() => onClickCross(c)}
    //       activeOpacity={0.7}
    //       style={{
    //         width: 16,
    //         height: 16,
    //         borderRadius: 16 / 2,
    //         backgroundColor: theme.color.button1,
    //         alignItems: 'center',
    //         justifyContent: 'center',
    //         position: 'absolute',
    //         right: -6,
    //         top: -7,
    //       }}>
    //       <utils.vectorIcon.Entypo
    //         name="cross"
    //         color={theme.color.buttonText}
    //         size={14}
    //       />
    //     </TouchableOpacity>
    //   );
    // };

    const renderShowError2 = c => {
      let text = c == 'Profile' ? 'Please upload photo' : '';

      return (
        <View style={styles.errorMessageContainer}>
          <Text style={styles.errorMessageText}>{text}</Text>
        </View>
      );
    };

    const renderPlanBar = () => {
      const p = plans.data.map((e, i, a) => {
        let name = e.type || '';

        return (
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
              setPlan(e);
            }}
            style={{
              paddingHorizontal: 12,
              height: 37,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor:
                plan.type == name
                  ? theme.color.button1
                  : theme.color.disableBack,
              borderTopLeftRadius: i == 0 ? 8 : 0,
              borderBottomLeftRadius: i == 0 ? 8 : 0,
              borderTopRightRadius: i == a.length - 1 ? 8 : 0,
              borderBottomRightRadius: i == a.length - 1 ? 8 : 0,
            }}>
            <Text
              style={{
                fontSize: 13,
                color:
                  plan.type == name
                    ? theme.color.buttonText
                    : theme.color.subTitle,
                fontFamily: theme.fonts.fontMedium,
                textTransform: 'capitalize',
              }}>
              {name}
            </Text>
          </TouchableOpacity>
        );
      });

      return p;
    };

    const renderPlanDetails = () => {
      const pd = plan.features.map((e, i, a) => {
        let feature = e;

        return (
          <View
            style={{
              flexDirection: 'row',
              marginTop: 2,
              width: '100%',
            }}>
            <utils.vectorIcon.Entypo name="check" color={'#16953A'} size={20} />
            <Text
              style={{
                fontSize: 14,
                color: theme.color.subTitleAuth,
                fontFamily: theme.fonts.fontNormal,
                marginLeft: 10,
                bottom: 1,
                opacity: 0.6,
              }}>
              {feature}
            </Text>
          </View>
        );
      });

      return pd;
    };

    return (
      <>
        {/* Plan 1 */}

        {isPage == 1 && (
          <View style={styles.section2}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={[
                    styles.section2Title1,
                    {textTransform: 'none', alignSelf: 'flex-start'},
                  ]}>
                  Choose a plan
                </Text>
                {/* {errorMessage !== '' && renderShowError()} */}
                <Text
                  style={[
                    styles.section2LogoTitle2c,
                    {alignSelf: 'flex-start'},
                  ]}>
                  Unlock all features with a subscription.
                </Text>
              </View>

              <View
                style={{
                  width: '100%',
                  alignSelf: 'center',
                  height: 0.6,
                  backgroundColor: theme.color.subTitleLight,
                  marginVertical: 15,
                  opacity: 0.5,
                }}
              />

              <View style={{marginTop: 7}}>
                {plans && plans.data && (
                  <>
                    <View
                      style={{
                        alignItems: 'center',
                        flexDirection: 'row',
                      }}>
                      {renderPlanBar()}
                    </View>
                  </>
                )}

                {plan && (
                  <>
                    <View style={{marginTop: 20}}>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text
                          style={{
                            fontSize: 26,
                            color: theme.color.title,
                            fontFamily: theme.fonts.fontBold,
                          }}>
                          $
                          {plan.type == 'annual' ? annualy.toFixed(2) : monthly}
                        </Text>
                        <Text
                          style={{
                            fontSize: 12,
                            color: theme.color.subTitleAuth,
                            fontFamily: theme.fonts.fontBold,
                            opacity: 0.6,
                            marginLeft: 5,
                          }}>
                          /month{' '}
                          {plan.type == 'annual' ? '(Billed annually)' : ''}
                        </Text>
                      </View>
                      {plan.type == 'annual' && (
                        <Text
                          style={{
                            fontSize: 12,
                            color: '#16953A',
                            fontFamily: theme.fonts.fontMedium,
                            textTransform: 'capitalize',
                            top: -5,
                          }}>
                          Best Value • ${toFixed(save, 0)} savings
                        </Text>
                      )}
                      {plan.type == 'monthly' && (
                        <>
                          {save > 0 && (
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                top: -5,
                              }}>
                              <Text
                                style={{
                                  fontSize: 12,
                                  color: '#767676',
                                  fontFamily: theme.fonts.fontMedium,
                                }}>
                                Save ${toFixed(save, 0)} with an
                              </Text>
                              <TouchableOpacity
                                activeOpacity={0.6}
                                onPress={() => {
                                  setPlan(plans.data[0]);
                                }}>
                                <Text
                                  style={{
                                    fontSize: 12,
                                    color: 'green',
                                    fontFamily: theme.fonts.fontMedium,
                                    marginLeft: 5,
                                  }}>
                                  Annual Plan
                                </Text>
                              </TouchableOpacity>
                            </View>
                          )}
                        </>
                      )}
                    </View>
                    {plan.features.length > 0 && (
                      <View style={{marginTop: 20}}>{renderPlanDetails()}</View>
                    )}
                  </>
                )}
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 25,
                }}>
                {renderButtonPlan()}
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    goBack();
                  }}>
                  <Text
                    style={[
                      styles.section2bottomTitle,
                      {
                        marginTop: 0,
                        marginLeft: 25,
                        fontSize: 14,
                        color: 'rgba(17, 17, 17, 0.6)',
                      },
                    ]}>
                    Try for free
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        )}

        {/* Payment 2 */}

        {isPage == 2 && (
          <View style={styles.section2}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={{}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={[
                    styles.section2Title1,
                    {textTransform: 'none', alignSelf: 'flex-start'},
                  ]}>
                  Payment Information
                </Text>
                {/* {errorMessage !== '' && renderShowError()} */}
                <Text
                  style={[
                    styles.section2LogoTitle2c,
                    {alignSelf: 'flex-start', marginTop: 5},
                  ]}>
                  Your subscription will start after you make your first payment
                  below.
                </Text>
              </View>
              <View
                style={{
                  width: '100%',
                  height: 0.6,
                  alignSelf: 'center',
                  marginVertical: 12,
                  backgroundColor: theme.color.subTitleLight,
                  opacity: 0.5,
                }}
              />
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    width: '100%',
                  }}>
                  <Text style={styles.paymenttitle1}>total due Now :</Text>
                  {!isPromoApply && (
                    <Text
                      style={[
                        styles.paymenttitle1,
                        {
                          color: theme.color.title,
                          width: '65%',
                          marginLeft: 5,
                          textTransform: 'none',
                        },
                      ]}>
                      {plan.type == 'annual'
                        ? `$${toFixed(totalAnually, 2)} ($${annualy.toFixed(
                            2,
                          )} /mo)`
                        : `$${monthly} /mo`}
                    </Text>
                  )}

                  {isPromoApply && (
                    <View
                      style={{
                        flexDirection: 'row',
                        marginLeft: 5,
                        width: '65%',
                      }}>
                      <Text
                        style={{
                          color: theme.color.title,
                          fontSize: 11,

                          fontFamily: theme.fonts.fontBold,
                          textTransform: 'capitalize',
                          textDecorationLine: 'line-through',
                        }}>
                        {plan.type == 'annual'
                          ? `$${toFixed(totalAnually, 2)}`
                          : `$${monthly}`}
                        {'  '}
                      </Text>

                      <Text
                        style={{
                          color: theme.color.titleGreen,
                          fontSize: 11,
                          fontFamily: theme.fonts.fontBold,
                          textTransform: 'capitalize',
                        }}>
                        ${promoValue} ({isPromoApply.discount}% discount)
                      </Text>
                    </View>
                  )}
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text style={styles.paymenttitle2}>your plan :</Text>
                  <Text
                    style={[
                      styles.paymenttitle2,
                      {
                        color: theme.color.title,
                        marginLeft: 5,
                      },
                    ]}>
                    {plan.type}
                  </Text>
                  <TouchableOpacity activeOpacity={0.6} onPress={changePlan}>
                    <Text
                      style={[
                        styles.paymenttitle2,
                        {
                          color: theme.color.titleGreen,
                          marginLeft: 10,
                          fontFamily: theme.fonts.fontNormal,
                          textDecorationLine: 'underline',
                        },
                      ]}>
                      change
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View>
                <View style={styles.Field}>
                  <Text style={styles.FieldTitle1}>full name</Text>
                  <TextInput
                    placeholder="Card holder’s first and last name"
                    value={cfn}
                    onChangeText={entercFn}
                    style={[
                      styles.FieldInput,
                      {
                        borderColor: Emptycfn
                          ? theme.color.fieldBordeError
                          : theme.color.fieldBorder,
                        fontSize: 12,
                        color: 'black',
                      },
                    ]}
                  />
                  {Emptycfn && renderShowFieldError('cfn')}
                </View>

                <View style={styles.Field}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={styles.FieldTitle1}>card</Text>
                  </View>

                  <CardField
                    postalCodeEnabled={false}
                    placeholders={{
                      number: 'Card number',
                    }}
                    cardStyle={{
                      textColor: theme.color.title,
                      fontSize: responsiveFontSize(1.5),
                      borderColor: theme.color.fieldBorder,
                      borderWidth: 1,
                      borderRadius: 8,
                      fontFamily: theme.fonts.fontNormal,
                    }}
                    style={{
                      width: '100%',
                      height: 45,
                    }}
                    onCardChange={cardDetails => {
                      onChangeCard(cardDetails);
                    }}
                    onFocus={focusedField => {
                      console.log('focusField', focusedField);
                    }}
                  />
                  {isValidCard == false && renderShowFieldError('card')}

                  {/* <View
                  style={[
                    [
                      styles.FieldInputCard,
                      {
                        borderColor:
                          isValidCard == false
                            ? theme.color.fieldBordeError
                            : isValidCard == true
                            ? theme.color.button1
                            : theme.color.fieldBorder,
                      },
                    ],
                  ]}>
                  <LiteCreditCardInput onChange={onChangeCard} />
                </View>
                {isValidCard == false && renderShowFieldError('card')} */}
                </View>

                {isShowPromoFiled && (
                  <View style={styles.Field}>
                    <Text style={styles.FieldTitle1}>promo code</Text>

                    {!isPromoApply && (
                      <View
                        style={[
                          styles.FieldInput,
                          {
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingHorizontal: 0,
                            borderWidth: 1,
                            borderColor: theme.color.fieldBorder,
                          },
                        ]}>
                        <TextInput
                          placeholder="Add a promo code"
                          value={pc}
                          onChangeText={enterpc}
                          style={{
                            fontSize: 13,

                            color: 'black',
                            width: '70%',
                            height: '100%',
                            paddingLeft: 10,
                          }}
                        />

                        {pc != '' && (
                          <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={applyPromo}
                            style={{
                              width: 60,
                              height: '100%',
                              borderTopRightRadius: 8,
                              borderBottomRightRadius: 8,
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: theme.color.button1,
                              paddingHorizontal: 3,
                            }}>
                            <Text
                              style={{
                                color: theme.color.buttonText,
                                fontSize: 13,
                                fontFamily: theme.fonts.fontMedium,
                              }}>
                              Apply
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    )}

                    {isPromoApply && (
                      <View
                        style={{
                          marginTop: 5,
                          alignItems: 'center',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <Text
                          numberOfLines={1}
                          ellipsizeMode="tail"
                          style={{
                            width: '50%',
                            color: theme.color.title,
                            fontSize: 12,
                            fontFamily: theme.fonts.fontMedium,
                            textTransform: 'uppercase',
                          }}>
                          {isPromoApply.code}
                        </Text>

                        <TouchableOpacity
                          activeOpacity={0.7}
                          onPress={() => setisPromoApply(false)}>
                          <Text
                            style={{
                              color: theme.color.titleGreen,
                              fontSize: 12,
                              fontFamily: theme.fonts.fontMedium,
                              textDecorationLine: 'underline',
                            }}>
                            Remove
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                )}

                {!isShowPromoFiled && (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setisShowPromoFiled(true)}
                    style={{marginTop: 20}}>
                    <Text
                      style={{
                        fontSize: 12,
                        color: theme.color.titleGreen,
                        fontFamily: theme.fonts.fontMedium,
                        textDecorationLine: 'underline',
                      }}>
                      I have a promo code
                    </Text>
                  </TouchableOpacity>
                )}

                <View style={{marginTop: 20}}>
                  <View
                    style={[styles.Field2, {justifyContent: 'space-between'}]}>
                    <TouchableOpacity
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 4,
                        backgroundColor: !iscTerms
                          ? 'white'
                          : theme.color.button1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 1,
                        borderColor: theme.color.fieldBorder,
                      }}
                      activeOpacity={0.5}
                      onPress={() => {
                        setiscTerms(!iscTerms);
                        setEmptycTerms(false);
                      }}>
                      {iscTerms && (
                        <utils.vectorIcon.FontAwesome5
                          name={'check'}
                          color={theme.color.buttonText}
                          size={11}
                        />
                      )}
                    </TouchableOpacity>

                    <View style={{width: '90%'}}>
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={TermsnCndtnClickCard}>
                        <Text style={styles.Field2Titlec}>
                          I agree to Trip Trader’s{' '}
                          <Text style={styles.Field2Titlecc}>
                            Terms & Conditions
                          </Text>
                        </Text>
                      </TouchableOpacity>
                      <Text style={[styles.Field2Titlec, {top: -3}]}>
                        and understand that upon clicking “Subscribe” below, I
                        will be charged{' '}
                        {plan.type == 'annual'
                          ? `$${toFixed(totalAnually, 2)}`
                          : `$${monthly}`}{' '}
                        {plan.type == 'annual' ? plan.type + 'y' : plan.type}.
                      </Text>
                    </View>
                  </View>
                  {EmptycTerms && renderShowFieldError('cterms')}
                </View>
              </View>

              {renderButtonSubscribe()}

              <TouchableOpacity activeOpacity={0.7} onPress={goBack}>
                <Text
                  style={[
                    styles.section2bottomTitle,
                    {color: 'rgba(17, 17, 17, 0.6)'},
                  ]}>
                  Cancel and go back
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        )}
      </>
    );
  };

  const renderStatusBar = () => {
    return (
      <>
        <StatusBar
          translucent={true}
          backgroundColor={'transparent'}
          barStyle={'light-content'}
        />
      </>
    );
  };

  return (
    <StripeProvider publishableKey={store.General.Stripe_Publish_Key}>
      <View style={styles.container}>
        <Image
          source={require('../../assets/images/background/img.png')}
          style={styles.container2}
        />
        <SafeAreaView style={styles.container3}>
          <utils.AuthHeader
            props={props}
            screen="plan"
            goBack={() => goBack()}
          />
          <KeyboardAvoidingView
            style={{
              flex: 1,
              paddingHorizontal: 15,
              marginTop: responsiveHeight(3),
            }}
            behavior={Platform.OS == 'ios' ? 'padding' : undefined}>
            {renderSection2()}
          </KeyboardAvoidingView>
        </SafeAreaView>

        <Toast ref={toast} position="center" />
        <utils.Loader load={loader} />

        {renderStatusBar()}
        {isShowTermsAndConditions && (
          <utils.WebViewModal
            link={store.General.Terms_and_Conditions_Link}
            isVisible={isShowTermsAndConditions}
            setisVisible={setIsShowTermsAndConditions}
          />
        )}
      </View>
    </StripeProvider>
  );
}
