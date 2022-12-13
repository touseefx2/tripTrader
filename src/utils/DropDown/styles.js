import {StyleSheet, Platform} from 'react-native';
import theme from '../../theme';

let bordercolor = '#D8E1DB';

export const styles = StyleSheet.create({
  Container: {
    width: '100%',
    borderColor: bordercolor,
    borderWidth: 1,
    alignSelf: 'center',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
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
    // marginBottom: 10,
  },
  searchBarContainer: {
    width: '100%',
    borderBottomWidth: 0.7,
    borderColor: bordercolor,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  rowContainer: {
    width: '100%',
    paddingVertical: 15,
    borderColor: bordercolor,
    paddingHorizontal: 12,
  },
  rowContainer2: {
    width: '100%',
    paddingVertical: 15,
    borderColor: bordercolor,
    borderWidth: 1,
    paddingHorizontal: 12,
    backgroundColor: theme.color.background,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  Text: {
    color: theme.color.title,
    fontSize: 13,
    fontFamily: theme.fonts.fontNormal,
    lineHeight: 19,
    textTransform: 'capitalize',
  },
  Textc: {
    color: theme.color.button1,
    fontSize: 13,
    fontFamily: theme.fonts.fontBold,
    lineHeight: 19,
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
