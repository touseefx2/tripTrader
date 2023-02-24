import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TextInput,
  SafeAreaView,
  TouchableHighlight,
  FlatList,
  KeyboardAvoidingView,
  Modal,
} from 'react-native';
import theme from '../../theme/index';
import {styles} from './styles';
import Header from './components/Header';
import Title from './components/Title';
import Bottom from './components/Bottom';

const dw = [
  {_id: 1, name: 'Sun', num: 0, isSel: false},
  {_id: 2, name: 'Mon', num: 1, isSel: false},
  {_id: 3, name: 'Tue', num: 2, isSel: false},
  {_id: 4, name: 'Wed', num: 3, isSel: false},
  {_id: 5, name: 'Thu', num: 4, isSel: false},
  {_id: 6, name: 'Fri', num: 5, isSel: false},
  {_id: 7, name: 'Sat', num: 6, isSel: false},
];

export default function UnAvailableModal({
  isModal,
  setIsModal,
  step,
  unAvailable,
  setUnAvailble,
  totaldays,
}) {
  const maxModalHeight = theme.window.Height - 70;
  const [isMaxHeight, setIssMaxHeight] = useState(false);
  const [modalHeight, setmodalHeight] = useState(0);
  const [isShowCalender, setIsShowCalender] = useState(false);

  const [unavlblmarkedDates, setunavlblmarkedDates] = useState(null);
  const [unavlblSLCTmarkedDates, setunavlblSLCTmarkedDates] = useState(null);
  const [selunmarkeSLCTdDates, setselunmarkedSLCTDates] = useState(null);

  const [dow, setdow] = useState(dw); //days of week

  // let tt = '';
  // let esd = [];
  // if (!isObjectEmpty(selunmarkeSLCTdDates)) {
  //   var myObject = selunmarkeSLCTdDates;
  //   Object.keys(myObject).forEach(function (key, index) {
  //     esd.push(key);
  //   });
  // }
  // let arset = []; //for sort and set format
  // if (esd.length > 0) {
  //   esd.sort(function (a, b) {
  //     return Number(new Date(a)) - Number(new Date(b));
  //   });
  //   esd.map((e, i, a) => {
  //     arset.push(moment(e).format('MMM DD'));
  //   });
  // }

  // let arr = []; //for amse sequece date separate
  // if (arset.length > 0) {
  //   let arset2 = arset.slice();

  //   arset.map((e, i, a) => {
  //     let d = [];
  //     let chkd = e;
  //     let chki = i;

  //     d.push({d: chkd});
  //     delete arset[chki];

  //     let id = 0;
  //     for (let index = ++chki; index < arset2.length; index++) {
  //       const ee = arset2[index];
  //       if (chkd.slice(0, 3) == ee.slice(0, 3)) {
  //         let n1 = chkd.slice(4, 6);
  //         let n2 = ee.slice(4, 6);
  //         id++;
  //         if (Number(n1) + id == Number(n2)) {
  //           d.push({d: ee});
  //           delete arset[index];
  //         } else {
  //           break;
  //         }
  //       }
  //     }

  //     arr.push(d);
  //   });
  // }

  // if (arr.length > 0) {
  //   arr.map((e, i, a) => {
  //     let aa = e;
  //     if (aa.length > 1) {
  //       tt =
  //         tt +
  //         moment(aa[0].d).format('MMM D') +
  //         '-' +
  //         moment(aa[aa.length - 1].d)
  //           .format('MMM D')
  //           .slice(4, 6) +
  //         ', ';
  //     } else {
  //       tt = tt + moment(aa[0].d).format('MMM D') + ', ';
  //     }
  //   });
  // }
  // tt = tt.replace(/, *$/, '');

  useEffect(() => {
    if (unAvailable) {
    }
  }, [unAvailable]);

  useEffect(() => {
    setIssMaxHeight(modalHeight >= maxModalHeight ? true : false);
  }, [modalHeight]);

  const onViewLayout = event => {
    if (!isMaxHeight) {
      const {height} = event.nativeEvent.layout;
      setmodalHeight(height);
    }
  };

  const closeModal = () => {
    setIsModal(false);
  };

  // const renderWeek = () => {
  //   const renderShowData = () => {
  //     const d = dow.map((e, i, a) => {
  //       return (
  //         <View
  //           style={{
  //             flexDirection: 'row',
  //             alignItems: 'center',
  //             marginRight: i <= a.length - 1 ? 15 : 0,
  //             marginTop: 12,
  //           }}>
  //           <TouchableOpacity
  //             style={{
  //               width: 20,
  //               height: 20,
  //               borderRadius: 4,
  //               backgroundColor: !e.isSel ? 'white' : theme.color.button1,
  //               alignItems: 'center',
  //               justifyContent: 'center',
  //               borderWidth: 1,
  //               borderColor: theme.color.fieldBorder,
  //             }}
  //             activeOpacity={0.5}
  //             onPress={() => {
  //               let c = dow.slice();
  //               if (c[i].isSel == false) {
  //                 setunavlblSLCTmarkedDates({});
  //                 setselunmarkedSLCTDates({});
  //               }
  //               c[i].isSel = !c[i].isSel;

  //               setdow(c);
  //             }}>
  //             {e.isSel && (
  //               <utils.vectorIcon.FontAwesome5
  //                 name={'check'}
  //                 color={theme.color.buttonText}
  //                 size={11}
  //               />
  //             )}
  //           </TouchableOpacity>
  //           <Text
  //             style={{
  //               color: '#0E2932',
  //               fontSize: 12,
  //               fontFamily: theme.fonts.fontNormal,
  //               textTransform: 'capitalize',
  //               marginLeft: 7,
  //             }}>
  //             {e.name}
  //           </Text>
  //         </View>
  //       );
  //     });

  //     return d;
  //   };

  //   return (
  //     <View style={{marginTop: 15, width: '100%'}}>
  //       <Text
  //         style={{
  //           fontSize: 13,
  //           color: theme.color.title,
  //           fontFamily: theme.fonts.fontBold,
  //         }}>
  //         Days of Week
  //       </Text>
  //       <View
  //         style={{
  //           width: '100%',
  //           flexDirection: 'row',
  //           alignItems: 'center',
  //           flexShrink: 1,
  //           flexWrap: 'wrap',
  //         }}>
  //         {renderShowData()}
  //       </View>
  //     </View>
  //   );
  // };

  // const renderOtherDates = () => {
  //   return (
  //     <>
  //       <View style={[styles.fieldContainer, {marginTop: 15}]}>
  //         <Text style={styles.fieldText}>Exclude Specific Dates</Text>
  //         <View style={[styles.fieldContainer, {marginTop: 5}]}>
  //           <Pressable
  //             onPress={() => {
  //               onClickrCal('otherdates');
  //             }}
  //             style={({pressed}) => [
  //               {opacity: pressed ? 0.8 : 1.0},
  //               [
  //                 styles.inputConatiner,
  //                 {
  //                   width: '100%',
  //                   flexDirection: 'row',
  //                   alignItems: 'center',
  //                   justifyContent: 'space-between',
  //                 },
  //               ],
  //             ]}>
  //             <Text
  //               numberOfLines={1}
  //               ellipsizeMode="tail"
  //               style={[
  //                 styles.fieldText,
  //                 {
  //                   color:
  //                     tt == ''
  //                       ? theme.color.subTitleLight
  //                       : theme.color.title,
  //                   fontFamily: theme.fonts.fontNormal,
  //                   width: '85%',
  //                   fontSize: 12.5,
  //                 },
  //               ]}>
  //               {tt == '' ? 'Select dates this trip is not available' : tt}
  //             </Text>
  //             <View
  //               style={{
  //                 width: '13%',
  //                 alignItems: 'flex-end',
  //               }}>
  //               <Image
  //                 source={require('../../assets/images/cal/img.png')}
  //                 style={styles.inputIcon}
  //               />
  //             </View>
  //           </Pressable>
  //         </View>
  //       </View>
  //     </>
  //   );
  // };

  // const renderCalender2 = () => {
  //   const closeCalModal = () => {
  //     setisShowUnavliabledaysCal(false);

  //     setischk('');
  //     let d = Object.keys(endRepOnS)[0];
  //     siERpOn(d);
  //     setunavlblSLCTmarkedDates(selunmarkeSLCTdDates);
  //   };
  //   const ApplyCalModal = () => {
  //     if (ischk == 'endrepeat') {
  //       setisShowUnavliabledaysCal(false);
  //       let d = Object.keys(endRepOnM)[0];
  //       siERpOn(d);

  //       let esd = [];
  //       if (!isObjectEmpty(selunmarkeSLCTdDates)) {
  //         var myObject = selunmarkeSLCTdDates;
  //         Object.keys(myObject).forEach(function (key, index) {
  //           esd.push(key);
  //         });
  //       }
  //       if (esd.length > 0) {
  //         esd.sort(function (a, b) {
  //           return Number(new Date(a)) - Number(new Date(b));
  //         });
  //       }

  //       if (esd.length > 0) {
  //         if (d >= esd[0]) {
  //           setunavlblSLCTmarkedDates({});
  //           setselunmarkedSLCTDates({});
  //         }
  //       }

  //       return;
  //     } else {
  //       setisShowUnavliabledaysCal(false);
  //       setselunmarkedSLCTDates(unavlblSLCTmarkedDates);
  //       return;
  //     }
  //   };

  //   const formatDate = date => {
  //     var dd = moment(date).format('MMMM YYYY');
  //     return dd;
  //   };

  //   const getSelectedDayEvents = date => {
  //     if (ischk == 'endrepeat') {
  //       let md = {};
  //       md[date] = {
  //         customStyles: cs,
  //         marked: false,
  //         selected: true,
  //         selectedColor: theme.color.button1,
  //         disabled: true,
  //         disableTouchEvent: true,
  //       };
  //       setendRepOnM(md);
  //       return;
  //     } else {
  //       let md = {...unavlblSLCTmarkedDates};
  //       if (isObjectEmpty(md)) {
  //         let markedDates = {};
  //         markedDates[date] = {
  //           customStyles: cs,
  //           marked: false,
  //           selected: true,
  //           selectedColor: theme.color.button1,
  //           disabled: false,
  //           disableTouchEvent: false,
  //         };
  //         setunavlblSLCTmarkedDates(markedDates);
  //         return;
  //       } else {
  //         let o = md[date];
  //         if (o !== undefined) {
  //           console.warn('The key exists.');
  //           delete md[date];
  //         } else {
  //           console.warn('The key does not exist.');
  //           md[date] = {
  //             marked: false,
  //             selected: true,
  //             customStyles: cs,
  //             selectedColor: theme.color.button1,
  //             disabled: false,
  //             disableTouchEvent: false,
  //           };
  //         }
  //         setunavlblSLCTmarkedDates(md);
  //         return;
  //       }
  //     }
  //   };

  //   const renderBottom = () => {
  //     let c = isSelDate ? false : true;
  //     return (
  //       <View style={{marginTop: 10, alignItems: 'flex-end', width: '100%'}}>
  //         <View
  //           style={{
  //             width: '55%',
  //             paddingRight: 10,
  //             alignItems: 'center',
  //             justifyContent: 'space-between',
  //             flexDirection: 'row',
  //           }}>
  //           <Pressable
  //             onPress={closeCalModal}
  //             style={({pressed}) => [
  //               {
  //                 opacity: pressed ? 0.9 : 1.0,
  //                 paddingHorizontal: 15,
  //                 paddingVertical: 8,
  //                 borderRadius: 8,
  //                 borderWidth: 1,
  //                 borderColor: theme.color.fieldBorder,
  //                 alignItems: 'center',
  //                 justifyContent: 'center',
  //               },
  //             ]}>
  //             <Text
  //               style={{
  //                 fontSize: 13,
  //                 fontFamily: theme.fonts.fontBold,
  //                 color: '#30563A',
  //               }}>
  //               Cancel
  //             </Text>
  //           </Pressable>

  //           <Pressable
  //             onPress={ApplyCalModal}
  //             disabled={!isSelDate ? true : false}
  //             style={({pressed}) => [
  //               {
  //                 opacity: pressed ? 0.9 : c ? 0.5 : 1.0,
  //                 paddingHorizontal: 15,
  //                 paddingVertical: 8,
  //                 borderRadius: 8,
  //                 backgroundColor: theme.color.button1,
  //                 alignItems: 'center',
  //                 justifyContent: 'center',
  //               },
  //             ]}>
  //             <Text
  //               style={{
  //                 fontSize: 13,
  //                 fontFamily: theme.fonts.fontBold,
  //                 color: theme.color.buttonText,
  //               }}>
  //               Apply
  //             </Text>
  //           </Pressable>
  //         </View>
  //       </View>
  //     );
  //   };

  //   let cusTheme = {
  //     textDisabledColor: theme.color.subTitleLight,
  //     dayTextColor: theme.color.title,
  //     textDayFontSize: 13,
  //     textDayFontFamily: theme.fonts.fontMedium,
  //     textDayHeaderFontSize: 13,
  //     textSectionTitleColor: theme.color.title,
  //     textDayHeaderFontFamily: theme.fonts.fontMedium,
  //   };
  //   let todaymark = isDisableToday2 ? dtd : td;
  //   return (
  //     <Modal
  //       visible={isShowUnavliabledaysCal}
  //       transparent
  //       onRequestClose={closeCalModal}>
  //       <SafeAreaView
  //         style={[
  //           {
  //             flex: 1,
  //             alignItems: 'center',
  //             justifyContent: 'center',
  //             padding: 20,
  //             backgroundColor: 'rgba(0,0,0,0.5)',
  //           },
  //         ]}>
  //         <View
  //           style={{
  //             width: '100%',
  //             alignSelf: 'center',
  //             paddingBottom: 20,
  //             backgroundColor: theme.color.background,
  //             borderRadius: 10,
  //             paddingTop: 5,
  //             paddingHorizontal: 5,
  //           }}>
  //           <Calendar
  //             theme={cusTheme}
  //             hideDayNames={false}
  //             hideArrows={false}
  //             hideExtraDays={false}
  //             disableMonthChange={true} // If hideArrows = false and hideExtraDays = false do not switch month when tapping on greyed out
  //             initialDate={ischk == 'endrepeat' ? endRepOn : mind}
  //             // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
  //             minDate={mind}
  //             // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
  //             maxDate={maxd}
  //             // Handler which gets executed on day press. Default = undefined
  //             onDayPress={day => {
  //               getSelectedDayEvents(day.dateString);
  //             }}
  //             // Handler which gets executed on day long press. Default = undefined
  //             onDayLongPress={day => {
  //               console.log('selected long press day', day);
  //             }}
  //             // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
  //             monthFormat={'yyyy MM'}
  //             // Handler which gets executed when visible month changes in calendar. Default = undefined
  //             onMonthChange={month => {
  //               setmonth(new Date(month.dateString));
  //             }}
  //             // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday
  //             firstDay={7}
  //             onPressArrowLeft={subtractMonth => subtractMonth()}
  //             onPressArrowRight={addMonth => addMonth()}
  //             renderHeader={date => {
  //               return (
  //                 <Text
  //                   style={{
  //                     fontSize: 14,
  //                     fontFamily: theme.fonts.fontBold,
  //                     color: '#111111',
  //                   }}>
  //                   {formatDate(month)}
  //                 </Text>
  //               );
  //             }}
  //             enableSwipeMonths={true}
  //             disableAllTouchEventsForDisabledDays={false}
  //             markingType="custom"
  //             markedDates={
  //               ischk == 'endrepeat'
  //                 ? {...todaymark, ...endRepOnM}
  //                 : {
  //                     ...todaymark,
  //                     ...unavlblmarkedDates,
  //                     ...unavlblSLCTmarkedDates,
  //                   }
  //             }
  //           />
  //           {renderBottom()}
  //         </View>
  //       </SafeAreaView>
  //     </Modal>
  //   );
  // };

  const openCalender = () => {
    setIsShowCalender(true);
  };

  const onClickSave = () => {
    // let doweeks = dow.slice();
    // let dw = [];
    // if (doweeks.length > 0) {
    //   doweeks.map((e, i, a) => {
    //     if (e.isSel) {
    //       dw.push(e.name);
    //     }
    //   });
    // }
    // let wtxt = '';
    // if (dw.length > 0) {
    //   dw.map((e, i, a) => {
    //     let sep = a[i + 2] == undefined ? ' and ' : ', ';
    //     if (sep == ' and ' && i == a.length - 1) {
    //       sep = '';
    //     }
    //     wtxt = wtxt + e + sep;
    //   });
    // }
    // if (wtxt != '') {
    //   wtxt = wtxt + ` (${rdur.title == 'weeks' ? 'weekly' : rdur.title})`;
    // }
    // let unw = [];
    // let exsd = [];
    // let ad = [];
    // if (!isObjectEmpty(selunmarkeSLCTdDates)) {
    //   var myObject = selunmarkeSLCTdDates;
    //   Object.keys(myObject).forEach(function (key, index) {
    //     ad.push(key);
    //     exsd.push(key);
    //   });
    // }
    // if (!isObjectEmpty(unavlblmarkedDates)) {
    //   var myObject = unavlblmarkedDates;
    //   Object.keys(myObject).forEach(function (key, index) {
    //     ad.push(key);
    //     unw.push(key);
    //   });
    // }
    // if (unw.length > 0) {
    //   unw.sort(function (a, b) {
    //     return Number(new Date(a)) - Number(new Date(b));
    //   });
    // }
    // if (exsd.length > 0) {
    //   exsd.sort(function (a, b) {
    //     return Number(new Date(a)) - Number(new Date(b));
    //   });
    // }
    // if (ad.length > 0) {
    //   ad.sort(function (a, b) {
    //     return Number(new Date(a)) - Number(new Date(b));
    //   });
    //   let l = ad.length;
    //   const a = moment(isSelDate2);
    //   const b = moment(isSelDate1);
    //   let td = a.diff(b, 'days');
    //   td++;
    //   let fl = td - l;
    //   let totaldays = 0;
    //   let t = dur.title;
    //   if (t == 'days') {
    //     totaldays = durNum;
    //   } else if (t == 'weeks') {
    //     totaldays = durNum * 7;
    //   } else if (t == 'months') {
    //     totaldays = durNum * 30;
    //   } else if (t == 'years') {
    //     totaldays = durNum * 365;
    //   }
    //   if (fl < totaldays) {
    //     Alert.alert(
    //       '',
    //       'Total available dates is less then duration number days',
    //     );
    //     return;
    //   }
    // }
    // let obj = false;
    // if (dw.length > 0 || ad.length > 0) {
    //   obj = {
    //     days_of_week: dw, //main
    //     repeat_every: {
    //       //main
    //       num: rdurNum,
    //       title: rdur.title,
    //       endRepeatOn: endRepOn,
    //     },
    //     wtxt: wtxt,
    //     esd_text: tt,
    //     unavailable_days_of_week: unw, //main
    //     exclude_specific_dates: exsd, //main
    //     all_unavailable_dates: ad, //main
    //   };
    // }
    // setisSetUnavailable(obj);
    // setisShowUnavliableModal(false);
  };

  return (
    <Modal visible={isModal} transparent onRequestClose={closeModal}>
      <SafeAreaView style={styles.modalContainer}>
        <View
          onLayout={onViewLayout}
          style={[
            styles.modal,
            isMaxHeight
              ? {height: maxModalHeight, paddingTop: 0}
              : {padding: 15},
          ]}>
          <Header
            title={'Set Unavailable Days'}
            closeModal={closeModal}
            isMaxHeight={isMaxHeight}
          />

          {isMaxHeight ? (
            <ScrollView
              contentContainerStyle={{paddingHorizontal: 15}}
              showsVerticalScrollIndicator={false}
              style={{flex: 1}}>
              <Title />
            </ScrollView>
          ) : (
            <>
              <Title />
            </>
          )}

          <Bottom
            isMaxHeight={isMaxHeight}
            step={step}
            goBack={closeModal}
            onClickSave={onClickSave}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
}
