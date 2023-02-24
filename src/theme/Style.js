const title = '#000000';
const subTitleLight = 'rgba(17, 17, 17, 0.4)';
const fontMedium = 'Poppins-Medium';
const button1 = '#3C6B49';
const buttonText = '#FAFAFA';

const unavailableDaysStyle = {
  container: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#cccccc',
    borderStyle: 'dashed',
  },
  text: {
    color: subTitleLight,
    fontFamily: fontMedium,
  },
};
const selectedDaysStyle = {
  container: {
    backgroundColor: button1,
  },
  text: {
    color: buttonText,
    fontFamily: fontMedium,
    top: 2,
  },
};

const markeDateStyle = {
  customStyles: selectedDaysStyle,
  marked: false,
  selected: true,
  selectedColor: button1,
  disabled: false,
  disableTouchEvent: false,
};

const calenderTheme = {
  textDisabledColor: subTitleLight,
  dayTextColor: title,
  textDayFontSize: 13,
  textDayFontFamily: fontMedium,
  textDayHeaderFontSize: 13,
  textSectionTitleColor: title,
  textDayHeaderFontFamily: fontMedium,
};

export default dayStyle = {
  unavailableDaysStyle,
  selectedDaysStyle,
  markeDateStyle,
  calenderTheme,
};
