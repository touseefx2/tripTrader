import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {styles} from './styles';
import {observer} from 'mobx-react';
import store from '../../store/index';
import utils from '../../utils/index';
import theme from '../../theme';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-easy-toast';
import ToggleSwitch from 'toggle-switch-react-native';
import {ScrollView} from 'react-native-gesture-handler';

export default observer(Settings);

function Settings(props) {
  const editprofileIcon = require('../../assets/images/settings/editprofile/img.png');
  const cpIcon = require('../../assets/images/settings/cp/img.png');
  const notificationsIcon = require('../../assets/images/settings/notifications/img.png');
  const blockUserIcon = require('../../assets/images/settings/blockuser/img.png');
  const subIcon = require('../../assets/images/settings/subscription/img.png');
  const contactusIcon = require('../../assets/images/settings/contactus/img.png');
  const newsIcon = require('../../assets/images/settings/news/img.png');
  const privacyIcon = require('../../assets/images/settings/privacy/img.png');
  const logoutIcon = require('../../assets/images/settings/logout/img.png');
  const headerTitle = 'Settings';
  const toast = useRef(null);
  const activeOpacity = 0.8;
  const {isInternet, settingsGoTo, setSettingsGoTo, setgoto, isEmailPopup} =
    store.General;
  const {user, isNotification, Logout, logoutLoader} = store.User;

  let phn = '';
  let phnCntr = '';
  if (user != 'guest' && user) {
    phn = user.phone && user.phone !== null ? '+' + user.phone : '';
    phnCntr =
      user.phoneCountryCode && user.phoneCountryCode !== null
        ? user.phoneCountryCode
        : '';
  }

  const [phone, setPhone] = useState(phn);
  const [cntry, setcntry] = useState(phnCntr);
  const [pwc, setpwc] = useState('');

  const [isShowPrivacy, setIsShowPrivacy] = useState(false);
  const [isDeletAccountModal, setIsDeletAccountModal] = useState(false);

  const goToManageSubscription = () => {
    props.navigation.navigate('ManageSubscription');
    setSettingsGoTo('');
  };

  useEffect(() => {
    if (settingsGoTo != '') {
      if (settingsGoTo == 'Manage Subscription') goToManageSubscription();
    }
  }, []);

  useEffect(() => {
    if (phone != '' && cntry != '') {
      setTimeout(() => {
        let Countries = utils.Countries;
        for (let index = 0; index < Countries.length; index++) {
          const e = Countries[index];
          let result = phone.includes(e.dialCode);
          if (result && cntry == e.code) {
            setcntry(e.code);
            setpwc(phone.slice(e.dialCode.length));
            break;
          }
        }
      }, 1000);
    } else {
      setpwc('');
    }
  }, [phone, cntry]);

  useEffect(() => {
    store.User.setphn(phone);
    store.User.setcntr(cntry);
    store.User.setpwc(pwc);
  }, [phone, cntry, pwc]);

  useEffect(() => {
    if (user && user !== 'guest') {
      setPhone(user.phone && user.phone !== null ? '+' + user.phone : '');
      setcntry(
        user.phoneCountryCode && user.phoneCountryCode !== null
          ? user.phoneCountryCode
          : '',
      );
    }
  }, [user]);

  const JoinNow = () => {
    setgoto('joinnow');
    Logout();
  };

  const onClick = c => {
    if (c == 'edit profile') props.navigation.navigate('EditProfile');

    if (c == 'change password') props.navigation.navigate('ChangePassword');

    if (c == 'notifications') {
    }
    if (c == 'Blocked Users') props.navigation.navigate('BlockUsers');

    if (c == 'Manage Subscription') goToManageSubscription();

    if (c == 'privacy') openWebView();

    if (c == 'Delete Account') openDeleteAccountModal();

    if (c == 'logout') {
      logoutAccount();
    }
  };

  const logoutAccount = () => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        store.User.attemptToLogoutAccount();
      } else Alert.alert('', 'Please connect internet');
    });
  };

  const openDeleteAccountModal = () => {
    setIsDeletAccountModal(true);
  };

  const openWebView = () => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        setIsShowPrivacy(true);
      } else {
        Alert.alert('Network Error', 'Please connect internet.');
      }
    });
  };

  const onclickNot = isOn => {
    store.User.setisNotification(isOn);
    let body = {
      notificationEnabled: isOn,
    };
    store.User.attemptToEditupdateUserNot(body);
  };

  const renderMain = () => {
    const renderEditProfile = () => {
      let title = 'edit profile';
      return (
        <TouchableOpacity
          activeOpacity={activeOpacity}
          onPress={() => {
            onClick(title);
          }}
          style={styles.mainContainer}>
          <View style={styles.sec1Container}>
            <View style={styles.iconConatiner}>
              <Image source={editprofileIcon} style={styles.icon} />
            </View>
          </View>

          <View style={styles.sec2Container}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.sec2Title}>
              {title}
            </Text>
          </View>
        </TouchableOpacity>
      );
    };

    const renderCp = () => {
      let title = 'change password';
      return (
        <TouchableOpacity
          activeOpacity={activeOpacity}
          onPress={() => {
            onClick(title);
          }}
          style={styles.mainContainer}>
          <View style={styles.sec1Container}>
            <View style={styles.iconConatiner}>
              <Image source={cpIcon} style={styles.icon} />
            </View>
          </View>

          <View style={styles.sec2Container}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.sec2Title}>
              {title}
            </Text>
          </View>
        </TouchableOpacity>
      );
    };

    const renderNotifications = () => {
      const title = 'notifications';
      return (
        <TouchableOpacity
          disabled
          activeOpacity={activeOpacity}
          onPress={() => {
            onClick(title);
          }}
          style={styles.mainContainer}>
          <View style={styles.sec1Container}>
            <View style={styles.iconConatiner}>
              <Image source={notificationsIcon} style={styles.icon} />
            </View>
          </View>

          <View style={[styles.sec2Container, {width: '41.5%'}]}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.sec2Title}>
              {title}
            </Text>
          </View>

          <View
            style={{
              width: '41.5%',
              alignItems: 'flex-end',
            }}>
            <ToggleSwitch
              isOn={isNotification}
              onColor={theme.color.button2}
              offColor={theme.color.button2}
              label={isNotification ? 'Enabled' : 'Disabled'}
              labelStyle={{
                color: '#50555C',
                fontFamily: theme.fonts.fontNormal,
                fontSize: 12.5,
                opacity: 0.5,
              }}
              size="small"
              onToggle={isOn => onclickNot(isOn)}
            />
          </View>
        </TouchableOpacity>
      );
    };

    const renderBlockUser = () => {
      let title = 'Blocked Users';
      return (
        <TouchableOpacity
          activeOpacity={activeOpacity}
          onPress={() => {
            onClick(title);
          }}
          style={styles.mainContainer}>
          <View style={styles.sec1Container}>
            <View style={styles.iconConatiner2}>
              <Image source={blockUserIcon} style={styles.icon2} />
            </View>
          </View>

          <View style={styles.sec2Container}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.sec2Title}>
              {title}
            </Text>
          </View>
        </TouchableOpacity>
      );
    };

    const renderManageSubscription = () => {
      let title = 'Manage Subscription';
      return (
        <TouchableOpacity
          activeOpacity={activeOpacity}
          onPress={() => {
            onClick(title);
          }}
          style={styles.mainContainer}>
          <View style={styles.sec1Container}>
            <View style={styles.iconConatiner}>
              <Image source={subIcon} style={styles.icon} />
            </View>
          </View>

          <View style={styles.sec2Container}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.sec2Title}>
              {title}
            </Text>
          </View>
        </TouchableOpacity>
      );
    };

    const renderPrivacy = () => {
      let title = 'privacy';
      return (
        <TouchableOpacity
          activeOpacity={activeOpacity}
          onPress={() => {
            onClick(title);
          }}
          style={styles.mainContainer}>
          <View style={styles.sec1Container}>
            <View style={styles.iconConatiner}>
              <Image source={privacyIcon} style={styles.icon} />
            </View>
          </View>

          <View style={styles.sec2Container}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.sec2Title}>
              {title}
            </Text>
          </View>
        </TouchableOpacity>
      );
    };

    const renderDeleteAccount = () => {
      const title = 'Delete Account';
      return (
        <TouchableOpacity
          activeOpacity={activeOpacity}
          onPress={() => {
            onClick(title);
          }}
          style={styles.mainContainer}>
          <View style={styles.sec1Container}>
            <View style={styles.iconConatiner}>
              <utils.vectorIcon.AntDesign
                name="deleteuser"
                color={theme.color.button1}
                size={25}
              />
            </View>
          </View>

          <View style={styles.sec2Container}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.sec2Title}>
              {title}
            </Text>
          </View>
        </TouchableOpacity>
      );
    };

    const renderLogout = () => {
      let title = 'logout';
      return (
        <TouchableOpacity
          activeOpacity={activeOpacity}
          onPress={() => {
            onClick(title);
          }}
          style={styles.mainContainer}>
          <View style={styles.sec1Container}>
            <View style={styles.iconConatiner}>
              <Image source={logoutIcon} style={styles.icon} />
            </View>
          </View>

          <View style={styles.sec2Container}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.sec2Title}>
              {title}
            </Text>
          </View>
        </TouchableOpacity>
      );
    };

    return (
      <>
        <View>
          {user && user !== 'guest' && (
            <>
              {renderEditProfile()}
              {renderCp()}
              {renderNotifications()}
              {renderBlockUser()}
              {renderManageSubscription()}
              {renderPrivacy()}
              {renderDeleteAccount()}
              {renderLogout()}
            </>
          )}

          {user && user == 'guest' && <>{renderPrivacy()}</>}
        </View>
      </>
    );
  };

  const renderBottom = () => {
    const renderButton = () => {
      return (
        <>
          <TouchableOpacity
            onPress={JoinNow}
            activeOpacity={0.7}
            style={styles.BottomButton}>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.buttonTextBottom}>Join now</Text>
              <utils.vectorIcon.AntDesign
                size={22}
                name="arrowright"
                style={styles.arrow}
                color={theme.color.buttonText}
              />
            </View>
          </TouchableOpacity>
        </>
      );
    };

    return (
      <View style={styles.bottomContainer}>
        <Text style={styles.bottomTitle1}>
          Get full access and start trading today!
        </Text>
        {renderButton()}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <utils.DrawerHeader props={props} headerTitle={headerTitle} />
      {!isInternet && <utils.InternetMessage />}
      <SafeAreaView style={styles.container2}>
        <View style={styles.container3}>
          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: 15,
              paddingTop: 15,
            }}>
            {renderMain()}
          </ScrollView>
        </View>
        {user && user == 'guest' && renderBottom()}
        <utils.Footer
          nav={props.navigation}
          screen={headerTitle}
          focusScreen={store.General.focusScreen}
        />
      </SafeAreaView>
      {isShowPrivacy && (
        <utils.WebViewModal
          link={store.General.Privacy_and_Policy_Link}
          isVisible={isShowPrivacy}
          setisVisible={setIsShowPrivacy}
        />
      )}

      {isDeletAccountModal && (
        <utils.deleteAccountModal
          isModal={isDeletAccountModal}
          setIsModal={setIsDeletAccountModal}
        />
      )}
      <Toast ref={toast} position="bottom" />
      {!isEmailPopup && <utils.Loader load={logoutLoader} />}
    </View>
  );
}
