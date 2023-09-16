import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  BackHandler,
  Image,
  Keyboard,
  KeyboardAvoidingView,
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
import * as RNLocalize from "react-native-localize";
import {
  check,
  openSettings,
  PERMISSIONS,
  request,
} from "react-native-permissions";
import { observer } from "mobx-react";
import moment from "moment";
import { styles } from "./styles";
import store from "../../store/index";
import theme from "../../theme";
import utils from "../../utils/index";

export default observer(Signup);
function Signup(props) {
  const emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
  const nameRegex = /^[a-zA-Z-' ]+$/;
  const toast = useRef(null);
  const { regLoader, registerUser } = store.User;

  const [isUserCreate, setisUserCreate] = useState(false);

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

  const [steps, setSteps] = useState(0);

  const [isTerms, setisTerms] = useState(false);
  const [EmptyTerms, setEmptyTerms] = useState(false);

  const [user, setuser] = useState(false);

  const [isShowTermsAndConditions, setIsShowTermsAndConditions] =
    useState(false);
  const [isFullImageModal, setIsFullImageModal] = useState(false); //show fulll image modal
  const [fullImageUri, setFullImageUri] = useState(""); //photo view

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
  }, [isUserCreate, steps, isShowCameraPrmsn, isShowGalleryPrmsn]);

  function handleBackButtonClick() {
    if (!props.navigation.isFocused()) {
      return false;
    } else {
      if (
        !isUserCreate &&
        steps == 0 &&
        !isShowCameraPrmsn &&
        !isShowGalleryPrmsn
      ) {
        props.navigation.goBack();
      } else {
        goBack();
      }
      return true;
    }
  }

  const goBack = () => {
    if (
      !isUserCreate &&
      steps == 0 &&
      !isShowCameraPrmsn &&
      !isShowGalleryPrmsn
    ) {
      props.navigation.goBack();
    } else {
      if (
        isUserCreate &&
        steps == 0 &&
        !isShowCameraPrmsn &&
        !isShowGalleryPrmsn
      ) {
        setisUserCreate(false);
        setphoto("");
      }

      if (
        isUserCreate &&
        steps == 1 &&
        !isShowCameraPrmsn &&
        !isShowGalleryPrmsn
      ) {
        setCnicFrontImage("");
        setSteps(0);
      }

      if (
        isUserCreate &&
        (steps == 0 || steps == 1) &&
        (isShowCameraPrmsn || isShowGalleryPrmsn)
      ) {
        setisShowCameraPrmsn(false);
        setisShowGalleryPrmsn(false);
      }
    }
  };

  const clearAllField = () => {
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

  const uploadPhoto = (c) => {
    if (c === "Profile" && photo === "") {
      setisPhotoUpload(false);
      return;
    }

    if (c === "CNICFront" && cnicFrontImage === "") {
      setisCnicFrontUplaod(false);
      return;
    }

    const imgArr = [];
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
        store.User.attemptToUploadImage(imgArr, setSteps, user, gotoPlanScreen);
      } else {
        Alert.alert("", "Please connect internet");
      }
    });
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

    if (ln.trim() === "") {
      setEmptyln(true);
      return;
    }

    if (nameRegex.test(ln.trim()) === false) {
      setinvalidln(true);
      return;
    }

    if (email.trim() === "") {
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

    if (pswd === "") {
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

    if (isTerms === false) {
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
        registerUser(body, UserCreateSuccess);
      } else {
        Alert.alert("", "Please connect internet");
      }
    });
  };

  const UserCreateSuccess = (data) => {
    setuser(data);
    setisUserCreate(true);
  };

  const onclickImage = (c) => {
    Keyboard.dismiss();

    if (c == "cnicFV") {
      setFullImageUri([cnicFrontImage.uri]);
      setIsFullImageModal(true);
      return;
    }

    // if (c == 'cnicBV') {
    //   setpv(cnicBackImage.uri);
    //   setpvm(true);
    //   return;
    // }

    if (c == "profileV") {
      setFullImageUri([photo.uri]);
      setIsFullImageModal(true);
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
                openSettings();
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
                  openSettings();
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
              openSettings();
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
              openSettings();
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
    let text = "";

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

    return (
      <View style={styles.errorMessageFieldContainer}>
        <Text style={styles.errorMessageFieldText}>{text}</Text>
      </View>
    );
  };

  const gotoPlanScreen = (usr) => {
    props.navigation.navigate("PlanStack", {
      screen: "Plan",
      params: { usrData: usr, callingScreen: "Signup" },
    });
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

    const Skip = () => {
      if (steps === 0) {
        setisPhotoUpload(true);
        setSteps(1);
      }

      if (steps === 1) {
        setisCnicFrontUplaod(true);
        gotoPlanScreen(user);
      }
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

    const renderShowError2 = (c) => {
      let text = c == "Profile" ? "Please upload photo" : "";

      return (
        <View style={styles.errorMessageContainer}>
          <Text style={styles.errorMessageText}>{text}</Text>
        </View>
      );
    };

    return (
      <>
        <View style={styles.section2}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* profile  0*/}
            {steps == 0 && !isShowCameraPrmsn && !isShowGalleryPrmsn && (
              <>
                <View
                  style={{ alignItems: "center", justifyContent: "center" }}
                >
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
                      <Image
                        source={{ uri: photo.uri }}
                        style={styles.imageP}
                      />
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
              </>
            )}

            {/* Cnic 1 */}
            {steps == 1 && !isShowCameraPrmsn && !isShowGalleryPrmsn && (
              <>
                <View
                  style={{ alignItems: "center", justifyContent: "center" }}
                >
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
              </>
            )}

            {/* permsiion */}
            {(isShowCameraPrmsn || isShowGalleryPrmsn) && (
              <>
                <View
                  style={{ alignItems: "center", justifyContent: "center" }}
                >
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
                      {
                        textAlign: "center",
                        width: "90%",
                        alignSelf: "center",
                      },
                    ]}
                  >
                    {isShowCameraPrmsn
                      ? "Trip Trader wants permission to access your camera."
                      : "Trip Trader wants permission to access your storage."}
                  </Text>
                  <Text style={styles.section2LogoTitlee}>Grant access?</Text>
                </View>
                {renderButtonPermission()}
              </>
            )}
          </ScrollView>
        </View>
      </>
    );
  };

  const renderStatusBar = () => {
    return (
      <>
        {!isFullImageModal && (
          <StatusBar
            translucent={true}
            backgroundColor={"transparent"}
            barStyle={"light-content"}
          />
        )}

        {isFullImageModal && (
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
        date={dob === "" ? new Date() : dob}
        onConfirm={(date) => {
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

      {isFullImageModal && (
        <utils.FullimageModal
          data={fullImageUri}
          si={0}
          show={isFullImageModal}
          closModal={() => setIsFullImageModal(!isFullImageModal)}
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
  );
}
