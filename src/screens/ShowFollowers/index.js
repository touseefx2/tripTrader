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

export default observer(ShowFollowers);

function ShowFollowers(props) {
  let maxModalHeight = theme.window.Height - 100;
  const [modalHeight, setmodalHeight] = useState(0);

  let chk = props.route.params.chk || '';
  let cc = props.route.params.cc || '';
  let headerTitle = props.route.params.user || '';

  let fscreen = store.User.fscreen || '';
  let db = false;
  if (fscreen == 'Home') {
    db = true;
  }

  let internet = store.General.isInternet;
  let user = cc == 'my' ? store.User.user : store.Userv.user;
  let data = [];
  if (cc == 'my') {
    data = chk == 'followers' ? store.User.followers : store.User.following;
  } else {
    data = chk == 'followers' ? store.Userv.followers : store.Userv.following;
  }
  let mloader = store.User.fl;
  let total = 0;
  if (cc == 'my') {
    total =
      chk == 'followers'
        ? store.User.totalfollowers
        : store.User.totalfollowing;
  } else {
    total =
      chk == 'followers'
        ? store.Userv.totalfollowers
        : store.Userv.totalfollowing;
  }

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
  const getDbData = () => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        if (chk == 'followers') {
          if (cc == 'my') {
            store.User.attemptToGetFollowers(
              user._id,
              setGetDataOnce,
              setrefeshing,
            );
          } else {
            store.Userv.attemptToGetFollowers(
              user._id,
              setGetDataOnce,
              setrefeshing,
            );
          }
        } else {
          if (cc == 'my') {
            store.User.attemptToGetFollowing(
              user._id,
              setGetDataOnce,
              setrefeshing,
            );
          } else {
            store.Userv.attemptToGetFollowing(
              user._id,
              setGetDataOnce,
              setrefeshing,
            );
          }
        }
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
            {chk == 'followers' ? 'No Follower Found' : 'No Followeing Found'}
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
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              color: '#3C6B49',
              fontSize: 15,
              fontFamily: theme.fonts.fontBold,
              lineHeight: 23,
              textTransform: 'capitalize',
            }}>
            {userName}
          </Text>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Image
              source={src}
              style={{
                width: 20,
                height: 20,
                resizeMode: 'contain',
              }}
            />
            <View style={{width: '94%'}}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  color: theme.color.subTitleLight,
                  fontSize: 13,
                  top: 2,
                  fontFamily: theme.fonts.fontMedium,
                  textTransform: 'capitalize',
                  lineHeight: 25,
                }}>
                {location}
              </Text>
            </View>
          </View>
        </View>
      );
    };

    return (
      <View
        style={[styles.modalinfoConatiner, {marginTop: index == 0 ? 15 : 0}]}>
        {renderProfile()}
        {renderText()}
      </View>
    );
  };

  const ListHeader = () => {
    let t = chk == 'followers' ? 'Followers' : 'Following';
    let num = total;
    return (
      <View style={{width: '100%'}}>
        <Text
          style={{
            color: '#101B10',
            fontSize: 16,
            fontFamily: theme.fonts.fontBold,

            textTransform: 'capitalize',
          }}>
          {t} ({num})
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
          screen={'followers'}
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
              // ListHeaderComponent={data.length > 0 ? ListHeader : null}
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
            screen={'Followers'}
            focusScreen={store.General.focusScreen}
          />
        </SafeAreaView>
      </View>
    </>
  );
}
