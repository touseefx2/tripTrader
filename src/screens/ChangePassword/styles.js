import { StyleSheet } from "react-native";
import theme from "../../theme/index";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";

let iconContainerColor = theme.color.button2;
let textColor = "#30563A";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.backgroundGreen,
  },
  container2: {
    flex: 1,
    backgroundColor: theme.color.background,
  },
  container3: {
    flex: 1,
    backgroundColor: theme.color.backgroundConatiner,
  },
  headerConatainer: {
    backgroundColor: theme.color.backgroundGreen,
    paddingHorizontal: 15,
    paddingVertical: 15,
    elevation: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.6,
    shadowRadius: 1,
  },
  locContainer: {
    width: "70%",
    flexDirection: "row",
    // justifyContent: 'space-between',
    backgroundColor: "white",
  },
  locText: {
    fontSize: 14,
    color: theme.color.title,
    fontFamily: theme.fonts.fontMedium,
    lineHeight: 18,
    textTransform: "capitalize",
  },
  locText2: {
    fontSize: 12,
    color: theme.color.title,
    fontFamily: theme.fonts.fontNormal,
    lineHeight: 18,
    textTransform: "capitalize",
  },
  boxContainer: {
    width: "100%",
    height: responsiveHeight(20),
    backgroundColor: "#FFC5B2",
    borderRadius: 8,
    marginBottom: 20,
    elevation: 1,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  boxContainer2: {
    width: "100%",
    height: responsiveHeight(20),
    backgroundColor: "#FEF0C0",
    borderRadius: 8,
    marginBottom: 20,
    elevation: 1,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  boxContainerSecton1: {
    width: "55%",

    justifyContent: "flex-end",
  },

  boxContainerSecton2: {
    width: "40%",

    alignItems: "center",
    justifyContent: "center",
  },

  bcs1Text1: {
    fontSize: 16,
    fontFamily: theme.fonts.fontMedium,
    color: theme.color.title,
  },

  bcs1Text2: {
    fontSize: 13,
    fontFamily: theme.fonts.fontNormal,
    color: theme.color.title,
  },
  bcs2Image: { flex: 1, resizeMode: "contain", elevation: 5 },
  circleC: {
    width: 18,
    height: 18,
    borderRadius: 218 / 2,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.color.buttonText,
    position: "absolute",
    right: -7,
    bottom: -1,
    backgroundColor: theme.color.button1,
  },
  circleCText: {
    fontSize: 8,
    color: theme.color.buttonText,
    fontFamily: theme.fonts.fontMedium,
    top: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.fontBold,
    color: theme.color.backgroundGreenText,
    top: -2,
  },

  mainContainer: {
    width: "100%",
    padding: 7,
    borderRadius: 5,
    backgroundColor: theme.color.background,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
    marginBottom: 15,
  },
  sec1Container: {
    width: "15%",
  },
  iconConatiner: {
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
    backgroundColor: iconContainerColor,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: "44%",
    height: "44%",
    resizeMode: "contain",
  },
  sec2Container: {
    width: "83%",
  },
  sec2Title: {
    fontSize: 16,
    color: textColor,
    fontFamily: theme.fonts.fontBold,
    lineHeight: 22.8,
    textTransform: "capitalize",
  },
  section2: {},
  section2Title1: {
    color: theme.color.titleGreenForm,
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
    height: 50,
    // height: responsiveHeight(8),
    borderRadius: 10,
    alignSelf: "center",
    marginTop: 35,
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
    marginTop: 20,
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
    fontSize: 11,
    fontFamily: theme.fonts.fontNormal,
  },

  Field: { marginTop: 15 },
  FieldTitle1: {
    color: theme.color.titleGreenForm,
    fontSize: 12.5,
    fontFamily: theme.fonts.fontBold,
    textTransform: "capitalize",
  },
  FieldTitle11: {
    color: theme.color.titleGreenForm,
    fontSize: 14,
    fontFamily: theme.fonts.fontBold,

    textDecorationLine: "underline",
    alignSelf: "center",
    textDecorationColor: theme.color.titleGreenForm,
  },
  FieldInput: {
    width: "100%",
    borderWidth: 1,
    height: responsiveHeight(6.3),
    paddingVertical: 2,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: theme.color.background,
  },
  Field2: { marginTop: 20, flexDirection: "row", alignItems: "center" },
  Field2Title: {
    color: theme.color.titleGreen,
    fontSize: 13.5,
    fontFamily: theme.fonts.fontMedium,
    textTransform: "capitalize",
    marginLeft: 10,
  },
  Field3: { marginTop: 20, alignItems: "center", justifyContent: "center" },
  Field3Title1: {
    color: theme.color.titleGreen,
    fontSize: 13.5,
    fontFamily: theme.fonts.fontBold,
    textTransform: "capitalize",
    textDecorationLine: "underline",
  },

  Field31: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  Field31Title1: {
    color: theme.color.titleGreen,
    fontSize: 13.5,
    fontFamily: theme.fonts.fontNormal,
  },

  Field31Title2: {
    color: theme.color.titleGreen,
    fontSize: 13,
    fontFamily: theme.fonts.fontBold,
  },
  section2LogoTitle: {
    marginTop: 20,
    color: theme.color.title,
    fontSize: 14,
    fontFamily: theme.fonts.fontNormal,
    alignSelf: "center",
  },

  phoneInputContainer: {
    width: "100%",
    marginTop: 5,

    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: theme.color.fieldBorder,
    paddingHorizontal: 10,
    alignItems: "center", //for ios
    justifyContent: "center", //for ios
  },
});
