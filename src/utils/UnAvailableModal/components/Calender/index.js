import React, { useState } from "react";
import { View, SafeAreaView, Modal } from "react-native";
import { styles } from "./styles";
import theme from "../../../../theme";
import Bottom from "./components/Bottom";
import { Calendar } from "react-native-calendars";

export default function RangeCalender({
  isShowCalender,
  setIsShowCalender,
  minDate,
  maxDate,
  unavailableDates,
  setUnavailableDates,
  unavailableWeeksDates,
}) {
  const [dateList, setDateList] = useState(unavailableDates);

  const closeCalender = () => {
    setIsShowCalender(false);
  };
  const onClickApply = () => {
    setUnavailableDates(dateList);
    closeCalender();
  };

  const clearSelectedDates = () => {
    setDateList(null);
  };

  const getSelectedDayEvents = (day) => {
    const selectedDate = day.dateString;

    if (!dateList) {
      let markDates = {};
      markDates[selectedDate] = theme.dayStyle.markeDateStyle;
      setDateList(markDates);
    } else {
      let markDates = { ...dateList };
      const date = markDates[selectedDate];
      if (date !== undefined) delete markDates[selectedDate];
      else markDates[selectedDate] = theme.dayStyle.markeDateStyle;

      setDateList(markDates);
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
            minDate={minDate}
            maxDate={maxDate}
            onDayPress={getSelectedDayEvents}
            monthFormat={"MMMM yyyy"}
            firstDay={7}
            enableSwipeMonths={true}
            disableAllTouchEventsForDisabledDays={false}
            markingType="custom"
            markedDates={{
              ...dateList,
              ...unavailableWeeksDates,
            }}
          />
          <Bottom
            onClickApply={onClickApply}
            closeModal={closeCalender}
            clearSelectedDates={clearSelectedDates}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
}
