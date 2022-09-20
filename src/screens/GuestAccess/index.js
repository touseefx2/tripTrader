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
  Platform,
  StatusBar,
  KeyboardAvoidingView,
  Modal as MModal,
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

export default observer(GuestAccess);
function GuestAccess(props) {
  const mobileReg = /^[0][3]\d{9}$/;
  const emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
  const cnicReg = /\d{5}\d{8}\d/;

  const toast = useRef(null);
  const toastduration = 700;

  let user = store.User.user;

  let loader = store.User.regLoader;

  const [errorMessage, seterrorMessage] = useState('');

  const goBack = () => {
    props.navigation.goBack();
  };

  const setErrMessage = c => {
    seterrorMessage(c);
  };

  const continueGuest = () => {
    // NetInfo.fetch().then(state => {
    //   if (state.isConnected) {
    //     store.User.getData(setErrMessage);
    //   } else {
    //     // seterrorMessage('Please connect internet');
    //     Alert.alert('', 'Please connect internet');
    //   }
    // });
    let token = '';
    let rslt = 'guest';
    store.User.addUser(token, rslt);
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
    // Methods

    const renderButton1 = () => {
      const onClickButton = () => {
        props.navigation.navigate('Signup');
      };
      return (
        <>
          <TouchableOpacity
            onPress={onClickButton}
            activeOpacity={0.7}
            style={styles.BottomButton}>
            <Text style={styles.buttonTextBottom}>Join now</Text>
          </TouchableOpacity>
        </>
      );
    };

    const renderButton2 = () => {
      const onClickButton = () => {
        props.navigation.navigate('Signin');
      };
      return (
        <>
          <TouchableOpacity
            onPress={onClickButton}
            activeOpacity={0.7}
            style={[
              styles.BottomButton,
              {
                backgroundColor: theme.color.button2,

                marginTop: 12,
              },
            ]}>
            <Text
              style={[
                styles.buttonTextBottom,
                {
                  color: '#30563A',
                  fontFamily: theme.fonts.fontBold,
                },
              ]}>
              sign in
            </Text>
          </TouchableOpacity>
        </>
      );
    };

    return (
      <>
        <View style={styles.section2}>
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <Image
              source={require('../../assets/images/guestacs/img.png')}
              style={styles.section2Logo}
            />

            {/* {errorMessage !== '' && renderShowError()} */}

            <Text style={styles.section2Title1}>Limited Guest Access</Text>

            <View
              style={{
                width: '98%',

                alignSelf: 'center',
              }}>
              <Text style={styles.section2LogoTitle}>
                You may use Trip Trader as a guest, but some features will not
                be available. For the best experience, we recommend creating an
                account or signing in.
              </Text>
            </View>
          </View>
          {renderButton1()}
          {renderButton2()}

          <View style={styles.Field3}>
            <TouchableOpacity activeOpacity={0.7} onPress={continueGuest}>
              <Text style={styles.Field3Title1}>
                I want to continue as a guest
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </>
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
