import React from "react";
import { View, Text, Pressable } from "react-native";
import { styles } from "./styles";
import theme from "../../../../theme";
import utils from "../../../../utils";

export default function Header({ title, closeModal }) {
  const renderCross = () => {
    return (
      <Pressable
        style={({ pressed }) => [
          { opacity: pressed ? 0.7 : 1.0 },
          [styles.cross, { right: 15 }],
        ]}
        onPress={closeModal}
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
    return <Text style={styles.title}>{title}</Text>;
  };

  return (
    <View style={styles.headerMax}>
      {renderTitle()}
      {renderCross()}
    </View>
  );
}
