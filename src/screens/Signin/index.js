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

export default observer(Signin);
function Signin(props) {
  const mobileReg = /^[0][3]\d{9}$/;
  const emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
  const cnicReg = /\d{5}\d{8}\d/;

  const toast = useRef(null);
  const toastduration = 700;
  let loader = store.User.regLoader;
  let em = store.User.email || '';
  let pwd = store.User.pswd || '';
  let sp = store.User.sp || false;

  const [email, setemail] = useState(em);
  const [Emptyemail, setEmptyemail] = useState(false);
  const [invalidemail, setinvalidemail] = useState(false);

  const [pswd, setpswd] = useState(pwd);
  const [Emptypswd, setEmptypswd] = useState(false);
  const [invalidpswd, setinvalidpswd] = useState(false);
  const [showPaswd, setshowPaswd] = useState(false);

  const [savePswd, setsavePswd] = useState(sp);

  const [errorMessage, seterrorMessage] = useState('');

  const goBack = () => {
    props.navigation.goBack();
  };

  const clearAllField = () => {
    setinvalidemail(false);
    setEmptyemail(false);
    setinvalidpswd(false);
    setEmptypswd(false);
  };

  const setErrMessage = c => {
    seterrorMessage(c);
  };

  const Signin = () => {
    clearAllField();
    Keyboard.dismiss();

    if (email == '') {
      setEmptyemail(true);
      return;
    }

    if (emailReg.test(email) === false) {
      setinvalidemail(true);
      return;
    }

    if (pswd == '') {
      setEmptypswd(true);
      return;
    }

    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        const body = {
          email: email.toLowerCase(),
          pswd: pswd,
        };
        store.User.LoginUser(body, savePswd, setErrMessage);
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
            size={25}
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

    const enterPaswd = t => {
      setinvalidpswd(false);
      setEmptypswd(false);
      setpswd(t);
    };

    const showPasswd = () => {
      setshowPaswd(!showPaswd);
    };

    const savePaswd = () => {
      setsavePswd(!savePswd);
    };

    const forgotPswd = () => {
      props.navigation.navigate('ForgotPasswords');
    };

    const goToSignup = () => {
      props.navigation.navigate('Signup');
    };

    const renderButton = () => {
      return (
        <>
          <TouchableOpacity
            onPress={Signin}
            activeOpacity={0.7}
            style={styles.BottomButton}>
            <Text style={styles.buttonTextBottom}>sign in</Text>
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

      if (c == 'pswd') {
        text = invalidpswd
          ? 'Password must contains 8 or more characters'
          : Emptypswd
          ? 'Please enter password'
          : '';
      }

      return (
        <View style={styles.errorMessageFieldContainer}>
          <Text style={styles.errorMessageFieldText}>{text}</Text>
        </View>
      );
    };

    return (
      <View style={styles.section2}>
        <Text style={styles.section2Title1}>Sign in</Text>

        {/* {errorMessage !== '' && renderShowError()} */}

        <View style={[styles.Field, {marginTop: 25}]}>
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
              value={pswd}
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

        <View style={styles.Field2}>
          <TouchableOpacity activeOpacity={0.5} onPress={savePaswd}>
            {!savePswd && (
              <utils.vectorIcon.Feather
                name={'square'}
                color={theme.color.subTitleLight}
                size={20}
              />
            )}

            {savePswd && (
              <utils.vectorIcon.AntDesign
                name={'checksquare'}
                color={theme.color.button1}
                size={20}
              />
            )}
          </TouchableOpacity>
          <Text style={styles.Field2Title}>save password</Text>
        </View>

        {renderButton()}

        <View style={styles.Field3}>
          <TouchableOpacity activeOpacity={0.7} onPress={forgotPswd}>
            <Text style={styles.Field3Title1}>forgot password?</Text>
          </TouchableOpacity>

          <View style={styles.Field31}>
            <Text style={styles.Field31Title1}>Not a memeber?</Text>
            <TouchableOpacity activeOpacity={0.7} onPress={goToSignup}>
              <Text style={styles.Field31Title2}>Join now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/background/img.png')}
        style={styles.container2}>
        <SafeAreaView style={styles.container2}>
          <utils.AuthHeader props={props} />
          <KeyboardAvoidingView style={{flex: 1}} enabled>
            <ScrollView
              style={{paddingHorizontal: 15}}
              showsVerticalScrollIndicator={false}>
              {renderSection2()}
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </ImageBackground>
      <Toast ref={toast} position="bottom" />
      <utils.Loader load={loader} />
    </View>
  );
}
