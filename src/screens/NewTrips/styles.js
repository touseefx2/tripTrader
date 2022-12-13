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
  Sec: {
    width: '100%',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: theme.color.background,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  fieldContainer: {
    width: '100%',
  },

  fieldText: {
    color: theme.color.titleGreenForm,
    fontFamily: theme.fonts.fontBold,
    fontSize: 14,
  },
  fieldText2: {
    color: '#111111',
    fontFamily: theme.fonts.fontBold,
    fontSize: 15,
  },
  fieldText22: {
    color: '#101B10',
    fontFamily: theme.fonts.fontNormal,
    fontSize: 13.5,
  },

  inputConatiner: {
    width: '100%',
    borderWidth: 1,
    borderColor: theme.color.fieldBorder,
    borderRadius: 8,
    height: 45,
    paddingHorizontal: 7,
  },
  input: {
    width: '100%',
    height: '100%',
  },
  inputIcon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  Field2Title: {
    color: '#0E2932',
    fontSize: 12.5,
    fontFamily: theme.fonts.fontNormal,

    marginLeft: 10,
  },
  bottomText: {
    color: theme.color.button1,
    fontSize: 12.5,
    fontFamily: theme.fonts.fontMedium,
    textDecorationLine: 'underline',
    textDecorationColor: theme.color.button1,
  },
  dropDownText: {
    color: '#111111',
    fontSize: 14,
    fontFamily: theme.fonts.fontNormal,
    textTransform: 'capitalize',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer2: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    width: '100%',

    padding: 15,
    alignSelf: 'center',
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
  umodal: {
    width: '98%',

    paddingTop: 15,
    alignSelf: 'center',
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
  umodal2: {
    width: '98%',

    padding: 15,
    alignSelf: 'center',
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
  rmodal: {
    width: '90%',

    paddingTop: 15,
    alignSelf: 'center',
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
  rmodal2: {
    width: '90%',

    padding: 15,
    alignSelf: 'center',
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
  dmodal: {
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
    top: 15,
    right: 15,
  },
  umodalCross: {
    position: 'absolute',

    right: 0,
  },
  rmodalCross: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
  modalTitle: {
    fontSize: 19,
    color: theme.color.title,
    fontFamily: theme.fonts.fontBold,
  },
  modalsubTitle: {
    fontSize: 13,
    color: theme.color.title,
    fontFamily: theme.fonts.fontNormal,
  },
  rmodalsubTitle: {
    fontSize: 13,
    color: theme.color.title,
    fontFamily: theme.fonts.fontNormal,
  },
  rField: {
    // width: '100%',
  },
  rField2: {
    // width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  rTitle: {
    fontSize: 12,
    color: theme.color.subTitleLight,
    fontFamily: theme.fonts.fontBold,
    textTransform: 'uppercase',
  },
  rTitle2: {
    fontSize: 13,
    color: theme.color.title,
    fontFamily: theme.fonts.fontMedium,
    textTransform: 'capitalize',
    lineHeight: 19,
  },
  modalBottomContainer: {
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
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
  ButtonContainer: {
    paddingHorizontal: 17,
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

  uploadIndication: {
    flexDirection: 'row',
    alignItems: 'center',

    alignSelf: 'center',
  },
  uploadIndicationLogo: {
    width: 130,
    height: 120,
    resizeMode: 'contain',
  },
  section2Title1: {
    color: theme.color.title,
    fontSize: 20,
    fontFamily: theme.fonts.fontBold,
    alignSelf: 'center',
    textTransform: 'capitalize',
  },
  section2Logo: {
    width: 70,
    height: 70,
    marginTop: 10,
    resizeMode: 'contain',
  },
  section2LogoTitle: {
    marginTop: 20,
    color: theme.color.subTitleAuth,
    fontSize: 14,
    fontFamily: theme.fonts.fontNormal,
    textAlign: 'center',
  },
  section2LogoTitlee: {
    marginTop: 20,
    color: theme.color.subTitleAuth,
    fontSize: 15,
    fontFamily: theme.fonts.fontBold,
  },
  BottomButtonP: {
    width: '45%',
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.color.button2,

    // height: responsiveHeight(8),
    borderRadius: 8,
    alignSelf: 'center',

    marginTop: 25,
  },
  buttonPTextBottom: {
    color: '#30563A',
    fontSize: 16,
    fontFamily: theme.fonts.fontBold,
    textTransform: 'capitalize',
  },

  addImgContainer: {
    width: '31%',
    height: 100,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.color.photoBorderColor,
    marginRight: '2.3%',
  },
  addImg: {
    width: '100%',
    height: '100%',
    // resizeMode: 'contain',
    borderRadius: 10,
  },
  imageLoader: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },

  raddImgContainer: {
    width: 60,
    height: 60,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: theme.color.photoBorderColor,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  raddImg: {
    width: '100%',
    height: '100%',
    // resizeMode: 'contain',
    borderRadius: 5,
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

  dmodalTitle: {
    fontSize: 19,
    color: theme.color.title,
    fontFamily: theme.fonts.fontBold,
    alignSelf: 'center',
    textTransform: 'capitalize',
  },
  dmodalImgContainer: {
    width: '100%',
    height: 220,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.color.photoBorderColor,
    marginTop: 15,
  },
  dmodalImg: {
    width: '100%',
    height: '100%',
    // resizeMode: 'contain',
    borderRadius: 8,
  },
  dmodalBottomTitle: {
    fontSize: 12,
    color: theme.color.subTitle,
    fontFamily: theme.fonts.fontNormal,
    alignSelf: 'center',
  },
  dmodalBottomContainer: {
    marginTop: 15,
  },
  dButtonContainer: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#B93B3B',
    marginTop: 10,
  },
  dButtonText: {
    fontSize: 15,
    color: theme.color.buttonText,
    fontFamily: theme.fonts.fontBold,
  },

  BottomButton: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.color.button1,
    height: 50,
    // height: responsiveHeight(8),
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 25,
  },
  buttonTextBottom: {
    color: theme.color.buttonText,
    fontSize: 15,
    // fontSize: responsiveScreenFontSize(2.15),
    fontFamily: theme.fonts.fontBold,
    textTransform: 'capitalize',
  },

  modal11: {
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
  modal22: {
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
  modalContainer22: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
  },
  modalBottomContaine3r: {
    paddingTop: 15,
    paddingBottom: 15,
    paddingHorizontal: 15,
  },
  modalBottomContainer2: {},

  modalBottomContainerrr: {
    marginTop: 20,
  },

  modalContainerg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  dropDowninputConatiner: {
    width: '100%',
    borderWidth: 1,
    borderColor: theme.color.fieldBorder,
    borderRadius: 8,
    height: 45,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropDownIcon: {
    height: 19,
    width: 19,
    resizeMode: 'contain',
  },
  dropDownText2: {
    color: '#111111',
    fontSize: 14,
    fontFamily: theme.fonts.fontNormal,
  },

  BodyTitle: {
    fontSize: 14,

    fontFamily: theme.fonts.fontNormal,
    color: theme.color.title,
  },
  //activity list
  ModalBody: {
    backgroundColor: 'white',
    width: '90%',
    alignSelf: 'center',
    borderRadius: 12,
  },
  ModalBody2: {
    backgroundColor: 'white',
    width: '90%',
    alignSelf: 'center',
    borderRadius: 12,
  },
  Header: {
    paddingVertical: 10,
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    // borderBottomWidth: 0.5,
    // borderColor: theme.colors.textSubtitleColor,
  },
  Headere: {
    paddingVertical: 10,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 1}, // change this for more shadow
    shadowOpacity: 0.1,
    elevation: 1,
    backgroundColor: theme.color.background,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  HeaderText: {
    color: theme.color.title,
    fontSize: 18,
    marginLeft: 10,
    fontFamily: theme.fonts.fontBold,
  },

  BottomButtona: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.color.button1,
    height: 50,
    // height: responsiveHeight(8),
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    alignSelf: 'center',
    marginTop: 40,
  },
  BottomButtonb: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    backgroundColor: theme.color.button1,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: -1}, // change this for more shadow
    shadowOpacity: 0.1,
    elevation: 5,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    marginTop: 10,
  },
  ModalView: {
    width: '100%',
    alignSelf: 'center',
    paddingTop: 10,

    paddingHorizontal: 10,
  },

  FeaturesView: {
    borderColor: theme.color.fieldBorder,
    borderWidth: 1,
    borderRadius: 20,
    marginRight: 10,
    marginTop: 5,
    paddingHorizontal: 5,
    backgroundColor: theme.color.button2,
  },
  AddedFeaturesView: {
    borderColor: theme.color.fieldBorder,
    borderWidth: 1,
    marginRight: 10,
    marginTop: 5,
    paddingHorizontal: 5,
    backgroundColor: theme.color.button1,

    borderRadius: 20,
  },
  AddedFeatures: {
    color: '#fff',
    padding: 5,
    fontFamily: theme.fonts.fontNormal,
    fontSize: 14,
    textTransform: 'capitalize',
  },
  Features: {
    color: '#000',
    padding: 5,
    fontFamily: theme.fonts.fontNormal,
    fontSize: 14,
    textTransform: 'capitalize',
  },
  samt: {
    fontSize: 15,
    color: theme.color.title,
    fontFamily: theme.fonts.fontBold,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
});
