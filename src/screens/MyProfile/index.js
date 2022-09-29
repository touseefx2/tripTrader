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
} from 'react-native';

import {styles} from './styles';
import {observer} from 'mobx-react';
import store from '../../store/index';
import utils from '../../utils/index';
import theme from '../../theme';

import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-easy-toast';

import RBSheet from 'react-native-raw-bottom-sheet';
import {ActivityIndicator} from 'react-native-paper';

import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';
import {Image as ImageCompressor} from 'react-native-compressor';

import {TabView, SceneMap} from 'react-native-tab-view';
import Reviews from './Reviews';
import Trips from './Trips';
import Photos from './Photos';

export default observer(MyProfile);

function MyProfile(props) {
  const toast = useRef(null);
  const toastduration = 700;
  let headerTitle = 'My Profile';

  let internet = store.General.isInternet;
  let user = store.User.user;
  let loader = store.User.regLoader;

  let loc = store.User.location;
  let cart = store.User.cart;
  let totalItems = cart.data.length > 0 ? cart.totalitems : 0;
  let tagLine = '';

  let userName = '';
  let phn = '';
  let followers = 102;
  let following = 100;
  let src = '';
  let srccnic = '';

  if (user == 'guest') {
    userName = 'guest';
  }

  if (user != 'guest' && user) {
    userName = user.first_name + ' ' + user.last_name;
    phn = user.phone;
    src = user.photo != '' ? user.photo : '';
    srccnic = user.cnic_front_image != '' ? user.cnic_front_image : '';
  }

  const [tab, setTab] = useState('reviews');

  const [photo, setphoto] = useState(src);

  const [phone, setPhone] = useState(phn);
  const [cntry, setcntry] = useState('');
  const [pwc, setpwc] = useState('');

  const [pvm, setpvm] = useState(false); //show fulll image modal
  const [pv, setpv] = useState(''); //photo view

  const [profileImageLoader, setprofileImageLoader] = useState(false);
  const [showFullprofileImageLoader, setshowFullprofileImageLoader] =
    useState(false);

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
    trips: Trips,
    photos: Photos,
  });

  useEffect(() => {
    if (phone != '') {
      setTimeout(() => {
        let Countries = utils.Countries;
        for (let index = 0; index < Countries.length; index++) {
          const e = Countries[index];
          let result = phone.includes(e.dialCode);
          if (result) {
            setcntry(e.code);
            setpwc(phone.slice(e.dialCode.length));
            break;
          }
        }
      }, 1000);
    } else {
      setpwc('');
    }
  }, [phone]);
  useEffect(() => {
    store.User.setphn(phone);
    store.User.setcntr(cntry);
    store.User.setpwc(pwc);
  }, [phone, cntry, pwc]);

  useEffect(() => {
    if (user && user !== 'guest') {
      setPhone(user.phone);
      setphoto(user.photo);
    }
  }, [user]);

  useEffect(() => {
    if (user && user !== 'guest') {
      setTimeout(() => {
        setisTabBarShow(true);
      }, 100);
    }
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
          {user && user !== 'guest' && (
            <TouchableOpacity
              style={styles.changeImgContainer}
              onPress={() => changePhoto('photoChange')}
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
              <View style={styles.profileTitle2Conatiner1}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles.profileTitle2ConatinerTitle}>
                  <Text style={styles.profileTitle2ConatinerTitle2}>
                    {followers}
                    {'  '}
                  </Text>
                  followers
                </Text>
              </View>

              <View style={styles.profileTitle2Conatiner2}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles.profileTitle2ConatinerTitle}>
                  <Text style={styles.profileTitle2ConatinerTitle2}>
                    {following}
                    {'  '}
                  </Text>
                  following
                </Text>
              </View>
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
                  color: theme.color.subTitle,
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

    // const renderButtonCP = c => {
    //   return (
    //     <>
    //       <TouchableOpacity
    //         onPress={() => {
    //           changePhoto(c);
    //         }}
    //         activeOpacity={0.7}
    //         style={[
    //           styles.BottomButton,
    //           {
    //             marginTop: 12,
    //             backgroundColor: theme.color.background,
    //             borderWidth: 0.5,
    //             borderColor: theme.color.subTitle,
    //           },
    //         ]}>
    //         <Text
    //           style={[
    //             styles.buttonTextBottom,
    //             {
    //               color: theme.color.buttonTextGreen,
    //               fontFamily: theme.fonts.fontMedium,
    //             },
    //           ]}>
    //           Change Photo
    //         </Text>
    //       </TouchableOpacity>
    //     </>
    //   );
    // };

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
            {/* {renderButtonCP('photoChange')} */}
          </View>
        </View>
      </MModal>
    );
  };

  return (
    <View style={styles.container}>
      {/* {tagLine != '' && <utils.TagLine tagLine={tagLine} />} */}
      <utils.DrawerHeader props={props} headerTitle={headerTitle} />
      {!internet && <utils.InternetMessage />}
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
          closModal={() => setpvm(!pvm)}
        />
      )}
    </View>
  );
}
