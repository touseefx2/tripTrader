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

  let guest = require('../../../assets/images/drawer/guest/img.png');
  let trnfericon = require('../../../assets/images/transfer/img.png');
  let durtnicon = require('../../../assets/images/confirmTrip/duration/img.png');
  let avlblicon = require('../../../assets/images/confirmTrip/available/img.png');
  let locationicon = require('../../../assets/images/confirmTrip/location/img.png');

  let internet = store.General.isInternet;

  const [modalObj, setmodalObj] = useState(false);
  const [modalChk, setmodalChk] = useState(false);
  const [isModal, setisModal] = useState(false);

  let data = store.Offers.sentOffers;
  let mloader = store.Offers.Loader;
  let mmloader = store.Offers.mLoader;

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
        store.Offers.attemptToGetSentOffers(setGetDataOnce, setrefeshing);
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

  const closeModal = () => {
    if (!mmloader) {
      setisModal(false);
      setmodalObj(false);
      setmodalChk(false);
      setmodalHeight(0);
    }
  };

  const cancelOffer = () => {
    Keyboard.dismiss();

    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        store.Offers.attemptToCancelOffer(modalObj, closeModal);
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
      <>
        {!mloader && getDataOnce && (
          <Text
            style={{
              marginTop: '80%',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              fontSize: 13,
              color: theme.color.subTitleLight,
              fontFamily: theme.fonts.fontMedium,
            }}>
            You have no pending sent offers
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
      let length = data.length;
      return (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>
            You sent {length} {length <= 1 ? 'offer' : 'offers'}
          </Text>
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
    let user = item.offeredTo;
    let ofer = item.hostTrip;
    let trade = item.offeredTrip;
    let offernote = item.note || '';
    let create = CheckDate(item.createdAt);

    //user info
    let photo = user.image && user.image != '' ? {uri: user.image} : guest;
    let userName = user.firstName + ' ' + user.lastName || '';
    let avgRating = user.rating || 0;
    let totalReviews = user.reviews || 0;

    //offer by (host trip)
    let title = ofer.species;
    let dur = ofer.duration.value;
    let t =
      dur <= 1
        ? ofer.duration.title.substring(0, ofer.duration.title.length - 1)
        : ofer.duration.title;
    dur = dur + ' ' + t;
    let avlbl = FormatAvlblDate(ofer.availableFrom, ofer.availableTo);
    let loc = ofer.location.city + ', ' + ofer.location.state;

    //ofer to (offer trip)
    let titlet = trade.species;
    let durt = trade.duration.value;
    let tt =
      durt <= 1
        ? trade.duration.title.substring(0, trade.duration.title.length - 1)
        : trade.duration.title;
    durt = durt + ' ' + tt;
    let preferdates = item.preferredDates;
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
              {avgRating > 0 ? avgRating.toFixed(1) : avgRating}
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
              <Text style={titleS}>YOU OFFERED</Text>
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
              <Text style={offertitleS}>{offernote}</Text>
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

  const renderModal = () => {
    let c = modalHeight >= maxModalHeight ? true : false;
    let style = c ? [styles.modal, {height: maxModalHeight}] : styles.modal2;
    let item = modalObj.item;

    if (modalChk == 'cancelOffer') {
      const renderHeader = () => {
        let text = 'Cancel Offer?';

        const renderCross = () => {
          return (
            <Pressable
              disabled={mmloader}
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
        return (
          <View style={{width: '100%', marginTop: 12}}>
            <Text
              style={{
                fontSize: 17,
                color: theme.color.title,
                fontFamily: theme.fonts.fontNormal,
                textAlign: 'center',
              }}>
              Are you sure you would like to cancel your offer?
            </Text>
          </View>
        );
      };

      const renderBottom = () => {
        const renderButton1 = () => {
          return (
            <>
              <TouchableOpacity
                disabled={mmloader}
                onPress={cancelOffer}
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
                {!mmloader && (
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
                {mmloader && (
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
                disabled={mmloader}
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
                      {/* {renderField()} */}
                    </ScrollView>
                    {renderBottom()}
                  </>
                )}

                {!c && (
                  <>
                    {renderHeader()}
                    {renderInfo()}
                    {/*    {renderField()} */}
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
        {/* {!internet && <utils.InternetMessage />} */}
        <SafeAreaView style={styles.container2}>
          <View style={styles.container3}>
            <FlatList
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
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
              ListHeaderComponent={data.length > 0 ? ListHeader : null}
              // ListFooterComponent={data.length > 0 ? ListFooter : null}
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

          {/* <utils.Footer
            nav={props.navigation}
            screen={headerTitle}
            focusScreen={store.General.focusScreen}
          /> */}

          {isModal && renderModal()}
        </SafeAreaView>
      </View>
    </>
  );
}
