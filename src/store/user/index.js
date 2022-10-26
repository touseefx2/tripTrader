import {observable, makeObservable, action} from 'mobx';
import {persist} from 'mobx-persist';
import store from '../index';
import NetInfo from '@react-native-community/netinfo';
import db from '../../database/index';
import {Alert} from 'react-native';
// import carStore from '../index';
// import NotificationManager from '../index';
// import db from '../../database/index';
// import utils from '../../utils';
// import store from '../index';
// import auth from '@react-native-firebase/auth';

class user {
  constructor() {
    makeObservable(this);
  }

  @persist('object') @observable isNotification = true;

  @action setisNotification = obj => {
    this.isNotification = obj;
  };

  @observable vuser = false;
  @observable fscreen = '';

  @persist('object') @observable user = false;

  @persist('object') @observable followers = [];
  @persist('object') @observable totalfollowers = 0;
  @persist('object') @observable following = [];
  @persist('object') @observable totalfollowing = 0;
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

  @persist('object') @observable review = [];
  @persist('object') @observable trips = [];
  @persist('object') @observable photos = [];

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

  @action attemptToGetReviews = (uid, setgetdata, setrfrsh, dt) => {
    console.warn('getReviesData : ', 'true');
    this.setreviewLoader(true);
    setTimeout(() => {
      this.setreviewLoader(false);
      setgetdata(true);
      setrfrsh(false);
      this.setreview(dt);
    }, 1000);
  };

  @action attemptToGetTrips = (uid, setgetdata, setrfrsh, dt) => {
    console.warn('getTripsData : ', 'true');
    this.settripLoader(true);
    setTimeout(() => {
      this.settripLoader(false);
      setgetdata(true);
      setrfrsh(false);
      this.settrips(dt);
    }, 1000);
  };

  @action attemptToGetPhotos = (uid, setgetdata, setrfrsh, dt) => {
    console.warn('getPhotosData : ', 'true');
    this.setphotosLoader(true);
    setTimeout(() => {
      this.setphotosLoader(false);
      setgetdata(true);
      setrfrsh(false);
      this.setphotos(dt);
    }, 1000);
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
    setTimeout(() => {
      this.setmLoader(false);
      let i = obj.i;
      let reply = {
        user: this.user,
        comment: cmnt,
        created_at: new Date(),
      };
      this.review[i].reply = reply;
      suc();
    }, 1000);
  };
  @action attemptToEditComment = (obj, cmnt, suc) => {
    console.warn('edit comment  : ', 'true');
    this.setmLoader(true);
    setTimeout(() => {
      this.setmLoader(false);
      let i = obj.i;

      this.review[i].reply.comment = cmnt;
      suc();
    }, 1000);
  };
  @action attemptToDeleteComment = (obj, suc) => {
    console.warn('delete comment  : ', 'true');
    this.setmLoader(true);
    setTimeout(() => {
      this.setmLoader(false);
      let i = obj.i;

      delete this.review[i].reply;
      suc();
    }, 1000);
  };
  @action attemptToDisputeComment = (obj, suc) => {
    console.warn('delete comment  : ', 'true');
    this.setmLoader(true);
    setTimeout(() => {
      this.setmLoader(false);
      let i = obj.i;
      this.review[i].dispute = {created_at: new Date()};
      suc();
    }, 1000);
  };

  @observable ctripsLoader = false;
  @observable editTripObj = false;
  @observable editTrip = false;

  @observable homeModalLoder = false;
  @action attemptToOfferSend = (obj, suc) => {
    console.warn('send offer  : ', 'true');
    this.sethomeModalLoder(true);
    setTimeout(() => {
      this.sethomeModalLoder(false);
      suc(true);
    }, 1000);
  };

  @action attemptToMessageSend = (obj, suc) => {
    console.warn('message send  : ', 'true');
    this.sethomeModalLoder(true);
    setTimeout(() => {
      this.sethomeModalLoder(false);
      suc(true);
    }, 1000);
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

  @action attemptToCreateTrip = (obj, suc) => {
    console.warn('create trip  : ', 'true');
    this.setctripLoader(true);
    setTimeout(() => {
      this.setctripLoader(false);
      this.seteditTripObj({data: obj, index: 0});
      //   let d=this.trips.slice();
      //   d.push(obj)
      // this.settrips(dt);

      this.addtrips(obj);

      suc(true);
    }, 1500);
  };

  @action attemptToUpdateTrip = (obj, index, suc) => {
    console.warn('update trip  : ', 'true');
    this.setctripLoader(true);
    setTimeout(() => {
      this.setctripLoader(false);
      this.seteditTripObj(obj);
      //   let d=this.trips.slice();
      //   d.push(obj)
      // this.settrips(dt);

      this.updatetrips(obj, index);

      suc(true);
    }, 1500);
  };

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
  @persist @observable authToken = '';

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
    console.log('token : ', token);
    console.log('user : ', user);
    this.addauthToken(token);
    this.setUser(user);

    store.General.setgoto(chk == '' ? 'home' : chk);
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

  // @action.bound
  // attempToPlaceOrder(Order, suc) {
  //   this.setLoader(true);
  //   db.hitApi(db.apis.PLACE_ORDER, 'post', Order, null)
  //     ?.then(resp => {
  //       this.setLoader(false)
  //       console.log(`response  ${db.apis.PLACE_ORDER} : `, resp.data);
  //       suc(resp.data);
  //     })
  //     .catch(err => {
  //       console.log(
  //         `Error in ${db.apis.PLACE_ORDER} : `,
  //         err.response.data.message,
  //       );
  //       this.setLoader(false);
  //     });
  // }

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

        this.addUser(token, rsp, '');
        this.setemail(body.email);
        this.setsp(svp);

        if (svp) {
          this.setpswd(body.pswd);
        } else {
          this.setpswd('');
        }
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
        db.hitApi(db.apis.GET_All_Plan, 'get', body, null)
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

        suc(rsp.subscription);
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
        store.General.setgoto(c);
        this.addUser(token, rsp, c);
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
        goto('email', body.email);
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
  isPhoneExist(phone, suc, seterror) {
    console.warn('isPhoneExist  body : ', phone);
    this.setregLoader(true);

    db.hitApi(db.apis.IS_PHONE_EXIST, 'get', {}, null)
      ?.then(resp => {
        this.setregLoader(false);
        console.log(`isPhoneExist res ${db.apis.IS_PHONE_EXIST} : `, resp.data);
        // suc(phone);
      })
      .catch(err => {
        this.setregLoader(false);
        let msg = err.response.data.message || err.response.status || err;
        console.log(`Error in isPhoneExist ${db.apis.IS_PHONE_EXIST} : `, msg);
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
  attemptToVerifyCode(body, suc) {
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
    this.addauthToken('');
    this.setphn('');
    this.setcntr('');
    this.setpwc('');
    this.clearcurrentUser();
    this.clearOtherUser();
  };

  @action clearcurrentUser = () => {
    this.setUser(false);
    this.setphotos([]);
    this.setreview([]);
    this.settrips([]);
    this.setfollowers([]);
    this.setfollowing([]);
    this.settotalfollowers(0);
    this.settotalfollowing(0);
  };

  @action clearOtherUser = () => {
    this.setvUser(false);
    this.setphotoso([]);
    this.setreviewo([]);
    this.settripso([]);
    this.setfscreen('');

    // this.setfollowers([]);
    // this.setfollowing([]);
    // this.settotalfollowers(0);
    // this.settotalfollowing(0);
  };

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

  attemptToUploadImageEPS(body, p, c, seterror, suc) {
    this.setregLoader(true);

    setTimeout(() => {
      let myObject = {...this.user, ...body};
      myObject.photo = p;
      myObject.cnic_front_image = c;
      this.setUser(myObject);
      this.setregLoader(false);
      suc();
    }, 1000);
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

export const User = new user();
