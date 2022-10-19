import {Platform, StyleSheet} from 'react-native';
import theme from '../../theme/index';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
let aph = theme.window.APPBAR_HEIGHT;
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.backgroundGreen,
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
    marginTop: Platform.OS == 'ios' ? aph : 0,
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
    fontSize: 19,

    fontFamily: theme.fonts.fontBold,
    color: theme.color.backgroundGreenText,
  },
});
