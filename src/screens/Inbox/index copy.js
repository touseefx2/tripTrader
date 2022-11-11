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
import {SwipeListView} from 'react-native-swipe-list-view';

export default observer(Inbox);

function Inbox(props) {
  let guest = require('../../assets/images/drawer/guest/img.png');

  let maxModalHeight = theme.window.Height - 100;
  const [modalHeight, setmodalHeight] = useState(0);

  let headerTitle = 'Inbox';
  let internet = store.General.isInternet;
  let user = store.User.user;
  let mloader = store.User.ibl;
  const data = store.User.inbox;

  // const [data, setdata] = useState([]);
  // useEffect(() => {
  //   const dt = [
  //     {
  //       userName: 'Fransisco Fred',
  //       message: 'Hey! I had a question about trade...',
  //       createdAt: 'Just now',
  //       photo: '',

  //       isRead: false,
  //     },
  //     {
  //       userName: 'Mike Manuse',
  //       message: 'Hey, do you want to trade a turkey hunt?',
  //       createdAt: 'Mar 25',
  //       isRead: true,
  //       photo:
  //         'https://expertphotography.b-cdn.net/wp-content/uploads/2020/08/social-media-profile-photos-10.jpg',
  //     },
  //     {
  //       userName: 'Jack Maw',
  //       message: 'Hey! I had a question about your trade...',
  //       createdAt: 'Mar 7',
  //       isRead: true,
  //       photo:
  //         'https://cdn140.picsart.com/76886237758523202417.png?type=webp&to=min&r=-1x-1',
  //     },
  //     {
  //       userName: 'Dylan Brown',
  //       message: 'Hello, good morning :)',
  //       createdAt: 'Feb 13',
  //       isRead: true,
  //     },
  //   ];

  //   setdata(dt);

  //   return () => {};
  // }, []);

  const [getDataOnce, setgetDataOnce] = useState(false);
  const setGetDataOnce = C => {
    setgetDataOnce(C);
  };
  const [refreshing, setRefreshing] = React.useState(false);
  const setrefeshing = c => {
    setRefreshing(c);
  };
  const onRefresh = React.useCallback(() => {
    console.warn('onrefresh cal');
    setRefreshing(true);
    getDbData();
  }, []);
  const getDbData = () => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        store.User.attemptToGetInboxes(user._id, setGetDataOnce, setrefeshing);
      } else {
        setrefeshing(false);
      }
    });
  };
  useEffect(() => {
    if (!getDataOnce && internet) {
      getDbData();
    }
    return () => {};
  }, [getDataOnce, internet]);

  const onclickSearchBar = () => {};

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
      <Text style={styles.emptyListStyle} onPress={() => getItem(item)}>
        No Data Found
      </Text>
    );
  };

  const ListHeader = () => {
    const renderResult = () => {
      let length = data.length || 0;
      return (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>{length} messages, 1 unread</Text>
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
            editable={false}
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
          onPress={onclickSearchBar}>
          {renderSearch()}
          {renderInput()}
          {renderFilter()}
        </Pressable>
        {data.length > 0 && renderResult()}
      </View>
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
    console.log('ics ', ics);

    if (ics == 'greater') {
      t = moment(ud).format('MMM DD');
    } else {
      let min = diff_minutes(ed, sd);
      console.log('minutes: ', min);
      if (min >= 0 && min <= 2) {
        t = 'Just now';
      } else if (min > 2) {
        t = moment(ud).format('hh:mm a');
      }
    }

    return t;
  }

  const ItemView = ({item, index}) => {
    console.log('item : ', item._id);
    let msgs = item.messages;
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
    let create = CheckDate(item.updatedAt); //'2022-11-11T07:03:58.919+00:00'
    // let isread = item.isRead ||  false;
    let isread = false;

    if (msgs.length > 0) {
      let d = msgs[msgs.length > 1 ? msgs.length - 1 : 0];
      subtitle =
        d.message +
        'asknas aksnaskasaskjasabs bskabs akjs akjshas kljbs asna kjsa skjabsjkas';
      isendmymsg = d.sendBy._id == uid ? true : false;
      if (!isendmymsg) {
        isread = d.isRead;
      } else {
        isread = true;
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
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{width: '74%'}}>
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
                width: '24%',

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
              {subtitle}
            </Text>
          </View>
        </View>
      );
    };

    return (
      <Pressable
        onPress={() => {}}
        style={({pressed}) => [
          {opacity: pressed ? 0.8 : 1.0},
          [
            styles.modalinfoConatiner,
            {
              marginTop: index == 0 ? 10 : 0,
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

  const ListFooter = () => {
    return (
      <>
        <View>
          <View style={styles.listFooter}>
            <Text style={styles.listFooterT}>End of messages</Text>
          </View>
        </View>
      </>
    );
  };

  return (
    <>
      <View style={styles.container}>
        <utils.DrawerHeader props={props} headerTitle={headerTitle} />
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
              renderItem={ItemView}
              keyExtractor={(item, index) => index.toString()}
              ListEmptyComponent={EmptyListMessage}
              ItemSeparatorComponent={ItemSeparatorView}
              ListHeaderComponent={data.length > 0 ? ListHeader : null}
              ListFooterComponent={data.length > 0 ? ListFooter : null}
            />
            {data.length > 0 && !getDataOnce && mloader && (
              <ActivityIndicator
                size={30}
                color={theme.color.button1}
                style={{
                  top: '50%',
                  position: 'absolute',
                  alignSelf: 'center',
                }}
              />
            )}
          </View>

          <utils.Footer
            nav={props.navigation}
            screen={headerTitle}
            focusScreen={store.General.focusScreen}
          />
        </SafeAreaView>
      </View>
    </>
  );
}
