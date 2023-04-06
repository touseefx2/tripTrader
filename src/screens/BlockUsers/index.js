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
  Pressable,
  TextInput,
  FlatList,
  ScrollView,
  Keyboard,
  Modal,
  RefreshControl,
} from 'react-native';
import ProgressiveFastImage from '@freakycoder/react-native-progressive-fast-image';
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

export default observer(BlockUsers);

function BlockUsers(props) {
  let maxModalHeight = theme.window.Height - 100;
  const [modalHeight, setmodalHeight] = useState(0);
  const toast = useRef(null);
  const toastduration = 700;
  let headerTitle = 'Blocked Users';

  let fscreen = store.User.fscreen || '';
  let db = false;
  if (fscreen == 'confirmedtrips' || fscreen == 'home') {
    db = true;
  }

  let internet = store.General.isInternet;
  let user = store.User.user;
  const data = store.User.blockUsers;
  let mloader = store.User.fl;
  let loader = store.User.bl;
  let total = store.User.totalblockUsers;

  const [getDataOnce, setgetDataOnce] = useState(false);
  const setGetDataOnce = C => {
    setgetDataOnce(C);
  };
  const [refreshing, setRefreshing] = React.useState(false);
  const setrefeshing = c => {
    setRefreshing(c);
  };
  const onRefresh = React.useCallback(() => {
    console.log('onrefresh cal');
    setRefreshing(true);
    getDbData();
  }, []);
  const getDbData = () => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        store.User.attemptToGetBloackUsers(
          user._id,
          setGetDataOnce,
          setrefeshing,
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

  const sucUnblock = () => {
    toast?.current?.show('User unblock', toastduration);
  };

  const unblokUser = (uid, i) => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        store.User.attemptToUnblockUser(uid, i, sucUnblock);
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
          height: 10,
        }}
      />
    );
  };

  const EmptyListMessage = () => {
    return (
      // Flat List Item
      <>
        {!mloader && getDataOnce && (
          <Text
            style={{
              marginTop: '80%',
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'center',
              fontSize: 13,
              color: theme.color.title,
              fontFamily: theme.fonts.fontMedium,
              opacity: 0.4,
            }}
            onPress={() => getItem(item)}>
            No users found
          </Text>
        )}

        {mloader && !getDataOnce && (
          <ActivityIndicator
            size={30}
            color={theme.color.button1}
            style={{
              marginTop: '80%',

              alignSelf: 'center',
            }}
          />
        )}
      </>
    );
  };

  let src = require('../../assets/images/locationPin/img.png');
  const ItemView = ({item, index}) => {
    let usrr = item.userId;
    //user
    let photo = usrr.image || '';
    let userName = usrr.firstName + ' ' + usrr.lastName;
    let location = usrr.location ? usrr.location : 'Pakistan';

    const renderProfile = () => {
      return (
        <View style={styles.mProfileImgContainer}>
          <ProgressiveFastImage
            style={styles.mProfileImg}
            source={
              photo != ''
                ? {uri: photo}
                : require('../../assets/images/drawer/guest/img.png')
            }
            loadingImageStyle={styles.mimageLoader}
            loadingSource={require('../../assets/images/imgLoad/img.jpeg')}
            blurRadius={5}
          />
          {/* {isVeirfy && (
            <Image
              style={styles.miconVerify}
              source={require('../../assets/images/verified/img.png')}
            />
          )} */}
        </View>
      );
    };

    const renderText = () => {
      return (
        <View style={styles.mtextContainer}>
          <Text
            style={{
              color: theme.color.title,
              fontSize: 14,
              fontFamily: theme.fonts.fontNormal,
              textTransform: 'capitalize',
            }}>
            {userName}
          </Text>
        </View>
      );
    };

    return (
      <View
        style={[styles.modalinfoConatiner, {marginTop: index == 0 ? 15 : 0}]}>
        <View
          style={{
            width: '78%',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          {renderProfile()}
          {renderText()}
        </View>

        <Pressable
          onPress={() => unblokUser(usrr._id, index)}
          style={({pressed}) => [
            {
              opacity: pressed ? 0.7 : 1.0,
              width: '20%',
              alignItems: 'flex-end',
            },
          ]}>
          <Text
            style={{
              top: 10,
              color: '#3C6B49',
              fontSize: 14,
              fontFamily: theme.fonts.fontBold,
              textTransform: 'capitalize',
            }}>
            Unblock
          </Text>
        </Pressable>
      </View>
    );
  };

  const ListHeader = () => {
    let num = total;
    let t = `You have ${num} ${num > 1 ? 'users' : 'user'} blocked`;
    return (
      <View style={{width: '100%'}}>
        <Text
          style={{
            color: theme.color.subTitle,
            fontSize: 13,
            fontFamily: theme.fonts.fontNormal,
          }}>
          {t}
        </Text>
      </View>
    );
  };

  const ListFooter = () => {
    return (
      <>
        <View>
          <View style={styles.listFooter}>
            <Text style={styles.listFooterT}>End of results</Text>
          </View>
        </View>
      </>
    );
  };

  return (
    <>
      <View style={styles.container}>
        <utils.StackHeader
          bell={true}
          props={props}
          headerTitle={headerTitle}
          screen={headerTitle}
        />
        {!internet && <utils.InternetMessage />}
        <SafeAreaView style={styles.container2}>
          <View style={styles.container3}>
            <FlatList
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              contentContainerStyle={{
                paddingVertical: 15,
                paddingHorizontal: 15,
              }}
              data={data}
              renderItem={ItemView}
              keyExtractor={(item, index) => index.toString()}
              ListEmptyComponent={EmptyListMessage}
              ItemSeparatorComponent={ItemSeparatorView}
              ListHeaderComponent={data.length > 0 ? ListHeader : null}
              // ListFooterComponent={data.length > 0 ? ListFooter : null}
            />
            {data.length > 0 && !getDataOnce && mloader && (
              <ActivityIndicator
                size={30}
                color={theme.color.button1}
                style={{
                  top: '50%',
                  position: 'absolute',
                  alignSelf: 'center',
                }}
              />
            )}
          </View>

          <utils.Footer
            doubleBack={db}
            nav={props.navigation}
            screen={headerTitle}
            focusScreen={store.General.focusScreen}
          />
        </SafeAreaView>
        <utils.Loader load={loader} />
        <Toast ref={toast} position="bottom" />
      </View>
    </>
  );
}
