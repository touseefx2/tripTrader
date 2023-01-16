import {observer} from 'mobx-react';
import React, {useEffect, useRef} from 'react';
import {
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-easy-toast';
import store from '../../store/index';
import theme from '../../theme';
import {styles} from './styles';

export default observer(Login);
function Login(props) {
  const toast = useRef(null);
  const toastduration = 700;
  let goto = store.General.goto;

  useEffect(() => {
    if (goto == 'joinnow') {
      props.navigation.navigate('Signup');
      store.General.setgoto('');
    }
    if (goto == 'guestaccess') {
      goToGuestAccess();
      store.General.setgoto('');
    }
  }, []);

  const goToGuestAccess = () => {
    props.navigation.navigate('GuestAccess');
  };

  const renderSection1 = () => {
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

  const renderSection2 = () => {
    return (
      <View style={styles.section2}>
        <Text style={styles.section2Title1}>
          Your next outdoor adventure awaits
        </Text>

        <Text style={styles.section2Title2}>
          Join other outdoor enthusiasts to trade memorable experiences!
        </Text>
      </View>
    );
  };

  const renderSection3 = () => {
    const renderButton1 = () => {
      const onClickButton = () => {
        props.navigation.navigate('Signup');
      };

      return (
        <>
          <TouchableOpacity
            onPress={onClickButton}
            activeOpacity={0.7}
            style={[
              styles.BottomButton,
              {backgroundColor: theme.color.background},
            ]}>
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
                backgroundColor: 'transparent',
                borderWidth: 1,
                borderColor: theme.color.fieldBorder,
                marginTop: 12,
              },
            ]}>
            <Text
              style={[
                styles.buttonTextBottom,
                {color: theme.color.buttonText},
              ]}>
              sign in
            </Text>
          </TouchableOpacity>
        </>
      );
    };

    const renderButton3 = () => {
      const onClickButton = () => {
        goToGuestAccess();
      };

      return (
        <>
          <View style={styles.BottomButtonT}>
            <Text style={styles.buttonTextBottomTtitle1}>Or you can</Text>
            <TouchableOpacity onPress={onClickButton} activeOpacity={0.7}>
              <Text style={styles.buttonTextBottomTtitle2}>
                continue as a guest
              </Text>
            </TouchableOpacity>
          </View>
        </>
      );
    };

    return (
      <View style={styles.section3}>
        {renderSection2()}
        {renderButton1()}
        {renderButton2()}
        {renderButton3()}
      </View>
    );
  };

  const renderStatusBar = () => {
    return (
      <>
        <StatusBar
          translucent={true}
          backgroundColor={'transparent'}
          barStyle={'light-content'}
        />
      </>
    );
  };

  return (
    <View style={styles.container}>
      {renderStatusBar()}

      <ImageBackground
        source={require('../../assets/images/background/img.png')}
        style={styles.container2}>
        <SafeAreaView style={styles.container3}>
          <ScrollView
            style={{flex: 1, paddingHorizontal: 20}}
            showsVerticalScrollIndicator={false}>
            {renderSection1()}
          </ScrollView>

          {renderSection3()}
        </SafeAreaView>

        <Toast ref={toast} position="center" />
      </ImageBackground>
    </View>
  );
}
