import {StyleSheet} from 'react-native';
import theme from '../../../../theme';

export const styles = StyleSheet.create({
  ButtonContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#B93B3B',
    height: 50,
    borderRadius: 10,
    alignSelf: 'center',
  },
  ButtonText: {
    color: theme.color.buttonText,
    fontSize: 15,
    fontFamily: theme.fonts.fontBold,
    textTransform: 'none',
  },
});
