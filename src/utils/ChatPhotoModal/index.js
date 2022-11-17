import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  TextInput,
  Pressable,
  FlatList,
  Linking,
  PermissionsAndroid,
} from 'react-native';
import {styles} from './styles';
import {observer} from 'mobx-react';
import Modal from 'react-native-modal';
import store from '../../store/index';
import utils from '../index';
import theme from '../../theme';
import FastImage from 'react-native-fast-image';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-easy-toast';
import MaskedView from '@react-native-community/masked-view';
import Svg, {Path} from 'react-native-svg';
import {responsiveHeight} from 'react-native-responsive-dimensions';
import {Utils} from '@react-native-firebase/app';

import IntentLauncher from 'react-native-intent-launcher';
import {request, PERMISSIONS, check} from 'react-native-permissions';
import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';
import {Image as ImageCompressor} from 'react-native-compressor';

export default observer(ChatPhotoModal);

function ChatPhotoModal(props) {
  let isAddPhotoModal = props.isAddPhotoModal;
  let isShowPrmsn = props.isShowPrmsn;
  let prmsnChk = props.prmsnChk;
  let DT = 'ChatPhotos';

  const setisAddPhotoModal = c => {
    props.isAddPhotoModal(c);
  };
  const setisShowPrmsn = c => {
    props.setisSowPrmsn(c);
  };
  const setprmsnChk = c => {
    props.setprmsnChk(c);
  };
  const closeAddPhotoModal = () => {
    props.ClosePhotoModal();
  };

  const MultipleImage = async button => {
    setisShowPrmsn(false);

    let apiLevel = store.General.apiLevel;
    try {
      let options = {
        mediaType: 'image',
        isPreview: false,
        singleSelectedMode: true,
      };

      const res = await MultipleImagePicker.openPicker(options);
      if (res) {
        console.log('mutipicker image res true  ');
        const {path, fileName, mime} = res;
        let uri = path;
        if (Platform.OS == 'android' && apiLevel < 29) {
          uri = 'file://' + uri;
        }

        ImageCompressor.compress(uri, {
          compressionMethod: 'auto',
        })
          .then(async res => {
            let imageObject = {
              uri: res,
              type: mime,
              fileName: fileName,
            };
            console.log('Compress image  : ', imageObject);
            if (button == 'ChatPhotos') {
              return;
            } else {
              return;
            }
          })
          .catch(err => {
            console.log('Image compress error : ', err);
          });
      }
    } catch (error) {
      setisAddPhotoModal(false);
      console.log('multi photo picker error : ', error);
    }
  };

  const onclickImage = c => {
    MultipleImage(c);
  };

  const reqPermission = async () => {
    if (Platform.OS == 'android') {
      try {
        const reqPer = await PermissionsAndroid.request(
          PERMISSIONS.ANDROID.CAMERA,
        );

        if (reqPer == 'never_ask_again') {
          let title = 'Camera Permission Blocked';
          let text = 'Please allow grant permission to acces camera';

          Alert.alert(title, text, [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: 'Open Settings',
              onPress: () => {
                IntentLauncher.startActivity({
                  action: 'android.settings.APPLICATION_DETAILS_SETTINGS',
                  data: 'package:' + store.General.package,
                });
              },
            },
          ]);

          return;
        }

        if (reqPer == 'granted') {
          const reqPer2 = await PermissionsAndroid.request(
            PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
          );

          if (reqPer2 == 'never_ask_again') {
            let title = 'Storage Permission Blocked';
            let text =
              'Please allow grant permission to acces photos in storage';

            Alert.alert(title, text, [
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {
                text: 'Open Settings',
                onPress: () => {
                  IntentLauncher.startActivity({
                    action: 'android.settings.APPLICATION_DETAILS_SETTINGS',
                    data: 'package:' + store.General.package,
                  });
                },
              },
            ]);
            return;
          }

          if (reqPer2 == 'granted') {
            props.onclickImage(DT);
          }
        }
      } catch (error) {
        console.log('req permsiion error : ', error);
      }
    }

    if (Platform.OS == 'ios') {
      const pc = await check(PERMISSIONS.IOS.CAMERA);
      const pp = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);

      if (pc == 'blocked' || pp == 'blocked') {
        let title =
          pc == 'blocked'
            ? 'Camera Permission Blocked'
            : 'Photo Permission Blocked';
        let text =
          pc == 'blocked'
            ? 'Please allow grant permission to acces camera'
            : 'Please allow grant permission to acces all photos';
        Alert.alert(title, text, [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'Open Settings',
            onPress: () => {
              Linking.openURL('app-settings:');
            },
          },
        ]);
        return;
      }

      if (pp == 'limited') {
        let title = 'Photo Permission Limited';
        let text = 'Please allow grant permission to select all photos';
        Alert.alert(title, text, [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'Open Settings',
            onPress: () => {
              Linking.openURL('app-settings:');
              //react-native-permissions // openSettings('App-Prefs:root=Photos');
            },
          },
        ]);
        return;
      }

      try {
        const reqPer = await request(PERMISSIONS.IOS.CAMERA);
        if (reqPer == 'granted') {
          const reqPer2 = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
          if (reqPer2 == 'granted') {
            props.onclickImage(DT);
          }
        }
      } catch (error) {
        console.log('req permsiion error : ', error);
      }
    }
  };

  const checkPermsn = async c => {
    if (Platform.OS == 'android') {
      const permissionAndroid = await check(PERMISSIONS.ANDROID.CAMERA);
      const permissionAndroid2 = await check(
        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      );

      if (permissionAndroid != 'granted' || permissionAndroid2 != 'granted') {
        setisShowPrmsn(true);
        setprmsnChk(c);
      } else {
        props.onclickImage(DT);
      }
    }

    if (Platform.OS == 'ios') {
      try {
        const permissionIos = await check(PERMISSIONS.IOS.CAMERA);
        const permissionIos2 = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);

        if (permissionIos != 'granted' || permissionIos2 != 'granted') {
          setisShowPrmsn(true);
          setprmsnChk(c);
        } else {
          onclickImage(DT);
        }
      } catch (error) {
        console.warn('Permsiion error : ', error);
      }
    }
  };

  const renderCross = () => {
    return (
      <Pressable
        style={({pressed}) => [
          {opacity: pressed ? 0.7 : 1.0},
          {position: 'absolute', top: 15, right: 15},
        ]}
        onPress={closeAddPhotoModal}>
        <utils.vectorIcon.Ionicons
          name="ios-close-outline"
          color={theme.color.title}
          size={32}
        />
      </Pressable>
    );
  };

  const renderButtonPermission = () => {
    return (
      <View
        style={{
          marginTop: 10,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity
          onPress={reqPermission}
          activeOpacity={0.7}
          style={styles.BottomButtonP}>
          <Text style={styles.buttonPTextBottom}>Yes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setisShowPrmsn(false);
          }}
          activeOpacity={0.7}
          style={styles.BottomButtonP}>
          <Text style={styles.buttonPTextBottom}>No</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Modal
      isVisible={isAddPhotoModal}
      backdropOpacity={1}
      backdropColor="white"
      animationIn="fadeIn"
      animationOut="fadeOut"
      coverScreen={false}
      deviceHeight={Dimensions.get('screen').height}
      style={{padding: 0, margin: 0}}
      onBackButtonPress={closeAddPhotoModal}>
      <SafeAreaView style={styles.modalContainerp}></SafeAreaView>
    </Modal>
  );
}
