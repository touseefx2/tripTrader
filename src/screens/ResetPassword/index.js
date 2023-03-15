import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
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

export default observer(ResetPassword);
function ResetPassword(props) {
  let screen = props.route.params.screen || '';

  let chk = props.route.params.chk || ''; //isemail or isphone
  let value = props.route.params.value || ''; //email/phone

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

  const goToChangePassword = () => {
    props.navigation.navigate('ChangePasswordd');
  };

  const showToast = () => {
    toast?.current?.show('Password update successfully', 1000);
    setTimeout(() => {
      if (screen == 'cp') {
        goToChangePassword();
      } else {
        goToLogin();
      }
    }, 500);
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
        let body = {};
        if (chk == 'email') {
          body = {
            newPassword: np,
            email: value,
          };
        } else {
          body = {
            newPassword: np,
            phone: value.substring(1),
          };
        }

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
          ? 'Password must contain 8 or more characters'
          : '';
      }

      if (c == 'cp') {
        text = Emptycp
          ? 'Please enter confirm password'
          : invalidCP
          ? 'Confirm password do not match'
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
                {!snp && (
                  <Image
                    style={{width: 20, height: 12, resizeMode: 'contain'}}
                    source={require('../../assets/images/sp/img.png')}
                  />
                )}
                {snp && (
                  <utils.vectorIcon.Ionicons
                    name={'eye-off-outline'}
                    color={theme.color.button1}
                    size={20}
                  />
                )}
              </TouchableOpacity>
            )}
          </View>
          {(invalidnp || Emptynp) && renderShowFieldError('np')}
        </View>

        <View style={[styles.Field, {marginTop: 20}]}>
          <Text style={[styles.FieldTitle1, {textTransform: 'none'}]}>
            Confirm Password
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
                {!scp && (
                  <Image
                    style={{width: 20, height: 12, resizeMode: 'contain'}}
                    source={require('../../assets/images/sp/img.png')}
                  />
                )}
                {scp && (
                  <utils.vectorIcon.Ionicons
                    name={'eye-off-outline'}
                    color={theme.color.button1}
                    size={20}
                  />
                )}
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
      <Image
        source={require('../../assets/images/background/img.png')}
        style={styles.container2}
      />
      <SafeAreaView style={styles.container3}>
        <utils.AuthHeader props={props} />

        <ScrollView
          style={{paddingHorizontal: 15, marginTop: responsiveHeight(3)}}
          showsVerticalScrollIndicator={false}>
          <KeyboardAvoidingView style={{flex: 1}} enabled>
            {renderSection2()}
          </KeyboardAvoidingView>
        </ScrollView>
      </SafeAreaView>

      <Toast ref={toast} position="bottom" />
      {Platform.OS == 'ios' && <utils.Loader load={loader} />}
    </View>
  );
}
