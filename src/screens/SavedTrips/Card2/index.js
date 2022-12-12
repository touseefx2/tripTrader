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

export default memo(Card2);

function Card2({item, index, user, props, onClickremoveTrips}) {
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

  const renderSec1 = () => {
    const renderProfile = () => {
      return (
        <View style={styles.ProfileImgContainer}>
          <ProgressiveFastImage
            style={styles.ProfileImg}
            source={
              photo != ''
                ? {uri: photo}
                : require('../../../assets/images/drawer/guest/img.png')
            }
            loadingImageStyle={styles.imageLoader}
            loadingSource={require('../../../assets/images/imgLoad/img.jpeg')}
            blurRadius={5}
          />
          {isVeirfy && (
            <Image
              style={styles.iconVerify}
              source={require('../../../assets/images/verified/img.png')}
            />
          )}
        </View>
      );
    };

    const renderText = () => {
      return (
        <View style={styles.textContainer}>
          <Pressable
            onPress={() => {
              if (user == 'guest') {
                return;
              }

              store.Userv.setfscreen('savedtrips');
              store.Userv.setUser(usr);
              store.Userv.addauthToken(store.User.authToken);
              props.navigation.navigate('UserProfile');
            }}
            style={({pressed}) => [{opacity: pressed ? 0.7 : 1.0}]}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.textContainertitle}>
              {userName}
            </Text>
          </Pressable>

          <View style={{flexDirection: 'row', marginTop: 2}}>
            <utils.vectorIcon.Entypo
              name="star"
              color={theme.color.rate}
              size={14}
            />
            <Text style={styles.textContainerRatetitle1}>
              {' '}
              {avgRating > 0 ? avgRating.toFixed(1) : avgRating}
              {'  '}
            </Text>
            <Text style={styles.textContainerRatetitle2}>
              {totalReviews > 300 ? '300+' : totalReviews} reviews
            </Text>
          </View>
        </View>
      );
    };

    const rendericon = () => {
      return (
        <Pressable
          onPress={() => {
            // if (store.User.user.subscriptionStatus == 'freemium') {
            //   props.navigation.navigate('Plan');
            // } else {
            onClickremoveTrips(item, index);
            // }
          }}
          style={({pressed}) => [
            {opacity: pressed ? 0.7 : 1.0},
            styles.iconContainer,
          ]}>
          <Image
            style={styles.iconSave}
            source={require('../../../assets/images/delSave/img.png')}
          />
        </Pressable>
      );
    };

    return (
      <View style={styles.boxSection1}>
        {renderProfile()}
        {renderText()}
        {rendericon()}
      </View>
    );
  };

  return (
    <>
      <View>{renderSec1()}</View>
    </>
  );
}
