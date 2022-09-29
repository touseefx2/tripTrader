import {Platform, StyleSheet} from 'react-native';
import theme from '../../../theme/index';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.backgroundConatiner,
    // marginTop: 10,
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
    top: -2,
  },
  profileSecConatiner: {
    marginTop: 60,
    // height: 140,
    paddingBottom: 15,
    width: '100%',
    backgroundColor: theme.color.background,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
    alignItems: 'center',
  },

  tabBarConatiner: {
    marginTop: 15,
    width: '100%',
    backgroundColor: theme.color.background,
    borderRadius: 10,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  tabBarOptionConatiner: {
    borderRadius: 5,
    backgroundColor: theme.color.button1,
    width: '32%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 39,
  },
  tabBarOptionText: {
    fontSize: 14,
    fontFamily: theme.fonts.fontBold,
    color: theme.color.buttonText,
    textTransform: 'capitalize',
  },

  changeImgContainer: {
    position: 'absolute',
    right: -20,
    bottom: 0,
  },
  changeImg: {
    width: 50,
    height: 50,
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
  BottomButton: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.color.button1,
    height: 50,
    borderRadius: 10,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    marginTop: 25,
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

  Field: {marginTop: 12},
  FieldTitle1: {
    color: theme.color.titleGreen,
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
  },
  FieldInputCard: {
    borderWidth: 0.5,

    borderRadius: 8,
    marginTop: 5,
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
    borderWidth: 0.5,
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

  boxContainer: {
    width: '99%',
    alignSelf: 'center',
    borderRadius: 10,
    backgroundColor: theme.color.background,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
    paddingHorizontal: 9,
    paddingVertical: 12,
  },
  boxSection1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  ProfileImgContainer: {
    width: 48,
    height: 48,
    borderRadius: 48 / 2,
    borderWidth: 1,
    borderColor: theme.color.photoBorderColor,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  ProfileImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: 48 / 2,
  },
  imageLoader: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
    borderRadius: 48 / 2,
  },

  textContainer: {
    width: '55%',
    // backgroundColor: 'red',
    top: 5,
  },
  textContainertitle: {
    color: theme.color.titleGreen,
    fontSize: 15,
    fontFamily: theme.fonts.fontBold,
    textTransform: 'capitalize',
    lineHeight: 20,
  },
  textContainerRatetitle1: {
    color: theme.color.boxTitle,
    fontSize: 13,
    fontFamily: theme.fonts.fontBold,
    textTransform: 'capitalize',
    top: -2,
  },
  textContainerRatetitle2: {
    color: theme.color.subTitleLight,
    fontSize: 13,
    fontFamily: theme.fonts.fontMedium,
    textDecorationLine: 'underline',
    top: -2,
  },

  dateContainer: {
    width: '26%',
    // backgroundColor: 'red',
    alignItems: 'flex-end',
    top: 5,
  },
  dateContainerTitle: {
    color: '#717171',
    fontSize: 12,
    fontFamily: theme.fonts.fontMedium,
    textTransform: 'capitalize',
  },
  boxSection2: {
    marginTop: 15,
    // backgroundColor: 'red',
    width: '100%',
  },
  boxSection2title: {
    color: '#313131',
    fontSize: 12,
    fontFamily: theme.fonts.fontMedium,
  },
  boxSection3: {
    marginTop: 15,
    // backgroundColor: 'red',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },

  rBoxContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  repBoxContainer: {
    width: '86%',

    borderRadius: 10,
    backgroundColor: theme.color.background,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    paddingHorizontal: 9,
    paddingVertical: 12,
    right: 5,
    top: 15,
    marginBottom: 15,
  },
  repBoxTitile1: {
    color: theme.color.subTitle,
    fontSize: 12,
    fontFamily: theme.fonts.fontMedium,
  },
  repBoxTitile2: {
    color: theme.color.title,
    fontSize: 12,
    fontFamily: theme.fonts.fontNormal,
    marginTop: 5,
  },
  repBoxButtonConainer: {
    marginTop: 5,
    // backgroundColor: 'red',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },

  smallButtonContainer: {
    borderRadius: 5,
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: theme.color.button1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sb1Text: {
    color: theme.color.buttonText,
    fontFamily: theme.fonts.fontBold,
    fontSize: 11.5,
    textTransform: 'capitalize',
  },
  sb2Text: {
    color: theme.color.subTitle,
    fontFamily: theme.fonts.fontBold,
    fontSize: 11.5,
    textTransform: 'capitalize',
  },

  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer2: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
  },
  modal: {
    // width: Platform.OS == 'android' ? '98%' : '88%',
    width: '98%',
    alignSelf: 'center',
    padding: 15,
    backgroundColor: theme.color.background,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  modalCross: {},
  modalTitle: {
    fontSize: 19,
    color: theme.color.title,
    fontFamily: theme.fonts.fontBold,
  },
  modalImgContainer: {
    width: '100%',
    height: 220,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.color.photoBorderColor,
    marginTop: 15,
  },
  modalImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: 8,
  },
  modalImageLoader: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  modalBottomContainer: {
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },

  ButtonContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.color.button1,
    marginTop: 10,
  },
  ButtonText: {
    fontSize: 12.5,
    color: theme.color.buttonText,
    fontFamily: theme.fonts.fontBold,
    textTransform: 'capitalize',
  },

  modalFieldTitle: {
    fontSize: 13.5,
    color: theme.color.title,
    fontFamily: theme.fonts.fontBold,
    textTransform: 'capitalize',
  },
  modalInput: {
    width: '100%',
    height: 170,
    padding: 10,
    borderColor: theme.color.subTitleLight,
    borderWidth: 0.6,
    color: theme.color.title,
    fontSize: 13,
    borderRadius: 8,
  },
  modalSec1Title: {
    fontSize: 12,
    color: theme.color.title,
    fontFamily: theme.fonts.fontBold,
    lineHeight: 18,
  },
  modalSec2Container: {
    marginTop: 15,
    width: '100%',
    height: 120,
    borderWidth: 0.6,
    borderRadius: 5,
    borderColor: theme.color.subTitleLight,
    paddingHorizontal: 7,
    paddingVertical: 5,
  },
  modalSec2Title: {
    fontSize: 11,
    color: '#111111',
    fontFamily: theme.fonts.fontBold,
    textTransform: 'capitalize',
    opacity: 0.8,
  },
  modalSec2Title2: {
    fontSize: 11,
    color: '#111111',
    opacity: 0.8,
    fontFamily: theme.fonts.fontNormal,
  },

  modalDeleteTitle: {
    fontSize: 13,
    color: theme.color.title,
    fontFamily: theme.fonts.fontNormal,
  },
  disputeTitle: {
    fontSize: 12,
    color: '#B93B3B',
    fontFamily: theme.fonts.fontMedium,
    marginLeft: 5,
    top: 2,
  },
  iconVerify: {
    width: 22,
    height: 22,
    position: 'absolute',
    resizeMode: 'contain',
    bottom: -6,
    right: -7,
  },
});
