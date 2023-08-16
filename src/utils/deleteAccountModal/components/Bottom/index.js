import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { styles } from "./styles";
import theme from "../../../../theme";

export default function Bottom({
  isMaxHeight,
  loader,
  closeModal,
  removeAccount,
}) {
  const renderButton1 = () => {
    return (
      <>
        <TouchableOpacity
          disabled={loader}
          onPress={removeAccount}
          activeOpacity={0.7}
          style={styles.ButtonContainer}
        >
          {!loader ? (
            <Text style={styles.ButtonText}>Yes, delete now</Text>
          ) : (
            <ActivityIndicator size={22} color={theme.color.buttonText} />
          )}
        </TouchableOpacity>
      </>
    );
  };

  const renderButton2 = () => {
    return (
      <>
        <TouchableOpacity
          disabled={loader}
          onPress={closeModal}
          activeOpacity={0.7}
          style={[
            styles.ButtonContainer,
            {
              backgroundColor: theme.color.button2,
              marginTop: 12,
            },
          ]}
        >
          <Text
            style={[
              styles.ButtonText,
              {
                color: theme.color.button2Text,
                textTransform: "none",
              },
            ]}
          >
            No, keep it
          </Text>
        </TouchableOpacity>
      </>
    );
  };

  return (
    <View
      style={{
        marginTop: isMaxHeight ? 15 : 40,
        marginBottom: isMaxHeight ? 15 : 0,
        paddingHorizontal: isMaxHeight ? 15 : 0,
      }}
    >
      {renderButton1()}
      {renderButton2()}
    </View>
  );
}
