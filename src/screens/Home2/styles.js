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
  headerConatainer: {
    backgroundColor: theme.color.background,
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 15,
    elevation: 5,
  },
  header1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  header2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
    // backgroundColor: 'red',
  },
  searchContainer: {
    width: '83%',
    borderRadius: 20,
    height: 40,
    paddingHorizontal: 10,
    backgroundColor: '#f5f5f5',
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchContainerText: {
    fontSize: 14,
    color: theme.color.subTitleLight,
    fontFamily: theme.fonts.fontNormal,
    marginLeft: 10,
  },
  locContainer: {
    width: '70%',
    flexDirection: 'row',
    // justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  locText: {
    fontSize: 14,
    color: theme.color.title,
    fontFamily: theme.fonts.fontMedium,
    lineHeight: 18,
    textTransform: 'capitalize',
  },
  locText2: {
    fontSize: 12,
    color: theme.color.title,
    fontFamily: theme.fonts.fontNormal,
    lineHeight: 18,
    textTransform: 'capitalize',
  },
  efcContainer: {
    width: 220,
    height: 210,
    // backgroundColor: '#FFC5B2',
    borderRadius: 8,
    marginTop: 10,
  },
  efcContainerAll: {
    width: '100%',
    height: 225,
    // backgroundColor: '#FFC5B2',
    borderRadius: 8,
    marginTop: 10,
  },
  efc1: {
    width: '100%',
    height: 136,
    backgroundColor: theme.color.background,
    borderRadius: 8,
  },

  efcImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    elevation: 2,
    resizeMode: 'cover',
  },

  efc1All: {
    width: '100%',
    height: 151,
    // backgroundColor: '#FFC5B2',
    borderRadius: 8,
    elevation: 1,
  },

  efcImageAll: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    elevation: 1,
    resizeMode: 'cover',
  },

  efc2: {
    width: '100%',
    height: '100%',
    // backgroundColor: 'red',
  },

  efc21: {
    width: '100%',
    // backgroundColor: 'grey',
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  efc21Text1: {
    fontSize: 14,
    fontFamily: theme.fonts.fontMedium,
    color: theme.color.title,
  },

  efc21Text2: {
    fontSize: 11,
    fontFamily: theme.fonts.fontMedium,
    color: theme.color.title,
    marginLeft: 2,
  },

  efc22: {
    width: '100%',
    // backgroundColor: 'grey',
    flexDirection: 'row',
  },

  efc22Text1: {
    fontSize: 13,
    fontFamily: theme.fonts.fontNormal,
    color: theme.color.subTitleLight,
    textTransform: 'capitalize',
  },

  efc33: {
    width: '100%',
    // backgroundColor: 'grey',
    flexDirection: 'row',
  },
  efc33Text1: {
    fontSize: 11,
    marginLeft: 5,
    fontFamily: theme.fonts.fontNormal,
    color: theme.color.subTitleLight,
    textTransform: 'capitalize',
  },

  boxContainer2: {
    width: '100%',
    height: responsiveHeight(20),
    backgroundColor: '#FEF0C0',
    borderRadius: 8,
    marginBottom: 20,
    elevation: 1,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  boxContainerSecton1: {
    width: '55%',

    justifyContent: 'flex-end',
  },

  boxContainerSecton2: {
    width: '40%',

    alignItems: 'center',
    justifyContent: 'center',
  },

  bcs1Text1: {
    fontSize: 16,
    fontFamily: theme.fonts.fontMedium,
    color: theme.color.title,
  },

  bcs1Text2: {
    fontSize: 13,
    fontFamily: theme.fonts.fontNormal,
    color: theme.color.title,
  },
  bcs2Image: {flex: 1, resizeMode: 'contain', elevation: 5},
  mainSec1: {
    width: '100%',
    // backgroundColor: 'silver',
  },
  mainSecText: {
    fontSize: 16,
    fontFamily: theme.fonts.fontMedium,
    color: theme.color.title,
    marginHorizontal: 20,
  },
  mainSec2: {
    width: '100%',
    // marginTop: 20,
    // backgroundColor: 'silver',
  },

  disContaniner: {
    width: 43,
    height: 21,
    borderRadius: 16,
    backgroundColor: theme.color.background,
    position: 'absolute',
    bottom: 5,
    left: 5,
    elevation: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  disContaninerText: {
    fontSize: 9,
    fontFamily: theme.fonts.fontMedium,
    color: theme.color.title,
  },

  heartContaniner: {
    width: 22,
    height: 22,
    borderRadius: 22 / 2,
    backgroundColor: theme.color.background,
    position: 'absolute',
    top: 5,
    right: 5,
    elevation: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptySECTION: {
    alignSelf: 'center',
    top: '30%',
    width: '75%',
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
    textAlign: 'center',
  },

  loaderSECTION: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 50,
  },
  loaderImg: {flex: 1},
  circleC: {
    width: 20,
    height: 20,
    borderRadius: 20 / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.color.buttonText,
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: theme.color.button1,
  },
  circleCText: {
    fontSize: 9,
    color: theme.color.buttonText,
    fontFamily: theme.fonts.fontMedium,
    top: 1,
  },

  circleCart: {
    width: 18,
    height: 18,
    borderRadius: 218 / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.color.buttonText,
    position: 'absolute',
    right: -7,
    bottom: -1,
    backgroundColor: theme.color.button1,
  },
  circleCartText: {
    fontSize: 8,
    color: theme.color.buttonText,
    fontFamily: theme.fonts.fontMedium,
    top: 1,
  },
});
