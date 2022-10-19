import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  StatusBar,
  ScrollView,
  Modal,
  ActivityIndicator,
} from 'react-native';
import {styles} from './styles';
import {observer} from 'mobx-react';
import store from '../../store/index';
import utils from '../../utils/index';
import theme from '../../theme';
import FastImage from 'react-native-fast-image';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-easy-toast';
import MaskedView from '@react-native-community/masked-view';
import Svg, {Path} from 'react-native-svg';
import {responsiveHeight} from 'react-native-responsive-dimensions';
import {Utils} from '@react-native-firebase/app';

export default observer(StackHeader);
function StackHeader(props) {
  let prop = props.props;
  let headerTitle = props.headerTitle || '';
  let bell = props.bell || false;
  let scrn = props.screen || '';
  const goBack = () => {
    prop.navigation.goBack();
  };

  const render1 = () => {
    const onClick = () => {
      goBack();
    };
    let src = require('../../assets/images/back/img.png');
    return (
      <TouchableOpacity activeOpacity={0.5} onPress={onClick}>
        <Image
          source={src}
          style={{
            width: 20,
            height: 20,
            resizeMode: 'contain',
          }}
        />
      </TouchableOpacity>
    );
  };

  const render2 = () => {
    return (
      <View style={{width: '76%'}}>
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.headerTitle}>
          {headerTitle}
        </Text>
      </View>
    );
  };

  const render3 = () => {
    const onClick = () => {
      prop.navigation.navigate('Notifications', {screen: scrn});
    };
    return (
      // <View style={{width: 22}} />
      <TouchableOpacity
        onPress={onClick}
        disabled={headerTitle == 'Notifications' ? true : false}
        activeOpacity={0.5}>
        <utils.vectorIcon.SimpleLineIcons
          name="bell"
          color={theme.color.backgroundGreenText}
          size={23}
        />
        <View
          style={{
            width: 8,
            height: 8,
            borderRadius: 8 / 2,
            position: 'absolute',
            right: 0,
            top: 2,
            backgroundColor: theme.color.ntfctnClr,
          }}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.headerConatainer}>
      {render1()}
      {render2()}
      {bell && render3()}
    </View>
  );
}
