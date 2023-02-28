import {StyleSheet} from 'react-native';
import theme from '../../../../theme';

export const styles = StyleSheet.create({
  bottom: {
    marginTop: 40,
    alignSelf: 'center',
  },
  ButtonContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.color.button1,
    height: 45,
    borderRadius: 10,
    alignSelf: 'center',
  },
  ButtonText: {
    color: theme.color.buttonText,
    fontSize: 14,
    fontFamily: theme.fonts.fontBold,
    textTransform: 'capitalize',
  },
});
