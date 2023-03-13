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
  listContainer: {
    paddingTop: 12,
    paddingBottom: 40,
  },

  SerchBarContainer: {
    width: '100%',
    height: 46,
    borderRadius: 100,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    backgroundColor: theme.color.background,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#D8E1DB',
  },
  SerchBarInput: {
    width: '100%',
    height: '100%',
    fontFamily: theme.fonts.fontNormal,
    top: 3,
  },
  Baricon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  resultContainer: {
    marginTop: 10,
    marginLeft: 5,
  },
  resultText: {
    fontSize: 13,
    color: theme.color.title,
    fontFamily: theme.fonts.fontMedium,
    opacity: 0.4,
  },

  mtextContainer: {
    width: '86%',
  },

  ProfileContainer: {
    width: '11%',
    top: 2,
  },
  mProfileImgContainer: {
    borderColor: theme.color.subTitleLight,
  },
  mProfileImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },

  notificationConatiner: {
    width: '100%',
    paddingHorizontal: 15,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: theme.color.background,
  },
  notificationTitle: {
    color: theme.color.subTitleAuth,
    fontSize: 15.5,
    fontFamily: theme.fonts.fontBold,
  },

  notificationSubTitle: {
    color: theme.color.subTitleAuth,
    fontSize: 13.5,
    fontFamily: theme.fonts.fontNormal,
    marginTop: 3,
    textDecorationLine: 'none',
    textDecorationColor: 'transparent',
  },
  notificationClickSubTitle: {
    color: theme.color.button1,
    fontSize: 13.5,
    fontFamily: theme.fonts.fontMedium,
    textDecorationLine: 'underline',
    textDecorationColor: theme.color.button1,
  },
  notificationDate: {
    fontSize: 12.5,
    marginTop: 3,
    fontFamily: theme.fonts.fontMedium,
  },
  EmptyText: {
    marginTop: '25%',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    fontSize: 13,
    color: theme.color.subTitleLight,
    fontFamily: theme.fonts.fontMedium,
  },
  separator: {
    height: 1,
    backgroundColor: theme.color.fieldBorder,
    width: '100%',
  },
});
