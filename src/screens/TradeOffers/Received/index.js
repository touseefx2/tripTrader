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
import moment, {duration} from 'moment/moment';

export default observer(Received);

function isObjectEmpty(value) {
  return (
    Object.prototype.toString.call(value) === '[object Object]' &&
    JSON.stringify(value) === '{}'
  );
}

let cssf = {
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

let css2f = {
  container: {
    backgroundColor: 'transparent',
  },
  text: {
    color: theme.color.subTitleLight,
    fontFamily: theme.fonts.fontMedium,
  },
};

let css2fd = {
  container: {
    backgroundColor: 'transparent',
  },
  text: {
    color: theme.color.title,
    fontFamily: theme.fonts.fontMedium,
  },
};

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

let td = {
  [moment().format('YYYY-MM-DD')]: {
    marked: false,
    selected: true,
    customStyles: css2fd,

    disabled: false,
    disableTouchEvent: false,
  },
};
let dtd = {
  [moment().format('YYYY-MM-DD')]: {
    marked: false,
    selected: true,
    customStyles: css2f,

    disabled: true,
    disableTouchEvent: true,
  },
};

function Received(props) {
  let maxModalHeight = theme.window.Height - 100;
  const [modalHeight, setmodalHeight] = useState(0);

  let guest = require('../../../assets/images/drawer/guest/img.png');
  let trnfericon = require('../../../assets/images/transfer/img.png');
  let durtnicon = require('../../../assets/images/confirmTrip/duration/img.png');
  let avlblicon = require('../../../assets/images/confirmTrip/available/img.png');
  let locationicon = require('../../../assets/images/confirmTrip/location/img.png');

  let internet = store.General.isInternet;
  let user = store.User.user;

  const [modalObj, setmodalObj] = useState(false);
  const [modalChk, setmodalChk] = useState(false);
  const [isModal, setisModal] = useState(false);

  const [isOfferSend, setisOfferSend] = useState(false);

  const [isSendMessage, setisSendMessage] = useState(false);
  const [sendObj, setsendObj] = useState('');

  const [message, setMessage] = useState('');

  const [step, setstep] = useState(1);
  const [showCal1, setshowCal1] = useState(false);
  const [minDatee, setminDatee] = useState('');
  const [maxDatee, setmaxDatee] = useState('');
  const [isDisableToday, setisDisableToday] = useState(false);
  const [monthh, setmonthh] = useState(new Date());

  const [markedDatess, setmarkedDatess] = useState({});
  const [selDatess, setselDatess] = useState({});
  const [isSelDatee, setisSelDatee] = useState(false);

  let data = store.Offers.rcvOffers;
  let mloader = store.Offers.Loader2; //main loader
  let mmloader = store.Offers.mLoader; //decline loader
  let mmmloader = store.User.homeModalLoder; //msg loader

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
        store.Offers.attemptToGetReceiveOffers(setGetDataOnce, setrefeshing);
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

  useEffect(() => {
    if (
      !isObjectEmpty(markedDatess) &&
      !isObjectEmpty(modalObj) &&
      modalChk == 'offer' &&
      step == 1
    ) {
      const size = Object.keys(markedDatess).length;

      let item = modalObj.item.hostTrip;
      let totaldays = 0;
      let t = item.duration.title;
      let duration = parseInt(item.duration.value);

      if (t == 'days') {
        totaldays = duration;
      } else if (t == 'weeks') {
        totaldays = duration * 7;
      } else if (t == 'months') {
        totaldays = duration * 30;
      } else if (t == 'years') {
        totaldays = duration * 365;
      }
      if (size == totaldays) {
        setisSelDatee(true);
      } else {
        setisSelDatee(false);
      }
    }

    if (
      isObjectEmpty(markedDatess) &&
      !isObjectEmpty(modalObj) &&
      modalChk == 'offer' &&
      step == 1
    ) {
      setisSelDatee(false);
    }
  }, [markedDatess, modalObj, modalChk, step]);

  //for diable totday day color in step1 calender in make offer
  useEffect(() => {
    if (
      !isObjectEmpty(modalObj) &&
      modalChk == 'offer' &&
      step == 1 &&
      isModal &&
      minDatee == ''
    ) {
      let item = modalObj.item.hostTrip;
      let sd = moment(item.availableFrom).format('YYYY-MM-DD');
      let cd = moment().format('YYYY-MM-DD');

      if (sd <= cd) {
        setisDisableToday(false);
      } else {
        setisDisableToday(true);
      }
    }
  }, [modalObj, modalChk, step, isModal, minDatee]);
  useEffect(() => {
    if (minDatee != '') {
      let todayd = moment().format('YYYY-MM-DD');
      if (minDatee <= todayd) {
        setisDisableToday(false);
      } else {
        setisDisableToday(true);
      }
    }
  }, [minDatee]);
  //end

  const closeOtherModal = () => {
    if (!mmloader) {
      setisModal(false);
      setmodalObj(false);
      setmodalChk(false);
      setmodalHeight(0);
    }
  };

  const closeOtherModal2 = () => {
    if (!mmmloader) {
      setisModal(false);
      setmodalObj(false);
      setmodalChk(false);
      setmodalHeight(0);
      setMessage('');
    }
  };

  const cancelOffer = () => {
    Keyboard.dismiss();

    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        store.Offers.attemptToDeclineOffer(modalObj, closeOtherModal);
      } else {
        // seterrorMessage('Please connect internet');
        Alert.alert('', 'Please connect internet');
      }
    });
  };

  const confirmOffer = () => {
    Keyboard.dismiss();

    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        let preferDate = [];
        let esd = [];
        //for sort and set format
        if (!isObjectEmpty(selDatess)) {
          Object.keys(selDatess).forEach(function (key, index) {
            esd.push(key);
          });
        }
        if (esd.length > 0) {
          esd.sort(function (a, b) {
            return Number(new Date(a)) - Number(new Date(b));
          });
          esd.map((e, i, a) => {
            preferDate.push(moment(e).format('MMM DD, YYYY'));
          });
        }

        let body = {
          tripDates: preferDate,
        };
        store.Offers.attemptToConfirmOffer(modalObj, body, setIsAcceptOffer);
      } else {
        // seterrorMessage('Please connect internet');
        Alert.alert('', 'Please connect internet');
      }
    });
  };

  const setIsAcceptOffer = v => {
    setsendObj(modalObj.item.offeredBy);
    setisOfferSend(true);
    closeModalAll();
  };

  const setIsSendMessage = v => {
    setsendObj(modalObj.item.offeredBy);
    closeOtherModal2();
    setisSendMessage(v);
  };

  const sendMessage = () => {
    Keyboard.dismiss();

    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        let item = modalObj.item;
        let usr = item.offeredBy;
        const obj = {
          userId1: user._id,
          userId2: usr._id,
          sendBy: user._id,
          sendTo: usr._id,
          senderName: user.firstName + ' ' + user.lastName,
          isRead: false,
          message: message,
          type: 'text',
        };
        store.User.attemptToCheckFirstMessage(
          user._id,
          usr._id,
          obj,
          message,
          setIsSendMessage,
        );
      } else {
        // seterrorMessage('Please connect internet');
        Alert.alert('', 'Please connect internet');
      }
    });
  };

  const closeModal = () => {
    if (step == 1) {
      closeModalAll();
      return;
    }
    if (step == 2) {
      if (!mmloader) {
        setstep(1);
        setmodalHeight(0);
      }
      return;
    }
  };

  const closeModalAll = () => {
    if (!mmloader) {
      setisModal(false);
      setmodalChk(false);
      setmodalObj(false);
      setMessage('');
      setshowCal1(false);
      setselDatess({});
      setmarkedDatess({});
      setisSelDatee(false);
      setstep(1);
      setminDatee('');
      setmaxDatee('');
      setisDisableToday(false);
      setmonthh(new Date());
      setmodalHeight(0);
      setstep(1);
    }
  };

  const onclickSearchBar = () => {};

  const onClickCal = () => {
    setshowCal1(!showCal1);
  };

  const ItemSeparatorView = () => {
    return (
      <View
        style={{
          height: 15,
        }}
      />
    );
  };

  const EmptyListMessage = ({item}) => {
    return (
      // Flat List Item
      <>
        {!mloader && getDataOnce && (
          <Text
            style={{
              marginTop: '80%',
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'center',
              fontSize: 13,
              color: theme.color.subTitleLight,
              fontFamily: theme.fonts.fontMedium,
            }}>
            No new received offers.
          </Text>
        )}

        {mloader && !getDataOnce && (
          <ActivityIndicator
            size={30}
            color={theme.color.button1}
            style={{
              marginTop: '80%',

              alignSelf: 'center',
            }}
          />
        )}
      </>
    );
  };

  const ListHeader = () => {
    const renderResult = () => {
      let length = data.length;
      return (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>
            You received {length} {length <= 1 ? 'offer' : 'offers'}
          </Text>
        </View>
      );
    };

    const renderSearch = () => {
      return (
        <TouchableOpacity disabled>
          <Image
            source={require('../../../assets/images/searchBar/search/img.png')}
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
            source={require('../../../assets/images/searchBar/filter/img.png')}
            style={styles.Baricon}
          /> */}
        </TouchableOpacity>
      );
    };

    return (
      <>
        {/* <Pressable
          style={({pressed}) => [
            {opacity: pressed ? 0.9 : 1},
            [styles.SerchBarContainer],
          ]}
          onPress={onclickSearchBar}>
          {renderSearch()}
          {renderInput()}
          {renderFilter()}
        </Pressable> */}

        {data.length > 0 && renderResult()}
      </>
    );
  };

  function FormatAvlblDate(s1, s2) {
    let avlbl = '';

    let sd = s1;
    let sdy = parseInt(new Date(sd).getFullYear());
    let ed = s2;
    let edy = parseInt(new Date(ed).getFullYear());
    if (sdy == edy) {
      avlbl =
        moment(sd).format('MMM DD') + ' - ' + moment(ed).format('MMM DD, YYYY');
    } else {
      avlbl =
        moment(sd).format('MMM DD, YYYY') +
        ' - ' +
        moment(ed).format('MMM DD, YYYY');
    }

    return avlbl;
  }

  function FormatPrfrDate(pd) {
    let t = '';
    let arset = [];
    if (pd.length > 0) {
      pd.map((e, i, a) => {
        arset.push(moment(e).format('MMM DD, YYYY'));
      });
    }
    if (arset.length > 0) {
      let fd = arset[0];
      if (arset.length > 1) {
        let sd = arset[arset.length - 1];

        let sdy = parseInt(new Date(fd).getFullYear());

        let edy = parseInt(new Date(sd).getFullYear());

        if (sdy == edy) {
          t =
            moment(fd).format('MMM DD') +
            ' - ' +
            moment(sd).format('MMM DD, YYYY');
        } else {
          t = fd + ' - ' + sd;
        }
      } else if (arset.length <= 1) {
        t = fd;
      }
    }

    return t;
  }

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

  const ItemView = ({item, index}) => {
    let user = item.offeredBy;
    let ofer = item.hostTrip;
    let trade = item.offeredTrip;
    let offernote = item.note || '';
    let create = CheckDate(item.createdAt);

    //user info
    let photo = user.image && user.image != '' ? {uri: user.image} : guest;
    let userName = user.firstName + ' ' + user.lastName || '';
    let avgRating = user.rating || 0;
    let totalReviews = user.reviews || 0;

    //offer by (host trip)
    let title = ofer.species;
    let dur = ofer.duration.value;
    let t =
      dur <= 1
        ? ofer.duration.title.substring(0, ofer.duration.title.length - 1)
        : ofer.duration.title;
    dur = dur + ' ' + t;
    let avlbl = FormatAvlblDate(ofer.availableFrom, ofer.availableTo);
    let loc = ofer.location.city + ', ' + ofer.location.state;

    //ofer to (offer trip)
    let titlet = trade.species;
    let durt = trade.duration.value;
    let tt =
      durt <= 1
        ? trade.duration.title.substring(0, trade.duration.title.length - 1)
        : trade.duration.title;
    durt = durt + ' ' + tt;
    let preferdates = item.preferredDates;
    let avlblt = FormatPrfrDate(preferdates);
    let loct = trade.location.city + ', ' + trade.location.state;

    const renderProfile = () => {
      return (
        <>
          <View style={styles.mProfileImgContainer}>
            <ProgressiveFastImage
              style={styles.mProfileImg}
              source={photo}
              loadingImageStyle={styles.mimageLoader}
              loadingSource={require('../../../assets/images/imgLoad/img.jpeg')}
              blurRadius={5}
            />
          </View>
        </>
      );
    };

    const renderText = () => {
      return (
        <View style={[styles.mtextContainer]}>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View style={{width: '72%'}}>
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
                {userName}
              </Text>
            </View>
            <View
              style={{
                width: '27%',

                alignItems: 'flex-end',
              }}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  color: theme.color.subTitleLight,
                  fontSize: 11,
                  fontFamily: theme.fonts.fontMedium,
                  lineHeight: 22.4,
                }}>
                {create}
              </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 3}}>
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

    const renderFields = () => {
      let titleS = {
        color: theme.color.subTitleLight,
        fontSize: 11.5,
        fontFamily: theme.fonts.fontBold,
        textTransform: 'uppercase',
      };

      let titleM = {
        color: theme.color.title,
        fontSize: 13,
        fontFamily: theme.fonts.fontMedium,
        lineHeight: 19,
      };

      let iconS = {
        width: 20,
        height: 20,
        resizeMode: 'contain',
      };

      let titleM2 = {
        color: '#101B10',
        fontSize: 13,
        fontFamily: theme.fonts.fontNormal,
        lineHeight: 19,
      };

      let offertitleS = {
        color: '#101B10',
        fontSize: 12,
        fontFamily: theme.fonts.fontNormal,
      };

      return (
        <View style={{width: '96%', marginTop: 20, alignSelf: 'center'}}>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View style={{width: '40%'}}>
              <Text style={titleS}>OFFERED</Text>
              <Text style={titleM}>{title}</Text>

              <View style={{marginTop: 20}}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Image style={iconS} source={durtnicon} />
                  <View style={{width: '78%'}}>
                    <Text style={titleM2}>{dur}</Text>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 10,
                  }}>
                  <Image style={iconS} source={avlblicon} />
                  <View style={{width: '78%'}}>
                    <Text style={titleM2}>{avlbl}</Text>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 10,
                  }}>
                  <Image style={iconS} source={locationicon} />
                  <View style={{width: '78%'}}>
                    <Text style={titleM2}>{loc}</Text>
                  </View>
                </View>
              </View>
            </View>

            <Image
              style={{
                width: 24,
                height: 24,
                resizeMode: 'contain',
                top: 26,
              }}
              source={trnfericon}
            />

            <View style={{width: '40%'}}>
              <Text style={titleS}>for trade</Text>
              <Text style={titleM}>{titlet}</Text>

              <View style={{marginTop: 20}}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Image style={iconS} source={durtnicon} />
                  <View style={{width: '78%'}}>
                    <Text style={titleM2}>{durt}</Text>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 10,
                  }}>
                  <Image style={iconS} source={avlblicon} />
                  <View style={{width: '78%'}}>
                    <Text style={titleM2}>{avlblt}</Text>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 10,
                  }}>
                  <Image style={iconS} source={locationicon} />
                  <View style={{width: '78%'}}>
                    <Text style={titleM2}>{loct}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {offernote != '' && (
            <View style={{width: '100%', marginTop: 20}}>
              <Text style={titleS}>OFFER NOTE</Text>
              <Text style={offertitleS}>{offernote}</Text>
            </View>
          )}
        </View>
      );
    };

    const renderBottom2 = () => {
      let bc1 = {
        width: '46%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        height: 47,

        backgroundColor: '#F8ECEC',
      };

      let btS1 = {
        color: '#B93B3B',
        fontSize: 15,
        fontFamily: theme.fonts.fontBold,
      };

      let bc2 = {
        width: '46%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        height: 48,
        borderWidth: 1,
        borderColor: theme.color.fieldBorder,
      };

      let btS2 = {
        color: '#3C6B49',
        fontSize: 15,
        fontFamily: theme.fonts.fontBold,
      };

      return (
        <View
          style={{
            width: '100%',
            marginTop: 30,
            alignSelf: 'center',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Pressable
            onPress={() => {
              setmodalObj({item: item, i: index});
              setmodalChk('cancelOffer');
              setisModal(true);
            }}
            style={({pressed}) => [{opacity: pressed ? 0.8 : 1}, bc1]}>
            <Text numberOfLines={1} ellipsizeMode="tail" style={btS1}>
              Decline
            </Text>
          </Pressable>

          <Pressable
            style={({pressed}) => [{opacity: pressed ? 0.8 : 1}, bc2]}
            onPress={() => {
              setmodalObj({item: item, i: index});
              setmodalChk('message');
              setisModal(true);
            }}>
            <Text numberOfLines={1} ellipsizeMode="tail" style={btS2}>
              Message
            </Text>
          </Pressable>
        </View>
      );
    };

    const renderBottom = () => {
      let bc = {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        height: 48,
        backgroundColor: theme.color.button1,
        marginTop: 15,
        // borderWidth: 1,
        // borderColor: theme.color.fieldBorder,
      };

      let btS = {
        color: theme.color.buttonText,
        fontSize: 14,
        fontFamily: theme.fonts.fontBold,
      };

      return (
        <View
          style={{
            width: '100%',
          }}>
          {renderBottom2()}
          <Pressable
            onPress={() => {
              setmodalObj({item: item, i: index});
              setmodalChk('offer');
              setstep(1);
              setisModal(true);
            }}
            style={({pressed}) => [{opacity: pressed ? 0.8 : 1}, bc]}>
            <Text numberOfLines={1} ellipsizeMode="tail" style={btS}>
              Choose Trip Date
            </Text>
          </Pressable>
        </View>
      );
    };

    return (
      <Pressable
        disabled
        onPress={() => {}}
        style={({pressed}) => [
          {opacity: pressed ? 0.8 : 1.0},
          [
            styles.modalinfoConatiner,
            {
              marginTop: index == 0 ? 10 : 0,
            },
          ],
        ]}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
          }}>
          {renderProfile()}
          {renderText()}
        </View>
        {renderFields()}
        {renderBottom()}
      </Pressable>
    );
  };

  const renderModal = () => {
    let c = modalHeight >= maxModalHeight ? true : false;
    let style = c ? [styles.modal, {height: maxModalHeight}] : styles.modal2;

    if (modalChk == 'offer' && step == 1) {
      let item = modalObj.item;
      let user = item.offeredBy;
      let ofer = item.hostTrip;

      const renderHeader = () => {
        let text = 'Choose Trip Date';

        const renderCross = () => {
          return (
            <Pressable
              disabled={mmloader}
              style={({pressed}) => [{opacity: pressed ? 0.7 : 1.0}]}
              onPress={closeModalAll}>
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

      const renderInfo = () => {
        let photo = user.image ? user.image : '';
        let userName = user.firstName + ' ' + user.lastName;
        let isVeirfy = user.identityStatus == 'verified' ? true : false;
        let duration = ofer.duration.value;
        let t =
          duration <= 1
            ? ofer.duration.title.substring(0, ofer.duration.title.length - 1)
            : ofer.duration.title;
        duration = duration + ' ' + t;
        let spcs = ofer.species || '';

        const renderProfile = () => {
          return (
            <View style={styles.mProfileImgContainern}>
              <ProgressiveFastImage
                style={styles.mProfileImgn}
                source={
                  photo != ''
                    ? {uri: photo}
                    : require('../../../assets/images/drawer/guest/img.png')
                }
                loadingImageStyle={styles.mimageLoadern}
                loadingSource={require('../../../assets/images/imgLoad/img.jpeg')}
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
            <View style={styles.mtextContainern}>
              <Text
                style={[
                  styles.mtextContainertitle,
                  {textTransform: 'capitalize'},
                ]}>
                {spcs}
              </Text>

              <Text style={styles.textContainertitle2}>
                Duration: {duration}
              </Text>

              <Text style={styles.textContainertitle3}>
                Hosted by{' '}
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
          <View style={styles.modalinfoConatinern}>
            {renderProfile()}
            {renderText()}
          </View>
        );
      };

      const renderField = () => {
        let t = '';
        var myObject = selDatess;
        if (!isObjectEmpty(myObject)) {
          let esd = [];
          Object.keys(myObject).forEach(function (key, index) {
            esd.push(key);
          });

          let arset = []; //for sort and set format
          if (esd.length > 0) {
            // esd.sort(function (a, b) {
            //   return Number(new Date(a)) - Number(new Date(b));
            // });
            esd.map((e, i, a) => {
              arset.push(moment(e).format('MMM DD, YYYY'));
            });
          }
          if (arset.length > 0) {
            let fd = arset[0];
            if (arset.length > 1) {
              let sd = arset[arset.length - 1];
              t = fd + ' - ' + sd;
            } else if (arset.length <= 1) {
              t = fd;
            }
          }
        } else {
          let duration = parseInt(ofer.duration.value);
          t =
            duration <= 1
              ? 'Choose a trip date'
              : 'Choose a trip date or date range';
        }

        return (
          <View style={[styles.modalFieldConatiner, {marginTop: 20}]}>
            <Text style={[styles.mfT1, {textTransform: 'none'}]}>
              Choose your preferred trip date
            </Text>
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
                  {opacity: isObjectEmpty(selDatess) ? 0.4 : 1},
                ]}>
                {t == '' ? 'Choose a trip date' : t}
              </Text>
              <View style={{width: '13%', alignItems: 'flex-end'}}>
                <Image
                  source={require('../../../assets/images/cal/img.png')}
                  style={styles.mfT2icon}
                />
              </View>
            </Pressable>
          </View>
        );
      };

      const renderBottom = () => {
        let chk = isObjectEmpty(selDatess) ? true : false;

        const renderButton1 = () => {
          return (
            <Pressable
              onPress={closeModal}
              style={({pressed}) => [
                {
                  opacity: pressed ? 0.9 : 1.0,
                  paddingHorizontal: 8,
                  paddingVertical: 10,
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
                  fontSize: 11,
                  fontFamily: theme.fonts.fontBold,
                  color: '#30563A',
                }}>
                Cancel
              </Text>
            </Pressable>
          );
        };

        const renderButton2 = () => {
          return (
            <Pressable
              disabled={chk}
              onPress={() => {
                setstep(2);
                setmodalChk('offer');
                setmodalHeight(0);
              }}
              style={({pressed}) => [
                {opacity: pressed ? 0.8 : chk ? 0.5 : 1.0},
                styles.ButtonContainer,
                {
                  backgroundColor: theme.color.button1,
                  paddingHorizontal: !mmloader ? 8 : 15,
                },
              ]}>
              <Text
                style={[
                  styles.ButtonText,
                  {
                    color: theme.color.buttonText,
                    fontSize: 11,
                    textTransform: 'none',
                  },
                ]}>
                Review Trade
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
                    marginTop: 35,
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
                Step {step} of 2
              </Text>
            </View>

            <View
              style={{
                width: '65%',

                alignItems: 'flex-end',
              }}>
              <View
                style={
                  c
                    ? [styles.modalBottomContainern, {paddingTop: 15}]
                    : styles.modalBottomContainer2n
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

    //review
    if (modalChk == 'offer' && step == 2) {
      const renderHeader = () => {
        let text = 'Review Trade';

        const renderCross = () => {
          return (
            <Pressable
              disabled={mmloader}
              style={({pressed}) => [{opacity: pressed ? 0.7 : 1.0}]}
              onPress={closeModalAll}>
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

      const renderFields = () => {
        let item = modalObj.item;
        let user = item.offeredBy;
        let photo = user.image ? {uri: user.image} : guest;
        let ofer = item.hostTrip;

        let user2 = item.offeredTo;
        let photo2 = user2.image ? {uri: user2.image} : guest;
        let trade = item.offeredTrip;

        //offer by (host trip)
        let title = ofer.species;
        let dur = ofer.duration.value;
        let t =
          dur <= 1
            ? ofer.duration.title.substring(0, ofer.duration.title.length - 1)
            : ofer.duration.title;
        dur = dur + ' ' + t;
        let preferDate = [];
        let esd = [];
        //for sort and set format
        if (!isObjectEmpty(selDatess)) {
          Object.keys(selDatess).forEach(function (key, index) {
            esd.push(key);
          });
        }
        if (esd.length > 0) {
          esd.sort(function (a, b) {
            return Number(new Date(a)) - Number(new Date(b));
          });
          esd.map((e, i, a) => {
            preferDate.push(moment(e).format('MMM DD, YYYY'));
          });
        }
        let avlbl = FormatPrfrDate(preferDate);
        let loc = ofer.location.city + ', ' + ofer.location.state;

        //ofer to (offer trip)
        let titlet = trade.species;
        let durt = trade.duration.value;
        let tt =
          durt <= 1
            ? trade.duration.title.substring(0, trade.duration.title.length - 1)
            : trade.duration.title;
        durt = durt + ' ' + tt;
        let preferdates = item.preferredDates;
        let avlblt = FormatPrfrDate(preferdates);
        let loct = trade.location.city + ', ' + trade.location.state;

        let titleS = {
          color: theme.color.subTitleLight,
          fontSize: 11.5,
          fontFamily: theme.fonts.fontBold,
          textTransform: 'uppercase',
        };

        let titleM = {
          color: theme.color.title,
          fontSize: 13,
          fontFamily: theme.fonts.fontMedium,
          lineHeight: 19,
          marginTop: 2,
        };

        let iconS = {
          width: 20,
          height: 20,
          resizeMode: 'contain',
        };

        let titleM2 = {
          color: '#101B10',
          fontSize: 13,
          fontFamily: theme.fonts.fontNormal,
          lineHeight: 19,
        };

        let offertitleS = {
          color: '#101B10',
          fontSize: 12,
          fontFamily: theme.fonts.fontNormal,
        };

        return (
          <View style={{width: '97%', marginTop: 20, alignSelf: 'center'}}>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View style={{width: '40%'}}>
                <View style={styles.mProfileImgContainerr}>
                  <ProgressiveFastImage
                    style={styles.mProfileImgr}
                    source={photo}
                    loadingImageStyle={styles.mimageLoaderr}
                    loadingSource={require('../../../assets/images/imgLoad/img.jpeg')}
                    blurRadius={5}
                  />
                </View>

                <Text style={titleS}>Offering</Text>
                <Text style={titleM}>{title}</Text>

                <View style={{marginTop: 20}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Image style={iconS} source={durtnicon} />
                    <View style={{width: '78%'}}>
                      <Text style={titleM2}>{dur}</Text>
                    </View>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: 10,
                    }}>
                    <Image style={iconS} source={avlblicon} />
                    <View style={{width: '78%'}}>
                      <Text style={titleM2}>{avlbl}</Text>
                    </View>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: 10,
                    }}>
                    <Image style={iconS} source={locationicon} />
                    <View style={{width: '78%'}}>
                      <Text style={titleM2}>{loc}</Text>
                    </View>
                  </View>
                </View>
              </View>

              <Image
                style={{
                  width: 24,
                  height: 24,
                  top: 86,
                  resizeMode: 'contain',
                }}
                source={trnfericon}
              />

              <View style={{width: '40%'}}>
                <View style={styles.mProfileImgContainerr}>
                  <ProgressiveFastImage
                    style={styles.mProfileImgr}
                    source={photo2}
                    loadingImageStyle={styles.mimageLoader}
                    loadingSource={require('../../../assets/images/imgLoad/img.jpeg')}
                    blurRadius={5}
                  />
                </View>

                <Text style={titleS}>for trade</Text>
                <Text style={titleM}>{titlet}</Text>

                <View style={{marginTop: 20}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Image style={iconS} source={durtnicon} />
                    <View style={{width: '78%'}}>
                      <Text style={titleM2}>{durt}</Text>
                    </View>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: 10,
                    }}>
                    <Image style={iconS} source={avlblicon} />
                    <View style={{width: '78%'}}>
                      <Text style={titleM2}>{avlblt}</Text>
                    </View>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: 10,
                    }}>
                    <Image style={iconS} source={locationicon} />
                    <View style={{width: '78%'}}>
                      <Text style={titleM2}>{loct}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            <Pressable
              onPress={closeModal}
              style={({pressed}) => [
                {opacity: pressed ? 0.8 : 1.0},
                {
                  marginTop: 25,
                },
              ]}>
              <Text
                style={{
                  color: '#3C6B49',
                  fontSize: 11,
                  fontFamily: theme.fonts.fontBold,
                  textDecorationLine: 'underline',
                }}>
                Edit Trip Date
              </Text>
            </Pressable>
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
                  paddingHorizontal: 8,
                  paddingVertical: 10,
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
                  fontSize: 11,
                  fontFamily: theme.fonts.fontBold,
                  color: '#30563A',
                }}>
                Cancel
              </Text>
            </Pressable>
          );
        };

        const renderButton2 = () => {
          return (
            <Pressable
              disabled={mmloader}
              onPress={confirmOffer}
              style={({pressed}) => [
                {opacity: pressed ? 0.8 : 1.0},
                styles.ButtonContainer,
                {
                  backgroundColor: theme.color.button1,
                  paddingHorizontal: !mmloader ? 8 : 15,
                },
              ]}>
              {!mmloader && (
                <Text
                  style={[
                    styles.ButtonText,
                    {
                      color: theme.color.buttonText,
                      fontSize: 11,
                      textTransform: 'none',
                    },
                  ]}>
                  Confirm and Accept
                </Text>
              )}
              {mmloader && (
                <ActivityIndicator size={18} color={theme.color.buttonText} />
              )}
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
                    marginTop: 35,
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
                Step {step} of 2
              </Text>
            </View>

            <View
              style={{
                width: '65%',

                alignItems: 'flex-end',
              }}>
              <View
                style={
                  c
                    ? [styles.modalBottomContainern, {paddingTop: 15}]
                    : styles.modalBottomContainer2n
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
                      style={{flex: 1}}></ScrollView>
                    {renderFields()}
                    {renderBottom()}
                  </>
                )}

                {!c && (
                  <>
                    {renderHeader()}
                    {renderFields()}
                    {renderBottom()}
                  </>
                )}
              </View>
            </View>
          </SafeAreaView>
        </Modal>
      );
    }

    //cancel offer
    if (modalChk == 'cancelOffer') {
      const renderHeader = () => {
        let text = 'Decline Offer?';

        const renderCross = () => {
          return (
            <Pressable
              disabled={mmloader}
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
              onPress={closeOtherModal}>
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
        return (
          <View style={{width: '100%', marginTop: 12}}>
            <Text
              style={{
                fontSize: 17,
                color: theme.color.title,
                fontFamily: theme.fonts.fontNormal,
              }}>
              Are you sure you would like to decline offer?
            </Text>
          </View>
        );
      };

      const renderBottom = () => {
        const renderButton1 = () => {
          return (
            <>
              <TouchableOpacity
                disabled={mmloader}
                onPress={cancelOffer}
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
                {!mmloader && (
                  <Text
                    style={{
                      color: theme.color.buttonText,
                      fontSize: 16,
                      fontFamily: theme.fonts.fontBold,
                      textTransform: 'none',
                    }}>
                    Yes, decline offer
                  </Text>
                )}
                {mmloader && (
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
                disabled={mmloader}
                onPress={closeOtherModal}
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
        <Modal visible={isModal} transparent onRequestClose={closeOtherModal}>
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
                      {/* {renderField()} */}
                    </ScrollView>
                    {renderBottom()}
                  </>
                )}

                {!c && (
                  <>
                    {renderHeader()}
                    {renderInfo()}
                    {/*    {renderField()} */}
                    {renderBottom()}
                  </>
                )}
              </View>
            </View>
          </SafeAreaView>
        </Modal>
      );
    }

    //message
    if (modalChk == 'message') {
      const renderHeader = () => {
        let text = 'Message User';

        const renderCross = () => {
          return (
            <Pressable
              disabled={mmmloader}
              style={({pressed}) => [
                {opacity: pressed ? 0.7 : 1.0},
                styles.modalCross,
              ]}
              onPress={closeOtherModal2}>
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
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            {renderTitle()}
            {renderCross()}
          </View>
        );
      };

      const renderField = () => {
        let item = modalObj.item.offeredBy;
        let photo = item.image ? item.image : '';
        let isVeirfy = item.identityStatus == 'verified' ? true : false;
        let userName = item.firstName + ' ' + item.lastName;

        const renderProfile = () => {
          return (
            <View style={styles.mProfileImgContainerm}>
              <ProgressiveFastImage
                style={styles.mProfileImgm}
                source={
                  photo != ''
                    ? {uri: photo}
                    : require('../../../assets/images/drawer/guest/img.png')
                }
                loadingImageStyle={styles.mimageLoaderm}
                loadingSource={require('../../../assets/images/imgLoad/img.jpeg')}
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
              disabled={mmmloader == true ? true : message == '' ? true : false}
              style={({pressed}) => [
                {opacity: pressed ? 0.9 : message == '' ? 0.5 : 1},
                styles.ButtonContainer,
                {backgroundColor: theme.color.button1, width: '100%'},
              ]}>
              {!mmmloader && (
                <Text
                  style={[
                    styles.ButtonText,
                    {color: theme.color.buttonText, fontSize: 13},
                  ]}>
                  Send Message
                </Text>
              )}
              {mmmloader && (
                <ActivityIndicator size={20} color={theme.color.buttonText} />
              )}
            </Pressable>
          );
        };

        return (
          <View style={styles.modalBottomContainerrr}>{renderButton()}</View>
        );
      };

      return (
        <Modal visible={isModal} transparent onRequestClose={closeOtherModal2}>
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalContainer2}>
              <View style={styles.modal2}>
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

  const renderCalender1 = () => {
    let item = modalObj.item.hostTrip;

    let duration = item.duration.value;
    let durationTitle = item.duration.title;
    let unavailable_days = item.unAvailableDays.allUnavailableDates || [];
    let mdt = moment(item.availableFrom).format('YYYY-MM-DD');
    let cdt = moment(new Date()).format('YYYY-MM-DD');

    let mind = '';

    if (mdt < cdt) {
      mind = moment(cdt).format('YYYY-MM-DD');
    } else {
      mind = moment(mdt).format('YYYY-MM-DD');
    }
    let mxd = moment(item.availableTo).format('YYYY-MM-DD');
    let md = {};

    if (unavailable_days.length > 0) {
      unavailable_days.map((e, i, a) => {
        md[moment(e).format('YYYY-MM-DD')] = {
          marked: false,
          selected: true,
          customStyles: cssf,
          // selectedColor: 'red',
          disabled: true,
          disableTouchEvent: true,
        };
      });
    }

    const closeCalModal = () => {
      setmarkedDatess(selDatess);
      setshowCal1(false);
      const size = Object.keys(selDatess).length;
      const dt = Object.keys(selDatess);

      if (size > 0) {
        if (size < 2 && size > 0) {
          //for duration ==1
          setminDatee(dt[0]);
          setmaxDatee(dt[0]);
        } else if (size > 1) {
          //for duration  > 1
          setminDatee(dt[0]);
          setmaxDatee(dt[size - 1]);
        }
      } else {
        setminDatee('');
        setmaxDatee('');
      }
    };

    const ApplyCalModal = () => {
      let mdd = {...markedDatess};
      let mds = [];
      let fm = {};

      if (!isObjectEmpty(mdd)) {
        mds = Object.keys(mdd);
        mds.sort();
      }
      if (mds.length > 0) {
        mds.map((e, i, a) => {
          fm[e] = {
            customStyles: cs,
            marked: false,
            selected: true,
            selectedColor: theme.color.button1,
            disabled: false,
            disableTouchEvent: false,
          };
        });
      }

      setmarkedDatess(fm);
      setselDatess(fm);
      setshowCal1(false);
      const size = Object.keys(fm).length;
      const dt = Object.keys(fm);

      if (size > 0) {
        // if (size == totaldays) {
        if (size < 2 && size > 0) {
          //for duration ==1
          setminDatee(dt[0]);
          setmaxDatee(dt[0]);
        } else if (size > 1) {
          //for duration  > 1
          setminDatee(dt[0]);
          setmaxDatee(dt[size - 1]);
        }
        // }
      } else {
        setminDatee('');
        setmaxDatee('');
      }
    };

    const formatDate = date => {
      var dd = moment(date).format('MMMM YYYY');
      return dd;
    };

    const getSelectedDayEvents = date => {
      console.log('date : ', date);

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

      let totaldays = 0;
      let t = durationTitle;

      if (t == 'days') {
        totaldays = duration;
        td = duration;
      } else if (t == 'weeks') {
        totaldays = duration * 7;
        td = duration * 7;
      } else if (t == 'months') {
        totaldays = duration * 30;
        td = duration * 30;
      } else if (t == 'years') {
        totaldays = duration * 365;
        td = duration * 365;
      }

      if (isObjectEmpty(markedDatess)) {
        let markedDates = {};
        if (parseInt(totaldays) <= 1) {
          markedDates[date] = {
            customStyles: cs,
            marked: false,
            selected: true,
            selectedColor: theme.color.button1,
            disabled: false,
            disableTouchEvent: false,
          };
          setminDatee(date);
          setmaxDatee(date);
          // setisDisableToday(true);
        } else {
          let mindate = mind;
          let maxdate = mxd;
          let ua = [];
          let u = unavailable_days.slice() || [];
          u.map((e, i, a) => {
            ua.push(moment(e).format('YYYY-MM-DD'));
          });
          let ar = [];
          let sdu = date;
          if (ua.length > 0) {
            ar.push(sdu);
            for (let index = 0; index < totaldays; index++) {
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
                totaldays++;
              }

              sdu = moment(moment(new Date(sdu)).add(1, 'day')).format(
                'YYYY-MM-DD',
              );
            }
          } else {
            for (let index = 0; index < totaldays; index++) {
              if (sdu > maxdate) {
                break;
              }

              ar.push(sdu);
              sdu = moment(moment(new Date(sdu)).add(1, 'day')).format(
                'YYYY-MM-DD',
              );
            }
          }
          if (ar.length > 0) {
            ar.map((e, i, a) => {
              console.log('e : ', e);
              markedDates[e] = {
                customStyles: cs,
                marked: false,
                selected: true,
                selectedColor: theme.color.button1,
                disabled: false,
                disableTouchEvent: false,
              };
            });

            let mindd = ar[0];
            let mxxd = ar[ar.length - 1];
            setminDatee(mindd);
            setmaxDatee(mxxd);
            // setisDisableToday(true);
          }
        }
        setmarkedDatess(markedDates);
      } else {
        let md = {...markedDatess};
        let o = md[date];

        if (o !== undefined) {
          console.warn('The key exists.');
          delete md[date];

          setmarkedDatess(md);
          const size = Object.keys(md).length;
          if (size < totaldays) {
            if (size == 0) {
              setminDatee('');
              setmaxDatee('');
            } else {
              // if (date == moment().format('YYYY-MM-DD')) {
              // setisDisableToday(false);
              // }
            }
          }

          return;
        } else {
          console.warn('The key does not exist.');

          let md = {...markedDatess};
          md[date] = {
            marked: false,
            selected: true,
            customStyles: cs,
            selectedColor: theme.color.button1,
            disabled: false,
            disableTouchEvent: false,
          };
          setmarkedDatess(md);
          return;
        }
      }
    };

    const renderBottom = () => {
      let c = isSelDatee ? false : true;

      let duration = item.duration.value;
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
              disabled={!isSelDatee ? true : false}
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
      <Modal visible={showCal1} transparent onRequestClose={closeCalModal}>
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
              initialDate={minDatee != '' ? minDatee : mind}
              minDate={minDatee != '' ? minDatee : mind}
              maxDate={maxDatee != '' ? maxDatee : mxd}
              onDayPress={day => {
                getSelectedDayEvents(day.dateString);
              }}
              onDayLongPress={day => {
                console.log('selected long press day', day);
              }}
              monthFormat={'yyyy MM'}
              onMonthChange={month => {
                setmonthh(new Date(month.dateString));
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
                    {formatDate(monthh)}
                  </Text>
                );
              }}
              enableSwipeMonths={true}
              disableAllTouchEventsForDisabledDays={true}
              markingType="custom"
              markedDates={{...todaymark, ...md, ...markedDatess}}
            />
            {renderBottom()}
          </View>
        </SafeAreaView>
      </Modal>
    );
  };

  const renderMessageSendModal = () => {
    const renderButton1 = () => {
      return (
        <>
          <TouchableOpacity
            onPress={closeModal}
            activeOpacity={0.7}
            style={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme.color.button1,
              height: 50,
              borderRadius: 10,
              alignSelf: 'center',

              marginTop: 40,
            }}>
            <Text
              style={{
                color: theme.color.buttonText,
                fontSize: 16,
                fontFamily: theme.fonts.fontBold,

                textTransform: 'capitalize',
              }}>
              Done
            </Text>
          </TouchableOpacity>
        </>
      );
    };

    const renderButton2 = () => {
      return (
        <>
          <TouchableOpacity
            onPress={() => {
              closeModal();
              let p = store.User.offersProfileProps;
              p.navigation.navigate('Inbox');
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
                fontSize: 14,
              }}>
              Go to Inbox
            </Text>
          </TouchableOpacity>
        </>
      );
    };

    const closeModal = () => {
      setisSendMessage(false);
    };

    let fn = sendObj.firstName;
    let ln = sendObj.lastName;
    let sendOfferUsername = fn + ' ' + ln;
    let un = sendObj.userName || 'user';
    let src = require('../../../assets/images/msgSentDone/img.png');
    return (
      <Modal
        animationType="slide"
        visible={isSendMessage}
        transparent
        onRequestClose={closeModal}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
            padding: 15,
          }}>
          <View
            style={{
              backgroundColor: theme.color.background,
              borderRadius: 15,
              marginBottom: 15,
              padding: 18,
              width: '100%',
            }}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
              }}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  fontFamily: theme.fonts.fontBold,
                  fontSize: 19,
                  color: '#101B10',
                  lineHeight: 29,
                }}>
                Message Sent
              </Text>
            </View>

            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 40,
                width: '100%',
              }}>
              <Image
                style={{width: 90, height: 90, resizeMode: 'contain'}}
                source={src}
              />

              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  marginTop: 15,
                  fontFamily: theme.fonts.fontBold,
                  fontSize: 15,
                  color: '#101B10',
                  textTransform: 'capitalize',
                  lineHeight: 20,
                }}>
                {sendOfferUsername}
              </Text>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  fontFamily: theme.fonts.fontNormal,
                  fontSize: 13,
                  color: theme.color.subTitleLight,
                  lineHeight: 20,
                }}>
                @{un}
              </Text>
            </View>

            {renderButton1()}
            {renderButton2()}
          </View>
        </View>
      </Modal>
    );
  };

  const renderShowOfferSendModal = () => {
    const renderButton1 = () => {
      return (
        <>
          <TouchableOpacity
            onPress={closeModal}
            activeOpacity={0.7}
            style={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme.color.button1,
              height: 50,
              borderRadius: 10,
              alignSelf: 'center',

              marginTop: 40,
            }}>
            <Text
              style={{
                color: theme.color.buttonText,
                fontSize: 16,
                fontFamily: theme.fonts.fontBold,

                textTransform: 'capitalize',
              }}>
              Done
            </Text>
          </TouchableOpacity>
        </>
      );
    };

    const renderButton2 = () => {
      return (
        <>
          <TouchableOpacity
            onPress={() => {
              closeModal();
              let p = store.User.offersProfileProps;
              p.navigation.navigate('ConfirmedTrips');
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
                fontSize: 14,
              }}>
              Go to Confirmed Trips
            </Text>
          </TouchableOpacity>
        </>
      );
    };

    const closeModal = () => {
      setisOfferSend(false);
      setsendObj(false);
    };

    let fn = sendObj.firstName;
    let ln = sendObj.lastName;
    let sendOfferUsername = fn + ' ' + ln;

    let src = require('../../../assets/images/offerSentDone/img.png');
    return (
      <Modal
        animationType="slide"
        visible={isOfferSend}
        transparent
        onRequestClose={closeModal}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
            padding: 15,
          }}>
          <View
            style={{
              backgroundColor: theme.color.background,
              borderRadius: 15,
              marginBottom: 15,
              padding: 18,
              width: '100%',
            }}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 20,
                width: '100%',
              }}>
              <Image
                style={{width: 150, height: 142, resizeMode: 'contain'}}
                source={src}
              />
              <Text
                style={{
                  marginTop: 15,
                  fontFamily: theme.fonts.fontNormal,
                  fontSize: 15,
                  color: '#101B10',
                }}>
                You accepted an offer from
              </Text>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  fontFamily: theme.fonts.fontBold,
                  fontSize: 21,
                  color: '#101B10',
                  textTransform: 'capitalize',
                }}>
                {sendOfferUsername}
              </Text>
            </View>

            {renderButton1()}
            {renderButton2()}
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <>
      <View style={styles.container}>
        {/* <utils.DrawerHeader props={props} headerTitle={headerTitle} /> */}
        {!internet && <utils.InternetMessage />}
        <SafeAreaView style={styles.container2}>
          <View style={styles.container3}>
            <FlatList
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              style={{marginTop: 5}}
              contentContainerStyle={{
                paddingTop: 5,
                paddingBottom: 40,
                paddingHorizontal: 2,
              }}
              showsVerticalScrollIndicator={false}
              data={data}
              renderItem={ItemView}
              keyExtractor={(item, index) => index.toString()}
              ListEmptyComponent={EmptyListMessage}
              ItemSeparatorComponent={ItemSeparatorView}
              ListHeaderComponent={data.length > 0 ? ListHeader : null}
              // ListFooterComponent={data.length > 0 ? ListFooter : null}
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

          {/* <utils.Footer
            nav={props.navigation}
            screen={headerTitle}
            focusScreen={store.General.focusScreen}
          /> */}

          {isModal && renderModal()}
          {showCal1 && renderCalender1()}
          {isSendMessage && renderMessageSendModal()}
          {isOfferSend && renderShowOfferSendModal()}
        </SafeAreaView>
      </View>
    </>
  );
}
