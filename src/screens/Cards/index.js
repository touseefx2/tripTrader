import React, { useEffect, useCallback, useState } from "react";
import {
  View,
  SafeAreaView,
  FlatList,
  Text,
  TouchableOpacity,
} from "react-native";
import { styles } from "./styles";
import { observer } from "mobx-react";
import store from "../../store/index";
import utils from "../../utils/index";
import Card from "./Card";
import { responsiveFontSize } from "react-native-responsive-dimensions";

export default observer(Cards);

function Cards(props) {
  const headerTitle = "Cards";
  const { isInternet } = store.General;
  const { user, ucRef, getCardInfo, allCardDetails } = store.User;

  const [isAddCardModal, setIsAddCardModal] = useState(false);

  useEffect(() => {
    if (isInternet) {
      getCardInfo(user.customerId, "Load");
    }
  }, [isInternet]);

  const toggleAddCardModal = useCallback(() => {
    setIsAddCardModal(!isAddCardModal);
  }, [isAddCardModal]);

  const deleteCard = useCallback((item) => {
    console.log("card delete : ", item);
  }, []);

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
      <Card item={item} bottomText={"delete"} deleteCard={deleteCard} />
    ),
    []
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
            data={allCardDetails}
            renderItem={ItemView}
            keyExtractor={(item, index) => index.toString()}
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
    </View>
  );
}
