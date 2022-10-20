import {observable, makeObservable, action} from 'mobx';
import {AppState} from 'react-native';
import {persist} from 'mobx-persist';

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

  @persist('object') @observable saveTrips = [];
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
    c.unshift(obj);
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
    console.warn('save trip : ', 'true');
    let c = true;
    this.setstLoader(true);

    setTimeout(() => {
      this.setstLoader(false);
      let dt = this.saveTrips.slice();
      if (dt.length > 0) {
        let ind = dt.findIndex(x => x._id === obj._id);
        if (ind > -1) {
          c = false;
        } else {
          this.addsaveTrips(obj);
        }
      } else {
        let ar = [];
        ar.push(obj);
        this.setsaveTrips(ar);
      }

      suc(obj, i, c);
    }, 700);
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
    this.setconfirmTrips([]);
    this.setsendOffers([]);
    this.setreceiveOffers([]);
  };
}
export const Trips = new trips();
