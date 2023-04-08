import React, {useEffect, useState, useRef, memo} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TouchableHighlight,
  StatusBar,
  BackHandler,
  Alert,
  Linking,
  PermissionsAndroid,
  Platform,
  Dimensions,
  Pressable,
  TextInput,
  FlatList,
  ScrollView,
  Keyboard,
  Modal,
} from 'react-native';
import ProgressiveFastImage from '@freakycoder/react-native-progressive-fast-image';
// import ImageSlider from 'react-native-image-slider';
import {styles} from './styles';
import {observer} from 'mobx-react';
import store from '../../../../store/index';
import utils from '../../../../utils/index';
import theme from '../../../../theme';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-easy-toast';
import {ActivityIndicator} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import {ImageSlider} from 'react-native-image-slider-banner';
import {Calendar} from 'react-native-calendars';
import moment from 'moment';
import Accordion from 'react-native-collapsible/Accordion';
import * as Animatable from 'react-native-animatable';
import {FlashList} from '@shopify/flash-list';

export default memo(Card2);

function Card2({item, index, props}) {
  let title = item.tradeType || '';
  let offer = item.title || '';
  let trade = item.returnActivity || '';
  let availability = item.availableFrom || '';
  let status = item.status || '';
  let c = status == 'suspended' ? true : false;
  let tc = theme.color.boxTitle;

  return (
    <>
      <View style={{paddingHorizontal: 12}}>
        <Text
          style={[styles.title1, {color: !c ? tc : theme.color.subTitleLight}]}>
          {title} Trip
          {c && (
            <Text style={styles.title11}>
              {'  '}({status})
            </Text>
          )}
        </Text>
      </View>
    </>
  );
}
