import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Alert,
  Pressable,
  Keyboard,
} from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import { styles } from "./styles";
import { observer } from "mobx-react";
import store from "../../store/index";
import utils from "../../utils/index";
import theme from "../../theme";
import { responsiveHeight } from "react-native-responsive-dimensions";
import NetInfo from "@react-native-community/netinfo";
import Toast from "react-native-easy-toast";
import { ActivityIndicator } from "react-native-paper";
import { TabView, SceneMap } from "react-native-tab-view";
import Reviews from "./Reviews";
import Trips from "./Trips";
import Photos from "./Photos";

export default observer(UserProfile);

function UserProfile(props) {
  const refRBSheet = useRef();
  const toast = useRef(null);
  const headerTitle = "Profile";

  const { isInternet } = store.General;
  const { user } = store.Userv;

  const { homeModalLoder, setOtherProfileProps } = store.User;

  const [followers, setfollowers] = useState(0);
  const [following, setfollowing] = useState(0);
  const [loader, setloader] = useState(false);

  let userName = "";
  let photo = "";
  if (user) {
    userName = user.firstName + " " + user.lastName;
    photo = user.image ? user.image : "";
  }

  const [pvm, setpvm] = useState(false); //show fulll image modal
  const [pv, setpv] = useState(""); //photo view

  const [profileImageLoader, setprofileImageLoader] = useState(false);

  const [isFollow, setisFollow] = useState(false);
  const [isBlock, setisBlock] = useState(false);

  const [isOpenSheet, setisOpenSheet] = useState(false);

  const [isMessageModal, setIsMessageModal] = useState(false);
  const [isReportModal, setIsReportModal] = useState(false);

  const [isSuccessModal, setIsSuccessModal] = useState(false);
  const [successModalObj, setSuccessModalObj] = useState(null);
  const [successCheck, setSuccessCheck] = useState("");

  const [modalObj, setModalObj] = useState(false);

  const [getDataOnce, setgetDataOnce] = useState(false);
  const setGetDataOnce = (C) => {
    setgetDataOnce(C);
  };
  const getDbData = () => {
    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        store.Userv.getUserById(user._id, goBackMain);
        store.Userv.attemptToGetHome(
          user._id,
          setGetDataOnce,
          (c) => setfollowers(c),
          (c) => setfollowing(c)
        );
      }
    });
  };
  useEffect(() => {
    if (!getDataOnce && isInternet) {
      getDbData();
    }
    return () => {};
  }, [getDataOnce, isInternet]);

  useEffect(() => {
    if (store.User.user) {
      let blk = false;
      let flw = false;
      let dtt = store.User.user.followers || [];
      if (dtt.length > 0) {
        let fi = dtt.findIndex((x) => x.userId == user._id);

        if (fi > -1) {
          if (dtt[fi].block == true) {
            blk = true;
          }
          if (dtt[fi].following == true) {
            flw = true;
          }
        }
      }
      setisBlock(blk);
      setisFollow(flw);
    }
  }, [store.User.user]);

  const goBackMain = () => {
    props.navigation.goBack();
  };

  const unFollowUser = () => {
    Keyboard.dismiss();
    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        store.Userv.unFollowUser(
          user._id,
          (c) => setfollowers(c),
          (c) => setfollowing(c),
          (c) => setloader(c),
          goBackMain
        );
      } else {
        // seterrorMessage('Please connect internet');
        Alert.alert("", "Please connect internet");
      }
    });
  };
  const FollowUser = () => {
    Keyboard.dismiss();
    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        store.Userv.FollowUser(
          user._id,
          (c) => setfollowers(c),
          (c) => setfollowing(c),
          (c) => setloader(c),
          goBackMain
        );
      } else {
        // seterrorMessage('Please connect internet');
        Alert.alert("", "Please connect internet");
      }
    });
  };
  const BlockUser = () => {
    closeBottomSheet();
    Keyboard.dismiss();
    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        store.Userv.BlockUser(
          user._id,
          closeBottomSheet,
          (c) => setfollowers(c),
          (c) => setfollowing(c),
          (c) => setloader(c),
          goBackMain
        );
      } else {
        // seterrorMessage('Please connect internet');
        Alert.alert("", "Please connect internet");
      }
    });
  };
  const UnBlockUser = () => {
    closeBottomSheet();
    Keyboard.dismiss();
    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        store.Userv.UnBlockUser(
          user._id,
          closeBottomSheet,
          (c) => setfollowers(c),
          (c) => setfollowing(c),
          (c) => setloader(c),
          goBackMain
        );
      } else {
        // seterrorMessage('Please connect internet');
        Alert.alert("", "Please connect internet");
      }
    });
  };

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "reviews", title: "Reviews" },
    { key: "trips", title: "Trips" },
    { key: "photos", title: "Photos" },
  ]);
  const renderScene = SceneMap({
    reviews: Reviews,
    // trips: () => <Trips p={props} />,
    trips: Trips,
    photos: Photos,
  });

  useEffect(() => {
    setOtherProfileProps(props);
  }, []);

  const changePhoto = (c) => {
    if (c == "photoView") {
      setpv([photo]);
      setpvm(true);
      return;
    }
  };

  const onClickBottomItem = (chk) => {
    if (chk == "message") {
      closeBottomSheet();
      const obj = { hostId: user };
      openModal({ item: obj, selIndex: 0 }, chk);
    }

    if (chk == "report") {
      closeBottomSheet();
      const obj = { item: user, selIndex: 0 };
      openModal(obj, chk);
    }
  };

  const openBottomSheet = () => {
    setisOpenSheet(true);
    setTimeout(() => {
      refRBSheet?.current?.open();
    }, 100);
  };

  const closeBottomSheet = () => {
    setisOpenSheet(false);
    refRBSheet?.current?.close();
  };

  const ShowFollowersScreen = (c) => {
    store.Userv.setUser(user);
    store.User.setchk(c);
    store.User.setfuser(userName);
    store.User.setcc("other");

    props.navigation.navigate("ShowOtherFollowersStack", {
      screen: "ShowOtherFollowers",
      params: {},
    });
  };

  const renderProfileSection = () => {
    const renderProfileShow = () => {
      return (
        <TouchableOpacity
          disabled={photo == "" ? true : false}
          onPress={() => changePhoto("photoView")}
          activeOpacity={0.9}
          style={styles.profileImageContainer}
        >
          <Image
            onLoadStart={() => {
              setprofileImageLoader(false);
            }}
            onLoad={() => {
              setprofileImageLoader(true);
            }}
            style={styles.ProfileImg}
            source={
              photo != ""
                ? { uri: photo.uri ? photo.uri : photo }
                : require("../../assets/images/drawer/guest/img.png")
            }
          />

          {!profileImageLoader && (
            <ActivityIndicator
              size={22}
              color={theme.color.button1}
              style={{ top: 40, position: "absolute" }}
            />
          )}
        </TouchableOpacity>
      );
    };

    const renderProfileShoww = () => {
      return (
        <TouchableOpacity disabled={true} style={styles.profileImageContainer}>
          <Image
            style={styles.ProfileImg}
            source={require("../../assets/images/drawer/guest/img.png")}
          />
        </TouchableOpacity>
      );
    };

    const renderEditButton = () => {
      return (
        <TouchableOpacity
          style={{ position: "absolute", right: 15, top: 15 }}
          onPress={openBottomSheet}
          activeOpacity={0.7}
        >
          <View style={styles.editImgConatiner}>
            <Image
              style={styles.editImg}
              source={require("../../assets/images/editOtherUser/img.png")}
            />
          </View>
        </TouchableOpacity>
      );
    };

    const renderTextSection = () => {
      return (
        <View style={styles.TextSecConatiner}>
          <View style={styles.profileTitleConatiner}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.profileTitle}
            >
              {isBlock ? "Trip Trader User" : userName}
            </Text>
          </View>
          {user && !isBlock && (
            <View style={styles.profileTitle2Conatiner}>
              <Pressable
                style={({ pressed }) => [
                  { opacity: pressed ? 0.8 : 1.0 },
                  [styles.profileTitle2Conatiner1],
                ]}
                onPress={() => ShowFollowersScreen("followers")}
              >
                <Text style={styles.profileTitle2ConatinerTitle2}>
                  {parseInt(followers) > 900 ? "900+" : followers}
                </Text>

                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles.profileTitle2ConatinerTitle}
                >
                  followers
                </Text>
              </Pressable>

              <Pressable
                disabled={loader}
                style={({ pressed }) => [
                  { opacity: pressed ? 0.8 : 1.0 },
                  [styles.profileTitle2Conatinerm],
                ]}
                onPress={() => {
                  const userPlanStatus =
                    utils.functions.checkUserPalnStatus(props);
                  if (userPlanStatus) {
                    if (!isFollow) FollowUser();
                    else unFollowUser();
                  }
                }}
              >
                <Text style={styles.profileTitle2ConatinerTitle2m}>
                  {isFollow ? "Unfollow" : "Follow"}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => ShowFollowersScreen("following")}
                style={({ pressed }) => [
                  { opacity: pressed ? 0.8 : 1.0 },
                  [styles.profileTitle2Conatiner2],
                ]}
              >
                <Text style={styles.profileTitle2ConatinerTitle2}>
                  {parseInt(following) > 900 ? "900+" : following}
                  {"  "}
                </Text>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles.profileTitle2ConatinerTitle}
                >
                  following
                </Text>
              </Pressable>
            </View>
          )}

          {user && isBlock && (
            <View style={styles.profileTitle2Conatinerr}>
              <Pressable
                disabled={loader}
                style={({ pressed }) => [
                  { opacity: pressed ? 0.8 : 1.0 },
                  [styles.profileTitle2Conatinerm],
                ]}
                onPress={() => {
                  const userPlanStatus =
                    utils.functions.checkUserPalnStatus(props);
                  if (userPlanStatus) {
                    UnBlockUser();
                  }
                }}
              >
                <Text style={styles.profileTitle2ConatinerTitle2m}>
                  Unblock
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      );
    };

    return (
      <View style={{ paddingHorizontal: 15 }}>
        <View style={styles.profileSecConatiner}>
          {!isBlock && renderProfileShow()}
          {isBlock && renderProfileShoww()}
          {user && !isBlock && renderEditButton()}
          {renderTextSection()}
        </View>
      </View>
    );
  };

  const renderTabBar = () => {
    return (
      <>
        <View
          style={{
            paddingHorizontal: 15,
            flex: 1,
            marginTop: 10,
          }}
        >
          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
          />
        </View>

        <utils.Footer
          nav={props.navigation}
          screen={headerTitle}
          focusScreen={store.General.focusScreen}
        />
      </>
    );
  };

  const renderBottomSheet = () => {
    const messageIcon = require("../../assets/images/bottomsheet/messages/img.png");
    const blockIcon = require("../../assets/images/bottomsheet/block/img.png");
    const reportIcon = require("../../assets/images/bottomsheet/report/img.png");
    const itemConStyle = {
      width: "80%",
      // backgroundColor: 'red',
      paddingVertical: 5,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    };
    const itemiconStyle = {
      width: 24,
      height: 24,
      resizeMode: "contain",
    };
    const itemTextStyle = {
      color: "#3C6B49",
      fontSize: 16,
      fontFamily: theme.fonts.fontMedium,
      lineHeight: 25,
    };
    const touchOpacity = 0.8;

    const renderCross = () => {
      return (
        <Pressable
          style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1.0 }]}
          onPress={closeBottomSheet}
        >
          <utils.vectorIcon.Ionicons
            name="ios-close-outline"
            color={theme.color.title}
            size={32}
          />
        </Pressable>
      );
    };

    const Sep = () => {
      return <View style={{ height: 15 }} />;
    };

    return (
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={false}
        closeOnPressMask={true}
        customStyles={{
          wrapper: {
            backgroundColor: "rgba(0,0,0,0.6)",
          },
          container: {
            backgroundColor: theme.color.background,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 15,
            height: responsiveHeight(30),
          },
          draggableIcon: {
            backgroundColor: "#000",
          },
        }}
      >
        <>
          <View style={{ flex: 1 }}>
            <View style={{ width: "100%", alignItems: "flex-end" }}>
              {renderCross()}
            </View>

            <View style={{ width: "100%" }}>
              <Pressable
                onPress={() => {
                  const userPlanStatus =
                    utils.functions.checkUserPalnStatus(props);
                  if (userPlanStatus) {
                    onClickBottomItem("message");
                  }
                }}
                style={({ pressed }) => [
                  { opacity: pressed ? touchOpacity : 1.0 },
                  itemConStyle,
                ]}
              >
                <View style={{}}>
                  <Image style={itemiconStyle} source={messageIcon} />
                </View>
                <View style={{ width: "84%" }}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={itemTextStyle}
                  >
                    Message
                  </Text>
                </View>
              </Pressable>

              <Sep />
              <Pressable
                disabled={loader}
                onPress={() => {
                  const userPlanStatus =
                    utils.functions.checkUserPalnStatus(props);
                  if (userPlanStatus) {
                    if (!isBlock) BlockUser();
                    else UnBlockUser();
                  }
                }}
                style={({ pressed }) => [
                  { opacity: pressed ? touchOpacity : 1.0 },
                  itemConStyle,
                ]}
              >
                <View style={{}}>
                  <Image style={itemiconStyle} source={blockIcon} />
                </View>
                <View style={{ width: "84%" }}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={[itemTextStyle, { color: "#B93B3B" }]}
                  >
                    {!isBlock ? "Block" : "Unblock"}
                  </Text>
                </View>
              </Pressable>
              <Sep />

              <Pressable
                onPress={() => {
                  const userPlanStatus =
                    utils.functions.checkUserPalnStatus(props);
                  if (userPlanStatus) {
                    onClickBottomItem("report");
                  }
                }}
                style={({ pressed }) => [
                  { opacity: pressed ? touchOpacity : 1.0 },
                  itemConStyle,
                ]}
              >
                <View style={{}}>
                  <Image style={itemiconStyle} source={reportIcon} />
                </View>
                <View style={{ width: "84%" }}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={[itemTextStyle, { color: "#B93B3B" }]}
                  >
                    Report
                  </Text>
                </View>
              </Pressable>

              <Sep />
            </View>
          </View>
        </>
      </RBSheet>
    );
  };

  const openModal = (obj, check) => {
    setModalObj(obj);
    if (check == "message") setIsMessageModal(true);
    if (check == "report") setIsReportModal(true);
  };

  return (
    <View style={styles.container}>
      <utils.StackHeader
        screen={"userprofile"}
        bell={true}
        props={props}
        headerTitle={headerTitle}
      />
      {!isInternet && <utils.InternetMessage />}
      <SafeAreaView style={styles.container2}>
        <View style={styles.container3}>
          {renderProfileSection()}
          <View style={{ flex: 1 }}>{!isBlock && renderTabBar()}</View>
          <Toast ref={toast} position="bottom" />
        </View>
      </SafeAreaView>

      <utils.Loader load={loader} />
      {isOpenSheet && renderBottomSheet()}

      {isMessageModal && (
        <utils.MessageModal
          isModal={isMessageModal}
          setIsModal={setIsMessageModal}
          modalObj={modalObj}
          setModalObj={setModalObj}
          loader={homeModalLoder}
          setIsSuccessModal={setIsSuccessModal}
          setSuccessModalObj={setSuccessModalObj}
          setSuccessCheck={setSuccessCheck}
          goBackMain={goBackMain}
        />
      )}

      {isReportModal && (
        <utils.reportUserModal
          isModal={isReportModal}
          setIsModal={setIsReportModal}
          modalObj={modalObj}
          setModalObj={setModalObj}
          loader={homeModalLoder}
          user={user}
          goBackMain={goBackMain}
          setIsSuccessModal={setIsSuccessModal}
          setSuccessModalObj={setSuccessModalObj}
          setSuccessCheck={setSuccessCheck}
        />
      )}

      {isSuccessModal && (
        <utils.SuccessModal
          isModal={isSuccessModal}
          setIsModal={setIsSuccessModal}
          modalObj={successModalObj}
          setModalObj={setSuccessModalObj}
          check={successCheck}
          setCheck={setSuccessCheck}
          props={props}
        />
      )}

      {pvm && (
        <utils.FullimageModal
          data={pv}
          si={0}
          show={pvm}
          closModal={() => setpvm(!pvm)}
        />
      )}
    </View>
  );
}
