import React, { useCallback, useEffect } from "react";
import {
  View,
  Modal,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  FlatList,
} from "react-native";
import { styles } from "./styles";
import theme from "../../theme";
import store from "../../store";
import Header from "./components/Header";
import { observer } from "mobx-react";
import Card from "../../screens/Cards/Card";
import { responsiveFontSize } from "react-native-responsive-dimensions";

export default observer(SelectCardModal);

function SelectCardModal({ isModal, closeModal, setSelectedCard }) {
  const maxModalHeight = theme.window.Height - 270;
  const { isInternet } = store.General;
  const { user, ucRef, getCardInfo, allCardDetails } = store.User;

  useEffect(() => {
    if (isInternet) {
      getCardInfo(user.customerId, "Load");
    }
  }, [isInternet]);

  const EmptyListMessage = () => {
    return (
      <>
        {!ucRef && <Text style={styles.emptyTitle}>No Credit Cards Found</Text>}
      </>
    );
  };

  const selectCard = useCallback((val) => {
    setSelectedCard(val);
    closeModal();
  }, []);

  const ItemSeparatorView = useCallback(() => {
    return (
      <View
        style={{
          height: responsiveFontSize(3),
        }}
      />
    );
  }, []);

  const ItemView = useCallback(
    ({ item }) => <Card item={item} modal={true} selectCard={selectCard} />,
    []
  );

  return (
    <Modal visible={isModal} transparent onRequestClose={closeModal}>
      <TouchableWithoutFeedback onPress={closeModal}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : null}
          keyboardVerticalOffset={Platform.select({ ios: 0, android: 500 })}
          style={styles.modalContainer}
        >
          <View style={[styles.modal, { height: maxModalHeight }]}>
            <Header title={"Select Card"} closeModal={closeModal} />
            <FlatList
              style={styles.list}
              contentContainerStyle={styles.listContainer}
              data={allCardDetails}
              renderItem={ItemView}
              keyExtractor={(_, index) => index.toString()}
              ListEmptyComponent={EmptyListMessage}
              ItemSeparatorComponent={ItemSeparatorView}
            />
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
