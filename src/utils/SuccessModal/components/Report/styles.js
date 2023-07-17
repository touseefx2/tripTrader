import {StyleSheet} from 'react-native';
import theme from '../../../../theme';

export const styles = StyleSheet.create({
  mainContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  main1: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    width: '100%',
  },
  title: {
    fontFamily: theme.fonts.fontBold,
    fontSize: 19,
    color: theme.color.subTitleAuth,
  },
  mProfileImgContainerss: {
    borderColor: theme.color.fieldBorder,
    width: 80,
    height: 80,
    borderRadius: 80 / 2,
    borderWidth: 1,
    borderColor: theme.color.fieldBc,
  },

  mProfileImgss: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: 80 / 2,
  },

  mimageLoader: {
    height: '100%',
    width: '100%',

    borderRadius: 80 / 2,
  },

  title1: {
    marginTop: 15,
    fontFamily: theme.fonts.fontBold,
    fontSize: 15,
    color: '#101B10',
    textTransform: 'capitalize',
  },
  title2: {
    fontFamily: theme.fonts.fontNormal,
    fontSize: 13,
    color: theme.color.subTitleLight,
  },
  title3: {
    marginTop: 15,
    fontFamily: theme.fonts.fontNormal,
    fontSize: 14,
    color: '#101B10',
    lineHeight: 20,
    textAlign: 'center',
  },
});
