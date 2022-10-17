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

function isObjectEmpty(value) {
  return (
    Object.prototype.toString.call(value) === '[object Object]' &&
    JSON.stringify(value) === '{}'
  );
}

export default observer(Home);

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

let css2 = {
  container: {
    backgroundColor: 'transparent',
    // borderWidth: 1.5,
    // borderColor: '#cccccc',
    // borderStyle: 'dashed',
  },
  text: {
    color: theme.color.subTitleLight,
    fontFamily: theme.fonts.fontMedium,
  },
};

const today = moment().format('YYYY-MM-DD');
let td = {
  [today]: {
    marked: false,
    selected: true,
    customStyles: {
      container: {
        backgroundColor: 'transparent',
        // borderWidth: 1.5,
        // borderColor: '#cccccc',
        // borderStyle: 'dashed',
      },
      text: {
        color: theme.color.title,
        fontFamily: theme.fonts.fontMedium,
      },
    },

    disabled: false,
    disableTouchEvent: false,
  },
};

let dtd = {
  [today]: {
    marked: false,
    selected: true,
    customStyles: css2,
    // selectedColor: 'red',
    disabled: true,
    disableTouchEvent: true,
  },
};

const data = [
  {
    _id: 31,
    title: 'Hunting Trip',
    acceptOtherTrades: true,

    loc: {coords: [], name: 'Miami, Florida'},
    offer: 'Central N.C. Whitetail Hunting In The Back Country',
    photos: [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0OqjKG4QLGg-hvzwhf76mCB1shxkUchZN9Q&usqp=CAU',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbyQRxBY8uSBj1VaS26kR0_7Uk6BJ-YNz4XQ&usqp=CAU',
      'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTV8fHRyYXZlbGxpbmd8ZW58MHx8MHx8&w=1000&q=80',
    ],
    return: 'Alligator or Osceola Turkey',
    status: 'pending',

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
    availablity: {endDate: '2022-11-05', startDate: '2022-10-17'},
    duration: {number: '3', title: 'days'},
    unavailable: {
      all_unavailable_dates: [
        '2022-10-25',
        '2022-10-26',
        '2022-10-28',
        '2022-11-02',
        '2022-11-04',
      ],
      days_of_week: ['Fri'],
      esd_text: 'Oct 25-26, Nov 2',
      exclude_specific_dates: ['2022-10-25', '2022-10-26', '2022-11-02'],
      repeat_every: {endRepeatOn: '2022-11-05', num: 1, title: 'Weeks'},
      unavailable_days_of_week: ['2022-10-28', '2022-11-04'],
      wtxt: 'Fri (weekly)',
    },
  },
  {
    _id: 32,
    title: 'Fishing Trip',
    acceptOtherTrades: true,

    loc: {coords: [], name: 'Miami, Florida'},
    offer: 'North Idaho Black Bear Spot and Stalk',
    photos: [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0OqjKG4QLGg-hvzwhf76mCB1shxkUchZN9Q&usqp=CAU',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbyQRxBY8uSBj1VaS26kR0_7Uk6BJ-YNz4XQ&usqp=CAU',
      'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTV8fHRyYXZlbGxpbmd8ZW58MHx8MHx8&w=1000&q=80',
    ],
    return: 'Open to Offers',
    status: 'pending',
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
    availablity: {endDate: '2022-11-05', startDate: '2022-10-16'},
    duration: {number: '1', title: 'days'},
    unavailable: {
      all_unavailable_dates: [
        '2022-10-24',
        '2022-10-25',
        '2022-10-27',
        '2022-11-03',
      ],
      days_of_week: ['Thu'],
      esd_text: 'Oct 24-25',
      exclude_specific_dates: ['2022-10-24', '2022-10-25'],
      repeat_every: {endRepeatOn: '2022-11-05', num: 1, title: 'Weeks'},
      unavailable_days_of_week: ['2022-10-27', '2022-11-03'],
      wtxt: 'Thu (weekly)',
    },
  },
];

var getDaysArray = function (start, end) {
  for (
    var arr = [], dt = new Date(start);
    dt <= new Date(end);
    dt.setDate(dt.getDate() + 1)
  ) {
    arr.push(new Date(dt));
  }
  return arr;
};

function Home(props) {
  let maxModalHeight = theme.window.Height - 100;
  const [modalHeight, setmodalHeight] = useState(0);

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

  const [step, setstep] = useState(1);

  const [message, setMessage] = useState('');

  const [showCalender, setshowCalender] = useState(false);

  const [iDate, setiDate] = useState(new Date());
  const [minDate, setminDate] = useState('');
  const [maxDate, setmaxDate] = useState('');
  const [isDisableToday, setisDisableToday] = useState(false);
  const [month, setmonth] = useState(new Date());

  const [markedDates, setmarkedDates] = useState({});
  const [selDates, setselDates] = useState({});
  const [isSelDate, setisSelDate] = useState(false);

  let tripdata = store.User.trips;
  const [isDropDownTrip, setisDropDownTrip] = useState(false);
  const [trip, settrip] = useState(false);

  const [isCustom, setisCustom] = useState(false);

  const closeAllDropDown = () => {
    setisDropDownTrip(false);
  };

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
    let status = item.status || '';
    let tripPhotos = item.photos || [];
    let title = item.title || '';
    let offer = item.offer || '';
    let locName = item.loc ? item.loc.name : '';
    let trade = item.return || '';
    let availability = item.availability || '';

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
    if (c == 'offer') {
      setstep(1);
    }
  };

  const closeModal = () => {
    if (step == 1) {
      clearModal1();
      return;
    }
    if (step == 2) {
      clearModal2();
      return;
    }

    if (step == 3 && !isCustom) {
      clearModal3();
      return;
    }

    if (step == 3 && isCustom) {
      clearModal3C();
      return;
    }
  };

  const clearModal1 = () => {
    if (!mloader) {
      setisModal(false);
      setmodalChk(false);
      setmodalObj(false);
      setMessage('');
      setshowCalender(false);
      setselDates({});
      setmarkedDates({});
      setisSelDate(false);
      setstep(1);
      setiDate(new Date());
      setminDate('');
      setmaxDate('');
      setisDisableToday(false);
      setmonth(new Date());
      setmodalHeight(0);
      closeAllDropDown();
    }
  };

  const clearModal2 = () => {
    if (!mloader) {
      setstep(1);
      settrip(false);
      closeAllDropDown();
    }
  };

  const clearModal3 = () => {
    if (!mloader) {
      setstep(2);
    }
  };

  const clearModal3C = () => {
    if (!mloader) {
      setstep(2);
      settrip(false);
      closeAllDropDown();
    }
  };

  const renderModal = () => {
    let c = modalHeight >= maxModalHeight ? true : false;
    let style = c ? [styles.modal, {height: maxModalHeight}] : styles.modal2;

    if (modalChk == 'offer' && step == 1) {
      let item = modalObj.item;

      const renderHeader = () => {
        let text = 'Make Offer';

        const renderCross = () => {
          return (
            <Pressable
              style={({pressed}) => [{opacity: pressed ? 0.7 : 1.0}]}
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
                    flexDirection: 'row',
                    justifyContent: 'space-between',
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
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }
            }>
            <View style={{width: '80%'}}>{renderTitle()}</View>
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
        let userName = item.user.first_name + ' ' + item.user.last_name;
        let isVeirfy = item.user.isVerified || false;
        let duration = item.duration.number;
        let t =
          duration < 1
            ? item.duration.title.substring(0, item.duration.title.length - 1)
            : item.duration.title;
        duration = duration + ' ' + t;
        let photo = item.user.photo || '';
        let offer = item.offer || '';

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
                Duration : {duration}
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
          let tt = '';
          let esd = [];

          var myObject = selDates;
          Object.keys(myObject).forEach(function (key, index) {
            esd.push(key);
          });

          let arset = []; //for sort and set format
          if (esd.length > 0) {
            esd.sort(function (a, b) {
              return Number(new Date(a)) - Number(new Date(b));
            });
            esd.map((e, i, a) => {
              arset.push(moment(e).format('MMM DD'));
            });
          }
          let arr = []; //for amse sequece date separate
          if (arset.length > 0) {
            let arset2 = arset.slice();

            arset.map((e, i, a) => {
              let d = [];
              let chkd = e;
              let chki = i;

              d.push({d: chkd});
              delete arset[chki];

              let id = 0;
              for (let index = ++chki; index < arset2.length; index++) {
                const ee = arset2[index];
                if (chkd.slice(0, 3) == ee.slice(0, 3)) {
                  let n1 = chkd.slice(4, 6);
                  let n2 = ee.slice(4, 6);
                  id++;
                  if (Number(n1) + id == Number(n2)) {
                    d.push({d: ee});
                    delete arset[index];
                  } else {
                    break;
                  }
                }
              }

              arr.push(d);
            });
          }

          if (arr.length > 0) {
            arr.map((e, i, a) => {
              let aa = e;
              if (aa.length > 1) {
                tt =
                  tt +
                  moment(aa[0].d).format('MMM D') +
                  '-' +
                  moment(aa[aa.length - 1].d)
                    .format('MMM D')
                    .slice(4, 6) +
                  ', ';
              } else {
                tt = tt + moment(aa[0].d).format('MMM D') + ', ';
              }
            });
          }
          tt = tt.replace(/, *$/, '');

          t = tt;
        } else {
          let duration = parseInt(item.duration.number);
          t =
            duration <= 1
              ? 'Select a trip date'
              : 'Select a trip date or date range';
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
                style={[
                  styles.mfT2,
                  {opacity: isObjectEmpty(selDates) ? 0.4 : 1},
                ]}>
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
        let chk = isObjectEmpty(selDates) ? true : false;
        const renderButton1 = () => {
          return (
            <View>
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
                Step {step} of 4
              </Text>
            </View>
          );
        };

        const renderButton2 = () => {
          const Continue = () => {
            setstep(2);
          };

          return (
            <Pressable
              disabled={chk}
              onPress={Continue}
              style={({pressed}) => [
                {opacity: pressed ? 0.8 : chk ? 0.5 : 1.0},
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
                : {marginTop: 30}
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
                      {renderTitle()}
                      {renderInfo()}
                      {renderField()}
                    </ScrollView>
                    {renderBottom()}
                  </>
                )}

                {!c && (
                  <>
                    {renderHeader()}
                    {renderTitle()}
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

    if (modalChk == 'offer' && step == 2) {
      let item = modalObj.item;

      const renderHeader = () => {
        let text = 'Make Offer';

        const renderCross = () => {
          return (
            <Pressable
              style={({pressed}) => [{opacity: pressed ? 0.7 : 1.0}]}
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
                    flexDirection: 'row',
                    justifyContent: 'space-between',
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
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }
            }>
            <View style={{width: '80%'}}>{renderTitle()}</View>
            {renderCross()}
          </View>
        );
      };

      const renderTitle = () => {
        let text = "Now, let's fill out the details of your offer.";

        return (
          <View style={{marginTop: 10}}>
            <Text style={styles.modalsubTitle}>{text}</Text>
          </View>
        );
      };

      const renderInfo = () => {
        let userName = item.user.first_name + ' ' + item.user.last_name;
        let isVeirfy = item.user.isVerified || false;
        let duration = item.duration.number;
        let t =
          duration < 1
            ? item.duration.title.substring(0, item.duration.title.length - 1)
            : item.duration.title;
        duration = duration + ' ' + t;
        let photo = item.user.photo || '';
        let offer = item.offer || '';

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
                Duration : {duration}
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

      const renderShowDropDown = c => {
        let data = [];

        if (c == 'trip') {
          data = tripdata;
        }

        const onclickSelect = d => {
          if (d == 'customOffer') {
            setisCustom(true);
            setstep(3);
            closeAllDropDown();
            return;
          }
          if (c == 'trip') {
            settrip(d);
            return;
          }
        };

        let abs = Platform.OS == 'ios' ? false : true;
        return (
          <theme.DropDown2
            data={data}
            onSelectItem={d => {
              onclickSelect(d);
            }}
            setVisible={d => {
              closeAllDropDown();
            }}
            c={c}
            absolute={abs}
          />
        );
      };

      const renderDropDown = () => {
        let t = '';
        if (!isObjectEmpty(selDates)) {
          let tt = '';
          let esd = [];

          var myObject = selDates;
          Object.keys(myObject).forEach(function (key, index) {
            esd.push(key);
          });

          let arset = []; //for sort and set format
          if (esd.length > 0) {
            esd.sort(function (a, b) {
              return Number(new Date(a)) - Number(new Date(b));
            });
            esd.map((e, i, a) => {
              arset.push(moment(e).format('MMM DD'));
            });
          }
          let arr = []; //for amse sequece date separate
          if (arset.length > 0) {
            let arset2 = arset.slice();

            arset.map((e, i, a) => {
              let d = [];
              let chkd = e;
              let chki = i;

              d.push({d: chkd});
              delete arset[chki];

              let id = 0;
              for (let index = ++chki; index < arset2.length; index++) {
                const ee = arset2[index];
                if (chkd.slice(0, 3) == ee.slice(0, 3)) {
                  let n1 = chkd.slice(4, 6);
                  let n2 = ee.slice(4, 6);
                  id++;
                  if (Number(n1) + id == Number(n2)) {
                    d.push({d: ee});
                    delete arset[index];
                  } else {
                    break;
                  }
                }
              }

              arr.push(d);
            });
          }

          if (arr.length > 0) {
            arr.map((e, i, a) => {
              let aa = e;
              if (aa.length > 1) {
                tt =
                  tt +
                  moment(aa[0].d).format('MMM D') +
                  '-' +
                  moment(aa[aa.length - 1].d)
                    .format('MMM D')
                    .slice(4, 6) +
                  ', ';
              } else {
                tt = tt + moment(aa[0].d).format('MMM D') + ', ';
              }
            });
          }
          tt = tt.replace(/, *$/, '');

          t = tt;
        } else {
          let duration = parseInt(item.duration.number);
          t =
            duration <= 1
              ? 'Select a trip date'
              : 'Select a trip date or date range';
        }
        return (
          <View style={styles.dropDownMainConatiner}>
            <Text style={styles.dropdownFieldTitle}>
              What are you offering to trade?
            </Text>
            <TouchableOpacity
              onPress={() => {
                closeAllDropDown();
                setisDropDownTrip(!isDropDownTrip);
              }}
              activeOpacity={0.7}
              style={[styles.dropDowninputConatiner]}>
              <View style={{width: '91%'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={[
                    styles.dropDownText,
                    {
                      color: trip.offer
                        ? theme.color.title
                        : theme.color.subTitleLight,
                    },
                  ]}>
                  {trip.offer
                    ? trip.offer
                    : 'Select a trip or create custom offer...'}
                </Text>
              </View>

              <utils.vectorIcon.Fontisto
                name="angle-down"
                color={theme.color.title}
                size={12}
              />
            </TouchableOpacity>

            {isDropDownTrip && renderShowDropDown('trip')}
          </View>
        );
      };

      const renderBottom = () => {
        const renderButton1 = () => {
          return (
            <Pressable
              onPress={closeModal}
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
                  marginRight: 10,
                },
              ]}>
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: theme.fonts.fontBold,
                  color: '#30563A',
                }}>
                Back
              </Text>
            </Pressable>
          );
        };

        const renderButton2 = () => {
          const Continue = () => {
            setstep(3);
          };

          return (
            <Pressable
              onPress={Continue}
              style={({pressed}) => [
                {opacity: pressed ? 0.8 : c ? 0.5 : 1.0},
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
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                  }
                : {
                    marginTop: 30,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                  }
            }>
            <View
              style={{
                width: '30%',
              }}>
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: theme.fonts.fontNormal,
                  color: theme.color.subTitleLight,
                  paddingLeft: 10,
                }}>
                Step {step} of 4
              </Text>
            </View>

            <View
              style={{
                width: '65%',

                alignItems: 'flex-end',
              }}>
              <View
                style={
                  c ? styles.modalBottomContainer : styles.modalBottomContainer2
                }>
                {renderButton1()}
                {renderButton2()}
              </View>
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
                      {renderTitle()}
                      {renderDropDown()}
                    </ScrollView>
                    {renderBottom()}
                  </>
                )}

                {!c && (
                  <>
                    {renderHeader()}
                    {renderTitle()}
                    {renderDropDown()}
                    {renderBottom()}
                  </>
                )}
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
    let unavailable_days = item.unavailable.all_unavailable_dates;
    let mdt = new Date(item.availablity.startDate);
    let cdt = new Date();
    let mind = '';
    if (mdt < cdt) {
      mind = moment(cdt).format('YYYY-MM-DD');
    } else {
      mind = moment(mdt).format('YYYY-MM-DD');
    }
    let mxd = item.availablity.endDate;
    let md = {};
    if (unavailable_days.length > 0) {
      unavailable_days.map((e, i, a) => {
        md[e] = {
          marked: false,
          selected: true,
          customStyles: css,
          // selectedColor: 'red',
          disabled: true,
          disableTouchEvent: true,
        };
      });
    }

    let duration = item.duration.number;

    const closeCalModal = () => {
      setshowCalender(false);
      setmarkedDates(selDates);
      const size = Object.keys(selDates).length;
      if (size >= duration) {
        if (size < 2 && size > 0) {
          //for duration equal yo 1
          const dt = Object.keys(selDates);
          setminDate(dt[0]);
          setmaxDate(dt[0]);
          if (dt[0] !== today) {
            setisDisableToday(true);
          }
        } else {
          //for duration more than 1
        }
      } else {
        setminDate('');
        setmaxDate('');
        setisDisableToday(false);
      }
    };
    const ApplyCalModal = () => {
      setmarkedDates(markedDates);
      setselDates(markedDates);
      const size = Object.keys(markedDates).length;
      if (size >= duration) {
        if (size < 2 && size > 0) {
          //for duration equal yo 1
          const dt = Object.keys(markedDates);
          setminDate(dt[0]);
          setmaxDate(dt[0]);
          if (dt[0] !== today) {
            setisDisableToday(true);
          }
        } else {
          //for duration more than 1
        }
      } else {
        setminDate('');
        setmaxDate('');
        setisDisableToday(false);
      }
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

        if (duration <= 1) {
          setminDate(date);
          setmaxDate(date);
          setisDisableToday(true);
        } else {
          let mindate = mind;
          let maxdate = mxd;

          let ua = unavailable_days.slice();

          let sdu = date;
          let ar = [];
          ar.push(sdu);
          for (let index = 1; index < duration; index++) {
            sdu = moment(moment(new Date(sdu)).add(1, 'day')).format(
              'YYYY-MM-DD',
            );
            if (sdu > maxdate) {
              break;
            }
            let ind = 0;
            if (ua.length > 0) {
              ind = ua.findIndex(x => x === sdu);
            }
            if (ind < 0) {
              ar.push(sdu);
            } else {
              duration++;
            }
          }

          console.log('ar : ', ar);

          if (ar.length > 0) {
            let mindd = ar[0];
            let mxxd = ar[ar.length - 1];

            setminDate(mindd);
            setmaxDate(mxxd);
            setisDisableToday(true);
          }
        }
      } else {
        let md = {...markedDates};
        let o = md[date];
        if (o !== undefined) {
          console.warn('The key exists.');
          delete md[date];
          setmarkedDates(md);
          const size = Object.keys(md).length;
          if (size < duration) {
            if (size == 0) {
              setisDisableToday(false);
              setminDate('');
              setmaxDate('');
            } else {
              if (date == today) {
                setisDisableToday(false);
              }
            }
          }

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
      let item = modalObj.item;
      let duration = item.duration.number;
      let t =
        duration < 1
          ? item.duration.title.substring(0, item.duration.title.length - 1)
          : item.duration.title;
      duration = duration + ' ' + t;
      return (
        <View
          style={{
            marginTop: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: '40%',
              paddingLeft: 10,
            }}>
            <Text
              style={{
                fontSize: 11,
                fontFamily: theme.fonts.fontNormal,
                color: theme.color.subTitleLight,
              }}>
              Duration : {duration}
            </Text>
          </View>

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
    let todaymark = isDisableToday ? dtd : td;
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
              disableMonthChange={true}
              initialDate={minDate != '' ? minDate : mind}
              minDate={minDate != '' ? minDate : mind}
              maxDate={maxDate != '' ? maxDate : mxd}
              onDayPress={day => {
                getSelectedDayEvents(day.dateString);
              }}
              onDayLongPress={day => {
                console.log('selected long press day', day);
              }}
              monthFormat={'yyyy MM'}
              onMonthChange={month => {
                setmonth(new Date(month.dateString));
              }}
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
              markedDates={{...todaymark, ...md, ...markedDates}}
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
