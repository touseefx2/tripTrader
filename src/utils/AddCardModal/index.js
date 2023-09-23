import React, { useState } from "react";
import {
  View,
  Modal,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  TextInput,
  Keyboard,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { styles } from "./styles";
import theme from "../../theme";
import store from "../../store";
import Header from "./components/Header";
import { observer } from "mobx-react";
import {
  StripeProvider,
  CardField,
  useStripe,
} from "@stripe/stripe-react-native";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import NetInfo from "@react-native-community/netinfo";

export default observer(AddCardModal);

function AddCardModal({ isModal, closeModal }) {
  const nameRegex = /^[a-zA-Z-' ]+$/;
  const { Stripe_Publish_Key } = store.General;

  const [firstName, setFirstName] = useState("");
  const [emptyFirstName, setEmptyFirstName] = useState(false);
  const [invalidFirstName, setInvalidFirstName] = useState(false);
  const [cardErr, setCardErr] = useState("");
  const [cardObj, setCardObj] = useState(null);

  const [loader, setLoader] = useState(null);

  const setCardFirstName = (t) => {
    setEmptyFirstName(false);
    setInvalidFirstName(false);
    setFirstName(t);
  };

  const onChangeCard = (value) => {
    setCardObj(value);
    setCardErr("");
  };

  const checkCardError = (value) => {
    const isNumberValid = value.validNumber === "Valid" ? true : false;
    if (!isNumberValid) {
      setCardErr("Card number is invalid");
      return false;
    }
    const isExpiryValid = value.validExpiryDate === "Valid" ? true : false;
    if (!isExpiryValid) {
      setCardErr("Card expiry date is invalid");
      return false;
    }
    const isCvcValid = value.validCVC === "Valid" ? true : false;
    if (!isCvcValid) {
      setCardErr("Card cvc number is invalid");
      return false;
    }

    setCardErr("");
    return true;
  };

  const clearCard = () => {
    setFirstName("");
    setCardErr("");
    setEmptyFirstName(false);
    setInvalidFirstName(false);
    setCardObj(null);
  };

  const addCard = () => {
    Keyboard.dismiss();

    if (firstName.trim() === "") {
      setEmptyFirstName(true);
      return;
    }

    if (nameRegex.test(firstName.trim()) === false) {
      setInvalidFirstName(true);
      return;
    }

    if (!cardObj) {
      setCardErr("Please enter full Card detials");
      return;
    } else {
      if (!checkCardError(cardObj)) {
        return;
      } else {
        NetInfo.fetch().then((state) => {
          if (state.isConnected) {
            // const body = {
            //   customerId: userData?.customerId,
            // };
            closeModal();
          } else {
            Alert.alert("", "Please connect internet");
          }
        });

        return;
      }
    }
  };

  const renderShowFieldError = (check) => {
    let text = check === "card" ? cardErr : "";

    if (check === "firstName") {
      text = emptyFirstName
        ? "Please enter a full name"
        : invalidFirstName
        ? "Full name is invalid"
        : "";
    }

    return (
      <View style={styles.errorMessageFieldContainer}>
        <Text style={styles.errorMessageFieldText}>{text}</Text>
      </View>
    );
  };

  return (
    <Modal visible={isModal} transparent onRequestClose={closeModal}>
      <StripeProvider publishableKey={Stripe_Publish_Key}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : null}
            keyboardVerticalOffset={Platform.select({ ios: 0, android: -600 })}
            style={styles.modalContainer}
          >
            <View style={styles.modal}>
              <Header title={"Add Card"} closeModal={closeModal} />

              <View style={styles.Field}>
                <Text style={styles.FieldTitle1}>full name</Text>
                <TextInput
                  placeholder="Card holder’s first and last name"
                  value={firstName}
                  onChangeText={setCardFirstName}
                  style={[
                    styles.FieldInput,
                    {
                      borderColor:
                        emptyFirstName || invalidFirstName
                          ? theme.color.fieldBordeError
                          : theme.color.fieldBorder,
                      fontSize: 12,
                      color: "black",
                    },
                  ]}
                />
                {(emptyFirstName || invalidFirstName) &&
                  renderShowFieldError("firstName")}
              </View>

              <View style={styles.Field}>
                <Text style={styles.FieldTitle1}>card</Text>

                <CardField
                  postalCodeEnabled={false}
                  placeholders={{
                    number: "Card number",
                  }}
                  cardStyle={{
                    textColor: theme.color.title,
                    fontSize: responsiveFontSize(1.5),
                    borderColor: theme.color.fieldBorder,
                    borderWidth: 1,
                    borderRadius: 8,
                    fontFamily: theme.fonts.fontNormal,
                  }}
                  style={{
                    width: "100%",
                    height: 45,
                  }}
                  onCardChange={(cardDetails) => {
                    onChangeCard(cardDetails);
                  }}
                  onFocus={(focusedField) => {
                    console.log("focusField", focusedField);
                  }}
                />
                {cardErr !== "" && renderShowFieldError("card")}
              </View>

              <TouchableOpacity
                disabled={loader}
                onPress={addCard}
                activeOpacity={0.7}
                style={styles.ButtonContainer}
              >
                {!loader ? (
                  <Text style={styles.ButtonText}>Add</Text>
                ) : (
                  <ActivityIndicator size={22} color={theme.color.buttonText} />
                )}
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </StripeProvider>
    </Modal>
  );
}
