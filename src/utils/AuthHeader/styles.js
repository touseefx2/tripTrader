import {Platform, StyleSheet} from 'react-native';
import theme from '../../theme/index';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

let aph = theme.window.APPBAR_HEIGHT - (Platform.OS == 'ios' ? 25 : 5);

export const styles = StyleSheet.create({
  Header: {
    marginTop: aph,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: responsiveWidth(15),
    height: responsiveHeight(7.2),
    resizeMode: 'contain',
  },
  title: {
    fontSize: responsiveFontSize(2.2),
    fontFamily: theme.fonts.titleFont,
    color: theme.color.buttonText,
    textTransform: 'uppercase',
  },
});
