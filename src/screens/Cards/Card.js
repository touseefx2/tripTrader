import React, { memo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "./styles";

export default memo(Card);
function Card({ item, toggleIsModal, isPrimary = false }) {
  const name = item?.billing_details?.name || "N/A";
  const card = {};
  if (item?.card) {
    card.number = item?.card?.last4;
    card.brand = item?.card?.brand;
    card.expiry = item?.card?.exp_month + " / " + item?.card?.exp_year;
  }

  return (
    <>
      <TouchableOpacity
        disabled={isPrimary}
        onPress={() => {
          toggleIsModal({ check: "updateCard", data: item });
        }}
        activeOpacity={0.7}
        style={[
          styles.cardContainer,
          isPrimary && { backgroundColor: "#e8f3ff" },
        ]}
      >
        <View style={styles.section}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.expiry}>{card?.expiry}</Text>
        </View>

        <View style={[styles.section, { marginTop: 5, width: "85%" }]}>
          <Text style={styles.card}>
            {card.brand + " ******* " + card.number}
          </Text>
        </View>
        {!isPrimary && (
          <View style={styles.sectionBottom}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => toggleIsModal({ check: "deleteCard", data: item })}
            >
              <Text style={styles.delete}>delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    </>
  );
}
