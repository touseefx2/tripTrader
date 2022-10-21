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

export default observer(Trips);

function Trips(props) {
  let headerTitle = 'Trips';
  let internet = store.General.isInternet;
  let user = store.User.user;
  let data = store.User.trips;
  const totalData = data.length;
  let loader = store.User.tripsLoader;
  let mloader = store.User.mLoader;

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
        const dt = [
          // {
          //   _id: 31,
          //   title: 'Hunting Trip',
          //   acceptOtherTrades: true,

          //   loc: {coords: [], name: 'Miami, Florida'},
          //   offer: 'Central N.C Whitetail Hunting',
          //   photos: [
          //     'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0OqjKG4QLGg-hvzwhf76mCB1shxkUchZN9Q&usqp=CAU',
          //     'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbyQRxBY8uSBj1VaS26kR0_7Uk6BJ-YNz4XQ&usqp=CAU',
          //     'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTV8fHRyYXZlbGxpbmd8ZW58MHx8MHx8&w=1000&q=80',
          //   ],
          //   return: 'Florida Alligator Hunt or an Oseola Turkey Hunt',
          //   status: 'activate',
          //   availablity: {endDate: '2022-11-05', startDate: '2022-10-17'},
          //   duration: {number: '3', title: 'days'},
          //   unavailable: {
          //     all_unavailable_dates: [
          //       '2022-10-25',
          //       '2022-10-26',
          //       '2022-10-28',
          //       '2022-11-02',
          //       '2022-11-04',
          //     ],
          //     days_of_week: ['Fri'],
          //     esd_text: 'Oct 25-26, Nov 2',
          //     exclude_specific_dates: [
          //       '2022-10-25',
          //       '2022-10-26',
          //       '2022-11-02',
          //     ],
          //     repeat_every: {endRepeatOn: '2022-11-05', num: 1, title: 'Weeks'},
          //     unavailable_days_of_week: ['2022-10-28', '2022-11-04'],
          //     wtxt: 'Fri (weekly)',
          //   },
          //   user: 1,
          // },
          // {
          //   _id: 32,
          //   title: 'Fishing Trip',
          //   acceptOtherTrades: true,
          //   availablity: {endDate: '2022-09-05', startDate: '2022-08-17'},
          //   duration: {number: '3', title: 'days'},
          //   unavailable: {
          //     all_unavailable_dates: [
          //       '2022-08-25',
          //       '2022-08-26',
          //       '2022-08-28',
          //       '2022-09-02',
          //       '2022-09-04',
          //     ],
          //     days_of_week: ['Fri'],
          //     esd_text: 'Aug 25-26, Sep 2',
          //     exclude_specific_dates: [
          //       '2022-08-25',
          //       '2022-08-26',
          //       '2022-09-02',
          //     ],
          //     repeat_every: {endRepeatOn: '2022-09-05', num: 1, title: 'Weeks'},
          //     unavailable_days_of_week: ['2022-08-28', '2022-09-04'],
          //     wtxt: 'Fri (weekly)',
          //   },
          //   loc: {coords: [], name: 'Miami, Florida'},
          //   offer: 'Blue Catfish Jugging',
          //   photos: [
          //     'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0OqjKG4QLGg-hvzwhf76mCB1shxkUchZN9Q&usqp=CAU',
          //     'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbyQRxBY8uSBj1VaS26kR0_7Uk6BJ-YNz4XQ&usqp=CAU',
          //     'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTV8fHRyYXZlbGxpbmd8ZW58MHx8MHx8&w=1000&q=80',
          //   ],
          //   return: 'Open to Offers',
          //   status: 'suspended',

          //   user: 1,
          // },

          {
            _id: 31,
            title: 'Hunting Trip',
            acceptOtherTrades: true,

            loc: {coords: [], name: 'Miami, Florida'},
            offer: 'Central N.C. Whitetail Hunting In The Back Country',
            photos: [
              'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0OqjKG4QLGg-hvzwhf76mCB1shxkUchZN9Q&usqp=CAU',
              'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbyQRxBY8uSBj1VaS26kR0_7Uk6BJ-YNz4XQ&usqp=CAU',
              'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTV8fHRyYXZlbGxpbmd8ZW58MHx8MHx8&w=1000&q=80',
            ],
            return: 'Alligator or Osceola Turkey',
            status: 'activate',

            user: {
              _id: 2,
              first_name: 'mike',
              last_name: 'monuse',
              userName: 'mmouse',
              // photo:"",
              photo:
                'https://www.adobe.com/express/create/media_127540366421d3d5bfcaf8202527ca7d37741fd5d.jpeg?width=400&format=jpeg&optimize=medium',
              avg_rating: 3.8,
              total_reviews: 190,
              isVerified: true,
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
              exclude_specific_dates: [
                '2022-10-25',
                '2022-10-26',
                '2022-11-02',
              ],
              repeat_every: {endRepeatOn: '2022-11-05', num: 1, title: 'Weeks'},
              unavailable_days_of_week: ['2022-10-28', '2022-11-04'],
              wtxt: 'Fri (weekly)',
            },
          },
          {
            _id: 32,
            title: 'Fishing Trip',
            acceptOtherTrades: true,

            loc: {coords: [], name: 'Dylan, Nc'},
            offer: 'North Idaho Black Bear Spot and Stalk',
            photos: [
              'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0OqjKG4QLGg-hvzwhf76mCB1shxkUchZN9Q&usqp=CAU',
              'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbyQRxBY8uSBj1VaS26kR0_7Uk6BJ-YNz4XQ&usqp=CAU',
              'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTV8fHRyYXZlbGxpbmd8ZW58MHx8MHx8&w=1000&q=80',
            ],
            return: 'Open to Offers',
            status: 'suspended',
            user: {
              _id: 7,
              first_name: 'James',
              last_name: 'Bond',
              userName: 'jbonds',
              // photo:"",
              photo:
                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHw%3D&w=1000&q=80',

              avg_rating: 3.5,
              total_reviews: 100,
              isVerified: false,
            },
            availablity: {endDate: '2022-12-01', startDate: '2022-11-01'},
            duration: {number: '1', title: 'days'},
            unavailable: {
              all_unavailable_dates: [
                '2022-11-03',
                '2022-11-10',
                '2022-11-17',
                '2022-11-21',
                '2022-11-24',
                '2022-11-25',
              ],
              days_of_week: ['Thu'],
              esd_text: 'Nov 21, Nov 25',
              exclude_specific_dates: ['2022-11-21', '2022-11-25'],
              repeat_every: {endRepeatOn: '2022-12-01', num: 1, title: 'Weeks'},
              unavailable_days_of_week: [
                '2022-11-03',
                '2022-11-10',
                '2022-11-17',
                '2022-11-24',
              ],
              wtxt: 'Thu (weekly)',
            },
          },
        ];
        store.User.attemptToGetTrips(
          user._id,
          setGetDataOnce,
          setrefeshing,
          dt,
        );
      } else {
        setrefeshing(false);
      }
    });
  };

  const gotoEditTrip = (item, index) => {
    store.User.seteditTrip(true);
    store.User.seteditTripObj({data: item, index: index});
    store.User.MyProfileProps.navigation.navigate('NewTrip');
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
            ? 'No trips available at this time'
            : 'Please connect internet.'}
        </Text>
      </View>
    );
  };

  const formatDate = date => {
    var dd = moment(date).format('MMM DD, YYYY');
    return dd;
  };

  const renderShowData = ({item, index}) => {
    let title = item.title || '';
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
    let availability = item.availablity.startDate || '';
    let status = item.status || '';
    let c = status == 'suspended' ? true : false;
    let tc = theme.color.boxTitle;
    return (
      <Pressable
        disabled
        style={({pressed}) => [
          {opacity: pressed ? 0.8 : 1.0},
          [styles.boxContainer, {marginTop: index == 0 ? 12 : 0}],
        ]}
        onPress={() => {}}>
        <Text
          style={[styles.title1, {color: !c ? tc : theme.color.subTitleLight}]}>
          {title}
          {c && (
            <Text style={styles.title11}>
              {'  '}({status})
            </Text>
          )}
        </Text>

        <View style={styles.field}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.filedTitle}>
            Offering
          </Text>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[
              styles.filedTitle2,
              {color: !c ? tc : theme.color.subTitleLight},
            ]}>
            <Text
              style={[
                styles.filedTitle2,
                {
                  color: !c ? tc : theme.color.subTitleLight,
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
            style={[
              styles.filedTitle2,
              {color: !c ? tc : theme.color.subTitleLight},
            ]}>
            {trade}
          </Text>
        </View>

        {/* <View style={styles.field}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.filedTitle}>
            TRIP AVAILABILITY
          </Text>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[
              styles.filedTitle2,
              {color: !c ? tc : theme.color.subTitleLight},
            ]}>
            {formatDate(availability)}
          </Text>
        </View>

        <View style={styles.field}>
          <Pressable
            style={({pressed}) => [
              {opacity: pressed ? 0.9 : 1.0},
              styles.buttonContainer2,
            ]}
            onPress={() => {}}>
            <Text style={styles.buttonText2}>Edit Trip</Text>
          </Pressable>
        </View> */}

        <View style={styles.fieldContainer}>
          <View style={{width: '50%'}}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.filedTitle}>
              TRIP AVAILABILITY
            </Text>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={[
                styles.filedTitle2,
                {color: !c ? tc : theme.color.subTitleLight},
              ]}>
              {formatDate(availability)}
            </Text>
          </View>
          <Pressable
            style={({pressed}) => [
              {opacity: pressed ? 0.8 : 1.0},
              styles.buttonContainer,
            ]}
            onPress={() => {
              gotoEditTrip(item, index);
            }}>
            <Text style={styles.buttonText}>Edit Trip</Text>
          </Pressable>
        </View>
      </Pressable>
    );
  };

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
        {!getDataOnce &&
          !internet &&
          !loader &&
          data.length <= 0 &&
          renderMessage('internet')}

        {data.length >= 0 && (
          <FlatList
            showsVerticalScrollIndicator={false}
            initialNumToRender={18}
            maxToRenderPerBatch={6}
            data={data}
            extraData={data}
            renderItem={renderShowData}
            keyExtractor={(item, index) => index.toString()}
          />
        )}
      </ScrollView>
      {!getDataOnce && loader && renderLoader()}
    </SafeAreaView>
  );
}
