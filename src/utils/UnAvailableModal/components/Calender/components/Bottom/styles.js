import {StyleSheet} from 'react-native';
import theme from '../../../../../../theme';

export const styles = StyleSheet.create({
  bottomContainer: {
    marginTop: 10,
    width: '100%',
    alignItems: 'flex-end',
    paddingHorizontal: 10,
  },

  bottomWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '52%',
    alignItems: 'center',
  },
  button: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 13,
    fontFamily: theme.fonts.fontBold,
    color: theme.color.buttonText,
  },
});
