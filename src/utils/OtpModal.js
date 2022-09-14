import React, {useRef, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Keyboard,
  Alert,
} from 'react-native';
import theme from '../theme/index';

import utils from '.';
import store from '../store/index';
import {observer} from 'mobx-react';
import Modal from 'react-native-modal';
import Toast from 'react-native-easy-toast';
import LinearGradient from 'react-native-linear-gradient';
import CountDown from 'react-native-countdown-component';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import auth from '@react-native-firebase/auth';
import NetInfo from '@react-native-community/netinfo';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

const CELL_COUNT = 6;

//  observer(OtpModal);
export default function OtpModal(props) {
  const isModal = props.isModal;
  const setisModal = c => {
    props.setisModal(c);
  };
  const setisVerify = c => {
    props.setisVerify(c);
  };
  const mobile = '+92' + props.phone || '';
  const order = props.data;

  let resendTime = 30; //second

  const [loader, setloader] = useState(false);
  const [vLoader, setvLoader] = useState(false);

  const [sendCodeOnce, setsendCodeOnce] = useState(false);

  const [seconds, setSeconds] = useState(resendTime);
  const [isFinish, setFinish] = useState(false);
  const [confirmResult, setConfirmResult] = useState(null);

  const [value, setValue] = useState('');
  const [prop, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});

  useEffect(() => {
    const Subscribe = auth().onAuthStateChanged(async user => {
      if (user) {
        setvLoader(false);

        console.log('user');

        NetInfo.fetch().then(state => {
          if (state.isConnected) {
            if (auth().currentUser) {
              auth().currentUser.delete();
            }
            gotoNext();
          } else {
            Alert.alert('', 'Please connect internet.');
          }
        });
      }
    });
    return () => {
      Subscribe(); //remove listener
    };
  }, []);

  async function SendOtpCode() {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        setloader(true);
        setValue('');
        setConfirmResult(null);
        auth()
          .signInWithPhoneNumber(mobile)
          .then(res => {
            console.log('confirmation : ', res);
            setloader(false);
            setSeconds(resendTime);
            setsendCodeOnce(true);
            setConfirmResult(res);
            setFinish(false);
          })
          .catch(error => {
            console.log('signInWithPhoneNumber  error : ', error);
            setloader(false);
            setValue('');
            setConfirmResult(null);
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

  async function verfyCode() {
    // try {
    //   Keyboard.dismiss();
    //   setvLoader(true);

    //   await confirmResult.confirm(value);
    // } catch (error) {
    //   console.log('Verifyication Code  error: ', error);
    //   setvLoader(false);
    //   setValue('');
    //   let errorMessage = '';
    //   if (error.code == 'auth/unknown') {
    //     errorMessage =
    //       'Cannot create PhoneAuthCredential without either verificationProof, sessionInfo, temporary proof, or enrollment ID !';
    //     return;
    //   } else if (error.code == 'auth/invalid-verification-code') {
    //     errorMessage =
    //       'Invalid verification code, Please enter correct confirmation code !';
    //   } else if (error.code == 'auth/session-expired') {
    //     errorMessage =
    //       'The sms code has expired or to many invalid code attempt. Please re-send the verification code to try again';
    //   } else if (error.code == 'auth/network-request-failed') {
    //     errorMessage = 'Network request failed , Please connect internet ! ';
    //   } else {
    //     var msg = error.message;
    //     var si = msg.indexOf(']') + 1;
    //     var ei = msg.length - 1;
    //     errorMessage = msg.substr(si, ei);
    //   }
    //   Alert.alert('Failed', errorMessage);
    // }
    // gotoNext();

    gotoNextTest();
  }

  async function SendOtpCodeTest() {
    setloader(true);

    setTimeout(() => {
      setloader(false);
      setsendCodeOnce(true);
      setValue('');
      setConfirmResult(null);
      setFinish(false);
      setSeconds(resendTime);
    }, 1500);
  }

  const gotoNextTest = () => {
    setvLoader(true);

    setTimeout(() => {
      setvLoader(false);
      setisVerify(true);
      setisModal(false);
    }, 1000);
  };

  const gotoNext = () => {
    setisVerify(true);
    setisModal(false);
  };

  const renderCodeInputFields = () => {
    return (
      <View style={styles.codeContainer}>
        <CodeField
          ref={ref}
          {...prop}
          value={value}
          onChangeText={setValue}
          onEndEditing={() => {}}
          editable={loader || vLoader || !sendCodeOnce ? false : true}
          cellCount={CELL_COUNT}
          rootStyle={styles.codeFieldRoot}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          renderCell={({index, symbol, isFocused}) => (
            <Text
              key={index}
              style={[styles.cell, isFocused && styles.focusCell]}
              onLayout={getCellOnLayoutHandler(index)}>
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
          )}
        />
      </View>
    );
  };

  const renderBottonButton1 = () => {
    let text = 'Get Code';
    let disable = loader;
    return (
      <TouchableOpacity
        disabled={disable}
        activeOpacity={0.6}
        onPress={SendOtpCodeTest}
        style={styles.Button}>
        <>
          {!loader ? (
            <Text style={styles.ButtonText}>{text}</Text>
          ) : (
            <ActivityIndicator size={20} color={theme.color.buttonText} />
          )}
        </>
      </TouchableOpacity>
    );
  };

  const renderBottonButton11 = () => {
    let text = 'Resend Code';
    let disable = loader;
    return (
      <TouchableOpacity
        disabled={disable}
        activeOpacity={0.6}
        onPress={SendOtpCodeTest}
        style={styles.Button}>
        {!loader ? (
          <Text style={styles.ButtonText}>{text}</Text>
        ) : (
          <ActivityIndicator size={20} color={theme.color.buttonText} />
        )}
      </TouchableOpacity>
    );
  };

  const renderBottonButton2 = () => {
    let disable = value.length < 6 || loader ? true : false;
    let text = 'Confirm Code';

    return (
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={verfyCode}
        disabled={disable || vLoader}
        style={[
          styles.Button,
          {
            backgroundColor: disable
              ? theme.color.disableField
              : theme.color.button1,
          },
        ]}>
        <>
          {!disable ? (
            <>
              {!vLoader ? (
                <Text style={styles.ButtonText}>{text}</Text>
              ) : (
                <ActivityIndicator size={20} color={theme.color.buttonText} />
              )}
            </>
          ) : (
            <>
              <Text style={styles.ButtonText}>{text}</Text>
            </>
          )}
        </>
      </TouchableOpacity>
    );
  };

  const renderBottonButton3 = () => {
    let text = 'Cancel';

    return (
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => {
          setisModal(false);
        }}
        style={styles.Buttonc}>
        <Text style={styles.ButtonTextc}>{text}</Text>
      </TouchableOpacity>
    );
  };

  const renderTimer = () => {
    return (
      <TouchableOpacity disabled style={styles.Timer}>
        <>
          {/* <Text style={[styles.TimerTextr, {color: '#ed5045', left: 5}]}>
            (
          </Text> */}
          <CountDown
            size={14}
            until={seconds}
            onFinish={() => setFinish(true)}
            digitStyle={{backgroundColor: 'transparent'}}
            digitTxtStyle={{
              color: theme.color.cartbutton,
              fontSize: responsiveFontSize(1.8),
              fontFamily: 'Inter-Regular',
              fontWeight: '500',
            }}
            timeToShow={['S']}
            timeLabels={{s: null}}
            showSeparator
          />
          {/* <Text style={[styles.TimerTextr, {color: '#ed5045', left: -5}]}>
            Sec )
          </Text> */}
        </>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Modal
        style={{padding: 0, margin: 0}}
        backdropOpacity={0.4}
        onRequestClose={() => {
          setisModal(false);
        }}
        isVisible={isModal}>
        <View style={styles.modalCont}>
          <KeyboardAvoidingView style={{flex: 1}} enabled>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={{padding: 10}}>
                <Text style={styles.title}>Verify your mobile number</Text>
                <Text style={styles.subtitle}>
                  You will receive an OTP on your provided number {mobile}
                </Text>
                {renderCodeInputFields()}
                {!loader && sendCodeOnce && !isFinish && renderTimer()}
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
          <View style={{padding: 10}}>
            {/* //cnfrm */}
            {renderBottonButton2()}
            {/* //snd */}
            {!sendCodeOnce && renderBottonButton1()}
            {/* //resend */}
            {sendCodeOnce && isFinish && renderBottonButton11()}

            {/* //cancel */}
            {renderBottonButton3()}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalCont: {
    borderRadius: 7,
    backgroundColor: theme.color.background,
    width: responsiveWidth(80),
    height: responsiveHeight(50),
    alignSelf: 'center',
    elevation: 4,
  },
  logo: {
    height: responsiveHeight(12),
    width: responsiveWidth(60),
    resizeMode: 'contain',
  },
  title: {
    color: theme.color.title,
    fontSize: responsiveFontSize(2.4),
    marginTop: 10,
    fontFamily: 'Inter',
    fontWeight: '500',
  },
  subtitle: {
    color: theme.color.subTitle,
    fontSize: responsiveFontSize(1.8),
    marginTop: 10,
    fontFamily: 'Inter-Regular',
    width: '100%',
    alignSelf: 'center',
    lineHeight: 20,
  },
  BottomButton: {
    backgroundColor: theme.color.disableColor,
    borderRadius: 10,
    height: responsiveHeight(6),
    justifyContent: 'center',
    width: responsiveWidth(90),
    alignSelf: 'center',
    fontFamily: 'Inter-Regular',
    marginVertical: responsiveHeight(3),
  },
  ButtonLeft: {
    backgroundColor: '#fff',
    width: 160,
    borderRadius: 4,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  ButtonRight: {
    backgroundColor: '#fff',
    width: 160,
    borderRadius: 4,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  buttonText: {
    color: theme.color.button1,
    fontSize: 16,
    lineHeight: 19.36,
    fontFamily: 'Inter-Bold',
  },
  status: {
    backgroundColor: theme.color.background,
  },
  Header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',

    padding: 15,
  },
  ArrowBack: {
    height: 24,
    width: 24,
  },
  BackButton: {
    height: 30,
    width: 30,
  },
  ConfirmButton: {
    backgroundColor: '#fff',
    borderRadius: 4,
    height: 48,
    justifyContent: 'center',
    top: 80,
    width: '85%',
    alignSelf: 'center',
  },
  ButtonText: {
    alignSelf: 'center',
    color: theme.color.buttonText,
    fontSize: responsiveFontSize(2),
    fontFamily: theme.fonts.fontBold,
  },
  ButtonTextc: {
    alignSelf: 'center',
    color: theme.color.button1,
    fontSize: responsiveFontSize(2),
    fontFamily: theme.fonts.fontBold,
  },
  Button: {
    backgroundColor: theme.color.button1,
    borderRadius: 7,
    height: 35,
    justifyContent: 'center',
    width: '100%',
    alignSelf: 'center',
    fontFamily: 'Inter-Regular',
    alignItems: 'center',
    marginTop: 10,
  },

  Buttonc: {
    backgroundColor: theme.color.background,
    borderRadius: 7,
    height: 35,
    justifyContent: 'center',
    width: '100%',
    alignSelf: 'center',
    fontFamily: 'Inter-Regular',
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 0.7,
    borderColor: theme.color.button1,
  },
  LinearGradient: {
    height: '100%',
    width: '100%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    alignSelf: 'center',
    justifyContent: 'center',
    marginVertical: 30,
  },
  Timer: {
    alignSelf: 'center',
    marginVertical: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  TimerTextr: {
    fontSize: responsiveFontSize(1.8),
    color: theme.color.title,
  },
  TimerText: {
    fontSize: responsiveFontSize(1.8),
    color: theme.color.title,
    fontFamily: 'Inter-Bold',
    fontWeight: '600',
  },
  TimerTextdisable: {
    fontSize: responsiveFontSize(1.8),
    color: theme.color.subTitle,
    fontFamily: 'Inter-Regular',
    fontWeight: '500',
  },
  root: {
    flex: 1,
    padding: 10,
  },
  codeContainer: {
    width: '100%',
    alignSelf: 'center',
    marginTop: 5,
  },
  codeFieldRoot: {},
  cell: {
    width: 35,
    height: 35,
    lineHeight: 35,
    fontSize: responsiveFontSize(2),
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    borderBottomColor: 'black',
    textAlign: 'center',
    color: theme.color.title,
    fontFamily: 'Inter-Regular',
    marginTop: 10,
  },
  focusCell: {
    borderColor: theme.color.subTitle,
  },
});
