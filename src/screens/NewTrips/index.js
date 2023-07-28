import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Linking,
  PermissionsAndroid,
  Platform,
  TextInput,
  Pressable,
  Modal as MModal,
  Keyboard,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import { styles } from "./styles";
import { observer } from "mobx-react";
import store from "../../store/index";
import utils from "../../utils/index";
import theme from "../../theme";
import MultipleImagePicker from "@baronha/react-native-multiple-image-picker";
import { Image as ImageCompressor } from "react-native-compressor";
import { request, PERMISSIONS, check } from "react-native-permissions";
import ProgressiveFastImage from "@freakycoder/react-native-progressive-fast-image";
import {
  responsiveFontSize,
  responsiveHeight,
} from "react-native-responsive-dimensions";
import NetInfo from "@react-native-community/netinfo";
import Toast from "react-native-easy-toast";
import IntentLauncher from "react-native-intent-launcher";
import { ScrollView } from "react-native-gesture-handler";
import moment from "moment";

const activityIconSrc = require("../../assets/images/filters/activity/img.png");
const speciesIconSrc = require("../../assets/images/filters/species/img.png");

export default observer(NewTrips);

function NewTrips(props) {
  const maxPhotos = 6;
  const headerTitle = !editTrip ? "New Trip" : "Edit Trip";
  const activeOpacity = 0.8;
  const toast = useRef(null);
  const maxModalHeight = theme.window.Height - 100;

  const { isInternet, setgoto } = store.General;
  const { activityList } = store.Filters;
  const {
    user,
    ctripsLoader,
    editTripObj,
    editTrip,
    seteditTrip,
    seteditTripObj,
    Logout,
    setctripLoader,
  } = store.User;
  const stateDataList = [...store.Filters.tripLocation];
  const speciesDataList = [...store.Filters.species];
  const durationDataList = [
    {
      _id: 0,
      is_active: true,
      title: "days",
      type: "durType",
    },
    {
      _id: 1,
      is_active: true,
      title: "weeks",
      type: "durType",
    },
  ];

  const [modalHeight, setmodalHeight] = useState(0);
  const [isDropDownTripType, setIsDropDownTripType] = useState(false);
  const [isDropDownDuration, setIsDropDownDuration] = useState(false);
  const [isDropDownSpecies, setIsDropDownSpecies] = useState(false);
  const [isDropDownState, setIsDropDownState] = useState(false);
  const [isShowCalender, setIsShowCalender] = useState(false);
  const [isShowUnAvailable, setIsShowUnAvailable] = useState(false);
  const [availablityDates, setAvailablityDates] = useState(null);
  const [unAvailable, setUnAvailble] = useState(null);
  const [title, settitle] = useState("");
  const [tripType, settripType] = useState("");
  const [city, setcity] = useState("");
  const [state, setState] = useState(null);
  const [durationNumber, setDurationNumber] = useState(1);
  const [duration, setDuration] = useState(durationDataList[0]);
  const [speciesData, setSpeciesData] = useState([]);
  const [species, setspecies] = useState("");
  const [status, setstatus] = useState("active");
  const [Return, setReturn] = useState("");
  const [acceptOther, setacceptOther] = useState(false);

  const [isShowPrmsn, setisShowPrmsn] = useState(false);
  const [prmsnChk, setprmsnChk] = useState("");
  const [DT, setDT] = useState(false);
  const [isAddPhotoModal, setisAddPhotoModal] = useState(false);

  const [photos, setPhotos] = useState([]);
  const [pvm, setpvm] = useState(false);
  const [si, setsi] = useState("");
  const [deletePObj, setdeletePObj] = useState(false);
  const [deleteModal, setdeleteModal] = useState(false);
  const [isReviewTrip, setisReviewTrip] = useState(false);
  const [isTripCreate, setisTripCreate] = useState(false);
  const [modalChk, setmodalChk] = useState(false);
  const [isModal, setisModal] = useState(false);

  let minDate;
  let maxDate;
  let rangeValue = "Select a date range";
  let totalDays = 0;
  let unavailableText;
  if (availablityDates) {
    const size = Object.keys(availablityDates).length;
    const startDate = Object.keys(availablityDates)[0];
    const endDate = Object.keys(availablityDates)[size - 1];
    if (startDate > endDate) {
      minDate = endDate;
      maxDate = startDate;
    } else {
      minDate = startDate;
      maxDate = endDate;
    }
    rangeValue = utils.functions.checkSameYearFormate(minDate, maxDate);
  } else {
    minDate = "";
    maxDate = "";
  }
  if (duration.title === "days") totalDays = durationNumber;
  else if (duration.title === "weeks") totalDays = durationNumber * 7;
  if (unAvailable) {
    const text1 = unAvailable.dayWeekText;
    const text2 = unAvailable.excludeDateText;
    if (text1 != "" && text2 != "") unavailableText = text1 + ", " + text2;

    if (text1 == "" && text2 != "") unavailableText = text2;
    else if (text1 != "" && text2 == "") unavailableText = text1;
  } else unavailableText = "";

  useEffect(() => {
    if (tripType != "") {
      let arr = [];
      speciesDataList.forEach((item) => {
        if (item.type && item.type.name == tripType.name) arr.push(item);
      });
      setSpeciesData(arr);
    }
  }, [tripType]);

  useEffect(() => {
    if (user === "guest") {
      setgoto("guestaccess");
      Logout();
    }
  }, []);

  useEffect(() => {
    return () => {
      seteditTrip(false);
      seteditTripObj(false);
    };
  }, []);

  useEffect(() => {
    if (editTrip === true) {
      const data = editTripObj.data;
      const index = editTripObj.index;

      const tripType = utils.functions.findItem(
        data.tradeType || "",
        activityList,
        "n"
      );
      const location = data.location ? data.location : null;

      if (location) {
        setcity(location.city);
        setState(
          utils.functions.findItem(location.state || "", stateDataList, "n")
        );
      } else {
        setcity("");
        setState("");
      }
      const species = utils.functions.findItem(
        data.species || "",
        speciesDataList,
        "n"
      );
      let dateList = {};
      const dayList = utils.functions.getDaysBetweenDate(
        new Date(utils.functions.DateWithoutFormat(data.availableFrom)),
        new Date(utils.functions.DateWithoutFormat(data.availableTo))
      );
      if (dayList.length > 0) {
        dayList.map((item, index, arr) => {
          const date = moment(item).format("YYYY-MM-DD");
          if (index == 0) dateList[date] = theme.dayStyle.markeDateStyle;

          if (index > 0 && index < arr.length - 1)
            dateList[date] = theme.dayStyle.markeDateStyle;

          if (index == arr.length - 1)
            dateList[date] = theme.dayStyle.markeDateStyle;
        });
      }

      const acceptOtherTrades = data.acceptTradeOffers;
      const durNo = data.duration.value;
      const durt = utils.functions.findItem(
        data.duration.title || "",
        durationDataList,
        "t"
      );
      const unavailable = data.unAvailableDays ? data.unAvailableDays : null;

      setDuration(durt);
      setDurationNumber(durNo);
      settitle(data.title || "");
      settripType(tripType);
      setspecies(species);
      setReturn(data.returnActivity);
      setacceptOther(acceptOtherTrades);
      setPhotos(data.photos || []);
      setstatus(data.status);
      setAvailablityDates(dateList);
      setUnAvailble(
        unavailable?.allUnavailableDates.length > 0 ? unavailable : null
      );
    }
  }, [editTrip]);

  const clearFields = (c, c2) => {
    if (c == "all") {
      setReturn("");
      setacceptOther(false);
      setisAddPhotoModal(false);
      setAvailablityDates(null);
      setUnAvailble(null);
      setPhotos([]);
      setpvm(false);
      setsi("");
      setdeleteModal(false);
      setdeletePObj(false);
      setstatus("active");
      settripType("");
      setcity("");
      setState(null);
      setspecies("");
      settitle("");
      if (c2 != "nill") {
        seteditTrip(false);
        seteditTripObj(false);
      } else {
        seteditTrip(true);
      }
    }
  };

  const openCalender = () => {
    setIsShowCalender(true);
  };

  const closeModalg = () => {
    if (!ctripsLoader) {
      setmodalChk(false);
      setisModal(false);
      setmodalHeight(0);
    }
  };

  const openUnAvailabaleDaysModal = () => {
    setIsShowUnAvailable(true);
  };

  const onclickImage = (c) => {
    Keyboard.dismiss();

    if (c == "photoV") {
      return;
    }

    MultipleImage(c);
  };

  const openDeleteModal = (obj) => {
    setdeletePObj(obj);
    setdeleteModal(true);
  };

  const closeDeleteModal = () => {
    setdeletePObj(false);
    setdeleteModal(false);
  };

  const deletePhoto = () => {
    let p = photos.slice();

    p.splice(deletePObj.i, 1);

    setPhotos(p);
    closeDeleteModal();
  };

  const MultipleImage = async (chk) => {
    const apiLevel = store.General.apiLevel;
    Keyboard.dismiss();
    closeAllDropDown();
    setisShowPrmsn(false);
    setisAddPhotoModal(false);
    let d = photos.length;
    let max = maxPhotos;
    let msg = "You can upload only " + max + " images";
    if (d == max) {
      Alert.alert("", msg);
      return;
    }
    let maxPhotos = 6 - photos.length;
    setTimeout(async () => {
      try {
        let options = {
          mediaType: "image",
          isPreview: false,
          maxSelectedAssets: maxPhotos,
        };
        const res = await MultipleImagePicker.openPicker(options);
        if (res) {
          console.log("mutipicker image res true  ", res);
          let data = photos.slice();
          let ar = data;

          if (data.length > 0) {
            res.map((e, i, a) => {
              let uri = e.path;
              let fileName = e.fileName;
              let type = e.mime;

              if (Platform.OS == "android" && apiLevel < 29) {
                uri = "file://" + uri;
              }

              ImageCompressor.compress(uri, {
                compressionMethod: "auto",
              })
                .then(async (res) => {
                  let imageObject = { uri: res, fileName, type };
                  console.log("Compress image  : ", imageObject);
                  let isAlreadySelectimage = data.find(
                    (x) => x.fileName == fileName
                  )
                    ? true
                    : false;

                  if (chk == "photo" && !isAlreadySelectimage) {
                    ar.push(imageObject);
                  }

                  if (i == a.length - 1) {
                    setPhotos(ar);
                    setisAddPhotoModal(false);
                  }
                })
                .catch((err) => {
                  console.log("Image compress error : ", err);
                });
            });
          } else {
            res.map((e, i, a) => {
              let uri = e.path;
              let fileName = e.fileName;
              let type = e.mime;
              if (Platform.OS == "android" && apiLevel < 29) {
                uri = "file://" + uri;
              }
              ImageCompressor.compress(uri, {
                compressionMethod: "auto",
              })
                .then(async (res) => {
                  let imageObject = { uri: res, fileName, type };
                  console.log("Compress image  : ", imageObject);
                  if (chk == "photo") {
                    ar.push(imageObject);
                  }
                  if (i == a.length - 1) {
                    setPhotos(ar);
                    setisAddPhotoModal(false);
                  }
                })
                .catch((err) => {
                  console.log("Image compress error : ", err);
                });
            });
          }
        }

        console.log("mutipicker image res error  ", res);
      } catch (error) {
        console.log("multi photo picker error : ", error);
      }
    }, 500);
  };

  const closeAllDropDown = () => {
    setIsDropDownDuration(false);
    setIsDropDownTripType(false);
    setIsDropDownState(false);
    setIsDropDownSpecies(false);
  };

  const photoClick = (i) => {
    setsi(i);
    setpvm(true);
  };

  const closeReviewModal = (c) => {
    if (!ctripsLoader) {
      setmodalHeight(0);
      setisReviewTrip(false);
      setisTripCreate(false);
      if (isTripCreate) {
        clearFields("all", c);
      }
    }
  };

  const setIsTripCreatSuc = (v) => {
    store.User.setctripLoader(false);

    setisTripCreate(v);
  };

  function titleCase(str) {
    var splitStr = str.toLowerCase().split(" ");
    for (var i = 0; i < splitStr.length; i++) {
      splitStr[i] =
        splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(" ");
  }

  const CreateTrip = () => {
    Keyboard.dismiss();

    NetInfo.fetch().then((states) => {
      if (states.isConnected) {
        let title = "";
        let durationTitle = "";
        let durTitle = duration.title;
        if (durationNumber <= 1) {
          durTitle = duration.title.substring(0, duration.title.length - 1);
        }
        durationTitle = durationNumber + " " + titleCase(durTitle);
        title = durationTitle + " " + species.name;

        const obj = {
          hostId: user._id,
          tradeType: tripType.name,
          species: species.name,
          featuredDate: new Date(),
          returnActivity: titleCase(Return),
          title: title,
          acceptTradeOffers: acceptOther,
          duration: {
            value: durationNumber,
            title: duration.title,
          },
          availableFrom: moment(minDate).format("MMM DD, YYYY"),
          availableTo: moment(maxDate).format("MMM DD, YYYY"),
          status: user.subscriptionStatus === "freemium" ? "suspended" : status,
          photos: photos,
          unAvailableDays: unAvailable,
          location: { city: city, state: state?.name || "" },
        };
        if (species.category) {
          obj.category = species.category.name;
        }
        setctripLoader(true);
        if (photos.length <= 0) {
          store.User.attemptToCreateTrip(obj, setIsTripCreatSuc);
        } else {
          store.User.attemptToCreateTripUploadImage(obj, setIsTripCreatSuc);
        }
      } else {
        Alert.alert("", "Please connect internet");
      }
    });
  };

  const UpdateTrip = () => {
    Keyboard.dismiss();
    NetInfo.fetch().then((states) => {
      if (states.isConnected) {
        let title = "";
        let durationTitle = "";
        let durTitle = duration.title;
        if (durationNumber <= 1) {
          durTitle = duration.title.substring(0, duration.title.length - 1);
        }
        durationTitle = durationNumber + " " + titleCase(durTitle);
        title = durationTitle + " " + species.name;

        const photoArr = [...photos];
        let photoArr1 = [];
        let photoArr2 = [];
        if (photoArr.length > 0) {
          photoArr.forEach((item) => {
            if (item.uri) photoArr2.push(item);
            else photoArr1.push(item);
          });
        }

        const obj = {
          hostId: user._id,
          tradeType: tripType.name,
          species: species.name,
          returnActivity: titleCase(Return),
          title: title,
          acceptTradeOffers: acceptOther,
          duration: {
            value: durationNumber,
            title: duration.title,
          },
          availableFrom: moment(minDate).format("MMM DD, YYYY"),
          availableTo: moment(maxDate).format("MMM DD, YYYY"),
          status: user.subscriptionStatus === "freemium" ? "suspended" : status,
          photos: photoArr1,
          unAvailableDays: unAvailable,
          location: { city: city, state: state?.name || "" },
        };
        if (species.category) {
          obj.category = species.category.name;
        }

        setctripLoader(true);
        if (photoArr2.length > 0) {
          store.User.attemptToUpdateTripUploadImage(
            obj,
            photoArr2,
            editTripObj.data._id,
            editTripObj.index,
            setIsTripCreatSuc
          );
        } else {
          store.User.attemptToUpdateTrip(
            obj,
            editTripObj.data._id,
            editTripObj.index,
            setIsTripCreatSuc
          );
        }
      } else {
        Alert.alert("", "Please connect internet");
      }
    });
  };

  const goToProfile = () => {
    closeModalg();
    props.navigation.navigate("MyProfile");
  };

  const SuspendTrip = () => {
    Keyboard.dismiss();

    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        const obj = {
          status: "suspended",
        };
        store.User.setctripLoader(true);

        store.User.attemptToUpdateTrip(
          obj,
          editTripObj.data._id,
          editTripObj.index,
          goToProfile
        );
      } else {
        Alert.alert("", "Please connect internet");
      }
    });
  };

  const ActivateTrip = () => {
    Keyboard.dismiss();

    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        const obj = {
          status: "active",
        };
        store.User.setctripLoader(true);

        store.User.attemptToUpdateTrip(
          obj,
          editTripObj.data._id,
          editTripObj.index,
          goToProfile
        );
      } else {
        Alert.alert("", "Please connect internet");
      }
    });
  };

  const DeleteTrip = () => {
    Keyboard.dismiss();

    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        store.User.setctripLoader(true);
        store.User.attemptToDeleteTrip(
          {},
          editTripObj.data._id,
          editTripObj.index,
          goToProfile
        );
      } else {
        Alert.alert("", "Please connect internet");
      }
    });
  };

  const renderDropDown = (c) => {
    let data = [];

    if (c === "dur") data = durationDataList;

    const onclickSelect = (d) => {
      if (c === "dur") {
        setDuration(d);
        utils.functions.checkAvailability(
          availablityDates,
          unAvailable,
          setAvailablityDates,
          setUnAvailble,
          d.title,
          durationNumber
        );
      }
    };

    const abs = Platform.OS == "ios" ? false : true;
    return (
      <utils.DropDown
        data={data}
        onSelectItem={(d) => {
          onclickSelect(d);
        }}
        setVisible={(d) => {
          closeAllDropDown();
        }}
        c={c}
        absolute={abs}
      />
    );
  };

  const renderAddPhotoModal = () => {
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

    const checkPermsn = async (c, dt) => {
      if (Platform.OS == "android") {
        const permissionAndroid = await check(PERMISSIONS.ANDROID.CAMERA);
        const permissionAndroid2 = await check(
          PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
        );
        setDT(dt);

        if (permissionAndroid != "granted" || permissionAndroid2 != "granted") {
          setisShowPrmsn(true);
          setprmsnChk(c);
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
            setisShowPrmsn(true);
            setprmsnChk(c);
          } else {
            onclickImage(dt);
          }
        } catch (error) {
          console.warn("Permsiion error : ", error);
        }
      }
    };

    const closeAddPhotoModal = () => {
      if (!isShowPrmsn) {
        setisAddPhotoModal(false);
      } else {
        setisShowPrmsn(false);
      }
    };

    const renderCross = () => {
      return (
        <Pressable
          style={({ pressed }) => [
            { opacity: pressed ? 0.7 : 1.0 },
            { position: "absolute", top: 15, right: 15 },
          ]}
          onPress={closeAddPhotoModal}
        >
          <utils.vectorIcon.Ionicons
            name="ios-close-outline"
            color={theme.color.title}
            size={32}
          />
        </Pressable>
      );
    };

    const renderHeader = () => {
      return (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            source={require("../../assets/images/add_trip_photosb/img.png")}
            style={{
              width: 73,
              height: 63,
              resizeMode: "contain",
              marginBottom: 10,
            }}
          />
          <Text style={[styles.fieldText2, { fontSize: 20 }]}>
            Add Trip Photos
          </Text>
          <Text
            style={[
              styles.fieldText2,
              { fontSize: 13, fontFamily: theme.fonts.fontNormal },
            ]}
          >
            (up to {maxPhotos} photos)
          </Text>
        </View>
      );
    };

    const renderSelection = () => {
      return (
        <View style={styles.uploadIndication}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              checkPermsn("gallery", "photo");
            }}
          >
            <Image
              source={require("../../assets/images/uploadphotog/img.png")}
              style={[styles.uploadIndicationLogo, { marginRight: 20 }]}
            />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              checkPermsn("camera", "photo");
            }}
          >
            <Image
              source={require("../../assets/images/takephotog/img.png")}
              style={styles.uploadIndicationLogo}
            />
          </TouchableOpacity>
        </View>
      );
    };
    const renderTip = () => {
      return (
        <View
          style={{
            width: "95%",
            flexDirection: "row",
            alignSelf: "center",
            marginTop: 10,
          }}
        >
          <Text
            style={{
              fontSize: 13,
              fontFamily: theme.fonts.fontNormal,
              color: theme.color.subTitle,
            }}
          >
            Tip:
          </Text>

          <View style={{ width: "92%", marginLeft: 5 }}>
            <Text
              style={{
                fontSize: 13,
                fontFamily: theme.fonts.fontNormal,
                color: theme.color.subTitle,
              }}
            >
              Use photos that are clear and relevant to your trip to attract
              more offers.
            </Text>
          </View>
        </View>
      );
    };

    const renderButtonPermission = () => {
      return (
        <View
          style={{
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
              setisShowPrmsn(false);
            }}
            activeOpacity={0.7}
            style={styles.BottomButtonP}
          >
            <Text style={styles.buttonPTextBottom}>No</Text>
          </TouchableOpacity>
        </View>
      );
    };

    function Sep() {
      return <View style={{ height: 25 }} />;
    }

    return (
      <MModal
        visible={isAddPhotoModal}
        transparent
        onRequestClose={closeAddPhotoModal}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={[styles.modalContainer2, { margin: 20 }]}>
            <View
              style={[
                styles.modal,
                {
                  paddingVertical: 25,
                  paddingHorizontal: 20,
                  borderRadius: 15,
                },
              ]}
            >
              {!isShowPrmsn && (
                <>
                  {renderHeader()}
                  <Sep />
                  {renderSelection()}
                  <Sep />
                  {renderTip()}
                </>
              )}
              {isShowPrmsn && (
                <>
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text style={styles.section2Title1}>
                      {prmsnChk == "camera"
                        ? "Camera Access"
                        : "Storage Access"}
                    </Text>

                    <Image
                      source={
                        prmsnChk == "camera"
                          ? require("../../assets/images/ca/img.png")
                          : require("../../assets/images/ca/img.png")
                      }
                      style={styles.section2Logo}
                    />

                    <View style={{ width: "80%", alignSelf: "center" }}>
                      <Text
                        style={[
                          styles.section2LogoTitle,
                          {
                            textAlign: "center",
                          },
                        ]}
                      >
                        {prmsnChk == "camera"
                          ? "Trip Trader wants permission to access your camera."
                          : "Trip Trader wants permission to access your storage."}
                      </Text>
                    </View>

                    <Text style={styles.section2LogoTitlee}>Grant access?</Text>
                  </View>

                  {renderButtonPermission()}
                </>
              )}
              {renderCross()}
            </View>
          </View>
        </SafeAreaView>
      </MModal>
    );
  };

  const renderDeleteModal = () => {
    const renderCross = () => {
      return (
        <Pressable
          style={({ pressed }) => [
            { opacity: pressed ? 0.7 : 1.0 },
            styles.modalCross,
          ]}
          onPress={closeDeleteModal}
        >
          <utils.vectorIcon.Ionicons
            name="ios-close-outline"
            color={theme.color.title}
            size={32}
          />
        </Pressable>
      );
    };

    const renderTitle = () => {
      return <Text style={styles.dmodalTitle}>delete photo?</Text>;
    };

    const renderImage = () => {
      return (
        <View style={styles.dmodalImgContainer}>
          <Image style={styles.dmodalImg} source={{ uri: deletePObj.uri }} />
        </View>
      );
    };

    const renderBottom = () => {
      const renderTitle = () => {
        return (
          <Text style={styles.dmodalBottomTitle}>
            This action cannot be undone.
          </Text>
        );
      };

      const renderButton1 = () => {
        return (
          <Pressable
            style={({ pressed }) => [
              { opacity: pressed ? 0.7 : 1.0 },
              styles.dButtonContainer,
            ]}
            onPress={deletePhoto}
          >
            <Text style={styles.dButtonText}>Yes, delete photo</Text>
          </Pressable>
        );
      };

      const renderButton2 = () => {
        return (
          <Pressable
            style={({ pressed }) => [
              { opacity: pressed ? 0.7 : 1.0 },
              styles.dButtonContainer,
              { backgroundColor: theme.color.button2 },
            ]}
            onPress={closeDeleteModal}
          >
            <Text style={[styles.dButtonText, { color: theme.color.subTitle }]}>
              No, keep it
            </Text>
          </Pressable>
        );
      };

      return (
        <View style={styles.dmodalBottomContainer}>
          {renderTitle()}
          {renderButton1()}
          {renderButton2()}
        </View>
      );
    };

    return (
      <MModal
        visible={deleteModal}
        transparent
        onRequestClose={closeDeleteModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.dmodal}>
            {renderTitle()}
            {renderCross()}
            {renderImage()}
            {renderBottom()}
          </View>
        </View>
      </MModal>
    );
  };

  const renderShowDropDown = (c) => {
    let data = [];

    if (c == "tt") {
      data = activityList;
    }
    if (c == "state") {
      data = stateDataList;
    }
    if (c == "spcs") {
      data = speciesData;
    }

    const onclickSelect = (d) => {
      if (c === "tt") {
        settripType(d);
        if (tripType !== "") {
          if (tripType.name !== d.name) {
            setspecies("");
          }
        }
      }
      if (c === "state") {
        setState(d);
      }
      if (c === "spcs") {
        setspecies(d);
      }
    };

    const abs = Platform.OS == "ios" ? false : true;
    return (
      <utils.DropDown
        search={true}
        data={data}
        onSelectItem={(d) => {
          onclickSelect(d);
        }}
        setVisible={(d) => {
          closeAllDropDown();
        }}
        c={c}
      />
    );
  };

  const renderSec1 = () => {
    return (
      <View style={styles.Sec}>
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldText}>I want to trade a...</Text>
          <View style={{ width: "100%" }}>
            <TouchableOpacity
              onPress={() => {
                closeAllDropDown();
                setIsDropDownTripType(!isDropDownTripType);
              }}
              activeOpacity={activeOpacity}
              style={[styles.dropDowninputConatiner]}
            >
              <Image style={styles.dropDownIcon} source={activityIconSrc} />

              <View style={{ width: "82%" }}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={[
                    styles.dropDownText2,
                    {
                      opacity: tripType == "" ? 0.4 : 1,
                      textTransform: tripType == "" ? "none" : "capitalize",
                    },
                  ]}
                >
                  {tripType == "" ? "Select Activity" : tripType.name + " Trip"}
                </Text>
              </View>
              <utils.vectorIcon.Fontisto
                name="angle-down"
                color={"#14181F"}
                size={11}
              />
            </TouchableOpacity>
            {isDropDownTripType && renderShowDropDown("tt")}
          </View>
        </View>

        <View style={[styles.fieldContainer, { marginTop: 17 }]}>
          <Text style={styles.fieldText}>Located in...</Text>

          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View style={[styles.inputConatiner, { width: "56%" }]}>
              <TextInput
                value={city}
                onChangeText={(d) => {
                  setcity(d);
                }}
                placeholder="Example: Southeastern"
                style={[styles.input, { fontSize: 13 }]}
              />
            </View>

            <View style={{ width: "42%" }}>
              <TouchableOpacity
                onPress={() => {
                  closeAllDropDown();
                  setIsDropDownState(!isDropDownState);
                }}
                activeOpacity={activeOpacity}
                style={[styles.dropDowninputConatiner]}
              >
                <View style={{ width: "82%" }}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={[
                      styles.dropDownText2,
                      {
                        opacity: state ? 1 : 0.4,
                        textTransform: state ? "capitalize" : "none",
                      },
                    ]}
                  >
                    {state ? state.name : "State"}
                  </Text>
                </View>
                <utils.vectorIcon.Fontisto
                  name="angle-down"
                  color={"#14181F"}
                  size={11}
                />
              </TouchableOpacity>
              {isDropDownState && renderShowDropDown("state")}
            </View>
          </View>
        </View>

        <View style={[styles.fieldContainer, { marginTop: 17 }]}>
          <Text style={styles.fieldText}>Please enter the species</Text>

          <View style={{ width: "100%" }}>
            <TouchableOpacity
              disabled={tripType == "" ? true : false}
              onPress={() => {
                closeAllDropDown();
                setIsDropDownSpecies(!isDropDownSpecies);
              }}
              activeOpacity={activeOpacity}
              style={[
                styles.dropDowninputConatiner,
                { opacity: tripType == "" ? 0.5 : 1 },
              ]}
            >
              <Image style={styles.dropDownIcon} source={speciesIconSrc} />
              <View style={{ width: "83%" }}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={[
                    styles.dropDownText2,
                    {
                      opacity: species == "" ? 0.4 : 1,
                      textTransform: species == "" ? "none" : "capitalize",
                    },
                  ]}
                >
                  {species == "" ? "Select species" : species.name}
                </Text>
              </View>
              <utils.vectorIcon.Fontisto
                style={{ opacity: tripType == "" ? 0.5 : 1 }}
                name="angle-down"
                color={"#14181F"}
                size={11}
              />
            </TouchableOpacity>
            {isDropDownSpecies && renderShowDropDown("spcs")}
          </View>
        </View>

        <View style={[styles.fieldContainer, { marginTop: 17 }]}>
          <Text style={styles.fieldText}>In return for...</Text>
          <View style={styles.inputConatiner}>
            <TextInput
              value={Return}
              onChangeText={(d) => {
                setReturn(d);
              }}
              placeholder="Example: Florida Alligator Hunt"
              style={styles.input}
            />
          </View>
        </View>

        <View
          style={[
            styles.fieldContainer,
            { marginTop: 12, flexDirection: "row", alignItems: "center" },
          ]}
        >
          <TouchableOpacity
            style={{
              width: 20,
              height: 20,
              borderRadius: 4,
              backgroundColor: !acceptOther ? "white" : theme.color.button1,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: theme.color.fieldBorder,
            }}
            activeOpacity={0.5}
            onPress={() => setacceptOther(!acceptOther)}
          >
            {acceptOther && (
              <utils.vectorIcon.FontAwesome5
                name={"check"}
                color={theme.color.buttonText}
                size={11}
              />
            )}
          </TouchableOpacity>
          <Text style={styles.Field2Title}>Accept other trade offers</Text>
        </View>

        <View style={[styles.fieldContainer, { marginTop: 17 }]}>
          <Text style={styles.fieldText}>Trip Duration</Text>
          <View
            style={[
              styles.fieldContainer,
              { marginTop: 5, flexDirection: "row" },
            ]}
          >
            <View style={[styles.inputConatiner, { width: "23%" }]}>
              <TextInput
                keyboardType="number-pad"
                maxLength={5}
                defaultValue={durationNumber.toString()}
                value={durationNumber.toString()}
                onChangeText={(d) => {
                  if (durationNumber.length == 0) {
                    if (d < parseInt(1)) {
                      return;
                    }
                  }
                  const num = d.replace(/[^0-9]/, "");
                  setDurationNumber(num);
                  utils.functions.checkAvailability(
                    availablityDates,
                    unAvailable,
                    setAvailablityDates,
                    setUnAvailble,
                    duration.title,
                    num
                  );
                }}
                style={styles.input}
              />
            </View>

            <View style={{ width: "36%", marginLeft: 10 }}>
              <TouchableOpacity
                onPress={() => {
                  closeAllDropDown();
                  setIsDropDownDuration(!isDropDownDuration);
                }}
                activeOpacity={0.6}
                style={[
                  styles.inputConatiner,
                  {
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingHorizontal: 15,
                  },
                ]}
              >
                <View style={{ width: "70%" }}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={[styles.dropDownText]}
                  >
                    {duration.title ? duration.title : ""}
                  </Text>
                </View>
                <View
                  style={{
                    width: "27%",
                    alignItems: "flex-end",
                  }}
                >
                  <utils.vectorIcon.Fontisto
                    name="angle-down"
                    color={theme.color.title}
                    size={13}
                  />
                </View>
              </TouchableOpacity>

              {isDropDownDuration && renderDropDown("dur")}
            </View>
          </View>
        </View>

        <View style={[styles.fieldContainer, { marginTop: 17 }]}>
          <Text style={styles.fieldText}>Trip Availability</Text>
          <Text
            style={[
              styles.fieldText,
              {
                color: theme.color.subTitle,
                fontSize: 12.5,
                fontFamily: theme.fonts.fontNormal,
              },
            ]}
          >
            Guests will be able to choose between these dates.
          </Text>

          <Pressable
            onPress={openCalender}
            style={({ pressed }) => [
              { opacity: pressed ? 0.8 : 1.0 },
              [
                styles.inputConatiner,
                {
                  width: "82%",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                },
              ],
            ]}
          >
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={[
                styles.fieldText,
                {
                  color:
                    rangeValue === "Select a date range"
                      ? theme.color.subTitleLight
                      : theme.color.title,
                  fontFamily: theme.fonts.fontNormal,
                  width: "85%",
                },
              ]}
            >
              {rangeValue}
            </Text>
            <View
              style={{
                width: "13%",
                alignItems: "flex-end",
              }}
            >
              <Image
                source={require("../../assets/images/cal/img.png")}
                style={styles.inputIcon}
              />
            </View>
          </Pressable>
        </View>

        {availablityDates && !unAvailable && (
          <View style={[styles.fieldContainer, { marginTop: 17 }]}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={openUnAvailabaleDaysModal}
            >
              <Text style={styles.bottomText}>Set unavailable days</Text>
            </TouchableOpacity>
          </View>
        )}

        {unAvailable && (
          <View style={styles.fieldContainer}>
            <View
              style={{
                marginTop: 17,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text style={styles.fieldText}>Unavailable Days</Text>
              <TouchableOpacity
                activeOpacity={0.8}
                style={{ marginLeft: 15 }}
                onPress={openUnAvailabaleDaysModal}
              >
                <Text style={[styles.bottomText, { fontSize: 14 }]}>Edit</Text>
              </TouchableOpacity>
            </View>
            <View style={{ width: "100%", marginTop: 5 }}>
              <Text
                style={{
                  fontSize: 12.5,
                  color: "#111111",
                  fontFamily: theme.fonts.fontNormal,
                }}
              >
                {unavailableText}
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  const renderSec2 = () => {
    const renderShowPhotos = () => {
      let p = photos.map((e, i, a) => {
        let uri = e.uri ? e.uri : e;
        let c = e.uri ? true : false;
        const renderPhotoCross = () => {
          return (
            <Pressable
              style={({ pressed }) => [
                { opacity: pressed ? 0.7 : 1.0 },
                styles.crossContainer,
              ]}
              onPress={() => openDeleteModal({ uri: e.uri ? e.uri : e, i: i })}
            >
              <Image
                source={require("../../assets/images/cross/img.png")}
                style={{ width: 9, height: 9, resizeMode: "contain" }}
              />
            </Pressable>
          );
        };
        return (
          <>
            {a.length == maxPhotos && (
              <Pressable
                onPress={() => photoClick(i)}
                style={({ pressed }) => [
                  { opacity: pressed ? 0.9 : 1.0 },
                  [styles.addImgContainer, { marginTop: 15 }],
                ]}
              >
                {!c && (
                  <ProgressiveFastImage
                    style={styles.addImg}
                    source={{ uri: uri }}
                    loadingImageStyle={styles.imageLoader}
                    loadingSource={require("../../assets/images/imgLoad/img.jpeg")}
                    blurRadius={3}
                  />
                )}
                {c && <Image style={styles.addImg} source={{ uri: uri }} />}

                {renderPhotoCross()}
              </Pressable>
            )}

            {a.length < maxPhotos && (
              <>
                <Pressable
                  onPress={() => photoClick(i)}
                  style={({ pressed }) => [
                    { opacity: pressed ? 0.9 : 1.0 },
                    [styles.addImgContainer, { marginTop: 15 }],
                  ]}
                >
                  {!c && (
                    <ProgressiveFastImage
                      style={styles.addImg}
                      source={{ uri: uri }}
                      loadingImageStyle={styles.imageLoader}
                      loadingSource={require("../../assets/images/imgLoad/img.jpeg")}
                      blurRadius={3}
                    />
                  )}
                  {c && <Image style={styles.addImg} source={{ uri: uri }} />}
                  {renderPhotoCross()}
                </Pressable>

                {i == a.length - 1 && (
                  <Pressable
                    onPress={() => {
                      setisAddPhotoModal(true);
                    }}
                    style={({ pressed }) => [
                      { opacity: pressed ? 0.8 : 1.0 },
                      [
                        styles.addImgContainer,
                        {
                          marginTop: 15,
                          borderStyle: "dashed",
                          borderColor: theme.color.button1,
                          backgroundColor: "#F2F3F1",
                          alignItems: "center",
                          justifyContent: "center",
                        },
                      ],
                    ]}
                  >
                    <utils.vectorIcon.Feather
                      name="plus"
                      color={theme.color.button1}
                      size={24}
                    />
                  </Pressable>
                )}
              </>
            )}
          </>
        );
      });

      return p;
    };

    return (
      <View style={[styles.Sec, { marginTop: 15 }]}>
        <View
          style={[
            styles.fieldContainer,
            { flexDirection: "row", alignItems: "center" },
          ]}
        >
          <Image
            source={require("../../assets/images/add_trip_photos/img.png")}
            style={{
              width: 30,
              height: 30,
              resizeMode: "contain",
              marginRight: 10,
            }}
          />
          <Text style={styles.fieldText2}>Trip Photos</Text>
        </View>

        <View style={[styles.fieldContainer, { marginTop: 15 }]}>
          <Text style={styles.fieldText22}>
            Add pictures that showcase this trip to help members get a better
            idea of what to expect.
          </Text>
        </View>

        <View style={styles.fieldContainer}>
          {photos.length <= 0 && (
            <TouchableOpacity
              onPress={() => setisAddPhotoModal(true)}
              activeOpacity={0.7}
              style={{
                width: "100%",
                marginTop: 15,
                borderRadius: 8,
                borderWidth: 2,
                borderStyle: "dashed",
                borderColor: theme.color.button1,
                alignItems: "center",
                justifyContent: "center",
                padding: 10,
                height: 57,
                backgroundColor: "#F2F3F1",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={require("../../assets/images/add_photo/img.png")}
                  style={{
                    width: 24,
                    height: 24,
                    resizeMode: "contain",
                    marginRight: 10,
                  }}
                />

                <Text
                  style={[
                    styles.fieldText2,
                    {
                      fontFamily: theme.fonts.fontBold,
                      fontSize: 14,
                      color: theme.color.button1,
                    },
                  ]}
                >
                  Add Photos
                </Text>
              </View>
            </TouchableOpacity>
          )}
          {photos.length > 0 && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                flexShrink: 1,
                flexWrap: "wrap",
              }}
            >
              {renderShowPhotos()}
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderSec3 = () => {
    let bc = {
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 8,
      paddingVertical: 12,
      width: "47%",
    };
    let dt = editTripObj.data || [];
    let status = "";
    let ch = false;
    if (dt) {
      status = dt.status;
      ch = status == "suspended" ? true : false;
    }

    return (
      <View
        style={[
          styles.Sec,
          {
            marginTop: 15,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            if (store.User.user.subscriptionStatus == "freemium") {
              props.navigation.navigate("Plan");
            } else {
              setmodalChk(!ch ? "suspend" : "activate");
              setisModal(true);
            }
          }}
          style={[bc, { backgroundColor: theme.color.button2 }]}
        >
          <Text
            style={{
              color: "#30563A",
              fontSize: 13,
              fontFamily: theme.fonts.fontBold,
              textTransform: "capitalize",
            }}
          >
            {!ch ? "Suspend" : "Activate"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            setmodalChk("delete");
            setisModal(true);
          }}
          style={[bc, { backgroundColor: "#F8ECEC" }]}
        >
          <Text
            style={{
              color: "#B93B3B",
              fontSize: 13,
              fontFamily: theme.fonts.fontBold,
              textTransform: "capitalize",
            }}
          >
            Delete Trip
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderButton = () => {
    const isButtonDisable =
      availablityDates &&
      Return != "" &&
      durationNumber != "" &&
      tripType != "" &&
      species != "" &&
      city != "" &&
      state &&
      photos.length > 0
        ? false
        : true;
    return (
      <>
        <TouchableOpacity
          disabled={isButtonDisable}
          onPress={() => {
            setisReviewTrip(true);
          }}
          activeOpacity={0.7}
          style={[styles.BottomButton, { opacity: isButtonDisable ? 0.5 : 1 }]}
        >
          <Text style={styles.buttonTextBottom}>
            {!editTrip ? "Create Trip" : "Save Changes"}
          </Text>
        </TouchableOpacity>
      </>
    );
  };

  const renderReviewTripModal = () => {
    const c = modalHeight >= maxModalHeight ? true : false;
    const style = c
      ? [styles.rmodal, { paddingTop: 0, height: maxModalHeight }]
      : styles.rmodal2;

    const renderHeader = () => {
      let text = "";
      if (!editTrip) {
        if (!isTripCreate) {
          text = "Review Trip Details";
        } else {
          text = "Trip Created Successfully!";
        }
      }

      if (editTrip) {
        if (!isTripCreate) {
          text = "Review Trip Details";
        } else {
          text = "Trip Update Successfully!";
        }
      }

      const renderCross = () => {
        return (
          <Pressable
            disabled={ctripsLoader}
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1.0 }]}
            onPress={() => {
              closeReviewModal("");
            }}
          >
            <utils.vectorIcon.Ionicons
              name="ios-close-outline"
              color={theme.color.title}
              size={32}
            />
          </Pressable>
        );
      };

      const renderTitle = () => {
        return <Text style={styles.modalTitle}>{text}</Text>;
      };

      return (
        <View
          style={
            c
              ? {
                  flexDirection: "row",
                  justifyContent: "space-between",

                  paddingHorizontal: 15,
                  paddingTop: 15,
                  paddingBottom: 7,
                  shadowColor: "#000000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
                  elevation: 1,
                  backgroundColor: theme.color.background,
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                }
              : {
                  flexDirection: "row",
                  justifyContent: "space-between",
                }
          }
        >
          {}
          {renderTitle()}
          {}

          {}
        </View>
      );
    };

    const renderTitle = () => {
      return (
        <View style={{ marginTop: 10 }}>
          <Text style={styles.rmodalsubTitle}>
            Review your trip details below, if everything looks good, click{" "}
            <Text
              style={[
                styles.rmodalsubTitle,
                { fontFamily: theme.fonts.fontBold },
              ]}
            >
              {!editTrip ? "Create Trip" : "Update Trip"}
            </Text>
            {}
          </Text>
        </View>
      );
    };

    const renderSubscribe = () => {
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            setTimeout(
              () => {
                closeReviewModal("");
              },
              Platform.OS == "ios" ? 0 : 1000
            );
            props.navigation.navigate("Plan");
          }}
          style={{
            marginTop: responsiveHeight(2),
            width: "100%",
            borderRadius: 4,
            backgroundColor: "#EEFAF1",
            padding: 15,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ width: "92%" }}>
            <Text
              style={{
                fontSize: responsiveFontSize(1.85),
                color: theme.color.title,
                fontFamily: theme.fonts.fontNormal,
              }}
            >
              <Text
                style={{
                  fontSize: responsiveFontSize(1.85),
                  color: theme.color.button1,
                  textDecorationLine: "underline",
                  textDecorationColor: theme.color.button1,
                  fontFamily: theme.fonts.fontBold,
                }}
              >
                Subscribe{" "}
              </Text>
              to make this trip available and receive trade offers.
            </Text>
          </View>

          <utils.vectorIcon.AntDesign
            name={"right"}
            color={"#63896D"}
            size={responsiveFontSize(2.4)}
          />
        </TouchableOpacity>
      );
    };

    const renderShowPhotos = () => {
      let p = photos.map((e, i, a) => {
        let uri = e.uri ? e.uri : e;
        return (
          <>
            <Pressable
              disabled
              style={({ pressed }) => [
                { opacity: pressed ? 0.9 : 1.0 },
                [styles.raddImgContainer, { marginTop: 10 }],
              ]}
            >
              <Image style={styles.raddImg} source={{ uri: uri }} />
            </Pressable>
          </>
        );
      });

      return p;
    };

    const renderFields = () => {
      const offer = species?.name + " " + tripType?.name || "";
      const locationName =
        city === "" || !state ? "Florida, Miami" : city + ", " + state.name;
      const durationTitle = durationNumber + " " + duration.title;

      return (
        <View style={{ marginTop: 20 }}>
          <View style={[styles.rField, { width: "85%" }]}>
            <Text style={styles.rTitle}>YOUR OFFERING</Text>
            <Text
              style={[styles.rTitle2, { color: theme.color.titleGreenForm }]}
            >
              {offer}
            </Text>
          </View>

          <View style={styles.rField2}>
            <View style={[styles.rField, { width: "49%" }]}>
              <Text style={styles.rTitle}>TRIP LOCATION</Text>
              <Text style={[styles.rTitle2, { textTransform: "none" }]}>
                {locationName}
              </Text>
            </View>

            <View style={[styles.rField, { width: "49%" }]}>
              <Text style={styles.rTitle}>TRIP DURATION</Text>
              <Text style={[styles.rTitle2, { textTransform: "none" }]}>
                {durationTitle}
              </Text>
            </View>
          </View>

          <View style={styles.rField2}>
            <View style={[styles.rField, { width: "49%" }]}>
              <Text style={styles.rTitle}>TRIP Availability</Text>
              <Text style={styles.rTitle2}>{rangeValue}</Text>
            </View>

            <View style={[styles.rField, { width: "49%" }]}>
              <Text style={styles.rTitle}>UNAVAILABLE DAYS</Text>
              <Text style={[styles.rTitle2, { textTransform: "none" }]}>
                {unAvailable ? unavailableText : "None"}
              </Text>
            </View>
          </View>

          {photos.length > 0 && (
            <View style={[styles.rField, { marginTop: 20 }]}>
              <Text style={styles.rTitle}>TRIP PHOTOS</Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  flexShrink: 1,
                  flexWrap: "wrap",
                }}
              >
                {renderShowPhotos()}
              </View>
            </View>
          )}
        </View>
      );
    };

    const renderBottom = () => {
      const renderButton1 = () => {
        return (
          <Pressable
            disabled={ctripsLoader}
            onPress={() => {
              closeReviewModal("");
            }}
            style={({ pressed }) => [
              { opacity: pressed ? 0.8 : 1.0 },
              styles.ButtonContainer,
              {
                backgroundColor: "transparent",
                borderWidth: 1,
                borderColor: theme.color.fieldBorder,
                marginRight: 15,
              },
            ]}
          >
            <Text style={[styles.ButtonText, { color: "#30563A" }]}>
              Cancel
            </Text>
          </Pressable>
        );
      };

      const renderButton2 = () => {
        return (
          <Pressable
            disabled={ctripsLoader}
            onPress={!editTrip ? CreateTrip : UpdateTrip}
            style={({ pressed }) => [
              { opacity: pressed ? 0.8 : 1.0 },
              styles.ButtonContainer,
              { backgroundColor: theme.color.button1 },
            ]}
          >
            {ctripsLoader && (
              <ActivityIndicator size={20} color={theme.color.buttonText} />
            )}
            {!ctripsLoader && (
              <Text
                style={[styles.ButtonText, { color: theme.color.buttonText }]}
              >
                {!editTrip ? "Create Trip" : "Save Changes"}
              </Text>
            )}
          </Pressable>
        );
      };

      return (
        <View
          style={
            c
              ? {
                  alignItems: "flex-end",
                  backgroundColor: theme.color.background,
                  shadowColor: "#000000",
                  shadowOffset: { width: 0, height: -1 },
                  shadowOpacity: 0.1,
                  elevation: 15,
                  borderBottomLeftRadius: 10,
                  borderBottomRightRadius: 10,
                  marginTop: 5,
                }
              : {
                  alignItems: "flex-end",
                  marginTop: 30,
                }
          }
        >
          <View
            style={
              c ? styles.rmodalBottomContainer : styles.rmodalBottomContainer2
            }
          >
            {renderButton1()}
            {renderButton2()}
          </View>
        </View>
      );
    };

    const renderBottom2 = () => {
      const renderButton1 = () => {
        return (
          <Pressable
            onPress={() => {
              closeReviewModal("nill");
            }}
            style={({ pressed }) => [
              { opacity: pressed ? 0.8 : 1.0 },
              styles.ButtonContainer,
              {
                backgroundColor: "transparent",
                borderWidth: 1,
                borderColor: theme.color.fieldBorder,
                marginRight: 15,
              },
            ]}
          >
            <Text style={[styles.ButtonText, { color: "#30563A" }]}>
              Edit Trip
            </Text>
          </Pressable>
        );
      };

      const renderButton11 = () => {
        return (
          <Pressable
            onPress={closeReviewModal}
            style={({ pressed }) => [
              { opacity: pressed ? 0.8 : 1.0 },
              styles.ButtonContainer,
              {
                backgroundColor: "transparent",
                borderWidth: 1,
                borderColor: theme.color.fieldBorder,
                marginRight: 15,
              },
            ]}
          >
            <Text style={[styles.ButtonText, { color: "#30563A" }]}>Close</Text>
          </Pressable>
        );
      };

      const renderButton2 = () => {
        return (
          <Pressable
            onPress={() => {
              props.navigation.navigate("MyProfile");
            }}
            style={({ pressed }) => [
              { opacity: pressed ? 0.8 : 1.0 },
              styles.ButtonContainer,
              { backgroundColor: theme.color.button1 },
            ]}
          >
            <Text
              style={[styles.ButtonText, { color: theme.color.buttonText }]}
            >
              Go to My Profile
            </Text>
          </Pressable>
        );
      };

      return (
        <View
          style={
            c
              ? {
                  alignItems: "flex-end",
                  backgroundColor: theme.color.background,
                  shadowColor: "#000000",
                  shadowOffset: { width: 0, height: -1 },
                  shadowOpacity: 0.1,
                  elevation: 15,
                  borderBottomLeftRadius: 10,
                  borderBottomRightRadius: 10,
                }
              : {
                  alignItems: "flex-end",
                  marginTop: 30,
                }
          }
        >
          <View
            style={
              c ? styles.rmodalBottomContainer : styles.rmodalBottomContainer2
            }
          >
            {!editTrip ? renderButton1() : renderButton11()}
            {renderButton2()}
          </View>
        </View>
      );
    };

    return (
      <>
        <MModal
          visible={isReviewTrip}
          transparent
          onRequestClose={() => {
            closeReviewModal("");
          }}
        >
          <View style={styles.modalContainer}>
            <View
              onLayout={(event) => {
                if (!c) {
                  const { height } = event.nativeEvent.layout;
                  setmodalHeight(height);
                }
              }}
              style={style}
            >
              {c && (
                <>
                  {renderHeader()}

                  <ScrollView
                    contentContainerStyle={{ paddingHorizontal: 15 }}
                    showsVerticalScrollIndicator={false}
                    style={{ flex: 1 }}
                  >
                    {!isTripCreate && renderTitle()}
                    {isTripCreate &&
                      store.User.user.subscriptionStatus == "freemium" &&
                      renderSubscribe()}
                    {renderFields()}
                  </ScrollView>
                  {!isTripCreate ? renderBottom() : renderBottom2()}
                </>
              )}

              {!c && (
                <>
                  {renderHeader()}
                  {!isTripCreate && renderTitle()}
                  {isTripCreate &&
                    store.User.user.subscriptionStatus == "freemium" &&
                    renderSubscribe()}
                  {renderFields()}

                  {!isTripCreate ? renderBottom() : renderBottom2()}
                </>
              )}
            </View>
          </View>
        </MModal>
      </>
    );
  };

  const renderModal = () => {
    const c = modalHeight >= maxModalHeight ? true : false;
    const style = c
      ? [styles.modal11, { height: maxModalHeight }]
      : styles.modal22;

    if (modalChk == "suspend") {
      const renderHeader = () => {
        let text = "Suspend Trip?";

        const renderCross = () => {
          return (
            <Pressable
              disabled={ctripsLoader}
              style={({ pressed }) => [
                { opacity: pressed ? 0.7 : 1.0 },
                [
                  !c
                    ? {
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                      }
                    : {
                        position: "absolute",
                        bottom: 7,
                        right: 15,
                      },
                ],
              ]}
              onPress={closeModalg}
            >
              <utils.vectorIcon.Ionicons
                name="ios-close-outline"
                color={theme.color.title}
                size={32}
              />
            </Pressable>
          );
        };

        const renderTitle = () => {
          return <Text style={styles.modalTitle}>{text}</Text>;
        };

        return (
          <View
            style={
              c
                ? {
                    alignItems: "center",
                    justifyContent: "center",
                    paddingHorizontal: 15,
                    paddingTop: 15,
                    paddingBottom: 7,
                    shadowColor: "#000000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    elevation: 1,
                    backgroundColor: theme.color.background,
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                  }
                : {
                    alignItems: "center",
                    justifyContent: "center",
                  }
            }
          >
            {renderTitle()}
            {renderCross()}
          </View>
        );
      };

      const renderField = () => {
        return (
          <>
            <View
              style={{
                width: "90%",
                alignSelf: "center",
                marginTop: 25,
              }}
            >
              <Text numberOfLines={3} ellipsizeMode="tail" style={styles.samt}>
                "{title}"
              </Text>
            </View>
          </>
        );
      };

      const renderField2 = () => {
        return (
          <>
            <View
              style={{
                width: "90%",
                alignSelf: "center",

                marginTop: c ? 20 : 40,
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  color: theme.color.subTitle,
                  fontFamily: theme.fonts.fontNormal,
                  textAlign: "center",
                }}
              >
                This will hide the trip from public view, but you can still edit
                the details or reactivate it any time.
              </Text>
            </View>
          </>
        );
      };

      const renderBottom = () => {
        const renderButton1 = () => {
          const t = "Yes, suspend it now";
          return (
            <>
              <TouchableOpacity
                disabled={ctripsLoader}
                onPress={SuspendTrip}
                activeOpacity={0.7}
                style={{
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#3C6B49",
                  height: 50,
                  borderRadius: 10,
                  alignSelf: "center",
                }}
              >
                {!ctripsLoader && (
                  <Text
                    style={{
                      color: theme.color.buttonText,
                      fontSize: 16,
                      fontFamily: theme.fonts.fontBold,
                      textTransform: "none",
                    }}
                  >
                    {t}
                  </Text>
                )}
                {ctripsLoader && (
                  <ActivityIndicator size={20} color={"white"} />
                )}
              </TouchableOpacity>
            </>
          );
        };

        const renderButton2 = () => {
          const t = "No, keep it active";

          return (
            <>
              <TouchableOpacity
                disabled={ctripsLoader}
                onPress={closeModalg}
                activeOpacity={0.7}
                style={{
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: theme.color.button2,
                  height: 50,
                  borderRadius: 10,
                  alignSelf: "center",
                  borderWidth: 1,
                  borderColor: theme.color.fieldBorder,
                  marginTop: 12,
                }}
              >
                <Text
                  style={{
                    color: "#30563A",
                    textTransform: "none",
                    fontFamily: theme.fonts.fontBold,
                    fontSize: 16,
                  }}
                >
                  {t}
                </Text>
              </TouchableOpacity>
            </>
          );
        };

        return (
          <View
            style={
              c
                ? {
                    backgroundColor: theme.color.background,
                    shadowColor: "#000000",
                    shadowOffset: { width: 0, height: -1 },
                    shadowOpacity: 0.1,
                    elevation: 5,
                    borderBottomLeftRadius: 10,
                    borderBottomRightRadius: 10,
                    marginTop: 5,
                  }
                : { marginTop: 20 }
            }
          >
            <>{c && renderField2()}</>
            <View style={c ? styles.modalBottomContaine3r : { width: "100%" }}>
              {renderButton1()}
              {renderButton2()}
            </View>
          </View>
        );
      };

      return (
        <MModal visible={isModal} transparent onRequestClose={closeModalg}>
          <SafeAreaView style={styles.modalContainerg}>
            <View style={styles.modalContainer22}>
              <View
                onLayout={(event) => {
                  if (!c) {
                    let { height } = event.nativeEvent.layout;
                    setmodalHeight(height);
                  }
                }}
                style={style}
              >
                {c && (
                  <>
                    {renderHeader()}
                    <ScrollView
                      contentContainerStyle={{ paddingHorizontal: 15 }}
                      showsVerticalScrollIndicator={false}
                      style={{ flex: 1 }}
                    >
                      {renderField()}
                    </ScrollView>

                    {renderBottom()}
                  </>
                )}

                {!c && (
                  <>
                    {renderHeader()}
                    {renderField()}
                    {renderField2()}
                    {renderBottom()}
                  </>
                )}
              </View>
            </View>
          </SafeAreaView>
        </MModal>
      );
    }

    if (modalChk == "delete") {
      const renderHeader = () => {
        let text = "Delete Trip?";

        const renderCross = () => {
          return (
            <Pressable
              disabled={ctripsLoader}
              style={({ pressed }) => [
                { opacity: pressed ? 0.7 : 1.0 },
                [
                  !c
                    ? {
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                      }
                    : {
                        position: "absolute",
                        bottom: 7,
                        right: 15,
                      },
                ],
              ]}
              onPress={closeModalg}
            >
              <utils.vectorIcon.Ionicons
                name="ios-close-outline"
                color={theme.color.title}
                size={32}
              />
            </Pressable>
          );
        };

        const renderTitle = () => {
          return <Text style={styles.modalTitle}>{text}</Text>;
        };

        return (
          <View
            style={
              c
                ? {
                    alignItems: "center",
                    justifyContent: "center",
                    paddingHorizontal: 15,
                    paddingTop: 15,
                    paddingBottom: 7,
                    shadowColor: "#000000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    elevation: 1,
                    backgroundColor: theme.color.background,
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                  }
                : {
                    alignItems: "center",
                    justifyContent: "center",
                  }
            }
          >
            {renderTitle()}
            {renderCross()}
          </View>
        );
      };

      const renderField = () => {
        return (
          <>
            <View
              style={{
                width: "90%",
                alignSelf: "center",
                marginTop: 25,
              }}
            >
              <Text numberOfLines={3} ellipsizeMode="tail" style={styles.samt}>
                "{title}"
              </Text>
            </View>
          </>
        );
      };

      const renderField2 = () => {
        return (
          <>
            <View
              style={{
                width: "90%",
                alignSelf: "center",

                marginTop: c ? 20 : 40,
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  color: theme.color.subTitle,
                  fontFamily: theme.fonts.fontNormal,
                  textAlign: "center",
                }}
              >
                This action cannot be undone. Any open offers for this trip will
                be automatically declined.
              </Text>
            </View>
          </>
        );
      };

      const renderBottom = () => {
        const renderButton1 = () => {
          const t = "Yes, delete it now";
          return (
            <>
              <TouchableOpacity
                disabled={ctripsLoader}
                onPress={DeleteTrip}
                activeOpacity={0.7}
                style={{
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#B93B3B",
                  height: 50,
                  borderRadius: 10,
                  alignSelf: "center",
                }}
              >
                {!ctripsLoader && (
                  <Text
                    style={{
                      color: theme.color.buttonText,
                      fontSize: 16,
                      fontFamily: theme.fonts.fontBold,
                      textTransform: "none",
                    }}
                  >
                    {t}
                  </Text>
                )}
                {ctripsLoader && (
                  <ActivityIndicator size={20} color={"white"} />
                )}
              </TouchableOpacity>
            </>
          );
        };

        const renderButton2 = () => {
          const t = "No, keep it";

          return (
            <>
              <TouchableOpacity
                disabled={ctripsLoader}
                onPress={closeModalg}
                activeOpacity={0.7}
                style={{
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: theme.color.button2,
                  height: 50,
                  borderRadius: 10,
                  alignSelf: "center",
                  borderWidth: 1,
                  borderColor: theme.color.fieldBorder,
                  marginTop: 12,
                }}
              >
                <Text
                  style={{
                    color: "#30563A",
                    textTransform: "none",
                    fontFamily: theme.fonts.fontBold,
                    fontSize: 16,
                  }}
                >
                  {t}
                </Text>
              </TouchableOpacity>
            </>
          );
        };

        return (
          <View
            style={
              c
                ? {
                    backgroundColor: theme.color.background,
                    shadowColor: "#000000",
                    shadowOffset: { width: 0, height: -1 },
                    shadowOpacity: 0.1,
                    elevation: 5,
                    borderBottomLeftRadius: 10,
                    borderBottomRightRadius: 10,
                    marginTop: 5,
                  }
                : { marginTop: 20 }
            }
          >
            <>{c && renderField2()}</>
            <View style={c ? styles.modalBottomContaine3r : { width: "100%" }}>
              {renderButton1()}
              {renderButton2()}
            </View>
          </View>
        );
      };

      return (
        <MModal visible={isModal} transparent onRequestClose={closeModalg}>
          <SafeAreaView style={styles.modalContainerg}>
            <View style={styles.modalContainer22}>
              <View
                onLayout={(event) => {
                  if (!c) {
                    let { height } = event.nativeEvent.layout;
                    setmodalHeight(height);
                  }
                }}
                style={style}
              >
                {c && (
                  <>
                    {renderHeader()}
                    <ScrollView
                      contentContainerStyle={{ paddingHorizontal: 15 }}
                      showsVerticalScrollIndicator={false}
                      style={{ flex: 1 }}
                    >
                      {renderField()}
                    </ScrollView>

                    {renderBottom()}
                  </>
                )}

                {!c && (
                  <>
                    {renderHeader()}
                    {renderField()}
                    {renderField2()}
                    {renderBottom()}
                  </>
                )}
              </View>
            </View>
          </SafeAreaView>
        </MModal>
      );
    }

    if (modalChk == "activate") {
      const renderHeader = () => {
        let text = "Activate Trip?";

        const renderCross = () => {
          return (
            <Pressable
              disabled={ctripsLoader}
              style={({ pressed }) => [
                { opacity: pressed ? 0.7 : 1.0 },
                [
                  !c
                    ? {
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                      }
                    : {
                        position: "absolute",
                        bottom: 7,
                        right: 15,
                      },
                ],
              ]}
              onPress={closeModalg}
            >
              <utils.vectorIcon.Ionicons
                name="ios-close-outline"
                color={theme.color.title}
                size={32}
              />
            </Pressable>
          );
        };

        const renderTitle = () => {
          return <Text style={styles.modalTitle}>{text}</Text>;
        };

        return (
          <View
            style={
              c
                ? {
                    alignItems: "center",
                    justifyContent: "center",
                    paddingHorizontal: 15,
                    paddingTop: 15,
                    paddingBottom: 7,
                    shadowColor: "#000000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    elevation: 1,
                    backgroundColor: theme.color.background,
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                  }
                : {
                    alignItems: "center",
                    justifyContent: "center",
                  }
            }
          >
            {renderTitle()}
            {renderCross()}
          </View>
        );
      };

      const renderField = () => {
        return (
          <>
            <View
              style={{
                width: "90%",
                alignSelf: "center",
                marginTop: 25,
              }}
            >
              <Text numberOfLines={3} ellipsizeMode="tail" style={styles.samt}>
                "{title}"
              </Text>
            </View>
          </>
        );
      };

      const renderField2 = () => {
        return (
          <>
            <View
              style={{
                width: "90%",
                alignSelf: "center",

                marginTop: c ? 20 : 40,
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  color: theme.color.subTitle,
                  fontFamily: theme.fonts.fontNormal,
                  textAlign: "center",
                }}
              >
                This will immediately make the trip public and available to
                receive trade offers.
              </Text>
            </View>
          </>
        );
      };

      const renderBottom = () => {
        const renderButton1 = () => {
          const t = "Yes, activate it now";
          return (
            <>
              <TouchableOpacity
                disabled={ctripsLoader}
                onPress={ActivateTrip}
                activeOpacity={0.7}
                style={{
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#3C6B49",
                  height: 50,
                  borderRadius: 10,
                  alignSelf: "center",
                }}
              >
                {!ctripsLoader && (
                  <Text
                    style={{
                      color: theme.color.buttonText,
                      fontSize: 16,
                      fontFamily: theme.fonts.fontBold,
                      textTransform: "none",
                    }}
                  >
                    {t}
                  </Text>
                )}
                {ctripsLoader && (
                  <ActivityIndicator size={20} color={"white"} />
                )}
              </TouchableOpacity>
            </>
          );
        };

        const renderButton2 = () => {
          const t = "No, keep it suspended";

          return (
            <>
              <TouchableOpacity
                disabled={ctripsLoader}
                onPress={closeModalg}
                activeOpacity={0.7}
                style={{
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: theme.color.button2,
                  height: 50,
                  borderRadius: 10,
                  alignSelf: "center",
                  borderWidth: 1,
                  borderColor: theme.color.fieldBorder,
                  marginTop: 12,
                }}
              >
                <Text
                  style={{
                    color: "#30563A",
                    textTransform: "none",
                    fontFamily: theme.fonts.fontBold,
                    fontSize: 16,
                  }}
                >
                  {t}
                </Text>
              </TouchableOpacity>
            </>
          );
        };

        return (
          <View
            style={
              c
                ? {
                    backgroundColor: theme.color.background,
                    shadowColor: "#000000",
                    shadowOffset: { width: 0, height: -1 },
                    shadowOpacity: 0.1,
                    elevation: 5,
                    borderBottomLeftRadius: 10,
                    borderBottomRightRadius: 10,
                    marginTop: 5,
                  }
                : { marginTop: 20 }
            }
          >
            <>{c && renderField2()}</>
            <View style={c ? styles.modalBottomContaine3r : { width: "100%" }}>
              {renderButton1()}
              {renderButton2()}
            </View>
          </View>
        );
      };

      return (
        <MModal visible={isModal} transparent onRequestClose={closeModalg}>
          <SafeAreaView style={styles.modalContainerg}>
            <View style={styles.modalContainer22}>
              <View
                onLayout={(event) => {
                  if (!c) {
                    let { height } = event.nativeEvent.layout;
                    setmodalHeight(height);
                  }
                }}
                style={style}
              >
                {c && (
                  <>
                    {renderHeader()}
                    <ScrollView
                      contentContainerStyle={{ paddingHorizontal: 15 }}
                      showsVerticalScrollIndicator={false}
                      style={{ flex: 1 }}
                    >
                      {renderField()}
                    </ScrollView>

                    {renderBottom()}
                  </>
                )}

                {!c && (
                  <>
                    {renderHeader()}
                    {renderField()}
                    {renderField2()}
                    {renderBottom()}
                  </>
                )}
              </View>
            </View>
          </SafeAreaView>
        </MModal>
      );
    }
  };

  return (
    <View style={styles.container}>
      <utils.DrawerHeader props={props} headerTitle={headerTitle} />
      {!isInternet && <utils.InternetMessage />}

      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "height" : undefined}
        style={styles.container2}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.container3}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingVertical: 15,
                paddingHorizontal: 15,
              }}
            >
              {renderSec1()}
              {renderSec2()}
              {editTrip && renderSec3()}
              {renderButton()}
            </ScrollView>
          </View>

          <utils.Footer
            nav={props.navigation}
            screen={headerTitle}
            focusScreen={store.General.focusScreen}
          />
        </SafeAreaView>
      </KeyboardAvoidingView>

      {isShowCalender && (
        <utils.RangeCalender
          isShowCalender={isShowCalender}
          setIsShowCalender={setIsShowCalender}
          availablityDates={availablityDates}
          setAvailablityDates={setAvailablityDates}
          setUnAvailble={setUnAvailble}
          title={duration.title}
          durationNum={durationNumber}
          minDate={minDate != "" ? minDate : new Date()}
          totalDays={totalDays}
        />
      )}

      {isShowUnAvailable && (
        <utils.UnAvailableModal
          isModal={isShowUnAvailable}
          setIsModal={setIsShowUnAvailable}
          unAvailable={unAvailable}
          setUnAvailble={setUnAvailble}
          minDate={minDate}
          maxDate={maxDate}
          totalDays={totalDays}
        />
      )}

      {isReviewTrip && renderReviewTripModal()}
      {isModal && renderModal()}

      {isAddPhotoModal && renderAddPhotoModal()}
      {deleteModal && renderDeleteModal()}

      {pvm && (
        <utils.FullimageModal
          data={photos}
          si={si}
          show={pvm}
          closModal={() => setpvm(!pvm)}
        />
      )}

      <Toast ref={toast} position="bottom" />
    </View>
  );
}
