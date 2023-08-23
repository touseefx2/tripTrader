import React from "react";
import { Alert } from "react-native";
import moment from "moment";
import store from "../store";

function isObjectEmpty(value) {
  return (
    Object.prototype.toString.call(value) === "[object Object]" &&
    JSON.stringify(value) === "{}"
  );
}

function CheckisAlreadySaveTrip(obj, saveTripData) {
  if (saveTripData.length > 0) {
    let ind = saveTripData.findIndex(({ tripId }) => tripId?._id === obj?._id);
    if (ind > -1) {
      return true;
    }
  }
  return false;
}

function formatTitle(num, title) {
  let text = "";
  if (num <= 1) {
    text = title.substring(0, title.trim().length - 1);
  } else {
    text = title;
  }
  return title;
}

function checkSameYearFormate(statDate, endDate) {
  let dateText = "";

  const startDateYear = parseInt(new Date(statDate).getFullYear());
  const endDateYear = parseInt(new Date(endDate).getFullYear());

  if (startDateYear == endDateYear) {
    dateText =
      moment(statDate).format("MMM DD") +
      " - " +
      moment(endDate).format("MMM DD, YYYY");
  } else {
    dateText =
      moment(statDate).format("MMM DD, YYYY") +
      " - " +
      moment(endDate).format("MMM DD, YYYY");
  }

  return dateText;
}

function findItem(value, data, check) {
  let obj = check === "n" ? { name: value } : { title: value };

  if (data.length > 0) {
    const findIndex =
      check === "n"
        ? data.findIndex((x) => x.name === value)
        : data.findIndex((x) => x.title === value);
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
  const arrr = arr.map((e) => DateWithoutFormat(e));

  return arrr;
}

function getDateWithFormat(unavlblmarkedDates) {
  let text = "";

  let dates = [];
  let dateArr = [];

  Object.keys(unavlblmarkedDates).forEach(function (key) {
    dates.push(key);
  });

  const sortDates = dates.sort(function (a, b) {
    return Number(new Date(a)) - Number(new Date(b));
  });
  sortDates.forEach((item) => {
    dateArr.push(moment(item).format("MMM DD"));
  });

  let arr = [];
  const dateArrCopy = dateArr.slice();
  dateArr.forEach((item, index) => {
    let datesLists = [];
    datesLists.push({ d: item });
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
          datesLists.push({ d: element });
          delete dateArr[index];
        } else break;
      }
    }

    arr.push(datesLists);
  });

  arr.forEach((item) => {
    if (item.length > 1) {
      //   text =
      //     text +
      //     moment(item[0].d).format('MMM DD') +
      //     '-' +
      //     moment(item[item.length - 1].d)
      //       .format('MMM DD')
      //       .slice(4, 6) +
      //     ', ';
      // } else text = text + moment(item[0].d).format('MMM DD') + ', ';

      text = text + item[0].d + "-" + item[item.length - 1].d + ", ";
    } else text = text + item[0].d + ", ";
  });

  return text.replace(/, *$/, "");
}

function getWeekDaysBtwnDate(daysOfWeeks, minDate, maxDate) {
  const selecteDays = daysOfWeeks.filter((item) => {
    return item.isSel;
  });
  let arr = {};
  var start = moment(minDate);
  var end = moment(maxDate);
  selecteDays.forEach((element) => {
    const day = element.num; // Sunday=0
    var result = [];
    let tmp = start.clone().day(day);
    if (tmp.isAfter(start, "d")) result.push(tmp.format("YYYY-MM-DD"));

    while (tmp.isBefore(end)) {
      tmp.add(7, "days");
      result.push(tmp.format("YYYY-MM-DD"));
    }
    result.pop();
    result.forEach((element2) => {
      const date = moment(element2).format("YYYY-MM-DD");
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
  totalDays
) {
  let obj = null;
  let weekText = "";

  let selectedDays = [];
  daysOfWeeks.forEach((item) => {
    if (item.isSel) selectedDays.push(item.name);
  });
  selectedDays.forEach((item, index, arr) => {
    let sep = arr[index + 2] == undefined ? " and " : ", ";
    if (sep == " and " && index == arr.length - 1) sep = "";

    weekText = weekText + item + sep;
  });
  if (weekText != "") weekText = weekText + " (weekly)";
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

  const noOfDays = moment(maxDate).diff(moment(minDate), "days") + 1;
  const availabeDays = noOfDays - dateList.length;

  if (availabeDays < totalDays) {
    Alert.alert("", "Total available dates is less then duration number days");
    return;
  }

  if (selectedDays.length > 0 || dateList.length > 0) {
    obj = {
      repeatEvery: {
        endRepeatOn: new Date(),
        value: 1,
        title: "days",
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

function capitalizeTheFirstLetterOfEachWord(words) {
  var separateWord = words.split(" ");
  for (var i = 0; i < separateWord.length; i++) {
    separateWord[i] =
      separateWord[i].charAt(0).toUpperCase() + separateWord[i].substring(1);
  }
  return separateWord.join(" ");
}

function FormatePreferDate(selectedDates) {
  let text = "";
  let datesArr = [];
  if (selectedDates.length > 0) {
    selectedDates.forEach((item) => {
      datesArr.push(moment(item).format("MMM DD, YYYY"));
    });
  }
  if (datesArr.length > 0) {
    const startDate = datesArr[0];
    if (datesArr.length > 1) {
      const endDate = datesArr[datesArr.length - 1];

      const startDateYear = parseInt(new Date(startDate).getFullYear());

      const endDateYear = parseInt(new Date(endDate).getFullYear());

      if (startDateYear == endDateYear) {
        text =
          moment(startDate).format("MMM DD") +
          " - " +
          moment(endDate).format("MMM DD, YYYY");
      } else {
        text = startDate + " - " + endDate;
      }
    } else if (datesArr.length <= 1) {
      text = startDate;
    }
  }

  return text;
}

function FormateAvailableDate(startDate, endDate) {
  let text = "";

  const firstDate = startDate;
  const firstDateYear = parseInt(new Date(firstDate).getFullYear());
  const secondDate = endDate;
  const secondDateYear = parseInt(new Date(secondDate).getFullYear());
  if (firstDateYear == secondDateYear) {
    text =
      moment(firstDate).format("MMM DD") +
      " - " +
      moment(secondDate).format("MMM DD, YYYY");
  } else {
    text =
      moment(firstDate).format("MMM DD, YYYY") +
      " - " +
      moment(secondDate).format("MMM DD, YYYY");
  }

  return text;
}

function DateWithoutFormat(date) {
  return new Date(date).toISOString().slice(0, 10);
}

function formatSelectedDates(selectedDates, c) {
  let text = "";
  let arr = [];
  if (c != "arr") {
    const size = Object.keys(selectedDates).length;
    for (let index = 0; index < size; index++) {
      const element = moment(Object.keys(selectedDates)[index]).format(
        "YYYY-MM-DD"
      );
      arr.push(element);
    }
  } else {
    selectedDates.forEach((item) => {
      arr.push(moment(item).format("YYYY-MM-DD"));
    });
  }

  if (arr.length <= 1) {
    text = moment(arr[0]).format("MMM DD, YYYY");
  } else {
    text = moment(arr[0]).format("MMM DD, YYYY");
    arr.forEach((item, index) => {
      if (index > 0 && index < arr.length) {
        const prevDate = moment(arr[index - 1])
          .add(1, "day")
          .format("YYYY-MM-DD");

        const mapDate = item;
        const mapDate2 = moment(item).add(1, "day").format("YYYY-MM-DD");
        const nextDate = moment(arr[index + 1]);

        if (moment(mapDate).isSame(prevDate)) {
          if (!moment(mapDate2).isSame(nextDate)) {
            text = text + " - " + moment(item).format("MMM DD, YYYY");
          }
        } else {
          text = text + ", " + moment(item).format("MMM DD, YYYY");
        }
      }
    });
  }

  return text;
}

const checkAvailability = (
  availablityDates,
  unAvailable,
  setAvailablityDates,
  setUnAvailble,
  title,
  durNum
) => {
  if (availablityDates && durNum !== "") {
    let totalDays = 0;
    if (title === "days") totalDays = durNum;
    else if (title === "weeks") totalDays = durNum * 7;

    let availablityDatesLength = Object.keys(availablityDates).length;
    let unAvailableDaysLength = 0;
    if (unAvailable) {
      unAvailableDaysLength = unAvailable.allUnavailableDates.length;
    }

    availablityDatesLength = availablityDatesLength - unAvailableDaysLength;
    if (availablityDatesLength < totalDays) {
      setAvailablityDates(null);
      setUnAvailble(null);
    }
  }
};

const getDate = (unixTimestamp) => {
  // Convert Unix timestamp to milliseconds
  var milliseconds = unixTimestamp * 1000;

  // Create a new Date object using the milliseconds
  var date = new Date(milliseconds);

  // Define month names
  var monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Get the month, day, and year
  var month = monthNames[date.getMonth()];
  var day = date.getDate();
  var year = date.getFullYear();

  // Create the formatted date string
  var formattedDate = `${month} ${day}, ${year}`;

  return formattedDate;
};

const isSubscribeDateEnd = (unixTimestamp) => {
  const currentDate = new Date();
  // Convert Unix timestamp to milliseconds
  const milliseconds = unixTimestamp * 1000;
  // Create a new Date object using the milliseconds
  const subscribeEndDate = new Date(milliseconds);

  return currentDate > subscribeEndDate;
};

const checkError = (err) => {
  let msg = "error";
  if (err) {
    msg =
      err?.response?.data?.error?.message ||
      err?.response?.data?.message ||
      err?.response?.status ||
      err;
  }
  return msg;
};

function addMonths(date, months) {
  var d = date.getDate();
  date.setMonth(date.getMonth() + +months);
  if (date.getDate() != d) {
    date.setDate(0);
  }
  return date;
}

const checkUserPalnStatus = (props, isCheck = true) => {
  const { user, userSubscription, Logout } = store.User;
  const { setgoto } = store.General;

  if (user === "guest") {
    setgoto("guestaccess");
    Logout();
    return false;
  }

  if (
    isCheck &&
    ((userSubscription &&
      userSubscription?.status !== "active" &&
      isSubscribeDateEnd(userSubscription?.current_period_end)) ||
      !userSubscription)
  ) {
    props.navigation.navigate("Plan");
    return false;
  }

  return true;
};

const isUserFreemium = () => {
  const { userSubscription } = store.User;

  return (
    (userSubscription &&
      userSubscription?.status !== "active" &&
      isSubscribeDateEnd(userSubscription?.current_period_end)) ||
    !userSubscription
  );
};

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
  capitalizeTheFirstLetterOfEachWord,
  FormatePreferDate,
  FormateAvailableDate,
  formatSelectedDates,
  DateWithoutFormat,
  checkAvailability,
  getDate,
  checkError,
  addMonths,
  isSubscribeDateEnd,
  checkUserPalnStatus,
  isUserFreemium,
};
