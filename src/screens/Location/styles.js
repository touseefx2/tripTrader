import {Platform, StyleSheet} from 'react-native';
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
  cross: {
    width: responsiveWidth(12),
    // height: responsiveHeight(6),
    // justifyContent: 'center',
    marginTop: responsiveHeight(2),
    marginLeft: 10,
    marginTop: 10,
  },
  section1: {
    marginTop: responsiveHeight(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 160,
    height: 160,
    resizeMode: 'contain',
  },
  title1: {
    fontSize: 20,
    fontFamily: theme.fonts.fontMedium,
    color: theme.color.title,
    textAlign: 'center',
  },
  title2: {
    fontSize: 14,
    fontFamily: theme.fonts.fontNormal,
    color: theme.color.subTitle,
    textAlign: 'center',
    marginTop: responsiveHeight(2),
  },
  section2: {
    marginTop: responsiveHeight(8),
    alignItems: 'center',
    justifyContent: 'center',
  },

  section3: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: Platform.OS == 'android' ? 25 : theme.window.APPBAR_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },

  InputLoc: {
    borderBottomWidth: 0.7,
    borderColor: theme.color.title,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: responsiveHeight(5),
    fontFamily: 'Inter-Regular',
    backgroundColor: theme.color.background,
  },
  ChargesTextloc: {
    fontSize: 13,
    lineHeight: 20,
    color: theme.color.title,
    textTransform: 'capitalize',
    fontFamily: theme.fonts.fontNormal,
  },
  BottomButton: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.color.button1,
    height: 47,
    borderRadius: 10,
    alignSelf: 'center',
    elevation: 1.5,
  },
  buttonTextBottom: {
    color: theme.color.buttonText,
    fontSize: 15,
    fontFamily: theme.fonts.fontMedium,
    textTransform: 'capitalize',
  },
  buttonTextBottom2: {
    color: theme.color.button1,
    fontSize: 15,
    fontFamily: theme.fonts.fontMedium,
    textTransform: 'capitalize',
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
    height: 47,
    backgroundColor: theme.color.background,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 20,
    elevation: 1.5,

    borderWidth: 0.6,
    borderColor: theme.color.button1,
  },
  LinearGradient2: {
    height: '100%',
    width: '100%',
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  scrollContainer: {
    paddingHorizontal: 20,
  },
});
