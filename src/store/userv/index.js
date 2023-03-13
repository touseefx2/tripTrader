import {observable, makeObservable, action} from 'mobx';
import {persist} from 'mobx-persist';
import store from '../index';
import NetInfo from '@react-native-community/netinfo';
import db from '../../database/index';
import {Alert} from 'react-native';
import io from 'socket.io-client';
class userv {
  constructor() {
    makeObservable(this);
  }

  @observable plans = false;
  @action setplans = obj => {
    this.plans = obj;
  };

  @observable isNotification = true;

  @action setisNotification = obj => {
    this.isNotification = obj;
  };

  @observable gl = false;
  @action setgl = obj => {
    this.gl = obj;
  };

  @observable vuser = false;
  @observable fscreen = '';

  @observable user = false;

  @observable followers = [];
  @observable totalfollowers = 0;
  @observable following = [];
  @observable totalfollowing = 0;
  @observable blockUsers = [];
  @observable totalblockUsers = 0;
  @observable fl = false;
  @observable bl = false;

  @action setfollowers = obj => {
    this.followers = obj;
  };
  @action settotalfollowers = obj => {
    this.totalfollowers = obj;
  };
  @action setfollowing = obj => {
    this.following = obj;
  };
  @action settotalfollowing = obj => {
    this.totalfollowing = obj;
  };
  @action setblockUsers = obj => {
    this.blockUsers = obj;
  };
  @action removeblockUsers = ind => {
    this.blockUsers.splice(ind, 1);
  };
  @action settotalblockUsers = obj => {
    this.totalblockUsers = obj;
  };
  @action setfl = obj => {
    this.fl = obj;
  };
  @action setbl = obj => {
    this.bl = obj;
  };

  @action attemptToGetFollowers = (
    uid,
    setgetdata,
    sflwrs,
    sflwng,
    setdt,
    setr,
  ) => {
    console.warn('GET Followers  : ', 'true');
    setr(true);

    db.hitApi(db.apis.GET_FOLLOWERS + uid, 'get', {}, this.authToken)
      ?.then(resp => {
        setr(false);

        console.log(
          `response GET Followers   ${db.apis.GET_FOLLOWERS + uid} : `,
          resp.data,
        );
        let dt = resp.data.follower || [];
        setgetdata(true);
        // this.setfollowers(dt);
        // this.settotalfollowers(dt.length);
        setdt(dt);
        sflwrs(dt.length);
      })
      .catch(err => {
        setr(false);

        let msg = err.response.data.message || err.response.status || err;
        console.log(
          `Error in GET Followers  ${db.apis.GET_FOLLOWERS + uid} : `,
          msg,
        );
        if (msg == 503 || msg == 500) {
          Alert.alert('', 'Server not response');
          // store.General.setisServerError(true);
          return;
        }
        if (msg == 'No records found') {
          // this.setfollowers([]);
          // this.settotalfollowers(0);
          setdt([]);
          sflwrs(0);
          return;
        }
        // seterror(msg.toString())
        Alert.alert('', msg.toString());
      });
  };
  @action attemptToGetFollowing = (
    uid,
    setgetdata,

    sflwrs,
    sflwng,
    setdt,
    setr,
  ) => {
    console.warn('GET Followers  : ', 'true');
    setr(true);

    db.hitApi(db.apis.GET_FOLLOWING + uid, 'get', {}, this.authToken)
      ?.then(resp => {
        setr(false);

        // console.log(
        //   `response GET FOLLOWING  ${db.apis.GET_FOLLOWING + uid} : `,
        //   resp.data,
        // );
        let dt = resp.data.following || [];
        // console.log('dttt flwng : ', dt);
        setgetdata(true);
        // this.setfollowing(dt);
        // this.settotalfollowing(dt.length);
        setdt(dt);
        sflwng(dt.length);
      })
      .catch(err => {
        setr(false);

        let msg = err.response.data.message || err.response.status || err;
        console.log(
          `Error in GET FOLLOWING ${db.apis.GET_FOLLOWING + uid} : `,
          msg,
        );
        if (msg == 503 || msg == 500) {
          Alert.alert('', 'Server not response');
          // store.General.setisServerError(true);
          return;
        }
        if (msg == 'No records found') {
          // this.setfollowing([]);
          // this.settotalfollowing(0);
          setdt([]);
          sflwng(0);
          return;
        }
        // seterror(msg.toString())
        Alert.alert('', msg.toString());
      });
  };
  @action attemptToGetBloackUsers = (uid, setgetdata, setrfrsh) => {
    console.warn('GET BloackUsers : ', 'true');
    this.setfl(true);

    db.hitApi(db.apis.GET_BLOCK_USER + uid, 'get', {}, this.authToken)
      ?.then(resp => {
        this.setfl(false);
        setrfrsh(false);
        console.log(
          `response GET BloackUsers ${db.apis.GET_BLOCK_USER + uid} : `,
          resp.data,
        );
        let dt = resp.data.blocked || [];
        setgetdata(true);
        this.setblockUsers(dt);
        this.settotalblockUsers(dt.length);
      })
      .catch(err => {
        this.setfl(false);
        setrfrsh(false);
        let msg = err.response.data.message || err.response.status || err;
        console.log(
          `Error in GET BloackUsers ${db.apis.GET_BLOCK_USER + uid} : `,
          msg,
        );
        if (msg == 503 || msg == 500) {
          Alert.alert('', 'Server not response');
          // store.General.setisServerError(true);
          return;
        }
        if (msg == 'No records found') {
          this.setblockUsers([]);
          this.settotalblockUsers(0);
          return;
        }
        // seterror(msg.toString())
        Alert.alert('', msg.toString());
      });
  };

  attemptToUnblockUser(uid, ind, suc) {
    console.warn('UnblockUser  true : ');
    this.setbl(true);
    let c = this.user._id + '/' + uid;
    db.hitApi(db.apis.UNBLOCK_USER + c, 'put', {}, this.authToken)
      ?.then(resp => {
        this.setbl(false);
        console.log(
          `response UnblockUser  ${db.apis.UNBLOCK_USER + c} : `,
          resp.data,
        );
        // let rsp = resp.data.data;
        this.removeblockUsers(ind);
        suc();
      })
      .catch(err => {
        this.setbl(false);
        let msg = err.response.data.message || err.response.status || err;
        console.log(
          `Error in UnblockUser  ${db.apis.UNBLOCK_USER} ${c}  : `,
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
  }

  attemptToBlockUser(uid, ind, suc) {
    console.warn('blockUser  true : ');
    this.setbl(true);
    let c = this.user._id + '/' + uid;
    db.hitApi(db.apis.BLOCK_USER + c, 'put', {}, this.authToken)
      ?.then(resp => {
        this.setbl(false);
        console.log(
          `response blockUser  ${db.apis.BLOCK_USER + c} : `,
          resp.data,
        );
        // let rsp = resp.data.data;
        // this.removeblockUsers(ind);
        suc();
      })
      .catch(err => {
        this.setbl(false);
        let msg = err.response.data.message || err.response.status || err;
        console.log(`Error in blockUser  ${db.apis.BLOCK_USER} ${c}  : `, msg);
        if (msg == 503 || msg == 500) {
          Alert.alert('', 'Server not response');
          // store.General.setisServerError(true);
          return;
        }
        // seterror(msg.toString())
        Alert.alert('', msg.toString());
      });
  }

  @observable phn = '';

  @observable cntr = '';
  @observable pwc = '';

  @action setphn = obj => {
    this.phn = obj;
  };
  @action setcntr = obj => {
    this.cntr = obj;
  };
  @action setpwc = obj => {
    this.pwc = obj;
  };

  @persist('object') @observable email = '';
  @persist('object') @observable pswd = '';
  @persist('object') @observable sp = false;

  //other users
  @observable reviewLoader = false;
  @observable tripsLoader = false;
  @observable photosLoader = false;
  @observable mLoader = false;
  @observable otherUserModalLoader = false;

  @observable review = [];

  @persist('object') @observable Hometrips = [];
  @action setHomeTrips = obj => {
    this.Hometrips = obj;
  };
  @observable HomeLoader = false;
  @action setHomeLoader = obj => {
    this.HomeLoader = obj;
  };
  @observable homeRefrsh = false;
  @action sethomeRefrsh = obj => {
    this.homeRefrsh = obj;
  };

  @persist('object') @observable trips = [];
  @persist('object') @observable photos = [];
  @observable photosRefrsh = false;

  @observable reviewo = [];
  @observable tripso = [];
  @observable photoso = [];
  @observable reviewLoadero = false;
  @observable tripsLoadero = false;
  @observable photosLoadero = false;
  @observable mLoadero = false;

  @action setotherUserModalLoader = obj => {
    this.otherUserModalLoader = obj;
  };

  @action setreviewLoader = obj => {
    this.reviewLoader = obj;
  };
  @action settripLoader = obj => {
    this.tripsLoader = obj;
  };
  @action setphotosLoader = obj => {
    this.photosLoader = obj;
  };
  @action setmLoader = obj => {
    this.mLoader = obj;
  };
  @action setreview = obj => {
    this.review = obj;
  };
  @action settrips = obj => {
    this.trips = obj;
  };
  @action addtrips = obj => {
    this.trips.unshift(obj);
  };
  @action updatetrips = (obj, ind) => {
    this.trips[ind] = obj;
  };

  @action deletetrips = ind => {
    this.trips.splice(ind, 1);
  };

  @action setphotos = obj => {
    this.photos = obj;
  };

  @action setphotosrfrsh = obj => {
    this.photosRefrsh = obj;
  };

  @observable isAnyTrade = false;
  @observable isOneReview = false;
  @action setisAnyTrade = obj => {
    this.isAnyTrade = obj;
  };
  @action setisOneReview = obj => {
    this.isOneReview = obj;
  };

  @action attemptToGetReviews = (
    uid,
    setgetdata,
    setrfrsh,
    setdt,
    setor,
    setl,
  ) => {
    console.log('get all Reviews : ', 'true');
    setl(true);

    db.hitApi(db.apis.GET_ALL_REVIEWS + uid, 'get', {}, this.authToken)
      ?.then(resp => {
        setl(false);
        setrfrsh(false);
        console.log(
          `response GET_ALL_REVIEWS   ${db.apis.GET_ALL_REVIEWS + uid} : `,
          resp.data,
        );
        let dt = resp.data.doc;
        let ar = [];
        if (dt.length > 0) {
          dt.map((e, i, a) => {
            if (e.guestId._id != store.User.user._id) {
              let msgs = e.messages || [];
              if (msgs.length > 0) {
                msgs.map((ee, i, a) => {
                  if (ee.role == 'guest') {
                    ar.push(e);
                  }
                });
              }
            }
          });
        }

        this.attemptToCheckReview(
          ar,
          setgetdata,
          c => setdt(c),
          c => setor(c),
        );
      })
      .catch(err => {
        setl(false);
        setrfrsh(false);
        let msg = err.response.data.message || err.response.status || err;
        console.log(
          `Error in GET_ALL_REVIEWS ${db.apis.GET_ALL_REVIEWS + uid} : `,
          msg,
        );
        if (msg == 503 || msg == 500) {
          Alert.alert('', 'Server not response');
          // store.General.setisServerError(true);
          return;
        }
        if (msg == 'No records found') {
          this.attemptToCheckReview(
            [],
            setgetdata,
            () => {},
            c => setor(c),
          );
          return;
        }
        // seterror(msg.toString())
        Alert.alert('', msg.toString());
      });
  };

  @action attemptToCheckReview = (data, setgetdata, setdt, setor) => {
    console.warn('CheckReview : ', 'true');

    let params = this.user._id + '/' + store.User.user._id;
    db.hitApi(db.apis.CHECK_REVIEW + params, 'get', {}, this.authToken)
      ?.then(resp => {
        console.log(
          `response CheckReview   ${db.apis.GET_ALL_REVIEWS + params} : `,
          resp.data,
        );
        let msg = resp.data.message || '';

        if (msg == 'No review found') {
          setdt(data);
          setor(false);
        } else {
          setor(true);
          let d = resp.data.data[0];
          let dt = data;
          dt.unshift(d);
          setdt(dt);
        }
        setgetdata(true);
      })
      .catch(err => {
        // setgetdata(true);
        let msg = err;
        console.log(
          `Error in CheckReview ${db.apis.GET_ALL_REVIEWS + params} : `,
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

  @action attemptToGetLatestTrip = setar => {
    let array = store.Offers.cnfrmOffers || [];
    console.log('GetLatestTrip : ', array.length);

    if (array.length > 0) {
      let u1 = store.User.user._id;
      let u2 = store.Userv.user._id;

      for (let index = 0; index < array.length; index++) {
        const e = array[index];

        let isu1 = false;
        let isu2 = false;

        if (e.offeredBy._id == u1) {
          isu1 = true;
        } else if (e.offeredTo._id == u1) {
          isu1 = true;
        }

        if (e.offeredBy._id == u2) {
          isu2 = true;
        } else if (e.offeredTo._id == u2) {
          isu2 = true;
        }

        console.log('u1 : ', isu1);
        console.log('u2 : ', isu2);

        if (isu1 && isu2) {
          setar(e);
          break;
        }
      }
    }

    // let params = this.user._id + '/' + store.User.user._id;
    // db.hitApi(db.apis.GET_LATEST_TRIP + params, 'get', {}, this.authToken)
    //   ?.then(resp => {
    //     console.log(
    //       `response GetLatestTrip   ${db.apis.GET_LATEST_TRIP + params} : `,
    //       resp.data,
    //     );
    //     let dt = resp.data.data || '';

    // this.setisAnyTrade(dt)
    //   })
    //   .catch(err => {
    //     let msg = err.response.data.message || err.response.status || err;
    //     console.log(
    //       `Error in GetLatestTrip ${db.apis.GET_LATEST_TRIP + params} : `,
    //       msg,
    //     );
    //     if (msg == 503 || msg == 500) {
    //       Alert.alert('', 'Server not response');
    //       // store.General.setisServerError(true);
    //       return;
    //     }
    //     if (msg == 'No records found') {
    //       his.setisAnyTrade(false);
    //       return;
    //     }

    //     // seterror(msg.toString())
    //     Alert.alert('', msg.toString());
    //   });
  };

  @action attemptToGetTrips = (uid, setgetdata, setrfrsh, setdt, setl) => {
    console.warn('GET_ALL_TRIP : ', 'true');
    setl(true);

    db.hitApi(db.apis.GET_ALL_TRIP + uid, 'get', {}, this.authToken)
      ?.then(resp => {
        setl(false);
        setrfrsh(false);
        console.log(
          `response GET_ALL_TRIP   ${db.apis.GET_ALL_TRIP + uid} : `,
          resp.data,
        );
        let dt = resp.data.data;
        setgetdata(true);
        setdt(dt);
      })
      .catch(err => {
        setl(false);
        setrfrsh(false);
        let msg = err.response.data.message || err.response.status || err;
        console.log(
          `Error in GET_ALL_TRIP  ${db.apis.GET_ALL_TRIP + uid} : `,
          msg,
        );
        if (msg == 503 || msg == 500) {
          Alert.alert('', 'Server not response');
          // store.General.setisServerError(true);
          return;
        }
        if (msg == 'No records found') {
          setgetdata(true);
          setdt([]);
          return;
        }
        // seterror(msg.toString())
        Alert.alert('', msg.toString());
      });
  };

  @action attemptToGetPhotos = (uid, setgetdata, setrfrsh, setdt, setl) => {
    console.warn('getPhotosData : ', 'true');
    setl(true);

    db.hitApi(db.apis.GET_ALL_TRIP + uid, 'get', {}, this.authToken)
      ?.then(resp => {
        setl(false);
        setrfrsh(false);
        console.log(
          `response getPhotosData  ${db.apis.GET_ALL_TRIP + uid} : `,
          resp.data,
        );

        let rp = resp.data.data;
        let dt = [];

        if (resp.data && rp.length > 0) {
          rp.map((e, i, a) => {
            if (e.photos && e.photos.length > 0) {
              e.photos.map((ee, i, a) => {
                dt.push({uri: ee, tid: e._id});
              });
            }
          });
        }

        setgetdata(true);
        setdt(dt);
        this.attemptToGetTrips(
          uid,
          () => {},
          () => {},
          () => {},
          () => {},
        );
      })
      .catch(err => {
        setrfrsh(false);
        setl(false);
        let msg = err.response.data.message || err.response.status || err;
        console.log(
          `Error in getPhotosData ${db.apis.GET_ALL_TRIP + uid} : `,
          msg,
        );
        if (msg == 503 || msg == 500) {
          Alert.alert('', 'Server not response');
          // store.General.setisServerError(true);
          return;
        }
        if (msg == 'No records found') {
          setgetdata(true);
          setdt([]);
          return;
        }
        // seterror(msg.toString())
        Alert.alert('', msg.toString());
      });
  };

  @action attemptToGetHome = (uid, setgetdata, sflwrs, sflwng) => {
    console.warn('Get AllGenralData : ', 'true');
    this.allGetGeneralUserData(
      uid,
      setgetdata,
      c => sflwrs(c),
      c => sflwng(c),
    );
  };

  //
  @action setphotoso = obj => {
    this.photoso = obj;
  };
  @action setreviewo = obj => {
    this.reviewo = obj;
  };
  @action settripso = obj => {
    this.tripso = obj;
  };
  @action setreviewLoadero = obj => {
    this.reviewLoadero = obj;
  };
  @action settripLoadero = obj => {
    this.tripsLoadero = obj;
  };
  @action setphotosLoadero = obj => {
    this.photosLoadero = obj;
  };
  @action setmLoadero = obj => {
    this.mLoadero = obj;
  };

  @action attemptToGetReviewso = (uid, setgetdata, setrfrsh, dt) => {
    console.warn('getReviesData : ', 'true');
    this.setreviewLoadero(true);
    setTimeout(() => {
      this.setreviewLoadero(false);
      setgetdata(true);
      setrfrsh(false);
      this.setreviewo(dt);
    }, 1000);
  };

  @action attemptToGetTripso = (uid, setgetdata, setrfrsh, dt) => {
    console.warn('getTripsData : ', 'true');
    this.settripLoadero(true);
    setTimeout(() => {
      this.settripLoadero(false);
      setgetdata(true);
      setrfrsh(false);
      this.settripso(dt);
    }, 1000);
  };

  @action attemptToGetPhotoso = (uid, setgetdata, setrfrsh, dt) => {
    console.warn('getPhotosData : ', 'true');
    this.setphotosLoadero(true);
    setTimeout(() => {
      this.setphotosLoadero(false);
      setgetdata(true);
      setrfrsh(false);
      this.setphotoso(dt);
    }, 1000);
  };

  //modal actions
  @action attemptToDeletePhotos = (obj, suc) => {
    console.warn('deletePhoto  : ', 'true');
    this.setmLoader(true);
    setTimeout(() => {
      this.setmLoader(false);
      delete this.photos.splice(obj.i, 1);

      suc();
    }, 1000);
  };
  @action attemptToReplyComment = (obj, cmnt, suc) => {
    console.warn('reply comment  : ', 'true');
    this.setmLoader(true);

    let i = obj.i;
    let body = {
      message: cmnt,
      role: 'host',
    };
    let id = obj.item._id;

    db.hitApi(db.apis.REPLY_REVIEW + id, 'put', body, this.authToken)
      ?.then(resp => {
        this.setmLoader(false);
        console.log(
          `response ReplyComment  ${db.apis.REPLY_REVIEW + id} : `,
          resp.data,
        );
        let dt = resp.data.data;
        this.review[i] = dt;
        suc();
      })
      .catch(err => {
        this.setmLoader(false);

        let msg = err.response.data.message || err.response.status || err;
        console.log(
          `Error in ReplyComment ${db.apis.REPLY_REVIEW + id} : `,
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
  @action attemptToEditComment = (obj, cmnt, suc) => {
    console.warn('edit comment  : ', 'true');
    this.setmLoader(true);

    let i = obj.i;
    let d = obj.item;
    let idd = d._id;
    let id = '';
    let msgs = d.messages || [];
    if (msgs.length > 0) {
      msgs.map((e, i, a) => {
        if (e.role == 'host') {
          id = e._id;
        }
      });
    }
    let body = {
      message: cmnt,
    };

    db.hitApi(db.apis.EDIT_REVIEW + idd + '/' + id, 'put', body, this.authToken)
      ?.then(resp => {
        this.setmLoader(false);
        console.log(
          `response EditComment  ${db.apis.EDIT_REVIEW + id} : `,
          resp.data,
        );
        let dt = resp.data.data;
        this.review[i] = dt;
        suc();
      })
      .catch(err => {
        this.setmLoader(false);

        let msg = err.response.data.message || err.response.status || err;
        console.log(`Error in EditComment ${db.apis.EDIT_REVIEW + id} : `, msg);
        if (msg == 503 || msg == 500) {
          Alert.alert('', 'Server not response');
          // store.General.setisServerError(true);
          return;
        }

        // seterror(msg.toString())
        Alert.alert('', msg.toString());
      });
  };
  @action attemptToDeleteComment = (obj, suc) => {
    console.warn('delete comment  : ', 'true');
    this.setmLoader(true);

    let i = obj.i;
    let d = obj.item;
    let idd = d._id;
    let id = '';
    let msgs = d.messages || [];
    if (msgs.length > 0) {
      msgs.map((e, i, a) => {
        if (e.role == 'host') {
          id = e._id;
        }
      });
    }
    db.hitApi(db.apis.DELETE_REVIEW + idd + '/' + id, 'put', {}, this.authToken)
      ?.then(resp => {
        this.setmLoader(false);
        console.log(
          `response DeleteComment  ${db.apis.DELETE_REVIEW + id} : `,
          resp.data,
        );
        let dt = resp.data.data;
        this.review[i] = dt;

        suc();
      })
      .catch(err => {
        this.setmLoader(false);

        let msg = err.response.data.message || err.response.status || err;
        console.log(
          `Error in DeleteComment ${db.apis.DELETE_REVIEW + id} : `,
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
  @action attemptToDisputeComment = (obj, suc) => {
    console.warn('delete comment  : ', 'true');
    this.setmLoader(true);

    let i = obj.i;
    let body = {
      status: 'dispute',
      disputeOpenDate: new Date(),
    };
    let id = obj.item._id;

    db.hitApi(db.apis.DISPUTE_REVIEW + id, 'put', body, this.authToken)
      ?.then(resp => {
        this.setmLoader(false);
        console.log(
          `response DisputeComment  ${db.apis.DISPUTE_REVIEW + id} : `,
          resp.data,
        );
        let dt = resp.data.data;
        this.review[i] = dt;

        suc();
      })
      .catch(err => {
        this.setmLoader(false);

        let msg = err;
        console.log(
          `Error in DisputeComment ${db.apis.DISPUTE_REVIEW + id} : `,
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

  @action attemptToPostReview = (body, suc, suc2, dt, setdt, setor) => {
    console.warn('Leave review body : ', body);
    this.setmLoader(true);
    db.hitApi(db.apis.LEAVE_REVIEW, 'post', body, this.authToken)
      ?.then(resp => {
        this.setmLoader(false);
        console.log(
          `response Leave review  ${db.apis.LEAVE_REVIEW} : `,
          resp.data,
        );
        // let dt = resp.data.data;
        // this.review.unshift(dt);
        suc();
        suc2();
        this.attemptToCheckReview(dt, () => {}, setdt, setor);
      })
      .catch(err => {
        this.setmLoader(false);

        let msg = err.response.data.message || err.response.status || err;
        console.log(`Error in Leave review ${db.apis.LEAVE_REVIEW} : `, msg);
        if (msg == 503 || msg == 500) {
          Alert.alert('', 'Server not response');
          // store.General.setisServerError(true);
          return;
        }

        // seterror(msg.toString())
        Alert.alert('', msg.toString());
      });
  };

  @action attemptToEditReview = (obj, data, setdt, suc, suc2) => {
    let userName = '';
    const user2 = store.User.user;
    if (user2) {
      userName = user2.firstName + ' ' + user2.lastName;
    }

    let body = {
      message: obj.message,
      guestRating: obj.rate,
      guestName: userName,
      isReviewEdited: true,
    };
    console.log('Edit review body : ', body);
    this.setmLoader(true);
    let params = obj._id + '/' + obj.mid;
    db.hitApi(db.apis.UPDATE_LEAVE_REVIEW + params, 'put', body, this.authToken)
      ?.then(resp => {
        this.setmLoader(false);
        console.log(
          `response Edit review  ${db.apis.UPDATE_LEAVE_REVIEW}${params} : `,
          resp.data.data.messages,
        );
        let dt = resp.data.data;
        let dd = [...data];
        dd[obj.i] = dt;
        setdt(dd);
        // this.setreview(dd);
        suc();
        suc2();
      })
      .catch(err => {
        this.setmLoader(false);

        let msg = err.response.data.message || err.response.status || err;
        console.log(
          `Error in Edit review ${db.apis.UPDATE_LEAVE_REVIEW}${params} : `,
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

  @action attemptToDeleteReview = (obj, suc, dt, setdt, setor) => {
    console.log('Delete review true ');
    this.setmLoader(true);
    let params = obj._id;
    db.hitApi(db.apis.DELETE_MY_REVIEW + params, 'delete', {}, this.authToken)
      ?.then(resp => {
        this.setmLoader(false);
        console.log(
          `response Delete review  ${db.apis.DELETE_MY_REVIEW}${params} : `,
          resp.data,
        );

        let dd = [...dt];
        dd.splice(obj.i, 1);
        setdt(dd);
        suc();
        this.attemptToCheckReview(dd, () => {}, setdt, setor);
      })
      .catch(err => {
        this.setmLoader(false);

        let msg = err.response.data.message || err.response.status || err;
        console.log(
          `Error in Delete review ${db.apis.DELETE_MY_REVIEW}${params} : `,
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

  @observable ctripsLoader = false;
  @observable editTripObj = false;
  @observable editTrip = false;

  @observable homeModalLoder = false;
  @action attemptToOfferSend = (body, suc) => {
    this.sethomeModalLoder(true);
    db.hitApi(db.apis.OFFER_SEND, 'post', body, this.authToken)
      ?.then(resp => {
        this.sethomeModalLoder(false);
        console.log(`response OfferSend  ${db.apis.OFFER_SEND} : `, resp.data);
        suc(true);
      })
      .catch(err => {
        this.sethomeModalLoder(false);
        let msg = err.response.data.message || err.response.status || err;
        console.log(`Error in OfferSend ${db.apis.OFFER_SEND} : `, msg);
        if (msg == 503 || msg == 500) {
          Alert.alert('', 'Server not response');
          // store.General.setisServerError(true);
          return;
        }
        // seterror(msg.toString())
        Alert.alert('', msg.toString());
      });
  };

  //old

  // @action attemptToCheckFirstMessage = (suid, ruid, obj, msg, suc) => {
  //   console.warn('check First Message');
  //   this.sethomeModalLoder(true);
  //   let params = suid + '/' + ruid;
  //   db.hitApi(db.apis.CHECK_FIRST_MESSAGE + params, 'get', {}, this.authToken)
  //     ?.then(resp => {
  //       console.log(
  //         `responsecheck First Message ${db.apis.CHECK_FIRST_MESSAGE}${params} : `,
  //         resp.data,
  //       );
  //       let rsp = resp.data.doc[0] || [];
  //       if (rsp) {
  //         let dt = rsp;
  //         let body = {
  //           message: msg,
  //           sendBy: suid,
  //           type: 'text',
  //           chatRoomId: dt.roomName,
  //         };
  //         // dt._id
  //         this.SendSecodMessage(body, dt.roomName, suc);
  //       }
  //     })
  //     .catch(err => {
  //       let msg = err.response.data.message || err.response.status || err;
  //       console.log(
  //         `Error in check First Message ${db.apis.CHECK_FIRST_MESSAGE}${params} : `,
  //         msg,
  //       );
  //       if (msg == 'No records found') {
  //         this.SendFirstMessage(obj, suc);
  //         return;
  //       }
  //       this.sethomeModalLoder(false);
  //       if (msg == 503 || msg == 500) {
  //         Alert.alert('', 'Server not response');
  //         // store.General.setisServerError(true);
  //         return;
  //       }
  //       Alert.alert('', msg.toString());
  //     });
  // };

  // @action SendFirstMessage = (body, suc) => {
  //   db.hitApi(db.apis.SEND_FIRST_MESSAGE, 'post', body, this.authToken)
  //     ?.then(resp => {
  //       this.sethomeModalLoder(false);
  //       console.log(
  //         `response SendFirstMessage  ${db.apis.SEND_FIRST_MESSAGE} : `,
  //         resp.data,
  //       );
  //       suc(true);
  //     })
  //     .catch(err => {
  //       this.sethomeModalLoder(false);
  //       let msg = err.response.data.message || err.response.status || err;
  //       console.log(
  //         `Error in SendFirstMessage ${db.apis.SEND_FIRST_MESSAGE} : `,
  //         msg,
  //       );
  //       if (msg == 503 || msg == 500) {
  //         Alert.alert('', 'Server not response');
  //         // store.General.setisServerError(true);
  //         return;
  //       }
  //       // seterror(msg.toString())
  //       Alert.alert('', msg.toString());
  //     });
  // };

  // @action SendSecodMessage = (body, cid, suc) => {
  //   db.hitApi(db.apis.SEND_SECOND_MESSAGE + cid, 'put', body, this.authToken)
  //     ?.then(resp => {
  //       this.sethomeModalLoder(false);
  //       console.log(
  //         `response SEND_SECOND_MESSAGE  ${db.apis.SEND_SECOND_MESSAGE} : `,
  //         resp.data,
  //       );
  //       suc(true);
  //     })
  //     .catch(err => {
  //       this.sethomeModalLoder(false);
  //       let msg = err.response.data.message || err.response.status || err;
  //       console.log(
  //         `Error in SEND_SECOND_MESSAGE ${db.apis.SEND_SECOND_MESSAGE} : `,
  //         msg,
  //       );
  //       if (msg == 503 || msg == 500) {
  //         Alert.alert('', 'Server not response');
  //         // store.General.setisServerError(true);
  //         return;
  //       }
  //       // seterror(msg.toString())
  //       Alert.alert('', msg.toString());
  //     });
  // };

  @action attemptToCheckFirstMessage = (suid, ruid, obj, msg, suc) => {
    console.warn('check First Message');
    this.sethomeModalLoder(true);
    let params = suid + '/' + ruid;
    db.hitApi(db.apis.CHECK_FIRST_MESSAGE + params, 'get', {}, this.authToken)
      ?.then(resp => {
        console.log(
          `responsecheck Check First Message ${db.apis.CHECK_FIRST_MESSAGE}${params} : `,
          resp.data,
        );
        let rsp = resp.data.doc[0];
        if (rsp) {
          let dt = rsp;
          let body = {
            message: msg,
            sendBy: suid,
            type: 'text',
            chatRoomId: dt.roomName,
          };
          // dt._id
          this.SendSecodMessage(body, dt.roomName, suc);
        }
      })
      .catch(err => {
        let msg = err.response.data.message || err.response.status || err;
        console.log(
          `Error in check First Message ${db.apis.CHECK_FIRST_MESSAGE}${params} : `,
          msg,
        );
        if (msg == 'No records found') {
          this.SendFirstMessage(obj, suc);
          return;
        }
        this.sethomeModalLoder(false);
        if (msg == 503 || msg == 500) {
          Alert.alert('', 'Server not response');
          // store.General.setisServerError(true);
          return;
        }
        Alert.alert('', msg.toString());
      });
  };

  @action SendFirstMessage = (body, suc) => {
    db.hitApi(db.apis.SEND_FIRST_MESSAGE, 'post', body, this.authToken)
      ?.then(resp => {
        this.sethomeModalLoder(false);
        console.log(
          `response SendFirstMessage  ${db.apis.SEND_FIRST_MESSAGE} : `,
          resp.data,
        );

        let rn = resp.data.data.roomName;
        suc(true);

        store.User.attemptToGetInboxes(store.User.user._id, () => {});
      })
      .catch(err => {
        this.sethomeModalLoder(false);
        let msg = err.response.data.message || err.response.status || err;
        console.log(
          `Error in SendFirstMessage ${db.apis.SEND_FIRST_MESSAGE} : `,
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

  @action SendSecodMessage = (body, cid, suc) => {
    let uid = body.sendBy;
    let username = store.User.user.firstName + ' ' + store.User.user.lastName;
    let msg = body.message;

    const socket = io(db.apis.BASE_URLS);
    let rn = cid;
    socket.emit('joinRoom', {username, roomName: rn});

    let userDetails = {
      userId: uid,
      roomName: cid,
      username: username,
      message: msg,
      type: 'text',
    };

    socket.emit('chat', {userDetails});

    this.sethomeModalLoder(false);
    suc(true);
    socket.emit('user left', {socket: socket.id});
  };

  @action SendReportUser = (body, suc) => {
    this.sethomeModalLoder(true);
    console.log('SendReportUser body : ', body);
    db.hitApi(db.apis.SEND_REPORT_USER, 'post', body, store.User.authToken)
      ?.then(resp => {
        this.sethomeModalLoder(false);
        console.log(
          `response SendReportUser  ${db.apis.SEND_REPORT_USER} : `,
          resp.data,
        );
        suc(true);
      })
      .catch(err => {
        this.sethomeModalLoder(false);
        let msg = err.response.data.message || err.response.status || err;
        console.log(
          `Error in SendReportUser ${db.apis.SEND_REPORT_USER} : `,
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

  @action myUserGetGeneral = c => {
    let uid = store.User.user._id;
    store.User.getUserById1(uid, this.authToken, '');
    store.User.attemptToGetFollowers(
      uid,
      () => {},
      () => {},
    );
    store.User.attemptToGetFollowing(
      uid,
      () => {},
      () => {},
    );
    if (c == 'b') {
      store.User.attemptToGetBloackUsers(
        uid,
        () => {},
        () => {},
        'home',
      );
    }
  };

  @action unFollowUser = (uid2, sflwrs, sflwng, setl) => {
    setl(true);
    let uid1 = store.User.user._id;

    let params = uid1 + '/' + uid2;
    db.hitApi(db.apis.UNFOLLOW_USER + params, 'put', {}, store.User.authToken)
      ?.then(resp => {
        console.log(
          `response UNFOLLOW_USER,  ${db.apis.UNFOLLOW_USER}${params} : `,
          resp.data,
        );
        setTimeout(() => {
          setl(false);
        }, 1000);
        this.attemptToGetHome(
          uid2,
          () => {},
          c => sflwrs(c),
          c => sflwng(c),
        );
        this.myUserGetGeneral('');
      })
      .catch(err => {
        setl(false);
        let msg = err.response.data.message || err.response.status || err;
        console.log(
          `Error in UNFOLLOW_USER, ${db.apis.UNFOLLOW_USER}${params} : `,
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

  @action FollowUser = (uid2, sflwrs, sflwng, setl) => {
    setl(true);
    let uid1 = store.User.user._id;

    let params = uid1 + '/' + uid2;
    db.hitApi(db.apis.FOLLOW_USER + params, 'put', {}, store.User.authToken)
      ?.then(resp => {
        console.log(
          `response FOLLOW_USER,  ${db.apis.FOLLOW_USER}${params} : `,
          resp.data,
        );
        setTimeout(() => {
          setl(false);
        }, 1000);
        this.attemptToGetHome(uid2, () => {}, sflwrs, sflwng);
        this.myUserGetGeneral('');
      })
      .catch(err => {
        setl(false);
        let msg = err.response.data.message || err.response.status || err;
        console.log(
          `Error in FOLLOW_USER, ${db.apis.FOLLOW_USER}${params} : `,
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

  @action BlockUser = (uid2, suc, sflwrs, sflwng, setl) => {
    setl(true);
    let uid1 = store.User.user._id;

    let params = uid1 + '/' + uid2;
    db.hitApi(db.apis.BLOCK_USER + params, 'put', {}, store.User.authToken)
      ?.then(resp => {
        console.log(
          `response  BlockUser,  ${db.apis.BLOCK_USER}${params} : `,
          resp.data,
        );
        setTimeout(() => {
          setl(false);
        }, 1000);
        this.attemptToGetHome(
          uid2,
          () => {},
          c => sflwrs(c),
          c => sflwng(c),
        );
        this.myUserGetGeneral('b');
        suc();
      })
      .catch(err => {
        setl(false);
        let msg = err.response.data.message || err.response.status || err;
        console.log(
          `Error in  BlockUser, ${db.apis.BLOCK_USER}${params} : `,
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

  @action UnBlockUser = (uid2, suc, sflwrs, sflwng, setl) => {
    setl(true);
    let uid1 = store.User.user._id;

    let params = uid1 + '/' + uid2;
    db.hitApi(db.apis.UNBLOCK_USER + params, 'put', {}, store.User.authToken)
      ?.then(resp => {
        console.log(
          `response  unBlockUser,  ${db.apis.UNBLOCK_USER}${params} : `,
          resp.data,
        );
        setTimeout(() => {
          setl(false);
        }, 1000);
        this.attemptToGetHome(
          uid2,
          () => {},
          c => sflwrs(c),
          c => sflwng(c),
        );
        this.myUserGetGeneral('b');
        suc();
      })
      .catch(err => {
        setl(false);
        let msg = err.response.data.message || err.response.status || err;
        console.log(
          `Error in  unBlockUser, ${db.apis.UNBLOCK_USER}${params} : `,
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

  @action attemptToOtherUserMessageSend = (obj, suc) => {
    console.warn('message send  : ', 'true');
    this.setotherUserModalLoader(true);
    setTimeout(() => {
      this.setotherUserModalLoader(false);
      suc(true);
    }, 1000);
  };

  @observable offerSend = false;
  @action setofferSend = obj => {
    this.offerSend = obj;
  };

  @observable offerRecieve = false;
  @action setofferRecieve = obj => {
    this.offerRecieve = obj;
  };

  @observable MyProfileProps = false;
  @observable OtherProfileProps = false;
  @observable offersProfileProps = false;

  @action setMyProfileProps = obj => {
    this.MyProfileProps = obj;
  };
  @action setOtherProfileProps = obj => {
    this.OtherProfileProps = obj;
  };
  @action setOfferProfileProps = obj => {
    this.offersProfileProps = obj;
  };

  @action setctripLoader = obj => {
    this.ctripsLoader = obj;
  };
  @action seteditTrip = obj => {
    this.editTrip = obj;
  };
  @action seteditTripObj = obj => {
    this.editTripObj = obj;
  };

  @action sethomeModalLoder = obj => {
    this.homeModalLoder = obj;
  };

  @action attemptToCreateTrip = (body, suc) => {
    console.warn('create trip body : ', body);

    db.hitApi(db.apis.CREATE_TRIP, 'post', body, this.authToken)
      ?.then(resp => {
        this.setctripLoader(false);
        console.log(
          `response create trip  ${db.apis.CREATE_TRIP} : `,
          resp.data,
        );
        let rsp = resp.data.data;
        this.seteditTripObj({data: rsp, index: 0});
        this.addtrips(rsp);
        suc(true);
      })
      .catch(err => {
        this.setctripLoader(false);
        let msg = err.response.data.message || err.response.status || err;
        console.log(`Error in create trip ${db.apis.CREATE_TRIP} : `, msg);
        if (msg == 503 || msg == 500) {
          Alert.alert('', 'Server not response');
          // store.General.setisServerError(true);
          return;
        }
        // seterror(msg.toString())
        Alert.alert('', msg.toString());
      });
  };

  attemptToCreateTripUploadImage(bd, suc) {
    let body = {...bd};
    let imgArr = body.photos;
    console.warn('upload trips photo body : ', imgArr);
    let ua = [];
    imgArr.map((e, i, a) => {
      const data = new FormData();
      const newFile = {
        uri: e.uri,
        type: e.type,
        name: e.fileName,
      };
      data.append('files', newFile);
      fetch(db.apis.BASE_URL + db.apis.IMAGE_UPLOAD, {
        method: 'post',
        body: data,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
        .then(response => response.json())
        .then(responseData => {
          console.warn('upload photo success : ');
          let rsp = responseData.data[0].imgrUrl;
          ua.push(rsp);
          if (ua.length == a.length) {
            delete body.photos;
            body.photos = ua;
            this.attemptToCreateTrip(body, suc);
            return;
          }
        })
        .catch(err => {
          this.setctripLoader(false);

          let msg = err.response.data.message || err.response.status || err;
          console.log(
            `Error in upload trips photo ${db.apis.IMAGE_UPLOAD} : `,
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
    });
  }

  @action attemptToUpdateTrip = (body, tid, index, suc) => {
    console.warn('update trip body  : ', body);

    db.hitApi(db.apis.UPDATE_TRIP + tid, 'put', body, this.authToken)
      ?.then(resp => {
        this.setctripLoader(false);
        console.log(
          `response UPDATE_TRIP  ${db.apis.UPDATE_TRIP} : `,
          resp.data,
        );
        let rsp = resp.data.data;
        this.seteditTripObj(rsp);
        this.updatetrips(rsp, index);

        suc(true);
      })
      .catch(err => {
        this.setctripLoader(false);
        let msg = err.response.data.message || err.response.status || err;
        console.log(`Error in UPDATE_TRIP ${db.apis.UPDATE_TRIP} : `, msg);
        if (msg == 503 || msg == 500) {
          Alert.alert('', 'Server not response');
          // store.General.setisServerError(true);
          return;
        }
        // seterror(msg.toString())
        Alert.alert('', msg.toString());
      });
  };

  // @action attemptToDeleteTrip = (item, ind, suc) => {
  //   console.warn('delete  save trip  : ', 'true');
  //   this.setdLoader(true);
  //   setTimeout(() => {
  //     this.setdLoader(false);
  // /    this.deletesetsaveTrips(ind, suc);
  //   }, 1000);
  // };

  @action attemptToDeleteTrip = (body, tid, index, suc) => {
    console.warn('delete trip body  : ', body);

    db.hitApi(db.apis.DELETE_TRIP + tid, 'delete', body, this.authToken)
      ?.then(resp => {
        this.setctripLoader(false);
        console.log(
          `response delete trip  ${db.apis.DELETE_TRIP} : `,
          resp.data,
        );

        this.deletetrips(index);
        suc(true);
      })
      .catch(err => {
        this.setctripLoader(false);
        let msg = err.response.data.message || err.response.status || err;
        console.log(`Error in delete trip ${db.apis.DELETE_TRIP} : `, msg);
        if (msg == 503 || msg == 500) {
          Alert.alert('', 'Server not response');
          // store.General.setisServerError(true);
          return;
        }
        // seterror(msg.toString())
        Alert.alert('', msg.toString());
      });
  };

  @action async attemptToUpdateTripUploadImage(bd, p2, tid, index, suc) {
    let imgArr = [...p2];
    let ua = [];

    imgArr.map((e, i, a) => {
      const data = new FormData();
      const newFile = {
        uri: e.uri,
        type: e.type,
        name: e.fileName,
      };
      data.append('files', newFile);
      fetch(db.apis.BASE_URL + db.apis.IMAGE_UPLOAD, {
        method: 'post',
        body: data,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
        .then(response => response.json())
        .then(responseData => {
          console.warn('upload update trips photo success : ');
          let rsp = responseData.data[0].imgrUrl;
          ua.push(rsp);

          if (ua.length == a.length) {
            let body = {...bd};
            const pt = body.photos;

            let f = [];
            if (pt.length > 0) {
              pt.map((e, i, a) => {
                f.push(e);
              });
            }
            if (ua.length > 0) {
              ua.map((e, i, a) => {
                f.push(e);
              });
            }

            delete body.photos;
            body.photos = f;
            this.attemptToUpdateTrip(body, tid, index, suc);
            return;
          }
        })
        .catch(err => {
          this.setctripLoader(false);

          let msg = err.response.data.message || err.response.status || err;
          console.log(
            `Error in upload update trips photo ${db.apis.IMAGE_UPLOAD} : `,
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
    });
  }

  @observable cart = {totalbill: 0, totalitems: 0, data: []};
  @observable isAddModal = false;
  @observable isVarModal = false;
  @observable isSubModal = false;
  @observable isChkLoginModal = false;

  @observable loader = false;
  @observable fvrtloader = false;
  @observable adrsloader = false;
  @observable loginLoader = false;
  @observable regLoader = false;

  @persist('object') @observable location = false; //set  delivery adress location
  @observable cl = false; //curemt location
  @observable rd = false; //curemt resturant detail
  // @persist('object')
  // @persist('object')

  @persist('object') @observable polygons = [];

  @persist('object') @observable fvrtList = [];
  @persist('object') @observable adrsList = [];

  @observable CityAreaData = [];
  @observable CityAreaLoader = false;

  @observable online = false;
  @observable notificationToken = '';
  @observable authToken = '';

  @observable isGetAllDatainSplash = false;
  @observable total = 0; //total uploaded image length
  @observable done = 0; //done uloaded image counter
  @observable isAllImageUploadDone = false;

  @action setemail = obj => {
    this.email = obj;
  };
  @action setpswd = obj => {
    this.pswd = obj;
  };
  @action setsp = obj => {
    this.sp = obj;
  };

  @action setcart = obj => {
    this.cart = obj;
  };

  @action setisAddModal = obj => {
    this.isAddModal = obj;
  };

  @action setisSubModal = obj => {
    this.isSubModal = obj;
  };
  @action setisChkLoginModal = obj => {
    this.isChkLoginModal = obj;
  };

  @action setisVarModal = obj => {
    this.isVarModal = obj;
  };

  @action setloginLoader = obj => {
    this.loginLoader = obj;
  };

  @action setregLoader = obj => {
    this.regLoader = obj;
  };

  @action setLocation = obj => {
    this.location = obj;
  };

  @action setfvrtList = obj => {
    this.fvrtList = obj;
  };

  @action setadrsList = obj => {
    this.adrsList = obj;
  };

  @action setadrsloader = obj => {
    this.adrsloader = obj;
  };

  @action setfvrtloader = obj => {
    this.fvrtloader = obj;
  };

  @action setCityAreaData = obj => {
    this.CityAreaData = obj;
  };

  @action setCityAreaLoader = obj => {
    this.CityAreaLoader = obj;
  };

  @action.bound
  addPolygons(val) {
    this.polygons = val;
  }

  @action setLoader = obj => {
    this.loader = obj;
  };

  @action setonline = obj => {
    this.online = obj;
  };

  @action setcl = obj => {
    this.cl = obj;
  };

  @action setrd = obj => {
    this.rd = obj;
  };

  @action.bound
  setisAllImageUploadDone(c) {
    this.isAllImageUploadDone = c;
  }

  @action.bound
  settotal(t) {
    this.total = t;
  }

  @action.bound
  setdone(t) {
    this.done = t;
  }

  @action.bound
  setisGetAllDatainSplash(val) {
    this.isGetAllDatainSplash = val;
  }

  @action.bound
  setUser(val) {
    this.user = val;
  }

  @action.bound
  setvUser(val) {
    this.vuser = val;
  }

  @action.bound
  setfscreen(val) {
    this.fscreen = val;
  }

  @action.bound
  addnotificationToken(n) {
    this.notificationToken = n;
  }

  addUser(token, user, c) {
    let chk = c || '';
    store.General.setgoto(chk == '' ? 'home' : chk);
    console.log('token : ', token);
    console.log('user : ', user);
    this.addauthToken(token);
    this.setUser(user);

    return;
  }

  @action.bound
  addauthToken(n) {
    this.authToken = n;
  }

  @action.bound
  getAllData = c => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        console.log('get all  data  : ', c);

        if (c == 'user') {
          // this.attemptToGetUser();
          // store.Orders.getOrderById();
          // this.attemptToGetFavtList();
          // this.attemptToGetAdressList()
        }
        if (store.User.location) {
          // let city = store.User.location.city;
          // store.Food.getSliderImages(city);
          // store.Promos.getPromoById();
        }
        // this.attemptToSubTopic();
        // this.getCitiesandAreas();
      }
    });
  };

  @action.bound
  getCitiesandAreas() {
    this.setCityAreaLoader(true);
    db.hitApi(db.apis.GET_CITIES_AREAS, 'get', null, null)
      ?.then((resp: any) => {
        console.log(`response  ${db.apis.GET_CITIES_AREAS} : `, resp.data.data);
        this.setCityAreaData(resp.data.data);
        this.setCityAreaLoader(false);
        this.setisGetAllDatainSplash(true);
        // this.user = resp.data.data[0];
        // this.user.clear_account = resp.data.data[0].clear_account;
        // this.user.status = resp.data.data[0].status;
        // this.user.profile_image = resp.data.data[0].profile_image;
        // this.user.rating = resp.data.data[0].rating;
      })
      .catch(err => {
        this.setCityAreaLoader(false);
        let msg = err.response.data.message || err.response.status;
        console.log(`Error in ${db.apis.GET_CITIES_AREAS} : `, msg);
        if (msg == 503 || msg == 500) {
          store.General.setisServerError(true);
          return;
        }
        Alert.alert('', msg);
      });
  }

  @action.bound
  attemptToGetUser() {
    db.hitApi(
      db.apis.GET_USER_BY_ID + this.user._id,
      'get',
      null,
      this.authToken,
    )
      ?.then((resp: any) => {
        console.log(`response  ${db.apis.GET_USER_BY_ID} : `, resp.data);
        let u = resp.data.data[0];
        this.setUser(u);
        // if (u.isActive) {
        //   this.setUser(u);
        // } else {
        //   alert('block');
        // }
      })
      .catch(err => {
        console.log(
          `Error in ${db.apis.GET_USER_BY_ID} : `,
          err.response.data.message,
        );
      });
  }

  @action.bound
  attemptToGetFavtList() {
    this.setfvrtloader(true);
    db.hitApi(
      db.apis.GET_FAVRT_FOOD_LIST_BY_USER_ID + this.user._id,
      'get',
      null,
      this.authToken,
    )
      ?.then((resp: any) => {
        this.setfvrtloader(false);
        console.log(
          `response  ${db.apis.GET_FAVRT_FOOD_LIST_BY_USER_ID} : `,
          resp.data,
        );
        // this.setfvrtList(resp.data.data[0]);
      })
      .catch(err => {
        this.setfvrtloader(false);
        let msg = err.response.data.message || err.response.status;
        console.log(
          `Error in ${db.apis.GET_FAVRT_FOOD_LIST_BY_USER_ID} : `,
          msg,
        );
        if (msg == 503 || msg == 500) {
          store.General.setisServerError(true);
          return;
        }
        if (msg == 'No records found') {
          // this.setfvrtList([]);
          return;
        }
        Alert.alert('', msg);
      });
  }

  @action.bound
  attemptToGetAdressList() {
    this.setadrsloader(true);
    db.hitApi(
      db.apis.GET_ADDRESS_BY_USER_ID + this.user._id,
      'get',
      null,
      this.authToken,
    )
      ?.then((resp: any) => {
        this.setadrsloader(false);
        console.log(
          `response  ${db.apis.GET_ADDRESS_BY_USER_ID} : `,
          resp.data,
        );
        // this.setadrsList(resp.data.data[0]);
      })
      .catch(err => {
        this.setadrsloader(false);
        let msg = err.response.data.message || err.response.status;
        console.log(`Error in ${db.apis.GET_ADDRESS_BY_USER_ID} : `, msg);
        if (msg == 503 || msg == 500) {
          store.General.setisServerError(true);
          return;
        }
        if (msg == 'No records found') {
          // this.setfvrtList([]);
          return;
        }
        Alert.alert('', msg);
      });
  }

  @action.bound
  attemptToAddFavtList(id) {
    this.setfvrtloader(true);
    let fid = id;
    db.hitApi(
      db.apis.SET_FAVRT_FOOD_LIST_BY_USER_ID + this.user._id,
      'post',
      null,
      this.authToken,
    )
      ?.then((resp: any) => {
        this.setfvrtloader(false);

        console.log(
          `response  ${db.apis.SET_FAVRT_FOOD_LIST_BY_USER_ID} : `,
          resp.data,
        );
        // this.setfvrtList(resp.data.data[0]);
      })
      .catch(err => {
        this.setfvrtloader(false);

        let msg = err.response.data.message || err.response.status;
        console.log(
          `Error in ${db.apis.SET_FAVRT_FOOD_LIST_BY_USER_ID} : `,
          msg,
        );
        if (msg == 503 || msg == 500) {
          store.General.setisServerError(true);
          return;
        }
        Alert.alert('', msg);
      });
  }

  @action.bound
  attemptToRemoveFavtList(id) {
    this.setfvrtloader(true);
    let fid = id;
    db.hitApi(
      db.apis.REMOVE_FAVRT_FOOD_LIST_BY_USER_ID + this.user._id,
      'post',
      null,
      this.authToken,
    )
      ?.then((resp: any) => {
        this.setfvrtloader(false);
        console.log(
          `response  ${db.apis.REMOVE_FAVRT_FOOD_LIST_BY_USER_ID} : `,
          resp.data,
        );
        // this.setfvrtList(resp.data.data[0]);
      })
      .catch(err => {
        this.setfvrtloader(false);
        let msg = err.response.data.message || err.response.status;
        console.log(
          `Error in ${db.apis.REMOVE_FAVRT_FOOD_LIST_BY_USER_ID} : `,
          msg,
        );
        if (msg == 503 || msg == 500) {
          store.General.setisServerError(true);
          return;
        }
        Alert.alert('', msg);
      });
  }

  @action.bound
  attemptToAddAddressList(id) {
    this.setadrsloader(true);
    let fid = id;
    db.hitApi(
      db.apis.ADD_ADDRESS_BY_USER_ID + this.user._id,
      'post',
      null,
      this.authToken,
    )
      ?.then((resp: any) => {
        this.setadrsloader(false);
        console.log(
          `response  ${db.apis.ADD_ADDRESS_BY_USER_ID} : `,
          resp.data,
        );
        // this.setadrsList(resp.data.data[0]);
      })
      .catch(err => {
        this.setadrsloader(false);
        let msg = err.response.data.message || err.response.status;
        console.log(`Error in ${db.apis.ADD_ADDRESS_BY_USER_ID} : `, msg);
        if (msg == 503 || msg == 500) {
          store.General.setisServerError(true);
          return;
        }
        Alert.alert('', msg);
      });
  }

  @action.bound
  attemptToRemoveAddressList(id) {
    this.setadrsloader(true);
    let fid = id;
    db.hitApi(
      db.apis.REMOVE_ADDRESS_BY_USER_ID + this.user._id,
      'post',
      null,
      this.authToken,
    )
      ?.then((resp: any) => {
        this.setadrsloader(false);
        console.log(
          `response  ${db.apis.REMOVE_ADDRESS_BY_USER_ID} : `,
          resp.data,
        );
        // this.adrsList(resp.data.data[0]);
      })
      .catch(err => {
        this.setadrsloader(false);
        let msg = err.response.data.message || err.response.status;
        console.log(`Error in ${db.apis.REMOVE_ADDRESS_BY_USER_ID} : `, msg);
        if (msg == 503 || msg == 500) {
          store.General.setisServerError(true);
          return;
        }
        Alert.alert('', msg);
      });
  }
  @action.bound
  attemptToLogin(d, goHome, goSignup, goCheckout, s) {
    this.setloginLoader(true);
    let body = {
      mobile: d.mobile,
      registrationToken: d.registrationToken,
    };

    db.hitApi(db.apis.LOGIN_USER, 'post', body, null)
      ?.then((resp: any) => {
        console.log(`response  ${db.apis.LOGIN_USER} : `, resp.data);
        this.setloginLoader(false);
        this.addUser(resp.data.token, resp.data.doc);
        store.Orders.getOrderById();
        if (s == 'checkout') {
          goCheckout();
          return;
        }

        goHome();
      })
      .catch(err => {
        this.setloginLoader(false);

        let msg = err.response.data.message || err.response.status;
        console.log(`Error in ${db.apis.LOGIN_USER} : `, msg);
        if (msg == 503 || msg == 500) {
          store.General.setisServerError(true);
          return;
        }

        if (msg == 'User Not Registered') {
          goSignup();
          return;
        }

        Alert.alert('', msg);
      });
  }

  @action.bound
  attemptToSubTopic() {
    let body = {
      token: this.notificationToken,
      topic: 'contactus',
    };

    db.hitApi(db.apis.SUBSCRIBE_TOPIC, 'post', body, null)
      ?.then((resp: any) => {
        console.log(`response  ${db.apis.SUBSCRIBE_TOPIC} : `, resp.data);
      })
      .catch(err => {
        let msg = err.response.data.message || err.response.status;
        console.log(`Error in ${db.apis.SUBSCRIBE_TOPIC} : `, msg);
      });
  }
  @action.bound
  allGetGeneralData() {
    this.attemptToGetPlan();
    this.attemptToGetState();
    this.attemptToGetActivity();
    this.attemptToGetSpecies();
  }

  @action.bound
  allGetGeneralUserData(uid, sgd, sflwrs, sflwng) {
    this.attemptToGetFollowers(
      uid,
      sgd,
      c => sflwrs(c),
      c => sflwng(c),
      () => {},
      () => {},
    );
    this.attemptToGetFollowing(
      uid,
      sgd,
      c => sflwrs(c),
      c => sflwng(c),
      () => {},
      () => {},
    );
  }

  @action.bound
  LoginUser(body, svp, seterror) {
    console.warn('Login user body : ', body);
    this.setregLoader(true);

    db.hitApi(db.apis.LOGIN_USER, 'post', body, null)
      ?.then(resp => {
        this.setregLoader(false);
        console.log(`response Login user  ${db.apis.LOGIN_USER} : `);
        let rsp = resp.data.doc;
        let token = resp.data.token;

        if (rsp.status == 'blocked') {
          Alert.alert(
            '',
            'Your account has been blocked. Please contact customer support',
            [{text: 'OK', onPress: () => this.Logout()}],
          );
          return;
        }

        this.addUser(token, rsp, '');
        this.setemail(body.email);
        this.setsp(svp);
        if (svp) {
          this.setpswd(body.password);
        } else {
          this.setpswd('');
        }
        this.allGetGeneralData();
        this.allGetGeneralUserData(rsp._id);
      })
      .catch(err => {
        this.setregLoader(false);
        let msg = err.response.data.message || err.response.status || err;
        console.log(`Error in Login user ${db.apis.LOGIN_USER} : `, msg);
        if (msg == 503 || msg == 500) {
          Alert.alert('', 'Server not response');
          // store.General.setisServerError(true);
          return;
        }

        // seterror(msg.toString())
        Alert.alert('', msg.toString());
      });
  }

  @action.bound
  registerUser(body, seterror, suc) {
    console.warn('Register user body : ', body);
    this.setregLoader(true);

    db.hitApi(db.apis.REGISTER_USER, 'post', body, null)
      ?.then(resp => {
        console.log(`response create ${db.apis.REGISTER_USER} : `, resp.data);
        let token = resp.data.token;
        let reslt = resp.data.data;

        db.hitApi(db.apis.GET_All_Plan, 'get', {}, null)
          ?.then(resp => {
            this.setregLoader(false);
            console.log(
              `response get all plan  ${db.apis.GET_All_Plan} : `,
              resp.data,
            );
            let rsp = resp.data.data;
            let plan = {annual_discount: 0, data: []};
            let dt = [];
            let features = [
              'Create trips and get offers',
              'Make trade offers',
              'Send and receive messages',
              'Bookmark trips',
              'Advanced trip search',
            ];
            if (rsp.length > 0) {
              rsp.map((e, i, a) => {
                if (e.type == 'annual') {
                  plan.annual_discount = e.discount;
                }
                let o = {...e};
                o.features = features;
                dt.push(o);
              });
            }
            plan.data = dt;
            suc(token, reslt, plan);
          })
          .catch(err => {
            this.setregLoader(false);
            let msg = err.response.data.message || err.response.status;
            console.log(
              `Error in get all plan ${db.apis.GET_All_Plan} : `,
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
      })
      .catch(err => {
        this.setregLoader(false);
        let msg = err.response.data.message || err.response.status || err;
        console.log(`Error in create ${db.apis.REGISTER_USER} : `, msg);
        if (msg == 503 || msg == 500) {
          Alert.alert('', 'Server not response');
          // store.General.setisServerError(true);
          return;
        }
        // seterror(msg.toString())
        Alert.alert('', msg.toString());
      });
  }

  @action.bound
  attemptToGetPlan() {
    console.log(`get all plan`);
    db.hitApi(db.apis.GET_All_Plan, 'get', {}, null)
      ?.then(resp => {
        this.setregLoader(false);
        console.log(
          `response get all plan  ${db.apis.GET_All_Plan} : `,
          resp.data,
        );
        let rsp = resp.data.data;
        let plan = {annual_discount: 0, data: []};
        let dt = [];
        let features = [
          'Create trips and get offers',
          'Make trade offers',
          'Send and receive messages',
          'Bookmark trips',
          'Advanced trip search',
        ];
        if (rsp.length > 0) {
          rsp.map((e, i, a) => {
            if (e.type == 'annual') {
              plan.annual_discount = e.discount;
            }
            let o = {...e};
            o.features = features;
            dt.push(o);
          });
        }
        plan.data = dt;
        this.setplans(plan);
      })
      .catch(err => {
        this.setregLoader(false);
        let msg = err.response.data.message || err.response.status;
        console.log(`Error in get all plan ${db.apis.GET_All_Plan} : `, msg);
        if (msg == 503 || msg == 500) {
          Alert.alert('', 'Server not response');
          // store.General.setisServerError(true);
          return;
        }
        // seterror(msg.toString())
        Alert.alert('', msg.toString());
      });
  }

  @action.bound
  applyPromo(body, seterror, suc) {
    console.warn('apply promo body : ', body);
    this.setregLoader(true);

    db.hitApi(db.apis.CHECK_PROMO + body, 'get', {}, null)
      ?.then(resp => {
        this.setregLoader(false);
        console.log(
          `response check promo  ${db.apis.CHECK_PROMO} : `,
          resp.data,
        );
        let rsp = resp.data.data[0];
        suc(rsp);
      })
      .catch(err => {
        this.setregLoader(false);
        let msg = err.response.data.message || err.response.status || err;
        console.log(`Error in check promo  ${db.apis.CHECK_PROMO} : `, msg);
        if (msg == 503 || msg == 500) {
          Alert.alert('', 'Server not response');
          // store.General.setisServerError(true);
          return;
        }
        if (msg == 'No records found') {
          Alert.alert('', 'Promo code not exist!');
          return;
        }
        // seterror(msg.toString())
        Alert.alert('', msg.toString());
      });
  }

  @action.bound
  updateUser(body, c, seterror, setPhoto1Upload, setup, setuc, uid, token) {
    let bd =
      c == 'Profile'
        ? {
            image: body.photo,
          }
        : {
            identityProof: body.cnic_front_image,
            identityStatus: 'pending',
          };
    console.warn('Update user photo body : ', bd);
    db.hitApi(db.apis.UPDATE_USER + uid, 'put', bd, token)
      ?.then(resp => {
        this.setregLoader(false);
        console.log(
          `response update user ${db.apis.UPDATE_USER + uid} : `,
          resp.data,
        );

        if (c == 'Profile') {
          setup(body.photo);
          setPhoto1Upload(1);
        }
        if (c == 'CnicF') {
          setuc(body.cnic_front_image);
          setPhoto1Upload(2);
        }
      })
      .catch(err => {
        this.setregLoader(false);
        let msg = err.response.data.message || err.response.status || err;
        console.log(`Error in update user ${db.apis.UPDATE_USER} : `, msg);
        if (msg == 503 || msg == 500) {
          Alert.alert('', 'Server not response');
          // store.General.setisServerError(true);
          return;
        }
        // seterror(msg.toString())
        Alert.alert('', msg.toString());
      });
  }

  attemptToUploadImage(
    imgArr,
    seterror,
    setPhoto1Upload,
    setup,
    setuc,
    uid,
    token,
  ) {
    console.warn('upload photo body : ', imgArr[0]);
    this.setregLoader(true);
    let e = imgArr[0];
    let body = {};
    const data = new FormData();
    const newFile = {
      uri: e.uri,
      type: e.type,
      name: e.fileName,
    };
    data.append('files', newFile);
    fetch(db.apis.BASE_URL + db.apis.IMAGE_UPLOAD, {
      method: 'post',
      body: data,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(response => response.json())
      .then(responseData => {
        console.warn('upload photo success : ');
        let rsp = responseData.data[0].imgrUrl;
        if (e.chk == 'Profile') {
          body = {
            photo: rsp,
          };
        }

        if (e.chk == 'CnicF') {
          body = {
            cnic_front_image: rsp,
          };
        }

        this.updateUser(
          body,
          e.chk,
          seterror,
          setPhoto1Upload,
          setup,
          setuc,
          uid,
          token,
        );
      })
      .catch(err => {
        this.setregLoader(false);
        // console.log(`Error in upload image ${db.apis.IMAGE_UPLOAD} : `, err);
        let msg = err.response.data.message || err.response.status || err;
        console.log(`Error in upload image ${db.apis.IMAGE_UPLOAD} : `, msg);
        if (msg == 503 || msg == 500) {
          Alert.alert('', 'Server not response');
          // store.General.setisServerError(true);
          return;
        }
        // seterror(msg.toString())
        Alert.alert('', msg.toString());
      });
  }

  @action.bound
  SubPlan(body, uid, token, seterror, suc) {
    console.warn('plan subscribe body : ', body);
    this.setregLoader(true);
    db.hitApi(db.apis.UPDATE_USER + uid, 'put', body, token)
      ?.then(resp => {
        this.setregLoader(false);
        console.log(
          `response pan subscribe  ${db.apis.UPDATE_USER + uid} : `,
          resp.data,
        );
        let rsp = resp.data.data;

        suc(rsp);
      })
      .catch(err => {
        this.setregLoader(false);
        let msg = err.response.data.message || err.response.status || err;
        console.log(`Error in update user ${db.apis.UPDATE_USER} : `, msg);
        if (msg == 503 || msg == 500) {
          Alert.alert('', 'Server not response');
          // store.General.setisServerError(true);
          return;
        }
        // seterror(msg.toString())
        Alert.alert('', msg.toString());
      });
  }

  @action.bound
  getUserById(uid, token, c) {
    console.warn(' get user by id : ', uid);
    this.setregLoader(true);
    db.hitApi(db.apis.GET_USER_BY_ID + uid, 'get', {}, token)
      ?.then(resp => {
        this.setregLoader(false);
        console.log(
          `response get user by id  ${db.apis.GET_USER_BY_ID + uid} : `,
          resp.data,
        );
        let rsp = resp.data.data[0];

        if (rsp.status == 'blocked') {
          Alert.alert(
            '',
            'Your account has been blocked. Please contact customer support',
            [{text: 'OK', onPress: () => this.Logout()}],
          );
          return;
        }

        this.addUser(token, rsp, c);
        store.Trips.setsaveTrips(rsp.savedTrips || []);
      })
      .catch(err => {
        this.setregLoader(false);
        let msg = err.response.data.message || err.response.status || err;
        console.log(
          `Error in get user by id ${db.apis.GET_USER_BY_ID + uid} : `,
          msg,
        );
        if (msg == 503 || msg == 500) {
          Alert.alert('', 'Server not response');
          // store.General.setisServerError(true);
          return;
        }
        if (msg == 'No records found') {
          this.Logout();
          return;
        }
        // seterror(msg.toString())
        Alert.alert('', msg.toString());
      });
  }

  @action.bound
  getUserById1(uid, token, c) {
    console.warn(' get user by id : ', uid);
    db.hitApi(db.apis.GET_USER_BY_ID + uid, 'get', {}, token)
      ?.then(resp => {
        console.log(
          `response get user by id  ${db.apis.GET_USER_BY_ID + uid} : `,
          resp.data,
        );
        let rsp = resp.data.data[0];

        if (rsp.status == 'blocked') {
          Alert.alert(
            '',
            'Your account has been blocked. Please contact customer support',
            [{text: 'OK', onPress: () => this.Logout()}],
          );
          return;
        }

        this.addauthToken(token);
        this.setUser(rsp);
        store.Trips.setsaveTrips(rsp.savedTrips || []);
      })
      .catch(err => {
        let msg = err.response.data.message || err.response.status || err;
        console.log(
          `Error in get user by id ${db.apis.GET_USER_BY_ID + uid} : `,
          msg,
        );
        if (msg == 503 || msg == 500) {
          Alert.alert('', 'Server not response');
          // store.General.setisServerError(true);
          return;
        }
        if (msg == 'No records found') {
          this.Logout();
          return;
        }
        // seterror(msg.toString())
        Alert.alert('', msg.toString());
      });
  }

  @action.bound
  forgotPassword(body, goto, seterror) {
    console.warn('Forgot Pswd  body : ', body);
    this.setregLoader(true);

    db.hitApi(db.apis.FORGOT_PSWD, 'put', body, null)
      ?.then(resp => {
        this.setregLoader(false);
        console.log(`Forgot Pswd res ${db.apis.FORGOT_PSWD} : `, resp.data);
        goto('email', body.email, null);
      })
      .catch(err => {
        this.setregLoader(false);
        let msg = err.response.data.message || err.response.status || err;
        console.log(`Error in update user ${db.apis.UPDATE_USER} : `, msg);
        if (msg == 503 || msg == 500) {
          Alert.alert('', 'Server not response');
          // store.General.setisServerError(true);
          return;
        }
        // seterror(msg.toString())
        Alert.alert('', msg.toString());
      });
  }

  @action.bound
  forgotPassword2(body, suc) {
    console.warn('Forgot Pswd  body : ', body);
    this.setregLoader(true);

    db.hitApi(db.apis.FORGOT_PSWD, 'put', body, null)
      ?.then(resp => {
        this.setregLoader(false);
        console.log(`Forgot Pswd res ${db.apis.FORGOT_PSWD} : `, resp.data);
        suc(null);
      })
      .catch(err => {
        this.setregLoader(false);
        let msg = err.response.data.message || err.response.status || err;
        console.log(`Error in update user ${db.apis.UPDATE_USER} : `, msg);
        if (msg == 503 || msg == 500) {
          Alert.alert('', 'Server not response');
          // store.General.setisServerError(true);
          return;
        }
        // seterror(msg.toString())
        Alert.alert('', msg.toString());
      });
  }

  @action.bound
  isPhoneExist(p, suc, seterror) {
    let phone = p.substring(1);
    console.warn('isPhoneExist  body : ', phone);
    this.setregLoader(true);

    db.hitApi(db.apis.IS_PHONE_EXIST + phone, 'get', {}, null)
      ?.then(resp => {
        // this.setregLoader(false);
        console.log(
          `isPhoneExist res :  ${db.apis.IS_PHONE_EXIST}${phone} : `,
          resp.data,
        );
        suc(p);
      })
      .catch(err => {
        this.setregLoader(false);
        let msg = err.response.data.message || err.response.status || err;
        console.log(
          `Error in isPhoneExist ${db.apis.IS_PHONE_EXIST}${phone} : `,
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
  }

  @action.bound
  attemptToVerifyCode(body, suc, suc2) {
    console.warn('attemptToVerifyCode  body : ', body);
    this.setregLoader(true);

    db.hitApi(db.apis.VERIFY_PIN, 'put', body, null)
      ?.then(resp => {
        this.setregLoader(false);
        console.log(
          `attemptToVerifyCode res ${db.apis.VERIFY_PIN} : `,
          resp.data,
        );
        suc(body.email);
        suc2(true);
      })
      .catch(err => {
        this.setregLoader(false);
        let msg = err.response.data.message || err.response.status || err;
        console.log(
          `Error in attemptToVerifyCode ${db.apis.VERIFY_PIN} : `,
          msg,
        );
        if (msg == 503 || msg == 500) {
          Alert.alert('', 'Server not response');
          // store.General.setisServerError(true);
          return;
        }
        if (msg == 'Pin Code is incorrect.') {
          suc2(false);
          return;
        }
        // seterror(msg.toString())
        Alert.alert('', msg.toString());
      });
  }

  @action.bound
  updatePasword(body, seterror, sucs) {
    console.warn('Update Psswd user body : ', body);
    this.setregLoader(true);

    db.hitApi(db.apis.UPD_PSWD, 'put', body, null)
      ?.then(resp => {
        this.setregLoader(false);
        console.log(`Update Psswd res ${db.apis.UPD_PSWD} : `, resp.data);
        sucs();
      })
      .catch(err => {
        this.setregLoader(false);
        let msg = err.response.data.message || err.response.status || err;
        console.log(`Error in Update Psswd ${db.apis.UPD_PSWD} : `, msg);
        if (msg == 503 || msg == 500) {
          Alert.alert('', 'Server not response');
          // store.General.setisServerError(true);
          return;
        }
        // seterror(msg.toString())
        Alert.alert('', msg.toString());
      });
  }

  @action.bound
  Logout() {
    this.clearUser();
    store.Trips.clearTrips();
    store.Filters.clearAllFilters();
    this.setisNotification(true);
  }

  @action.bound
  clearUser = () => {
    this.setUser(false);
    this.setphotos([]);
    this.setreview([]);
    this.settrips([]);
    this.setfollowers([]);
    this.setfollowing([]);
    this.settotalfollowers(0);
    this.settotalfollowing(0);
    this.setfscreen('');
    this.addauthToken('');
    this.setisAnyTrade(false);
    this.setisOneReview(false);
  };

  // attemptToUploadImageEPS(body, p, c, seterror, suc) {
  //   this.setregLoader(true);

  //   setTimeout(() => {
  //     let myObject = {...this.user, ...body};
  //     myObject.photo = p;
  //     myObject.cnic_front_image = c;
  //     this.setUser(myObject);
  //     this.setregLoader(false);
  //     suc();
  //   }, 1000);
  // }

  attemptToEditupdateUser(body, setErrMessage, uid, suc) {
    // let body = {...this.user, ...body};
    console.warn('Edit Update user   body : ', body);

    db.hitApi(db.apis.UPDATE_USER + uid, 'put', body, this.authToken)
      ?.then(resp => {
        this.setregLoader(false);
        console.log(
          `response Edit Update user  ${db.apis.UPDATE_USER + uid} : `,
          resp.data,
        );

        let rsp = resp.data.data;
        this.setUser(rsp);
        suc();
      })
      .catch(err => {
        this.setregLoader(false);
        let msg = err.response.data.message || err.response.status || err;
        console.log(
          `Error in Edit Update user  ${db.apis.UPDATE_USER} : `,
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
  }

  attemptToEditUploadImage(bd, setErrMessage, uid, imgArr, suc) {
    console.warn('upload photo body : ', imgArr);

    let body = {...bd};
    let ii = 0;
    imgArr.map((e, i, a) => {
      const data = new FormData();
      const newFile = {
        uri: e.uri,
        type: e.type,
        name: e.fileName,
      };
      data.append('files', newFile);
      fetch(db.apis.BASE_URL + db.apis.IMAGE_UPLOAD, {
        method: 'post',
        body: data,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
        .then(response => response.json())
        .then(responseData => {
          console.warn('upload photo success : ');
          let rsp = responseData.data[0].imgrUrl;
          if (e.chk == 'Profile') {
            body.image = rsp;
          }

          if (e.chk == 'CnicF') {
            body.identityProof = rsp;
          }
          ii++;
          if (ii == a.length) {
            this.attemptToEditupdateUser(body, setErrMessage, uid, suc);
            return;
          }
        })
        .catch(err => {
          this.setregLoader(false);
          // console.log(`Error in upload image ${db.apis.IMAGE_UPLOAD} : `, err);
          let msg = err.response.data.message || err.response.status || err;
          console.log(`Error in upload image ${db.apis.IMAGE_UPLOAD} : `, msg);
          if (msg == 503 || msg == 500) {
            Alert.alert('', 'Server not response');
            // store.General.setisServerError(true);
            return;
          }
          // seterror(msg.toString())
          Alert.alert('', msg.toString());
        });
    });
  }

  @action.bound
  attemptToGetState() {
    console.log(`get state`);
    db.hitApi(db.apis.GET_STATE, 'get', {}, null)
      ?.then(resp => {
        console.log(`response get state ${db.apis.GET_STATE} : `, resp.data);
        let rsp = resp.data.data;
        store.Filters.settripLocation(rsp);
      })
      .catch(err => {
        let msg = err.response.data.message || err.response.status;
        console.log(`Error in get all plan ${db.apis.GET_STATE} : `, msg);
        if (msg == 503 || msg == 500) {
          Alert.alert('', 'Server not response');
          // store.General.setisServerError(true);
          return;
        }
        if (msg == 'No records found') {
          store.Filters.settripLocation([]);
          return;
        }
        // seterror(msg.toString())
        Alert.alert('', msg.toString());
      });
  }

  @action.bound
  attemptToGetActivity() {
    console.log(`get activity`);
    db.hitApi(db.apis.GET_ACTIVITY, 'get', {}, null)
      ?.then(resp => {
        console.log(
          `response get activity ${db.apis.GET_ACTIVITY} : `,
          resp.data,
        );
        let rsp = resp.data.data;
        store.Filters.setactivity(rsp);
      })
      .catch(err => {
        let msg = err.response.data.message || err.response.status;
        console.log(`Error in get  activity ${db.apis.GET_ACTIVITY} : `, msg);
        if (msg == 503 || msg == 500) {
          Alert.alert('', 'Server not response');
          // store.General.setisServerError(true);
          return;
        }
        if (msg == 'No records found') {
          store.Filters.setactivity([]);
          return;
        }
        // seterror(msg.toString())
        Alert.alert('', msg.toString());
      });
  }

  @action.bound
  attemptToGetSpecies() {
    console.log(`get Species`);
    db.hitApi(db.apis.GET_SPECIES, 'get', {}, null)
      ?.then(resp => {
        console.log(
          `response get Species ${db.apis.GET_SPECIES} : `,
          resp.data,
        );
        let rsp = resp.data.data;

        store.Filters.setspecies(rsp);
      })
      .catch(err => {
        let msg = err.response.data.message || err.response.status;
        console.log(`Error in get  Species ${db.apis.GET_SPECIES} : `, msg);
        if (msg == 503 || msg == 500) {
          Alert.alert('', 'Server not response');
          // store.General.setisServerError(true);
          return;
        }
        if (msg == 'No records found') {
          store.Filters.setspecies([]);
          return;
        }
        // seterror(msg.toString())
        Alert.alert('', msg.toString());
      });
  }

  @action.bound
  submitSupport(bd, suc) {
    console.warn('submitSupport body : ', bd);
    this.setregLoader(true);

    setTimeout(() => {
      this.setregLoader(false);
      suc();
    }, 1000);

    // db.hitApi(db.apis.SUBMIT_SUPPORT + uid, 'put', bd, token)
    //   ?.then(resp => {
    //     this.setregLoader(false);
    //     console.log(
    //       `response submitSupport  ${db.apis.SUBMIT_SUPPORT  } : `,
    //       resp.data,
    //     );

    //   })
    //   .catch(err => {
    //     this.setregLoader(false);
    //     let msg = err.response.data.message || err.response.status || err;
    //     console.log(`Error in submitSupport  ${db.apis.SUBMIT_SUPPORT} : `, msg);
    //     if (msg == 503 || msg == 500) {
    //       Alert.alert('', 'Server not response');
    //       // store.General.setisServerError(true);
    //       return;
    //     }
    //     // seterror(msg.toString())
    //     Alert.alert('', msg.toString());
    //   });
  }

  @action.bound
  ChangePassword(cp, np, rp, suc) {
    this.setLoader(true);
    let body = {
      curr_pass: cp,
      confirm_pass: rp,
      new_pass: np,
    };

    console.log('auth token : ', this.authToken);

    db.hitApi(
      db.apis.CHANGE_PASSWORD + this.user._id,
      'put',
      body,

      this.authToken,
    )
      ?.then(resp => {
        console.log(`response  ${db.apis.CHANGE_PASSWORD} : `, resp.data);
        suc();
      })
      .catch(err => {
        this.setLoader(false);
        console.log(
          `Error in ${db.apis.CHANGE_PASSWORD} : `,
          err.response.data.message,
        );

        Alert.alert('', err.response.data.message);
      });
  }

  attemptToUploadImage2(imgArr, seterror, sp, cpm) {
    this.setregLoader(true);
    setTimeout(() => {
      let body = {};
      if (imgArr[0].chk == 'Profile') {
        body = {
          photo: imgArr[0].uri,
        };
      }

      if (imgArr[0].chk == 'CnicF') {
        body = {
          cnic_front_image: imgArr[0].uri,
        };
      }

      this.updateUser2(body, seterror, sp, cpm);
    }, 2000);

    // if (imgArr.length > 0) {
    //   let ra = [];
    //   this.setregLoader(true);
    //   try {
    //     imgArr.map((e, i, a) => {
    //       const data = new FormData();
    //       const newFile = {
    //         uri: e.uri,
    //         type: e.type,
    //         name: e.fileName,
    //       };
    //       data.append('files', newFile);
    //       fetch(db.apis.BASE_URL + db.apis.IMAGE_UPLOAD, {
    //         method: 'post',
    //         body: data,
    //         headers: {
    //           'Content-Type': 'multipart/form-data',
    //         },
    //       })
    //         .then(response => response.json())
    //         .then(responseData => {
    //           let c = responseData.data[0].imgrUrl;
    //           if (e.chk == 'Profile') {
    //             ra.push({c: e.chk, uri: c});
    //           }
    //           if (i == a.length - 1) {
    //             if (ra.length > 0) {
    //               if (ra[0].c == 'Profile') {
    //                 const body = {
    //                   photo: ra[0].uri,
    //                 };
    //                 this.updateUser(body, ra[0].c,seterror,setPhoto1Upload, setup,setuc);
    //                 return;
    //               }

    //               if (ra[0].c == 'CnicF') {
    //                 const body = {
    //                 cnic_front_image: ra[0].uri,
    //                 };
    //                 this.updateUser(body, ra[0].c,,seterror,setPhoto1Upload);
    //                 return;
    //               }

    //             }
    //           }
    //         })
    //         .catch(err => {
    //           this.setregLoader(false);
    //           let msg = err.response.data.message || err.response.status;
    //           console.log('Error in Upload Images arr', msg);
    //           if (msg == 503 || msg == 500) {
    //             store.General.setisServerError(true);
    //             return;
    //           }
    //           // seterror(msg.toString())
    //           Alert.alert('', msg.toString());
    //         });
    //     });
    //   } catch (err) {
    //     this.setregLoader(false);
    //     let msg = err.response.data.message || err.response.status;
    //     console.log('Error in Upload Images arr', msg);
    //     if (msg == 503 || msg == 500) {
    //       store.General.setisServerError(true);
    //       return;
    //     }
    //     // seterror(msg.toString())
    //     Alert.alert('', msg.toString());
    //   }
    // }
  }

  @action.bound
  updateUser2(body, seterror, sp, cpm) {
    console.warn('Update user body : ', body);

    this.setregLoader(false);

    let myObject = {...this.user, ...body};

    this.setUser(myObject);
    cpm();
    sp(false);
    // hitApi('user/' + this.user._id, 'put', body, this.authToken)
    //   ?.then((resp: any) => {
    //     console.log('Update user  resp : ', resp.data.data);
    //     this.setregLoader(false);
    //     // this.setUser(resp.data.data);
    //   })
    //   .catch(err => {
    //     // this.setregLoader(false);
    //     //     let msg = err.response.data.message || err.response.status;
    //     //     console.log(`Error in ${db.apis.REGISTER_USER} : `, msg);
    //     //     if (msg == 503 || msg == 500) {
    //     //       store.General.setisServerError(true);
    //     //       return;
    //     //     }
    //     //     seterror(msg.toString())
    //     //     // Alert.alert('', msg.toString());
    //   });
  }

  // attemptToUploadImageEP(body, imgArr, seterror, suc) {
  //   this.setregLoader(true);

  //   // if (imgArr.length > 0) {

  //   // } else {
  //   setTimeout(() => {
  //     let myObject = {...this.user, ...body};

  //     this.setUser(myObject);
  //     this.setregLoader(false);
  //     suc();
  //   }, 1000);
  //   }

  // if (imgArr.length > 0) {
  //   let ra = [];
  //   this.setregLoader(true);
  //   try {
  //     imgArr.map((e, i, a) => {
  //       const data = new FormData();
  //       const newFile = {
  //         uri: e.uri,
  //         type: e.type,
  //         name: e.fileName,
  //       };
  //       data.append('files', newFile);
  //       fetch(db.apis.BASE_URL + db.apis.IMAGE_UPLOAD, {
  //         method: 'post',
  //         body: data,
  //         headers: {
  //           'Content-Type': 'multipart/form-data',
  //         },
  //       })
  //         .then(response => response.json())
  //         .then(responseData => {
  //           let c = responseData.data[0].imgrUrl;
  //           if (e.chk == 'Profile') {
  //             ra.push({c: e.chk, uri: c});
  //           }
  //           if (i == a.length - 1) {
  //             if (ra.length > 0) {
  //               if (ra[0].c == 'Profile') {
  //                 const body = {
  //                   photo: ra[0].uri,
  //                 };
  //                 this.updateUser(body, ra[0].c,seterror,setPhoto1Upload, setup,setuc);
  //                 return;
  //               }

  //               if (ra[0].c == 'CnicF') {
  //                 const body = {
  //                 cnic_front_image: ra[0].uri,
  //                 };
  //                 this.updateUser(body, ra[0].c,,seterror,setPhoto1Upload);
  //                 return;
  //               }

  //             }
  //           }
  //         })
  //         .catch(err => {
  //           this.setregLoader(false);
  //           let msg = err.response.data.message || err.response.status;
  //           console.log('Error in Upload Images arr', msg);
  //           if (msg == 503 || msg == 500) {
  //             store.General.setisServerError(true);
  //             return;
  //           }
  //           // seterror(msg.toString())
  //           Alert.alert('', msg.toString());
  //         });
  //     });
  //   } catch (err) {
  //     this.setregLoader(false);
  //     let msg = err.response.data.message || err.response.status;
  //     console.log('Error in Upload Images arr', msg);
  //     if (msg == 503 || msg == 500) {
  //       store.General.setisServerError(true);
  //       return;
  //     }
  //     // seterror(msg.toString())
  //     Alert.alert('', msg.toString());
  //   }
  // }

  changePasword(body, seterror, incp, sucs) {
    console.warn('Update Psswd user body : ', body);
    this.setregLoader(true);

    setTimeout(() => {
      this.setregLoader(false);
      sucs();
      // incp(true);
      // Alert.alert('', msg.toString());
      // seterror('asa as');
    }, 1000);

    // db.hitApi(db.apis.REGISTER_USER, 'post', body, null)
    //   ?.then(resp => {
    //     console.log(`response  ${db.apis.REGISTER_USER} : `, resp.data);
    //     this.setregLoader(false);
    //     this.addUser(resp.data.token, resp.data.data);
    //   })
    //   .catch(err => {
    //     this.setregLoader(false);
    //     let msg = err.response.data.message || err.response.status;
    //     console.log(`Error in ${db.apis.REGISTER_USER} : `, msg);
    //     if (msg == 503 || msg == 500) {
    //       store.General.setisServerError(true);
    //       return;
    //     }
    //     seterror(msg.toString())
    //     // Alert.alert('', msg.toString());
    //   });
  }

  getData(seterror) {
    // console.warn('get home data');
    // this.setregLoader(true);

    // setTimeout(() => {
    //   this.setregLoader(false);
    let token = '';
    let rslt = 'guest';
    this.addUser(token, rslt);
    // Alert.alert('', msg.toString());
    // seterror('asa as');
    // }, 1200);

    // db.hitApi(db.apis.REGISTER_USER, 'post', body, null)
    //   ?.then(resp => {
    //     console.log(`response  ${db.apis.REGISTER_USER} : `, resp.data);
    //     this.setregLoader(false);
    //     this.addUser(resp.data.token, resp.data.data);
    //   })
    //   .catch(err => {
    //     this.setregLoader(false);
    //     let msg = err.response.data.message || err.response.status;
    //     console.log(`Error in ${db.apis.REGISTER_USER} : `, msg);
    //     if (msg == 503 || msg == 500) {
    //       store.General.setisServerError(true);
    //       return;
    //     }
    //     seterror(msg.toString())
    //     // Alert.alert('', msg.toString());
    //   });
  }
}

export const Userv = new userv();
