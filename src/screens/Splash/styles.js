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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  background: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch'
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 90,
    height: 90,
    resizeMode:"contain"
  },
  title1: {
    fontSize: 30,
    fontFamily: theme.fonts.titleFont,
    color: theme.color.buttonText,
    alignSelf: 'center',
    textTransform: 'uppercase',
  },
  title2: {
    marginTop: 15,
    fontSize: 30,
    fontFamily: theme.fonts.fontBold,
    color: 'white',
    alignSelf: 'center',
  },
});
