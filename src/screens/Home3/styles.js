import {StyleSheet} from 'react-native';
import theme from '../../theme/index';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

export const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: theme.color.background,
  },
  header: {
    width: responsiveWidth(100),
    paddingHorizontal: 15,
    marginTop: theme.window.STATUSBAR_HEIGHT,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
  },
  headerSection1: {
    // width: '15%',
  },
  headerSection2: {
    width: '45%',
    // backgroundColor: 'blue',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  title1: {
    fontSize: 13,
    fontFamily: theme.fonts.fontNormal,
    color: theme.color.subTitle,
    marginRight: 5,
  },

  title2: {
    fontSize: 15,
    fontFamily: theme.fonts.fontMedium,
    color: theme.color.title,
    lineHeight: 17,
    textTransform: 'capitalize',
  },
  icon: {
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    backgroundColor: theme.color.background,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
    marginLeft: 10,
  },
  imageGif: {
    width: responsiveWidth(100),
    height: responsiveHeight(22),
    resizeMode: 'cover',
    elevation: 5,
  },
  emptySECTION: {
    marginTop: '45%',

    alignSelf: 'center',
  },
  emptySECTION2: {
    alignSelf: 'center',
    marginTop: '45%',

    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyImg: {
    width: responsiveWidth(14),
    height: responsiveHeight(7),
    resizeMode: 'contain',
    opacity: 0.5,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: theme.fonts.fontNormal,
    color: theme.color.subTitleLight,
    alignSelf: 'center',
    marginTop: 0,
  },

  image: {
    flex: 1,
    resizeMode: 'stretch',
  },

  imageConatiner: {
    width: responsiveWidth(100),
    height: responsiveHeight(28),
    backgroundColor: theme.color.background,
    elevation: 5,
    marginBottom: 5,
  },
  mask: {
    backgroundColor: theme.color.button1,
    width: '100%',
  },
  BottomButton: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.color.button1,
    height: 50,
    borderRadius: 10,
    alignSelf: 'center',
    elevation: 3,
  },
  buttonTextBottom: {
    color: theme.color.buttonText,
    fontSize: 16,
    fontFamily: theme.fonts.fontBold,
    lineHeight: 20,
    // textTransform: 'capitalize',
  },
  LinearGradient: {
    height: '100%',
    width: '100%',
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  BottomButton2: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    backgroundColor: theme.color.background,
    borderRadius: 10,
    alignSelf: 'center',
    elevation: 0,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: theme.color.button1,
  },
  LinearGradient2: {
    height: '100%',
    width: '100%',
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },

  titleText2: {
    fontSize: 14,
    fontFamily: theme.fonts.fontMedium,
    color: theme.color.subTitle,
    alignSelf: 'center',
    marginVertical: 10,
  },
  titleText3: {
    fontSize: 14,
    fontFamily: theme.fonts.fontMedium,
    color: theme.color.subTitle,
    alignSelf: 'center',
  },
});
