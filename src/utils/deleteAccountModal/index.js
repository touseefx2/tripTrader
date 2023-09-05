import React, { useState, useEffect } from "react";
import {
  View,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  Alert,
} from "react-native";
import { styles } from "./styles";
import theme from "../../theme";
import store from "../../store";
import Header from "./components/Header";
import Bottom from "./components/Bottom";
import NetInfo from "@react-native-community/netinfo";

export default function deleteAccountModal({ isModal, setIsModal }) {
  const maxModalHeight = theme.window.Height - 70;

  const [isMaxHeight, setIssMaxHeight] = useState(false);
  const [modalHeight, setmodalHeight] = useState(0);
  const [loader, setLoader] = useState(false);

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
    if (!loader) {
      setIsModal(false);
    }
  };

  const removeAccount = () => {
    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        store.User.getUserSubscription(
          store.User.user.customerId,
          "delete",
          setLoader,
          closeModal
        );
      } else Alert.alert("", "Please connect internet");
    });
  };

  const renderField = () => {
    return (
      <>
        <View style={styles.field}>
          <Text style={styles.filedTitle2}>
            Are you sure you want to delete your account permanently?
          </Text>
        </View>
      </>
    );
  };

  return (
    <Modal visible={isModal} transparent onRequestClose={closeModal}>
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
          <Header
            title={"Delete Account?"}
            loader={loader}
            closeModal={closeModal}
            isMaxHeight={isMaxHeight}
          />

          {isMaxHeight ? (
            <ScrollView
              contentContainerStyle={{ paddingHorizontal: 15 }}
              showsVerticalScrollIndicator={false}
              style={{ flex: 1 }}
            >
              {renderField()}
            </ScrollView>
          ) : (
            <>{renderField()}</>
          )}

          <Bottom
            isMaxHeight={isMaxHeight}
            loader={loader}
            closeModal={closeModal}
            removeAccount={removeAccount}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
}
