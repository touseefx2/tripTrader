import {Platform, StyleSheet} from 'react-native';
import theme from '../../theme/index';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:theme.color.background
  },
  container2: {
    flex: 1,

  },
  section1: {
    marginTop: theme.window.APPBAR_HEIGHT,
     
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  section2: {marginBottom: 50},
  section2Title1: {
    color: theme.color.buttonText,
    fontSize: 36,
    fontFamily: theme.fonts.fontBold,
    lineHeight:43.2,
    letterSpacing:-1
  },
  section2Title2: {
    color: theme.color.buttonText,
    fontSize: 17,
    fontFamily: theme.fonts.fontNormal,
    marginTop: 10,
   lineHeight:23.8,
   letterSpacing:-1
  },
  section3: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 10,
    // backgroundColor: 'red',
  },

  logo: {
    width: 88,
    height: 82.58,
    resizeMode: 'contain',
  },
  title1: {
    fontSize: 22,
    fontFamily: theme.fonts.titleFont,
    color: theme.color.buttonText,
    textTransform: 'uppercase',
    lineHeight:28.73
  },
  BottomButton: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.color.button1,
    height: 50,
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
});
