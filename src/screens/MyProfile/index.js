import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Alert,
  Linking,
  PermissionsAndroid,
  Platform,
  Modal as MModal,
  Pressable,
} from 'react-native';

import {styles} from './styles';
import {observer} from 'mobx-react';
import store from '../../store/index';
import utils from '../../utils/index';
import theme from '../../theme';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-easy-toast';
import {ActivityIndicator} from 'react-native-paper';
import IntentLauncher from 'react-native-intent-launcher';
import {request, PERMISSIONS, check} from 'react-native-permissions';
import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';
import {Image as ImageCompressor} from 'react-native-compressor';
import {TabView, SceneMap} from 'react-native-tab-view';
import Reviews from './Reviews';
import Trips from './Trips';
import Photos from './Photos';

export default observer(MyProfile);

function MyProfile(props) {
  const toast = useRef(null);
  const headerTitle = 'My Profile';

  const {isInternet} = store.General;

  const {user, regLoader, setregLoader} = store.User;

  let userName = '';
  let phn = '';
  let phnCntr = '';
  const followers = store.User.totalfollowers;
  const following = store.User.totalfollowing;
  let src = '';
  let isCnicVerf = false;

  if (user == 'guest') {
    userName = 'guest';
  }

  if (user != 'guest' && user) {
    userName = user.firstName + ' ' + user.lastName;
    phn = user.phone && user.phone !== null ? '+' + user.phone : '';
    phnCntr =
      user.phoneCountryCode && user.phoneCountryCode !== null
        ? user.phoneCountryCode
        : '';

    src = user.image && user.image != '' ? user.image : '';

    isCnicVerf = user.identityStatus == 'notVerified' ? false : true;
  }

  const [isShowPrmsn, setisShowPrmsn] = useState(false);
  const [prmsnChk, setprmsnChk] = useState('storage');
  const [isAddPhotoModal, setisAddPhotoModal] = useState(false);
  const [DT, setDT] = useState(false);

  const [photo, setphoto] = useState(src);

  const [phone, setPhone] = useState(phn);

  const [cntry, setcntry] = useState(phnCntr);
  const [pwc, setpwc] = useState('');

  const [pvm, setpvm] = useState(false); //show fulll image modal
  const [pv, setpv] = useState(''); //photo view

  const [profileImageLoader, setprofileImageLoader] = useState(false);

  const [isSHowChangePhoto, setisSHowChangePhoto] = useState(false);
  const [cphoto, setcphoto] = useState(false);

  const [errorMessage, seterrorMessage] = useState('');

  const [isTabBarShow, setisTabBarShow] = useState(false);

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'reviews', title: 'Reviews'},
    {key: 'trips', title: 'Trips'},
    {key: 'photos', title: 'Photos'},
  ]);
  const renderScene = SceneMap({
    reviews: Reviews,
    // trips: () => <Trips p={props} />,
    trips: Trips,
    photos: Photos,
  });

  useEffect(() => {
    if (phone != '' && cntry != '') {
      setTimeout(() => {
        let Countries = utils.Countries;
        for (let index = 0; index < Countries.length; index++) {
          const e = Countries[index];
          let result = phone.includes(e.dialCode);
          if (result && cntry == e.code) {
            setcntry(e.code);
            setpwc(phone.slice(e.dialCode.length));
            break;
          }
        }
      }, 1000);
    } else {
      setpwc('');
    }
  }, [phone, cntry]);

  useEffect(() => {
    store.User.setphn(phone);
    store.User.setcntr(cntry);
    store.User.setpwc(pwc);
  }, [phone, cntry, pwc]);
  2;
  useEffect(() => {
    if (user && user !== 'guest') {
      setPhone(user.phone && user.phone !== null ? '+' + user.phone : '');
      setcntry(
        user.phoneCountryCode && user.phoneCountryCode !== null
          ? user.phoneCountryCode
          : '',
      );
      setphoto(user.image && user.image != '' ? user.image : '');
    }
  }, [user]);

  useEffect(() => {
    store.User.setMyProfileProps(props);
    if (user && user !== 'guest') {
      setTimeout(() => {
        setisTabBarShow(true);
      }, 100);
    }
  }, []);

  const MultipleImage = async button => {
    setisShowPrmsn(false);
    setisAddPhotoModal(false);
    const apiLevel = store.General.apiLevel;

    setTimeout(async () => {
      try {
        const options = {
          mediaType: 'image',
          isPreview: false,
          maxSelectedAssets: 1,
        };

        const resp = await MultipleImagePicker.openPicker(options);
        if (resp.length > 0) {
          const res = resp[0];
          console.log('mutipicker image res true  ');
          const {path, mime, mine, filename, fileName} = res;
          let uri = path;
          if (Platform.OS == 'android' && apiLevel < 29) {
            uri = 'file://' + uri;
          }

          ImageCompressor.compress(uri, {
            compressionMethod: 'auto',
          })
            .then(async res => {
              const imageObject = {
                uri: res,
                type: Platform.OS == 'ios' ? mime : mine,
                fileName: Platform.OS == 'ios' ? filename : fileName,
              };
              console.log('Compress image  : ', imageObject);
              if (button == 'Profile') {
                setTimeout(() => {
                  setisSHowChangePhoto(true);
                  setcphoto(imageObject);
                }, 500);

                return;
              } else if (button == 'CNICFront') {
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
        console.log('multi photo picker error : ', error);
      }
    }, 500);
  };

  const onclickImage = c => {
    if (c == 'photoView') {
      setpv([photo.uri ? photo.uri : photo]);
      setpvm(true);

      return;
    }
    if (c == 'photoViewC') {
      setpv([photo.uri ? photo.uri : photo]);
      setpvm([cphoto.uri ? cphoto.uri : cphoto]);

      return;
    }

    if (c == 'Profile') {
      MultipleImage(c);
      return;
    }
  };

  const editProfile = () => {
    props.navigation.navigate('EditProfile');
  };

  const uploadPhoto = c => {
    let imgArr = [];

    if (c == 'Profile') {
      cphoto.chk = 'Profile';
      imgArr.push(cphoto);
    }

    // if (c == 'CNICFront') {
    //   cnicFrontImage.chk = 'CnicF';
    //   imgArr.push(cnicFrontImage);
    // }

    let body = {
      // profileUpdateByUser: true,
    };

    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        setregLoader(true);
        store.User.attemptToEditUploadImage(body, imgArr, closePhotoModal);
      } else {
        // seterrorMessage('Please connect internet');
        Alert.alert('', 'Please connect internet');
      }
    });
  };

  const ShowFollowersScreen = c => {
    // props.navigation.navigate('ShowFollowers', {
    //   chk: c,
    //   user: userName,
    //   cc: 'my',
    // });

    props.navigation.navigate('ShowFollowers');
    store.User.setcchk(c);
    // store.Userv.setUser(store.User.user._id);
    store.User.setffuser(userName);
    store.User.setccc('my');
  };

  const renderProfileSection = () => {
    const renderProfileShow = () => {
      return (
        <TouchableOpacity
          disabled={photo == '' ? true : false}
          onPress={() => onclickImage('photoView')}
          activeOpacity={0.9}
          style={styles.profileImageContainer}>
          <Image
            onLoadStart={() => {
              setprofileImageLoader(false);
            }}
            onLoad={() => {
              setprofileImageLoader(true);
            }}
            style={styles.ProfileImg}
            source={
              photo != ''
                ? {uri: photo.uri ? photo.uri : photo}
                : require('../../assets/images/drawer/guest/img.png')
            }
          />
          {user && user !== 'guest' && (
            <TouchableOpacity
              style={styles.changeImgContainer}
              onPress={() => {
                setisAddPhotoModal(true);
                setDT('Profile');
              }}
              activeOpacity={0.7}>
              <Image
                style={styles.changeImg}
                source={require('../../assets/images/changePhoto/img.png')}
              />
            </TouchableOpacity>
          )}

          {!profileImageLoader && (
            <ActivityIndicator
              size={22}
              color={theme.color.button1}
              style={{top: 40, position: 'absolute'}}
            />
          )}
        </TouchableOpacity>
      );
    };

    const renderEditButton = () => {
      return (
        <TouchableOpacity
          style={styles.editImgConatiner}
          onPress={editProfile}
          activeOpacity={0.5}>
          <Image
            style={styles.editImg}
            source={require('../../assets/images/editPhoto/img.png')}
          />
        </TouchableOpacity>
      );
    };

    const renderTextSection = () => {
      return (
        <View style={styles.TextSecConatiner}>
          <View style={styles.profileTitleConatiner}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.profileTitle}>
              {userName}
            </Text>
          </View>
          {user && user !== 'guest' && (
            <View style={styles.profileTitle2Conatiner}>
              <Pressable
                style={({pressed}) => [
                  {opacity: pressed ? 0.8 : 1.0},
                  [styles.profileTitle2Conatiner1],
                ]}
                onPress={() => ShowFollowersScreen('followers')}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles.profileTitle2ConatinerTitle}>
                  <Text style={styles.profileTitle2ConatinerTitle2}>
                    {parseInt(followers) > 90000 ? '90000+' : followers}
                    {'  '}
                  </Text>
                  followers
                </Text>
              </Pressable>

              <Pressable
                onPress={() => ShowFollowersScreen('following')}
                style={({pressed}) => [
                  {opacity: pressed ? 0.8 : 1.0},
                  [styles.profileTitle2Conatiner2],
                ]}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles.profileTitle2ConatinerTitle}>
                  <Text style={styles.profileTitle2ConatinerTitle2}>
                    {parseInt(following) > 90000 ? '90000+' : following}
                    {'  '}
                  </Text>
                  following
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      );
    };

    return (
      <View style={{paddingHorizontal: 15}}>
        <View style={styles.profileSecConatiner}>
          {renderProfileShow()}
          {user && user !== 'guest' && renderEditButton()}
          {renderTextSection()}
        </View>
      </View>
    );
  };

  const renderTabBar = () => {
    return (
      <>
        <View
          style={{
            paddingHorizontal: 15,
            flex: 1,
            marginTop: 10,
          }}>
          <TabView
            navigationState={{index, routes}}
            renderScene={renderScene}
            onIndexChange={setIndex}
          />
        </View>

        <utils.Footer
          nav={props.navigation}
          screen={headerTitle}
          focusScreen={store.General.focusScreen}
        />
      </>
    );
  };

  const closePhotoModal = () => {
    if (!regLoader) {
      setisSHowChangePhoto(false);
      setcphoto(false);
    }
  };

  const renderShowCahngePhotoModal = () => {
    const renderHeader = () => {
      let text = 'review profile photo';

      const renderCross = () => {
        return (
          <Pressable
            style={({pressed}) => [
              {opacity: pressed ? 0.5 : 1.0},
              styles.modalCross,
            ]}
            onPress={closePhotoModal}>
            <utils.vectorIcon.EvilIcons
              name="close"
              color={theme.color.title}
              size={30}
            />
          </Pressable>
        );
      };

      const renderTitle = () => {
        return <Text style={styles.section2Title1}>{text}</Text>;
      };

      return (
        <View style={{alignItems: 'center'}}>
          {renderTitle()}
          {renderCross()}
        </View>
      );
    };

    const renderButton = c => {
      return (
        <>
          <TouchableOpacity
            disabled={regLoader}
            onPress={() => {
              uploadPhoto(c);
            }}
            activeOpacity={0.7}
            style={[styles.BottomButton, {marginTop: 40}]}>
            {!regLoader ? (
              <Text style={styles.buttonTextBottom}>Confirm & Continue</Text>
            ) : (
              <ActivityIndicator size={18} color={theme.color.buttonText} />
            )}
          </TouchableOpacity>
        </>
      );
    };

    const renderButtonSkip = () => {
      return (
        <>
          <TouchableOpacity
            disabled={regLoader}
            onPress={() => {
              closePhotoModal();
            }}
            activeOpacity={0.7}
            style={[
              styles.BottomButton,
              {backgroundColor: theme.color.button2},
            ]}>
            <Text
              style={[
                styles.buttonTextBottom,
                {
                  color: theme.color.button2Text,
                  textTransform: 'none',
                  fontFamily: theme.fonts.fontBold,
                  fontSize: 14,
                },
              ]}>
              Skip for now
            </Text>
          </TouchableOpacity>
        </>
      );
    };

    const src = cphoto
      ? {uri: cphoto.uri}
      : require('../../assets/images/imgLoad/img.jpeg');
    return (
      <MModal
        animationType="slide"
        visible={isSHowChangePhoto}
        transparent
        onRequestClose={() => {
          closePhotoModal();
        }}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
            padding: 15,
          }}>
          <View
            style={{
              backgroundColor: theme.color.background,
              borderRadius: 15,
              marginBottom: 15,
              padding: 18,
              width: '100%',
            }}>
            {renderHeader()}
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Text style={styles.section2LogoTitle}>
                If you are happy with the result, click Confirm & Continue below
                or try a different photo.
              </Text>

              <TouchableOpacity
                style={styles.imageContainerP}
                activeOpacity={0.7}
                onPress={() =>
                  Platform.OS == 'android' ? changePhoto('photoViewC') : null
                }>
                <Image source={src} style={styles.imageP} />
              </TouchableOpacity>
            </View>

            {renderButton('Profile')}
            {renderButtonSkip()}
          </View>
        </View>
      </MModal>
    );
  };

  const renderAddPhotoModal = () => {
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
          console.log('Permsiion error : ', error);
        }
      }
    };

    const closeAddPhotoModal = () => {
      if (!isShowPrmsn) {
        setisAddPhotoModal(false);
      } else {
        setisShowPrmsn(false);
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

    function Sep() {
      return <View style={{height: 25}} />;
    }

    return (
      <MModal
        visible={isAddPhotoModal}
        transparent
        onRequestClose={closeAddPhotoModal}>
        <SafeAreaView style={styles.modalContainerp}>
          <View style={[styles.modalContainer2p, {margin: 20}]}>
            <View
              style={[
                styles.modalp,
                {
                  paddingVertical: 25,
                  paddingHorizontal: 20,
                  borderRadius: 15,
                },
              ]}>
              {!isShowPrmsn && (
                <>
                  <View
                    style={{alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={styles.section2Title1}>add profile photo</Text>

                    <Image
                      source={require('../../assets/images/addphoto/img.png')}
                      style={styles.section2Logo}
                    />

                    <Text
                      style={[styles.section2LogoTitle, {textAlign: 'center'}]}>
                      Upload a photo to help the community recognize and promote
                      your account.
                    </Text>

                    <View style={styles.uploadIndication}>
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => {
                          checkPermsn('gallery');
                        }}>
                        <Image
                          source={require('../../assets/images/uploadphoto/img.png')}
                          style={styles.uploadIndicationLogo}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => {
                          checkPermsn('camera');
                        }}>
                        <Image
                          source={require('../../assets/images/takephoto/img.png')}
                          style={styles.uploadIndicationLogo}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={closeAddPhotoModal}
                    activeOpacity={0.7}
                    style={{
                      marginTop: 40,
                      width: '100%',
                      height: 48,
                      backgroundColor: theme.color.button2,
                      alignItems: 'center',
                      justifyContent: 'center',
                      alignSelf: 'center',
                    }}>
                    <Text
                      style={[
                        styles.buttonTextBottom,
                        {
                          color: '#B93B3B',
                          fontFamily: theme.fonts.fontMedium,
                        },
                      ]}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
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
                      {prmsnChk == 'camera'
                        ? 'Camera Access'
                        : 'Storage Access'}
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
              {/* {renderCross()} */}
            </View>
          </View>
        </SafeAreaView>
      </MModal>
    );
  };

  return (
    <View style={styles.container}>
      {/* {tagLine != '' && <utils.TagLine tagLine={tagLine} />} */}
      <utils.DrawerHeader props={props} headerTitle={headerTitle} />
      {!isInternet && <utils.InternetMessage />}
      <SafeAreaView style={styles.container2}>
        <View style={styles.container3}>
          {renderProfileSection()}
          <View style={{flex: 1}}>{isTabBarShow && renderTabBar()}</View>
          <Toast ref={toast} position="bottom" />
          {/* <utils.Loader2 load={Loader} /> */}

          {!isTabBarShow && (
            <utils.Footer
              nav={props.navigation}
              screen={headerTitle}
              focusScreen={store.General.focusScreen}
            />
          )}
          {renderShowCahngePhotoModal()}
        </View>
      </SafeAreaView>

      {pvm && (
        <utils.FullimageModal
          data={pv}
          si={0}
          show={pvm}
          closModal={() => {
            setpvm(!pvm);
            setpv('');
          }}
        />
      )}

      {isAddPhotoModal && renderAddPhotoModal()}
    </View>
  );
}
