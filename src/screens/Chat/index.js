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
  KeyboardAvoidingView,
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

export default observer(Chat);

function Chat(props) {
  let maxModalHeight = theme.window.Height - 100;
  const [modalHeight, setmodalHeight] = useState(0);

  const [message, setmessage] = useState('');

  const toast = useRef(null);
  const toastduration = 700;

  let obj = props.route.params.obj || false;
  let headerTitle = props.route.params.title || '';

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
    console.warn('onrefresh cal');
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
        {/* {!mloader && getDataOnce && (
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
            No user found
          </Text>
        )} */}

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

  const renderHeader = () => {
    const render1 = () => {
      const onClick = () => {
        props.navigation.goBack();
      };
      let src = require('../../assets/images/back/img.png');
      return (
        <TouchableOpacity activeOpacity={0.5} onPress={onClick}>
          <Image
            source={src}
            style={{
              width: 20,
              height: 20,
              resizeMode: 'contain',
            }}
          />
        </TouchableOpacity>
      );
    };

    const render2 = () => {
      return (
        <View style={{width: '76%'}}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.headerTitle}>
            {headerTitle}
          </Text>
        </View>
      );
    };

    const render3 = () => {
      const onClick = () => {};
      let src = require('../../assets/images/back/img.png');
      return <View style={{width: 5}} />;
    };

    return (
      <View style={styles.headerConatainer}>
        {render1()}
        {render2()}
        {render3()}
      </View>
    );
  };

  const SendMessage = () => {};

  const onclickFile = () => {};

  const onclickEmoji = () => {};

  const renderFooter = () => {
    const renderOthers = () => {
      return (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: '98%',
            alignSelf: 'center',
          }}>
          <TouchableOpacity
            onPress={onclickFile}
            style={{}}
            activeOpacity={0.6}>
            <Image
              style={{width: 26, height: 26, resizeMode: 'contain'}}
              source={require('../../assets/images/sentfilemessage/img.png')}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onclickEmoji}
            style={{marginLeft: 20}}
            activeOpacity={0.6}>
            <Image
              style={{width: 27, height: 27, resizeMode: 'contain'}}
              source={require('../../assets/images/emojimessage/img.png')}
            />
          </TouchableOpacity>
        </View>
      );
    };

    const renderInputContainer = () => {
      let disable = message == '' ? true : false;
      return (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 10,
          }}>
          <View
            style={{
              width: '82%',
              backgroundColor: '#F2F3F1',
              borderRadius: 100,
              paddingHorizontal: 15,
            }}>
            <TextInput
              placeholder="Type a message"
              value={message}
              style={{width: '100%', borderRadius: 100}}
              onChangeText={t => {
                setmessage(t);
              }}
            />
          </View>

          <TouchableOpacity
            onPress={SendMessage}
            disabled={disable}
            style={{opacity: disable ? 0.5 : 1}}
            activeOpacity={0.8}>
            <Image
              style={{width: 47, height: 47, resizeMode: 'contain'}}
              source={require('../../assets/images/sendmessage/img.png')}
            />
          </TouchableOpacity>
        </View>
      );
    };

    return (
      <View
        style={{
          backgroundColor: theme.color.background,
          borderTopWidth: 1,
          borderTopColor: theme.color.fieldBorder,
          padding: 20,
        }}>
        {renderOthers()}
        {renderInputContainer()}
      </View>
    );
  };

  return (
    <>
      <View style={styles.container}>
        {renderHeader()}

        {!internet && <utils.InternetMessage />}
        <SafeAreaView style={styles.container2}>
          <KeyboardAvoidingView style={styles.container3}>
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
          </KeyboardAvoidingView>
          {renderFooter()}
        </SafeAreaView>
        <utils.Loader load={loader} />
        <Toast ref={toast} position="bottom" />
      </View>
    </>
  );
}
