import {StyleSheet, Platform} from 'react-native';
import theme from '../../theme/index';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
let aph = theme.window.APPBAR_HEIGHT;
export const styles = StyleSheet.create({
  //main
  mainContainer: {
    flex: 1,
    backgroundColor: theme.color.backgroundConatiner,
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  //header
  headerConatainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Platform.OS == 'ios' ? aph : 0,
  },
  headerIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: theme.fonts.fontBold,
    color: '#101B10',
    textTransform: 'capitalize',
    lineHeight: 30,
  },
  headerTitle2: {
    fontSize: 17,
    fontFamily: theme.fonts.fontBold,
    color: '#3C6B49',
    textTransform: 'capitalize',
    lineHeight: 23.8,
  },

  //search bar
  SerchBarContainer: {
    width: '100%',
    height: 48,
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 18,
    backgroundColor: theme.color.background,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    borderWidth: 1,
    borderColor: theme.color.fieldBorder,
  },
  SerchBaricon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
    top: -1,
  },
  SerchBarInput: {
    width: '100%',
    height: '100%',
    fontFamily: theme.fonts.fontNormal,
    fontSize: 16,
    top: 2,
    color: theme.color.title,
  },

  // search item

  itemHeader: {
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  itemContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },

  // popular search item

  itemContainer2: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#63896D',
    borderRadius: 100,
    marginTop: 12,
  },
});
