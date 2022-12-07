//pagination scene
// import React, {useEffect, useState, useRef, useCallback} from 'react';
// import {
//   View,
//   Text,
//   SafeAreaView,
//   TouchableOpacity,
//   Image,
//   BackHandler,
//   Alert,
//   Pressable,
//   TextInput,
//   Keyboard,
//   RefreshControl,
// } from 'react-native';
// import {styles} from './styles';
// import {observer} from 'mobx-react';
// import store from '../../store/index';
// import utils from '../../utils/index';
// import theme from '../../theme';
// import NetInfo from '@react-native-community/netinfo';
// import {ActivityIndicator} from 'react-native-paper';
// import {SwipeListView} from 'react-native-swipe-list-view';
// import Card from './Card/index';
// import CardDelete from './CardDelete';

// export default observer(Inbox);

// function ItemSeparatorView() {
//   return (
//     <View
//       style={{
//         height: 0.7,
//         backgroundColor: theme.color.fieldBorder,
//         width: '100%',
//       }}
//     />
//   );
// }

// function ListHeader({search, setsearch, data, totalUnread}) {
//   const renderResult = () => {
//     return (
//       <View style={styles.resultContainer}>
//         <Text style={styles.resultText}>
//           {data.length} messages, {totalUnread} unread
//         </Text>
//       </View>
//     );
//   };

//   const renderSearch = () => {
//     return (
//       <TouchableOpacity disabled>
//         <Image
//           source={require('../../assets/images/searchBar/search/img.png')}
//           style={styles.Baricon}
//         />
//       </TouchableOpacity>
//     );
//   };

//   const renderInput = () => {
//     return (
//       <View style={{width: '85%'}}>
//         <TextInput
//           value={search}
//           style={styles.SerchBarInput}
//           placeholder="Search"
//           onChangeText={c => {
//             setsearch(c);
//           }}
//         />
//       </View>
//     );
//   };

//   const renderFilter = () => {
//     const onclick = () => {};

//     return (
//       <TouchableOpacity style={styles.Baricon} onPress={onclick} disabled>
//         {/* <Image
//           source={require('../../assets/images/searchBar/filter/img.png')}
//           style={styles.Baricon}
//         /> */}
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <View style={{marginHorizontal: 15}}>
//       <Pressable
//         style={({pressed}) => [
//           {opacity: pressed ? 0.9 : 1},
//           [styles.SerchBarContainer],
//         ]}
//         // onPress={onclickSearchBar}
//       >
//         {renderSearch()}
//         {renderInput()}
//         {renderFilter()}
//       </Pressable>
//       {data.length > 0 && renderResult()}
//     </View>
//   );
// }

// function ListFooter({data, d, loadMore, LoadMore}) {
//   return (
//     <>
//       <View style={styles.listFooter}>
//         {data.length == d.length && (
//           <Text style={styles.listFooterT}>End of messages</Text>
//         )}

//         {data.length < d.length && (
//           <View
//             style={[
//               styles.listFooter,
//               {flexDirection: 'row', alignItems: 'center'},
//             ]}>
//             <TouchableOpacity
//               activeOpacity={0.7}
//               disabled={loadMore}
//               onPress={LoadMore}>
//               <Text style={styles.listFooterT}>Load More...</Text>
//             </TouchableOpacity>
//             {loadMore && (
//               <ActivityIndicator
//                 style={{marginLeft: 10}}
//                 size={16}
//                 color={theme.color.button1}
//               />
//             )}
//           </View>
//         )}
//       </View>
//     </>
//   );
// }

// function EmptyListMessage() {
//   return (
//     // Flat List Item
//     <>
//       <Text
//         style={{
//           marginTop: '25%',
//           alignItems: 'center',
//           justifyContent: 'center',
//           alignSelf: 'center',
//           fontSize: 13,
//           color: theme.color.subTitleLight,
//           fontFamily: theme.fonts.fontMedium,
//         }}>
//         No Chats Found
//       </Text>
//     </>
//   );
// }

// function Inbox(props) {
//   let guest = require('../../assets/images/drawer/guest/img.png');
//   const scrollRef = useRef(null);
//   const swipRef = useRef(null);
//   const closeSwipe = () => {
//     swipRef?.current?.safeCloseOpenRow();
//   };

//   let headerTitle = 'Inbox';
//   let internet = store.General.isInternet;
//   let user = store.User.user;

//   const [search, setsearch] = useState('');
//   const [sdata, setsdata] = useState([]);

//   useEffect(() => {
//     if (search != '') {
//       BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
//     }

//     if (search == '') {
//       scrollToTop();

//       BackHandler.removeEventListener(
//         'hardwareBackPress',
//         handleBackButtonClick,
//       );
//     }

//     return () => {
//       BackHandler.removeEventListener(
//         'hardwareBackPress',
//         handleBackButtonClick,
//       );
//     };
//   }, [search]);

//   const scrollToTop = () => {
//     scrollRef?.current?.scrollToOffset({animated: false, offset: 0});
//   };

//   function handleBackButtonClick() {
//     if (!props.navigation.isFocused()) {
//       return false;
//     } else {
//       setsearch('');

//       return true;
//     }
//   }

//   useEffect(() => {
//     let data = [...store.User.inbox];
//     if (search != '') {
//       if (data.length > 0) {
//         let uid = user._id;
//         let ar = data.filter(item => {
//           let u = false;
//           if (item.userId1 && item.userId1._id != uid) {
//             u = item.userId1;
//           }
//           if (item.userId2 && item.userId2._id != uid) {
//             u = item.userId2;
//           }
//           let title = u.firstName + ' ' + u.lastName;

//           return title.toLowerCase().includes(search.toLowerCase());
//         });

//         setsdata(ar);
//       } else {
//         setsdata([]);
//       }
//     } else {
//       setsdata([]);
//     }
//   }, [search, store.User.inbox]);

//   let loader = store.User.dlc;
//   const d = search == '' ? store.User.inbox : sdata;
//   let totalUnread = store.User.unreadInbox;

//   let limit = 16;
//   const [page, setpage] = useState(1);
//   const [loadFirst, setloadFirst] = useState(false);
//   const [data, setdata] = useState(false);

//   const [loadMore, setloadMore] = useState(false);

//   const [getDataOnce, setgetDataOnce] = useState(false);
//   const setGetDataOnce = C => {
//     setgetDataOnce(C);
//   };
//   const refreshing = store.User.ibl || loadFirst;
//   const onRefresh = React.useCallback(() => {
//     console.warn('onrefresh cal');
//     if (user !== 'guest') {
//       getDbData();
//     }
//   }, []);
//   const getDbData = () => {
//     NetInfo.fetch().then(state => {
//       if (state.isConnected) {
//         store.User.attemptToGetInboxes(user._id, setGetDataOnce);
//       }
//     });
//   };

//   useEffect(() => {
//     if (internet) {
//       onRefresh();
//     }
//     return () => {};
//   }, [internet]);

//   useEffect(() => {
//     if (user == 'guest') {
//       store.General.setgoto('guestaccess');
//       store.User.Logout();
//       return;
//     }
//   }, []);

//   const LoadFirst = d => {
//     console.log('Load frst callllllllllllll ');
//     setloadFirst(true);
//     let page = 0;
//     let p = page + 1;
//     let ar = [...d];
//     const dt = ar.slice(page * limit, limit * p);

//     let dd = [...dt];

//     console.log('pagination callllll load first : ', page * limit, limit * p);
//     setdata(dd);
//     setpage(p);

//     setloadFirst(false);
//   };

//   const LoadMore = async () => {
//     setloadMore(true);
//     setTimeout(() => {
//       let p = page + 1;
//       let ar = [...d];
//       const dt = ar.slice(page * limit, limit * p);
//       let dd = [...data, ...dt];
//       console.log('pagination callllll load more : ', page * limit, limit * p);
//       setdata(dd);
//       setpage(p);
//       setloadMore(false);
//     }, 1);
//   };

//   useEffect(() => {
//     if (getDataOnce) {
//       if (d.length > 0) {
//         LoadFirst(d);
//       } else {
//         setdata([]);
//       }
//     }
//   }, [getDataOnce, d]);

//   console.log('d : ', d.length);
//   console.log('data : ', data.length);
//   console.log('loadmore : ', loadMore);

//   const deleteChat = (chatId, i) => {
//     Keyboard.dismiss();
//     NetInfo.fetch().then(state => {
//       if (state.isConnected) {
//         store.User.attemptToDeleteChat(
//           chatId,
//           i,
//           user._id,
//           // data,
//           // c => setdata(c),
//           // search,
//           // sdata,
//           // c => setdata(c),
//           closeSwipe,
//         );
//       } else {
//         // seterrorMessage('Please connect internet');
//         Alert.alert('', 'Please connect internet');
//       }
//     });
//   };

//   return (
//     <>
//       <View style={styles.container}>
//         <utils.DrawerHeader props={props} headerTitle={headerTitle} />
//         {!internet && <utils.InternetMessage />}
//         <SafeAreaView style={styles.container2}>
//           <View style={styles.container3}>
//             <SwipeListView
//               useFlatList
//               removeClippedSubviews
//               ref={swipRef}
//               listViewRef={scrollRef}
//               leftOpenValue={75}
//               rightOpenValue={-75}
//               disableRightSwipe
//               initialNumToRender={6}
//               maxToRenderPerBatch={6}
//               data={data == false ? [] : data}
//               keyExtractor={(item, index) => index.toString()}
//               contentContainerStyle={{
//                 paddingVertical: 12,
//               }}
//               refreshControl={
//                 <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//               }
//               ListHeaderComponent={
//                 <ListHeader
//                   search={search}
//                   setsearch={c => setsearch(c)}
//                   data={d}
//                   totalUnread={totalUnread}
//                 />
//               }
//               ListFooterComponent={
//                 data != false && data.length > 0 ? (
//                   <ListFooter
//                     data={data}
//                     d={d}
//                     loadMore={loadMore}
//                     LoadMore={LoadMore}
//                   />
//                 ) : null
//               }
//               ListEmptyComponent={
//                 getDataOnce &&
//                 !loadFirst &&
//                 data &&
//                 data.length <= 0 && <EmptyListMessage />
//               }
//               ItemSeparatorComponent={ItemSeparatorView}
//               renderItem={({item, index}) => (
//                 <Card
//                   item={item}
//                   index={index}
//                   refreshing={refreshing}
//                   data={data}
//                   user={store.User.user}
//                   props={props}
//                 />
//               )}
//               renderHiddenItem={({item, index}) => (
//                 <CardDelete
//                   item={item}
//                   index={index}
//                   refreshing={refreshing}
//                   deleteChat={(c, i) => deleteChat(c, i)}
//                 />
//               )}
//             />
//           </View>

//           <utils.Footer
//             nav={props.navigation}
//             screen={headerTitle}
//             setsearch={() => setsearch('')}
//             focusScreen={store.General.focusScreen}
//           />

//           <utils.Loader load={loader} />
//           {store.Notifications.isShowNotifcation && <utils.ShowNotifications />}
//         </SafeAreaView>
//       </View>
//     </>
//   );
// }

import React, {useEffect, useState, useRef, useCallback} from 'react';
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
import {ActivityIndicator} from 'react-native-paper';
import {SwipeListView} from 'react-native-swipe-list-view';
import Card from './Card/index';
import CardDelete from './CardDelete';

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
  let guest = require('../../assets/images/drawer/guest/img.png');
  const scrollRef = useRef(null);
  const swipRef = useRef(null);
  const closeSwipe = () => {
    swipRef?.current?.safeCloseOpenRow();
  };

  let headerTitle = 'Inbox';
  let internet = store.General.isInternet;
  let user = store.User.user;

  const [search, setsearch] = useState('');
  const [sdata, setsdata] = useState([]);

  let loader = store.User.dlc;
  const data = search == '' ? store.User.inbox : sdata;
  let totalUnread = store.User.unreadInbox;

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
    let data = [...store.User.inbox];
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
  }, [search, store.User.inbox]);

  const [getDataOnce, setgetDataOnce] = useState(false);
  const setGetDataOnce = C => {
    setgetDataOnce(C);
  };
  const refreshing = store.User.ibl;
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

  console.log('data : ', data.length);

  const deleteChat = (chatId, i) => {
    Keyboard.dismiss();
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        store.User.attemptToDeleteChat(
          chatId,
          i,
          user._id,
          search,
          sdata,
          c => setsdata(c),
          closeSwipe,
        );
      } else {
        // seterrorMessage('Please connect internet');
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
        {!internet && <utils.InternetMessage />}
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
                  user={store.User.user}
                  props={props}
                  setsearch={c => setsearch(c)}
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
            focusScreen={store.General.focusScreen}
          />

          <utils.Loader load={loader} />
          {store.Notifications.isShowNotifcation && <utils.ShowNotifications />}
        </SafeAreaView>
      </View>
    </>
  );
}
