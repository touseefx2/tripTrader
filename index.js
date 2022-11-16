import 'react-native-gesture-handler';
import React from 'react';
import {AppRegistry, LogBox} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {configure} from 'mobx';
import {Provider} from 'mobx-react';
import store from './src/store/index';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';

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
    channelId: 'triptraders', // (required)
    channelName: 'triptraders', // (required)
    channelDescription: 'A channel to categorise your notifications', // (optional) default: undefined.
    playSound: true, // (optional) default: true
    soundName: 'sound.mp3', // (optional) See `soundName` parameter of `localNotification` function
    importance: 4, // (optional) default: 4. Int value of the Android notification importance
    vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
  },
  created => console.log(`createChannel notification returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
);

const callData = (topic, rid) => {
  if (topic == 'newMessage') {
    store.User.attemptToGetInboxes(
      store.User.user._id,
      () => {},
      () => {},
    );
    if (rid != '') {
      const socket = store.General.socket;
      console.log('join rommmmmmmmmm in ntfctn');
      let username = store.User.user.firstName + ' ' + store.User.user.lastName;
      socket.emit('joinRoom', {username, roomName: rid});
      socket.on('message', d => {
        console.log('sock on data ', d.message);

        // store.User.attemptToGetInboxes(
        //   store.User. user._id,
        //   () => {},
        //   () => {},
        // );
      });
    }
  }
  if (topic == 'offerRecived') {
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
  if (topic == 'offerConfirm') {
    store.Offers.attemptToGetSentOffers(
      () => {},
      () => {},
    );
    store.Offers.attemptToGetConfirmOffers(
      () => {},
      () => {},
    );
  }
};

messaging().onMessage(async remoteMessage => {
  console.warn('remot message frontEnd  : ', remoteMessage);
  let title = remoteMessage.notification?.title || '';
  let message = remoteMessage.notification?.body || '';
  let data = remoteMessage.data ? remoteMessage.data : '';
  let topic = data.topic || '';
  let roomId = data.chatRoomId || '';
  callData(topic, roomId);

  if (store.Notifications.isShowNotifcation) {
    store.Notifications.clearShowNotifications();
  }

  // PushNotification.localNotification({
  //   message: message,
  //   title: title,
  // });

  store.Notifications.setisShowNotifcation(true);
  store.Notifications.setNotifcationTitle(message);
  store.Notifications.setNotifcationData(data);
});

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.warn('remot message background  : ', remoteMessage);

  let title = remoteMessage.notification?.title || '';
  let message = remoteMessage.notification?.body || '';
  let data = remoteMessage.data ? remoteMessage.data : '';
  let topic = data.topic;
  let roomId = data.chatRoomId || '';
  callData(topic, roomId);
});

function MainApp() {
  return (
    <Provider {...store}>
      <App />
    </Provider>
  );
}

AppRegistry.registerComponent(appName, () => MainApp);
