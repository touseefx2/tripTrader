import { Platform, StyleSheet } from "react-native";
import theme from "../../theme/index";
import {
  responsiveFontSize,
  responsiveHeight,
} from "react-native-responsive-dimensions";

export const styles = StyleSheet.create({
  headerConatainer: {
    backgroundColor: theme.color.backgroundGreen,
    paddingHorizontal: 15,
    paddingVertical: responsiveHeight(1.9),
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.6,
    shadowRadius: 1,
    marginTop: Platform.OS == "ios" ? theme.window.APPBAR_HEIGHT : 0,

    overflow: "hidden",
  },
  drawerIcon: {
    width: responsiveFontSize(3.4),
    height: responsiveFontSize(3.4),
    resizeMode: "contain",
  },
  headerTitle: {
    fontSize: responsiveFontSize(2.5),
    fontFamily: theme.fonts.fontBold,
    color: theme.color.backgroundGreenText,
    textTransform: "capitalize",
  },
  bellIcon: {
    width: responsiveFontSize(3.5),
    height: responsiveFontSize(3.5),
    resizeMode: "contain",
  },
  dot: {
    width: responsiveFontSize(1),
    height: responsiveFontSize(1),
    borderRadius: responsiveFontSize(1) / 2,
    position: "absolute",
    right: 3.5,
    top: 4,
    backgroundColor: theme.color.ntfctnClr,
  },
});
