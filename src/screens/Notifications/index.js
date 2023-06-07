import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Pressable,
  TextInput,
  Keyboard,
  Modal,
  RefreshControl,
  FlatList,
} from 'react-native';
import {styles} from './styles';
import {observer} from 'mobx-react';
import store from '../../store/index';
import utils from '../../utils/index';
import theme from '../../theme';
import NetInfo from '@react-native-community/netinfo';
import moment from 'moment';
// import {FlashList} from '@shopify/flash-list';

export default observer(Notifications);

function ItemSeparatorView() {
  return <View style={styles.separator} />;
}

function ListHeaders({
  search,
  setsearch,
  data,
  LoaderRead,
  attemptToReadAllNotifications,
  onRefresh,
  unread,
}) {
  const renderResult = () => {
    const length = data.length || 0;
    return (
      <View style={styles.resultMainContainer}>
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>
            {length} notifications, {unread} unread
          </Text>
        </View>
        {unread > 0 && (
          <TouchableOpacity
            disabled={LoaderRead}
            activeOpacity={0.7}
            onPress={() => {
              attemptToReadAllNotifications(onRefresh);
            }}
            style={styles.resultContainer2}>
            <Text style={styles.resultText2}>Mark all as read</Text>
          </TouchableOpacity>
        )}
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
      <View style={{width: '91%'}}>
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

  return (
    <View style={{marginHorizontal: 15}}>
      <Pressable
        style={({pressed}) => [
          {opacity: pressed ? 0.9 : 1},
          [styles.SerchBarContainer],
        ]}>
        {renderSearch()}
        {renderInput()}
      </Pressable>
      {data.length > 0 && renderResult()}
    </View>
  );
}

function EmptyListMessage() {
  return <Text style={styles.EmptyText}>No Notifications Found</Text>;
}

function Notifications({props, callingScreen, isShowModal, setIsShowModal}) {
  const headerTitle = 'Notifications';
  const windowSize = 21;
  const limit = 16;
  const {isInternet, setSettingsGoTo, setOfferGoTo} = store.General;
  const {user, isNotification} = store.User;
  const {
    notifications,
    Loader,
    notificationsTotal,
    attemptToReadNotifications,
    attemptToReadAllNotifications,
    LoaderRead,
    unread,
  } = store.Notifications;

  const [loadFirst, setloadFirst] = useState(false);
  const [search, setsearch] = useState('');
  const [getDataOnce, setgetDataOnce] = useState(false);

  const setGetDataOnce = C => {
    setgetDataOnce(C);
  };

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
    if (!getDataOnce && isInternet) {
      onRefresh();
    }
    return () => {};
  }, [getDataOnce, isInternet]);

  const goBack = () => {
    closeModal();
  };

  const goToUserProfile = senderUser => {
    store.Userv.setfscreen(callingScreen || '');
    store.Userv.setUser(senderUser);
    store.Userv.addauthToken(store.User.authToken);
    props.navigation.navigate('UserProfile');
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
    // console.log('updated date : ', moment(ud).format('YYYY-MM-DD hh:mm:ss a'));
    // console.log('currentdate : ', moment(cd).format('YYYY-MM-DD hh:mm:ss a'));

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
      // console.log('minutes: ', min);
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

  const onclickNotification = (title, action, item, isRead) => {
    Keyboard.dismiss();
    const notificationId = item.messageId;
    const senderUser = item.senderId || null;

    if (action == '') {
      console.log('title : ', title);
      if (
        title == 'New Trip Created' ||
        title == 'Profile Updated' ||
        title == 'Password Changed' ||
        title == 'Email Verification'
      ) {
        props.navigation.navigate('MyProfile');
        if (!isNotification && isInternet && !isRead) {
          store.User.attemptToGetUser();
        }
      }

      if (title == 'Your review was disputed' || title == 'Profile') {
        goToUserProfile(senderUser);
      }
    }

    if (action != '') {
      console.log('action : ', action);
      if (
        action == 'confirmed trip' ||
        action == 'See confirmed trips' ||
        action == 'Review the details'
      ) {
        props.navigation.navigate('ConfirmedTrips');
      }

      if (
        action == 'Apply for Verification' ||
        action == 'reapply for ID Verification' ||
        action == 'Check it out'
      ) {
        props.navigation.navigate('EditProfile');
        if (!isNotification && isInternet && !isRead) {
          store.User.attemptToGetUser();
        }
      }

      if (action == 'Read it now') {
        props.navigation.navigate('MyProfile');
        if (!isNotification && isInternet && !isRead) {
          store.User.attemptToGetReviews(
            store.User.user._id,
            () => {},
            () => {},
          );
        }
      }

      if (action == 'See trip details') {
        if (title.includes('posted a new trip!')) {
          goToUserProfile(senderUser);
        } else if (title.includes('New offer')) {
          props.navigation.navigate('TradeOffers'); //recieve ofer tab
          setOfferGoTo('received');
          if (!isNotification && isInternet && !isRead) {
            store.Offers.attemptToGetReceiveOffers(
              () => {},
              () => {},
            );
          }
        }
      }

      if (
        action == 'Leave a review' ||
        action == 'Make new offer' ||
        action == 'Send a message'
      ) {
        goToUserProfile(senderUser);
      }

      if (action == 'Read full message') {
        props.navigation.navigate('Inbox');
        if (!isNotification && isInternet && !isRead) {
          store.User.attemptToGetInboxes(store.User.user._id, () => {}, '');
        }
      }

      if (action == 'make an offer') {
        props.navigation.navigate('SavedTrips');
      }

      if (action == 'Subscribe') {
        props.navigation.navigate('Plan');
      }

      if (action == 'Manage Subscription') {
        if (callingScreen == 'Settings') {
          props.navigation.navigate('ManageSubscription');
          setSettingsGoTo('');
          return;
        }
        setSettingsGoTo('Manage Subscription');
        props.navigation.navigate('Settings');
      }
    }

    goBack();
    if (!isRead && isInternet) attemptToReadNotifications(notificationId);
  };

  const checkPhotoShape = title => {
    const shape =
      title == 'Your offer was accepted!' ||
      title.includes('posted a new trip!') ||
      title == 'You have a new review' ||
      title == 'A review for you was updated' ||
      title == 'Don’t forget to leave a review!' ||
      title == 'An offer was canceled' ||
      title == 'Your offer was declined' ||
      title.includes('New offer') ||
      title.includes('New message') ||
      title == ''
        ? 'circle'
        : title == 'A saved trip is expiring soon' ||
          title.includes(`You’re hosting a trip in`) ||
          title.includes(`Your trip starts in`)
        ? // ? 'square'
          'circle'
        : 'normal';
    return shape;
  };

  const getClickableText = title => {
    const check =
      title == 'Your offer was accepted!'
        ? 'See confirmed trips'
        : title.includes('posted a new trip!')
        ? 'See trip details'
        : title == 'Trip Confirmed'
        ? 'confirmed trip'
        : title == 'You have a new review' ||
          title == 'A review for you was updated'
        ? 'Read it now'
        : title == 'Don’t forget to leave a review!'
        ? 'Leave a review'
        : title == 'An offer was canceled'
        ? 'Send a message'
        : title.includes('New offer')
        ? 'See trip details'
        : title.includes('New message')
        ? 'Read full message'
        : title == 'Apply for ID Verification'
        ? 'Apply for Verification'
        : title == 'A saved trip is expiring soon'
        ? 'make an offer'
        : title.includes(`You’re hosting a trip in`) ||
          title.includes(`Your trip starts in`)
        ? 'Review the details'
        : title == 'Your next adventure awaits!'
        ? 'Subscribe'
        : title == 'Your subscription payment failed'
        ? 'Manage Subscription'
        : title == 'Your ID has been verified!'
        ? 'Check it out'
        : title == 'Your ID has been rejected!'
        ? 'reapply for ID Verification'
        : title == 'Your offer was declined'
        ? 'Make new offer'
        : '';

    return check;
  };

  const checkClickableTextPosition = title => {
    const pos =
      title.includes(`You’re hosting a trip in`) ||
      title.includes(`Your trip starts in`) ||
      title == 'Your next adventure awaits!'
        ? 'first'
        : 'end';
    return pos;
  };

  const checkLocalImage = title => {
    const obj =
      title == 'Password Changed'
        ? require('../../assets/images/notification/PasswordChanged/img.png')
        : title == 'Apply for ID Verification'
        ? require('../../assets/images/notification/Verification/img.png')
        : title == 'Profile Updated'
        ? require('../../assets/images/notification/ProfileUpdated/img.png')
        : title == 'New Trip Created' || title == 'Your next adventure awaits!'
        ? require('../../assets/images/notification/TripCreated/img.png')
        : title == 'Your review was disputed' ||
          title == 'Your ID has been rejected!' ||
          title == 'Your subscription payment failed'
        ? require('../../assets/images/notification/Reject/img.png')
        : title == 'Your ID has been verified!' || title == 'Email Verification'
        ? require('../../assets/images/notification/Done/img.png')
        : title == 'Trip Confirmed'
        ? require('../../assets/images/notification/TripConfirmed/img.png')
        : null;

    return obj;
  };

  const ItemView = ({item, index}) => {
    const follwingText = 'is following you';
    const photo = item.icon || '';
    const title = item.title || '';
    const subTitle = item.message || '';
    const create = CheckDate(item.createdAt);
    const isRead = item.isRead;
    const senderData = item.senderId || null;
    const photoSahpe = checkPhotoShape(title);
    const clickableText = getClickableText(title);
    const clickableTextPosition = checkClickableTextPosition(title);
    const isLocalImage = checkLocalImage(title);
    const isDisabel =
      clickableText == '' && isRead ? true : clickableText != '' ? true : false;
    let isFollow = false;
    let userName = '';
    if (subTitle.includes(follwingText)) {
      isFollow = true;
      if (senderData)
        userName = senderData.firstName + ' ' + senderData.lastName;
    }
    const iconSrc = isLocalImage
      ? isLocalImage
      : photo !== ''
      ? {uri: photo}
      : require('../../assets/images/drawer/guest/img.png');
    const borderRadius =
      photoSahpe == 'circle' ? 33 / 2 : photoSahpe == 'square' ? 6 : 0;
    const borderWidth =
      photoSahpe == 'circle' || photoSahpe == 'square' ? 0.7 : 0;

    const renderProfile = () => {
      return (
        <>
          <View style={styles.ProfileContainer}>
            <View
              style={[
                styles.mProfileImgContainer,
                {
                  width: photoSahpe == 'circle' ? 33 : 28,
                  height: photoSahpe == 'circle' ? 33 : 28,
                  borderRadius: borderRadius,
                  borderWidth: borderWidth,
                },
              ]}>
              <Image
                style={[
                  styles.mProfileImg,
                  {
                    borderRadius: borderRadius,
                  },
                ]}
                source={iconSrc}
              />
            </View>
          </View>
        </>
      );
    };

    const renderText = () => {
      return (
        <View style={styles.mtextContainer}>
          {isFollow && (
            <Text
              style={[styles.notificationTitle, {color: theme.color.button1}]}>
              {userName}{' '}
              <Text
                style={[
                  styles.notificationTitle,
                  {fontFamily: theme.fonts.fontNormal},
                ]}>
                {follwingText}
              </Text>
            </Text>
          )}

          {!isFollow && <Text style={styles.notificationTitle}>{title}</Text>}

          {subTitle != '' && !isFollow && (
            <>
              {clickableTextPosition == 'end' ? (
                <Text style={styles.notificationSubTitle}>
                  {subTitle}{' '}
                  <Text
                    onPress={() => {
                      console.log('item : ', item);
                      onclickNotification(title, clickableText, item, isRead);
                    }}
                    style={styles.notificationClickSubTitle}>
                    {clickableText}
                  </Text>
                  {clickableText == 'make an offer' && (
                    <Text style={[styles.notificationSubTitle, {marginTop: 0}]}>
                      ?
                    </Text>
                  )}
                </Text>
              ) : (
                <Text
                  onPress={() => {
                    console.log('item : ', item);
                    onclickNotification(title, clickableText, item, isRead);
                  }}
                  style={[styles.notificationSubTitle, {marginTop: 0}]}>
                  <Text style={[styles.notificationClickSubTitle]}>
                    {clickableText}
                  </Text>{' '}
                  {subTitle}
                </Text>
              )}
            </>
          )}

          <Text
            style={[
              styles.notificationDate,
              {
                color: isRead ? theme.color.subTitleLight : theme.color.button1,
              },
            ]}>
            {create}
          </Text>
        </View>
      );
    };

    return (
      <Pressable
        disabled={clickableText}
        onPress={() => {
          onclickNotification(
            isFollow ? 'Profile' : title,
            clickableText,
            item,
            isRead,
          );
        }}
        style={({pressed}) => [
          {opacity: pressed ? 0.8 : 1.0},
          [
            styles.notificationConatiner,
            {
              marginTop: index == 0 ? 15 : 0,
              borderBottomWidth: index == notifications.length - 1 ? 0.7 : 0,
              borderBottomColor: theme.color.fieldBorder,
              backgroundColor: isRead ? theme.color.background : '#EAF1E3',
            },
          ],
        ]}>
        {renderProfile()}
        {renderText()}
      </Pressable>
    );
  };

  const closeModal = () => {
    setIsShowModal(false);
  };

  return (
    <>
      <Modal visible={isShowModal} transparent onRequestClose={closeModal}>
        <View style={styles.container}>
          <utils.StackHeader
            closeModal={closeModal}
            bell={true}
            props={props}
            headerTitle={headerTitle}
          />
          {!isInternet && <utils.InternetMessage />}
          <SafeAreaView style={styles.container2}>
            <View style={styles.container3}>
              <FlatList
                decelerationRate={0.6}
                // estimatedItemSize={100}
                refreshControl={
                  <RefreshControl refreshing={Loader} onRefresh={onRefresh} />
                }
                contentContainerStyle={styles.listContainer}
                initialNumToRender={limit}
                windowSize={windowSize}
                maxToRenderPerBatch={windowSize}
                data={notifications}
                renderItem={ItemView}
                keyExtractor={(item, index) => index.toString()}
                ItemSeparatorComponent={ItemSeparatorView}
                ListHeaderComponent={
                  <ListHeaders
                    search={search}
                    setsearch={c => setsearch(c)}
                    data={notifications}
                    LoaderRead={LoaderRead}
                    attemptToReadAllNotifications={
                      attemptToReadAllNotifications
                    }
                    onRefresh={onRefresh}
                    unread={unread}
                  />
                }
                ListEmptyComponent={
                  getDataOnce &&
                  !loadFirst &&
                  notifications &&
                  notifications.length <= 0 && <EmptyListMessage />
                }
              />
            </View>

            <utils.Footer
              closeModal={closeModal}
              nav={props.navigation}
              screen={headerTitle}
              focusScreen={store.General.focusScreen}
            />
          </SafeAreaView>
          <utils.Loader load={LoaderRead} />
        </View>
      </Modal>
    </>
  );
}
