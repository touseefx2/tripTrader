import React, {useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import theme from '../theme/index';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import utils from '.';
import ProgressiveFastImage from '@freakycoder/react-native-progressive-fast-image';
import store from '../store/index';
import {observer} from 'mobx-react';
import NetInfo from '@react-native-community/netinfo';
import RBSheet from 'react-native-raw-bottom-sheet';

const screenHeight = Dimensions.get('screen').height;
const windowHeight = Dimensions.get('window').height;
const navbarHeight = screenHeight - windowHeight + StatusBar.currentHeight + 25;

export default function navBarHeight(props) {
  return (
    <View
      style={{
        // backgroundColor: '#f7f7f7',
        width: '100%',
        height: navbarHeight,
      }}
    />
  );
}
