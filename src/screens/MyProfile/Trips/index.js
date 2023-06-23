import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Pressable,
} from 'react-native';
import {styles} from './styles';
import {observer} from 'mobx-react';
import store from '../../../store';
import NetInfo from '@react-native-community/netinfo';
import theme from '../../../theme';
import utils from '../../../utils';
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

  const callGeneral = () => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        store.User.getUserById1(store.User.user._id, store.User.authToken, '');
        store.User.attemptToGetFollowers(
          store.User.user._id,
          () => {},
          () => {},
        );
        store.User.attemptToGetFollowing(
          store.User.user._id,
          () => {},
          () => {},
        );
      }
    });
  };

  const onRefresh = React.useCallback(() => {
    console.warn('onrefresh cal');
    setRefreshing(true);
    callGeneral();
    getDbData();
  }, []);

  const getDbData = c => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        store.User.attemptToGetTrips(user._id, setGetDataOnce, setrefeshing);
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
          textAlign: 'center',
        }}>
        <Text
          style={{
            fontSize: 14,
            color: theme.color.subTitleLight,
            fontFamily: theme.fonts.fontMedium,
            textAlign: 'center',
          }}>
          {c == 'empty'
            ? 'You have not created any trips yet'
            : 'Please connect internet.'}
        </Text>
      </View>
    );
  };

  const renderShowData = ({item, index}) => {
    let title = item.tradeType || '';
    let offer = item.title || '';
    let trade = item.returnActivity || '';
    let sd = utils.functions.DateWithoutFormat(item.availableFrom);
    let sdy = parseInt(new Date(sd).getFullYear());
    let ed = utils.functions.DateWithoutFormat(item.availableTo);
    let edy = parseInt(new Date(ed).getFullYear());
    let availability = '';
    if (sdy == edy) {
      availability =
        moment(sd).format('MMM DD') + ' - ' + moment(ed).format('MMM DD, YYYY');
    } else {
      availability =
        moment(sd).format('MMM DD, YYYY') +
        ' - ' +
        moment(ed).format('MMM DD, YYYY');
    }
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
          {title} Trip
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
            {offer}
          </Text>
        </View>

        <View style={styles.field}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.filedTitle}>
            In Return For
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
          <View style={{width: '60%'}}>
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
              {availability}
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
      <View style={{marginTop: 3}}>
        {getDataOnce && data.length <= 0 && !loader && renderMessage('empty')}
        {/* {!getDataOnce &&
          !internet &&
          !loader &&
          data.length <= 0 &&
          renderMessage('internet')} */}

        {data.length >= 0 && (
          <FlatList
            decelerationRate={0.6}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            showsVerticalScrollIndicator={false}
            initialNumToRender={18}
            maxToRenderPerBatch={6}
            data={data}
            extraData={data}
            renderItem={renderShowData}
            keyExtractor={(item, index) => index.toString()}
          />
        )}
      </View>
      {!getDataOnce && loader && renderLoader()}
    </SafeAreaView>
  );
}
