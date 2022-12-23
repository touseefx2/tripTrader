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

export default memo(Card3);

function Card3({
  item,
  index,
  user,
  props,
  isActive,
  showpic,
  animtntime,
  onClickMessage,
  onClickMakeOffer,
}) {
  const [pvm, setpvm] = useState(false);
  const [pd, setpd] = useState([]);
  const [pdc, setpdc] = useState('');

  let usr = item.hostId;

  if (usr) {
    //user
    let photo = usr?.image || '';
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

    const renderSec2 = () => {
      const renderTripImages = () => {
        let chk =
          tripPhotos.length <= 0
            ? '0'
            : tripPhotos.length == 1
            ? '1'
            : tripPhotos.length > 1
            ? '2'
            : '0';

        return (
          <>
            {chk == '2' && (
              <>
                <View style={styles.tripImageConatiner}>
                  <ImageSlider
                    showHeader={false}
                    preview={true}
                    data={tripPhotos}
                    autoPlay={false}
                    // onItemChanged={indx => console.log('itm chng : ', indx)}
                  />
                </View>
              </>
            )}

            {(chk == '0' || chk == '1') && (
              <>
                <Pressable
                  style={({pressed}) => [
                    {opacity: pressed ? 0.95 : 1.0},
                    [styles.tripImageConatiner],
                  ]}
                  onPress={() => {
                    setpvm(true);
                    setpd(chk == '1' ? tripPhotos[0] : '');
                    setpdc(chk == '1' ? 'tp' : 'ph');
                  }}>
                  <ProgressiveFastImage
                    style={styles.tripImg}
                    source={
                      chk == '1'
                        ? {uri: tripPhotos[0]}
                        : require('../../../assets/images/trip/img.jpeg')
                    }
                    loadingImageStyle={styles.imageLoader2}
                    loadingSource={require('../../../assets/images/imgLoad/img.jpeg')}
                    blurRadius={5}
                  />
                </Pressable>
              </>
            )}
          </>
        );
      };

      return <View style={styles.boxSection2}>{renderTripImages()}</View>;
    };

    const renderSec2c = () => {
      return (
        <View style={styles.boxSection2}>
          <Animatable.Image
            style={[styles.tripImageConatiner]}
            // style={styles.tripImg}
            duration={animtntime}
            easing="ease-out"
            animation={isActive ? 'zoomIn' : false}
            source={require('../../../assets/gif/stl.gif')}
          />
        </View>
      );
    };

    const renderSec3 = () => {
      return (
        <View style={styles.boxSection3}>
          <Animatable.Text
            style={styles.sec3T1}
            duration={animtntime}
            easing="ease-out"
            animation={isActive ? 'zoomIn' : false}>
            {titlee}
          </Animatable.Text>

          <View style={styles.sec3T2Container}>
            <Animatable.Image
              style={{
                width: 20,
                height: 20,
                resizeMode: 'contain',
              }}
              duration={animtntime}
              easing="ease-out"
              animation={isActive ? 'zoomIn' : false}
              source={require('../../../assets/images/location/img.png')}
            />

            <View style={{width: '95%'}}>
              <Animatable.Text
                style={styles.sec3T2}
                duration={animtntime}
                easing="ease-out"
                animation={isActive ? 'zoomIn' : false}>
                {locName}
              </Animatable.Text>
            </View>
          </View>

          <View style={{marginTop: 10}}>
            <Animatable.Text
              style={styles.sec3T31}
              duration={animtntime}
              easing="ease-out"
              animation={isActive ? 'zoomIn' : false}>
              In Return For
            </Animatable.Text>
            <Animatable.Text
              style={styles.sec3T32}
              duration={animtntime}
              easing="ease-out"
              animation={isActive ? 'zoomIn' : false}>
              {trade}
            </Animatable.Text>
          </View>
          <View style={{marginTop: 10}}>
            <Animatable.Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.sec3T31}
              duration={animtntime}
              easing="ease-out"
              animation={isActive ? 'zoomIn' : false}>
              Availability
            </Animatable.Text>
            <Animatable.Text
              style={styles.sec3T32}
              duration={animtntime}
              easing="ease-out"
              animation={isActive ? 'zoomIn' : false}>
              {favlbl}
            </Animatable.Text>
          </View>

          {/* <Text style={styles.sec3T1}>{titlee}</Text> */}
          {/* <View style={styles.sec3T2Container}>
            <Image
              style={styles.sec3Icon}
              source={require('../../assets/images/location/img.png')}
            />
            <View style={{width: '95%'}}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.sec3T2}>
                {locName}
              </Text>
            </View>
          </View> */}
          {/* <View style={{marginTop: 10}}>
            <Text style={styles.sec3T31}>In Return For</Text>
            <Text style={styles.sec3T32}>{trade}</Text>
          </View>
          <View style={{marginTop: 10}}>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.sec3T31}>
              Availability
            </Text>
            <Text style={styles.sec3T32}>{favlbl}</Text>
          </View> */}
        </View>
      );
    };

    const renderSec4 = () => {
      return (
        <View style={styles.boxSection4}>
          <Pressable
            onPress={() => {
              if (store.User.user.subscriptionStatus == 'freemium') {
                props.navigation.navigate('Plan');
              } else {
                onClickMakeOffer(item, index);
              }
            }}
            style={({pressed}) => [
              {opacity: pressed ? 0.9 : 1.0},
              styles.sec4B,
            ]}>
            <Text style={styles.sec4T}>make offer</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              if (store.User.user.subscriptionStatus == 'freemium') {
                props.navigation.navigate('Plan');
              } else {
                onClickMessage(item, index);
              }
            }}
            style={({pressed}) => [
              {opacity: pressed ? 0.9 : 1.0},
              [styles.sec4B, {backgroundColor: theme.color.button2}],
            ]}>
            <Text style={[styles.sec4T, {color: theme.color.subTitle}]}>
              message
            </Text>
          </Pressable>
        </View>
      );
    };

    return (
      <>
        {pvm && (
          <utils.FullimageModal
            data={[]}
            si={0}
            show={pvm}
            pd={pd}
            pdc={pdc}
            closModal={() => {
              setpvm(!pvm);
              setpd('');
              setpdc('');
            }}
          />
        )}
        <Animatable.View
          duration={300}
          transition="backgroundColor"
          style={{
            backgroundColor: isActive
              ? 'rgba(255,255,255,1)'
              : 'rgba(245,252,255,1)',
          }}>
          {isActive && (
            <>
              {!showpic ? renderSec2() : renderSec2c()}
              {renderSec3()}
              {renderSec4()}
            </>
          )}
        </Animatable.View>
      </>
    );
  } else {
    return null;
  }
}
