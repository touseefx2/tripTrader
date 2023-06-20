import React, {useEffect, useState, useRef, useCallback} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Alert,
  Pressable,
  FlatList,
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

export default observer(BlockUsers);

function BlockUsers(props) {
  const toast = useRef(null);
  const toastduration = 700;
  const headerTitle = 'Blocked Users';

  const {isInternet, focusScreen} = store.General;
  const {user, blockUsers, totalblockUsers, followerLoader, blockLoader} =
    store.User;

  const [getDataOnce, setgetDataOnce] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!getDataOnce && isInternet) {
      getDbData();
    }
    return () => {};
  }, [getDataOnce, isInternet]);

  const onRefresh = useCallback(() => {
    console.log('onrefresh cal');
    setRefreshing(true);
    getDbData();
  }, []);

  const getDbData = () => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        store.User.attemptToGetBloackUsers(
          user._id,
          setgetDataOnce,
          setRefreshing,
          '',
        );
      } else {
        setRefreshing(false);
      }
    });
  };

  const successUnblock = () => {
    toast?.current?.show('User unblock', toastduration);
  };

  const goBackMain = () => {
    props.navigation.goBack();
  };

  const unBlockUser = (userId, index) => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        store.User.attemptToUnblockUser(
          userId,
          index,
          successUnblock,
          goBackMain,
        );
      } else {
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
      <>
        {!followerLoader && getDataOnce && (
          <Text style={styles.emptyTitle} onPress={() => getItem(item)}>
            No users found
          </Text>
        )}

        {followerLoader && !getDataOnce && (
          <ActivityIndicator
            size={30}
            color={theme.color.button1}
            style={styles.emptyLoader}
          />
        )}
      </>
    );
  };

  const ItemView = ({item, index}) => {
    const usrr = item.userId || null;
    const photo = usrr.image || '';
    const userName = usrr.firstName + ' ' + usrr.lastName;

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
        </View>
      );
    };

    const renderText = () => {
      return (
        <View style={styles.mtextContainer}>
          <Text style={styles.title}>{userName}</Text>
        </View>
      );
    };

    if (item.blockedBy == true) return null;
    else {
      return (
        <View
          style={[styles.modalinfoConatiner, {marginTop: index == 0 ? 15 : 0}]}>
          <View style={styles.section1}>
            {renderProfile()}
            {renderText()}
          </View>

          <Pressable
            onPress={() => unBlockUser(usrr._id, index)}
            style={({pressed}) => [
              {
                opacity: pressed ? 0.7 : 1.0,
              },
              styles.section2,
            ]}>
            <Text style={styles.title2}>Unblock</Text>
          </Pressable>
        </View>
      );
    }
  };

  const ListHeader = () => {
    const total = `You have ${totalblockUsers} ${
      totalblockUsers > 1 ? 'users' : 'user'
    } blocked`;
    return (
      <View style={{width: '100%'}}>
        <Text style={styles.headerTitle}>{total}</Text>
      </View>
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
        {!isInternet && <utils.InternetMessage />}
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
              data={blockUsers}
              renderItem={ItemView}
              keyExtractor={(item, index) => index.toString()}
              ListEmptyComponent={EmptyListMessage}
              ItemSeparatorComponent={ItemSeparatorView}
              ListHeaderComponent={blockUsers.length > 0 ? ListHeader : null}
            />
            {blockUsers.length > 0 && !getDataOnce && followerLoader && (
              <ActivityIndicator
                size={30}
                color={theme.color.button1}
                style={styles.loader}
              />
            )}
          </View>

          <utils.Footer
            nav={props.navigation}
            screen={headerTitle}
            focusScreen={focusScreen}
          />
        </SafeAreaView>
        <utils.Loader load={blockLoader} />
        <Toast ref={toast} position="bottom" />
      </View>
    </>
  );
}
