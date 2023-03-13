import {StyleSheet} from 'react-native';
import {responsiveFontSize} from 'react-native-responsive-dimensions';
import theme from '../../theme/index';

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

  main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  logo: {
    width: responsiveFontSize(15),
    height: responsiveFontSize(15),
    resizeMode: 'contain',
  },
});
