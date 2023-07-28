import { StyleSheet } from "react-native";
import theme from "../../../../theme";
import { responsiveFontSize } from "react-native-responsive-dimensions";

export const styles = StyleSheet.create({
  bottomContainer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  bottomWrapper1: {
    width: "40%",
  },
  bottomWrapper1Text: {
    fontSize: responsiveFontSize(1.55),
    fontFamily: theme.fonts.fontNormal,
    color: theme.color.subTitleLight,
  },
  bottomWrapper1Text2: {
    fontSize: responsiveFontSize(1.55),
    fontFamily: theme.fonts.fontMedium,
    color: theme.color.subTitle,
    textDecorationLine: "underline",
  },
  bottomWrapper2: {
    width: "52%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
