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
import moment from 'moment/moment';

function isObjectEmpty(value) {
  return (
    Object.prototype.toString.call(value) === '[object Object]' &&
    JSON.stringify(value) === '{}'
  );
}

export default observer(Home);

const data = [
  {
    _id: 31,
    user: {
      _id: 2,
      first_name: 'mike',
      last_name: 'monuse',
      // photo:"",
      photo:
        'https://www.adobe.com/express/create/media_127540366421d3d5bfcaf8202527ca7d37741fd5d.jpeg?width=400&format=jpeg&optimize=medium',
      avg_rating: 3.8,
      total_reviews: 190,
      isVerified: true,
    },
    duration: 3,
    title: 'Hunting Trip',
    offer: 'Central N.C. Whitetail Hunting In The Back Country',
    for_trade: 'Alligator or Osceola Turkey ',
    availability: new Date(),
    unavailable_days: ['2022-10-25', '2022-10-20', '2022-10-5'],
    status: 'pending',
    photos: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHw%3D&w=1000&q=80',
      'https://wallpaperaccess.com/full/1534474.jpg',
      'https://www.pixelstalk.net/wp-content/uploads/images6/4K-Travel-Wallpaper-HD-Free-download.jpg',
      'https://images.wallpapersden.com/image/download/trip-night_a21tZmmUmZqaraWkpJRmbmdlrWZlbWU.jpg',
    ],
    loc: {
      name: 'Dylan, NC',
      coords: [],
    },
  },

  {
    _id: 32,
    user: {
      _id: 7,
      first_name: 'James',
      last_name: 'Bond',
      // photo:"",
      photo:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHw%3D&w=1000&q=80',

      avg_rating: 3.5,
      total_reviews: 100,
      isVerified: false,
    },
    title: 'Fishing Trip',
    duration: 4,
    offer: 'North Idaho Black Bear Spot and Stalk',
    for_trade: 'Alligator or Osceola Turkey',
    availability: new Date(),
    unavailable_days: ['2022-10-15', '2022-10-23', '2022-10-10'],
    status: 'pending',
    photos: [
      'https://images.wallpapersden.com/image/download/trip-night_a21tZmmUmZqaraWkpJRmbmdlrWZlbWU.jpg',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHw%3D&w=1000&q=80',
      'https://wallpaperaccess.com/full/1534474.jpg',
    ],
    loc: {
      name: 'Tim, ID',
      coords: [],
    },
  },
];

function Home(props) {
  const toast = useRef(null);
  const toastduration = 700;
  let headerTitle = 'Home';
  let tagLine = '';
  let internet = store.General.isInternet;
  let user = store.User.user;
  let goto = store.General.goto;

  let mloader = store.User.mLoader;

  const [modalObj, setmodalObj] = useState(false);
  const [modalChk, setmodalChk] = useState(false);
  const [isModal, setisModal] = useState(false);

  const [message, setMessage] = useState('');

  const [showCalender, setshowCalender] = useState(false);

  const [iDate, setiDate] = useState(new Date());
  const [minDate, setminDate] = useState(new Date());
  const [maxDate, setmaxDate] = useState(new Date());
  const [month, setmonth] = useState(new Date());

  const [markedDates, setmarkedDates] = useState({});
  const [isSelDate, setisSelDate] = useState(false);
  const [selDates, setselDates] = useState({});

  useEffect(() => {
    if (!isObjectEmpty(markedDates)) {
      // let obj = markedDates;
      // Object.keys(obj).reduce((acc, elem) => {
      //   let d = obj[elem];
      //   if (d.selected) {
      //     setisSelDate(true);
      //     return;
      //   }
      // }, {});
      setisSelDate(true);
    } else {
      setisSelDate(false);
    }
  }, [markedDates]);

  useEffect(() => {
    if (goto == 'profile') {
      props.navigation.navigate('MyProfile');
    }
  }, []);

  const onclickSearchBar = () => {};
  const onClickSaveTrips = (dt, ind) => {};
  const onClickMakeOffer = (dt, ind) => {
    openModal({item: dt, i: ind}, 'offer');
  };
  const onClickMessage = (dt, ind) => {
    openModal({item: dt, i: ind}, 'message');
  };
  const onClickCal = () => {
    setshowCalender(!showCalender);
  };
  const sendMessage = () => {
    console.warn('msg send');
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

  const EmptyListMessage = ({item}) => {
    return (
      // Flat List Item
      <Text style={styles.emptyListStyle} onPress={() => getItem(item)}>
        No Data Found
      </Text>
    );
  };

  const ItemView = ({item, index}) => {
    //user
    let photo = item.user.photo;
    let userName = item.user.first_name + ' ' + item.user.last_name;
    let avgRating = item.user.avg_rating;
    let totalReviews = item.user.total_reviews;
    let isVeirfy = item.user.isVerified || false;

    //trip
    let tripPhotos = item.photos || [];
    let title = item.title || '';
    let offer = item.offer || '';
    let locName = item.loc ? item.loc.name : '';
    let trade = item.for_trade || '';
    let availability = item.availability || '';

    let status = item.status || '';

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
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.textContainertitle}>
              {userName}
            </Text>

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
            onPress={() => onClickSaveTrips(item, index)}
            style={({pressed}) => [
              {opacity: pressed ? 0.7 : 1.0},
              styles.iconContainer,
            ]}>
            <Image
              style={styles.iconSave}
              source={require('../../assets/images/addSave/img.png')}
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
                  disabled
                  style={({pressed}) => [
                    {opacity: pressed ? 0.95 : 1.0},
                    [styles.tripImageConatiner],
                  ]}>
                  <ProgressiveFastImage
                    style={styles.tripImg}
                    source={require('../../assets/images/imgLoad/img.jpeg')}
                    loadingImageStyle={styles.imageLoader}
                    loadingSource={require('../../assets/images/imgLoad/img.jpeg')}
                    blurRadius={10}
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
          <Text numberOfLines={2} ellipsizeMode="tail" style={styles.sec3T1}>
            {offer}
          </Text>
          <View style={styles.sec3T2Container}>
            <Image
              style={styles.sec3Icon}
              source={require('../../assets/images/location/img.png')}
            />
            <View style={{width: '92%'}}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.sec3T2}>
                {locName}
              </Text>
            </View>
          </View>
          <View style={{marginTop: 10}}>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.sec3T31}>
              In Return For
            </Text>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.sec3T32}>
              {trade}
            </Text>
          </View>
        </View>
      );
    };

    const renderSec4 = () => {
      return (
        <View style={styles.boxSection4}>
          <Pressable
            onPress={() => onClickMakeOffer(item, index)}
            style={({pressed}) => [
              {opacity: pressed ? 0.9 : 1.0},
              styles.sec4B,
            ]}>
            <Text style={styles.sec4T}>make offer</Text>
          </Pressable>

          <Pressable
            onPress={() => onClickMessage(item, index)}
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
          <Text style={styles.resultText}>{length} results</Text>
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
        <View style={{width: '80%'}}>
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
        <TouchableOpacity onPress={onclick} disabled>
          <Image
            source={require('../../assets/images/searchBar/filter/img.png')}
            style={styles.Baricon}
          />
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

  const openModal = (obj, c) => {
    setmodalObj(obj);
    setmodalChk(c);
    setisModal(true);
  };

  const closeModal = () => {
    if (!mloader) {
      setisModal(false);
      setmodalChk(false);
      setmodalObj(false);
      setMessage('');
      setshowCalender(false);
      setselDates({});
      setmarkedDates({});
    }
  };

  const renderModal = () => {
    if (modalChk == 'offer') {
      const renderHeader = () => {
        let text = 'Make Offer';

        const renderCross = () => {
          return (
            <Pressable
              disabled={mloader}
              style={({pressed}) => [
                {opacity: pressed ? 0.7 : 1.0},
                styles.modalCross,
              ]}
              onPress={closeModal}>
              <utils.vectorIcon.EvilIcons
                name="close"
                color={theme.color.title}
                size={30}
              />
            </Pressable>
          );
        };

        const renderTitle = () => {
          return <Text style={styles.modalTitle}>{text}</Text>;
        };

        return (
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            {renderTitle()}
            {renderCross()}
          </View>
        );
      };

      const renderTitle = () => {
        let text = 'To get started, choose your preferred dates for this trip.';

        return (
          <View style={{marginTop: 10}}>
            <Text style={styles.modalsubTitle}>{text}</Text>
          </View>
        );
      };

      const renderInfo = () => {
        let item = modalObj.item;
        let duration = item.duration || '';
        let photo = item.user.photo || '';
        let isVeirfy = item.user.isVerified || false;
        let offer = item.offer || '';
        let dt =
          duration == 1 ? 'Whole day' : duration > 1 ? duration + ' days' : '';
        let userName = item.user.first_name + ' ' + item.user.last_name;

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
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.mtextContainertitle}>
                {offer}
              </Text>

              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.textContainertitle2}>
                Duration : {dt}
              </Text>

              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.textContainertitle3}>
                Hosted by :{' '}
                <Text
                  style={[
                    styles.textContainertitle3,
                    {textTransform: 'capitalize'},
                  ]}>
                  {userName}
                </Text>
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
        let t = '';
        if (!isObjectEmpty(selDates)) {
          const size = Object.keys(selDates).length;
          t = size > 0 ? size + ' dates selected' : '';
        }

        return (
          <View style={styles.modalFieldConatiner}>
            <Text style={styles.mfT1}>Preferred Trip Date</Text>

            <Pressable
              onPress={onClickCal}
              style={({pressed}) => [
                {opacity: pressed ? 0.8 : 1.0},
                styles.mFieldContainer,
              ]}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[styles.mfT2, {opacity: t == '' ? 0.4 : 1}]}>
                {t == '' ? 'Choose a date or date range' : t}
              </Text>
              <View style={{width: '13%', alignItems: 'flex-end'}}>
                <Image
                  source={require('../../assets/images/cal/img.png')}
                  style={styles.mfT2icon}
                />
              </View>
            </Pressable>
          </View>
        );
      };

      const renderBottom = () => {
        const renderButton1 = () => {
          return (
            <View
            // style={[styles.ButtonContainer, {backgroundColor: 'transparent'}]}
            >
              <Text
                style={[
                  styles.ButtonText,
                  {
                    color: theme.color.title,
                    opacity: 0.5,
                    fontFamily: theme.fonts.fontNormal,
                    textTransform: 'none',
                  },
                ]}>
                Step 1 of 4
              </Text>
            </View>
          );
        };

        const renderButton2 = () => {
          return (
            <Pressable
              disabled={mloader}
              style={({pressed}) => [
                {opacity: pressed ? 0.8 : 1.0},
                styles.ButtonContainer,
                {backgroundColor: theme.color.button1},
              ]}>
              <Text
                style={[styles.ButtonText, {color: theme.color.buttonText}]}>
                Continue
              </Text>
            </Pressable>
          );
        };

        return (
          <View style={styles.modalBottomContainer}>
            {renderButton1()}
            {renderButton2()}
          </View>
        );
      };

      return (
        <Modal visible={isModal} transparent onRequestClose={closeModal}>
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalContainer2}>
              <View style={styles.modal}>
                {renderHeader()}
                {renderTitle()}
                {renderInfo()}
                {renderField()}
                {renderBottom()}
              </View>
            </View>
          </SafeAreaView>
        </Modal>
      );
    }
    if (modalChk == 'message') {
      const renderHeader = () => {
        let text = 'Message User';

        const renderCross = () => {
          return (
            <Pressable
              disabled={mloader}
              style={({pressed}) => [
                {opacity: pressed ? 0.7 : 1.0},
                styles.modalCross,
              ]}
              onPress={closeModal}>
              <utils.vectorIcon.EvilIcons
                name="close"
                color={theme.color.title}
                size={30}
              />
            </Pressable>
          );
        };

        const renderTitle = () => {
          return <Text style={styles.modalTitle}>{text}</Text>;
        };

        return (
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            {renderTitle()}
            {renderCross()}
          </View>
        );
      };

      const renderField = () => {
        let item = modalObj.item;
        let photo = item.user.photo || '';
        let isVeirfy = item.user.isVerified || false;
        let userName = item.user.first_name + ' ' + item.user.last_name;

        const renderProfile = () => {
          return (
            <View style={styles.mProfileImgContainerm}>
              <ProgressiveFastImage
                style={styles.mProfileImgm}
                source={
                  photo != ''
                    ? {uri: photo}
                    : require('../../assets/images/drawer/guest/img.png')
                }
                loadingImageStyle={styles.mimageLoaderm}
                loadingSource={require('../../assets/images/imgLoad/img.jpeg')}
                blurRadius={5}
              />
              {/* {isVeirfy && (
                <Image
                  style={styles.miconVerifym}
                  source={require('../../assets/images/verified/img.png')}
                />
              )} */}
            </View>
          );
        };

        return (
          <View style={[styles.modalFieldConatiner, {marginTop: 15}]}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={styles.mT1}>To:</Text>
              <View
                style={{
                  width: '89%',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                }}>
                {renderProfile()}
                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.mT2}>
                  {userName}
                </Text>
              </View>
            </View>

            <View style={styles.textArea}>
              <TextInput
                value={message}
                onChangeText={c => {
                  setMessage(c);
                }}
                style={styles.mTextInpt}
                placeholder="Type your message here"
                multiline={true}
                numberOfLines={10}
              />
            </View>
          </View>
        );
      };

      const renderBottom = () => {
        const renderButton = () => {
          return (
            <Pressable
              onPress={sendMessage}
              disabled={mloader == true ? true : message == '' ? true : false}
              style={({pressed}) => [
                {opacity: pressed ? 0.9 : message == '' ? 0.5 : 1},
                styles.ButtonContainer,
                {backgroundColor: theme.color.button1, width: '100%'},
              ]}>
              <Text
                style={[
                  styles.ButtonText,
                  {color: theme.color.buttonText, fontSize: 13},
                ]}>
                Send Message
              </Text>
            </Pressable>
          );
        };

        return (
          <View style={styles.modalBottomContainer}>{renderButton()}</View>
        );
      };

      return (
        <Modal visible={isModal} transparent onRequestClose={closeModal}>
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalContainer2}>
              <View style={styles.modal}>
                {renderHeader()}
                {renderField()}
                {renderBottom()}
              </View>
            </View>
          </SafeAreaView>
        </Modal>
      );
    }
  };

  const renderCalender = () => {
    let item = modalObj.item;
    let unavailable_days = item.unavailable_days;
    let md = {};
    if (unavailable_days.length > 0) {
      let css = {
        container: {
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderColor: '#cccccc',
          borderStyle: 'dashed',
        },
        text: {
          color: theme.color.subTitleLight,
          fontFamily: theme.fonts.fontMedium,
        },
      };

      unavailable_days.map((e, i, a) => {
        md[e] = {
          marked: false,
          selected: true,
          customStyles: css,
          selectedColor: 'red',
          disabled: true,
          disableTouchEvent: true,
        };
      });
    }

    const closeCalModal = () => {
      setshowCalender(false);
      setmarkedDates(selDates);
    };
    const ApplyCalModal = () => {
      setselDates(markedDates);
      setmarkedDates(markedDates);
      setshowCalender(false);
    };

    const formatDate = date => {
      var dd = moment(date).format('MMMM YYYY');
      return dd;
    };

    const getSelectedDayEvents = date => {
      let cs = {
        container: {
          backgroundColor: theme.color.button1,
        },
        text: {
          color: theme.color.buttonText,
          fontFamily: theme.fonts.fontMedium,
          top: 2,
        },
      };

      if (isObjectEmpty(markedDates)) {
        let markedDates = {};
        markedDates[date] = {
          customStyles: cs,
          marked: false,
          selected: true,
          selectedColor: theme.color.button1,
          disabled: false,
          disableTouchEvent: false,
        };
        setmarkedDates(markedDates);
      } else {
        let md = {...markedDates};
        let o = md[date];
        if (o !== undefined) {
          console.warn('The key exists.');
          delete md[date];
          // o.selected = !o.selected;
          // md[date] = o;
          setmarkedDates(md);

          return;
        } else {
          console.warn('The key does not exist.');
          let md = {...markedDates};
          md[date] = {
            marked: false,
            selected: true,
            customStyles: cs,
            selectedColor: theme.color.button1,
            disabled: false,
            disableTouchEvent: false,
          };
          setmarkedDates(md);
          return;
        }
      }
    };

    const renderBottom = () => {
      let c = isSelDate ? false : true;
      return (
        <View style={{marginTop: 10, alignItems: 'flex-end', width: '100%'}}>
          <View
            style={{
              width: '55%',
              paddingRight: 10,
              alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: 'row',
            }}>
            <Pressable
              onPress={closeCalModal}
              style={({pressed}) => [
                {
                  opacity: pressed ? 0.9 : 1.0,
                  paddingHorizontal: 15,
                  paddingVertical: 8,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: theme.color.fieldBorder,
                  alignItems: 'center',
                  justifyContent: 'center',
                },
              ]}>
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: theme.fonts.fontBold,
                  color: '#30563A',
                }}>
                Cancel
              </Text>
            </Pressable>

            <Pressable
              onPress={ApplyCalModal}
              disabled={!isSelDate ? true : false}
              style={({pressed}) => [
                {
                  opacity: pressed ? 0.9 : c ? 0.5 : 1.0,
                  paddingHorizontal: 15,
                  paddingVertical: 8,
                  borderRadius: 8,
                  backgroundColor: theme.color.button1,
                  alignItems: 'center',
                  justifyContent: 'center',
                },
              ]}>
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: theme.fonts.fontBold,
                  color: theme.color.buttonText,
                }}>
                Apply
              </Text>
            </Pressable>
          </View>
        </View>
      );
    };

    let cusTheme = {
      textDisabledColor: theme.color.subTitleLight,
      dayTextColor: theme.color.title,
      textDayFontSize: 13,
      textDayFontFamily: theme.fonts.fontMedium,
      textDayHeaderFontSize: 13,
      textSectionTitleColor: theme.color.title,
      textDayHeaderFontFamily: theme.fonts.fontMedium,
    };
    return (
      <Modal visible={showCalender} transparent onRequestClose={closeCalModal}>
        <SafeAreaView
          style={[
            {
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20,
              backgroundColor: 'rgba(0,0,0,0.5)',
            },
          ]}>
          <View
            style={{
              width: '100%',
              alignSelf: 'center',
              paddingBottom: 20,
              backgroundColor: theme.color.background,
              borderRadius: 10,
              paddingTop: 5,
              paddingHorizontal: 5,
            }}>
            <Calendar
              theme={cusTheme}
              hideDayNames={false}
              hideArrows={false}
              hideExtraDays={false}
              disableMonthChange={true} // If hideArrows = false and hideExtraDays = false do not switch month when tapping on greyed out
              initialDate={iDate}
              // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
              minDate={minDate}
              // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
              // maxDate={maxDate}
              // Handler which gets executed on day press. Default = undefined
              onDayPress={day => {
                getSelectedDayEvents(day.dateString);
              }}
              // Handler which gets executed on day long press. Default = undefined
              onDayLongPress={day => {
                console.log('selected long press day', day);
              }}
              // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
              monthFormat={'yyyy MM'}
              // Handler which gets executed when visible month changes in calendar. Default = undefined
              onMonthChange={month => {
                setmonth(new Date(month.dateString));
              }}
              // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday
              firstDay={7}
              onPressArrowLeft={subtractMonth => subtractMonth()}
              onPressArrowRight={addMonth => addMonth()}
              renderHeader={date => {
                return (
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: theme.fonts.fontBold,
                      color: '#111111',
                    }}>
                    {formatDate(month)}
                  </Text>
                );
              }}
              enableSwipeMonths={true}
              disableAllTouchEventsForDisabledDays={true}
              markingType="custom"
              markedDates={{...md, ...markedDates}}

              // displayLoadingIndicator
            />
            {renderBottom()}
          </View>
        </SafeAreaView>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      {/* {tagLine != '' && <utils.TagLine tagLine={tagLine} />} */}
      <utils.DrawerHeader props={props} headerTitle={headerTitle} />
      {!internet && <utils.InternetMessage />}
      <SafeAreaView style={styles.container2}>
        <View style={styles.container3}>
          <FlatList
            contentContainerStyle={{paddingVertical: 12, paddingHorizontal: 15}}
            data={data}
            renderItem={ItemView}
            // keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={EmptyListMessage}
            ItemSeparatorComponent={ItemSeparatorView}
            ListHeaderComponent={ListHeader}
            ListFooterComponent={ListFooter}
          />
        </View>

        <utils.Footer
          nav={props.navigation}
          screen={headerTitle}
          focusScreen={store.General.focusScreen}
        />
      </SafeAreaView>

      {renderStatusBar()}
      {isModal && renderModal()}
      {showCalender && renderCalender()}
      <Toast ref={toast} position="bottom" />
    </View>
  );
}
