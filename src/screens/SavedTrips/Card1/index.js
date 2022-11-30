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
import store from '../../../store/index';
import utils from '../../../utils/index';
import theme from '../../../theme';
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

function Card1({item, isActive}) {
  let usr = item.hostId;
  //user
  let photo = usr.image || '';
  let userName = usr.firstName + ' ' + usr.lastName;
  let avgRating = usr.rating || 0;
  let totalReviews = usr.reviews || 0;
  let isVeirfy = usr.identityStatus == 'verified' ? true : false;

  //trip
  let status = item.status || '';
  let tripPhotos = item.photos ? item.photos : [];
  let titlee = item.title || '';
  let locName = item.location.city + ', ' + item.location.state;
  let trade = item.returnActivity || '';
  let sd = item.availableFrom;
  let sdy = parseInt(new Date(sd).getFullYear());
  let ed = item.availableTo;
  let edy = parseInt(new Date(ed).getFullYear());
  let favlbl = '';

  if (sdy == edy) {
    favlbl =
      moment(sd).format('MMM DD') + ' - ' + moment(ed).format('MMM DD, YYYY');
  } else {
    favlbl =
      moment(sd).format('MMM DD, YYYY') +
      ' - ' +
      moment(ed).format('MMM DD, YYYY');
  }

  const renderSec3c = () => {
    return (
      <View
        style={{
          width: '100%',
          marginTop: 12,
        }}>
        {/* <View
          style={{
            width: '100%',
            alignSelf: 'center',
            height: 0.7,
            backgroundColor: theme.color.fieldBorder,
          }}
        /> */}

        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 10,
            // marginTop: 10,
          }}>
          <View style={{width: '90%'}}>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.sec3T1}>
              {titlee}
            </Text>
            <View style={styles.sec3T2Container}>
              <Image
                style={styles.sec3Icon}
                source={require('../../../assets/images/location/img.png')}
              />
              <View style={{width: '95%'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles.sec3T2}>
                  {locName}
                </Text>
              </View>
            </View>
          </View>

          <utils.vectorIcon.Entypo
            name="chevron-small-down"
            color={theme.color.subTitleLight}
            size={22}
          />
        </View>

        <View style={{marginTop: 10, paddingHorizontal: 10}}>
          <Text style={styles.sec3T31}>In Return For</Text>
          <Text style={styles.sec3T32}>{trade}</Text>
        </View>
        {/* <View style={{marginTop: 10}}>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.sec3T31}>
            Availability
          </Text>
          <Text style={styles.sec3T32}>{favlbl}</Text>
        </View> */}
      </View>
    );
  };

  return <View>{!isActive && renderSec3c()}</View>;
}
