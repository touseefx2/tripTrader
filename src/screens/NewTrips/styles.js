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
  },
  modalContainer2: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 15,
  },
  modal: {
    // width: Platform.OS == 'android' ? '98%' : '88%',
    width: '98%',
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
  modalsubTitle: {
    fontSize: 13,
    color: theme.color.title,
    fontFamily: theme.fonts.fontNormal,
  },
  modalBottomContainer: {
    marginTop: 30,
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
});
