import {observable, makeObservable, action} from 'mobx';
import {AppState} from 'react-native';
import {persist} from 'mobx-persist';
import db from '../../database/index';
import {Alert} from 'react-native';
import store from '../index';
import NetInfo from '@react-native-community/netinfo';

class notifications {
  constructor() {
    makeObservable(this);
  }

  @observable Loader = false;
  @action setLoader = obj => {
    this.Loader = obj;
  };

  @persist('object') @observable notifications = [];
  @action setnotifications = obj => {
    this.notifications = obj;
  };

  @persist('object') @observable unread = 0;
  @action.bound
  setunRead(val) {
    this.unread = val;
  }

  @action attemptToGetNotifications = (uid, setgetdata, setrfrsh) => {
    console.warn('GetNotifications true: ');
    this.setLoader(true);

    let token = store.User.authToken;
    db.hitApi(db.apis.GET_NOTIFICATIONS + uid, 'get', {}, token)
      ?.then(resp => {
        this.setLoader(false);
        setrfrsh(false);
        console.log(
          `response GetNotifications   ${db.apis.GET_NOTIFICATIONS} : `,
          resp.data,
        );
        let dt = resp.data.data || [];
        let count = 0;
        // let count = resp.data.count[0].count_notread || 0;

        setgetdata(true);
        this.setnotifications(dt);
        this.setunRead(count);
        return;
      })
      .catch(err => {
        this.setLoader(false);
        setrfrsh(false);
        let msg = err.response.data.message || err.response.status || err;
        console.log(
          `Error in GetNotifications ${db.apis.GET_NOTIFICATIONS} : `,
          msg,
        );
        if (msg == 503 || msg == 500) {
          Alert.alert('', 'Server not response');
          // store.General.setisServerError(true);
          return;
        }
        if (msg == 'No records found') {
          setgetdata(true);
          this.setnotifications([]);
          this.setunRead(0);
          return;
        }
        // seterror(msg.toString())
        Alert.alert('', msg.toString());
      });
  };

  @action attemptToGetNotificationsGuest = () => {
    console.warn('GetNotifications Guest true: ');
    this.setLoader(true);
    const dt2 = [
      {
        title: 'Get full access for free',
        message:
          'As a member, you’ll unlock all features and benefits for the best experience.',
        createdAt: new Date(),
        topic: 'fullaccess',
        isRead: false,
      },
      {
        title: 'Welcome to Trip Trader!',
        message:
          'We’re excited you’re here. Feel free to browse the community as a guest before signing up.',
        createdAt: new Date(),
        isRead: true,
      },
    ];
    setTimeout(() => {
      this.setnotifications(dt2);
      this.setLoader(false);
      this.setunRead(1);
    }, 1000);
  };

  @action clearNotifications = () => {
    this.setnotifications([]);
    this.setunRead(0);
  };
}
export const Notifications = new notifications();