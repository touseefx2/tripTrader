import React, {useState, useEffect} from 'react';
import {View, Modal, SafeAreaView} from 'react-native';
import {styles} from './styles';
import theme from '../../../../../../theme';
import utils from '../../../../../../utils';
import moment from 'moment';
import {Calendar} from 'react-native-calendars';
import Bottom from './components/Bottom';

export default function DateCalender({
  modalObj,
  isModal,
  setIsModal,
  selectedDates,
  setSelectedDates,
  durationTitle,
  minDate,
  maxDate,
}) {
  const {item} = modalObj;
  const {number, title} = item.duration;
  const {startDate, endDate} = item.availablity;
  const all_unavailable_dates = item.unavailable.all_unavailable_dates || [];
  const start_date = moment(startDate).format('YYYY-MM-DD');
  const current_date = moment(new Date()).format('YYYY-MM-DD');
  let totalDays = 0;
  let unavailableDays = {};
  if (title == 'days') totalDays = number;
  else if (title == 'weeks') totalDays = number * 7;
  else if (title == 'months') totalDays = number * 30;
  else if (title == 'years') totalDays = number * 365;

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
    if (totalDays <= 1) {
      datesArray = datesArray[date] = theme.dayStyle.markeDateStyle;
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
      for (let index = 0; index < totalDays; index++) {
        if (selectedDate > moment(endDate).format('YYYY-MM-DD')) {
          break;
        }

        if (unavailableArr.length > 0) {
          let ind = 0;
          ind = unavailableArr.findIndex(element => element === selectedDate);
          if (ind < 0) datesList.push(selectedDate);
          else totalDays++;
        } else datesList.push(selectedDate);

        selectedDate = moment(
          moment(new Date(selectedDate)).add(1, 'day'),
        ).format('YYYY-MM-DD');
      }
      datesList.forEach(item => {
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
            totalDays={totalDays}
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
