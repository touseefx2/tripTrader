import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';
import NetInfo from '@react-native-community/netinfo';
import auth from '@react-native-firebase/auth';
import {observer} from 'mobx-react';
import moment from 'moment';
import React, {useRef, useState} from 'react';
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  Modal as MModal,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Image as ImageCompressor} from 'react-native-compressor';
import DatePicker from 'react-native-date-picker';
import Toast from 'react-native-easy-toast';
import {ScrollView} from 'react-native-gesture-handler';
import IntentLauncher from 'react-native-intent-launcher';
import IntlPhoneInput from 'react-native-intl-phone-input';
import * as RNLocalize from 'react-native-localize';
import {ActivityIndicator} from 'react-native-paper';
import {check, PERMISSIONS, request} from 'react-native-permissions';
import store from '../../store/index';
import theme from '../../theme';
import utils from '../../utils/index';
import {styles} from './styles';

export default observer(EditProfile);

function EditProfile(props) {
  const mobileReg = /^[0][3]\d{9}$/;
  const emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
  const cnicReg = /\d{5}\d{8}\d/;

  const toast = useRef(null);
  const toastduration = 700;
  let headerTitle = 'Edit Profile';

  let internet = store.General.isInternet;
  let user = store.User.user;
  let loader = store.User.regLoader;

  let loc = store.User.location;
  let cart = store.User.cart;
  let totalItems = cart.data.length > 0 ? cart.totalitems : 0;
  let tagLine = '';

  // let phn = props.route.params.phn;
  // let cntry =
  //   props.route.params.cntry == ''
  //
  // let pwc = props.route.params.pwc;

  let phn = store.User.phn;
  let cntry = store.User.cntr == '' ? RNLocalize.getCountry() : store.User.cntr;
  let pwc = store.User.pwc;

  let userFName = '';
  let userLName = '';
  let eml = '';
  let dtob = new Date();

  if (user != 'guest' && user) {
    userFName = user.firstName;
    userLName = user.lastName;
    eml = user.email;
    dtob = new Date(user.birthDate); //user.dob
  }
  let src = '';
  if (user != 'guest' && user) {
    src = user.image && user.image != '' ? user.image : '';
  }
  let srccnic = '';
  let isCnicVerf = false;

  if (user != 'guest' && user) {
    srccnic =
      user.identityProof && user.identityProof != '' ? user.identityProof : '';
    isCnicVerf = user.identityStatus == 'verified' ? true : false;
  }

  const [isOtpModal, setisOtpModal] = useState(false);

  const [fn, setfn] = useState(userFName);
  const [Emptyfn, setEmptyfn] = useState(false);
  const [invalidfn, setinvalidfn] = useState(false);

  const [ln, setln] = useState(userLName);
  const [Emptyln, setEmptyln] = useState(false);
  const [invalidln, setinvalidln] = useState(false);

  const [email, setemail] = useState(eml);
  const [Emptyemail, setEmptyemail] = useState(false);
  const [invalidemail, setinvalidemail] = useState(false);

  const [dob, setdob] = useState(dtob);
  const [pudshow, setPUdShow] = useState(false);
  const [puTime, setPUTime] = useState(new Date());
  const [Emptydob, setEmptydob] = useState(false);

  const [phone, setphone] = useState(phn);

  const [phoneCountryCode, setphoneCountryCode] = useState(cntry);
  const [isVerifyPhone, setisVerifyPhone] = useState(phn != '' ? true : 'a');
  const [invalidphone, setinvalidphone] = useState(false);

  const [photo, setphoto] = useState(src);
  const [cnicFrontImage, setCnicFrontImage] = useState(srccnic);

  const [cnicfImageLoader, setcnicfImageLoader] = useState(false);
  const [profileImageLoader, setprofileImageLoader] = useState(false);
  const [showFullprofileImageLoader, setshowFullprofileImageLoader] =
    useState(false);

  const [pvm, setpvm] = useState(false); //show fulll image modal
  const [pv, setpv] = useState(''); //photo view

  const [errorMessage, seterrorMessage] = useState('');

  const [isShowPrmsn, setisShowPrmsn] = useState(false);
  const [prmsnChk, setprmsnChk] = useState('storage');
  const [isAddPhotoModal, setisAddPhotoModal] = useState(false);
  const [DT, setDT] = useState(false);

  let isEmailDisable = true;

  const suc = () => {
    props.navigation.navigate('MyProfile');
  };

  const signoutCurrentUser = () => {
    if (auth().currentUser) {
      auth().currentUser.delete();
      auth().signOut();
    }
  };

  const isPhoneExist = chk => {
    if (!chk) {
      let imgArr = [];

      if (photo?.uri) {
        photo.chk = 'Profile';
        imgArr.push(photo);
      }

      if (cnicFrontImage?.uri) {
        cnicFrontImage.chk = 'CnicF';
        imgArr.push(cnicFrontImage);
      }

      const body = {
        firstName: fn,
        lastName: ln,
        birthDate: dob,
        image: photo,
        identityProof: cnicFrontImage,
        phone: phone != '' ? phone.substring(1) : phone,
        phoneCountryCode:
          phoneCountryCode == '' ? RNLocalize.getCountry() : phoneCountryCode,
        profileUpdateByUser: true,
      };

      if (phn !== phone) {
        console.log('phone change');
        signoutCurrentUser();
        setisOtpModal(true);
        return;
      } else {
        if (imgArr.length <= 0) {
          store.User.attemptToEditupdateUser(body, suc);
        } else {
          store.User.attemptToEditUploadImage(body, imgArr, suc);
        }
        return;
      }
    }
  };

  const saveProfile = () => {
    clearAllField();
    Keyboard.dismiss();

    if (fn == '') {
      setEmptyfn(true);
      return;
    }

    if (ln == '') {
      setEmptyln(true);
      return;
    }

    if (email == '') {
      setEmptyemail(true);
      return;
    }

    if (emailReg.test(email) === false) {
      setinvalidemail(true);
      return;
    }

    if (dob == '') {
      setEmptydob(true);
      return;
    }

    if (phone != '' && (isVerifyPhone == false || isVerifyPhone == 'a')) {
      setinvalidphone(true);
      return;
    }

    let imgArr = [];

    if (photo?.uri) {
      photo.chk = 'Profile';
      imgArr.push(photo);
    }

    if (cnicFrontImage?.uri) {
      cnicFrontImage.chk = 'CnicF';
      imgArr.push(cnicFrontImage);
    }

    const body = {
      firstName: fn,
      lastName: ln,
      birthDate: dob,
      image: photo,
      identityProof: cnicFrontImage,
      phone: phone != '' ? phone.substring(1) : phone,
      phoneCountryCode:
        phoneCountryCode == '' ? RNLocalize.getCountry() : phoneCountryCode,
      profileUpdateByUser: true,
    };

    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        store.User.setregLoader(true);

        if (phone !== '') {
          store.User.isPhoneExistEditProfile(phone, body, imgArr, isPhoneExist);
        } else {
          if (imgArr.length <= 0) {
            store.User.attemptToEditupdateUser(body, suc);
          } else {
            store.User.attemptToEditUploadImage(body, imgArr, suc);
          }
        }
      } else {
        // seterrorMessage('Please connect internet');
        Alert.alert('', 'Please connect internet');
      }
    });
  };

  const attemptToSaveProfile = () => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        let imgArr = [];

        if (photo?.uri) {
          photo.chk = 'Profile';
          imgArr.push(photo);
        }

        if (cnicFrontImage?.uri) {
          cnicFrontImage.chk = 'CnicF';
          imgArr.push(cnicFrontImage);
        }

        const body = {
          firstName: fn,
          lastName: ln,
          birthDate: dob,
          image: photo,
          identityProof: cnicFrontImage,
          phone: phone != '' ? phone.substring(1) : phone,
          phoneCountryCode:
            phoneCountryCode == '' ? RNLocalize.getCountry() : phoneCountryCode,
          profileUpdateByUser: true,
        };

        store.User.setregLoader(true);
        if (imgArr.length <= 0) {
          store.User.attemptToEditupdateUser(body, suc);
        } else {
          store.User.attemptToEditUploadImage(body, imgArr, suc);
        }
      } else {
        Alert.alert('', 'Please connect internet');
      }
    });
  };

  const clearAllField = () => {
    setinvalidphone(false);
    seterrorMessage('');
    setEmptyfn(false);
    setinvalidfn(false);
    setEmptyln(false);
    setinvalidln(false);
    setEmptyemail(false);
    setinvalidemail(false);
    setEmptydob(false);
  };

  const setErrMessage = c => {
    seterrorMessage(c);
  };

  const MultipleImage = async button => {
    setisShowPrmsn(false);
    setisAddPhotoModal(false);
    let apiLevel = store.General.apiLevel;

    setTimeout(async () => {
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
              if (button == 'Profile') {
                setphoto(imageObject);
                return;
              } else if (button == 'CNICFront') {
                setCnicFrontImage(imageObject);
                return;
              } else {
                return;
              }
            })
            .catch(err => {
              console.log('Image compress error : ', err);
            });
        }

        console.log('multi photo picker res  : ', res);
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

    if (c == 'cnicfView') {
      setpv([cnicFrontImage.uri ? cnicFrontImage.uri : cnicFrontImage]);
      setpvm(true);
      return;
    }

    MultipleImage(c);
  };

  const renderShowFieldError = c => {
    let text = c == 'card' ? cardErr : '';

    if (c == 'fn') {
      text = invalidfn
        ? 'First name is invalid'
        : Emptyfn
        ? 'Please enter a first name'
        : '';
    }

    if (c == 'ln') {
      text = invalidln
        ? 'Last name is invalid'
        : Emptyln
        ? 'Please enter a last name'
        : '';
    }

    if (c == 'email') {
      text = invalidemail
        ? 'Email contains invalid characters'
        : Emptyemail
        ? 'Please enter email'
        : '';
    }

    if (c == 'dob') {
      text = Emptydob ? 'Please select your birth date' : '';
    }

    if (c == 'phone') {
      text = invalidphone ? 'Phone number does not appear valid' : '';
    }

    return (
      <View style={styles.errorMessageFieldContainer}>
        <Text style={styles.errorMessageFieldText}>{text}</Text>
      </View>
    );
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
          {!profileImageLoader && photo != '' && (
            <ActivityIndicator
              size={22}
              color={theme.color.button1}
              style={{top: 40, position: 'absolute'}}
            />
          )}
        </TouchableOpacity>
      );
    };

    return (
      <View style={styles.profileSecConatiner}>{renderProfileShow()}</View>
    );
  };

  const renderFields = () => {
    // Methods

    const enterFn = t => {
      setEmptyfn(false);
      setinvalidfn(false);
      setfn(t);
    };

    const enterLn = t => {
      setEmptyln(false);
      setinvalidln(false);
      setln(t);
    };

    const enterEmail = t => {
      setinvalidemail(false);
      setEmptyemail(false);
      setemail(t);
    };

    const showPUDatepicker = () => {
      Keyboard.dismiss();
      setEmptydob(false);

      setPUdShow(true);
    };

    const onPUDChange = (event, selectedDate) => {
      const selDate = selectedDate || dob;
      const e = event.type;
      if (Platform.OS === 'android') {
        setPUdShow(false);
      }

      if (e == 'set') {
        setPUTime(selDate);
        setdob(selDate);
      }
    };

    const setPhoneNumber = p => {
      setinvalidphone(false);
      setisVerifyPhone(p.isVerified);
      if (p.unmaskedPhoneNumber == '') {
        setisVerifyPhone('a');
        setphone('');
        setphoneCountryCode('');
      } else {
        setphoneCountryCode(p.selectedCountry.code);
        setphone(p.dialCode + p.unmaskedPhoneNumber);
      }
    };

    const formatDate = date => {
      var dd = moment(date).format('MM / DD / yyyy');
      return dd;
    };

    return (
      <View style={styles.section2}>
        {/* {errorMessage !== '' && renderShowError()} */}

        <View style={styles.joinFieldContainer}>
          <View style={[styles.Field, {width: '48%'}]}>
            <Text style={styles.FieldTitle1}>first name</Text>
            <TextInput
              placeholder=""
              value={fn}
              onChangeText={enterFn}
              style={[
                styles.FieldInput,
                {
                  borderColor:
                    invalidfn || Emptyfn
                      ? theme.color.fieldBordeError
                      : theme.color.fieldBorder,
                },
              ]}
            />
            {(invalidfn || Emptyfn) && renderShowFieldError('fn')}
          </View>

          <View style={[styles.Field, {width: '48%'}]}>
            <Text style={styles.FieldTitle1}>last name</Text>
            <TextInput
              placeholder=""
              value={ln}
              onChangeText={enterLn}
              style={[
                styles.FieldInput,
                {
                  borderColor:
                    invalidln || Emptyln
                      ? theme.color.fieldBordeError
                      : theme.color.fieldBorder,
                },
              ]}
            />
            {(invalidln || Emptyln) && renderShowFieldError('ln')}
          </View>
        </View>

        <View style={styles.Field}>
          <Text style={styles.FieldTitle1}>email address</Text>
          <TextInput
            editable={isEmailDisable ? false : true}
            placeholder=""
            value={email}
            onChangeText={enterEmail}
            style={[
              styles.FieldInput,
              {
                borderColor:
                  invalidemail || Emptyemail
                    ? theme.color.fieldBordeError
                    : theme.color.fieldBorder,
                backgroundColor: !isEmailDisable
                  ? theme.color.fieldBc
                  : theme.color.disableBack,
              },
            ]}
          />
          {(invalidemail || Emptyemail) && renderShowFieldError('email')}
        </View>

        <View style={styles.Field}>
          <Text style={[styles.FieldTitle1, {textTransform: 'none'}]}>
            Date of Birth
          </Text>
          <View
            style={[
              styles.FieldInput,
              {
                borderColor: Emptydob
                  ? theme.color.fieldBordeError
                  : theme.color.fieldBorder,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              },
            ]}>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={showPUDatepicker}
              style={{width: '85%'}}>
              {dob == '' && (
                <Text style={styles.DateTextPlaceholder}>mm / dd / yyyy</Text>
              )}
              {dob != '' && (
                <Text style={styles.DateText}>{formatDate(dob)}</Text>
              )}
            </TouchableOpacity>

            <utils.vectorIcon.AntDesign
              name={'calendar'}
              color={theme.color.button1}
              size={20}
            />
          </View>
          {Emptydob && renderShowFieldError('dob')}
        </View>

        <View style={styles.Field}>
          <Text style={styles.FieldTitle1}>phone number</Text>

          <View
            style={[
              styles.phoneInputContainer,
              {
                borderColor:
                  isVerifyPhone == false
                    ? theme.color.fieldBordeError
                    : theme.color.fieldBorder,
              },
            ]}>
            <IntlPhoneInput
              clearPhone={() => {
                setphone('');
                setphoneCountryCode('');
              }}
              onChangeText={p => {
                setPhoneNumber(p);
              }}
              phone={pwc}
              defaultCountry={cntry}
              lang="EN"
              renderAction={() => (
                <>
                  {!isVerifyPhone && phone != '' && (
                    <utils.vectorIcon.Entypo
                      name="cross"
                      color={theme.color.subTitle}
                      size={18}
                    />
                  )}

                  {isVerifyPhone == true && (
                    <utils.vectorIcon.Entypo
                      name="check"
                      color={'green'}
                      size={18}
                    />
                  )}
                </>
              )}
            />
          </View>

          {invalidphone && renderShowFieldError('phone')}
        </View>

        <View style={styles.Field}>
          {/* {!isCnicVerf && ( */}
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <utils.vectorIcon.AntDesign
              name="idcard"
              color={theme.color.titleGreen}
              size={20}
            />
            <Text style={[styles.FieldTitle1, {marginLeft: 7}]}>
              Identity Verification
            </Text>
          </View>
          {/* )} */}

          {!isCnicVerf && (
            <TouchableOpacity
              disabled={cnicFrontImage == '' ? true : false}
              activeOpacity={0.7}
              onPress={() => {
                onclickImage('cnicfView');
              }}
              style={styles.idCardContainer}>
              {cnicFrontImage == '' && (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: 10,
                  }}>
                  {/* <utils.vectorIcon.AntDesign
                  name="upload"
                  color={theme.color.titleGreen}
                  size={20}
                  style={{marginBottom: 10}}
                /> */}
                  <Text style={styles.idCardContainerText}>
                    Upload id card photo for account verification
                  </Text>
                </View>
              )}
              {cnicFrontImage != '' && (
                <Image
                  onLoadStart={() => {
                    setcnicfImageLoader(false);
                  }}
                  onLoad={() => {
                    setcnicfImageLoader(true);
                  }}
                  style={styles.idCardContainerImage}
                  source={{
                    uri: cnicFrontImage.uri
                      ? cnicFrontImage.uri
                      : cnicFrontImage,
                  }}
                />
              )}
              {!cnicfImageLoader && cnicFrontImage != '' && (
                <ActivityIndicator
                  size={25}
                  color={theme.color.button1}
                  style={{top: 55, position: 'absolute'}}
                />
              )}
            </TouchableOpacity>
          )}

          {isCnicVerf && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 10,
              }}>
              <Image
                style={{height: 26, width: 26, resizeMode: 'contain'}}
                source={require('../../assets/images/identityVerify/img.png')}
              />
              <Text style={styles.idCardChangeTextV}>
                Your ID has been verified!
              </Text>
            </View>
          )}

          {!isCnicVerf && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 10,
              }}>
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => {
                  setisAddPhotoModal(true);
                  setDT('CNICFront');
                }}>
                <Text style={styles.idCardChangeText1}>Click here </Text>
              </TouchableOpacity>

              <Text style={styles.idCardChangeText2}>
                {cnicFrontImage.uri || cnicFrontImage != ''
                  ? 'to upload a new ID card.'
                  : 'to add ID card'}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const rendermainButton2 = () => {
    return (
      <TouchableOpacity
        onPress={saveProfile}
        activeOpacity={0.7}
        style={[styles.BottomButton, {marginTop: 20}]}>
        <Text style={styles.buttonTextBottom}>Save Profile</Text>
      </TouchableOpacity>
    );
  };
  const renderDateShowModal = () => {
    return (
      <DatePicker
        maximumDate={new Date()}
        modal
        mode="date"
        format="MM-DD-YYYY"
        open={pudshow}
        date={dob}
        onConfirm={date => {
          console.log('data : ', date);
          setPUdShow(false);
          setdob(date);
        }}
        onCancel={() => {
          setPUdShow(false);
        }}
      />
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
          console.warn('Permsiion error : ', error);
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
                    <Text style={styles.section2Title1}>
                      {DT == 'Profile'
                        ? 'add profile photo'
                        : 'verify identity'}
                    </Text>

                    <Image
                      source={
                        DT == 'Profile'
                          ? require('../../assets/images/addphoto/img.png')
                          : require('../../assets/images/addcnic/img.png')
                      }
                      style={styles.section2Logo}
                    />

                    <Text
                      style={[styles.section2LogoTitle, {textAlign: 'center'}]}>
                      {DT == 'Profile'
                        ? ' Upload a photo to help the community recognize and promote your account.'
                        : 'Trip Trader is committed to community trust and security. Providing a valid government-issued ID to confirm your identity helps us keep the community safe and creates trust between you and other traders.'}
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
      <utils.DrawerHeader props={props} headerTitle={headerTitle} />
      {!internet && <utils.InternetMessage />}

      <SafeAreaView style={styles.container2}>
        <View style={styles.container3}>
          <KeyboardAvoidingView style={{flex: 1}} enabled>
            <ScrollView
              contentContainerStyle={{
                paddingHorizontal: 20,
                paddingBottom: 20,
              }}>
              {renderProfileSection()}
              {renderFields()}
              {rendermainButton2()}
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
        <utils.Footer
          nav={props.navigation}
          screen={headerTitle}
          focusScreen={store.General.focusScreen}
        />
      </SafeAreaView>

      <Toast ref={toast} position="bottom" />

      <utils.Loader load={loader} />
      {renderDateShowModal()}

      {pvm && (
        <utils.FullimageModal
          data={pv}
          si={0}
          show={pvm}
          closModal={() => setpvm(!pvm)}
        />
      )}

      {isOtpModal && (
        <utils.OtpModal
          isModal={isOtpModal}
          setisModal={c => {
            setisOtpModal(c);
          }}
          attemptTosaveProfile={() => attemptToSaveProfile()}
          phone={phone}
          signoutCurrentUser={() => signoutCurrentUser()}
        />
      )}

      {isAddPhotoModal && renderAddPhotoModal()}
    </View>
  );
}
