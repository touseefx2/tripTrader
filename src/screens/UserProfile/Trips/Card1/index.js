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
import moment from 'moment/moment';
import Accordion from 'react-native-collapsible/Accordion';
import * as Animatable from 'react-native-animatable';
import {FlashList} from '@shopify/flash-list';

export default memo(Card1);

function Card1({item, index, isActive, props}) {
  let title = item.tradeType || '';
  let offer = item.title || '';
  let trade = item.returnActivity || '';

  let status = item.status || '';
  let c = status == 'suspended' ? true : false;
  let tc = theme.color.boxTitle;

  let sd = item.availableFrom;
  let sdy = parseInt(new Date(sd).getFullYear());
  let ed = item.availableTo;
  let edy = parseInt(new Date(ed).getFullYear());
  let availability = '';
  if (sdy == edy) {
    availability =
      moment(sd).format('MMM DD') + ' - ' + moment(ed).format('MMM DD, YYYY');
  } else {
    availability =
      moment(sd).format('MMM DD, YYYY') +
      ' - ' +
      moment(ed).format('MMM DD, YYYY');
  }

  return (
    <>
      <View style={{paddingHorizontal: 12}}>
        {!isActive && (
          <>
            <View style={styles.field}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.filedTitle}>
                Offering
              </Text>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[
                  styles.filedTitle2,
                  {color: !c ? tc : theme.color.subTitleLight},
                ]}>
                {offer}
              </Text>
            </View>

            <View style={styles.field}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.filedTitle}>
                for trade
              </Text>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[
                  styles.filedTitle2,
                  {color: !c ? tc : theme.color.subTitleLight},
                ]}>
                {trade}
              </Text>
            </View>

            <View style={styles.fieldContainer}>
              <View style={{width: '60%'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles.filedTitle}>
                  TRIP AVAILABILITY
                </Text>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={[
                    styles.filedTitle2,
                    {color: !c ? tc : theme.color.subTitleLight},
                  ]}>
                  {availability}
                </Text>
              </View>
              <View
                // style={({pressed}) => [
                //   {opacity: pressed ? 0.8 : 1.0},
                //   styles.buttonContainer,
                // ]}
                style={[styles.buttonContainer]}
                // onPress={() => {}}
              >
                <Text style={styles.buttonText}>View Trip</Text>
              </View>
            </View>
          </>
        )}
      </View>
    </>
  );
}
