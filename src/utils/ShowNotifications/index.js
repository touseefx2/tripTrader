import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  TextInput,
  Pressable,
  FlatList,
} from 'react-native';
import {styles} from './styles';
import {observer} from 'mobx-react';
import Modal from 'react-native-modal';
import store from '../../store/index';
import utils from '../index';
import theme from '../../theme';
import FastImage from 'react-native-fast-image';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-easy-toast';
import MaskedView from '@react-native-community/masked-view';
import Svg, {Path} from 'react-native-svg';
import {responsiveHeight} from 'react-native-responsive-dimensions';
import {Utils} from '@react-native-firebase/app';

export default observer(ShowNotifications);

function ShowNotifications(props) {
  let title = store.Notifications.NotifcationTitle || 'as askas lkasjklas';

  useEffect(() => {
    console.log('Show Notification Call');
    setTimeout(() => {
      store.Notifications.clearShowNotifications();
    }, 2000);

    return () => {
      store.Notifications.clearShowNotifications();
    };
  }, []);

  return (
    <>
      <View
        style={{
          width: '100%',
          backgroundColor: 'white',

          paddingHorizontal: 15,
          paddingVertical: 10,
          position: 'absolute',
          top: 0,
          borderWidth: 1,
          borderColor: theme.color.fieldBorder,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.3,
          shadowRadius: 4.65,
          elevation: 8,
        }}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{width: '15%'}}>
            <Image
              style={{width: 48, height: 48}}
              source={require('../../assets/gif/notify.gif')}
            />
          </View>

          <View style={{width: '83%', justifyContent: 'center'}}>
            <Text
              numberOfLines={2}
              ellipsizeMode="tail"
              style={{
                fontSize: 16,

                color: theme.color.title,
                fontFamily: theme.fonts.fontNormal,
              }}>
              {title}
            </Text>
          </View>
        </View>
      </View>
    </>
  );
}
