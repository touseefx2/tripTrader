import React, {useEffect, useState, useRef, useCallback} from 'react';
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
// import ImageSlider from 'react-native-image-slider';
import {styles} from './styles';
import {observer} from 'mobx-react';
import store from '../../store/index';
import utils from '../../utils/index';
import theme from '../../theme';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-easy-toast';
import {ActivityIndicator} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import {ImageSlider} from 'react-native-image-slider-banner';
import {Calendar} from 'react-native-calendars';
import moment, {duration} from 'moment/moment';
import {SwipeListView} from 'react-native-swipe-list-view';
import Card from './Card/index';
import CardDelete from './CardDelete';

export default observer(Inbox);

function ListHeader({search, setsearch, data, totalUnread}) {
  const renderResult = () => {
    return (
      <View style={styles.resultContainer}>
        <Text style={styles.resultText}>
          {data.length} messages, {totalUnread} unread
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
          value={search}
          style={styles.SerchBarInput}
          placeholder="Search"
          onChangeText={c => {
            setsearch(c);
          }}
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
    <View style={{marginHorizontal: 15}}>
      <Pressable
        style={({pressed}) => [
          {opacity: pressed ? 0.9 : 1},
          [styles.SerchBarContainer],
        ]}
        // onPress={onclickSearchBar}
      >
        {renderSearch()}
        {renderInput()}
        {renderFilter()}
      </Pressable>
      {data.length > 0 && renderResult()}
    </View>
  );
}

function ListFooter({data, d, loadMore, LoadMore}) {
  return (
    <>
      <View style={styles.listFooter}>
        {data.length == d.length && (
          <Text style={styles.listFooterT}>End of messages</Text>
        )}

        {data.length < d.length && (
          <View
            style={[
              styles.listFooter,
              {flexDirection: 'row', alignItems: 'center'},
            ]}>
            <TouchableOpacity
              activeOpacity={0.7}
              disabled={loadMore}
              onPress={LoadMore}>
              <Text style={styles.listFooterT}>Load More...</Text>
            </TouchableOpacity>
            {loadMore && (
              <ActivityIndicator
                style={{marginLeft: 10}}
                size={16}
                color={theme.color.button1}
              />
            )}
          </View>
        )}
      </View>
    </>
  );
}

function Inbox(props) {
  let guest = require('../../assets/images/drawer/guest/img.png');
  const swipRef = useRef(null);
  const closeSwipe = () => {
    swipRef?.current?.safeCloseOpenRow();
  };

  let maxModalHeight = theme.window.Height - 100;
  const [modalHeight, setmodalHeight] = useState(0);

  let headerTitle = 'Inbox';
  let internet = store.General.isInternet;
  let user = store.User.user;

  let loader = store.User.dlc;
  const d = store.User.inbox;
  let totalUnread = store.User.unreadInbox;

  let limit = 16;

  const [search, setsearch] = useState('');
  const [sdata, setsdata] = useState([]);
  useEffect(() => {
    if (search != '') {
      let data = [...store.User.inbox];
      if (data.length > 0) {
        let uid = user._id;
        let ar = data.filter(item => {
          let u = false;
          if (item.userId1 && item.userId1._id != uid) {
            u = item.userId1;
          }
          if (item.userId2 && item.userId2._id != uid) {
            u = item.userId2;
          }
          let title = u.firstName + ' ' + u.lastName;

          return title.toLowerCase().includes(search.toLowerCase());
        });
        setsdata(ar);
      }
    } else {
      setsdata([]);
    }
  }, [search]);

  console.log('search : ', search);
  console.log('sdataa : ', sdata.length);

  const [data, setdata] = useState(false);
  const [page, setpage] = useState(1);
  const [loadFirst, setloadFirst] = useState(false);

  const [loadMore, setloadMore] = useState(false);

  const [getDataOnce, setgetDataOnce] = useState(false);
  const setGetDataOnce = C => {
    setgetDataOnce(C);
  };
  const refreshing = store.User.ibl || loadFirst;
  const onRefresh = React.useCallback(() => {
    console.warn('onrefresh cal');
    if (user !== 'guest') {
      getDbData();
    }
  }, []);
  const getDbData = () => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        store.User.attemptToGetInboxes(user._id, setGetDataOnce);
      }
    });
  };

  useEffect(() => {
    if (internet) {
      onRefresh();
    }
    return () => {};
  }, [internet]);

  useEffect(() => {
    if (user == 'guest') {
      store.General.setgoto('guestaccess');
      store.User.Logout();
      return;
    }
  }, []);

  const LoadFirst = d => {
    setloadFirst(true);
    let page = 0;
    let p = page + 1;
    let ar = [...d];
    const dt = ar.slice(page * limit, limit * p);

    let dd = [...dt];

    console.log('pagination callllll load first : ', page * limit, limit * p);
    setdata(dd);
    setpage(p);

    setloadFirst(false);
  };

  const LoadMore = async () => {
    setloadMore(true);
    setTimeout(() => {
      let p = page + 1;
      let ar = [...d];
      const dt = ar.slice(page * limit, limit * p);
      let dd = [...data, ...dt];
      console.log('pagination callllll load more : ', page * limit, limit * p);
      setdata(dd);
      setpage(p);
      setloadMore(false);
    }, 1);
  };

  useEffect(() => {
    if (getDataOnce) {
      if (d.length > 0) {
        LoadFirst(d);
      } else {
        setdata([]);
      }
    }
  }, [getDataOnce]);

  console.log('d : ', d.length);
  console.log('data : ', data.length);
  console.log('loadmore : ', loadMore);

  const onclickSearchBar = () => {};

  const deleteChat = (chatId, i) => {
    Keyboard.dismiss();
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        store.User.attemptToDeleteChat(chatId, i, user._id, closeSwipe);
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
          height: 0.7,
          backgroundColor: theme.color.fieldBorder,
          width: '100%',
        }}
      />
    );
  };

  const EmptyListMessage = ({item}) => {
    return (
      // Flat List Item
      <>
        {getDataOnce && !loadMore && data && data.length <= 0 && (
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
            No Chats Found
          </Text>
        )}
      </>
    );
  };

  // const ItemView = ({item, index}) => {
  //   <Card
  //     item={item}
  //     index={index}
  //     refreshing={refreshing}
  //     data={data}
  //     user={store.User.user}
  //     props={props}
  //   />;
  // };

  // const ItemViewdelete = ({item, index}) => {
  //   return (
  //     <CardDelete
  //       item={item}
  //       index={index}
  //       refreshing={refreshing}
  //       deleteChat={(c, i) => deleteChat(c, i)}
  //     />
  //   );
  // };

  return (
    <>
      <View style={styles.container}>
        <utils.DrawerHeader props={props} headerTitle={headerTitle} />
        {!internet && <utils.InternetMessage />}
        <SafeAreaView style={styles.container2}>
          <View style={styles.container3}>
            {/* {ListHeader()} */}
            <SwipeListView
              useFlatList
              removeClippedSubviews
              ref={swipRef}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              contentContainerStyle={{
                paddingVertical: 12,
              }}
              ListEmptyComponent={EmptyListMessage}
              ListHeaderComponent={
                data && data.length > 0 ? (
                  <ListHeader
                    search={search}
                    setsearch={c => setsearch(c)}
                    data={store.User.inbox}
                    totalUnread={totalUnread}
                  />
                ) : null
              }
              keyExtractor={(item, index) => index.toString()}
              ListFooterComponent={
                data != false && data.length > 0 ? (
                  <ListFooter
                    data={data}
                    d={store.User.inbox}
                    loadMore={loadMore}
                    LoadMore={LoadMore}
                  />
                ) : null
              }
              data={data == false ? [] : data}
              ItemSeparatorComponent={ItemSeparatorView}
              renderItem={({item, index}) => (
                <Card
                  item={item}
                  index={index}
                  refreshing={refreshing}
                  data={data}
                  user={store.User.user}
                  props={props}
                />
              )}
              // renderHiddenItem={ItemViewdelete}
              leftOpenValue={75}
              rightOpenValue={-75}
              disableRightSwipe
              initialNumToRender={6}
              maxToRenderPerBatch={6}
            />
          </View>

          <utils.Footer
            nav={props.navigation}
            screen={headerTitle}
            focusScreen={store.General.focusScreen}
          />

          <utils.Loader load={loader} />
          {store.Notifications.isShowNotifcation && <utils.ShowNotifications />}
        </SafeAreaView>
      </View>
    </>
  );
}
