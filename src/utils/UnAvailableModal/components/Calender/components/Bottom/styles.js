import { StyleSheet } from "react-native";
import theme from "../../../../../../theme";
import { responsiveFontSize } from "react-native-responsive-dimensions";

export const styles = StyleSheet.create({
  bottomContainer: {
    marginTop: 10,
    width: "100%",
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  bottomWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "52%",
    alignItems: "center",
  },

  bottomWrapper1Text2: {
    fontSize: responsiveFontSize(1.55),
    fontFamily: theme.fonts.fontMedium,
    color: theme.color.subTitle,
    textDecorationLine: "underline",
  },

  button: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 13,
    fontFamily: theme.fonts.fontBold,
    color: theme.color.buttonText,
  },
});
