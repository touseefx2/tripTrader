import messaging from '@react-native-firebase/messaging';
import PushNotification, {Importance} from 'react-native-push-notification';
import store from '../store';
import axios from 'axios';
import db from '../database/index';
async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}

const createNotificationChannel = () => {
  PushNotification.createChannel(
    {
      channelId: 'TripTradersX3',
      channelName: 'TripTradersX3',
      channelDescription: 'A channel to categorise your notifications', // (optional) default: undefined.
      importance: Importance.HIGH,
      soundName: 'notification.mp3',
      playSound: true,
      vibrate: true,
    },
    created => console.log(`createChannel notification returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
  );
};

const showNotificaton = (message, title, topic, bigIcon, rightIcon, data) => {
  const buttonsList = checkIsButton(topic, data);
  PushNotification.localNotification({
    /* Android Only Properties */
    channelId: 'TripTradersX3', // (required) channelId, if the channel doesn't exist, notification will not trigger.
    actions: buttonsList, // (Android only) See the doc for notification actions to know more
    message: message,
    id: parseInt(Math.random() * 1000000),
    title: title,
    tag: topic,
    invokeApp: true,
    usesChronometer: true,
    smallIcon: 'ic_notification', // (optional) default: "ic_notification" with fallback for "ic_launcher". Use "" for default small icon.
    largeIcon: '', // (optional) default: "ic_launcher". Use "" for no large icon.
    bigPictureUrl: bigIcon,
    largeIconUrl: rightIcon,
    userInfo: data && data?.userData ? data.userData : {},
  });
};

const checkIsButton = (topic, data) => {
  let userFirstName = '';
  if (data && data?.userData) {
    userFirstName = data?.userData?.firstName || '';
  }

  let buttons = [];
  if (topic == 'applyForVerification')
    buttons = ['Apply for Verification', 'Dismiss'];

  if (topic == 'offerRecieved')
    buttons = ['Review Offer Details', `Message ${userFirstName}`];

  if (topic == 'offerAccepted')
    buttons = ['Review Trip Details', `Message ${userFirstName}`];

  if (topic == 'tripStarts')
    buttons = ['Review Trip Details', `Message ${userFirstName}`];

  if (topic == 'tripHosting')
    buttons = ['Review Trip Details', `Message ${userFirstName}`];

  if (topic == 'savedTripExpire')
    buttons = ['Make Offer', `Message ${userFirstName}`];

  if (topic == 'reviewReminder')
    buttons = ['Leave Review', `Message ${userFirstName}`];

  if (topic == 'newTripAdded') buttons = ['See Trip Details', 'No Thanks'];

  if (topic == 'newMessage' || topic == 'newMessagePush')
    buttons = ['Respond', 'Dismiss'];

  return buttons;
};

const callData = async topic => {
  if (store.User.user !== 'guest' && store.User.user) {
    store.Notifications.attemptToGetNotifications(
      store.User.user._id,
      () => {},
    );

    if (
      topic == 'id-notVerified' ||
      topic == 'id-verified' ||
      topic == 'emailVerified'
    ) {
      if (topic == 'emailVerified') store.General.setIsEmailPopup(false);
      store.User.attemptToGetUser();
    }

    if (topic == 'newReview' || topic == 'updateInReview') {
      store.User.attemptToGetReviews(
        store.User.user._id,
        () => {},
        () => {},
      );
    }

    if (topic == 'newMessage' || topic == 'newMessagePush') {
      // store.User.attemptToGetInboxes(store.User.user._id, () => {}, '');
    }
    if (topic == 'offerRecieved') {
      store.Offers.attemptToGetReceiveOffers(
        () => {},
        () => {},
      );
    }
    if (topic == 'offerDecline') {
      store.Offers.attemptToGetSentOffers(
        () => {},
        () => {},
      );
    }
    if (topic == 'offerCancel') {
      store.Offers.attemptToGetReceiveOffers(
        () => {},
        () => {},
      );
    }
    if (topic == 'offerConfirm' || topic == 'offerAccepted') {
      store.Offers.attemptToGetSentOffers(
        () => {},
        () => {},
      );
      store.Offers.attemptToGetConfirmOffers(
        () => {},
        () => {},
      );
      store.Notifications.attemptToGetNotifications(
        store.User.user._id,
        () => {},
      );
    }
    if (topic == 'followUser') {
      store.User.attemptToGetFollowers(
        store.User.user._id,
        () => {},
        () => {},
      );
    }
  }
};

async function sendPaymentFailedNotification(uid) {
  const notificationBody = {
    title: `Your subscription payment failed`,
    userId: uid,
    message: `Please review your payment details. You can update your payment method under Settings`,
    icon: 'https://triptrader-assets.s3.amazonaws.com/dispute-1677063279066.png',
    data: {topic: 'paymentFailed'},
  };

  await axios.post(`${db.apis.BASE_URL}api/user/sendNotification/${uid}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: notificationBody,
  });
}

async function sendMessageNotification(notificationBody) {
  console.log('sendMessageNotification body : ', notificationBody);
  await axios.post(
    `${db.apis.BASE_URL}api/user/sendNotification/${notificationBody.userId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: notificationBody,
    },
  );
}

async function sendMessageNotificationPush(notificationBody) {
  console.log('sendMessageNotificationPush body : ', notificationBody);
  await axios.post(
    `${db.apis.BASE_URL}api/user/sendPushNotification/${notificationBody.userId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: notificationBody,
    },
  );
}

export const Notification = {
  requestUserPermission,
  createNotificationChannel,
  showNotificaton,
  callData,
  sendPaymentFailedNotification,
  sendMessageNotification,
  sendMessageNotificationPush,
};
