import React from "react";
import { View, Text, Pressable, TouchableOpacity } from "react-native";
import { styles } from "./styles";
import theme from "../../../../../../theme";

export default function Bottom({
  onClickApply,
  closeModal,
  clearSelectedDates,
}) {
  return (
    <View style={styles.bottomContainer}>
      <TouchableOpacity activeOpacity={0.7} onPress={clearSelectedDates}>
        <Text style={styles.bottomWrapper1Text2}>Clear dates</Text>
      </TouchableOpacity>

      <View style={styles.bottomWrapper}>
        <Pressable
          onPress={closeModal}
          style={({ pressed }) => [
            styles.button,
            {
              opacity: pressed ? 0.9 : 1.0,
              borderWidth: 1,
              borderColor: theme.color.fieldBorder,
            },
          ]}
        >
          <Text style={[styles.buttonText, { color: theme.color.button2Text }]}>
            Cancel
          </Text>
        </Pressable>

        <Pressable
          onPress={onClickApply}
          style={({ pressed }) => [
            styles.button,
            {
              opacity: pressed ? 0.9 : 1.0,
              backgroundColor: theme.color.button1,
            },
          ]}
        >
          <Text style={styles.buttonText}>Apply</Text>
        </Pressable>
      </View>
    </View>
  );
}
