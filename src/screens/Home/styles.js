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

  headerTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.fontBold,
    color: theme.color.backgroundGreenText,
    top: -2,
  },
  SerchBarContainer: {
    width: '100%',
    height: 48,
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    backgroundColor: theme.color.background,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    borderWidth: 1,
    borderColor: theme.color.fieldBorder,
  },
  SerchBarInput: {
    width: '100%',
    height: '100%',
    fontFamily: theme.fonts.fontNormal,
  },
  Baricon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  resultContainer: {
    marginTop: 10,
    marginLeft: 5,
  },
  resultText: {
    fontSize: 13,
    color: theme.color.title,
    fontFamily: theme.fonts.fontMedium,
    opacity: 0.4,
  },
  emptyListStyle: {
    marginTop: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    fontSize: 13,
    color: theme.color.title,
    fontFamily: theme.fonts.fontMedium,
    opacity: 0.4,
  },
  emptyListIndicator: {
    marginTop: '80%',

    alignSelf: 'center',
  },
  emptyListIndicatora: {
    top: '50%',
    position: 'absolute',
    alignSelf: 'center',
  },

  boxContainer: {
    width: '100%',
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

    paddingVertical: 12,
  },
  boxSection1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  ProfileImgContainer: {
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
    borderWidth: 1,
    borderColor: theme.color.photoBorderColor,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  ProfileImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: 40 / 2,
  },

  imageLoader: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
    borderRadius: 40 / 2,
  },

  imageLoader2: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },

  textContainer: {
    width: '68%',
    // backgroundColor: 'red',
    top: 5,
  },
  mtextContainer: {
    width: '78%',
    // backgroundColor: 'red',
    top: 3,
  },
  textContainertitle: {
    color: theme.color.titleGreen,
    fontSize: 15,
    fontFamily: theme.fonts.fontBold,
    textTransform: 'capitalize',
    lineHeight: 20,
  },
  mtextContainertitle: {
    color: theme.color.title,
    fontSize: 15,
    fontFamily: theme.fonts.fontBold,

    lineHeight: 23,
  },
  textContainertitle2: {
    color: theme.color.boxTitle,
    fontSize: 11,
    fontFamily: theme.fonts.fontMedium,

    lineHeight: 18,
  },
  textContainertitle3: {
    color: theme.color.title,
    fontSize: 11,
    fontFamily: theme.fonts.fontNormal,

    lineHeight: 18,
    opacity: 0.6,
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

  iconContainer: {
    width: '12%',
    alignItems: 'flex-end',
  },
  iconSave: {
    position: 'absolute',
    // flex: 1,
    width: 27,
    height: 32,
    bottom: -20,
    resizeMode: 'contain',
  },
  iconVerify: {
    position: 'absolute',
    // flex: 1,
    width: 22,
    height: 22,
    position: 'absolute',
    resizeMode: 'contain',
    bottom: -7,
    right: -7,
  },
  boxSection2: {
    marginTop: 10,
  },
  tripImageConatiner: {
    width: '100%',
    height: 245,

    borderTopWidth: 0.8,
    borderBottomWidth: 0.8,
    borderColor: theme.color.fieldBorder,
  },
  tripImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  boxSection3: {
    marginTop: 12,
    paddingHorizontal: 10,
    width: '100%',
  },
  sec3T1: {
    color: theme.color.boxTitle,
    fontSize: 15,
    fontFamily: theme.fonts.fontBold,
    lineHeight: 21.8,
  },
  sec3T2Container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  sec3Icon: {
    width: 11,
    height: 15,
    resizeMode: 'contain',
  },
  sec3T2: {
    color: theme.color.button1,
    fontSize: 12,
    fontFamily: theme.fonts.fontBold,
    lineHeight: 17.6,
  },
  sec3T31: {
    color: theme.color.title,
    fontSize: 11,
    fontFamily: theme.fonts.fontBold,
    lineHeight: 16.2,
    opacity: 0.6,
    textTransform: 'uppercase',
  },
  sec3T32: {
    color: theme.color.boxTitle,
    fontSize: 12,
    fontFamily: theme.fonts.fontMedium,
    lineHeight: 17.6,
  },
  boxSection4: {
    marginTop: 12,
    paddingHorizontal: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sec4B: {
    width: '47%',
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: theme.color.button1,
  },
  sec4T: {
    color: theme.color.buttonText,
    fontSize: 14,
    fontFamily: theme.fonts.fontBold,
    textTransform: 'capitalize',
  },
  listFooter: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingTop: 20,
    paddingBottom: 10,
    // backgroundColor: 'red',
  },
  listFooterT: {
    color: theme.color.subTitleLight,
    fontSize: 13,
    fontFamily: theme.fonts.fontMedium,
  },

  //modal
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
    paddingTop: 10,
    paddingBottom: 15,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalBottomContainer2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  modalBottomContainerrr: {
    marginTop: 20,
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

  modalsubTitle: {
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
  modalinfoConatiner: {
    width: '100%',
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
    borderColor: theme.color.fieldBorder,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  mProfileImgContainer: {
    width: 55,
    height: 55,
    borderRadius: 55 / 2,
    borderWidth: 2,
    borderColor: theme.color.background,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  mProfileImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: 55 / 2,
  },

  mimageLoader: {
    height: '100%',
    width: '100%',
    borderRadius: 55 / 2,
  },
  miconVerify: {
    width: 24,
    height: 24,
    position: 'absolute',
    resizeMode: 'contain',
    bottom: -6,
    right: -7,
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
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  mProfileImgm: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: 35 / 2,
  },

  mimageLoaderm: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
    borderRadius: 35 / 2,
  },
  miconVerifym: {
    width: 16,
    height: 16,
    position: 'absolute',
    resizeMode: 'contain',
    bottom: -5,
    right: -5,
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
  },
  mTextInpt: {
    height: '100%',
    paddingHorizontal: 15,
    textAlignVertical: 'top',
  },

  dropDownMainConatiner: {
    width: '100%',
    marginTop: 15,
  },
  dropdownFieldTitle: {
    fontSize: 13,
    color: theme.color.title,
    fontFamily: theme.fonts.fontBold,
    lineHeight: 20,
  },
  dropDowninputConatiner: {
    width: '100%',
    borderWidth: 1,
    borderColor: theme.color.fieldBorder,
    borderRadius: 8,
    height: 45,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropDownText: {
    color: theme.color.title,
    fontSize: 13,
    fontFamily: theme.fonts.fontNormal,
    lineHeight: 18.6,
  },

  //make offer modal
  fieldContainer: {
    width: '100%',
    marginTop: 12,
  },

  fieldText: {
    color: theme.color.titleGreenForm,
    fontFamily: theme.fonts.fontBold,
    fontSize: 14,
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
  bottomText: {
    color: theme.color.button1,
    fontSize: 12.5,
    fontFamily: theme.fonts.fontMedium,
    textDecorationLine: 'underline',
    textDecorationColor: theme.color.button1,
  },
  umodal: {
    width: '100%',

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
});
