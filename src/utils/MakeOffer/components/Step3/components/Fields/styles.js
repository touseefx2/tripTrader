import {StyleSheet} from 'react-native';
import theme from '../../../../../../theme';

export const styles = StyleSheet.create({
  dropDowninputConatiner: {
    width: '100%',
    borderWidth: 1,
    borderColor: theme.color.fieldBorder,
    borderRadius: 8,
    height: 45,
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

  dropDownIcon: {
    height: 19,
    width: 19,
    resizeMode: 'contain',
  },

  fieldContainer: {
    width: '100%',
    marginTop: 10,
  },

  fieldText: {
    color: theme.color.titleGreenForm,
    fontFamily: theme.fonts.fontBold,
    fontSize: 13.5,
  },

  inputConatiner: {
    width: '100%',
    borderWidth: 1,
    borderColor: theme.color.fieldBorder,
    borderRadius: 8,
    height: 45,
    paddingHorizontal: 7,
  },
  input: {
    width: '100%',
    height: 45,
    fontSize: 13,
  },
  inputIcon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  bottomText: {
    color: theme.color.button1,
    fontSize: 12.5,
    fontFamily: theme.fonts.fontMedium,
    textDecorationLine: 'underline',
    textDecorationColor: theme.color.button1,
  },
  bottomText2: {
    fontSize: 12.5,
    color: theme.color.title,
    fontFamily: theme.fonts.fontNormal,
  },

  textArea: {
    width: '100%',
    height: 90,
    backgroundColor: theme.color.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.color.fieldBorder,

    marginBottom: 10,
  },
  textAreaInpt: {
    height: '100%',
    paddingHorizontal: 13,
    textAlignVertical: 'top',
  },
});
