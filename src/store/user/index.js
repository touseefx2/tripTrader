import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import {action, makeObservable, observable} from 'mobx';
import {persist} from 'mobx-persist';
import {Alert} from 'react-native';
import db from '../../database/index';
import store from '../index';
import {Notification} from '../../services/Notification';
import {FireStore} from '../../services/FireStore';

class user {
  constructor() {
    makeObservable(this);
  }

  @observable cchk = '';
  @observable ffuser = '';
  @observable ccc = '';
  @action setcchk = obj => {
    this.cchk = obj;
  };
  @action setffuser = obj => {
    this.ffuser = obj;
  };
  @action setccc = obj => {
    this.ccc = obj;
  };

  @observable chk = '';
  @observable fuser = '';
  @observable cc = '';
  @action setchk = obj => {
    this.chk = obj;
  };
  @action setfuser = obj => {
    this.fuser = obj;
  };

  @action setcc = obj => {
    this.cc = obj;
  };

  @persist('object') @observable plans = false;
  @action setplans = obj => {
    this.plans = obj;
  };

  @persist('object') @observable isNotification = false;

  @action setisNotification = obj => {
    this.isNotification = obj;
  };

  @observable resendLoder = false;

  @observable vuser = false;
  @observable fscreen = '';

  @observable dlc = false; //feletechat loader
  @action setdlc = obj => {
    this.dlc = obj;
  };

  @persist('object') @observable user = false;
  @persist('object') @observable userCardInfo = [];
  @observable ucRef = false;
  @action setuserCardInfo = obj => {
    this.userCardInfo = obj;
  };
  @action setucRef = obj => {
    this.ucRef = obj;
  };

  @persist('object') @observable followers = [];
  @persist('object') @observable totalfollowers = 0;
  @persist('object') @observable following = [];
  @persist('object') @observable totalfollowing = 0;
  @persist('object') @observable blockUsers = [];
  @persist('object') @observable totalblockUsers = 0;
  @persist('object') @observable inbox = [];
  @persist('object') @observable unreadInbox = 0;
  @observable fl = false;
  @observable bl = false;
  @observable ibl = false;

  @observable logoutLoader = false;
  @action setLogoutLoader = obj => {
    this.logoutLoader = obj;
  };

  @observable sendMessageLoader = false;
  @action setSendMessageLoader = obj => {
    this.sendMessageLoader = obj;
  };

  @observable pasObj = false;
  @action setpasObj = obj => {
    this.pasObj = obj;
  };

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
  @action setinbox = obj => {
    this.inbox = obj;
  };
  @action setfl = obj => {
    this.fl = obj;
  };
  @action setbl = obj => {
    this.bl = obj;
  };
  @action setibl = obj => {
    this.ibl = obj;
  };
  @action setunreadInbox = obj => {
    this.unreadInbox = obj;
  };

  @observable messages = [];
  @observable messagesLoader = false;
  @action setmessages = obj => {
    this.messages = obj;
  };
  @action setmessagesLoader = obj => {
    this.messagesLoader = obj;
  };

  @action attemptToGetFollowers = (uid, setgetdata, setrfrsh) => {
    console.log('GET Followers  : ', 'true');
    this.setfl(true);

    db.hitApi(db.apis.GET_FOLLOWERS + uid, 'get', {}, this.authToken)
      ?.then(resp => {
        this.setfl(false);
        setrfrsh(false);
        // console.log(
        //   `response GET Followers   ${db.apis.GET_FOLLOWERS + uid} : `,
        //   resp.data,
        // );
        let dt = resp.data.follower || [];
        setgetdata(true);
        this.setfollowers(dt);
        this.settotalfollowers(dt.length);
      })
      .catch(err => {
        this.setfl(false);
        setrfrsh(false);
        let msg = err.response.data.message || err.response.status || err;
        console.log(
          `Error in GET Followers  ${db.apis.GET_FOLLOWERS + uid} : `,
          msg,
        );
        if (msg == 503 || msg == 500) {
          // Alert.alert('', 'Server not response');
          // store.General.setisServerError(true);
          return;
        }
        if (msg == 'No records found') {
          this.setfollowers([]);
          this.settotalfollowers(0);
          return;
        }

        // Alert.alert('', msg.toString());
      });
  };
  @action attemptToGetFollowing = (uid, setgetdata, setrfrsh) => {
    console.log('GET Followers  : ', 'true');
    this.setfl(true);

    db.hitApi(db.apis.GET_FOLLOWING + uid, 'get', {}, this.authToken)
      ?.then(resp => {
        this.setfl(false);
        setrfrsh(false);
        // console.log(
        //   `response GET FOLLOWING  ${db.apis.GET_FOLLOWING + uid} : `,
        //   resp.data,
        // );
        let dt = resp.data.following || [];
        // console.log('dttt flwng : ', dt);
        setgetdata(true);
        this.setfollowing(dt);
        this.settotalfollowing(dt.length);
      })
      .catch(err => {
        this.setfl(false);
        setrfrsh(false);
        let msg = err.response.data.message || err.response.status || err;
        console.log(
          `Error in GET FOLLOWING ${db.apis.GET_FOLLOWING + uid} : `,
          msg,
        );
        if (msg == 503 || msg == 500) {
          // Alert.alert('', 'Server not response');

          return;
        }
        if (msg == 'No records found') {
          this.setfollowing([]);
          this.settotalfollowing(0);
          return;
        }

        // Alert.alert('', msg.toString());
      });
  };
  @action attemptToGetBloackUsers = (
    uid,
    setgetdata,
    setrfrsh,
    setgetdatahome,
    c,
  ) => {
    console.log('GET BloackUsers : ', 'true');
    this.setfl(true);
    this.setHomeLoader(true);
    db.hitApi(db.apis.GET_BLOCK_USER + uid, 'get', {}, this.authToken)
      ?.then(resp => {
        console.log(`response GET BloackUsers: `, resp.data);
        const dt = resp.data.blocked || [];
        this.attemptToGetBloackAnotherUsers(
          uid,
          dt,
          setgetdata,
          setrfrsh,
          setgetdatahome,
          c,
        );
        this.settotalblockUsers(dt.length);
      })
      .catch(err => {
        this.setHomeLoader(false);
        this.setfl(false);
        setrfrsh(false);
        const msg = err.response.data.message || err.response.status || err;
        console.log(
          `Error in GET BloackUsers ${db.apis.GET_BLOCK_USER + uid} : `,
          msg,
        );
        if (msg == 503 || msg == 500) {
          // Alert.alert('', 'Server not response');
          return;
        }

        // Alert.alert('', msg.toString());
      });
  };

  @action attemptToGetBloackAnotherUsers = (
    uid,
    data1,
    setgetdata,
    setrfrsh,
    setgetdatahome,
    c,
  ) => {
    console.log('GET  BloackAnotherUsers');
    db.hitApi(db.apis.GET_BLOCK_ANOTHER_USER + uid, 'get', {}, this.authToken)
      ?.then(resp => {
        this.setfl(false);
        setrfrsh(false);
        console.log(`response GET BloackAnotherUsers: `, resp.data);
        const data2 = resp.data.blockedBy || [];
        const farr = data1.concat(data2);
        setgetdata(true);

        this.attemptToGetHomeTripsSearch(setgetdatahome, farr, c);

        this.setblockUsers(farr);
      })
      .catch(err => {
        this.setHomeLoader(false);
        this.setfl(false);
        setrfrsh(false);
        const msg = err.response.data.message || err.response.status || err;
        console.log(
          `Error in GET   GetBloackAnotherUsers  
            ${db.apis.GET_BLOCK_ANOTHER_USER + uid} : `,
          msg,
        );
        if (msg == 503 || msg == 500) {
          // Alert.alert('', 'Server not response');
          return;
        }

        // Alert.alert('', msg.toString());
      });
  };

  attemptToUnblockUser(uid, ind, suc, goBack) {
    console.log('UnblockUser  true : ');
    this.setbl(true);
    let c = this.user._id + '/' + uid;
    db.hitApi(db.apis.UNBLOCK_USER + c, 'put', {}, this.authToken)
      ?.then(resp => {
        this.setbl(false);
        if (resp.data && resp.data.check == 'reload') {
          goBack();
          store.General.refreshAlert(resp.data.message);
          return;
        }
        FireStore.updateUserinFirestoreOnlyRoom(this.user._id, resp.data.data);

        this.removeblockUsers(ind);
        this.getUserById1(this.user._id, this.authToken, '');

        let dt = [...this.blockUsers];
        dt.splice(ind, 1);
        this.attemptToGetHomeTripsSearch(() => {}, dt, 'all');

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

          return;
        }

        Alert.alert('', msg.toString());
      });
  }

  attemptToBlockUser(uid, ind, suc) {
    console.log('blockUser  true : ');
    this.setbl(true);
    let c = this.user._id + '/' + uid;
    db.hitApi(db.apis.BLOCK_USER + c, 'put', {}, this.authToken)
      ?.then(resp => {
        this.setbl(false);
        // console.log(
        //   `response blockUser  ${db.apis.BLOCK_USER + c} : `,
        //   resp.data,
        // );
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

  @action attemptToGetInboxes = (userId, setGetdata, check) => {
    FireStore.getAllCurrentUserRooms(userId, setGetdata, check);
  };

  @action attemptToGetAllMessages = (uid, rid, setgetdata, setData) => {
    console.log('GetAllMessages: ', 'true');
    this.setmessagesLoader(true);

    let params = uid + '/' + this.user._id;

    db.hitApi(db.apis.GET_All_Meesages + params, 'get', {}, this.authToken)
      ?.then(resp => {
        this.setmessagesLoader(false);
        // console.log(
        //   `response GetAllMessages ${db.apis.GET_All_Meesages + params} : `,
        //   resp.data.data,
        // );
        let dt = resp.data.data || [];
        setgetdata(true);
        setData(dt);

        let p = uid + '/' + rid;
        this.attemptToReadAllMessages(p);
      })
      .catch(err => {
        this.setmessagesLoader(false);

        let msg = err.response.data.message || err.response.status || err;
        console.log(
          `Error in GetAllMessages ${db.apis.GET_All_Meesages + params} : `,
          msg,
        );
        if (msg == 503 || msg == 500) {
          // Alert.alert('', 'Server not response');

          return;
        }
        if (msg == 'No records found') {
          setData([]);
          setgetdata(true);
          return;
        }

        // Alert.alert('', msg.toString());
      });
  };

  @action attemptToReadAllMessages = params => {
    console.log('ReadAllMessages: ', 'true');

    db.hitApi(db.apis.READ_All_Meesages + params, 'put', {}, this.authToken)
      ?.then(resp => {
        // console.log(
        //   `response ReadAllMessages ${db.apis.READ_All_Meesages + params} : `,
        //   resp.data,
        // );
      })
      .catch(err => {
        let msg = err.response.data.message || err.response.status || err;
        console.log(
          `Error in ReadAllMessages ${db.apis.READ_All_Meesages + params} : `,
          msg,
        );
        if (msg == 503 || msg == 500) {
          Alert.alert('', 'Server not response');
          // store.General.setisServerError(true);
          return;
        }
      });
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

  @observable chatmsgSendLoader = false;
  @action setchatmsgSendLoader = obj => {
    this.chatmsgSendLoader = obj;
  };

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
    // this.trips.unshift(obj);
    this.trips.push(obj);
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

  @action attemptToGetReviews = (uid, setgetdata, setrfrsh) => {
    console.log('get all Reviews : ');
    this.setreviewLoader(true);

    db.hitApi(db.apis.GET_ALL_REVIEWS + uid, 'get', {}, this.authToken)
      ?.then(resp => {
        this.setreviewLoader(false);
        setrfrsh(false);
        console.log(
          `response GET_ALL_REVIEWS   ${db.apis.GET_ALL_REVIEWS + uid} : true `,
        );
        let dt = resp.data.doc;
        let ar = [];
        if (dt.length > 0) {
          dt.map((e, i, a) => {
            let msgs = e.messages || [];
            if (msgs.length > 0) {
              msgs.map((ee, i, a) => {
                if (ee.role == 'guest') {
                  ar.push(e);
                }
              });
            }
          });
        }

        setgetdata(true);
        this.setreview(ar);
      })
      .catch(err => {
        this.setreviewLoader(false);
        setrfrsh(false);
        let msg = err.response.data.message || err.response.status || err;
        console.log(
          `Error in GET_ALL_REVIEWS ${db.apis.GET_ALL_REVIEWS + uid} : `,
          msg,
        );
        if (msg == 503 || msg == 500) {
          // Alert.alert('', 'Server not response');

          return;
        }
        if (msg == 'No records found') {
          setgetdata(true);
          this.setreview([]);
          return;
        }
        // seterror(msg.toString())
        // Alert.alert('', msg.toString());
      });
  };

  @action attemptToGetTrips = (uid, setgetdata, setrfrsh) => {
    console.log('GET_ALL_TRIP : ');
    this.settripLoader(true);

    db.hitApi(db.apis.GET_ALL_TRIP + uid, 'get', {}, this.authToken)
      ?.then(resp => {
        this.settripLoader(false);
        setrfrsh(false);
        console.log(
          `response GET_ALL_TRIP   ${db.apis.GET_ALL_TRIP + uid} : true `,
        );
        let dt = resp.data.data;
        setgetdata(true);
        this.settrips(dt);
      })
      .catch(err => {
        this.settripLoader(false);
        setrfrsh(false);
        let msg = err.response.data.message || err.response.status || err;
        console.log(
          `Error in GET_ALL_TRIP  ${db.apis.GET_ALL_TRIP + uid} : `,
          msg,
        );
        if (msg == 503 || msg == 500) {
          // Alert.alert('', 'Server not response');

          return;
        }
        if (msg == 'No records found') {
          setgetdata(true);
          this.settrips([]);
          return;
        }

        // Alert.alert('', msg.toString());
      });
  };

  @action attemptToGetPhotos = (uid, setgetdata, setrfrsh, dt) => {
    console.log('getPhotosData : ');
    this.setphotosLoader(true);

    db.hitApi(db.apis.GET_ALL_TRIP + uid, 'get', {}, this.authToken)
      ?.then(resp => {
        this.setphotosLoader(false);
        setrfrsh(false);
        console.log(
          `response getPhotosData  ${db.apis.GET_ALL_TRIP + uid} : true `,
        );

        let rp = resp.data.data;
        let dt = [];

        if (resp.data && rp.length > 0) {
          rp.map(e => {
            if (e.photos && e.photos.length > 0) {
              e.photos.map((ee, i, a) => {
                dt.push({uri: ee, tid: e._id});
              });
            }
          });
        }

        setgetdata(true);
        this.setphotos(dt);
        this.attemptToGetTrips(
          this.user._id,
          () => {},
          () => {},
        );
      })
      .catch(err => {
        setrfrsh(false);
        this.setphotosLoader(false);
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
          this.setphotos([]);
          return;
        }
        // seterror(msg.toString())
        Alert.alert('', msg.toString());
      });
  };

  @action titleCase(str) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
      // You do not need to check if i is larger than splitStr length, as your for does that for you
      // Assign it back to the array
      splitStr[i] =
        splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    // Directly return the joined string
    return splitStr.join(' ');
  }

  @action attemptToGetHomeTripsSearch = (setgetdata, blocksUsersArr, c) => {
    const isApplySearch = store.Search.isApplySearch;
    const isApplyFilter = store.Filters.isFilter;
    const query = isApplySearch ? this.titleCase(store.Search.search) : '';
    let rate = '';
    let userStatus = '';
    let location = '';
    let species = '';
    let activity = '';
    let blockUsers = this.user._id;
    if (isApplyFilter) {
      rate = store.Filters.shostRating != 0 ? store.Filters.shostRating : '';
      userStatus = store.Filters.svu == true ? 'verified' : '';
      location =
        store.Filters.stripLocation != false
          ? store.Filters.stripLocation.name
          : '';
      species = store.Filters.sspecies != false ? store.Filters.sspecies : '';
      activity =
        store.Filters.sactivity != false ? store.Filters.sactivity : '';
    }
    if (blocksUsersArr.length > 0) {
      blocksUsersArr.forEach(item => {
        if (item?.userId?._id) blockUsers = blockUsers + ',' + item.userId._id;
      });
    }
    const params = `rating=${rate}&userStatus=${userStatus}&location=${location}&species=${species}&query=${query}&activity=${activity}&tradeType=${activity}&blockedUsers=${blockUsers}&page=1&limit=10000`;
    this.setHomeLoader(true);
    console.log('Get AllHomeTrip User : ', db.apis.GET_ALL_HOME_TRIPS + params);
    if (c == 'all') {
      this.getUserById1(this.user._id, this.authToken);
    }
    db.hitApi(db.apis.GET_ALL_HOME_TRIPS + params, 'get', {}, this.authToken)
      ?.then(resp => {
        this.setHomeLoader(false);
        console.log(
          `response Get AllHomeTrip User   ${db.apis.GET_ALL_HOME_TRIPS}  true : `,
        );
        const dt = resp.data.data;
        this.setHomeTrips(dt);
        setgetdata(true);
        if (c == 'all') {
          this.allGetGeneralUserData(this.user._id);
          this.allGetGeneralData();
        }
      })
      .catch(err => {
        this.setHomeLoader(false);

        const msg = err.response.data.message || err.response.status || err;
        console.log(
          `Error in Get AllHomeTrip  ${db.apis.GET_ALL_HOME_TRIPS}${params} }: `,
          msg,
        );
        if (msg == 503 || msg == 500 || msg == 502) {
          Alert.alert('', 'Server not response');

          return;
        }
        if (msg == 'No records found') {
          setgetdata(true);
          this.setHomeTrips([]);
          if (c == 'all') {
            this.allGetGeneralUserData(this.user._id);
            this.allGetGeneralData();
          }
          return;
        }

        Alert.alert('', msg.toString());
      });
  };

  @action attemptToGetHomeTripsGuest = setgetdata => {
    let isaps = store.Search.isApplySearch;
    let isapf = store.Filters.isFilter;

    let query = isaps ? this.titleCase(store.Search.search) : '';
    let r = '';
    let us = '';
    let loc = '';
    let spsc = '';
    let act = '';
    if (isapf) {
      r = store.Filters.shostRating != 0 ? store.Filters.shostRating : '';
      us = store.Filters.svu == true ? 'verified' : '';
      loc =
        store.Filters.stripLocation != false
          ? store.Filters.stripLocation.name
          : '';
      spsc = store.Filters.sspecies != false ? store.Filters.sspecies : '';
      act = store.Filters.sactivity != false ? store.Filters.sactivity : '';
    }

    let b = '';

    const params = `rating=${r}&userStatus=${us}&location=${loc}&species=${spsc}&query=${query}&activity=${act}&tradeType=${act}&blockedUsers=${b}&page=1&limit=10000`;

    console.log(
      'Get AllHomeTrip Guest : ',
      db.apis.GET_ALL_HOME_TRIPS + params,
    );
    this.setHomeLoader(true);
    db.hitApi(db.apis.GET_ALL_HOME_TRIPS + params, 'get', {}, this.authToken)
      ?.then(resp => {
        this.setHomeLoader(false);
        // console.log(
        //   `response Get AllHomeTrip Guest  ${db.apis.GET_ALL_HOME_TRIPS}  : `,
        //   resp.data.data.length,
        // );
        let dt = resp.data.data;

        this.setHomeTrips(dt);
        setgetdata(true);

        this.allGetGeneralData();
        store.Notifications.attemptToGetNotificationsGuest();
      })
      .catch(err => {
        this.setHomeLoader(false);
        store.Notifications.attemptToGetNotificationsGuest();
        const msg = err.response.data.message || err.response.status || err;
        console.log(
          `Error in Get AllHomeTrip  ${db.apis.GET_ALL_HOME_TRIPS} }: `,
          msg,
        );
        if (msg == 503 || msg == 500 || msg == 502) {
          Alert.alert('', 'Server not response');

          return;
        }
        if (msg == 'No records found') {
          setgetdata(true);
          this.setHomeTrips([]);

          return;
        }

        Alert.alert('', msg.toString());
      });

    // console.log('Get AllHomeTrip : ', 'true');
    // this.setHomeLoader(true);

    // db.hitApi(db.apis.GET_ALL_HOME_TRIPS_GUEST, 'get', {}, this.authToken)
    //   ?.then(resp => {
    //     this.setHomeLoader(false);

    //     console.log(
    //       `response Get AllHomeTrip   ${db.apis.GET_ALL_HOME_TRIPS} : `,
    //       resp.data,
    //     );
    //     let dt = resp.data.data;

    //     this.setHomeTrips(dt);
    //     setgetdata(true);

    //     this.allGetGeneralData();
    //     store.Notifications.attemptToGetNotificationsGuest();
    //   })
    //   .catch(err => {
    //     this.setHomeLoader(false);

    //     let msg = err.response.data.message || err.response.status || err;
    //     console.log(
    //       `Error in Get AllHomeTrip  ${db.apis.GET_ALL_HOME_TRIPS} : `,
    //       msg,
    //     );
    //     if (msg == 503 || msg == 500) {
    //       Alert.alert('', 'Server not response');
    //       // store.General.setisServerError(true);
    //       return;
    //     }
    //     if (msg == 'No records found') {
    //       setgetdata(true);
    //       this.setHomeTrips([]);

    //       this.allGetGeneralData();

    //       return;
    //     }
    //     // seterror(msg.toString())
    //     Alert.alert('', msg.toString());
    //   });
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
    console.log('getReviesData : ', 'true');
    this.setreviewLoadero(true);
    setTimeout(() => {
      this.setreviewLoadero(false);
      setgetdata(true);
      setrfrsh(false);
      this.setreviewo(dt);
    }, 1000);
  };

  @action attemptToGetTripso = (uid, setgetdata, setrfrsh, dt) => {
    console.log('getTripsData : ', 'true');
    this.settripLoadero(true);
    setTimeout(() => {
      this.settripLoadero(false);
      setgetdata(true);
      setrfrsh(false);
      this.settripso(dt);
    }, 1000);
  };

  @action attemptToGetPhotoso = (uid, setgetdata, setrfrsh, dt) => {
    console.log('getPhotosData : ', 'true');
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
    console.log('deletePhoto  : ', 'true');

    this.setmLoader(true);
    let i = obj.i;
    let body = {
      photo: obj.uri,
    };
    let tid = obj.tid;

    db.hitApi(db.apis.DELETE_TRIP_PHOTO + tid, 'put', body, this.authToken)
      ?.then(resp => {
        this.setmLoader(false);
        console.log(
          `response deletePhoto  ${db.apis.DELETE_TRIP_PHOTO + tid} : `,
          resp.data,
        );
        delete this.photos.splice(i, 1);
        suc();
        this.attemptToGetTrips(
          this.user._id,
          () => {},
          () => {},
        );
      })
      .catch(err => {
        this.setmLoader(false);

        let msg = err.response.data.message || err.response.status || err;
        console.log(
          `Error in deletePhoto ${db.apis.DELETE_TRIP_PHOTO + tid} : `,
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
  @action attemptToReplyComment = (obj, cmnt, suc) => {
    console.log('reply comment  : ', 'true');
    this.setmLoader(true);

    let i = obj.i;
    let body = {
      message: cmnt,
      role: 'host',
      guestId: obj.item.guestId._id,
    };
    let id = obj.item._id;

    db.hitApi(db.apis.REPLY_REVIEW + id, 'put', body, this.authToken)
      ?.then(resp => {
        this.setmLoader(false);
        console.log(
          `response ReplyComment  ${db.apis.REPLY_REVIEW + id} :  true `,
        );
        if (resp.data && resp.data.check == 'reload') {
          suc();
          store.General.refreshAlert(resp.data.message);
          return;
        }
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
    console.log('edit comment  : ', 'true');
    this.setmLoader(true);

    let i = obj.i;
    let d = obj.item;
    let idd = d._id;
    let id = '';
    let msgs = d.messages || [];
    if (msgs.length > 0) {
      msgs.map(e => {
        if (e.role == 'host') {
          id = e._id;
        }
      });
    }
    let body = {
      message: cmnt,
      guestRating: 0,
      isReviewEdited: false,
      guestId: obj.item.guestId._id,
    };

    db.hitApi(db.apis.EDIT_REPLY + idd + '/' + id, 'put', body, this.authToken)
      ?.then(resp => {
        this.setmLoader(false);
        console.log(`response EditComment  ${db.apis.EDIT_REPLY + id} :  true`);
        if (resp.data && resp.data.check == 'reload') {
          suc();
          store.General.refreshAlert(resp.data.message);
          return;
        }
        let dt = resp.data.data;
        this.review[i] = dt;
        suc();
      })
      .catch(err => {
        this.setmLoader(false);

        let msg = err.response.data.message || err.response.status || err;
        console.log(`Error in EditComment ${db.apis.EDIT_REPLY + id} : `, msg);
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
    console.log('delete comment  : ', 'true');
    this.setmLoader(true);

    let i = obj.i;
    let d = obj.item;
    let idd = d._id;
    let id = '';
    let msgs = d.messages || [];
    if (msgs.length > 0) {
      msgs.map(e => {
        if (e.role == 'host') {
          id = e._id;
        }
      });
    }
    const body = {
      guestId: obj.item.guestId._id,
    };
    db.hitApi(
      db.apis.DELETE_REVIEW + idd + '/' + id,
      'put',
      body,
      this.authToken,
    )
      ?.then(resp => {
        this.setmLoader(false);
        console.log(
          `response DeleteComment  ${db.apis.DELETE_REVIEW + id} :  true`,
        );

        if (resp.data && resp.data.check == 'reload') {
          suc();
          store.General.refreshAlert(resp.data.message);
          return;
        }
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
  @action attemptToDisputeComment = (obj, userName, suc) => {
    console.log('delete comment  : ', 'true');
    this.setmLoader(true);

    let i = obj.i;
    let body = {
      status: 'dispute',
      disputeOpenDate: new Date(),
      disputantName: userName,
      isDisputeUpdate: true,
      recepientId: obj.item.guestId._id,
    };
    let id = obj.item._id;

    db.hitApi(db.apis.DISPUTE_REVIEW + id, 'put', body, this.authToken)
      ?.then(resp => {
        this.setmLoader(false);
        console.log(
          `response DisputeComment  ${db.apis.DISPUTE_REVIEW + id} : true `,
        );
        if (resp.data && resp.data.check == 'reload') {
          suc();
          store.General.refreshAlert(resp.data.message);
          return;
        }
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

  @observable ctripsLoader = false;
  @observable editTripObj = false;
  @observable editTrip = false;

  @observable homeModalLoder = false;
  @action attemptToOfferSend = (
    body,
    offerSuccefullySend,
    closeModal,
    goBack,
  ) => {
    this.setHomeModalLoder(true);
    db.hitApi(db.apis.OFFER_SEND, 'post', body, this.authToken)
      ?.then(resp => {
        this.setHomeModalLoder(false);
        console.log(`response OfferSend  ${db.apis.OFFER_SEND} : `, resp.data);
        if (resp.data && resp.data.check == 'reload') {
          closeModal();
          goBack();
          store.General.refreshAlert(resp.data.message);
          return;
        }
        store.Offers.attemptToGetSentOffers(
          () => {},
          () => {},
        );
        offerSuccefullySend();
      })
      .catch(err => {
        this.setHomeModalLoder(false);
        const msg = err.response.data.message || err.response.status || err;
        console.log(`Error in OfferSend ${db.apis.OFFER_SEND} : `, msg);
        if (msg == 503 || msg == 500) {
          Alert.alert('', 'Server not response');

          return;
        }

        Alert.alert('', msg.toString());
      });
  };

  @action attemptToCheckFirstMessage = (suid, ruid, obj, msg, suc) => {
    console.log('check First Message');
    this.setHomeModalLoder(true);
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
        this.setHomeModalLoder(false);
        if (msg == 503 || msg == 500) {
          Alert.alert('', 'Server not response');
          // store.General.setisServerError(true);
          return;
        }
        Alert.alert('', msg.toString());
      });
  };

  @action attemptToOtherUserMessageSend = (obj, suc) => {
    console.log('message send  : ', 'true');
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

  @action setHomeModalLoder = obj => {
    this.homeModalLoder = obj;
  };

  @action attemptToCreateTrip = (body, suc, ctsi) => {
    console.log('create trip body : ', body);

    db.hitApi(db.apis.CREATE_TRIP, 'post', body, this.authToken)
      ?.then(resp => {
        // this.setctripLoader(false);
        console.log(
          `response create trip  ${db.apis.CREATE_TRIP} : `,
          resp.data,
        );
        let rsp = resp.data.data;
        this.seteditTripObj({data: rsp, index: 0});
        this.addtrips(rsp);
        suc(true);
        this.attemptToGetPhotos(
          this.user._id,
          () => {},
          () => {},
        );
        store.Notifications.attemptToGetNotifications(
          store.User.user._id,
          () => {},
        );
      })
      .catch(err => {
        this.setctripLoader(false);

        // err.response.data.message || err.response.status ||
        let msg = err;
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

  attemptToCreateTripUploadImage(bd, suc, ctsi) {
    let body = {...bd};
    let imgArr = body.photos;
    console.log('upload trips photo body : ', imgArr);
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
          console.log('upload photo success : ');
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

          // err.response.data.message || err.response.status ||
          let msg = err;
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

  attemptToChatUploadImage(bd, suc) {
    this.setchatmsgSendLoader(true);
    let imgArr = [...bd];
    console.log('upload before chat photos : ', imgArr);
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
          console.log('upload photo success : ');
          let rsp = responseData.data[0].imgrUrl;
          ua.push(rsp);
          if (ua.length == a.length) {
            suc(ua);
            return;
          }
        })
        .catch(err => {
          this.setchatmsgSendLoader(false);

          let msg = err.response.data.message || err.response.status || err;
          console.log(
            `Error in upload chat photos ${db.apis.IMAGE_UPLOAD} : `,
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
    console.log('update trip body  : ', body);

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
        this.attemptToGetPhotos(
          this.user._id,
          () => {},
          () => {},
        );
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
  //   console.log('delete  save trip  : ', 'true');
  //   this.setdLoader(true);
  //   setTimeout(() => {
  //     this.setdLoader(false);
  // /    this.deletesetsaveTrips(ind, suc);
  //   }, 1000);
  // };

  @action attemptToDeleteTrip = (body, tid, index, suc) => {
    console.log('delete trip body  : ', body);

    db.hitApi(db.apis.DELETE_TRIP + tid, 'delete', body, this.authToken)
      ?.then(resp => {
        this.setctripLoader(false);
        console.log(
          `response delete trip  ${db.apis.DELETE_TRIP} : `,
          resp.data,
        );

        this.deletetrips(index);
        suc(true);
        this.attemptToGetPhotos(
          this.user._id,
          () => {},
          () => {},
        );
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
          console.log(
            'upload update trips photo success : ',
            responseData.data[0].imgrUrl,
          );
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

  @action setResendLoader = obj => {
    this.resendLoder = obj;
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
    const chk = c || '';
    store.General.setgoto(chk == '' ? 'home' : chk);
    this.addauthToken(token);
    this.setUser(user);
    store.Trips.setsaveTrips(user.savedTrips || []);
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
        // console.log(`response  ${db.apis.LOGIN_USER} : `, resp.data);
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

  allGetGeneralUserData(uid) {
    this.attemptToGetFollowers(
      uid,
      () => {},
      () => {},
    );
    this.attemptToGetFollowing(
      uid,
      () => {},
      () => {},
    );

    this.attemptToGetTrips(
      uid,
      () => {},
      () => {},
    );
    this.attemptToGetReviews(
      uid,
      () => {},
      () => {},
    );

    this.attemptToGetInboxes(uid, () => {}, '');
    store.Offers.attemptToGetSentOffers(
      () => {},
      () => {},
    );
    store.Offers.attemptToGetReceiveOffers(
      () => {},
      () => {},
    );
    store.Offers.attemptToGetConfirmOffers(
      () => {},
      () => {},
    );
    store.Notifications.attemptToGetNotifications(uid, () => {});
  }

  @action.bound
  LoginUser(body, svp, seterror) {
    console.log('Login user body : ', body);
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
        // this.allGetGeneralData();
        // this.allGetGeneralUserData(rsp._id);
      })
      .catch(err => {
        this.setregLoader(false);
        store.General.checkServer(err);

        let msg = err.response.data.message || err.response.status || err;
        console.log(`Error in Login user ${db.apis.LOGIN_USER} : `, msg);
        if (msg == 503 || msg == 500) {
          Alert.alert('', 'Server not responding');
          return;
        }

        Alert.alert('', msg.toString());
      });
  }

  @action.bound
  reSendVerificationLink(email, user) {
    const body = {userId: user._id, userEmail: email, mode: 'mobile'};
    this.setResendLoader(true);
    console.log(`${db.apis.RESEND_VERIFICATION_LINK} : `, body);
    db.hitApi(db.apis.RESEND_VERIFICATION_LINK, 'post', body, null)
      ?.then(resp => {
        console.log(
          `response reSendVerificationLink ${db.apis.RESEND_VERIFICATION_LINK} : `,
          resp.data,
        );
        this.setResendLoader(false);
      })
      .catch(err => {
        this.setResendLoader(false);
        store.General.checkServer(err);
        const msg = err.response.data.message || err.response.status || err;
        console.log(
          `Error in reSendVerificationLink ${db.apis.RESEND_VERIFICATION_LINK} : `,
          msg,
        );
        Alert.alert('', msg.toString());
      });
  }

  @action.bound
  registerUser(body, suc) {
    console.log('Register user body : ', body);
    this.setregLoader(true);
    db.hitApi(db.apis.REGISTER_USER, 'post', body, null)
      ?.then(resp => {
        console.log(`response create ${db.apis.REGISTER_USER} : `, resp.data);
        const token = resp.data.token;
        const reslt = resp.data.data;

        db.hitApi(db.apis.GET_All_Plan, 'get', {}, null)
          ?.then(resp => {
            this.setregLoader(false);
            console.log(
              `response get all plan  ${db.apis.GET_All_Plan} : `,
              resp.data,
            );
            let rsp = resp.data.data;
            let plan = {data: []};
            let dt = [];
            let features = [
              'Create trips and get offers',
              'Make trade offers',
              'Send and receive messages',
              'Bookmark trips',
              'Advanced trip search',
            ];
            if (rsp.length > 0) {
              rsp.map(e => {
                if (e.type == 'annual') {
                  plan.annual_discount = e.discount;
                }
                const o = {...e};
                o.features = features;
                dt.push(o);
              });
            }
            plan.data = dt;
            suc(token, reslt, plan);
          })
          .catch(err => {
            this.setregLoader(false);
            const msg = err.response.data.message || err.response.status;
            console.log(
              `Error in get all plan ${db.apis.GET_All_Plan} : `,
              msg,
            );
            if (msg == 503 || msg == 500 || msg == 502) {
              Alert.alert('', 'Server not response');

              return;
            }

            Alert.alert('', msg.toString());
          });
      })
      .catch(err => {
        this.setregLoader(false);
        const msg = err.response.data.message || err.response.status || err;
        console.log(`Error in create ${db.apis.REGISTER_USER} : `, msg);
        if (msg == 503 || msg == 500 || msg == 502) {
          Alert.alert('', 'Server not response');

          return;
        }

        Alert.alert('', msg.toString());
      });
  }

  @action.bound
  attemptToGetPlan() {
    console.log(`get all plan`);
    db.hitApi(db.apis.GET_All_Plan, 'get', {}, null)
      ?.then(resp => {
        this.setregLoader(false);
        console.log(`response get all plan  ${db.apis.GET_All_Plan}  true: `);
        let rsp = resp.data.data;
        let plan = {data: []};
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
        const msg = err.response.data.message || err.response.status;
        console.log(`Error in get all plan ${db.apis.GET_All_Plan} : `, msg);
        if (msg == 503 || msg == 500) {
          // Alert.alert('', 'Server not response');
          // store.General.setisServerError(true);
          return;
        }

        // Alert.alert('', msg.toString());
      });
  }

  @action.bound
  applyPromo(body, seterror, suc) {
    console.log('apply promo body : ', body);
    this.setregLoader(true);

    db.hitApi(db.apis.CHECK_PROMO + body, 'get', {}, null)
      ?.then(resp => {
        this.setregLoader(false);
        console.log(
          `response check promo  ${db.apis.CHECK_PROMO} : `,
          resp.data,
        );
        const rsp = resp.data.data[0];
        if (rsp.status == 'disabled') {
          Alert.alert('', 'Promo code disbaled!');
          return;
        }
        if (rsp.status == 'active') {
          suc(rsp);
        }
      })
      .catch(err => {
        this.setregLoader(false);
        const msg = err.response.data.message || err.response.status || err;
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
            identityStatus: 'appliedFor',
          };
    console.log('Update user photo body : ', bd);
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
    console.log('upload photo body : ', imgArr[0]);
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
        console.log('upload photo success : ');
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
  SubPlan(body, uid, cid, token, seterror, suc, c) {
    let chk = c || '';
    console.log('plan subscribe body : ', body);

    db.hitApi(db.apis.UPDATE_USER + uid, 'put', body, token)
      ?.then(resp => {
        this.setregLoader(false);
        console.log(
          `response plan subscribe  ${db.apis.UPDATE_USER + uid} : `,
          resp.data,
        );
        let rsp = resp.data.data;
        suc(rsp);

        this.getCardInfo(cid, chk != 'n' ? 'tt' : '', token);
      })
      .catch(err => {
        this.setregLoader(false);
        Notification.sendPaymentFailedNotification(uid);
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
  getCardInfo(email, chk, token) {
    console.log('get card info : ', email);
    if (chk == 'tt') {
      this.setucRef(true);

      setTimeout(() => {
        db.hitApi(db.apis.CARD_INFO + email, 'get', {}, token)
          ?.then(resp => {
            this.setucRef(false);

            // console.log(
            //   `response get card info  ${db.apis.CARD_INFO + email} : `,
            //   resp.data.data.data[0].card,
            // );
            let rsp = resp.data.data;
            this.setuserCardInfo(rsp.data);
          })
          .catch(err => {
            this.setucRef(false);
            console.log(
              `Error in get card info  ${db.apis.CARD_INFO + email} : `,
              err,
            );
          });
      }, 3000);
    } else {
      db.hitApi(db.apis.CARD_INFO + email, 'get', {}, token)
        ?.then(resp => {
          // console.log(
          //   `response get card info  ${db.apis.CARD_INFO + email} : `,
          //   resp.data.data.data[0].card,
          // );
          let rsp = resp.data.data;
          this.setuserCardInfo(rsp.data);
        })
        .catch(err => {
          console.log(
            `Error in get card info  ${db.apis.CARD_INFO + email} : `,
            err,
          );
        });
    }
  }

  @action.bound
  async BuyPlan(body, obj, suc) {
    console.log('Buy Plan body : ', JSON.stringify(body));
    this.setregLoader(true);

    try {
      let resp = await axios.post(`${db.apis.BASE_URL}${db.apis.BUY_PLAN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      // this.setregLoader(false);
      console.log(`response Buy Plan   ${db.apis.BUY_PLAN} : `, resp.data);
      let rsp = resp?.data;
      let cid = rsp?.customerId; //customer id
      let cs = rsp?.clientSecret; //client secret
      suc({cid, cs}, obj);
    } catch (err) {
      this.setregLoader(false);
      store.General.checkServer(err);

      let msg = err.response.data.message || err.response.status || err;
      console.log(`Error in Buy Plan ${db.apis.BUY_PLAN} : `, msg);
      if (msg == 503 || msg == 500) {
        Alert.alert('', 'Server not response');
        // store.General.setisServerError(true);
        return;
      }
      // seterror(msg.toString())
      Alert.alert('', msg.toString());
    }
  }

  @action.bound
  getUserById(uid, token, c) {
    console.log(' get user by id : ', uid);
    this.setregLoader(true);
    db.hitApi(db.apis.GET_USER_BY_ID + uid, 'get', {}, token)
      ?.then(resp => {
        this.setregLoader(false);
        // console.log(
        //   `response get user by id  ${db.apis.GET_USER_BY_ID + uid} : `,
        //   resp.data,
        // );
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
  getUserById1(uid, token) {
    console.log(' get user by id : ', uid);
    db.hitApi(db.apis.GET_USER_BY_ID + uid, 'get', {}, token)
      ?.then(resp => {
        console.log(
          `response get user by id  ${db.apis.GET_USER_BY_ID + uid} : true `,
        );
        const rsp = resp.data.data[0];

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
        if (rsp.customerId && rsp.customerId != '') {
          this.getCardInfo(rsp.customerId, '', this.authToken);
        }
      })
      .catch(err => {
        const msg = err.response.data.message || err.response.status || err;
        console.log(
          `Error in get user by id ${db.apis.GET_USER_BY_ID + uid} : `,
          msg,
        );
        if (msg == 503 || msg == 500) {
          // Alert.alert('', 'Server not response');
          return;
        }
        if (msg == 'No records found') {
          this.Logout();
          return;
        }
      });
  }

  @action.bound
  forgotPassword(body, goto, seterror) {
    console.log('Forgot Pswd  body : ', body);
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
    console.log('Forgot Pswd  body : ', body);
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
    console.log('isPhoneExist  body : ', phone);
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
  isPhoneExistEditProfile(p, body, imgArr, suc) {
    let phone = p.substring(1);
    console.log('isPhoneExist  body : ', phone);

    db.hitApi(db.apis.IS_PHONE_EXIST + phone, 'get', {}, null)
      ?.then(resp => {
        console.log(
          `isPhoneExist res :  ${db.apis.IS_PHONE_EXIST}${phone} : `,
          resp.data,
        );

        let rsp = resp.data[0];
        if (rsp._id == this.user._id) {
          suc(false);
        } else {
          Alert.alert('', 'This Phone number is already used by another user.');
          this.setregLoader(false);
          suc(true);
          return;
        }
      })
      .catch(err => {
        this.setregLoader(false);
        const msg = err.response.data.message || err.response.status || err;
        console.log(
          `Error in isPhoneExist ${db.apis.IS_PHONE_EXIST}${phone} : `,
          msg,
        );
        if (msg == 'No user found.') {
          suc(false);
          return;
        }
        if (msg == 503 || msg == 500 || msg == 502) {
          Alert.alert('', 'Server not response');

          return;
        }

        Alert.alert('', msg.toString());
      });
  }

  attemptToLogoutAccount() {
    this.setLogoutLoader(true);
    const body = {registrationCode: this.notificationToken};
    console.log(`Logout ${db.apis.LOGOUT_ACCOUNT + this.user._id}`, body);
    db.hitApi(
      db.apis.LOGOUT_ACCOUNT + this.user._id,
      'put',
      body,
      this.authToken,
    )
      ?.then(resp => {
        console.log('Logout resp true');
        this.setLogoutLoader(false);
        store.General.setIsEmailPopup(false);
        store.General.setgoto('home');
        this.Logout();
      })
      .catch(err => {
        this.setLogoutLoader(false);
        const msg = err.response.data.message || err.response.status || err;
        console.log(`Error in Logout  ${db.apis.LOGOUT_ACCOUNT}: `, msg);
        if (msg == 503 || msg == 500) {
          Alert.alert('', 'Server not response');
          return;
        }

        Alert.alert('', msg.toString());
      });
  }

  @action.bound
  attemptToVerifyCode(body, suc, suc2) {
    console.log('attemptToVerifyCode  body : ', body);
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
    console.log('Update Psswd user body : ', body);
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
    this.setmessages([]);
    store.Trips.clearTrips();
    store.Filters.clearAllFilters();
    store.Search.clearSearches();
    store.Notifications.clearNotifications();
    store.Offers.clearOffers();
    store.General.setIsCurrentCahtId('');

    this.setchk('');
    this.setfuser('');
    this.setcc('');
    this.setcchk('');
    this.setffuser('');
    this.setccc('');
    store.Userv.setUser(false);
  }

  @action.bound
  clearUser = () => {
    this.addauthToken('');
    this.setphn('');
    this.setcntr('');
    this.setpwc('');
    this.setplans(false);
    store.General.setIsEmailPopup(false);
    this.clearcurrentUser();
    store.Userv.clearUser();
  };

  @action clearcurrentUser = () => {
    this.setUser(false);
    this.setuserCardInfo([]);
    this.setucRef(false);
    this.setphotos([]);
    this.setreview([]);
    this.settrips([]);
    this.setHomeTrips([]);
    this.setfollowers([]);
    this.setfollowing([]);
    this.settotalfollowers(0);
    this.settotalfollowing(0);
    this.setinbox([]);
    this.setunreadInbox(0);
    this.setblockUsers([]);
    this.settotalblockUsers(0);
    this.setisNotification(false);
  };

  attemptToEditupdateUser(body, suc) {
    console.log('Edit Update user   body : ', body);

    const uid = this.user._id;
    db.hitApi(db.apis.UPDATE_USER + uid, 'put', body, this.authToken)
      ?.then(resp => {
        this.setregLoader(false);
        suc();
        console.log(
          `response Edit Update user  ${db.apis.UPDATE_USER + uid} : `,
          resp.data,
        );

        const rsp = resp.data.data;
        this.setUser(rsp);
        store.Notifications.attemptToGetNotifications(uid, () => {});
        FireStore.updateUserinFirestore(this.user._id, this.user);
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

          return;
        }

        Alert.alert('', msg.toString());
      });
  }

  attemptToEditupdateUserNot(body) {
    console.log('Edit Update user   body : ', body);

    let uid = this.user._id;
    db.hitApi(db.apis.UPDATE_USER + uid, 'put', body, this.authToken)
      ?.then(resp => {
        console.log(
          `response Edit Update user  ${db.apis.UPDATE_USER + uid} : `,
          resp.data,
        );
        let rsp = resp.data.data;
        this.setUser(rsp);
      })
      .catch(err => {
        console.log(
          `Error in Edit Update user  ${db.apis.UPDATE_USER} : `,
          err,
        );
      });
  }

  attemptToCancelSub(body, uid) {
    // let body = {...this.user, ...body};
    console.log('cancel sub   body : ', body);
    this.setregLoader(true);
    db.hitApi(db.apis.UPDATE_USER + uid, 'put', body, this.authToken)
      ?.then(resp => {
        this.setregLoader(false);
        console.log(
          `response cancel sub  ${db.apis.UPDATE_USER + uid} : `,
          resp.data,
        );

        let rsp = resp.data.data;
        this.setUser(rsp);

        // store.Notifications.attemptToGetNotifications(
        //   store.User.user._id,
        //   () => {},
        // );
      })
      .catch(err => {
        this.setregLoader(false);
        let msg = err.response.data.message || err.response.status || err;
        console.log(`Error in cancel sub  ${db.apis.UPDATE_USER} : `, msg);
        if (msg == 503 || msg == 500) {
          Alert.alert('', 'Server not response');
          // store.General.setisServerError(true);
          return;
        }
        // seterror(msg.toString())
        Alert.alert('', msg.toString());
      });
  }

  attemptToEditUploadImage(bd, imgArr, suc) {
    console.log('upload photo body : ', imgArr);

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
          console.log('upload photo success : ');
          let rsp = responseData.data[0].imgrUrl;
          if (e.chk == 'Profile') {
            body.image = rsp;
          }

          if (e.chk == 'CnicF') {
            body.identityProof = rsp;
            body.identityStatus = 'appliedFor';
          }
          ii++;
          if (ii == a.length) {
            this.attemptToEditupdateUser(body, suc);
            return;
          }
        })
        .catch(err => {
          this.setregLoader(false);

          const msg = err.response.data.message || err.response.status || err;
          console.log(`Error in upload image ${db.apis.IMAGE_UPLOAD} : `, msg);
          if (msg == 503 || msg == 500 || msg == 502) {
            Alert.alert('', 'Server not response');

            return;
          }

          Alert.alert('', msg.toString());
        });
    });
  }

  @action.bound
  attemptToGetState() {
    console.log(`get state`);
    db.hitApi(db.apis.GET_STATE, 'get', {}, null)
      ?.then(resp => {
        console.log(`response get state ${db.apis.GET_STATE} :  true`);
        let rsp = resp.data.data;
        store.Filters.settripLocation(rsp);
      })
      .catch(err => {
        let msg = err.response.data.message || err.response.status;
        console.log(`Error in get all plan ${db.apis.GET_STATE} : `, msg);
        if (msg == 503 || msg == 500) {
          // Alert.alert('', 'Server not response');

          return;
        }
        if (msg == 'No records found') {
          store.Filters.settripLocation([]);
          return;
        }

        // Alert.alert('', msg.toString());
      });
  }

  @action.bound
  attemptToGetActivity() {
    console.log(`get activity`);
    db.hitApi(db.apis.GET_ACTIVITY, 'get', {}, null)
      ?.then(resp => {
        console.log(`response get activity ${db.apis.GET_ACTIVITY} : true `);
        const rsp = resp.data.data;
        store.Filters.setactivity(rsp);
      })
      .catch(err => {
        const msg = err.response.data.message || err.response.status;
        console.log(`Error in get  activity ${db.apis.GET_ACTIVITY} : `, msg);
        if (msg == 503 || msg == 500) {
          // Alert.alert('', 'Server not response');

          return;
        }
        if (msg == 'No records found') {
          store.Filters.setactivity([]);
          return;
        }

        // Alert.alert('', msg.toString());
      });
  }

  @action.bound
  attemptToGetSpecies() {
    console.log(`get Species`);
    db.hitApi(db.apis.GET_SPECIES, 'get', {}, null)
      ?.then(resp => {
        console.log(`response get Species ${db.apis.GET_SPECIES} : true `);
        const rsp = resp.data.data;

        store.Filters.setspecies(rsp);
      })
      .catch(err => {
        const msg = err.response.data.message || err.response.status;
        console.log(`Error in get  Species ${db.apis.GET_SPECIES} : `, msg);
        if (msg == 503 || msg == 500) {
          // Alert.alert('', 'Server not response');

          return;
        }
        if (msg == 'No records found') {
          store.Filters.setspecies([]);
          return;
        }
        // seterror(msg.toString())
        // Alert.alert('', msg.toString());
      });
  }

  @action.bound
  submitSupport(bd, suc) {
    console.log('submitSupport body : ', bd);
    this.setregLoader(true);

    db.hitApi(db.apis.SUBMIT_SUPPORT, 'post', bd, this.authToken)
      ?.then(resp => {
        this.setregLoader(false);
        console.log(
          `response submitSupport  ${db.apis.SUBMIT_SUPPORT} : `,
          resp.data,
        );

        suc();
      })
      .catch(err => {
        this.setregLoader(false);
        let msg = err.response.data.message || err.response.status || err;
        console.log(
          `Error in submitSupport  ${db.apis.SUBMIT_SUPPORT} : `,
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
    console.log('Update user body : ', body);

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

  changePasword(body, sucs, invldcp) {
    console.log('CHANGE_PASSWORD user body : ', body);
    this.setregLoader(true);

    db.hitApi(db.apis.CHANGE_PASSWORD, 'put', body, store.User.authToken)
      ?.then(resp => {
        // console.log(
        //   `response CHANGE_PASSWORD  ${db.apis.CHANGE_PASSWORD} : `,
        //   resp.data,
        // );
        this.setregLoader(false);
        sucs();
        store.Notifications.attemptToGetNotifications(
          store.User.user._id,
          () => {},
        );
      })
      .catch(err => {
        this.setregLoader(false);
        const msg = err.response.data.message || err.response.status || err;
        console.log(
          `Error in CHANGE_PASSWORD ${db.apis.CHANGE_PASSWORD} : `,
          msg,
        );
        if (msg == 503 || msg == 500) {
          Alert.alert('', 'Server not response');
          return;
        }
        if (msg == 'Current Password is incorrect') {
          invldcp();
          return;
        }
        Alert.alert('', msg.toString());
      });
  }

  @action attemptToDeleteAccount = (currentUserId, setLoader, suc) => {
    console.log('delete account');
    setLoader(true);
    db.hitApi(db.apis.UPDATE_USER + currentUserId, 'delete', {}, this.authToken)
      ?.then(resp => {
        console.log(`response delete account:`, resp.data);
        setLoader(false);
        suc();
        FireStore.updateUserinFirestore(currentUserId, null);
        this.Logout();
      })
      .catch(err => {
        setLoader(false);
        const msg = err.response.data.message || err.response.status || err;
        console.log(`Error in delete account: `, msg);
        if (msg == 503 || msg == 500) {
          Alert.alert('', 'Server not response');
          return;
        }

        Alert.alert('', msg.toString());
      });
  };

  getData(seterror) {
    // console.log('get home data');
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
