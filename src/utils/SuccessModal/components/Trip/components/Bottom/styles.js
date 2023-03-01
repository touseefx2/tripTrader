import {StyleSheet} from 'react-native';
import theme from '../../../../../../theme';

export const styles = StyleSheet.create({
  bottom: {
    marginTop: 40,
  },
  ButtonContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.color.button1,
    height: 50,
    borderRadius: 10,
    alignSelf: 'center',
  },
  ButtonText: {
    color: theme.color.buttonText,
    fontSize: 15,
    fontFamily: theme.fonts.fontBold,
    textTransform: 'capitalize',
  },
});
