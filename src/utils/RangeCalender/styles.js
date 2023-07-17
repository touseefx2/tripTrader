import {StyleSheet} from 'react-native';
import theme from '../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container2: {
    width: '92%',
    alignSelf: 'center',
    paddingBottom: 20,
    backgroundColor: theme.color.background,
    borderRadius: 10,
    paddingTop: 5,
    paddingHorizontal: 5,
  },
});
