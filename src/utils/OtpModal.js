import NetInfo from '@react-native-community/netinfo';
import auth from '@react-native-firebase/auth';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import CountDown from 'react-native-countdown-component';
import Modal from 'react-native-modal';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import theme from '../theme/index';

const CELL_COUNT = 6;

export default function OtpModal(props) {
  const isModal = props.isModal;
  const setisModal = c => {
    props.setisModal(c);
  };

  const mobile = props.phone || '';
  console.log('mobiel :  ', mobile);

  let resendTime = 60; //second

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
        console.log('user verify');
        NetInfo.fetch().then(state => {
          if (state.isConnected) {
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
          .signInWithPhoneNumber(mobile, true)
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
            setFinish(false);
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
    try {
      Keyboard.dismiss();
      setvLoader(true);

      await confirmResult.confirm(value);
    } catch (error) {
      console.log('Verifyication Code  error: ', error);
      setvLoader(false);
      setValue('');
      let errorMessage = '';
      if (error.code == 'auth/unknown') {
        errorMessage =
          'Cannot create PhoneAuthCredential without either verificationProof, sessionInfo, temporary proof, or enrollment ID !';
        return;
      } else if (error.code == 'auth/invalid-verification-code') {
        errorMessage =
          'Invalid verification code, Please enter correct confirmation code !';
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
  }

  const gotoNext = () => {
    setisModal(false);
    setloader(false);
    setValue('');
    setConfirmResult(null);
    setFinish(false);
    props.attemptTosaveProfile();
    props.signoutCurrentUser();
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
        onPress={() => SendOtpCode()}
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
        onPress={() => SendOtpCode()}
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
              ? theme.color.disableBack
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

  const closeModal = () => {
    if (!loader) {
      setisModal(false);
      setloader(false);
      setValue('');
      setConfirmResult(null);
      setFinish(false);
      props.signoutCurrentUser();
    }
  };

  const renderBottonButton3 = () => {
    let text = 'Cancel';

    return (
      <TouchableOpacity
        activeOpacity={0.6}
        disabled={loader}
        onPress={closeModal}
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
              color: theme.color.button1,
              fontSize: responsiveFontSize(1.8),
              fontFamily: theme.fonts.fontMedium,
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
        backdropOpacity={0.6}
        onRequestClose={() => {
          if (!sendCodeOnce) {
            closeModal();
          }
        }}
        isVisible={isModal}>
        <View
          style={[
            styles.modalCont,
            {height: responsiveHeight(!sendCodeOnce ? 50 : 42)},
          ]}>
          <KeyboardAvoidingView style={{flex: 1}} enabled>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={{paddingVertical: 12, paddingHorizontal: 15}}>
                <Text style={styles.title}>Verify your mobile number</Text>
                <Text style={styles.subtitle}>
                  You will receive an OTP on your provided number {mobile}
                </Text>
                {renderCodeInputFields()}
                {!loader && sendCodeOnce && !isFinish && renderTimer()}
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
          <View style={{paddingVertical: 12, paddingHorizontal: 15}}>
            {/* //cnfrm */}
            {renderBottonButton2()}
            {/* //snd */}
            {!sendCodeOnce && renderBottonButton1()}
            {/* //resend */}
            {sendCodeOnce && isFinish && renderBottonButton11()}

            {/* //cancel */}
            {(!sendCodeOnce || isFinish) && renderBottonButton3()}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalCont: {
    borderRadius: 10,
    backgroundColor: theme.color.background,
    width: responsiveWidth(80),
    height: responsiveHeight(50),
    alignSelf: 'center',
  },
  logo: {
    height: responsiveHeight(12),
    width: responsiveWidth(60),
    resizeMode: 'contain',
  },
  title: {
    color: theme.color.title,
    fontSize: responsiveFontSize(2.3),
    // marginTop: 10,
    fontFamily: theme.fonts.fontBold,
  },
  subtitle: {
    color: theme.color.subTitle,
    fontSize: responsiveFontSize(1.8),
    marginTop: 10,
    fontFamily: theme.fonts.fontMedium,
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
    fontFamily: theme.fonts.fontNormal,
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

    fontFamily: theme.fonts.fontBold,
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
    fontFamily: theme.fonts.fontNormal,
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
    fontFamily: theme.fonts.fontNormal,
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
    fontFamily: theme.fonts.fontBold,
  },
  TimerTextdisable: {
    fontSize: responsiveFontSize(1.8),
    color: theme.color.subTitle,
    fontFamily: theme.fonts.fontMedium,
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
    borderWidth: 0.7,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    borderColor: theme.color.subTitle,
    textAlign: 'center',
    color: theme.color.title,
    fontFamily: theme.fonts.fontMedium,
    marginTop: 10,
  },
  focusCell: {
    borderColor: theme.color.button1,
  },
});
