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

  modalFieldConatiner: {
    width: '100%',
    marginTop: 15,
  },
  modalFieldWrapper1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mT1: {
    fontSize: 14,
    color: theme.color.subTitle,
    fontFamily: theme.fonts.fontNormal,
  },

  profileConatiner: {
    width: '89%',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },

  mProfileImgContainerm: {
    width: 35,
    height: 35,
    borderRadius: 35 / 2,
    borderWidth: 1,
    borderColor: theme.color.photoBorderColor,
  },
  mProfileImgm: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: 35 / 2,
  },

  mimageLoaderm: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
    borderRadius: 35 / 2,
  },
  miconVerifym: {
    width: 16,
    height: 16,
    position: 'absolute',
    resizeMode: 'contain',
    bottom: -5,
    right: -5,
  },
  mT2: {
    fontSize: 14.5,
    color: theme.color.boxTitle,
    fontFamily: theme.fonts.fontBold,
    lineHeight: 22.5,
    textTransform: 'capitalize',
    width: '82%',
  },

  textArea: {
    width: '100%',
    height: 200,
    backgroundColor: '#FAFAFA',
    borderRadius: 4,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  mTextInpt: {
    height: '100%',
    paddingHorizontal: 15,
    textAlignVertical: 'top',
  },
});
