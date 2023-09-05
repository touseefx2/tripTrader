import React, { memo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "./styles";
import theme from "../../theme";

export default memo(Card);
function Card({
  item,
  bottomText = "",
  deleteCard = () => {},
  clearCard = () => {},
}) {
  const name = item?.billing_details?.name || "unnamed";
  const card = {};
  if (item?.card) {
    card.number = item?.card?.last4;
    card.brand = item?.card?.brand;
    card.expiry = item?.card?.exp_month + " / " + item?.card?.exp_year;
  }

  return (
    <>
      <View style={styles.cardContainer}>
        <View style={styles.section}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.expiry}>{card?.expiry}</Text>
        </View>

        <View style={[styles.section, { marginTop: 5, width: "85%" }]}>
          <Text style={styles.card}>
            {" "}
            {card.brand + " ******* " + card.number}
          </Text>
        </View>
        {bottomText !== "" && (
          <View style={styles.sectionBottom}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() =>
                bottomText === "delete" ? deleteCard(item) : changeCard()
              }
            >
              <Text
                style={[
                  styles.delete,
                  bottomText === "change" && { color: theme.color.button1 },
                ]}
              >
                {bottomText}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </>
  );
}
