import {StyleSheet} from 'react-native';
import theme from '../../../../theme';

export const styles = StyleSheet.create({
  modalsubTitle: {
    fontSize: 13,
    color: theme.color.title,
    fontFamily: theme.fonts.fontNormal,
    marginTop: 10,
  },

  dropDownMainConatiner: {
    width: '100%',
    marginTop: 15,
  },
  dropdownFieldTitle: {
    fontSize: 13,
    color: theme.color.title,
    fontFamily: theme.fonts.fontBold,
    lineHeight: 20,
  },
  dropDowninputConatiner: {
    width: '100%',
    borderWidth: 1,
    borderColor: theme.color.fieldBorder,
    borderRadius: 8,
    height: 42,
    paddingHorizontal: 7,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropDownText: {
    color: theme.color.title,
    fontSize: 13,
    fontFamily: theme.fonts.fontNormal,
    lineHeight: 18.6,
  },
});
