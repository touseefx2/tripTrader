import {StyleSheet} from 'react-native';
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
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.6,
    shadowRadius: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
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

  boxSection1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  ProfileImgContainer: {
    width: '32%',
    height: 115,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: theme.color.photoBorderColor,
    marginBottom: 15,
    marginRight: '2%',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  ProfileImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: 10,
  },
  imageLoader: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
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
    color: theme.color.title,
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
    color: theme.color.subTitle,
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
    color: theme.color.title,
    fontSize: 12,
    fontFamily: theme.fonts.fontNormal,
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

  crossContainer: {
    width: 22,
    height: 22,
    borderRadius: 22 / 2,

    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    backgroundColor: theme.color.background,
    right: 3,
    top: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },

  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modal: {
    width: '90%',
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
  modalCross: {
    position: 'absolute',
    top: 17,
    right: 15,
  },
  modalTitle: {
    fontSize: 19,
    color: theme.color.title,
    fontFamily: theme.fonts.fontBold,
    alignSelf: 'center',
    textTransform: 'capitalize',
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
  },
  modalBottomTitle: {
    fontSize: 12,
    color: theme.color.subTitle,
    fontfontFamily: theme.fonts.fontNormal,
    alignSelf: 'center',
  },
  ButtonContainer: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#B93B3B',
    marginTop: 10,
  },
  ButtonText: {
    fontSize: 15,
    color: theme.color.buttonText,
    fontFamily: theme.fonts.fontBold,
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
    padding: 12,
    marginBottom: 15,
  },
  title1Container: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
  },
  title1: {
    fontSize: 16,
    color: '#101B10',
    fontFamily: theme.fonts.fontBold,
    lineHeight: 22.8,
  },
  title11: {
    fontSize: 13,
    color: '#101B10',
    fontFamily: theme.fonts.fontMedium,
    lineHeight: 22.8,
    textTransform: 'capitalize',
  },
  field: {
    marginTop: 12,
    width: '100%',
  },
  filedTitle: {
    fontSize: 12,
    color: theme.color.subTitleLight,
    fontFamily: theme.fonts.fontBold,
    textTransform: 'uppercase',
    lineHeight: 17.2,
  },
  filedTitle2: {
    fontSize: 13,
    color: theme.color.title,
    fontFamily: theme.fonts.fontMedium,
    lineHeight: 18.6,
    textTransform: 'capitalize',
  },
  fieldContainer: {
    marginTop: 12,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    borderRadius: 8,
    backgroundColor: theme.color.button2,
    paddingVertical: 6,
    paddingHorizontal: 18,
  },
  buttonContainer2: {
    borderRadius: 8,
    backgroundColor: theme.color.button2,
    width: '100%',
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 13,
    color: '#30563A',
    fontFamily: theme.fonts.fontBold,
    textTransform: 'capitalize',
  },
  buttonText2: {
    fontSize: 15,
    color: '#30563A',
    fontFamily: theme.fonts.fontBold,
    textTransform: 'capitalize',
  },
});
