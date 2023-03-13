import {Platform, StyleSheet} from 'react-native';
import theme from '../../theme/index';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

const appBarHeight =
  theme.window.APPBAR_HEIGHT - (Platform.OS == 'ios' ? 25 : 5);

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.backgroundGreen,
  },
  container2: {
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    width: theme.window.Width,
    height: theme.window.Height,
  },
  container3: {
    flex: 1,
  },
  section1: {
    marginTop: appBarHeight,
  },
  logo: {
    width: responsiveFontSize(11.7),
    height: responsiveFontSize(11.2),
    resizeMode: 'contain',
  },
  title1: {
    fontSize: responsiveFontSize(2.6),
    fontFamily: theme.fonts.titleFont,
    color: theme.color.buttonText,
    textTransform: 'uppercase',
    marginTop: responsiveHeight(0.5),
    marginLeft: responsiveWidth(1),
  },
  section2: {
    marginBottom: responsiveHeight(5.2),
    width: '96%',
    alignSelf: 'center',
  },
  section2Title1: {
    color: theme.color.buttonText,
    fontSize: responsiveFontSize(4.5),
    fontFamily: theme.fonts.fontBold,
    letterSpacing: -1,
    lineHeight: responsiveFontSize(5.6),
    marginBottom: responsiveHeight(1.4),
  },
  section2Title2: {
    color: '#FAFAFA',
    fontSize: responsiveFontSize(1.9),
    fontFamily: theme.fonts.fontNormal,
  },
  section3: {
    width: '90%',
    alignSelf: 'center',
    paddingBottom:
      Platform.OS == 'android' ? responsiveHeight(5) : responsiveHeight(2),
  },

  BottomButton: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.color.button1,
    height: responsiveHeight(8),
    borderRadius: 10,
    alignSelf: 'center',
  },
  buttonTextBottom: {
    color: theme.color.buttonTextGreen,
    fontSize: responsiveFontSize(2.2),
    fontFamily: theme.fonts.fontBold,
    textTransform: 'capitalize',
  },

  BottomButtonT: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: responsiveHeight(3.5),
    justifyContent: 'center',
    alignSelf: 'center',
  },
  buttonTextBottomTtitle: {
    color: '#FFFFFF',
    fontSize: responsiveFontSize(1.9),
    fontFamily: theme.fonts.fontNormal,
    opacity: 0.7,
  },
});
