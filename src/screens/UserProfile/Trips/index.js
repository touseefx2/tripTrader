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
  TextInput,
  Keyboard,
} from 'react-native';
import ProgressiveFastImage from '@freakycoder/react-native-progressive-fast-image';
import {Calendar} from 'react-native-calendars';
import moment from 'moment';
import {styles} from './styles';
import {observer} from 'mobx-react';
import store from '../../../store';
import NetInfo from '@react-native-community/netinfo';
import theme from '../../../theme';
import utils from '../../../utils/index';
import Accordion from 'react-native-collapsible/Accordion';
import Card1 from './Card1';
import Card2 from './Card2';
import Card3 from './Card3';
import EmptyListMessage from './Components/EmptyListMessage';
import ItemSeparatorView from './Components/ItemSeparatorView';

export default observer(Trips);

function Trips(props) {
  const scrollRef2 = useRef(null);
  const limit = 10;
  const animtntime = 1000;
  const windowSize = 21;

  const {isInternet} = store.General;
  const {user} = store.Userv;
  const {homeModalLoder, OtherProfileProps} = store.User;
  const {activity, tripLocation, species} = store.Filters;

  const [data, setdata] = useState([]);
  const [loader, setloader] = useState(false);

  const totalData = data.length;
  let userName = '';
  if (user) {
    userName = user.firstName + ' ' + user.lastName;
  }

  const [modalObj, setModalObj] = useState(null);
  const [isOfferModal, setIsOfferModal] = useState(false);
  const [isSuccessModal, setIsSuccessModal] = useState(false);
  const [successModalObj, setSuccessModalObj] = useState(null);
  const [successCheck, setSuccessCheck] = useState('');

  const [activeSections, setactiveSections] = useState([-1]);
  const [showpic, setshowpic] = useState(true);
  const [getDataOnce, setGetDataOnce] = useState(false);
  const [refreshing, setrefreshing] = React.useState(false);

  useEffect(() => {
    if (activeSections[0] > -1) {
      setTimeout(() => {
        setshowpic(false);
      }, animtntime);
    }
  }, [activeSections]);

  useEffect(() => {
    if (!getDataOnce && isInternet) {
      getDbData();
    }
    return () => {};
  }, [getDataOnce, isInternet]);

  const onRefresh = React.useCallback(() => {
    console.warn('onrefresh cal');
    setrefreshing(true);
    getDbData();
  }, []);

  const updateSections = activeSections => {
    setactiveSections(activeSections);
    setshowpic(true);
  };

  const getDbData = c => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        store.Userv.attemptToGetTrips(
          user._id,
          setGetDataOnce,
          setrefreshing,
          c => setdata(c),
          c => setloader(c),
        );
      } else {
        setrefeshing(false);
      }
    });
  };

  const openModal = (obj, check) => {
    setModalObj(obj);
    if (check == 'offer') setIsOfferModal(true);
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

  const rendeEmptyrMessage = c => {
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
            textAlign: 'center',
          }}>
          {userName} have not created any trips yet
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={{marginTop: 3}}
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {getDataOnce && data.length <= 0 && !loader && rendeEmptyrMessage()}
        {!getDataOnce && loader && renderLoader()}
        {data.length >= 0 && (
          <Accordion
            screen="UserProfile"
            renderAsFlatList
            ref={scrollRef2}
            decelerationRate={0.6}
            removeClippedSubviews
            initialNumToRender={limit}
            windowSize={windowSize}
            maxToRenderPerBatch={windowSize}
            underlayColor={'rgba(245,252,255,1)'}
            boxContainer={styles.boxContainer}
            sections={data}
            activeSections={activeSections}
            onChange={s => updateSections(s)}
            ItemSeparatorView={ItemSeparatorView}
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
                onClickMakeOffer={openModal}
              />
            )}
          />
        )}
      </ScrollView>

      {isOfferModal && (
        <utils.MakeOffer
          isModal={isOfferModal}
          setIsModal={setIsOfferModal}
          modalObj={modalObj}
          setModalObj={setModalObj}
          loader={homeModalLoder}
          activity={activity}
          species={species}
          tripLocation={tripLocation}
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
          props={OtherProfileProps}
        />
      )}
    </SafeAreaView>
  );
}
