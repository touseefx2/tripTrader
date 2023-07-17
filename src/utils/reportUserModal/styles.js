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
  main1: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    width: '100%',
  },

  mProfileImgContainerss: {
    borderColor: theme.color.fieldBorder,
    width: 80,
    height: 80,
    borderRadius: 80 / 2,
    borderWidth: 1,
    borderColor: theme.color.fieldBc,
  },

  mProfileImgss: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: 80 / 2,
  },

  mimageLoader: {
    height: '100%',
    width: '100%',

    borderRadius: 80 / 2,
  },

  textArea: {
    width: '100%',
    height: 150,
    backgroundColor: '#FAFAFA',
    borderRadius: 4,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 5,
  },
  mTextInpt: {
    height: '100%',
    paddingHorizontal: 15,
    textAlignVertical: 'top',
  },
  title1: {
    marginTop: 15,
    fontFamily: theme.fonts.fontBold,
    fontSize: 15,
    color: '#101B10',
    textTransform: 'capitalize',
  },
  title2: {
    fontFamily: theme.fonts.fontNormal,
    fontSize: 13,
    color: theme.color.subTitleLight,
  },
  title3: {
    marginTop: 15,
    fontFamily: theme.fonts.fontNormal,
    fontSize: 14,
    color: '#101B10',
    lineHeight: 20,
    textAlign: 'center',
  },
});
