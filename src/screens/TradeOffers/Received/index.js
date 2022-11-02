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
} from 'react-native';
import ProgressiveFastImage from '@freakycoder/react-native-progressive-fast-image';
import {styles} from './styles';
import {observer} from 'mobx-react';
import store from '../../../store/index';
import utils from '../../../utils/index';
import theme from '../../../theme';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-easy-toast';
import {ActivityIndicator} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import {ImageSlider} from 'react-native-image-slider-banner';
import {Calendar} from 'react-native-calendars';
import moment, {duration} from 'moment/moment';

export default observer(Received);

function isObjectEmpty(value) {
  return (
    Object.prototype.toString.call(value) === '[object Object]' &&
    JSON.stringify(value) === '{}'
  );
}

let seDayColor = theme.color.button1;
let ocolor = '#569969';

let cssf = {
  container: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#cccccc',
    borderStyle: 'dashed',
  },
  text: {
    color: theme.color.subTitleLight,
    fontFamily: theme.fonts.fontMedium,
  },
};

let css2f = {
  container: {
    backgroundColor: 'transparent',
  },
  text: {
    color: theme.color.subTitleLight,
    fontFamily: theme.fonts.fontMedium,
  },
};

let css2fd = {
  container: {
    backgroundColor: 'transparent',
  },
  text: {
    color: theme.color.title,
    fontFamily: theme.fonts.fontMedium,
  },
};

let cs = {
  container: {
    backgroundColor: theme.color.button1,
  },
  text: {
    color: theme.color.buttonText,
    fontFamily: theme.fonts.fontMedium,
    top: 2,
  },
};

let css = {
  container: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#cccccc',
    borderStyle: 'dashed',
  },
  text: {
    color: theme.color.subTitleLight,
    fontFamily: theme.fonts.fontMedium,
  },
};

let td = {
  [moment().format('YYYY-MM-DD')]: {
    marked: false,
    selected: true,
    customStyles: css2fd,

    disabled: false,
    disableTouchEvent: false,
  },
};
let dtd = {
  [moment().format('YYYY-MM-DD')]: {
    marked: false,
    selected: true,
    customStyles: css2f,

    disabled: true,
    disableTouchEvent: true,
  },
};

function Received(props) {
  let maxModalHeight = theme.window.Height - 100;
  const [modalHeight, setmodalHeight] = useState(0);

  let headerTitle = 'Confirmed Trips';

  let guest = require('../../../assets/images/drawer/guest/img.png');
  let trnfericon = require('../../../assets/images/transfer/img.png');
  let durtnicon = require('../../../assets/images/confirmTrip/duration/img.png');
  let avlblicon = require('../../../assets/images/confirmTrip/available/img.png');
  let locationicon = require('../../../assets/images/confirmTrip/location/img.png');

  let internet = store.General.isInternet;
  let user = store.User.user;

  const [step, setstep] = useState(1);

  const [markedDatess, setmarkedDatess] = useState({});
  const [selDatess, setselDatess] = useState({});
  const [isSelDatee, setisSelDatee] = useState(false);

  let data = store.Trips.receiveOffers;

  const [modalObj, setmodalObj] = useState(false);
  const [modalChk, setmodalChk] = useState(false);
  const [isModal, setisModal] = useState(false);
  const [isSendMessage, setisSendMessage] = useState(false);
  const [sendObj, setsendObj] = useState('');

  const [isOfferSend, setisOfferSend] = useState(false);

  const [showCal1, setshowCal1] = useState(false);

  const [minDatee, setminDatee] = useState('');
  const [maxDatee, setmaxDatee] = useState('');
  const [isDisableToday, setisDisableToday] = useState(false);
  const [monthh, setmonthh] = useState(new Date());

  let mloader = store.Trips.confirmTripsSendMessageLoader;

  const [message, setMessage] = useState('');
  const closeMessageModal = () => {
    setisModal(false);
    setmodalChk(false);
    setmodalObj(false);
    setMessage('');
  };

  useEffect(() => {
    const dt = [
      {
        user: {
          userName: 'Mike Monuse',
          first_name: 'Mike',
          last_name: ' Monuse',
          avg_rating: 3.8,
          total_reviews: 190,
          photo:
            'https://cdn140.picsart.com/76886237758523202417.png?type=webp&to=min&r=-1x-1',
        },
        offering: {
          offer: 'Whitetail Hunting in Central NC',

          durt: '3 day',
          avt: 'Jul 22-25, 2022',
          location: {
            coords: [],
            name: 'Dylan, NC',
          },
          availablity: {endDate: '2022-12-05', startDate: '2022-10-24'},
          duration: {number: '3', title: 'days'},
          unavailable: {
            all_unavailable_dates: [
              '2022-10-25',
              '2022-10-26',
              '2022-10-28',
              '2022-11-02',
              '2022-11-04',
            ],
            days_of_week: ['Fri'],
            esd_text: 'Oct 25-26, Nov 2',
            exclude_specific_dates: ['2022-10-25', '2022-10-26', '2022-11-02'],
            repeat_every: {endRepeatOn: '2022-11-05', num: 1, title: 'Weeks'},
            unavailable_days_of_week: ['2022-10-28', '2022-11-04'],
            wtxt: 'Fri (weekly)',
          },
        },
        fortrade: {
          offer: 'Osceola Turkey Hunting',
          duration: {number: '3', title: 'days'},
          durt: '3 days',
          avt: 'Oct 8-11, 2022',
          location: {
            coords: [],
            name: 'Boise, ID',
          },
        },
        offerNote:
          'I have a bad knee and will need to stay on flat terrain most of the time. Is this something that could be accomodated?',
        createdAt: '1 hour ago',
      },
    ];

    store.Trips.setreceiveOffers(dt);

    return () => {};
  }, []);

  useEffect(() => {
    if (
      !isObjectEmpty(markedDatess) &&
      !isObjectEmpty(modalObj) &&
      modalChk == 'offer' &&
      step == 1
    ) {
      const size = Object.keys(markedDatess).length;
      let item = modalObj.item;
      let totaldays = 0;
      let t = item.offering.duration.title;
      let duration = parseInt(item.offering.duration.number);

      if (t == 'days') {
        totaldays = duration;
      } else if (t == 'weeks') {
        totaldays = duration * 7;
      } else if (t == 'months') {
        totaldays = duration * 30;
      } else if (t == 'years') {
        totaldays = duration * 365;
      }
      if (size == totaldays) {
        setisSelDatee(true);
      } else {
        setisSelDatee(false);
      }
    }
  }, [markedDatess, modalObj, modalChk, step]);

  //for diable totday day color in step1 calender in make offer
  useEffect(() => {
    if (
      !isObjectEmpty(modalObj) &&
      modalChk == 'offer' &&
      step == 1 &&
      isModal &&
      minDatee == ''
    ) {
      let item = modalObj.item;
      let sd = item.offering.availablity.startDate;
      let cd = moment().format('YYYY-MM-DD');

      if (sd <= cd) {
        setisDisableToday(false);
      } else {
        setisDisableToday(true);
      }
    }
  }, [modalObj, modalChk, step, isModal, minDatee]);
  useEffect(() => {
    if (minDatee != '') {
      let todayd = moment().format('YYYY-MM-DD');
      if (minDatee <= todayd) {
        setisDisableToday(false);
      } else {
        setisDisableToday(true);
      }
    }
  }, [minDatee]);
  //end
  console.log('minde : ', minDatee);
  console.log('isdtdy : ', isDisableToday);
  console.log('isSeldate : ', isSelDatee);

  const onclickSearchBar = () => {};

  const setIsSendMessage = v => {
    setsendObj(modalObj.item.user);
    closeMessageModal();
    setisSendMessage(v);
  };

  const sendMessage = () => {
    Keyboard.dismiss();

    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        // const obj = {
        //   _id: (Math.random() * 10).toFixed(0),
        //   title: title,
        //   user: store.User.user._id,
        //   offer: trade,
        //   return: Return,
        //   loc: {
        //     name: 'Miami, Florida',
        //     coords: [],
        //   },
        //   status: status,
        //   acceptOtherTrades: acceptOther,
        //   duration: {
        //     number: durNum,
        //     title: dur.title,
        //   },
        //   availablity: {
        //     startDate: isSelDate1,
        //     endDate: isSelDate2,
        //   },
        //   photos: photos,
        //   unavailable: isSetUnavailable != false ? isSetUnavailable : {},
        // };
        // console.warn('create trip obj : ', obj);
        store.Trips.attemptToMessageSend({}, setIsSendMessage);
      } else {
        // seterrorMessage('Please connect internet');
        Alert.alert('', 'Please connect internet');
      }
    });
  };

  const setIsSendObj = v => {
    closeModalAll();
    setsendObj(modalObj.item.user);
    setisOfferSend(v);
  };

  const ConfirmSend = () => {
    Keyboard.dismiss();

    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        let item = modalObj.item;
        let ind = item.i;

        // console.warn('confirm offer  obj : ', obj);
        store.Trips.attemptToAcceptOffer({}, setIsSendObj);
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
          height: 15,
        }}
      />
    );
  };

  const EmptyListMessage = ({item}) => {
    return (
      // Flat List Item
      <Text style={styles.emptyListStyle} onPress={() => getItem(item)}>
        No Data Found
      </Text>
    );
  };

  const ListHeader = () => {
    const renderResult = () => {
      let length = data.length || 0;
      return (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>You received {length} offer</Text>
        </View>
      );
    };

    const renderSearch = () => {
      return (
        <TouchableOpacity disabled>
          <Image
            source={require('../../../assets/images/searchBar/search/img.png')}
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
            source={require('../../../assets/images/searchBar/filter/img.png')}
            style={styles.Baricon}
          /> */}
        </TouchableOpacity>
      );
    };

    return (
      <>
        {/* <Pressable
          style={({pressed}) => [
            {opacity: pressed ? 0.9 : 1},
            [styles.SerchBarContainer],
          ]}
          onPress={onclickSearchBar}>
          {renderSearch()}
          {renderInput()}
          {renderFilter()}
        </Pressable> */}

        {data.length > 0 && renderResult()}
      </>
    );
  };

  const ItemView = ({item, index}) => {
    let user = item.user;
    let ofer = item.offering;
    let trade = item.fortrade;
    let offernote = item.offerNote || '';
    let create = item.createdAt || '';

    let photo = user.photo && user.photo != '' ? {uri: user.photo} : guest;
    let userName = user.userName || '';
    let avgRating = parseInt(user.avg_rating);
    let totalReviews = parseInt(user.total_reviews);

    let title = ofer.offer;
    let dur = ofer.durt;
    let avlbl = ofer.avt;
    let loc = ofer.location.name ? ofer.location.name : '';

    let titlet = trade.offer;
    let durt = trade.durt;
    let avlblt = trade.avt;
    let loct = trade.location.name ? trade.location.name : '';

    const renderProfile = () => {
      return (
        <>
          <View style={styles.mProfileImgContainer}>
            <ProgressiveFastImage
              style={styles.mProfileImg}
              source={photo}
              loadingImageStyle={styles.mimageLoader}
              loadingSource={require('../../../assets/images/imgLoad/img.jpeg')}
              blurRadius={5}
            />
          </View>
        </>
      );
    };

    const renderText = () => {
      return (
        <View style={[styles.mtextContainer]}>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View style={{width: '72%'}}>
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
            <View
              style={{
                width: '27%',

                alignItems: 'flex-end',
              }}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  color: theme.color.subTitleLight,
                  fontSize: 11,
                  fontFamily: theme.fonts.fontMedium,
                  lineHeight: 22.4,
                }}>
                {create}
              </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 3}}>
            <utils.vectorIcon.Entypo
              name="star"
              color={theme.color.rate}
              size={14}
            />
            <Text style={styles.textContainerRatetitle1}>
              {' '}
              {avgRating.toFixed(1)}
              {'  '}
            </Text>
            <Text style={styles.textContainerRatetitle2}>
              {totalReviews > 300 ? '300+' : totalReviews} reviews
            </Text>
          </View>
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
        marginTop: 2,
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
        <View style={{width: '97%', marginTop: 20, alignSelf: 'center'}}>
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
                resizeMode: 'contain',
                top: 26,
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
              <Text style={offertitleS}>
                I have a bad knee and will need to stay on flat terrain most of
                the time. Is this something that could be accomodated?
              </Text>
            </View>
          )}
        </View>
      );
    };

    const renderBottom2 = () => {
      let bc1 = {
        width: '46%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        height: 47,

        backgroundColor: '#F8ECEC',
      };

      let btS1 = {
        color: '#B93B3B',
        fontSize: 15,
        fontFamily: theme.fonts.fontBold,
      };

      let bc2 = {
        width: '46%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        height: 48,
        borderWidth: 1,
        borderColor: theme.color.fieldBorder,
      };

      let btS2 = {
        color: '#3C6B49',
        fontSize: 15,
        fontFamily: theme.fonts.fontBold,
      };

      return (
        <View
          style={{
            width: '100%',
            marginTop: 30,
            alignSelf: 'center',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Pressable
            onPress={() => {}}
            style={({pressed}) => [{opacity: pressed ? 0.8 : 1}, bc1]}>
            <Text numberOfLines={1} ellipsizeMode="tail" style={btS1}>
              Decline
            </Text>
          </Pressable>

          <Pressable
            style={({pressed}) => [{opacity: pressed ? 0.8 : 1}, bc2]}
            onPress={() => {
              setmodalObj({item: item, i: index});
              setmodalChk('message');
              setisModal(true);
            }}>
            <Text numberOfLines={1} ellipsizeMode="tail" style={btS2}>
              Message
            </Text>
          </Pressable>
        </View>
      );
    };

    const renderBottom = () => {
      let bc = {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        height: 48,
        backgroundColor: theme.color.button1,
        marginTop: 15,
        // borderWidth: 1,
        // borderColor: theme.color.fieldBorder,
      };

      let btS = {
        color: theme.color.buttonText,
        fontSize: 14,
        fontFamily: theme.fonts.fontBold,
      };

      return (
        <View
          style={{
            width: '100%',
          }}>
          {renderBottom2()}
          <Pressable
            onPress={() => {
              setmodalObj({item: item, i: index});
              setmodalChk('offer');
              setisModal(true);
            }}
            style={({pressed}) => [{opacity: pressed ? 0.8 : 1}, bc]}>
            <Text numberOfLines={1} ellipsizeMode="tail" style={btS}>
              Choose Trip Date
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
            width: '100%',
          }}>
          {renderProfile()}
          {renderText()}
        </View>
        {renderFields()}
        {renderBottom()}
      </Pressable>
    );
  };

  const ListFooter = () => {
    return (
      <>
        <View>
          <View style={styles.listFooter}>
            <Text style={styles.listFooterT}>End of messages</Text>
          </View>
        </View>
      </>
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

    let fn = sendObj.first_name;
    let ln = sendObj.last_name;
    let sendOfferUsername = fn + ' ' + ln;
    let un = sendObj.userName;
    let src = require('../../../assets/images/msgSentDone/img.png');
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

  const onClickCal = () => {
    setshowCal1(!showCal1);
  };

  const closeModalAll = () => {
    if (!mloader) {
      clearModal1();
      clearModal2();
      setmodalHeight(0);
      setstep(1);
    }
  };

  const closeModal = () => {
    if (step == 1) {
      clearModal1();

      return;
    }
    if (step == 2) {
      clearModal2();
      return;
    }
  };

  const clearModal1 = () => {
    if (!mloader) {
      setisModal(false);
      setmodalChk(false);
      setmodalObj(false);
      setMessage('');
      setshowCal1(false);
      setselDatess({});
      setmarkedDatess({});
      setisSelDatee(false);
      setstep(1);

      setminDatee('');
      setmaxDatee('');
      setisDisableToday(false);
      setmonthh(new Date());
      setmodalHeight(0);
    }
  };

  const clearModal2 = () => {
    if (!mloader) {
      setstep(1);
      setmodalHeight(0);
    }
  };

  const renderModal = () => {
    let c = modalHeight >= maxModalHeight ? true : false;
    let style = c ? [styles.modal, {height: maxModalHeight}] : styles.modal2;

    if (modalChk == 'offer' && step == 1) {
      let item = modalObj.item;

      const renderHeader = () => {
        let text = 'Choose Trip Date';

        const renderCross = () => {
          return (
            <Pressable
              disabled={mloader}
              style={({pressed}) => [{opacity: pressed ? 0.7 : 1.0}]}
              onPress={closeModalAll}>
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
                    flexDirection: 'row',
                    justifyContent: 'space-between',
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
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }
            }>
            <View style={{width: '80%'}}>{renderTitle()}</View>
            {renderCross()}
          </View>
        );
      };

      const renderInfo = () => {
        let userName = item.user.first_name + ' ' + item.user.last_name;
        let duration = item.offering.duration.number;
        let t =
          duration <= 1
            ? item.offering.duration.title.substring(
                0,
                item.offering.duration.title.length - 1,
              )
            : item.offering.duration.title;
        duration = duration + ' ' + t;
        let photo = item.user.photo || '';
        let offer = item.offering.offer || '';

        const renderProfile = () => {
          return (
            <View style={styles.mmProfileImgContainer}>
              <ProgressiveFastImage
                style={styles.mmProfileImg}
                source={
                  photo != ''
                    ? {uri: photo}
                    : require('../../../assets/images/drawer/guest/img.png')
                }
                loadingImageStyle={styles.mmimageLoader}
                loadingSource={require('../../../assets/images/imgLoad/img.jpeg')}
                blurRadius={5}
              />
              {/* {isVeirfy && (
                <Image
                  style={styles.miconVerify}
                  source={require('../../assets/images/verified/img.png')}
                />
              )} */}
            </View>
          );
        };

        const renderText = () => {
          return (
            <View style={styles.mmtextContainer}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.mtextContainertitle}>
                {offer}
              </Text>

              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.textContainertitle2}>
                Duration: {duration}
              </Text>

              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.textContainertitle3}>
                Hosted by{' '}
                <Text
                  style={[
                    styles.textContainertitle3,
                    {textTransform: 'capitalize'},
                  ]}>
                  {userName}
                </Text>
              </Text>
            </View>
          );
        };

        return (
          <View
            style={{
              width: '100%',
              marginTop: 10,
              padding: 10,
              borderRadius: 8,
              borderColor: theme.color.fieldBorder,
              borderWidth: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            {renderProfile()}
            {renderText()}
          </View>
        );
      };

      const renderField = () => {
        let t = '';
        var myObject = selDatess;
        if (!isObjectEmpty(myObject)) {
          let esd = [];
          Object.keys(myObject).forEach(function (key, index) {
            esd.push(key);
          });
          // let arset = []; //for sort and set format
          // if (esd.length > 0) {
          //   esd.sort(function (a, b) {
          //     return Number(new Date(a)) - Number(new Date(b));
          //   });
          //   esd.map((e, i, a) => {
          //     arset.push(moment(e).format('MMM DD'));
          //   });
          // }
          // let arr = []; //for amse sequece date separate
          // if (arset.length > 0) {
          //   let arset2 = arset.slice();
          //   arset.map((e, i, a) => {
          //     let d = [];
          //     let chkd = e;
          //     let chki = i;
          //     d.push({d: chkd});
          //     delete arset[chki];
          //     let id = 0;
          //     for (let index = ++chki; index < arset2.length; index++) {
          //       const ee = arset2[index];
          //       if (chkd.slice(0, 3) == ee.slice(0, 3)) {
          //         let n1 = chkd.slice(4, 6);
          //         let n2 = ee.slice(4, 6);
          //         id++;
          //         if (Number(n1) + id == Number(n2)) {
          //           d.push({d: ee});
          //           delete arset[index];
          //         } else {
          //           break;
          //         }
          //       }
          //     }
          //     arr.push(d);
          //   });
          // }
          // if (arr.length > 0) {
          //   arr.map((e, i, a) => {
          //     let aa = e;
          //     if (aa.length > 1) {
          //       tt =
          //         tt +
          //         moment(aa[0].d).format('MMM D') +
          //         '-' +
          //         moment(aa[aa.length - 1].d)
          //           .format('MMM D')
          //           .slice(4, 6) +
          //         ', ';
          //     } else {
          //       tt = tt + moment(aa[0].d).format('MMM D') + ', ';
          //     }
          //   });
          // }
          // tt = tt.replace(/, *$/, '');
          // t = tt;
          let arset = []; //for sort and set format
          if (esd.length > 0) {
            esd.sort(function (a, b) {
              return Number(new Date(a)) - Number(new Date(b));
            });
            esd.map((e, i, a) => {
              arset.push(moment(e).format('MMM DD, YYYYY'));
            });
          }
          if (arset.length > 0) {
            let fd = arset[0];
            let sd = '';
            if (arset.length > 1) {
              sd = arset[arset.length - 1];
            }
            t = fd + ' - ' + sd;
          }
        } else {
          let duration = parseInt(item.offering.duration.number);
          t =
            duration <= 1
              ? 'Choose a trip date...'
              : 'Choose a trip date or date range';
        }

        return (
          <View style={styles.modalFieldConatiner}>
            <Text style={[styles.mfT1, {textTransform: 'none'}]}>
              Choose your preferred trip date
            </Text>

            <Pressable
              onPress={onClickCal}
              style={({pressed}) => [
                {opacity: pressed ? 0.8 : 1.0},
                styles.mFieldContainer,
              ]}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[
                  styles.mfT2,
                  {opacity: isObjectEmpty(selDatess) ? 0.4 : 1},
                ]}>
                {t == '' ? 'Choose a trip date...' : t}
              </Text>
              <View style={{width: '13%', alignItems: 'flex-end'}}>
                <Image
                  source={require('../../../assets/images/cal/img.png')}
                  style={styles.mfT2icon}
                />
              </View>
            </Pressable>
          </View>
        );
      };

      const renderBottom = () => {
        const renderButton1 = () => {
          return (
            <Pressable
              onPress={closeModal}
              style={({pressed}) => [
                {
                  opacity: pressed ? 0.9 : 1.0,
                  paddingHorizontal: 15,
                  paddingVertical: 8,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: theme.color.fieldBorder,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 10,
                },
              ]}>
              <Text
                style={{
                  fontSize: 12.5,
                  fontFamily: theme.fonts.fontBold,
                  color: '#30563A',
                }}>
                Cancel
              </Text>
            </Pressable>
          );
        };

        const renderButton2 = () => {
          let c = !isObjectEmpty(selDatess) ? false : true;

          const Continue = () => {
            setstep(2);
          };

          return (
            <Pressable
              disabled={c}
              onPress={Continue}
              style={({pressed}) => [
                {opacity: pressed ? 0.8 : c ? 0.5 : 1.0},
                styles.ButtonContainer,
                {backgroundColor: theme.color.button1},
              ]}>
              <Text
                style={[styles.ButtonText, {color: theme.color.buttonText}]}>
                Review Trade
              </Text>
            </Pressable>
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
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                  }
                : {
                    marginTop: 30,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                  }
            }>
            <View
              style={{
                width: '30%',
              }}>
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: theme.fonts.fontNormal,
                  color: theme.color.subTitleLight,
                  paddingLeft: 10,
                }}>
                Step {step} of 2
              </Text>
            </View>

            <View
              style={{
                width: '65%',

                alignItems: 'flex-end',
              }}>
              <View
                style={
                  c
                    ? styles.mmodalBottomContainer
                    : styles.mmodalBottomContainer2
                }>
                {renderButton1()}
                {renderButton2()}
              </View>
            </View>
          </View>
        );
      };

      return (
        <Modal visible={isModal} transparent onRequestClose={closeModal}>
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
                      {renderInfo()}
                      {renderField()}
                    </ScrollView>
                    {renderBottom()}
                  </>
                )}

                {!c && (
                  <>
                    {renderHeader()}

                    {renderInfo()}
                    {renderField()}
                    {renderBottom()}
                  </>
                )}
              </View>
            </View>
          </SafeAreaView>
        </Modal>
      );
    }

    //review trip
    if (modalChk == 'offer' && step == 2) {
      let item = modalObj.item;

      const renderHeader = () => {
        let text = 'Review Trade';

        const renderCross = () => {
          return (
            <Pressable
              disabled={mloader}
              style={({pressed}) => [{opacity: pressed ? 0.7 : 1.0}]}
              onPress={closeModalAll}>
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
                    flexDirection: 'row',
                    justifyContent: 'space-between',
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
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }
            }>
            <View style={{width: '80%'}}>{renderTitle()}</View>
            {renderCross()}
          </View>
        );
      };

      const renderFields = () => {
        let user = item.user;
        let ofer = item.offering;
        let trade = item.fortrade;
        let offernote = item.offerNote || '';
        let create = item.createdAt || '';

        let photo = user.photo && user.photo != '' ? {uri: user.photo} : guest;

        let photo2 = {
          uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHw%3D&w=1000&q=80',
        };
        let userName = user.userName || '';
        let avgRating = parseInt(user.avg_rating);
        let totalReviews = parseInt(user.total_reviews);

        let title = ofer.offer;
        let dur = ofer.durt;
        let avlbl = ofer.avt;
        let loc = ofer.location.name ? ofer.location.name : '';

        let titlet = trade.offer;
        let durt = trade.durt;
        let avlblt = trade.avt;
        let loct = trade.location.name ? trade.location.name : '';

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
          marginTop: 2,
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
          <View style={{width: '97%', marginTop: 20, alignSelf: 'center'}}>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View style={{width: '40%'}}>
                <View style={styles.mProfileImgContainerr}>
                  <ProgressiveFastImage
                    style={styles.mProfileImgr}
                    source={photo}
                    loadingImageStyle={styles.mimageLoader}
                    loadingSource={require('../../../assets/images/imgLoad/img.jpeg')}
                    blurRadius={5}
                  />
                </View>

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
                  top: 86,
                  resizeMode: 'contain',
                }}
                source={trnfericon}
              />

              <View style={{width: '40%'}}>
                <View style={styles.mProfileImgContainerr}>
                  <ProgressiveFastImage
                    style={styles.mProfileImgr}
                    source={photo2}
                    loadingImageStyle={styles.mimageLoader}
                    loadingSource={require('../../../assets/images/imgLoad/img.jpeg')}
                    blurRadius={5}
                  />
                </View>

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

            <Pressable
              onPress={closeModal}
              style={({pressed}) => [
                {opacity: pressed ? 0.8 : 1.0},
                {
                  marginTop: 25,
                },
              ]}>
              <Text
                style={{
                  color: '#3C6B49',
                  fontSize: 11,
                  fontFamily: theme.fonts.fontBold,
                  textDecorationLine: 'underline',
                }}>
                Edit Trip Date
              </Text>
            </Pressable>
          </View>
        );
      };

      const renderBottom = () => {
        const renderButton1 = () => {
          return (
            <Pressable
              disabled={mloader}
              onPress={closeModalAll}
              style={({pressed}) => [
                {
                  opacity: pressed ? 0.9 : 1.0,
                  paddingHorizontal: 10,
                  paddingVertical: 10,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: theme.color.fieldBorder,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 10,
                },
              ]}>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: theme.fonts.fontBold,
                  color: '#30563A',
                }}>
                Cancel
              </Text>
            </Pressable>
          );
        };

        const renderButton2 = () => {
          return (
            <Pressable
              disabled={mloader}
              onPress={ConfirmSend}
              style={({pressed}) => [
                {opacity: pressed ? 0.8 : 1.0},
                styles.ButtonContainer,
                {
                  backgroundColor: theme.color.button1,
                  paddingHorizontal: !mloader ? 10 : 15,
                },
              ]}>
              {!mloader && (
                <Text
                  style={[
                    styles.ButtonText,
                    {
                      color: theme.color.buttonText,
                      fontSize: 12,
                      textTransform: 'none',
                    },
                  ]}>
                  Confirm and Accept
                </Text>
              )}
              {mloader && (
                <ActivityIndicator size={18} color={theme.color.buttonText} />
              )}
            </Pressable>
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
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                  }
                : {
                    marginTop: 35,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                  }
            }>
            <View
              style={{
                width: '30%',
              }}>
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: theme.fonts.fontNormal,
                  color: theme.color.subTitleLight,
                  paddingLeft: 10,
                }}>
                Step {step} of 2
              </Text>
            </View>

            <View
              style={{
                width: '65%',

                alignItems: 'flex-end',
              }}>
              <View
                style={
                  c
                    ? [styles.mmodalBottomContainer, {paddingTop: 15}]
                    : styles.mmodalBottomContainer2
                }>
                {renderButton1()}
                {renderButton2()}
              </View>
            </View>
          </View>
        );
      };

      return (
        <Modal visible={isModal} transparent onRequestClose={closeModal}>
          <SafeAreaView style={styles.modalContainer}>
            <View style={[styles.modalContainer2, {margin: 12}]}>
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
                      {renderFields()}
                    </ScrollView>
                    {renderBottom()}
                  </>
                )}

                {!c && (
                  <>
                    {renderHeader()}
                    {renderFields()}
                    {renderBottom()}
                  </>
                )}
              </View>
            </View>
          </SafeAreaView>
        </Modal>
      );
    }

    //message
    if (modalChk == 'message') {
      const renderHeader = () => {
        let text = 'Message User';

        const renderCross = () => {
          return (
            <Pressable
              disabled={mloader}
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
        let item = modalObj.item;
        let photo = item.user.photo || '';
        let isVeirfy = item.user.isVerified || false;
        let userName = item.user.first_name + ' ' + item.user.last_name;

        const renderProfile = () => {
          return (
            <View style={styles.mProfileImgContainerm}>
              <ProgressiveFastImage
                style={styles.mProfileImgm}
                source={
                  photo != ''
                    ? {uri: photo}
                    : require('../../../assets/images/drawer/guest/img.png')
                }
                loadingImageStyle={styles.mimageLoaderm}
                loadingSource={require('../../../assets/images/imgLoad/img.jpeg')}
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
              disabled={mloader == true ? true : message == '' ? true : false}
              style={({pressed}) => [
                {opacity: pressed ? 0.9 : message == '' ? 0.5 : 1},
                styles.ButtonContainer,
                {backgroundColor: theme.color.button1, width: '100%'},
              ]}>
              {!mloader && (
                <Text
                  style={[
                    styles.ButtonText,
                    {color: theme.color.buttonText, fontSize: 13},
                  ]}>
                  Send Message
                </Text>
              )}
              {mloader && (
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

  const renderCalender1 = () => {
    let item = modalObj.item;
    let duration = item.offering.duration.number;
    let durationTitle = item.offering.duration.title;
    let unavailable_days = item.offering.unavailable.all_unavailable_dates;
    let mdt = item.offering.availablity.startDate;
    let cdt = moment().format('YYYY-MM-DD');
    let mind = '';
    if (mdt < cdt) {
      mind = moment(cdt).format('YYYY-MM-DD');
    } else {
      mind = moment(mdt).format('YYYY-MM-DD');
    }
    let mxd = item.offering.availablity.endDate;
    let md = {};
    if (unavailable_days.length > 0) {
      unavailable_days.map((e, i, a) => {
        md[e] = {
          marked: false,
          selected: true,
          customStyles: cssf,
          // selectedColor: 'red',
          disabled: true,
          disableTouchEvent: true,
        };
      });
    }

    const closeCalModal = () => {
      setmarkedDatess(selDatess);
      setshowCal1(false);
      const size = Object.keys(selDatess).length;
      const dt = Object.keys(selDatess);
      if (size > 0) {
        if (size < 2 && size > 0) {
          //for duration ==1
          setminDatee(dt[0]);
          setmaxDatee(dt[0]);
        } else if (size > 1) {
          //for duration  > 1
          setminDatee(dt[0]);
          setmaxDatee(dt[size - 1]);
        }
      } else {
        setminDatee('');
        setmaxDatee('');
      }
    };
    const ApplyCalModal = () => {
      setmarkedDatess(markedDatess);
      setselDatess(markedDatess);
      setshowCal1(false);
      const size = Object.keys(markedDatess).length;
      const dt = Object.keys(markedDatess);
      if (size > 0) {
        // if (size == totaldays) {
        if (size < 2 && size > 0) {
          //for duration ==1
          setminDatee(dt[0]);
          setmaxDatee(dt[0]);
        } else if (size > 1) {
          //for duration  > 1
          setminDatee(dt[0]);
          setmaxDatee(dt[size - 1]);
        }
        // }
      } else {
        setminDatee('');
        setmaxDatee('');
      }
    };

    const formatDate = date => {
      var dd = moment(date).format('MMMM YYYY');
      return dd;
    };

    const getSelectedDayEvents = date => {
      let cs = {
        container: {
          backgroundColor: theme.color.button1,
        },
        text: {
          color: theme.color.buttonText,
          fontFamily: theme.fonts.fontMedium,
          top: 2,
        },
      };
      let totaldays = 0;
      let t = durationTitle;
      if (t == 'days') {
        totaldays = duration;
        td = duration;
      } else if (t == 'weeks') {
        totaldays = duration * 7;
        td = duration * 7;
      } else if (t == 'months') {
        totaldays = duration * 30;
        td = duration * 30;
      } else if (t == 'years') {
        totaldays = duration * 365;
        td = duration * 365;
      }
      if (isObjectEmpty(markedDatess)) {
        let markedDates = {};
        markedDates[date] = {
          customStyles: cs,
          marked: false,
          selected: true,
          selectedColor: theme.color.button1,
          disabled: false,
          disableTouchEvent: false,
        };
        setmarkedDatess(markedDates);
        if (totaldays <= 1) {
          setminDatee(date);
          setmaxDatee(date);
          // setisDisableToday(true);
        } else {
          let mindate = mind;
          let maxdate = mxd;
          let ua = unavailable_days.slice();
          let sdu = date;
          let ar = [];
          ar.push(sdu);
          for (let index = 1; index < totaldays; index++) {
            sdu = moment(moment(new Date(sdu)).add(1, 'day')).format(
              'YYYY-MM-DD',
            );
            if (sdu > maxdate) {
              break;
            }
            let ind = 0;
            if (ua.length > 0) {
              ind = ua.findIndex(x => x === sdu);
            }
            if (ind < 0) {
              ar.push(sdu);
            } else {
              totaldays++;
            }
          }
          if (ar.length > 0) {
            let mindd = ar[0];
            let mxxd = ar[ar.length - 1];
            setminDatee(mindd);
            setmaxDatee(mxxd);
            // setisDisableToday(true);
          }
          return;
        }
      } else {
        let md = {...markedDatess};
        let o = md[date];
        if (o !== undefined) {
          console.warn('The key exists.');
          delete md[date];
          setmarkedDatess(md);
          const size = Object.keys(md).length;
          if (size < totaldays) {
            if (size == 0) {
              setminDatee('');
              setmaxDatee('');
            } else {
              // if (date == moment().format('YYYY-MM-DD')) {
              // setisDisableToday(false);
              // }
            }
          }
          return;
        } else {
          console.warn('The key does not exist.');
          let md = {...markedDatess};
          md[date] = {
            marked: false,
            selected: true,
            customStyles: cs,
            selectedColor: theme.color.button1,
            disabled: false,
            disableTouchEvent: false,
          };
          setmarkedDatess(md);
          return;
        }
      }
    };

    const renderBottom = () => {
      let c = isSelDatee ? false : true;
      let item = modalObj.item;
      let duration = item.offering.duration.number;
      let t =
        duration < 1
          ? item.offering.duration.title.substring(
              0,
              item.offering.duration.title.length - 1,
            )
          : item.offering.duration.title;
      duration = duration + ' ' + t;
      return (
        <View
          style={{
            marginTop: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: '40%',
              paddingLeft: 10,
            }}>
            <Text
              style={{
                fontSize: 11,
                fontFamily: theme.fonts.fontNormal,
                color: theme.color.subTitleLight,
              }}>
              Duration : {duration}
            </Text>
          </View>

          <View
            style={{
              width: '55%',
              paddingRight: 10,
              alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: 'row',
            }}>
            <Pressable
              onPress={closeCalModal}
              style={({pressed}) => [
                {
                  opacity: pressed ? 0.9 : 1.0,
                  paddingHorizontal: 15,
                  paddingVertical: 8,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: theme.color.fieldBorder,
                  alignItems: 'center',
                  justifyContent: 'center',
                },
              ]}>
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: theme.fonts.fontBold,
                  color: '#30563A',
                }}>
                Cancel
              </Text>
            </Pressable>

            <Pressable
              onPress={ApplyCalModal}
              disabled={!isSelDatee ? true : false}
              style={({pressed}) => [
                {
                  opacity: pressed ? 0.9 : c ? 0.5 : 1.0,
                  paddingHorizontal: 15,
                  paddingVertical: 8,
                  borderRadius: 8,
                  backgroundColor: theme.color.button1,
                  alignItems: 'center',
                  justifyContent: 'center',
                },
              ]}>
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: theme.fonts.fontBold,
                  color: theme.color.buttonText,
                }}>
                Apply
              </Text>
            </Pressable>
          </View>
        </View>
      );
    };

    let cusTheme = {
      textDisabledColor: theme.color.subTitleLight,
      dayTextColor: theme.color.title,
      textDayFontSize: 13,
      textDayFontFamily: theme.fonts.fontMedium,
      textDayHeaderFontSize: 13,
      textSectionTitleColor: theme.color.title,
      textDayHeaderFontFamily: theme.fonts.fontMedium,
    };
    let todaymark = isDisableToday ? dtd : td;
    return (
      <Modal visible={showCal1} transparent onRequestClose={closeCalModal}>
        <SafeAreaView
          style={[
            {
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20,
              backgroundColor: 'rgba(0,0,0,0.5)',
            },
          ]}>
          <View
            style={{
              width: '100%',
              alignSelf: 'center',
              paddingBottom: 20,
              backgroundColor: theme.color.background,
              borderRadius: 10,
              paddingTop: 5,
              paddingHorizontal: 5,
            }}>
            <Calendar
              theme={cusTheme}
              hideDayNames={false}
              hideArrows={false}
              hideExtraDays={false}
              disableMonthChange={true}
              initialDate={minDatee != '' ? minDatee : mind}
              minDate={minDatee != '' ? minDatee : mind}
              maxDate={maxDatee != '' ? maxDatee : mxd}
              onDayPress={day => {
                getSelectedDayEvents(day.dateString);
              }}
              onDayLongPress={day => {
                console.log('selected long press day', day);
              }}
              monthFormat={'yyyy MM'}
              onMonthChange={month => {
                setmonthh(new Date(month.dateString));
              }}
              firstDay={7}
              onPressArrowLeft={subtractMonth => subtractMonth()}
              onPressArrowRight={addMonth => addMonth()}
              renderHeader={date => {
                return (
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: theme.fonts.fontBold,
                      color: '#111111',
                    }}>
                    {formatDate(monthh)}
                  </Text>
                );
              }}
              enableSwipeMonths={true}
              disableAllTouchEventsForDisabledDays={true}
              markingType="custom"
              markedDates={{...todaymark, ...md, ...markedDatess}}
            />
            {renderBottom()}
          </View>
        </SafeAreaView>
      </Modal>
    );
  };

  const renderShowOfferSendModal = () => {
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
              let mp = store.User.offersProfileProps;
              if (mp) {
                mp.navigation.navigate('ConfirmedTrips');
              }
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
              Go to Confirmed Trips
            </Text>
          </TouchableOpacity>
        </>
      );
    };

    const closeModal = () => {
      setisOfferSend(false);
    };

    let fn = sendObj.first_name;
    let ln = sendObj.last_name;
    let sendOfferUsername = fn + ' ' + ln;

    let src = require('../../../assets/images/offerSentDone/img.png');
    return (
      <Modal
        animationType="slide"
        visible={isOfferSend}
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
                marginTop: 20,
                width: '100%',
              }}>
              <Image
                style={{width: 150, height: 142, resizeMode: 'contain'}}
                source={src}
              />
              <Text
                style={{
                  marginTop: 15,
                  fontFamily: theme.fonts.fontNormal,
                  fontSize: 15,
                  color: '#101B10',
                }}>
                You accepted an offer from
              </Text>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  fontFamily: theme.fonts.fontBold,
                  fontSize: 21,
                  color: '#101B10',
                  textTransform: 'capitalize',
                }}>
                {sendOfferUsername}
              </Text>
            </View>

            {renderButton1()}
            {renderButton2()}
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <>
      <View style={styles.container}>
        {/* <utils.DrawerHeader props={props} headerTitle={headerTitle} /> */}
        {!internet && <utils.InternetMessage />}
        <SafeAreaView style={styles.container2}>
          <View style={styles.container3}>
            <FlatList
              style={{marginTop: 5}}
              contentContainerStyle={{
                paddingTop: 5,
                paddingBottom: 40,
                paddingHorizontal: 2,
              }}
              showsVerticalScrollIndicator={false}
              data={data}
              renderItem={ItemView}
              keyExtractor={(item, index) => index.toString()}
              ListEmptyComponent={EmptyListMessage}
              ItemSeparatorComponent={ItemSeparatorView}
              ListHeaderComponent={ListHeader}
              // ListFooterComponent={ListFooter}
            />
          </View>

          {/* <utils.Footer
            nav={props.navigation}
            screen={headerTitle}
            focusScreen={store.General.focusScreen}
          /> */}
          {showCal1 && renderCalender1()}
          {isModal && !isSendMessage && renderModal()}
          {isOfferSend && renderShowOfferSendModal()}
          {isSendMessage && renderMessageSendModal()}
        </SafeAreaView>
      </View>
    </>
  );
}
