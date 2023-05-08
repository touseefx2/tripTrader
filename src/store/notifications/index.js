import {observable, makeObservable, action} from 'mobx';
import {persist} from 'mobx-persist';
import db from '../../database/index';
import {Alert} from 'react-native';
import store from '../index';

class notifications {
  constructor() {
    makeObservable(this);
  }

  //panle ntctn
  @observable Loader = false;
  @action setLoader = obj => {
    this.Loader = obj;
  };

  @persist('object') @observable notifications = [];
  @action setnotifications = obj => {
    this.notifications = obj;
  };

  @persist('object') @observable notificationsTotal = 0;
  @action setnotificationsTotal = obj => {
    this.notificationsTotal = obj;
  };

  @persist('object') @observable unread = 0;
  @action.bound
  setunRead(val) {
    this.unread = val;
  }

  @action attemptToGetNotifications = (uid, setgetdata) => {
    console.log('GetNotifications  : ');
    this.setLoader(true);
    const route = uid + '?page=1&limit=10000';
    const token = store.User.authToken;
    db.hitApi(db.apis.GET_NOTIFICATIONS + route, 'get', {}, token)
      ?.then(resp => {
        this.setLoader(false);
        console.log(
          `response GetNotifications   ${
            db.apis.GET_NOTIFICATIONS + route
          } : true `,
        );
        const dt = resp.data.data || [];
        const count = resp.data.count[0].unRead || 0;
        setgetdata(true);
        // this.setnotificationsTotal();
        this.setnotifications(dt);
        this.setunRead(count);
        return;
      })
      .catch(err => {
        this.setLoader(false);
        const msg = err.response.data.message || err.response.status || err;
        console.log(
          `Error in GetNotifications ${db.apis.GET_NOTIFICATIONS + route} : `,
          msg,
        );
        if (msg == 503 || msg == 500) {
          // Alert.alert('', 'Server not response');
          return;
        }
        if (msg == 'No records found') {
          setgetdata(true);
          this.setnotifications([]);
          this.setnotificationsTotal(0);
          this.setunRead(0);
          return;
        }

        // Alert.alert('', msg.toString());
      });
  };

  @action attemptToReadNotifications = nid => {
    console.log('Read Notification true: ');
    this.setLoader(true);
    let token = store.User.authToken;
    let route = store.User.user._id + '/' + nid;
    db.hitApi(db.apis.READ_NOTIFICATIONS + route, 'put', {}, token)
      ?.then(resp => {
        // console.log(
        //   `response Read Notification   ${
        //     db.apis.READ_NOTIFICATIONS + route
        //   } : `,
        //   resp.data,
        // );

        let count = this.unread;
        if (count >= 1) {
          count--;
          this.setunRead(count);
        }

        return;
      })
      .catch(err => {
        const msg = err.response.data.message || err.response.status || err;
        console.log(
          `Error in Read Notification ${db.apis.READ_NOTIFICATIONS + route} : `,
          msg,
        );
      });
  };

  @action attemptToGetNotificationsGuest = () => {
    console.log('GetNotifications Guest true: ');
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
    this.setnotificationsTotal(0);
    this.setunRead(0);
  };
}
export const Notifications = new notifications();
