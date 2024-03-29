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
  Modal,
  Platform,
  StatusBar,
  KeyboardAvoidingView,
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
import IntlPhoneInput from 'react-native-intl-phone-input';
import auth from '@react-native-firebase/auth';
import * as RNLocalize from 'react-native-localize';

export default observer(ForgotPassword);
function ForgotPassword(props) {
  const mobileReg = /^[0][3]\d{9}$/;
  const emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
  const cnicReg = /\d{5}\d{8}\d/;

  let screen = props.route.params?.screen || '';

  const loader = store.User.regLoader;

  let user = store.User.user;
  let em = '';
  if (user != 'guest' && user) {
    em = user.email;
  }
  let phn = store.User.phn;
  let cntry = store.User.cntr == '' ? RNLocalize.getCountry() : store.User.cntr;
  let pwc = store.User.pwc;

  const toast = useRef(null);
  const toastduration = 700;

  const [email, setemail] = useState(em);
  const [Emptyemail, setEmptyemail] = useState(false);
  const [invalidemail, setinvalidemail] = useState(false);

  const [phone, setphone] = useState(phn);
  const [isVerifyPhone, setisVerifyPhone] = useState(phn != '' ? true : 'a');
  const [invalidphone, setinvalidphone] = useState(false);

  const [errorMessage, seterrorMessage] = useState('');

  const [isEmailField, setisEmailField] = useState(true);

  const goBack = () => {
    props.navigation.goBack();
  };

  const clearAllField = () => {
    setinvalidemail(false);
    setEmptyemail(false);
    setinvalidphone(false);
    seterrorMessage('');
  };

  const setErrMessage = c => {
    seterrorMessage(c);
  };

  const gotoVerifyCode = (c, v, res) => {
    props.navigation.navigate('VerifyCode', {
      chk: c,
      value: v,
      res: res,
      screen,
    });
  };

  async function SendOtpCode(p) {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        // store.User.setregLoader(true);
        auth()
          .signInWithPhoneNumber(p, true)
          .then(res => {
            console.log('opt code send true: ');
            store.User.setregLoader(false);
            gotoVerifyCode('phone', p, res);
          })
          .catch(error => {
            console.log('signInWithPhoneNumber  error : ', error);
            store.User.setregLoader(false);
            var errorMessage = error.message;
            var si = errorMessage.indexOf(']') + 1;
            var ei = errorMessage.length - 1;
            const message = errorMessage.substr(si, ei);
            Alert.alert('Failed', message);
          });

        return;
      } else {
        Alert.alert('Network Error', 'Please check your internet connection');
      }
    });
  }

  const SendCode = () => {
    clearAllField();
    Keyboard.dismiss();

    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        if (isEmailField) {
          if (email == '') {
            setEmptyemail(true);
            return;
          }

          if (emailReg.test(email) === false) {
            setinvalidemail(true);
            return;
          }

          let body = {
            email: email.toLowerCase(),
          };

          store.User.forgotPassword(body, gotoVerifyCode, setErrMessage);
        } else {
          if (isVerifyPhone == false || isVerifyPhone == 'a') {
            setinvalidphone(true);
            return;
          }

          store.User.isPhoneExist(phone, SendOtpCode, setErrMessage);
        }
      } else {
        // seterrorMessage('Please connect internet');
        Alert.alert('', 'Please connect internet');
      }
    });
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
    const enterEmail = t => {
      setinvalidemail(false);
      setEmptyemail(false);
      setemail(t);
    };

    const setPhoneNumber = p => {
      setinvalidphone(false);
      console.log('p : ', p.isVerified);
      setisVerifyPhone(p.isVerified);
      if (p.unmaskedPhoneNumber == '') {
        setphone('');
        setisVerifyPhone('a');
      } else {
        setphone(p.dialCode + p.unmaskedPhoneNumber);
      }
    };

    const changeField = () => {
      setisEmailField(!isEmailField);
      setphone('');
      setinvalidphone(false);
      setisVerifyPhone('a');
      setemail('');
      setEmptyemail(false);
      setinvalidemail(false);
      seterrorMessage('');
    };

    const goToSignup = () => {
      props.navigation.navigate('Signup');
    };

    const renderButton = () => {
      return (
        <>
          <TouchableOpacity
            onPress={SendCode}
            activeOpacity={0.7}
            style={styles.BottomButton}>
            <Text style={styles.buttonTextBottom}>send code</Text>
          </TouchableOpacity>
        </>
      );
    };

    const renderShowError = () => {
      return (
        <View style={styles.errorMessageContainer}>
          <Text style={styles.errorMessageText}>{errorMessage}</Text>
        </View>
      );
    };

    const renderShowFieldError = c => {
      let text = '';

      if (c == 'email') {
        text = invalidemail
          ? 'Email contains invalid characters'
          : Emptyemail
          ? 'Please enter email'
          : '';
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

    return (
      <View style={styles.section2}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View>
            <Text style={styles.section2Title1}>forgot password</Text>
            {/* {errorMessage !== '' && renderShowError()} */}
            <Text style={styles.section2LogoTitle}>
              {isEmailField
                ? `Enter your email below and we’ll send you a 6 digit verification code`
                : `Enter your number below and we’ll send you a 6 digit verification code`}
            </Text>
          </View>

          <View style={[styles.Field, {marginTop: 20}]}>
            {isEmailField && (
              <>
                <Text style={styles.FieldTitle1}>email address</Text>
                <TextInput
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
                    },
                  ]}
                />
                {(invalidemail || Emptyemail) && renderShowFieldError('email')}
              </>
            )}

            {!isEmailField && (
              <>
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
                      setinvalidphone(false);
                      setisVerifyPhone('a');
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
              </>
            )}
          </View>

          {renderButton()}

          <View style={styles.Field3}>
            <TouchableOpacity activeOpacity={0.7} onPress={changeField}>
              <Text style={styles.Field31Title2}>
                {isEmailField
                  ? 'Use Phone Number Instead'
                  : 'Use Email Address Instead'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/background/img.png')}
        style={styles.container2}
      />
      <SafeAreaView style={styles.container3}>
        <utils.AuthHeader props={props} />

        <KeyboardAvoidingView
          style={{
            flex: 1,
            paddingHorizontal: 15,
            marginTop: responsiveHeight(3),
          }}
          behavior={Platform.OS == 'ios' ? 'padding' : undefined}>
          {renderSection2()}
        </KeyboardAvoidingView>
      </SafeAreaView>

      <Toast ref={toast} position="center" />
      {Platform.OS == 'ios' && <utils.Loader load={loader} />}
    </View>
  );
}
