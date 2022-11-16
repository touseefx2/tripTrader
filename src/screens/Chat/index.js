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
  KeyboardAvoidingView,
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
import EmojiModal from 'react-native-emoji-modal';

export default observer(Chat);

let guest = require('../../assets/images/drawer/guest/img.png');

function Chat(props) {
  // const socket = props.route.params.socket;
  const socket = store.General.socket;

  let maxModalHeight = theme.window.Height - 100;
  const [modalHeight, setmodalHeight] = useState(0);
  const toast = useRef(null);
  const scrollRef = useRef(null);
  const toastduration = 700;
  let obj = props.route.params.obj || false;
  let headerTitle = props.route.params.title || '';

  const [message, setmessage] = useState('');
  const [isEmoji, setisEmoji] = useState(false);

  let internet = store.General.isInternet;
  let user = store.User.user;
  let data = store.User.messages !== null ? store.User.messages : obj.messages;

  let mloader = store.User.messagesLoader;

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
        store.User.attemptToGetAllMessages(
          obj.roomName,
          setGetDataOnce,
          setrefeshing,
        );
      } else {
        setrefeshing(false);
      }
    });
  };

  useEffect(() => {
    if (internet) {
      onRefresh();
      let username = user.firstName + ' ' + user.lastName;
      let rn = obj.roomName;
      socket.emit('joinRoom', {username, roomName: rn});
    }
    return () => {};
  }, [internet]);

  //chat sockets
  useEffect(() => {
    setTimeout(() => {
      scrollToBottom();
    }, 1000);
    return () => {
      store.User.setmessages(null);
    };
  }, []);

  useEffect(() => {
    socket.on('message', d => {
      console.log('sock on data ', d.message);
      let temp = data;
      temp.push(d);
      store.User.setmessages([...temp]);
      scrollToBottom();
      // store.User.attemptToGetInboxes(
      //   user._id,
      //   () => {},
      //   () => {},
      // );
    });
  }, [socket]);

  const scrollToBottom = () => {
    scrollRef?.current?.scrollToEnd({animated: true});
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

  const EmptyListMessage = () => {
    return (
      // Flat List Item
      <>
        {/* {!mloader && getDataOnce && (
          <Text
            style={{
              marginTop: '80%',
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'center',
              fontSize: 13,
              color: theme.color.title,
              fontFamily: theme.fonts.fontMedium,
              opacity: 0.4,
            }}
            onPress={() => getItem(item)}>
            No user found
          </Text>
        )} */}

        {/* {mloader && !getDataOnce && (
          <ActivityIndicator
            size={30}
            color={theme.color.button1}
            style={{
              marginTop: '80%',

              alignSelf: 'center',
            }}
          />
        )} */}
      </>
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

  let dir = {
    width: '100%',
    alignItems: 'flex-end',
  };

  let mc = {
    backgroundColor: '#F2F3F1',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    padding: 12,
  };

  let mc2 = {
    backgroundColor: theme.color.button1,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    padding: 12,
  };

  let mt = {
    fontSize: 14,
    color: theme.color.subTitleAuth,
    fontFamily: theme.fonts.fontNormal,
  };

  let md = {
    fontSize: 13,
    color: theme.color.subTitleLight,
    fontFamily: theme.fonts.fontNormal,
    marginTop: 3,
  };

  let mx = {
    maxWidth: '70%',
  };

  let mx2 = {
    maxWidth: '70%',
    flexDirection: 'row',
  };

  const ItemView = ({item, index}) => {
    let usr = item.sendBy._id;
    let msg = item.message || '';
    let date = CheckDate(item.updatedAt);
    let photo = item.sendBy.image ? {uri: item.sendBy.image} : guest;
    let isCu = false;
    if (user._id == usr) {
      isCu = true;
    }

    const renderMsg = () => {
      return (
        <>
          <Text
            style={[
              mt,
              {color: isCu ? theme.color.subTitleAuth : theme.color.buttonText},
            ]}>
            {msg}
          </Text>
        </>
      );
    };

    const renderMsg2 = () => {
      return (
        <>
          <View style={mc2}>
            <Text
              style={[
                mt,
                {
                  color: isCu
                    ? theme.color.subTitleAuth
                    : theme.color.buttonText,
                },
              ]}>
              {msg}
            </Text>
          </View>
        </>
      );
    };

    const renderDate = () => {
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
        <View style={[dir, {alignItems: isCu ? 'flex-end' : 'flex-start'}]}>
          {isCu && (
            <>
              <View style={mx}>
                <View style={mc}>{msg != '' && renderMsg()}</View>
                {renderDate()}
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
                  {msg != '' && renderMsg2()}
                  {renderDate()}
                </View>
              </View>
            </>
          )}
        </View>
      </>
    );
  };

  const ListHeader = () => {
    let num = total;
    let t = `You have ${num} ${num > 1 ? 'users' : 'user'} blocked`;
    return (
      <View style={{width: '100%'}}>
        <Text
          style={{
            color: theme.color.subTitle,
            fontSize: 13,
            fontFamily: theme.fonts.fontNormal,
          }}>
          {t}
        </Text>
      </View>
    );
  };

  const ListFooter = () => {
    return (
      <>
        <View>
          <View style={styles.listFooter}>
            <Text style={styles.listFooterT}>End of results</Text>
          </View>
        </View>
      </>
    );
  };

  const renderHeader = () => {
    const render1 = () => {
      const onClick = () => {
        props.navigation.goBack();
      };
      let src = require('../../assets/images/back/img.png');
      return (
        <TouchableOpacity activeOpacity={0.5} onPress={onClick}>
          <Image
            source={src}
            style={{
              width: 20,
              height: 20,
              resizeMode: 'contain',
            }}
          />
        </TouchableOpacity>
      );
    };

    const render2 = () => {
      return (
        <View style={{width: '75%'}}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.headerTitle}>
            {headerTitle}
          </Text>
        </View>
      );
    };

    const render3 = () => {
      const onClick = () => {};
      let src = require('../../assets/images/vertical/img.png');
      return (
        <TouchableOpacity activeOpacity={0.6} onPress={onClick}>
          <Image
            source={src}
            style={{
              width: 30,
              height: 24,
            }}
          />
        </TouchableOpacity>
      );
    };

    return (
      <View style={styles.headerConatainer}>
        {render1()}
        {render2()}
        {render3()}
      </View>
    );
  };

  const SendMessage = () => {
    closeEmoji();
    Keyboard.dismiss();
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        let userDetails = {
          userId: user._id,
          roomName: obj.roomName,
          username: user.firstName + ' ' + user.lastName,
          message: message,
        };
        // console.log('ud : ', userDetails);
        socket.emit('chat', {userDetails});
        setmessage('');
      } else {
        Alert.alert('', 'Please connect internet');
      }
    });
  };

  const onclickFile = () => {
    Keyboard.dismiss();
    closeEmoji();
  };

  const closeEmoji = () => {
    setisEmoji(false);
  };

  const onclickEmoji = () => {
    Keyboard.dismiss();
    setisEmoji(!isEmoji);
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
      let disable =
        message == ''
          ? true
          : mloader == true
          ? true
          : refreshing == true
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
              style={{width: '100%', borderRadius: 100}}
              onChangeText={t => {
                setmessage(t);
              }}
            />
          </View>

          <TouchableOpacity
            onPress={SendMessage}
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
        {renderOthers()}
        {renderInputContainer()}
      </View>
    );
  };

  return (
    <>
      <View style={styles.container}>
        {renderHeader()}

        {!internet && <utils.InternetMessage />}
        <SafeAreaView style={styles.container2}>
          <View style={styles.container3}>
            <FlatList
              ref={scrollRef}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              contentContainerStyle={{
                paddingVertical: 15,
                paddingHorizontal: 15,
              }}
              data={data}
              // initialScrollIndex={Messages.length > 0 ? Messages.length - 1 : 0}
              renderItem={ItemView}
              keyExtractor={(item, index) => index.toString()}
              ListEmptyComponent={EmptyListMessage}
              ItemSeparatorComponent={ItemSeparatorView}
              // ListHeaderComponent={data.length > 0 ? ListHeader : null}
              // ListFooterComponent={data.length > 0 ? ListFooter : null}
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
              modalStyle={{padding: 10}}
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

          {/* {data.length > 0 && !getDataOnce && mloader && (
            <ActivityIndicator
              size={30}
              color={theme.color.button1}
              style={{
                top: '30%',
                position: 'absolute',
                alignSelf: 'center',
              }}
            />
          )} */}

          {renderFooter()}
        </SafeAreaView>
        {/* <utils.Loader load={loader} /> */}
        <Toast ref={toast} position="bottom" />
      </View>
    </>
  );
}
