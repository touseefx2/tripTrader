import {StyleSheet} from 'react-native';
import theme from '../../../../theme';

export const styles = StyleSheet.create({
  mainContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },

  title: {
    fontFamily: theme.fonts.fontBold,
    fontSize: 19,
    color: theme.color.subTitleAuth,
  },
  mainContainer2: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    width: '100%',
  },
  image: {width: 90, height: 90, resizeMode: 'contain'},
  subTitle: {
    marginTop: 12,
    fontFamily: theme.fonts.fontBold,
    fontSize: 15,
    color: '#101B10',
    textTransform: 'capitalize',
    lineHeight: 20,
  },
  subTitle2: {
    fontFamily: theme.fonts.fontNormal,
    fontSize: 13,
    color: theme.color.subTitleLight,
    lineHeight: 20,
  },
});
