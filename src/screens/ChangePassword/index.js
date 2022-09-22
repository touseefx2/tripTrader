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
  KeyboardAvoidingView,
  TextInput,
  Keyboard,
} from 'react-native';
// import Geolocation from 'react-native-geolocation-service';
// import Geocoder from 'react-native-geocoding';
import {styles} from './styles';
import {observer} from 'mobx-react';
import store from '../../store/index';
import utils from '../../utils/index';
import theme from '../../theme';

import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-easy-toast';

import {ScrollView} from 'react-native-gesture-handler';

export default observer(ChangePassword);

function ChangePassword(props) {
  const toast = useRef(null);
  const toastduration = 700;
  let headerTitle = 'Change Password';

  let internet = store.General.isInternet;
  let user = store.User.user;

  const loader = store.User.regLoader;

  const [np, setnp] = useState('');
  const [Emptynp, setEmptynp] = useState(false);
  const [snp, setsnp] = useState(false);
  const [invalidnp, setinvalidnp] = useState(false);

  const [cp, setcp] = useState('');
  const [Emptycp, setEmptycp] = useState(false);
  const [scp, setscp] = useState(false);
  const [invalidCP, setinvalidCP] = useState(false);

  const [currentp, setcurrentp] = useState('');
  const [Emptycurrentp, setEmptycurrentp] = useState(false);
  const [scurrentp, setscurrentp] = useState(false);
  const [invalidcurrentp, setinvalidcurrentp] = useState(false);

  const [errorMessage, seterrorMessage] = useState('');
  const setErrMessage = c => {
    seterrorMessage(c);
  };

  const clearAllField = () => {
    setinvalidCP(false);
    setEmptynp(false);
    setinvalidnp(false);
    setEmptycp(false);
    setinvalidcurrentp(false);
    setEmptycurrentp(false);
    seterrorMessage('');
  };

  const goBack = () => {
    props.navigation.goBack();
  };

  const showToast = () => {
    toast?.current?.show('Password update successfully', 1000);
  };

  const setInvalidCurrentP = c => {
    setinvalidcurrentp(c);
  };

  const updatePassword = () => {
    clearAllField();
    Keyboard.dismiss();

    if (currentp == '') {
      setEmptycurrentp(true);
      return;
    }

    // if (currentp.length < 8) {
    //   setinvalidcurrentp(true);
    //   return;
    // }

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
          cp: currentp,
          password: np,
        };
        store.User.changePasword(
          body,
          setErrMessage,
          setInvalidCurrentP,
          showToast,
        );
      } else {
        // seterrorMessage('Please connect internet');
        Alert.alert('', 'Please connect internet');
      }
    });
  };

  const forgotPswd = () => {
    Keyboard.dismiss();
    props.navigation.navigate('ForgotPassword', {screen: 'cp'});
  };

  const renderMain = () => {
    const enterCrntp = t => {
      setEmptycurrentp(false);
      setinvalidcurrentp(false);
      setcurrentp(t);
    };

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

      if (c == 'currentp') {
        text = Emptycurrentp
          ? 'Please enter current password'
          : invalidcurrentp
          ? 'Current password not correct'
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
        <View style={[styles.Field, {marginTop: 20}]}>
          <Text style={styles.FieldTitle1}>current password</Text>
          <View
            style={[
              styles.FieldInput,
              {
                borderColor:
                  invalidcurrentp || Emptycurrentp
                    ? theme.color.fieldBordeError
                    : theme.color.fieldBorder,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              },
            ]}>
            <TextInput
              placeholder=""
              secureTextEntry={!scurrentp}
              onChangeText={enterCrntp}
              style={{width: '85%'}}
            />

            {currentp.length > 0 && (
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                  setscurrentp(!scurrentp);
                }}>
                <utils.vectorIcon.Entypo
                  name={!scurrentp ? 'eye' : 'eye-with-line'}
                  color={theme.color.button1}
                  size={20}
                />
              </TouchableOpacity>
            )}
          </View>
          {(invalidcurrentp || Emptycurrentp) &&
            renderShowFieldError('currentp')}
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

        <View style={{marginTop: 35}}>
          <TouchableOpacity activeOpacity={0.7} onPress={forgotPswd}>
            <Text style={styles.FieldTitle11}>Forgot password?</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* {tagLine != '' && <utils.TagLine tagLine={tagLine} />} */}
      <utils.StackHeader props={props} headerTitle={headerTitle} />
      {!internet && <utils.InternetMessage />}
      <SafeAreaView style={styles.container2}>
        <View style={styles.container3}>
          <KeyboardAvoidingView style={{flex: 1}} enabled>
            <ScrollView
              contentContainerStyle={{
                paddingHorizontal: 15,
                paddingVertical: 15,
              }}>
              {renderMain()}
            </ScrollView>
          </KeyboardAvoidingView>
          {/* <utils.Loader2 load={Loader} /> */}
        </View>
        <utils.Footer
          nav={props.navigation}
          screen={headerTitle}
          focusScreen={store.General.focusScreen}
        />
      </SafeAreaView>
      <utils.Loader load={loader} />
      <Toast ref={toast} position="bottom" />
    </View>
  );
}
