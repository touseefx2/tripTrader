import React, { useEffect, useCallback, useState } from "react";
import {
  View,
  SafeAreaView,
  FlatList,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import { styles } from "./styles";
import { observer } from "mobx-react";
import store from "../../store/index";
import utils from "../../utils/index";
import Card from "./Card";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import NetInfo from "@react-native-community/netinfo";

export default observer(Cards);

function Cards(props) {
  const headerTitle = "Cards";
  const { isInternet } = store.General;
  const {
    user,
    ucRef,
    getCardInfo,
    allCardDetails,
    cardDetails,
    userSubscription,
    attempToDelteCard,
    UpdateSubcribedCardInformation,
  } = store.User;

  const [isAddCardModal, setIsAddCardModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [isModal, setIsModal] = useState(false);
  const [data, setData] = useState(allCardDetails);

  const primayCardId = cardDetails?.id || "";
  const subscriptionId = userSubscription?.id || "";

  useEffect(() => {
    if (isInternet) {
      getCardInfo(user.customerId, "Load");
    }
  }, [isInternet]);

  useEffect(() => {
    if (cardDetails) {
      const delIndex = allCardDetails.findIndex(
        (val) => val?.id === primayCardId
      );
      if (delIndex > -1) {
        const arr = allCardDetails.slice();
        arr.splice(delIndex, 1);
        setData([...[cardDetails], ...arr]);
      }
    } else {
      setData([]);
    }
  }, [allCardDetails, cardDetails]);

  const toggleAddCardModal = useCallback(() => {
    setIsAddCardModal(!isAddCardModal);
  }, [isAddCardModal]);

  const toggleIsModal = useCallback(
    (obj = null) => {
      setIsModal(!isModal);
      setModalData(obj);
    },
    [isModal]
  );

  const cardAction = (cardID) => {
    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        toggleIsModal();
        if (modalData?.check === "updateCard") {
          const body = {
            subscriptionId: subscriptionId,
            newPaymentMethod: cardID,
          };
          UpdateSubcribedCardInformation(body, "load", () =>
            getCardInfo(user.customerId, "")
          );
        } else {
          const body = {
            paymentMethod: cardID,
          };
          attempToDelteCard(body, toggleIsModal, () =>
            getCardInfo(user.customerId, "")
          );
        }
      } else {
        Alert.alert("", "Please connect internet");
      }
    });
  };

  const EmptyListMessage = () => {
    return (
      <>
        {!ucRef && <Text style={styles.emptyTitle}>No Credit Cards Found</Text>}
      </>
    );
  };

  const ItemSeparatorView = useCallback(() => {
    return (
      <View
        style={{
          height: responsiveFontSize(2.5),
        }}
      />
    );
  }, []);

  const ItemView = useCallback(
    ({ item }) => (
      <Card
        item={item}
        toggleIsModal={toggleIsModal}
        isPrimary={item?.id === primayCardId}
      />
    ),
    [primayCardId]
  );

  return (
    <View style={styles.container}>
      <utils.StackHeader bell={true} props={props} headerTitle={headerTitle} />
      <utils.Loader load={ucRef} />
      {!isInternet && <utils.InternetMessage />}
      <SafeAreaView style={styles.container2}>
        <View style={styles.container3}>
          <View style={styles.addTextContainer}>
            <TouchableOpacity onPress={toggleAddCardModal}>
              <Text style={styles.addText}>Add New Card</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            contentContainerStyle={styles.listContainer}
            data={data}
            renderItem={ItemView}
            keyExtractor={(_, index) => index.toString()}
            ListEmptyComponent={EmptyListMessage}
            ItemSeparatorComponent={ItemSeparatorView}
          />
        </View>
      </SafeAreaView>

      {isAddCardModal && (
        <utils.AddCardModal
          isModal={isAddCardModal}
          closeModal={toggleAddCardModal}
        />
      )}
      {isModal && (
        <utils.CardManageModal
          isModal={isModal}
          toggleIsModal={toggleIsModal}
          check={modalData?.check}
          action={() => cardAction(modalData?.data?.id)}
        />
      )}
    </View>
  );
}
