import React, {useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  TextInput,
  Pressable,
  Linking,
  PermissionsAndroid,
  Keyboard,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import {styles} from './styles';
import {observer} from 'mobx-react';
import Modal from 'react-native-modal';
import store from '../../store/index';
import utils from '../index';
import theme from '../../theme';
import NetInfo from '@react-native-community/netinfo';
import IntentLauncher from 'react-native-intent-launcher';
import {request, PERMISSIONS, check} from 'react-native-permissions';
import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';
import {Image as ImageCompressor} from 'react-native-compressor';
import {
  responsiveFontSize,
  responsiveHeight,
} from 'react-native-responsive-dimensions';

export default observer(ChatPhotoModal);

function ChatPhotoModal(props) {
  let isAddPhotoModal = props.isAddPhotoModal;
  let isShowPrmsn = props.isShowPrmsn;
  let prmsnChk = props.prmsnChk;
  let DT = 'ChatPhotos';
  let maxPhotos = 4;
  let photos = props.photos;
  let pmessage = props.pmessage;
  let loader = store.User.chatmsgSendLoader;

  const [pvm, setpvm] = useState(false);
  const [si, setsi] = useState(0);

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
    setsi(0);
    setpvm('');
  };
  const setphotos = c => {
    props.setphotos(c);
  };
  const setpmessage = c => {
    props.setpmessage(c);
  };

  const MultipleImage = async chk => {
    setisShowPrmsn(false);
    const apiLevel = store.General.apiLevel;
    Keyboard.dismiss();

    let d = photos.length;
    let max = maxPhotos;
    let msg = 'You can upload only ' + max + ' images';
    if (d == max) {
      Alert.alert('', msg);
      return;
    }
    let maxPhotos = 4 - photos.length;

    setTimeout(async () => {
      try {
        let options = {
          mediaType: 'image',
          isPreview: false,
          maxSelectedAssets: maxPhotos,
        };
        const res = await MultipleImagePicker.openPicker(options);
        if (res) {
          console.log('mutipicker image res true  ');
          let data = photos.slice();
          let ar = data;

          if (data.length > 0) {
            res.map((e, i, a) => {
              let uri = e.path;
              let fileName = e.fileName;
              let type = e.mime;

              if (Platform.OS == 'android' && apiLevel < 29) {
                uri = 'file://' + uri;
              }

              ImageCompressor.compress(uri, {
                compressionMethod: 'auto',
              })
                .then(async res => {
                  const imageObject = {uri: res, fileName, type};
                  console.log('Compress image  : ', imageObject);
                  let isAlreadySelectimage = data.find(
                    x => x.fileName == fileName,
                  )
                    ? true
                    : false;

                  if (chk == 'ChatPhotos' && !isAlreadySelectimage) {
                    ar.push(imageObject);
                  }

                  if (i == a.length - 1) {
                    setphotos(ar);
                  }
                })
                .catch(err => {
                  console.log('Image compress error : ', err);
                });
            });
          } else {
            res.map((e, i, a) => {
              let uri = e.path;
              let fileName = e.fileName;
              let type = e.mime;

              if (Platform.OS == 'android' && apiLevel < 29) {
                uri = 'file://' + uri;
              }

              ImageCompressor.compress(uri, {
                compressionMethod: 'auto',
              })
                .then(async res => {
                  let imageObject = {uri: res, fileName, type};
                  console.log('Compress image  : ', imageObject);
                  if (chk == 'ChatPhotos') {
                    ar.push(imageObject);
                  }
                  if (i == a.length - 1) {
                    setphotos(ar);
                  }
                })
                .catch(err => {
                  console.log('Image compress error : ', err);
                });
            });
          }
        }
      } catch (error) {
        console.log('multi photo picker error : ', error);
      }
    }, 200);
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
            onclickImage(DT);
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
            onclickImage(DT);
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
        onclickImage(DT);
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

  const deletePhoto = i => {
    let p = photos.slice();
    p.splice(i, 1);
    setphotos(p);
  };

  const photoClick = i => {
    setsi(i);
    setpvm(true);
  };

  const renderShowPhotos = () => {
    let p = photos.map((e, i, a) => {
      let uri = e.uri;

      const renderPhotoCross = () => {
        return (
          <Pressable
            disabled={loader}
            style={({pressed}) => [
              {opacity: pressed ? 0.7 : 1.0},
              styles.crossContainer,
            ]}
            onPress={() => deletePhoto(i)}>
            <Image
              source={require('../../assets/images/cross/img.png')}
              style={{width: 9, height: 9, resizeMode: 'contain'}}
            />
          </Pressable>
        );
      };
      return (
        <>
          {a.length == maxPhotos && (
            <Pressable
              disabled={loader}
              onPress={() => photoClick(i)}
              style={({pressed}) => [
                {opacity: pressed ? 0.9 : 1.0},
                [styles.addImgContainer, {marginTop: 15}],
              ]}>
              <Image style={styles.addImg} source={{uri: uri}} />

              {renderPhotoCross()}
            </Pressable>
          )}

          {a.length < maxPhotos && (
            <>
              <Pressable
                disabled={loader}
                onPress={() => photoClick(i)}
                style={({pressed}) => [
                  {opacity: pressed ? 0.9 : 1.0},
                  [styles.addImgContainer, {marginTop: 15}],
                ]}>
                <Image style={styles.addImg} source={{uri: uri}} />
                {renderPhotoCross()}
              </Pressable>

              {i == a.length - 1 && (
                <Pressable
                  disabled={loader}
                  onPress={() => onclickImage(DT)}
                  style={({pressed}) => [
                    {opacity: pressed ? 0.8 : 1.0},
                    [
                      styles.addImgContainer,
                      {
                        marginTop: 15,
                        borderStyle: 'dashed',
                        borderColor: theme.color.button1,
                        backgroundColor: '#F2F3F1',
                        alignItems: 'center',
                        justifyContent: 'center',
                      },
                    ],
                  ]}>
                  <utils.vectorIcon.Feather
                    name="plus"
                    color={theme.color.button1}
                    size={24}
                  />
                </Pressable>
              )}
            </>
          )}
        </>
      );
    });

    return p;
  };

  const photoUploadSuc = c => {
    setphotos(c);
    props.SendMessage(c);
  };

  const uploadPhotos = () => {
    Keyboard.dismiss();

    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        store.User.attemptToChatUploadImage(photos, photoUploadSuc);
      } else {
        // seterrorMessage('Please connect internet');
        Alert.alert('', 'Please connect internet');
      }
    });
  };

  return (
    <Modal
      isVisible={isAddPhotoModal}
      backdropOpacity={1}
      backdropColor="rgba(0,0,0,0.6)"
      animationIn="slideInLeft"
      animationOut="slideOutRight"
      coverScreen={false}
      deviceWidth={theme.window.Width}
      deviceHeight={theme.window.Height}
      style={{padding: 0, margin: 0}}
      onBackButtonPress={closeAddPhotoModal}>
      <KeyboardAvoidingView
        behavior={Platform.OS == 'ios' ? 'height' : undefined}
        style={styles.modalContainerp}>
        <View style={styles.modalp}>
          {!isShowPrmsn && (
            <>
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <Text style={styles.section2Title1}>Add photos</Text>
              </View>

              <View style={{marginTop: 10}}>
                <Text style={styles.section2Title2}>
                  Please select photos to send
                </Text>
              </View>

              <View style={styles.fieldContainer}>
                {photos.length <= 0 && (
                  <TouchableOpacity
                    onPress={() => checkPermsn('gallery')}
                    activeOpacity={0.7}
                    style={{
                      width: '80%',
                      alignSelf: 'center',
                      borderRadius: 12,
                      borderWidth: 2,
                      borderStyle: 'dashed',
                      borderColor: theme.color.button1,
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 10,
                      height: 60,
                      backgroundColor: '#F2F3F1',
                    }}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Image
                        source={require('../../assets/images/add_photo/img.png')}
                        style={{
                          width: 24,
                          height: 24,
                          resizeMode: 'contain',
                          marginRight: 10,
                        }}
                      />

                      <Text
                        style={[
                          styles.fieldText2,
                          {
                            fontFamily: theme.fonts.fontBold,
                            fontSize: 14,
                            color: theme.color.button1,
                          },
                        ]}>
                        Select Photos
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
                {photos.length > 0 && (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      flexShrink: 1,
                      flexWrap: 'wrap',
                    }}>
                    {renderShowPhotos()}
                  </View>
                )}
              </View>

              {photos.length > 0 && (
                <>
                  <View
                    style={{
                      marginTop: 50,
                    }}>
                    {!loader && (
                      <>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginTop: 10,
                          }}>
                          <View
                            style={{
                              width: '81%',
                              backgroundColor: '#F2F3F1',
                              borderRadius: 100,
                              paddingHorizontal: 15,
                            }}>
                            <TextInput
                              placeholder="Add a caption..."
                              value={pmessage}
                              style={{
                                width: '100%',
                                height: responsiveHeight(5.8),
                                fontSize: responsiveFontSize(1.65),
                                borderRadius: 100,
                              }}
                              onChangeText={t => {
                                setpmessage(t);
                              }}
                            />
                          </View>

                          <TouchableOpacity
                            onPress={uploadPhotos}
                            activeOpacity={0.8}>
                            <Image
                              style={{
                                width: responsiveFontSize(5.5),
                                height: responsiveFontSize(5.5),
                                resizeMode: 'contain',
                              }}
                              source={require('../../assets/images/sendmessage/img.png')}
                            />
                          </TouchableOpacity>
                        </View>
                      </>
                    )}

                    {loader && (
                      <ActivityIndicator
                        color={theme.color.button1}
                        size={40}
                        style={{alignSelf: 'center', marginVertical: 10}}
                      />
                    )}
                  </View>
                </>
              )}

              {!loader && (
                <TouchableOpacity
                  onPress={closeAddPhotoModal}
                  activeOpacity={0.7}
                  style={{
                    marginTop: 40,
                    width: '100%',
                    height: 48,
                    borderRadius: 12,
                    backgroundColor: '#B93B3B',
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'center',
                  }}>
                  <Text
                    style={[
                      styles.buttonTextBottom,
                      {
                        color: theme.color.buttonText,
                        fontFamily: theme.fonts.fontMedium,
                      },
                    ]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              )}
            </>
          )}
          {isShowPrmsn && (
            <>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={styles.section2Title1}>
                  {prmsnChk == 'camera' ? 'Camera Access' : 'Storage Access'}
                </Text>

                <Image
                  source={
                    prmsnChk == 'camera'
                      ? require('../../assets/images/ca/img.png')
                      : require('../../assets/images/ca/img.png')
                  }
                  style={styles.section2Logo}
                />

                <View style={{width: '80%', alignSelf: 'center'}}>
                  <Text
                    style={[
                      styles.section2LogoTitle,
                      {
                        textAlign: 'center',
                      },
                    ]}>
                    {prmsnChk == 'camera'
                      ? 'Trip Trader wants permission to access your camera.'
                      : 'Trip Trader wants permission to access your storage.'}
                  </Text>
                </View>

                <Text style={styles.section2LogoTitlee}>Grant access?</Text>
              </View>

              {renderButtonPermission()}
            </>
          )}
        </View>
      </KeyboardAvoidingView>

      {pvm && (
        <utils.FullimageModal
          data={photos}
          si={si}
          show={pvm}
          closModal={() => setpvm(!pvm)}
        />
      )}
    </Modal>
  );
}
