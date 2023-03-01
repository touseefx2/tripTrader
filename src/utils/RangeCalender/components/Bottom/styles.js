import {StyleSheet} from 'react-native';
import theme from '../../../../theme';

export const styles = StyleSheet.create({
  bottomContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  bottomWrapper1: {
    width: '35%',
  },
  bottomWrapper1Text: {
    fontSize: 11,
    fontFamily: theme.fonts.fontNormal,
    color: theme.color.subTitleLight,
  },
  bottomWrapper2: {
    width: '52%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
