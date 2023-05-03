import {StyleSheet} from 'react-native';
import theme from '../../../../theme';

export const styles = StyleSheet.create({
  mainContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    width: '100%',
  },
  image: {
    width: 150,
    height: 142,
    resizeMode: 'contain',
  },
  title: {
    marginTop: 15,
    fontFamily: theme.fonts.fontNormal,
    fontSize: 15,
    color: theme.color.subTitleAuth,
    textAlign: 'center',
  },
  subTitle: {
    fontFamily: theme.fonts.fontBold,
    fontSize: 21,
    color: theme.color.subTitleAuth,
    textTransform: 'capitalize',
    textAlign: 'center',
  },
});
