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
  RefreshControl,
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
import moment, {duration} from 'moment/moment';
import {SwipeListView} from 'react-native-swipe-list-view';

function compare(d, dd) {
  let d1 = moment(d).format('YYYY-MM-DD');
  let d2 = moment(dd).format('YYYY-MM-DD');
  if (d2 > d1) {
    return 'greater';
  } else if (d2 < d1) {
    return 'smaller';
  } else {
    return 'equal';
  }
}

function diff_minutes(dt2, dt1) {
  var diff = (dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60;
  return Math.abs(Math.round(diff));
}

function CheckDate(d) {
  let t = '';
  let ud = new Date(d); //update date
  let cd = new Date(); //current date

  let udcy = false; //is update date  current year
  let udy = parseInt(ud.getFullYear());
  let cdy = parseInt(cd.getFullYear());
  if (udy == cdy) {
    udcy = true;
  }
  // && min < 1440 // 1 daya minure
  let sd = ud; //start date
  let ed = cd; //end date
  let ics = compare(sd, ed); //is check date
  // console.log('updated date : ', moment(ud).format('YYYY-MM-DD hh:mm:ss a'));
  // console.log('currentdate : ', moment(cd).format('YYYY-MM-DD hh:mm:ss a'));
  // console.log('ics ', ics);

  if (ics == 'greater') {
    if (udcy) {
      t = moment(ud).format('MMM DD');
    } else {
      t = moment(ud).format('MMM DD, YYYY');
    }
  } else {
    let min = diff_minutes(ed, sd);
    // console.log('minutes: ', min);
    // if (min >= 0 && min <= 1) {
    // t = 'Just now';
    // } else if (min > 1) {
    t = moment(ud).format('hh:mm a');
    // }
  }

  return t;
}

export default memo(Card);

function Card({
  item,
  index,
  refreshing,
  data,
  user,
  props,
  setsearch,
  closeSwipe,
}) {
  let guest = require('../../../assets/images/drawer/guest/img.png');

  let isendmymsg = false;

  let uid = user._id;
  let u = false;
  if (item.userId1 && item.userId1._id != uid) {
    u = item.userId1;
  }
  if (item.userId2 && item.userId2._id != uid) {
    u = item.userId2;
  }

  let photo = u.image && u.image != '' ? {uri: u.image} : guest;
  let title = u.firstName + ' ' + u.lastName;
  let subtitle = '';
  let create = CheckDate(item.updatedAt);
  let isread = false;
  let type = '';

  if (item.latestMessage) {
    let d = item.latestMessage;
    type = d.type;
    subtitle = d.message;
    isendmymsg = d.sendBy._id == uid ? true : false;
    if (!isendmymsg) {
      isread = d.isRead;
    } else {
      isread = true;
    }
  }

  // console.log('item : ', item);
  // console.log('isendmymsg : ', isendmymsg);
  // console.log('isread : ', isread);
  // console.log('item : ', item.latestMessage);

  const renderProfile = () => {
    return (
      <>
        <View style={styles.mProfileImgContainer}>
          <ProgressiveFastImage
            style={styles.mProfileImg}
            source={photo}
            loadingImageStyle={styles.mimageLoader}
            loadingSource={require('../../../assets/images/imgLoad/img.jpeg')}
            blurRadius={5}
          />
        </View>
      </>
    );
  };

  const renderText = () => {
    let st = '';
    if (type) {
      if (type == 'text') st = subtitle;
      else st = type;
    } else {
      st = subtitle;
    }

    return (
      <View style={[styles.mtextContainer]}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{width: '69%'}}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                color: '#101B10',
                fontSize: 16,
                fontFamily: theme.fonts.fontBold,
                lineHeight: 22.4,
                textTransform: 'capitalize',
              }}>
              {title}
            </Text>
          </View>
          <View
            style={{
              width: '29%',

              alignItems: 'flex-end',
            }}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                color: isread ? theme.color.subTitleLight : '#3C6B49',
                fontSize: 13,

                fontFamily: theme.fonts.fontMedium,

                lineHeight: 22.4,
              }}>
              {create}
            </Text>
          </View>
        </View>

        <View style={{marginTop: 3, width: '91%'}}>
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={{
              color: isread ? theme.color.subTitleLight : '#101B10',
              fontSize: 14,

              fontFamily: theme.fonts.fontMedium,

              lineHeight: 21,
            }}>
            {st}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <Pressable
      // disabled={refreshing}

      onPress={() => {
        console.log('item : ', item.latestMessage.message);
        closeSwipe();
        store.User.setmessages([]);
        store.User.setpasObj({
          obj: item,
          title: title,
          rid: u._id,
          ruser: u,
        });
        props.navigation.navigate('Chat');
        setsearch('');
      }}
      style={({pressed}) => [
        {opacity: pressed ? 1 : 1.0},
        [
          styles.modalinfoConatiner,
          {
            borderBottomWidth: index == data.length - 1 ? 0.7 : 0,
            borderBottomColor: theme.color.fieldBorder,
            backgroundColor: isread ? theme.color.background : '#EAF1E3',
          },
        ],
      ]}>
      {renderProfile()}
      {renderText()}
    </Pressable>
  );
}
