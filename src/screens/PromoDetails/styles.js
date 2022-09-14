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
  section1: {
    marginTop: '12%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  logo: {
    width: responsiveWidth(30),
    height: responsiveHeight(20),
    resizeMode: 'cover',
  },
  htitle: {
    fontSize: 18,
    fontFamily: theme.fonts.fontMedium,
    color: theme.color.title,
    alignSelf: 'center',
    textAlign: 'center',
    textTransform: 'capitalize',
    marginLeft: 15,
  },
  title: {
    fontSize: 12,
    fontFamily: theme.fonts.fontMedium,
    color: theme.color.subTitle,
    lineHeight: 22,
  },

  title2: {
    fontSize: 12,
    fontFamily: theme.fonts.fontMedium,
    color: theme.color.title,
    lineHeight: 22,
    textTransform: 'capitalize',
  },

  title3: {
    fontSize: 14,
    fontFamily: theme.fonts.fontNormal,
    color: theme.color.title,
    alignSelf: 'center',
    marginTop: 5,
  },
  title4: {
    fontSize: 16,
    fontFamily: theme.fonts.fontMedium,
    color: theme.color.button1,
    alignSelf: 'center',
    marginTop: 20,
  },
  title5: {
    fontSize: 16,
    fontFamily: theme.fonts.fontMedium,
    color: theme.color.button1,
    alignSelf: 'center',
    marginTop: 5,
  },

  header: {
    width: responsiveWidth(100),
    paddingHorizontal: 15,
    paddingVertical: 7,
    top: theme.window.STATUSBAR_HEIGHT,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
  },
  back: {},
  titleSection: {
    width: '100%',
    marginTop: 20,
    paddingHorizontal: 15,
    flexDirection: 'row',

    justifyContent: 'space-between',
  },
  descriptionSection: {
    width: '100%',
    marginTop: 20,
    paddingHorizontal: 15,
  },

  headerSection1: {
    width: '45%',
    // backgroundColor: 'red',
  },
  headerSection2: {
    width: '45%',
    // backgroundColor: 'red',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  title1: {
    fontSize: 13,
    fontFamily: theme.fonts.fontNormal,
    color: theme.color.subTitle,
    marginRight: 5,
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
    opacity: 0.9,
  },
  imageConatiner: {
    width: responsiveWidth(100),
    height: responsiveHeight(34),
    backgroundColor: theme.color.background,
    elevation: 7,
  },
  image: {
    // flex: 1,
    // resizeMode: 'stretch',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  emptySECTION: {
    alignSelf: 'center',
    position: 'absolute',
    top: '40%',
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyImg: {
    width: responsiveWidth(12),
    height: responsiveHeight(6),
    resizeMode: 'contain',
    opacity: 0.5,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: theme.fonts.fontMedium,
    color: theme.color.subTitle,
    alignSelf: 'center',
    marginTop: 0,
  },

  foodCardTitle2: {
    fontSize: 14,
    fontFamily: theme.fonts.fontMedium,
    color: theme.color.subTitle,
  },
  foodCardTitle3: {
    fontSize: 18,
    fontFamily: theme.fonts.fontMedium,
    color: theme.color.button1,
    lineHeight: 20,
  },
  fcBottom: {
    marginTop: 50,
    paddingHorizontal: 15,
    paddingBottom: 20,
    width: '100%',
  },
  foodCardBottom: {
    marginTop: 10,
  },
  addcart: {
    width: '100%',
    height: responsiveHeight(6),
    backgroundColor: theme.color.cartbutton,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    elevation: 4,
  },
  foodCardButtonText: {
    fontSize: 16,
    fontFamily: theme.fonts.fontMedium,
    color: theme.color.cartbuttonText,
    lineHeight: 20,
    marginLeft: 5,
  },
  likecart: {
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionsTitle: {
    fontSize: 26,
    fontFamily: theme.fonts.fontBold,
    color: theme.color.title,
    textTransform: 'capitalize',
    lineHeight: 36,
  },

  mainSec: {
    backgroundColor: theme.color.background,
    // elevation: 4,
    marginBottom: 5,
  },

  section3subTitle: {
    fontSize: 12,
    color: theme.color.subTitle,
    fontFamily: theme.fonts.fontMedium,

    textTransform: 'capitalize',
  },
  dimg: {
    width: 77,
    height: 77,
    alignSelf: 'center',

    marginVertical: 10,
  },
  foodCard: {
    width: '100%',
    height: responsiveHeight(12),
    elevation: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    paddingHorizontal: 15,
    paddingVertical: 7,
  },
  foodCardLinear: {
    height: '75%',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: theme.color.button1,
    borderRadius: 10,
  },

  section11: {
    borderColor: theme.color.background,
    width: 60,
    height: 30,
    borderWidth: 1.5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section2: {
    width: '40%',
    // backgroundColor: 'red',
    alignItems: 'flex-end',
  },
  section3: {
    width: '32%',
    // backgroundColor: 'red',
    alignItems: 'flex-end',
  },
  section1: {
    borderColor: theme.color.background,
    width: 30,
    height: 30,
    borderWidth: 1.5,
    borderRadius: 30 / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  t1: {
    fontSize: 12,
    color: theme.color.buttonText,
    fontFamily: theme.fonts.fontBold,
    lineHeight: 17,
  },
  t2: {
    fontSize: 16,
    color: theme.color.footerCartText,
    fontFamily: theme.fonts.fontMedium,
    lineHeight: 20,
  },
  t3: {
    fontSize: 12,
    color: theme.color.footerCartText,
    fontFamily: theme.fonts.fontNormal,
    lineHeight: 16,
  },
  t4: {
    fontSize: 14,
    color: theme.color.buttonText,
    fontFamily: theme.fonts.fontBold,
    lineHeight: 20,
  },
  mask: {
    backgroundColor: theme.color.button1,
    width: '100%',
  },
});
