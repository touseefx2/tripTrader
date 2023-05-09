import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  Alert,
  Modal,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Pressable,
} from 'react-native';
import {styles} from './styles';
import {observer} from 'mobx-react';
import store from '../../../store';
import NetInfo from '@react-native-community/netinfo';
import theme from '../../../theme';
import utils from '../../../utils/index';
import ProgressiveFastImage from '@freakycoder/react-native-progressive-fast-image';

export default observer(Photos);

function Photos(props) {
  let headerTitle = 'Photos';
  let internet = store.General.isInternet;
  // let user = store.Userv.user;
  // let data = store.Userv.photos;
  // let loader = store.Userv.photosLoader;
  let mloader = store.Userv.mLoader;

  let u = store.Userv.user;
  const [user, setuser] = useState(u);
  const [data, setdata] = useState([]);
  const [loader, setloader] = useState(false);

  const totalData = data.length;

  const [pvm, setpvm] = useState(false);
  const [si, setsi] = useState('');

  const [deletePObj, setdeletePObj] = useState(false);
  const [deleteModal, setdeleteModal] = useState(false);

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

  const getDbData = c => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        store.Userv.attemptToGetPhotos(
          user._id,
          setGetDataOnce,
          setrefeshing,
          c => setdata(c),
          c => setloader(c),
        );
      } else {
        setRefreshing(false);
      }
    });
  };

  useEffect(() => {
    if (!getDataOnce && internet) {
      getDbData();
    }
    return () => {};
  }, [getDataOnce, internet]);

  const deletePhoto = () => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        store.Userv.attemptToDeletePhotos(deletePObj, closeDeleteModal);
      } else {
        // seterrorMessage('Please connect internet');
        Alert.alert('', 'Please connect internet');
      }
    });
  };

  const photoClick = i => {
    setsi(i);
    setpvm(true);
  };

  const openDeleteModal = obj => {
    setdeletePObj(obj);
    setdeleteModal(true);
  };

  const closeDeleteModal = () => {
    if (!mloader) {
      setdeletePObj(false);
      setdeleteModal(false);
    }
  };

  const renderShowRes = () => {
    return (
      <View style={{marginVertical: 5}}>
        <Text
          style={{
            fontSize: 13,
            color: theme.color.subTitleLight,
            fontFamily: theme.fonts.fontMedium,
          }}>
          Showing {data.length} of {totalData}
        </Text>
      </View>
    );
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

  const renderMessage = c => {
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
          {c == 'empty' ? 'No photos added' : 'Please connect internet.'}
        </Text>
      </View>
    );
  };

  const renderShowData = ({item, index}) => {
    let tid = item.tid;
    let photo = item.uri ? item.uri : '';

    const renderPhotoCross = () => {
      return (
        <Pressable
          style={({pressed}) => [
            {opacity: pressed ? 0.7 : 1.0},
            styles.crossContainer,
          ]}
          onPress={() => openDeleteModal({uri: photo, tid: tid, i: index})}>
          <Image
            source={require('../../../assets/images/cross/img.png')}
            style={{width: 9, height: 9, resizeMode: 'contain'}}
          />
        </Pressable>
      );
    };

    return (
      <Pressable
        style={({pressed}) => [
          {opacity: pressed ? 0.9 : 1.0},
          [styles.ProfileImgContainer, {marginTop: index < 3 ? 12 : 0}],
        ]}
        onPress={() => photoClick(index)}>
        <ProgressiveFastImage
          style={styles.ProfileImg}
          source={{uri: photo}}
          loadingImageStyle={styles.imageLoader}
          loadingSource={require('../../../assets/images/imgLoad/img.jpeg')}
          blurRadius={3}
        />
        {/* {renderPhotoCross()} */}
      </Pressable>
    );
  };

  const renderDeleteModal = () => {
    const renderCross = () => {
      return (
        <Pressable
          disabled={mloader}
          style={({pressed}) => [
            {opacity: pressed ? 0.7 : 1.0},
            styles.modalCross,
          ]}
          onPress={closeDeleteModal}>
          <utils.vectorIcon.Ionicons
            name="ios-close-outline"
            color={theme.color.title}
            size={32}
          />
        </Pressable>
      );
    };

    const renderTitle = () => {
      return <Text style={styles.modalTitle}>delete photo?</Text>;
    };

    const renderImage = () => {
      return (
        <View style={styles.modalImgContainer}>
          <ProgressiveFastImage
            useNativeDriver
            style={styles.modalImg}
            source={{uri: deletePObj.uri}}
            loadingImageStyle={styles.modalImageLoader}
            loadingSource={require('../../../assets/images/imgLoad/img.jpeg')}
            blurRadius={5}
          />
        </View>
      );
    };

    const renderBottom = () => {
      const renderTitle = () => {
        return (
          <Text style={styles.modalBottomTitle}>
            This action cannot be undone.
          </Text>
        );
      };

      const renderButton1 = () => {
        return (
          <Pressable
            disabled={mloader}
            style={({pressed}) => [
              {opacity: pressed ? 0.7 : 1.0},
              styles.ButtonContainer,
            ]}
            onPress={deletePhoto}>
            {mloader && (
              <ActivityIndicator size={20} color={theme.color.buttonText} />
            )}
            {!mloader && (
              <Text style={styles.ButtonText}>Yes, delete photo</Text>
            )}
          </Pressable>
        );
      };

      const renderButton2 = () => {
        return (
          <Pressable
            disabled={mloader}
            style={({pressed}) => [
              {opacity: pressed ? 0.7 : 1.0},
              styles.ButtonContainer,
              {backgroundColor: theme.color.button2},
            ]}
            onPress={closeDeleteModal}>
            <Text style={[styles.ButtonText, {color: '#30563A'}]}>
              No, keep it
            </Text>
          </Pressable>
        );
      };

      return (
        <View style={styles.modalBottomContainer}>
          {renderTitle()}
          {renderButton1()}
          {renderButton2()}
        </View>
      );
    };

    return (
      <Modal
        visible={deleteModal}
        transparent
        onRequestClose={closeDeleteModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modal}>
            {renderTitle()}
            {renderCross()}
            {renderImage()}
            {renderBottom()}
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{marginTop: 3}}>
        {getDataOnce && data.length <= 0 && !loader && renderMessage('empty')}

        {data.length >= 0 && (
          <FlatList
            decelerationRate={0.6}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            showsVerticalScrollIndicator={false}
            numColumns={3}
            initialNumToRender={18}
            maxToRenderPerBatch={6}
            data={data}
            extraData={data}
            renderItem={renderShowData}
            keyExtractor={(item, index) => index.toString()}
          />
        )}
      </View>
      {!getDataOnce && loader && renderLoader()}

      {pvm && (
        <utils.FullimageModal
          data={data}
          si={si}
          show={pvm}
          closModal={() => setpvm(!pvm)}
        />
      )}
      {deleteModal && renderDeleteModal()}
    </SafeAreaView>
  );
}
