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
  TextInput,
  Pressable,
  Dimensions,
  Modal,
} from 'react-native';
// import Geolocation from 'react-native-geolocation-service';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
// import Geocoder from 'react-native-geocoding';
import {styles} from './styles';
import {observer} from 'mobx-react';
import store from '../../store/index';
import utils from '../../utils/index';
import theme from '../../theme';
// import DynamicTabView from 'react-native-dynamic-tab-view';
// import ImageSlider from 'react-native-image-slider';
// import FastImage from 'react-native-fast-image';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-easy-toast';

import RBSheet from 'react-native-raw-bottom-sheet';
import {ActivityIndicator} from 'react-native-paper';
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
    {_id: 1, name: 'sun', isSel: false},
    {_id: 2, name: 'mon', isSel: false},
    {_id: 3, name: 'tue', isSel: false},
    {_id: 4, name: 'wed', isSel: false},
    {_id: 5, name: 'thu', isSel: false},
    {_id: 6, name: 'fri', isSel: false},
    {_id: 7, name: 'sat', isSel: false},
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
  const [seldow, setseldow] = useState([]); //days of week
  const [rdurNum, setrdurNum] = useState(1);

  const [endRepOn, setendRepOn] = useState('');
  const [endRepOnM, setendRepOnM] = useState({});
  const [endRepOnS, setendRepOnS] = useState({});

  const [isShowUnavliabledaysCal, setisShowUnavliabledaysCal] = useState(false);
  const [ischk, setischk] = useState('');

  const [unavlblmarkedDates, setunavlblmarkedDates] = useState({});
  const [selunmarkedDates, setselunmarkedDates] = useState({});

  const [unavlblSLCTmarkedDates, setunavlblSLCTmarkedDates] = useState({});
  const [selunmarkeSLCTdDates, setselunmarkedSLCTDates] = useState({});

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
          ar.push(e.name);
        }
      });
    }

    var rweekNum = rdurNum;
    var start = moment(isSelDate1);
    var end = moment(isSelDate2);

    let mm = {};
    if (ar.length > 0) {
      ar.map((e, i, a) => {
        var day = 0; // Sunday
        if (e == 'sun') {
          day = 0;
        }
        if (e == 'mon') {
          day = 1;
        }
        if (e == 'tue') {
          day = 2;
        }
        if (e == 'wed') {
          day = 3;
        }
        if (e == 'thu') {
          day = 4;
        }
        if (e == 'fri') {
          day = 5;
        }
        if (e == 'sat') {
          day = 6;
        }

        //agar sd k month 1 se chck krein or end date k month end ke to kaise ho ga wo be chk krna
        // wo be chk krna
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
  }, [dow]);

  // console.log('unavlbl days : ', unavlblmarkedDates);

  const onClickCal = () => {
    setshowCalender(!showCalender);
  };

  const onClickUnavailableDays = () => {
    if (!isObjectEmpty(selDates)) {
      setisShowUnavliableModal(true);
    } else {
      Alert.alert('', 'Please select Trip Availability first');
    }
  };

  const onClickrCal = c => {
    setischk(c);
    setisShowUnavliabledaysCal(!isShowUnavliabledaysCal);
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

        {/* {!isSetUnavailableDates && ( */}
        <View style={[styles.fieldContainer, {marginTop: 12}]}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onClickUnavailableDays}>
            <Text style={styles.bottomText}>Set unavailable days</Text>
          </TouchableOpacity>
        </View>
        {/* )} */}

        {/* {isSetUnavailableDates && (
          <View style={[styles.fieldContainer, {marginTop: 12}]}>
            <Text style={styles.fieldText}>Unavailable Days</Text>
              <TouchableOpacity activeOpacity={0.8} onPress={clickUnavailableDays}>
            <Text style={styles.bottomText}>Set unavailable days</Text>
          </TouchableOpacity> 
          </View>
        )}  */}
      </View>
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
    const closeModal = () => {
      setisShowUnavliableModal(false);
      setdow(dw);
      setrdur(rdurtn[0]);
      setrdurNum(1);
      siERpOn(isSelDate2);
      setunavlblmarkedDates({});
    };
    const ApplyModal = () => {};

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
      let t = '';
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
                        t == '' ? theme.color.subTitleLight : theme.color.title,
                      fontFamily: theme.fonts.fontNormal,
                      width: '85%',
                      fontSize: 12.5,
                    },
                  ]}>
                  {t == '' ? 'Select dates this trip is not available' : t}
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
            onPress={ApplyModal}
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
        <View style={{width: '100%', alignItems: 'flex-end'}}>
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
            <View style={styles.modal}>
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
    };
    const ApplyCalModal = () => {
      if (ischk == 'endrepeat') {
        setisShowUnavliabledaysCal(false);
        setendRepOnS(endRepOnM);
        setendRepOn(Object.keys(endRepOnM)[0]);
        return;
      }

      // setselunmarkedDates(unavlblmarkedDates);
      // setunavlblmarkedDates(unavlblmarkedDates);
      setisShowUnavliabledaysCal(false);
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
              disableAllTouchEventsForDisabledDays={true}
              disableAllTouchEventsForInactiveDays={true}
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
      <Toast ref={toast} position="bottom" />
    </View>
  );
}
