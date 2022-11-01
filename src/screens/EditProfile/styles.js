import {StyleSheet} from 'react-native';
import theme from '../../theme/index';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

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
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.6,
    shadowRadius: 1,
  },
  locContainer: {
    width: '70%',
    flexDirection: 'row',
    // justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  locText: {
    fontSize: 14,
    color: theme.color.title,
    fontFamily: theme.fonts.fontMedium,
    lineHeight: 18,
    textTransform: 'capitalize',
  },
  locText2: {
    fontSize: 12,
    color: theme.color.title,
    fontFamily: theme.fonts.fontNormal,
    lineHeight: 18,
    textTransform: 'capitalize',
  },
  boxContainer: {
    width: '100%',
    height: responsiveHeight(20),
    backgroundColor: '#FFC5B2',
    borderRadius: 8,
    marginBottom: 20,
    elevation: 1,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  boxContainer2: {
    width: '100%',
    height: responsiveHeight(20),
    backgroundColor: '#FEF0C0',
    borderRadius: 8,
    marginBottom: 20,
    elevation: 1,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  boxContainerSecton1: {
    width: '55%',

    justifyContent: 'flex-end',
  },

  boxContainerSecton2: {
    width: '40%',

    alignItems: 'center',
    justifyContent: 'center',
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
  bcs2Image: {flex: 1, resizeMode: 'contain', elevation: 5},
  circleC: {
    width: 18,
    height: 18,
    borderRadius: 218 / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.color.photoBorderColor,
    position: 'absolute',
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
  },
  profileSecConatiner: {
    marginTop: 15,
    alignSelf: 'center',
  },
  profileImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100 / 2,
    width: 100,
    height: 100,
    borderWidth: 2,
    borderColor: theme.color.photoBorderColor,
  },
  ProfileImg: {
    width: '100%',
    height: '100%',

    borderRadius: 100 / 2,
  },
  changeImgContainer: {
    position: 'absolute',
    right: -20,
    bottom: 0,
  },
  changeImg: {
    width: 45,
    height: 45,
    elevation: 3,
  },
  editImgConatiner: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  editImg: {
    width: 19,
    height: 19,
    elevation: 3,
  },
  TextSecConatiner: {
    marginTop: 10,
    width: '100%',
    paddingHorizontal: 15,

    alignItems: 'center',
    justifyContent: 'center',
  },
  profileTitleConatiner: {
    width: '90%',

    alignItems: 'center',
    justifyContent: 'center',
  },
  profileTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.fontBold,
    color: theme.color.title,
    lineHeight: 23,
    textTransform: 'capitalize',
  },
  profileTitle2Conatiner: {
    width: '100%',

    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileTitle2Conatiner1: {
    width: '46%',
    alignItems: 'flex-end',
  },
  profileTitle2Conatiner2: {
    width: '46%',
    alignItems: 'flex-start',
  },
  profileTitle2ConatinerTitle: {
    fontSize: 14,
    fontFamily: theme.fonts.fontMedium,
    color: theme.color.subTitle,
    lineHeight: 20,
    textTransform: 'capitalize',
  },
  profileTitle2ConatinerTitle2: {
    fontSize: 15,
    fontFamily: theme.fonts.fontBold,
    color: theme.color.titleGreen,
    lineHeight: 20,
    textTransform: 'capitalize',
  },

  section2Title1: {
    color: theme.color.title,
    fontSize: 20,
    fontFamily: theme.fonts.fontBold,
    alignSelf: 'center',
    textTransform: 'capitalize',
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
    width: 55,
    height: 55,
    resizeMode: 'contain',
  },
  title1: {
    fontSize: 16,
    fontFamily: theme.fonts.fontBold,
    color: theme.color.buttonText,
    textTransform: 'uppercase',
    marginTop: 5,
  },

  BottomButtonT: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
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
    marginTop: 10,
  },
  section2LogoTitle: {
    marginTop: 20,
    color: theme.color.subTitle,
    fontSize: 14,
    fontFamily: theme.fonts.fontNormal,
    alignSelf: 'center',
    // textAlign: 'center',
  },
  section2bottomTitle: {
    marginTop: 20,
    color: theme.color.subTitle,
    fontSize: 13,
    fontFamily: theme.fonts.fontMedium,
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

  section1: {alignItems: 'center', justifyContent: 'center'},
  section2: {
    marginTop: 20,
  },
  section2Title1: {
    color: theme.color.title,
    fontSize: 20,
    fontFamily: theme.fonts.fontBold,
    alignSelf: 'center',
    textTransform: 'capitalize',
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
    width: 55,
    height: 55,
    resizeMode: 'contain',
  },
  title1: {
    fontSize: 16,
    fontFamily: theme.fonts.fontBold,
    color: theme.color.buttonText,
    textTransform: 'uppercase',
    marginTop: 5,
  },
  BottomButton: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.color.button1,
    height: 50,
    borderRadius: 10,
    alignSelf: 'center',
  },
  buttonTextBottom: {
    color: theme.color.buttonText,
    fontSize: 16,
    fontFamily: theme.fonts.fontBold,

    textTransform: 'capitalize',
  },

  BottomButtonT: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
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
    marginTop: 10,
  },
  section2LogoTitle: {
    marginTop: 20,
    color: theme.color.subTitle,
    fontSize: 14,
    fontFamily: theme.fonts.fontNormal,
    alignSelf: 'center',
    textAlign: 'center',
  },
  section2bottomTitle: {
    marginTop: 20,
    color: theme.color.subTitle,
    fontSize: 13,
    fontFamily: theme.fonts.fontMedium,
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
    color: theme.color.titleGreenForm,
    fontSize: 12.5,
    fontFamily: theme.fonts.fontBold,
    textTransform: 'capitalize',
  },
  FieldInput: {
    width: '100%',
    paddingHorizontal: 10,
    borderWidth: 0.5,
    height: 45,
    borderRadius: 8,
    marginTop: 5,
    backgroundColor: theme.color.fieldBc,
  },
  FieldInputCard: {
    borderWidth: 0.5,

    borderRadius: 8,
    marginTop: 5,
  },

  phoneInputContainer: {
    width: '100%',
    marginTop: 5,
    backgroundColor: theme.color.background,
    // height: 45,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: theme.color.fieldBorder,
    paddingHorizontal: 10,
    alignItems: 'center', //for ios
    justifyContent: 'center', //for ios
  },
  Field2: {flexDirection: 'row'},
  Field2Title: {
    color: theme.color.titleGreen,
    fontSize: 13,
    fontFamily: theme.fonts.fontNormal,
    // textTransform: 'capitalize',
    marginLeft: 10,
  },

  Field2c: {},
  Field2Titlec: {
    color: theme.color.subTitle,
    fontSize: 12,
    fontFamily: theme.fonts.fontNormal,
    // textTransform: 'capitalize',
  },

  Field2Titlecc: {
    color: theme.color.titleGreen,
    fontSize: 12,
    fontFamily: theme.fonts.fontMedium,
    textDecorationLine: 'underline',
    // textTransform: 'capitalize',
  },

  Field3: {marginTop: 20, alignItems: 'center', justifyContent: 'center'},
  Field3Title1: {
    color: theme.color.titleGreen,
    fontSize: 13.5,
    fontFamily: theme.fonts.fontBold,
    textTransform: 'capitalize',
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
    fontFamily: 'Inter-Regular',
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

  imageContainerP: {
    marginTop: 20,
    width: 110,
    height: 110,
    borderRadius: 110 / 2,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    resizeMode: 'contain',
    borderWidth: 2,
    borderColor: theme.color.photoBorderColor,
  },
  imageP: {
    width: '100%',
    height: '100%',
    borderRadius: 110 / 2,
    resizeMode: 'contain',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
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
    borderWidth: 2,
    borderColor: theme.color.photoBorderColor,
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

  paymenttitle1: {
    color: theme.color.subTitle,
    fontSize: 11,
    fontFamily: theme.fonts.fontBold,
    textTransform: 'capitalize',
    width: '30%',
  },

  paymenttitle2: {
    color: theme.color.subTitle,
    fontSize: 11,
    fontFamily: theme.fonts.fontBold,
    textTransform: 'capitalize',
  },
  idCardContainer: {
    width: '100%',
    borderRadius: 10,
    // height: 140,
    borderColor: '#0E2932',
    borderWidth: 1,
    borderStyle: 'dashed',
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.color.fieldBc,
    height: responsiveHeight(19),
  },
  idCardContainerText: {
    color: theme.color.subTitle,
    fontSize: 13,
    fontFamily: theme.fonts.fontMedium,
  },
  idCardContainerImage: {
    width: '100%',
    height: '100%',
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

  idCardChangeText1: {
    color: theme.color.button1,
    fontSize: 12,
    fontFamily: theme.fonts.fontNormal,
    textDecorationLine: 'underline',
  },
  idCardChangeText2: {
    color: theme.color.title,
    fontSize: 12,
    fontFamily: theme.fonts.fontNormal,
  },

  idCardChangeTextV: {
    color: '#101B10',
    fontSize: 14,
    fontFamily: theme.fonts.fontBold,
    marginLeft: 5,
  },
});
