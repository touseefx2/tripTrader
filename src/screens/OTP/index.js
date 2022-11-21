import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  Image,
  StatusBar,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
} from 'react-native';
import {observer} from 'mobx-react';
import utils from '../../utils/index';
import styles from './styles';
import store from '../../store/index';
import AntDesign from 'react-native-vector-icons/AntDesign';
import theme from '../../theme/index';
import {responsiveFontSize} from 'react-native-responsive-dimensions';
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

const CELL_COUNT = 6;

export default observer(OTP);
function OTP(props) {
  const d = props.route.params.data;
  const screen = props.route.params.screen;
  let mobile = d.mobile;
  let resendTime = 60; //second

  const [loader, setLoader] = useState(false);
  const [vloader, setvLoader] = useState(false);

  const [seconds, setSeconds] = useState(resendTime);
  const [isFinish, setFinish] = useState(false);
  const [confirmResult, setConfirmResult] = useState(null);
  const [value, setValue] = useState('');
  const [prop, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});

  let s = props.route.params.s;

  const gotoNext = () => {
    // if (screen !== 'login') {
    //   // store.User.attemptToRegister(d, goHome);
    // } else {
    store.User.attemptToLogin(d, goHome, goSignup, goCheckout, s);
    // }
  };

  useEffect(() => {
    // SendOtpCode();
    // const Subscribe = auth().onAuthStateChanged(async user => {
    //   if (user) {
    //     setvLoader(false);
    //     console.log('user');
    //     NetInfo.fetch().then(state => {
    //       if (state.isConnected) {
    //         if (auth().currentUser) {
    //           auth().currentUser.delete();
    //         }
    //         gotoNext();
    //       } else {
    //         Alert.alert('', 'Please connect internet.');
    //       }
    //     });
    //   }
    // });
    // return () => {
    //   Subscribe(); //remove listener
    // };
  }, []);

  async function SendOtpCode() {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        setLoader(true);
        auth()
          .signInWithPhoneNumber(mobile)
          .then(res => {
            console.log('confirmation : ', res);
            setConfirmResult(res);
            setFinish(false);
            setSeconds(resendTime);
            setLoader(false);
          })
          .catch(error => {
            console.log('signInWithPhoneNumber  error : ', error);
            setLoader(false);
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
    // setvLoader(true);
    //   await confirmResult.confirm(value);
    // } catch (error) {
    //   console.log('Verifyication Code  error: ', error);
    // setvLoader(false)
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

    gotoNext();
  }

  const goBack = () => {
    props.navigation.goBack();
  };

  const goHome = () => {
    props.navigation.navigate('Home');
  };

  const goCheckout = () => {
    props.navigation.navigate('Checkout', {s: s});
  };

  const goSignup = () => {
    props.navigation.navigate('Signup', {mobile: mobile, s: s});
  };

  const resend = () => {
    // setValue('');
    // setConfirmResult(null);
    // SendOtpCode();
  };

  const onClickButton = t => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        if (t == 'Verify') {
          verfyCode();
          return;
        }
      } else {
        Alert.alert('Network Error', 'Please check your internet connection');
      }
    });
  };

  const renderLoader = () => {
    return (
      <View style={styles.Timer}>
        <ActivityIndicator color={theme.color.button1} size={25} />
      </View>
    );
  };

  const renderBottonButton = () => {
    let disable = value.length < 6 ? true : false;
    let text = 'Verify';

    return (
      <TouchableOpacity
        onPress={() => onClickButton(text)}
        disabled={store.User.loader || loader || vloader}
        style={[
          styles.Button,
          {
            backgroundColor: !disable
              ? theme.color.button1
              : theme.color.disableBackDark,
          },
        ]}>
        {!disable ? (
          <Text style={styles.ButtonText}>{text}</Text>
        ) : (
          <Text style={styles.ButtonText}>{text}</Text>
        )}
      </TouchableOpacity>
    );
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
          editable={loader || store.User.loader ? false : true}
          cellCount={CELL_COUNT}
          rootStyle={styles.codeFieldRoot}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          renderCell={({index, symbol, isFocused}) => (
            <Text
              key={index}
              style={[
                Platform.OS == 'android' ? styles.cell : styles.cellios,
                isFocused && styles.focusCell,
              ]}
              onLayout={getCellOnLayoutHandler(index)}>
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
          )}
        />
      </View>
    );
  };

  const renderTimer = () => {
    return (
      <TouchableOpacity
        disabled={!isFinish}
        onPress={resend}
        style={styles.Timer}>
        <Text style={isFinish ? styles.TimerText : styles.TimerTextdisable}>
          Resend code
        </Text>
        {!isFinish && (
          <>
            <Text style={[styles.TimerTextr, {color: '#ed5045', left: 5}]}>
              (
            </Text>
            <CountDown
              size={14}
              until={seconds}
              onFinish={() => setFinish(true)}
              digitStyle={{backgroundColor: 'transparent'}}
              digitTxtStyle={{
                color: '#ed5045',
                fontSize: responsiveFontSize(1.8),
                fontFamily: 'Inter-Regular',
                fontWeight: '500',
              }}
              timeToShow={['S']}
              timeLabels={{s: null}}
              showSeparator
            />
            <Text style={[styles.TimerTextr, {color: '#ed5045', left: -5}]}>
              Sec )
            </Text>
          </>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <utils.Loader load={store.User.loginLoader} text={'Please wait'} />

      <View style={styles.Header}>
        <TouchableOpacity onPress={goBack} style={styles.BackButton}>
          <AntDesign name={'left'} size={20} color={theme.color.subTitle} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView style={{flex: 1}} enabled>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{padding: 15}}>
            <Text style={styles.title}>Verify your mobile number</Text>
            <Text style={styles.subtitle}>
              You will receive an OTP on your provided number {mobile}
            </Text>
            {renderCodeInputFields()}
            {!loader && renderTimer()}
            {(loader || vloader) && renderLoader()}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {renderBottonButton()}
    </SafeAreaView>
  );
}
