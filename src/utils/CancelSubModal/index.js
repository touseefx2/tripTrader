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
import utils from "..";

export default function CancelSubModal({
  isModal,
  setIsModal,
  userSubscription,
}) {
  const maxModalHeight = theme.window.Height - 70;
  let endDate = "";

  const [isMaxHeight, setIssMaxHeight] = useState(false);
  const [modalHeight, setmodalHeight] = useState(0);
  const [loader, setLoader] = useState(false);

  if (userSubscription) {
    endDate = utils.functions.getDate(
      userSubscription[userSubscription.length - 1]?.current_period_end
    );
  }

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

  const cancelSub = () => {
    // let body = {
    //   "subscription.status": "canceled",
    // };
    // NetInfo.fetch().then((state) => {
    //   if (state.isConnected) {
    //     store.User.attemptToCancelSub(body, store.User.user._id);
    //   } else {
    //     // seterrorMessage('Please connect internet');
    //     Alert.alert("", "Please connect internet");
    //   }
    // });
  };

  const renderField = () => {
    return (
      <>
        <View style={styles.field}>
          <Text style={styles.filedTitle}>
            If you cancel now, your current subscription will end on{" "}
            <Text
              style={[styles.filedTitle, { fontFamily: theme.fonts.fontBold }]}
            >
              {endDate}{" "}
            </Text>
            and will not be renewed.
          </Text>

          <Text style={styles.filedTitle2}>
            Are you sure you want to cancel?
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
            title={"Cancel Subscription"}
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
            cancelSub={cancelSub}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
}
