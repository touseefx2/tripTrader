import {Platform, StyleSheet} from 'react-native';
import theme from '../../theme/index';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';

let aph = theme.window.APPBAR_HEIGHT - (Platform.OS == 'ios' ? 25 : 5);

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.backgroundGreen,
  },
  container2: {
    flex: 1,
  },
  container3: {
    flex: 1,
  },
  section1: {
    marginTop: aph,
  },
  section2: {
    marginBottom: 40,
    width: '96%',
    alignSelf: 'center',

    // backgroundColor: 'red',
  },
  section2Title1: {
    color: theme.color.buttonText,
    // fontSize: responsiveFontSize(4.6),
    fontSize: 34,
    fontFamily: theme.fonts.fontBold,
    letterSpacing: -1,
    lineHeight: 41.2,
    marginBottom: 10,
  },
  section2Title2: {
    color: '#FAFAFA',
    fontSize: 15,
    // fontSize: responsiveFontSize(2),
    fontFamily: theme.fonts.fontNormal,
    lineHeight: 21.8,
  },
  section3: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS == 'android' ? responsiveHeight(4.5) : 10,

    // backgroundColor: 'red',
  },

  logo: {
    width: 88,
    height: 82.58,
    resizeMode: 'contain',
  },
  title1: {
    // fontSize: responsiveFontSize(2.7),
    fontSize: 20.5,
    fontFamily: theme.fonts.titleFont,
    color: theme.color.buttonText,
    textTransform: 'uppercase',
    lineHeight: 28.73,
    marginTop: 2,

    marginLeft: 5,
  },
  BottomButton: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.color.button1,
    height: 58,
    // height: responsiveHeight(8.4),
    borderRadius: 10,
    alignSelf: 'center',
  },
  buttonTextBottom: {
    color: theme.color.buttonTextGreen,

    fontSize: 16,
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
    color: '#FFFFFF',
    fontSize: 14,
    // fontSize: responsiveFontSize(1.85),
    fontFamily: theme.fonts.fontNormal,
    opacity: 0.7,
    lineHeight: 22,
  },
  buttonTextBottomTtitle2: {
    color: '#FFFFFF',
    fontSize: 14,
    // fontSize: responsiveFontSize(1.85),
    fontFamily: theme.fonts.fontBold,
    marginLeft: 5,
    textDecorationLine: 'underline',
  },
});
