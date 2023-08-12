import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  BackHandler,
  Image,
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
} from "react-native";
import {
  CardField,
  StripeProvider,
  useStripe,
} from "@stripe/stripe-react-native";
import {
  responsiveFontSize,
  responsiveHeight,
} from "react-native-responsive-dimensions";
import MultipleImagePicker from "@baronha/react-native-multiple-image-picker";
import NetInfo from "@react-native-community/netinfo";
import { Image as ImageCompressor } from "react-native-compressor";
import DatePicker from "react-native-date-picker";
import Toast from "react-native-easy-toast";
import IntentLauncher from "react-native-intent-launcher";
import * as RNLocalize from "react-native-localize";
import { check, PERMISSIONS, request } from "react-native-permissions";
import { observer } from "mobx-react";
import moment from "moment";
import { styles } from "./styles";
import store from "../../store/index";
import theme from "../../theme";
import utils from "../../utils/index";
import { Notification } from "../../services/Notification";

export default observer(Signup);
function Signup(props) {
  const emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
  const nameRegex = /^[a-zA-Z-' ]+$/;
  const toast = useRef(null);
  const { plans, setplans, regLoader, setregLoader } = store.User;
  const { confirmPayment } = useStripe();

  const [isUserCreate, setisUserCreate] = useState(false);

  const [cfn, setcfn] = useState("");
  const [Emptycfn, setEmptycfn] = useState(false);
  const [invalidcfn, setInvalidcfn] = useState(false);
  const [cardErr, setcardErr] = useState("");
  const [cardObj, setCardObj] = useState(null);

  const [pc, setpc] = useState("");
  const [isShowPromoFiled, setisShowPromoFiled] = useState(false);
  const [isPromoApply, setisPromoApply] = useState(null);
  const [promoValue, setpromoValue] = useState(0);

  const [fn, setfn] = useState("");
  const [Emptyfn, setEmptyfn] = useState(false);
  const [invalidfn, setinvalidfn] = useState(false);

  const [ln, setln] = useState("");
  const [Emptyln, setEmptyln] = useState(false);
  const [invalidln, setinvalidln] = useState(false);

  const [email, setemail] = useState("");
  const [Emptyemail, setEmptyemail] = useState(false);
  const [invalidemail, setinvalidemail] = useState(false);

  const [dob, setdob] = useState("");
  const [pudshow, setPUdShow] = useState(false);
  const [puTime, setPUTime] = useState(new Date());
  const [Emptydob, setEmptydob] = useState(false);

  const [pswd, setpswd] = useState("");
  const [Emptypswd, setEmptypswd] = useState(false);
  const [invalidpswd, setinvalidpswd] = useState(false);
  const [showPaswd, setshowPaswd] = useState(false);

  const [cpswd, setcpswd] = useState("");
  const [Emptycpswd, setEmptycpswd] = useState(false);
  const [invalidcpswd, setinvalidcpswd] = useState(false);
  const [showcPaswd, setshowcPaswd] = useState(false);

  const [isShowGalleryPrmsn, setisShowGalleryPrmsn] = useState(false);
  const [isShowCameraPrmsn, setisShowCameraPrmsn] = useState(false);
  const [DT, setDT] = useState(false);

  const [photo, setphoto] = useState("");
  const [isPhotoUpload, setisPhotoUpload] = useState(true);
  const [cnicFrontImage, setCnicFrontImage] = useState("");
  const [isCnicFrontUplaod, setisCnicFrontUplaod] = useState(true);

  const [isPhoto1Upload, setisPhoto1Upload] = useState(0);

  const [pvm, setpvm] = useState(false); //show fulll image modal
  const [pv, setpv] = useState(""); //photo view

  const [isTerms, setisTerms] = useState(false);
  const [EmptyTerms, setEmptyTerms] = useState(false);

  const [iscTerms, setiscTerms] = useState(false);
  const [EmptycTerms, setEmptycTerms] = useState(false);

  const [errorMessage, seterrorMessage] = useState("");

  const [user, setuser] = useState(false);
  const [token, setToken] = useState("");
  const [uphoto, setuphoto] = useState("");
  const [ucnicF, setucnicF] = useState("");

  const [plan, setPlan] = useState(false);
  const [sPlan, setsPlan] = useState("free"); //selected Plan

  const [monthly, setmonthly] = useState(0);
  const [annualy, setannualy] = useState(0);
  const [save, setsave] = useState(0);
  const [totalAnually, settotalAnually] = useState(0);

  const [isShowTermsAndConditions, setIsShowTermsAndConditions] =
    useState(false);

  function toFixed(num, fix) {
    var re = new RegExp("^-?\\d+(?:.\\d{0," + (fix || -1) + "})?");
    return num.toString().match(re)[0];
  }

  useEffect(() => {
    if (plan) {
      let monthly = 0;
      let annualy = 0;
      if (plans && plans.data.length > 0) {
        plans.data.map((e, i, a) => {
          if (e.type == "annual") {
            annualy = e.charges;
          }
          if (e.type == "monthly") {
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
        if (plan.type == "monthly") {
          discount = monthly - p * monthly;
        }
        if (plan.type == "annual") {
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
      "hardwareBackPress",
      handleBackButtonClick
    );

    return () => {
      BackHandler.removeEventListener(
        "hardwareBackPress",
        handleBackButtonClick
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
          setphoto("");
        }

        if (
          isUserCreate &&
          isPhoto1Upload == 1 &&
          !isShowCameraPrmsn &&
          !isShowGalleryPrmsn
        ) {
          setCnicFrontImage("");
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
          if (sPlan == "free") {
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
    setcfn("");
    setpc("");
    setcardErr("");
    setEmptycfn(false);
    setInvalidcfn(false);
    setisShowPromoFiled(false);
    setisPromoApply(null);
    setiscTerms(false);
    setpromoValue(0);
    setCardObj(null);
    setEmptycTerms(false);
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
        setphoto("");
      }

      if (
        isUserCreate &&
        isPhoto1Upload == 1 &&
        !isShowCameraPrmsn &&
        !isShowGalleryPrmsn
      ) {
        setCnicFrontImage("");
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
        if (sPlan == "free") {
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
    seterrorMessage("");
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
    clearCard();
  };

  const setPhoto1Upload = (c) => {
    setisPhoto1Upload(c);
  };

  const setErrMessage = (c) => {
    seterrorMessage(c);
  };

  const createAccount = () => {
    clearAllField();
    Keyboard.dismiss();

    if (fn.trim() === "") {
      setEmptyfn(true);
      return;
    }

    if (nameRegex.test(fn.trim()) === false) {
      setinvalidfn(true);
      return;
    }

    if (ln.trim() == "") {
      setEmptyln(true);
      return;
    }

    if (nameRegex.test(ln.trim()) === false) {
      setinvalidln(true);
      return;
    }

    if (email.trim() == "") {
      setEmptyemail(true);
      return;
    }

    if (emailReg.test(email.trim()) === false) {
      setinvalidemail(true);
      return;
    }

    if (dob === "") {
      setEmptydob(true);
      return;
    }

    if (pswd == "") {
      setEmptypswd(true);
      return;
    }

    if (pswd.length < 8) {
      setinvalidpswd(true);
      return;
    }

    if (cpswd === "") {
      setEmptycpswd(true);
      return;
    }

    if (cpswd !== pswd) {
      setinvalidcpswd(true);
      return;
    }

    if (isTerms == false) {
      setEmptyTerms(true);
      return;
    }

    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        const body = {
          firstName: fn,
          lastName: ln,
          email: email.toLowerCase(),
          birthDate: dob,
          termsAccepted: isTerms,
          password: pswd,
          phone: "",
          phoneCountryCode: RNLocalize.getCountry(),
          image: "",
          identityProof: "",
          registrationCode: [store.User.notificationToken],
          subscriptionStatus: "freemium",
          role: "user",
          status: "active",
          notificationEnabled: true,
          mode: "mobile",
        };
        store.User.registerUser(body, UserCreateSuccess);
      } else {
        Alert.alert("", "Please connect internet");
      }
    });
  };

  const uploadPhoto = (c) => {
    if (c === "Profile" && photo === "") {
      setisPhotoUpload(false);
      return;
    }

    if (c === "CNICFront" && cnicFrontImage === "") {
      setisCnicFrontUplaod(false);
      return;
    }

    let imgArr = [];

    if (c === "Profile") {
      photo.chk = "Profile";
      imgArr.push(photo);
    }

    if (c === "CNICFront") {
      cnicFrontImage.chk = "CnicF";
      imgArr.push(cnicFrontImage);
    }

    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        store.User.attemptToUploadImage(
          imgArr,
          setErrMessage,
          setPhoto1Upload,
          SetUP,
          SetUCnicF,
          user._id,
          token
        );
      } else {
        Alert.alert("", "Please connect internet");
      }
    });
  };

  const checkCardError = (value) => {
    const cnvalid = value.validNumber === "Valid" ? true : false;
    if (!cnvalid) {
      setcardErr("Card number is invalid");
      return false;
    }
    const cevalid = value.validExpiryDate === "Valid" ? true : false;
    if (!cevalid) {
      setcardErr("Card expiry date is invalid");
      return false;
    }
    const ccvcvalid = value.validCVC === "Valid" ? true : false;
    if (!ccvcvalid) {
      setcardErr("Card cvc number is invalid");
      return false;
    }

    setcardErr("");
    return true;
  };

  const subscribePlan = () => {
    Keyboard.dismiss();

    if (cfn.trim() === "") {
      setEmptycfn(true);
      return;
    }

    if (nameRegex.test(cfn.trim()) === false) {
      setInvalidcfn(true);
      return;
    }

    if (!cardObj) {
      setcardErr("Please enter full Card detials");
      return;
    } else {
      if (!checkCardError(cardObj)) {
        return;
      } else {
        if (!iscTerms) {
          setEmptycTerms(true);
          return;
        }

        let tv = plan.type == "annual" ? totalAnually : monthly;
        tv = isPromoApply ? promoValue : tv;
        let pda = 0;
        if (isPromoApply) {
          const p = (isPromoApply.discount || 0) / 100;

          if (plan.type == "monthly") {
            pda = p * monthly;
          }
          if (plan.type == "annual") {
            pda = p * totalAnually;
          }
        }
        const subscription = {
          title: plan.type,
          charges: plan.charges,
          discount: plan.discount,
          startDate: new Date(),
          endDate: addMonths(new Date(), plan.type == "annual" ? 12 : 1),
          amtPaid: tv,
          status: "active",
          lastDigit: cardObj.last4,
          cardBrand: cardObj.brand,
        };

        if (isPromoApply) {
          subscription.promoCode = isPromoApply.code.trim();
          subscription.promoCodeDiscount = isPromoApply.discount;
          subscription.promoCodeDiscountAmt = pda;
        }

        const obj = {
          subscription: subscription,
          subscriptionStatus: "paid",
        };

        NetInfo.fetch().then((state) => {
          if (state.isConnected) {
            const body = {
              email: user.email,
              description: plan?.type,
              amount: tv * 100,
            };

            store.User.BuyPlan(body, obj, SucGetClientsecret);
          } else {
            Alert.alert("", "Please connect internet");
          }
        });

        return;
      }
    }
  };

  const SucGetClientsecret = async (dt, obj) => {
    try {
      const { error, paymentIntent } = await confirmPayment(dt.cs, {
        // paymentMethodType: "Card", //strip > 0.5.0
        type: "Card", //stripe <= 0.5.0
        billingDetails: { name: cfn.trim() },
      });

      if (error) {
        setregLoader(false);
        Notification.sendPaymentFailedNotification(user._id);
        console.log(`confirmPayment error: `, error);
        Alert.alert(`Payment ${error.code}`, error.message);
      } else if (paymentIntent) {
        obj.customerId = dt.cid;
        store.User.SubPlan(
          obj,
          user._id,
          dt.cid,
          token,
          setErrMessage,
          subPlanSuc,
          "n"
        );
      }
    } catch (err) {
      setregLoader(false);
      Notification.sendPaymentFailedNotification(user._id);
      console.log(`confirmPayment cath error: `, err);
    }
  };

  const goTOProfile = () => {
    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        store.User.getUserById(user._id, token, "profile");
      } else {
        // seterrorMessage('Please connect internet');
        Alert.alert("", "Please connect internet");
      }
    });
  };

  const goTOFindTrips = () => {
    // let u = {...usr};
    // // u.photo = uphoto;
    // // u.cnic_front_image = ucnicF;
    // // u.plan = sPlan;

    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        store.User.getUserById(user._id, token, "home");
      } else {
        // seterrorMessage('Please connect internet');
        Alert.alert("", "Please connect internet");
      }
    });
  };

  const applyPromo = () => {
    Keyboard.dismiss();
    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        store.User.applyPromo(pc.trim(), setErrMessage, applyPromoSuc);
      } else {
        // seterrorMessage('Please connect internet');
        Alert.alert("", "Please connect internet");
      }
    });
  };

  const UserCreateSuccess = (token, data, plans) => {
    setToken(token);
    setuser(data);
    setplans(plans);
    setisUserCreate(true);
  };

  function addMonths(date, months) {
    var d = date.getDate();
    date.setMonth(date.getMonth() + +months);
    if (date.getDate() != d) {
      date.setDate(0);
    }
    return date;
  }

  const subPlanSuc = (p) => {
    setisPhoto1Upload(4);
    setsPlan(p.subscription);
    clearCard();
  };

  const applyPromoSuc = (res) => {
    setisPromoApply(res);
  };

  const SetUP = (c) => {
    setuphoto(c);
  };

  const SetUCnicF = (c) => {
    setucnicF(c);
  };

  const onclickImage = (c) => {
    Keyboard.dismiss();

    if (c == "cnicFV") {
      setpv([cnicFrontImage.uri]);
      setpvm(true);
      return;
    }

    // if (c == 'cnicBV') {
    //   setpv(cnicBackImage.uri);
    //   setpvm(true);
    //   return;
    // }

    if (c == "profileV") {
      setpv([photo.uri]);
      setpvm(true);
      return;
    }

    MultipleImage(c);
  };

  const MultipleImage = async (button) => {
    const apiLevel = store.General.apiLevel;
    if (button == "Profile") {
      setisPhotoUpload(true);
    }
    if (button == "CNICFront") {
      setisCnicFrontUplaod(true);
    }
    setisShowGalleryPrmsn(false);
    setisShowCameraPrmsn(false);

    setTimeout(async () => {
      try {
        const options = {
          mediaType: "image",
          isPreview: false,
          maxSelectedAssets: 1,
        };
        const resp = await MultipleImagePicker.openPicker(options);
        console.log("mutipicker image res true  ");
        if (resp.length > 0) {
          const res = resp[0];

          const { path, mime, fileName } = res;
          let uri = path;
          if (Platform.OS == "android" && apiLevel < 29) {
            uri = "file://" + uri;
          }

          ImageCompressor.compress(uri, {
            compressionMethod: "auto",
          })
            .then(async (res) => {
              const imageObject = {
                uri: res,
                type: mime,
                fileName: fileName,
              };
              console.log("Compress image  : ", imageObject);
              if (button == "Profile") {
                setphoto(imageObject);
                return;
              } else if (button == "CNICFront") {
                setCnicFrontImage(imageObject);
                return;
              } else {
                return;
              }
            })
            .catch((err) => {
              console.log("Image compress error : ", err);
            });
        }
      } catch (error) {
        console.log("multi photo picker error : ", error);
      }
    }, 500);
  };

  const checkPermsn = async (c, dt) => {
    if (Platform.OS == "android") {
      const permissionAndroid = await check(PERMISSIONS.ANDROID.CAMERA);
      const permissionAndroid2 = await check(
        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
      );
      setDT(dt);

      if (permissionAndroid != "granted" || permissionAndroid2 != "granted") {
        if (c == "camera") {
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

    if (Platform.OS == "ios") {
      try {
        const permissionIos = await check(PERMISSIONS.IOS.CAMERA);
        const permissionIos2 = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);
        setDT(dt);

        if (permissionIos != "granted" || permissionIos2 != "granted") {
          if (c == "camera") {
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
        console.warn("Permsiion error : ", error);
      }
    }
  };

  //never ask again walas set krna
  //is se https://stackoverflow.com/questions/54075629/reactnative-permission-always-return-never-ask-again
  const reqPermission = async () => {
    if (Platform.OS == "android") {
      try {
        const reqPer = await PermissionsAndroid.request(
          PERMISSIONS.ANDROID.CAMERA
        );

        if (reqPer == "never_ask_again") {
          let title = "Camera Permission Blocked";
          let text = "Please allow grant permission to acces camera";

          Alert.alert(title, text, [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            {
              text: "Open Settings",
              onPress: () => {
                IntentLauncher.startActivity({
                  action: "android.settings.APPLICATION_DETAILS_SETTINGS",
                  data: "package:" + store.General.package,
                });
              },
            },
          ]);

          return;
        }

        if (reqPer == "granted") {
          const reqPer2 = await PermissionsAndroid.request(
            PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
          );

          if (reqPer2 == "never_ask_again") {
            let title = "Storage Permission Blocked";
            let text =
              "Please allow grant permission to acces photos in storage";

            Alert.alert(title, text, [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel",
              },
              {
                text: "Open Settings",
                onPress: () => {
                  IntentLauncher.startActivity({
                    action: "android.settings.APPLICATION_DETAILS_SETTINGS",
                    data: "package:" + store.General.package,
                  });
                },
              },
            ]);
            return;
          }

          if (reqPer2 == "granted") {
            onclickImage(DT);
          }
        }
      } catch (error) {
        console.log("req permsiion error : ", error);
      }
    }

    if (Platform.OS == "ios") {
      const pc = await check(PERMISSIONS.IOS.CAMERA);
      const pp = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);
      console.log("pc: ", pc);
      console.log("pp: ", pp);

      if (pc == "blocked" || pp == "blocked") {
        let title =
          pc == "blocked"
            ? "Camera Permission Blocked"
            : "Photo Permission Blocked";
        let text =
          pc == "blocked"
            ? "Please allow grant permission to acces camera"
            : "Please allow grant permission to acces all photos";
        Alert.alert(title, text, [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          {
            text: "Open Settings",
            onPress: () => {
              Linking.openURL("app-settings:");
            },
          },
        ]);
        return;
      }

      if (pp == "limited") {
        let title = "Photo Permission Limited";
        let text = "Please allow grant permission to select all photos";
        Alert.alert(title, text, [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          {
            text: "Open Settings",
            onPress: () => {
              Linking.openURL("app-settings:");
              //react-native-permissions // openSettings('App-Prefs:root=Photos');
            },
          },
        ]);
        return;
      }

      try {
        const reqPer = await request(PERMISSIONS.IOS.CAMERA);
        if (reqPer == "granted") {
          const reqPer2 = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
          if (reqPer2 == "granted") {
            onclickImage(DT);
          }
        }
      } catch (error) {
        console.log("req permsiion error : ", error);
      }
    }
  };

  const renderShowFieldError = (c) => {
    let text = c === "card" ? cardErr : "";

    if (c == "fn") {
      text = invalidfn
        ? "First name is invalid"
        : Emptyfn
        ? "Please enter a first name"
        : "";
    }

    if (c == "ln") {
      text = invalidln
        ? "Last name is invalid"
        : Emptyln
        ? "Please enter a last name"
        : "";
    }

    if (c == "email") {
      text = invalidemail
        ? "Email contains invalid characters"
        : Emptyemail
        ? "Please enter email"
        : "";
    }

    if (c == "dob") {
      text = Emptydob ? "Please select your birth date" : "";
    }

    if (c == "pswd") {
      text = invalidpswd
        ? "Password must contains 8 or more characters"
        : Emptypswd
        ? "Please enter password"
        : "";
    }

    if (c === "cpswd") {
      text = invalidcpswd
        ? `Confirm password dosen't match`
        : Emptycpswd
        ? "Please enter confirm password"
        : "";
    }

    if (c == "terms") {
      text = EmptyTerms ? "Agreeing to Terms and Conditions is required" : "";
    }

    if (c === "cfn") {
      text = Emptycfn
        ? "Please enter a full name"
        : invalidcfn
        ? "Full name is invalid"
        : "";
    }

    if (c == "cterms") {
      text = EmptycTerms ? "Agreeing to Terms and Conditions is required" : "";
    }

    return (
      <View style={styles.errorMessageFieldContainer}>
        <Text style={styles.errorMessageFieldText}>{text}</Text>
      </View>
    );
  };

  const renderSection2 = () => {
    // Methods

    const enterFn = (t) => {
      setEmptyfn(false);
      setinvalidfn(false);
      setfn(t);
    };

    const enterLn = (t) => {
      setEmptyln(false);
      setinvalidln(false);
      setln(t);
    };

    const enterEmail = (t) => {
      setinvalidemail(false);
      setEmptyemail(false);
      setemail(t);
    };

    const showPUDatepicker = () => {
      Keyboard.dismiss();
      setEmptydob(false);

      setPUdShow(true);
    };

    const enterPaswd = (t) => {
      setinvalidpswd(false);
      setEmptypswd(false);
      setpswd(t.trim());
    };

    const showPasswd = () => {
      setshowPaswd(!showPaswd);
    };

    const entercPaswd = (t) => {
      setinvalidcpswd(false);
      setEmptycpswd(false);
      setcpswd(t.trim());
    };

    const showcPasswd = () => {
      setshowcPaswd(!showcPaswd);
    };

    const changeTerms = () => {
      setEmptyTerms(false);
      setisTerms(!isTerms);
    };

    const TermsnCndtnClick = () => {
      openWebView();
    };

    const goToSignin = () => {
      props.navigation.navigate("Signin");
    };

    const formatDate = (date) => {
      var dd = moment(date).format("MM / DD / YYYY");
      return dd;
    };

    // Render

    const renderButton = () => {
      return (
        <>
          <TouchableOpacity
            onPress={createAccount}
            activeOpacity={0.7}
            style={styles.BottomButton}
          >
            <Text style={styles.buttonTextBottom}>create account</Text>
          </TouchableOpacity>
        </>
      );
    };

    return (
      <View style={styles.section2}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.section2Title1}>create account</Text>

          <View
            style={[
              styles.joinFieldContainer,
              { marginTop: responsiveHeight(0.5) },
            ]}
          >
            <View style={[styles.Field, { width: "48%" }]}>
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
              {(invalidfn || Emptyfn) && renderShowFieldError("fn")}
            </View>

            <View style={[styles.Field, { width: "48%" }]}>
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
              {(invalidln || Emptyln) && renderShowFieldError("ln")}
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
            {(invalidemail || Emptyemail) && renderShowFieldError("email")}
          </View>

          <View style={styles.Field}>
            <Text style={[styles.FieldTitle1, { textTransform: "none" }]}>
              Date of Birth
            </Text>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={showPUDatepicker}
              style={[
                styles.FieldInput,
                {
                  borderColor: Emptydob
                    ? theme.color.fieldBordeError
                    : theme.color.fieldBorder,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                },
              ]}
            >
              <View style={{ width: "85%" }}>
                {dob == "" && (
                  <Text style={styles.DateTextPlaceholder}>mm / dd / yyyy</Text>
                )}
                {dob != "" && (
                  <Text style={styles.DateText}>{formatDate(dob)}</Text>
                )}
              </View>

              <utils.vectorIcon.AntDesign
                name={"calendar"}
                color={"#30563A"}
                size={20}
              />
            </TouchableOpacity>

            {Emptydob && renderShowFieldError("dob")}
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
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                },
              ]}
            >
              <TextInput
                value={pswd}
                onChangeText={enterPaswd}
                secureTextEntry={!showPaswd}
                placeholder=""
                style={{
                  width: "85%",
                  height: responsiveHeight(5.8),
                  paddingVertical: 2,
                }}
              />

              {pswd.length > 0 && (
                <TouchableOpacity activeOpacity={0.5} onPress={showPasswd}>
                  {!showPaswd && (
                    <Image
                      style={{ width: 20, height: 12, resizeMode: "contain" }}
                      source={require("../../assets/images/sp/img.png")}
                    />
                  )}
                  {showPaswd && (
                    <utils.vectorIcon.Ionicons
                      name={"eye-off-outline"}
                      color={theme.color.button1}
                      size={20}
                    />
                  )}
                </TouchableOpacity>
              )}
            </View>

            {(invalidpswd || Emptypswd) && renderShowFieldError("pswd")}
          </View>

          <View style={styles.Field}>
            <Text style={styles.FieldTitle1}>Confirm Password</Text>
            <View
              style={[
                styles.FieldInput,
                {
                  borderColor:
                    invalidcpswd || Emptycpswd
                      ? theme.color.fieldBordeError
                      : theme.color.fieldBorder,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                },
              ]}
            >
              <TextInput
                value={cpswd}
                onChangeText={entercPaswd}
                secureTextEntry={!showcPaswd}
                placeholder=""
                style={{
                  width: "85%",
                  height: responsiveHeight(5.8),
                  paddingVertical: 2,
                }}
              />

              {cpswd.length > 0 && (
                <TouchableOpacity activeOpacity={0.5} onPress={showcPasswd}>
                  {!showcPaswd && (
                    <Image
                      style={{ width: 20, height: 12, resizeMode: "contain" }}
                      source={require("../../assets/images/sp/img.png")}
                    />
                  )}
                  {showcPaswd && (
                    <utils.vectorIcon.Ionicons
                      name={"eye-off-outline"}
                      color={theme.color.button1}
                      size={20}
                    />
                  )}
                </TouchableOpacity>
              )}
            </View>

            {(invalidcpswd || Emptycpswd) && renderShowFieldError("cpswd")}
          </View>

          <View style={styles.Field}>
            <View style={styles.Field2}>
              <TouchableOpacity
                style={[
                  styles.checkBoxContainer,
                  {
                    backgroundColor: !isTerms ? "white" : theme.color.button1,
                    borderColor: !EmptyTerms
                      ? theme.color.fieldBorder
                      : theme.color.fieldBordeError,
                  },
                ]}
                activeOpacity={0.5}
                onPress={changeTerms}
              >
                {isTerms && (
                  <utils.vectorIcon.FontAwesome5
                    name={"check"}
                    color={theme.color.buttonText}
                    size={responsiveFontSize(1.4)}
                  />
                )}
              </TouchableOpacity>

              <Text style={styles.Field2Title}>I agree to the </Text>
              <TouchableOpacity activeOpacity={0.7} onPress={TermsnCndtnClick}>
                <Text
                  style={[
                    styles.Field2Title,
                    { textDecorationLine: "underline", marginLeft: 0 },
                  ]}
                >
                  Terms & Conditions
                </Text>
              </TouchableOpacity>
            </View>
            {EmptyTerms && renderShowFieldError("terms")}
          </View>

          {renderButton()}
          <View style={styles.Field3}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.Field31Title1}>Already a member?</Text>
              <TouchableOpacity activeOpacity={0.7} onPress={goToSignin}>
                <Text style={styles.Field31Title2}>Sign in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  };

  const renderSection2User = () => {
    // Methods

    const entercFn = (t) => {
      setEmptycfn(false);
      setInvalidcfn(false);
      setEmptycTerms(false);
      setcfn(t);
    };

    const enterpc = (t) => {
      setpc(t);
    };

    const onChangeCard = (value) => {
      setCardObj(value);
      setEmptycTerms(false);
      setcardErr("");
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
      setisPromoApply(null);
      setisShowPromoFiled(false);
      setpc("");
      setpromoValue(0);
      setcfn("");
      setcardErr("");
      setCardObj(null);
      setEmptycTerms(false);
    };

    const changePlan = () => {
      setisPhoto1Upload(2);
      clearCard();
    };

    const TermsnCndtnClickCard = () => {
      openWebView();
    };

    // Render

    const renderButton = (c) => {
      return (
        <>
          <TouchableOpacity
            onPress={() => {
              if (c != "FindTrips") {
                uploadPhoto(c);
              } else {
                goTOFindTrips();
              }
            }}
            activeOpacity={0.7}
            style={[styles.BottomButton, { marginTop: 40 }]}
          >
            {c == "Profile" && (
              <Text style={styles.buttonTextBottom}>
                {photo == "" ? "Continue" : "Confirm & Continue"}
              </Text>
            )}
            {c == "CNICFront" && (
              <Text style={styles.buttonTextBottom}>
                {cnicFrontImage == "" ? "Continue" : "Confirm & Continue"}
              </Text>
            )}
            {c == "FindTrips" && (
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
            width: "100%",
            marginTop: 10,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            onPress={reqPermission}
            activeOpacity={0.7}
            style={styles.BottomButtonP}
          >
            <Text style={styles.buttonPTextBottom}>Yes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              if (isShowCameraPrmsn) setisShowCameraPrmsn(false);
              else setisShowGalleryPrmsn(false);
            }}
            activeOpacity={0.7}
            style={styles.BottomButtonP}
          >
            <Text style={styles.buttonPTextBottom}>No</Text>
          </TouchableOpacity>
        </View>
      );
    };

    const renderButtonCP = (c) => {
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
            ]}
          >
            <Text
              style={[
                styles.buttonTextBottom,
                {
                  color: theme.color.buttonTextGreen,
                  fontFamily: theme.fonts.fontMedium,
                },
              ]}
            >
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
              { marginTop: 0, width: "60%", height: 55 },
            ]}
          >
            <Text style={[styles.buttonTextBottom, { fontSize: 14 }]}>
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
            style={styles.BottomButton}
          >
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
            ]}
          >
            <Text
              style={[
                styles.buttonTextBottom,
                {
                  color: theme.color.subTitle,
                  fontFamily: theme.fonts.fontBold,
                  textTransform: "none",
                },
              ]}
            >
              Go to My Profile
            </Text>
          </TouchableOpacity>
        </>
      );
    };

    const renderShowError2 = (c) => {
      let text = c == "Profile" ? "Please upload photo" : "";

      return (
        <View style={styles.errorMessageContainer}>
          <Text style={styles.errorMessageText}>{text}</Text>
        </View>
      );
    };

    const renderPlanBar = () => {
      const p = plans.data.map((e, i, a) => {
        const name = e.type || "";

        return (
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
              setPlan(e);
            }}
            style={{
              paddingHorizontal: 12,
              height: 37,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor:
                plan.type == name
                  ? theme.color.button1
                  : theme.color.disableBack,
              borderTopLeftRadius: i == 0 ? 8 : 0,
              borderBottomLeftRadius: i == 0 ? 8 : 0,
              borderTopRightRadius: i == a.length - 1 ? 8 : 0,
              borderBottomRightRadius: i == a.length - 1 ? 8 : 0,
            }}
          >
            <Text
              style={{
                fontSize: 13,
                color:
                  plan.type == name
                    ? theme.color.buttonText
                    : theme.color.subTitle,
                fontFamily: theme.fonts.fontMedium,
                textTransform: "capitalize",
              }}
            >
              {name}
            </Text>
          </TouchableOpacity>
        );
      });

      return p;
    };

    const renderPlanDetails = () => {
      const pd = plan.features.map((feature) => {
        return (
          <View
            style={{
              flexDirection: "row",
              marginTop: 2,
              width: "100%",
            }}
          >
            <utils.vectorIcon.Entypo name="check" color={"#16953A"} size={20} />
            <Text
              style={{
                fontSize: 14,
                color: theme.color.subTitleAuth,
                fontFamily: theme.fonts.fontNormal,
                marginLeft: 10,
                bottom: 1,
                opacity: 0.6,
              }}
            >
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
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <Text style={styles.section2Title1}>
                  {photo == "" ? "add" : "review"} profile photo
                </Text>
                {photo == "" && (
                  <Image
                    source={require("../../assets/images/addphoto/img.png")}
                    style={styles.section2Logo}
                  />
                )}

                {!isPhotoUpload && renderShowError2("Profile")}
                <Text style={styles.section2LogoTitle}>
                  {photo == ""
                    ? "Upload a photo to help the community recognize and promote your account."
                    : "If you are happy with the result, click Confirm & Continue below or try a different photo."}
                </Text>

                {photo == "" && (
                  <View style={styles.uploadIndication}>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => {
                        checkPermsn("gallery", "Profile");
                      }}
                    >
                      <Image
                        source={require("../../assets/images/uploadphoto/img.png")}
                        style={styles.uploadIndicationLogo}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => {
                        checkPermsn("camera", "Profile");
                      }}
                    >
                      <Image
                        source={require("../../assets/images/takephoto/img.png")}
                        style={styles.uploadIndicationLogo}
                      />
                    </TouchableOpacity>
                  </View>
                )}

                {photo != "" && (
                  <TouchableOpacity
                    style={styles.imageContainerP}
                    activeOpacity={0.7}
                    onPress={() => onclickImage("profileV")}
                  >
                    <Image source={{ uri: photo.uri }} style={styles.imageP} />
                  </TouchableOpacity>
                )}
              </View>

              {renderButton("Profile")}
              {photo != "" && renderButtonCP("Profile")}

              {photo == "" && (
                <TouchableOpacity activeOpacity={0.7} onPress={Skip}>
                  <Text style={styles.section2bottomTitle}>Skip for now</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        )}

        {/* Cnic 1 */}
        {isPhoto1Upload == 1 && !isShowCameraPrmsn && !isShowGalleryPrmsn && (
          <View style={styles.section2}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <Text style={styles.section2Title1}>
                  {cnicFrontImage == ""
                    ? "verify identity"
                    : "review your id card"}
                </Text>
                {cnicFrontImage == "" && (
                  <Image
                    source={require("../../assets/images/addcnic/img.png")}
                    style={styles.section2Logo}
                  />
                )}

                {!isCnicFrontUplaod && renderShowError2("Profile")}
                <Text style={[styles.section2LogoTitle]}>
                  {cnicFrontImage == ""
                    ? "Trip Trader is committed to community trust and security. Providing a valid government-issued ID to confirm your identity helps us keep the community safe and creates trust between you and other traders."
                    : "Make sure you are only submitting a valid government issued  ID and that your picture and all information is clearly visible."}
                </Text>

                {cnicFrontImage == "" && (
                  <View style={styles.uploadIndication}>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => {
                        checkPermsn("gallery", "CNICFront");
                      }}
                    >
                      <Image
                        source={require("../../assets/images/uploadphoto/imgg.png")}
                        style={styles.uploadIndicationLogo}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => {
                        checkPermsn("camera", "CNICFront");
                      }}
                    >
                      <Image
                        source={require("../../assets/images/takephoto/img.png")}
                        style={styles.uploadIndicationLogo}
                      />
                    </TouchableOpacity>
                  </View>
                )}

                {cnicFrontImage != "" && (
                  <View style={styles.imageContainer}>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => onclickImage("cnicFV")}
                    >
                      <Image
                        source={{ uri: cnicFrontImage.uri }}
                        style={styles.image}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              {renderButton("CNICFront")}
              {cnicFrontImage != "" && renderButtonCP("CNICFront")}
              {cnicFrontImage == "" && (
                <TouchableOpacity activeOpacity={0.7} onPress={Skip}>
                  <Text style={styles.section2bottomTitle}>Skip for now</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        )}

        {/* permsiion */}

        {(isShowCameraPrmsn || isShowGalleryPrmsn) && (
          <View style={styles.section2}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <Text style={styles.section2Title1}>
                  {isShowCameraPrmsn ? "Camera Access" : "Storage Access"}
                </Text>

                <Image
                  source={
                    isShowCameraPrmsn
                      ? require("../../assets/images/ca/img.png")
                      : require("../../assets/images/ca/img.png")
                  }
                  style={styles.section2Logo}
                />

                <Text
                  style={[
                    styles.section2LogoTitle,
                    { textAlign: "center", width: "90%", alignSelf: "center" },
                  ]}
                >
                  {isShowCameraPrmsn
                    ? "Trip Trader wants permission to access your camera."
                    : "Trip Trader wants permission to access your storage."}
                </Text>
                <Text style={styles.section2LogoTitlee}>Grant access?</Text>
              </View>

              {renderButtonPermission()}
            </ScrollView>
          </View>
        )}

        {/* Plan 2 */}

        {isPhoto1Upload == 2 && (
          <View style={styles.section2}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={[
                    styles.section2Title1,
                    { textTransform: "none", alignSelf: "flex-start" },
                  ]}
                >
                  Choose a plan
                </Text>

                <Text
                  style={[
                    styles.section2LogoTitle2c,
                    { alignSelf: "flex-start" },
                  ]}
                >
                  Unlock all features with a subscription.
                </Text>
              </View>

              <View
                style={{
                  width: "100%",
                  alignSelf: "center",
                  height: 0.6,
                  backgroundColor: theme.color.subTitleLight,
                  marginVertical: 15,
                  opacity: 0.5,
                }}
              />

              <View style={{ marginTop: 7 }}>
                {plans && plans.data && (
                  <>
                    <View
                      style={{
                        alignItems: "center",
                        flexDirection: "row",
                      }}
                    >
                      {renderPlanBar()}
                    </View>
                  </>
                )}

                {plan && (
                  <>
                    <View style={{ marginTop: 20 }}>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Text
                          style={{
                            fontSize: 26,
                            color: theme.color.title,
                            fontFamily: theme.fonts.fontBold,
                          }}
                        >
                          $
                          {plan.type == "annual" ? annualy.toFixed(2) : monthly}
                        </Text>
                        <Text
                          style={{
                            fontSize: 12,
                            color: theme.color.subTitleAuth,
                            fontFamily: theme.fonts.fontBold,
                            opacity: 0.6,
                            marginLeft: 5,
                          }}
                        >
                          /month{" "}
                          {plan.type == "annual" ? "(Billed annually)" : ""}
                        </Text>
                      </View>
                      {plan.type === "annual" && (
                        <Text
                          style={{
                            fontSize: 12,
                            color: "#16953A",
                            fontFamily: theme.fonts.fontMedium,
                            textTransform: "capitalize",
                            top: -5,
                          }}
                        >
                          Best Value • ${toFixed(save, 0)} savings
                        </Text>
                      )}
                      {plan.type === "monthly" && (
                        <>
                          {save > 0 && (
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                top: -5,
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 12,
                                  color: "#767676",
                                  fontFamily: theme.fonts.fontMedium,
                                }}
                              >
                                Save ${toFixed(save, 0)} with an
                              </Text>
                              <TouchableOpacity
                                activeOpacity={0.6}
                                onPress={() => {
                                  setPlan(plans.data[1]);
                                }}
                              >
                                <Text
                                  style={{
                                    fontSize: 12,
                                    color: "green",
                                    fontFamily: theme.fonts.fontMedium,
                                    marginLeft: 5,
                                  }}
                                >
                                  Annual Plan
                                </Text>
                              </TouchableOpacity>
                            </View>
                          )}
                        </>
                      )}
                    </View>
                    {plan.features.length > 0 && (
                      <View style={{ marginTop: 20 }}>
                        {renderPlanDetails()}
                      </View>
                    )}
                  </>
                )}
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 25,
                }}
              >
                {renderButtonPlan()}
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    // setPlan('free');
                    setsPlan("free");
                    setisPhoto1Upload(4);
                  }}
                >
                  <Text
                    style={[
                      styles.section2bottomTitle,
                      {
                        marginTop: 0,
                        marginLeft: 25,
                        fontSize: 14,
                        color: "rgba(17, 17, 17, 0.6)",
                      },
                    ]}
                  >
                    Try for free
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        )}

        {/* Payment 3 */}

        {isPhoto1Upload == 3 && (
          <View style={styles.section2}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={[
                    styles.section2Title1,
                    { textTransform: "none", alignSelf: "flex-start" },
                  ]}
                >
                  Payment Information
                </Text>

                <Text
                  style={[
                    styles.section2LogoTitle2c,
                    { alignSelf: "flex-start", marginTop: 5 },
                  ]}
                >
                  Your subscription will start after you make your first payment
                  below.
                </Text>
              </View>
              <View
                style={{
                  width: "100%",
                  height: 0.6,
                  alignSelf: "center",
                  marginVertical: 12,
                  backgroundColor: theme.color.subTitleLight,
                  opacity: 0.5,
                }}
              />
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    width: "100%",
                  }}
                >
                  <Text style={styles.paymenttitle1}>total due Now :</Text>
                  {!isPromoApply && (
                    <Text
                      style={[
                        styles.paymenttitle1,
                        {
                          color: theme.color.title,
                          width: "65%",
                          marginLeft: 5,
                          textTransform: "none",
                        },
                      ]}
                    >
                      {plan.type == "annual"
                        ? `$${toFixed(totalAnually, 2)} ($${annualy.toFixed(
                            2
                          )} /mo)`
                        : `$${monthly} /mo`}
                    </Text>
                  )}

                  {isPromoApply && (
                    <View
                      style={{
                        flexDirection: "row",
                        marginLeft: 5,
                        width: "65%",
                      }}
                    >
                      <Text
                        style={{
                          color: theme.color.title,
                          fontSize: 11,

                          fontFamily: theme.fonts.fontBold,
                          textTransform: "capitalize",
                          textDecorationLine: "line-through",
                        }}
                      >
                        {plan.type == "annual"
                          ? `$${toFixed(totalAnually, 2)}`
                          : `$${monthly}`}
                        {"  "}
                      </Text>

                      <Text
                        style={{
                          color: theme.color.titleGreen,
                          fontSize: 11,
                          fontFamily: theme.fonts.fontBold,
                          textTransform: "capitalize",
                        }}
                      >
                        ${promoValue} ({isPromoApply.discount}% discount)
                      </Text>
                    </View>
                  )}
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.paymenttitle2}>your plan :</Text>
                  <Text
                    style={[
                      styles.paymenttitle2,
                      {
                        color: theme.color.title,
                        marginLeft: 5,
                      },
                    ]}
                  >
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
                          textDecorationLine: "underline",
                        },
                      ]}
                    >
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
                        borderColor:
                          Emptycfn || invalidcfn
                            ? theme.color.fieldBordeError
                            : theme.color.fieldBorder,
                        fontSize: 12,
                        color: "black",
                      },
                    ]}
                  />
                  {(Emptycfn || invalidcfn) && renderShowFieldError("cfn")}
                </View>

                <View style={styles.Field}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={styles.FieldTitle1}>card</Text>
                  </View>

                  <CardField
                    postalCodeEnabled={false}
                    placeholders={{
                      number: "Card number",
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
                      width: "100%",
                      height: 45,
                    }}
                    onCardChange={onChangeCard}
                  />
                  {cardErr !== "" && renderShowFieldError("card")}
                </View>

                {isShowPromoFiled && (
                  <View style={styles.Field}>
                    <Text style={styles.FieldTitle1}>promo code</Text>

                    {!isPromoApply && (
                      <View
                        style={[
                          styles.FieldInput,
                          {
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            paddingHorizontal: 0,
                            borderWidth: 1,
                            borderColor: theme.color.fieldBorder,
                          },
                        ]}
                      >
                        <TextInput
                          placeholder="Add a promo code"
                          value={pc}
                          onChangeText={enterpc}
                          style={{
                            fontSize: 13,
                            color: "black",
                            width: "70%",
                            height: "100%",
                            paddingLeft: 10,
                            height: responsiveHeight(5.8),
                            paddingVertical: 2,
                          }}
                        />

                        {pc != "" && (
                          <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={applyPromo}
                            style={{
                              width: 60,
                              height: "100%",
                              borderTopRightRadius: 8,
                              borderBottomRightRadius: 8,
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: theme.color.button1,
                              paddingHorizontal: 3,
                            }}
                          >
                            <Text
                              style={{
                                color: theme.color.buttonText,
                                fontSize: 13,
                                fontFamily: theme.fonts.fontMedium,
                              }}
                            >
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
                          alignItems: "center",
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text
                          numberOfLines={1}
                          ellipsizeMode="tail"
                          style={{
                            width: "50%",
                            color: theme.color.title,
                            fontSize: 12,
                            fontFamily: theme.fonts.fontMedium,
                            textTransform: "uppercase",
                          }}
                        >
                          {isPromoApply.code.trim()}
                        </Text>

                        <TouchableOpacity
                          activeOpacity={0.7}
                          onPress={() => setisPromoApply(null)}
                        >
                          <Text
                            style={{
                              color: theme.color.titleGreen,
                              fontSize: 12,
                              fontFamily: theme.fonts.fontMedium,
                              textDecorationLine: "underline",
                            }}
                          >
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
                    style={{ marginTop: 20 }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        color: theme.color.titleGreen,
                        fontFamily: theme.fonts.fontMedium,
                        textDecorationLine: "underline",
                      }}
                    >
                      I have a promo code
                    </Text>
                  </TouchableOpacity>
                )}

                <View style={{ marginTop: 20 }}>
                  <View
                    style={[styles.Field2, { justifyContent: "space-between" }]}
                  >
                    <TouchableOpacity
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 4,
                        backgroundColor: !iscTerms
                          ? "white"
                          : theme.color.button1,
                        alignItems: "center",
                        justifyContent: "center",
                        borderWidth: 1,
                        borderColor: theme.color.fieldBorder,
                      }}
                      activeOpacity={0.5}
                      onPress={() => {
                        setiscTerms(!iscTerms);
                        setEmptycTerms(false);
                      }}
                    >
                      {iscTerms && (
                        <utils.vectorIcon.FontAwesome5
                          name={"check"}
                          color={theme.color.buttonText}
                          size={11}
                        />
                      )}
                    </TouchableOpacity>

                    <View style={{ width: "90%" }}>
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={TermsnCndtnClickCard}
                      >
                        <Text style={styles.Field2Titlec}>
                          I agree to Trip Trader’s{" "}
                          <Text style={styles.Field2Titlecc}>
                            Terms & Conditions
                          </Text>
                        </Text>
                      </TouchableOpacity>
                      <Text style={[styles.Field2Titlec, { top: -3 }]}>
                        and understand that upon clicking “Subscribe” below, I
                        will be charged{" "}
                        {plan.type == "annual"
                          ? `$${toFixed(totalAnually, 2)}`
                          : `$${monthly}`}{" "}
                        {plan.type == "annual" ? plan.type + "y" : plan.type}.
                      </Text>
                    </View>
                  </View>
                  {EmptycTerms && renderShowFieldError("cterms")}
                </View>
              </View>

              {renderButtonSubscribe()}

              <TouchableOpacity activeOpacity={0.7} onPress={changePlan}>
                <Text
                  style={[
                    styles.section2bottomTitle,
                    { color: "rgba(17, 17, 17, 0.6)" },
                  ]}
                >
                  Cancel and go back
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        )}

        {/* Ready 4 */}
        {isPhoto1Upload == 4 && (
          <View style={styles.section2}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles.section2Title1}
                >
                  welcome, {user.firstName}!
                </Text>
                <View style={styles.section2LogoC}>
                  <Image
                    source={require("../../assets/images/accountReady/img1.png")}
                    style={styles.section2LogoCImg1}
                  />
                  <Image
                    source={require("../../assets/images/accountReady/img2.png")}
                    style={styles.section2LogoCImg2}
                  />
                </View>

                <Text style={styles.section2LogoTitle1c}>
                  Your account is ready.
                </Text>

                <Text
                  style={[
                    styles.section2LogoTitle2c,
                    { color: theme.color.subTitleAuth, textAlign: "center" },
                  ]}
                >
                  Good luck on your trips and trades!
                </Text>
              </View>

              {renderButton("FindTrips")}
              {renderButton2()}
            </ScrollView>
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
            backgroundColor={"transparent"}
            barStyle={"light-content"}
          />
        )}

        {pvm && (
          <StatusBar
            translucent={false}
            backgroundColor={"black"}
            barStyle={"light-content"}
          />
        )}
      </>
    );
  };

  const renderDateShowModal = () => {
    return (
      <DatePicker
        maximumDate={new Date()}
        modal
        mode="date"
        format="MM-DD-YYYY"
        open={pudshow}
        // textColor={theme.color.title}
        date={dob == "" ? new Date() : dob}
        onConfirm={(date) => {
          console.log("data : ", date);
          setPUdShow(false);
          setdob(date);
        }}
        onCancel={() => {
          setPUdShow(false);
        }}
      />
    );
  };

  const openWebView = () => {
    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        setIsShowTermsAndConditions(true);
      } else {
        Alert.alert("Network Error", "Please connect internet.");
      }
    });
  };

  return (
    <StripeProvider publishableKey={store.General.Stripe_Publish_Key}>
      <View style={styles.container}>
        <Image
          source={require("../../assets/images/background/img.png")}
          style={styles.container2}
        />

        <SafeAreaView style={styles.container3}>
          <utils.AuthHeader
            props={props}
            screen="signup"
            goBack={() => goBack()}
          />
          <KeyboardAvoidingView
            style={{
              flex: 1,
              paddingHorizontal: 15,
              marginTop: responsiveHeight(3),
            }}
            behavior={Platform.OS == "ios" ? "padding" : undefined}
          >
            {!isUserCreate && renderSection2()}
            {isUserCreate && renderSection2User()}
          </KeyboardAvoidingView>
        </SafeAreaView>

        {pvm && (
          <utils.FullimageModal
            data={pv}
            si={0}
            show={pvm}
            closModal={() => setpvm(!pvm)}
          />
        )}
        <Toast ref={toast} position="center" />
        <utils.Loader load={regLoader} />

        {renderStatusBar()}
        {renderDateShowModal()}

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
