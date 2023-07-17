import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import store from '../store/index';

// Must be outside of any component LifeCycle (such as `componentDidMount`).

class NotificationManager {
  configure = () => {
    PushNotification.configure({
      // (required) Called when a remote is received or opened, or local notification is opened
      onNotification: function (notification) {
        if (notification) store.General.setgoToo(notification);

        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },

      // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
      onAction: function (notification) {
        if (notification) store.General.setgoToo(notification);
      },

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: false,

      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       * - if you are not using remote notification or do not have Firebase installed, use this:
       *     requestPermissions: Platform.OS === 'ios'
       */
      requestPermissions: true,
    });
  };
}

export const notificationManager = new NotificationManager();
