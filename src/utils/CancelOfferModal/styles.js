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

  modalinfoConatiner: {
    width: '100%',
    marginTop: 12,
    padding: 10,
  },
  modalInfoText: {
    fontSize: 17,
    color: theme.color.title,
    fontFamily: theme.fonts.fontNormal,
    textAlign: 'center',
  },
});
