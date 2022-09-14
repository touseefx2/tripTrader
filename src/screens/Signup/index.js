import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ImageBackground,
  Linking,
  ScrollView,
  TextInput,
  PermissionsAndroid,
  Dimensions,
  Alert,
  Keyboard,
  Platform,
  StatusBar,
  KeyboardAvoidingView,
  Modal as MModal,
} from 'react-native';
import {styles} from './styles';
import {inject, observer} from 'mobx-react';
import store from '../../store/index';
import utils from '../../utils/index';
import theme from '../../theme';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Toast from 'react-native-easy-toast';
import NetInfo from '@react-native-community/netinfo';
import moment, {months} from 'moment';
import Modal from 'react-native-modal';
import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';
import {Image as ImageCompressor} from 'react-native-compressor';
import {
  CreditCardInput,
  LiteCreditCardInput,
} from 'react-native-credit-card-input';
import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from 'react-native-date-picker';
// import DatePicker from 'react-native-datepicker';

export default observer(Signup);
function Signup(props) {
  const mobileReg = /^[0][3]\d{9}$/;
  const emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
  const cnicReg = /\d{5}\d{8}\d/;

  const toast = useRef(null);
  const toastduration = 700;

  let user = store.User.user;
  let userFirstName = user.first_name || '';
  let loader = store.User.regLoader;

  const [isUserCreate, setisUserCreate] = useState(false);

  const [cfn, setcfn] = useState('');
  const [Emptycfn, setEmptycfn] = useState(false);

  const [isValidCard, setisValidCard] = useState('null');
  const [cardErr, setcardErr] = useState('');
  const [cn, setcn] = useState('');
  const [ct, setct] = useState('');
  const [ce, setce] = useState('');
  const [ccvc, setccvc] = useState('');
  const [inValidcn, setinValidcn] = useState('null');
  const [inValidce, setinValidce] = useState('null');
  const [inValidccvc, setinValidccvc] = useState('null');
  const [pc, setpc] = useState('');
  const [isShowPromoFiled, setisShowPromoFiled] = useState(false);
  const [isPromoApply, setisPromoApply] = useState(false);
  const [promoValue, setpromoValue] = useState(0);

  const [fn, setfn] = useState('');
  const [Emptyfn, setEmptyfn] = useState(false);
  const [invalidfn, setinvalidfn] = useState(false);

  const [ln, setln] = useState('');
  const [Emptyln, setEmptyln] = useState(false);
  const [invalidln, setinvalidln] = useState(false);

  const [email, setemail] = useState('');
  const [Emptyemail, setEmptyemail] = useState(false);
  const [invalidemail, setinvalidemail] = useState(false);

  const [dob, setdob] = useState('');
  const [pudshow, setPUdShow] = useState(false);
  const [puTime, setPUTime] = useState(new Date());
  const [Emptydob, setEmptydob] = useState(false);

  const [pswd, setpswd] = useState('');
  const [Emptypswd, setEmptypswd] = useState(false);
  const [invalidpswd, setinvalidpswd] = useState(false);
  const [showPaswd, setshowPaswd] = useState(false);

  const [photo, setphoto] = useState('');
  const [isPhotoUpload, setisPhotoUpload] = useState(true);
  const [cnicFrontImage, setCnicFrontImage] = useState('');
  const [isCnicFrontUplaod, setisCnicFrontUplaod] = useState(true);

  const [isPhoto1Upload, setisPhoto1Upload] = useState(0);

  const [pvm, setpvm] = useState(false); //show fulll image modal
  const [pv, setpv] = useState(''); //photo view

  const [isTerms, setisTerms] = useState(false);
  const [EmptyTerms, setEmptyTerms] = useState(false);

  const [iscTerms, setiscTerms] = useState(false);
  const [EmptycTerms, setEmptycTerms] = useState(false);

  const [errorMessage, seterrorMessage] = useState('');

  const [usr, setusr] = useState(false);
  const [token, setToken] = useState('');
  const [uphoto, setuphoto] = useState('');
  const [ucnicF, setucnicF] = useState('');
  const [plan, setPlan] = useState(false);

  const [plans, setplans] = useState(false);
  const [savePerMonth, setSavePerMonth] = useState(0);

  const [monthly, setmonthly] = useState(0);
  const [annualy, setannualy] = useState(0);
  const [save, setsave] = useState(0);
  const [totalAnually, settotalAnually] = useState(0);

  function toFixed(num, fix) {
    var re = new RegExp('^-?\\d+(?:.\\d{0,' + (fix || -1) + '})?');
    return num.toString().match(re)[0];
  }

  useEffect(() => {
    if (plan) {
      let monthly = plan.price || 0;
      let annualy = plan.price || 0;
      let totalAnually = 0;
      let percnt = savePerMonth || 0;
      let save = 0;
      percnt = percnt / 100;

      // annualy = toFixed(percnt * plan.price, 2);
      // save = toFixed((plan.price - annualy) * 12, 0);
      // totalAnually = toFixed(annualy * 12, 2);

      // annualy = (percnt * plan.price).toFixed(2);
      // save = ((plan.price - annualy) * 12).toFixed(2);
      // totalAnually = (annualy * 12).toFixed(2);

      annualy = percnt * plan.price;
      save = (plan.price - annualy) * 12;
      totalAnually = annualy * 12;

      setmonthly(monthly);
      setannualy(annualy);
      setsave(save);
      settotalAnually(totalAnually);

      if (isPromoApply) {
        let p = (isPromoApply.discount || 0) / 100;
        let discount = 0;
        if (plan.name == 'monthly') {
          discount = (monthly - p * monthly).toFixed(2);
        }
        if (plan.name == 'annual') {
          discount = (totalAnually - p * totalAnually).toFixed(2);
        }

        setpromoValue(discount);
      }
    }
  }, [plan, savePerMonth, isPromoApply]);

  const goBack = () => {
    props.navigation.goBack();
  };

  const clearAllField = () => {
    seterrorMessage('');
    setEmptyfn(false);
    setinvalidfn(false);
    setEmptyln(false);
    setinvalidln(false);
    setEmptyemail(false);
    setinvalidemail(false);
    setEmptydob(false);
    setEmptypswd(false);
    setinvalidpswd(false);
    setisPhotoUpload(true);
    setisCnicFrontUplaod(true);
    setEmptyTerms(false);
  };

  const setPhoto1Upload = c => {
    setisPhoto1Upload(c);
  };

  useEffect(() => {
    if (plans && plans.data.length > 0) {
      setPlan(plans.data[0]);
      setSavePerMonth(plans.save_per_month);
    }
  }, [plans]);

  useEffect(() => {
    if (isValidCard == false) {
      if (cn == '' || inValidcn == 'incomplete') {
        setcardErr('Please enter card number');
        return;
      }

      if (inValidcn == 'invalid') {
        setcardErr('Card number is invalid');
        return;
      }

      if (ce == '' || inValidce == 'incomplete') {
        setcardErr('Please enter card expiry date');
        return;
      }

      if (inValidce == 'invalid') {
        setcardErr('Card expiry date is invalid');
        return;
      }

      if (ccvc == '' || inValidccvc == 'incomplete') {
        setcardErr('Please enter card cvc number');
        return;
      }

      if (inValidccvc == 'invalid') {
        setcardErr('Card cvc number is invalid');
        return;
      }
    } else if (isValidCard == true) {
      seterrorMessage('');
    }
  }, [isValidCard, ce, cn, ccvc, inValidcn, inValidce, inValidccvc]);

  const setErrMessage = c => {
    seterrorMessage(c);
  };

  const createAccount = () => {
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

    if (pswd == '') {
      setEmptypswd(true);
      return;
    }

    if (pswd.length < 8) {
      setinvalidpswd(true);
      return;
    }

    if (isTerms == false) {
      setEmptyTerms(true);
      return;
    }

    const user = {
      first_name: fn,
      last_name: ln,
      email: email,
      dob: dob,
      pswd: pswd,
      //not requires if acnt create optional
      photo: '',
      cnic_front_image: '',
      plan: 'free',
      phone: '',
    };

    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        store.User.registerUser(user, setErrMessage, isusercreate);
      } else {
        // seterrorMessage('Please connect internet');
        Alert.alert('', 'Please connect internet');
      }
    });
  };

  const uploadPhoto = c => {
    if (c == 'Profile' && photo == '') {
      setisPhotoUpload(false);
      return;
    }

    if (c == 'CNICFront' && cnicFrontImage == '') {
      setisCnicFrontUplaod(false);
      return;
    }

    let imgArr = [];

    if (c == 'Profile') {
      photo.chk = 'Profile';
      imgArr.push(photo);
    }

    if (c == 'CNICFront') {
      cnicFrontImage.chk = 'CnicF';
      imgArr.push(cnicFrontImage);
    }

    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        store.User.attemptToUploadImage(
          imgArr,
          setErrMessage,
          setPhoto1Upload,

          SetUP,
          SetUCnicF,
        );
      } else {
        // seterrorMessage('Please connect internet');
        Alert.alert('', 'Please connect internet');
      }
    });
  };

  const applyPromo = () => {
    Keyboard.dismiss();
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        store.User.applyPromo(pc.toLowerCase(), setErrMessage, applyPromoSuc);
      } else {
        // seterrorMessage('Please connect internet');
        Alert.alert('', 'Please connect internet');
      }
    });
  };

  const isusercreate = (t, r, p) => {
    console.log('t : ', t);
    console.log('res : ', r);
    setToken(t);
    setusr(r);
    setplans(p);
    setisUserCreate(true);
  };

  const subscribePlan = () => {
    Keyboard.dismiss();
    if (cfn == '') {
      setEmptycfn(true);
      return;
    }

    if (isValidCard == 'null') {
      setcardErr('Please enter card number');
      setisValidCard(false);
      return;
    }

    if (isValidCard == true) {
      if (iscTerms == false) {
        setEmptycTerms(true);
        return;
      }

      const obj = {
        plan: plan,
        totalValue: plan.name == 'annual' ? totalAnually : monthly,
        isPromoApply: isPromoApply,
        card: {
          name: cfn,
          number: cn,
          expiry: ce,
          cvc: ccvc,
          type: ct,
        },
      };

      NetInfo.fetch().then(state => {
        if (state.isConnected) {
          store.User.SubPlan(obj, setErrMessage, subPlanSuc);
        } else {
          // seterrorMessage('Please connect internet');
          Alert.alert('', 'Please connect internet');
        }
      });
    }
  };

  const subPlanSuc = () => {
    setisPhoto1Upload(4);
  };

  const applyPromoSuc = res => {
    setisPromoApply(res);
  };

  const SetUP = c => {
    setuphoto(c);
  };

  const SetUCnicF = c => {
    setucnicF(c);
  };

  const goTOProfile = () => {
    let u = {...usr};
    u.photo = uphoto;
    u.cnic_front_image = ucnicF;
    u.plan = plan;

    store.General.setgoto('profile');
    store.User.addUser(token, u);
  };

  const goTOFindTrips = () => {
    let u = {...usr};
    u.photo = uphoto;
    u.cnic_front_image = ucnicF;
    u.plan = plan;

    store.General.setgoto('home');
    store.User.addUser(token, u);
  };

  const renderShowError = () => {
    return (
      <View style={styles.errorMessageContainer}>
        <Text style={styles.errorMessageText}>{errorMessage}</Text>
      </View>
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

    if (c == 'pswd') {
      text = invalidpswd
        ? 'Password must contains 8 or more characters'
        : Emptypswd
        ? 'Please enter password'
        : '';
    }

    if (c == 'terms') {
      text = EmptyTerms ? 'Agreeing to Terms and Conditions is required' : '';
    }

    if (c == 'cfn') {
      text = Emptycfn ? 'Please enter a full name' : '';
    }

    if (c == 'cterms') {
      text = EmptycTerms ? 'Agreeing to Terms and Conditions is required' : '';
    }

    return (
      <View style={styles.errorMessageFieldContainer}>
        <Text style={styles.errorMessageFieldText}>{text}</Text>
      </View>
    );
  };

  const renderHeader = () => {
    const renderLogo = () => {
      return (
        <View style={styles.section1}>
          <Image
            style={styles.logo}
            source={require('../../assets/images/logo/img.png')}
          />
          <Text style={styles.title1}>{store.General.AppName}</Text>
        </View>
      );
    };

    const renderBack = () => {
      return (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={goBack}
          style={{position: 'absolute', left: 20}}>
          <utils.vectorIcon.Ionicons
            name={'chevron-back-outline'}
            color={theme.color.buttonText}
            size={27}
          />
        </TouchableOpacity>
      );
    };

    return (
      <View style={styles.Header}>
        {renderLogo()}
        {renderBack()}
      </View>
    );
  };

  const renderSection2 = () => {
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

    const enterPaswd = t => {
      setinvalidpswd(false);
      setEmptypswd(false);
      setpswd(t);
    };

    const showPasswd = () => {
      setshowPaswd(!showPaswd);
    };

    const changeTerms = () => {
      setEmptyTerms(false);
      setisTerms(!isTerms);
    };

    const TermsnCndtnClick = () => {};

    const goToSignin = () => {
      props.navigation.navigate('Signin');
    };

    const formatDate = date => {
      var dd = moment(date).format('MM / DD / YYYY');
      return dd;
    };

    // Render

    const renderButton = () => {
      return (
        <>
          <TouchableOpacity
            onPress={createAccount}
            activeOpacity={0.7}
            style={styles.BottomButton}>
            <Text style={styles.buttonTextBottom}>create account</Text>
          </TouchableOpacity>
        </>
      );
    };

    return (
      <View style={styles.section2}>
        <Text style={styles.section2Title1}>create account</Text>

        {/* {errorMessage !== '' && renderShowError()} */}

        <View style={[styles.joinFieldContainer, {marginTop: 20}]}>
          <View style={[styles.Field, {width: '48%'}]}>
            <Text style={styles.FieldTitle1}>first name</Text>
            <TextInput
              placeholder=""
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
            placeholder=""
            onChangeText={enterEmail}
            style={[
              styles.FieldInput,
              {
                borderColor:
                  invalidemail || Emptyemail
                    ? theme.color.fieldBordeError
                    : theme.color.fieldBorder,
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
          <Text style={styles.FieldTitle1}>Password</Text>
          <View
            style={[
              styles.FieldInput,
              {
                borderColor:
                  invalidpswd || Emptypswd
                    ? theme.color.fieldBordeError
                    : theme.color.fieldBorder,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              },
            ]}>
            <TextInput
              onChangeText={enterPaswd}
              secureTextEntry={!showPaswd}
              placeholder=""
              style={{width: '85%'}}
            />

            {pswd.length > 0 && (
              <TouchableOpacity activeOpacity={0.5} onPress={showPasswd}>
                <utils.vectorIcon.Entypo
                  name={!showPaswd ? 'eye' : 'eye-with-line'}
                  color={theme.color.button1}
                  size={20}
                />
              </TouchableOpacity>
            )}
          </View>

          {(invalidpswd || Emptypswd) && renderShowFieldError('pswd')}
        </View>

        <View style={{marginTop: 20}}>
          <View style={styles.Field2}>
            <TouchableOpacity activeOpacity={0.5} onPress={changeTerms}>
              {!isTerms && (
                <utils.vectorIcon.Feather
                  name={'square'}
                  color={
                    EmptyTerms
                      ? theme.color.fieldBordeError
                      : theme.color.subTitleLight
                  }
                  size={20}
                />
              )}

              {isTerms && (
                <utils.vectorIcon.AntDesign
                  name={'checksquare'}
                  color={theme.color.button1}
                  size={20}
                />
              )}
            </TouchableOpacity>

            <Text style={styles.Field2Title}>I agree to the </Text>
            <TouchableOpacity activeOpacity={0.7} onPress={TermsnCndtnClick}>
              <Text
                style={[
                  styles.Field2Title,
                  {textDecorationLine: 'underline', marginLeft: 0},
                ]}>
                Terms & Conditions
              </Text>
            </TouchableOpacity>
          </View>
          {EmptyTerms && renderShowFieldError('terms')}
        </View>

        {renderButton()}

        <View style={styles.Field3}>
          <View style={styles.Field31}>
            <Text style={styles.Field31Title1}>Already a memeber?</Text>
            <TouchableOpacity activeOpacity={0.7} onPress={goToSignin}>
              <Text style={styles.Field31Title2}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderSection2User = () => {
    // Methods

    const entercFn = t => {
      setEmptycfn(false);

      setcfn(t);
    };

    const enterpc = t => {
      setpc(t);
    };

    const onChangeCard = t => {
      console.log('card : ', t);
      let valid = t.valid;
      let cnvalid = t.status.number;
      let cevalid = t.status.expiry;
      let ccvcvalid = t.status.cvc;
      setisValidCard(valid);
      setinValidcn(cnvalid);
      setinValidce(cevalid);
      setinValidccvc(ccvcvalid);
      let cn = t.values.number;
      let ce = t.values.expiry;
      let ccvc = t.values.cvc;
      let ct = t.values.type;
      setcn(cn);
      setce(ce);
      setccvc(ccvc);
      setct(ct);
    };

    const MultipleImage = async button => {
      let apiLevel = store.General.apiLevel;
      try {
        let options = {
          mediaType: 'image',
          isPreview: false,
          singleSelectedMode: true,
        };

        if (button == 'Profile') {
          setisPhotoUpload(true);
        }
        if (button == 'CNICFront') {
          setisCnicFrontUplaod(true);
        }

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
      } catch (error) {
        console.log('multi photo picker error : ', error);
      }
    };

    const onclickImage = c => {
      Keyboard.dismiss();

      if (c == 'cnicFV') {
        setpv(cnicFrontImage.uri);
        setpvm(true);
        return;
      }

      // if (c == 'cnicBV') {
      //   setpv(cnicBackImage.uri);
      //   setpvm(true);
      //   return;
      // }

      if (c == 'profileV') {
        setpv(photo.uri);
        setpvm(true);
        return;
      }

      MultipleImage(c);
    };

    const Skip = () => {
      if (isPhoto1Upload == 0) {
        setisPhoto1Upload(1);
      }

      if (isPhoto1Upload == 1) {
        setisPhoto1Upload(2);
      }
    };

    const clearCard = () => {
      setEmptycfn(false);
      setisPromoApply(false);
      setisShowPromoFiled(false);
      setpc('');
      setpromoValue(0);
      setcfn('');
      setcardErr('');
      setct('');
      setisValidCard('null');
      setinValidce('null');
      setinValidccvc('null');
      setinValidcn('null');
    };

    const changePlan = () => {
      setisPhoto1Upload(2);
      clearCard();
    };

    const TermsnCndtnClickCard = () => {};

    // Render

    const renderButton = c => {
      return (
        <>
          <TouchableOpacity
            onPress={() => {
              if (c != 'FindTrips') {
                uploadPhoto(c);
              } else {
                goTOFindTrips();
              }
            }}
            activeOpacity={0.7}
            style={[styles.BottomButton, {marginTop: 40}]}>
            {c == 'Profile' && (
              <Text style={styles.buttonTextBottom}>
                {photo == '' ? 'Continue' : 'Confirm & Continue'}
              </Text>
            )}
            {c == 'CNICFront' && (
              <Text style={styles.buttonTextBottom}>
                {cnicFrontImage == '' ? 'Continue' : 'Confirm & Continue'}
              </Text>
            )}
            {c == 'FindTrips' && (
              <Text style={styles.buttonTextBottom}>Find Trips</Text>
            )}
          </TouchableOpacity>
        </>
      );
    };

    const renderButtonCP = c => {
      return (
        <>
          <TouchableOpacity
            onPress={() => {
              onclickImage(c);
            }}
            activeOpacity={0.7}
            style={[
              styles.BottomButton,
              {
                marginTop: 12,
                backgroundColor: theme.color.background,
                borderWidth: 0.5,
                borderColor: theme.color.subTitle,
              },
            ]}>
            <Text
              style={[
                styles.buttonTextBottom,
                {
                  color: theme.color.buttonTextGreen,
                  fontFamily: theme.fonts.fontMedium,
                },
              ]}>
              Change Photo
            </Text>
          </TouchableOpacity>
        </>
      );
    };

    const renderButtonPlan = () => {
      return (
        <>
          <TouchableOpacity
            onPress={() => {
              setisPhoto1Upload(3);
            }}
            activeOpacity={0.7}
            style={[styles.BottomButton, {marginTop: 0, width: '60%'}]}>
            <Text style={[styles.buttonTextBottom, {fontSize: 14}]}>
              choose {plan.name} plan
            </Text>
          </TouchableOpacity>
        </>
      );
    };

    const renderButtonSubscribe = () => {
      return (
        <>
          <TouchableOpacity
            onPress={subscribePlan}
            activeOpacity={0.7}
            style={styles.BottomButton}>
            <Text style={styles.buttonTextBottom}>Subcsribe</Text>
          </TouchableOpacity>
        </>
      );
    };

    const renderButton2 = () => {
      return (
        <>
          <TouchableOpacity
            onPress={goTOProfile}
            activeOpacity={0.7}
            style={[
              styles.BottomButton,
              {
                marginTop: 12,

                backgroundColor: theme.color.background,
                borderWidth: 0.5,
                borderColor: theme.color.subTitle,
              },
            ]}>
            <Text
              style={[
                styles.buttonTextBottom,
                {
                  color: theme.color.buttonTextGreen,
                  fontFamily: theme.fonts.fontMedium,
                },
              ]}>
              Go to my profile
            </Text>
          </TouchableOpacity>
        </>
      );
    };

    // const renderCross = c => {

    //   return (
    //     <TouchableOpacity
    //       onPress={() => onClickCross(c)}
    //       activeOpacity={0.7}
    //       style={{
    //         width: 16,
    //         height: 16,
    //         borderRadius: 16 / 2,
    //         backgroundColor: theme.color.button1,
    //         alignItems: 'center',
    //         justifyContent: 'center',
    //         position: 'absolute',
    //         right: -6,
    //         top: -7,
    //       }}>
    //       <utils.vectorIcon.Entypo
    //         name="cross"
    //         color={theme.color.buttonText}
    //         size={14}
    //       />
    //     </TouchableOpacity>
    //   );
    // };

    const renderShowError2 = c => {
      let text = c == 'Profile' ? 'Please upload photo' : '';

      return (
        <View style={styles.errorMessageContainer}>
          <Text style={styles.errorMessageText}>{text}</Text>
        </View>
      );
    };

    const renderPlanBar = () => {
      const p = plans.data.map((e, i, a) => {
        let name = e.name || '';

        return (
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
              setPlan(e);
            }}
            style={{
              paddingHorizontal: 12,
              height: 37,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor:
                plan.name == name
                  ? theme.color.button1
                  : theme.color.disableBack,
              borderTopLeftRadius: i == 0 ? 8 : 0,
              borderBottomLeftRadius: i == 0 ? 8 : 0,
              borderTopRightRadius: i == a.length - 1 ? 8 : 0,
              borderBottomRightRadius: i == a.length - 1 ? 8 : 0,
            }}>
            <Text
              style={{
                fontSize: 13,
                color:
                  plan.name == name
                    ? theme.color.buttonText
                    : theme.color.subTitle,
                fontFamily: theme.fonts.fontMedium,
                textTransform: 'capitalize',
              }}>
              {name}
            </Text>
          </TouchableOpacity>
        );
      });

      return p;
    };

    const renderPlanDetails = () => {
      const pd = plan.features.map((e, i, a) => {
        let feature = e;

        return (
          <View
            style={{
              flexDirection: 'row',
              marginTop: 2,
              width: '100%',
            }}>
            <utils.vectorIcon.Entypo name="check" color={'green'} size={20} />
            <Text
              style={{
                fontSize: 14,
                color: theme.color.subTitle,
                fontFamily: theme.fonts.fontNormal,
                marginLeft: 10,
                bottom: 1,
              }}>
              {feature}
            </Text>
          </View>
        );
      });

      return pd;
    };

    return (
      <>
        {/* profile  0*/}
        {isPhoto1Upload == 0 && (
          <View style={styles.section2}>
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Text style={styles.section2Title1}>
                {photo == '' ? 'add' : 'review'} profile photo
              </Text>
              {photo == '' && (
                <Image
                  source={require('../../assets/images/addphoto/img.png')}
                  style={styles.section2Logo}
                />
              )}
              {/* {errorMessage !== '' && renderShowError()} */}
              {!isPhotoUpload && renderShowError2('Profile')}
              <Text style={styles.section2LogoTitle}>
                {photo == ''
                  ? 'Upload a photo to help the community recognize and promote your account.'
                  : 'If you are happy with the result, click Confirm & Continue below or try a different photo.'}
              </Text>

              {photo == '' && (
                <View style={styles.uploadIndication}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      onclickImage('Profile');
                    }}>
                    <Image
                      source={require('../../assets/images/uploadphoto/img.png')}
                      style={styles.uploadIndicationLogo}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      onclickImage('Profile');
                    }}>
                    <Image
                      source={require('../../assets/images/takephoto/img.png')}
                      style={styles.uploadIndicationLogo}
                    />
                  </TouchableOpacity>
                </View>
              )}

              {photo != '' && (
                <TouchableOpacity
                  style={styles.imageContainerP}
                  activeOpacity={0.7}
                  onPress={() => onclickImage('profileV')}>
                  <Image source={{uri: photo.uri}} style={styles.imageP} />
                </TouchableOpacity>
              )}
            </View>

            {renderButton('Profile')}
            {photo != '' && renderButtonCP('Profile')}

            <TouchableOpacity activeOpacity={0.7} onPress={Skip}>
              <Text style={styles.section2bottomTitle}>Skip for now</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Cnic 1 */}
        {isPhoto1Upload == 1 && (
          <View style={styles.section2}>
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Text style={styles.section2Title1}>
                {cnicFrontImage == ''
                  ? 'verify identity'
                  : 'review you id card'}
              </Text>
              {cnicFrontImage == '' && (
                <Image
                  source={require('../../assets/images/addcnic/img.png')}
                  style={styles.section2Logo}
                />
              )}

              {/* {errorMessage !== '' && renderShowError()} */}
              {!isCnicFrontUplaod && renderShowError2('Profile')}
              <Text style={styles.section2LogoTitle}>
                {cnicFrontImage == ''
                  ? 'Trip Trader is committed to community trust and security. Providing a valid government-issued ID to confirm your identity helps us keep the community safe and creates trust between you and other traders.'
                  : 'Make sure you are only submitting a valid government issued  ID and that your picture and all information is clearly visible.'}
              </Text>

              {cnicFrontImage == '' && (
                <View style={styles.uploadIndication}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      onclickImage('CNICFront');
                    }}>
                    <Image
                      source={require('../../assets/images/uploadphoto/img.png')}
                      style={styles.uploadIndicationLogo}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      onclickImage('CNICFront');
                    }}>
                    <Image
                      source={require('../../assets/images/takephoto/img.png')}
                      style={styles.uploadIndicationLogo}
                    />
                  </TouchableOpacity>
                </View>
              )}

              {cnicFrontImage != '' && (
                <View style={styles.imageContainer}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => onclickImage('cnicFV')}>
                    <Image
                      source={{uri: cnicFrontImage.uri}}
                      style={styles.image}
                    />
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {renderButton('CNICFront')}
            {cnicFrontImage != '' && renderButtonCP('CNICFront')}
            <TouchableOpacity activeOpacity={0.7} onPress={Skip}>
              <Text style={styles.section2bottomTitle}>Skip for now</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Plan 2 */}

        {isPhoto1Upload == 2 && (
          <View style={styles.section2}>
            <View>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[
                  styles.section2Title1,
                  {textTransform: 'none', alignSelf: 'flex-start'},
                ]}>
                Choose a plan
              </Text>
              {/* {errorMessage !== '' && renderShowError()} */}
              <Text
                style={[styles.section2LogoTitle2c, {alignSelf: 'flex-start'}]}>
                Unlock all features with a subscription.
              </Text>
            </View>

            <View
              style={{
                width: '100%',
                alignSelf: 'center',
                height: 0.6,
                backgroundColor: theme.color.subTitleLight,
                marginVertical: 15,
                opacity: 0.5,
              }}
            />

            <View style={{marginTop: 7}}>
              {plans && plans.data && (
                <>
                  <View
                    style={{
                      alignItems: 'center',
                      flexDirection: 'row',
                    }}>
                    {renderPlanBar()}
                  </View>
                </>
              )}

              {plan && (
                <>
                  <View style={{marginTop: 20}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Text
                        style={{
                          fontSize: 26,
                          color: theme.color.title,
                          fontFamily: theme.fonts.fontBold,
                        }}>
                        ${plan.name == 'annual' ? annualy.toFixed(2) : monthly}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: theme.color.subTitle,
                          fontFamily: theme.fonts.fontMedium,
                          marginLeft: 5,
                        }}>
                        /month{' '}
                        {plan.name == 'annual' ? '(Billed annually)' : ''}
                      </Text>
                    </View>
                    {plan.name == 'annual' && (
                      <Text
                        style={{
                          fontSize: 12,
                          color: 'green',
                          fontFamily: theme.fonts.fontMedium,
                          textTransform: 'capitalize',
                          top: -5,
                        }}>
                        best value ${toFixed(save, 0)} savings
                      </Text>
                    )}
                    {plan.name == 'monthly' && (
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          top: -5,
                        }}>
                        <Text
                          style={{
                            fontSize: 12,
                            color: theme.color.subTitle,
                            fontFamily: theme.fonts.fontMedium,
                          }}>
                          Save ${toFixed(save, 0)} with an
                        </Text>
                        <TouchableOpacity
                          activeOpacity={0.6}
                          onPress={() => {
                            setPlan(plans.data[0]);
                          }}>
                          <Text
                            style={{
                              fontSize: 12,
                              color: 'green',
                              fontFamily: theme.fonts.fontMedium,
                              marginLeft: 5,
                            }}>
                            annual plan
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                  {plan.features.length > 0 && (
                    <View style={{marginTop: 20}}>{renderPlanDetails()}</View>
                  )}
                </>
              )}
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 25,
              }}>
              {renderButtonPlan()}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  setPlan('free');
                  setisPhoto1Upload(4);
                }}>
                <Text
                  style={[
                    styles.section2bottomTitle,
                    {marginTop: 0, marginLeft: 25},
                  ]}>
                  Try for free
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Payment 3 */}

        {isPhoto1Upload == 3 && (
          <View style={styles.section2}>
            <View style={{}}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[
                  styles.section2Title1,
                  {textTransform: 'none', alignSelf: 'flex-start'},
                ]}>
                Payment Information
              </Text>
              {/* {errorMessage !== '' && renderShowError()} */}
              <Text
                style={[
                  styles.section2LogoTitle2c,
                  {alignSelf: 'flex-start', marginTop: 5},
                ]}>
                Your subscription will start after you make your first payment
                below.
              </Text>
            </View>
            <View
              style={{
                width: '100%',
                height: 0.6,
                alignSelf: 'center',
                marginVertical: 12,
                backgroundColor: theme.color.subTitleLight,
                opacity: 0.5,
              }}
            />
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',

                  justifyContent: 'space-between',
                }}>
                <Text style={styles.paymenttitle1}>total due Now :</Text>
                {!isPromoApply && (
                  <Text
                    style={[
                      styles.paymenttitle1,
                      {
                        color: theme.color.title,
                        width: '69%',
                        textTransform: 'none',
                      },
                    ]}>
                    {plan.name == 'annual'
                      ? `$${toFixed(totalAnually, 2)} ($${annualy.toFixed(
                          2,
                        )} /mo)`
                      : `$${monthly} /mo`}
                  </Text>
                )}

                {isPromoApply && (
                  <View style={{flexDirection: 'row', width: '69%'}}>
                    <Text
                      style={{
                        color: theme.color.title,
                        fontSize: 11,
                        fontFamily: theme.fonts.fontBold,
                        textTransform: 'capitalize',
                        textDecorationLine: 'line-through',
                      }}>
                      {plan.name == 'annual'
                        ? `$${totalAnually}`
                        : `$${monthly}`}
                      {'  '}
                    </Text>

                    <Text
                      style={{
                        color: theme.color.titleGreen,
                        fontSize: 11,
                        fontFamily: theme.fonts.fontBold,
                        textTransform: 'capitalize',
                      }}>
                      ${promoValue} ({isPromoApply.discount}% discount)
                    </Text>
                  </View>
                )}
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text style={styles.paymenttitle2}>your plan :</Text>
                <Text
                  style={[
                    styles.paymenttitle2,
                    {
                      color: theme.color.title,
                      marginLeft: 5,
                    },
                  ]}>
                  {plan.name}
                </Text>
                <TouchableOpacity activeOpacity={0.6} onPress={changePlan}>
                  <Text
                    style={[
                      styles.paymenttitle2,
                      {
                        color: theme.color.titleGreen,
                        marginLeft: 10,
                        fontFamily: theme.fonts.fontNormal,
                        textDecorationLine: 'underline',
                      },
                    ]}>
                    change
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View>
              <View style={styles.Field}>
                <Text style={styles.FieldTitle1}>full name</Text>
                <TextInput
                  placeholder="Card holder’s first and last name"
                  value={cfn}
                  onChangeText={entercFn}
                  style={[
                    styles.FieldInput,
                    {
                      borderColor: Emptycfn
                        ? theme.color.fieldBordeError
                        : theme.color.fieldBorder,
                      fontSize: 13,
                      color: 'black',
                    },
                  ]}
                />
                {Emptycfn && renderShowFieldError('cfn')}
              </View>

              <View style={styles.Field}>
                <Text style={styles.FieldTitle1}>card</Text>
                <View
                  style={[
                    [
                      styles.FieldInputCard,
                      {
                        borderColor:
                          isValidCard == false
                            ? theme.color.fieldBordeError
                            : isValidCard == true
                            ? 'green'
                            : theme.color.fieldBorder,
                      },
                    ],
                  ]}>
                  <LiteCreditCardInput onChange={onChangeCard} />
                </View>
                {isValidCard == false && renderShowFieldError('card')}
              </View>

              {isShowPromoFiled && (
                <View style={styles.Field}>
                  <Text style={styles.FieldTitle1}>promo code</Text>

                  {!isPromoApply && (
                    <View
                      style={[
                        styles.FieldInput,
                        {
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingHorizontal: 0,
                        },
                      ]}>
                      <TextInput
                        placeholder="Add a promo code"
                        value={pc}
                        onChangeText={enterpc}
                        style={{
                          borderColor: theme.color.fieldBorder,
                          fontSize: 13,
                          color: 'black',
                          width: '70%',
                          height: '100%',
                          paddingLeft: 10,
                        }}
                      />

                      {pc != '' && (
                        <TouchableOpacity
                          activeOpacity={0.7}
                          onPress={applyPromo}
                          style={{
                            width: 60,
                            height: '100%',
                            borderTopRightRadius: 8,
                            borderBottomRightRadius: 8,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: theme.color.button1,
                            paddingHorizontal: 3,
                          }}>
                          <Text
                            style={{
                              color: theme.color.buttonText,
                              fontSize: 13,
                              fontFamily: theme.fonts.fontMedium,
                            }}>
                            Apply
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}

                  {isPromoApply && (
                    <View
                      style={{
                        marginTop: 5,
                        alignItems: 'center',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={{
                          width: '50%',
                          color: theme.color.title,
                          fontSize: 12,
                          fontFamily: theme.fonts.fontMedium,
                          textTransform: 'uppercase',
                        }}>
                        {isPromoApply.name}
                      </Text>

                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => setisPromoApply(false)}>
                        <Text
                          style={{
                            color: theme.color.titleGreen,
                            fontSize: 12,
                            fontFamily: theme.fonts.fontMedium,
                            textDecorationLine: 'underline',
                          }}>
                          Remove
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}

              {!isShowPromoFiled && (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setisShowPromoFiled(true)}
                  style={{marginTop: 20}}>
                  <Text
                    style={{
                      fontSize: 12,
                      color: theme.color.titleGreen,
                      fontFamily: theme.fonts.fontMedium,
                      textDecorationLine: 'underline',
                    }}>
                    I have a promo code
                  </Text>
                </TouchableOpacity>
              )}

              <View style={{marginTop: 20}}>
                <View style={styles.Field2}>
                  <TouchableOpacity
                    style={{marginRight: 10}}
                    activeOpacity={0.5}
                    onPress={() => {
                      setiscTerms(!iscTerms);
                      setEmptycTerms(false);
                    }}>
                    {!iscTerms && (
                      <utils.vectorIcon.Feather
                        name={'square'}
                        color={
                          EmptycTerms
                            ? theme.color.fieldBordeError
                            : theme.color.subTitleLight
                        }
                        size={20}
                      />
                    )}

                    {iscTerms && (
                      <utils.vectorIcon.AntDesign
                        name={'checksquare'}
                        color={theme.color.button1}
                        size={20}
                      />
                    )}
                  </TouchableOpacity>

                  <View>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={TermsnCndtnClickCard}>
                      <Text style={styles.Field2Titlec}>
                        I agree to the Trip Trader’s{' '}
                        <Text style={styles.Field2Titlecc}>
                          Terms & Conditions
                        </Text>
                      </Text>
                    </TouchableOpacity>
                    <Text style={styles.Field2Titlec}>
                      and understand that upon clicking “Subscribe” below, I
                      will be charged{' '}
                      {plan.name == 'annual'
                        ? `$${totalAnually}`
                        : `$${monthly}`}{' '}
                      annually.
                    </Text>
                  </View>
                </View>
                {EmptycTerms && renderShowFieldError('cterms')}
              </View>
            </View>

            {renderButtonSubscribe()}
            <TouchableOpacity activeOpacity={0.7} onPress={changePlan}>
              <Text style={styles.section2bottomTitle}>Cancel and go back</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Ready 4 */}
        {isPhoto1Upload == 4 && (
          <View style={styles.section2}>
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.section2Title1}>
                welcome {userFirstName}
              </Text>
              <View style={styles.section2LogoC}>
                <Image
                  source={require('../../assets/images/accountReady/img1.png')}
                  style={styles.section2LogoCImg1}
                />
                <Image
                  source={require('../../assets/images/accountReady/img2.png')}
                  style={styles.section2LogoCImg2}
                />
              </View>

              {/* {errorMessage !== '' && renderShowError()} */}

              <Text style={styles.section2LogoTitle1c}>
                Your account is ready.
              </Text>

              <Text style={styles.section2LogoTitle2c}>
                Good luck on your trips and trades!
              </Text>
            </View>

            {renderButton('FindTrips')}
            {renderButton2()}
          </View>
        )}
      </>
    );
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
        <View style={{flex: 1, backgroundColor: 'black'}}>
          <Image
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

  const renderStatusBar = () => {
    return (
      <>
        {!pvm && (
          <StatusBar
            translucent={Platform.OS == 'android' ? true : false}
            backgroundColor={
              Platform.OS == 'android' ? 'transparent' : theme.color.button1
            }
            barStyle={
              Platform.OS == 'android' ? 'light-content' : 'dark-content'
            }
          />
        )}

        {pvm && (
          <StatusBar
            translucent={false}
            backgroundColor={'black'}
            barStyle={'light-content'}
          />
        )}
      </>
    );
  };

  const renderDateShowModal = () => {
    {
      /* ios */
    }
    {
      /* <Modal
          isVisible={pudshow && Platform.OS === 'ios'}
          backdropOpacity={0.6}
          animationIn="fadeInUp"
          animationOut="fadeOutDown"
          animationInTiming={600}
          animationOutTiming={600}
          onRequestClose={() => {
            setPUdShow(false);
          }}
          backdropTransitionInTiming={600}
          backdropTransitionOutTiming={600}
          onBackdropPress={() => setPUdShow(false)}>
          <View style={styles.CNICModal}>
            <View style={styles.CNICModalHeader}>
              <Text style={styles.CNICModalHeaderText}>Set Date</Text>
              <utils.vectorIcon.Entypo
                name="cross"
                size={24}
                color={'#fff'}
                style={{padding: responsiveWidth(3)}}
                onPress={() => setPUdShow(false)}
              />
            </View>
            <DateTimePicker
              testID="dateTimePicker"
              value={puTime}
              mode={'date'}
              onTouchCancel={() => {
                setPUdShow(false);
              }}
              maximumDate={new Date()}
              display="spinner"
              textColor="#000"
              onChange={onPUDChange}
            />
          </View>
        </Modal> */
    }

    {
      /* android */
    }

    {
      /* {pudshow && Platform.OS === 'android' && ( */
    }

    // <DateTimePicker
    //   testID="dateTimePicker"
    //   value={puTime}
    //   mode={'date'}
    //   display="spinner"
    //   textColor="#000"
    //   maximumDate={new Date()}
    //   onChange={onPUDChange}
    // />
    // )}

    return (
      <DatePicker
        maximumDate={new Date()}
        modal
        mode="date"
        format="MM-DD-YYYY"
        open={pudshow}
        date={dob == '' ? new Date() : dob}
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
      <ImageBackground
        source={require('../../assets/images/background/img.png')}
        style={styles.container2}>
        {renderHeader()}
        <KeyboardAvoidingView style={{flex: 1}} enabled>
          <ScrollView
            style={{paddingHorizontal: 12}}
            showsVerticalScrollIndicator={false}>
            {!isUserCreate && renderSection2()}
            {isUserCreate && renderSection2User()}
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>

      <Toast ref={toast} position="center" />
      <utils.Loader load={loader} />
      {pvm && renderFullImage()}
      {renderStatusBar()}
      {renderDateShowModal()}
    </SafeAreaView>
  );
}
