import React, { memo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "./styles";
import theme from "../../theme";
import utils from "../index";
import { responsiveFontSize } from "react-native-responsive-dimensions";

export default memo(CheckBox);
function CheckBox({ isSel, setIsSel }) {
  const iconSize = responsiveFontSize(2.4);
  const opacity = 0.7;
  return (
    <View style={styles.Conatainer}>
      <TouchableOpacity
        onPress={() => setIsSel(true)}
        activeOpacity={opacity}
        style={styles.radioContainer}
      >
        <utils.vectorIcon.MaterialIcons
          name={isSel ? "radio-button-checked" : "radio-button-unchecked"}
          size={iconSize}
          color={theme.color.titleGreen}
        />
        <Text style={styles.Title}>Yes</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setIsSel(false)}
        activeOpacity={opacity}
        style={styles.radioContainer}
      >
        <utils.vectorIcon.MaterialIcons
          name={!isSel ? "radio-button-checked" : "radio-button-unchecked"}
          size={iconSize}
          color={theme.color.titleGreen}
        />
        <Text style={styles.Title}>No</Text>
      </TouchableOpacity>
    </View>
  );
}
