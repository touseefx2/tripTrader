import React, {useEffect, useState, useRef} from 'react';
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
import store from '../../store/index';
import utils from '../../utils/index';
import theme from '../../theme';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-easy-toast';
import {ActivityIndicator} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import {ImageSlider} from 'react-native-image-slider-banner';
import {Calendar} from 'react-native-calendars';
import moment, {duration} from 'moment/moment';

export default observer(NotificationsGuest);

function ListHeaders({search, setsearch, data}) {
  const renderResult = () => {
    let length = data.length || 0;
    return (
      <View style={styles.resultContainer}>
        <Text style={styles.resultText}>
          {length} notifications, {store.Notifications.unread} unread
        </Text>
      </View>
    );
  };

  const renderSearch = () => {
    return (
      <TouchableOpacity disabled>
        <Image
          source={require('../../assets/images/searchBar/search/img.png')}
          style={styles.Baricon}
        />
      </TouchableOpacity>
    );
  };

  const renderInput = () => {
    return (
      <View style={{width: '85%'}}>
        <TextInput
          onChangeText={c => {
            setsearch(c);
          }}
          value={search}
          style={styles.SerchBarInput}
          placeholder="Search"
        />
      </View>
    );
  };

  const renderFilter = () => {
    const onclick = () => {};

    return (
      <TouchableOpacity style={styles.Baricon} onPress={onclick} disabled>
        {/* <Image
          source={require('../../assets/images/searchBar/filter/img.png')}
          style={styles.Baricon}
        /> */}
      </TouchableOpacity>
    );
  };

  return (
    <View style={{marginHorizontal: 15}}>
      <Pressable
        style={({pressed}) => [
          {opacity: pressed ? 0.9 : 1},
          [styles.SerchBarContainer],
        ]}>
        {renderSearch()}
        {renderInput()}
        {renderFilter()}
      </Pressable>
      {data.length > 0 && renderResult()}
    </View>
  );
}

function NotificationsGuest(props) {
  let headerTitle = 'Notifications';

  let internet = store.General.isInternet;
  let user = store.User.user;

  let db = false;
  let previousScreen = props.route.params.screen || '';
  if (previousScreen == 'userprofile' || previousScreen == 'followers') {
    db = true;
  }

  const data = store.Notifications.notifications;

  const [getDataOnce, setgetDataOnce] = useState(true);
  const [refreshing, setrefreshing] = useState(false);
  const onRefresh = React.useCallback(() => {}, []);
  const [search, setsearch] = useState('');

  const JoinNow = () => {
    store.General.setgoto('joinnow');
    store.User.Logout();
  };

  const ItemSeparatorView = () => {
    return (
      <View
        style={{
          height: 0.7,
          backgroundColor: theme.color.fieldBorder,
          width: '100%',
        }}
      />
    );
  };

  const EmptyListMessage = ({item}) => {
    return (
      // Flat List Item
      <>
        {!refreshing && getDataOnce && (
          <Text
            style={{
              marginTop: '75%',
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'center',
              fontSize: 13,
              color: theme.color.subTitleLight,
              fontFamily: theme.fonts.fontMedium,
            }}>
            No any notifications
          </Text>
        )}
      </>
    );
  };

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
    console.log('updated date : ', moment(ud).format('YYYY-MM-DD hh:mm:ss a'));
    console.log('currentdate : ', moment(cd).format('YYYY-MM-DD hh:mm:ss a'));

    if (ics == 'greater') {
      var start = moment(moment(ed).format('YYYY-MM-DD'), 'YYYY-MM-DD');
      var end = moment(moment(sd).format('YYYY-MM-DD'), 'YYYY-MM-DD');
      let days = start.diff(end, 'days');

      if (days > 3) {
        if (udcy) {
          t = moment(ud).format('MMM DD');
        } else {
          t = moment(ud).format('MMM DD, YYYY');
        }
      } else {
        if (days == 1 || days == 0) {
          t = '1 day ago';
        }

        if (days == 2) {
          t = '2 days ago';
        }

        if (days == 3) {
          t = '3 days ago';
        }
      }
    } else {
      let min = diff_minutes(ed, sd);
      console.log('minutes: ', min);
      if (min >= 0 && min <= 1) {
        t = 'Just now';
      } else {
        if (min > 1 && min < 60) {
          t = min + ' mins ago';
        } else if (min >= 60) {
          const hours = Math.floor(min / 60);

          const h = hours.toFixed(0);
          let tt = h <= 1 ? ' hour' : ' hours';
          t = h + tt + ' ago';

          // t = moment(ud).format('hh:mm a');
        }
      }
    }

    return t;
  }

  const ItemView2 = ({item, index}) => {
    // let tripConf = require('../../assets/images/notification/TripConfirmed/img.png');
    // let tripCrt = require('../../assets/images/notification/TripCreated/img.png');
    let profileupd = require('../../assets/images/notification/ProfileUpdated/img.png');
    let pswdchng = require('../../assets/images/notification/PasswordChanged/img.png');
    // let guest = require('../../assets/images/drawer/guest/img.png');
    let ntfctn = require('../../assets/images/drawer/guest/img.png');

    let title = item.title || '';
    let subtitle = item.message || '';
    let topic = item.topic || '';
    let create = CheckDate(item.createdAt);
    let isread = item.isRead || false;
    let c = false;

    if (topic == 'fullaccess') {
      c = true;
    }

    let photo =
      title == 'Get full access for free'
        ? pswdchng
        : title == 'Welcome to Trip Trader!'
        ? profileupd
        : ntfctn;

    const renderProfile = () => {
      return (
        <>
          <View style={[styles.mProfileImgContainer2]}>
            <Image style={styles.mProfileImg2} source={photo} />
          </View>
        </>
      );
    };

    const renderText = () => {
      return (
        <View style={[styles.mtextContainer]}>
          <Text
            style={{
              color: '#101B10',
              fontSize: 16,
              fontFamily: theme.fonts.fontBold,
              lineHeight: 22.4,
              textTransform: 'capitalize',
            }}>
            {title}
          </Text>

          {subtitle != '' && (
            <View style={{marginTop: 3}}>
              <Text
                style={{
                  color: ' #101B10',
                  fontSize: 14,

                  fontFamily: theme.fonts.fontNormal,

                  lineHeight: 21,
                }}>
                {subtitle}{' '}
                {c && (
                  <Text
                    onPress={JoinNow}
                    style={{
                      color: theme.color.title,
                      fontSize: 14,
                      textDecorationLine: 'underline',
                      fontFamily: theme.fonts.fontBold,

                      lineHeight: 21,
                    }}>
                    Join now
                  </Text>
                )}
              </Text>
            </View>
          )}

          <View style={{marginTop: 3}}>
            <Text
              style={{
                color: isread ? theme.color.subTitleLight : '#3C6B49',
                fontSize: 13,

                fontFamily: theme.fonts.fontMedium,

                lineHeight: 19.5,
              }}>
              {create}
            </Text>
          </View>
        </View>
      );
    };

    return (
      <View
        style={[
          styles.modalinfoConatiner,
          {
            marginTop: index == 0 ? 15 : 0,
            borderBottomWidth: index == data.length - 1 ? 0.7 : 0,
            borderBottomColor: theme.color.fieldBorder,
            backgroundColor: isread ? theme.color.background : '#EAF1E3',
          },
        ]}>
        {renderProfile()}
        {renderText()}
      </View>
    );
  };

  return (
    <>
      <View style={styles.container}>
        <utils.StackHeader
          bell={true}
          props={props}
          headerTitle={headerTitle}
        />
        {!internet && <utils.InternetMessage />}
        <SafeAreaView style={styles.container2}>
          <View style={styles.container3}>
            <FlatList
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              contentContainerStyle={{
                paddingTop: 12,
                paddingBottom: 40,
              }}
              data={data}
              renderItem={ItemView2}
              keyExtractor={(item, index) => index.toString()}
              ListEmptyComponent={EmptyListMessage}
              ItemSeparatorComponent={ItemSeparatorView}
              ListHeaderComponent={
                data.length > 0 ? (
                  <ListHeaders
                    search={search}
                    setsearch={c => setsearch(c)}
                    data={data}
                  />
                ) : null
              }
              // ListFooterComponent={data.length > 0 ? ListFooter : null}
            />
          </View>

          <utils.Footer
            doubleBack={db}
            nav={props.navigation}
            screen={headerTitle}
            focusScreen={store.General.focusScreen}
          />
        </SafeAreaView>
      </View>
    </>
  );
}