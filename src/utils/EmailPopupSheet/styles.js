import {StyleSheet} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
} from 'react-native-responsive-dimensions';
import theme from '../../theme';

export const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  modal: {
    width: '92%',
    alignSelf: 'center',
    backgroundColor: theme.color.background,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },

  header: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: responsiveHeight(3.2),
  },
  headerMax: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingVertical: responsiveHeight(1.9),
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 1}, // change this for more shadow
    shadowOpacity: 0.1,
    elevation: 1,
    backgroundColor: theme.color.background,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  headerText: {
    textAlign: 'center',
    fontSize: responsiveFontSize(2.5),
    color: theme.color.boxTitle,
    fontFamily: theme.fonts.fontBold,
  },
  main: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: responsiveFontSize(12),
    height: responsiveFontSize(12),
    resizeMode: 'contain',
    marginBottom: responsiveHeight(2.2),
  },

  text1: {
    textAlign: 'center',
    fontSize: responsiveHeight(1.85),
    color: theme.color.title,
    fontFamily: theme.fonts.fontNormal,
  },
  text2: {
    width: '97%',
    textAlign: 'center',
    fontSize: responsiveHeight(1.65),
    color: theme.color.subTitle,
    fontFamily: theme.fonts.fontNormal,
    marginTop: responsiveHeight(2.2),
  },

  bottom: {
    marginTop: responsiveHeight(2.2),
    marginBottom: 0,
    paddingHorizontal: 0,
  },
  bottomMax: {
    marginTop: responsiveHeight(1.6),
    marginBottom: responsiveHeight(1.95),
    paddingHorizontal: 15,
  },
  button: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.color.button1,
    height: responsiveHeight(7.2),
    borderRadius: 8,
    alignSelf: 'center',
  },
  buttonText: {
    color: theme.color.buttonText,
    fontSize: responsiveFontSize(1.85),
    fontFamily: theme.fonts.fontBold,
    textTransform: 'capitalize',
  },
});
