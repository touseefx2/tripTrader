import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  BackHandler,
  Alert,
  Pressable,
  TextInput,
  Keyboard,
  RefreshControl,
} from 'react-native';
import {styles} from './styles';
import {observer} from 'mobx-react';
import store from '../../store/index';
import utils from '../../utils/index';
import theme from '../../theme';
import NetInfo from '@react-native-community/netinfo';
import {SwipeListView} from 'react-native-swipe-list-view';
import Card from './Card/index';
import CardDelete from './CardDelete';
import {FireStore} from '../../services/FireStore';

export default observer(Inbox);

function ItemSeparatorView() {
  return (
    <View
      style={{
        height: 0.7,
        backgroundColor: theme.color.fieldBorder,
        width: '100%',
      }}
    />
  );
}

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
      <View style={{width: '91%'}}>
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
      </Pressable>
      {data.length > 0 && renderResult()}
    </View>
  );
}

function ListFooter() {
  return (
    <>
      <View style={styles.listFooter}>
        <Text style={styles.listFooterT}>End of messages</Text>
      </View>
    </>
  );
}

function EmptyListMessage() {
  return (
    // Flat List Item
    <>
      <Text
        style={{
          marginTop: '25%',
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'center',
          fontSize: 13,
          color: theme.color.subTitleLight,
          fontFamily: theme.fonts.fontMedium,
        }}>
        No Chats Found
      </Text>
    </>
  );
}

function Inbox(props) {
  const guest = require('../../assets/images/drawer/guest/img.png');
  const scrollRef = useRef(null);
  const swipRef = useRef(null);
  const closeSwipe = () => {
    swipRef?.current?.safeCloseOpenRow();
  };

  const headerTitle = 'Inbox';
  const {isInternet, setGoToScreen, focusScreen} = store.General;
  const {user, attemptToGetInboxes, Logout, dlc, unreadInbox, inbox, ibl} =
    store.User;

  const [search, setsearch] = useState('');
  const [sdata, setsdata] = useState([]);

  const loader = dlc;
  const data = search == '' ? inbox : sdata;
  const totalUnread = unreadInbox;

  useEffect(() => {
    if (search != '') {
      BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    }

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

  const scrollToTop = () => {
    scrollRef?.current?.scrollToOffset({animated: false, offset: 0});
  };

  function handleBackButtonClick() {
    if (!props.navigation.isFocused()) {
      return false;
    } else {
      setsearch('');

      return true;
    }
  }

  useEffect(() => {
    let data = [...inbox];
    if (search != '') {
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
      } else {
        setsdata([]);
      }
    } else {
      setsdata([]);
    }
  }, [search, inbox]);

  const [getDataOnce, setgetDataOnce] = useState(false);
  const setGetDataOnce = C => {
    setgetDataOnce(C);
  };
  const refreshing = ibl;
  const onRefresh = React.useCallback(() => {
    console.log('onrefresh cal');
    if (user !== 'guest') {
      getDbData();
    }
  }, []);
  const getDbData = () => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        attemptToGetInboxes(user._id, setGetDataOnce, '');
      }
    });
  };

  useEffect(() => {
    if (isInternet) {
      onRefresh();
    }
    return () => {};
  }, [isInternet]);

  useEffect(() => {
    if (user == 'guest') {
      setGoToScreen('guestaccess');
      Logout();
      return;
    }
  }, []);

  const deleteChat = (chatId, i) => {
    Keyboard.dismiss();
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        FireStore.deleteChat(
          inbox,
          chatId,
          user._id,
          search,
          sdata,
          setsdata,
          closeSwipe,
        );
      } else {
        Alert.alert('', 'Please connect internet');
      }
    });
  };

  let limit = 16;
  const windowSize = 21;
  // data.length > 63 ? data.length / 3 :
  return (
    <>
      <View style={styles.container}>
        <utils.DrawerHeader props={props} headerTitle={headerTitle} />
        {!isInternet && <utils.InternetMessage />}
        <SafeAreaView style={styles.container2}>
          <View style={styles.container3}>
            <SwipeListView
              decelerationRate={'fast'}
              useFlatList
              removeClippedSubviews
              initialNumToRender={limit}
              windowSize={windowSize}
              maxToRenderPerBatch={windowSize}
              ref={swipRef}
              listViewRef={scrollRef}
              leftOpenValue={75}
              rightOpenValue={-75}
              disableRightSwipe
              data={data == false ? [] : data}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={{
                paddingVertical: 12,
              }}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              ListHeaderComponent={
                <ListHeader
                  search={search}
                  setsearch={c => setsearch(c)}
                  data={data}
                  totalUnread={totalUnread}
                />
              }
              ListFooterComponent={
                data.length > 0 && getDataOnce && <ListFooter />
              }
              ListEmptyComponent={
                getDataOnce && data.length <= 0 && <EmptyListMessage />
              }
              ItemSeparatorComponent={ItemSeparatorView}
              renderItem={({item, index}) => (
                <Card
                  item={item}
                  index={index}
                  refreshing={refreshing}
                  data={data}
                  user={user}
                  props={props}
                  setsearch={c => setsearch(c)}
                  closeSwipe={closeSwipe}
                />
              )}
              renderHiddenItem={({item, index}) => (
                <CardDelete
                  item={item}
                  index={index}
                  refreshing={refreshing}
                  deleteChat={(c, i) => deleteChat(c, i)}
                />
              )}
            />
          </View>

          <utils.Footer
            nav={props.navigation}
            screen={headerTitle}
            setsearch={() => setsearch('')}
            focusScreen={focusScreen}
            closeSwipe={() => closeSwipe()}
          />

          <utils.Loader load={loader} />
        </SafeAreaView>
      </View>
    </>
  );
}
