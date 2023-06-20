import {StyleSheet} from 'react-native';
import theme from '../../theme/index';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.backgroundGreen,
  },
  container2: {
    flex: 1,
    backgroundColor: theme.color.background,
  },
  container3: {
    flex: 1,
    backgroundColor: theme.color.backgroundConatiner,
  },

  mtextContainer: {
    width: '76%',
    top: 10,
  },

  modalinfoConatiner: {
    width: '100%',

    paddingVertical: 0,
    borderRadius: 10,

    flexDirection: 'row',

    justifyContent: 'space-between',
  },

  mProfileImgContainer: {
    width: 47,
    height: 47,
    borderRadius: 47 / 2,
    borderWidth: 1,
    borderColor: theme.color.fieldBorder,
  },

  mProfileImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: 47 / 2,
  },

  mimageLoader: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
    borderRadius: 47 / 2,
  },
  title: {
    color: theme.color.title,
    fontSize: 14,
    fontFamily: theme.fonts.fontNormal,
    textTransform: 'capitalize',
  },
  section1: {
    width: '78%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  section2: {
    width: '20%',
    alignItems: 'flex-end',
  },
  title2: {
    top: 10,
    color: '#3C6B49',
    fontSize: 14,
    fontFamily: theme.fonts.fontBold,
    textTransform: 'capitalize',
  },
  emptyTitle: {
    marginTop: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    fontSize: 13,
    color: theme.color.title,
    fontFamily: theme.fonts.fontMedium,
    opacity: 0.4,
  },
  emptyLoader: {
    marginTop: '80%',
    alignSelf: 'center',
  },
  headerTitle: {
    color: theme.color.subTitle,
    fontSize: 13,
    fontFamily: theme.fonts.fontNormal,
  },
  loader: {
    top: '50%',
    position: 'absolute',
    alignSelf: 'center',
  },
});
