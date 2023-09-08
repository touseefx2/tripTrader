import React, { useState, useEffect } from "react";
import {
  View,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import {
  responsiveFontSize,
  responsiveHeight,
} from "react-native-responsive-dimensions";
import NetInfo from "@react-native-community/netinfo";
import { styles } from "./styles";
import theme from "../../theme";
import store from "../../store";
import { observer } from "mobx-react";

export default observer(EmailPopupSheet);
function EmailPopupSheet({ isModal, setIsModal, email, user }) {
  const maxModalHeight = theme.window.Height - 70;
  const { reSendVerificationLink, resendLoder, logoutLoader } = store.User;

  const [isMaxHeight, setIssMaxHeight] = useState(false);
  const [modalHeight, setmodalHeight] = useState(0);

  useEffect(() => {
    setIssMaxHeight(modalHeight >= maxModalHeight ? true : false);
  }, [modalHeight]);

  const onViewLayout = (event) => {
    if (!isMaxHeight) {
      const { height } = event.nativeEvent.layout;
      setmodalHeight(height);
    }
  };

  const closeModal = () => {
    setIsModal(false);
  };

  const reSendLink = () => {
    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        reSendVerificationLink(email, user);
      } else {
        Alert.alert("", "Please connect internet");
      }
    });
  };

  const logoutAccount = () => {
    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        store.User.attemptToLogoutAccount();
      } else Alert.alert("", "Please connect internet");
    });
  };

  const renderHeader = () => {
    return (
      <View style={isMaxHeight ? styles.headerMax : styles.header}>
        <Text style={styles.headerText}>Check your email!</Text>
      </View>
    );
  };

  const renderMain = () => {
    return (
      <View style={styles.main}>
        <Image
          style={styles.image}
          source={require("../../assets/images/emailSent/img.png")}
        />

        <Text style={styles.text1}>
          To activate your account, click the button in the verification email
          we sent to:{" "}
          <Text
            style={[
              styles.text1 && {
                color: theme.color.title,
                fontFamily: theme.fonts.fontNormal,
              },
            ]}
          >
            {email}
          </Text>
        </Text>

        <Text style={styles.text2}>
          If you haven't received an email within a few minutes, please check
          your spam folder.
        </Text>
      </View>
    );
  };

  const renderButton = () => {
    return (
      <View style={isMaxHeight ? styles.bottomMax : styles.bottom}>
        <TouchableOpacity
          activeOpacity={0.7}
          disabled={resendLoder || logoutLoader}
          onPress={reSendLink}
          style={styles.button}
        >
          {!resendLoder ? (
            <Text style={styles.buttonText}>Resend Verification Email</Text>
          ) : (
            <ActivityIndicator
              size={responsiveFontSize(3.2)}
              color={theme.color.buttonText}
            />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          disabled={resendLoder || logoutLoader}
          onPress={logoutAccount}
          style={[
            styles.button,
            {
              marginTop: responsiveHeight(1.2),
              backgroundColor: "#B93B3B",
            },
          ]}
        >
          {!logoutLoader ? (
            <Text style={styles.buttonText}>Logout</Text>
          ) : (
            <ActivityIndicator
              size={responsiveFontSize(3.2)}
              color={theme.color.buttonText}
            />
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Modal visible={isModal} transparent>
      <SafeAreaView style={styles.modalContainer}>
        <View
          onLayout={onViewLayout}
          style={[
            styles.modal,
            isMaxHeight
              ? { height: maxModalHeight, paddingTop: 0 }
              : { padding: 15 },
          ]}
        >
          {renderHeader()}

          {isMaxHeight ? (
            <ScrollView
              contentContainerStyle={{
                paddingHorizontal: 15,
                paddingTop: isMaxHeight ? responsiveHeight(3.2) : 0,
              }}
              showsVerticalScrollIndicator={false}
              style={{ flex: 1 }}
            >
              {renderMain()}
            </ScrollView>
          ) : (
            <>{renderMain()}</>
          )}

          {renderButton()}
        </View>
      </SafeAreaView>
    </Modal>
  );
}
