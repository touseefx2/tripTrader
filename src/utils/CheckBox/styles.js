import { StyleSheet } from "react-native";
import theme from "../../theme/index";
import { responsiveFontSize } from "react-native-responsive-dimensions";

export const styles = StyleSheet.create({
  Conatainer: {
    width: "53%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 20,
  },
  Title: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: theme.fonts.fontNormal,
    color: theme.color.title,
    textTransform: "capitalize",
    marginLeft: 5,
  },
});
