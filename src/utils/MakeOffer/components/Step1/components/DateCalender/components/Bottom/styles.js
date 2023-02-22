import {StyleSheet} from 'react-native';
import theme from '../../../../../../../../theme';

export const styles = StyleSheet.create({
  bottomContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  bottomWrapper1: {
    width: '40%',
    paddingLeft: 10,
  },
  bottomWrapper1Text: {
    fontSize: 11,
    fontFamily: theme.fonts.fontNormal,
    color: theme.color.subTitleLight,
  },
  bottomWrapper2: {
    width: '55%',
    paddingRight: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
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
