//Local

const BASE_URL = 'http://192.168.100.4:3001/';
// 'http://ec2-35-175-134-9.compute-1.amazonaws.com/';
//socket url
const BASE_URLS = 'http://192.168.100.4:3001/';
// 'http://ec2-35-175-134-9.compute-1.amazonaws.com:3001';

//apis
const GET_CITIES_AREAS = 'api/area/getAllAreas';
const GET_SLIDER_IMAGES = 'api/settings';
const GET_FOOD_CATEGORY = 'api/category/getAllCategories?branch=';
const PLACE_ORDER = 'api/orders';
const REGISTER_USER = 'api/user';
const UPDATE_USER = 'api/user/';
const BUY_PLAN = 'api/stripe';
const CARD_INFO = 'api/stripe?customerId=';
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
const EDIT_REPLY = 'api/review/editAReply/';
const DELETE_REVIEW = 'api/review/deleteAReview/';
const DELETE_MY_REVIEW = 'api/review/';
const DISPUTE_REVIEW = 'api/review/';
const SUBMIT_SUPPORT = 'api/support';
const GET_ALL_HOME_TRIPS = 'api/trip/search?';
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
const SAVE_TRIP = 'api/user/saveTrip/';
const UNSAVE_TRIP = 'api/user/unSaveTrip/';
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
// const UPDATE_LEAVE_REVIEW = 'api/review/updateAReview/';
const UPDATE_LEAVE_REVIEW = 'api/review/editAReply/';
const GET_LATEST_TRIP = 'api/review/getLatestTrip/v2/';
// const GET_NOTIFICATIONS = 'api/notification/count/app?userId=';
const GET_NOTIFICATIONS = 'api/notification/app/';
const READ_NOTIFICATIONS = 'api/notification/markRead/';
const GET_SENT_OFFERS = 'api/offer?offeredBy=';
const GET_RECEIVED_OFFERS = 'api/offer?offeredTo=';
const GET_CONFIRM_OFFERS = 'api/offer/getConfirmedTrips/';
const CANCEL_OFFER = 'api/offer/declineTrip/';
const CONFIRM_OFFERS = 'api/offer/confirmTrip/';
const RESEND_VERIFICATION_LINK = 'api/user/resendEmail';

export default apis = {
  BASE_URL,
  BASE_URLS,
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
  EDIT_REPLY,
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
  UNSAVE_TRIP,
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
  BUY_PLAN,
  CARD_INFO,
  RESEND_VERIFICATION_LINK,
};
