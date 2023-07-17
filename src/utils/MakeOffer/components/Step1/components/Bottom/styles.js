import {StyleSheet} from 'react-native';
import theme from '../../../../../../theme';

export const styles = StyleSheet.create({
  modalBottomContainer: {
    paddingTop: 10,
    paddingBottom: 15,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalBottomContainer2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ButtonContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.color.button1,
  },
  ButtonText: {
    fontSize: 12.5,
    color: theme.color.buttonText,
    fontFamily: theme.fonts.fontBold,
    textTransform: 'capitalize',
  },
  bottomMax: {
    backgroundColor: theme.color.background,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: -1}, // change this for more shadow
    shadowOpacity: 0.1,
    elevation: 5,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginTop: 5,
  },
  bottom: {
    marginTop: 30,
  },
});
