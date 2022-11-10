import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Linking,
  PermissionsAndroid,
  Platform,
  TextInput,
  Pressable,
  Dimensions,
  Modal as MModal,
  KeyboardAvoidingView,
  BackHandler,
  Keyboard,
  Alert,
  FlatList,
} from 'react-native';
import {styles} from './styles';
import {observer} from 'mobx-react';
import store from '../../store/index';
import utils from '../../utils/index';
import theme from '../../theme';
import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';
import {Image as ImageCompressor} from 'react-native-compressor';
import {request, PERMISSIONS, check} from 'react-native-permissions';
import ProgressiveFastImage from '@freakycoder/react-native-progressive-fast-image';
import Modal from 'react-native-modal';

import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-easy-toast';
import IntentLauncher from 'react-native-intent-launcher';

import {ScrollView} from 'react-native-gesture-handler';
import {Calendar} from 'react-native-calendars';
import moment, {duration} from 'moment';

function isObjectEmpty(value) {
  return (
    Object.prototype.toString.call(value) === '[object Object]' &&
    JSON.stringify(value) === '{}'
  );
}

export default observer(NewTrips);

let actSrc = require('../../assets/images/filters/activity/img.png');
let spcSrc = require('../../assets/images/filters/species/img.png');

function NewTrips(props) {
  let activeOpacity = 0.8;
  let css2f = {
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

  let td = {
    [moment().format('YYYY-MM-DD')]: {
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
    [moment().format('YYYY-MM-DD')]: {
      marked: false,
      selected: true,
      customStyles: css2f,
      // selectedColor: 'red',
      disabled: true,
      disableTouchEvent: true,
    },
  };

  let seDayColor = theme.color.button1;
  let ocolor = '#569969';

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
    // {
    //   _id: 2,
    //   is_active: true,
    //   title: 'months',
    //   type: 'durType',
    // },
    // {
    //   _id: 2,
    //   is_active: true,
    //   title: 'years',
    //   type: 'durType',
    // },
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
      title: 'days',
      type: 'durType',
    },
    {
      _id: 2,
      is_active: true,
      title: 'months',
      type: 'durType',
    },
  ];

  const toast = useRef(null);
  const toastduration = 700;
  let editTrip = store.User.editTripObj;
  let isEdit = store.User.editTrip ? true : false;

  const [isDisableToday2, setisDisableToday2] = useState(false);

  let headerTitle = !isEdit ? 'New Trip' : 'Edit Trip';
  let internet = store.General.isInternet;
  let user = store.User.user;

  let maxModalHeight = theme.window.Height - 100;
  const [modalHeight, setmodalHeight] = useState(0);

  const [location, setlocation] = useState(false);
  const [title, settitle] = useState('');

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

  // const [actvtyList, setactvtyList] = useState([]);
  // const [actvtyListS, setactvtyListS] = useState([]);
  // const [isModalVisible, setModalVisible] = useState(false);

  const [status, setstatus] = useState('active');
  const [isDropDownDur, setisDropDownDur] = useState(false);
  const [dur, setdur] = useState(durtn[0]); //time solts
  const [rdur, setrdur] = useState(rdurtn[0]);
  const [isDropDownrDur, setisDropDownrDur] = useState(false);
  const [trade, settrader] = useState('');
  const [Return, setReturn] = useState('');
  const [acceptOther, setacceptOther] = useState(false);
  const [durNum, setdurNum] = useState(1);
  const [showCalender, setshowCalender] = useState(false);
  const [iDate, setiDate] = useState(new Date());
  const [minDate, setminDate] = useState(new Date());

  const [month, setmonth] = useState(new Date());
  const [markedDates, setmarkedDates] = useState({});
  const [isSelDate, setisSelDate] = useState(false);
  const [selDates, setselDates] = useState({});
  const [isSelDate1, setisSelDate1] = useState('');
  const [isSelDate2, setisSelDate2] = useState('');
  const [mind, setmind] = useState(undefined);
  const [mindd, setmindd] = useState(undefined);
  const [maxd, setmaxd] = useState(undefined);
  const [isShowUnavliableModal, setisShowUnavliableModal] = useState(false);
  const [dow, setdow] = useState(dw); //days of week
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
  const [isShowPrmsn, setisShowPrmsn] = useState(false);
  const [prmsnChk, setprmsnChk] = useState('');
  const [DT, setDT] = useState(false);
  const [isAddPhotoModal, setisAddPhotoModal] = useState(false);
  let maxPhotos = 6;
  const [photos, setPhotos] = useState([]);
  const [pvm, setpvm] = useState(false);
  const [si, setsi] = useState('');
  const [deletePObj, setdeletePObj] = useState(false);
  const [deleteModal, setdeleteModal] = useState(false);
  const [isButtonDisable, setisButtonDisable] = useState(false);
  const [isReviewTrip, setisReviewTrip] = useState(false);
  const [isTripCreate, setisTripCreate] = useState(false);
  const [modalChk, setmodalChk] = useState(false);
  const [isModal, setisModal] = useState(false);
  const closeModalg = () => {
    setmodalChk(false);
    setisModal(false);
    setmodalHeight(0);
  };

  let loader = store.User.ctripsLoader;

  useEffect(() => {
    return () => {
      store.User.seteditTrip(false);
      store.User.seteditTripObj(false);
    };
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

  // useEffect(() => {
  //   let ar = [...store.Filters.activity];

  //   let aa = [];
  //   if (ar.length > 0) {
  //     ar.map((e, i, a) => {
  //       const obj = {name: e.name, added: false};
  //       aa.push(obj);
  //     });
  //   }

  //   setactvtyList(aa);
  // }, [store.Filters.activity]);

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
  useEffect(() => {
    if (isEdit == true) {
      let d = editTrip.data;
      let index = editTrip.index;

      let tt = findItm(d.tradeType || '', trptypeData, 'n');
      let loc = d.location ? d.location : {};
      if (!isObjectEmpty(loc)) {
        setcity(loc.city);
        setState(findItm(loc.state || '', stateData, 'n'));
      } else {
        setcity('');
        setState('');
        setlocation(false);
      }
      let spcs = findItm(d.species || '', spcsDt, 'n');
      let sd = d.availableFrom;
      let ed = d.availableTo;
      let acceptOtherTrades = d.acceptTradeOffers;
      let durNo = d.duration.value;
      let durt = findItm(d.duration.title || '', durtn, 't');
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
      if (sd >= moment().format('YYYY-MM-DD')) {
        setmindd(undefined);
      } else {
        setmindd(sd);
      }
      var daylist = getDaysArray(new Date(sd), new Date(ed));
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

      settitle(d.title || '');
      settripType(tt);
      setlocation(loc);
      setspecies(spcs);
      setReturn(d.returnActivity);
      setacceptOther(acceptOtherTrades);
      setdurNum(durNo);
      setdur(durt);
      setPhotos(d.photos || []);
      setisSelDate1(sd);
      setisSelDate2(ed);
      setisSelDate(true);
      setmind(sd);
      setmarkedDates(mdd);
      setselDates(mdd);
      setisSetUnavailable(objct);
      setstatus(d.status);
    }
  }, [isEdit]);

  useEffect(() => {
    if (city != '' && State != '') {
      setlocation({city: city, state: State.name});
    } else {
      setlocation(false);
    }
  }, [city, State]);

  useEffect(() => {
    if (
      isSelDate1 != '' &&
      isSelDate2 != '' &&
      Return != '' &&
      durNum != '' &&
      tripType != '' &&
      species != '' &&
      location != false
    ) {
      setisButtonDisable(false);
    } else {
      setisButtonDisable(true);
    }
  }, [tripType, location, species, isSelDate1, isSelDate2, Return, durNum]);

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
    setunavlblmarkedDates({});
    setunavlblSLCTmarkedDates({});
    setselunmarkedSLCTDates({});
    setisDisableToday2(false);
    if (c == 'all') {
      settrader('');
      setReturn('');
      setdurNum(1);
      setrdurNum(1);
      setdur(durtn[0]);
      setrdur(rdurtn[0]);
      setacceptOther(false);
      setisAddPhotoModal(false);
      setisSetUnavailable(false);
      setPhotos([]);
      setpvm(false);
      setsi('');
      setdeleteModal(false);
      setdeletePObj(false);
      setisButtonDisable(false);

      setstatus('active');
      settripType('');
      setmind(undefined);
      setmindd(undefined);
      setmaxd(undefined);
      setlocation(false);
      settripType('');
      setcity('');
      setState('');
      setspecies('');
      settitle('');
      // setactvtyList([]);
      // setactvtyListS([]);
      if (c2 != 'nill') {
        store.User.seteditTrip(false);
        store.User.seteditTripObj(false);
      } else {
        store.User.seteditTrip(true);
      }
    }
  };

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
    if (rdurNum == '') {
      setunavlblmarkedDates({});
      return;
    }

    let ar = [];
    if (dow.length > 0) {
      dow.map((e, i, a) => {
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
        var current = start.clone();
        while (current.day(7 + day).isBefore(end)) {
          result.push(current.clone());
        }
        if (result.length > 0) {
          result.map((e, i, a) => {
            let d = e.format('YYYY-MM-DD');
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
  }, [dow, endRepOn, rdurNum]);

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
    if (ischk == 'endrepeat' && isShowUnavliabledaysCal) {
    }
  }, [isShowUnavliabledaysCal, ischk]);

  const onClickCal = () => {
    setshowCalender(!showCalender);
  };

  const onClickUnavailableDays = () => {
    // if (!isObjectEmpty(selDates)) {
    if (isSelDate1 != '' && isSelDate2 != '') {
      if (isSetUnavailable) {
        let d = isSetUnavailable;
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
      }

      setisShowUnavliableModal(true);
    } else {
      Alert.alert('', 'Please select Trip Availability first');
    }
  };

  const onClickrCal = c => {
    setischk(c);
    setisShowUnavliabledaysCal(!isShowUnavliabledaysCal);
  };

  const onclickImage = c => {
    Keyboard.dismiss();

    if (c == 'photoV') {
      return;
    }

    MultipleImage(c);
  };

  const openDeleteModal = obj => {
    setdeletePObj(obj);
    setdeleteModal(true);
  };

  const closeDeleteModal = () => {
    setdeletePObj(false);
    setdeleteModal(false);
  };

  const deletePhoto = () => {
    let p = photos.slice();

    p.splice(deletePObj.i, 1);

    setPhotos(p);
    closeDeleteModal();
  };

  const MultipleImage = async chk => {
    let apiLevel = store.General.apiLevel;
    Keyboard.dismiss();
    closeAllDropDown();
    setisShowPrmsn(false);
    setisAddPhotoModal(false);
    let d = photos.length;
    let max = maxPhotos;
    let msg = 'You can upload only ' + max + ' images';
    if (d == max) {
      Alert.alert('', msg);
      return;
    }
    let maxPhotos = 6 - photos.length;
    try {
      let options = {
        mediaType: 'image',
        isPreview: false,
        maxSelectedAssets: maxPhotos,
      };
      const res = await MultipleImagePicker.openPicker(options);
      if (res) {
        console.log('mutipicker image res true  ');
        let data = photos.slice();
        let ar = data;

        if (data.length > 0) {
          res.map((e, i, a) => {
            let uri = e.path;
            let fileName = e.fileName;
            let type = e.mime;
            if (Platform.OS == 'android' && apiLevel < 29) {
              uri = 'file://' + uri;
            }

            ImageCompressor.compress(uri, {
              compressionMethod: 'auto',
            })
              .then(async res => {
                let imageObject = {uri: res, fileName, type};
                console.log('Compress image  : ', imageObject);
                let isAlreadySelectimage = data.find(
                  x => x.fileName == fileName,
                )
                  ? true
                  : false;

                if (chk == 'photo' && !isAlreadySelectimage) {
                  ar.push(imageObject);
                }

                if (i == a.length - 1) {
                  setPhotos(ar);
                  setisAddPhotoModal(false);
                }
              })
              .catch(err => {
                console.log('Image compress error : ', err);
              });
          });
        } else {
          res.map((e, i, a) => {
            let uri = e.path;
            let fileName = e.fileName;
            let type = e.mime;
            if (Platform.OS == 'android' && apiLevel < 29) {
              uri = 'file://' + uri;
            }
            ImageCompressor.compress(uri, {
              compressionMethod: 'auto',
            })
              .then(async res => {
                let imageObject = {uri: res, fileName, type};
                console.log('Compress image  : ', imageObject);
                if (chk == 'photo') {
                  ar.push(imageObject);
                }
                if (i == a.length - 1) {
                  setPhotos(ar);
                  setisAddPhotoModal(false);
                }
              })
              .catch(err => {
                console.log('Image compress error : ', err);
              });
          });
        }
      }
    } catch (error) {
      console.log('multi photo picker error : ', error);
    }
  };

  const closeAllDropDown = () => {
    setisDropDownDur(false);
    setisDropDownrDur(false);
    setisDropDownTT(false);
    setisDropDownState(false);
    setisDropDownSpcs(false);
  };

  const photoClick = i => {
    setsi(i);
    setpvm(true);
  };

  const closeReviewModal = c => {
    if (!loader) {
      setmodalHeight(0);
      if (isTripCreate) {
        clearFields('all', c);
      }
      setisReviewTrip(false);
      setisTripCreate(false);
    }
  };

  const setIsTripCreatSuc = v => {
    setisTripCreate(v);
    store.User.setphotosrfrsh(true);
  };

  const CreateTrip = () => {
    Keyboard.dismiss();

    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        let title = dt + ' ' + species.name;
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

        let dt = '';
        let dtitle = dur.title;
        if (durNum <= 1) {
          dtitle = dur.title.substring(0, dur.title.length - 1);
        }
        dt = durNum + ' ' + dtitle;

        const obj = {
          hostId: store.User.user._id,
          tradeType: tripType.name,
          species: species.name,
          returnActivity: Return,
          title: title,
          acceptTradeOffers: acceptOther,
          duration: {
            value: durNum,
            title: dur.title,
          },
          availableFrom: isSelDate1,
          availableTo: isSelDate2,
          status: status,
          photos: photos,
          unAvailableDays: objct,
          location: location == false ? {} : location,
        };
        if (objct == false) {
          delete obj.unAvailableDays;
        }

        store.User.setctripLoader(true);
        if (photos.length <= 0) {
          store.User.attemptToCreateTrip(obj, setIsTripCreatSuc);
        } else {
          store.User.attemptToCreateTripUploadImage(obj, setIsTripCreatSuc);
        }
      } else {
        // seterrorMessage('Please connect internet');
        Alert.alert('', 'Please connect internet');
      }
    });
  };

  const UpdateTrip = () => {
    Keyboard.dismiss();

    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        let dt = '';
        let dtitle = dur.title;
        if (durNum <= 1) {
          dtitle = dur.title.substring(0, dur.title.length - 1);
        }
        dt = durNum + ' ' + dtitle;
        let title = dt + ' ' + species.name;

        let pht = [...photos];
        let p = [];
        let p2 = [];
        if (pht.length > 0) {
          pht.map((e, i, a) => {
            if (e.uri) {
              p2.push(e);
            } else {
              p.push(e);
            }
          });
        }
        let isSetUn = isSetUnavailable != false ? isSetUnavailable : {};
        let objct = isSetUn != false ? {...isSetUn} : false;
        if (objct && !isObjectEmpty(objct)) {
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

        const obj = {
          hostId: store.User.user._id,
          tradeType: tripType.name,
          species: species.name,
          returnActivity: Return,
          title: title,
          acceptTradeOffers: acceptOther,
          duration: {
            value: durNum,
            title: dur.title,
          },
          availableFrom: isSelDate1,
          availableTo: isSelDate2,
          status: status,
          photos: photos,
          unAvailableDays: objct,
          location: location == false ? {} : location,
        };
        if (objct == false) {
          delete obj.unAvailableDays;
        }

        store.User.setctripLoader(true);
        if (p2.length > 0) {
          store.User.attemptToUpdateTripUploadImage(
            obj,
            p2,
            editTrip.data._id,
            editTrip.index,
            setIsTripCreatSuc,
          );
        } else {
          store.User.attemptToUpdateTrip(
            obj,
            editTrip.data._id,
            editTrip.index,
            setIsTripCreatSuc,
          );
        }
      } else {
        // seterrorMessage('Please connect internet');
        Alert.alert('', 'Please connect internet');
      }
    });
  };

  const goToProfile = () => {
    closeModalg();
    props.navigation.navigate('MyProfile');
  };

  const SuspendTrip = () => {
    Keyboard.dismiss();

    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        const obj = {
          status: 'suspended',
        };
        store.User.setctripLoader(true);
        console.warn('update trip obj : ', obj);
        store.User.attemptToUpdateTrip(
          obj,
          editTrip.data._id,
          editTrip.index,
          goToProfile,
        );
      } else {
        // seterrorMessage('Please connect internet');
        Alert.alert('', 'Please connect internet');
      }
    });
  };

  const ActivateTrip = () => {
    Keyboard.dismiss();

    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        const obj = {
          status: 'active',
        };
        store.User.setctripLoader(true);
        console.warn('update trip obj : ', obj);
        store.User.attemptToUpdateTrip(
          obj,
          editTrip.data._id,
          editTrip.index,
          goToProfile,
        );
      } else {
        // seterrorMessage('Please connect internet');
        Alert.alert('', 'Please connect internet');
      }
    });
  };

  const DeleteTrip = () => {
    Keyboard.dismiss();

    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        store.User.setctripLoader(true);

        store.User.attemptToDeleteTrip(
          {},
          editTrip.data._id,
          editTrip.index,
          goToProfile,
        );
      } else {
        // seterrorMessage('Please connect internet');
        Alert.alert('', 'Please connect internet');
      }
    });

    // NetInfo.fetch().then(state => {
    //   // if (state.isConnected) {
    //   //   // const obj = {
    //   //   //   _id: (Math.random() * 10).toFixed(0),
    //   //   //   title: title,
    //   //   //   user: store.User.user._id,
    //   //   //   offer: trade,
    //   //   //   return: Return,
    //   //   //   loc: {
    //   //   //     name: 'Miami, Florida',
    //   //   //     coords: [],
    //   //   //   },
    //   //   //   status: 'activate',
    //   //   //   acceptOtherTrades: acceptOther,
    //   //   //   duration: {
    //   //   //     number: durNum,
    //   //   //     title: dur.title,
    //   //   //   },
    //   //   //   availablity: {
    //   //   //     startDate: isSelDate1,
    //   //   //     endDate: isSelDate2,
    //   //   //   },
    //   //   //   photos: photos,
    //   //   //   unavailable: isSetUnavailable != false ? isSetUnavailable : {},
    //   //   // };
    //   //   let index = editTrip.index;
    //   //   // console.warn('update trip obj : ', obj);
    // store.Trips.attemptToDeleteTrip({}, index, goToProfile);
    //   // } else {
    //   //   // seterrorMessage('Please connect internet');
    //   //   Alert.alert('', 'Please connect internet');
    //   // }
    //   closeModalg();
    // });
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

    // const getSelectedDayEvents = date => {
    //   if (isObjectEmpty(markedDates)) {
    //     let markedDates = {};
    //     markedDates[date] = {
    //       startingDay: true,
    //       color: seDayColor,
    //       textColor: 'white',
    //       disabled: false,
    //       disableTouchEvent: false,
    //     };
    //     setmarkedDates(markedDates);
    //     return;
    //   } else {
    //     let md = {...markedDates};
    //     const size = Object.keys(md).length;
    //     let o = md[date];

    //     if (o !== undefined) {
    //       console.warn('The key exists.');

    //       if (size < 2) {
    //         delete md[date];
    //         setmarkedDates(md);
    //         return;
    //       } else {
    //         let c1 = Object.keys(md)[0];
    //         let c2 = Object.keys(md)[size - 1];

    //         let m = {};
    //         if (c1 < date) {
    //           m[c1] = {
    //             startingDay: true,
    //             color: seDayColor,
    //             textColor: 'white',
    //             disabled: false,
    //             disableTouchEvent: false,
    //           };
    //         } else {
    //           m[c2] = {
    //             endingDay: true,
    //             color: seDayColor,
    //             textColor: 'white',
    //             disabled: false,
    //             disableTouchEvent: false,
    //           };
    //         }
    //         setmarkedDates(m);
    //         return;
    //       }
    //     } else {
    //       console.warn('The key does not exist.');
    //       let md = {...markedDates};
    //       if (size >= 2) {
    //         return;
    //       }

    //       let pd1 = Object.keys(md)[0];
    //       let pd2 = date;
    //       let mid = '';
    //       let mxd = '';
    //       if (pd1 > pd2) {
    //         mxd = pd1;
    //         mid = date;
    //       } else {
    //         mxd = date;
    //         mid = pd1;
    //       }
    //       const a = moment(mxd);
    //       const b = moment(mid);
    //       const no_of_days = a.diff(b, 'days');
    //       console.error('nod : ', no_of_days);
    //       let totaldays = 0;
    //       let t = dur.title;
    //       if (t == 'days') {
    //         totaldays = durNum;
    //       } else if (t == 'weeks') {
    //         totaldays = durNum * 7;
    //       } else if (t == 'months') {
    //         totaldays = durNum * 30;
    //       } else if (t == 'years') {
    //         totaldays = durNum * 365;
    //       }
    //       if (no_of_days < totaldays) {
    //         Alert.alert(
    //           '',
    //           'Date range must be greater or equal than trip duration',
    //         );
    //         return;
    //       }

    //       var daylist = getDaysArray(new Date(mid), new Date(mxd));
    //       let mdd = {};
    //       if (daylist.length > 0) {
    //         daylist.map((e, i, a) => {
    //           let d = moment(e).format('YYYY-MM-DD');
    //           if (i == 0) {
    //             mdd[d] = {
    //               startingDay: true,
    //               color: seDayColor,
    //               textColor: 'white',
    //               disabled: false,
    //               disableTouchEvent: false,
    //             };
    //           }
    //           if (i > 0 && i < a.length - 1) {
    //             mdd[d] = {
    //               color: ocolor,
    //               textColor: 'white',
    //               disabled: true,
    //               disableTouchEvent: true,
    //             };
    //           }
    //           if (i == a.length - 1) {
    //             mdd[d] = {
    //               endingDay: true,
    //               color: seDayColor,
    //               textColor: 'white',
    //               disabled: false,
    //               disableTouchEvent: false,
    //             };
    //           }
    //         });
    //       }

    //       setmarkedDates(mdd);
    //       return;
    //     }
    //   }
    // };

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
      <MModal visible={showCalender} transparent onRequestClose={closeCalModal}>
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
              disableAllTouchEventsForDisabledDays={false}
              disableAllTouchEventsForInactiveDays={false}
              markingType="custom"
              // markingType="period"
              markedDates={{...td, ...markedDates}}
            />
            {renderBottom()}
          </View>
        </SafeAreaView>
      </MModal>
    );
  };

  const renderUNavlblModal = () => {
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

    const closeModal = () => {
      setisShowUnavliableModal(false);
      setmodalHeight(0);
      if (!isSetUnavailable) {
        setdow(dw);
        setrdur(rdurtn[0]);
        setrdurNum(1);
        siERpOn(isSelDate2);
        setunavlblmarkedDates({});
        setselunmarkedSLCTDates({});
        setunavlblSLCTmarkedDates({});
      }
    };

    const ApplyModal = () => {
      let doweeks = dow.slice();

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
      }

      let obj = false;
      if (dw.length > 0 || ad.length > 0) {
        obj = {
          days_of_week: dw, //main
          repeat_every: {
            //main
            num: rdurNum,
            title: rdur.title.toLowerCase(),
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

    const renderHeader = () => {
      let text = 'Set Unavailable Days';

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
        const d = dow.map((e, i, a) => {
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
                  let c = dow.slice();
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
                        t == '' ? theme.color.subTitleLight : theme.color.title,
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
              },
            ]}>
            <Text style={[styles.ButtonText, {color: '#30563A'}]}>Back</Text>
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
              {backgroundColor: theme.color.button1},
            ]}>
            <Text style={[styles.ButtonText, {color: theme.color.buttonText}]}>
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
                  alignItems: 'flex-end',
                  backgroundColor: theme.color.background,
                  shadowColor: '#000000',
                  shadowOffset: {width: 0, height: -1}, // change this for more shadow
                  shadowOpacity: 0.1,
                  elevation: 15,
                  borderBottomLeftRadius: 10,
                  borderBottomRightRadius: 10,
                  marginTop: 5,
                }
              : {
                  alignItems: 'flex-end',
                  marginTop: 30,
                }
          }>
          <View
            style={
              c ? styles.rmodalBottomContainer : styles.rmodalBottomContainer2
            }>
            {renderButton1()}
            {renderButton2()}
          </View>
        </View>
      );
    };

    return (
      <MModal
        visible={isShowUnavliableModal}
        transparent
        onRequestClose={closeModal}>
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
                    {renderWeek()}
                    {renderRepeat()}
                    {renderOtherDates()}
                  </ScrollView>
                  {renderBottom()}
                </>
              )}

              {!c && (
                <>
                  {renderHeader()}
                  {renderTitle()}
                  {renderWeek()}
                  {renderRepeat()}
                  {renderOtherDates()}
                  {renderBottom()}
                </>
              )}
            </View>
          </View>
        </SafeAreaView>
      </MModal>
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
      <MModal
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
      </MModal>
    );
  };

  const renderAddPhotoModal = () => {
    const reqPermission = async () => {
      if (Platform.OS == 'android') {
        try {
          const reqPer = await PermissionsAndroid.request(
            PERMISSIONS.ANDROID.CAMERA,
          );

          if (reqPer == 'never_ask_again') {
            let title = 'Camera Permission Blocked';
            let text = 'Please allow grant permission to acces camera';

            Alert.alert(title, text, [
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {
                text: 'Open Settings',
                onPress: () => {
                  IntentLauncher.startActivity({
                    action: 'android.settings.APPLICATION_DETAILS_SETTINGS',
                    data: 'package:' + store.General.package,
                  });
                },
              },
            ]);

            return;
          }

          if (reqPer == 'granted') {
            const reqPer2 = await PermissionsAndroid.request(
              PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
            );

            if (reqPer2 == 'never_ask_again') {
              let title = 'Storage Permission Blocked';
              let text =
                'Please allow grant permission to acces photos in storage';

              Alert.alert(title, text, [
                {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {
                  text: 'Open Settings',
                  onPress: () => {
                    IntentLauncher.startActivity({
                      action: 'android.settings.APPLICATION_DETAILS_SETTINGS',
                      data: 'package:' + store.General.package,
                    });
                  },
                },
              ]);
              return;
            }

            if (reqPer2 == 'granted') {
              onclickImage(DT);
            }
          }
        } catch (error) {
          console.log('req permsiion error : ', error);
        }
      }

      if (Platform.OS == 'ios') {
        const pc = await check(PERMISSIONS.IOS.CAMERA);
        const pp = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);

        if (pc == 'blocked' || pp == 'blocked') {
          let title =
            pc == 'blocked'
              ? 'Camera Permission Blocked'
              : 'Photo Permission Blocked';
          let text =
            pc == 'blocked'
              ? 'Please allow grant permission to acces camera'
              : 'Please allow grant permission to acces all photos';
          Alert.alert(title, text, [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: 'Open Settings',
              onPress: () => {
                Linking.openURL('app-settings:');
              },
            },
          ]);
          return;
        }

        if (pp == 'limited') {
          let title = 'Photo Permission Limited';
          let text = 'Please allow grant permission to select all photos';
          Alert.alert(title, text, [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: 'Open Settings',
              onPress: () => {
                Linking.openURL('app-settings:');
                //react-native-permissions // openSettings('App-Prefs:root=Photos');
              },
            },
          ]);
          return;
        }

        try {
          const reqPer = await request(PERMISSIONS.IOS.CAMERA);
          if (reqPer == 'granted') {
            const reqPer2 = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
            if (reqPer2 == 'granted') {
              onclickImage(DT);
            }
          }
        } catch (error) {
          console.log('req permsiion error : ', error);
        }
      }
    };

    const checkPermsn = async (c, dt) => {
      if (Platform.OS == 'android') {
        const permissionAndroid = await check(PERMISSIONS.ANDROID.CAMERA);
        const permissionAndroid2 = await check(
          PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        );
        setDT(dt);

        if (permissionAndroid != 'granted' || permissionAndroid2 != 'granted') {
          setisShowPrmsn(true);
          setprmsnChk(c);
        } else {
          onclickImage(dt);
        }
      }

      if (Platform.OS == 'ios') {
        try {
          const permissionIos = await check(PERMISSIONS.IOS.CAMERA);
          const permissionIos2 = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);
          setDT(dt);

          if (permissionIos != 'granted' || permissionIos2 != 'granted') {
            setisShowPrmsn(true);
            setprmsnChk(c);
            // if (c == 'camera') {
            //   setisShowGalleryPrmsn(false);
            //   setisShowCameraPrmsn(true);
            // } else {
            //   setisShowCameraPrmsn(false);
            //   setisShowGalleryPrmsn(true);
            // }
          } else {
            onclickImage(dt);
          }
        } catch (error) {
          console.warn('Permsiion error : ', error);
        }
      }
    };

    const closeAddPhotoModal = () => {
      if (!isShowPrmsn) {
        setisAddPhotoModal(false);
      } else {
        setisShowPrmsn(false);
      }
    };

    const renderCross = () => {
      return (
        <Pressable
          style={({pressed}) => [
            {opacity: pressed ? 0.7 : 1.0},
            {position: 'absolute', top: 15, right: 15},
          ]}
          onPress={closeAddPhotoModal}>
          <utils.vectorIcon.Ionicons
            name="ios-close-outline"
            color={theme.color.title}
            size={32}
          />
        </Pressable>
      );
    };

    const renderHeader = () => {
      return (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={require('../../assets/images/add_trip_photosb/img.png')}
            style={{
              width: 73,
              height: 63,
              resizeMode: 'contain',
              marginBottom: 10,
            }}
          />
          <Text style={[styles.fieldText2, {fontSize: 20}]}>
            Add Trip Photos
          </Text>
          <Text
            style={[
              styles.fieldText2,
              {fontSize: 13, fontFamily: theme.fonts.fontNormal},
            ]}>
            (up to {maxPhotos} photos)
          </Text>
        </View>
      );
    };

    const renderSelection = () => {
      return (
        <View style={styles.uploadIndication}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              checkPermsn('gallery', 'photo');
            }}>
            <Image
              source={require('../../assets/images/uploadphotog/img.png')}
              style={[styles.uploadIndicationLogo, {marginRight: 20}]}
            />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              checkPermsn('camera', 'photo');
            }}>
            <Image
              source={require('../../assets/images/takephotog/img.png')}
              style={styles.uploadIndicationLogo}
            />
          </TouchableOpacity>
        </View>
      );
    };
    const renderTip = () => {
      return (
        <View
          style={{
            width: '95%',
            flexDirection: 'row',
            alignSelf: 'center',
            marginTop: 10,
          }}>
          <Text
            style={{
              fontSize: 13,
              fontFamily: theme.fonts.fontNormal,
              color: theme.color.subTitle,
            }}>
            Tip:
          </Text>

          <View style={{width: '92%', marginLeft: 5}}>
            <Text
              style={{
                fontSize: 13,
                fontFamily: theme.fonts.fontNormal,
                color: theme.color.subTitle,
              }}>
              Use photos that are clear and relevant to your trip to attract
              more offers.
            </Text>
          </View>
        </View>
      );
    };

    const renderButtonPermission = () => {
      return (
        <View
          style={{
            marginTop: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            onPress={reqPermission}
            activeOpacity={0.7}
            style={styles.BottomButtonP}>
            <Text style={styles.buttonPTextBottom}>Yes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setisShowPrmsn(false);
            }}
            activeOpacity={0.7}
            style={styles.BottomButtonP}>
            <Text style={styles.buttonPTextBottom}>No</Text>
          </TouchableOpacity>
        </View>
      );
    };

    function Sep() {
      return <View style={{height: 25}} />;
    }

    return (
      <MModal
        visible={isAddPhotoModal}
        transparent
        onRequestClose={closeAddPhotoModal}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={[styles.modalContainer2, {margin: 20}]}>
            <View
              style={[
                styles.modal,
                {
                  paddingVertical: 25,
                  paddingHorizontal: 20,
                  borderRadius: 15,
                },
              ]}>
              {!isShowPrmsn && (
                <>
                  {renderHeader()}
                  <Sep />
                  {renderSelection()}
                  <Sep />
                  {renderTip()}
                </>
              )}
              {isShowPrmsn && (
                <>
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text style={styles.section2Title1}>
                      {prmsnChk == 'camera'
                        ? 'Camera Access'
                        : 'Storage Access'}
                    </Text>

                    <Image
                      source={
                        prmsnChk == 'camera'
                          ? require('../../assets/images/ca/img.png')
                          : require('../../assets/images/ca/img.png')
                      }
                      style={styles.section2Logo}
                    />

                    <View style={{width: '80%', alignSelf: 'center'}}>
                      <Text
                        style={[
                          styles.section2LogoTitle,
                          {
                            textAlign: 'center',
                          },
                        ]}>
                        {prmsnChk == 'camera'
                          ? 'Trip Trader wants permission to access your camera.'
                          : 'Trip Trader wants permission to access your storage.'}
                      </Text>
                    </View>

                    <Text style={styles.section2LogoTitlee}>Grant access?</Text>
                  </View>

                  {renderButtonPermission()}
                </>
              )}
              {renderCross()}
            </View>
          </View>
        </SafeAreaView>
      </MModal>
    );
  };

  const renderDeleteModal = () => {
    const renderCross = () => {
      return (
        <Pressable
          style={({pressed}) => [
            {opacity: pressed ? 0.7 : 1.0},
            styles.modalCross,
          ]}
          onPress={closeDeleteModal}>
          <utils.vectorIcon.Ionicons
            name="ios-close-outline"
            color={theme.color.title}
            size={32}
          />
        </Pressable>
      );
    };

    const renderTitle = () => {
      return <Text style={styles.dmodalTitle}>delete photo?</Text>;
    };

    const renderImage = () => {
      return (
        <View style={styles.dmodalImgContainer}>
          <Image style={styles.dmodalImg} source={{uri: deletePObj.uri}} />
        </View>
      );
    };

    const renderBottom = () => {
      const renderTitle = () => {
        return (
          <Text style={styles.dmodalBottomTitle}>
            This action cannot be undone.
          </Text>
        );
      };

      const renderButton1 = () => {
        return (
          <Pressable
            style={({pressed}) => [
              {opacity: pressed ? 0.7 : 1.0},
              styles.dButtonContainer,
            ]}
            onPress={deletePhoto}>
            <Text style={styles.dButtonText}>Yes, delete photo</Text>
          </Pressable>
        );
      };

      const renderButton2 = () => {
        return (
          <Pressable
            style={({pressed}) => [
              {opacity: pressed ? 0.7 : 1.0},
              styles.dButtonContainer,
              {backgroundColor: theme.color.button2},
            ]}
            onPress={closeDeleteModal}>
            <Text style={[styles.dButtonText, {color: theme.color.subTitle}]}>
              No, keep it
            </Text>
          </Pressable>
        );
      };

      return (
        <View style={styles.dmodalBottomContainer}>
          {renderTitle()}
          {renderButton1()}
          {renderButton2()}
        </View>
      );
    };

    return (
      <MModal
        visible={deleteModal}
        transparent
        onRequestClose={closeDeleteModal}>
        <View style={styles.modalContainer}>
          <View style={styles.dmodal}>
            {renderTitle()}
            {renderCross()}
            {renderImage()}
            {renderBottom()}
          </View>
        </View>
      </MModal>
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

    let abs = Platform.OS == 'ios' ? false : true;
    return (
      <utils.DropDown
        // search={true}
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

  const renderSec1 = () => {
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
      <View style={styles.Sec}>
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldText}>I want to trade a...</Text>
          {/* trip type */}
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
                  {tripType == '' ? 'Select Activity' : tripType.name + ' Trip'}
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

        <View style={[styles.fieldContainer, {marginTop: 17}]}>
          <Text style={styles.fieldText}>Located in...</Text>

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

        <View style={[styles.fieldContainer, {marginTop: 17}]}>
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

        <View style={[styles.fieldContainer, {marginTop: 17}]}>
          <Text style={styles.fieldText}>In return for...</Text>
          <View style={styles.inputConatiner}>
            <TextInput
              value={Return}
              onChangeText={d => {
                setReturn(d);
              }}
              placeholder="Example: Florida Alligator Hunt"
              style={styles.input}
            />
          </View>
        </View>

        <View
          style={[
            styles.fieldContainer,
            {marginTop: 12, flexDirection: 'row', alignItems: 'center'},
          ]}>
          <TouchableOpacity
            style={{
              width: 20,
              height: 20,
              borderRadius: 4,
              backgroundColor: !acceptOther ? 'white' : theme.color.button1,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: theme.color.fieldBorder,
            }}
            activeOpacity={0.5}
            onPress={() => setacceptOther(!acceptOther)}>
            {acceptOther && (
              <utils.vectorIcon.FontAwesome5
                name={'check'}
                color={theme.color.buttonText}
                size={11}
              />
            )}
          </TouchableOpacity>
          <Text style={styles.Field2Title}>Accept other trade offers</Text>
        </View>

        {/* activites select */}
        {/* <View style={[styles.fieldContainer, {marginTop: 17}]}>
          <Text style={styles.fieldText}>Activities</Text>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.inputConatiner,
              {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              },
            ]}
            onPress={() => {
              setModalVisible(true);
              Keyboard.dismiss();
              closeAllDropDown();
            }}>
            <Image style={styles.dropDownIcon} source={actSrc} />
            <View style={{width: '80%'}}>
              <Text
                style={[
                  styles.BodyTitle,
                  {
                    color:
                      actvtyListS.length > 1
                        ? theme.color.title
                        : theme.color.subTitleLight,
                  },
                ]}>
                {actvtyListS.length > 1
                  ? actvtyListS.length + ' activites selected'
                  : 'Select activites'}
              </Text>
            </View>

            <utils.vectorIcon.MaterialIcons
              name="keyboard-arrow-right"
              size={22}
              color={theme.color.subTitle}
            />
          </TouchableOpacity>
        </View> */}

        <View style={[styles.fieldContainer, {marginTop: 17}]}>
          <Text style={styles.fieldText}>Trip Duration</Text>
          <View
            style={[
              styles.fieldContainer,
              {marginTop: 5, flexDirection: 'row'},
            ]}>
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
                    style={[styles.dropDownText]}>
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

        <View style={[styles.fieldContainer, {marginTop: 17}]}>
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
              {t == '' ? 'Select a date range' : t}
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
          <View style={[styles.fieldContainer, {marginTop: 17}]}>
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
                marginTop: 17,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text style={styles.fieldText}>Unavailable Days</Text>
              <TouchableOpacity
                activeOpacity={0.8}
                style={{marginLeft: 15}}
                onPress={onClickUnavailableDays}>
                <Text style={[styles.bottomText, {fontSize: 14}]}>Edit</Text>
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
      </View>
    );
  };

  const renderSec2 = () => {
    const renderShowPhotos = () => {
      let p = photos.map((e, i, a) => {
        let uri = e.uri ? e.uri : e;
        let c = e.uri ? true : false;
        const renderPhotoCross = () => {
          return (
            <Pressable
              style={({pressed}) => [
                {opacity: pressed ? 0.7 : 1.0},
                styles.crossContainer,
              ]}
              onPress={() => openDeleteModal({uri: e.uri ? e.uri : e, i: i})}>
              <Image
                source={require('../../assets/images/cross/img.png')}
                style={{width: 9, height: 9, resizeMode: 'contain'}}
              />
            </Pressable>
          );
        };
        return (
          <>
            {a.length == maxPhotos && (
              <Pressable
                onPress={() => photoClick(i)}
                style={({pressed}) => [
                  {opacity: pressed ? 0.9 : 1.0},
                  [styles.addImgContainer, {marginTop: 15}],
                ]}>
                {!c && (
                  <ProgressiveFastImage
                    style={styles.addImg}
                    source={{uri: uri}}
                    loadingImageStyle={styles.imageLoader}
                    loadingSource={require('../../assets/images/imgLoad/img.jpeg')}
                    blurRadius={3}
                  />
                )}
                {c && <Image style={styles.addImg} source={{uri: uri}} />}

                {renderPhotoCross()}
              </Pressable>
            )}

            {a.length < maxPhotos && (
              <>
                <Pressable
                  onPress={() => photoClick(i)}
                  style={({pressed}) => [
                    {opacity: pressed ? 0.9 : 1.0},
                    [styles.addImgContainer, {marginTop: 15}],
                  ]}>
                  {!c && (
                    <ProgressiveFastImage
                      style={styles.addImg}
                      source={{uri: uri}}
                      loadingImageStyle={styles.imageLoader}
                      loadingSource={require('../../assets/images/imgLoad/img.jpeg')}
                      blurRadius={3}
                    />
                  )}
                  {c && <Image style={styles.addImg} source={{uri: uri}} />}
                  {renderPhotoCross()}
                </Pressable>

                {i == a.length - 1 && (
                  <Pressable
                    onPress={() => {
                      setisAddPhotoModal(true);
                    }}
                    style={({pressed}) => [
                      {opacity: pressed ? 0.8 : 1.0},
                      [
                        styles.addImgContainer,
                        {
                          marginTop: 15,
                          borderStyle: 'dashed',
                          borderColor: theme.color.button1,
                          backgroundColor: '#F2F3F1',
                          alignItems: 'center',
                          justifyContent: 'center',
                        },
                      ],
                    ]}>
                    <utils.vectorIcon.Feather
                      name="plus"
                      color={theme.color.button1}
                      size={24}
                    />
                  </Pressable>
                )}
              </>
            )}
          </>
        );
      });

      return p;
    };

    return (
      <View style={[styles.Sec, {marginTop: 15}]}>
        <View
          style={[
            styles.fieldContainer,
            {flexDirection: 'row', alignItems: 'center'},
          ]}>
          <Image
            source={require('../../assets/images/add_trip_photos/img.png')}
            style={{
              width: 30,
              height: 30,
              resizeMode: 'contain',
              marginRight: 10,
            }}
          />
          <Text style={styles.fieldText2}>
            Trip Photos{' '}
            <Text
              style={[styles.fieldText2, {fontFamily: theme.fonts.fontNormal}]}>
              (optional)
            </Text>
          </Text>
        </View>

        <View style={[styles.fieldContainer, {marginTop: 15}]}>
          <Text style={styles.fieldText22}>
            Add pictures that showcase this trip to help members get a better
            idea of what to expect.
          </Text>
        </View>

        <View style={styles.fieldContainer}>
          {photos.length <= 0 && (
            <TouchableOpacity
              onPress={() => setisAddPhotoModal(true)}
              activeOpacity={0.7}
              style={{
                width: '100%',
                marginTop: 15,
                borderRadius: 8,
                borderWidth: 2,
                borderStyle: 'dashed',
                borderColor: theme.color.button1,
                alignItems: 'center',
                justifyContent: 'center',
                padding: 10,
                height: 57,
                backgroundColor: '#F2F3F1',
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  source={require('../../assets/images/add_photo/img.png')}
                  style={{
                    width: 24,
                    height: 24,
                    resizeMode: 'contain',
                    marginRight: 10,
                  }}
                />

                <Text
                  style={[
                    styles.fieldText2,
                    {
                      fontFamily: theme.fonts.fontBold,
                      fontSize: 14,
                      color: theme.color.button1,
                    },
                  ]}>
                  Add Photos
                </Text>
              </View>
            </TouchableOpacity>
          )}
          {photos.length > 0 && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                flexShrink: 1,
                flexWrap: 'wrap',
              }}>
              {renderShowPhotos()}
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderSec3 = () => {
    let bc = {
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8,
      paddingVertical: 12,
      width: '47%',
    };
    let dt = editTrip.data || [];
    let status = '';
    let ch = false;
    if (dt) {
      status = dt.status;
      ch = status == 'suspended' ? true : false;
    }

    return (
      <View
        style={[
          styles.Sec,
          {
            marginTop: 15,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          },
        ]}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            setmodalChk(!ch ? 'suspend' : 'activate');
            setisModal(true);
          }}
          style={[bc, {backgroundColor: theme.color.button2}]}>
          <Text
            style={{
              color: '#30563A',
              fontSize: 13,
              fontFamily: theme.fonts.fontBold,
              textTransform: 'capitalize',
            }}>
            {!ch ? 'Suspend' : 'Activate'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            setmodalChk('delete');
            setisModal(true);
          }}
          style={[bc, {backgroundColor: '#F8ECEC'}]}>
          <Text
            style={{
              color: '#B93B3B',
              fontSize: 13,
              fontFamily: theme.fonts.fontBold,
              textTransform: 'capitalize',
            }}>
            Delete Trip
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderButton = () => {
    return (
      <>
        <TouchableOpacity
          disabled={isButtonDisable}
          onPress={() => {
            setisReviewTrip(true);
          }}
          activeOpacity={0.7}
          style={[styles.BottomButton, {opacity: isButtonDisable ? 0.5 : 1}]}>
          <Text style={styles.buttonTextBottom}>
            {!isEdit ? 'Create Trip' : 'Save Changes'}
          </Text>
        </TouchableOpacity>
      </>
    );
  };

  const renderReviewTripModal = () => {
    let c = modalHeight >= maxModalHeight ? true : false;
    let style = c
      ? [styles.rmodal, {paddingTop: 0, height: maxModalHeight}]
      : styles.rmodal2;

    const renderHeader = () => {
      let text = '';
      if (!isEdit) {
        if (!isTripCreate) {
          text = 'Review Trip Details';
        } else {
          text = 'Trip Created Successfully!';
        }
      }

      if (isEdit) {
        if (!isTripCreate) {
          text = 'Review Trip Details';
        } else {
          text = 'Trip Update Successfully!';
        }
      }

      const renderCross = () => {
        return (
          <Pressable
            disabled={loader}
            style={({pressed}) => [{opacity: pressed ? 0.7 : 1.0}]}
            onPress={closeReviewModal}>
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
          {/* <View style={{width: '80%'}}> */}
          {renderTitle()}
          {/* </View> */}

          {/* {renderCross()} */}
        </View>
      );
    };

    const renderTitle = () => {
      return (
        <View style={{marginTop: 10}}>
          <Text style={styles.rmodalsubTitle}>
            Review your trip details below. If everything looks good, click{' '}
            <Text
              style={[
                styles.rmodalsubTitle,
                {fontFamily: theme.fonts.fontBold},
              ]}>
              {!isEdit ? 'Create Trip' : 'Update Trip'}
            </Text>{' '}
            {!isEdit
              ? 'to make the trip available for trade offers.'
              : 'to update the trip available for trade offers'}
          </Text>
        </View>
      );
    };

    const renderShowPhotos = () => {
      let p = photos.map((e, i, a) => {
        let uri = e.uri ? e.uri : e;
        return (
          <>
            <Pressable
              disabled
              style={({pressed}) => [
                {opacity: pressed ? 0.9 : 1.0},
                [styles.raddImgContainer, {marginTop: 10}],
              ]}>
              <Image style={styles.raddImg} source={{uri: uri}} />
            </Pressable>
          </>
        );
      });

      return p;
    };

    const renderFields = () => {
      let offer = species.name || '';
      let locationName =
        location == false
          ? 'Florida, Miami'
          : location.city + ', ' + location.state;
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
              // numberOfLines={2}
              // ellipsizeMode="tail"
              style={[styles.rTitle2, {color: theme.color.titleGreenForm}]}>
              {offer}
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
              <Text
                // numberOfLines={2}
                // ellipsizeMode="tail"
                style={[styles.rTitle2, {textTransform: 'none'}]}>
                {duration}
              </Text>
            </View>
          </View>

          <View style={styles.rField2}>
            <View style={[styles.rField, {width: '49%'}]}>
              <Text style={styles.rTitle}>TRIP Availability</Text>
              <Text
                // numberOfLines={2}
                // ellipsizeMode="tail"
                style={styles.rTitle2}>
                {availablity}
              </Text>
            </View>

            <View style={[styles.rField, {width: '49%'}]}>
              <Text style={styles.rTitle}>UNAVAILABLE DAYS</Text>
              <Text
                // numberOfLines={4}
                // ellipsizeMode="tail"
                style={[styles.rTitle2, {textTransform: 'none'}]}>
                {unavailable == '' ? 'Null' : unavailable}
              </Text>
            </View>
          </View>

          {photos.length > 0 && (
            <View style={[styles.rField, {marginTop: 20}]}>
              <Text style={styles.rTitle}>TRIP PHOTOS</Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  flexShrink: 1,
                  flexWrap: 'wrap',
                }}>
                {renderShowPhotos()}
              </View>
            </View>
          )}
        </View>
      );
    };

    const renderBottom = () => {
      const renderButton1 = () => {
        return (
          <Pressable
            disabled={loader}
            onPress={closeReviewModal}
            style={({pressed}) => [
              {opacity: pressed ? 0.8 : 1.0},
              styles.ButtonContainer,
              {
                backgroundColor: 'transparent',
                borderWidth: 1,
                borderColor: theme.color.fieldBorder,
                marginRight: 15,
              },
            ]}>
            <Text style={[styles.ButtonText, {color: '#30563A'}]}>Cancel</Text>
          </Pressable>
        );
      };

      const renderButton2 = () => {
        return (
          <Pressable
            disabled={loader}
            onPress={!isEdit ? CreateTrip : UpdateTrip}
            style={({pressed}) => [
              {opacity: pressed ? 0.8 : 1.0},
              styles.ButtonContainer,
              {backgroundColor: theme.color.button1},
            ]}>
            {loader && (
              <ActivityIndicator size={20} color={theme.color.buttonText} />
            )}
            {!loader && (
              <Text
                style={[styles.ButtonText, {color: theme.color.buttonText}]}>
                {!isEdit ? 'Create Trip' : 'Save Changes'}
              </Text>
            )}
          </Pressable>
        );
      };

      return (
        <View
          style={
            c
              ? {
                  alignItems: 'flex-end',
                  backgroundColor: theme.color.background,
                  shadowColor: '#000000',
                  shadowOffset: {width: 0, height: -1}, // change this for more shadow
                  shadowOpacity: 0.1,
                  elevation: 15,
                  borderBottomLeftRadius: 10,
                  borderBottomRightRadius: 10,
                  marginTop: 5,
                }
              : {
                  alignItems: 'flex-end',
                  marginTop: 30,
                }
          }>
          <View
            style={
              c ? styles.rmodalBottomContainer : styles.rmodalBottomContainer2
            }>
            {renderButton1()}
            {renderButton2()}
          </View>
        </View>
      );
    };

    const renderBottom2 = () => {
      const renderButton1 = () => {
        return (
          <Pressable
            onPress={() => {
              closeReviewModal('nill');
            }}
            style={({pressed}) => [
              {opacity: pressed ? 0.8 : 1.0},
              styles.ButtonContainer,
              {
                backgroundColor: 'transparent',
                borderWidth: 1,
                borderColor: theme.color.fieldBorder,
                marginRight: 15,
              },
            ]}>
            <Text style={[styles.ButtonText, {color: '#30563A'}]}>
              Edit Trip
            </Text>
          </Pressable>
        );
      };

      const renderButton11 = () => {
        return (
          <Pressable
            onPress={closeReviewModal}
            style={({pressed}) => [
              {opacity: pressed ? 0.8 : 1.0},
              styles.ButtonContainer,
              {
                backgroundColor: 'transparent',
                borderWidth: 1,
                borderColor: theme.color.fieldBorder,
                marginRight: 15,
              },
            ]}>
            <Text style={[styles.ButtonText, {color: '#30563A'}]}>Close</Text>
          </Pressable>
        );
      };

      const renderButton2 = () => {
        return (
          <Pressable
            onPress={() => {
              props.navigation.navigate('MyProfile');
            }}
            style={({pressed}) => [
              {opacity: pressed ? 0.8 : 1.0},
              styles.ButtonContainer,
              {backgroundColor: theme.color.button1},
            ]}>
            <Text style={[styles.ButtonText, {color: theme.color.buttonText}]}>
              Go to My Profile
            </Text>
          </Pressable>
        );
      };

      return (
        <View
          style={
            c
              ? {
                  alignItems: 'flex-end',
                  backgroundColor: theme.color.background,
                  shadowColor: '#000000',
                  shadowOffset: {width: 0, height: -1}, // change this for more shadow
                  shadowOpacity: 0.1,
                  elevation: 15,
                  borderBottomLeftRadius: 10,
                  borderBottomRightRadius: 10,
                }
              : {
                  alignItems: 'flex-end',
                  marginTop: 30,
                }
          }>
          <View
            style={
              c ? styles.rmodalBottomContainer : styles.rmodalBottomContainer2
            }>
            {!isEdit ? renderButton1() : renderButton11()}
            {renderButton2()}
          </View>
        </View>
      );
    };

    return (
      <MModal
        visible={isReviewTrip}
        transparent
        onRequestClose={closeReviewModal}>
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
                    {!isTripCreate && renderTitle()}
                    {renderFields()}
                  </ScrollView>
                  {!isTripCreate ? renderBottom() : renderBottom2()}
                </>
              )}

              {!c && (
                <>
                  {renderHeader()}
                  {!isTripCreate && renderTitle()}
                  {renderFields()}
                  {!isTripCreate ? renderBottom() : renderBottom2()}
                </>
              )}
            </View>
          </View>
        </SafeAreaView>
      </MModal>
    );
  };

  const renderModal = () => {
    let c = modalHeight >= maxModalHeight ? true : false;
    let style = c ? [styles.modal11, {height: maxModalHeight}] : styles.modal22;

    if (modalChk == 'suspend') {
      const renderHeader = () => {
        let text = 'Suspend Trip?';

        const renderCross = () => {
          return (
            <Pressable
              disabled={loader}
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
              onPress={closeModalg}>
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

      const renderField = () => {
        return (
          <>
            <View
              style={{
                width: '90%',
                alignSelf: 'center',
                marginTop: 25,
              }}>
              <Text numberOfLines={3} ellipsizeMode="tail" style={styles.samt}>
                "{title}"
              </Text>
            </View>
          </>
        );
      };

      const renderField2 = () => {
        return (
          <>
            <View
              style={{
                width: '90%',
                alignSelf: 'center',

                marginTop: c ? 20 : 40,
              }}>
              <Text
                style={{
                  fontSize: 11,
                  color: theme.color.subTitle,
                  fontFamily: theme.fonts.fontNormal,
                  textAlign: 'center',
                }}>
                This will hide the trip from public view, but you can still edit
                the details or reactivate it any time.
              </Text>
            </View>
          </>
        );
      };

      const renderBottom = () => {
        const renderButton1 = () => {
          let t = 'Yes, suspend it now';
          return (
            <>
              <TouchableOpacity
                disabled={loader}
                onPress={SuspendTrip}
                activeOpacity={0.7}
                style={{
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#3C6B49',
                  height: 50,
                  borderRadius: 10,
                  alignSelf: 'center',
                }}>
                {!loader && (
                  <Text
                    style={{
                      color: theme.color.buttonText,
                      fontSize: 16,
                      fontFamily: theme.fonts.fontBold,
                      textTransform: 'none',
                    }}>
                    {t}
                  </Text>
                )}
                {loader && <ActivityIndicator size={20} color={'white'} />}
              </TouchableOpacity>
            </>
          );
        };

        const renderButton2 = () => {
          let t = 'No, keep it active';

          return (
            <>
              <TouchableOpacity
                onPress={closeModalg}
                activeOpacity={0.7}
                style={{
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: theme.color.button2,
                  height: 50,
                  borderRadius: 10,
                  alignSelf: 'center',
                  borderWidth: 1,
                  borderColor: theme.color.fieldBorder,
                  marginTop: 12,
                }}>
                <Text
                  style={{
                    color: '#30563A',
                    textTransform: 'none',
                    fontFamily: theme.fonts.fontBold,
                    fontSize: 16,
                  }}>
                  {t}
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
                : {marginTop: 20}
            }>
            <>{c && renderField2()}</>
            <View style={c ? styles.modalBottomContaine3r : {width: '100%'}}>
              {renderButton1()}
              {renderButton2()}
            </View>
          </View>
        );
      };

      return (
        <MModal visible={isModal} transparent onRequestClose={closeModalg}>
          <SafeAreaView style={styles.modalContainerg}>
            <View style={styles.modalContainer22}>
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
                      {renderField()}
                    </ScrollView>

                    {renderBottom()}
                  </>
                )}

                {!c && (
                  <>
                    {renderHeader()}
                    {renderField()}
                    {renderField2()}
                    {renderBottom()}
                  </>
                )}
              </View>
            </View>
          </SafeAreaView>
        </MModal>
      );
    }

    if (modalChk == 'delete') {
      const renderHeader = () => {
        let text = 'Delete Trip?';

        const renderCross = () => {
          return (
            <Pressable
              disabled={loader}
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
              onPress={closeModalg}>
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

      const renderField = () => {
        return (
          <>
            <View
              style={{
                width: '90%',
                alignSelf: 'center',
                marginTop: 25,
              }}>
              <Text numberOfLines={3} ellipsizeMode="tail" style={styles.samt}>
                "{title}"
              </Text>
            </View>
          </>
        );
      };

      const renderField2 = () => {
        return (
          <>
            <View
              style={{
                width: '90%',
                alignSelf: 'center',

                marginTop: c ? 20 : 40,
              }}>
              <Text
                style={{
                  fontSize: 11,
                  color: theme.color.subTitle,
                  fontFamily: theme.fonts.fontNormal,
                  textAlign: 'center',
                }}>
                This action cannot be undone. Any open offers for this trip will
                be automatically declined.
              </Text>
            </View>
          </>
        );
      };

      const renderBottom = () => {
        const renderButton1 = () => {
          let t = 'Yes, delete it now';
          return (
            <>
              <TouchableOpacity
                disabled={loader}
                onPress={DeleteTrip}
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
                {!loader && (
                  <Text
                    style={{
                      color: theme.color.buttonText,
                      fontSize: 16,
                      fontFamily: theme.fonts.fontBold,
                      textTransform: 'none',
                    }}>
                    {t}
                  </Text>
                )}
                {loader && <ActivityIndicator size={20} color={'white'} />}
              </TouchableOpacity>
            </>
          );
        };

        const renderButton2 = () => {
          let t = 'No, keep it';

          return (
            <>
              <TouchableOpacity
                onPress={closeModalg}
                activeOpacity={0.7}
                style={{
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: theme.color.button2,
                  height: 50,
                  borderRadius: 10,
                  alignSelf: 'center',
                  borderWidth: 1,
                  borderColor: theme.color.fieldBorder,
                  marginTop: 12,
                }}>
                <Text
                  style={{
                    color: '#30563A',
                    textTransform: 'none',
                    fontFamily: theme.fonts.fontBold,
                    fontSize: 16,
                  }}>
                  {t}
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
                : {marginTop: 20}
            }>
            <>{c && renderField2()}</>
            <View style={c ? styles.modalBottomContaine3r : {width: '100%'}}>
              {renderButton1()}
              {renderButton2()}
            </View>
          </View>
        );
      };

      return (
        <MModal visible={isModal} transparent onRequestClose={closeModalg}>
          <SafeAreaView style={styles.modalContainerg}>
            <View style={styles.modalContainer22}>
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
                      {renderField()}
                    </ScrollView>

                    {renderBottom()}
                  </>
                )}

                {!c && (
                  <>
                    {renderHeader()}
                    {renderField()}
                    {renderField2()}
                    {renderBottom()}
                  </>
                )}
              </View>
            </View>
          </SafeAreaView>
        </MModal>
      );
    }

    if (modalChk == 'activate') {
      const renderHeader = () => {
        let text = 'Activate Trip?';

        const renderCross = () => {
          return (
            <Pressable
              disabled={loader}
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
              onPress={closeModalg}>
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

      const renderField = () => {
        return (
          <>
            <View
              style={{
                width: '90%',
                alignSelf: 'center',
                marginTop: 25,
              }}>
              <Text numberOfLines={3} ellipsizeMode="tail" style={styles.samt}>
                "{title}"
              </Text>
            </View>
          </>
        );
      };

      const renderField2 = () => {
        return (
          <>
            <View
              style={{
                width: '90%',
                alignSelf: 'center',

                marginTop: c ? 20 : 40,
              }}>
              <Text
                style={{
                  fontSize: 11,
                  color: theme.color.subTitle,
                  fontFamily: theme.fonts.fontNormal,
                  textAlign: 'center',
                }}>
                This will immediately make the trip public and available to
                receive trade offers.
              </Text>
            </View>
          </>
        );
      };

      const renderBottom = () => {
        const renderButton1 = () => {
          let t = 'Yes, activate it now';
          return (
            <>
              <TouchableOpacity
                disabled={loader}
                onPress={ActivateTrip}
                activeOpacity={0.7}
                style={{
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#3C6B49',
                  height: 50,
                  borderRadius: 10,
                  alignSelf: 'center',
                }}>
                {!loader && (
                  <Text
                    style={{
                      color: theme.color.buttonText,
                      fontSize: 16,
                      fontFamily: theme.fonts.fontBold,
                      textTransform: 'none',
                    }}>
                    {t}
                  </Text>
                )}
                {loader && <ActivityIndicator size={20} color={'white'} />}
              </TouchableOpacity>
            </>
          );
        };

        const renderButton2 = () => {
          let t = 'No, keep it suspended';

          return (
            <>
              <TouchableOpacity
                onPress={closeModalg}
                activeOpacity={0.7}
                style={{
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: theme.color.button2,
                  height: 50,
                  borderRadius: 10,
                  alignSelf: 'center',
                  borderWidth: 1,
                  borderColor: theme.color.fieldBorder,
                  marginTop: 12,
                }}>
                <Text
                  style={{
                    color: '#30563A',
                    textTransform: 'none',
                    fontFamily: theme.fonts.fontBold,
                    fontSize: 16,
                  }}>
                  {t}
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
                : {marginTop: 20}
            }>
            <>{c && renderField2()}</>
            <View style={c ? styles.modalBottomContaine3r : {width: '100%'}}>
              {renderButton1()}
              {renderButton2()}
            </View>
          </View>
        );
      };

      return (
        <MModal visible={isModal} transparent onRequestClose={closeModalg}>
          <SafeAreaView style={styles.modalContainerg}>
            <View style={styles.modalContainer22}>
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
                      {renderField()}
                    </ScrollView>

                    {renderBottom()}
                  </>
                )}

                {!c && (
                  <>
                    {renderHeader()}
                    {renderField()}
                    {renderField2()}
                    {renderBottom()}
                  </>
                )}
              </View>
            </View>
          </SafeAreaView>
        </MModal>
      );
    }
  };

  // const renderActivitesModal = () => {
  //   const closeactvtyModal = () => {
  //     setmodalHeight(0);
  //     setModalVisible(false);

  //     if (actvtyList.length > 0) {
  //       let arr = [];
  //       actvtyList.map((e, i, a) => {
  //         let obj = {};
  //         if (actvtyListS.length > 0) {
  //           let ind = actvtyListS.some(item => e.name === item);
  //           obj = {name: e.name, added: ind};
  //           arr.push(obj);
  //         } else {
  //           obj = {name: e.name, added: false};
  //           arr.push(obj);
  //         }
  //       });
  //       setactvtyList(arr);
  //     }
  //   };

  //   const renderFeatureModalHeader = () => {
  //     return (
  //       <View style={!c ? styles.Header : styles.Headere}>
  //         <View>
  //           <Text style={styles.HeaderText}>Select Activites</Text>
  //         </View>

  //         <TouchableOpacity
  //           onPress={() => {
  //             closeactvtyModal();
  //           }}>
  //           <utils.vectorIcon.Entypo
  //             name={'cross'}
  //             size={25}
  //             color={theme.color.subTitleLight}
  //           />
  //         </TouchableOpacity>
  //       </View>
  //     );
  //   };

  //   const renderBottomFeatureButton = () => {
  //     return (
  //       <TouchableOpacity
  //         activeOpacity={0.8}
  //         onPress={() => {
  //           if (actvtyList.length > 0) {
  //             let arr = [];

  //             actvtyList.map((e, i, a) => {
  //               if (e.added) {
  //                 arr.push(e.name);
  //               }
  //             });

  //             setactvtyListS(arr);
  //           }
  //           setModalVisible(false);
  //           setmodalHeight(0);
  //         }}
  //         style={!c ? styles.BottomButtona : styles.BottomButtonb}>
  //         <Text style={styles.buttonTextBottom}>Done</Text>
  //       </TouchableOpacity>
  //     );
  //   };

  //   const Add = index => {
  //     let temp = [...actvtyList];
  //     temp[index].added = true;
  //     setactvtyList(temp);
  //   };
  //   const Remove = index => {
  //     let temp = [...actvtyList];
  //     temp[index].added = false;
  //     setactvtyList(temp);
  //   };

  //   let c = modalHeight >= maxModalHeight ? true : false;
  //   let style = c
  //     ? [styles.ModalBody, {height: maxModalHeight}]
  //     : styles.ModalBody;

  //   return (
  //     <Modal
  //       isVisible={isModalVisible}
  //       backdropOpacity={0.6}
  //       style={{
  //         padding: 0,
  //         margin: 0,
  //         backgroundColor: 'rgba(0, 0, 0, 0.5)',
  //       }}
  //       animationIn="fadeInLeft"
  //       animationOut="fadeOutRight"
  //       animationInTiming={600}
  //       animationOutTiming={600}
  //       onRequestClose={() => {
  //         setmodalHeight(0);
  //         setModalVisible(false);
  //       }}
  //       backdropTransitionInTiming={600}
  //       backdropTransitionOutTiming={600}
  //       onBackdropPress={() => {
  //         closeactvtyModal();
  //       }}>
  //       <View style={style}>
  //         {!c && (
  //           <>
  //             {renderFeatureModalHeader()}
  //             <View
  //               onLayout={event => {
  //                 if (!c) {
  //                   let {height} = event.nativeEvent.layout;
  //                   setmodalHeight(height);
  //                 }
  //               }}
  //               style={styles.ModalView}>
  //               <ScrollView horizontal showsHorizontalScrollIndicator={false}>
  //                 <FlatList
  //                   data={actvtyList}
  //                   numColumns={3}
  //                   renderItem={({item, index}) => (
  //                     <TouchableOpacity
  //                       activeOpacity={0.6}
  //                       onPress={
  //                         item.added ? () => Remove(index) : () => Add(index)
  //                       }>
  //                       <View
  //                         style={
  //                           item.added
  //                             ? styles.AddedFeaturesView
  //                             : styles.FeaturesView
  //                         }>
  //                         <Text
  //                           style={
  //                             item.added
  //                               ? styles.AddedFeatures
  //                               : styles.Features
  //                           }>
  //                           {item.name}
  //                         </Text>
  //                       </View>
  //                     </TouchableOpacity>
  //                   )}
  //                   keyExtractor={(item, index) => index.toString()}
  //                 />
  //               </ScrollView>
  //             </View>
  //             {renderBottomFeatureButton()}
  //           </>
  //         )}

  //         {c && (
  //           <>
  //             {renderFeatureModalHeader()}

  //             <ScrollView
  //               style={styles.ModalView}
  //               horizontal
  //               showsHorizontalScrollIndicator={false}>
  //               <FlatList
  //                 data={actvtyList}
  //                 numColumns={3}
  //                 renderItem={({item, index}) => (
  //                   <TouchableOpacity
  //                     activeOpacity={0.6}
  //                     onPress={
  //                       item.added ? () => Remove(index) : () => Add(index)
  //                     }>
  //                     <View
  //                       style={
  //                         item.added
  //                           ? styles.AddedFeaturesView
  //                           : styles.FeaturesView
  //                       }>
  //                       <Text
  //                         style={
  //                           item.added ? styles.AddedFeatures : styles.Features
  //                         }>
  //                         {item.name}
  //                       </Text>
  //                     </View>
  //                   </TouchableOpacity>
  //                 )}
  //                 keyExtractor={(item, index) => index.toString()}
  //               />
  //             </ScrollView>
  //             {renderBottomFeatureButton()}
  //           </>
  //         )}
  //       </View>
  //     </Modal>
  //   );
  // };

  return (
    <View style={styles.container}>
      {/* {tagLine != '' && <utils.TagLine tagLine={tagLine} />} */}
      <utils.DrawerHeader props={props} headerTitle={headerTitle} />
      {!internet && <utils.InternetMessage />}
      <SafeAreaView style={styles.container2}>
        <View style={styles.container3}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingVertical: 15,
              paddingHorizontal: 15,
            }}>
            {renderSec1()}
            {renderSec2()}
            {isEdit && renderSec3()}
            {renderButton()}
          </ScrollView>
        </View>

        <utils.Footer
          nav={props.navigation}
          screen={headerTitle}
          focusScreen={store.General.focusScreen}
        />
      </SafeAreaView>
      {/* {isModalVisible && renderActivitesModal()} */}
      {isModal && renderModal()}
      {showCalender && renderCalender()}
      {isShowUnavliableModal && renderUNavlblModal()}
      {isShowUnavliabledaysCal && renderCalender2()}
      {isAddPhotoModal && renderAddPhotoModal()}
      {deleteModal && renderDeleteModal()}
      {isReviewTrip && renderReviewTripModal()}
      {pvm && (
        <utils.FullimageModal
          data={photos}
          si={si}
          show={pvm}
          closModal={() => setpvm(!pvm)}
        />
      )}
      <Toast ref={toast} position="bottom" />
    </View>
  );
}
