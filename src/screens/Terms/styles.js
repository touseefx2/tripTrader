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
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  sectionText: {
    fontSize: 13,
    fontFamily: theme.fonts.fontNormal,
    color: theme.color.subTitle,
  },
  logo: {
    width: responsiveWidth(30),
    height: responsiveHeight(20),
    resizeMode: 'cover',
  },
  htitle: {
    fontSize: 17,
    fontFamily: theme.fonts.fontMedium,
    color: theme.color.title,
    alignSelf: 'center',
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  title: {
    fontSize: 30,
    fontFamily: theme.fonts.fontMedium,
    color: theme.color.title,
    alignSelf: 'center',
    textTransform: 'capitalize',
  },

  title2: {
    fontSize: 17,
    fontFamily: theme.fonts.fontMedium,
    color: theme.color.title,
    alignSelf: 'center',
    textTransform: 'capitalize',
    marginTop: 30,
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

  back: {
    width: 40,
  },
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
  header: {
    width: responsiveWidth(100),
    paddingHorizontal: 15,
    elevation: 10,
    backgroundColor: theme.color.background,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
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
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'yellow',
    marginLeft: 10,
  },
  imageConatiner: {
    width: responsiveWidth(100),
    height: responsiveHeight(34),
    backgroundColor: theme.color.background,
    elevation: 7,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  emptySECTION: {
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
    fontFamily: theme.fonts.fontMedium,
    color: theme.color.subTitle,
    alignSelf: 'center',
    marginTop: 0,
  },
  foodCard: {
    width: '100%',
    height: responsiveHeight(20),
    elevation: 7,
    backgroundColor: 'white',
    borderRadius: 7,

    justifyContent: 'center',
    flexDirection: 'row',

    justifyContent: 'space-between',
  },
  foodCardImg: {
    width: '40%',
    height: '100%',
    elevation: 5,
    backgroundColor: 'white',
    borderTopLeftRadius: 7,
    borderBottomLeftRadius: 7,
    // marginBottom: 20,
    // justifyContent: 'center',
  },
  foodCardTitle1: {
    fontSize: 18,
    fontFamily: theme.fonts.fontMedium,
    color: theme.color.title,

    textTransform: 'capitalize',
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

  app: {
    marginHorizontal: 'auto',
    maxWidth: 500,
    backgroundColor: '#e0e0e0',
    width: 250,
    height: 250,
    alignSelf: 'center',
  },
});
