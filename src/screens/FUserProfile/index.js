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
  Modal as MModal,
  Pressable,
  Keyboard,
  TextInput,
  ScrollView,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import {styles} from './styles';
import {observer} from 'mobx-react';
import store from '../../store/index';
import utils from '../../utils/index';
import theme from '../../theme';
import ProgressiveFastImage from '@freakycoder/react-native-progressive-fast-image';

import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-easy-toast';
import {ActivityIndicator} from 'react-native-paper';
import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';
import {Image as ImageCompressor} from 'react-native-compressor';

import {TabView, SceneMap} from 'react-native-tab-view';
import Reviews from './Reviews';
import Trips from './Trips';
import Photos from './Photos';

export default observer(FUserProfile);

function FUserProfile(props) {
  const refRBSheet = useRef();

  let maxModalHeight = theme.window.Height - 100;
  const [modalHeight, setmodalHeight] = useState(0);

  const toast = useRef(null);
  const toastduration = 700;
  let headerTitle = 'Profile';

  let internet = store.General.isInternet;
  let user = store.Userv.user;
  let loader = store.Userv.gl;

  let userName = '';
  let phn = '';
  let followers = store.Userv.totalfollowers;
  let following = store.Userv.totalfollowing;
  let src = '';
  let srccnic = '';

  if (user) {
    userName = user.firstName + ' ' + user.lastName;
    src = user.image ? user.image : '';
  }

  const [photo, setphoto] = useState(src);

  const [pvm, setpvm] = useState(false); //show fulll image modal
  const [pv, setpv] = useState(''); //photo view

  const [profileImageLoader, setprofileImageLoader] = useState(false);

  const [isSHowChangePhoto, setisSHowChangePhoto] = useState(false);
  const [cphoto, setcphoto] = useState(false);

  const [errorMessage, seterrorMessage] = useState('');

  const [isTabBarShow, setisTabBarShow] = useState(false);

  const [isFollow, setisFollow] = useState(false);
  const [isBlock, setisBlock] = useState(false);

  const [modalObj, setmodalObj] = useState(false);
  const [modalChk, setmodalChk] = useState(false);
  const [isModal, setisModal] = useState(false);
  const [isSendMessage, setisSendMessage] = useState(false);

  const [isSendReport, setisSendReport] = useState(false);

  const [sendObj, setsendObj] = useState('');
  let mloader = store.Userv.homeModalLoder;

  const [message, setMessage] = useState('');
  const closeModal = () => {
    setisModal(false);
    setmodalChk(false);
    setmodalObj(false);
    setMessage('');
    setmodalHeight(0);
    setisSendReport(false);
  };

  const [getDataOnce, setgetDataOnce] = useState(false);
  const setGetDataOnce = C => {
    setgetDataOnce(C);
  };
  const getDbData = () => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        store.Userv.attemptToGetHome(setGetDataOnce);
      }
    });
  };
  useEffect(() => {
    if (!getDataOnce && internet) {
      getDbData();
    }
    return () => {};
  }, [getDataOnce, internet]);

  useEffect(() => {
    if (store.User.user) {
      let blk = false;
      let flw = false;
      let dtt = store.User.user.followers || [];
      if (dtt.length > 0) {
        let fi = dtt.findIndex(x => x.userId == user._id);

        if (fi > -1) {
          if (dtt[fi].block == true) {
            blk = true;
          }
          if (dtt[fi].following == true) {
            flw = true;
          }
        }
      }
      setisBlock(blk);
      setisFollow(flw);
    }
  }, [store.User.user]);

  const setIsSendMessage = v => {
    setsendObj(modalObj.item);
    closeModal();
    setisSendMessage(v);
  };
  const sendMessage = () => {
    Keyboard.dismiss();
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        let usr = modalObj.item;
        const obj = {
          userId1: store.User.user._id,
          userId2: usr._id,
          sendBy: store.User.user._id,
          sendTo: user._id,
          senderName:
            store.User.user.firstName + ' ' + store.User.user.lastName,
          isRead: false,
          message: message,
          type: 'text',
        };

        console.log('body : ', obj);

        store.Userv.attemptToCheckFirstMessage(
          store.User.user._id,
          usr._id,
          obj,
          message,
          setIsSendMessage,
        );
      } else {
        // seterrorMessage('Please connect internet');
        Alert.alert('', 'Please connect internet');
      }
    });
  };
  const setIsSendRport = v => {
    setsendObj(modalObj.item);
    closeModal();
    setisSendReport(v);
  };
  const sendReport = () => {
    Keyboard.dismiss();

    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        let bd = {
          reason: message,
          reportby: store.User.user._id,
          userId: user._id,
        };
        store.Userv.SendReportUser(bd, setIsSendRport);
      } else {
        // seterrorMessage('Please connect internet');
        Alert.alert('', 'Please connect internet');
      }
    });
  };
  const unFollowUser = () => {
    Keyboard.dismiss();
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        store.Userv.unFollowUser();
      } else {
        // seterrorMessage('Please connect internet');
        Alert.alert('', 'Please connect internet');
      }
    });
  };
  const FollowUser = () => {
    Keyboard.dismiss();
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        store.Userv.FollowUser();
      } else {
        // seterrorMessage('Please connect internet');
        Alert.alert('', 'Please connect internet');
      }
    });
  };
  const BlockUser = () => {
    Keyboard.dismiss();
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        store.Userv.BlockUser(closeBottomSheet);
      } else {
        // seterrorMessage('Please connect internet');
        Alert.alert('', 'Please connect internet');
      }
    });
  };
  const UnBlockUser = () => {
    Keyboard.dismiss();
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        store.Userv.UnBlockUser(closeBottomSheet);
      } else {
        // seterrorMessage('Please connect internet');
        Alert.alert('', 'Please connect internet');
      }
    });
  };

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
    store.User.setOtherProfileProps(props);
    return () => {
      store.Userv.clearUser();
    };
  }, []);

  const setErrMessage = c => {
    seterrorMessage(c);
  };

  const MultipleImage = async button => {
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
            if (button == 'photoChange') {
              setisSHowChangePhoto(true);
              setcphoto(imageObject);

              return;
            } else if (button == 'CNICFront') {
              // setCnicFrontImage(imageObject);
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
  };

  const changePhoto = c => {
    if (c == 'photoView') {
      setpv([photo.uri ? photo.uri : photo]);
      setpvm(true);
      return;
    }
    if (c == 'photoViewC') {
      setpv([cphoto.uri]);
      setpvm(true);
      return;
    }

    if (c == 'photoChange') {
      MultipleImage(c);
      return;
    }
  };

  const setPhoto = c => {
    setcphoto(c);
  };

  const onClickBottomItem = chk => {
    if (chk == 'message') {
      closeBottomSheet();
      setmodalObj({item: user, i: 0});
      setmodalChk('message');
      setisModal(true);
    }
    // if (chk == 'block') {
    //   setisBlock(!isBlock);
    // }
    if (chk == 'report') {
      closeBottomSheet();
      setmodalObj({item: user, i: 0});
      setmodalChk('report');
      setisModal(true);
    }
  };

  const openBottomSheet = () => {
    refRBSheet?.current?.open();
  };

  const closeBottomSheet = () => {
    refRBSheet?.current?.close();
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

    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        store.User.attemptToUploadImage2(
          imgArr,
          setErrMessage,
          setPhoto,
          closePhotoModal,
        );
      } else {
        // seterrorMessage('Please connect internet');
        Alert.alert('', 'Please connect internet');
      }
    });
  };

  const ShowFollowersScreen = c => {
    props.navigation.navigate('ShowFollowers', {
      chk: c,
      user: userName,
      cc: 'other',
    });
  };

  const renderProfileSection = () => {
    const renderProfileShow = () => {
      return (
        <TouchableOpacity
          disabled={photo == '' ? true : false}
          onPress={() => changePhoto('photoView')}
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

    const renderProfileShoww = () => {
      return (
        <TouchableOpacity disabled={true} style={styles.profileImageContainer}>
          <Image
            style={styles.ProfileImg}
            source={require('../../assets/images/drawer/guest/img.png')}
          />
        </TouchableOpacity>
      );
    };

    const renderEditButton = () => {
      return (
        <TouchableOpacity
          style={{position: 'absolute', right: 15, top: 20}}
          onPress={openBottomSheet}
          activeOpacity={0.7}>
          <View style={styles.editImgConatiner}>
            <Image
              style={styles.editImg}
              source={require('../../assets/images/editOtherUser/img.png')}
            />
          </View>
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
              {isBlock ? 'Trip Trader User' : userName}
            </Text>
          </View>
          {user && !isBlock && (
            <View style={styles.profileTitle2Conatiner}>
              <Pressable
                style={({pressed}) => [
                  {opacity: pressed ? 0.8 : 1.0},
                  [styles.profileTitle2Conatiner1],
                ]}
                onPress={() => ShowFollowersScreen('followers')}>
                <Text style={styles.profileTitle2ConatinerTitle2}>
                  {parseInt(followers) > 900 ? '900+' : followers}
                </Text>

                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles.profileTitle2ConatinerTitle}>
                  followers
                </Text>
              </Pressable>

              <Pressable
                disabled={loader}
                style={({pressed}) => [
                  {opacity: pressed ? 0.8 : 1.0},
                  [styles.profileTitle2Conatinerm],
                ]}
                onPress={() => {
                  if (store.User.user.subscriptionStatus == 'freemium') {
                    props.navigation.navigate('Plan');
                  } else {
                    if (!isFollow) FollowUser();
                    else unFollowUser();
                  }
                }}>
                <Text style={styles.profileTitle2ConatinerTitle2m}>
                  {isFollow ? 'Unfollow' : 'Follow'}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => ShowFollowersScreen('following')}
                style={({pressed}) => [
                  {opacity: pressed ? 0.8 : 1.0},
                  [styles.profileTitle2Conatiner2],
                ]}>
                <Text style={styles.profileTitle2ConatinerTitle2}>
                  {parseInt(following) > 900 ? '900+' : following}
                  {'  '}
                </Text>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles.profileTitle2ConatinerTitle}>
                  following
                </Text>
              </Pressable>
            </View>
          )}

          {user && isBlock && (
            <View style={styles.profileTitle2Conatinerr}>
              <Pressable
                disabled={loader}
                style={({pressed}) => [
                  {opacity: pressed ? 0.8 : 1.0},
                  [styles.profileTitle2Conatinerm],
                ]}
                onPress={() => {
                  if (store.User.user.subscriptionStatus == 'freemium') {
                    props.navigation.navigate('Plan');
                  } else {
                    UnBlockUser();
                  }
                }}>
                <Text style={styles.profileTitle2ConatinerTitle2m}>
                  Unblock
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
          {!isBlock && renderProfileShow()}
          {isBlock && renderProfileShoww()}
          {user && !isBlock && renderEditButton()}
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
          screen={'UserProfile'}
          focusScreen={store.General.focusScreen}
        />
      </>
    );
  };

  const closePhotoModal = () => {
    if (!loader) {
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
            disabled={loader}
            onPress={() => {
              uploadPhoto(c);
            }}
            activeOpacity={0.7}
            style={[styles.BottomButton, {marginTop: 40}]}>
            {!loader ? (
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
            disabled={loader}
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

    let src =
      cphoto != ''
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

  const renderBottomSheet = () => {
    let messageIcon = require('../../assets/images/bottomsheet/messages/img.png');
    let blockIcon = require('../../assets/images/bottomsheet/block/img.png');
    let reportIcon = require('../../assets/images/bottomsheet/report/img.png');
    let itemConStyle = {
      width: '80%',
      // backgroundColor: 'red',
      paddingVertical: 5,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    };
    let itemiconStyle = {
      width: 24,
      height: 24,
      resizeMode: 'contain',
    };
    let itemTextStyle = {
      color: '#3C6B49',
      fontSize: 16,
      fontFamily: theme.fonts.fontMedium,
      lineHeight: 25,
    };
    let touchOpacity = 0.8;

    const renderCross = () => {
      return (
        <Pressable
          style={({pressed}) => [{opacity: pressed ? 0.8 : 1.0}]}
          onPress={closeBottomSheet}>
          <utils.vectorIcon.Ionicons
            name="ios-close-outline"
            color={theme.color.title}
            size={32}
          />
        </Pressable>
      );
    };

    const Sep = () => {
      return <View style={{height: 15}} />;
    };

    return (
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={false}
        closeOnPressMask={true}
        customStyles={{
          wrapper: {
            backgroundColor: 'rgba(0,0,0,0.6)',
          },
          container: {
            backgroundColor: theme.color.background,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 15,
            height: responsiveHeight(30),
          },
          draggableIcon: {
            backgroundColor: '#000',
          },
        }}>
        <>
          <View style={{flex: 1}}>
            <View style={{width: '100%', alignItems: 'flex-end'}}>
              {renderCross()}
            </View>

            <View style={{width: '100%'}}>
              <Pressable
                onPress={() => {
                  if (store.User.user.subscriptionStatus == 'freemium') {
                    props.navigation.navigate('Plan');
                  } else {
                    onClickBottomItem('message');
                  }
                }}
                style={({pressed}) => [
                  {opacity: pressed ? touchOpacity : 1.0},
                  itemConStyle,
                ]}>
                <View style={{}}>
                  <Image style={itemiconStyle} source={messageIcon} />
                </View>
                <View style={{width: '84%'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={itemTextStyle}>
                    Message
                  </Text>
                </View>
              </Pressable>

              <Sep />
              <Pressable
                disabled={loader}
                onPress={() => {
                  if (store.User.user.subscriptionStatus == 'freemium') {
                    props.navigation.navigate('Plan');
                  } else {
                    if (!isBlock) BlockUser();
                    else UnBlockUser();
                  }
                }}
                style={({pressed}) => [
                  {opacity: pressed ? touchOpacity : 1.0},
                  itemConStyle,
                ]}>
                <View style={{}}>
                  <Image style={itemiconStyle} source={blockIcon} />
                </View>
                <View style={{width: '84%'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={[itemTextStyle, {color: '#B93B3B'}]}>
                    {!isBlock ? 'Block' : 'Unblock'}
                  </Text>
                </View>
              </Pressable>
              <Sep />

              <Pressable
                onPress={() => {
                  if (store.User.user.subscriptionStatus == 'freemium') {
                    props.navigation.navigate('Plan');
                  } else {
                    onClickBottomItem('report');
                  }
                }}
                style={({pressed}) => [
                  {opacity: pressed ? touchOpacity : 1.0},
                  itemConStyle,
                ]}>
                <View style={{}}>
                  <Image style={itemiconStyle} source={reportIcon} />
                </View>
                <View style={{width: '84%'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={[itemTextStyle, {color: '#B93B3B'}]}>
                    Report
                  </Text>
                </View>
              </Pressable>

              <Sep />
            </View>
          </View>
        </>
      </RBSheet>
    );
  };

  const renderModal = () => {
    let c = modalHeight >= maxModalHeight ? true : false;
    let style = c ? [styles.modal, {height: maxModalHeight}] : styles.modal2;

    //message
    if (modalChk == 'message') {
      const renderHeader = () => {
        let text = 'Message User';

        const renderCross = () => {
          return (
            <Pressable
              disabled={mloader}
              style={({pressed}) => [
                {opacity: pressed ? 0.7 : 1.0},
                styles.modalCross,
              ]}
              onPress={closeModal}>
              <utils.vectorIcon.Ionicons
                name="ios-close-outline"
                color={theme.color.title}
                size={32}
              />
            </Pressable>
          );
        };

        const renderTitle = () => {
          return <Text style={styles.modalTitle}>{text}</Text>;
        };

        return (
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            {renderTitle()}
            {renderCross()}
          </View>
        );
      };

      const renderField = () => {
        let item = modalObj.item;

        const renderProfile = () => {
          return (
            <View style={styles.mProfileImgContainerm}>
              <ProgressiveFastImage
                style={styles.mProfileImgm}
                source={
                  photo != ''
                    ? {uri: photo}
                    : require('../../assets/images/drawer/guest/img.png')
                }
                loadingImageStyle={styles.mimageLoaderm}
                loadingSource={require('../../assets/images/imgLoad/img.jpeg')}
                blurRadius={5}
              />
              {/* {isVeirfy && (
                  <Image
                    style={styles.miconVerifym}
                    source={require('../../assets/images/verified/img.png')}
                  />
                )} */}
            </View>
          );
        };

        return (
          <View style={[styles.modalFieldConatiner, {marginTop: 15}]}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={styles.mT1}>To:</Text>
              <View
                style={{
                  width: '89%',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                }}>
                {renderProfile()}
                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.mT2}>
                  {userName}
                </Text>
              </View>
            </View>

            <View style={styles.textArea}>
              <TextInput
                value={message}
                onChangeText={c => {
                  setMessage(c);
                }}
                style={styles.mTextInpt}
                placeholder="Type your message here"
                multiline={true}
                numberOfLines={10}
              />
            </View>
          </View>
        );
      };

      const renderBottom = () => {
        const renderButton = () => {
          return (
            <Pressable
              onPress={() => {
                sendMessage();
              }}
              disabled={mloader == true ? true : message == '' ? true : false}
              style={({pressed}) => [
                {opacity: pressed ? 0.9 : message == '' ? 0.5 : 1},
                styles.ButtonContainer,
                {backgroundColor: theme.color.button1, width: '100%'},
              ]}>
              {!mloader && (
                <Text
                  style={[
                    styles.ButtonText,
                    {color: theme.color.buttonText, fontSize: 13},
                  ]}>
                  Send Message
                </Text>
              )}
              {mloader && (
                <ActivityIndicator size={20} color={theme.color.buttonText} />
              )}
            </Pressable>
          );
        };

        return (
          <View style={styles.modalBottomContainerrr}>{renderButton()}</View>
        );
      };

      return (
        <MModal visible={isModal} transparent onRequestClose={closeModal}>
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalContainer2}>
              <View style={styles.modal2}>
                {renderHeader()}
                {renderField()}
                {renderBottom()}
              </View>
            </View>
          </SafeAreaView>
        </MModal>
      );
    }

    //report
    if (modalChk == 'report') {
      const renderHeader = () => {
        let text = 'Report User';

        const renderCross = () => {
          return (
            <Pressable
              disabled={mloader}
              style={({pressed}) => [
                {opacity: pressed ? 0.7 : 1.0},
                [
                  !c
                    ? {
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                      }
                    : {
                        position: 'absolute',
                        bottom: 7,
                        right: 15,
                      },
                ],
              ]}
              onPress={closeModal}>
              <utils.vectorIcon.Ionicons
                name="ios-close-outline"
                color={theme.color.title}
                size={32}
              />
            </Pressable>
          );
        };

        const renderTitle = () => {
          return <Text style={styles.modalTitle}>{text}</Text>;
        };

        return (
          <View
            style={
              c
                ? {
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: 15,
                    paddingTop: 15,
                    paddingBottom: 7,
                    shadowColor: '#000000',
                    shadowOffset: {width: 0, height: 1}, // change this for more shadow
                    shadowOpacity: 0.1,
                    elevation: 1,
                    backgroundColor: theme.color.background,
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                  }
                : {
                    alignItems: 'center',
                    justifyContent: 'center',
                  }
            }>
            {renderTitle()}
            {renderCross()}
          </View>
        );
      };

      const renderCenter = () => {
        let un = user.userName ? user.userName : 'uname';

        return (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 10,
              width: '100%',
            }}>
            <View style={styles.mProfileImgContainerss}>
              <ProgressiveFastImage
                style={styles.mProfileImgss}
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

            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                marginTop: 15,
                fontFamily: theme.fonts.fontBold,
                fontSize: 15,
                color: '#101B10',
                textTransform: 'capitalize',
                lineHeight: 20,
              }}>
              {userName}
            </Text>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                fontFamily: theme.fonts.fontNormal,
                fontSize: 13,
                color: theme.color.subTitleLight,
                lineHeight: 20,
              }}>
              @{un}
            </Text>

            <View style={{width: '93%', alignSelf: 'center'}}>
              <Text
                style={{
                  marginTop: 15,
                  fontFamily: theme.fonts.fontNormal,
                  fontSize: 14,
                  color: '#101B10',
                  lineHeight: 20,
                  textAlign: 'center',
                }}>
                Tell us about the issues you are having or seeing with this
                user.
              </Text>
            </View>

            <View style={styles.textArea}>
              <TextInput
                value={message}
                onChangeText={c => {
                  setMessage(c);
                }}
                style={styles.mTextInpt}
                placeholder="Describe your concerns"
                multiline={true}
                numberOfLines={10}
              />
            </View>
          </View>
        );
      };

      const renderBottom = () => {
        let chk = message == '' ? true : false;
        const renderButton1 = () => {
          return (
            <>
              <TouchableOpacity
                disabled={mloader || chk}
                onPress={() => {
                  sendReport();
                }}
                activeOpacity={0.7}
                style={{
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#B93B3B',
                  height: 50,
                  borderRadius: 10,
                  alignSelf: 'center',
                  opacity: chk ? 0.5 : 1,
                }}>
                {!mloader && (
                  <Text
                    style={{
                      color: theme.color.buttonText,
                      fontSize: 16,
                      fontFamily: theme.fonts.fontBold,
                      textTransform: 'none',
                    }}>
                    Report User
                  </Text>
                )}
                {mloader && (
                  <ActivityIndicator size={20} color={theme.color.buttonText} />
                )}
              </TouchableOpacity>
            </>
          );
        };

        const renderButton2 = () => {
          return (
            <>
              <TouchableOpacity
                disabled={mloader}
                onPress={closeModal}
                activeOpacity={0.7}
                style={{
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: theme.color.button2,
                  height: 50,
                  borderRadius: 10,
                  alignSelf: 'center',
                  // borderWidth: 1,
                  // borderColor: theme.color.fieldBorder,
                  marginTop: 12,
                }}>
                <Text
                  style={{
                    color: '#30563A',
                    textTransform: 'none',
                    fontFamily: theme.fonts.fontBold,
                    fontSize: 16,
                  }}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </>
          );
        };

        return (
          <View
            style={
              c
                ? {
                    backgroundColor: theme.color.background,
                    shadowColor: '#000000',
                    shadowOffset: {width: 0, height: -1}, // change this for more shadow
                    shadowOpacity: 0.1,
                    elevation: 5,
                    borderBottomLeftRadius: 10,
                    borderBottomRightRadius: 10,
                    marginTop: 5,
                  }
                : {marginTop: 20}
            }>
            <View
              style={
                c ? styles.modalBottomContainer : styles.modalBottomContainer2
              }>
              {renderButton1()}
              {renderButton2()}
            </View>
          </View>
        );
      };

      return (
        <MModal visible={isModal} transparent onRequestClose={closeModal}>
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalContainer2}>
              <View
                onLayout={event => {
                  if (!c) {
                    let {height} = event.nativeEvent.layout;
                    setmodalHeight(height);
                  }
                }}
                style={style}>
                {c && (
                  <>
                    {renderHeader()}
                    <ScrollView
                      contentContainerStyle={{paddingHorizontal: 15}}
                      showsVerticalScrollIndicator={false}
                      style={{flex: 1}}>
                      {renderCenter()}
                    </ScrollView>
                    {renderBottom()}
                  </>
                )}

                {!c && (
                  <>
                    {renderHeader()}
                    {renderCenter()}
                    {renderBottom()}
                  </>
                )}
              </View>
            </View>
          </SafeAreaView>
        </MModal>
      );
    }
  };

  const renderMessageSendModal = () => {
    const renderButton1 = () => {
      return (
        <>
          <TouchableOpacity
            onPress={closeModal}
            activeOpacity={0.7}
            style={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme.color.button1,
              height: 50,
              borderRadius: 10,
              alignSelf: 'center',

              marginTop: 40,
            }}>
            <Text
              style={{
                color: theme.color.buttonText,
                fontSize: 16,
                fontFamily: theme.fonts.fontBold,

                textTransform: 'capitalize',
              }}>
              Done
            </Text>
          </TouchableOpacity>
        </>
      );
    };

    const renderButton2 = () => {
      return (
        <>
          <TouchableOpacity
            onPress={() => {
              closeModal();
              props.navigation.navigate('Inbox');
              props.navigation.goBack();
            }}
            activeOpacity={0.7}
            style={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme.color.button2,
              height: 50,
              borderRadius: 10,
              alignSelf: 'center',
              // borderWidth: 1,
              // borderColor: theme.color.fieldBorder,
              marginTop: 12,
            }}>
            <Text
              style={{
                color: '#30563A',
                textTransform: 'none',
                fontFamily: theme.fonts.fontBold,
                fontSize: 14,
              }}>
              Go to Inbox
            </Text>
          </TouchableOpacity>
        </>
      );
    };

    const closeModal = () => {
      setisSendMessage(false);
    };

    let fn = sendObj.firstName;
    let ln = sendObj.lastName;
    let sendOfferUsername = fn + ' ' + ln;
    let un = sendObj.userName ? sendObj.userName : 'username';
    let src = require('../../assets/images/msgSentDone/img.png');
    return (
      <MModal
        animationType="slide"
        visible={isSendMessage}
        transparent
        onRequestClose={closeModal}>
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
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
              }}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  fontFamily: theme.fonts.fontBold,
                  fontSize: 19,
                  color: '#101B10',
                  lineHeight: 29,
                }}>
                Message Sent
              </Text>
            </View>

            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 40,
                width: '100%',
              }}>
              <Image
                style={{width: 90, height: 90, resizeMode: 'contain'}}
                source={src}
              />

              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  marginTop: 15,
                  fontFamily: theme.fonts.fontBold,
                  fontSize: 15,
                  color: '#101B10',
                  textTransform: 'capitalize',
                  lineHeight: 20,
                }}>
                {sendOfferUsername}
              </Text>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  fontFamily: theme.fonts.fontNormal,
                  fontSize: 13,
                  color: theme.color.subTitleLight,
                  lineHeight: 20,
                }}>
                @{un}
              </Text>
            </View>

            {renderButton1()}
            {renderButton2()}
          </View>
        </View>
      </MModal>
    );
  };

  const renderRepoerSendModal = () => {
    let c = modalHeight >= maxModalHeight ? true : false;
    let style = c ? [styles.modal, {height: maxModalHeight}] : styles.modal2;

    const renderHeader = () => {
      let text = 'Report User';

      const renderCross = () => {
        return (
          <Pressable
            disabled={mloader}
            style={({pressed}) => [
              {opacity: pressed ? 0.7 : 1.0},
              [
                !c
                  ? {
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                    }
                  : {
                      position: 'absolute',
                      bottom: 7,
                      right: 15,
                    },
              ],
            ]}
            onPress={closeModal}>
            <utils.vectorIcon.Ionicons
              name="ios-close-outline"
              color={theme.color.title}
              size={32}
            />
          </Pressable>
        );
      };

      const renderTitle = () => {
        return <Text style={styles.modalTitle}>{text}</Text>;
      };

      return (
        <View
          style={
            c
              ? {
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: 15,
                  paddingTop: 15,
                  paddingBottom: 7,
                  shadowColor: '#000000',
                  shadowOffset: {width: 0, height: 1}, // change this for more shadow
                  shadowOpacity: 0.1,
                  elevation: 1,
                  backgroundColor: theme.color.background,
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                }
              : {
                  alignItems: 'center',
                  justifyContent: 'center',
                }
          }>
          {renderTitle()}
          {renderCross()}
        </View>
      );
    };

    const closeModal = () => {
      setmodalHeight(0);
      setisSendReport(false);
    };
    const renderCenter = () => {
      let fn = sendObj.firstName;
      let ln = sendObj.lastName;
      let sendOfferUsername = fn + ' ' + ln;
      let un = sendObj.userName || 'uname';
      let src =
        sendObj.image && sendObj.image != ''
          ? {uri: sendObj.image}
          : require('../../assets/images/drawer/guest/img.png');

      return (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 10,
            width: '100%',
          }}>
          <View style={styles.mProfileImgContainerss}>
            <ProgressiveFastImage
              style={styles.mProfileImgss}
              source={src}
              loadingImageStyle={styles.mimageLoader}
              loadingSource={require('../../assets/images/imgLoad/img.jpeg')}
              blurRadius={5}
            />
          </View>

          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              marginTop: 15,
              fontFamily: theme.fonts.fontBold,
              fontSize: 15,
              color: '#101B10',
              textTransform: 'capitalize',
              lineHeight: 20,
            }}>
            {sendOfferUsername}
          </Text>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              fontFamily: theme.fonts.fontNormal,
              fontSize: 13,
              color: theme.color.subTitleLight,
              lineHeight: 20,
            }}>
            @{un}
          </Text>

          <View style={{width: '93%', alignSelf: 'center'}}>
            <Text
              style={{
                marginTop: 15,
                fontFamily: theme.fonts.fontNormal,
                fontSize: 14,
                color: '#101B10',
                lineHeight: 20,
                textAlign: 'center',
              }}>
              Thank You! We will review your comments and take any necessary
              actions.
            </Text>
          </View>
        </View>
      );
    };

    const renderBottom = () => {
      const renderButton1 = () => {
        return (
          <>
            <TouchableOpacity
              onPress={closeModal}
              activeOpacity={0.7}
              style={{
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: theme.color.button1,
                height: 50,
                borderRadius: 10,
                alignSelf: 'center',
                opacity: 1,
              }}>
              <Text
                style={{
                  color: theme.color.buttonText,
                  fontSize: 16,
                  fontFamily: theme.fonts.fontBold,
                  textTransform: 'none',
                }}>
                Done
              </Text>
            </TouchableOpacity>
          </>
        );
      };

      return (
        <View
          style={
            c
              ? {
                  backgroundColor: theme.color.background,
                  shadowColor: '#000000',
                  shadowOffset: {width: 0, height: -1}, // change this for more shadow
                  shadowOpacity: 0.1,
                  elevation: 5,
                  borderBottomLeftRadius: 10,
                  borderBottomRightRadius: 10,
                  marginTop: 5,
                }
              : {marginTop: 20}
          }>
          <View
            style={
              c ? styles.modalBottomContainer : styles.modalBottomContainer2
            }>
            {renderButton1()}
          </View>
        </View>
      );
    };

    return (
      <MModal visible={isSendReport} transparent onRequestClose={closeModal}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalContainer2}>
            <View
              onLayout={event => {
                if (!c) {
                  let {height} = event.nativeEvent.layout;
                  setmodalHeight(height);
                }
              }}
              style={style}>
              {c && (
                <>
                  {renderHeader()}
                  <ScrollView
                    contentContainerStyle={{paddingHorizontal: 15}}
                    showsVerticalScrollIndicator={false}
                    style={{flex: 1}}>
                    {renderCenter()}
                  </ScrollView>
                  {renderBottom()}
                </>
              )}

              {!c && (
                <>
                  {renderHeader()}
                  {renderCenter()}
                  {renderBottom()}
                </>
              )}
            </View>
          </View>
        </SafeAreaView>
      </MModal>
    );
  };

  return (
    <View style={styles.container}>
      <utils.StackHeader
        screen={'userprofile'}
        bell={true}
        props={props}
        headerTitle={headerTitle}
      />
      {!internet && <utils.InternetMessage />}
      <SafeAreaView style={styles.container2}>
        <View style={styles.container3}>
          {renderProfileSection()}
          <View style={{flex: 1}}>{!isBlock && renderTabBar()}</View>
          <Toast ref={toast} position="bottom" />

          {renderShowCahngePhotoModal()}
        </View>
      </SafeAreaView>

      {isModal && renderModal()}
      {isSendMessage && renderMessageSendModal()}
      {isSendReport && renderRepoerSendModal()}
      {renderBottomSheet()}
      {pvm && (
        <utils.FullimageModal
          data={pv}
          si={0}
          show={pvm}
          closModal={() => setpvm(!pvm)}
        />
      )}
      {/* {store.Notifications.isShowNotifcation && <utils.ShowNotifications />} */}
      <utils.Loader load={loader} />
    </View>
  );
}
