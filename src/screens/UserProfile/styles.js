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
    top: -2,
  },
  profileSecConatiner: {
    marginTop: 60,
    // height: 140,
    paddingBottom: 10,
    width: '100%',
    backgroundColor: theme.color.background,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
    alignItems: 'center',
    borderColor: '#D8E1DB',
    borderRadius: 10,
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
  profileImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100 / 2,
    width: 100,
    height: 100,
    borderWidth: 2,
    borderColor: theme.color.photoBorderColor,
    marginTop: -50,
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
    width: 50,
    height: 50,
    elevation: 3,
  },
  editImgConatiner: {
    width: 35,
    paddingVertical: 7,
    alignItems: 'flex-end',
    // backgroundColor: 'red',
  },
  editImg: {
    width: 21,
    height: 5,
    resizeMode: 'contain',
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
    width: '85%',
    // backgroundColor: 'red',
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
  },
  profileTitle2Conatiner1: {
    alignItems: 'center',
    justifyContent: 'center',

    // backgroundColor: 'blue',
  },
  profileTitle2Conatinerm: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    paddingHorizontal: 25,
    paddingVertical: 5,
    backgroundColor: '#3C6B49',
  },
  profileTitle2Conatiner2: {
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'blue',
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
    textAlign: 'center',
  },
  profileTitle2ConatinerTitle2m: {
    fontSize: 13,
    fontFamily: theme.fonts.fontBold,
    color: theme.color.buttonText,

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

    marginTop: 12,
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
    color: theme.color.subTitleAuth,
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

    borderWidth: 2,
    borderColor: theme.color.photoBorderColor,
  },
  imageP: {
    width: '100%',
    height: '100%',
    borderRadius: 110 / 2,

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
    width: '100%',
    alignSelf: 'center',
    paddingTop: 0,
    backgroundColor: theme.color.background,
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
  modal2: {
    // width: Platform.OS == 'android' ? '98%' : '88%',
    width: '100%',
    alignSelf: 'center',
    padding: 15,
    backgroundColor: theme.color.background,
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
  modalCross: {
    position: 'absolute',
    right: 0,
  },
  modalTitle: {
    fontSize: 19,
    color: theme.color.title,
    fontFamily: theme.fonts.fontBold,
  },
  modalFieldConatiner: {
    width: '100%',
    marginTop: 10,
  },

  mfT1: {
    fontSize: 12,
    color: theme.color.title,
    fontFamily: theme.fonts.fontBold,
    textTransform: 'capitalize',
    lineHeight: 19,
  },

  mFieldContainer: {
    marginTop: 5,
    width: '100%',
    height: 42,
    padding: 10,
    borderRadius: 8,
    borderColor: theme.color.fieldBorder,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mfT2: {
    fontSize: 12,
    color: theme.color.title,
    fontFamily: theme.fonts.fontNormal,
    lineHeight: 19,
    width: '85%',
  },
  mfT2icon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  mT1: {
    fontSize: 14,
    color: theme.color.subTitle,
    fontFamily: theme.fonts.fontNormal,
  },
  mT2: {
    fontSize: 14.5,
    color: theme.color.boxTitle,
    fontFamily: theme.fonts.fontBold,
    lineHeight: 22.5,
    textTransform: 'capitalize',
    width: '81%',
  },
  mProfileImgContainerm: {
    width: 35,
    height: 35,
    borderRadius: 35 / 2,
    borderWidth: 1,
    borderColor: theme.color.photoBorderColor,
  },
  mProfileImgm: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: 35 / 2,
  },

  ButtonContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.color.button1,
  },
  ButtonText: {
    fontSize: 12.5,
    color: theme.color.buttonText,
    fontFamily: theme.fonts.fontBold,
    textTransform: 'capitalize',
  },
  modalBottomContainerrr: {
    marginTop: 20,
  },
  textArea: {
    width: '100%',
    height: 200,
    backgroundColor: '#FAFAFA',
    borderRadius: 4,
    marginTop: 12,

    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 5,
  },
  mTextInpt: {
    height: '100%',
    paddingHorizontal: 15,
    textAlignVertical: 'top',
  },

  mProfileImgContainerss: {
    // borderWidth: 2,
    borderColor: theme.color.fieldBorder,
    width: 80,
    height: 80,
    borderRadius: 80 / 2,
    borderWidth: 1,
    borderColor: theme.color.fieldBc,

    // alignItems: 'center',
    // justifyContent: 'center',
  },

  mProfileImgContainer: {
    // borderWidth: 2,
    borderColor: theme.color.fieldBorder,
    width: 48,
    height: 48,
    borderRadius: 48 / 2,
    top: 5,

    // alignItems: 'center',
    // justifyContent: 'center',
  },
  mProfileImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: 48 / 2,
  },

  mProfileImgss: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: 80 / 2,
  },

  mimageLoader: {
    height: '100%',
    width: '100%',
    // resizeMode: 'contain',
    borderRadius: 80 / 2,
  },

  mProfileImgContainer2: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mProfileImg2: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },

  modalinfoConatiner: {
    width: '100%',
    borderRadius: 10,

    // marginTop: 10,

    paddingVertical: 15,
    paddingHorizontal: 10,

    // borderRadius: 10,

    // alignItems: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    backgroundColor: theme.color.background,
  },
  modalinfoConatiner2: {
    width: '100%',
    marginTop: 10,
    padding: 10,
    borderRadius: 8,

    backgroundColor: '#F5F5F5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rmodalBottomContainer: {
    paddingTop: 10,
    paddingBottom: 15,
    paddingHorizontal: 15,

    flexDirection: 'row',
    alignItems: 'center',
  },
  rmodalBottomContainer2: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalBottomContainer: {
    paddingTop: 10,
    paddingBottom: 15,
    paddingHorizontal: 15,
    // flexDirection: 'row',
    // alignItems: 'center',
    // justifyContent: 'space-between',
  },
  modalBottomContainer2: {
    // flexDirection: 'row',
    // alignItems: 'center',
    // justifyContent: 'space-between',
  },
});
