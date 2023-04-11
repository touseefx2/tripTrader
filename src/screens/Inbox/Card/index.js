import React, {memo} from 'react';
import {View, Text, Pressable} from 'react-native';
import ProgressiveFastImage from '@freakycoder/react-native-progressive-fast-image';
// import ImageSlider from 'react-native-image-slider';
import {styles} from './styles';

import store from '../../../store/index';

import theme from '../../../theme';

import moment from 'moment';

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

function dateConvert(timestamp) {
  const date = new Date(
    timestamp?.seconds * 1000 + timestamp?.nanoseconds / 1000000,
  );

  return new Date(date.getTime());
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
  const guest = require('../../../assets/images/drawer/guest/img.png');
  const currentUserId = user._id;
  let userObj = null;
  let photo = guest;
  let title = 'Trip Trader User';
  let subtitle = '---';
  let create = '';
  let isread = true;
  let type = '';

  if (item.userId1 && item.userId1._id != currentUserId) {
    userObj = item.userId1;
  }
  if (item.userId2 && item.userId2._id != currentUserId) {
    userObj = item.userId2;
  }

  if (userObj) {
    photo =
      userObj?.image && userObj.image != '' ? {uri: userObj.image} : guest;
    title = userObj.firstName + ' ' + userObj.lastName;
  }

  if (item?.latestMessage) {
    const latestMessage = item.latestMessage;
    create = CheckDate(new Date());
    const date = latestMessage.updatedAt || null;

    if (date != null) {
      try {
        create = CheckDate(dateConvert(date));
      } catch (error) {}
    }
    type = latestMessage.type;
    subtitle = latestMessage.message;
    let isEndMyMsg = false;
    if (latestMessage.user) {
      isEndMyMsg = latestMessage.user?._id == currentUserId ? true : false;
    }

    if (!isEndMyMsg) {
      isread = latestMessage.isRead;
    }
  }

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
      // disabled={userObj ? false : true}
      onPress={() => {
        closeSwipe();
        store.User.setmessages([]);
        store.User.setpasObj({
          obj: item,
          title: title,
          rid: userObj?._id || '',
          ruser: userObj,
          rBlockArr: userObj?.followers || [],
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
