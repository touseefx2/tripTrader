import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Alert,
  Pressable,
  TextInput,
  FlatList,
  ScrollView,
  Keyboard,
  Modal as MModal,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import ProgressiveFastImage from '@freakycoder/react-native-progressive-fast-image';
import {styles} from './styles';
import {observer} from 'mobx-react';
import store from '../../store/index';
import utils from '../../utils/index';
import theme from '../../theme';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-easy-toast';
import moment from 'moment';
import EmojiModal from 'react-native-emoji-modal';
import RBSheet from 'react-native-raw-bottom-sheet';
import {responsiveHeight} from 'react-native-responsive-dimensions';
import {FireStore} from '../../services/FireStore';
import firestore from '@react-native-firebase/firestore';
import {Notification} from '../../services/Notification';

export default observer(Chat);

const guest = require('../../assets/images/drawer/guest/img.png');

function Chat(props) {
  const dir = {
    width: '100%',
    alignItems: 'flex-end',
  };

  const mc = {
    backgroundColor: '#F2F3F1',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    padding: 12,
  };

  const mc2 = {
    backgroundColor: theme.color.button1,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    padding: 12,
  };

  const mt = {
    fontSize: 14,
    color: theme.color.subTitleAuth,
    fontFamily: theme.fonts.fontNormal,
  };

  const md = {
    fontSize: 12,
    color: theme.color.subTitleLight,
    fontFamily: theme.fonts.fontNormal,
    marginTop: 3,
  };

  const mx = {
    maxWidth: '70%',
  };

  const mx2 = {
    maxWidth: '70%',
    flexDirection: 'row',
  };

  const maxModalHeight = theme.window.Height - 100;
  const [modalHeight, setmodalHeight] = useState(0);
  const toast = useRef(null);
  const scrollRef = useRef(null);
  const {isInternet} = store.General;
  const {homeModalLoder} = store.Userv;
  const {pasObj, setpasObj, user, setSendMessageLoader, sendMessageLoader} =
    store.User;
  const obj = pasObj?.obj || false;
  const headerTitle = pasObj?.title || '';
  const rid = pasObj?.rid || '';
  const ruser = pasObj?.ruser || null;

  const [isOpenSheet, setisOpenSheet] = useState(false);
  const refRBSheet = useRef(null);
  const openBottomSheet = () => {
    setisOpenSheet(true);
    setTimeout(() => {
      refRBSheet?.current?.open();
    }, 2);
  };
  const closeBottomSheet = () => {
    setisOpenSheet(false);
    refRBSheet?.current?.close();
  };

  const [isFollow, setisFollow] = useState(false);
  const [isBlock, setisBlock] = useState(false);
  const [receiverBlockArr, setReceiverBlockArr] = useState(pasObj?.rBlockArr);
  const [isBlockOther, setisBlockOther] = useState(false);
  useEffect(() => {
    if (user) {
      let blk = false;
      let flw = false;
      let dtt = user.followers || [];
      if (dtt.length > 0) {
        let fi = dtt.findIndex(x => x.userId == rid);

        if (fi > -1) {
          if (dtt[fi].block == true) {
            blk = true;
          }
          if (dtt[fi].following == true) {
            flw = true;
          }
        }
      }
      setisBlock(blk);
      setisFollow(flw);
    }
  }, [user]);

  useEffect(() => {
    let blk = false;
    if (receiverBlockArr.length > 0) {
      const dtt = receiverBlockArr;
      const fi = dtt.findIndex(x => x.userId == user._id);
      if (fi > -1) {
        if (dtt[fi].block == true) blk = true;
      }
    }
    setisBlockOther(blk);
  }, [receiverBlockArr]);

  const [modalObj, setmodalObj] = useState(false);
  const [modalChk, setmodalChk] = useState(false);
  const [isModal, setisModal] = useState(false);
  const [rmessage, setrMessage] = useState('');
  const [isSendReport, setisSendReport] = useState(false);
  const [sendObj, setsendObj] = useState('');
  const [loader, setloader] = useState(false);

  const [message, setmessage] = useState('');
  const ClearMessage = () => {
    setmessage('');
  };
  const [pmessage, setpmessage] = useState('');
  const [photos, setphotos] = useState([]);
  const ClosePhotoModal = () => {
    if (!isShowPrmsn) {
      setisAddPhotoModal(false);
      setpmessage('');
      setphotos([]);
      store.User.setchatmsgSendLoader(false);
    } else {
      setisShowPrmsn(false);
      store.User.setchatmsgSendLoader(false);
    }
  };

  const [isShowPrmsn, setisShowPrmsn] = useState(false);
  const [prmsnChk, setprmsnChk] = useState('storage');
  const [isAddPhotoModal, setisAddPhotoModal] = useState(false);

  const [pvm, setpvm] = useState(false);
  const [pd, setpd] = useState([]);
  const [si, setsi] = useState(0);

  const [isEmoji, setisEmoji] = useState(false);

  const [data, setdata] = useState([]);

  const [getDataOnce, setgetDataOnce] = useState(false);
  const setGetDataOnce = C => {
    setgetDataOnce(C);
  };
  const refreshing = store.User.messagesLoader;
  const onRefresh = React.useCallback(() => {
    console.log('onrefresh cal');
    getDbData();
  }, []);

  const getDbData = () => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        FireStore.getAllMessageInRoom(obj._id, rid, setGetDataOnce, setdata);
      }
    });
  };

  useEffect(() => {
    var initState = true;
    var initState2 = true;
    const curentUserId = user._id;
    const roomId = obj._id;
    const chatroomsRef = firestore().collection('chatrooms');
    const ref = chatroomsRef
      .doc(roomId)
      .collection('messages')
      .orderBy('createdAt', 'asc');
    const observer = ref.onSnapshot(documentSnapshot => {
      if (initState) {
        initState = false;
      } else {
        console.log('---> onSnapshot Call Chat ref1 <----');
        let fdata = [];

        const data = documentSnapshot?.docs || [];
        fdata = data
          .map(item => ({...item.data(), _id: item.id}))
          .filter(item => {
            let isShow = true;
            item.deletedBy.forEach(element => {
              if (element == curentUserId) {
                isShow = false;
              }
            });
            if (isShow) return item;
          });

        setdata(fdata);

        FireStore.readAllMessageInRoom(roomId, rid);
      }
    });

    const ref2 = chatroomsRef.doc(roomId);

    const observer2 = ref2.onSnapshot(documentSnapshot => {
      if (initState2) {
        initState2 = false;
      } else {
        const item = documentSnapshot.data() || [];
        console.log('---> onSnapshot Call Chat ref2 <----');

        let userObj = null;
        if (item) {
          if (item.userId1 && item.userId1._id == rid) {
            userObj = item.userId1;
          }
          if (item.userId2 && item.userId2._id == rid) {
            userObj = item.userId2;
          }
        }

        setReceiverBlockArr(userObj ? userObj.followers : []);
      }
    });

    return () => {
      observer();
      observer2();
      setpasObj(false);
    };
  }, []);
  useEffect(() => {
    if (isInternet) onRefresh();
  }, [isInternet]);

  const setIsSendRport = v => {
    setsendObj(modalObj.item);
    closeModal();
    setisSendReport(v);
  };
  const sendReport = () => {
    Keyboard.dismiss();

    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        let bd = {
          reason: message,
          reportby: store.User.user._id,
          userId: rid,
        };
        store.Userv.SendReportUser(bd, setIsSendRport);
      } else {
        // seterrorMessage('Please connect internet');
        Alert.alert('', 'Please connect internet');
      }
    });
  };
  const unFollowUser = () => {
    Keyboard.dismiss();
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        store.Userv.unFollowUser(
          rid,
          () => () => {},
          () => () => {},
          c => setloader(c),
        );
      } else {
        // seterrorMessage('Please connect internet');
        Alert.alert('', 'Please connect internet');
      }
    });
  };
  const FollowUser = () => {
    Keyboard.dismiss();
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        store.Userv.FollowUser(
          rid,
          () => () => {},
          () => () => {},
          c => setloader(c),
        );
      } else {
        // seterrorMessage('Please connect internet');
        Alert.alert('', 'Please connect internet');
      }
    });
  };
  const BlockUser = () => {
    Keyboard.dismiss();
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        store.Userv.BlockUser(
          rid,
          () => () => {},
          () => () => {},
          () => () => {},
          c => setloader(c),
        );
      } else {
        // seterrorMessage('Please connect internet');
        Alert.alert('', 'Please connect internet');
      }
    });
  };
  const UnBlockUser = () => {
    Keyboard.dismiss();
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        store.Userv.UnBlockUser(
          rid,
          () => () => {},
          () => () => {},
          () => () => {},
          c => setloader(c),
        );
      } else {
        // seterrorMessage('Please connect internet');
        Alert.alert('', 'Please connect internet');
      }
    });
  };

  const ItemSeparatorView = () => {
    return (
      <View
        style={{
          height: 10,
        }}
      />
    );
  };

  function compare(d, dd) {
    let d1 = moment(d).format('YYYY-MM-DD');
    let d2 = moment(dd).format('YYYY-MM-DD');
    if (d2 > d1) {
      return 'greater';
    } else if (d2 < d1) {
      return 'smaller';
    } else {
      return 'equal';
    }
  }

  function CheckDate(d) {
    let t = '';
    let ud = new Date(d); //update date
    let cd = new Date(); //current date

    let udcy = false; //is update date  current year
    let udy = parseInt(ud.getFullYear());
    let cdy = parseInt(cd.getFullYear());
    if (udy == cdy) {
      udcy = true;
    }
    // && min < 1440 // 1 daya minure
    let sd = ud; //start date
    let ed = cd; //end date
    let ics = compare(sd, ed); //is check date
    // console.log('updated date : ', moment(ud).format('YYYY-MM-DD hh:mm:ss a'));
    // console.log('currentdate : ', moment(cd).format('YYYY-MM-DD hh:mm:ss a'));
    // console.log('ics ', ics);

    if (ics == 'greater') {
      if (udcy) {
        t = moment(ud).format('MMM DD, h:mm A');
      } else {
        t = moment(ud).format('MMM DD YYYY, h:mm a');
      }
    } else {
      // let min = diff_minutes(ed, sd);
      // console.log('minutes: ', min);
      // if (min >= 0 && min <= 1) {
      // t = 'Just now';
      // } else if (min > 1) {
      t = moment(ud).format('h:mm A');
      // }
    }

    return t;
  }

  const renderPhoto = (msg, images) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          flexShrink: 1,
          flexWrap: 'wrap',
          marginBottom: msg == '' ? 0 : 10,
        }}>
        {renderShowPhotos(images)}
      </View>
    );
  };

  const photoClick = (i, d) => {
    setsi(i);
    setpd(d);
    setpvm(true);
  };

  const renderShowPhotos = img => {
    let p = img.map((e, i, a) => {
      let uri = e;
      // console.log('e : ', e);
      return (
        <>
          <Pressable
            onPress={() => photoClick(i, img)}
            style={({pressed}) => [
              {opacity: pressed ? 0.9 : 1.0},
              [
                img.length <= 1
                  ? styles.chatImgContainerOne
                  : [styles.chatImgContainer, {marginBottom: 5}],
              ],
            ]}>
            <ProgressiveFastImage
              style={styles.chatImg}
              source={{uri: uri}}
              loadingImageStyle={styles.chatImageLoader}
              loadingSource={require('../../assets/images/imgLoad/img.jpeg')}
              blurRadius={0}
            />
          </Pressable>
        </>
      );
    });

    return p;
  };

  // let arr = [];
  // function showDateSection(date) {
  //   let isShow = false;
  //   console.log('arr : ', arr);
  //   if (arr.length <= 0) {
  //     isShow = true;
  //     arr.push(date);
  //   } else {
  //     const isFind = arr.find(e => {
  //       if (e.date == date) return true;
  //       else return false;
  //     });
  //     console.log('isFind : ', isFind);
  //   }

  //   const text = moment(date).format('DD MMMM YYYY');

  //   if (isShow) {
  //     return (
  //       <View
  //         style={{
  //           width: '100%',
  //           alignItems: 'center',
  //           justifyContent: 'center',
  //           paddingVertical: 20,
  //         }}>
  //         <View
  //           style={{
  //             paddingHorizontal: 8,
  //             paddingVertical: 4,
  //             borderRadius: 10,
  //             backgroundColor: 'white',
  //             shadowColor: '#000',
  //             shadowOffset: {
  //               width: 0,
  //               height: 1,
  //             },
  //             shadowOpacity: 0.22,
  //             shadowRadius: 2.22,

  //             elevation: 3,
  //           }}>
  //           <Text
  //             style={{
  //               fontSize: 12,
  //               color: theme.color.subTitle,
  //               fontFamily: theme.fonts.fontMedium,
  //               textTransform: 'capitalize',
  //             }}>
  //             {text}
  //           </Text>
  //         </View>
  //       </View>
  //     );
  //   }
  // }

  function dateConvert(timestamp) {
    const date = new Date(
      timestamp?.seconds * 1000 + timestamp?.nanoseconds / 1000000,
    );

    return new Date(date.getTime());
  }

  const ItemView = ({item, index}) => {
    const usr = item?.user || null;
    const msg = item.message || '';
    const images = item.image || [];
    const type = item.type;
    const isRead = item.isRead || false;
    let date = CheckDate(new Date());
    if (item?.createdAt) {
      date = CheckDate(dateConvert(item.createdAt));
    }
    let photo = guest;
    if (usr) {
      photo = usr.image ? {uri: usr.image} : guest;
    }
    let isCu = false;
    if (usr && user._id == usr._id) {
      isCu = true;
    }

    const renderMsg = () => {
      return (
        <>
          {type == 'image' && images.length > 0 && renderPhoto(msg, images)}
          {msg != '' && (
            <Text style={[mt, {color: theme.color.subTitleAuth}]}>{msg}</Text>
          )}
        </>
      );
    };

    const renderMsg2 = () => {
      return (
        <>
          <View style={mc2}>
            {type == 'image' && images.length > 0 && renderPhoto(msg, images)}

            {msg != '' && (
              <Text
                style={[
                  mt,
                  {
                    color: theme.color.buttonText,
                  },
                ]}>
                {msg}
              </Text>
            )}
          </View>
        </>
      );
    };

    const renderDate = () => {
      return (
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={[md, {marginRight: 5}]}>{date}</Text>
          <utils.vectorIcon.MaterialCommunityIcons
            name={!isRead ? 'check' : 'check-all'}
            color={!isRead ? theme.color.subTitleLight : theme.color.button1}
            size={16}
          />
        </View>
      );
    };

    const renderDate2 = () => {
      return <Text style={md}>{date}</Text>;
    };

    const renderProfile = () => {
      return (
        <View style={styles.ProfileImgContainer}>
          <ProgressiveFastImage
            style={styles.ProfileImg}
            source={photo}
            loadingImageStyle={styles.imageLoader}
            loadingSource={require('../../assets/images/imgLoad/img.jpeg')}
            blurRadius={5}
          />
        </View>
      );
    };

    return (
      <>
        {/* {showDateSection(item.createdAt)} */}
        <View style={[dir, {alignItems: isCu ? 'flex-end' : 'flex-start'}]}>
          {isCu && (
            <>
              <View style={mx}>
                <View style={mc}>{renderMsg()}</View>

                <View style={{alignItems: 'flex-end'}}>
                  {renderDate()}
                  {/* {renderDate2()} */}
                </View>
              </View>
            </>
          )}

          {!isCu && (
            <>
              <View style={mx2}>
                <View style={{justifyContent: 'flex-end'}}>
                  {renderProfile()}
                </View>

                <View
                  style={{
                    marginLeft: 10,
                  }}>
                  {renderMsg2()}
                  <View style={{alignItems: 'flex-start'}}>
                    {renderDate2()}
                  </View>
                </View>
              </View>
            </>
          )}
        </View>
      </>
    );
  };

  const sendMessageSuccess = check => {
    console.log('Message sent ', check);

    if (check == '') {
      const senderName =
        utils.functions.capitalizeTheFirstLetterOfEachWord(
          user.firstName.trim(),
        ) +
        ' ' +
        utils.functions.capitalizeTheFirstLetterOfEachWord(
          user.lastName.trim(),
        );

      const notificationBody = {
        title: `New message from ${senderName}`,
        senderId: user._id,
        userId: rid,
        message: message,
        icon: user?.image || '',
        data: {topic: 'newMessagePush'},
      };

      Notification.sendMessageNotificationPush(notificationBody);
    }
  };

  const SendMessage = p => {
    closeEmoji();
    Keyboard.dismiss();
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        setSendMessageLoader(true);
        const timestamp = firestore.FieldValue.serverTimestamp();
        const chatMessageObject = {
          user: user,
          isRead: false,
          message: !isAddPhotoModal ? message : pmessage,
          type: !isAddPhotoModal ? 'text' : 'image',
          image: p != '' ? p : [],
          deletedBy: [],
          createdAt: timestamp,
          updatedAt: timestamp,
        };

        FireStore.sendChatMessage(
          obj._id,
          rid,
          chatMessageObject,
          sendMessageSuccess,
          '',
          '',
        );

        if (isAddPhotoModal) ClosePhotoModal();
        else ClearMessage();
      } else {
        Alert.alert('', 'Please connect internet');
      }
    });
  };

  const onclickFile = () => {
    Keyboard.dismiss();
    closeEmoji();
    setisAddPhotoModal(true);
  };

  const closeEmoji = () => {
    setisEmoji(false);
  };

  const onclickEmoji = () => {
    Keyboard.dismiss();
    setisEmoji(!isEmoji);
  };

  const onClickBottomItem = chk => {
    if (chk == 'report') {
      closeBottomSheet();
      setmodalObj({item: ruser, i: 0});
      setmodalChk('report');
      setisModal(true);
    }
  };

  const renderFooter = () => {
    const renderOthers = () => {
      return (
        <>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: '98%',
              alignSelf: 'center',
            }}>
            <TouchableOpacity
              onPress={onclickFile}
              style={{}}
              activeOpacity={0.6}>
              <Image
                style={{width: 26, height: 26, resizeMode: 'contain'}}
                source={require('../../assets/images/sentfilemessage/img.png')}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onclickEmoji}
              style={{marginLeft: 20}}
              activeOpacity={0.6}>
              <Image
                style={{width: 27, height: 27, resizeMode: 'contain'}}
                source={require('../../assets/images/emojimessage/img.png')}
              />
            </TouchableOpacity>
          </View>
        </>
      );
    };

    const renderInputContainer = () => {
      const disable =
        message == ''
          ? true
          : refreshing == true
          ? true
          : sendMessageLoader == true
          ? true
          : false;
      return (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 10,
          }}>
          <View
            style={{
              width: '82%',
              backgroundColor: '#F2F3F1',
              borderRadius: 100,
              paddingHorizontal: 15,
            }}>
            <TextInput
              onFocus={closeEmoji}
              placeholder="Type a message"
              value={message}
              style={{width: '100%', borderRadius: 100, height: 48}}
              onChangeText={t => {
                setmessage(t);
              }}
            />
          </View>

          <TouchableOpacity
            onPress={() => SendMessage('')}
            disabled={disable}
            style={{opacity: disable ? 0.5 : 1}}
            activeOpacity={0.8}>
            <Image
              style={{width: 47, height: 47, resizeMode: 'contain'}}
              source={require('../../assets/images/sendmessage/img.png')}
            />
          </TouchableOpacity>
        </View>
      );
    };

    return (
      <View
        style={{
          backgroundColor: theme.color.background,
          borderTopWidth: 1,
          borderTopColor: theme.color.fieldBorder,
          padding: 20,
        }}>
        {!isBlock && !isBlockOther && (
          <>
            {renderOthers()}
            {renderInputContainer()}
          </>
        )}

        {(isBlock || isBlockOther) && (
          <>
            <Text
              style={{
                color: theme.color.subTitleLight,
                fontSize: 14,
                fontFamily: theme.fonts.fontMedium,
                textAlign: 'center',
              }}>
              {isBlock
                ? 'You have blocked this user'
                : `You can't send message to this user. `}
            </Text>
          </>
        )}
      </View>
    );
  };

  const closeModal = () => {
    setisModal(false);
    setmodalChk(false);
    setmodalObj(false);
    setrMessage('');
    setmodalHeight(0);
    setisSendReport(false);
  };

  const renderModal = () => {
    let c = modalHeight >= maxModalHeight ? true : false;
    let style = c ? [styles.modal, {height: maxModalHeight}] : styles.modal2;

    //report
    if (modalChk == 'report') {
      const renderHeader = () => {
        let text = 'Report User';

        const renderCross = () => {
          return (
            <Pressable
              disabled={homeModalLoder}
              style={({pressed}) => [
                {opacity: pressed ? 0.7 : 1.0},
                [
                  !c
                    ? {
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                      }
                    : {
                        position: 'absolute',
                        bottom: 7,
                        right: 15,
                      },
                ],
              ]}
              onPress={closeModal}>
              <utils.vectorIcon.Ionicons
                name="ios-close-outline"
                color={theme.color.title}
                size={32}
              />
            </Pressable>
          );
        };

        const renderTitle = () => {
          return <Text style={styles.modalTitle}>{text}</Text>;
        };

        return (
          <View
            style={
              c
                ? {
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: 15,
                    paddingTop: 15,
                    paddingBottom: 7,
                    shadowColor: '#000000',
                    shadowOffset: {width: 0, height: 1}, // change this for more shadow
                    shadowOpacity: 0.1,
                    elevation: 1,
                    backgroundColor: theme.color.background,
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                  }
                : {
                    alignItems: 'center',
                    justifyContent: 'center',
                  }
            }>
            {renderTitle()}
            {renderCross()}
          </View>
        );
      };

      const renderCenter = () => {
        const photo = ruser.image || '';
        const email = ruser.email || '';

        return (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 10,
              width: '100%',
            }}>
            <View style={styles.mProfileImgContainerss}>
              <ProgressiveFastImage
                style={styles.mProfileImgss}
                source={
                  photo != ''
                    ? {uri: photo}
                    : require('../../assets/images/drawer/guest/img.png')
                }
                loadingImageStyle={styles.mimageLoader}
                loadingSource={require('../../assets/images/imgLoad/img.jpeg')}
                blurRadius={5}
              />
            </View>

            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                marginTop: 15,
                fontFamily: theme.fonts.fontBold,
                fontSize: 15,
                color: '#101B10',
                textTransform: 'capitalize',
                lineHeight: 20,
              }}>
              {headerTitle}
            </Text>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                fontFamily: theme.fonts.fontNormal,
                fontSize: 13,
                color: theme.color.subTitleLight,
                lineHeight: 20,
              }}>
              {email}
            </Text>

            <View style={{width: '93%', alignSelf: 'center'}}>
              <Text
                style={{
                  marginTop: 15,
                  fontFamily: theme.fonts.fontNormal,
                  fontSize: 14,
                  color: '#101B10',
                  lineHeight: 20,
                  textAlign: 'center',
                }}>
                Tell us about the issues you are having or seeing with this
                user.
              </Text>
            </View>

            <View style={styles.textArea}>
              <TextInput
                value={rmessage}
                onChangeText={c => {
                  setrMessage(c);
                }}
                style={styles.mTextInpt}
                placeholder="Describe your concerns"
                multiline={true}
                numberOfLines={10}
              />
            </View>
          </View>
        );
      };

      const renderBottom = () => {
        let chk = rmessage == '' ? true : false;
        const renderButton1 = () => {
          return (
            <>
              <TouchableOpacity
                disabled={homeModalLoder || chk}
                onPress={() => {
                  sendReport();
                }}
                activeOpacity={0.7}
                style={{
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#B93B3B',
                  height: 50,
                  borderRadius: 10,
                  alignSelf: 'center',
                  opacity: chk ? 0.5 : 1,
                }}>
                {!homeModalLoder && (
                  <Text
                    style={{
                      color: theme.color.buttonText,
                      fontSize: 16,
                      fontFamily: theme.fonts.fontBold,
                      textTransform: 'none',
                    }}>
                    Report User
                  </Text>
                )}
                {homeModalLoder && (
                  <ActivityIndicator size={20} color={theme.color.buttonText} />
                )}
              </TouchableOpacity>
            </>
          );
        };

        const renderButton2 = () => {
          return (
            <>
              <TouchableOpacity
                disabled={homeModalLoder}
                onPress={closeModal}
                activeOpacity={0.7}
                style={{
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: theme.color.button2,
                  height: 50,
                  borderRadius: 10,
                  alignSelf: 'center',
                  // borderWidth: 1,
                  // borderColor: theme.color.fieldBorder,
                  marginTop: 12,
                }}>
                <Text
                  style={{
                    color: '#30563A',
                    textTransform: 'none',
                    fontFamily: theme.fonts.fontBold,
                    fontSize: 16,
                  }}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </>
          );
        };

        return (
          <View
            style={
              c
                ? {
                    backgroundColor: theme.color.background,
                    shadowColor: '#000000',
                    shadowOffset: {width: 0, height: -1}, // change this for more shadow
                    shadowOpacity: 0.1,
                    elevation: 5,
                    borderBottomLeftRadius: 10,
                    borderBottomRightRadius: 10,
                    marginTop: 5,
                  }
                : {marginTop: 20}
            }>
            <View
              style={
                c ? styles.modalBottomContainer : styles.modalBottomContainer2
              }>
              {renderButton1()}
              {renderButton2()}
            </View>
          </View>
        );
      };

      return (
        <MModal visible={isModal} transparent onRequestClose={closeModal}>
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalContainer2}>
              <View
                onLayout={event => {
                  if (!c) {
                    let {height} = event.nativeEvent.layout;
                    setmodalHeight(height);
                  }
                }}
                style={style}>
                {c && (
                  <>
                    {renderHeader()}
                    <ScrollView
                      contentContainerStyle={{paddingHorizontal: 15}}
                      showsVerticalScrollIndicator={false}
                      style={{flex: 1}}>
                      {renderCenter()}
                    </ScrollView>
                    {renderBottom()}
                  </>
                )}

                {!c && (
                  <>
                    {renderHeader()}
                    {renderCenter()}
                    {renderBottom()}
                  </>
                )}
              </View>
            </View>
          </SafeAreaView>
        </MModal>
      );
    }
  };

  const renderRepoerSendModal = () => {
    const c = modalHeight >= maxModalHeight ? true : false;
    const style = c ? [styles.modal, {height: maxModalHeight}] : styles.modal2;

    const renderHeader = () => {
      let text = 'Report User';

      const renderCross = () => {
        return (
          <Pressable
            disabled={homeModalLoder}
            style={({pressed}) => [
              {opacity: pressed ? 0.7 : 1.0},
              [
                !c
                  ? {
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                    }
                  : {
                      position: 'absolute',
                      bottom: 7,
                      right: 15,
                    },
              ],
            ]}
            onPress={closeModal}>
            <utils.vectorIcon.Ionicons
              name="ios-close-outline"
              color={theme.color.title}
              size={32}
            />
          </Pressable>
        );
      };

      const renderTitle = () => {
        return <Text style={styles.modalTitle}>{text}</Text>;
      };

      return (
        <View
          style={
            c
              ? {
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: 15,
                  paddingTop: 15,
                  paddingBottom: 7,
                  shadowColor: '#000000',
                  shadowOffset: {width: 0, height: 1}, // change this for more shadow
                  shadowOpacity: 0.1,
                  elevation: 1,
                  backgroundColor: theme.color.background,
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                }
              : {
                  alignItems: 'center',
                  justifyContent: 'center',
                }
          }>
          {renderTitle()}
          {renderCross()}
        </View>
      );
    };

    const renderCenter = () => {
      const fn = sendObj.firstName;
      const ln = sendObj.lastName;
      const sendOfferUsername = fn + ' ' + ln;
      const email = sendObj.email || '';
      const src =
        sendObj.image && sendObj.image != ''
          ? {uri: sendObj.image}
          : require('../../assets/images/drawer/guest/img.png');

      return (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 10,
            width: '100%',
          }}>
          <View style={styles.mProfileImgContainerss}>
            <ProgressiveFastImage
              style={styles.mProfileImgss}
              source={src}
              loadingImageStyle={styles.mimageLoader}
              loadingSource={require('../../assets/images/imgLoad/img.jpeg')}
              blurRadius={5}
            />
          </View>

          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              marginTop: 15,
              fontFamily: theme.fonts.fontBold,
              fontSize: 15,
              color: '#101B10',
              textTransform: 'capitalize',
              lineHeight: 20,
            }}>
            {sendOfferUsername}
          </Text>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              fontFamily: theme.fonts.fontNormal,
              fontSize: 13,
              color: theme.color.subTitleLight,
              lineHeight: 20,
            }}>
            {email}
          </Text>

          <View style={{width: '93%', alignSelf: 'center'}}>
            <Text
              style={{
                marginTop: 15,
                fontFamily: theme.fonts.fontNormal,
                fontSize: 14,
                color: '#101B10',
                lineHeight: 20,
                textAlign: 'center',
              }}>
              Thank You! We will review your comments and take any necessary
              actions.
            </Text>
          </View>
        </View>
      );
    };

    const renderBottom = () => {
      const renderButton1 = () => {
        return (
          <>
            <TouchableOpacity
              onPress={closeModal}
              activeOpacity={0.7}
              style={{
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: theme.color.button1,
                height: 50,
                borderRadius: 10,
                alignSelf: 'center',
                opacity: 1,
              }}>
              <Text
                style={{
                  color: theme.color.buttonText,
                  fontSize: 16,
                  fontFamily: theme.fonts.fontBold,
                  textTransform: 'none',
                }}>
                Done
              </Text>
            </TouchableOpacity>
          </>
        );
      };

      return (
        <View
          style={
            c
              ? {
                  backgroundColor: theme.color.background,
                  shadowColor: '#000000',
                  shadowOffset: {width: 0, height: -1}, // change this for more shadow
                  shadowOpacity: 0.1,
                  elevation: 5,
                  borderBottomLeftRadius: 10,
                  borderBottomRightRadius: 10,
                  marginTop: 5,
                }
              : {marginTop: 20}
          }>
          <View
            style={
              c ? styles.modalBottomContainer : styles.modalBottomContainer2
            }>
            {renderButton1()}
          </View>
        </View>
      );
    };

    return (
      <MModal visible={isSendReport} transparent onRequestClose={closeModal}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalContainer2}>
            <View
              onLayout={event => {
                if (!c) {
                  let {height} = event.nativeEvent.layout;
                  setmodalHeight(height);
                }
              }}
              style={style}>
              {c && (
                <>
                  {renderHeader()}
                  <ScrollView
                    contentContainerStyle={{paddingHorizontal: 15}}
                    showsVerticalScrollIndicator={false}
                    style={{flex: 1}}>
                    {renderCenter()}
                  </ScrollView>
                  {renderBottom()}
                </>
              )}

              {!c && (
                <>
                  {renderHeader()}
                  {renderCenter()}
                  {renderBottom()}
                </>
              )}
            </View>
          </View>
        </SafeAreaView>
      </MModal>
    );
  };

  const renderBottomSheet = () => {
    let vpIcon = require('../../assets/images/bottomsheet/ViewProfile/img.png');
    let followIcon = require('../../assets/images/bottomsheet/Follow/img.png');
    let blockIcon = require('../../assets/images/bottomsheet/block/img.png');
    let reportIcon = require('../../assets/images/bottomsheet/report/img.png');
    let itemConStyle = {
      width: '80%',
      // backgroundColor: 'red',
      paddingVertical: 5,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    };
    let itemiconStyle = {
      width: 24,
      height: 24,
      resizeMode: 'contain',
    };
    let itemTextStyle = {
      color: '#3C6B49',
      fontSize: 16,
      fontFamily: theme.fonts.fontMedium,
      lineHeight: 25,
    };
    let touchOpacity = 0.8;

    const renderCross = () => {
      return (
        <Pressable
          style={({pressed}) => [{opacity: pressed ? 0.8 : 1.0}]}
          onPress={closeBottomSheet}>
          <utils.vectorIcon.Ionicons
            name="ios-close-outline"
            color={theme.color.title}
            size={32}
          />
        </Pressable>
      );
    };

    const Sep = () => {
      return <View style={{height: 15}} />;
    };

    return (
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={false}
        closeOnPressMask={true}
        customStyles={{
          wrapper: {
            backgroundColor: 'rgba(0,0,0,0.6)',
          },
          container: {
            backgroundColor: theme.color.background,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 15,
            height: responsiveHeight(isBlock ? 15 : 37),
          },
          draggableIcon: {
            backgroundColor: '#000',
          },
        }}>
        <>
          <View style={{flex: 1}}>
            <View style={{width: '100%', alignItems: 'flex-end'}}>
              {renderCross()}
            </View>

            <View style={{width: '100%'}}>
              {!isBlock && (
                <>
                  <Pressable
                    onPress={() => {
                      if (user == 'guest') {
                        return;
                      }

                      store.Userv.setfscreen('chat');
                      store.Userv.setUser(ruser);
                      store.Userv.addauthToken(store.User.authToken);
                      props.navigation.navigate('UserProfile');
                      closeBottomSheet();
                    }}
                    style={({pressed}) => [
                      {opacity: pressed ? touchOpacity : 1.0},
                      itemConStyle,
                    ]}>
                    <View style={{}}>
                      <Image style={itemiconStyle} source={vpIcon} />
                    </View>
                    <View style={{width: '84%'}}>
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={itemTextStyle}>
                        View Profile
                      </Text>
                    </View>
                  </Pressable>
                  <Sep />
                  <Pressable
                    onPress={() => {
                      if (store.User.user.subscriptionStatus == 'freemium') {
                        props.navigation.navigate('Plan');
                      } else {
                        if (!isFollow) FollowUser();
                        else unFollowUser();
                        closeBottomSheet();
                      }
                    }}
                    style={({pressed}) => [
                      {opacity: pressed ? touchOpacity : 1.0},
                      itemConStyle,
                    ]}>
                    <View style={{}}>
                      <Image style={itemiconStyle} source={followIcon} />
                    </View>
                    <View style={{width: '84%'}}>
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={itemTextStyle}>
                        {!isFollow ? 'Follow' : 'Unfollow'}
                      </Text>
                    </View>
                  </Pressable>
                  <Sep />
                  <Pressable
                    onPress={() => {
                      if (store.User.user.subscriptionStatus == 'freemium') {
                        props.navigation.navigate('Plan');
                      } else {
                        if (!isBlock) BlockUser();
                        else UnBlockUser();
                        closeBottomSheet();
                      }
                    }}
                    style={({pressed}) => [
                      {opacity: pressed ? touchOpacity : 1.0},
                      itemConStyle,
                    ]}>
                    <View style={{}}>
                      <Image style={itemiconStyle} source={blockIcon} />
                    </View>
                    <View style={{width: '84%'}}>
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={[itemTextStyle, {color: '#B93B3B'}]}>
                        {!isBlock ? 'Block' : 'Unblock'}
                      </Text>
                    </View>
                  </Pressable>
                  <Sep />
                  <Pressable
                    onPress={() => {
                      if (store.User.user.subscriptionStatus == 'freemium') {
                        props.navigation.navigate('Plan');
                      } else {
                        onClickBottomItem('report');
                      }
                    }}
                    style={({pressed}) => [
                      {opacity: pressed ? touchOpacity : 1.0},
                      itemConStyle,
                    ]}>
                    <View style={{}}>
                      <Image style={itemiconStyle} source={reportIcon} />
                    </View>
                    <View style={{width: '84%'}}>
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={[itemTextStyle, {color: '#B93B3B'}]}>
                        Report
                      </Text>
                    </View>
                  </Pressable>
                  <Sep />
                </>
              )}

              {isBlock && (
                <>
                  <Pressable
                    onPress={() => {
                      if (store.User.user.subscriptionStatus == 'freemium') {
                        props.navigation.navigate('Plan');
                      } else {
                        if (!isBlock) BlockUser();
                        else UnBlockUser();
                        closeBottomSheet();
                      }
                    }}
                    style={({pressed}) => [
                      {opacity: pressed ? touchOpacity : 1.0},
                      itemConStyle,
                    ]}>
                    <View style={{}}>
                      <Image style={itemiconStyle} source={blockIcon} />
                    </View>
                    <View style={{width: '84%'}}>
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={[itemTextStyle, {color: '#B93B3B'}]}>
                        {!isBlock ? 'Block' : 'Unblock'}
                      </Text>
                    </View>
                  </Pressable>
                  <Sep />
                </>
              )}
            </View>
          </View>
        </>
      </RBSheet>
    );
  };

  return (
    <>
      <View style={styles.container}>
        {isAddPhotoModal && (
          <utils.ChatPhotoModal
            isAddPhotoModal={isAddPhotoModal}
            isShowPrmsn={isShowPrmsn}
            prmsnChk={prmsnChk}
            setisAddPhotoModal={setisAddPhotoModal}
            setisSowPrmsn={setisShowPrmsn}
            setprmsnChk={setprmsnChk}
            ClosePhotoModal={ClosePhotoModal}
            photos={photos}
            setphotos={setphotos}
            setpmessage={setpmessage}
            pmessage={pmessage}
            SendMessage={SendMessage}
          />
        )}

        <utils.StackHeader
          bell={false}
          chat={ruser && !isBlockOther ? true : false}
          openBottomSheet={openBottomSheet}
          props={props}
          headerTitle={headerTitle}
        />

        {!isInternet && <utils.InternetMessage />}
        <SafeAreaView style={styles.container2}>
          <View style={styles.container3}>
            <FlatList
              onContentSizeChange={() =>
                scrollRef?.current?.scrollToEnd({animated: true})
              }
              ref={scrollRef}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              contentContainerStyle={{
                paddingVertical: 15,
                paddingHorizontal: 15,
              }}
              data={data}
              renderItem={ItemView}
              keyExtractor={(item, index) => index.toString()}
              ItemSeparatorComponent={ItemSeparatorView}
            />
          </View>

          {isEmoji && (
            <EmojiModal
              onEmojiSelected={emoji => {
                let m = message;
                m = m + emoji;
                setmessage(m);
              }}
              onPressOutside={closeEmoji}
              modalStyle={{paddingBottom: responsiveHeight(4.5)}}
              backgroundStyle={{backgroundColor: '#fcfcfc'}}
              containerStyle={{
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.2,
                shadowRadius: 1.41,
                elevation: 2,
              }}
            />
          )}

          {renderFooter()}
        </SafeAreaView>

        <Toast ref={toast} position="bottom" />
        <utils.Loader load={loader} />
        {pvm && (
          <utils.FullimageModal
            data={pd}
            si={si}
            show={pvm}
            closModal={() => {
              setpvm(!pvm);
              setpd([]);
            }}
          />
        )}
        {isModal && renderModal()}
        {isOpenSheet && renderBottomSheet()}
        {isSendReport && renderRepoerSendModal()}
      </View>
    </>
  );
}
