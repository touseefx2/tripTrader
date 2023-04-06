import 'react-native-gesture-handler';
import React from 'react';
import {AppRegistry, LogBox} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {configure} from 'mobx';
import {Provider} from 'mobx-react';
import store from './src/store/index';
import messaging from '@react-native-firebase/messaging';
import {notificationManager} from './src/services/NotificationManager';
import {Notification} from './src/services/Notification';
configure({useProxies: 'never'});
LogBox.ignoreAllLogs(true);

Notification.requestUserPermission();
Notification.createNotificationChannel();
notificationManager.configure();

const onReceiveNotification = remoteMessage => {
  const obj = remoteMessage.data;
  const title = obj?.title || '';
  const message = obj?.message || '';
  const data = JSON.parse(obj?.data) || null;
  const topic = data?.topic || '';
  const bigIcon = data?.icon || data?.bigIcon || undefined;
  const rightIcon = data?.rightIcon || undefined;
  Notification.showNotificaton(message, title, topic, bigIcon, rightIcon, data);
  Notification.callData(topic);
};

messaging().onMessage(async remoteMessage => {
  console.log('remot message frontend  : ', remoteMessage);
  onReceiveNotification(remoteMessage);
});

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('remot message background  : ', remoteMessage);
  onReceiveNotification(remoteMessage);
});

function MainApp() {
  return (
    <Provider {...store}>
      <App />
    </Provider>
  );
}

// function HeadlessCheck({isHeadless}) {
//   console.log('isHeadless : ', isHeadless);
//   if (isHeadless) {
//     // App has been launched in the background by iOS, ignore
//     return null;
//   }
//   return <MainApp />;
// }

AppRegistry.registerComponent(appName, () => MainApp);
