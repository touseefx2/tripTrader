import {Platform, StyleSheet} from 'react-native';
import theme from '../../theme/index';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';
let aph = theme.window.APPBAR_HEIGHT + (Platform.OS == 'ios' ? 12 : 0);

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.backgroundGreen,
  },
  container2: {
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    width: theme.window.Width,
    height: theme.window.Height,
  },
  container3: {
    flex: 1,
  },

  section1: {alignItems: 'center', justifyContent: 'center'},
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
    alignSelf: 'center',
    textTransform: 'capitalize',
    marginTop: 15,
  },
  section2Title2: {
    color: theme.color.buttonText,
    fontSize: 16,
    fontFamily: theme.fonts.fontNormal,
    marginTop: 10,
    alignSelf: 'center',
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
    resizeMode: 'contain',
  },
  title1: {
    fontSize: 16,
    fontFamily: theme.fonts.titleFont,
    color: theme.color.buttonText,
    textTransform: 'uppercase',
    lineHeight: 20.9,
  },
  BottomButton: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.color.button1,
    height: 55,
    // height: responsiveHeight(8),
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 25,
  },
  buttonTextBottom: {
    color: theme.color.buttonText,
    fontSize: 16,
    // fontSize: responsiveScreenFontSize(2.15),
    fontFamily: theme.fonts.fontBold,
    textTransform: 'capitalize',
  },
  BottomButtonT: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 25,
    justifyContent: 'center',
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
    textDecorationLine: 'underline',
  },

  errorMessageContainer: {},
  errorMessageText: {
    color: theme.color.fieldBordeError,
    fontSize: 13,
    fontFamily: theme.fonts.fontMedium,
    alignSelf: 'center',
  },

  section2Logo: {
    width: 70,
    height: 70,
  },
  section2LogoTitle: {
    marginTop: 15,
    color: theme.color.subTitleAuth,
    fontSize: 14,
    fontFamily: theme.fonts.fontNormal,
    letterSpacing: 0.02,
    textAlign: 'center',
  },
  section2bottomTitle: {
    marginTop: 20,
    color: theme.color.subTitle,
    fontSize: 13,
    fontFamily: theme.fonts.fontNormal,
    alignSelf: 'center',
  },

  errorMessageFieldContainer: {
    marginTop: 4,
  },
  errorMessageFieldText: {
    color: theme.color.fieldBordeError,
    fontSize: 11,
    fontFamily: theme.fonts.fontNormal,
  },

  Field: {marginTop: 12},
  FieldTitle1: {
    color: theme.color.titleGreen,
    fontSize: 12.5,
    fontFamily: theme.fonts.fontBold,
    textTransform: 'capitalize',
  },
  FieldInput: {
    width: '100%',
    borderWidth: 0.5,
    height: 45,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginTop: 5,
  },
  Field2: {flexDirection: 'row', alignItems: 'center'},
  Field2Title: {
    color: theme.color.titleGreen,
    fontSize: 13,
    fontFamily: theme.fonts.fontNormal,
    // textTransform: 'capitalize',
    marginLeft: 10,
  },
  Field3: {marginTop: 20, alignItems: 'center', justifyContent: 'center'},
  Field3Title1: {
    color: '#30563A',
    fontSize: 13,
    fontFamily: theme.fonts.fontBold,
    textDecorationLine: 'underline',
  },

  Field31: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  Field31Title1: {
    color: theme.color.titleGreen,
    fontSize: 13.5,
    fontFamily: theme.fonts.fontNormal,
  },

  Field31Title2: {
    color: theme.color.titleGreen,
    fontSize: 13.5,
    fontFamily: theme.fonts.fontBold,
    textDecorationLine: 'underline',
    marginLeft: 5,
  },

  joinFieldContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  DateTextPlaceholder: {
    color: theme.color.subTitle,
    fontFamily: theme.fonts.fontNormal,
  },
  DateText: {
    color: theme.color.title,
    fontFamily: theme.fonts.fontNormal,
  },
  CNICModal: {
    backgroundColor: '#fff',
    width: '95%',
    alignSelf: 'center',
  },
  CNICModalHeader: {
    height: 64,
    backgroundColor: theme.color.button1,
    justifyContent: 'space-between',
    paddingHorizontal: responsiveWidth(10),
    alignItems: 'center',
    flexDirection: 'row',
  },
  CNICModalHeaderText: {
    color: '#fff',
    fontSize: 16,
    alignSelf: 'center',
    fontFamily: theme.fonts.fontNormal,
  },

  uploadIndication: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
    alignSelf: 'center',
  },
  uploadIndicationLogo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },

  imageContainer: {
    marginTop: 20,
    width: '85%',
    height: responsiveHeight(18),
    alignSelf: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderWidth: 0.5,
    borderColor: theme.color.button1,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },

  section2LogoC: {
    width: 200,
    height: 190,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section2LogoCImg1: {
    width: '100%',
    height: '100%',
    marginTop: 10,
  },
  section2LogoCImg2: {
    width: 70,
    height: 70,
    position: 'absolute',
  },
  section2LogoTitle1c: {
    marginTop: 20,
    color: theme.color.title,
    fontSize: 14,
    fontFamily: theme.fonts.fontBold,
    alignSelf: 'center',
  },
  section2LogoTitle2c: {
    color: theme.color.subTitle,
    fontSize: 14,
    fontFamily: theme.fonts.fontNormal,
    alignSelf: 'center',
  },
});
