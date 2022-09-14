import theme from '../../theme';
import {StyleSheet, Dimensions} from 'react-native';
const windowHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: theme.color.button1,
  },

  logo: {
    height: '30%',
    width: '60%',
    resizeMode: 'cover',
    marginTop: 30,
  },
  title: {
    fontSize: 22,
    fontFamily: theme.fonts.fontBold,
    color: theme.color.buttonText,
  },
  Description: {
    fontSize: 16,
    fontFamily: theme.fonts.fontMedium,
    color: theme.color.buttonText,
  },
  Body: {
    width: '90%',
    alignSelf: 'center',
    flex: 1,
  },
  ContinueButton: {
    backgroundColor: theme.color.background,
    borderRadius: 4,
    height: 48,
    justifyContent: 'center',
    width: '100%',
    alignSelf: 'center',
    position: 'absolute',
    bottom: 20,
  },
  ContinueButtonText: {
    alignSelf: 'center',
    color: theme.color.button1,
    lineHeight: 20,
    fontSize: 16,
    fontFamily: theme.fonts.fontBold,
  },
  LinearGradient: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    borderRadius: 4,
    alignItems: 'center',
    backgroundColor: theme.color.button1,
  },
});

export default styles;
