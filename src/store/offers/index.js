import {observable, makeObservable, action} from 'mobx';
import {AppState} from 'react-native';
import {persist} from 'mobx-persist';
import db from '../../database/index';
import {Alert} from 'react-native';
import store from '../index';
import NetInfo from '@react-native-community/netinfo';

class offers {
  constructor() {
    makeObservable(this);
  }

  @observable Loader = false;
  @action setLoader = obj => {
    this.Loader = obj;
  };

  @observable Loader2 = false;
  @action setLoader2 = obj => {
    this.Loader2 = obj;
  };

  @observable Loader3 = false;
  @action setLoader3 = obj => {
    this.Loader3 = obj;
  };

  @observable mLoader = false;
  @action setmLoader = obj => {
    this.mLoader = obj;
  };

  @persist('object') @observable sentOffers = [];
  @action setsentOffers = obj => {
    this.sentOffers = obj;
  };

  @persist('object') @observable rcvOffers = [];
  @action setrcvOffers = obj => {
    this.rcvOffers = obj;
  };

  @persist('object') @observable cnfrmOffers = [];
  @action setcnfrmOffers = obj => {
    this.cnfrmOffers = obj;
  };

  @action attemptToGetSentOffers = (setgetdata, setrfrsh) => {
    console.log('Get sent offers true: ');
    this.setLoader(true);

    let token = store.User.authToken;
    let params = store.User.user._id + '&status=pending&type=sent';
    db.hitApi(db.apis.GET_SENT_OFFERS + params, 'get', {}, token)
      ?.then(resp => {
        this.setLoader(false);
        setrfrsh(false);
        console.log(
          `response Get sent offers   ${db.apis.GET_SENT_OFFERS}${params} : true`,
        );
        let dt = resp.data.data || [];
        // console.log(dt);
        setgetdata(true);
        this.setsentOffers(dt);
        return;
      })
      .catch(err => {
        this.setLoader(false);
        setrfrsh(false);
        let msg = err.response.data.message || err.response.status || err;
        console.log(
          `Error in Get sent offers ${db.apis.GET_SENT_OFFERS}${params} : `,
          msg,
        );
        if (msg == 503 || msg == 500) {
          Alert.alert('', 'Server not response');
          // store.General.setisServerError(true);
          return;
        }
        if (msg == 'No records found') {
          setgetdata(true);
          this.setsentOffers([]);

          return;
        }
        // seterror(msg.toString())
        Alert.alert('', msg.toString());
      });
  };

  @action attemptToGetReceiveOffers = (setgetdata, setrfrsh) => {
    console.log('Get receive offers true: ');
    this.setLoader2(true);

    let token = store.User.authToken;
    let params = store.User.user._id + '&status=pending&type=received';
    db.hitApi(db.apis.GET_RECEIVED_OFFERS + params, 'get', {}, token)
      ?.then(resp => {
        this.setLoader2(false);
        setrfrsh(false);
        console.log(
          `response Get receive offers   ${db.apis.GET_RECEIVED_OFFERS}${params} true: `,
        );
        let dt = resp.data.data || [];
        // console.log(dt);
        setgetdata(true);
        this.setrcvOffers(dt);
        return;
      })
      .catch(err => {
        this.setLoader2(false);
        setrfrsh(false);
        let msg = err.response.data.message || err.response.status || err;
        console.log(
          `Error in Get receive offers ${db.apis.GET_RECEIVED_OFFERS}${params} : `,
          msg,
        );
        if (msg == 503 || msg == 500) {
          Alert.alert('', 'Server not response');
          // store.General.setisServerError(true);
          return;
        }
        if (msg == 'No records found') {
          setgetdata(true);
          this.setrcvOffers([]);

          return;
        }
        // seterror(msg.toString())
        Alert.alert('', msg.toString());
      });
  };

  @action attemptToGetConfirmOffers = (setgetdata, setrfrsh) => {
    console.log('Get Confirm  offers true: ');
    this.setLoader3(true);

    let token = store.User.authToken;
    let params = store.User.user._id;
    // let params = `offeredBy=${uid}&offeredTo=${uid}&status=confirmed`;
    db.hitApi(db.apis.GET_CONFIRM_OFFERS + params, 'get', {}, token)
      ?.then(resp => {
        this.setLoader3(false);
        setrfrsh(false);
        console.log(
          `response Get Confirm offers   ${db.apis.GET_CONFIRM_OFFERS}${params} true: `,
        );
        let dt = resp.data.data || [];
        setgetdata(true);
        this.setcnfrmOffers(dt);
        return;
      })
      .catch(err => {
        this.setLoader3(false);
        setrfrsh(false);
        let msg = err.response.data.message || err.response.status || err;
        console.log(
          `Error in Get Confirm offers ${db.apis.GET_CONFIRM_OFFERS}${params} : `,
          msg,
        );
        if (msg == 503 || msg == 500) {
          Alert.alert('', 'Server not response');
          // store.General.setisServerError(true);
          return;
        }
        if (msg == 'No records found') {
          setgetdata(true);
          this.setcnfrmOffers([]);

          return;
        }
        // seterror(msg.toString())
        Alert.alert('', msg.toString());
      });
  };

  @action attemptToCancelOffer = (obj, suc) => {
    console.log('cancel offers true: ');
    store.User.setHomeModalLoder(true);

    let token = store.User.authToken;
    let i = obj.selIndex;
    let tid = obj.item._id;
    db.hitApi(
      db.apis.CANCEL_OFFER + tid,
      'put',
      {
        received: false,
        sent: true,
        isCanceled: true,
      },
      token,
    )
      ?.then(resp => {
        store.User.setHomeModalLoder(false);
        console.log(
          `response cancel offers   ${db.apis.CANCEL_OFFER}${tid} true : `,
        );

        if (resp.data && resp.data.check == 'reload') {
          suc();
          store.General.refreshAlert(resp.data.message);
          return;
        }

        let dt = [...this.sentOffers];
        dt.splice(i, 1);
        this.setsentOffers(dt);
        suc();

        return;
      })
      .catch(err => {
        store.User.setHomeModalLoder(false);

        let msg = err.response.data.message || err.response.status || err;
        console.log(
          `Error in cancel offers ${db.apis.CANCEL_OFFER}${tid}   : `,
          msg,
        );
        if (msg == 503 || msg == 500) {
          Alert.alert('', 'Server not response');
          // store.General.setisServerError(true);
          return;
        }

        // seterror(msg.toString())
        Alert.alert('', msg.toString());
      });
  };

  @action attemptToDeclineOffer = (obj, suc) => {
    console.log('deline offers true: ');
    store.User.setHomeModalLoder(true);

    let token = store.User.authToken;
    let i = obj.selIndex;
    let tid = obj.item._id;
    db.hitApi(
      db.apis.CANCEL_OFFER + tid,
      'put',
      {isCanceled: false, isDeclined: true, received: true},

      token,
    )
      ?.then(resp => {
        store.User.setHomeModalLoder(false);
        console.log(
          `response decline offers   ${db.apis.CANCEL_OFFER}${tid}  : `,
        );

        if (resp.data && resp.data.check == 'reload') {
          suc();
          store.General.refreshAlert(resp.data.message);
          return;
        }

        let dt = [...this.rcvOffers];
        dt.splice(i, 1);
        this.setrcvOffers(dt);
        suc();

        return;
      })
      .catch(err => {
        store.User.setHomeModalLoder(false);

        let msg = err.response.data.message || err.response.status || err;
        console.log(
          `Error in decline offers ${db.apis.CANCEL_OFFER}${tid}   : `,
          msg,
        );
        if (msg == 503 || msg == 500) {
          Alert.alert('', 'Server not response');
          // store.General.setisServerError(true);
          return;
        }

        // seterror(msg.toString())
        Alert.alert('', msg.toString());
      });
  };

  @action attemptToConfirmOffer = (obj, body, suc, closeModal) => {
    console.log('confirm offers body : ', body);
    store.User.setHomeModalLoder(true);

    let token = store.User.authToken;
    let i = obj.selIndex;
    let tid = obj.item._id;
    db.hitApi(db.apis.CONFIRM_OFFERS + tid, 'put', body, token)
      ?.then(resp => {
        store.User.setHomeModalLoder(false);
        console.log(
          `response confirm offers   ${db.apis.CONFIRM_OFFERS}${tid}  true : `,
        );
        if (resp.data && resp.data.check == 'reload') {
          closeModal();
          store.General.refreshAlert(resp.data.message);
          return;
        }

        let dt = [...this.rcvOffers];
        dt.splice(i, 1);
        this.setrcvOffers(dt);
        suc();
        this.attemptToGetConfirmOffers(
          () => {},
          () => {},
        );
        return;
      })
      .catch(err => {
        store.User.setHomeModalLoder(false);

        const msg = err.response.data.message || err.response.status || err;
        console.log(
          `Error in confirm offers ${db.apis.CONFIRM_OFFERS}${tid}   : `,
          msg,
        );
        if (msg == 503 || msg == 500) {
          Alert.alert('', 'Server not response');
          // store.General.setisServerError(true);
          return;
        }

        // seterror(msg.toString())
        Alert.alert('', msg.toString());
      });
  };

  @action clearOffers = () => {
    this.setsentOffers([]);
    this.setrcvOffers([]);
    this.setcnfrmOffers([]);
  };
}
export const Offers = new offers();
