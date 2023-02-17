import {StyleSheet} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  BottomButtonWebViewContainer: {
    width: '100%',
    paddingTop: 3,
    paddingBottom: responsiveHeight(1.5),
    alignItems: 'flex-end',
  },

  BottomButtonwebview: {
    width: responsiveWidth(30),
    height: responsiveHeight(4),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f25526',
    borderRadius: 7,
    marginRight: 15,
  },
  loaderwebview: {
    alignSelf: 'center',
    marginTop: '90%',
    position: 'absolute',
  },
  buttonTextBottomwebview: {
    color: '#fff',
    fontSize: responsiveFontSize(2),
    lineHeight: 19.36,
    fontFamily: 'Inter-Bold',
  },
});
