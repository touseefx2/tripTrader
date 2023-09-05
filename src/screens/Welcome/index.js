import React from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { responsiveHeight } from "react-native-responsive-dimensions";
import { observer } from "mobx-react";
import { styles } from "./styles";
import store from "../../store/index";
import theme from "../../theme";
import utils from "../../utils/index";
import NetInfo from "@react-native-community/netinfo";

export default observer(Welcome);
function Welcome(props) {
  const { user } = props.route.params;
  const { setgoto } = store.General;
  const { getUserById, regLoader } = store.User;

  const gotToMain = (screen) => {
    setgoto(screen);
  };

  const onSubmit = (screen) => {
    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        getUserById(user?._id, () => gotToMain(screen));
      } else {
        Alert.alert("", "Please connect internet");
      }
    });
  };

  const goBack = () => {
    props.navigation.goBack();
  };

  const renderStatusBar = () => {
    return (
      <>
        <StatusBar
          translucent={true}
          backgroundColor={"transparent"}
          barStyle={"light-content"}
        />
      </>
    );
  };

  const renderButton = (c) => {
    return (
      <>
        <TouchableOpacity
          onPress={() => onSubmit("Home")}
          activeOpacity={0.7}
          style={[styles.BottomButton, { marginTop: 40 }]}
        >
          <Text style={styles.buttonTextBottom}>Find Trips</Text>
        </TouchableOpacity>
      </>
    );
  };

  const renderButton2 = () => {
    return (
      <>
        <TouchableOpacity
          onPress={() => onSubmit("MyProfile")}
          activeOpacity={0.7}
          style={[
            styles.BottomButton,
            {
              marginTop: 12,
              backgroundColor: theme.color.button2,
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

  return (
    <View style={styles.container}>
      {renderStatusBar()}
      <Image
        source={require("../../assets/images/background/img.png")}
        style={styles.container2}
      />

      <SafeAreaView style={styles.container3}>
        <utils.AuthHeader props={props} screen="welcome" goBack={goBack} />
        <KeyboardAvoidingView
          style={{
            flex: 1,
            paddingHorizontal: 15,
            marginTop: responsiveHeight(3),
          }}
          behavior={Platform.OS == "ios" ? "padding" : undefined}
        >
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
        </KeyboardAvoidingView>
      </SafeAreaView>

      <utils.Loader load={regLoader} />
    </View>
  );
}
