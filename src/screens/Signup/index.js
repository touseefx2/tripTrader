import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';
import NetInfo from '@react-native-community/netinfo';
import auth from '@react-native-firebase/auth';
import {
  CardField,
  StripeProvider,
  useStripe,
} from '@stripe/stripe-react-native';
import {observer} from 'mobx-react';
import moment from 'moment';
import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  BackHandler,
  Image,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Image as ImageCompressor} from 'react-native-compressor';
import CountDown from 'react-native-countdown-component';
import DatePicker from 'react-native-date-picker';
import Toast from 'react-native-easy-toast';
import IntentLauncher from 'react-native-intent-launcher';
import * as RNLocalize from 'react-native-localize';
import Modal from 'react-native-modal';
import {ActivityIndicator} from 'react-native-paper';
import {check, PERMISSIONS, request} from 'react-native-permissions';
import RBSheet from 'react-native-raw-bottom-sheet';
import {responsiveHeight} from 'react-native-responsive-dimensions';
import {WebView} from 'react-native-webview';
import store from '../../store/index';
import theme from '../../theme';
import utils from '../../utils/index';
import {styles} from './styles';

export default observer(Signup);
function Signup(props) {
  let resendTime = 15; //second

  const {confirmPayment} = useStripe();
  const termsConditionLink =
    'http://triptraderweb.s3-website.ap-south-1.amazonaws.com/termsandconditionsapp';

  let internet = store.General.isInternet;
  const rbSheet = useRef(null);
  const mobileReg = /^[0][3]\d{9}$/;
  const emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
  const cnicReg = /\d{5}\d{8}\d/;

  const toast = useRef(null);
  const toastduration = 700;

  let loader = store.User.regLoader;

  const [isFinish, setFinish] = useState(false);

  const [isUserCreate, setisUserCreate] = useState(false);

  const [cfn, setcfn] = useState('');
  const [Emptycfn, setEmptycfn] = useState(false);
  const [isValidCard, setisValidCard] = useState('null');
  const [cardErr, setcardErr] = useState('');
  const [cn, setcn] = useState('');
  const [ld, setld] = useState(''); //last 4 digit
  const [ct, setct] = useState(''); //card type
  const [ce, setce] = useState('');
  const [ccvc, setccvc] = useState('');
  const [inValidcn, setinValidcn] = useState('null');
  const [inValidce, setinValidce] = useState('null');
  const [inValidccvc, setinValidccvc] = useState('null');
  const [pc, setpc] = useState('');
  const [isShowPromoFiled, setisShowPromoFiled] = useState(false);
  const [isPromoApply, setisPromoApply] = useState(false);
  const [promoValue, setpromoValue] = useState(0);

  const [fn, setfn] = useState('');
  const [Emptyfn, setEmptyfn] = useState(false);
  const [invalidfn, setinvalidfn] = useState(false);

  const [ln, setln] = useState('');
  const [Emptyln, setEmptyln] = useState(false);
  const [invalidln, setinvalidln] = useState(false);

  const [email, setemail] = useState('');
  const [Emptyemail, setEmptyemail] = useState(false);
  const [invalidemail, setinvalidemail] = useState(false);

  const [dob, setdob] = useState('');
  const [pudshow, setPUdShow] = useState(false);
  const [puTime, setPUTime] = useState(new Date());
  const [Emptydob, setEmptydob] = useState(false);

  const [pswd, setpswd] = useState('');
  const [Emptypswd, setEmptypswd] = useState(false);
  const [invalidpswd, setinvalidpswd] = useState(false);
  const [showPaswd, setshowPaswd] = useState(false);

  const [isShowGalleryPrmsn, setisShowGalleryPrmsn] = useState(false);
  const [isShowCameraPrmsn, setisShowCameraPrmsn] = useState(false);
  const [DT, setDT] = useState(false);

  const [photo, setphoto] = useState('');
  const [isPhotoUpload, setisPhotoUpload] = useState(true);
  const [cnicFrontImage, setCnicFrontImage] = useState('');
  const [isCnicFrontUplaod, setisCnicFrontUplaod] = useState(true);

  const [isPhoto1Upload, setisPhoto1Upload] = useState(0);

  const [pvm, setpvm] = useState(false); //show fulll image modal
  const [pv, setpv] = useState(''); //photo view

  const [isTerms, setisTerms] = useState(false);
  const [EmptyTerms, setEmptyTerms] = useState(false);

  const [iscTerms, setiscTerms] = useState(false);
  const [EmptycTerms, setEmptycTerms] = useState(false);

  const [errorMessage, seterrorMessage] = useState('');

  const [user, setuser] = useState(false);
  const [token, setToken] = useState('');
  const [uphoto, setuphoto] = useState('');
  const [ucnicF, setucnicF] = useState('');

  const [plan, setPlan] = useState(false);
  const [sPlan, setsPlan] = useState('free'); //selected Plan

  const plans = store.User.plans;
  const setplans = c => {
    store.User.setplans(c);
  };

  const [monthly, setmonthly] = useState(0);
  const [annualy, setannualy] = useState(0);
  const [save, setsave] = useState(0);
  const [totalAnually, settotalAnually] = useState(0);

  const [isTermsLoad, setIsTermsLoad] = useState(false);
  const [openTermsAndConditions, setOpenTermsAndConditions] = useState(false);

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
  }, [
    isUserCreate,
    isPhoto1Upload,
    isShowCameraPrmsn,
    isShowGalleryPrmsn,
    sPlan,
  ]);

  function handleBackButtonClick() {
    if (!props.navigation.isFocused()) {
      return false;
    } else {
      if (
        !isUserCreate &&
        isPhoto1Upload == 0 &&
        !isShowCameraPrmsn &&
        !isShowGalleryPrmsn
      ) {
        props.navigation.goBack();
      } else {
        if (
          isUserCreate &&
          isPhoto1Upload == 0 &&
          !isShowCameraPrmsn &&
          !isShowGalleryPrmsn
        ) {
          setisUserCreate(false);
          setphoto('');
        }

        if (
          isUserCreate &&
          isPhoto1Upload == 1 &&
          !isShowCameraPrmsn &&
          !isShowGalleryPrmsn
        ) {
          setCnicFrontImage('');
          setisPhoto1Upload(0);
        }

        if (
          isUserCreate &&
          isPhoto1Upload == 2 &&
          !isShowCameraPrmsn &&
          !isShowGalleryPrmsn
        ) {
          setisPhoto1Upload(1);
        }

        if (
          isUserCreate &&
          isPhoto1Upload == 3 &&
          !isShowCameraPrmsn &&
          !isShowGalleryPrmsn
        ) {
          clearCard();
          setisPhoto1Upload(2);
        }

        if (
          isUserCreate &&
          isPhoto1Upload == 4 &&
          !isShowCameraPrmsn &&
          !isShowGalleryPrmsn
        ) {
          if (sPlan == 'free') {
            setisPhoto1Upload(2);
          } else {
            setisPhoto1Upload(3);
          }
        }

        if (
          isUserCreate &&
          (isPhoto1Upload == 0 || isPhoto1Upload == 1) &&
          (isShowCameraPrmsn || isShowGalleryPrmsn)
        ) {
          setisShowCameraPrmsn(false);
          setisShowGalleryPrmsn(false);
        }
      }
      return true;
    }
  }

  const clearCard = () => {
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

  const goBack = () => {
    if (
      !isUserCreate &&
      isPhoto1Upload == 0 &&
      !isShowCameraPrmsn &&
      !isShowGalleryPrmsn
    ) {
      props.navigation.goBack();
    } else {
      if (
        isUserCreate &&
        isPhoto1Upload == 0 &&
        !isShowCameraPrmsn &&
        !isShowGalleryPrmsn
      ) {
        setisUserCreate(false);
        setphoto('');
      }

      if (
        isUserCreate &&
        isPhoto1Upload == 1 &&
        !isShowCameraPrmsn &&
        !isShowGalleryPrmsn
      ) {
        setCnicFrontImage('');
        setisPhoto1Upload(0);
      }

      if (
        isUserCreate &&
        isPhoto1Upload == 2 &&
        !isShowCameraPrmsn &&
        !isShowGalleryPrmsn
      ) {
        // setSavePerMonth(0);
        setsave(0);
        setisPhoto1Upload(1);
      }

      if (
        isUserCreate &&
        isPhoto1Upload == 3 &&
        !isShowCameraPrmsn &&
        !isShowGalleryPrmsn
      ) {
        clearCard();
        setisPhoto1Upload(2);
      }

      if (
        isUserCreate &&
        isPhoto1Upload == 4 &&
        !isShowCameraPrmsn &&
        !isShowGalleryPrmsn
      ) {
        if (sPlan == 'free') {
          setisPhoto1Upload(2);
        } else {
          setisPhoto1Upload(3);
        }
      }

      if (
        isUserCreate &&
        (isPhoto1Upload == 0 || isPhoto1Upload == 1) &&
        (isShowCameraPrmsn || isShowGalleryPrmsn)
      ) {
        setisShowCameraPrmsn(false);
        setisShowGalleryPrmsn(false);
      }
    }
  };

  const clearAllField = () => {
    seterrorMessage('');
    setEmptyfn(false);
    setinvalidfn(false);
    setEmptyln(false);
    setinvalidln(false);
    setEmptyemail(false);
    setinvalidemail(false);
    setEmptydob(false);
    setEmptypswd(false);
    setinvalidpswd(false);
    setisPhotoUpload(true);
    setisCnicFrontUplaod(true);
    setEmptyTerms(false);
  };

  const setPhoto1Upload = c => {
    setisPhoto1Upload(c);
  };

  useEffect(() => {
    if (isValidCard == false) {
      if (cn == '' || inValidcn == 'incomplete') {
        setcardErr('Please enter full card number');
        return;
      }

      if (cn == '' || inValidcn == 'incomplete') {
        setcardErr('Please enter full card number');
        return;
      }

      if (inValidcn != 'incomplete' && inValidcn == 'invalid') {
        setcardErr('Card number is invalid');
        return;
      }

      if (ce == '' || inValidce == 'incomplete') {
        setcardErr('Please enter card expiration date');
        return;
      }

      if (inValidce == 'invalid') {
        setcardErr('Card expiration date is invalid');
        return;
      }

      if (ccvc == '' || inValidccvc == 'incomplete') {
        setcardErr('Please enter card cvc number');
        return;
      }

      if (inValidccvc == 'invalid') {
        setcardErr('Card cvc number is invalid');
        return;
      }
    } else if (isValidCard == true) {
      seterrorMessage('');
    }
  }, [isValidCard, ce, cn, ccvc, inValidcn, inValidce, inValidccvc]);

  const setErrMessage = c => {
    seterrorMessage(c);
  };

  const createAccount = () => {
    clearAllField();
    Keyboard.dismiss();

    if (fn == '') {
      setEmptyfn(true);
      return;
    }

    if (ln == '') {
      setEmptyln(true);
      return;
    }

    if (email == '') {
      setEmptyemail(true);
      return;
    }

    if (emailReg.test(email) === false) {
      setinvalidemail(true);
      return;
    }

    if (dob == '') {
      setEmptydob(true);
      return;
    }

    if (pswd == '') {
      setEmptypswd(true);
      return;
    }

    if (pswd.length < 8) {
      setinvalidpswd(true);
      return;
    }

    if (isTerms == false) {
      setEmptyTerms(true);
      return;
    }

    const body = {
      firstName: fn,
      lastName: ln,
      email: email,
      birthDate: dob,
      termsAccepted: isTerms,
      password: pswd,
      phone: '',
      phoneCountryCode: RNLocalize.getCountry(),
      image: '',
      identityProof: '',
      registrationCode: store.User.notificationToken,
      subscriptionStatus: 'freemium',
      role: 'user',
      status: 'active',
      notificationEnabled: true,
    };

    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        store.User.checkEmailExist(email, body, checkIsEmailExist);
      } else {
        Alert.alert('', 'Please connect internet');
      }
    });
  };

  const checkIsEmailExist = (body, isEmailExist) => {
    console.log('isEmailExist : ', isEmailExist);
    if (isEmailExist) {
      store.User.setregLoader(false);
      Alert.alert(
        '',
        `This email ${body.email} is already in use. Please try with another email.`,
      );
    } else {
      signInAnonymously();
    }
  };

  const [chkOnce, setchkOnce] = useState(false);
  const [isResendLink, setisResendLink] = useState(false);
  const [isCreateFirebaseUser, setisCreateFirebaseUser] = useState(false);
  const [isemailVerify, setisemailVerify] = useState(false);
  let onAuthStateChangedUnsubscribe = null;
  let unsubscribeSetInterval = useRef(null);

  const signoutCurrentUser = () => {
    if (auth().currentUser) {
      auth().currentUser.delete();
      auth().signOut();
    }
  };

  const onClickClearInterval = () => {
    clearInterval(unsubscribeSetInterval.current);
    unsubscribeSetInterval.current = null;
  };

  useEffect(() => {
    if (internet && !chkOnce) {
      onClickClearInterval();
      signoutCurrentUser();
      setTimeout(() => {
        setchkOnce(true);
      }, 1500);
    }

    return () => {
      onClickClearInterval();
      signoutCurrentUser();
    };
  }, [internet, chkOnce]);

  useEffect(() => {
    if (chkOnce) {
      onAuthStateChangedUnsubscribe = auth().onAuthStateChanged(userIs => {
        if (userIs) {
          setisCreateFirebaseUser(userIs);
        }
      });

      return () => {
        onAuthStateChangedUnsubscribe();
      };
    }
  }, [chkOnce]);

  useEffect(() => {
    if (isCreateFirebaseUser) {
      console.log('isUsr true : ');
      let isUsr = isCreateFirebaseUser;
      isUsr
        .updateEmail(email)
        .then(() =>
          isUsr?.sendEmailVerification().then(c => {
            console.log('verfication link sent');
            clearAll();
            setisResendLink(false);
            setFinish(false);
            store.User.setregLoader(false);
            openBottomSheet();

            unsubscribeSetInterval.current = setInterval(function () {
              console.log('----> interval cal');
              auth().currentUser.reload();
              if (auth().currentUser.emailVerified) {
                onClickClearInterval();
                setisemailVerify(true);
              }
            }, 4000);
          }),
        )
        .catch(error => {
          console.log('sendEmailVerification cathc error', error);

          if (error.code == 'auth/too-many-requests') {
            let errorMessage =
              'We have blocked all requests from this device due to unusual activity. Try again later.';
            Alert.alert('Too- Many Requests', errorMessage);
          }

          clearAll();
          setisResendLink(false);
          setFinish(false);
          store.User.setregLoader(false);
        });
    }
  }, [isCreateFirebaseUser]);

  useEffect(() => {
    if (isemailVerify) {
      console.log('email verfied succecss');
      setisemailVerify(false);
      closeBottomSheet();

      const body = {
        firstName: fn,
        lastName: ln,
        email: email,
        birthDate: dob,
        termsAccepted: isTerms,
        password: pswd,
        phone: '',
        phoneCountryCode: RNLocalize.getCountry(),
        image: '',
        identityProof: '',
        registrationCode: store.User.notificationToken,
        subscriptionStatus: 'freemium',
        role: 'user',
        status: 'active',
        notificationEnabled: true,
      };
      store.User.registerUser(
        body,
        setErrMessage,
        isusercreate,
        () => onClickClearInterval(),
        () => signoutCurrentUser(),
      );
    }
  }, [isemailVerify]);

  const signInAnonymously = async () => {
    clearAll();
    signoutCurrentUser();

    auth()
      .signInAnonymously()
      .then(userIs => {
        console.log('signInAnonymously true');
      })
      .catch(error => {
        if (error.code === 'auth/operation-not-allowed') {
          console.log('Enable anonymous in your firebase console.');
        }
        console.error('signInAnonymously catch error : ', error);

        clearAll();
        setisResendLink(false); //resend loader
        setFinish(false); //timer
        store.User.setregLoader(false); //create account loader
      });
  };

  const clearAll = () => {
    onClickClearInterval();
    setisUserCreate(false);
    setisemailVerify(false);
  };

  const reSendLink = () => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        setisResendLink(true);
        setTimeout(() => {
          signInAnonymously();
        }, 1500);
      } else {
        Alert.alert('', 'Please connect internet');
      }
    });
  };

  const openBottomSheet = () => {
    rbSheet?.current?.open();
  };

  const closeBottomSheet = () => {
    rbSheet?.current?.close();
  };

  const onCloseBottomSheet = () => {
    setFinish(false);
    setisResendLink(false);
    onClickClearInterval();
    setisUserCreate(false);
    signoutCurrentUser();
  };

  const uploadPhoto = c => {
    if (c == 'Profile' && photo == '') {
      setisPhotoUpload(false);
      return;
    }

    if (c == 'CNICFront' && cnicFrontImage == '') {
      setisCnicFrontUplaod(false);
      return;
    }

    let imgArr = [];

    if (c == 'Profile') {
      photo.chk = 'Profile';
      imgArr.push(photo);
    }

    if (c == 'CNICFront') {
      cnicFrontImage.chk = 'CnicF';
      imgArr.push(cnicFrontImage);
    }

    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        store.User.attemptToUploadImage(
          imgArr,
          setErrMessage,
          setPhoto1Upload,
          SetUP,
          SetUCnicF,
          user._id,
          token,
        );
      } else {
        // seterrorMessage('Please connect internet');
        Alert.alert('', 'Please connect internet');
      }
    });
  };

  // const subscribePlan = () => {
  //   Keyboard.dismiss();

  //   if (cfn == '') {
  //     setEmptycfn(true);
  //     return;
  //   }

  //   if (isValidCard == 'null') {
  //     setcardErr('Please enter card number');
  //     setisValidCard(false);
  //     return;
  //   }

  //   if (isValidCard == true) {
  //     if (iscTerms == false) {
  //       setEmptycTerms(true);
  //       return;
  //     }

  //     // const obj = {
  //     //   plan: plan,
  //     //   totalValue: tv,
  //     //   isPromoApply: isPromoApply,
  //     // card: {
  //     //   name: cfn,
  //     //   number: cn,
  //     //   expiry: ce,
  //     //   cvc: ccvc,
  //     //   type: ct,
  //     // },
  //     // };

  //     let tv = plan.type == 'annual' ? totalAnually : monthly;
  //     tv = isPromoApply ? promoValue : tv;
  //     let pda = 0;
  //     if (isPromoApply) {
  //       let p = (isPromoApply.discount || 0) / 100;

  //       if (plan.type == 'monthly') {
  //         pda = p * monthly;
  //       }
  //       if (plan.type == 'annual') {
  //         pda = p * totalAnually;
  //       }
  //     }
  //     let subscription = !isPromoApply
  //       ? {
  //           title: plan.type,
  //           charges: plan.charges,
  //           discount: plan.discount,
  //           startDate: new Date(),
  //           endDate: addMonths(new Date(), plan.type == 'annual' ? 12 : 1),
  //           amtPaid: tv,
  //           status: 'active',
  //         }
  //       : {
  //           title: plan.type,
  //           charges: plan.charges,
  //           discount: plan.discount,
  //           startDate: new Date(),
  //           endDate: addMonths(new Date(), plan.type == 'annual' ? 12 : 1),
  //           amtPaid: tv,
  //           status: 'active',
  //           promoCode: isPromoApply.code,
  //           promoCodeDiscount: isPromoApply.discount,
  //           promoCodeDiscountAmt: pda,
  //         };

  //     const obj = {
  //       subscription: subscription,
  //       subscriptionStatus: 'paid',
  //     };

  //     NetInfo.fetch().then(state => {
  //       if (state.isConnected) {
  //         store.User.SubPlan(obj, usr._id, token, setErrMessage, subPlanSuc);
  //       } else {
  //         // seterrorMessage('Please connect internet');
  //         Alert.alert('', 'Please connect internet');
  //       }
  //     });
  //   }
  // };

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
            email: user.email,
            description: plan?.type,
            amount: tv * 100,
          };

          store.User.BuyPlan(body, obj, (d, d2) => SucGetClientsecret(d, d2));
        } else {
          // seterrorMessage('Please connect internet');
          Alert.alert('', 'Please connect internet');
        }
      });

      return;
    }
  };

  const SucGetClientsecret = async (dt, obj) => {
    console.log('data : ', dt);
    try {
      const {error, paymentIntent} = await confirmPayment(dt.cs, {
        paymentMethodType: 'Card',
        billingDetails: {name: cn},
      });

      if (error) {
        store.User.setregLoader(false);
        console.log(`confirmPayment error: `, error);
        Alert.alert(`Paymment ${error.code}`, error.message);
      } else if (paymentIntent) {
        console.log(`confirmPayment response: `, paymentIntent);
        // Alert.alert(`Success`, `Payment Succefull: ${paymentIntent.id}`);
        obj.customerId = dt.cid;
        store.User.SubPlan(
          obj,
          user._id,
          dt.cid,
          token,
          setErrMessage,
          subPlanSuc,
          'n',
        );
      }
    } catch (err) {
      store.User.setregLoader(false);
      console.log(`confirmPayment cath error: `, err);
    }
  };

  const goTOProfile = () => {
    // let u = {...usr};
    // // u.photo = uphoto;
    // // u.cnic_front_image = ucnicF;
    // // u.plan = sPlan;

    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        store.User.getUserById(user._id, token, 'profile');
      } else {
        // seterrorMessage('Please connect internet');
        Alert.alert('', 'Please connect internet');
      }
    });
  };

  const goTOFindTrips = () => {
    // let u = {...usr};
    // // u.photo = uphoto;
    // // u.cnic_front_image = ucnicF;
    // // u.plan = sPlan;

    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        store.User.getUserById(user._id, token, 'home');
      } else {
        // seterrorMessage('Please connect internet');
        Alert.alert('', 'Please connect internet');
      }
    });
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

  const isusercreate = (t, r, p) => {
    setToken(t);
    setuser(r);
    setplans(p);
    setisUserCreate(true);
    onClickClearInterval();
  };

  function addMonths(date, months) {
    var d = date.getDate();
    date.setMonth(date.getMonth() + +months);
    if (date.getDate() != d) {
      date.setDate(0);
    }
    return date;
  }

  const subPlanSuc = p => {
    setisPhoto1Upload(4);
    setsPlan(p.subscription);
    clearCard();
  };

  const applyPromoSuc = res => {
    setisPromoApply(res);
  };

  const SetUP = c => {
    setuphoto(c);
  };

  const SetUCnicF = c => {
    setucnicF(c);
  };

  const onclickImage = c => {
    Keyboard.dismiss();

    if (c == 'cnicFV') {
      setpv([cnicFrontImage.uri]);
      setpvm(true);
      return;
    }

    // if (c == 'cnicBV') {
    //   setpv(cnicBackImage.uri);
    //   setpvm(true);
    //   return;
    // }

    if (c == 'profileV') {
      setpv([photo.uri]);
      setpvm(true);
      return;
    }

    MultipleImage(c);
  };

  const MultipleImage = async button => {
    let apiLevel = store.General.apiLevel;
    if (button == 'Profile') {
      setisPhotoUpload(true);
    }
    if (button == 'CNICFront') {
      setisCnicFrontUplaod(true);
    }
    setisShowGalleryPrmsn(false);
    setisShowCameraPrmsn(false);

    setTimeout(async () => {
      try {
        let options = {
          mediaType: 'image',
          isPreview: false,
          singleSelectedMode: true,
        };
        const res = await MultipleImagePicker.openPicker(options);
        if (res) {
          console.log('mutipicker image res true  ');
          const {path, fileName, mime} = res;
          let uri = path;
          if (Platform.OS == 'android' && apiLevel < 29) {
            uri = 'file://' + uri;
          }

          ImageCompressor.compress(uri, {
            compressionMethod: 'auto',
          })
            .then(async res => {
              let imageObject = {
                uri: res,
                type: mime,
                fileName: fileName,
              };
              console.log('Compress image  : ', imageObject);
              if (button == 'Profile') {
                setphoto(imageObject);
                return;
              } else if (button == 'CNICFront') {
                setCnicFrontImage(imageObject);
                return;
              } else {
                return;
              }
            })
            .catch(err => {
              console.log('Image compress error : ', err);
            });
        }
      } catch (error) {
        console.log('multi photo picker error : ', error);
      }
    }, 500);
  };

  const checkPermsn = async (c, dt) => {
    if (Platform.OS == 'android') {
      const permissionAndroid = await check(PERMISSIONS.ANDROID.CAMERA);
      const permissionAndroid2 = await check(
        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      );
      setDT(dt);

      if (permissionAndroid != 'granted' || permissionAndroid2 != 'granted') {
        if (c == 'camera') {
          setisShowGalleryPrmsn(false);
          setisShowCameraPrmsn(true);
        } else {
          setisShowCameraPrmsn(false);
          setisShowGalleryPrmsn(true);
        }
      } else {
        onclickImage(dt);
      }
    }

    if (Platform.OS == 'ios') {
      try {
        const permissionIos = await check(PERMISSIONS.IOS.CAMERA);
        const permissionIos2 = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);
        setDT(dt);

        if (permissionIos != 'granted' || permissionIos2 != 'granted') {
          if (c == 'camera') {
            setisShowGalleryPrmsn(false);
            setisShowCameraPrmsn(true);
          } else {
            setisShowCameraPrmsn(false);
            setisShowGalleryPrmsn(true);
          }
        } else {
          onclickImage(dt);
        }
      } catch (error) {
        console.warn('Permsiion error : ', error);
      }
    }
  };

  //never ask again walas set krna
  //is se https://stackoverflow.com/questions/54075629/reactnative-permission-always-return-never-ask-again
  const reqPermission = async () => {
    if (Platform.OS == 'android') {
      try {
        const reqPer = await PermissionsAndroid.request(
          PERMISSIONS.ANDROID.CAMERA,
        );

        if (reqPer == 'never_ask_again') {
          let title = 'Camera Permission Blocked';
          let text = 'Please allow grant permission to acces camera';

          Alert.alert(title, text, [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: 'Open Settings',
              onPress: () => {
                IntentLauncher.startActivity({
                  action: 'android.settings.APPLICATION_DETAILS_SETTINGS',
                  data: 'package:' + store.General.package,
                });
              },
            },
          ]);

          return;
        }

        if (reqPer == 'granted') {
          const reqPer2 = await PermissionsAndroid.request(
            PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
          );

          if (reqPer2 == 'never_ask_again') {
            let title = 'Storage Permission Blocked';
            let text =
              'Please allow grant permission to acces photos in storage';

            Alert.alert(title, text, [
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {
                text: 'Open Settings',
                onPress: () => {
                  IntentLauncher.startActivity({
                    action: 'android.settings.APPLICATION_DETAILS_SETTINGS',
                    data: 'package:' + store.General.package,
                  });
                },
              },
            ]);
            return;
          }

          if (reqPer2 == 'granted') {
            onclickImage(DT);
          }
        }
      } catch (error) {
        console.log('req permsiion error : ', error);
      }
    }

    if (Platform.OS == 'ios') {
      const pc = await check(PERMISSIONS.IOS.CAMERA);
      const pp = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);
      console.log('pc: ', pc);
      console.log('pp: ', pp);

      if (pc == 'blocked' || pp == 'blocked') {
        let title =
          pc == 'blocked'
            ? 'Camera Permission Blocked'
            : 'Photo Permission Blocked';
        let text =
          pc == 'blocked'
            ? 'Please allow grant permission to acces camera'
            : 'Please allow grant permission to acces all photos';
        Alert.alert(title, text, [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'Open Settings',
            onPress: () => {
              Linking.openURL('app-settings:');
            },
          },
        ]);
        return;
      }

      if (pp == 'limited') {
        let title = 'Photo Permission Limited';
        let text = 'Please allow grant permission to select all photos';
        Alert.alert(title, text, [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'Open Settings',
            onPress: () => {
              Linking.openURL('app-settings:');
              //react-native-permissions // openSettings('App-Prefs:root=Photos');
            },
          },
        ]);
        return;
      }

      try {
        const reqPer = await request(PERMISSIONS.IOS.CAMERA);
        if (reqPer == 'granted') {
          const reqPer2 = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
          if (reqPer2 == 'granted') {
            onclickImage(DT);
          }
        }
      } catch (error) {
        console.log('req permsiion error : ', error);
      }
    }
  };
  const renderShowError = () => {
    return (
      <View style={styles.errorMessageContainer}>
        <Text style={styles.errorMessageText}>{errorMessage}</Text>
      </View>
    );
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

  const renderHeader = () => {
    const renderLogo = () => {
      return (
        <View style={styles.section1}>
          <Image
            style={styles.logo}
            source={require('../../assets/images/logo/img.png')}
          />
          <Text style={styles.title1}>{store.General.AppName}</Text>
        </View>
      );
    };

    const renderBack = () => {
      return (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={goBack}
          style={{position: 'absolute', left: 20}}>
          <utils.vectorIcon.Ionicons
            name={'chevron-back-outline'}
            color={theme.color.buttonText}
            size={27}
          />
        </TouchableOpacity>
      );
    };

    return (
      <View style={styles.Header}>
        {renderLogo()}
        {renderBack()}
      </View>
    );
  };

  const renderSection2 = () => {
    // Methods

    const enterFn = t => {
      setEmptyfn(false);
      setinvalidfn(false);
      setfn(t);
    };

    const enterLn = t => {
      setEmptyln(false);
      setinvalidln(false);
      setln(t);
    };

    const enterEmail = t => {
      setinvalidemail(false);
      setEmptyemail(false);
      setemail(t);
    };

    const showPUDatepicker = () => {
      Keyboard.dismiss();
      setEmptydob(false);

      setPUdShow(true);
    };

    const onPUDChange = (event, selectedDate) => {
      const selDate = selectedDate || dob;
      const e = event.type;
      if (Platform.OS === 'android') {
        setPUdShow(false);
      }

      if (e == 'set') {
        setPUTime(selDate);
        setdob(selDate);
      }
    };

    const enterPaswd = t => {
      setinvalidpswd(false);
      setEmptypswd(false);
      setpswd(t);
    };

    const showPasswd = () => {
      setshowPaswd(!showPaswd);
    };

    const changeTerms = () => {
      setEmptyTerms(false);
      setisTerms(!isTerms);
    };

    const TermsnCndtnClick = () => {
      openTerms();
    };

    const goToSignin = () => {
      props.navigation.navigate('Signin');
    };

    const formatDate = date => {
      var dd = moment(date).format('MM / DD / YYYY');
      return dd;
    };

    // Render

    const renderButton = () => {
      return (
        <>
          <TouchableOpacity
            onPress={createAccount}
            activeOpacity={0.7}
            style={styles.BottomButton}>
            <Text style={styles.buttonTextBottom}>create account</Text>
          </TouchableOpacity>
        </>
      );
    };

    return (
      <View style={styles.section2}>
        <Text style={styles.section2Title1}>create account</Text>

        {/* {errorMessage !== '' && renderShowError()} */}

        <View style={[styles.joinFieldContainer, {marginTop: 20}]}>
          <View style={[styles.Field, {width: '48%'}]}>
            <Text style={styles.FieldTitle1}>first name</Text>
            <TextInput
              placeholder=""
              value={fn}
              onChangeText={enterFn}
              style={[
                styles.FieldInput,
                {
                  borderColor:
                    invalidfn || Emptyfn
                      ? theme.color.fieldBordeError
                      : theme.color.fieldBorder,
                },
              ]}
            />
            {(invalidfn || Emptyfn) && renderShowFieldError('fn')}
          </View>

          <View style={[styles.Field, {width: '48%'}]}>
            <Text style={styles.FieldTitle1}>last name</Text>
            <TextInput
              value={ln}
              placeholder=""
              onChangeText={enterLn}
              style={[
                styles.FieldInput,
                {
                  borderColor:
                    invalidln || Emptyln
                      ? theme.color.fieldBordeError
                      : theme.color.fieldBorder,
                },
              ]}
            />
            {(invalidln || Emptyln) && renderShowFieldError('ln')}
          </View>
        </View>

        <View style={styles.Field}>
          <Text style={styles.FieldTitle1}>email address</Text>
          <TextInput
            value={email}
            placeholder=""
            onChangeText={enterEmail}
            style={[
              styles.FieldInput,
              {
                borderColor:
                  invalidemail || Emptyemail
                    ? theme.color.fieldBordeError
                    : theme.color.fieldBorder,
              },
            ]}
          />
          {(invalidemail || Emptyemail) && renderShowFieldError('email')}
        </View>

        <View style={styles.Field}>
          <Text style={[styles.FieldTitle1, {textTransform: 'none'}]}>
            Date of Birth
          </Text>
          <View
            style={[
              styles.FieldInput,
              {
                borderColor: Emptydob
                  ? theme.color.fieldBordeError
                  : theme.color.fieldBorder,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              },
            ]}>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={showPUDatepicker}
              style={{width: '85%'}}>
              {dob == '' && (
                <Text style={styles.DateTextPlaceholder}>mm / dd / yyyy</Text>
              )}
              {dob != '' && (
                <Text style={styles.DateText}>{formatDate(dob)}</Text>
              )}
            </TouchableOpacity>

            <utils.vectorIcon.AntDesign
              name={'calendar'}
              color={'#30563A'}
              size={20}
            />
          </View>

          {Emptydob && renderShowFieldError('dob')}
        </View>

        <View style={styles.Field}>
          <Text style={styles.FieldTitle1}>Password</Text>
          <View
            style={[
              styles.FieldInput,
              {
                borderColor:
                  invalidpswd || Emptypswd
                    ? theme.color.fieldBordeError
                    : theme.color.fieldBorder,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              },
            ]}>
            <TextInput
              value={pswd}
              onChangeText={enterPaswd}
              secureTextEntry={!showPaswd}
              placeholder=""
              style={{width: '85%'}}
            />

            {pswd.length > 0 && (
              <TouchableOpacity activeOpacity={0.5} onPress={showPasswd}>
                {!showPaswd && (
                  <Image
                    style={{width: 20, height: 12, resizeMode: 'contain'}}
                    source={require('../../assets/images/sp/img.png')}
                  />
                )}
                {showPaswd && (
                  <utils.vectorIcon.Ionicons
                    name={'eye-off-outline'}
                    color={theme.color.button1}
                    size={20}
                  />
                )}
              </TouchableOpacity>
            )}
          </View>

          {(invalidpswd || Emptypswd) && renderShowFieldError('pswd')}
        </View>

        <View style={{marginTop: 20}}>
          <View style={styles.Field2}>
            <TouchableOpacity
              style={{
                width: 20,
                height: 20,
                borderRadius: 4,
                backgroundColor: !isTerms ? 'white' : theme.color.button1,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: !EmptyTerms
                  ? theme.color.fieldBorder
                  : theme.color.fieldBordeError,
              }}
              activeOpacity={0.5}
              onPress={changeTerms}>
              {isTerms && (
                <utils.vectorIcon.FontAwesome5
                  name={'check'}
                  color={theme.color.buttonText}
                  size={11}
                />
              )}
            </TouchableOpacity>

            {/* <TouchableOpacity activeOpacity={0.5} onPress={changeTerms}>
              {!isTerms && (
                <utils.vectorIcon.Feather
                  name={'square'}
                  color={
                    EmptyTerms
                      ? theme.color.fieldBordeError
                      : theme.color.subTitleLight
                  }
                  size={20}
                />
              )}

              {isTerms && (
                <utils.vectorIcon.AntDesign
                  name={'checksquare'}
                  color={theme.color.button1}
                  size={20}
                />
              )}
            </TouchableOpacity> */}

            <Text style={styles.Field2Title}>I agree to the </Text>
            <TouchableOpacity activeOpacity={0.7} onPress={TermsnCndtnClick}>
              <Text
                style={[
                  styles.Field2Title,
                  {textDecorationLine: 'underline', marginLeft: 0},
                ]}>
                Terms & Conditions
              </Text>
            </TouchableOpacity>
          </View>
          {EmptyTerms && renderShowFieldError('terms')}
        </View>

        {renderButton()}

        <View style={styles.Field3}>
          <View style={styles.Field31}>
            <Text style={styles.Field31Title1}>Already a member?</Text>
            <TouchableOpacity activeOpacity={0.7} onPress={goToSignin}>
              <Text style={styles.Field31Title2}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderSection2User = () => {
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
      setisPhoto1Upload(2);
      clearCard();
    };

    const TermsnCndtnClickCard = () => {};

    // Render

    const renderButton = c => {
      return (
        <>
          <TouchableOpacity
            onPress={() => {
              if (c != 'FindTrips') {
                uploadPhoto(c);
              } else {
                goTOFindTrips();
              }
            }}
            activeOpacity={0.7}
            style={[styles.BottomButton, {marginTop: 40}]}>
            {c == 'Profile' && (
              <Text style={styles.buttonTextBottom}>
                {photo == '' ? 'Continue' : 'Confirm & Continue'}
              </Text>
            )}
            {c == 'CNICFront' && (
              <Text style={styles.buttonTextBottom}>
                {cnicFrontImage == '' ? 'Continue' : 'Confirm & Continue'}
              </Text>
            )}
            {c == 'FindTrips' && (
              <Text style={styles.buttonTextBottom}>Find Trips</Text>
            )}
          </TouchableOpacity>
        </>
      );
    };

    const renderButtonPermission = () => {
      return (
        <View
          style={{
            width: '100%',
            marginTop: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            onPress={reqPermission}
            activeOpacity={0.7}
            style={styles.BottomButtonP}>
            <Text style={styles.buttonPTextBottom}>Yes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              if (isShowCameraPrmsn) setisShowCameraPrmsn(false);
              else setisShowGalleryPrmsn(false);
            }}
            activeOpacity={0.7}
            style={styles.BottomButtonP}>
            <Text style={styles.buttonPTextBottom}>No</Text>
          </TouchableOpacity>
        </View>
      );
    };

    const renderButtonCP = c => {
      return (
        <>
          <TouchableOpacity
            onPress={() => {
              onclickImage(c);
            }}
            activeOpacity={0.7}
            style={[
              styles.BottomButton,
              {
                marginTop: 12,
                backgroundColor: theme.color.background,
                borderWidth: 0.5,
                borderColor: theme.color.subTitle,
              },
            ]}>
            <Text
              style={[
                styles.buttonTextBottom,
                {
                  color: theme.color.buttonTextGreen,
                  fontFamily: theme.fonts.fontMedium,
                },
              ]}>
              Change Photo
            </Text>
          </TouchableOpacity>
        </>
      );
    };

    const renderButtonPlan = () => {
      return (
        <>
          <TouchableOpacity
            onPress={() => {
              setisPhoto1Upload(3);
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
            // onPress={buyPlan}
            activeOpacity={0.7}
            style={styles.BottomButton}>
            <Text style={styles.buttonTextBottom}>Subscribe</Text>
          </TouchableOpacity>
        </>
      );
    };

    const renderButton2 = () => {
      return (
        <>
          <TouchableOpacity
            onPress={goTOProfile}
            activeOpacity={0.7}
            style={[
              styles.BottomButton,
              {
                marginTop: 12,

                backgroundColor: theme.color.button2,
                // borderWidth: 0.5,
                borderColor: theme.color.subTitle,
              },
            ]}>
            <Text
              style={[
                styles.buttonTextBottom,
                {
                  color: theme.color.subTitle,
                  fontFamily: theme.fonts.fontBold,
                  textTransform: 'none',
                },
              ]}>
              Go to My Profile
            </Text>
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
        {/* profile  0*/}
        {isPhoto1Upload == 0 && !isShowCameraPrmsn && !isShowGalleryPrmsn && (
          <View style={styles.section2}>
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Text style={styles.section2Title1}>
                {photo == '' ? 'add' : 'review'} profile photo
              </Text>
              {photo == '' && (
                <Image
                  source={require('../../assets/images/addphoto/img.png')}
                  style={styles.section2Logo}
                />
              )}
              {/* {errorMessage !== '' && renderShowError()} */}
              {!isPhotoUpload && renderShowError2('Profile')}
              <Text style={styles.section2LogoTitle}>
                {photo == ''
                  ? 'Upload a photo to help the community recognize and promote your account.'
                  : 'If you are happy with the result, click Confirm & Continue below or try a different photo.'}
              </Text>

              {photo == '' && (
                <View style={styles.uploadIndication}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      checkPermsn('gallery', 'Profile');
                    }}>
                    <Image
                      source={require('../../assets/images/uploadphoto/img.png')}
                      style={styles.uploadIndicationLogo}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      checkPermsn('camera', 'Profile');
                    }}>
                    <Image
                      source={require('../../assets/images/takephoto/img.png')}
                      style={styles.uploadIndicationLogo}
                    />
                  </TouchableOpacity>
                </View>
              )}

              {photo != '' && (
                <TouchableOpacity
                  style={styles.imageContainerP}
                  activeOpacity={0.7}
                  onPress={() => onclickImage('profileV')}>
                  <Image source={{uri: photo.uri}} style={styles.imageP} />
                </TouchableOpacity>
              )}
            </View>

            {renderButton('Profile')}
            {photo != '' && renderButtonCP('Profile')}

            {photo == '' && (
              <TouchableOpacity activeOpacity={0.7} onPress={Skip}>
                <Text style={styles.section2bottomTitle}>Skip for now</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Cnic 1 */}
        {isPhoto1Upload == 1 && !isShowCameraPrmsn && !isShowGalleryPrmsn && (
          <View style={styles.section2}>
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Text style={styles.section2Title1}>
                {cnicFrontImage == ''
                  ? 'verify identity'
                  : 'review your id card'}
              </Text>
              {cnicFrontImage == '' && (
                <Image
                  source={require('../../assets/images/addcnic/img.png')}
                  style={styles.section2Logo}
                />
              )}

              {/* {errorMessage !== '' && renderShowError()} */}
              {!isCnicFrontUplaod && renderShowError2('Profile')}
              <Text style={[styles.section2LogoTitle]}>
                {cnicFrontImage == ''
                  ? 'Trip Trader is committed to community trust and security. Providing a valid government-issued ID to confirm your identity helps us keep the community safe and creates trust between you and other traders.'
                  : 'Make sure you are only submitting a valid government issued  ID and that your picture and all information is clearly visible.'}
              </Text>

              {cnicFrontImage == '' && (
                <View style={styles.uploadIndication}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      checkPermsn('gallery', 'CNICFront');
                    }}>
                    <Image
                      source={require('../../assets/images/uploadphoto/imgg.png')}
                      style={styles.uploadIndicationLogo}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      checkPermsn('camera', 'CNICFront');
                    }}>
                    <Image
                      source={require('../../assets/images/takephoto/img.png')}
                      style={styles.uploadIndicationLogo}
                    />
                  </TouchableOpacity>
                </View>
              )}

              {cnicFrontImage != '' && (
                <View style={styles.imageContainer}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => onclickImage('cnicFV')}>
                    <Image
                      source={{uri: cnicFrontImage.uri}}
                      style={styles.image}
                    />
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {renderButton('CNICFront')}
            {cnicFrontImage != '' && renderButtonCP('CNICFront')}
            {cnicFrontImage == '' && (
              <TouchableOpacity activeOpacity={0.7} onPress={Skip}>
                <Text style={styles.section2bottomTitle}>Skip for now</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* permsiion */}

        {(isShowCameraPrmsn || isShowGalleryPrmsn) && (
          <View style={styles.section2}>
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Text style={styles.section2Title1}>
                {isShowCameraPrmsn ? 'Camera Access' : 'Storage Access'}
              </Text>

              <Image
                source={
                  isShowCameraPrmsn
                    ? require('../../assets/images/ca/img.png')
                    : require('../../assets/images/ca/img.png')
                }
                style={styles.section2Logo}
              />

              <Text
                style={[
                  styles.section2LogoTitle,
                  {textAlign: 'center', width: '90%', alignSelf: 'center'},
                ]}>
                {isShowCameraPrmsn
                  ? 'Trip Trader wants permission to access your camera.'
                  : 'Trip Trader wants permission to access your storage.'}
              </Text>
              <Text style={styles.section2LogoTitlee}>Grant access?</Text>
            </View>

            {renderButtonPermission()}
          </View>
        )}

        {/* Plan 2 */}

        {isPhoto1Upload == 2 && (
          <View style={styles.section2}>
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
                style={[styles.section2LogoTitle2c, {alignSelf: 'flex-start'}]}>
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
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Text
                        style={{
                          fontSize: 26,
                          color: theme.color.title,
                          fontFamily: theme.fonts.fontBold,
                        }}>
                        ${plan.type == 'annual' ? annualy.toFixed(2) : monthly}
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
                  // setPlan('free');
                  setsPlan('free');
                  setisPhoto1Upload(4);
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
          </View>
        )}

        {/* Payment 3 */}

        {isPhoto1Upload == 3 && (
          <View style={styles.section2}>
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
                    style={{flexDirection: 'row', marginLeft: 5, width: '65%'}}>
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
                    fontSize: 12,
                    borderColor: theme.color.fieldBorder,
                    borderWidth: 1,
                    borderRadius: 8,
                    fontFamily: theme.fonts.fontNormal,
                  }}
                  style={{
                    width: '100%',
                    height: 45,

                    // marginVertical: 30,
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

            <TouchableOpacity activeOpacity={0.7} onPress={changePlan}>
              <Text
                style={[
                  styles.section2bottomTitle,
                  {color: 'rgba(17, 17, 17, 0.6)'},
                ]}>
                Cancel and go back
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Ready 4 */}
        {isPhoto1Upload == 4 && (
          <View style={styles.section2}>
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.section2Title1}>
                welcome, {user.firstName}!
              </Text>
              <View style={styles.section2LogoC}>
                <Image
                  source={require('../../assets/images/accountReady/img1.png')}
                  style={styles.section2LogoCImg1}
                />
                <Image
                  source={require('../../assets/images/accountReady/img2.png')}
                  style={styles.section2LogoCImg2}
                />
              </View>

              {/* {errorMessage !== '' && renderShowError()} */}

              <Text style={styles.section2LogoTitle1c}>
                Your account is ready.
              </Text>

              <Text
                style={[
                  styles.section2LogoTitle2c,
                  {color: theme.color.subTitleAuth, textAlign: 'center'},
                ]}>
                Good luck on your trips and trades!
              </Text>
            </View>

            {renderButton('FindTrips')}
            {renderButton2()}
          </View>
        )}
      </>
    );
  };

  const renderStatusBar = () => {
    return (
      <>
        {!pvm && (
          <StatusBar
            translucent={true}
            backgroundColor={'transparent'}
            barStyle={'light-content'}
          />
        )}

        {pvm && (
          <StatusBar
            translucent={false}
            backgroundColor={'black'}
            barStyle={'light-content'}
          />
        )}
      </>
    );
  };

  const renderDateShowModal = () => {
    {
      /* ios */
    }
    {
      /* <Modal
          isVisible={pudshow && Platform.OS === 'ios'}
          backdropOpacity={0.6}
          animationIn="fadeInUp"
          animationOut="fadeOutDown"
          animationInTiming={600}
          animationOutTiming={600}
          onRequestClose={() => {
            setPUdShow(false);
          }}
          backdropTransitionInTiming={600}
          backdropTransitionOutTiming={600}
          onBackdropPress={() => setPUdShow(false)}>
          <View style={styles.CNICModal}>
            <View style={styles.CNICModalHeader}>
              <Text style={styles.CNICModalHeaderText}>Set Date</Text>
              <utils.vectorIcon.Entypo
                name="cross"
                size={24}
                color={'#fff'}
                style={{padding: responsiveWidth(3)}}
                onPress={() => setPUdShow(false)}
              />
            </View>
            <DateTimePicker
              testID="dateTimePicker"
              value={puTime}
              mode={'date'}
              onTouchCancel={() => {
                setPUdShow(false);
              }}
              maximumDate={new Date()}
              display="spinner"
              textColor="#000"
              onChange={onPUDChange}
            />
          </View>
        </Modal> */
    }

    {
      /* android */
    }

    {
      /* {pudshow && Platform.OS === 'android' && ( */
    }

    // <DateTimePicker
    //   testID="dateTimePicker"
    //   value={puTime}
    //   mode={'date'}
    //   display="spinner"
    //   textColor="#000"
    //   maximumDate={new Date()}
    //   onChange={onPUDChange}
    // />
    // )}

    return (
      <DatePicker
        maximumDate={new Date()}
        modal
        mode="date"
        format="MM-DD-YYYY"
        open={pudshow}
        date={dob == '' ? new Date() : dob}
        onConfirm={date => {
          console.log('data : ', date);
          setPUdShow(false);
          setdob(date);
        }}
        onCancel={() => {
          setPUdShow(false);
        }}
      />
    );
  };

  const renderBottomSheet = () => {
    const renderTimer = () => {
      return (
        <TouchableOpacity
          activeOpacity={0.7}
          disabled={!isFinish || isResendLink ? true : false}
          onPress={reSendLink}
          style={{position: 'absolute', alignSelf: 'center', bottom: 30}}>
          {!isFinish ? (
            <>
              <CountDown
                size={14}
                until={resendTime}
                onFinish={() => setFinish(true)}
                digitStyle={{backgroundColor: 'transparent'}}
                digitTxtStyle={{
                  color: theme.color.titleGreen,
                  fontSize: 15,
                  fontFamily: theme.fonts.fontBold,
                }}
                timeToShow={['S']}
                timeLabels={{s: null}}
                showSeparator
              />
            </>
          ) : (
            <Text
              style={{
                color: theme.color.titleGreen,
                fontSize: 13,
                fontFamily: theme.fonts.fontBold,
                textDecorationLine: 'underline',
              }}>
              Resend Link
            </Text>
          )}
        </TouchableOpacity>
      );
    };

    return (
      <>
        <RBSheet
          ref={rbSheet}
          height={responsiveHeight(60)}
          closeOnPressBack={true}
          openDuration={250}
          onClose={onCloseBottomSheet}
          closeOnDragDown={true}
          closeOnPressMask={false}
          KeyboardAvoidingView={true}
          customStyles={{
            wrapper: {
              flex: 1,
              // backgroundColor: 'transparent',
            },
            container: {
              backgroundColor: theme.color.button1,
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,

              elevation: 5,
            },
            draggableIcon: {
              backgroundColor: theme.color.backgroundConatiner,
              opacity: 0.5,
            },
          }}>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',

              padding: 25,
            }}>
            {!isResendLink && (
              <utils.vectorIcon.MaterialCommunityIcons
                name="check-decagram"
                color={theme.color.buttonText}
                size={60}
              />
            )}
            {isResendLink && (
              <Image
                style={{width: 62, height: 62}}
                source={require('../../assets/gif/spinner.gif')}
              />
            )}

            <Text
              style={{
                textAlign: 'center',
                textTransform: 'capitalize',
                fontSize: 19,
                color: theme.color.buttonText,
                fontFamily: theme.fonts.fontBold,
                marginTop: 10,
              }}>
              Verification link sent
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              backgroundColor: theme.color.background,
              padding: 20,
            }}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 14.5,
                color: theme.color.title,
                fontFamily: theme.fonts.fontNormal,
                marginTop: 20,
              }}>
              We have sent a verification link to{' '}
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 14.5,
                  color: theme.color.title,
                  fontFamily: theme.fonts.fontBold,
                }}>
                {email}.
              </Text>
            </Text>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 14.5,
                color: theme.color.title,
                fontFamily: theme.fonts.fontNormal,
              }}>
              Please click on the link to verify your email address and activate
              your account. Thankyou.
            </Text>

            {!isResendLink && renderTimer()}
          </View>
        </RBSheet>
      </>
    );
  };

  const openTerms = () => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        setOpenTermsAndConditions(true);
      } else {
        Alert.alert('Network Error', 'Please connect internet.');
      }
    });
  };

  const renderOpenTermsAndCondition = () => {
    return (
      <Modal
        isVisible={openTermsAndConditions}
        backdropOpacity={0.5}
        animationInTiming={1000}
        backdropTransitionInTiming={1000}
        animationOutTiming={500}
        style={{margin: 0, padding: 0}}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropTransitionOutTiming={700}
        onRequestClose={() => {
          setOpenTermsAndConditions(false);
          setIsTermsLoad(false);
        }}>
        <SafeAreaView style={{flex: 1}}>
          <WebView
            source={{
              uri: termsConditionLink,
            }}
            javaScriptEnabled={true}
            onLoad={() => {
              setIsTermsLoad(true);
            }}
            domStorageEnabled={true}
            startInLoadingState={false}
            scalesPageToFit={true}
          />

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setOpenTermsAndConditions(false);
              setIsTermsLoad(false);
            }}
            style={styles.BottomButtonwebview}>
            {/* <LinearGradient
              colors={['#f25526', '#f25526']}
              style={styles.LinearGradientwebview}> */}
            <Text style={styles.buttonTextBottomwebview}>Close</Text>
            {/* </LinearGradient> */}
          </TouchableOpacity>

          {!isTermsLoad && (
            <View style={styles.loaderwebview}>
              <ActivityIndicator color={theme.color.button1} size={40} />
            </View>
          )}
        </SafeAreaView>
      </Modal>
    );
  };

  return (
    <StripeProvider publishableKey={store.General.Stripe_Publish_Key}>
      <View style={styles.container}>
        <ImageBackground
          source={require('../../assets/images/background/img.png')}
          style={styles.container2}>
          <SafeAreaView style={styles.container2}>
            <utils.AuthHeader
              props={props}
              screen="signup"
              goBack={() => goBack()}
            />
            <KeyboardAvoidingView style={{flex: 1}} enabled>
              <ScrollView
                style={{paddingHorizontal: 15}}
                showsVerticalScrollIndicator={false}>
                {!isUserCreate && renderSection2()}

                {isUserCreate && renderSection2User()}
              </ScrollView>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </ImageBackground>

        {pvm && (
          <utils.FullimageModal
            data={pv}
            si={0}
            show={pvm}
            closModal={() => setpvm(!pvm)}
          />
        )}
        <Toast ref={toast} position="center" />
        <utils.Loader load={loader} />

        {renderStatusBar()}
        {renderDateShowModal()}
        {renderBottomSheet()}
        {openTermsAndConditions && renderOpenTermsAndCondition()}
      </View>
    </StripeProvider>
  );
}
