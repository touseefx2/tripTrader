//online link  ec2
// const BASE_URL = 'http://ec2-13-126-235-46.ap-south-1.compute.amazonaws.com/';
//local link
const BASE_URL = 'http://10.7.148.90:3001/';

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
const CHANGE_PASSWORD = 'api/user/changePassword/';
const SUBSCRIBE_TOPIC = 'api/pushnotification/subscribeToTopic';
const CHECK_PROMO = 'api/code?code=';
const GET_All_PROMOS_BY_ID = 'api/promocode/getActiveCodes?city=';
const GET_All_Plan = 'api/plan?status=active';
const VERIFY_PIN = 'api/user/password/verifyOtp';
const UPD_PSWD = 'api/user/password/reset';
const IS_PHONE_EXIST = 'api/user/verifyPhoneNumber?phone=';

const CREATE_TRIP = 'api/trip';
const UPDATE_TRIP = 'api/trip/';
const DELETE_TRIP = 'api/trip/';
const GET_ALL_TRIP = 'api/trip?hostId=';
const GET_ALL_REVIEWS = 'api/user/reviews/';
const REPLY_REVIEW = 'api/review/replyToReview/';
const EDIT_REVIEW = 'api/review/updateAReview/';
const DELETE_REVIEW = 'api/review/deleteAReview/';
const DELETE_MY_REVIEW = 'api/review/';
const DISPUTE_REVIEW = 'api/review/';
const SUBMIT_SUPPORT = '';
const GET_ALL_HOME_TRIPS = 'api/trip/search?blockedUsers=';
const GET_ALL_HOME_TRIPS_GUEST = 'api/trip?status=active';

const GET_STATE = 'api/state?status=active';
const GET_SPECIES = 'api/species?status=active';
const GET_ACTIVITY = 'api/type?status=active';

const GET_FOLLOWERS = 'api/user/followers/';
const GET_FOLLOWING = 'api/user/following/';
const GET_BLOCK_USER = 'api/user/blockedUsers/';

const BLOCK_USER = 'api/user/blockAUser/';
const UNBLOCK_USER = 'api/user/unBlockAUser/';
const FOLLOW_USER = 'api/user/followAUser/';
const UNFOLLOW_USER = 'api/user/unFollowAUser/';

const OFFER_SEND = 'api/offer';

const SAVE_TRIP = 'api/user/';

const CHECK_FIRST_MESSAGE = 'api/chat/checkifconversationexists/';
const SEND_FIRST_MESSAGE = 'api/chat/sendFirstMessage';
const SEND_SECOND_MESSAGE = 'api/chat/replyToChat/';
const SEND_REPORT_USER = 'api/report';

const GET_INBOXES_BY_UID = 'api/chat/myAllChats?userId=';

// const GET_All_Meesages = 'api/chat/messages/';
const GET_All_Meesages = 'api/chat/messages/';
const READ_All_Meesages = 'api/chat/readMessages/';

// const DELETE_CHAT = 'api/chat/deleteAChat/';
const DELETE_CHAT = 'api/chat/deleteAChat/';

const DELETE_TRIP_PHOTO = 'api/trip/deleteImage/';

const CHECK_REVIEW = 'api/review/checkIfAlreadyReviewed/';
const LEAVE_REVIEW = 'api/review';
const UPDATE_LEAVE_REVIEW = 'api/review/updateAReview/';

const GET_LATEST_TRIP = 'api/review/getLatestTrip/v2/';

const GET_NOTIFICATIONS = 'api/notification/count/app?userId=';
const READ_NOTIFICATIONS = 'api/notification/';

const GET_SENT_OFFERS = 'api/offer?offeredBy=';
const GET_RECEIVED_OFFERS = 'api/offer?offeredTo=';

const CANCEL_OFFER = 'api/offer/declineTrip/';
const CONFIRM_OFFERS = 'api/offer/confirmTrip/';
const GET_CONFIRM_OFFERS = 'api/offer/getConfirmedTrips/';

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

  CREATE_TRIP,
  UPDATE_TRIP,
  GET_ALL_TRIP,
  GET_ALL_REVIEWS,
  REPLY_REVIEW,
  EDIT_REVIEW,
  DELETE_REVIEW,
  DELETE_MY_REVIEW,
  DISPUTE_REVIEW,
  SUBMIT_SUPPORT,
  DELETE_TRIP,
  GET_ALL_HOME_TRIPS_GUEST,
  GET_ALL_HOME_TRIPS,
  GET_STATE,
  GET_SPECIES,
  GET_ACTIVITY,

  GET_FOLLOWERS,
  GET_FOLLOWING,
  GET_BLOCK_USER,

  FOLLOW_USER,
  UNFOLLOW_USER,
  BLOCK_USER,
  UNBLOCK_USER,

  OFFER_SEND,

  SAVE_TRIP,
  CHECK_FIRST_MESSAGE,
  SEND_FIRST_MESSAGE,
  SEND_SECOND_MESSAGE,
  SEND_REPORT_USER,
  GET_INBOXES_BY_UID,
  DELETE_CHAT,
  DELETE_TRIP_PHOTO,

  CHECK_REVIEW,
  LEAVE_REVIEW,
  UPDATE_LEAVE_REVIEW,
  GET_LATEST_TRIP,

  GET_NOTIFICATIONS,
  READ_NOTIFICATIONS,

  GET_SENT_OFFERS,
  GET_RECEIVED_OFFERS,
  GET_CONFIRM_OFFERS,
  CANCEL_OFFER,
  CONFIRM_OFFERS,
  GET_All_Meesages,
  READ_All_Meesages,
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
