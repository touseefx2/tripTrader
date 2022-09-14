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
  TextInput,
  Keyboard,
} from 'react-native';
// import Geolocation from 'react-native-geolocation-service';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
// import Geocoder from 'react-native-geocoding';
import {styles} from './styles';
import {observer} from 'mobx-react';
import store from '../../store/index';
import utils from '../../utils/index';
import theme from '../../theme';
// import DynamicTabView from 'react-native-dynamic-tab-view';
// import ImageSlider from 'react-native-image-slider';
// import FastImage from 'react-native-fast-image';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-easy-toast';
import moment from 'moment';
import RBSheet from 'react-native-raw-bottom-sheet';
import {ActivityIndicator} from 'react-native-paper';
import {ScrollView} from 'react-native-gesture-handler';
import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';
import {Image as ImageCompressor} from 'react-native-compressor';
import Modal from 'react-native-modal';
import IntlPhoneInput from 'react-native-intl-phone-input';
import * as RNLocalize from 'react-native-localize';
import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from 'react-native-date-picker';

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

  let phn = props.route.params.phn;
  let cntry =
    props.route.params.cntry == ''
      ? RNLocalize.getCountry()
      : props.route.params.cntry;
  let pwc = props.route.params.pwc;

  let userFName = '';
  let userLName = '';
  let eml = '';
  let dtob = new Date();

  if (user != 'guest' && user) {
    userFName = user.first_name;
    userLName = user.last_name;
    eml = user.email;
    dtob = new Date(user.dob); //user.dob
  }
  let src = '';
  if (user != 'guest' && user) {
    src = user.photo != '' ? user.photo : '';
  }
  let srccnic = '';
  if (user != 'guest' && user) {
    srccnic = user.cnic_front_image != '' ? user.cnic_front_image : '';
  }

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

  let isEmailDisable = false;

  const goBack = () => {
    props.navigation.goBack();
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
      first_name: fn,
      last_name: ln,
      dob: dob,
      photo: photo,
      cnic_front_image: cnicFrontImage,
      phone: phone,
    };

    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        // store.User.attemptToUploadImageEP(body, imgArr, setErrMessage, goBack);
        store.User.attemptToUploadImageEPS(
          body,
          photo.uri ? photo.uri : photo,
          cnicFrontImage.uri ? cnicFrontImage.uri : cnicFrontImage,
          setErrMessage,
          goBack,
        );
      } else {
        // seterrorMessage('Please connect internet');
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

  const renderHeader = () => {
    const render1 = () => {
      const onClick = () => {
        goBack();
      };
      return (
        <TouchableOpacity activeOpacity={0.4} onPress={onClick}>
          <utils.vectorIcon.Ionicons
            name="ios-chevron-back"
            color={theme.color.backgroundGreenText}
            size={24}
          />
        </TouchableOpacity>
      );
    };

    const render2 = () => {
      return (
        <View style={{width: '75%'}}>
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
      const onClick = () => {
        props.navigation.navigate('Notifications', {screen: headerTitle});
      };
      return (
        <TouchableOpacity
          style={{width: 22}}
          disabled
          activeOpacity={0.4}
          onPress={onClick}>
          {/* <utils.vectorIcon.SimpleLineIcons
            name="bell"
            color={theme.color.backgroundGreenText}
            size={22}
          />
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 8 / 2,
              position: 'absolute',
              right: 0,
              top: 2,
              backgroundColor: theme.color.ntfctnClr,
            }}></View> */}
        </TouchableOpacity>
      );
    };

    return (
      <View style={styles.headerConatainer}>
        {render1()}
        {render2()}
        {render3()}
      </View>
    );
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
              setphoto(imageObject);
              return;
            } else if (button == 'cnicfChange') {
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
    } catch (error) {
      console.log('multi photo picker error : ', error);
    }
  };

  const changePhoto = c => {
    if (c == 'photoView') {
      setpv(photo.uri ? photo.uri : photo);
      setpvm(true);
      return;
    }

    if (c == 'cnicfView') {
      setpv(cnicFrontImage.uri ? cnicFrontImage.uri : cnicFrontImage);
      setpvm(true);
      return;
    }

    MultipleImage(c);
  };

  const uploadPhoto = c => {
    let imgArr = [];

    if (c == 'Profile') {
      photo.chk = 'Profile';
      imgArr.push(photo);
    }

    // if (c == 'CNICFront') {
    //   cnicFrontImage.chk = 'CnicF';
    //   imgArr.push(cnicFrontImage);
    // }

    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        store.User.attemptToUploadImage2(imgArr, setErrMessage, setPhoto);
      } else {
        // seterrorMessage('Please connect internet');
        Alert.alert('', 'Please connect internet');
      }
    });
  };

  const renderFullImage = () => {
    return (
      <MModal
        visible={pvm}
        transparent
        onRequestClose={() => {
          setpvm(false);
          setpv('');
        }}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'black',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            onLoadStart={() => {
              setshowFullprofileImageLoader(false);
            }}
            onLoad={() => {
              setshowFullprofileImageLoader(true);
            }}
            style={{position: 'absolute', top: 0, left: 0, bottom: 0, right: 0}}
            resizeMode="contain"
            source={{uri: pv}}
          />

          <TouchableOpacity
            onPress={() => {
              setpvm(!pvm);
              setpv('');
            }}
            style={{
              backgroundColor: theme.color.button1,
              borderRadius: 20,
              width: 40,
              height: 40,
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              top: Platform.OS == 'ios' ? APPBAR_HEIGHT + 12 : 12,
              left: 12,
            }}>
            <utils.vectorIcon.Entypo name="cross" color="white" size={35} />
          </TouchableOpacity>
        </View>
      </MModal>
    );
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
          <TouchableOpacity
            style={styles.changeImgContainer}
            onPress={() => changePhoto('photoChange')}
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
        setphone('');
        setisVerifyPhone('a');
      } else {
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
          <TouchableOpacity
            disabled={cnicFrontImage == '' ? true : false}
            activeOpacity={0.7}
            onPress={() => {
              changePhoto('cnicfView');
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
                  Upolad id card photo for account verification
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
                  uri: cnicFrontImage.uri ? cnicFrontImage.uri : cnicFrontImage,
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
          <View
            style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                changePhoto('cnicfChange');
              }}>
              <Text style={styles.idCardChangeText1}>Click here </Text>
            </TouchableOpacity>

            <Text style={styles.idCardChangeText2}>
              {cnicFrontImage == ''
                ? 'to uplaod a new ID card.'
                : 'to change a new ID card.'}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  // const rendermainButton = () => {
  //   return (
  //     <View
  //       style={{
  //         padding: 20,
  //         backgroundColor: theme.color.mainbottombutonbackground,
  //         shadowColor: 'black',
  //         shadowOffset: {
  //           width: 0,
  //           height: 11,
  //         },
  //         shadowOpacity: 0.55,
  //         shadowRadius: 14.78,

  //         elevation: 22,
  //       }}>
  //       <TouchableOpacity
  //         onPress={saveProfile}
  //         activeOpacity={0.7}
  //         style={styles.BottomButton}>
  //         <Text style={styles.buttonTextBottom}>Save Profile</Text>
  //       </TouchableOpacity>
  //     </View>
  //   );
  // };

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

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      {!internet && <utils.InternetMessage />}

      <ScrollView
        contentContainerStyle={{paddingHorizontal: 20, paddingBottom: 20}}>
        {renderProfileSection()}
        {renderFields()}
        {rendermainButton2()}
      </ScrollView>
      {/* {rendermainButton()} */}

      <Toast ref={toast} position="bottom" />

      {pvm && renderFullImage()}
      <utils.Loader load={loader} />
      {renderDateShowModal()}
    </SafeAreaView>
  );
}
