import React, {useRef} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import {styles} from './styles';
import {observer} from 'mobx-react';
import store from '../../store/index';
import utils from '../../utils/index';
import theme from '../../theme';
import {responsiveHeight} from 'react-native-responsive-dimensions';
import Toast from 'react-native-easy-toast';

export default observer(GuestAccess);
function GuestAccess(props) {
  const toast = useRef(null);
  const loader = store.User.regLoader;

  const continueGuest = () => {
    store.General.setgoto('home');
    store.User.addUser('', 'guest', '');
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
            activeOpacity={0.9}
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
            activeOpacity={0.9}
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
      <Image
        source={require('../../assets/images/background/img.png')}
        style={styles.container2}
      />
      <SafeAreaView style={styles.container3}>
        <utils.AuthHeader props={props} />

        <ScrollView
          style={{paddingHorizontal: 15, marginTop: responsiveHeight(3)}}
          showsVerticalScrollIndicator={false}>
          {renderSection2()}
        </ScrollView>
      </SafeAreaView>

      <Toast ref={toast} position="bottom" />
      <utils.Loader load={loader} />
    </View>
  );
}
