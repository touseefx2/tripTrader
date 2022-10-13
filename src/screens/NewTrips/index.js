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
  Modal,
  KeyboardAvoidingView,
  BackHandler,
  Keyboard,
  Alert,
} from 'react-native';
// import Geolocation from 'react-native-geolocation-service';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
// import Geocoder from 'react-native-geocoding';
import {styles} from './styles';
import {observer} from 'mobx-react';
import store from '../../store/index';
import utils from '../../utils/index';
import theme from '../../theme';
import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';
import {Image as ImageCompressor} from 'react-native-compressor';
import {request, PERMISSIONS, check} from 'react-native-permissions';

import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-easy-toast';

import {ScrollView} from 'react-native-gesture-handler';
import {Calendar} from 'react-native-calendars';
import moment from 'moment';

function isObjectEmpty(value) {
  return (
    Object.prototype.toString.call(value) === '[object Object]' &&
    JSON.stringify(value) === '{}'
  );
}

export default observer(NewTrips);
function NewTrips(props) {
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
      title: 'week',
      type: 'durType',
    },
    {
      _id: 2,
      is_active: true,
      title: 'month',
      type: 'durType',
    },
    {
      _id: 2,
      is_active: true,
      title: 'year',
      type: 'durType',
    },
  ];

  const rdurtn = [
    {
      _id: 0,
      is_active: true,
      title: 'Week(s)',
      type: 'durType',
    },
  ];

  const toast = useRef(null);
  const toastduration = 700;
  let headerTitle = 'New Trip';
  let internet = store.General.isInternet;
  let user = store.User.user;

  const [dur, setdur] = useState(durtn[0]); //time solts
  const [rdur, setrdur] = useState(rdurtn[0]);
  const [isDropDownDur, setisDropDownDur] = useState(false);
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

  const [deletePObj, setdeletePObj] = useState(false);
  const [deleteModal, setdeleteModal] = useState(false);

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
      } else if (t == 'week') {
        totaldays = durNum * 7;
      } else if (t == 'month') {
        totaldays = durNum * 30;
      } else if (t == 'year') {
        totaldays = durNum * 365;
      }
      if (no_of_days < totaldays) {
        clearFields();
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

  const clearFields = () => {
    setmarkedDates({});
    setisSelDate(false);
    setselDates({});
    setisSelDate1('');
    setisSelDate2('');
    setmind(undefined);
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
  };

  const siERpOn = d => {
    let md = {};
    md[d] = {
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
    }
    if (isSelDate2 != '') {
      setmaxd(isSelDate2);
      siERpOn(isSelDate2);
    }
  }, [isSelDate1, isSelDate2]);

  function weekOfMonth(m) {
    // end me  +1 id start week from monday
    return m.week() - moment(m).startOf('month').week();
  }

  useEffect(() => {
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

    // let sem = moment(isSelDate1).endOf('month').format('YYYY-MM-DD');
    // if (end > sem) {
    // } else {
    //   var weeknumber = weekOfMonth(moment(isSelDate1));
    //   if (weeknumber <= rweekNum) {
    //     console.error('wn : ', weeknumber);
    //     // let mm = {};
    //     // if (ar.length > 0) {
    //     //   ar.map((e, i, a) => {
    //     //     var day = 0; // Sunday
    //     //     if (e == 'sun') {
    //     //       day = 0;
    //     //     }
    //     //     if (e == 'mon') {
    //     //       day = 1;
    //     //     }
    //     //     if (e == 'tue') {
    //     //       day = 2;
    //     //     }
    //     //     if (e == 'wed') {
    //     //       day = 3;
    //     //     }
    //     //     if (e == 'thu') {
    //     //       day = 4;
    //     //     }
    //     //     if (e == 'fri') {
    //     //       day = 5;
    //     //     }
    //     //     if (e == 'sat') {
    //     //       day = 6;
    //     //     }

    //     //     var result = [];
    //     //     var current = start.clone();
    //     //     while (current.day(7 + day).isBefore(end)) {
    //     //       result.push(current.clone());
    //     //     }
    //     //     if (result.length > 0) {
    //     //       result.map((e, i, a) => {
    //     //         let d = e.format('YYYY-MM-DD');
    //     //         mm[d] = {
    //     //           marked: false,
    //     //           selected: true,
    //     //           customStyles: css,
    //     //           selectedColor: 'red',
    //     //           disabled: true,
    //     //           disableTouchEvent: true,
    //     //         };
    //     //       });
    //     //     }
    //     //   });

    //     //   setunavlblmarkedDates(mm);
    //     // }
    //   }
    // }
  }, [dow, endRepOn]);

  const onClickCal = () => {
    setshowCalender(!showCalender);
  };

  const onClickUnavailableDays = () => {
    if (!isObjectEmpty(selDates)) {
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
        setrdur(d.rdur);
        siERpOn(d.repeat_every.endRepeatOn);
        setselunmarkedSLCTDates(d.selunmarkeSLCTdDates);
        setunavlblSLCTmarkedDates(d.selunmarkeSLCTdDates);
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
      <theme.DropDown
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
      setselDates(markedDates);
      setmarkedDates(markedDates);
      setshowCalender(false);
    };

    const formatDate = date => {
      var dd = moment(date).format('MMMM YYYY');
      return dd;
    };

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

      let seDayColor = theme.color.button1;
      let ocolor = '#569969';

      if (isObjectEmpty(markedDates)) {
        let markedDates = {};
        markedDates[date] = {
          startingDay: true,
          color: seDayColor,
          textColor: 'white',
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
                startingDay: true,
                color: seDayColor,
                textColor: 'white',
                disabled: false,
                disableTouchEvent: false,
              };
            } else {
              m[c2] = {
                endingDay: true,
                color: seDayColor,
                textColor: 'white',
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
          if (size == 2) {
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
          } else if (t == 'week') {
            totaldays = durNum * 7;
          } else if (t == 'month') {
            totaldays = durNum * 30;
          } else if (t == 'year') {
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
                  startingDay: true,
                  color: seDayColor,
                  textColor: 'white',
                  disabled: false,
                  disableTouchEvent: false,
                };
              }
              if (i > 0 && i < a.length - 1) {
                mdd[d] = {
                  color: ocolor,
                  textColor: 'white',
                  disabled: true,
                  disableTouchEvent: true,
                };
              }
              if (i == a.length - 1) {
                mdd[d] = {
                  endingDay: true,
                  color: seDayColor,
                  textColor: 'white',
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
              initialDate={mind || iDate}
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
              disableAllTouchEventsForInactiveDays={true}
              // markingType="custom"
              markingType="period"
              markedDates={markedDates}
            />
            {renderBottom()}
          </View>
        </SafeAreaView>
      </Modal>
    );
  };

  const renderUNavlblModal = () => {
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
        wtxt = wtxt + ` (${rdur.title == 'Week(s)' ? 'weekly' : ''})`;
      }

      let unw = [];
      let ad = [];
      if (!isObjectEmpty(selunmarkeSLCTdDates)) {
        var myObject = selunmarkeSLCTdDates;
        Object.keys(myObject).forEach(function (key, index) {
          ad.push(key);
          unw.push(key);
        });
      }
      if (!isObjectEmpty(unavlblmarkedDates)) {
        var myObject = unavlblmarkedDates;
        Object.keys(myObject).forEach(function (key, index) {
          ad.push(key);
        });
      }

      if (unw.length > 0) {
        unw.sort(function (a, b) {
          return Number(new Date(a)) - Number(new Date(b));
        });
      }
      if (ad.length > 0) {
        ad.sort(function (a, b) {
          return Number(new Date(a)) - Number(new Date(b));
        });
      }

      const obj = {
        days_of_week: dw, //main
        repeat_every: {
          //main
          num: rdurNum,
          title: rdur.title,
          endRepeatOn: endRepOn,
        },
        wtxt: wtxt,
        esd_text: tt,
        rdur: rdur,

        selunmarkeSLCTdDates: selunmarkeSLCTdDates,

        unavailable_days_of_week: unw, //main
        exclude_specific_dates: esd, //main
        all_unavailable_dates: ad, //main
      };
      setisShowUnavliableModal(false);

      setisSetUnavailable(obj);
    };

    const renderHeader = () => {
      let text = 'Set Unavailable Days';

      const renderCross = () => {
        return (
          <Pressable
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
            <Text style={styles.fieldText}>Repeat Every</Text>
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
                  // onPress={() => {
                  //   closeAllDropDown();
                  //   setisDropDownrDur(!isDropDownrDur);
                  // }}
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
                      {rdur.title ? rdur.title : ''}
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
        <View style={{alignItems: 'flex-end'}}>
          <View style={styles.modalBottomContainer}>
            {renderButton1()}
            {renderButton2()}
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
          <View style={styles.modalContainer2}>
            <View style={styles.umodal}>
              {renderHeader()}
              {renderTitle()}
              {renderWeek()}
              {renderRepeat()}
              {renderOtherDates()}
              {renderBottom()}
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    );
  };

  const renderCalender2 = () => {
    const closeCalModal = () => {
      setisShowUnavliabledaysCal(false);
      // setunavlblmarkedDates(selunmarkedDates);
      setischk('');
      setendRepOnM(endRepOnS);
      setendRepOn(Object.keys(endRepOnS)[0]);
      setunavlblSLCTmarkedDates(selunmarkeSLCTdDates);
    };
    const ApplyCalModal = () => {
      if (ischk == 'endrepeat') {
        setisShowUnavliabledaysCal(false);
        setendRepOnS(endRepOnM);
        setendRepOn(Object.keys(endRepOnM)[0]);
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
              initialDate={mind || iDate}
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
                  ? endRepOnM
                  : {...unavlblmarkedDates, ...unavlblSLCTmarkedDates}
              }
            />
            {renderBottom()}
          </View>
        </SafeAreaView>
      </Modal>
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
            if (c == 'camera') {
              setisShowGalleryPrmsn(false);
              setisShowCameraPrmsn(true);
            } else {
              setisShowCameraPrmsn(false);
              setisShowGalleryPrmsn(true);
            }
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
              style={styles.uploadIndicationLogo}
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
            width: '100%',
            flexDirection: 'row',
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
            width: '100%',
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
      <Modal
        visible={isAddPhotoModal}
        transparent
        onRequestClose={closeAddPhotoModal}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={[styles.modalContainer2, {margin: 20}]}>
            <View
              style={[
                styles.modal,
                {paddingVertical: 25, paddingHorizontal: 20, borderRadius: 15},
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
                    style={{alignItems: 'center', justifyContent: 'center'}}>
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

                    <Text
                      style={[
                        styles.section2LogoTitle,
                        {
                          textAlign: 'center',
                          width: '90%',
                          alignSelf: 'center',
                        },
                      ]}>
                      {prmsnChk == 'camera'
                        ? 'Trip Trader wants permission to access your camera.'
                        : 'Trip Trader wants permission to access your storage.'}
                    </Text>
                    <Text style={styles.section2LogoTitlee}>Grant access?</Text>
                  </View>

                  {renderButtonPermission()}
                </>
              )}
              {renderCross()}
            </View>
          </View>
        </SafeAreaView>
      </Modal>
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
      <Modal
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
      </Modal>
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
          <Text style={styles.fieldText}>I want to trade...</Text>
          <View style={styles.inputConatiner}>
            <TextInput
              value={trade}
              onChangeText={d => {
                settrader(d);
              }}
              placeholder="Example: Central NC Whitetail Hunting"
              style={styles.input}
            />
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
              placeholder="Example: Florida Alligator Hunting"
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

        <View style={[styles.fieldContainer, {marginTop: 17}]}>
          <Text style={styles.fieldText}>Trip Duration</Text>
          <View
            style={[
              styles.fieldContainer,
              {marginTop: 5, flexDirection: 'row'},
            ]}>
            <View style={[styles.inputConatiner, {width: '22%'}]}>
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

            <View style={{width: '33%', marginLeft: 10}}>
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
        let uri = e.uri;
        const renderPhotoCross = () => {
          return (
            <Pressable
              style={({pressed}) => [
                {opacity: pressed ? 0.7 : 1.0},
                styles.crossContainer,
              ]}
              onPress={() => openDeleteModal({uri: e.uri, i: i})}>
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
                disabled
                style={({pressed}) => [
                  {opacity: pressed ? 0.9 : 1.0},
                  [styles.addImgContainer, {marginTop: 15}],
                ]}
                // onPress={() => photoClick(photo, index)}
              >
                <Image style={styles.addImg} source={{uri: uri}} />
                {renderPhotoCross()}
              </Pressable>
            )}

            {a.length < maxPhotos && (
              <>
                <Pressable
                  disabled
                  style={({pressed}) => [
                    {opacity: pressed ? 0.9 : 1.0},
                    [styles.addImgContainer, {marginTop: 15}],
                  ]}>
                  <Image style={styles.addImg} source={{uri: uri}} />
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

  console.log('photos : ', photos);

  // if (isSetUnavailable) {
  //   console.log(
  //     'is unavlbl : ',
  //     isSetUnavailable.all_unavailable_dates.map((e, i, a) => {
  //       console.log('e : ', e);
  //     }),
  //   );
  // }
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
          </ScrollView>
        </View>

        <utils.Footer
          nav={props.navigation}
          screen={headerTitle}
          focusScreen={store.General.focusScreen}
        />
      </SafeAreaView>
      {showCalender && renderCalender()}
      {isShowUnavliableModal && renderUNavlblModal()}
      {isShowUnavliabledaysCal && renderCalender2()}
      {isAddPhotoModal && renderAddPhotoModal()}
      {deleteModal && renderDeleteModal()}
      <Toast ref={toast} position="bottom" />
    </View>
  );
}
