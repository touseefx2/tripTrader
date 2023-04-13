import React, {useState} from 'react';
import {View, Modal, SafeAreaView} from 'react-native';
import {styles} from './styles';
import theme from '../../theme';
import utils from '../../utils';
import moment from 'moment';
import {Calendar} from 'react-native-calendars';
import Bottom from './components/Bottom';
// import * as RNLocalize from 'react-native-localize';
// import {getCurrentDateTime, getCurrentTimeZone} from './fun';

export default function SelectionCalender({
  modalObj,
  isModal,
  setIsModal,
  selectedDates,
  setSelectedDates,
  durationTitle,
  minDate,
  maxDate,
  totalDays,
}) {
  const {item} = modalObj;
  const {availableFrom, availableTo, unAvailableDays} = item;
  let numOfDays = totalDays;
  const startDate = availableFrom;
  const endDate = availableTo;

  const all_unavailable_dates = unAvailableDays.allUnavailableDates || [];
  const start_date = moment(startDate).format('YYYY-MM-DD');
  const current_date = moment(new Date()).format('YYYY-MM-DD');
  let unavailableDays = {};
  if (minDate == '') {
    minDate =
      start_date < current_date
        ? moment(current_date).format('YYYY-MM-DD')
        : moment(start_date).format('YYYY-MM-DD');
  }
  if (maxDate == '') maxDate = moment(endDate).format('YYYY-MM-DD');

  const [minimumDate, setMinimumDate] = useState(minDate);
  const [maximumDate, setMaximumDate] = useState(maxDate);
  const [markedDates, setMarkedDates] = useState(selectedDates);

  // console.log(
  //   'all_unavailable_dates ',
  //   moment(new Date(all_unavailable_dates[0])).format('YYYY-MM-DD'),
  // );

  // const timezone = RNLocalize.getTimeZone(); // set the desired time zone
  // console.log(getCurrentDateTime(timezone, '2023-04-13T00:00:00.000+00:00'));

  all_unavailable_dates.map(item => {
    unavailableDays[moment(item).format('YYYY-MM-DD')] = {
      marked: false,
      selected: true,
      customStyles: theme.dayStyle.unavailableDaysStyle,
      disabled: true,
      disableTouchEvent: true,
    };
  });

  const closeModal = () => {
    setIsModal(false);
  };

  const onClickApply = () => {
    let mdd = {...markedDates};
    let mds = [];
    let fm = {};

    if (!utils.functions.isObjectEmpty(mdd)) {
      mds = Object.keys(mdd);
      mds.sort();
    }
    if (mds.length > 0) {
      mds.map(item => {
        fm[item] = {
          customStyles: theme.dayStyle.selectedDaysStyle,
          marked: false,
          selected: true,
          selectedColor: theme.color.button1,
          disabled: false,
          disableTouchEvent: false,
        };
      });
    }

    setSelectedDates(fm);
    closeModal();
  };

  const selectedDayEvents = day => {
    const date = day.dateString;
    let datesArray = {};
    if (numOfDays <= 1) {
      datesArray[date] = theme.dayStyle.markeDateStyle;
      setMinimumDate(date);
      setMaximumDate(date);
    } else {
      let selectedDate = date;
      let unavailableArr = [];
      let datesList = [];
      all_unavailable_dates.map(item => {
        unavailableArr.push(moment(item).format('YYYY-MM-DD'));
      });

      datesList.push(selectedDate);

      for (let index = 0; index < numOfDays; index++) {
        console.log('1 ', selectedDate > moment(endDate).format('YYYY-MM-DD'));

        if (selectedDate > moment(endDate).format('YYYY-MM-DD')) {
          break;
        }

        if (unavailableArr.length > 0) {
          let ind = 0;
          ind = unavailableArr.findIndex(element => element === selectedDate);
          console.log('ind : ', ind);

          if (ind < 0) datesList.push(selectedDate);
          else numOfDays++;
        } else datesList.push(selectedDate);

        selectedDate = moment(selectedDate).add(1, 'day').format('YYYY-MM-DD');
      }

      const dates = [...new Set(datesList)];

      dates.forEach(item => {
        datesArray[item] = theme.dayStyle.markeDateStyle;
      });

      setMinimumDate(datesList[0]);
      setMaximumDate(datesList[datesList.length - 1]);
    }
    setMarkedDates(datesArray);
  };

  return (
    <Modal visible={isModal} transparent onRequestClose={closeModal}>
      <SafeAreaView style={styles.container}>
        <View style={styles.container2}>
          <Calendar
            // current=""
            theme={theme.dayStyle.calenderTheme}
            hideDayNames={false}
            hideArrows={false}
            hideExtraDays={false}
            disableMonthChange={true}
            initialDate={minimumDate}
            minDate={minimumDate}
            maxDate={maximumDate}
            onDayPress={selectedDayEvents}
            monthFormat={'MMMM yyyy'}
            firstDay={7}
            enableSwipeMonths={true}
            disableAllTouchEventsForDisabledDays={true}
            markingType="custom"
            markedDates={{...unavailableDays, ...markedDates}}
          />
          <Bottom
            totalDays={numOfDays}
            durationTitle={durationTitle}
            markedDates={markedDates}
            onClickApply={onClickApply}
            closeModal={closeModal}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
}
