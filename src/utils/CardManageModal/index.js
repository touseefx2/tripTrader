import React from "react";
import {
  View,
  Modal,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import { styles } from "./styles";
import Header from "./components/Header";
import { observer } from "mobx-react";

export default observer(CardManageModal);

function CardManageModal({ isModal, toggleIsModal, check, action }) {
  return (
    <Modal visible={isModal} transparent onRequestClose={toggleIsModal}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : null}
          keyboardVerticalOffset={Platform.select({ ios: 0, android: -600 })}
          style={styles.modalContainer}
        >
          <View style={styles.modal}>
            <Header
              title={check === "updateCard" ? "Update Card" : "Delete Card"}
              toggleIsModal={toggleIsModal}
            />

            <View style={styles.Field}>
              <Text style={styles.FieldTitle1}>
                {check === "updateCard"
                  ? "Are you sure you want to update card for payment?"
                  : "Are you sure you want to delete card?"}
              </Text>
            </View>

            <TouchableOpacity
              onPress={action}
              activeOpacity={0.7}
              style={styles.ButtonContainer}
            >
              <Text style={styles.ButtonText}>Confitm</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
