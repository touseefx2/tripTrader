import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Pressable,
  TextInput,
  FlatList,
  RefreshControl,
} from 'react-native';
import ProgressiveFastImage from '@freakycoder/react-native-progressive-fast-image';
import {styles} from './styles';
import {observer} from 'mobx-react';
import store from '../../store/index';
import utils from '../../utils/index';
import theme from '../../theme';
import NetInfo from '@react-native-community/netinfo';
import {ActivityIndicator} from 'react-native-paper';
import moment from 'moment';

export default observer(ConfirmTrips);

function ConfirmTrips(props) {
  const headerTitle = 'Confirmed Trips';
  const guest = require('../../assets/images/drawer/guest/img.png');
  const trnfericon = require('../../assets/images/transfer/img.png');
  const durtnicon = require('../../assets/images/confirmTrip/duration/img.png');
  const avlblicon = require('../../assets/images/confirmTrip/available/img.png');
  const locationicon = require('../../assets/images/confirmTrip/location/img.png');

  const {isInternet} = store.General;

  const [isMessageModal, setIsMessageModal] = useState(false);
  const [isSuccessModal, setIsSuccessModal] = useState(false);
  const [successModalObj, setSuccessModalObj] = useState(null);
  const [successCheck, setSuccessCheck] = useState('');

  const [modalObj, setModalObj] = useState(false);

  const data = store.Offers.cnfrmOffers;
  const mloader = store.Offers.Loader3;
  const {homeModalLoder} = store.User; //msg loader

  const [getDataOnce, setgetDataOnce] = useState(false);
  const setGetDataOnce = C => {
    setgetDataOnce(C);
  };
  const [refreshing, setRefreshing] = React.useState(false);
  const setrefeshing = c => {
    setRefreshing(c);
  };
  const onRefresh = React.useCallback(() => {
    console.log('onrefresh cal');
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
    if (!getDataOnce && isInternet) {
      getDbData();
    }
    return () => {};
  }, [getDataOnce, isInternet]);

  const onclickSearchBar = () => {};

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
            No confirmed trips found
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
    //confirm trip box
    const isUsers = item.offeredBy && item.offeredTo; //user data show

    if (isUsers) {
      let isMyTrip = false;
      if (store.User.user._id == item.offeredTo._id) isMyTrip = true;

      const user = isMyTrip ? item.offeredBy : item.offeredTo; //user data show

      const ofer = isMyTrip ? item.hostTrip : item.offeredTrip; //offering
      const trade = isMyTrip ? item.offeredTrip : item.hostTrip; //for trade
      const offernote = item.note || '';
      const create = CheckDate(item.updatedAt);

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
                openModal({item: item, selIndex: index}, 'message');
              }}>
              <Text numberOfLines={1} ellipsizeMode="tail" style={btS}>
                Message
              </Text>
            </Pressable>

            <Pressable
              onPress={() => {
                let u = user;
                if (store.User.user == 'guest') {
                  return;
                }

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
    }
  };

  const openModal = (obj, check) => {
    setModalObj(obj);
    if (check == 'message') setIsMessageModal(true);
  };

  return (
    <>
      <View style={styles.container}>
        <utils.DrawerHeader props={props} headerTitle={headerTitle} />
        {!isInternet && <utils.InternetMessage />}
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

          {isMessageModal && (
            <utils.MessageModal
              isModal={isMessageModal}
              setIsModal={setIsMessageModal}
              modalObj={modalObj}
              setModalObj={setModalObj}
              loader={homeModalLoder}
              setIsSuccessModal={setIsSuccessModal}
              setSuccessModalObj={setSuccessModalObj}
              setSuccessCheck={setSuccessCheck}
            />
          )}

          {isSuccessModal && (
            <utils.SuccessModal
              isModal={isSuccessModal}
              setIsModal={setIsSuccessModal}
              modalObj={successModalObj}
              setModalObj={setSuccessModalObj}
              check={successCheck}
              setCheck={setSuccessCheck}
              props={props}
            />
          )}

          {store.Notifications.isShowNotifcation && <utils.ShowNotifications />}
        </SafeAreaView>
      </View>
    </>
  );
}
