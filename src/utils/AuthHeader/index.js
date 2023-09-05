import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { styles } from "./styles";
import { observer } from "mobx-react";
import store from "../../store/index";
import utils from "../../utils/index";
import theme from "../../theme";
import { responsiveFontSize } from "react-native-responsive-dimensions";

export default observer(AuthHeader);
function AuthHeader(props) {
  const prop = props.props;
  const screen = props.screen || "";

  const goBack = () => {
    if (screen === "signup" || screen === "plan" || screen === "welcome") {
      props.goBack();
      return;
    }
    prop.navigation.goBack();
  };

  const renderLogo = () => {
    return (
      <View style={styles.logoContainer}>
        <Image
          style={styles.logo}
          source={require("../../assets/images/logo/img.png")}
        />
        <Text style={styles.title}>{store.General.AppName}</Text>
      </View>
    );
  };

  const renderBack = () => {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={goBack}
        style={{ position: "absolute", left: 20 }}
      >
        <utils.vectorIcon.Ionicons
          name={"chevron-back-outline"}
          color={theme.color.buttonText}
          size={responsiveFontSize(3.4)}
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
}
