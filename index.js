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

messaging().onMessage(async notification => {
  console.warn('remot message front end  : ', notification);

  // let data = notification.data ? notification.data : null;
  // let topic = data?.topic || '';

  // let title = notification.notification.title || '';
  // let msg = notification.notification.body || '';

  // if (topic !== 'settings updated') {
  //   PushNotification.localNotification({
  //     channelId: 'fdc2',
  //     message: msg,
  //     title: title,
  //     // bigPictureUrl: remoteMessage.notification.android.imageUrl,
  //     // smallIcon: remoteMessage.notification.android.imageUrl,
  //   });

  //   if (store.User.user) {
  //     store.Orders.getOrderById();
  //   }
  // } else {
  //   store.Food.getSliderImagesOnly();
  // }

  // if (topic == 'promo') {
  //   store.Promos.getPromoById();
  // }
});

messaging().setBackgroundMessageHandler(async notification => {
  console.warn('background ntfctn msg : ', notification);
  // let data = notification.data ? notification.data : null;
  // let topic = data?.topic || '';

  // let title = notification.notification.title || '';
  // let msg = notification.notification.body || '';

  // if (topic !== 'settings updated') {
  //   if (store.User.user) {
  //     store.Orders.getOrderById();
  //   }
  // } else {
  //   store.Food.getSliderImagesOnly();
  // }

  // if (topic == 'promo') {
  //   store.Promos.getPromoById();
  // }
});

function MainApp() {
  return (
    <Provider {...store}>
      <App />
    </Provider>
  );
}

AppRegistry.registerComponent(appName, () => MainApp);
