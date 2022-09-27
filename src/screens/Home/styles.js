import {StyleSheet} from 'react-native';
import theme from '../../theme/index';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

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
  headerConatainer: {
    backgroundColor: theme.color.backgroundGreen,
    paddingHorizontal: 15,
    paddingVertical: 15,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.6,
    shadowRadius: 1,
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

  headerTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.fontBold,
    color: theme.color.backgroundGreenText,
    top: -2,
  },
  SerchBarContainer: {
    width: '100%',
    height: 48,
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    backgroundColor: theme.color.background,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    borderWidth: 1.5,
    borderColor: '#D8E1DB',
  },
  SerchBarInput: {
    width: '100%',
    height: '100%',
    fontSize: 16,
    fontFamily: theme.fonts.fontNormal,
    top: 2,
  },
  Baricon: {
    flex: 1,
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
  emptyListStyle: {
    marginTop: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    fontSize: 13,
    color: theme.color.title,
    fontFamily: theme.fonts.fontMedium,
    opacity: 0.4,
  },

  boxContainer: {
    width: '100%',
    alignSelf: 'center',
    borderRadius: 10,
    backgroundColor: theme.color.background,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,

    paddingVertical: 12,
  },
  boxSection1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 9,
  },
  ProfileImgContainer: {
    width: 48,
    height: 48,
    borderRadius: 48 / 2,
    borderWidth: 2,
    borderColor: theme.color.photoBorderColor,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  ProfileImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: 48 / 2,
  },
  imageLoader: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
    borderRadius: 48 / 2,
  },

  textContainer: {
    width: '66%',
    // backgroundColor: 'red',
    top: 5,
  },
  textContainertitle: {
    color: theme.color.titleGreen,
    fontSize: 15,
    fontFamily: theme.fonts.fontBold,
    textTransform: 'capitalize',
    lineHeight: 20,
  },
  textContainerRatetitle1: {
    color: theme.color.title,
    fontSize: 13,
    fontFamily: theme.fonts.fontBold,
    textTransform: 'capitalize',
    top: -2,
  },
  textContainerRatetitle2: {
    color: theme.color.subTitleLight,
    fontSize: 13,
    fontFamily: theme.fonts.fontMedium,
    textDecorationLine: 'underline',
    top: -2,
  },

  iconContainer: {
    width: '12%',

    alignItems: 'flex-end',
  },
  iconSave: {
    position: 'absolute',
    // flex: 1,
    width: 27,
    height: 32,
    bottom: 5,
    resizeMode: 'contain',
  },
  boxSection2: {
    marginTop: 10,
  },
  tripImageConatiner: {
    width: '100%',
    height: 250,
  },
  tripImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  boxSection3: {
    marginTop: 10,
    paddingHorizontal: 9,
  },
});
