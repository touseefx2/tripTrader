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

export default observer(ResetPassword);
function ResetPassword(props) {
  const mobileReg = /^[0][3]\d{9}$/;
  const emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
  const cnicReg = /\d{5}\d{8}\d/;

  const loader = store.User.regLoader;

  const toast = useRef(null);
  const toastduration = 700;

  const [np, setnp] = useState('');
  const [Emptynp, setEmptynp] = useState(false);
  const [invalidnp, setinvalidnp] = useState(false);
  const [snp, setsnp] = useState(false);

  const [cp, setcp] = useState('');
  const [Emptycp, setEmptycp] = useState(false);
  const [scp, setscp] = useState(false);

  const [invalidCP, setinvalidCP] = useState(false);

  const [errorMessage, seterrorMessage] = useState('');

  const goBack = () => {
    props.navigation.goBack();
  };

  const clearAllField = () => {
    setinvalidCP(false);
    setEmptynp(false);
    setinvalidnp(false);
    setEmptycp(false);

    seterrorMessage('');
  };

  const setErrMessage = c => {
    seterrorMessage(c);
  };

  const goToLogin = () => {
    props.navigation.navigate('Login');
  };

  const showToast = () => {
    toast?.current?.show('Update Paswword success', 1000);
    setTimeout(() => {
      goToLogin();
    }, 700);
  };

  const updatePassword = () => {
    clearAllField();
    Keyboard.dismiss();

    if (np == '') {
      setEmptynp(true);

      return;
    }

    if (np.length < 8) {
      setinvalidnp(true);
      return;
    }

    if (cp == '') {
      setEmptycp(true);
      return;
    }

    if (np !== cp) {
      setinvalidCP(true);
      return;
    }

    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        let body = {
          password: np,
        };
        store.User.updatePasword(body, setErrMessage, showToast);
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
    const enterNp = t => {
      setEmptynp(false);
      setinvalidnp(false);
      setnp(t);
    };

    const enterCp = t => {
      setEmptycp(false);
      setinvalidCP(false);
      setcp(t);
    };

    const renderButton = () => {
      return (
        <>
          <TouchableOpacity
            onPress={updatePassword}
            activeOpacity={0.7}
            style={styles.BottomButton}>
            <Text style={styles.buttonTextBottom}>update password</Text>
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

      if (c == 'np') {
        text = Emptynp
          ? 'Please enter new password'
          : invalidnp
          ? 'Password must contains 8 or more characters'
          : '';
      }

      if (c == 'cp') {
        text = Emptycp
          ? 'Please Re-enter Password'
          : invalidCP
          ? 'Passwords do not match'
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
        <View>
          <Text style={styles.section2Title1}>password reset</Text>
          {/* {errorMessage !== '' && renderShowError()} */}
        </View>

        <View style={[styles.Field, {marginTop: 20}]}>
          <Text style={styles.FieldTitle1}>new password</Text>
          <View
            style={[
              styles.FieldInput,
              {
                borderColor:
                  invalidnp || Emptynp
                    ? theme.color.fieldBordeError
                    : theme.color.fieldBorder,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              },
            ]}>
            <TextInput
              placeholder=""
              secureTextEntry={!snp}
              onChangeText={enterNp}
              style={{width: '85%'}}
            />

            {np.length > 0 && (
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                  setsnp(!snp);
                }}>
                <utils.vectorIcon.Entypo
                  name={!snp ? 'eye' : 'eye-with-line'}
                  color={theme.color.button1}
                  size={20}
                />
              </TouchableOpacity>
            )}
          </View>
          {(invalidnp || Emptynp) && renderShowFieldError('np')}
        </View>

        <View style={[styles.Field, {marginTop: 20}]}>
          <Text style={[styles.FieldTitle1, {textTransform: 'none'}]}>
            Re-enter Password
          </Text>
          <View
            style={[
              styles.FieldInput,
              {
                borderColor:
                  invalidCP || Emptycp
                    ? theme.color.fieldBordeError
                    : theme.color.fieldBorder,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              },
            ]}>
            <TextInput
              placeholder=""
              secureTextEntry={!scp}
              onChangeText={enterCp}
              style={{width: '85%'}}
            />

            {cp.length > 0 && (
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                  setscp(!scp);
                }}>
                <utils.vectorIcon.Entypo
                  name={!scp ? 'eye' : 'eye-with-line'}
                  color={theme.color.button1}
                  size={20}
                />
              </TouchableOpacity>
            )}
          </View>
          {(invalidCP || Emptycp) && renderShowFieldError('cp')}
        </View>

        {renderButton()}
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
      {Platform.OS == 'ios' && <utils.Loader load={loader} />}
    </View>
  );
}
