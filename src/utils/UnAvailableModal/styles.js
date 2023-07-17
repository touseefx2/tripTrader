import {StyleSheet} from 'react-native';
import theme from '../../theme';

export const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
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
  fieldTitle: {
    fontSize: 13,
    color: theme.color.title,
    fontFamily: theme.fonts.fontBold,
  },
  fieldWrapper: {
    marginTop: 15,
    width: '100%',
  },
  fieldContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  dayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  dayCheckBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.color.fieldBorder,
  },
  dayText: {
    color: theme.color.title,
    fontSize: 12,
    fontFamily: theme.fonts.fontNormal,
    textTransform: 'capitalize',
    marginLeft: 7,
  },

  inputContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: theme.color.fieldBorder,
    borderRadius: 8,
    height: 42,
    paddingHorizontal: 7,
    flexDirection: 'row',
    alignItems: 'center',
    ustifyContent: 'space-between',
    marginTop: 5,
  },
  inputText: {
    fontFamily: theme.fonts.fontNormal,
    width: '85%',
    fontSize: 12.5,
  },
  inputIconContainer: {
    width: '13%',
    alignItems: 'flex-end',
  },
  inputIcon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
});
