import {Dimensions, Platform, StatusBar} from 'react-native';
import {responsiveHeight} from 'react-native-responsive-dimensions';
const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;
const STATUSBAR_HEIGHT = StatusBar.currentHeight;
const APPBAR_HEIGHT =
  Platform.OS === 'ios' ? responsiveHeight(6.1) : responsiveHeight(7.7);

export default window = {
  Width,
  Height,
  STATUSBAR_HEIGHT,
  APPBAR_HEIGHT,
};
