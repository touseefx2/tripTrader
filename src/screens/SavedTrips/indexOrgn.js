import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  BackHandler,
  Alert,
  Platform,
  Pressable,
  TextInput,
  ScrollView,
  Keyboard,
  Modal,
} from 'react-native';
import ProgressiveFastImage from '@freakycoder/react-native-progressive-fast-image';
import {styles} from './styles';
import {observer} from 'mobx-react';
import store from '../../store/index';
import utils from '../../utils/index';
import theme from '../../theme';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-easy-toast';
import {ActivityIndicator} from 'react-native-paper';
import {Calendar} from 'react-native-calendars';
import moment from 'moment/moment';
import Accordion from 'react-native-collapsible/Accordion';
import Card1 from './Card1';
import Card2 from './Card2';
import Card3 from './Card3';

const activeOpacity = 0.8;
const actSrc = require('../../assets/images/filters/activity/img.png');
const spcSrc = require('../../assets/images/filters/species/img.png');

function ListHeader({search, setsearch, data}) {
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
      <TouchableOpacity style={{}} disabled>
        <Image
          source={require('../../assets/images/searchBar/search/img.png')}
          style={styles.Baricon}
        />
      </TouchableOpacity>
    );
  };

  const renderInput = () => {
    return (
      <View style={{width: '84%'}}>
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
    <View>
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

function EmptyListMessage() {
  return (
    <>
      <Text
        style={{
          marginTop: '25%',
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'center',
          fontSize: 13,
          color: theme.color.title,
          fontFamily: theme.fonts.fontMedium,
          opacity: 0.4,
        }}>
        No any saved trip found
      </Text>
    </>
  );
}

function ItemSeparatorView() {
  return (
    <View
      style={{
        height: 15,
      }}
    />
  );
}

function ListFooter({data, d, loadMore, LoadMore, limit}) {
  return (
    <>
      <View style={styles.listFooter}>
        {/* {data.length>0 && data.length==d.length && !loadMore&&(
         <Text style={styles.listFooterT}>End of messages</Text>
      )} */}

        {data.length >= limit && data.length > 0 && data.length < d.length && (
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

const dw = [
  {_id: 1, name: 'Sun', num: 0, isSel: false},
  {_id: 2, name: 'Mon', num: 1, isSel: false},
  {_id: 3, name: 'Tue', num: 2, isSel: false},
  {_id: 4, name: 'Wed', num: 3, isSel: false},
  {_id: 5, name: 'Thu', num: 4, isSel: false},
  {_id: 6, name: 'Fri', num: 5, isSel: false},
  {_id: 7, name: 'Sat', num: 6, isSel: false},
];

const durtn = [
  {
    _id: 0,
    is_active: true,
    title: 'days',

    type: 'durType',
  },
  {
    _id: 1,
    is_active: true,
    title: 'weeks',
    type: 'durType',
  },
];

const rdurtn = [
  {
    _id: 0,
    is_active: true,
    title: 'weeks',
    type: 'durType',
  },
  {
    _id: 1,
    is_active: true,
    title: 'Days',
    type: 'durType',
  },
  {
    _id: 2,
    is_active: true,
    title: 'Months',
    type: 'durType',
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

export default observer(SavedTrips);

function SavedTrips(props) {
  const headerTitle = 'Saved Trips';
  const limit = 10;
  const maxModalHeight = theme.window.Height - 70;
  const scrollRef = useRef(null);
  const scrollRef2 = useRef(null);
  const toast = useRef(null);

  const {isInternet} = store.General;
  const {user, homeModalLoder} = store.User;
  const {deleteLoader, saveTrips} = store.Trips;

  const [search, setSearch] = useState('');

  const [modalHeight, setmodalHeight] = useState(0);
  const [modalObj, setModalObj] = useState(null);
  const [modalCheck, setModalCheck] = useState('');
  const [isModal, setIsModal] = useState(false);

  const [message, setMessage] = useState('');
  const [step, setStep] = useState(1);
  const [isChooseDateCalender, setIsChooseDateCalender] = useState(false);
  const [minDatee, setminDatee] = useState('');
  const [maxDatee, setmaxDatee] = useState('');
  const [isDisableToday, setIsDisableToday] = useState(false);
  const [monthh, setMonthh] = useState(new Date());

  const [markedDatess, setmarkedDatess] = useState({});
  const [selDatess, setselDatess] = useState({});
  const [isSelDatee, setisSelDatee] = useState(false);

  const tripdata = store.User.trips;
  const [isDropDownTrip, setisDropDownTrip] = useState(false);
  const [trip, settrip] = useState(false);

  const [page, setpage] = useState(1);
  const [loadMore, setloadMore] = useState(false);
  const [saveData, setSaveData] = useState([]);
  const [data, setdata] = useState([]);
  const [isloadFirst, setisloadFirst] = useState(false);

  useEffect(() => {
    let arr = [];
    setisloadFirst(false);
    setpage(1);
    if (search == '') {
      saveTrips.map(item => {
        if (item) arr.push(item);
      });
    } else {
      arr = saveTrips.filter(item => {
        const title = item.hostId.firstName + ' ' + item.hostId.lastName;
        return title.toLowerCase().includes(search.toLowerCase());
      });
    }
    setSaveData(arr.reverse());
  }, [search]);

  useEffect(() => {
    if (saveData.length > 0 && !isloadFirst) LoadFirst(saveData);
    if (saveData.length <= 0) setdata([]);
  }, [saveData, isloadFirst]);

  const LoadFirst = d => {
    let page = 0;
    let p = page + 1;
    let ar = [...d];
    const dt = ar.slice(page * limit, limit * p);
    let dd = [...dt];
    console.log('----> Load First : ', page * limit, limit * p);
    setdata(dd);
    setisloadFirst(true);
  };
  useEffect(() => {
    if (page <= 0 && data.length >= limit) {
      setpage(1);
    }
  }, [data, page]);

  const LoadMore = async () => {
    setloadMore(true);
    setTimeout(() => {
      setloadMore(false);
      let p = page + 1;
      let ar = [...saveData];
      const dt = ar.slice(page * limit, limit * p);
      let dd = [...data, ...dt];
      console.log('---> Load More : ', page * limit, limit * p);
      setdata(dd);
      setpage(p);
    }, 1);
  };

  const [isDisableToday2, setisDisableToday2] = useState(false);

  const [isDropDownDur, setisDropDownDur] = useState(false);
  const [dur, setdur] = useState(durtn[0]); //time solts
  const [rdur, setrdur] = useState(rdurtn[0]);
  const [isDropDownrDur, setisDropDownrDur] = useState(false);
  const [durNum, setdurNum] = useState(1);
  const [showCalender, setshowCalender] = useState(false);
  const [iDate, setiDate] = useState(new Date());
  const [mindd, setmindd] = useState(undefined);
  const [mind, setmind] = useState(undefined);

  const [month, setmonth] = useState(new Date());
  const [markedDates, setmarkedDates] = useState({});
  const [isSelDate, setisSelDate] = useState(false);
  const [selDates, setselDates] = useState({});
  const [isSelDate1, setisSelDate1] = useState('');
  const [isSelDate2, setisSelDate2] = useState('');

  const [maxd, setmaxd] = useState(undefined);
  const [isShowUnavliableModal, setisShowUnavliableModal] = useState(false);

  useState(false);
  const [daysOfWeek, setdow] = useState(dw); //days of week
  const [rdurNum, setrdurNum] = useState(1);
  const [endRepOn, setendRepOn] = useState('');
  const [endRepOnM, setendRepOnM] = useState({});
  const [endRepOnS, setendRepOnS] = useState({});
  const [isShowUnavliabledaysCal, setisShowUnavliabledaysCal] = useState(false);
  const [ischk, setischk] = useState('');
  const [unavlblmarkedDates, setunavlblmarkedDates] = useState({});
  const [unavlblSLCTmarkedDates, setunavlblSLCTmarkedDates] = useState({});
  const [selunmarkeSLCTdDates, setselunmarkedSLCTDates] = useState({});
  const [isSetUnavailable, setisSetUnavailable] = useState(false);

  const [isButtonDisable, setisButtonDisable] = useState(false);

  const [isOfferSend, setisOfferSend] = useState(false);
  const [sendObj, setsendObj] = useState('');
  const [isSendMessage, setisSendMessage] = useState(false);

  const [note, setnote] = useState('');
  const [location, setlocation] = useState(false);

  const trptypeData = [...store.Filters.activity];
  const [tripType, settripType] = useState('');
  const [isDropDownTT, setisDropDownTT] = useState(false);

  const stateData = [...store.Filters.tripLocation];
  const [city, setcity] = useState('');
  const [State, setState] = useState('');
  const [isDropDownState, setisDropDownState] = useState(false);

  const spcsDt = [...store.Filters.species];
  const [spcsData, setspcsData] = useState([]);
  const [species, setspecies] = useState('');
  const [isDropDownSpcs, setisDropDownSpcs] = useState(false);

  const [activeSections, setactiveSections] = useState([-1]);
  const [showpic, setshowpic] = useState(true);
  let animtntime = 1000;
  useEffect(() => {
    if (activeSections[0] > -1) {
      setTimeout(() => {
        setshowpic(false);
      }, animtntime);
    }
  }, [activeSections]);

  const closeAllDropDown = () => {
    setisDropDownTrip(false);
    setisDropDownDur(false);
    setisDropDownrDur(false);
    setisDropDownTT(false);
    setisDropDownState(false);
    setisDropDownSpcs(false);
  };

  useEffect(() => {
    if (user == 'guest') {
      store.General.setgoto('guestaccess');
      store.User.Logout();
      return;
    }
  }, []);

  useEffect(() => {
    if (tripType != '') {
      setspcsData([]);
      let aa = [];
      if (spcsDt.length > 0) {
        spcsDt.map((e, i, a) => {
          if (e.type) {
            if (e.type.name == tripType.name) {
              aa.push(e);
            }
          }
        });
      }

      setspcsData(aa);
    }
  }, [tripType]);

  useEffect(() => {
    if (
      !isObjectEmpty(markedDatess) &&
      !isObjectEmpty(modalObj) &&
      modalCheck == 'offer' &&
      step == 1
    ) {
      const size = Object.keys(markedDatess).length;
      let item = modalObj.item;
      let totaldays = 0;
      let t = item.duration.title;
      let duration = parseInt(item.duration.number);

      if (t == 'days') {
        totaldays = duration;
      } else if (t == 'weeks') {
        totaldays = duration * 7;
      } else if (t == 'months') {
        totaldays = duration * 30;
      } else if (t == 'years') {
        totaldays = duration * 365;
      }
      if (size == totaldays) setisSelDatee(true);
      else setisSelDatee(false);
    }

    if (
      isObjectEmpty(markedDatess) &&
      !isObjectEmpty(modalObj) &&
      modalCheck == 'offer' &&
      step == 1
    )
      setisSelDatee(false);
  }, [markedDatess, modalObj, modalCheck, step]);

  //for diable totday day color in step1 calender in make offer
  useEffect(() => {
    if (
      !isObjectEmpty(modalObj) &&
      modalCheck == 'offer' &&
      step == 1 &&
      isModal &&
      minDatee == ''
    ) {
      let item = modalObj.item;
      let sd = moment(item.availablity.startDate).format('YYYY-MM-DD');
      let cd = moment().format('YYYY-MM-DD');

      if (sd <= cd) {
        setIsDisableToday(false);
      } else {
        setIsDisableToday(true);
      }
    }
  }, [modalObj, modalCheck, step, isModal, minDatee]);
  useEffect(() => {
    if (minDatee != '') {
      let todayd = moment().format('YYYY-MM-DD');
      if (minDatee <= todayd) {
        setIsDisableToday(false);
      } else {
        setIsDisableToday(true);
      }
    }
  }, [minDatee]);
  //end

  useEffect(() => {
    if (search != '') {
      BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    }

    if (search == '') {
      scrollToTop();

      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );
    }

    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );
    };
  }, [search]);

  const scrollToTop = () => {
    // scrollRef2?.current?.scrollToOffset({animated: false, offset: 0});
  };

  function handleBackButtonClick() {
    if (!props.navigation.isFocused()) {
      return false;
    } else {
      setSearch('');

      return true;
    }
  }

  const setIsSendMessage = v => {
    setsendObj(modalObj.item.hostId);
    setisSendMessage(v);
    setTimeout(() => {
      closeMessageModal();
    }, 10);
  };

  const setIsSendObj = v => {
    setsendObj(modalObj.item.user);
    setisOfferSend(v);
    setTimeout(() => {
      closeModalAll();
    }, 5);
  };

  const ConfirmSend = () => {
    Keyboard.dismiss();

    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        //login user
        let Note = note;
        let preferDate = [];
        let oferBy = user._id;
        let hostTrip = {};

        //home user
        let oferTo = modalObj.item.user._id;
        let offeredTrip = {};

        // ofer by objects
        let isSetUn = isSetUnavailable != false ? isSetUnavailable : {};
        let objct = isSetUn != false ? {...isSetUn} : false;
        if (objct !== false && !isObjectEmpty(objct)) {
          delete Object.assign(objct, {
            daysOfWeek: objct.days_of_week,
          })['days_of_week'];
          delete Object.assign(objct, {
            unavailableDaysOfWeek: objct.unavailable_days_of_week,
          })['unavailable_days_of_week'];
          delete Object.assign(objct, {
            excludeSpecificDates: objct.exclude_specific_dates,
          })['exclude_specific_dates'];
          delete Object.assign(objct, {
            allUnavailableDates: objct.all_unavailable_dates,
          })['all_unavailable_dates'];
          delete Object.assign(objct, {dayWeekText: objct.wtxt})['wtxt'];
          delete Object.assign(objct, {excludeDateText: objct.esd_text})[
            'esd_text'
          ];
          let ra = {...objct.repeat_every};
          delete Object.assign(ra, {value: ra.num})['num'];
          delete objct.repeat_every;
          objct.repeatEvery = ra;
        }
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
        let dt = '';
        let dtitle = dur.title;
        if (durNum <= 1) {
          dtitle = dur.title.substring(0, dur.title.length - 1);
        }
        dt = durNum + ' ' + dtitle;
        let title = dt + ' ' + species.name;
        hostTrip = {
          title: title,
          tradeType: tripType.name,
          location: location == false ? {} : location,
          species: species.name,
          duration: {
            value: durNum,
            title: dur.title,
          },
          availableFrom: isSelDate1,
          availableTo: isSelDate2,
          unAvailableDays: objct,
        };
        if (objct == false) {
          delete hostTrip.unAvailableDays;
        }

        // ofer To objects
        let d = modalObj.item;
        let objct2 = d.unavailable != false ? {...d.unavailable} : false;
        if (objct2 !== false && !isObjectEmpty(objct2)) {
          delete Object.assign(objct2, {
            daysOfWeek: objct.days_of_week,
          })['days_of_week'];
          delete Object.assign(objct2, {
            unavailableDaysOfWeek: objct2.unavailable_days_of_week,
          })['unavailable_days_of_week'];
          delete Object.assign(objct2, {
            excludeSpecificDates: objct2.exclude_specific_dates,
          })['exclude_specific_dates'];
          delete Object.assign(objct2, {
            allUnavailableDates: objct2.all_unavailable_dates,
          })['all_unavailable_dates'];
          delete Object.assign(objct2, {dayWeekText: objct2.wtxt})['wtxt'];
          delete Object.assign(objct2, {excludeDateText: objct2.esd_text})[
            'esd_text'
          ];
          let ra = {...objct2.repeat_every};
          delete Object.assign(ra, {value: ra.num})['num'];
          delete objct2.repeat_every;
          objct2.repeatEvery = ra;
        }
        offeredTrip = {
          tripId: d._id,
          tradeType: d.tradeType,
          species: d.species,
          title: d.title,
          // returnActivity: d.return,
          duration: {
            value: d.duration.number,
            title: d.duration.title,
          },
          availableFrom: d.availablity.startDate,
          availableTo: d.availablity.endDate,
          // photos: d.photos,
          unAvailableDays: objct2,
          location: d.loc,
        };
        if (objct2 == false) {
          delete offeredTrip.unAvailableDays;
        }

        const fo = {
          preferredDates: preferDate,
          note: Note,
          offeredBy: oferBy,
          hostTrip: hostTrip,
          offeredTo: oferTo,
          offeredTrip: offeredTrip,
          status: 'pending',
        };

        // console.log('hostTrip unavlbl : ', hostTrip.unAvailableDays);
        // console.log('offeredTrip unavlbl : ', offeredTrip.unAvailableDays);
        console.log('Send Offer Body : ', fo);
        store.User.attemptToOfferSend(fo, setIsSendObj);
      } else {
        // seterrorMessage('Please connect internet');
        Alert.alert('', 'Please connect internet');
      }
    });
  };

  const sendMessage = () => {
    Keyboard.dismiss();

    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        let item = modalObj.item;
        let usr = item.hostId;
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

  const deleteTrip = (dt, i) => {
    Keyboard.dismiss();

    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        store.Trips.unSaveTrip(
          dt,
          i,
          data,
          c => setdata(c),
          saveData,
          c => setSaveData(c),

          closeMModal,
        );
      } else {
        // seterrorMessage('Please connect internet');
        Alert.alert('', 'Please connect internet');
      }
    });
  };

  const onClickMakeOffer = (dt, ind) => {
    let d = dt;

    let loc = d.location ? d.location : {};
    let acceptOtherTrades = d.acceptTradeOffers;
    let dr = {
      number: d.duration.value,
      title: d.duration.title,
    };
    let av = {
      startDate: d.availableFrom,
      endDate: d.availableTo,
    };
    let photos = d.photos || [];
    let objct = {...d.unAvailableDays};
    if (!isObjectEmpty(objct)) {
      let ar = objct.allUnavailableDates || [];
      let ar2 = objct.daysOfWeek || [];
      if (ar.length <= 0 && ar2.length <= 0) {
        objct = false;
      }
    }
    if (objct != false) {
      delete Object.assign(objct, {
        days_of_week: objct.daysOfWeek,
      })['daysOfWeek'];
      delete Object.assign(objct, {
        unavailable_days_of_week: objct.unavailableDaysOfWeek,
      })['unavailableDaysOfWeek'];
      delete Object.assign(objct, {
        exclude_specific_dates: objct.excludeSpecificDates,
      })['excludeSpecificDates'];
      delete Object.assign(objct, {
        all_unavailable_dates: objct.allUnavailableDates,
      })['allUnavailableDates'];
      delete Object.assign(objct, {wtxt: objct.dayWeekText})['dayWeekText'];
      delete Object.assign(objct, {esd_text: objct.excludeDateText})[
        'excludeDateText'
      ];
      let ra = {...objct.repeatEvery};
      delete Object.assign(ra, {num: ra.value})['value'];
      delete objct.repeatEvery;
      objct.repeat_every = ra;
    }

    const obj = {
      __v: dt.__v,
      _id: dt._id,
      user: dt.hostId,
      tradeType: d.tradeType,
      loc: loc,
      species: d.species || '',
      title: d.title || '',
      return: d.returnActivity || '',
      status: d.status,
      acceptOtherTrades: acceptOtherTrades,
      duration: dr,
      availablity: av,
      photos: photos,
      unavailable: objct,
    };

    openModal({item: obj, i: ind}, 'offer');
  };
  const onClickMessage = (dt, ind) => {
    openModal({item: dt, i: ind}, 'message');
  };
  const onClickCal = () => {
    setIsChooseDateCalender(!isChooseDateCalender);
  };

  //make offer method
  useEffect(() => {
    if (!isObjectEmpty(markedDates)) {
      const size = Object.keys(markedDates).length;
      if (size > 1) {
        setisSelDate(true);
      } else {
        setisSelDate(false);
      }
    } else {
      setisSelDate(false);
    }
  }, [markedDates]);

  useEffect(() => {
    if (!isObjectEmpty(selDates)) {
      const size = Object.keys(selDates).length;
      let pd1 = Object.keys(selDates)[0];
      let pd2 = Object.keys(selDates)[size - 1];

      if (pd1 > pd2) {
        setisSelDate1(pd2);
        setisSelDate2(pd1);
      } else {
        setisSelDate1(pd1);
        setisSelDate2(pd2);
      }
    }
  }, [selDates]);

  useEffect(() => {
    if (isSelDate1 != '') {
      setmind(isSelDate1);
      let sd = isSelDate1;
      if (sd >= moment().format('YYYY-MM-DD')) {
        setmindd(undefined);
      } else {
        setmindd(sd);
      }
    }
    if (isSelDate2 != '') {
      setmaxd(isSelDate2);
      if (!isSetUnavailable) {
        siERpOn(isSelDate2);
      }
    }
  }, [isSelDate1, isSelDate2, isSetUnavailable]);

  useEffect(() => {
    if (step == 3 && !isShowUnavliableModal) {
      if (
        isSelDate1 != '' &&
        isSelDate2 != '' &&
        durNum != '' &&
        tripType != '' &&
        species != '' &&
        location != false
      ) {
        setisButtonDisable(false);
      } else {
        setisButtonDisable(true);
      }
    }
  }, [
    isSelDate1,
    isSelDate2,
    durNum,
    step,
    isShowUnavliableModal,
    tripType,
    species,
    location,
  ]);

  useEffect(() => {
    if (isSelDate1 != '' && isSelDate2 != '') {
      const a = moment(isSelDate2);
      const b = moment(isSelDate1);
      const no_of_days = a.diff(b, 'days');
      console.error('nod : ', no_of_days);
      let totaldays = 0;
      let t = dur.title;
      if (t == 'days') {
        totaldays = durNum;
      } else if (t == 'weeks') {
        totaldays = durNum * 7;
      } else if (t == 'months') {
        totaldays = durNum * 30;
      } else if (t == 'years') {
        totaldays = durNum * 365;
      }
      if (no_of_days < totaldays) {
        clearFields('', '');
        return;
      }
    }
  }, [dur, durNum, isSelDate1, isSelDate2]);

  // useEffect(() => {
  //   if (rdurNum == '') {
  //     setunavlblmarkedDates({});
  //     return;
  //   }

  //   let ar = [];
  //   if (dow.length > 0) {
  //     dow.map((e, i, a) => {
  //       if (e.isSel) {
  //         ar.push(e);
  //       }
  //     });
  //   }
  //   if (ar.length > 0) {
  //     var rweekNum = rdurNum;
  //     var start = moment(isSelDate1);
  //     var end = moment(endRepOn);
  //     let mm = {};

  //     ar.map((e, i, a) => {
  //       var day = e.num; // Sunday=0
  //       var result = [];
  //       var current = start.clone();
  //       while (current.day(7 + day).isBefore(end)) {
  //         result.push(current.clone());
  //       }
  //       if (result.length > 0) {
  //         result.map((e, i, a) => {
  //           let d = e.format('YYYY-MM-DD');
  //           mm[d] = {
  //             marked: false,
  //             selected: true,
  //             customStyles: css,
  //             selectedColor: 'red',
  //             disabled: true,
  //             disableTouchEvent: true,
  //           };
  //         });
  //       }
  //     });
  //     setunavlblmarkedDates(mm);
  //   } else {
  //     setunavlblmarkedDates({});
  //   }
  // }, [dow, endRepOn, rdurNum]);

  useEffect(() => {
    if (rdurNum == '') {
      setunavlblmarkedDates({});
      return;
    }

    let ar = [];
    if (daysOfWeek.length > 0) {
      daysOfWeek.map((e, i, a) => {
        if (e.isSel) {
          ar.push(e);
        }
      });
    }
    if (ar.length > 0) {
      var rweekNum = rdurNum;
      var start = moment(isSelDate1);
      var end = moment(endRepOn);
      let mm = {};

      ar.map((e, i, a) => {
        var day = e.num; // Sunday=0
        var result = [];
        let tmp = start.clone().day(day);
        if (tmp.isAfter(start, 'd')) {
          result.push(tmp.format('YYYY-MM-DD'));
        }
        while (tmp.isBefore(end)) {
          tmp.add(7, 'days');
          result.push(tmp.format('YYYY-MM-DD'));
        }
        result.pop();
        if (result.length > 0) {
          result.map((e, i, a) => {
            let d = moment(e).format('YYYY-MM-DD');
            mm[d] = {
              marked: false,
              selected: true,
              customStyles: css,
              selectedColor: 'red',
              disabled: true,
              disableTouchEvent: true,
            };
          });
        }
      });
      setunavlblmarkedDates(mm);
    } else {
      setunavlblmarkedDates({});
    }
  }, [daysOfWeek, endRepOn, rdurNum]);

  useEffect(() => {
    if (maxd != undefined && mind != undefined) {
      let c1 = maxd;
      let c2 = mind;
      const todayy = moment().format('YYYY-MM-DD');
      if (c1 > todayy && c2 > todayy) {
        setisDisableToday2(true);
      } else {
        setisDisableToday2(false);
      }
    }
  }, [maxd, mind]);

  useEffect(() => {
    if (city != '' && State != '') {
      setlocation({city: city, state: State.name});
    } else {
      setlocation(false);
    }
  }, [city, State]);

  const siERpOn = d => {
    let md = {};
    md[moment(d).format('YYYY-MM-DD')] = {
      customStyles: cs,
      marked: false,
      selected: true,
      selectedColor: theme.color.button1,
      disabled: true,
      disableTouchEvent: true,
    };
    setendRepOn(d);
    setendRepOnM(md);
    setendRepOnS(md);
  };

  const updateSections = activeSections => {
    setactiveSections(activeSections);
    setshowpic(true);
  };

  const onClickremoveTrips = (dt, ind) => {
    openModal({item: dt, i: ind}, 'tripRemove');
  };

  const openModal = (obj, c) => {
    setModalObj(obj);
    setModalCheck(c);
    setIsModal(true);
    if (c == 'offer') {
      setStep(1);
    }
  };

  const closeModalAll = () => {
    clearModal1();
    clearModal2();
    clearModal3();
    clearModal4();
  };

  const closeMModal = () => {
    setIsModal(false);
    setModalObj(false);
    setModalCheck('');
    setmodalHeight(0);
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

    if (step == 3) {
      if (isShowUnavliableModal) {
        setmodalHeight(0);
        setisShowUnavliableModal(false);
      } else {
        clearModal3();
      }

      return;
    }

    if (step == 4) {
      clearModal4();
      return;
    }
  };

  const closeMessageModal = () => {
    setIsModal(false);
    setModalCheck('');
    setModalObj(false);
    setMessage('');
  };

  const closeTripSaveModal = () => {
    setIsModal(false);
    setModalCheck('');
    setModalObj(false);
  };

  const clearFields = (c, c2) => {
    setmarkedDates({});
    setisSelDate(false);
    setselDates({});
    setisSelDate1('');
    setisSelDate2('');
    setmind(undefined);
    setmindd(undefined);
    setmaxd(undefined);
    setendRepOn('');
    setendRepOnM({});
    setendRepOnS({});
    setisSetUnavailable(false);
    setdow(dw);
    setrdurNum(1);
    setisDisableToday2(false);
    setunavlblmarkedDates({});
    setunavlblSLCTmarkedDates({});
    setselunmarkedSLCTDates({});
    if (c == 'all') {
      setdurNum(1);
      setrdurNum(1);
      setdur(durtn[0]);
      setrdur(rdurtn[0]);
      setisSetUnavailable(false);
      setisButtonDisable(false);

      setmind(undefined);
      setmindd(undefined);
      setmaxd(undefined);
      settripType('');
      setspecies('');
      setcity('');
      setState('');
      setlocation(false);

      setnote('');
    }
  };

  const clearModal1 = () => {
    if (!homeModalLoder) {
      setIsModal(false);
      setModalCheck('');
      setModalObj(false);
      setMessage('');
      setIsChooseDateCalender(false);
      setselDatess({});
      setmarkedDatess({});
      setisSelDatee(false);
      setStep(1);
      setiDate(new Date());
      setminDatee('');
      setmaxDatee('');
      setIsDisableToday(false);
      setMonthh(new Date());
      setmodalHeight(0);
      closeAllDropDown();
    }
  };

  const clearModal2 = () => {
    if (!homeModalLoder) {
      setStep(1);
      settrip(false);
      setmodalHeight(0);
      closeAllDropDown();
    }
  };

  const clearModal3 = () => {
    if (!homeModalLoder) {
      setStep(2);
      closeAllDropDown();
      setmodalHeight(0);
      setisShowUnavliableModal(false);
      setisDisableToday2(false);
      clearFields('all', '');
    }
  };

  const clearModal4 = () => {
    if (!homeModalLoder) {
      setStep(3);
      closeAllDropDown();
      setmodalHeight(0);
    }
  };

  function findItm(v, data, c) {
    let obj = c == 'n' ? {name: v} : {title: v};

    if (data.length > 0) {
      let fi =
        c == 'n'
          ? data.findIndex(x => x.name === v)
          : data.findIndex(x => x.title === v);
      if (fi > -1) {
        obj = data[fi];
      }
    }

    return obj;
  }

  const renderModal = () => {
    const item = modalObj.item;
    const isMaxHeight = modalHeight >= maxModalHeight ? true : false;
    const style = isMaxHeight
      ? [styles.modal, {height: maxModalHeight}]
      : styles.modal2;

    if (modalCheck == 'offer' && step == 1) {
      const renderHeader = () => {
        let text = 'Make Offer';

        const renderCross = () => {
          return (
            <Pressable
              disabled={homeModalLoder}
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
              isMaxHeight
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
        let photo = item.user.image ? item.user.image : '';
        let userName = item.user.firstName + ' ' + item.user.lastName;
        let isVeirfy = item.user.identityStatus == 'verified' ? true : false;
        let duration = item.duration.number;
        let t =
          duration <= 1
            ? item.duration.title.substring(0, item.duration.title.length - 1)
            : item.duration.title;
        duration = duration + ' ' + t;
        let spcs = item.species || '';

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
          <View style={styles.modalinfoConatiner}>
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
          let duration = parseInt(item.duration.number);
          t =
            duration <= 1
              ? 'Choose a trip date'
              : 'Choose a trip date or date range';
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
                  {opacity: isObjectEmpty(selDatess) ? 0.4 : 1},
                ]}>
                {t == '' ? 'Choose a trip date' : t}
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
        let chk = isObjectEmpty(selDatess) ? true : false;
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
            setmodalHeight(0);
            setStep(2);
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
              isMaxHeight
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
                isMaxHeight
                  ? styles.modalBottomContainer
                  : styles.modalBottomContainer2
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
                  if (!isMaxHeight) {
                    let {height} = event.nativeEvent.layout;
                    setmodalHeight(height);
                  }
                }}
                style={style}>
                {isMaxHeight && (
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

                {!isMaxHeight && (
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
            {isChooseDateCalender && renderChooseDateCalender()}
          </SafeAreaView>
        </Modal>
      );
    }

    if (modalCheck == 'offer' && step == 2) {
      const renderHeader = () => {
        let text = 'Make Offer';

        const renderCross = () => {
          return (
            <Pressable
              disabled={homeModalLoder}
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
              isMaxHeight
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

      const renderShowDropDown = c => {
        let data = [];

        if (c == 'trip') {
          data = tripdata;
        }

        const onclickSelect = d => {
          if (d == 'customOffer') {
            setStep(3);
            closeAllDropDown();
            settrip(false);
            return;
          }
          if (c == 'trip') {
            settrip(d);
            return;
          }
        };

        // let abs = Platform.OS == 'ios' ? false : true;
        return (
          <utils.DropDown
            search={true}
            data={data}
            onSelectItem={d => {
              onclickSelect(d);
            }}
            setVisible={d => {
              closeAllDropDown();
            }}
            c={c}
            footer={true}
            // absolute={abs}
          />
        );
      };

      const renderDropDown = () => {
        let t = '';
        if (!isObjectEmpty(selDatess)) {
          let tt = '';
          let esd = [];

          var myObject = selDatess;
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
            <View style={{width: '100%', marginTop: 5}}>
              <TouchableOpacity
                onPress={() => {
                  closeAllDropDown();
                  setisDropDownTrip(!isDropDownTrip);
                  if (!isDropDownTrip) {
                    scrollRef?.current?.scrollToEnd();
                  }
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
                        color: trip
                          ? theme.color.title
                          : theme.color.subTitleLight,
                      },
                    ]}>
                    {trip
                      ? trip.species
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
                  fontSize: 12.5,
                  fontFamily: theme.fonts.fontBold,
                  color: '#30563A',
                }}>
                Back
              </Text>
            </Pressable>
          );
        };

        const renderButton2 = () => {
          let c = !trip ? true : false;
          const Continue = () => {
            let d = trip;

            let tt = findItm(d.tradeType || '', trptypeData, 'n');
            let loc = d.location ? d.location : {};
            let spcs = findItm(d.species || '', spcsDt, 'n');
            if (!isObjectEmpty(loc)) {
              setcity(loc.city);
              setState(findItm(loc.state || '', stateData, 'n'));
            } else {
              setcity('');
              setState('');
              setlocation(false);
            }
            let durNo = d.duration.value;
            let durt = findItm(d.duration.title || '', durtn, 't');

            settripType(tt);
            setlocation(loc);
            setspecies(spcs);
            setdurNum(durNo);
            setdur(durt);
            setisSelDate1('');
            setisSelDate2('');
            setisSelDate(false);

            setmarkedDates({});
            setselDates({});
            setisSetUnavailable(false);
            setStep(3);
          };

          return (
            <Pressable
              disabled={c}
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
              isMaxHeight
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
                  isMaxHeight
                    ? styles.modalBottomContainer
                    : styles.modalBottomContainer2
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
                  if (!isMaxHeight) {
                    let {height} = event.nativeEvent.layout;
                    setmodalHeight(height);
                  }
                }}
                style={style}>
                {isMaxHeight && (
                  <>
                    {renderHeader()}
                    <ScrollView
                      ref={scrollRef}
                      contentContainerStyle={{paddingHorizontal: 15}}
                      showsVerticalScrollIndicator={false}
                      style={{flex: 1}}>
                      {renderTitle()}
                      {renderDropDown()}
                    </ScrollView>
                    {renderBottom()}
                  </>
                )}

                {!isMaxHeight && (
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

    //make custom offer

    if (modalCheck == 'offer' && step == 3 && !isShowUnavliableModal) {
      const renderHeader = () => {
        let text = 'Make Offer';

        const renderCross = () => {
          return (
            <Pressable
              disabled={homeModalLoder}
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
              isMaxHeight
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
                  fontSize: 12.5,
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
            setmodalHeight(0);
            setStep(4);
          };

          return (
            <Pressable
              disabled={isButtonDisable}
              onPress={Continue}
              style={({pressed}) => [
                {opacity: pressed ? 0.8 : isButtonDisable ? 0.5 : 1.0},
                styles.ButtonContainer,
                {backgroundColor: theme.color.button1},
              ]}>
              <Text
                style={[styles.ButtonText, {color: theme.color.buttonText}]}>
                Review Offer
              </Text>
            </Pressable>
          );
        };

        return (
          <View
            style={
              isMaxHeight
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
                  isMaxHeight
                    ? styles.modalBottomContainer
                    : styles.modalBottomContainer2
                }>
                {renderButton1()}
                {renderButton2()}
              </View>
            </View>
          </View>
        );
      };

      const renderDropDown = c => {
        let data = [];

        if (c == 'dur') {
          data = durtn;
        }
        if (c == 'rdur') {
          data = rdurtn;
        }

        const onclickSelect = d => {
          if (c == 'dur') {
            setdur(d);
          }
          if (c == 'rdur') {
            setrdur(d);
          }
        };

        // console.log('drop down data : ', data);
        let abs = Platform.OS == 'ios' ? false : true;
        return (
          <utils.DropDown
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

      const renderShowDropDown = c => {
        let data = [];

        if (c == 'tt') {
          data = trptypeData;
        }
        if (c == 'state') {
          data = stateData;
        }
        if (c == 'spcs') {
          data = spcsData;
        }

        const onclickSelect = d => {
          if (c == 'tt') {
            settripType(d);
            if (tripType !== '') {
              if (tripType.name !== d.name) {
                setspecies('');
              }
            }
            return;
          }
          if (c == 'state') {
            setState(d);
            return;
          }
          if (c == 'spcs') {
            setspecies(d);
            return;
          }
        };

        // let abs = Platform.OS == 'ios' ? false : true;
        return (
          <utils.DropDown
            search={true}
            data={data}
            onSelectItem={d => {
              onclickSelect(d);
            }}
            setVisible={d => {
              closeAllDropDown();
            }}
            c={c}
            // absolute={abs}
          />
        );
      };

      const renderField = () => {
        const onClickCal = () => {
          setshowCalender(!showCalender);
        };

        const onClickUnavailableDays = () => {
          if (!isObjectEmpty(selDates)) {
            if (isSetUnavailable) {
              let d = isSetUnavailable;
              console.log('dddd : ', d);
              let ar = d.days_of_week;
              let ind = [];
              if (ar.length > 0) {
                ar.map((e, i, a) => {
                  if (dw.length > 0) {
                    ind.push(dw.findIndex(x => x.name === e));
                  }
                });
              }
              let dw2 = dw.slice();
              if (ind.length > 0) {
                ind.map((e, i, a) => {
                  dw2[e].isSel = true;
                });
              }
              setdow(dw2);
              setrdurNum(d.repeat_every.num);
              let tt = d.repeat_every.title;
              let index = rdurtn.findIndex(x => x.title === tt);
              setrdur(rdurtn[index]);
              siERpOn(d.repeat_every.endRepeatOn);
              let dt = d.exclude_specific_dates;
              let md = {};
              if (dt.length > 0) {
                dt.map((e, i, a) => {
                  md[moment(e).format('YYYY-MM-DD')] = {
                    customStyles: cs,
                    marked: false,
                    selected: true,
                    selectedColor: theme.color.button1,
                    disabled: false,
                    disableTouchEvent: false,
                  };
                });
              }
              setselunmarkedSLCTDates(md);
              setunavlblSLCTmarkedDates(md);
            } else {
              let dw2 = dw.slice();
              if (dw2.length > 0) {
                dw2.map((e, i, a) => {
                  e.isSel = false;
                });
              }
              setdow(dw2);
              setrdur(rdurtn[0]);
              setrdurNum(1);
              siERpOn(isSelDate2);
              setunavlblmarkedDates({});
              setselunmarkedSLCTDates({});
              setunavlblSLCTmarkedDates({});
            }

            setmodalHeight(0);
            setisShowUnavliableModal(true);
          } else {
            Alert.alert('', 'Please select Trip Availability first');
          }
        };

        let t = '';
        if (isSelDate1 != '' && isSelDate2 != '') {
          t =
            moment(isSelDate1).format('MMM DD, YYYY') +
            '  -  ' +
            moment(isSelDate2).format('MMM DD, YYYY');
        }

        let unavailableText = '';
        let t1 = '';
        let t2 = '';
        if (isSetUnavailable) {
          t1 = isSetUnavailable.wtxt;
          t2 = isSetUnavailable.esd_text;

          if (t1 != '' && t2 != '') {
            unavailableText = t1 + ', ' + t2;
          }
          if (t1 == '' && t2 != '') {
            unavailableText = t2;
          } else if (t1 != '' && t2 == '') {
            unavailableText = t1;
          }
        }

        return (
          <>
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldText}>You’re offering...</Text>
              {/* activity */}
              <View style={{width: '100%'}}>
                <TouchableOpacity
                  onPress={() => {
                    closeAllDropDown();
                    setisDropDownTT(!isDropDownTT);
                  }}
                  activeOpacity={activeOpacity}
                  style={[styles.dropDowninputConatiner]}>
                  <Image style={styles.dropDownIcon} source={actSrc} />

                  <View style={{width: '82%'}}>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={[
                        styles.dropDownText2,
                        {
                          opacity: tripType == '' ? 0.4 : 1,
                          textTransform: tripType == '' ? 'none' : 'capitalize',
                        },
                      ]}>
                      {tripType == ''
                        ? 'Select Activity'
                        : tripType.name + ' Trip'}
                    </Text>
                  </View>
                  <utils.vectorIcon.Fontisto
                    name="angle-down"
                    color={'#14181F'}
                    size={11}
                  />
                </TouchableOpacity>
                {isDropDownTT && renderShowDropDown('tt')}
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldText}>Located in...</Text>
              {/* location */}
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View style={[styles.inputConatiner, {width: '58%'}]}>
                  <TextInput
                    value={city}
                    onChangeText={d => {
                      setcity(d);
                    }}
                    placeholder="Example: Southeastern"
                    style={styles.input}
                  />
                </View>
                {/* location */}
                <View style={{width: '40%'}}>
                  <TouchableOpacity
                    onPress={() => {
                      closeAllDropDown();
                      setisDropDownState(!isDropDownState);
                    }}
                    activeOpacity={activeOpacity}
                    style={[styles.dropDowninputConatiner]}>
                    <View style={{width: '82%'}}>
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={[
                          styles.dropDownText2,
                          {
                            opacity: State == '' ? 0.4 : 1,
                            textTransform: State == '' ? 'none' : 'capitalize',
                          },
                        ]}>
                        {State == '' ? 'State' : State.name}
                      </Text>
                    </View>
                    <utils.vectorIcon.Fontisto
                      name="angle-down"
                      color={'#14181F'}
                      size={11}
                    />
                  </TouchableOpacity>
                  {isDropDownState && renderShowDropDown('state')}
                </View>
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldText}>Please enter the species</Text>
              {/* species */}
              <View style={{width: '100%'}}>
                <TouchableOpacity
                  disabled={tripType == '' ? true : false}
                  onPress={() => {
                    closeAllDropDown();
                    setisDropDownSpcs(!isDropDownSpcs);
                  }}
                  activeOpacity={activeOpacity}
                  style={[
                    styles.dropDowninputConatiner,
                    {opacity: tripType == '' ? 0.5 : 1},
                  ]}>
                  <Image style={styles.dropDownIcon} source={spcSrc} />
                  <View style={{width: '83%'}}>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={[
                        styles.dropDownText2,
                        {
                          opacity: species == '' ? 0.4 : 1,
                          textTransform: species == '' ? 'none' : 'capitalize',
                        },
                      ]}>
                      {species == '' ? 'Select species' : species.name}
                    </Text>
                  </View>
                  <utils.vectorIcon.Fontisto
                    style={{opacity: tripType == '' ? 0.5 : 1}}
                    name="angle-down"
                    color={'#14181F'}
                    size={11}
                  />
                </TouchableOpacity>
                {isDropDownSpcs && renderShowDropDown('spcs')}
              </View>
            </View>

            <View style={[styles.fieldContainer]}>
              <Text style={styles.fieldText}>Trip Duration</Text>
              <View style={[styles.fieldContainer, {flexDirection: 'row'}]}>
                <View style={[styles.inputConatiner, {width: '23%'}]}>
                  <TextInput
                    keyboardType="number-pad"
                    maxLength={5}
                    defaultValue={durNum.toString()}
                    value={durNum.toString()}
                    onChangeText={d => {
                      if (durNum.length == 0) {
                        if (d < parseInt(1)) {
                          return;
                        }
                      }

                      setdurNum(d.replace(/[^0-9]/, ''));
                    }}
                    style={styles.input}
                  />
                </View>

                <View style={{width: '36%', marginLeft: 10}}>
                  <TouchableOpacity
                    onPress={() => {
                      closeAllDropDown();
                      setisDropDownDur(!isDropDownDur);
                    }}
                    activeOpacity={0.6}
                    style={[
                      styles.inputConatiner,
                      {
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingHorizontal: 15,
                      },
                    ]}>
                    <View style={{width: '70%'}}>
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={[
                          styles.dropDownText,
                          {textTransform: 'capitalize'},
                        ]}>
                        {dur.title ? dur.title : ''}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: '27%',
                        alignItems: 'flex-end',
                      }}>
                      <utils.vectorIcon.Fontisto
                        name="angle-down"
                        color={theme.color.title}
                        size={13}
                      />
                    </View>
                  </TouchableOpacity>

                  {isDropDownDur && renderDropDown('dur')}
                </View>
              </View>
            </View>

            <View style={[styles.fieldContainer]}>
              <Text style={styles.fieldText}>Trip Availability</Text>
              <Text
                style={[
                  styles.fieldText,
                  {
                    color: theme.color.subTitle,
                    fontSize: 12.5,
                    fontFamily: theme.fonts.fontNormal,
                  },
                ]}>
                Guests will be able to choose between these dates.
              </Text>

              <Pressable
                onPress={onClickCal}
                style={({pressed}) => [
                  {opacity: pressed ? 0.8 : 1.0},
                  [
                    styles.inputConatiner,
                    {
                      width: '82%',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    },
                  ],
                ]}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={[
                    styles.fieldText,
                    {
                      color:
                        t == '' ? theme.color.subTitleLight : theme.color.title,
                      fontFamily: theme.fonts.fontNormal,
                      width: '85%',
                    },
                  ]}>
                  {t == '' ? 'Choose a date range' : t}
                </Text>
                <View
                  style={{
                    width: '13%',
                    alignItems: 'flex-end',
                  }}>
                  <Image
                    source={require('../../assets/images/cal/img.png')}
                    style={styles.inputIcon}
                  />
                </View>
              </Pressable>
            </View>

            {!isSetUnavailable && (
              <View style={[styles.fieldContainer, {marginTop: 10}]}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={onClickUnavailableDays}>
                  <Text style={styles.bottomText}>Set unavailable days</Text>
                </TouchableOpacity>
              </View>
            )}

            {isSetUnavailable && (
              <View style={styles.fieldContainer}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text style={styles.fieldText}>Unavailable Days</Text>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={{marginLeft: 15}}
                    onPress={onClickUnavailableDays}>
                    <Text style={[styles.bottomText, {fontSize: 13.5}]}>
                      Edit
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={{width: '100%', marginTop: 5}}>
                  <Text
                    style={{
                      fontSize: 12.5,
                      color: '#111111',
                      fontFamily: theme.fonts.fontNormal,
                    }}>
                    {unavailableText}
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldText}>Offer Note</Text>
              <View style={styles.textArea2}>
                <TextInput
                  value={note}
                  onChangeText={c => {
                    setnote(c);
                  }}
                  style={styles.mTextInpt2}
                  placeholder="(optional)"
                  multiline={true}
                />
              </View>
            </View>
          </>
        );
      };

      return (
        <Modal visible={isModal} transparent onRequestClose={closeModal}>
          <SafeAreaView style={styles.modalContainer}>
            <View style={[styles.modalContainer2, {margin: 15}]}>
              <View
                onLayout={event => {
                  if (!isMaxHeight) {
                    let {height} = event.nativeEvent.layout;
                    setmodalHeight(height);
                  }
                }}
                style={style}>
                {isMaxHeight && (
                  <>
                    {renderHeader()}
                    <ScrollView
                      contentContainerStyle={{paddingHorizontal: 15}}
                      showsVerticalScrollIndicator={false}
                      style={{flex: 1}}>
                      {renderTitle()}

                      {renderField()}
                    </ScrollView>
                    {renderBottom()}
                  </>
                )}

                {!isMaxHeight && (
                  <>
                    {renderHeader()}
                    {renderTitle()}

                    {renderField()}
                    {renderBottom()}
                  </>
                )}
              </View>
            </View>
            {showCalender && renderCalender()}
          </SafeAreaView>
        </Modal>
      );
    }

    //set unavlble days
    if (modalCheck == 'offer' && step == 3 && isShowUnavliableModal) {
      let c = modalHeight >= maxModalHeight ? true : false;
      let style = c
        ? [styles.umodal, {paddingTop: 0, height: maxModalHeight}]
        : styles.umodal2;

      let tt = '';

      let esd = [];
      if (!isObjectEmpty(selunmarkeSLCTdDates)) {
        var myObject = selunmarkeSLCTdDates;
        Object.keys(myObject).forEach(function (key, index) {
          esd.push(key);
        });
      }
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

      const ApplyModal = () => {
        let doweeks = daysOfWeek.slice();

        let dw = [];

        if (doweeks.length > 0) {
          doweeks.map((e, i, a) => {
            if (e.isSel) {
              dw.push(e.name);
            }
          });
        }

        let wtxt = '';
        if (dw.length > 0) {
          dw.map((e, i, a) => {
            let sep = a[i + 2] == undefined ? ' and ' : ', ';

            if (sep == ' and ' && i == a.length - 1) {
              sep = '';
            }
            wtxt = wtxt + e + sep;
          });
        }
        if (wtxt != '') {
          wtxt = wtxt + ` (${rdur.title == 'weeks' ? 'weekly' : rdur.title})`;
        }

        let unw = [];
        let exsd = [];

        let ad = [];
        if (!isObjectEmpty(selunmarkeSLCTdDates)) {
          var myObject = selunmarkeSLCTdDates;
          Object.keys(myObject).forEach(function (key, index) {
            ad.push(key);
            exsd.push(key);
          });
        }
        if (!isObjectEmpty(unavlblmarkedDates)) {
          var myObject = unavlblmarkedDates;
          Object.keys(myObject).forEach(function (key, index) {
            ad.push(key);
            unw.push(key);
          });
        }

        if (unw.length > 0) {
          unw.sort(function (a, b) {
            return Number(new Date(a)) - Number(new Date(b));
          });
        }
        if (exsd.length > 0) {
          exsd.sort(function (a, b) {
            return Number(new Date(a)) - Number(new Date(b));
          });
        }
        if (ad.length > 0) {
          ad.sort(function (a, b) {
            return Number(new Date(a)) - Number(new Date(b));
          });

          let l = ad.length;
          const a = moment(isSelDate2);
          const b = moment(isSelDate1);
          let td = a.diff(b, 'days');
          td++;
          let fl = td - l;
          let totaldays = 0;
          let t = dur.title;
          if (t == 'days') {
            totaldays = durNum;
          } else if (t == 'weeks') {
            totaldays = durNum * 7;
          } else if (t == 'months') {
            totaldays = durNum * 30;
          } else if (t == 'years') {
            totaldays = durNum * 365;
          }

          if (fl < totaldays) {
            Alert.alert(
              '',
              'Total available dates is less then duration number days',
            );
            return;
          }
        }

        let obj = false;
        if (dw.length > 0 || ad.length > 0) {
          obj = {
            days_of_week: dw, //main
            repeat_every: {
              //main
              num: rdurNum,
              title: rdur.title,
              endRepeatOn: endRepOn,
            },
            wtxt: wtxt,
            esd_text: tt,

            unavailable_days_of_week: unw, //main
            exclude_specific_dates: exsd, //main
            all_unavailable_dates: ad, //main
          };
        }

        setisSetUnavailable(obj);
        setisShowUnavliableModal(false);
      };

      const onClickrCal = c => {
        setischk(c);
        setisShowUnavliabledaysCal(!isShowUnavliabledaysCal);
      };

      const renderHeader = () => {
        let text = 'Set Unavailable Days';

        const renderCross = () => {
          return (
            <Pressable
              disabled={homeModalLoder}
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

      const renderTitle = () => {
        let text =
          'Choose the days when this trip is not available. The days you specify here will be unavailable to the host.';

        return (
          <View style={{marginTop: 10}}>
            <Text style={styles.modalsubTitle}>{text}</Text>
          </View>
        );
      };

      const renderWeek = () => {
        const renderShowData = () => {
          const d = daysOfWeek.map((e, i, a) => {
            return (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginRight: i <= a.length - 1 ? 15 : 0,
                  marginTop: 12,
                }}>
                <TouchableOpacity
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 4,
                    backgroundColor: !e.isSel ? 'white' : theme.color.button1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 1,
                    borderColor: theme.color.fieldBorder,
                  }}
                  activeOpacity={0.5}
                  onPress={() => {
                    let c = daysOfWeek.slice();
                    if (c[i].isSel == false) {
                      setunavlblSLCTmarkedDates({});
                      setselunmarkedSLCTDates({});
                    }
                    c[i].isSel = !c[i].isSel;

                    setdow(c);
                  }}>
                  {e.isSel && (
                    <utils.vectorIcon.FontAwesome5
                      name={'check'}
                      color={theme.color.buttonText}
                      size={11}
                    />
                  )}
                </TouchableOpacity>
                <Text
                  style={{
                    color: '#0E2932',
                    fontSize: 12,
                    fontFamily: theme.fonts.fontNormal,
                    textTransform: 'capitalize',
                    marginLeft: 7,
                  }}>
                  {e.name}
                </Text>
              </View>
            );
          });

          return d;
        };

        return (
          <View style={{marginTop: 15, width: '100%'}}>
            <Text
              style={{
                fontSize: 13,
                color: theme.color.title,
                fontFamily: theme.fonts.fontBold,
              }}>
              Days of Week
            </Text>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
                flexShrink: 1,
                flexWrap: 'wrap',
              }}>
              {renderShowData()}
            </View>
          </View>
        );
      };

      const renderDropDown = c => {
        let data = [];

        if (c == 'dur') {
          data = durtn;
        }
        if (c == 'rdur') {
          data = rdurtn;
        }

        const onclickSelect = d => {
          if (c == 'dur') {
            setdur(d);
          }
          if (c == 'rdur') {
            setrdur(d);
          }
        };

        // console.log('drop down data : ', data);
        let abs = Platform.OS == 'ios' ? false : true;
        return (
          <utils.DropDown
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

      const renderRepeat = () => {
        let t = '';
        if (endRepOn != '') {
          t = moment(endRepOn).format('MMM DD, YYYY');
        }

        return (
          <>
            <View style={[styles.fieldContainer, {marginTop: 15}]}>
              <Text style={styles.fieldText}>Repeat for</Text>
              <View
                style={[
                  styles.fieldContainer,
                  {marginTop: 5, flexDirection: 'row'},
                ]}>
                <View style={[styles.inputConatiner, {width: '20%'}]}>
                  <TextInput
                    keyboardType="number-pad"
                    maxLength={5}
                    defaultValue={rdurNum.toString()}
                    value={rdurNum.toString()}
                    onChangeText={d => {
                      if (rdurNum.length == 0) {
                        if (d < parseInt(1)) {
                          return;
                        }
                      }

                      setrdurNum(d.replace(/[^0-9]/, ''));
                    }}
                    style={[styles.input, {fontSize: 12.5}]}
                  />
                </View>

                <View style={{width: '40%', marginLeft: 10}}>
                  <TouchableOpacity
                    onPress={() => {
                      closeAllDropDown();
                      setisDropDownrDur(!isDropDownrDur);
                    }}
                    activeOpacity={0.6}
                    style={[
                      styles.inputConatiner,
                      {
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingHorizontal: 15,
                      },
                    ]}>
                    <View style={{width: '70%'}}>
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={[
                          styles.dropDownText,
                          {fontSize: 12.5, textTransform: 'none'},
                        ]}>
                        {rdur.title
                          ? rdur.title == 'weeks'
                            ? 'Week(s)'
                            : rdur.title
                          : ''}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: '27%',
                        alignItems: 'flex-end',
                      }}>
                      <utils.vectorIcon.Fontisto
                        name="angle-down"
                        color={theme.color.title}
                        size={13}
                      />
                    </View>
                  </TouchableOpacity>

                  {isDropDownrDur && renderDropDown('rdur')}
                </View>
              </View>
            </View>

            <View style={[styles.fieldContainer, {marginTop: 15}]}>
              <Text style={styles.fieldText}>End Repeat On</Text>
              <View style={[styles.fieldContainer, {marginTop: 5}]}>
                <Pressable
                  onPress={() => {
                    onClickrCal('endrepeat');
                  }}
                  style={({pressed}) => [
                    {opacity: pressed ? 0.8 : 1.0},
                    [
                      styles.inputConatiner,
                      {
                        width: '63%',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      },
                    ],
                  ]}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={[
                      styles.fieldText,
                      {
                        color:
                          t == ''
                            ? theme.color.subTitleLight
                            : theme.color.title,
                        fontFamily: theme.fonts.fontNormal,
                        width: '85%',
                        fontSize: 12.5,
                      },
                    ]}>
                    {t == '' ? 'Select a date' : t}
                  </Text>
                  <View
                    style={{
                      width: '13%',
                      alignItems: 'flex-end',
                    }}>
                    <Image
                      source={require('../../assets/images/cal/img.png')}
                      style={styles.inputIcon}
                    />
                  </View>
                </Pressable>
              </View>
            </View>
          </>
        );
      };

      const renderOtherDates = () => {
        return (
          <>
            <View style={[styles.fieldContainer, {marginTop: 15}]}>
              <Text style={styles.fieldText}>Exclude Specific Dates</Text>
              <View style={[styles.fieldContainer, {marginTop: 5}]}>
                <Pressable
                  onPress={() => {
                    onClickrCal('otherdates');
                  }}
                  style={({pressed}) => [
                    {opacity: pressed ? 0.8 : 1.0},
                    [
                      styles.inputConatiner,
                      {
                        width: '100%',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      },
                    ],
                  ]}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={[
                      styles.fieldText,
                      {
                        color:
                          tt == ''
                            ? theme.color.subTitleLight
                            : theme.color.title,
                        fontFamily: theme.fonts.fontNormal,
                        width: '85%',
                        fontSize: 12.5,
                      },
                    ]}>
                    {tt == '' ? 'Select dates this trip is not available' : tt}
                  </Text>
                  <View
                    style={{
                      width: '13%',
                      alignItems: 'flex-end',
                    }}>
                    <Image
                      source={require('../../assets/images/cal/img.png')}
                      style={styles.inputIcon}
                    />
                  </View>
                </Pressable>
              </View>
            </View>
          </>
        );
      };

      const renderBottom = () => {
        const renderButton1 = () => {
          return (
            <Pressable
              onPress={closeModal}
              style={({pressed}) => [
                {opacity: pressed ? 0.8 : 1.0},
                styles.ButtonContainer,
                {
                  backgroundColor: 'transparent',
                  borderWidth: 1,
                  borderColor: theme.color.fieldBorder,
                  marginRight: 15,
                  paddingHorizontal: 10,
                },
              ]}>
              <Text
                style={[styles.ButtonText, {color: '#30563A', fontSize: 12}]}>
                Back
              </Text>
            </Pressable>
          );
        };

        const renderButton2 = () => {
          return (
            <Pressable
              onPress={() => ApplyModal()}
              style={({pressed}) => [
                {opacity: pressed ? 0.8 : 1.0},
                styles.ButtonContainer,
                {backgroundColor: theme.color.button1, paddingHorizontal: 10},
              ]}>
              <Text
                style={[
                  styles.ButtonText,
                  {color: theme.color.buttonText, fontSize: 12},
                ]}>
                Save and Continue
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
                // backgroundColor: 'red',
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
                // backgroundColor: 'red',
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
        <Modal
          visible={isShowUnavliableModal}
          transparent
          onRequestClose={closeModal}>
          <SafeAreaView style={styles.modalContainer}>
            <View style={[styles.modalContainer2, {margin: 15}]}>
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
                      {renderWeek()}
                      {renderOtherDates()}
                      {/* {renderRepeat()} */}
                    </ScrollView>
                    {renderBottom()}
                  </>
                )}

                {!c && (
                  <>
                    {renderHeader()}
                    {renderTitle()}
                    {renderWeek()}
                    {renderOtherDates()}
                    {/* {renderRepeat()} */}
                    {renderBottom()}
                  </>
                )}
              </View>
            </View>
            {isShowUnavliabledaysCal && renderCalender2()}
          </SafeAreaView>
        </Modal>
      );
    }

    //review trip
    if (modalCheck == 'offer' && step == 4) {
      const renderHeader = () => {
        let text = 'Make Offer';

        const renderCross = () => {
          return (
            <Pressable
              disabled={homeModalLoder}
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
              isMaxHeight
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
        let userName = item.user.firstName + ' ' + item.user.lastName;
        let isVeirfy = item.user.identityStatus || false;
        let duration = item.duration.number;
        let t =
          duration <= 1
            ? item.duration.title.substring(0, item.duration.title.length - 1)
            : item.duration.title;
        duration = duration + ' ' + t;
        let photo = item.user.image || '';
        let species = item.species || '';

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
                style={[
                  styles.mtextContainertitle,
                  {textTransform: 'capitalize'},
                ]}>
                {species}
              </Text>

              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.textContainertitle2}>
                Duration: {duration}
              </Text>

              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.textContainertitle3}>
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
          <>
            <Text
              style={{
                marginTop: 10,
                fontSize: 12,
                color: theme.color.subTitleLight,
                fontFamily: theme.fonts.fontBold,
              }}>
              IN RETURN FOR
            </Text>
            <View style={[styles.modalinfoConatiner2, {marginTop: 0}]}>
              {renderProfile()}
              {renderText()}
            </View>
          </>
        );
      };

      const renderField = () => {
        let spcs = species.name;
        let locationName = location.city + ', ' + location.state;
        let duration = durNum + ' ' + dur.title;
        let availablity =
          moment(isSelDate1).format('MMM DD') +
          '  -  ' +
          moment(isSelDate2).format('MMM DD');
        let unavailable = '';
        let t1 = '';
        let t2 = '';
        if (isSetUnavailable) {
          t1 = isSetUnavailable.wtxt;
          t2 = isSetUnavailable.esd_text;

          if (t1 != '' && t2 != '') {
            unavailable = t1 + ', ' + t2;
          }
          if (t1 == '' && t2 != '') {
            unavailable = t2;
          } else if (t1 != '' && t2 == '') {
            unavailable = t1;
          }
        }

        return (
          <View style={{marginTop: 20}}>
            <View style={[styles.rField, {width: '85%'}]}>
              <Text style={styles.rTitle}>YOUR OFFERING</Text>
              <Text
                style={[styles.rTitle2, {color: theme.color.titleGreenForm}]}>
                {spcs}
              </Text>
            </View>

            <View style={styles.rField2}>
              <View style={[styles.rField, {width: '49%'}]}>
                <Text style={styles.rTitle}>TRIP LOCATION</Text>
                <Text
                  // numberOfLines={2}
                  // ellipsizeMode="tail"
                  style={[styles.rTitle2, {textTransform: 'none'}]}>
                  {locationName}
                </Text>
              </View>

              <View style={[styles.rField, {width: '49%'}]}>
                <Text style={styles.rTitle}>TRIP DURATION</Text>
                <Text style={[styles.rTitle2, {textTransform: 'none'}]}>
                  {duration}
                </Text>
              </View>
            </View>

            <View style={styles.rField2}>
              <View style={[styles.rField, {width: '49%'}]}>
                <Text style={styles.rTitle}>TRIP Availability</Text>
                <Text style={styles.rTitle2}>{availablity}</Text>
              </View>

              <View style={[styles.rField, {width: '49%'}]}>
                <Text style={styles.rTitle}>UNAVAILABLE DAYS</Text>
                <Text style={[styles.rTitle2, {textTransform: 'none'}]}>
                  {unavailable == '' ? 'Null' : unavailable}
                </Text>
              </View>
            </View>

            {note != '' && (
              <View style={[styles.rField, {width: '85%', marginTop: 20}]}>
                <Text style={styles.rTitle}>OFFER NOTE</Text>
                <Text
                  style={[
                    styles.rTitle2,
                    {
                      textTransform: 'none',
                      fontSize: 12,
                    },
                  ]}>
                  {note}
                </Text>
              </View>
            )}
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
                Edit My Offer
              </Text>
            </Pressable>
          );
        };

        const renderButton2 = () => {
          return (
            <Pressable
              disabled={homeModalLoder}
              onPress={ConfirmSend}
              style={({pressed}) => [
                {opacity: pressed ? 0.8 : 1.0},
                styles.ButtonContainer,
                {
                  backgroundColor: theme.color.button1,
                  paddingHorizontal: !homeModalLoder ? 8 : 15,
                },
              ]}>
              {!homeModalLoder && (
                <Text
                  style={[
                    styles.ButtonText,
                    {
                      color: theme.color.buttonText,
                      fontSize: 11,
                      textTransform: 'none',
                    },
                  ]}>
                  Confirm and Send
                </Text>
              )}
              {homeModalLoder && (
                <ActivityIndicator size={18} color={theme.color.buttonText} />
              )}
            </Pressable>
          );
        };

        return (
          <View
            style={
              isMaxHeight
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
                  isMaxHeight
                    ? [styles.modalBottomContainer, {paddingTop: 15}]
                    : styles.modalBottomContainer2
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
            <View style={[styles.modalContainer2, {margin: 12}]}>
              <View
                onLayout={event => {
                  if (!isMaxHeight) {
                    let {height} = event.nativeEvent.layout;
                    setmodalHeight(height);
                  }
                }}
                style={style}>
                {isMaxHeight && (
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

                {!isMaxHeight && (
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

    if (modalCheck == 'message') {
      const renderHeader = () => {
        let text = 'Message User';

        const renderCross = () => {
          return (
            <Pressable
              disabled={homeModalLoder}
              style={({pressed}) => [
                {opacity: pressed ? 0.7 : 1.0},
                styles.modalCross,
              ]}
              onPress={closeMessageModal}>
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
        let item = modalObj.item;
        let usr = item.hostId;
        let photo = usr?.image || '';
        let isVeirfy = usr.identityStatus == 'verified' ? true : false;
        let userName = usr.firstName + ' ' + usr.lastName;

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
              disabled={
                homeModalLoder == true ? true : message == '' ? true : false
              }
              style={({pressed}) => [
                {opacity: pressed ? 0.9 : message == '' ? 0.5 : 1},
                styles.ButtonContainer,
                {backgroundColor: theme.color.button1, width: '100%'},
              ]}>
              {!homeModalLoder && (
                <Text
                  style={[
                    styles.ButtonText,
                    {color: theme.color.buttonText, fontSize: 13},
                  ]}>
                  Send Message
                </Text>
              )}
              {homeModalLoder && (
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
        <Modal visible={isModal} transparent onRequestClose={closeMessageModal}>
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

    if (modalCheck == 'tripSave') {
      const renderButton1 = () => {
        return (
          <>
            <TouchableOpacity
              onPress={closeTripSaveModal}
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

      let item = modalObj.item;

      let title = item.title || '';
      let src = require('../../assets/images/tripSaveDone/img.png');
      return (
        <Modal
          animationType="slide"
          visible={isModal}
          transparent
          onRequestClose={closeTripSaveModal}>
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
                  Trip Saved
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
                  style={{width: 88, height: 88, resizeMode: 'contain'}}
                  source={src}
                />

                <Text
                  numberOfLines={3}
                  ellipsizeMode="tail"
                  style={{
                    width: '90%',
                    marginTop: 15,
                    fontFamily: theme.fonts.fontBold,
                    fontSize: 15,
                    color: '#101B10',
                    textTransform: 'capitalize',
                    lineHeight: 22,
                    textAlign: 'center',
                  }}>
                  {`"${title}"`}
                </Text>
              </View>

              {renderButton1()}
              {/* {renderButton2()} */}
            </View>
          </View>
        </Modal>
      );
    }

    if (modalCheck == 'tripRemove') {
      const renderHeader = () => {
        let text = 'Remove Saved Trip?';

        const renderCross = () => {
          return (
            <Pressable
              disabled={deleteLoader}
              style={({pressed}) => [
                {opacity: pressed ? 0.7 : 1.0},
                [
                  !isMaxHeight
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
              onPress={closeMModal}>
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
              isMaxHeight
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
        let photo = usr?.image ? usr.image : '';

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
        let title = item.title || '';
        let trade = item.returnActivity || '';
        return (
          <>
            <View style={{paddingLeft: 10, paddingRight: 20}}>
              <View style={styles.field}>
                <Text style={styles.filedTitle}>Offering</Text>
                <Text style={[styles.filedTitle2, {color: theme.color.title}]}>
                  {title}
                </Text>
              </View>

              <View style={styles.field}>
                <Text style={styles.filedTitle}>for trade</Text>
                <Text style={[styles.filedTitle2, {color: theme.color.title}]}>
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
                disabled={deleteLoader}
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
                {!deleteLoader && (
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
                {deleteLoader && (
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
                disabled={deleteLoader}
                onPress={closeMModal}
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
              isMaxHeight
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
                isMaxHeight
                  ? styles.modalBottomContainerrmv
                  : styles.modalBottomContainer2rmv
              }>
              {renderButton1()}
              {renderButton2()}
            </View>
          </View>
        );
      };

      return (
        <Modal visible={isModal} transparent onRequestClose={closeMModal}>
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalContainer2}>
              <View
                onLayout={event => {
                  if (!isMaxHeight) {
                    let {height} = event.nativeEvent.layout;
                    setmodalHeight(height);
                  }
                }}
                style={style}>
                {isMaxHeight && (
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

                {!isMaxHeight && (
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

  const renderChooseDateCalender = () => {
    let item = modalObj.item;

    let duration = item.duration.number;
    let durationTitle = item.duration.title;
    let unavailable_days = item.unavailable.all_unavailable_dates || [];
    let mdt = moment(item.availablity.startDate).format('YYYY-MM-DD');
    let cdt = moment(new Date()).format('YYYY-MM-DD');

    let mind = '';

    if (mdt < cdt) {
      mind = moment(cdt).format('YYYY-MM-DD');
    } else {
      mind = moment(mdt).format('YYYY-MM-DD');
    }
    let mxd = moment(item.availablity.endDate).format('YYYY-MM-DD');
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
      setIsChooseDateCalender(false);
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
      setIsChooseDateCalender(false);
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
      <Modal
        visible={isChooseDateCalender}
        transparent
        onRequestClose={closeCalModal}>
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
                setMonthh(new Date(month.dateString));
              }}
              firstDay={7}
              // onPressArrowLeft={subtractMonth => subtractMonth()}
              // onPressArrowRight={addMonth => addMonth()}
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

  //make offer
  const renderCalender = () => {
    const closeCalModal = () => {
      setshowCalender(false);
      setmarkedDates(selDates);
    };
    const ApplyCalModal = () => {
      setisSetUnavailable(false);
      setunavlblmarkedDates({});
      setunavlblSLCTmarkedDates({});
      setselunmarkedSLCTDates({});

      setdow(dw);
      setrdurNum(1);
      setrdur(rdurtn[0]);

      setselDates(markedDates);
      setmarkedDates(markedDates);
      setshowCalender(false);
    };

    const formatDate = date => {
      var dd = moment(date).format('MMMM YYYY');
      return dd;
    };

    const getSelectedDayEvents = date => {
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
        return;
      } else {
        let md = {...markedDates};
        const size = Object.keys(md).length;
        let o = md[date];

        if (o !== undefined) {
          console.warn('The key exists.');

          if (size < 2) {
            delete md[date];
            setmarkedDates(md);
            return;
          } else {
            let c1 = Object.keys(md)[0];
            let c2 = Object.keys(md)[size - 1];

            let m = {};
            if (c1 < date) {
              m[c1] = {
                customStyles: cs,
                marked: false,
                selected: true,
                selectedColor: theme.color.button1,
                disabled: false,
                disableTouchEvent: false,
              };
            } else {
              m[c2] = {
                customStyles: cs,
                marked: false,
                selected: true,
                selectedColor: theme.color.button1,
                disabled: false,
                disableTouchEvent: false,
              };
            }
            setmarkedDates(m);
            return;
          }
        } else {
          console.warn('The key does not exist.');
          let md = {...markedDates};
          if (size >= 2) {
            return;
          }

          let pd1 = Object.keys(md)[0];
          let pd2 = date;
          let mid = '';
          let mxd = '';
          if (pd1 > pd2) {
            mxd = pd1;
            mid = date;
          } else {
            mxd = date;
            mid = pd1;
          }
          const a = moment(mxd);
          const b = moment(mid);
          const no_of_days = a.diff(b, 'days');
          console.error('nod : ', no_of_days);
          let totaldays = 0;
          let t = dur.title;
          if (t == 'days') {
            totaldays = durNum;
          } else if (t == 'weeks') {
            totaldays = durNum * 7;
          } else if (t == 'months') {
            totaldays = durNum * 30;
          } else if (t == 'years') {
            totaldays = durNum * 365;
          }
          if (no_of_days < totaldays) {
            Alert.alert(
              '',
              'Date range must be greater or equal than trip duration',
            );
            return;
          }

          var daylist = getDaysArray(new Date(mid), new Date(mxd));
          let mdd = {};
          if (daylist.length > 0) {
            daylist.map((e, i, a) => {
              let d = moment(e).format('YYYY-MM-DD');
              if (i == 0) {
                mdd[d] = {
                  customStyles: cs,
                  marked: false,
                  selected: true,
                  selectedColor: theme.color.button1,
                  disabled: false,
                  disableTouchEvent: false,
                };
              }
              if (i > 0 && i < a.length - 1) {
                mdd[d] = {
                  customStyles: cs,
                  marked: false,
                  selected: true,
                  selectedColor: theme.color.button1,
                  disabled: true,
                  disableTouchEvent: true,
                };
              }
              if (i == a.length - 1) {
                mdd[d] = {
                  customStyles: cs,
                  marked: false,
                  selected: true,
                  selectedColor: theme.color.button1,
                  disabled: false,
                  disableTouchEvent: false,
                };
              }
            });
          }

          setmarkedDates(mdd);
          return;
        }
      }
    };

    const renderBottom = () => {
      let c = isSelDate ? false : true;
      let dn = durNum;
      let t = dn < 1 ? dur.title.substring(0, dur.title.length - 1) : dur.title;
      t = dn + ' ' + t;
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
            }}>
            <Text
              style={{
                fontSize: 11,
                fontFamily: theme.fonts.fontNormal,
                color: theme.color.subTitleLight,
                paddingLeft: 10,
              }}>
              Duration : {t}
            </Text>
          </View>

          <View
            style={{
              width: '55%',

              alignItems: 'flex-end',
              paddingRight: 10,
            }}>
            <View
              style={{
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
                    marginRight: 10,
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
              initialDate={mind || iDate}
              // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
              minDate={mindd || iDate}
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
              disableAllTouchEventsForInactiveDays={true}
              markingType="custom"
              // markingType="period"
              markedDates={{...td, ...markedDates}}
            />
            {renderBottom()}
          </View>
        </SafeAreaView>
      </Modal>
    );
  };

  const renderCalender2 = () => {
    const closeCalModal = () => {
      setisShowUnavliabledaysCal(false);

      setischk('');
      let d = Object.keys(endRepOnS)[0];
      siERpOn(d);
      setunavlblSLCTmarkedDates(selunmarkeSLCTdDates);
    };
    const ApplyCalModal = () => {
      if (ischk == 'endrepeat') {
        setisShowUnavliabledaysCal(false);
        let d = Object.keys(endRepOnM)[0];
        siERpOn(d);

        let esd = [];
        if (!isObjectEmpty(selunmarkeSLCTdDates)) {
          var myObject = selunmarkeSLCTdDates;
          Object.keys(myObject).forEach(function (key, index) {
            esd.push(key);
          });
        }
        if (esd.length > 0) {
          esd.sort(function (a, b) {
            return Number(new Date(a)) - Number(new Date(b));
          });
        }

        if (esd.length > 0) {
          if (d >= esd[0]) {
            setunavlblSLCTmarkedDates({});
            setselunmarkedSLCTDates({});
          }
        }

        return;
      } else {
        setisShowUnavliabledaysCal(false);
        setselunmarkedSLCTDates(unavlblSLCTmarkedDates);
        return;
      }
    };

    const formatDate = date => {
      var dd = moment(date).format('MMMM YYYY');
      return dd;
    };

    const getSelectedDayEvents = date => {
      if (ischk == 'endrepeat') {
        let md = {};
        md[date] = {
          customStyles: cs,
          marked: false,
          selected: true,
          selectedColor: theme.color.button1,
          disabled: true,
          disableTouchEvent: true,
        };
        setendRepOnM(md);
        return;
      } else {
        let md = {...unavlblSLCTmarkedDates};
        if (isObjectEmpty(md)) {
          let markedDates = {};
          markedDates[date] = {
            customStyles: cs,
            marked: false,
            selected: true,
            selectedColor: theme.color.button1,
            disabled: false,
            disableTouchEvent: false,
          };
          setunavlblSLCTmarkedDates(markedDates);
          return;
        } else {
          let o = md[date];
          if (o !== undefined) {
            console.warn('The key exists.');
            delete md[date];
          } else {
            console.warn('The key does not exist.');
            md[date] = {
              marked: false,
              selected: true,
              customStyles: cs,
              selectedColor: theme.color.button1,
              disabled: false,
              disableTouchEvent: false,
            };
          }
          setunavlblSLCTmarkedDates(md);
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
    let todaymark = isDisableToday2 ? dtd : td;
    return (
      <Modal
        visible={isShowUnavliabledaysCal}
        transparent
        onRequestClose={closeCalModal}>
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
              initialDate={ischk == 'endrepeat' ? endRepOn : mind}
              // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
              minDate={mind}
              // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
              maxDate={maxd}
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
              disableAllTouchEventsForDisabledDays={false}
              markingType="custom"
              markedDates={
                ischk == 'endrepeat'
                  ? {...todaymark, ...endRepOnM}
                  : {
                      ...todaymark,
                      ...unavlblmarkedDates,
                      ...unavlblSLCTmarkedDates,
                    }
              }
            />
            {renderBottom()}
          </View>
        </SafeAreaView>
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
              props.navigation.navigate('TradeOffers');
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
              Go to Trade Offers
            </Text>
          </TouchableOpacity>
        </>
      );
    };

    const closeModal = () => {
      setisOfferSend(false);
    };

    const firstName = sendObj.firstName;
    const lastName = sendObj.lastName;
    const sendOfferUsername = firstName + ' ' + lastName;
    const src = require('../../assets/images/offerSentDone/img.png');
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
                You sent an offer to
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
              props.navigation.navigate('Inbox');
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
    let un = sendObj.userName ? sendObj.userName : 'username';
    let src = require('../../assets/images/msgSentDone/img.png');
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

  const windowSize = 21;

  return (
    <>
      <View style={styles.container}>
        <utils.DrawerHeader props={props} headerTitle={headerTitle} />
        {!isInternet && <utils.InternetMessage />}
        <SafeAreaView style={styles.container2}>
          <View style={styles.container3}>
            <Accordion
              renderAsFlatList
              ref={scrollRef2}
              decelerationRate={'fast'}
              removeClippedSubviews
              initialNumToRender={limit}
              windowSize={windowSize}
              maxToRenderPerBatch={windowSize}
              underlayColor={'rgba(245,252,255,1)'}
              bxc={styles.boxContainer}
              sections={data}
              activeSections={activeSections}
              onChange={s => updateSections(s)}
              elm={<EmptyListMessage />}
              isv={ItemSeparatorView}
              listH={
                <ListHeader
                  search={search}
                  setsearch={c => setSearch(c)}
                  data={saveData}
                />
              }
              renderHeader={(item, index, isActive) => (
                <Card1 item={item} isActive={isActive} props={props} />
              )}
              renderSectionTitle={(item, index) => (
                <Card2
                  item={item}
                  index={index}
                  user={store.User.user}
                  props={props}
                  onClickremoveTrips={(it, i) => onClickremoveTrips(it, i)}
                />
              )}
              renderContent={(item, index, isActive) => (
                <Card3
                  item={item}
                  index={index}
                  isActive={isActive}
                  user={store.User.user}
                  props={props}
                  showpic={showpic}
                  animtntime={animtntime}
                  onClickMessage={(it, i) => onClickMessage(it, i)}
                  onClickMakeOffer={(it, i) => onClickMakeOffer(it, i)}
                />
              )}
              ListFooterComponent={
                <ListFooter
                  data={data}
                  d={saveData}
                  loadMore={loadMore}
                  LoadMore={LoadMore}
                  limit={limit}
                />
              }
            />
          </View>

          <utils.Footer
            nav={props.navigation}
            screen={headerTitle}
            focusScreen={store.General.focusScreen}
          />
        </SafeAreaView>

        {isModal && !isOfferSend && !isSendMessage && renderModal()}
        {isOfferSend && renderShowOfferSendModal()}
        {isSendMessage && renderMessageSendModal()}

        {store.Notifications.isShowNotifcation && <utils.ShowNotifications />}
        <Toast ref={toast} position="bottom" />
      </View>
    </>
  );
}