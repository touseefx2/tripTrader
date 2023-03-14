import 'react-native-gesture-handler';
import React from 'react';
import {AppRegistry, LogBox} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {configure} from 'mobx';
import {Provider} from 'mobx-react';
import store from './src/store/index';
import messaging from '@react-native-firebase/messaging';
import PushNotification, {Importance} from 'react-native-push-notification';
configure({useProxies: 'never'});
LogBox.ignoreAllLogs(true);

requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
};
requestUserPermission();
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

const callData = topic => {
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

    if (topic == 'newMessage') {
      store.User.attemptToGetInboxes(store.User.user._id, () => {});
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

messaging().onMessage(async remoteMessage => {
  const obj = JSON.parse(remoteMessage.data.notifee);
  console.log('remot message frontend  : ', obj);
  const title = obj?.title || '';
  const message = obj?.body || '';
  const data = obj?.data || null;
  const topic = data?.topic || '';
  const bigIcon = data?.icon || data?.bigIcon || undefined;
  const rightIcon = data?.rightIcon || undefined;
  console.log('title : ', title);
  console.log('message : ', message);
  console.log('data : ', data);
  console.log('topic : ', topic);
  console.log('bigIcon : ', bigIcon);
  console.log('rightIcon : ', rightIcon);
  callData(topic);
  showNotifcaton(message, title, topic, bigIcon, rightIcon, data);

  // if (store.Notifications.isShowNotifcation) {
  //   store.Notifications.clearShowNotifications();
  // }
  // if (
  //   store.User.isNotification &&
  //   store.User.user !== 'guest' &&
  //   store.User.user
  // ) {
  //   store.Notifications.setisShowNotifcation(true);
  //   store.Notifications.setNotifcationTitle(title || message);
  //   store.Notifications.setNotifcationData(data);
  // }
});

messaging().setBackgroundMessageHandler(async remoteMessage => {
  const obj = JSON.parse(remoteMessage.data.notifee);
  console.log('remot message background  : ', obj);
  const title = obj?.title || '';
  const message = obj?.body || '';
  const data = obj?.data || null;
  const topic = data?.topic || '';
  const bigIcon = data?.icon || data?.bigIcon || undefined;
  const rightIcon = data?.rightIcon || undefined;
  console.log('title : ', title);
  console.log('message : ', message);
  console.log('data : ', data);
  console.log('topic : ', topic);
  console.log('bigIcon : ', bigIcon);
  console.log('rightIcon : ', rightIcon);
  callData(topic);
  showNotifcaton(message, title, topic, bigIcon, rightIcon, data);

  // const roomId = data.chatRoomId || '';
});

const showNotifcaton = (message, title, topic, bigIcon, rightIcon, data) => {
  const buttonsList = checkIsButton(topic, data);
  PushNotification.localNotification({
    /* Android Only Properties */
    channelId: 'TripTradersX3', // (required) channelId, if the channel doesn't exist, notification will not trigger.
    actions: buttonsList, // (Android only) See the doc for notification actions to know more
    message: message,
    title: title,
    tag: topic,
    invokeApp: false,
    usesChronometer: true,
    smallIcon: 'ic_notification', // (optional) default: "ic_notification" with fallback for "ic_launcher". Use "" for default small icon.
    largeIcon: '', // (optional) default: "ic_launcher". Use "" for no large icon.
    bigPictureUrl: bigIcon,
    largeIconUrl: rightIcon,
    allowWhileIdle: false,
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

  if (topic == 'newMessage') buttons = ['Respond', 'Dismiss'];

  return buttons;
};

function MainApp() {
  return (
    <Provider {...store}>
      <App />
    </Provider>
  );
}

// function HeadlessCheck({isHeadless}) {
//   console.warn('isHeadless : ', isHeadless);
//   if (isHeadless) {
//     // App has been launched in the background by iOS, ignore
//     return null;
//   }
//   return <MainApp />;
// }

AppRegistry.registerComponent(appName, () => MainApp);
