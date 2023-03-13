import moment from 'moment';
import {Alert} from 'react-native';

function isObjectEmpty(value) {
  return (
    Object.prototype.toString.call(value) === '[object Object]' &&
    JSON.stringify(value) === '{}'
  );
}

function CheckisAlreadySaveTrip(obj, saveTripData) {
  if (saveTripData.length > 0) {
    let ind = saveTripData.findIndex(({tripId}) => tripId._id === obj._id);
    if (ind > -1) {
      return true;
    }
  }
  return false;
}

function formatTitle(num, title) {
  let text = '';
  if (num <= 1) {
    text = title.substring(0, title.length - 1);
  } else {
    text = title;
  }
  return title;
}

function checkSameYearFormate(statDate, endDate) {
  let dateText = '';

  const startDateYear = parseInt(new Date(statDate).getFullYear());
  const endDateYear = parseInt(new Date(endDate).getFullYear());

  if (startDateYear == endDateYear) {
    dateText =
      moment(statDate).format('MMM DD') +
      ' - ' +
      moment(endDate).format('MMM DD, YYYY');
  } else {
    dateText =
      moment(statDate).format('MMM DD, YYYY') +
      ' - ' +
      moment(endDate).format('MMM DD, YYYY');
  }

  return dateText;
}

function findItem(value, data, check) {
  let obj = check == 'n' ? {name: value} : {title: value};

  if (data.length > 0) {
    const findIndex =
      check == 'n'
        ? data.findIndex(x => x.name === value)
        : data.findIndex(x => x.title === value);
    if (findIndex > -1) obj = data[findIndex];
  }

  return obj;
}

function getDaysBetweenDate(start, end) {
  for (
    var arr = [], date = new Date(start);
    date <= new Date(end);
    date.setDate(date.getDate() + 1)
  ) {
    arr.push(new Date(date));
  }
  return arr;
}

function getDateWithFormat(unavlblmarkedDates) {
  let text = '';

  let dates = [];
  let dateArr = [];

  Object.keys(unavlblmarkedDates).forEach(function (key) {
    dates.push(key);
  });

  const sortDates = dates.sort(function (a, b) {
    return Number(new Date(a)) - Number(new Date(b));
  });
  sortDates.forEach(item => {
    dateArr.push(moment(item).format('MMM DD'));
  });

  let arr = [];
  const dateArrCopy = dateArr.slice();
  dateArr.forEach((item, index) => {
    let datesLists = [];
    datesLists.push({d: item});
    delete dateArr[index];
    let num = index;
    let count = 0;
    for (let index = ++num; index < dateArrCopy.length; index++) {
      const element = dateArrCopy[index];
      if (item.slice(0, 3) == element.slice(0, 3)) {
        let number1 = item.slice(4, 6);
        let number2 = element.slice(4, 6);
        count++;
        if (Number(number1) + count == Number(number2)) {
          datesLists.push({d: element});
          delete dateArr[index];
        } else break;
      }
    }

    arr.push(datesLists);
  });

  arr.forEach(item => {
    if (item.length > 1) {
      text =
        text +
        moment(item[0].d).format('MMM D') +
        '-' +
        moment(item[item.length - 1].d)
          .format('MMM D')
          .slice(4, 6) +
        ', ';
    } else text = text + moment(item[0].d).format('MMM D') + ', ';
  });

  return text.replace(/, *$/, '');
}

function getWeekDaysBtwnDate(daysOfWeeks, minDate, maxDate) {
  const selecteDays = daysOfWeeks.filter(item => {
    return item.isSel;
  });
  let arr = {};
  var start = moment(minDate);
  var end = moment(maxDate);
  selecteDays.forEach(element => {
    const day = element.num; // Sunday=0
    var result = [];
    let tmp = start.clone().day(day);
    if (tmp.isAfter(start, 'd')) result.push(tmp.format('YYYY-MM-DD'));

    while (tmp.isBefore(end)) {
      tmp.add(7, 'days');
      result.push(tmp.format('YYYY-MM-DD'));
    }
    result.pop();
    result.forEach(element2 => {
      const date = moment(element2).format('YYYY-MM-DD');
      arr[date] = theme.dayStyle.unMarkeDateStyle;
    });
  });

  return isObjectEmpty(arr) ? null : arr;
}

function getUnavailableDaysObject(
  daysOfWeeks,
  unavailableDates,
  unavailableWeeksDates,
  unavailableDatesText,
  minDate,
  maxDate,
  totalDays,
) {
  let obj = null;
  let weekText = '';

  let selectedDays = [];
  daysOfWeeks.forEach(item => {
    if (item.isSel) selectedDays.push(item.name);
  });
  selectedDays.forEach((item, index, arr) => {
    let sep = arr[index + 2] == undefined ? ' and ' : ', ';
    if (sep == ' and ' && index == arr.length - 1) sep = '';

    weekText = weekText + item + sep;
  });
  if (weekText != '') weekText = weekText + ' (weekly)';
  let weeksDate = [];
  let specificDates = [];
  let dateList = [];
  if (unavailableDates) {
    Object.keys(unavailableDates).forEach(function (key) {
      dateList.push(key);
      specificDates.push(key);
    });
  }
  if (unavailableWeeksDates) {
    Object.keys(unavailableWeeksDates).forEach(function (key) {
      dateList.push(key);
      weeksDate.push(key);
    });
  }
  weeksDate.sort(function (a, b) {
    return Number(new Date(a)) - Number(new Date(b));
  });
  specificDates.sort(function (a, b) {
    return Number(new Date(a)) - Number(new Date(b));
  });
  dateList.sort(function (a, b) {
    return Number(new Date(a)) - Number(new Date(b));
  });

  const noOfDays = moment(maxDate).diff(moment(minDate), 'days') + 1;
  const availabeDays = noOfDays - dateList.length;

  if (availabeDays < totalDays) {
    Alert.alert('', 'Total available dates is less then duration number days');
    return;
  }

  if (selectedDays.length > 0 || dateList.length > 0) {
    obj = {
      repeatEvery: {
        endRepeatOn: new Date(),
        value: 1,
        title: 'days',
      },
      daysOfWeek: selectedDays,
      unavailableDaysOfWeek: weeksDate,
      excludeSpecificDates: specificDates,
      allUnavailableDates: [...new Set(dateList)],
      dayWeekText: weekText,
      excludeDateText: unavailableDatesText,
    };
  }

  return obj;
}

export const functions = {
  isObjectEmpty,
  findItem,
  getDaysBetweenDate,
  getDateWithFormat,
  getWeekDaysBtwnDate,
  getUnavailableDaysObject,
  checkSameYearFormate,
  formatTitle,
  CheckisAlreadySaveTrip,
};
