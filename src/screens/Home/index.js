import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  StatusBar,
  Alert,
  Pressable,
  RefreshControl,
  FlatList,
} from "react-native";
import { styles } from "./styles";
import { observer } from "mobx-react";
import store from "../../store/index";
import utils from "../../utils/index";
import theme from "../../theme";
import NetInfo from "@react-native-community/netinfo";
import Toast from "react-native-easy-toast";
import PushNotification from "react-native-push-notification";
import firestore from "@react-native-firebase/firestore";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import TripCard from "./component/TripCard";

export default observer(Home);
function Home(props) {
  const headerTitle = "Home";
  const toast = useRef(null);

  const {
    isInternet,
    isEmailPopup,
    setIsEmailPopup,
    setSettingsGoTo,
    setOfferGoTo,
    goToo: notify,
    goto,
  } = store.General;
  const {
    activity,
    tripLocation,
    species,
    isFilter,
    activityList,
    setActivityList,
  } = store.Filters;
  const {
    user,
    homeModalLoder,
    Hometrips,
    setisNotification,
    HomeLoader,
    attemptToGetInboxes,
    userSubscription,
  } = store.User;
  const {
    deleteLoader,
    saveTrips,
    saveLoader,
    setsaveTrips,
    attemptToSaveTrip,
  } = store.Trips;
  const { isApplySearch } = store.Search;

  const [modalObj, setModalObj] = useState(null);
  const [isOfferModal, setIsOfferModal] = useState(false);
  const [isMessageModal, setIsMessageModal] = useState(false);
  const [isRemoveModal, setIsRemoveModal] = useState(false);

  const [isSuccessModal, setIsSuccessModal] = useState(false);
  const [successModalObj, setSuccessModalObj] = useState(null);
  const [successCheck, setSuccessCheck] = useState("");

  const [getDataOnce, setgetDataOnce] = useState(false);
  const [isShowSearch, setisShowSearch] = useState(false);
  const [isShowFilters, setisShowFilters] = useState(false);

  const [fullImageModal, setFullImageModal] = useState(false);
  const [fullImageArr, setFullImageArr] = useState([]);
  const [fullImageIndication, setFullImageIndication] = useState("");

  useEffect(() => {
    if (goto === "MyProfile") {
      props.navigation.navigate(goto);
    }
    const chatroomsRef = firestore().collection("chatrooms");
    var initState = true;
    const observer = chatroomsRef
      .where(`user.${user._id}`, "==", true)
      .onSnapshot((documentSnapshot) => {
        if (initState) {
          initState = false;
        } else {
          console.log("---> onSnapshot Call Home <----");
          attemptToGetInboxes(user._id, () => {}, "");
        }
      });

    // Stop listening for updates when no longer required
    return () => observer();
  }, []);

  useEffect(() => {
    if (!getDataOnce && isInternet) {
      onRefresh();
    }
    return () => {};
  }, [getDataOnce, isInternet]);

  // useEffect(() => {
  //   if (user && user !== "guest" && getDataOnce) {
  //     setTimeout(() => {
  //       setIsEmailPopup(user?.isEmailVerified === false ? true : false);
  //     }, 2000);
  //   }
  // }, [user, getDataOnce]);

  useEffect(() => {
    if (user && user !== "guest") {
      setsaveTrips(user.savedTrips || []);
      setisNotification(user.notificationEnabled);
    }
  }, [user]);

  useEffect(() => {
    if (activity.length > 0 && species.length > 0 && activityList.length <= 0) {
      const activityLists = [];
      activity.map((element) => {
        for (let index = 0; index < species.length; index++) {
          const item = species[index];
          if (item.type && item.type._id === element._id) {
            activityLists.push(element);
            break;
          }
        }
      });
      setActivityList(activityLists);
    }
  }, [species, activity, activityList]);

  useEffect(() => {
    if (notify) {
      try {
        const topic = notify?.tag || "";
        let action = notify?.action || "";
        if (action === "") {
          const arr = JSON.parse(notify?.actions) || [];
          if (arr.length > 0) action = arr[0];
        }

        if (action !== "") onClickNotificationAction(action, notify);
        else onOpenNotification(topic, action, notify);
        store.General.setgoToo(null);
      } catch (error) {
        console.log("home error notify ", error);
      }
    }
  }, [notify]);

  useEffect(() => {
    if (isApplySearch) {
      NetInfo.fetch().then((state) => {
        if (state.isConnected) {
          if (user == "guest") {
            store.User.attemptToGetHomeTripsGuest(setgetDataOnce);
          } else {
            store.User.attemptToGetBloackUsers(
              store.User.user._id,
              () => {},
              () => {},
              setgetDataOnce,
              ""
            );
          }
        }
      });
    }
  }, [isApplySearch]);

  const goToEditProfile = (props) => {
    props.navigation.navigate("EditProfile");
  };

  const goToMyProfile = (props) => {
    props.navigation.navigate("MyProfile");
  };

  const goToInbox = (props) => {
    props.navigation.navigate("Inbox");
  };

  const goToTradeOffer = (props) => {
    props.navigation.navigate("TradeOffers");
  };

  const goToConfirmTrips = (props) => {
    props.navigation.navigate("ConfirmedTrips");
  };

  const goToSavedTrips = (props) => {
    props.navigation.navigate("SavedTrips");
  };

  const onOpenNotification = (topic, actions, notify) => {
    console.log("onOpenNotification:", notify);

    if (topic == "followUser" || topic == "dispute") {
      onClickNotificationAction(topic, notify);
    } else if (actions != "") {
      onClickNotificationAction(actions, notify);
      return;
    }

    if (topic === "id-verified" || topic === "id-notVerified") {
      goToEditProfile(props);
    }

    if (
      topic == "newReview" ||
      topic == "updateInReview" ||
      topic == "emailVerified"
    ) {
      goToMyProfile(props);
    }

    if (topic == "offerDecline" || topic == "offerCancel") {
      goToTradeOffer(props);
      setOfferGoTo("sent");
    }

    if (topic == "offerConfirm") {
      goToConfirmTrips(props);
    }

    if (topic == "subscriptionStatus") {
      props.navigation.navigate("PlanStack", {
        screen: "Plan",
        params: {},
      });
    }

    if (topic == "subscriptionStatus") {
      props.navigation.navigate("PlanStack", {
        screen: "Plan",
        params: {},
      });
    }

    if (topic == "paymentFailed") {
      setSettingsGoTo("Manage Subscription");
      props.navigation.navigate("Settings");
    }
  };

  const onClickNotificationAction = (action, notify) => {
    if (action != "followUser" && action != "dispute") {
      console.log("onClickNotificationAction:", notify);
    }

    let senderId = {};
    // if (action == 'followUser' || action == 'dispute')
    senderId = notify?.data ? notify.data : {};
    // else senderId = notify?.userInfo ? notify.userInfo : {};

    if (action == "Dismiss" || action == "No Thanks") {
      PushNotification.cancelLocalNotification(notify.id);
    }

    if (action == "Apply for Verification") {
      goToEditProfile(props);
    }
    if (action == "Respond") {
      //new message
      goToInbox(props);
    }

    if (action == "Review Offer Details") {
      //offer recieve
      goToTradeOffer(props);
      setOfferGoTo("received");
    }
    if (action.includes("Message")) {
      utils.functions.goToUserProfile(props, senderId);
    }
    if (action == "Review Trip Details") {
      //  offerAccepted tripStarts tripHosting
      goToConfirmTrips(props);
    }
    if (action == "Make Offer") {
      //save trip expire
      goToSavedTrips(props);
    }
    if (
      action == "Leave Review" ||
      action == "See Trip Details" ||
      action == "followUser" ||
      action == "dispute"
    ) {
      //newTripAdded  reviewReminder userFollow disputeReview
      utils.functions.goToUserProfile(props, senderId);
    }
  };

  const onRefresh = React.useCallback(() => {
    console.log("onrefresh cal");
    getDbData();
  }, []);

  const getDbData = () => {
    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        if (user === "guest") {
          store.User.attemptToGetHomeTripsGuest(setgetDataOnce);
        } else {
          store.User.attemptToGetBloackUsers(
            store.User.user._id,
            () => {},
            () => {},
            setgetDataOnce,
            "all"
          );
        }
      }
    });
  };

  const saveTripSuccess = (item) => {
    toast?.current?.show("Trip Saved", 1000);
    // setSuccessModalObj({item: item});
    // setSuccessCheck('TripSave');
    // setIsSuccessModal(true);
  };

  const saveTrip = (item, index) => {
    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        attemptToSaveTrip(item, index, saveTripSuccess);
      } else {
        Alert.alert("", "Please connect internet");
      }
    });
  };

  const onclickSearchBar = () => {
    setisShowSearch(true);
  };

  const onCrossSearchBar = () => {
    store.Search.clearSelSearches();

    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        if (user == "guest") {
          store.User.attemptToGetHomeTripsGuest(setgetDataOnce);
        } else {
          store.User.attemptToGetBloackUsers(
            store.User.user._id,
            () => {},
            () => {},
            setgetDataOnce,
            ""
          );
        }
      } else {
        Alert.alert("Please Connect internet");
      }
    });
  };

  const onclickFilter = () => {
    setisShowFilters(true);
  };

  const openModal = (obj, check) => {
    setModalObj(obj);
    if (check == "offer") setIsOfferModal(true);

    if (check == "message") setIsMessageModal(true);

    if (check == "tripRemove") setIsRemoveModal(true);
  };

  const renderStatusBar = () => {
    return (
      <>
        <StatusBar
          translucent={false}
          backgroundColor={theme.color.backgroundGreen}
          barStyle={"light-content"}
        />
      </>
    );
  };

  const ItemSeparatorView = () => {
    return (
      <View
        style={{
          height: 20,
        }}
      />
    );
  };

  const EmptyListMessage = () => {
    return (
      // Flat List Item
      <>
        {/* {!refreshing && getDataOnce && (
          <Text
            style={{
              marginTop: '80%',
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'center',
              fontSize: 13,
              color: theme.color.title,
              fontFamily: theme.fonts.fontMedium,
              opacity: 0.4,
            }}
            >
            No Trips Found
          </Text>
        )} */}
      </>
    );
  };

  const ItemView = useCallback(
    ({ item, index }) => (
      <TripCard
        item={item}
        index={index}
        saveTrips={saveTrips}
        props={props}
        openModal={openModal}
        setFullImageModal={setFullImageModal}
        setFullImageArr={setFullImageArr}
        setFullImageIndication={setFullImageIndication}
        saveTrip={saveTrip}
        saveLoader={saveLoader}
        user={user}
        userSubscription={userSubscription}
      />
    ),
    [saveTrips, userSubscription]
  );

  const ListHeader = () => {
    const renderResult = () => {
      let length = Hometrips.length || 0;

      return (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>
            {length} {isApplySearch ? "search" : isFilter ? "filter" : ""}{" "}
            result
            {length > 1 ? "s" : ""}
          </Text>
        </View>
      );
    };

    const renderSearch = () => {
      return (
        <Image
          source={require("../../assets/images/searchBar/search/img.png")}
          style={styles.Baricon}
        />
      );
    };

    const renderInput = () => {
      return (
        <View style={{ width: "87%" }}>
          <Text
            style={{
              fontSize: responsiveFontSize(1.85),
              color: !isApplySearch
                ? theme.color.subTitleLight
                : theme.color.subTitle,
              fontFamily: theme.fonts.fontNormal,
            }}
          >
            {!isApplySearch ? "Search" : store.Search.search}
          </Text>
        </View>
      );
    };

    const renderFilter = () => {
      return (
        <Image
          source={require("../../assets/images/searchBar/filter/img.png")}
          style={styles.Baricon}
        />
      );
    };

    const renderCross = () => {
      return (
        <utils.vectorIcon.AntDesign
          name="close"
          size={responsiveFontSize(2.6)}
          color={theme.color.subTitle}
        />
      );
    };

    return (
      <>
        <View style={styles.SerchBarContainer}>
          <Pressable
            disabled={isApplySearch}
            style={({ pressed }) => [
              { opacity: pressed ? 0.7 : 1 },
              {
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: "80%",
              },
            ]}
            onPress={onclickSearchBar}
          >
            {renderSearch()}
            {renderInput()}
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.7 : 1,
              },
            ]}
            onPress={!isApplySearch ? onclickFilter : onCrossSearchBar}
          >
            {!isApplySearch ? renderFilter() : renderCross()}
          </Pressable>
        </View>
        {renderResult()}
      </>
    );
  };

  const ListFooter = () => {
    return (
      <>
        <View>
          <View style={styles.listFooter}>
            <Text style={styles.listFooterT}>End of results</Text>
          </View>
        </View>
      </>
    );
  };

  return (
    <>
      <View style={styles.container}>
        <utils.DrawerHeader props={props} headerTitle={headerTitle} />
        {!isInternet && <utils.InternetMessage />}
        {renderStatusBar()}
        <utils.Loader load={saveLoader} />
        <SafeAreaView style={styles.container2}>
          <View style={styles.container3}>
            <FlatList
              decelerationRate={0.6}
              refreshControl={
                <RefreshControl refreshing={HomeLoader} onRefresh={onRefresh} />
              }
              contentContainerStyle={{
                paddingVertical: 12,
                paddingHorizontal: 15,
              }}
              data={Hometrips}
              renderItem={ItemView}
              keyExtractor={(item, index) => index.toString()}
              ListEmptyComponent={EmptyListMessage}
              ItemSeparatorComponent={ItemSeparatorView}
              ListHeaderComponent={ListHeader}
              ListFooterComponent={Hometrips.length > 0 ? ListFooter : null}
            />
          </View>

          <utils.Footer
            nav={props.navigation}
            screen={headerTitle}
            focusScreen={store.General.focusScreen}
          />
        </SafeAreaView>

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
        {isShowSearch && (
          <utils.Search
            isVisible={isShowSearch}
            setisVisible={(c) => setisShowSearch(c)}
            setGetDataOnce={(c) => setgetDataOnce(c)}
          />
        )}
        {isShowFilters && (
          <utils.Filters
            isVisible={isShowFilters}
            setisVisible={(c) => setisShowFilters(c)}
            setGetDataOnce={(c) => setgetDataOnce(c)}
          />
        )}
        {fullImageModal && (
          <utils.FullimageModal
            data={[]}
            si={0}
            show={fullImageModal}
            pd={fullImageArr}
            pdc={fullImageIndication}
            closModal={() => {
              setFullImageModal(!fullImageModal);
              setFullImageArr("");
              setFullImageIndication("");
            }}
          />
        )}
        {isOfferModal && (
          <utils.MakeOffer
            isModal={isOfferModal}
            setIsModal={setIsOfferModal}
            modalObj={modalObj}
            setModalObj={setModalObj}
            loader={homeModalLoder}
            activity={activity}
            species={species}
            tripLocation={tripLocation}
            setIsSuccessModal={setIsSuccessModal}
            setSuccessModalObj={setSuccessModalObj}
            setSuccessCheck={setSuccessCheck}
            screen={"Home"}
            props={props}
          />
        )}
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
            goBackMain={() => {}}
          />
        )}
        {isRemoveModal && (
          <utils.unSaveTripModal
            isModal={isRemoveModal}
            setIsModal={setIsRemoveModal}
            modalObj={modalObj}
            setModalObj={setModalObj}
            loader={deleteLoader}
            screen="Home"
            data={[]}
            setdata={() => {}}
            saveData={[]}
            setSaveData={() => {}}
          />
        )}
        {isEmailPopup && (
          <utils.EmailPopupSheet
            isModal={isEmailPopup}
            setIsModal={setIsEmailPopup}
            email={user?.email || ""}
            user={user || null}
          />
        )}
        <Toast ref={toast} position="bottom" />
      </View>
    </>
  );
}
