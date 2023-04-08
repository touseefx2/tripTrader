import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  StatusBar,
  Alert,
  Pressable,
  RefreshControl,
} from 'react-native';
import ProgressiveFastImage from '@freakycoder/react-native-progressive-fast-image';
import {styles} from './styles';
import {observer} from 'mobx-react';
import store from '../../store/index';
import utils from '../../utils/index';
import theme from '../../theme';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-easy-toast';
import {ImageSlider} from 'react-native-image-slider-banner';
import moment from 'moment/moment';
import io from 'socket.io-client';
import db from '../../database/index';
import {FlashList} from '@shopify/flash-list';
import PushNotification from 'react-native-push-notification';

export default observer(Home);
function Home(props) {
  const headerTitle = 'Home';
  const toast = useRef(null);
  const {
    isInternet,
    goto,
    isEmailPopup,
    setIsEmailPopup,
    setSettingsGoTo,
    setOfferGoTo,
  } = store.General;
  const {isApplySearch} = store.Search;
  const {isShowNotifcation} = store.Notifications;
  const {
    activity,
    tripLocation,
    species,
    isFilter,
    activityList,
    setActivityList,
  } = store.Filters;
  const {
    user,
    homeModalLoder,
    Hometrips,
    setisNotification,
    blockUsers,
    HomeLoader,
  } = store.User;
  const {deleteLoader, saveTrips, saveLoader, setsaveTrips, attemptToSaveTrip} =
    store.Trips;

  const [modalObj, setModalObj] = useState(null);
  const [isOfferModal, setIsOfferModal] = useState(false);
  const [isMessageModal, setIsMessageModal] = useState(false);
  const [isRemoveModal, setIsRemoveModal] = useState(false);

  const [isSuccessModal, setIsSuccessModal] = useState(false);
  const [successModalObj, setSuccessModalObj] = useState(null);
  const [successCheck, setSuccessCheck] = useState('');

  const [getDataOnce, setgetDataOnce] = useState(false);
  const [isShowSearch, setisShowSearch] = useState(false);
  const [isShowFilters, setisShowFilters] = useState(false);

  const [fullImageModal, setFullImageModal] = useState(false);
  const [fullImageArr, setFullImageArr] = useState([]);
  const [fullImageIndication, setFullImageIndication] = useState('');

  const setGetDataOnce = C => {
    setgetDataOnce(C);
  };

  useEffect(() => {
    if (!getDataOnce && isInternet) {
      onRefresh();
    }
    return () => {};
  }, [getDataOnce, isInternet]);

  useEffect(() => {
    if (user && user !== 'guest') {
      setsaveTrips(user.savedTrips || []);
      setisNotification(user.notificationEnabled);
    }
  }, [user]);

  useEffect(() => {
    if (user && user !== 'guest' && getDataOnce) {
      setTimeout(() => {
        setIsEmailPopup(user?.isEmailVerified == false ? true : false);
      }, 3000);
    }
  }, [user, getDataOnce]);

  useEffect(() => {
    if (activity.length > 0 && species.length > 0 && activityList.length <= 0) {
      let activityLists = [];
      activity.map((element, index) => {
        for (let index = 0; index < species.length; index++) {
          const item = species[index];
          if (item.type && item.type._id === element._id) {
            activityLists.push(element);
            break;
          }
        }
      });
      setActivityList(activityLists);
    }
  }, [species, activity, activityList]);

  useEffect(() => {
    if (goto == 'profile') {
      props.navigation.navigate('MyProfile');
    }
  }, []);

  const notify = store.General.goToo;

  useEffect(() => {
    if (notify) {
      const topic = notify?.tag || '';
      let action = notify?.action || '';
      if (action == '') {
        const arr = JSON.parse(notify?.actions) || [];
        if (arr.length > 0) action = arr[0];
      }

      if (action != '') onClickNotificationAction(action, notify);
      else onOpenNotification(topic, action, notify);

      store.General.setgoToo(null);
    }
  }, [notify]);

  const socket = store.General.socket;
  const SocketOff = () => {
    socket.emit('user left', {socket: socket.id});
  };
  useEffect(() => {
    store.General.setSocket(io(db.apis.BASE_URL));
    return () => {
      SocketOff();
    };
  }, []);
  useEffect(() => {
    socket.on('message', d => {
      console.log('socket on Home call and refresh  inboxes ');
      store.User.attemptToGetInboxes(user._id, () => {});
    });
  }, [socket]);

  useEffect(() => {
    if (isApplySearch) {
      NetInfo.fetch().then(state => {
        if (state.isConnected) {
          if (user == 'guest') {
            store.User.attemptToGetHomeTripsGuest(setGetDataOnce);
          } else {
            store.User.attemptToGetHomeTripsSearch(
              setGetDataOnce,
              blockUsers,
              '',
            );
          }
        }
      });
    }
  }, [isApplySearch]);

  const goToEditProfile = props => {
    props.navigation.navigate('EditProfile');
  };

  const goToMyProfile = props => {
    props.navigation.navigate('MyProfile');
  };

  const goToInbox = props => {
    props.navigation.navigate('Inbox');
  };

  const goToTradeOffer = props => {
    props.navigation.navigate('TradeOffers');
  };

  const goToConfirmTrips = props => {
    props.navigation.navigate('ConfirmedTrips');
  };

  const goToUserProfile = (props, senderUser) => {
    store.Userv.setfscreen(headerTitle || '');
    store.Userv.setUser(senderUser);
    store.Userv.addauthToken(store.User.authToken);
    props.navigation.navigate('UserProfile');
  };

  const goToSavedTrips = props => {
    props.navigation.navigate('SavedTrips');
  };

  const onOpenNotification = (topic, actions, notify) => {
    console.log('onOpenNotification:', notify);

    if (topic == 'followUser' || topic == 'dispute')
      onClickNotificationAction(topic, notify);
    else {
      onClickNotificationAction(actions, notify);
      return;
    }

    if (topic === 'id-verified' || topic === 'id-notVerified') {
      goToEditProfile(props);
    }

    if (topic == 'newReview' || topic == 'updateInReview') {
      goToMyProfile(props);
    }

    if (topic == 'offerDecline' || topic == 'offerCancel') {
      goToTradeOffer(props);
      setOfferGoTo('sent');
    }

    if (topic == 'offerConfirm') {
      goToConfirmTrips(props);
    }

    if (topic == 'subscriptionStatus') {
      props.navigation.navigate('Plan');
    }

    if (topic == 'subscriptionStatus') {
      props.navigation.navigate('Plan');
    }

    if (topic == 'paymentFailed') {
      setSettingsGoTo('Manage Subscription');
      props.navigation.navigate('Settings');
    }
  };

  const onClickNotificationAction = (action, notify) => {
    if (action != 'followUser' && action != 'dispute') {
      console.log('onClickNotificationAction:', notify);
    }

    let senderId = {};
    // if (action == 'followUser' || action == 'dispute')
    senderId = notify?.data ? notify.data : {};
    // else senderId = notify?.userInfo ? notify.userInfo : {};

    if (action == 'Dismiss' || action == 'No Thanks') {
      PushNotification.cancelLocalNotification(notify.id);
    }

    if (action == 'Apply for Verification') {
      goToEditProfile(props);
    }
    if (action == 'Respond') {
      //new message
      goToInbox(props);
    }

    if (action == 'Review Offer Details') {
      //offer recieve
      goToTradeOffer(props);
      setOfferGoTo('received');
    }
    if (action.includes('Message')) {
      goToUserProfile(props, senderId);
    }
    if (action == 'Review Trip Details') {
      //  offerAccepted tripStarts tripHosting
      goToConfirmTrips(props);
    }
    if (action == 'Make Offer') {
      //save trip expire
      goToSavedTrips(props);
    }
    if (
      action == 'Leave Review' ||
      action == 'See Trip Details' ||
      action == 'followUser' ||
      action == 'dispute'
    ) {
      //newTripAdded  reviewReminder userFollow disputeReview
      goToUserProfile(props, senderId);
    }
  };

  const onRefresh = React.useCallback(() => {
    console.log('onrefresh cal');
    getDbData(blockUsers);
  }, [blockUsers]);

  const getDbData = blockUsers => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        if (user == 'guest') {
          store.User.attemptToGetHomeTripsGuest(setGetDataOnce);
        } else {
          store.User.attemptToGetHomeTripsSearch(
            setGetDataOnce,
            blockUsers,
            'all',
          );
        }
      }
    });
  };

  const saveTripSuccess = item => {
    setSuccessModalObj({item: item});
    setSuccessCheck('TripSave');
    setIsSuccessModal(true);
  };

  const saveTrip = (item, index) => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        attemptToSaveTrip(item, index, saveTripSuccess);
      } else {
        Alert.alert('', 'Please connect internet');
      }
    });
  };

  const onclickSearchBar = () => {
    setisShowSearch(true);
  };

  const onCrossSearchBar = () => {
    store.Search.clearSelSearches();

    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        if (user == 'guest') {
          store.User.attemptToGetHomeTripsGuest(setGetDataOnce);
        } else {
          store.User.attemptToGetHomeTripsSearch(
            setGetDataOnce,
            blockUsers,
            '',
          );
        }
      } else {
        Alert.alert('Please Connect internet');
      }
    });
  };

  const onclickFilter = () => {
    setisShowFilters(true);
  };

  const openModal = (obj, check) => {
    setModalObj(obj);
    if (check == 'offer') setIsOfferModal(true);

    if (check == 'message') setIsMessageModal(true);

    if (check == 'tripRemove') setIsRemoveModal(true);
  };

  const renderStatusBar = () => {
    return (
      <>
        <StatusBar
          translucent={false}
          backgroundColor={theme.color.backgroundGreen}
          barStyle={'light-content'}
        />
      </>
    );
  };

  const ItemSeparatorView = () => {
    return (
      <View
        style={{
          height: 20,
        }}
      />
    );
  };

  const EmptyListMessage = () => {
    return (
      // Flat List Item
      <>
        {/* {!refreshing && getDataOnce && (
          <Text
            style={{
              marginTop: '80%',
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'center',
              fontSize: 13,
              color: theme.color.title,
              fontFamily: theme.fonts.fontMedium,
              opacity: 0.4,
            }}
            >
            No Trips Found
          </Text>
        )} */}
      </>
    );
  };

  const ItemView = ({item, index}) => {
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

    const isSave = utils.functions.CheckisAlreadySaveTrip(
      item,
      saveTrips.slice(),
    );

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
                  : require('../../assets/images/drawer/guest/img.png')
              }
              loadingImageStyle={styles.imageLoader}
              loadingSource={require('../../assets/images/imgLoad/img.jpeg')}
              blurRadius={5}
            />
            {isVeirfy && (
              <Image
                style={styles.iconVerify}
                source={require('../../assets/images/verified/img.png')}
              />
            )}
          </View>
        );
      };

      const renderText = () => {
        return (
          <View style={styles.textContainer}>
            <Pressable
              disabled={user == 'guest' ? true : false}
              onPress={() => {
                if (user == 'guest') return;

                store.Userv.setfscreen('home');
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
              if (user == 'guest') {
                store.General.setgoto('guestaccess');
                store.User.Logout();
                return;
              }

              if (!isSave) saveTrip(item, index);
              else openModal({item: item, selIndex: index}, 'tripRemove');
            }}
            style={({pressed}) => [
              {opacity: pressed ? 0.7 : 1.0},
              styles.iconContainer,
            ]}>
            <Image
              style={styles.iconSave}
              source={
                !isSave
                  ? require('../../assets/images/addSave/img.png')
                  : require('../../assets/images/homeSave/img.png')
              }
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
                    setFullImageModal(true);
                    setFullImageArr(chk == '1' ? tripPhotos[0] : '');
                    setFullImageIndication(chk == '1' ? 'tp' : 'ph');
                  }}>
                  <ProgressiveFastImage
                    style={styles.tripImg}
                    source={
                      chk == '1'
                        ? {uri: tripPhotos[0]}
                        : require('../../assets/images/trip/img.jpeg')
                    }
                    loadingImageStyle={styles.imageLoader2}
                    loadingSource={require('../../assets/images/imgLoad/img.jpeg')}
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

    const renderSec3 = () => {
      return (
        <View style={styles.boxSection3}>
          <Text style={styles.sec3T1}>{titlee}</Text>
          <View style={styles.sec3T2Container}>
            <Image
              style={styles.sec3Icon}
              source={require('../../assets/images/location/img.png')}
            />
            <View style={{width: '94%'}}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.sec3T2}>
                {locName}
              </Text>
            </View>
          </View>
          <View style={{marginTop: 10}}>
            <Text style={styles.sec3T31}>In Return For</Text>
            <Text style={[styles.sec3T32, {textTransform: 'capitalize'}]}>
              {trade}
            </Text>
          </View>
          <View style={{marginTop: 10}}>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.sec3T31}>
              Availability
            </Text>
            <Text style={styles.sec3T32}>{favlbl}</Text>
          </View>
        </View>
      );
    };

    const renderSec4 = () => {
      return (
        <View style={styles.boxSection4}>
          <Pressable
            onPress={() => {
              if (user == 'guest') {
                store.General.setgoto('guestaccess');
                store.User.Logout();
                return;
              }

              if (user.subscriptionStatus == 'freemium') {
                props.navigation.navigate('Plan');
              } else openModal({item: item, selIndex: index}, 'offer');
            }}
            style={({pressed}) => [
              {opacity: pressed ? 0.9 : 1.0},
              styles.sec4B,
            ]}>
            <Text style={styles.sec4T}>make offer</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              if (user == 'guest') {
                store.General.setgoto('guestaccess');
                store.User.Logout();
                return;
              }
              if (user.subscriptionStatus == 'freemium') {
                props.navigation.navigate('Plan');
              } else openModal({item: item, selIndex: index}, 'message');
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
        <View style={[styles.boxContainer, {marginTop: index == 0 ? 7 : 0}]}>
          {renderSec1()}
          {renderSec2()}
          {renderSec3()}
          {renderSec4()}
        </View>
      </>
    );
  };

  const ListHeader = () => {
    const renderResult = () => {
      let length = Hometrips.length || 0;

      return (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>
            {length} {isApplySearch ? 'search' : isFilter ? 'filter' : ''}{' '}
            result
            {length > 1 ? 's' : ''}
          </Text>
        </View>
      );
    };

    const renderSearch = () => {
      return (
        <Image
          source={require('../../assets/images/searchBar/search/img.png')}
          style={styles.Baricon}
        />
      );
    };

    const renderInput = () => {
      return (
        <View style={{width: '88%'}}>
          <Text
            style={{
              fontSize: 14.5,
              color: !isApplySearch
                ? theme.color.subTitleLight
                : theme.color.subTitle,
              fontFamily: theme.fonts.fontNormal,
            }}>
            {!isApplySearch ? 'Search' : store.Search.search}
          </Text>
        </View>
      );
    };

    const renderFilter = () => {
      return (
        <Image
          source={require('../../assets/images/searchBar/filter/img.png')}
          style={styles.Baricon}
        />
      );
    };

    const renderCross = () => {
      return (
        <utils.vectorIcon.AntDesign
          name="close"
          size={20}
          color={theme.color.subTitle}
        />
      );
    };

    return (
      <>
        <View style={styles.SerchBarContainer}>
          <Pressable
            disabled={isApplySearch}
            style={({pressed}) => [
              {opacity: pressed ? 0.7 : 1},
              {
                paddingVertical: 9,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '80%',
              },
            ]}
            onPress={onclickSearchBar}>
            {renderSearch()}
            {renderInput()}
          </Pressable>
          <Pressable
            style={({pressed}) => [
              {
                opacity: pressed ? 0.7 : 1,
                paddingVertical: 9,
              },
            ]}
            onPress={!isApplySearch ? onclickFilter : onCrossSearchBar}>
            {!isApplySearch ? renderFilter() : renderCross()}
          </Pressable>
        </View>
        {renderResult()}
      </>
    );
  };

  const ListFooter = () => {
    return (
      <>
        <View>
          <View style={styles.listFooter}>
            <Text style={styles.listFooterT}>End of results</Text>
          </View>
        </View>
      </>
    );
  };

  return (
    <>
      <View style={styles.container}>
        <utils.DrawerHeader props={props} headerTitle={headerTitle} />
        {!isInternet && <utils.InternetMessage />}
        <SafeAreaView style={styles.container2}>
          <View style={styles.container3}>
            <FlashList
              decelerationRate={0.6}
              estimatedItemSize={530}
              refreshControl={
                <RefreshControl refreshing={HomeLoader} onRefresh={onRefresh} />
              }
              contentContainerStyle={{
                paddingVertical: 12,
                paddingHorizontal: 15,
              }}
              data={Hometrips}
              extraData={saveTrips}
              renderItem={ItemView}
              keyExtractor={(item, index) => index.toString()}
              ListEmptyComponent={EmptyListMessage}
              ItemSeparatorComponent={ItemSeparatorView}
              ListHeaderComponent={ListHeader}
              ListFooterComponent={Hometrips.length > 0 ? ListFooter : null}
            />
          </View>

          <utils.Footer
            nav={props.navigation}
            screen={headerTitle}
            focusScreen={store.General.focusScreen}
          />
        </SafeAreaView>

        {renderStatusBar()}

        {isShowSearch && (
          <utils.Search
            isVisible={isShowSearch}
            setisVisible={c => setisShowSearch(c)}
            setGetDataOnce={c => setGetDataOnce(c)}
            blckUser={blockUsers}
          />
        )}
        {isShowFilters && (
          <utils.Filters
            isVisible={isShowFilters}
            setisVisible={c => setisShowFilters(c)}
            setGetDataOnce={c => setGetDataOnce(c)}
            blckUser={blockUsers}
          />
        )}
        {fullImageModal && (
          <utils.FullimageModal
            data={[]}
            si={0}
            show={fullImageModal}
            pd={fullImageArr}
            pdc={fullImageIndication}
            closModal={() => {
              setFullImageModal(!fullImageModal);
              setFullImageArr('');
              setFullImageIndication('');
            }}
          />
        )}

        {isOfferModal && (
          <utils.MakeOffer
            isModal={isOfferModal}
            setIsModal={setIsOfferModal}
            modalObj={modalObj}
            setModalObj={setModalObj}
            loader={homeModalLoder}
            activity={activity}
            species={species}
            tripLocation={tripLocation}
            setIsSuccessModal={setIsSuccessModal}
            setSuccessModalObj={setSuccessModalObj}
            setSuccessCheck={setSuccessCheck}
          />
        )}
        {isMessageModal && (
          <utils.MessageModal
            isModal={isMessageModal}
            setIsModal={setIsMessageModal}
            modalObj={modalObj}
            setModalObj={setModalObj}
            loader={homeModalLoder}
            setIsSuccessModal={setIsSuccessModal}
            setSuccessModalObj={setSuccessModalObj}
            setSuccessCheck={setSuccessCheck}
          />
        )}
        {isRemoveModal && (
          <utils.unSaveTripModal
            isModal={isRemoveModal}
            setIsModal={setIsRemoveModal}
            modalObj={modalObj}
            setModalObj={setModalObj}
            loader={deleteLoader}
            screen="Home"
            data={[]}
            setdata={() => {}}
            saveData={[]}
            setSaveData={() => {}}
          />
        )}
        {isSuccessModal && (
          <utils.SuccessModal
            isModal={isSuccessModal}
            setIsModal={setIsSuccessModal}
            modalObj={successModalObj}
            setModalObj={setSuccessModalObj}
            check={successCheck}
            setCheck={setSuccessCheck}
            props={props}
          />
        )}

        <utils.Loader load={saveLoader} />
        <Toast ref={toast} position="bottom" />
        {isShowNotifcation && <utils.ShowNotifications />}
        {isEmailPopup && (
          <utils.EmailPopupSheet
            isModal={isEmailPopup}
            setIsModal={setIsEmailPopup}
            email={user?.email || ''}
            user={user || null}
          />
        )}
      </View>
    </>
  );
}
