import React, { useEffect, useCallback } from "react";
import { View, SafeAreaView, FlatList, Text, Alert } from "react-native";
import { styles } from "./styles";
import { observer } from "mobx-react";
import store from "../../store/index";
import utils from "../../utils/index";
import Card from "./Card.js";
import { responsiveFontSize } from "react-native-responsive-dimensions";

export default observer(Cards);

function Cards(props) {
  const headerTitle = "Cards";
  const { isInternet } = store.General;
  const { user, ucRef, getCardInfo, allCardDetails } = store.User;

  useEffect(() => {
    if (isInternet) {
      getCardInfo(user.customerId, "Load");
    }
  }, [isInternet]);

  const deleteCard = useCallback((item) => {
    console.log(item);
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
          height: responsiveFontSize(3),
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
    </View>
  );
}
