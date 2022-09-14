import React, {useRef, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import theme from '../../theme/index';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import utils from '../../utils/index';
import store from '../../store/index';
import {observer} from 'mobx-react';

import LinearGradient from 'react-native-linear-gradient';

export default observer(CheckLogin);
function CheckLogin(props) {
  // const [cartt, setcartt] = useState();
  let title = 'Food Delivery';
  let nav = props.navigation;

  useEffect(() => {}, []);

  const goBack = () => {
    nav.goBack();
  };
  const Login = () => {
    nav.navigate('Login');
  };

  const Signup = () => {
    nav.navigate('Signup');
  };

  const Guest = () => {
    if (props.route.params.screen == 'home') {
      goBack();
      return;
    }
    nav.navigate('Checkout');
    store.User.setisChkLoginModal(false);
  };

  const renderLoginButton = () => {
    return (
      <>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={Login}
          style={styles.BottomButton}>
          <LinearGradient
            colors={[theme.color.button1, theme.color.button2]}
            style={styles.LinearGradient}>
            <Text style={styles.buttonTextBottom}>Login</Text>
          </LinearGradient>
        </TouchableOpacity>
      </>
    );
  };

  const renderSignupButton = () => {
    return (
      <>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={Signup}
          style={styles.BottomButton2}>
          <LinearGradient
            colors={[theme.color.background, theme.color.background]}
            style={styles.LinearGradient2}>
            <Text
              style={[
                styles.buttonTextBottom,
                {color: theme.color.button1, marginLeft: 5},
              ]}>
              Signup
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </>
    );
  };

  const renderGuestButton = () => {
    return (
      <>
        <TouchableOpacity activeOpacity={0.6} onPress={Guest}>
          <Text style={styles.titleText3}>Continue as Guest</Text>
        </TouchableOpacity>
      </>
    );
  };

  return (
    <>
      <View style={styles.modalCont}>
        <View style={styles.section1}>
          <Image
            style={styles.logo}
            source={require('../../assets/images/logo/img.png')}
          />
          <Text style={styles.titleText}>{title}</Text>
        </View>

        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            bottom: 20,
            alignSelf: 'center',
          }}>
          {renderLoginButton()}
          {renderSignupButton()}
          <Text style={styles.titleText2}>or</Text>
          {renderGuestButton()}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  modalCont: {
    flex: 1,
    padding: 20,

    backgroundColor: theme.color.background,
  },

  section1: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,

    marginTop: 50,
  },
  logo: {
    width: responsiveWidth(35),
    height: responsiveHeight(25),
    resizeMode: 'cover',
  },
  titleText: {
    fontSize: 20,
    fontFamily: theme.fonts.fontMedium,
    color: theme.color.title,
    alignSelf: 'center',
    marginTop: -15,
  },

  BottomButton: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.color.primary,
    height: responsiveHeight(5.5),
    borderRadius: 7,
    alignSelf: 'center',
    marginTop: 50,
    elevation: 4,
  },
  buttonTextBottom: {
    color: theme.color.buttonText,
    fontSize: 15,
    fontFamily: theme.fonts.fontMedium,
    textTransform: 'capitalize',
  },
  LinearGradient: {
    height: '100%',
    width: '100%',
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  BottomButton2: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: responsiveHeight(5.5),
    backgroundColor: theme.color.background,
    borderRadius: 7,
    alignSelf: 'center',
    marginTop: 20,
    elevation: 4,
    flexDirection: 'row',
    borderWidth: 0.7,
    borderColor: theme.color.button1,
  },
  LinearGradient2: {
    height: '100%',
    width: '100%',
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },

  titleText2: {
    fontSize: 14,
    fontFamily: theme.fonts.fontMedium,
    color: theme.color.subTitle,
    alignSelf: 'center',
    marginVertical: 20,
  },
  titleText3: {
    fontSize: 14,
    fontFamily: theme.fonts.fontMedium,
    color: theme.color.subTitle,
    alignSelf: 'center',
  },
});
