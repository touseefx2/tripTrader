import {Platform, StyleSheet} from 'react-native';
import theme from '../../theme/index';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';

let aph = theme.window.APPBAR_HEIGHT - (Platform.OS == 'ios' ? 20 : 0);

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.backgroundGreen,
  },
  container2: {
    flex: 1,
  },
  section1: {
    marginTop: aph,

    // alignItems: 'center',
    // justifyContent: 'center',
  },
  section2: {
    marginBottom: 40,
    width: '96%',
    alignSelf: 'center',
    // backgroundColor: 'red',
  },
  section2Title1: {
    color: theme.color.buttonText,
    fontSize: responsiveScreenFontSize(4.6),
    fontFamily: theme.fonts.fontBold,
    letterSpacing: -1,
    lineHeight: 43.2,
    marginBottom: 5,
  },
  section2Title2: {
    color: '#FAFAFA',
    fontSize: responsiveScreenFontSize(2),
    fontFamily: theme.fonts.fontNormal,
    lineHeight: 23.8,
  },
  section3: {
    paddingHorizontal: 24,
    paddingBottom: responsiveHeight(3),
    paddingTop: 10,
    // backgroundColor: 'red',
  },

  logo: {
    width: 88,
    height: 82.58,
    resizeMode: 'contain',
  },
  title1: {
    fontSize: responsiveScreenFontSize(2.95),
    fontFamily: theme.fonts.titleFont,
    color: theme.color.buttonText,
    textTransform: 'uppercase',
    lineHeight: 28.73,
    marginTop: 5,
  },
  BottomButton: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.color.button1,
    height: 64,
    borderRadius: 10,
    alignSelf: 'center',
  },
  buttonTextBottom: {
    color: theme.color.buttonTextGreen,
    fontSize: responsiveScreenFontSize(2.1),
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
});
