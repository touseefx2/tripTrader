import React, { useEffect, useState, useRef } from "react";
import { View, SafeAreaView, BackHandler } from "react-native";
import { styles } from "./styles";
import { observer } from "mobx-react";
import store from "../../store/index";
import utils from "../../utils/index";
import Toast from "react-native-easy-toast";
import Accordion from "react-native-collapsible/Accordion";
import MainInfo from "./MainInfo";
import UserInfo from "./UserInfo";
import ExpandAllMainInfo from "./ExpandAllMainInfo";
import ListHeader from "./Components/ListHeader";
import EmptyListMessage from "../UserProfile/Trips/Components/EmptyListMessage";
import ItemSeparatorView from "../UserProfile/Trips/Components/ItemSeparatorView";
import ListFooter from "./Components/ListFooter";

export default observer(SavedTrips);

function SavedTrips(props) {
  const headerTitle = "Saved Trips";
  const windowSize = 21;
  const limit = 10;
  const animtntime = 1000;
  const scrollRef = useRef(null);
  const toast = useRef(null);

  const { isInternet } = store.General;
  const { user, homeModalLoder, userSubscription } = store.User;
  const { deleteLoader, saveTrips } = store.Trips;
  const { activity, tripLocation, species } = store.Filters;

  const [modalObj, setModalObj] = useState(null);
  const [isOfferModal, setIsOfferModal] = useState(false);
  const [isMessageModal, setIsMessageModal] = useState(false);
  const [isRemoveModal, setIsRemoveModal] = useState(false);
  const [isSuccessModal, setIsSuccessModal] = useState(false);
  const [successModalObj, setSuccessModalObj] = useState(null);
  const [successCheck, setSuccessCheck] = useState("");
  const [search, setSearch] = useState("");
  const [page, setpage] = useState(1);
  const [loadMore, setloadMore] = useState(false);
  const [saveData, setSaveData] = useState([]);
  const [data, setdata] = useState([]);
  const [isloadFirst, setisloadFirst] = useState(false);
  const [activeSections, setactiveSections] = useState([-1]);
  const [showpic, setshowpic] = useState(true);

  useEffect(() => {
    if (user == "guest") {
      store.General.setgoto("guestaccess");
      store.User.Logout();
      return;
    }
  }, []);

  useEffect(() => {
    let arr = [];
    setisloadFirst(false);
    setpage(1);
    if (search == "") {
      scrollToTop();
      BackHandler.removeEventListener(
        "hardwareBackPress",
        handleBackButtonClick
      );

      saveTrips.forEach(({ tripId }) => {
        if (tripId) arr.push(tripId);
      });
    } else {
      BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
      saveTrips.forEach(({ tripId }) => {
        if (tripId) {
          const title =
            tripId?.hostId?.firstName + " " + tripId?.hostId?.lastName;
          if (title.toLowerCase().includes(search.toLowerCase())) {
            arr.push(tripId);
          }
        }
      });
    }
    setSaveData(arr.reverse());

    return () => {
      BackHandler.removeEventListener(
        "hardwareBackPress",
        handleBackButtonClick
      );
    };
  }, [search, saveTrips]);

  useEffect(() => {
    if (saveData.length > 0 && !isloadFirst) LoadFirst(saveData);
    if (saveData.length <= 0) setdata([]);
  }, [saveData, isloadFirst]);

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

  function handleBackButtonClick() {
    if (!props.navigation.isFocused()) {
      return false;
    } else {
      setSearch("");
      return true;
    }
  }

  const LoadFirst = (data) => {
    let page = 0;
    let p = page + 1;
    let ar = [...data];
    const dt = ar.slice(page * limit, limit * p);
    let dd = [...dt];
    console.log("----> Load First : ", page * limit, limit * p);
    setdata(dd);
    setisloadFirst(true);
  };

  const LoadMore = async () => {
    setloadMore(true);
    setTimeout(() => {
      setloadMore(false);
      let p = page + 1;
      let ar = [...saveData];
      const dt = ar.slice(page * limit, limit * p);
      let dd = [...data, ...dt];
      console.log("---> Load More : ", page * limit, limit * p);
      setdata(dd);
      setpage(p);
    }, 1);
  };

  const scrollToTop = () => {
    // scrollRef2?.current?.scrollToOffset({animated: false, offset: 0});
  };

  const updateSections = (activeSections) => {
    setactiveSections(activeSections);
    setshowpic(true);
  };

  const openModal = (obj, check) => {
    setModalObj(obj);
    if (check == "offer") setIsOfferModal(true);

    if (check == "message") setIsMessageModal(true);

    if (check == "tripRemove") setIsRemoveModal(true);
  };

  return (
    <>
      <View style={styles.container}>
        <utils.DrawerHeader props={props} headerTitle={headerTitle} />
        {!isInternet && <utils.InternetMessage />}
        <SafeAreaView style={styles.container2}>
          <View style={styles.container3}>
            <Accordion
              paddingHorizontal={15}
              renderAsFlatList
              ref={scrollRef}
              decelerationRate={0.6}
              removeClippedSubviews
              initialNumToRender={limit}
              windowSize={windowSize}
              maxToRenderPerBatch={windowSize}
              underlayColor={"rgba(245,252,255,1)"}
              boxContainer={styles.boxContainer}
              sections={data}
              activeSections={activeSections}
              onChange={updateSections}
              emptyMessage={<EmptyListMessage />}
              ItemSeparatorView={ItemSeparatorView}
              listHeader={
                <ListHeader
                  search={search}
                  setsearch={(c) => setSearch(c)}
                  data={saveData}
                />
              }
              renderHeader={(item, index, isActive) => (
                <MainInfo item={item} isActive={isActive} props={props} />
              )}
              renderSectionTitle={(item, index) => (
                <UserInfo
                  item={item}
                  index={index}
                  user={user}
                  props={props}
                  openModal={openModal}
                />
              )}
              renderContent={(item, index, isActive) => (
                <ExpandAllMainInfo
                  item={item}
                  index={index}
                  isActive={isActive}
                  user={user}
                  props={props}
                  showpic={showpic}
                  animtntime={animtntime}
                  openModal={openModal}
                  userSubscription={userSubscription}
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
            screen={"SavedTrips"}
            props={props}
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
            goBackMain={() => {}}
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

        <Toast ref={toast} position="bottom" />
      </View>
    </>
  );
}
