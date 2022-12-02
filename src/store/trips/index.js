import {observable, makeObservable, action} from 'mobx';
import {AppState} from 'react-native';
import {persist} from 'mobx-persist';
import db from '../../database/index';
import {Alert} from 'react-native';
import store from '../index';
import NetInfo from '@react-native-community/netinfo';

class trips {
  constructor() {
    makeObservable(this);
  }

  @observable stLoader = false;
  @observable dLoader = false;
  @observable confirmTripsSendMessageLoader = false;
  @action setstLoader = obj => {
    this.stLoader = obj;
  };
  @action setdLoader = obj => {
    this.dLoader = obj;
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
    this.setdLoader(true);
    setTimeout(() => {
      this.setdLoader(false);
      this.deletesetsaveTrips(ind, suc);
    }, 1000);
  };

  @action attemptToSaveTrip = (obj, i, suc) => {
    let dt = this.saveTrips.slice();
    if (dt.length > 0) {
      let ind = dt.findIndex(x => x._id === obj._id);
      if (ind > -1) {
        suc({}, i, false);
        return;
      } else {
        this.SaveTrip(obj, i, suc);
        return;
      }
    } else {
      this.SaveTrip(obj, i, suc);
      return;
    }
  };

  @action SaveTrip = (obj, i, suc) => {
    let dt = [...this.saveTrips];
    let body = {
      savedTrips: dt,
    };
    body.savedTrips.push(obj._id);
    console.warn('Save Trip Body : ', body);
    this.setstLoader(true);
    let uid = store.User.user._id;
    let token = store.User.authToken;
    db.hitApi(db.apis.SAVE_TRIP + uid, 'put', body, token)
      ?.then(resp => {
        this.setstLoader(false);
        console.log(`response Save Trip   ${db.apis.SAVE_TRIP} : `, resp.data);
        let rsp = resp.data.data.savedTrips || [];
        // let dt = this.saveTrips.slice();
        // // if (dt.length > 0) {
        // //   this.addsaveTrips(obj);
        // // } else {
        // //   let ar = [];
        // //   ar.push(obj);
        // //   this.setsaveTrips(ar);
        // // }
        this.setsaveTrips(rsp);

        suc(obj, i, true);
        return;
      })
      .catch(err => {
        this.setstLoader(false);
        let msg = err.response.data.message || err.response.status || err;
        console.log(`Error in Save Trip ${db.apis.SAVE_TRIP} : `, msg);
        if (msg == 503 || msg == 500) {
          Alert.alert('', 'Server not response');
          // store.General.setisServerError(true);
          return;
        }
        // seterror(msg.toString())
        Alert.alert('', msg.toString());
      });
  };

  @action unSaveTrip = (obj, i, data, setdata, suc) => {
    let dt = [...this.saveTrips];
    let dt2 = [...data];

    if (dt.length > 0) {
      let ind = dt.findIndex(x => x._id === obj._id);
      if (ind > -1) {
        dt.splice(ind, 1);
      }
    }
    if (dt2.length > 0) {
      dt2.splice(i, 1);
    }

    let body = {
      savedTrips: dt,
    };

    console.log('unSave Trip Body : ', body);
    this.setdLoader(true);
    let uid = store.User.user._id;
    let token = store.User.authToken;
    db.hitApi(db.apis.SAVE_TRIP + uid, 'put', body, token)
      ?.then(resp => {
        this.setdLoader(false);
        console.log(
          `response unSave Trip   ${db.apis.SAVE_TRIP} : `,
          resp.data,
        );

        let rsp = resp.data.data.savedTrips || [];
        this.setsaveTrips(rsp);

        setdata(dt2);

        suc();

        return;
      })
      .catch(err => {
        this.setdLoader(false);
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
