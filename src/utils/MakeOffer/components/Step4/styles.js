import {StyleSheet} from 'react-native';
import theme from '../../../../theme';

export const styles = StyleSheet.create({
  fieldContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  title: {
    fontSize: 12,
    color: theme.color.subTitleLight,
    fontFamily: theme.fonts.fontBold,
    textTransform: 'uppercase',
  },
  subTitle: {
    fontSize: 13,
    color: theme.color.title,
    fontFamily: theme.fonts.fontMedium,
    textTransform: 'capitalize',
  },
  infoContainer: {
    width: '100%',
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    flexDirection: 'row',
    justifyContent: 'space-between',
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
