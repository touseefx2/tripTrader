import { Platform, StyleSheet } from "react-native";
import { responsiveHeight } from "react-native-responsive-dimensions";
import theme from "../../theme/index";
let aph = theme.window.APPBAR_HEIGHT - (Platform.OS == "ios" ? 20 : 0);

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.backgroundGreen,
  },
  container2: {
    flex: 1,
    position: "absolute",
    left: 0,
    top: 0,
    width: theme.window.Width,
    height: theme.window.Height,
  },
  container3: {
    flex: 1,
  },

  Header: {
    marginTop: aph,
    width: "100%",

    alignItems: "center",
    paddingHorizontal: 20,
  },
  section1: { alignItems: "center", justifyContent: "center" },
  section2: {
    backgroundColor: theme.color.background,
    borderRadius: 15,
    marginBottom: responsiveHeight(1.9),
    paddingHorizontal: 15,
    paddingVertical: responsiveHeight(1.9),
  },
  section2Title1: {
    color: theme.color.title,
    fontSize: 20,
    fontFamily: theme.fonts.fontBold,
    alignSelf: "center",
    textTransform: "capitalize",
  },
  section2Title2: {
    color: theme.color.buttonText,
    fontSize: 16,
    fontFamily: theme.fonts.fontNormal,
    marginTop: 10,
    alignSelf: "center",
  },
  section3: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
    // backgroundColor: 'red',
  },

  logo: {
    width: 54.93,
    height: 50.56,
    resizeMode: "contain",
  },
  title1: {
    fontSize: 16,
    fontFamily: theme.fonts.titleFont,
    color: theme.color.buttonText,
    textTransform: "uppercase",
    lineHeight: 20.9,
  },
  BottomButton: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.color.button1,
    height: 55,
    // height: responsiveHeight(8),
    borderRadius: 10,
    alignSelf: "center",
    marginTop: 25,
  },
  buttonTextBottom: {
    color: theme.color.buttonText,
    fontSize: 16,
    // fontSize: responsiveScreenFontSize(2.15),
    fontFamily: theme.fonts.fontBold,
    textTransform: "capitalize",
  },

  BottomButtonT: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
    justifyContent: "center",
  },
  buttonTextBottomTtitle1: {
    color: theme.color.buttonText,
    fontSize: 14,
    fontFamily: theme.fonts.fontNormal,
    opacity: 0.7,
  },
  buttonTextBottomTtitle2: {
    color: theme.color.buttonText,
    fontSize: 14,
    fontFamily: theme.fonts.fontBold,
    marginLeft: 5,
    textDecorationLine: "underline",
  },

  errorMessageContainer: {},
  errorMessageText: {
    color: theme.color.fieldBordeError,
    fontSize: 13,
    fontFamily: theme.fonts.fontMedium,
    alignSelf: "center",
  },

  errorMessageFieldContainer: {
    marginTop: 2,
  },
  errorMessageFieldText: {
    color: theme.color.fieldBordeError,
    fontSize: 10,
    fontFamily: theme.fonts.fontNormal,
  },

  Field: { marginTop: 15 },
  FieldTitle1: {
    color: theme.color.titleGreenForm,
    fontSize: 12.5,
    fontFamily: theme.fonts.fontBold,
    textTransform: "capitalize",
  },
  FieldInput: {
    width: "100%",
    borderWidth: 1,
    color: theme.color.title,
    height: 45,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  Field2: { marginTop: 25, flexDirection: "row", alignItems: "center" },
  Field2Title: {
    color: "#0E2932",
    fontSize: 13.5,
    fontFamily: theme.fonts.fontMedium,
    textTransform: "capitalize",
    marginLeft: 10,
  },
  Field3: { marginTop: 25, alignItems: "center", justifyContent: "center" },
  Field3Title1: {
    color: theme.color.titleGreenForm,
    fontSize: 13.5,
    fontFamily: theme.fonts.fontBold,
    textTransform: "capitalize",
    textDecorationLine: "underline",
  },

  Field31: {
    marginTop: 25,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  Field31Title1: {
    color: theme.color.titleGreenForm,
    fontSize: 13.5,
    fontFamily: theme.fonts.fontNormal,
  },

  Field31Title2: {
    color: theme.color.titleGreenForm,
    fontSize: 13.5,
    fontFamily: theme.fonts.fontBold,
    textDecorationLine: "underline",
    marginLeft: 5,
  },
});
