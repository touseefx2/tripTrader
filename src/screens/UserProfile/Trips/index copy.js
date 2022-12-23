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
  Modal,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Pressable,
} from 'react-native';
import {styles} from './styles';
import {observer} from 'mobx-react';
import store from '../../../store';
import NetInfo from '@react-native-community/netinfo';
import theme from '../../../theme';
import utils from '../../../utils/index';
import moment from 'moment';
import Accordion from 'react-native-collapsible/Accordion';
import Card1 from './Card1';
import Card2 from './Card2';
import Card3 from './Card3';

export default observer(Trips);

function ItemSeparatorView() {
  return (
    <View
      style={{
        height: 15,
      }}
    />
  );
}

function Trips(props) {
  let headerTitle = 'Trips';
  const scrollRef2 = useRef(null);
  let limit = 10;

  let internet = store.General.isInternet;
  // let user = store.Userv.user;
  // let data = store.Userv.trips;
  // let loader = store.Userv.tripsLoader;

  let u = store.Userv.user;

  let userName = '';
  const [user, setuser] = useState(u);
  if (user) {
    userName = user.firstName + ' ' + user.lastName;
  }
  const [data, setdata] = useState([]);
  const [loader, setloader] = useState(false);

  const totalData = data.length;

  let mloader = store.Userv.mLoader;

  const [activeSections, setactiveSections] = useState([-1]);
  const [showpic, setshowpic] = useState(true);
  let animtntime = 1000;
  useEffect(() => {
    if (activeSections[0] > -1) {
      setTimeout(() => {
        setshowpic(false);
      }, animtntime);
    }
  }, [activeSections]);
  const updateSections = activeSections => {
    setactiveSections(activeSections);
    setshowpic(true);
  };

  const [pvm, setpvm] = useState(false);
  const [pv, setpv] = useState('');
  const [si, setsi] = useState('');

  const [deletePObj, setdeletePObj] = useState(false);
  const [deleteModal, setdeleteModal] = useState(false);

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

  const getDbData = c => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        store.Userv.attemptToGetTrips(
          user._id,
          setGetDataOnce,
          setrefeshing,
          c => setdata(c),
          c => setloader(c),
        );
      } else {
        setrefeshing(false);
      }
    });
  };

  const gotoEditTrip = (item, index) => {
    store.Userv.seteditTrip(true);
    store.Userv.seteditTripObj({data: item, index: index});
    store.Userv.MyProfileProps.navigation.navigate('NewTrip');
  };

  useEffect(() => {
    if (!getDataOnce && internet) {
      getDbData();
    }
    return () => {};
  }, [getDataOnce, internet]);

  const renderShowRes = () => {
    return (
      <View style={{marginVertical: 5}}>
        <Text
          style={{
            fontSize: 13,
            color: theme.color.subTitleLight,
            fontFamily: theme.fonts.fontMedium,
          }}>
          Showing {data.length} of {totalData}
        </Text>
      </View>
    );
  };

  const renderLoader = () => {
    return (
      <View
        style={{
          position: 'absolute',
          top: '45%',
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'center',
        }}>
        <ActivityIndicator size={35} color={theme.color.button1} />
      </View>
    );
  };

  const renderMessage = c => {
    return (
      <View
        style={{
          marginTop: '45%',
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'center',
        }}>
        <Text
          style={{
            fontSize: 14,
            color: theme.color.subTitleLight,
            fontFamily: theme.fonts.fontMedium,
          }}>
          {c == 'empty'
            ? `${userName} have not created any trips yet`
            : 'Please connect internet.'}
        </Text>
      </View>
    );
  };

  // const formatDate = date => {
  //   var dd = moment(date).format('MMM DD, YYYY');
  //   return dd;
  // };

  // const renderShowData = ({item, index}) => {
  //   let title = item.tradeType || '';
  //   let offer = item.title || '';
  //   let trade = item.returnActivity || '';
  //   let availability = item.availableFrom || '';
  //   let status = item.status || '';
  //   let c = status == 'suspended' ? true : false;
  //   let tc = theme.color.boxTitle;

  //   return (
  //     <View
  //       style={[styles.boxContainer, {marginTop: index == 0 ? 12 : 0}]}
  //       onPress={() => {}}>
  //       <Text
  //         style={[styles.title1, {color: !c ? tc : theme.color.subTitleLight}]}>
  //         {title} Trip
  //         {c && (
  //           <Text style={styles.title11}>
  //             {'  '}({status})
  //           </Text>
  //         )}
  //       </Text>

  //       <View style={styles.field}>
  //         <Text
  //           numberOfLines={1}
  //           ellipsizeMode="tail"
  //           style={styles.filedTitle}>
  //           Offering
  //         </Text>
  //         <Text
  //           numberOfLines={1}
  //           ellipsizeMode="tail"
  //           style={[
  //             styles.filedTitle2,
  //             {color: !c ? tc : theme.color.subTitleLight},
  //           ]}>
  //           {offer}
  //         </Text>
  //       </View>

  //       <View style={styles.field}>
  //         <Text
  //           numberOfLines={1}
  //           ellipsizeMode="tail"
  //           style={styles.filedTitle}>
  //           for trade
  //         </Text>
  //         <Text
  //           numberOfLines={1}
  //           ellipsizeMode="tail"
  //           style={[
  //             styles.filedTitle2,
  //             {color: !c ? tc : theme.color.subTitleLight},
  //           ]}>
  //           {trade}
  //         </Text>
  //       </View>

  //       <View style={styles.fieldContainer}>
  //         <View style={{width: '50%'}}>
  //           <Text
  //             numberOfLines={1}
  //             ellipsizeMode="tail"
  //             style={styles.filedTitle}>
  //             TRIP AVAILABILITY
  //           </Text>
  //           <Text
  //             numberOfLines={1}
  //             ellipsizeMode="tail"
  //             style={[
  //               styles.filedTitle2,
  //               {color: !c ? tc : theme.color.subTitleLight},
  //             ]}>
  //             {formatDate(availability)}
  //           </Text>
  //         </View>
  //         <Pressable
  //           style={({pressed}) => [
  //             {opacity: pressed ? 0.8 : 1.0},
  //             styles.buttonContainer,
  //           ]}
  //           onPress={() => {}}>
  //           <Text style={styles.buttonText}>View Trip</Text>
  //         </Pressable>
  //       </View>
  //     </View>
  //   );
  // };

  const windowSize = 21;

  return (
    <SafeAreaView style={styles.container}>
      {/* {data.length > 0 && renderShowRes()} */}
      <ScrollView
        style={{marginTop: 3}}
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {getDataOnce && data.length <= 0 && !loader && renderMessage('empty')}
        {/* {!getDataOnce &&
          !internet &&
          !loader &&
          data.length <= 0 &&
          renderMessage('internet')} */}

        {data.length >= 0 && (
          // <FlatList
          //   showsVerticalScrollIndicator={false}
          //   initialNumToRender={18}
          //   maxToRenderPerBatch={6}
          //   data={data}
          //   extraData={data}
          //   renderItem={renderShowData}
          //   keyExtractor={(item, index) => index.toString()}
          // />

          <Accordion
            c={'upt'}
            renderAsFlatList
            ref={scrollRef2}
            decelerationRate={'fast'}
            removeClippedSubviews
            initialNumToRender={limit}
            windowSize={windowSize}
            maxToRenderPerBatch={windowSize}
            underlayColor={'rgba(245,252,255,1)'}
            bxc={styles.boxContainer}
            sections={data}
            activeSections={activeSections}
            onChange={s => updateSections(s)}
            // elm={<EmptyListMessage />}
            isv={ItemSeparatorView}
            renderHeader={(item, index, isActive) => (
              <Card1
                item={item}
                index={index}
                isActive={isActive}
                props={props}
              />
            )}
            renderSectionTitle={(item, index) => (
              <Card2 item={item} index={index} props={props} />
            )}
            renderContent={(item, index, isActive) => (
              <Card3
                item={item}
                index={index}
                isActive={isActive}
                props={props}
                showpic={showpic}
                animtntime={animtntime}
                onClickMakeOffer={(it, i) => {}}
                // onClickMakeOffer={(it, i) => onClickMakeOffer(it, i)}
              />
            )}
          />
        )}
      </ScrollView>
      {!getDataOnce && loader && renderLoader()}
    </SafeAreaView>
  );
}
