import React from 'react';
import {View, StatusBar, Dimensions} from 'react-native';

const screenHeight = Dimensions.get('screen').height;
const windowHeight = Dimensions.get('window').height;
const navbarHeight = screenHeight - windowHeight + StatusBar.currentHeight + 25;

export default function navBarHeight(props) {
  return (
    <View
      style={{
        width: '100%',
        height: navbarHeight,
      }}
    />
  );
}
