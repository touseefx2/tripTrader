import {Platform, StyleSheet} from 'react-native';
import theme from '../../theme/index';
import {
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.backgroundGreen,
  },
  headerConatainer: {
    width: '100%',
    backgroundColor: theme.color.backgroundGreen,
    paddingHorizontal: 15,
    paddingVertical: responsiveHeight(1.9),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.6,
    shadowRadius: 1,
    marginTop: Platform.OS == 'ios' ? theme.window.APPBAR_HEIGHT : 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  backIcon: {
    width: responsiveFontSize(3.2),
    height: responsiveFontSize(3.2),
    resizeMode: 'contain',
  },
  headerTitle: {
    fontSize: responsiveFontSize(2.5),
    fontFamily: theme.fonts.fontBold,
    color: theme.color.backgroundGreenText,
    textTransform: 'capitalize',
  },
  bellIcon: {
    width: responsiveFontSize(3.5),
    height: responsiveFontSize(3.5),
    resizeMode: 'contain',
  },
  dot: {
    width: responsiveFontSize(1),
    height: responsiveFontSize(1),
    borderRadius: responsiveFontSize(1) / 2,
    position: 'absolute',
    right: 3.5,
    top: 4,
    backgroundColor: theme.color.ntfctnClr,
  },
});
