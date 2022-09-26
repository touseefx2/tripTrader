import {StyleSheet} from 'react-native';
import theme from '../../theme/index';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

let iconContainerColor = theme.color.button2;
let textColor = '#30563A';

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
  boxContainer: {
    width: '100%',
    height: responsiveHeight(20),
    backgroundColor: '#FFC5B2',
    borderRadius: 8,
    marginBottom: 20,
    elevation: 1,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  circleC: {
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
  circleCText: {
    fontSize: 8,
    color: theme.color.buttonText,
    fontFamily: theme.fonts.fontMedium,
    top: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.fontBold,
    color: theme.color.backgroundGreenText,
    top: -2,
  },

  mainContainer: {
    width: '100%',
    padding: 7,
    borderRadius: 5,
    backgroundColor: theme.color.background,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
    marginBottom: 15,
  },
  sec1Container: {
    width: '15%',
  },
  iconConatiner: {
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
    backgroundColor: iconContainerColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: '55%',
    height: '55%',
    resizeMode: 'contain',
  },
  sec2Container: {
    width: '83%',
  },
  sec2Title: {
    fontSize: 16,
    color: textColor,
    fontFamily: theme.fonts.fontBold,
    lineHeight: 22.8,
    textTransform: 'capitalize',
  },
  bottomContainer: {
    width: '100%',
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 32,

    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.color.backgroundConatiner,
  },
  bottomTitle1: {
    fontSize: 14.5,
    color: theme.color.subTitle,
    fontFamily: theme.fonts.fontMedium,
    textAlign: 'center',
  },

  BottomButton: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.color.button1,
    height: 55,
    // height: responsiveHeight(8),
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 15,
  },
  buttonTextBottom: {
    color: theme.color.buttonText,
    fontSize: 16,
    // fontSize: responsiveScreenFontSize(2.15),
    fontFamily: theme.fonts.fontBold,
    textTransform: 'capitalize',
  },
  arrow: {
    marginLeft: 12,
    top: 2,
  },
});
