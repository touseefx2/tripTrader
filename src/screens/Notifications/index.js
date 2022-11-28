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
import {FlashList} from '@shopify/flash-list';

export default observer(Notifications);

function ItemSeparatorView() {
  return (
    <View
      style={{
        height: 0.7,
        backgroundColor: theme.color.fieldBorder,
        width: '100%',
      }}
    />
  );
}

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
        ]}
        // onPress={onclickSearchBar}
      >
        {renderSearch()}
        {renderInput()}
        {renderFilter()}
      </Pressable>
      {data.length > 0 && renderResult()}
    </View>
  );
}

function ListFooter({data, d, loadMore, LoadMore}) {
  return (
    <>
      <View style={styles.listFooter}>
        {data.length == d && (
          <Text style={styles.listFooterT}>End of messages</Text>
        )}

        {data.length < d && (
          <View
            style={[
              styles.listFooter,
              {flexDirection: 'row', alignItems: 'center'},
            ]}>
            <TouchableOpacity
              activeOpacity={0.7}
              disabled={loadMore}
              onPress={LoadMore}>
              <Text style={styles.listFooterT}>Load More...</Text>
            </TouchableOpacity>
            {loadMore && (
              <ActivityIndicator
                style={{marginLeft: 10}}
                size={16}
                color={theme.color.button1}
              />
            )}
          </View>
        )}
      </View>
    </>
  );
}

function EmptyListMessage() {
  return (
    // Flat List Item
    <>
      <Text
        style={{
          marginTop: '25%',
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'center',
          fontSize: 13,
          color: theme.color.subTitleLight,
          fontFamily: theme.fonts.fontMedium,
        }}>
        No Notifications Found
      </Text>
    </>
  );
}

function Notifications(props) {
  let headerTitle = 'Notifications';

  let internet = store.General.isInternet;
  let user = store.User.user;

  let db = false;
  let previousScreen = props.route.params.screen || '';
  if (previousScreen == 'userprofile' || previousScreen == 'followers') {
    db = true;
  }
  const d = store.Notifications.notifications;
  const td = store.Notifications.notificationsTotal;

  let limit = 16;
  const [page, setpage] = useState(1);
  const [loadFirst, setloadFirst] = useState(false);

  const [loadMore, setloadMore] = useState(false);
  const [data, setdata] = useState(d);

  const [getDataOnce, setgetDataOnce] = useState(false);
  const setGetDataOnce = C => {
    setgetDataOnce(C);
  };
  const refreshing = store.Notifications.Loader;
  const onRefresh = React.useCallback(() => {
    console.log('onrefresh cal');
    getDbData();
  }, []);
  const getDbData = () => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        store.Notifications.attemptToGetNotifications(user._id, setGetDataOnce);
      }
    });
  };
  useEffect(() => {
    if (!getDataOnce && internet) {
      onRefresh();
    }
    return () => {};
  }, [getDataOnce, internet]);

  const [search, setsearch] = useState('');

  const goBack = () => {
    props.navigation.goBack();
  };

  const LoadMore = async () => {
    // setloadMore(true);
    // setTimeout(() => {
    //   let p = page + 1;
    //   let ar = [...d];
    //   const dt = ar.slice(page * limit, limit * p);
    //   let dd = [...data, ...dt];
    //   console.log('pagination callllll load more : ', page * limit, limit * p);
    //   setdata(dd);
    //   setpage(p);
    //   setloadMore(false);
    // }, 1);
  };

  const getFollowers = () => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        store.User.attemptToGetFollowers(
          store.User.user._id,
          () => {},
          () => {},
        );
      }
    });
  };
  const ReadNotification = nid => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        store.Notifications.attemptToReadNotifications(nid);
      }
    });
  };

  const onclickNotification = (c, nid) => {
    Keyboard.dismiss();

    if (c == 'Trip Confirmed') {
      props.navigation.navigate('ConfirmedTrips');
      goBack();
      ReadNotification(nid);
    }

    if (c == 'New Trip Created') {
      props.navigation.navigate('MyProfile');
      goBack();
      ReadNotification(nid);
    }

    if (c == 'Profile Updated') {
      props.navigation.navigate('MyProfile');
      goBack();
      ReadNotification(nid);
    }

    if (c == 'Password Changed') {
      props.navigation.navigate('MyProfile');
      goBack();
      ReadNotification(nid);
    }

    if (c == 'profile') {
      props.navigation.navigate('MyProfile');
      goBack();
      getFollowers();
      ReadNotification(nid);
    }
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

  const ItemView = ({item, index}) => {
    let photo = item.icon || '';
    let title = item.title || '';
    let subtitle = item.message || '';
    let create = CheckDate(item.createdAt);
    let isread = item.isRead || false;
    let isFollow = false;
    let uname = '';
    let usrd = item.userId;

    if (subtitle.includes('followed')) {
      isFollow = true;
      uname = 'Nasreen malik';
      // usrd.firstName + ' ' + usrd.lastName;
    }

    const renderProfile = () => {
      return (
        <>
          <View style={styles.mProfileImgContainer}>
            <ProgressiveFastImage
              style={[
                styles.mProfileImg,

                {
                  borderRadius: isFollow ? 32 / 2 : 0,
                  width: isFollow ? 32 : 27,
                  height: isFollow ? 32 : 27,
                },
              ]}
              source={
                photo != ''
                  ? {uri: photo}
                  : require('../../assets/images/drawer/guest/img.png')
              }
              loadingImageStyle={
                Platform.OS == 'android'
                  ? [styles.imageLoader, {borderRadius: isFollow ? 32 / 2 : 0}]
                  : {}
              }
              loadingSource={require('../../assets/images/imgLoad/img.jpeg')}
              blurRadius={5}
            />
          </View>
        </>
      );
    };

    const renderText = () => {
      return (
        <View style={[styles.mtextContainer]}>
          {isFollow && (
            <Text
              style={{
                color: '#3C6B49',
                fontSize: 16,
                fontFamily: theme.fonts.fontBold,
                lineHeight: 22.4,
                textTransform: 'capitalize',
              }}>
              {uname}{' '}
              <Text
                style={{
                  color: '#101B10',
                  fontSize: 16,
                  fontFamily: theme.fonts.fontBold,
                  lineHeight: 22.4,
                  textTransform: 'none',
                }}>
                followed you
              </Text>
            </Text>
          )}

          {!isFollow && (
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
          )}

          {subtitle != '' && !isFollow && (
            <View style={{marginTop: 3}}>
              <Text
                style={{
                  color: ' #101B10',
                  fontSize: 14,

                  fontFamily: theme.fonts.fontNormal,

                  lineHeight: 21,
                }}>
                {subtitle}
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
      <Pressable
        disabled={refreshing || isread}
        onPress={() =>
          onclickNotification(isFollow ? 'profile' : title, item._id)
        }
        style={({pressed}) => [
          {opacity: pressed ? 0.7 : 1.0},
          [
            styles.modalinfoConatiner,
            {
              marginTop: index == 0 ? 15 : 0,
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
            <FlashList
              estimatedItemSize={100}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              contentContainerStyle={{
                paddingTop: 12,
                paddingBottom: 40,
              }}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              data={data}
              renderItem={ItemView}
              keyExtractor={(item, index) => index.toString()}
              ItemSeparatorComponent={ItemSeparatorView}
              ListHeaderComponent={
                <ListHeaders
                  search={search}
                  setsearch={c => setsearch(c)}
                  data={data}
                />
              }
              ListFooterComponent={
                data != false && data.length > 0 ? (
                  <ListFooter
                    data={data}
                    d={td}
                    loadMore={loadMore}
                    LoadMore={LoadMore}
                  />
                ) : null
              }
              ListEmptyComponent={
                getDataOnce &&
                !loadFirst &&
                data &&
                data.length <= 0 && <EmptyListMessage />
              }
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
