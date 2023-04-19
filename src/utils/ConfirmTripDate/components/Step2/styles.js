import {StyleSheet} from 'react-native';
import theme from '../../../../theme';

export const styles = StyleSheet.create({
  modalsubTitle: {
    fontSize: 13,
    color: theme.color.title,
    fontFamily: theme.fonts.fontNormal,
    marginTop: 10,
  },
  mProfileImgContainer: {
    width: 55,
    height: 55,
    borderRadius: 55 / 2,
    borderWidth: 1,
    borderColor: theme.color.photoBorderColor,
  },
  mProfileImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: 55 / 2,
  },
  mimageLoader: {
    height: '100%',
    width: '100%',
    borderRadius: 55 / 2,
  },
  modalFieldConatiner: {
    width: '100%',
    marginTop: 10,
  },

  mfT1: {
    fontSize: 12,
    color: theme.color.title,
    fontFamily: theme.fonts.fontBold,
    textTransform: 'capitalize',
    lineHeight: 19,
  },

  mFieldContainer: {
    marginTop: 5,
    width: '100%',
    height: 42,
    padding: 10,
    borderRadius: 8,
    borderColor: theme.color.fieldBorder,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mfT2: {
    fontSize: 12,
    color: theme.color.title,
    fontFamily: theme.fonts.fontNormal,
    lineHeight: 19,
    width: '85%',
  },
  mfT2icon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },

  modalinfoConatiner: {
    width: '100%',
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
    borderColor: theme.color.fieldBorder,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  mtextContainer: {
    width: '77%',
  },

  mtextContainertitle: {
    color: theme.color.title,
    fontSize: 15,
    fontFamily: theme.fonts.fontBold,
  },
  textContainertitle2: {
    color: theme.color.boxTitle,
    fontSize: 11,
    fontFamily: theme.fonts.fontMedium,
  },
  textContainertitle3: {
    color: theme.color.subTitle,
    fontSize: 11,
    fontFamily: theme.fonts.fontNormal,
  },
});
