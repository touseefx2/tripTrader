import React, {useEffect, useState, useRef} from 'react';
import {View, SafeAreaView, BackHandler} from 'react-native';
import {styles} from './styles';
import {observer} from 'mobx-react';
import store from '../../store/index';
import utils from '../../utils/index';
import Toast from 'react-native-easy-toast';
import Accordion from 'react-native-collapsible/Accordion';
import Card1 from './Card1';
import Card2 from './Card2';
import Card3 from './Card3';
import ListHeader from './Components/ListHeader';
import EmptyListMessage from './Components/EmptyListMessage';
import ItemSeparatorView from './Components/ItemSeparatorView';
import ListFooter from './Components/ListFooter';

export default observer(SavedTrips);

function SavedTrips(props) {
  const headerTitle = 'Saved Trips';
  const windowSize = 21;
  const limit = 10;
  const animtntime = 1000;
  const scrollRef = useRef(null);
  const toast = useRef(null);

  const {isInternet} = store.General;
  const {user, homeModalLoder} = store.User;
  const {deleteLoader, saveTrips} = store.Trips;
  const {activity, tripLocation, species} = store.Filters;
  const {isShowNotifcation} = store.Notifications;

  const [modalObj, setModalObj] = useState(null);
  const [isOfferModal, setIsOfferModal] = useState(false);
  const [isMessageModal, setIsMessageModal] = useState(false);
  const [isRemoveModal, setIsRemoveModal] = useState(false);
  const [isSuccessModal, setIsSuccessModal] = useState(false);
  const [successModalObj, setSuccessModalObj] = useState(null);
  const [successCheck, setSuccessCheck] = useState('');
  const [search, setSearch] = useState('');
  const [page, setpage] = useState(1);
  const [loadMore, setloadMore] = useState(false);
  const [saveData, setSaveData] = useState([]);
  const [data, setdata] = useState([]);
  const [isloadFirst, setisloadFirst] = useState(false);
  const [activeSections, setactiveSections] = useState([-1]);
  const [showpic, setshowpic] = useState(true);

  useEffect(() => {
    let arr = [];
    setisloadFirst(false);
    setpage(1);
    if (search == '') {
      saveTrips.map(item => {
        if (item) arr.push(item);
      });
    } else {
      arr = saveTrips.filter(item => {
        const title = item.hostId.firstName + ' ' + item.hostId.lastName;
        return title.toLowerCase().includes(search.toLowerCase());
      });
    }
    setSaveData(arr.reverse());
  }, [search]);

  useEffect(() => {
    if (saveData.length > 0 && !isloadFirst) LoadFirst(saveData);
    if (saveData.length <= 0) setdata([]);
  }, [saveData, isloadFirst]);

  const LoadFirst = d => {
    let page = 0;
    let p = page + 1;
    let ar = [...d];
    const dt = ar.slice(page * limit, limit * p);
    let dd = [...dt];
    console.log('----> Load First : ', page * limit, limit * p);
    setdata(dd);
    setisloadFirst(true);
  };
  useEffect(() => {
    if (page <= 0 && data.length >= limit) {
      setpage(1);
    }
  }, [data, page]);

  useEffect(() => {
    if (activeSections[0] > -1) {
      setTimeout(() => {
        setshowpic(false);
      }, animtntime);
    }
  }, [activeSections]);

  useEffect(() => {
    if (user == 'guest') {
      store.General.setgoto('guestaccess');
      store.User.Logout();
      return;
    }
  }, []);

  useEffect(() => {
    if (search != '')
      BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);

    if (search == '') {
      scrollToTop();

      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );
    }

    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );
    };
  }, [search]);

  function handleBackButtonClick() {
    if (!props.navigation.isFocused()) {
      return false;
    } else {
      setSearch('');
      return true;
    }
  }

  const LoadMore = async () => {
    setloadMore(true);
    setTimeout(() => {
      setloadMore(false);
      let p = page + 1;
      let ar = [...saveData];
      const dt = ar.slice(page * limit, limit * p);
      let dd = [...data, ...dt];
      console.log('---> Load More : ', page * limit, limit * p);
      setdata(dd);
      setpage(p);
    }, 1);
  };

  const scrollToTop = () => {
    // scrollRef2?.current?.scrollToOffset({animated: false, offset: 0});
  };

  const updateSections = activeSections => {
    setactiveSections(activeSections);
    setshowpic(true);
  };

  const openModal = (obj, check) => {
    setModalObj(obj);
    if (check == 'offer') setIsOfferModal(true);

    if (check == 'message') setIsMessageModal(true);

    if (check == 'tripRemove') setIsRemoveModal(true);
  };

  return (
    <>
      <View style={styles.container}>
        <utils.DrawerHeader props={props} headerTitle={headerTitle} />
        {!isInternet && <utils.InternetMessage />}
        <SafeAreaView style={styles.container2}>
          <View style={styles.container3}>
            <Accordion
              renderAsFlatList
              ref={scrollRef}
              decelerationRate={'fast'}
              removeClippedSubviews
              initialNumToRender={limit}
              windowSize={windowSize}
              maxToRenderPerBatch={windowSize}
              underlayColor={'rgba(245,252,255,1)'}
              boxContainer={styles.boxContainer}
              sections={data}
              activeSections={activeSections}
              onChange={updateSections}
              emptyMessage={<EmptyListMessage />}
              ItemSeparatorView={ItemSeparatorView}
              listHeader={
                <ListHeader
                  search={search}
                  setsearch={c => setSearch(c)}
                  data={saveData}
                />
              }
              renderHeader={(item, index, isActive) => (
                <Card1 item={item} isActive={isActive} props={props} />
              )}
              renderSectionTitle={(item, index) => (
                <Card2
                  item={item}
                  index={index}
                  user={user}
                  props={props}
                  openModal={openModal}
                />
              )}
              renderContent={(item, index, isActive) => (
                <Card3
                  item={item}
                  index={index}
                  isActive={isActive}
                  user={user}
                  props={props}
                  showpic={showpic}
                  animtntime={animtntime}
                  openModal={openModal}
                />
              )}
              ListFooterComponent={
                <ListFooter
                  data={data}
                  d={saveData}
                  loadMore={loadMore}
                  LoadMore={LoadMore}
                  limit={limit}
                />
              }
            />
          </View>

          <utils.Footer
            nav={props.navigation}
            screen={headerTitle}
            focusScreen={store.General.focusScreen}
          />
        </SafeAreaView>

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
        {isRemoveModal && (
          <utils.unSaveTripModal
            isModal={isRemoveModal}
            setIsModal={setIsRemoveModal}
            modalObj={modalObj}
            setModalObj={setModalObj}
            loader={deleteLoader}
            screen="SavedTrips"
            data={data}
            setdata={setdata}
            saveData={saveData}
            setSaveData={setSaveData}
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

        {isShowNotifcation && <utils.ShowNotifications />}
        <Toast ref={toast} position="bottom" />
      </View>
    </>
  );
}
