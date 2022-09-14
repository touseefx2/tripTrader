import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  StatusBar,
  ScrollView,
  Modal,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {styles} from './styles';
import {observer} from 'mobx-react';
import store from '../../store/index';
import utils from '../../utils/index';
import theme from '../../theme';
import FastImage from 'react-native-fast-image';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-easy-toast';
import MaskedView from '@react-native-community/masked-view';
import Svg, {Path} from 'react-native-svg';
import {responsiveHeight} from 'react-native-responsive-dimensions';
import RBSheet from 'react-native-raw-bottom-sheet';
import auth from '@react-native-firebase/auth';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {LoginManager, AccessToken} from 'react-native-fbsdk-next';

export default observer(BottomModalLogin);
function BottomModalLogin(props) {
  let rbSheet = props.rbSheet;
  let screen = props.screen || '';
  const nav = props.nav;
  let cart = store.User.cart;

  useEffect(() => {
    GoogleSignin.configure({
      scopes: ['email'], // what API you want to access on behalf of the user, default is email and profile
      webClientId:
        '664935989773-hfnr1ee9235s764avptg5r3unfn1ufiv.apps.googleusercontent.com',
      offlineAccess: true,
    });
  }, []);

  // Method

  const closeSheet = () => {
    props.CloseSheet();
  };

  const openSheet = () => {
    props.OpenSheet();
  };

  const GoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      // const {accessToken, idToken} = await GoogleSignin.signIn();
      // Get the users ID token
      const {idToken} = await GoogleSignin.signIn();
      console.log('Yes Google sigin success');
      console.log('idToken : ', idToken);
      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      console.log('googleCredential  : ', googleCredential);
      // Sign-in the user with the credential
      let signinData = await auth().signInWithCredential(googleCredential);
      console.log('signInWithCredential  : ', signinData);
      closeSheet();
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        alert('Cancel');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        alert('Signin in progress');
        // operation (f.e. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        alert('PLAY_SERVICES_NOT_AVAILABLE');
        // play services not available or outdated
      } else {
        console.error('google sigin error : ', error);
      }
    }
  };

  const FacebookLogin = async () => {
    try {
      // Attempt login with permissions
      const result = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
      ]);

      if (result.isCancelled) {
        throw 'User cancelled the login process';
      }

      // Once signed in, get the users AccesToken
      const data = await AccessToken.getCurrentAccessToken();

      if (!data) {
        throw 'Something went wrong obtaining access token';
      }

      // Create a Firebase credential with the AccessToken
      const facebookCredential = auth.FacebookAuthProvider.credential(
        data.accessToken,
      );

      // Sign-in the user with the credential
      let signinData = await auth().signInWithCredential(facebookCredential);
      console.log('signInWithCredential  : ', signinData);
      closeSheet();
    } catch (error) {
      console.error('facebook sigin error : ', error);
    }
  };

  const EmailLogin = () => {
    closeSheet();
    nav.navigate('Login', {screen: screen});
  };

  const googleSignOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      auth().signOut();
      console.error('google sigin out success : ');
    } catch (error) {
      console.error('google sigin out : ', error);
    }
  };

  const facebookSignOut = async () => {
    try {
      LoginManager.logOut();
      auth().signOut();
      console.error('facebook sigin out success : ');
    } catch (error) {
      console.error('facebook sigin out : ', error);
    }
  };

  // Render

  const renderGoogleButton = () => {
    return (
      <>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={GoogleLogin}
          style={[
            styles.BottomButton,
            {backgroundColor: theme.color.background},
          ]}>
          <Text
            style={[styles.buttonTextBottom, {color: theme.color.subTitle}]}>
            Continue with Google
          </Text>
          <Image
            source={require('../../assets/images/google/img.png')}
            style={styles.buttonLogo}
          />
        </TouchableOpacity>
      </>
    );
  };

  const renderFacebookButton = () => {
    return (
      <>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={FacebookLogin}
          style={[
            styles.BottomButton,
            {backgroundColor: '#3560FB', marginTop: 15},
          ]}>
          <Text style={styles.buttonTextBottom}>Continue with Facebook</Text>
          <utils.vectorIcon.MaterialCommunityIcons
            style={{position: 'absolute', left: 15}}
            name="facebook"
            color={theme.color.buttonText}
            size={24}
          />
        </TouchableOpacity>
      </>
    );
  };

  const renderEmailButton = () => {
    return (
      <>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={EmailLogin}
          style={styles.BottomButton2}>
          <Text style={[styles.buttonTextBottom, {color: theme.color.button1}]}>
            Continue with email
          </Text>
        </TouchableOpacity>
      </>
    );
  };

  const renderSep = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          marginVertical: 17,
        }}>
        <View
          style={{
            width: '45%',
            backgroundColor: theme.color.subTitleLight,
            height: 0.5,
            opacity: 0.5,
          }}
        />
        <Text style={styles.titleText2}>or</Text>
        <View
          style={{
            width: '45%',
            backgroundColor: theme.color.subTitleLight,
            height: 0.5,
          }}
        />
      </View>
    );
  };

  // Main

  return (
    <>
      <RBSheet
        ref={rbSheet}
        height={responsiveHeight(45)}
        closeOnPressBack={true}
        openDuration={250}
        screen={screen}
        closeOnDragDown={true}
        closeOnPressMask={true}
        KeyboardAvoidingView={true}
        customStyles={{
          wrapper: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
          },
          container: {
            backgroundColor: theme.color.background,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 3,
            },
            shadowOpacity: 0.27,
            shadowRadius: 4.65,
            paddingHorizontal: 15,
            elevation: 6,
          },
          draggableIcon: {
            // backgroundColor: theme.color.cartbutton,
          },
        }}>
        <View>
          <Text
            style={{
              fontFamily: theme.fonts.fontMedium,
              color: theme.color.title,
              fontSize: 21,
            }}>
            Sign up or Log in
          </Text>

          <View style={{marginTop: 30}}>
            {renderGoogleButton()}
            {renderFacebookButton()}
            {renderSep()}
            {renderEmailButton()}
          </View>
        </View>
      </RBSheet>
    </>
  );
}
