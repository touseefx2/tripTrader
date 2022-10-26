//online link  ec2
// const BASE_URL = 'http://ec2-13-126-235-46.ap-south-1.compute.amazonaws.com/';
//local link
const BASE_URL = 'http://192.168.0.108:3001/';

//apis
const GET_CITIES_AREAS = 'api/area/getAllAreas';
const GET_SLIDER_IMAGES = 'api/settings';
const GET_FOOD_CATEGORY = 'api/category/getAllCategories?branch=';
const PLACE_ORDER = 'api/orders';
const REGISTER_USER = 'api/user';
const UPDATE_USER = 'api/user/';
const FORGOT_PSWD = 'api/user/password/forgot';
const LOGIN_USER = 'api/user/login';
const IMAGE_UPLOAD = 'api/upload';
const GET_USER_BY_ID = 'api/user?_id=';
const GET_ORDERS_BY_USER_ID = 'api/orders?customer=';
const GET_FAVRT_FOOD_LIST_BY_USER_ID = 'api/orders?customer=';
const GET_ADDRESS_BY_USER_ID = 'api/orders?customer=';
const SET_FAVRT_FOOD_LIST_BY_USER_ID = 'api/orders?customer=';
const REMOVE_FAVRT_FOOD_LIST_BY_USER_ID = 'api/orders?customer=';
const ADD_ADDRESS_BY_USER_ID = 'api/orders?customer=';
const REMOVE_ADDRESS_BY_USER_ID = 'api/orders?customer=';
const CHANGE_PASSWORD = 'api/users/changePassword/';
const SUBSCRIBE_TOPIC = 'api/pushnotification/subscribeToTopic';
const CHECK_PROMO = 'api/code?code=';
const GET_All_PROMOS_BY_ID = 'api/promocode/getActiveCodes?city=';
const GET_All_Plan = 'api/plan?status=active';
const VERIFY_PIN = 'api/user/password/verifyOtp';
const UPD_PSWD = 'api/user/password/reset';
const IS_PHONE_EXIST = 'api/user/verifyPhoneNumber?phone=';

export default apis = {
  BASE_URL,
  GET_CITIES_AREAS,
  GET_SLIDER_IMAGES,
  GET_FOOD_CATEGORY,
  PLACE_ORDER,
  REGISTER_USER,
  UPDATE_USER,
  LOGIN_USER,
  IMAGE_UPLOAD,
  GET_USER_BY_ID,
  GET_ORDERS_BY_USER_ID,
  GET_FAVRT_FOOD_LIST_BY_USER_ID,
  GET_ADDRESS_BY_USER_ID,
  SET_FAVRT_FOOD_LIST_BY_USER_ID,
  REMOVE_FAVRT_FOOD_LIST_BY_USER_ID,
  ADD_ADDRESS_BY_USER_ID,
  REMOVE_ADDRESS_BY_USER_ID,
  CHANGE_PASSWORD,
  SUBSCRIBE_TOPIC,
  CHECK_PROMO,
  GET_All_PROMOS_BY_ID,
  GET_All_Plan,
  FORGOT_PSWD,
  VERIFY_PIN,
  UPD_PSWD,
  IS_PHONE_EXIST,
};

// const login = 'user/loginCaptain';
// const OWNER_REG_EP = 'user/addCaptain';
// const updateUser = 'user/updateUser/';
// const updateTerms = 'user/termsAccepted/';
// const uploadFile = 'upload/uploadFile';
// const getCar = 'vehicle?owner=';
// const getUserById = 'user?_id=';
// const getTripsbyId = 'trip/getTrips?_id=';
// const acceptTrip = 'trip/acceptTrip/';
// const skipTrip = 'user/skipTrip/';
// const arriveTrip = 'trip/arriveTrip/';
// const startTrip = 'trip/startTrip/';
// const endTrip = 'trip/endTrip/';
// const getAvgRating = 'user/getAverageRating?user=';
// const cancelTrip = 'trip/cancelTrip/';
// const addTripRating = 'trip/rateCustomer/';
// const paycashEqual = 'trip/paybill/';
// const paycashExtra = 'trip/paybill/addtodebit/';
// const paycashLess = 'trip/paybill/addtocredit/';

// const getcustomerWalletinfo = 'transaction_history/getHistoryByUser?user=';

// const gettripbyUserwithDate = 'user/tripbyuser?user=';
// const getportalwithDate = 'user/captainPortal?user=';
// const gettotaltripCalculationwithDate = 'user/getTripRecord?user=';

// const getTripDispute = 'dispute?trip=';
// const addTripDispute = 'dispute/add';

// const getTripTransctionHistory = 'transaction_history/getHistoryByTrip?trip=';

// const GET_BRANDS = 'company?is_active=true';
// const GET_ALL_CAR_NAMES = 'car_name?is_active=true';
// const GET_VEHICLE_TYPE = 'vehicle_type';
// const ADD_CAR = 'vehicle/add';
// const UPDATE_CAR = 'vehicle/';
// const UPDATE_USER = 'user/updateUser/';
// const GET_NOTIFICATION = 'notification/getNotification/';
// const UPDATE_NOTIFICATION = 'notification/readNotification/';
