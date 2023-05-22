import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import {styles} from './styles';
import {observer} from 'mobx-react';
import store from '../../store/index';
import utils from '../../utils/index';
import theme from '../../theme';
import {responsiveHeight} from 'react-native-responsive-dimensions';
import Toast from 'react-native-easy-toast';
import NetInfo from '@react-native-community/netinfo';
import CodeInput from 'react-native-code-input';
import CountDown from 'react-native-countdown-component';
import auth from '@react-native-firebase/auth';

export default observer(VerifyCode);
function VerifyCode(props) {
  let resendTime = 60; //second
  let screen = props.route.params.screen || '';

  const mobileReg = /^[0][3]\d{9}$/;
  const emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
  const cnicReg = /\d{5}\d{8}\d/;
  let chk = props.route.params.chk || ''; //isemail or isphone
  let value = props.route.params.value || ''; //email/phone

  const loader = store.User.regLoader;

  const toast = useRef(null);
  const toastduration = 700;
  const codeInputRef2 = useRef(null);

  const prevCodeRef = useRef();
  const [confirmResult, setConfirmResult] = useState(
    props.route.params.res || null,
  );

  const [code, setcode] = useState('');
  const [isVerifyCode, setisVerifyCode] = useState('a');
  const [isEmptyCode, setisEmptyCode] = useState(false);
  const [isFinish, setFinish] = useState(false);

  const [errorMessage, seterrorMessage] = useState('');

  useEffect(() => {
    const Subscribe = auth().onAuthStateChanged(async user => {
      if (user) {
        console.log('user login aksjasklajsl');
        Keyboard.dismiss();
        store.User.setregLoader(true);
        setTimeout(() => {
          store.User.setregLoader(false);
          auth().currentUser?.delete();
          auth().signOut();
          goToResetPassword(value);
        }, 1000);
      }
    });
    return () => {
      Subscribe(); //remove listener
    };
  }, []);

  useEffect(() => {
    //assign the ref's current value to the count Hook
    prevCodeRef.current = code;
    if (prevCodeRef !== code) {
      clearAllField();
    }
  }, [code]); //run this code when the value of count changes

  const clearAllField = () => {
    setisVerifyCode('a');
    setisEmptyCode(false);
    seterrorMessage('');
    codeInputRef2?.current?.clear();
  };

  const showResentToast = c => {
    toast?.current?.show('Resend Pin Success', 1200);
    setFinish(false);
    setcode('');
    codeInputRef2?.current?.clear();
    setConfirmResult(c);
    Keyboard.dismiss();
  };

  const goToResetPassword = v => {
    props.navigation.navigate('ResetPassword', {screen, value: v, chk: chk});
  };

  const verfyCode = async c => {
    try {
      Keyboard.dismiss();
      store.User.setregLoader(true);
      await confirmResult.confirm(c);
      setisVerifyCode(true);
    } catch (error) {
      store.User.setregLoader(false);
      setcode('');
      codeInputRef2?.current?.clear();
      console.log('Verifyication Code  error: ', error.code);
      let errorMessage = '';
      if (error.code == 'auth/unknown') {
        errorMessage =
          'Cannot create PhoneAuthCredential without either verificationProof, sessionInfo, temporary proof, or enrollment ID !';
      } else if (error.code == 'auth/invalid-verification-code') {
        setisVerifyCode(false);
        errorMessage =
          'Invalid verification code, Please enter correct confirmation code !';

        return;
      } else if (error.code == 'auth/session-expired') {
        errorMessage =
          'The sms code has expired or to many invalid code attempt. Please re-send the verification code to try again';
      } else if (error.code == 'auth/network-request-failed') {
        errorMessage = 'Network request failed , Please connect internet ! ';
      } else {
        var msg = error.message;
        var si = msg.indexOf(']') + 1;
        var ei = msg.length - 1;
        errorMessage = msg.substr(si, ei);
      }
      Alert.alert('Failed', errorMessage);
    }
  };

  const SubmitCode = () => {
    clearAllField();
    Keyboard.dismiss();
    if (code.length < 6) {
      setisEmptyCode(true);
      return;
    }
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        if (chk == 'email') {
          let body = {
            email: value,
            pin: code,
          };

          store.User.attemptToVerifyCode(
            body,
            goToResetPassword,
            setisVerifyCode,
          );
        } else {
          verfyCode(code);
        }
      } else {
        Alert.alert('', 'Please connect internet');
      }
    });
  };

  async function SendOtpCode() {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        clearAllField();
        store.User.setregLoader(true);
        codeInputRef2?.current?.clear();

        auth()
          .signInWithPhoneNumber(value, true)
          .then(res => {
            console.log('opt code send true: ');
            store.User.setregLoader(false);
            showResentToast(res);
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

  const reSendCode = () => {
    clearAllField();
    Keyboard.dismiss();

    if (chk == 'email') {
      NetInfo.fetch().then(state => {
        if (state.isConnected) {
          let body = {
            email: value,
          };

          store.User.forgotPassword2(body, showResentToast);
        } else {
          // seterrorMessage('Please connect internet');
          Alert.alert('', 'Please connect internet');
        }
      });
    } else {
      SendOtpCode();
    }
  };

  const onFinishCheckingCode = cd => {
    setcode(cd);
  };

  const renderSection2 = () => {
    const renderButton = () => {
      return (
        <>
          <TouchableOpacity
            onPress={SubmitCode}
            activeOpacity={0.7}
            style={styles.BottomButton}>
            <Text style={styles.buttonTextBottom}>submit code</Text>
          </TouchableOpacity>
        </>
      );
    };

    const renderShowFieldError = c => {
      let text = '';

      if (c == 'code') {
        text = isEmptyCode
          ? 'Please enter 6-digit pin code'
          : !isVerifyCode
          ? 'PIN code is incorrect.'
          : '';
      }

      return (
        <View style={styles.errorMessageFieldContainer}>
          <Text style={styles.errorMessageFieldText}>{text}</Text>
        </View>
      );
    };

    const renderTimer = () => {
      const resend = () => {
        reSendCode();
      };

      return (
        <TouchableOpacity
          activeOpacity={0.7}
          disabled={!isFinish ? true : false}
          onPress={resend}
          style={styles.Timer}>
          <Text
            style={[
              styles.TimerText,
              {textDecorationLine: isFinish ? 'underline' : 'none'},
            ]}>
            Resend Code{!isFinish ? ' in' : ''}
          </Text>
          {!isFinish && (
            <>
              <CountDown
                size={14}
                until={resendTime}
                onFinish={() => setFinish(true)}
                digitStyle={{backgroundColor: 'transparent'}}
                digitTxtStyle={styles.dtx}
                timeToShow={['S']}
                timeLabels={{s: null}}
                showSeparator
              />
              {/* <Text style={[styles.TimerTextr, {left: -10}]}>Sec</Text> */}
            </>
          )}
        </TouchableOpacity>
      );
    };

    return (
      <View style={styles.section2}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View>
            <Text style={styles.section2Title1}>Verify PIN Code</Text>

            <Text style={styles.section2LogoTitle}>
              {chk == 'phone'
                ? `Enter the 6-digit verification code we sent to your device at  ${value}`
                : `Enter the 6-digit verification code we sent to your email at ${value}`}
            </Text>
          </View>

          <View style={[styles.Field, {marginTop: 10}]}>
            <CodeInput
              ref={codeInputRef2}
              activeColor="rgba(49, 180, 4, 1)"
              inactiveColor="rgba(49, 180, 4, 1.3)"
              autoFocus={false}
              keyboardType="numeric"
              inputPosition="center"
              codeLength={6}
              size={43}
              onFulfill={onFinishCheckingCode}
              codeInputStyle={{
                borderWidth: 1,
                borderColor:
                  isVerifyCode == false || isEmptyCode
                    ? theme.color.fieldBordeError
                    : theme.color.fieldBorder,
                borderRadius: 8,
                color: theme.color.title,
                fontSize: 17,
              }}
            />
            {(isEmptyCode || isVerifyCode == false) &&
              renderShowFieldError('code')}
          </View>

          {renderButton()}

          <View style={styles.Field3}>
            <TouchableOpacity disabled activeOpacity={0.7}>
              {renderTimer()}
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

      {Platform.OS == 'ios' && <utils.Loader load={loader} />}
      <Toast ref={toast} position="bottom" />
    </View>
  );
}
