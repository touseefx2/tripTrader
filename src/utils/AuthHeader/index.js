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

export default observer(AuthHeader);
function AuthHeader(props) {
  let prop = props.props;

  const goBack = () => {
    prop.navigation.goBack();
  };

  const renderLogo = () => {
    return (
      <View style={styles.section1}>
        <Image
          style={styles.logo}
          source={require('../../assets/images/logo/img.png')}
        />
        <Text style={styles.title1}>{store.General.AppName}</Text>
      </View>
    );
  };

  const renderBack = () => {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={goBack}
        style={{position: 'absolute', left: 20}}>
        <utils.vectorIcon.Ionicons
          name={'chevron-back-outline'}
          color={theme.color.buttonText}
          size={25}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.Header}>
      {renderLogo()}
      {renderBack()}
    </View>
  );
}
