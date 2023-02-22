import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import {action, makeObservable, observable} from 'mobx';
import {persist} from 'mobx-persist';
import {Alert} from 'react-native';
import io from 'socket.io-client';
import db from '../../database/index';
import store from '../index';

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

  @observable vuser = false;
  @observable fscreen = '';

  @observable dlc = false; //feletechat loader
  @action setdlc = obj => {
    this.dlc = obj;
  };

  // attemptToDeleteChat(cid, i, uid, dt, setdt,srch,sdt,setsdt,suc) {

  attemptToDeleteChat(cid, iii, uid, srch, sdt, setsdt, suc) {
    let params = cid + '/' + uid;
    console.warn('DeleteChat  true : ', params);
    this.setdlc(true);

    let i = 0;
    let ii = 0;

    let dd = [...this.inbox];

    if (dd.length > 0) {
      let ind = dd.findIndex(x => x.roomName === cid);
      if (ind > -1) {
        i = ind;
      }
    }
    let ddd = [...sdt];
    if (ddd.length > 0) {
      let ind = ddd.findIndex(x => x.roomName === cid);
      if (ind > -1) {
        ii = ind;
      }
    }

    db.hitApi(db.apis.DELETE_CHAT + params, 'put', {}, this.authToken)
      ?.then(resp => {
        this.setdlc(false);
        console.log(
          `response DeleteChat  ${db.apis.DELETE_CHAT}${params} : `,
          resp.data,
        );

        suc();

        dd.splice(i, 1);
        this.setinbox(dd);
        if (srch != '') {
          ddd.splice(ii, 1);
          setsdt(ddd);
        }
      })
      .catch(err => {
        this.setdlc(false);
        store.General.checkServer(err);
        let msg = err.response.data.message || err.response.status || err;
        console.log(
          `Error in DeleteChat  ${db.apis.DELETE_CHAT}${params}  : `,
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
    console.warn('GET Followers  : ', 'true');
    this.setfl(true);

    db.hitApi(db.apis.GET_FOLLOWERS + uid, 'get', {}, this.authToken)
      ?.then(resp => {
        this.setfl(false);
        setrfrsh(false);
        console.log(
          `response GET Followers   ${db.apis.GET_FOLLOWERS + uid} : `,
          resp.data,
        );
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
          Alert.alert('', 'Server not response');
          // store.General.setisServerError(true);
          return;
        }
        if (msg == 'No records found') {
          this.setfollowers([]);
          this.settotalfollowers(0);
          return;
        }
        // seterror(msg.toString())
        Alert.alert('', msg.toString());
      });
  };
  @action attemptToGetFollowing = (uid, setgetdata, setrfrsh) => {
    console.warn('GET Followers  : ', 'true');
    this.setfl(true);

    db.hitApi(db.apis.GET_FOLLOWING + uid, 'get', {}, this.authToken)
      ?.then(resp => {
        this.setfl(false);
        setrfrsh(false);
        console.log(
          `response GET FOLLOWING  ${db.apis.GET_FOLLOWING + uid} : `,
          resp.data,
        );
        let dt = resp.data.following || [];
        console.log('dttt flwng : ', dt);
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
          Alert.alert('', 'Server not response');
          // store.General.setisServerError(true);
          return;
        }
        if (msg == 'No records found') {
          this.setfollowing([]);
          this.settotalfollowing(0);
          return;
        }
        // seterror(msg.toString())
        Alert.alert('', msg.toString());
      });
  };
  @action attemptToGetBloackUsers = (uid, setgetdata, setrfrsh, c) => {
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

        if (c == 'home') {
          this.attemptToGetHomeTripsSearch(() => {}, dt, '');
        }

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
        this.getUserById1(this.user._id, this.authToken, '');

        let dt = [...this.blockUsers];
        dt.splice(ind, 1);
        this.attemptToGetHomeTripsSearch(
          () => {},
          () => {},
          dt,
          '',
        );

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
        // seterror(msg.toString())image/pjpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCABAAEADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD+uiiiivzc/eAooooAKKKKACiiigArlfGnjrwR8N/D134t+IfjHwr4C8K2ElrDfeJvGfiDSfC/h+ymvrmOzsorvWdbu7HTreS8u5obW1Sa5Rri5ljgiDyuqnqq/Iv/AILk/wDKOH4v/wDY0fCX/wBWb4YrDFVnh8LicQoqToUKtZRd0pOnFy5W1qk7WbR3ZZhI4/McBgZTdOOMxmGw0qkUnKEa9aFNyino3FSuk9L7n394X/ak/Zl8b61Z+G/Bf7RfwK8XeItRlWHT9B8MfFzwBr+tX0zkKkVnpeleILu+upXYhVjggdmJAAJNeq+K/F/hPwH4e1Lxb458T+HvBnhXRo4ptY8TeK9a03w74f0qK4uYbOCXUtZ1e5s9OsY57y5t7SF7q5iWS5nhgQtLKiN/LB+1x8FP+CZ3hr/gmv4O8Z+E4vhBon7UF78LvgvfeEG+HPjS3u/iRrXxL1LT/CMniWDVPDWj69eS3ULxT65L4jbVtKWHSJN0sMlnrA09X++/2qU+Kcf/AAQs1dPjWdVb4pr8APg4PGJ1/wA8+IRqP/CceADAviM3X+lnxGmnmzXxAb0m+OsC9+2k3fnGvMhmdZLFqrSoSnh8D9ejLD1Z1KduWbVGrzQi6dVuDaSclKF2rW19+tw/hOfLJUMRjIUcbnMcnqQxuHp0cQnz0IzxWG5Kk416EVW5W2oclVKDvzafsp4G+Inw/wDifoQ8UfDTxz4P+Ifho3lxp48ReBvE2i+LNDN/aCM3dkNW0G9v7A3dqJYjcWwuPOh8yPzEXeuW+O/iP8PfhdoY8T/E3x34N+HXho3tvpo8Q+OvE+ieEdDOo3ayva2A1bX77T7A3tylvO9vai48+ZYZmjjYRuV/nh/4Iy+IdX/Zr+Mmtfsi+LLuZfC/7Q3wA+DH7YPwSmu3ZLe81DxZ8OPDl38QdL01HJaed2kvLEnHEHww1C4ZiZhnG/4LVeKNX/aJ+Jerfs4+GLuVvA37JX7P3j79qL40TW7v9nTxrqmhjw/8LtCusMiLqemrrml6pDCWDXGieNNUlCzCxlSMebNZZ9c9mvrCm6P1e7t7dSs4ttJ8ipJ13Jf8utfMFw1F5+srWJl9RdKOKjjuSN3g5wXJLkvy+1lXawfLe31n3HY/pN8M+KPDXjTQdM8U+DvEOh+LPDGt2wvNG8R+GtWsNd0HV7NneNbvTNX0u4utPv7YujoJ7W4liLIyhsqQN2vgP/glp/yj4/ZU/wCyX2n/AKd9Wr78r1MPVdfD0KzXK61GlVcVrZ1IRm1fS9r2vZHzeMoLC4zF4aMnKOHxNehGTVnJUqsqak0tE2o3aWlwr8i/+C5P/KOH4v8A/Y0fCX/1Zvhiv10rj/Hfw98BfFLw1eeDPiZ4J8J/ELwhqMtpPqHhXxv4d0jxV4cvptPuor6wmvNE1y0vtNuZbK9ghu7SSa2dre5hinhKSorBYui8RhcTh4tRlXoVaKk72i6kHFN21aV7tI1yzFxwGZYDHThKpDB4zDYmUItKU40K0KjjFvROSjZN6Xep/OT8XP8Agn14d+Cn7J37On7ev7FXg+Dwf+0P8FPhn8L/AIx+N9GWTVPFOg/E/wAP3PgjRtV8d3d94a8RXuqWkOr6alze68/9hf2SbnRhrlvaQtraeHbnTvq79sn9pjwR+11/wRl+Mfxz8CukNp4p8E+DYfEGgm4W4vfCHjHTvid4Ft/E3hTUWCxuZ9J1EOLW4khg/tTSZtN1mCFbTUrct+0um6Lo+jaNYeHdI0nTdM8P6VplroumaHp9jbWekado9japY2WlWOm28cdna6baWUUdnbWMEKW0FrGlvFEsSKg8l0j9mn9nTw/4H8S/DHQfgL8GtE+G/jO7hv8Axf8AD/Sfhl4L07wV4pvrZrN7e88ReFrTRYtD1q6gfTtPaG41GxuZY2sbMowNtDs87+y3ThiKWGlTo0sVgp0K1FQaprEez9nDE01Gyi5RbjWVlz2hL4k1L2XxBGvUwVfHU6+JxWXZtRxmGxMqinWlgY1416uBrTm3KShOCnhZuUlRc6tO3JKPL+FX7UPhTW/hd+xl/wAEuP8AgoJ4AsJp/F/7I/w5/ZvPjeGwUJc678HPHHgDwXo/iLS7uYEPJbjUJ4tBjjLRx21h448QXbSxBWaue+HvgnxD4n/4Jg/8FF/22PiLZPb/ABI/bU0/4h/ECCK5Ba40T4WeHb690b4e+HYDKDJHY2u/Wp9OZGEd34efw45Egt4pD/RjefDn4fah4EHwtv8AwN4QvvhmPD1r4SHw8u/Dej3PggeFbG0hsLLw1/wis1m+h/2DZ2Nvb2drpH2H7Bb2sEMEVukUSKrbn4b/AA8vfAQ+Fd54E8HXXwxHh+28Jj4d3HhnRpvAw8LWdtFZWnhseFJLJtCGg2tnBBa2+kCw+wQ20MUMduscaqIllF6s5qquSWDdJQ5fdWLlh1hHinr/ANA6UOVa6ybd3rpHiVRw9Gi8O3UpZnCu6/MueWV08b/aMcv1uv8AfXKtz7K0IpWR8b/8EtP+UfH7Kn/ZL7T/ANO+rV9+Vz3hTwl4V8CeHdJ8IeCPDWg+D/CegWq2OheGfC+kWGg+H9Gsld5Fs9K0fS7e10/T7ZZJJHEFrbxRB3dgu5iT0Nerh6ToYehRbUnRo0qTklZSdOEYNpdna587ja6xWMxeJjFxjiMTXrxjLVxVWrOootrS6UrO2lwooorY5gooooAKKKKACiiigD//2Q==
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

  @action attemptToGetInboxes = (uid, setgetdata, c) => {
    console.warn('GET Inboxes : ', uid);
    if (c !== 'n') {
      this.setibl(true);
    }

    db.hitApi(db.apis.GET_INBOXES_BY_UID + uid, 'get', {}, this.authToken)
      ?.then(resp => {
        console.log(
          `response GET Inboxes ${db.apis.GET_INBOXES_BY_UID + uid} : `,
          resp.data,
        );
        let dt = resp.data.doc || [];
        let fa = [];

        if (dt.length > 0) {
          const socket = store.General.socket;
          dt.map((e, i, a) => {
            let c = false;
            let m = e.latestMessage.deletedBy ? e.latestMessage.deletedBy : [];
            if (m.length > 0) {
              m.map((ee, i, a) => {
                if (ee == store.User.user._id) {
                  c = true;
                }
              });
            }
            if (!c) {
              fa.push(e);
            }
            let username =
              store.User.user.firstName + ' ' + store.User.user.lastName;
            socket.emit('joinRoom', {username, roomName: e.roomName});
          });
        }

        this.setinbox(fa);
        // this.setinbox([
        //   ...fa,
        //   ...fa,
        //   ...fa,
        //   ...fa,
        //   ...fa,
        //   ...fa,
        //   ...fa,
        //   ...fa,
        //   ...fa,
        //   ...fa,
        //   ...fa,
        //   ...fa,
        //   ...fa,
        //   ...fa,
        //   ...fa,
        //   ...fa,
        //   ...fa,
        //   ...fa,
        //   ...fa,
        //   ...fa,
        //   ...fa,
        //   ...fa,
        //   ...fa,
        //   ...fa,
        //   ...fa,
        //   ...fa,
        //   ...fa,
        //   ...fa,
        //   ...fa,
        //   ...fa,
        //   ...fa,
        //   ...fa,
        //   ...fa,
        //   ...fa,
        //   ...fa,
        //   ...fa,
        //   ...fa,
        //   ...fa,
        //   ...fa,
        //   ...fa,
        //   ...fa,
        //   ...fa,
        //   ...fa,
        //   ...fa,
        //   ...fa,
        //   ...fa,
        // ]);
        setgetdata(true);
        let ud = store.User.user._id;

        let uc = 0;
        if (fa.length > 0) {
          fa.map((e, i, a) => {
            if (
              e.latestMessage &&
              ud != e.latestMessage.sendBy._id &&
              e.latestMessage.isRead == false
            ) {
              uc++;
            }
          });
        }

        this.setibl(false);

        this.setunreadInbox(uc);
      })
      .catch(err => {
        this.setibl(false);
        let msg = err.response.data.message || err.response.status || err;
        console.log(
          `Error in GET Inboxes ${db.apis.GET_INBOXES_BY_UID + uid} : `,
          msg,
        );
        if (msg == 503 || msg == 500) {
          Alert.alert('', 'Server not response');
          // store.General.setisServerError(true);
          return;
        }
        if (msg == 'No records found') {
          this.setinbox([]);
          this.setunreadInbox(0);
          setgetdata(true);
          return;
        }
        // seterror(msg.toString())
        Alert.alert('', msg.toString());
      });
  };

  @action attemptToGetAllMessages = (uid, rid, setgetdata, setData) => {
    console.log('GetAllMessages: ', 'true');
    this.setmessagesLoader(true);

    let params = uid + '/' + this.user._id;

    db.hitApi(db.apis.GET_All_Meesages + params, 'get', {}, this.authToken)
      ?.then(resp => {
        this.setmessagesLoader(false);
        console.log(
          `response GetAllMessages ${db.apis.GET_All_Meesages + params} : `,
          resp.data.data,
        );
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
          Alert.alert('', 'Server not response');
          // store.General.setisServerError(true);
          return;
        }
        if (msg == 'No records found') {
          setData([]);
          setgetdata(true);
          return;
        }
        // seterror(msg.toString())
        Alert.alert('', msg.toString());
      });
  };

  @action attemptToReadAllMessages = params => {
    console.log('ReadAllMessages: ', 'true');

    db.hitApi(db.apis.READ_All_Meesages + params, 'put', {}, this.authToken)
      ?.then(resp => {
        console.log(
          `response ReadAllMessages ${db.apis.READ_All_Meesages + params} : `,
          resp.data,
        );
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
    console.warn('get all Reviews : ', 'true');
    this.setreviewLoader(true);

    db.hitApi(db.apis.GET_ALL_REVIEWS + uid, 'get', {}, this.authToken)
      ?.then(resp => {
        this.setreviewLoader(false);
        setrfrsh(false);
        console.log(
          `response GET_ALL_REVIEWS   ${db.apis.GET_ALL_REVIEWS + uid} : `,
          resp.data,
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
          Alert.alert('', 'Server not response');
          // store.General.setisServerError(true);
          return;
        }
        if (msg == 'No records found') {
          setgetdata(true);
          this.setreview([]);
          return;
        }
        // seterror(msg.toString())
        Alert.alert('', msg.toString());
      });
  };

  @action attemptToGetTrips = (uid, setgetdata, setrfrsh) => {
    console.warn('GET_ALL_TRIP : ', 'true');
    this.settripLoader(true);

    db.hitApi(db.apis.GET_ALL_TRIP + uid, 'get', {}, this.authToken)
      ?.then(resp => {
        this.settripLoader(false);
        setrfrsh(false);
        console.log(
          `response GET_ALL_TRIP   ${db.apis.GET_ALL_TRIP + uid} : `,
          resp.data,
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
          Alert.alert('', 'Server not response');
          // store.General.setisServerError(true);
          return;
        }
        if (msg == 'No records found') {
          setgetdata(true);
          this.settrips([]);
          return;
        }
        // seterror(msg.toString())
        Alert.alert('', msg.toString());
      });
  };

  @action attemptToGetPhotos = (uid, setgetdata, setrfrsh, dt) => {
    console.warn('getPhotosData : ', 'true');
    this.setphotosLoader(true);

    db.hitApi(db.apis.GET_ALL_TRIP + uid, 'get', {}, this.authToken)
      ?.then(resp => {
        this.setphotosLoader(false);
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

  @action attemptToGetHomeTripsSearch = (setgetdata, bu, c) => {
    let isaps = store.Search.isApplySearch;
    let isapf = store.Filters.isFilter;
    // this.setstripType(false);
    // this.setstripLocation(false);
    // this.setsactivity(false);
    // this.setsspecies(false);
    // this.setshostRating(0);
    // this.setsvu(false);
    // this.setisFilter(false);
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

    let b = this.user._id;
    if (bu.length > 0) {
      bu.map((e, i, a) => {
        b = b + ',' + e.userId._id;
      });
    }

    // let params = `query=${query}`;
    let params = `rating=${r}&userStatus=${us}&location=${loc}&species=${spsc}&query=${query}&activity=${act}&tradeType=${act}&blockedUsers=${b}&page=1&limit=10000`;

    console.log('Get AllHomeTrip : ', db.apis.GET_ALL_HOME_TRIPS + params);
    this.setHomeLoader(true);
    db.hitApi(db.apis.GET_ALL_HOME_TRIPS + params, 'get', {}, this.authToken)
      ?.then(resp => {
        this.setHomeLoader(false);

        console.log(
          `response Get AllHomeTrip  ${db.apis.GET_ALL_HOME_TRIPS}  : `,
          resp.data,
        );
        let dt = resp.data.data;

        this.setHomeTrips(dt);
        setgetdata(true);

        if (c == 'all') {
          this.allGetGeneralData();
          this.allGetGeneralUserData(this.user._id);
        }
      })
      .catch(err => {
        this.setHomeLoader(false);

        let msg = err.response.data.message || err.response.status || err;
        console.log(
          `Error in Get AllHomeTrip  ${db.apis.GET_ALL_HOME_TRIPS}${params} }: `,
          msg,
        );
        if (msg == 503 || msg == 500) {
          Alert.alert('', 'Server not response');
          // store.General.setisServerError(true);
          return;
        }
        if (msg == 'No records found') {
          setgetdata(true);
          this.setHomeTrips([]);

          if (c == 'all') {
            this.allGetGeneralData();
            this.allGetGeneralUserData(this.user._id);
          }
          return;
        }
        // seterror(msg.toString())
        Alert.alert('', msg.toString());
      });
  };

  // @action attemptToGetHomeTrips = (setgetdata, setrfrsh) => {
  //   console.warn('Get AllHomeTrip : ', 'true');
  //   this.setHomeLoader(true);

  //   db.hitApi(db.apis.GET_ALL_HOME_TRIPS_GUEST, 'get', {}, this.authToken)
  //     ?.then(resp => {
  //       this.setHomeLoader(false);
  //       setrfrsh(false);
  //       console.log(
  //         `response Get AllHomeTrip   ${db.apis.GET_ALL_HOME_TRIPS} : `,
  //         resp.data,
  //       );
  //       let dt = resp.data.data;
  //       let ar = [];
  //       if (dt.length > 0) {
  //         dt.map((e, i, a) => {
  //           if (e.hostId._id != this.user._id) {
  //             ar.push(e);
  //           }
  //         });
  //       }
  //       this.setHomeTrips(ar);
  //       setgetdata(true);
  //       this.allGetGeneralData();
  //     })
  //     .catch(err => {
  //       this.setHomeLoader(false);
  //       setrfrsh(false);
  //       let msg = err.response.data.message || err.response.status || err;
  //       console.log(
  //         `Error in Get AllHomeTrip  ${db.apis.GET_ALL_HOME_TRIPS} : `,
  //         msg,
  //       );
  //       if (msg == 503 || msg == 500) {
  //         Alert.alert('', 'Server not response');
  //         // store.General.setisServerError(true);
  //         return;
  //       }
  //       if (msg == 'No records found') {
  //         setgetdata(true);
  //         this.setHomeTrips([]);

  //         this.allGetGeneralData();

  //         return;
  //       }
  //       // seterror(msg.toString())
  //       Alert.alert('', msg.toString());
  //     });
  // };

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

    // let params = `query=${query}`;
    let params = `rating=${r}&userStatus=${us}&location=${loc}&species=${spsc}&query=${query}&activity=${act}&tradeType=${act}&blockedUsers=${b}&page=1&limit=10000`;

    console.log('Get AllHomeTrip : ', db.apis.GET_ALL_HOME_TRIPS + params);
    this.setHomeLoader(true);
    db.hitApi(db.apis.GET_ALL_HOME_TRIPS + params, 'get', {}, this.authToken)
      ?.then(resp => {
        this.setHomeLoader(false);

        console.log(
          `response Get AllHomeTrip  ${db.apis.GET_ALL_HOME_TRIPS}  : `,
          resp.data,
        );
        let dt = resp.data.data;

        this.setHomeTrips(dt);
        setgetdata(true);

        this.allGetGeneralData();
        store.Notifications.attemptToGetNotificationsGuest();
      })
      .catch(err => {
        this.setHomeLoader(false);

        let msg = err.response.data.message || err.response.status || err;
        console.log(
          `Error in Get AllHomeTrip  ${db.apis.GET_ALL_HOME_TRIPS} }: `,
          msg,
        );
        if (msg == 503 || msg == 500) {
          Alert.alert('', 'Server not response');
          // store.General.setisServerError(true);
          return;
        }
        if (msg == 'No records found') {
          setgetdata(true);
          this.setHomeTrips([]);

          return;
        }
        // seterror(msg.toString())
        Alert.alert('', msg.toString());
      });

    // console.warn('Get AllHomeTrip : ', 'true');
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
      guestRating: 0,
    };

    db.hitApi(db.apis.EDIT_REPLY + idd + '/' + id, 'put', body, this.authToken)
      ?.then(resp => {
        this.setmLoader(false);
        console.log(
          `response EditComment  ${db.apis.EDIT_REPLY + id} : `,
          resp.data,
        );
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

  @observable ctripsLoader = false;
  @observable editTripObj = false;
  @observable editTrip = false;

  @observable homeModalLoder = false;
  @action attemptToOfferSend = (body, suc) => {
    this.setHomeModalLoder(true);
    db.hitApi(db.apis.OFFER_SEND, 'post', body, this.authToken)
      ?.then(resp => {
        this.setHomeModalLoder(false);
        console.log(`response OfferSend  ${db.apis.OFFER_SEND} : `, resp.data);
        store.Offers.attemptToGetSentOffers(
          () => {},
          () => {},
        );
        suc(true);
      })
      .catch(err => {
        this.setHomeModalLoder(false);
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

  @action attemptToCheckFirstMessage = (suid, ruid, obj, msg, suc) => {
    console.warn('check First Message');
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

  @action SendFirstMessage = (body, suc) => {
    db.hitApi(db.apis.SEND_FIRST_MESSAGE, 'post', body, this.authToken)
      ?.then(resp => {
        this.setHomeModalLoder(false);
        console.log(
          `response SendFirstMessage  ${db.apis.SEND_FIRST_MESSAGE} : `,
          resp.data,
        );

        let rn = resp.data.data.roomName;
        suc(true);

        this.attemptToGetInboxes(store.User.user._id, () => {});
      })
      .catch(err => {
        this.setHomeModalLoder(false);
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
    this.setHomeModalLoder(false);
    suc(true);
    socket.emit('user left', {socket: socket.id});
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
        ctsi();
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
          ctsi();
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
          console.warn('upload photo success : ');
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
          console.warn(
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
    store.Trips.setsaveTrips(user.savedTrips || []);

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
    this.attemptToGetBloackUsers(
      uid,
      () => {},
      () => {},
    );
    this.attemptToGetTrips(
      uid,
      () => {},
      () => {},
    );
    this.getUserById1(uid, this.authToken, '');

    this.attemptToGetInboxes(uid, () => {});
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
  checkEmailExist(email, body, suc) {
    this.setregLoader(true);
    db.hitApi(db.apis.CHECK_IS_EMAIL_EXIST + email, 'get', {}, null)
      ?.then(resp => {
        console.log(
          `response CHECK_IS_EMAIL_EXIST ${
            db.apis.CHECK_IS_EMAIL_EXIST + email
          } : `,
          resp.data,
        );
        let isexist = false;
        let rsp = resp.data;

        if (rsp.message == 'No records found') {
          isexist = false;
        }
        if (rsp.data) {
          isexist = true;
        }
        suc(body, isexist);
        return;
      })
      .catch(err => {
        this.setregLoader(false);
        store.General.checkServer(err);
        let msg = err.response.data.message || err.response.status || err;
        console.log(
          `Error in CHECK_IS_EMAIL_EXIST  ${ddb.apis.CHECK_IS_EMAIL_EXIST} : `,
          msg,
        );
        Alert.alert('', msg.toString());
      });
  }

  @action.bound
  registerUser(body, seterror, suc, clearInterval, signout) {
    console.warn('Register user body : ', body);
    this.setregLoader(true);
    db.hitApi(db.apis.REGISTER_USER, 'post', body, null)
      ?.then(resp => {
        console.log(`response create ${db.apis.REGISTER_USER} : `, resp.data);
        let token = resp.data.token;
        let reslt = resp.data.data;

        db.hitApi(db.apis.GET_All_Plan, 'get', {}, null)
          ?.then(resp => {
            clearInterval();
            signout();
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
        let msg = err.response.data.message || err.response.status || err;
        console.log(`Error in create ${db.apis.REGISTER_USER} : `, msg);
        this.setregLoader(false);
        clearInterval();
        signout();
        store.General.checkServer(err);
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
  SubPlan(body, uid, cid, token, seterror, suc, c) {
    let chk = c || '';
    console.log('plan subscribe body : ', body);

    db.hitApi(db.apis.UPDATE_USER + uid, 'put', body, token)
      ?.then(resp => {
        this.setregLoader(false);
        console.log(
          `response pan subscribe  ${db.apis.UPDATE_USER + uid} : `,
          resp.data,
        );
        let rsp = resp.data.data;
        suc(rsp);

        this.getCardInfo(cid, chk != 'n' ? 'tt' : '', token);
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
  getCardInfo(email, chk, token) {
    console.log('get card info : ', email);
    if (chk == 'tt') {
      this.setucRef(true);

      setTimeout(() => {
        db.hitApi(db.apis.CARD_INFO + email, 'get', {}, token)
          ?.then(resp => {
            this.setucRef(false);

            console.log(
              `response get card info  ${db.apis.CARD_INFO + email} : `,
              resp.data.data.data[0].card,
            );
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
          console.log(
            `response get card info  ${db.apis.CARD_INFO + email} : `,
            resp.data.data.data[0].card,
          );
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
        if (rsp.customerId && rsp.customerId != '') {
          this.getCardInfo(rsp.customerId, '', this.authToken);
        }
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
        let msg = err.response.data.message || err.response.status || err;
        console.log(
          `Error in isPhoneExist ${db.apis.IS_PHONE_EXIST}${phone} : `,
          msg,
        );
        if (msg == 'No user found.') {
          suc(false);
          return;
        }
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
    this.setmessages([]);
    store.Trips.clearTrips();
    store.Filters.clearAllFilters();
    store.Search.clearSearches();
    store.Notifications.clearNotifications();
    store.Offers.clearOffers();

    const socket = store.General.socket;
    socket.emit('user left', {socket: socket.id});
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
    this.setisNotification(false);
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

  attemptToEditupdateUser(body, suc) {
    console.log('Edit Update user   body : ', body);

    let uid = this.user._id;
    db.hitApi(db.apis.UPDATE_USER + uid, 'put', body, this.authToken)
      ?.then(resp => {
        this.setregLoader(false);
        suc();
        console.log(
          `response Edit Update user  ${db.apis.UPDATE_USER + uid} : `,
          resp.data,
        );

        let rsp = resp.data.data;
        this.setUser(rsp);
        store.Notifications.attemptToGetNotifications(uid, () => {});
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
    console.warn('cancel sub   body : ', body);
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
          }
          ii++;
          if (ii == a.length) {
            this.attemptToEditupdateUser(body, suc);
            return;
          }
        })
        .catch(err => {
          this.setregLoader(false);

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

  changePasword(body, sucs, invldcp) {
    console.log('CHANGE_PASSWORD user body : ', body);
    this.setregLoader(true);

    db.hitApi(db.apis.CHANGE_PASSWORD, 'put', body, store.User.authToken)
      ?.then(resp => {
        console.log(
          `response CHANGE_PASSWORD  ${db.apis.CHANGE_PASSWORD} : `,
          resp.data,
        );
        this.setregLoader(false);
        sucs();
        store.Notifications.attemptToGetNotifications(
          store.User.user._id,
          () => {},
        );
      })
      .catch(err => {
        this.setregLoader(false);
        let msg = err.response.data.message || err.response.status || err;
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
