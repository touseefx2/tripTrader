import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Image,
  Alert,
} from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import theme from "../../../theme/index";
import { observer } from "mobx-react";
import utils from "../../../utils/index";
import {
  responsiveFontSize,
  responsiveHeight,
} from "react-native-responsive-dimensions";
import { ScrollView } from "react-native-gesture-handler";
import store from "../../../store";
import NetInfo from "@react-native-community/netinfo";

export default observer(CustomDrawerContent);
function CustomDrawerContent(props) {
  const { user, logoutLoader } = store.User;
  const { setFocusScreen, isEmailPopup } = store.General;

  const { routes, index } = props.state;
  const focusedRoute = routes[index].name; // this is the active route
  setFocusScreen(focusedRoute);
  const [profileImageLoader, setprofileImageLoader] = useState(false);

  const goToLogout = () => {
    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        store.User.attemptToLogoutAccount();
      } else Alert.alert("", "Please connect internet");
    });
  };

  const goToProfile = () => {
    props.navigation.navigate("MyProfile");
  };

  const renderSection1 = () => {
    return (
      <View style={styles.Section1}>
        <Image
          style={styles.logo}
          source={require("../../../assets/images/logo/img.png")}
        />
        <View style={{ width: "69%" }}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.Section1Text}
          >
            {store.General.AppName}
          </Text>
        </View>
      </View>
    );
  };

  const renderSection2 = () => {
    return (
      <ScrollView showsVerticalScrollIndicator={false} style={styles.Section2}>
        <DrawerItemList user={user} {...props} />
      </ScrollView>
    );
  };

  const renderBottom = () => {
    const renderProfile = () => {
      const title1 =
        user == "guest" ? "guest user" : user.firstName + " " + user.lastName;
      const title2 = user == "guest" ? "limited access" : "member";
      let src = "";
      const gsrc = require("../../../assets/images/drawer/guest/img.png");
      if (user == "guest") {
        src = gsrc;
      }
      if (user != "guest" && user) {
        src = user.image && user.image != "" ? { uri: user.image } : gsrc;
      }

      return (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={goToProfile}
          style={styles.Profile}
        >
          <View style={styles.ProfileImgContainer}>
            <Image
              onLoadStart={() => {
                setprofileImageLoader(false);
              }}
              onLoad={() => {
                setprofileImageLoader(true);
              }}
              style={styles.ProfileImg}
              source={src}
            />
            {!profileImageLoader && (
              <ActivityIndicator
                size={responsiveFontSize(2.6)}
                color={theme.color.buttonText}
                style={{ top: 20, position: "absolute" }}
              />
            )}
          </View>

          <View style={styles.ProfileTextContainer}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.profileTitle1}
            >
              {title1}
            </Text>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.profileTitle2}
            >
              {title2}
            </Text>
          </View>
        </TouchableOpacity>
      );
    };

    return (
      <View style={styles.bottomContainer}>
        {renderProfile()}
        {user && user !== "guest" ? (
          <TouchableOpacity activeOpacity={0.7} onPress={goToLogout}>
            <Image
              style={styles.logoutIcon}
              source={require("../../../assets/images/drawer/logout/img.png")}
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.logoutIcon} />
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.drwaerContentContainer}
      >
        {renderSection1()}
        {renderSection2()}
      </DrawerContentScrollView>
      {renderBottom()}
      {Platform.OS == "ios" && <utils.navBarHeight />}
      {!isEmailPopup && <utils.Loader load={logoutLoader} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.backgroundGreen,
    paddingTop:
      Platform.OS == "ios"
        ? theme.window.STATUSBAR_HEIGHT + responsiveHeight(1.6)
        : responsiveHeight(3.3),
    paddingBottom: responsiveHeight(3.3),
  },
  drwaerContentContainer: {
    flex: 1,
  },
  Section1: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  Section1Text: {
    fontSize: responsiveFontSize(2.35),
    color: theme.color.buttonText,
    fontFamily: theme.fonts.titleFont,
    textTransform: "uppercase",
  },
  Section2: {
    flex: 1,
    paddingHorizontal: 5,
    marginVertical: responsiveHeight(1.5),
    paddingVertical: responsiveHeight(1.5),
  },

  bottomContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 22,
  },

  logo: {
    width: responsiveFontSize(9.6),
    height: responsiveFontSize(9.6),
    resizeMode: "contain",
  },
  itemContainer: {
    width: "85%",
    paddingVertical: 7,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 7,
    borderRadius: 8,
    paddingLeft: 15,
  },
  itemTextContainer: { width: "83%" },
  itemText: {
    fontSize: 15,
    color: theme.color.backgroundGreenText,
    fontFamily: theme.fonts.fontNormal,
    marginLeft: 7,
    textTransform: "capitalize",
  },
  logoutIcon: {
    width: responsiveFontSize(3.15),
    height: responsiveFontSize(3.15),
    resizeMode: "contain",
  },
  Profile: {
    width: "85%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ProfileImgContainer: {
    width: responsiveFontSize(8.2),
    height: responsiveFontSize(8.2),
    borderRadius: responsiveFontSize(8.2) / 2,
    borderWidth: 1,
    borderColor: theme.color.photoBorderColor,
    alignItems: "center",
    justifyContent: "center",
  },

  ProfileImg: {
    width: responsiveFontSize(8.1),
    height: responsiveFontSize(8.1),
    borderRadius: responsiveFontSize(8.1) / 2,
  },

  ProfileTextContainer: { width: "68.5%" },
  profileTitle1: {
    fontSize: responsiveFontSize(1.9),
    color: theme.color.backgroundGreenText,
    fontFamily: theme.fonts.fontBold,
    textTransform: "capitalize",
  },
  profileTitle2: {
    fontSize: responsiveFontSize(1.7),
    color: "rgba(255, 255, 255, 0.7)",
    fontFamily: theme.fonts.fontMedium,
    textTransform: "capitalize",
  },
});
