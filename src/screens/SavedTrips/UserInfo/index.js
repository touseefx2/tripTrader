import React, { memo } from "react";
import { View, Text, Image, Pressable } from "react-native";
import ProgressiveFastImage from "@freakycoder/react-native-progressive-fast-image";
import { styles } from "./styles";
import store from "../../../store/index";
import utils from "../../../utils/index";
import theme from "../../../theme";

export default memo(UserInfo);

function UserInfo({ item, index, user, props, openModal }) {
  let usr = item.hostId;

  if (usr) {
    //user
    let photo = usr?.image || "";
    let userName = usr.firstName + " " + usr.lastName;
    let avgRating = usr.rating || 0;
    let totalReviews = usr.reviews || 0;
    let isVeirfy = usr.identityStatus == "verified" ? true : false;

    const renderSec1 = () => {
      const renderProfile = () => {
        return (
          <View style={styles.ProfileImgContainer}>
            <ProgressiveFastImage
              style={styles.ProfileImg}
              source={
                photo != ""
                  ? { uri: photo }
                  : require("../../../assets/images/drawer/guest/img.png")
              }
              loadingImageStyle={styles.imageLoader}
              loadingSource={require("../../../assets/images/imgLoad/img.jpeg")}
              blurRadius={5}
            />
            {isVeirfy && (
              <Image
                style={styles.iconVerify}
                source={require("../../../assets/images/verified/img.png")}
              />
            )}
          </View>
        );
      };

      const renderText = () => {
        return (
          <View style={styles.textContainer}>
            <Pressable
              onPress={() => {
                if (user == "guest") {
                  return;
                }

                store.Userv.setfscreen("savedtrips");
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
            onPress={() => {
              const userPlanStatus = utils.functions.checkUserPalnStatus(
                props,
                false
              );
              if (userPlanStatus) {
                openModal({ item: item, selIndex: index }, "tripRemove");
              }
            }}
            style={({ pressed }) => [
              { opacity: pressed ? 0.6 : 1.0 },
              styles.iconContainer,
            ]}
          >
            <Image
              style={styles.iconSave}
              source={require("../../../assets/images/delSave/img.png")}
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

    return (
      <>
        <View>{renderSec1()}</View>
      </>
    );
  } else {
    return null;
  }
}
