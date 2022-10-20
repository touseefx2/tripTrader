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

export default observer(Sent);

function Sent(props) {
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

  let data = store.Trips.sendOffers;

  const [modalObj, setmodalObj] = useState(false);
  const [modalChk, setmodalChk] = useState(false);
  const [isModal, setisModal] = useState(false);

  const [isSendMessage, setisSendMessage] = useState(false);
  const [sendObj, setsendObj] = useState('');

  let mloader = store.Trips.confirmTripsSendMessageLoader;

  const [message, setMessage] = useState('');

  const closeModal = () => {
    setisModal(false);
    setmodalObj(false);
    setmodalChk(false);
    setmodalHeight(0);
    setMessage('');
  };

  useEffect(() => {
    const dt = [
      {
        user: {
          userName: 'John Thompson',
          first_name: 'Jhon',
          last_name: 'Thompson',
          avg_rating: 3.8,
          total_reviews: 190,
          photo: store.User.user.photo,
        },
        offering: {
          offer: 'Whitetail Hunting in Central NC',
          duration: '3 days',
          availablity: 'Jul 22-25, 2022',
          location: {
            coords: [],
            name: 'Dylan, NC',
          },
        },
        fortrade: {
          offer: 'Osceola Turkey Hunting',
          duration: '3 days',
          availablity: 'Oct 8-11, 2022',
          location: {
            coords: [],
            name: 'Boise, ID',
          },
        },
        offerNote: '',
        createdAt: '2 days ago',
      },
    ];

    store.Trips.setsendOffers(dt);

    return () => {};
  }, []);

  const onclickSearchBar = () => {};

  const setIsSendMessage = v => {
    setsendObj(modalObj.item.user);
    closeModal();
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
          <Text style={styles.resultText}>You sent {length} offer</Text>
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
    let dur = ofer.duration;
    let avlbl = ofer.availablity;
    let loc = ofer.location.name ? ofer.location.name : '';

    let titlet = trade.offer;
    let durt = trade.duration;
    let avlblt = trade.availablity;
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

    // const renderBottom = () => {
    //   let bc = {
    //     width: '46%',
    //     alignItems: 'center',
    //     justifyContent: 'center',
    //     borderRadius: 5,
    //     height: 46,
    //     borderWidth: 1,
    //     borderColor: theme.color.fieldBorder,
    //   };

    //   let btS = {
    //     color: '#3C6B49',
    //     fontSize: 15,
    //     fontFamily: theme.fonts.fontBold,
    //   };

    //   return (
    //     <View
    //       style={{
    //         width: '100%',
    //         marginTop: 20,
    //         alignSelf: 'center',
    //         flexDirection: 'row',
    //         alignItems: 'center',
    //         justifyContent: 'space-between',
    //       }}>
    //       <Pressable
    //         style={({pressed}) => [{opacity: pressed ? 0.8 : 1}, bc]}
    //         onPress={() => {
    //           setmodalObj({item: item, i: index});
    //           setmodalChk('message');
    //           setisModal(true);
    //         }}>
    //         <Text numberOfLines={1} ellipsizeMode="tail" style={btS}>
    //           Message
    //         </Text>
    //       </Pressable>

    //       <Pressable
    //         onPress={() => {
    //           store.User.clearOtherUser();
    //           store.User.setfscreen('confirmedtrips');
    //           store.User.setvUser(item.user);

    //           props.navigation.navigate('UserProfile');
    //         }}
    //         style={({pressed}) => [{opacity: pressed ? 0.8 : 1}, bc]}>
    //         <Text numberOfLines={1} ellipsizeMode="tail" style={btS}>
    //           View Profile
    //         </Text>
    //       </Pressable>
    //     </View>
    //   );
    // };

    const renderBottom = () => {
      let bc = {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        height: 48,
        backgroundColor: '#F8ECEC',
        // borderWidth: 1,
        // borderColor: theme.color.fieldBorder,
      };

      let btS = {
        color: '#B93B3B',
        fontSize: 14,
        fontFamily: theme.fonts.fontBold,
      };

      return (
        <View
          style={{
            width: '100%',
            marginTop: 30,
          }}>
          <Pressable
            disabled={mloader}
            onPress={() => {
              setmodalObj({item: item, i: index});
              setmodalChk('cancelOffer');
              setisModal(true);
            }}
            style={({pressed}) => [{opacity: pressed ? 0.8 : 1}, bc]}>
            <Text numberOfLines={1} ellipsizeMode="tail" style={btS}>
              Cancel Offer
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

  const renderModal = () => {
    let c = modalHeight >= maxModalHeight ? true : false;
    let style = c ? [styles.modal, {height: maxModalHeight}] : styles.modal2;
    let item = modalObj.item;

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
              onPress={closeModal}>
              <utils.vectorIcon.EvilIcons
                name="close"
                color={theme.color.title}
                size={30}
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
        <Modal visible={isModal} transparent onRequestClose={closeModal}>
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

    if (modalChk == 'cancelOffer') {
      const renderHeader = () => {
        let text = 'Cancel Offer?';

        const renderCross = () => {
          return (
            <Pressable
              disabled={mloader}
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

      const renderInfo = () => {
        let userName = item.user.first_name + ' ' + item.user.last_name;
        let photo = item.user.photo || '';

        const renderProfile = () => {
          return (
            <View style={styles.mProfileImgContainer}>
              <ProgressiveFastImage
                style={styles.mProfileImg}
                source={
                  photo != ''
                    ? {uri: photo}
                    : require('../../../assets/images/drawer/guest/img.png')
                }
                loadingImageStyle={styles.mimageLoader}
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
            <View style={styles.mtextContainer}>
              <Text
                style={{
                  color: theme.color.subTitleLight,
                  fontSize: 12,
                  fontFamily: theme.fonts.fontBold,
                  textTransform: 'capitalize',
                }}>
                Member
              </Text>

              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  color: '#081A24',
                  fontSize: 15,
                  fontFamily: theme.fonts.fontBold,
                  lineHeight: 23,
                  textTransform: 'capitalize',
                }}>
                {userName}
              </Text>
            </View>
          );
        };

        return (
          <View style={styles.modalinfoConatiner}>
            {renderProfile()}
            {renderText()}
          </View>
        );
      };

      const renderField = () => {
        let duration = parseInt(item.duration.number) || '';
        let dtitile = item.duration.title;
        let dt = '';

        if (duration <= 1) {
          duration = 'Whole';
          dtitile = dtitile.substring(0, dtitile.length - 1);
        }
        dt = duration + ' ' + dtitile;
        let offer = item.offer || '';
        let trade = item.return || '';
        return (
          <>
            <View style={{paddingLeft: 10, paddingRight: 20}}>
              <View style={styles.field}>
                <Text style={styles.filedTitle}>Offering</Text>
                <Text style={[styles.filedTitle2, {color: theme.color.title}]}>
                  <Text
                    style={[
                      styles.filedTitle2,
                      {
                        color: theme.color.title,
                        textTransform: 'capitalize',
                      },
                    ]}>
                    {dt}
                  </Text>{' '}
                  {offer}
                </Text>
              </View>

              <View style={styles.field}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles.filedTitle}>
                  for trade
                </Text>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={[styles.filedTitle2, {color: theme.color.title}]}>
                  {trade}
                </Text>
              </View>
            </View>
          </>
        );
      };

      const renderBottom = () => {
        const renderButton1 = () => {
          return (
            <>
              <TouchableOpacity
                disabled={mloader}
                onPress={
                  () => {
                    closeModal();
                  }
                  // deleteTrip(item, modalObj.i)
                }
                activeOpacity={0.7}
                style={{
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#B93B3B',
                  height: 50,
                  borderRadius: 10,
                  alignSelf: 'center',
                }}>
                {!mloader && (
                  <Text
                    style={{
                      color: theme.color.buttonText,
                      fontSize: 16,
                      fontFamily: theme.fonts.fontBold,
                      textTransform: 'none',
                    }}>
                    Yes, cancel offer
                  </Text>
                )}
                {mloader && (
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
                disabled={mloader}
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
                  No, keep it
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
                : {marginTop: 40}
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
                    {/* {renderInfo()}
                    {renderField()} */}
                    {renderBottom()}
                  </>
                )}
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

          {isModal && !isSendMessage && renderModal()}
          {isSendMessage && renderMessageSendModal()}
        </SafeAreaView>
      </View>
    </>
  );
}
