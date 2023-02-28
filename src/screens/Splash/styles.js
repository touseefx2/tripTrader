import {StyleSheet} from 'react-native';
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },

  logo: {
    width: 110,
    height: 110,
    resizeMode: 'contain',
  },
});
