import {StyleSheet, Platform} from 'react-native';
import theme from '../../theme';
import {responsiveFontSize} from 'react-native-responsive-dimensions';

const bordercolor = '#D8E1DB';
const paddingHorizontal = 15;

export const styles = StyleSheet.create({
  Container: {
    width: '100%',
    borderColor: bordercolor,
    alignSelf: 'center',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: theme.color.background,
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  searchBarContainer: {
    width: '100%',
    borderBottomWidth: 0.7,
    borderColor: bordercolor,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: paddingHorizontal,
    paddingVertical: Platform.OS === 'ios' ? 10 : 0,
  },
  rowContainer: {
    width: '90%',
    paddingVertical: 13,
    paddingHorizontal: paddingHorizontal,
  },
  rowContainer2: {
    width: '100%',
    paddingVertical: 15,
    borderColor: bordercolor,
    borderWidth: 1,
    paddingHorizontal: paddingHorizontal,
    backgroundColor: theme.color.background,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  Text: {
    color: theme.color.title,
    fontSize: responsiveFontSize(1.75),
    fontFamily: theme.fonts.fontNormal,
    textTransform: 'capitalize',
  },
  Textc: {
    color: theme.color.button1,
    fontSize: responsiveFontSize(1.75),
    fontFamily: theme.fonts.fontBold,
  },
  emptyMessageConatiner: {
    width: '100%',
    paddingVertical: 15,
    borderColor: bordercolor,
    paddingHorizontal: 15,
  },
  emptyText: {
    color: 'grey',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
});
