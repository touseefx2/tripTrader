import moment from 'moment-timezone';

export const getCurrentDateTime = (timezone, datee) => {
  const date = moment(datee).tz(timezone);
  const formattedDate = date.format('YYYY-MM-DD'); // format the date as desired
  const formattedTime = date.format('hh:mm:ss A z'); // format the time as desired
  console.log(
    `Current date/time in ${timezone}: ${formattedDate} ${formattedTime}`,
  );
};
// 33.691803, 73.044799
const getTimeZoneFromLocation = async (latitude, longitude) => {
  const apiUrl = `https://maps.googleapis.com/maps/api/timezone/json?location=${latitude},${longitude}&timestamp=${
    Date.now() / 1000
  }&key=AIzaSyC75RWT0q9xkASq2YhX2vGi1R-e_p2pnWU`;
  const response = await fetch(apiUrl);
  console.log('response : ', response);

  const data = await response.json();
  console.log('data : ', data);

  return data.timeZoneId;
};

export const getCurrentTimeZone = async () => {
  try {
    const timeZone = await getTimeZoneFromLocation(33.691803, 73.044799);
    console.log(timeZone); // logs the time zone of the device's current location
  } catch (error) {
    console.error(error);
  }
};
