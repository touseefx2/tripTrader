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

export default observer(SavedTrips);

// const data = [
//   {
//     _id: 31,
//     title: 'Hunting Trip',
//     acceptOtherTrades: true,

//     loc: {coords: [], name: 'Miami, Florida'},
//     offer: 'Central N.C. Whitetail Hunting In The Back Country',
//     photos: [
//       'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0OqjKG4QLGg-hvzwhf76mCB1shxkUchZN9Q&usqp=CAU',
//       'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbyQRxBY8uSBj1VaS26kR0_7Uk6BJ-YNz4XQ&usqp=CAU',
//       'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTV8fHRyYXZlbGxpbmd8ZW58MHx8MHx8&w=1000&q=80',
//     ],
//     return: 'Alligator or Osceola Turkey',
//     status: 'activate',

//     user: {
//       _id: 2,
//       first_name: 'mike',
//       last_name: 'monuse',
//       userName: 'mmouse',
//       // photo:"",
//       photo:
//         'https://www.adobe.com/express/create/media_127540366421d3d5bfcaf8202527ca7d37741fd5d.jpeg?width=400&format=jpeg&optimize=medium',
//       avg_rating: 3.8,
//       total_reviews: 190,
//       isVerified: true,
//     },
//     availablity: {endDate: '2022-11-05', startDate: '2022-10-17'},
//     duration: {number: '3', title: 'days'},
//     unavailable: {
//       all_unavailable_dates: [
//         '2022-10-25',
//         '2022-10-26',
//         '2022-10-28',
//         '2022-11-02',
//         '2022-11-04',
//       ],
//       days_of_week: ['Fri'],
//       esd_text: 'Oct 25-26, Nov 2',
//       exclude_specific_dates: ['2022-10-25', '2022-10-26', '2022-11-02'],
//       repeat_every: {endRepeatOn: '2022-11-05', num: 1, title: 'Weeks'},
//       unavailable_days_of_week: ['2022-10-28', '2022-11-04'],
//       wtxt: 'Fri (weekly)',
//     },
//   },
//   {
//     _id: 32,
//     title: 'Fishing Trip',
//     acceptOtherTrades: true,

//     loc: {coords: [], name: 'Dylan, Nc'},
//     offer: 'North Idaho Black Bear Spot and Stalk',
//     photos: [
//       'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0OqjKG4QLGg-hvzwhf76mCB1shxkUchZN9Q&usqp=CAU',
//       'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbyQRxBY8uSBj1VaS26kR0_7Uk6BJ-YNz4XQ&usqp=CAU',
//       'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTV8fHRyYXZlbGxpbmd8ZW58MHx8MHx8&w=1000&q=80',
//     ],
//     return: 'Open to Offers',
//     status: 'activate',
//     user: {
//       _id: 7,
//       first_name: 'James',
//       last_name: 'Bond',
//       userName: 'jbonds',
//       // photo:"",
//       photo:
//         'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHw%3D&w=1000&q=80',

//       avg_rating: 3.5,
//       total_reviews: 100,
//       isVerified: false,
//     },
//     availablity: {endDate: '2022-11-05', startDate: '2022-10-16'},
//     duration: {number: '1', title: 'days'},
//     unavailable: {
//       all_unavailable_dates: [
//         '2022-10-24',
//         '2022-10-25',
//         '2022-10-27',
//         '2022-11-03',
//       ],
//       days_of_week: ['Thu'],
//       esd_text: 'Oct 24-25',
//       exclude_specific_dates: ['2022-10-24', '2022-10-25'],
//       repeat_every: {endRepeatOn: '2022-11-05', num: 1, title: 'Weeks'},
//       unavailable_days_of_week: ['2022-10-27', '2022-11-03'],
//       wtxt: 'Thu (weekly)',
//     },
//   },
// ];

function SavedTrips(props) {
  let maxModalHeight = theme.window.Height - 100;
  const [modalHeight, setmodalHeight] = useState(0);
  let data = store.Trips.saveTrips;
  const toast = useRef(null);
  const toastduration = 700;
  let headerTitle = 'Saved';
  let tagLine = '';
  let internet = store.General.isInternet;
  let user = store.User.user;
  let goto = store.General.goto;

  let mloader = store.Trips.dLoader;

  const [modalObj, setmodalObj] = useState(false);
  const [modalChk, setmodalChk] = useState(false);
  const [isModal, setisModal] = useState(false);

  const onClickremoveTrips = (dt, ind) => {
    openModal({item: dt, i: ind}, 'tripRemove');
  };

  const openModal = (obj, c) => {
    setmodalObj(obj);
    setmodalChk(c);
    setisModal(true);
  };

  const closeModal = () => {
    setisModal(false);
    setmodalObj(false);
    setmodalChk(false);
    setmodalHeight(0);
  };

  const deleteTrip = (dt, i) => {
    Keyboard.dismiss();
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        store.Trips.attemptToDeleteTrip(dt, i, closeModal);
      } else {
        // seterrorMessage('Please connect internet');
        Alert.alert('', 'Please connect internet');
      }
    });
  };

  const onclickSearchBar = () => {};

  const ItemSeparatorView = () => {
    return (
      <View
        style={{
          height: 20,
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

  const ItemView = ({item, index}) => {
    let usr = item.hostId;
    //user
    let photo = usr.image || '';
    let userName = usr.firstName + ' ' + usr.lastName;
    let avgRating = 3.7;
    let totalReviews = 50;
    let isVeirfy = usr.identityStatus == 'notVerified' ? false : true;

    //trip
    let status = item.status || '';
    let tripPhotos = item.photos ? item.photos : [];
    let title = item.title || '';
    let duration = item.duration.value;
    let dt = item.duration.title || '';
    const durTitle = dt.charAt(0).toUpperCase() + dt.slice(1);
    let t =
      duration <= 1 ? durTitle.substring(0, durTitle.length - 1) : durTitle;
    duration = duration + ' ' + t;
    let offer = item.activity || '';
    let locName = item.location || '';
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
              onPress={() => {
                store.User.clearOtherUser();
                store.User.setfscreen('home');
                const dd = {
                  user: {
                    _id: 2,
                    first_name: 'mike',
                    last_name: 'monuse',
                    userName: 'mmouse',
                    // photo:"",
                    photo:
                      'https://www.adobe.com/express/create/media_127540366421d3d5bfcaf8202527ca7d37741fd5d.jpeg?width=400&format=jpeg&optimize=medium',
                    avg_rating: 3.8,
                    total_reviews: 190,
                    isVerified: true,
                  },
                };
                store.User.setvUser(dd.user);
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
                {avgRating.toFixed(1)}
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
            onPress={() => onClickremoveTrips(item, index)}
            style={({pressed}) => [
              {opacity: pressed ? 0.7 : 1.0},
              styles.iconContainer,
            ]}>
            <Image
              style={styles.iconSave}
              source={require('../../assets/images/delSave/img.png')}
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
        let src = tripPhotos.length > 0 ? tripPhotos : '';

        return (
          <>
            {src != '' && (
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

            {src == '' && (
              <>
                <Pressable
                  style={({pressed}) => [
                    {opacity: pressed ? 0.95 : 1.0},
                    [styles.tripImageConatiner],
                  ]}
                  onPress={() => {
                    setpvm(true);
                  }}>
                  <ProgressiveFastImage
                    style={styles.tripImg}
                    source={require('../../assets/images/trip/img.jpeg')}
                    loadingImageStyle={styles.imageLoader}
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
          <Text style={styles.sec3T1}>
            {duration} {offer}
          </Text>
          <View style={styles.sec3T2Container}>
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
          </View>
          <View style={{marginTop: 10}}>
            <Text style={styles.sec3T31}>In Return For</Text>
            <Text style={styles.sec3T32}>{trade}</Text>
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
            // onPress={() => onClickMakeOffer(item, index)}
            style={({pressed}) => [
              {opacity: pressed ? 0.9 : 1.0},
              styles.sec4B,
            ]}>
            <Text style={styles.sec4T}>make offer</Text>
          </Pressable>

          <Pressable
            // onPress={() => onClickMessage(item, index)}
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
      let length = data.length || 0;
      return (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>{length} saved trip</Text>
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
      <View>
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

  const renderModal = () => {
    let c = modalHeight >= maxModalHeight ? true : false;
    let style = c ? [styles.modal, {height: maxModalHeight}] : styles.modal2;
    let item = modalObj.item;

    if (modalChk == 'tripRemove') {
      const renderHeader = () => {
        let text = 'Remove Saved Trip?';

        const renderCross = () => {
          return (
            <Pressable
              disabled={mloader}
              style={({pressed}) => [
                {opacity: pressed ? 0.7 : 1.0},
                [
                  !c
                    ? {
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                      }
                    : {
                        position: 'absolute',
                        bottom: 7,
                        right: 15,
                      },
                ],
              ]}
              onPress={closeModal}>
              <utils.vectorIcon.Ionicons
                name="ios-close-outline"
                color={theme.color.title}
                size={32}
              />
            </Pressable>
          );
        };

        const renderTitle = () => {
          return <Text style={styles.modalTitle}>{text}</Text>;
        };

        return (
          <View
            style={
              c
                ? {
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: 15,
                    paddingTop: 15,
                    paddingBottom: 7,
                    shadowColor: '#000000',
                    shadowOffset: {width: 0, height: 1}, // change this for more shadow
                    shadowOpacity: 0.1,
                    elevation: 1,
                    backgroundColor: theme.color.background,
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                  }
                : {
                    alignItems: 'center',
                    justifyContent: 'center',
                  }
            }>
            {renderTitle()}
            {renderCross()}
          </View>
        );
      };

      const renderInfo = () => {
        let usr = item.hostId;
        let userName = usr.firstName + ' ' + usr.lastName;
        let photo = usr.image ? usr.image : '';

        const renderProfile = () => {
          return (
            <View style={styles.mProfileImgContainer}>
              <ProgressiveFastImage
                style={styles.mProfileImg}
                source={
                  photo != ''
                    ? {uri: photo}
                    : require('../../assets/images/drawer/guest/img.png')
                }
                loadingImageStyle={styles.mimageLoader}
                loadingSource={require('../../assets/images/imgLoad/img.jpeg')}
                blurRadius={5}
              />
              {/* {isVeirfy && (
                <Image
                  style={styles.miconVerify}
                  source={require('../../assets/images/verified/img.png')}
                />
              )} */}
            </View>
          );
        };

        const renderText = () => {
          return (
            <View style={styles.mtextContainer}>
              <Text
                style={{
                  color: theme.color.subTitleLight,
                  fontSize: 12,
                  fontFamily: theme.fonts.fontBold,
                  textTransform: 'capitalize',
                }}>
                Member
              </Text>

              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  color: '#081A24',
                  fontSize: 15,
                  fontFamily: theme.fonts.fontBold,
                  lineHeight: 23,
                  textTransform: 'capitalize',
                }}>
                {userName}
              </Text>
            </View>
          );
        };

        return (
          <View style={styles.modalinfoConatiner}>
            {renderProfile()}
            {renderText()}
          </View>
        );
      };

      const renderField = () => {
        let duration = parseInt(item.duration.value) || '';
        let dtitile = item.duration.title;
        let dt = '';

        if (duration <= 1) {
          duration = 'Whole';
          dtitile = dtitile.substring(0, dtitile.length - 1);
        }
        dt = duration + ' ' + dtitile;
        let offer = item.activity || '';
        let trade = item.returnActivity || '';
        return (
          <>
            <View style={{paddingLeft: 10, paddingRight: 20}}>
              <View style={styles.field}>
                <Text style={styles.filedTitle}>Offering</Text>
                <Text style={[styles.filedTitle2, {color: theme.color.title}]}>
                  <Text
                    style={[
                      styles.filedTitle2,
                      {
                        color: theme.color.title,
                        textTransform: 'capitalize',
                      },
                    ]}>
                    {dt}
                  </Text>{' '}
                  {offer}
                </Text>
              </View>

              <View style={styles.field}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles.filedTitle}>
                  for trade
                </Text>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={[styles.filedTitle2, {color: theme.color.title}]}>
                  {trade}
                </Text>
              </View>
            </View>
          </>
        );
      };

      const renderBottom = () => {
        const renderButton1 = () => {
          return (
            <>
              <TouchableOpacity
                disabled={mloader}
                onPress={() => deleteTrip(item, modalObj.i)}
                activeOpacity={0.7}
                style={{
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#B93B3B',
                  height: 50,
                  borderRadius: 10,
                  alignSelf: 'center',
                }}>
                {!mloader && (
                  <Text
                    style={{
                      color: theme.color.buttonText,
                      fontSize: 16,
                      fontFamily: theme.fonts.fontBold,
                      textTransform: 'none',
                    }}>
                    Yes, remove now
                  </Text>
                )}
                {mloader && (
                  <ActivityIndicator size={20} color={theme.color.buttonText} />
                )}
              </TouchableOpacity>
            </>
          );
        };

        const renderButton2 = () => {
          return (
            <>
              <TouchableOpacity
                disabled={mloader}
                onPress={() => {
                  closeModal();
                }}
                activeOpacity={0.7}
                style={{
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: theme.color.button2,
                  height: 50,
                  borderRadius: 10,
                  alignSelf: 'center',
                  // borderWidth: 1,
                  // borderColor: theme.color.fieldBorder,
                  marginTop: 12,
                }}>
                <Text
                  style={{
                    color: '#30563A',
                    textTransform: 'none',
                    fontFamily: theme.fonts.fontBold,
                    fontSize: 16,
                  }}>
                  No, keep it
                </Text>
              </TouchableOpacity>
            </>
          );
        };

        return (
          <View
            style={
              c
                ? {
                    backgroundColor: theme.color.background,
                    shadowColor: '#000000',
                    shadowOffset: {width: 0, height: -1}, // change this for more shadow
                    shadowOpacity: 0.1,
                    elevation: 5,
                    borderBottomLeftRadius: 10,
                    borderBottomRightRadius: 10,
                    marginTop: 5,
                  }
                : {marginTop: 40}
            }>
            <View
              style={
                c ? styles.modalBottomContainer : styles.modalBottomContainer2
              }>
              {renderButton1()}
              {renderButton2()}
            </View>
          </View>
        );
      };

      return (
        <Modal visible={isModal} transparent onRequestClose={closeModal}>
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalContainer2}>
              <View
                onLayout={event => {
                  if (!c) {
                    let {height} = event.nativeEvent.layout;
                    setmodalHeight(height);
                  }
                }}
                style={style}>
                {c && (
                  <>
                    {renderHeader()}
                    <ScrollView
                      contentContainerStyle={{paddingHorizontal: 15}}
                      showsVerticalScrollIndicator={false}
                      style={{flex: 1}}>
                      {renderInfo()}
                      {renderField()}
                    </ScrollView>
                    {renderBottom()}
                  </>
                )}

                {!c && (
                  <>
                    {renderHeader()}
                    {renderInfo()}
                    {renderField()}
                    {renderBottom()}
                  </>
                )}
              </View>
            </View>
          </SafeAreaView>
        </Modal>
      );
    }
  };

  const renderEmptyMessage = () => {
    return (
      <View
        style={{
          top: '45%',
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'center',
        }}>
        <Text
          style={{
            fontSize: 14,
            color: theme.color.subTitleLight,
            fontFamily: theme.fonts.fontMedium,
          }}>
          No any trip save
        </Text>
      </View>
    );
  };

  return (
    <>
      <View style={styles.container}>
        <utils.DrawerHeader props={props} headerTitle={headerTitle} />
        {!internet && <utils.InternetMessage />}
        <SafeAreaView style={styles.container2}>
          <View style={styles.container3}>
            {data.length <= 0 && renderEmptyMessage()}
            {data.length > 0 && (
              <FlatList
                contentContainerStyle={{
                  paddingVertical: 12,
                  paddingHorizontal: 15,
                }}
                data={data}
                renderItem={ItemView}
                // keyExtractor={(item, index) => index.toString()}
                ListEmptyComponent={EmptyListMessage}
                ItemSeparatorComponent={ItemSeparatorView}
                ListHeaderComponent={ListHeader}
                // ListFooterComponent={ListFooter}
              />
            )}
          </View>

          <utils.Footer
            nav={props.navigation}
            screen={headerTitle}
            focusScreen={store.General.focusScreen}
          />
        </SafeAreaView>
        {isModal && renderModal()}
        <Toast ref={toast} position="bottom" />
      </View>
    </>
  );
}
