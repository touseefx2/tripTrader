import {StyleSheet, Platform} from 'react-native';
import theme from '../../theme/index';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
let aph = theme.window.APPBAR_HEIGHT;
export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: theme.color.background,
    paddingHorizontal: 15,
    paddingTop: 10,
  },
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

  itemHeader: {
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  itemContainer2: {
    width: '49%',
    height: 44,
    backgroundColor: theme.color.button2,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  bottomFullButtonContainer: {
    width: '100%',
    height: 54,
    backgroundColor: theme.color.button1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomFullButtonText: {
    fontSize: 17,
    color: '#FAFAFA',
    fontFamily: theme.fonts.fontBold,
    textTransform: 'capitalize',
  },

  dropDownMainConatiner: {
    width: '100%',
  },
  dropdownFieldTitle: {
    fontSize: 16,
    color: '#101B10',
    fontFamily: theme.fonts.fontBold,
    textTransform: 'capitalize',
  },
  dropDowninputConatiner: {
    width: '100%',
    borderWidth: 1,
    borderColor: theme.color.fieldBorder,
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropDownIcon: {
    height: 21,
    width: 21,
    resizeMode: 'contain',
  },
  dropDownText: {
    color: '#1E3625',
    fontSize: 16,
    fontFamily: theme.fonts.fontMedium,
  },

  Field2: {flexDirection: 'row', alignItems: 'center'},
  Field2Title: {
    color: theme.color.title,
    fontSize: 14,
    fontFamily: theme.fonts.fontMedium,

    marginLeft: 10,
  },
  ErrorMessage: {
    color: 'red',
    fontSize: 11,
    fontFamily: theme.fonts.fontNormal,
  },
});
