import {Platform, StyleSheet} from 'react-native';
import theme from '../../theme/index';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.button1,
  },
  container2: {
    flex: 1,
  },
  Header: {
    marginTop: theme.window.APPBAR_HEIGHT,
    width: '100%',

    alignItems: 'center',
    paddingHorizontal: 20,
  },
  section1: {alignItems: 'center', justifyContent: 'center'},
  section2: {
    backgroundColor: theme.color.background,
    borderRadius: 15,
    marginBottom: 15,
    padding: 18,
    marginTop: 30,
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
    width: 54.93,
    height: 50.56,
    resizeMode: 'contain',
  },
  title1: {
    fontSize: 16,
    fontFamily: theme.fonts.titleFont,
    color: theme.color.buttonText,
    textTransform: 'uppercase',
    lineHeight:20.9
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
  Field2: {marginTop: 20, flexDirection: 'row', alignItems: 'center'},
  Field2Title: {
    color: theme.color.titleGreen,
    fontSize: 13.5,
    fontFamily: theme.fonts.fontMedium,
    textTransform: 'capitalize',
    marginLeft: 10,
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
    marginTop: 20,
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
    fontSize: 13,
    fontFamily: theme.fonts.fontBold,
  },
  section2LogoTitle: {
    marginTop: 20,
    color: theme.color.title,
    fontSize: 14,
    fontFamily: theme.fonts.fontNormal,
    alignSelf: 'center',
  },

  phoneInputContainer: {
    width: '100%',
    marginTop: 5,

    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: theme.color.fieldBorder,
    paddingHorizontal: 10,
    alignItems: 'center', //for ios
    justifyContent: 'center', //for ios
  },
});
