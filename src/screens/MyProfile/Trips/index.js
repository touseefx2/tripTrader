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
          {
            _id: 31,
            duration: 3,
            title: 'Hunting Trip',
            offer: 'Central N.C Whitetail Hunting',
            for_trade: 'Florida Alligator Hunt or an Oseola Turkey Hunt',
            availability: new Date(),
            status: 'pending',
            loc: {
              name: 'Dylan, NC',
              coords: [],
            },
          },
          {
            _id: 32,
            duration: 1,
            title: 'Fishing Trip',
            offer: 'Blue Catfish Jugging',
            for_trade: 'Open to Offers',
            availability: new Date(),
            status: 'suspended',
            loc: {
              name: 'Tim, ID',
              coords: [],
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
    let duration = item.duration || '';
    let dt =
      duration == 1 ? 'Whole Day' : duration > 1 ? duration + ' Day' : '';
    let offer = item.offer || '';
    let trade = item.for_trade || '';
    let availability = item.availability || '';
    let status = item.status || '';
    let c = status == 'suspended' ? true : false;
    let tc = theme.color.boxTitle;
    return (
      <Pressable
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
            {dt} {offer}
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

        <View style={styles.field}>
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

        {/* <View style={styles.fieldContainer}>
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
                {color: !c ? theme.color.title : theme.color.subTitle},
              ]}>
              {formatDate(availability)}
            </Text>
          </View>
          <Pressable
            style={({pressed}) => [
              {opacity: pressed ? 0.9 : 1.0},
              styles.buttonContainer,
            ]}
            onPress={() => {}}>
            <Text style={styles.buttonText}>Edit Trip</Text>
          </Pressable>
        </View> */}
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
