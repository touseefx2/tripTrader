import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TouchableHighlight,
  StatusBar,
  BackHandler,
  Alert,
  Linking,
  PermissionsAndroid,
  Platform,
  Dimensions,
  Pressable,
  TextInput,
  FlatList,
  ScrollView,
  Keyboard,
  Modal,
  RefreshControl,
} from 'react-native';
import ProgressiveFastImage from '@freakycoder/react-native-progressive-fast-image';
// import ImageSlider from 'react-native-image-slider';
import {styles} from './styles';
import {observer} from 'mobx-react';
import store from '../../store/index';
import utils from '../../utils/index';
import theme from '../../theme';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-easy-toast';
import {ActivityIndicator} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import {ImageSlider} from 'react-native-image-slider-banner';
import {Calendar} from 'react-native-calendars';
import moment, {duration} from 'moment/moment';

export default observer(ConfirmTrips);

function ConfirmTrips(props) {
  let maxModalHeight = theme.window.Height - 100;
  const [modalHeight, setmodalHeight] = useState(0);

  let headerTitle = 'Confirmed Trips';

  let guest = require('../../assets/images/drawer/guest/img.png');
  let trnfericon = require('../../assets/images/transfer/img.png');
  let durtnicon = require('../../assets/images/confirmTrip/duration/img.png');
  let avlblicon = require('../../assets/images/confirmTrip/available/img.png');
  let locationicon = require('../../assets/images/confirmTrip/location/img.png');

  let internet = store.General.isInternet;
  let user = store.User.user;

  const [modalObj, setmodalObj] = useState(false);
  const [modalChk, setmodalChk] = useState(false);
  const [isModal, setisModal] = useState(false);
  const [isSendMessage, setisSendMessage] = useState(false);
  const [sendObj, setsendObj] = useState('');

  const [message, setMessage] = useState('');
  const closeMessageModal = () => {
    if (!mmmloader) {
      setisModal(false);
      setmodalChk(false);
      setmodalObj(false);
      setMessage('');
    }
  };

  let data = store.Offers.cnfrmOffers;
  let mloader = store.Offers.Loader3;
  let mmloader = store.Offers.mLoader;
  let mmmloader = store.User.homeModalLoder; //msg loader

  const [getDataOnce, setgetDataOnce] = useState(false);
  const setGetDataOnce = C => {
    setgetDataOnce(C);
  };
  const [refreshing, setRefreshing] = React.useState(false);
  const setrefeshing = c => {
    setRefreshing(c);
  };
  const onRefresh = React.useCallback(() => {
    console.warn('onrefresh cal');
    setRefreshing(true);
    getDbData();
  }, []);
  const getDbData = () => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        store.Offers.attemptToGetConfirmOffers(setGetDataOnce, setrefeshing);
      } else {
        setrefeshing(false);
      }
    });
  };
  useEffect(() => {
    if (!getDataOnce && internet) {
      getDbData();
    }
    return () => {};
  }, [getDataOnce, internet]);

  const onclickSearchBar = () => {};

  const setIsSendMessage = v => {
    let isMyTrip = false;
    let item = modalObj.item;
    if (store.User.user._id == item.offeredTo._id) {
      isMyTrip = true;
    }
    let usr = isMyTrip ? item.offeredBy : item.offeredTo;
    setsendObj(usr);
    closeMessageModal();
    setisSendMessage(v);
  };

  const sendMessage = () => {
    Keyboard.dismiss();

    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        let isMyTrip = false;
        let item = modalObj.item;
        if (store.User.user._id == item.offeredTo._id) {
          isMyTrip = true;
        }
        let usr = isMyTrip ? item.offeredBy : item.offeredTo;

        const obj = {
          userId1: user._id,
          userId2: usr._id,
          sendBy: user._id,
          sendTo: usr._id,
          senderName: user.firstName + ' ' + user.lastName,
          isRead: false,
          message: message,
          type: 'text',
        };
        store.User.attemptToCheckFirstMessage(
          user._id,
          usr._id,
          obj,
          message,
          setIsSendMessage,
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

  const EmptyListMessage = ({item}) => {
    return (
      // Flat List Item
      <>
        {!mloader && getDataOnce && (
          <Text
            style={{
              marginTop: '80%',
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'center',
              fontSize: 13,
              color: theme.color.subTitleLight,
              fontFamily: theme.fonts.fontMedium,
            }}
            onPress={() => getItem(item)}>
            No confirm offer found
          </Text>
        )}

        {mloader && !getDataOnce && (
          <ActivityIndicator
            size={30}
            color={theme.color.button1}
            style={{
              marginTop: '80%',

              alignSelf: 'center',
            }}
          />
        )}
      </>
    );
  };

  const ListHeader = () => {
    const renderResult = () => {
      let length = data.length || 0;
      return (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>
            You have {length} upcoming trip{length <= 1 ? '' : 's'}
          </Text>
        </View>
      );
    };

    const renderSearch = () => {
      return (
        <TouchableOpacity disabled>
          <Image
            source={require('../../assets/images/searchBar/search/img.png')}
            style={styles.Baricon}
          />
        </TouchableOpacity>
      );
    };

    const renderInput = () => {
      return (
        <View style={{width: '85%'}}>
          <TextInput
            editable={false}
            style={styles.SerchBarInput}
            placeholder="Search"
          />
        </View>
      );
    };

    const renderFilter = () => {
      const onclick = () => {};

      return (
        <TouchableOpacity style={styles.Baricon} onPress={onclick} disabled>
          {/* <Image
            source={require('../../assets/images/searchBar/filter/img.png')}
            style={styles.Baricon}
          /> */}
        </TouchableOpacity>
      );
    };

    return (
      <>
        <Pressable
          style={({pressed}) => [
            {opacity: pressed ? 0.9 : 1},
            [styles.SerchBarContainer],
          ]}
          onPress={onclickSearchBar}>
          {renderSearch()}
          {renderInput()}
          {renderFilter()}
        </Pressable>
        {data.length > 0 && renderResult()}
      </>
    );
  };

  function FormatAvlblDate(s1, s2) {
    let avlbl = '';

    let sd = s1;
    let sdy = parseInt(new Date(sd).getFullYear());
    let ed = s2;
    let edy = parseInt(new Date(ed).getFullYear());
    if (sdy == edy) {
      avlbl =
        moment(sd).format('MMM DD') + ' - ' + moment(ed).format('MMM DD, YYYY');
    } else {
      avlbl =
        moment(sd).format('MMM DD, YYYY') +
        ' - ' +
        moment(ed).format('MMM DD, YYYY');
    }

    return avlbl;
  }

  function FormatPrfrDate(pd) {
    let t = '';
    let arset = [];
    if (pd.length > 0) {
      pd.map((e, i, a) => {
        arset.push(moment(e).format('MMM DD, YYYY'));
      });
    }
    if (arset.length > 0) {
      let fd = arset[0];
      if (arset.length > 1) {
        let sd = arset[arset.length - 1];

        let sdy = parseInt(new Date(fd).getFullYear());

        let edy = parseInt(new Date(sd).getFullYear());

        if (sdy == edy) {
          t =
            moment(fd).format('MMM DD') +
            ' - ' +
            moment(sd).format('MMM DD, YYYY');
        } else {
          t = fd + ' - ' + sd;
        }
      } else if (arset.length <= 1) {
        t = fd;
      }
    }

    return t;
  }

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

  function diff_minutes(dt2, dt1) {
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60;
    return Math.abs(Math.round(diff));
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

    if (ics == 'greater') {
      var start = moment(moment(ed).format('YYYY-MM-DD'), 'YYYY-MM-DD');
      var end = moment(moment(sd).format('YYYY-MM-DD'), 'YYYY-MM-DD');
      let days = start.diff(end, 'days');

      if (days > 3) {
        if (udcy) {
          t = moment(ud).format('MMM DD');
        } else {
          t = moment(ud).format('MMM DD, YYYY');
        }
      } else {
        if (days == 1 || days == 0) {
          t = '1 day ago';
        }

        if (days == 2) {
          t = '2 days ago';
        }

        if (days == 3) {
          t = '3 days ago';
        }
      }
    } else {
      let min = diff_minutes(ed, sd);
      // console.log('minutes: ', min);
      if (min >= 0 && min <= 1) {
        t = 'Just now';
      } else {
        if (min > 1 && min < 60) {
          t = min + ' mins ago';
        } else if (min >= 60) {
          const hours = Math.floor(min / 60);

          const h = hours.toFixed(0);
          let tt = h <= 1 ? ' hour' : ' hours';
          t = h + tt + ' ago';

          // t = moment(ud).format('hh:mm a');
        }
      }
    }

    return t;
  }

  const ItemView = ({item, index}) => {
    let isMyTrip = false;
    if (store.User.user._id == item.offeredTo._id) {
      isMyTrip = true;
    }

    let user = isMyTrip ? item.offeredBy : item.offeredTo;
    let ofer = isMyTrip ? item.hostTrip : item.offeredTrip;
    let trade = isMyTrip ? item.offeredTrip : item.hostTrip;
    let offernote = item.note || '';
    let create = CheckDate(item.updatedAt);

    let photo = user.image ? {uri: user.image} : guest;
    let userName = user.firstName + ' ' + user.lastName;

    //offer by (host trip)
    let title = ofer.species;
    let dur = ofer.duration.value;
    let t =
      dur <= 1
        ? ofer.duration.title.substring(0, ofer.duration.title.length - 1)
        : ofer.duration.title;
    dur = dur + ' ' + t;
    let tripDates = isMyTrip ? item.tripDates : item.preferredDates;
    let avlbl = FormatPrfrDate(tripDates);
    let loc = ofer.location.city + ', ' + ofer.location.state;

    //ofer to (offer trip)
    let titlet = trade.species;
    let durt = trade.duration.value;
    let tt =
      durt <= 1
        ? trade.duration.title.substring(0, trade.duration.title.length - 1)
        : trade.duration.title;
    durt = durt + ' ' + tt;
    let preferdates = isMyTrip ? item.preferredDates : item.tripDates;
    let avlblt = FormatPrfrDate(preferdates);
    let loct = trade.location.city + ', ' + trade.location.state;

    const renderProfile = () => {
      return (
        <>
          <View style={styles.mProfileImgContainer}>
            <ProgressiveFastImage
              style={styles.mProfileImg}
              source={photo}
              loadingImageStyle={styles.mimageLoader}
              loadingSource={require('../../assets/images/imgLoad/img.jpeg')}
              blurRadius={5}
            />
          </View>
        </>
      );
    };

    const renderText = () => {
      return (
        <View style={[styles.mtextContainer]}>
          <View style={{width: '100%'}}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                color: '#101B10',
                fontSize: 16,
                fontFamily: theme.fonts.fontBold,
                lineHeight: 22.4,
                textTransform: 'capitalize',
              }}>
              {userName}
            </Text>
          </View>

          {/* <View style={{flexDirection: 'row', justifyContent: 'space-between',marginTop: 3}}> */}
          <View style={{width: '100%', marginTop: 2}}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                color: theme.color.subTitleLight,
                fontSize: 13,
                fontFamily: theme.fonts.fontMedium,
                lineHeight: 18.2,
              }}>
              {create}
            </Text>
          </View>

          {/* </View> */}
        </View>
      );
    };

    const renderFields = () => {
      let titleS = {
        color: theme.color.subTitleLight,
        fontSize: 11.5,
        fontFamily: theme.fonts.fontBold,
        textTransform: 'uppercase',
      };

      let titleM = {
        color: theme.color.title,
        fontSize: 13,
        fontFamily: theme.fonts.fontMedium,
        lineHeight: 19,
      };

      let iconS = {
        width: 20,
        height: 20,
        resizeMode: 'contain',
      };

      let titleM2 = {
        color: '#101B10',
        fontSize: 13,
        fontFamily: theme.fonts.fontNormal,
        lineHeight: 19,
      };

      let offertitleS = {
        color: '#101B10',
        fontSize: 12,
        fontFamily: theme.fonts.fontNormal,
      };

      return (
        <View style={{width: '96%', marginTop: 20, alignSelf: 'center'}}>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View style={{width: '40%'}}>
              <Text style={titleS}>Offering</Text>
              <Text style={titleM}>{title}</Text>

              <View style={{marginTop: 20}}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Image style={iconS} source={durtnicon} />
                  <View style={{width: '78%'}}>
                    <Text style={titleM2}>{dur}</Text>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 10,
                  }}>
                  <Image style={iconS} source={avlblicon} />
                  <View style={{width: '78%'}}>
                    <Text style={titleM2}>{avlbl}</Text>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 10,
                  }}>
                  <Image style={iconS} source={locationicon} />
                  <View style={{width: '78%'}}>
                    <Text style={titleM2}>{loc}</Text>
                  </View>
                </View>
              </View>
            </View>

            <Image
              style={{
                width: 24,
                height: 24,
                top: 26,
                resizeMode: 'contain',
              }}
              source={trnfericon}
            />

            <View style={{width: '40%'}}>
              <Text style={titleS}>for trade</Text>
              <Text style={titleM}>{titlet}</Text>

              <View style={{marginTop: 20}}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Image style={iconS} source={durtnicon} />
                  <View style={{width: '78%'}}>
                    <Text style={titleM2}>{durt}</Text>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 10,
                  }}>
                  <Image style={iconS} source={avlblicon} />
                  <View style={{width: '78%'}}>
                    <Text style={titleM2}>{avlblt}</Text>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 10,
                  }}>
                  <Image style={iconS} source={locationicon} />
                  <View style={{width: '78%'}}>
                    <Text style={titleM2}>{loct}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {offernote != '' && (
            <View style={{width: '100%', marginTop: 20}}>
              <Text style={titleS}>OFFER NOTE</Text>
              <Text style={offertitleS}>{offernote}</Text>
            </View>
          )}
        </View>
      );
    };

    const renderBottom = () => {
      let bc = {
        width: '46%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        height: 46,
        borderWidth: 1,
        borderColor: theme.color.fieldBorder,
      };

      let btS = {
        color: '#3C6B49',
        fontSize: 15,
        fontFamily: theme.fonts.fontBold,
      };

      return (
        <View
          style={{
            width: '100%',
            marginTop: 20,
            alignSelf: 'center',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Pressable
            style={({pressed}) => [{opacity: pressed ? 0.8 : 1}, bc]}
            onPress={() => {
              setmodalObj({item: item, i: index});
              setmodalChk('message');
              setisModal(true);
            }}>
            <Text numberOfLines={1} ellipsizeMode="tail" style={btS}>
              Message
            </Text>
          </Pressable>

          <Pressable
            onPress={() => {
              let u = user;
              store.Userv.clearUser();
              store.Userv.setfscreen('confirmedtrips');
              store.Userv.setUser(u);
              store.Userv.addauthToken(store.User.authToken);
              props.navigation.navigate('UserProfile');
            }}
            style={({pressed}) => [{opacity: pressed ? 0.8 : 1}, bc]}>
            <Text numberOfLines={1} ellipsizeMode="tail" style={btS}>
              View Profile
            </Text>
          </Pressable>
        </View>
      );
    };

    return (
      <Pressable
        disabled
        onPress={() => {}}
        style={({pressed}) => [
          {opacity: pressed ? 0.8 : 1.0},
          [
            styles.modalinfoConatiner,
            {
              marginTop: index == 0 ? 10 : 0,
            },
          ],
        ]}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '95%',
          }}>
          {renderProfile()}
          {renderText()}
        </View>
        {renderFields()}
        {renderBottom()}
      </Pressable>
    );
  };

  const renderMessageSendModal = () => {
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

              marginTop: 40,
            }}>
            <Text
              style={{
                color: theme.color.buttonText,
                fontSize: 16,
                fontFamily: theme.fonts.fontBold,

                textTransform: 'capitalize',
              }}>
              Done
            </Text>
          </TouchableOpacity>
        </>
      );
    };

    const renderButton2 = () => {
      return (
        <>
          <TouchableOpacity
            onPress={() => {
              closeModal();
              props.navigation.navigate('Inbox');
            }}
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
                fontSize: 14,
              }}>
              Go to Inbox
            </Text>
          </TouchableOpacity>
        </>
      );
    };

    const closeModal = () => {
      setisSendMessage(false);
    };

    let fn = sendObj.firstName;
    let ln = sendObj.lastName;
    let sendOfferUsername = fn + ' ' + ln;
    let un = sendObj.userName || 'user';
    let src = require('../../assets/images/msgSentDone/img.png');
    return (
      <Modal
        animationType="slide"
        visible={isSendMessage}
        transparent
        onRequestClose={closeModal}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
            padding: 15,
          }}>
          <View
            style={{
              backgroundColor: theme.color.background,
              borderRadius: 15,
              marginBottom: 15,
              padding: 18,
              width: '100%',
            }}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
              }}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  fontFamily: theme.fonts.fontBold,
                  fontSize: 19,
                  color: '#101B10',
                  lineHeight: 29,
                }}>
                Message Sent
              </Text>
            </View>

            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 40,
                width: '100%',
              }}>
              <Image
                style={{width: 90, height: 90, resizeMode: 'contain'}}
                source={src}
              />

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
                @{un}
              </Text>
            </View>

            {renderButton1()}
            {renderButton2()}
          </View>
        </View>
      </Modal>
    );
  };

  const renderModal = () => {
    if (modalChk == 'message') {
      const renderHeader = () => {
        let text = 'Message User';

        const renderCross = () => {
          return (
            <Pressable
              disabled={mmmloader}
              style={({pressed}) => [
                {opacity: pressed ? 0.7 : 1.0},
                styles.modalCross,
              ]}
              onPress={closeMessageModal}>
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
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            {renderTitle()}
            {renderCross()}
          </View>
        );
      };

      const renderField = () => {
        let isMyTrip = false;
        if (store.User.user._id == modalObj.item.offeredTo._id) {
          isMyTrip = true;
        }

        let item = isMyTrip ? modalObj.item.offeredBy : modalObj.item.offeredTo;

        let photo = item.image ? item.image : '';
        let isVeirfy = item.identityStatus == 'verified' ? true : false;
        let userName = item.firstName + ' ' + item.lastName;
        const renderProfile = () => {
          return (
            <View style={styles.mProfileImgContainerm}>
              <ProgressiveFastImage
                style={styles.mProfileImgm}
                source={
                  photo != ''
                    ? {uri: photo}
                    : require('../../assets/images/drawer/guest/img.png')
                }
                loadingImageStyle={styles.mimageLoaderm}
                loadingSource={require('../../assets/images/imgLoad/img.jpeg')}
                blurRadius={5}
              />
              {/* {isVeirfy && (
                  <Image
                    style={styles.miconVerifym}
                    source={require('../../assets/images/verified/img.png')}
                  />
                )} */}
            </View>
          );
        };

        return (
          <View style={[styles.modalFieldConatiner, {marginTop: 15}]}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={styles.mT1}>To:</Text>
              <View
                style={{
                  width: '89%',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                }}>
                {renderProfile()}
                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.mT2}>
                  {userName}
                </Text>
              </View>
            </View>

            <View style={styles.textArea}>
              <TextInput
                value={message}
                onChangeText={c => {
                  setMessage(c);
                }}
                style={styles.mTextInpt}
                placeholder="Type your message here"
                multiline={true}
                numberOfLines={10}
              />
            </View>
          </View>
        );
      };

      const renderBottom = () => {
        const renderButton = () => {
          return (
            <Pressable
              onPress={sendMessage}
              disabled={mmmloader == true ? true : message == '' ? true : false}
              style={({pressed}) => [
                {opacity: pressed ? 0.9 : message == '' ? 0.5 : 1},
                styles.ButtonContainer,
                {backgroundColor: theme.color.button1, width: '100%'},
              ]}>
              {!mmmloader && (
                <Text
                  style={[
                    styles.ButtonText,
                    {color: theme.color.buttonText, fontSize: 13},
                  ]}>
                  Send Message
                </Text>
              )}
              {mmmloader && (
                <ActivityIndicator size={20} color={theme.color.buttonText} />
              )}
            </Pressable>
          );
        };

        return (
          <View style={styles.modalBottomContainerrr}>{renderButton()}</View>
        );
      };

      return (
        <Modal visible={isModal} transparent onRequestClose={closeMessageModal}>
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalContainer2}>
              <View style={styles.modal2}>
                {renderHeader()}
                {renderField()}
                {renderBottom()}
              </View>
            </View>
          </SafeAreaView>
        </Modal>
      );
    }
  };

  return (
    <>
      <View style={styles.container}>
        <utils.DrawerHeader props={props} headerTitle={headerTitle} />
        {!internet && <utils.InternetMessage />}
        <SafeAreaView style={styles.container2}>
          <View style={styles.container3}>
            <FlatList
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              style={{marginTop: 5}}
              contentContainerStyle={{
                paddingTop: 12,
                paddingBottom: 40,
                paddingHorizontal: 15,
              }}
              showsVerticalScrollIndicator={false}
              data={data}
              renderItem={ItemView}
              keyExtractor={(item, index) => index.toString()}
              ListEmptyComponent={EmptyListMessage}
              ItemSeparatorComponent={ItemSeparatorView}
              ListHeaderComponent={data.length > 0 ? ListHeader : null}
            />

            {data.length > 0 && !getDataOnce && mloader && (
              <ActivityIndicator
                size={30}
                color={theme.color.button1}
                style={{
                  top: '50%',
                  position: 'absolute',
                  alignSelf: 'center',
                }}
              />
            )}
          </View>

          <utils.Footer
            nav={props.navigation}
            screen={headerTitle}
            focusScreen={store.General.focusScreen}
          />

          {isModal && !isSendMessage && renderModal()}
          {isSendMessage && renderMessageSendModal()}
          {store.Notifications.isShowNotifcation && <utils.ShowNotifications />}
        </SafeAreaView>
      </View>
    </>
  );
}
