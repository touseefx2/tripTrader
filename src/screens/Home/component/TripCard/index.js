import React, { memo } from "react";
import { View, Text, Image, Pressable } from "react-native";
import ProgressiveFastImage from "@freakycoder/react-native-progressive-fast-image";
import { ImageSlider } from "react-native-image-slider-banner";
import moment from "moment";
import { styles } from "./styles";
import store from "../../../../store";
import utils from "../../../../utils";
import theme from "../../../../theme";

export default memo(TripCard);
function TripCard({
  item,
  index,
  props,
  saveTrips,
  openModal,
  setFullImageModal,
  setFullImageArr,
  setFullImageIndication,
  saveTrip,
  saveLoader,
  user,
}) {
  const usr = item.hostId;
  //user
  const photo = usr.image || "";
  const userName = usr.firstName + " " + usr.lastName;
  const avgRating = usr.rating || 0;
  const totalReviews = usr.reviews || 0;
  const isVeirfy = usr.identityStatus == "verified" ? true : false;

  //trip
  const status = item.status || "";
  const tripPhotos = item.photos ? item.photos : [];
  const titlee = item.title + " " + item.tradeType || "";
  const locName = item.location.city + ", " + item.location.state;
  const trade = item.returnActivity || "";
  const sd = utils.functions.DateWithoutFormat(item.availableFrom);
  const sdy = parseInt(new Date(sd).getFullYear());
  const ed = utils.functions.DateWithoutFormat(item.availableTo);
  const edy = parseInt(new Date(ed).getFullYear());
  let favlbl = "";

  const isSave = utils.functions.CheckisAlreadySaveTrip(
    item,
    saveTrips.slice()
  );

  if (sdy == edy) {
    favlbl =
      moment(sd).format("MMM DD") + " - " + moment(ed).format("MMM DD, YYYY");
  } else {
    favlbl =
      moment(sd).format("MMM DD, YYYY") +
      " - " +
      moment(ed).format("MMM DD, YYYY");
  }

  const renderSec1 = () => {
    const renderProfile = () => {
      return (
        <View style={styles.ProfileImgContainer}>
          <ProgressiveFastImage
            style={styles.ProfileImg}
            source={
              photo != ""
                ? { uri: photo }
                : require("../../../../assets/images/drawer/guest/img.png")
            }
            loadingImageStyle={styles.imageLoader}
            loadingSource={require("../../../../assets/images/imgLoad/img.jpeg")}
            blurRadius={5}
          />
          {isVeirfy && (
            <Image
              style={styles.iconVerify}
              source={require("../../../../assets/images/verified/img.png")}
            />
          )}
        </View>
      );
    };

    const renderText = () => {
      return (
        <View style={styles.textContainer}>
          <Pressable
            disabled={user == "guest" ? true : false}
            onPress={() => {
              if (user == "guest") return;

              store.Userv.setfscreen("home");
              store.Userv.setUser(usr);
              store.Userv.addauthToken(store.User.authToken);
              props.navigation.navigate("UserProfile");
            }}
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1.0 }]}
          >
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.textContainertitle}
            >
              {userName}
            </Text>
          </Pressable>

          <View style={{ flexDirection: "row", marginTop: 2 }}>
            <utils.vectorIcon.Entypo
              name="star"
              color={theme.color.rate}
              size={14}
            />
            <Text style={styles.textContainerRatetitle1}>
              {" "}
              {avgRating > 0 ? avgRating.toFixed(1) : avgRating}
              {"  "}
            </Text>
            <Text style={styles.textContainerRatetitle2}>
              {totalReviews > 300 ? "300+" : totalReviews} reviews
            </Text>
          </View>
        </View>
      );
    };

    const rendericon = () => {
      return (
        <Pressable
          disabled={saveLoader}
          onPress={() => {
            if (user == "guest") {
              store.General.setgoto("guestaccess");
              store.User.Logout();
              return;
            }

            if (!isSave) saveTrip(item, index);
            else openModal({ item: item, selIndex: index }, "tripRemove");
          }}
          style={({ pressed }) => [
            { opacity: pressed ? 0.6 : 1.0 },
            styles.iconContainer,
          ]}
        >
          <Image
            style={styles.iconSave}
            source={
              !isSave
                ? require("../../../../assets/images/addSave/img.png")
                : require("../../../../assets/images/homeSave/img.png")
            }
          />
        </Pressable>
      );
    };

    return (
      <View style={styles.boxSection1}>
        {renderProfile()}
        {renderText()}
        {rendericon()}
      </View>
    );
  };

  const renderSec2 = () => {
    const renderTripImages = () => {
      let chk =
        tripPhotos.length <= 0
          ? "0"
          : tripPhotos.length == 1
          ? "1"
          : tripPhotos.length > 1
          ? "2"
          : "0";

      return (
        <>
          {chk == "2" && (
            <>
              <View style={styles.tripImageConatiner}>
                <ImageSlider
                  showHeader={false}
                  preview={true}
                  data={tripPhotos}
                  autoPlay={false}
                />
              </View>
            </>
          )}

          {(chk == "0" || chk == "1") && (
            <>
              <Pressable
                style={({ pressed }) => [
                  { opacity: pressed ? 0.95 : 1.0 },
                  [styles.tripImageConatiner],
                ]}
                onPress={() => {
                  setFullImageModal(true);
                  setFullImageArr(chk == "1" ? tripPhotos[0] : "");
                  setFullImageIndication(chk == "1" ? "tp" : "ph");
                }}
              >
                <ProgressiveFastImage
                  style={styles.tripImg}
                  source={
                    chk == "1"
                      ? { uri: tripPhotos[0] }
                      : require("../../../../assets/images/trip/img.jpeg")
                  }
                  loadingImageStyle={styles.imageLoader2}
                  loadingSource={require("../../../../assets/images/imgLoad/img.jpeg")}
                  blurRadius={5}
                />
              </Pressable>
            </>
          )}
        </>
      );
    };

    return <View style={styles.boxSection2}>{renderTripImages()}</View>;
  };

  const renderSec3 = () => {
    return (
      <View style={styles.boxSection3}>
        <Text style={styles.sec3T1}>{titlee}</Text>
        <View style={styles.sec3T2Container}>
          <Image
            style={styles.sec3Icon}
            source={require("../../../../assets/images/location/img.png")}
          />
          <View style={{ width: "94%" }}>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.sec3T2}>
              {locName}
            </Text>
          </View>
        </View>
        <View style={{ marginTop: 10 }}>
          <Text style={styles.sec3T31}>In Return For</Text>
          <Text style={[styles.sec3T32, { textTransform: "capitalize" }]}>
            {trade}
          </Text>
        </View>
        <View style={{ marginTop: 10 }}>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.sec3T31}>
            Availability
          </Text>
          <Text style={styles.sec3T32}>{favlbl}</Text>
        </View>
      </View>
    );
  };

  const renderSec4 = () => {
    return (
      <View style={styles.boxSection4}>
        <Pressable
          onPress={() => {
            if (user == "guest") {
              store.General.setgoto("guestaccess");
              store.User.Logout();
              return;
            }

            if (user.subscriptionStatus == "freemium") {
              props.navigation.navigate("Plan");
            } else openModal({ item: item, selIndex: index }, "offer");
          }}
          style={({ pressed }) => [
            { opacity: pressed ? 0.9 : 1.0 },
            styles.sec4B,
          ]}
        >
          <Text style={styles.sec4T}>make offer</Text>
        </Pressable>

        <Pressable
          onPress={() => {
            if (user == "guest") {
              store.General.setgoto("guestaccess");
              store.User.Logout();
              return;
            }
            if (user.subscriptionStatus == "freemium") {
              props.navigation.navigate("Plan");
            } else openModal({ item: item, selIndex: index }, "message");
          }}
          style={({ pressed }) => [
            { opacity: pressed ? 0.9 : 1.0 },
            [styles.sec4B, { backgroundColor: theme.color.button2 }],
          ]}
        >
          <Text style={[styles.sec4T, { color: theme.color.subTitle }]}>
            message
          </Text>
        </Pressable>
      </View>
    );
  };

  return (
    <>
      <View style={[styles.boxContainer, { marginTop: index == 0 ? 7 : 0 }]}>
        {renderSec1()}
        {renderSec2()}
        {renderSec3()}
        {renderSec4()}
      </View>
    </>
  );
}
