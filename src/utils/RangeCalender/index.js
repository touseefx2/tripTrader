import React, {useState} from 'react';
import {View, SafeAreaView, Modal, Alert} from 'react-native';
import {styles} from './styles';
import theme from '../../theme';
import utils from '../../utils';
import Bottom from './components/Bottom';
import {Calendar} from 'react-native-calendars';
import moment from 'moment';

export default function RangeCalender({
  isShowCalender,
  setIsShowCalender,
  availablityDates,
  setAvailablityDates,
  setUnAvailble,
  title,
  durationNum,
  minDate,
  totalDays,
}) {
  const [markedDates, setMarkedDates] = useState(availablityDates);

  let isDisable = true;
  if (markedDates && Object.keys(markedDates).length > 1) isDisable = false;

  const closeCalender = () => {
    setIsShowCalender(false);
  };
  const onClickApply = () => {
    setAvailablityDates(markedDates);
    setUnAvailble(null);
    closeCalender();
  };

  const getSelectedDayEvents = day => {
    const selectedDate = day.dateString;
    let dateList = {};
    if (!markedDates) {
      dateList[selectedDate] = theme.dayStyle.markeDateStyle;
      setMarkedDates(dateList);
      return;
    } else {
      dateList = {...markedDates};
      const size = Object.keys(dateList).length;

      if (dateList[selectedDate] !== undefined) {
        console.log('The key exists.');

        if (size < 2) {
          delete dateList[selectedDate];
          setMarkedDates(null);
          return;
        } else {
          let startDate = Object.keys(dateList)[0];
          let endDate = Object.keys(dateList)[size - 1];
          let marksDateList = {};
          if (startDate < selectedDate)
            marksDateList[startDate] = theme.dayStyle.markeDateStyle;
          else marksDateList[endDate] = theme.dayStyle.markeDateStyle;

          setMarkedDates(marksDateList);
          return;
        }
      } else {
        console.log('The key does not exist.');
        if (size >= 2) return;

        let startDate = Object.keys(dateList)[0];
        let minDate = '';
        let maxDate = '';
        if (startDate > selectedDate) {
          maxDate = startDate;
          minDate = selectedDate;
        } else {
          maxDate = selectedDate;
          minDate = startDate;
        }
        const date1 = moment(maxDate);
        const date2 = moment(minDate);
        const no_of_days = date1.diff(date2, 'days') + 1;

        if (no_of_days < totalDays) {
          Alert.alert(
            '',
            'Date range must be greater or equal than trip duration',
          );
          return;
        }

        const dayList = utils.functions.getDaysBetweenDate(
          new Date(minDate),
          new Date(maxDate),
        );
        let marksDateList = {};
        if (dayList.length > 0) {
          dayList.map((item, index, arr) => {
            const date = moment(item).format('YYYY-MM-DD');
            if (index == 0) marksDateList[date] = theme.dayStyle.markeDateStyle;

            if (index > 0 && index < arr.length - 1)
              marksDateList[date] = theme.dayStyle.markeDateStyle;

            if (index == arr.length - 1)
              marksDateList[date] = theme.dayStyle.markeDateStyle;
          });
        }

        setMarkedDates(marksDateList);
        return;
      }
    }
  };

  return (
    <Modal visible={isShowCalender} transparent onRequestClose={closeCalender}>
      <SafeAreaView style={styles.container}>
        <View style={styles.container2}>
          <Calendar
            theme={theme.dayStyle.calenderTheme}
            hideDayNames={false}
            hideArrows={false}
            hideExtraDays={false}
            disableMonthChange={true}
            initialDate={minDate}
            minDate={new Date()}
            // minDate={minDate}
            onDayPress={getSelectedDayEvents}
            monthFormat={'MMMM yyyy'}
            firstDay={7}
            enableSwipeMonths={true}
            disableAllTouchEventsForDisabledDays={true}
            disableAllTouchEventsForInactiveDays={true}
            markingType="custom"
            markedDates={{...markedDates}}
          />
          <Bottom
            title={title}
            durNum={durationNum}
            isDisable={isDisable}
            onClickApply={onClickApply}
            closeModal={closeCalender}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
}
