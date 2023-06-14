import {observable, makeObservable, action} from 'mobx';
import db from '../../database/index';
import {Alert} from 'react-native';
import store from '../index';

class trips {
  constructor() {
    makeObservable(this);
  }

  @observable saveLoader = false;
  @observable deleteLoader = false;
  @observable confirmTripsSendMessageLoader = false;
  @action setSaveLoader = obj => {
    this.saveLoader = obj;
  };
  @action setDeleteLoader = obj => {
    this.deleteLoader = obj;
  };
  @action setconfirmTripsSendMessageLoader = obj => {
    this.confirmTripsSendMessageLoader = obj;
  };

  @observable isloadFirst = false;
  @action setisloadFirst = obj => {
    this.isloadFirst = obj;
  };

  @observable saveTripss = [];
  @action setsaveTripss = obj => {
    this.saveTripss = obj;
  };

  @observable saveTrips = [];
  @action setsaveTrips = obj => {
    this.saveTrips = obj;
  };
  @action deletesetsaveTrips = (ind, suc) => {
    let c = this.saveTrips.slice();
    c.splice(ind, 1);
    this.setsaveTrips(c);
    suc();
  };
  @action addsaveTrips = obj => {
    let c = this.saveTrips.slice();
    // c.unshift(obj);
    c.push(obj);
    this.setsaveTrips(c);
  };
  @action attemptToDeleteTrip = (item, ind, suc) => {
    console.warn('delete  save trip  : ', 'true');
    this.setDeleteLoader(true);
    setTimeout(() => {
      this.setDeleteLoader(false);
      this.deletesetsaveTrips(ind, suc);
    }, 1000);
  };

  @action attemptToSaveTrip = (obj, i, suc) => {
    this.setSaveLoader(true);
    const body = {tripId: obj._id, hostId: obj?.hostId?._id};
    console.log('Save Trip Body : ', body);
    const uid = store.User.user._id;
    const token = store.User.authToken;
    db.hitApi(db.apis.SAVE_TRIP + uid, 'put', body, token)
      ?.then(resp => {
        console.log(`response Save Trip   ${db.apis.SAVE_TRIP} true : `);

        if (resp.data && resp.data.check == 'reload') {
          this.setSaveLoader(false);
          store.General.refreshAlert(resp.data.message);
          return;
        }

        this.setSaveLoader(false);
        suc(obj);
        const rsp = resp.data.data.savedTrips || [];
        this.setsaveTrips(rsp);
        return;
      })
      .catch(err => {
        this.setSaveLoader(false);
        let msg = err.response.data.message || err.response.status || err;
        console.log(`Error in Save Trip ${db.apis.SAVE_TRIP} : `, msg);
        if (msg == 503 || msg == 500) {
          Alert.alert('', 'Server not response');

          return;
        }

        Alert.alert('', msg.toString());
      });
  };

  @action attemptTounSaveTrip = (
    screen,
    obj,
    i,
    suc,
    data,
    setdata,
    d,
    setd,
  ) => {
    const body = {tripId: obj._id, hostId: obj?.hostId?._id};
    console.log('unSave Trip Body : ', body);
    this.setDeleteLoader(true);
    const uid = store.User.user._id;
    const token = store.User.authToken;
    db.hitApi(db.apis.UNSAVE_TRIP + uid, 'put', body, token)
      ?.then(resp => {
        this.setDeleteLoader(false);
        console.log(`response unSave Trip ${db.apis.UNSAVE_TRIP} : true `);
        if (resp.data && resp.data.check == 'reload') {
          suc();
          store.General.refreshAlert(resp.data.message);
          return;
        }
        const rsp = resp.data.data.savedTrips || [];
        this.setsaveTrips(rsp);
        if (screen == 'home') {
          suc();
        } else {
          const dt = [...this.saveTrips];
          const dt1 = [...d];
          const dt2 = [...data];

          if (dt.length > 0) {
            let ind = dt.findIndex(({tripId}) => tripId?._id === obj?._id);
            if (ind > -1) {
              dt.splice(ind, 1);
            }
          }
          if (dt1.length > 0) {
            dt1.splice(i, 1);
          }
          if (dt2.length > 0) {
            dt2.splice(i, 1);
          }

          this.LoadMore(dt1, dt2, setd, setdata);
          suc();
        }
      })
      .catch(err => {
        this.setDeleteLoader(false);
        const msg = err.response.data.message || err.response.status || err;
        console.log(`Error in unSave Trip ${db.apis.UNSAVE_TRIP} : `, msg);
        if (msg == 503 || msg == 500) {
          Alert.alert('', 'Server not response');

          return;
        }

        Alert.alert('', msg.toString());
      });
  };

  @action LoadMore = async (d, data, setd, setdata) => {
    let ar = [...d];
    const dt = ar.slice(data.length, data.length + 1);
    let dd = [...data, ...dt];
    setd(d);
    setdata(dd);
  };

  @action unSaveTrip = (obj, i, tdatdata, sea, d, setd, suc) => {
    let body = {
      savedTrips: dt,
    };

    console.log('unSave Trip Body : ', body);
    this.setDeleteLoader(true);
    let uid = store.User.user._id;
    let token = store.User.authToken;
    db.hitApi(db.apis.SAVE_TRIP + uid, 'put', body, token)
      ?.then(resp => {
        this.setDeleteLoader(false);
        console.log(
          `response unSave Trip   ${db.apis.SAVE_TRIP} : `,
          resp.data,
        );

        let rsp = resp.data.data.savedTrips || [];
        this.setsaveTrips(rsp);
        // setd(dt1);
        // setdata(dt2);
        this.LoadMore(dt1, dt2, setd, setdata);
        suc();
        return;
      })
      .catch(err => {
        this.setDeleteLoader(false);
        let msg = err.response.data.message || err.response.status || err;
        console.log(`Error in unSave Trip ${db.apis.SAVE_TRIP} : `, msg);
        if (msg == 503 || msg == 500) {
          Alert.alert('', 'Server not response');
          // store.General.setisServerError(true);
          return;
        }
        // seterror(msg.toString())
        Alert.alert('', msg.toString());
      });
  };

  @observable confirmTrips = [];
  @action setconfirmTrips = obj => {
    this.confirmTrips = obj;
  };
  @action attemptToMessageSend = (obj, suc) => {
    console.warn('message send  : ', 'true');
    this.setconfirmTripsSendMessageLoader(true);
    setTimeout(() => {
      this.setconfirmTripsSendMessageLoader(false);
      suc(true);
    }, 1000);
  };

  @action attemptToAcceptOffer = (obj, suc) => {
    console.warn('accept offer  : ', 'true');
    this.setconfirmTripsSendMessageLoader(true);
    setTimeout(() => {
      this.setconfirmTripsSendMessageLoader(false);
      suc(true);
    }, 1200);
  };

  @observable sendOffers = [];
  @action setsendOffers = obj => {
    this.sendOffers = obj;
  };

  @observable receiveOffers = [];
  @action setreceiveOffers = obj => {
    this.receiveOffers = obj;
  };

  @action clearTrips = () => {
    this.setsaveTrips([]);
    this.setisloadFirst(false);
    this.setsaveTripss([]);
    this.setconfirmTrips([]);
    this.setsendOffers([]);
    this.setreceiveOffers([]);
  };
}
export const Trips = new trips();
