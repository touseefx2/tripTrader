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
import moment from 'moment/moment';
import {ActivityIndicator} from 'react-native-paper';

export default observer(ManageSubscription);

function toFixed(num, fix) {
  var re = new RegExp('^-?\\d+(?:.\\d{0,' + (fix || -1) + '})?');
  return num.toString().match(re)[0];
}

function ManageSubscription(props) {
  const toast = useRef(null);
  const toastduration = 700;
  let headerTitle = 'Manage Subscription';

  let internet = store.General.isInternet;
  let user = store.User.user;

  let sub = '';
  let isSub = '';
  let isSubObj = false;
  let endDate = '';

  let card = {
    number: 4040,
    type: 'visa',
  };

  let ci = store.User.userCardInfo;
  let loadCard = store.User.ucRef;

  useEffect(() => {
    if (user.customerId && user.customerId != '') {
      store.User.getCardInfo(user.customerId, '', store.User.authToken);
    }
  }, []);

  if (ci.length > 0) {
    let d = ci[0].card;
    // console.log('card info : ', d);
    if (d) {
      card.number = d.last4;
      card.type = d.brand;
    }
  }

  if (user != 'guest' && user) {
    sub = user.subscriptionStatus || '';
    isSubObj = user.subscription || false;
    isSub = isSubObj.status;
    endDate = isSubObj.endDate ? isSubObj.endDate : '';
  }

  let crd = card.type + ' .........' + card.number;

  const loader = store.User.regLoader;

  const Cancelsubscription = () => {
    let body = {
      'subscription.status': 'canceled',
    };

    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        store.User.attemptToCancelSub(body, store.User.user._id);
      } else {
        // seterrorMessage('Please connect internet');
        Alert.alert('', 'Please connect internet');
      }
    });
  };

  const renderMain = () => {
    const renderButton = () => {
      return (
        <>
          <TouchableOpacity
            onPress={() => props.navigation.navigate('Plan')}
            activeOpacity={0.7}
            style={styles.BottomButton}>
            <Text style={styles.buttonTextBottom}>Choose Plan</Text>
          </TouchableOpacity>
        </>
      );
    };

    return (
      <View style={styles.section2}>
        <View style={styles.Field1}>
          <Text style={styles.FieldTitle1}>
            You are currently on a{' '}
            <Text
              style={[styles.FieldTitle1, {fontFamily: theme.fonts.fontBold}]}>
              Free plan
            </Text>
            . Subscribe today to unlock full access to all Trip Trader features!
          </Text>
        </View>

        {renderButton()}
      </View>
    );
  };

  const renderMain2 = () => {
    const renderButton = () => {
      return (
        <>
          <TouchableOpacity
            onPress={() => props.navigation.navigate('Plan')}
            activeOpacity={0.7}
            style={styles.BottomButton}>
            <Text style={styles.buttonTextBottom}>Change plan</Text>
          </TouchableOpacity>
        </>
      );
    };

    const renderButton2 = () => {
      return (
        <>
          <TouchableOpacity
            onPress={Cancelsubscription}
            activeOpacity={0.7}
            style={[
              styles.BottomButton,
              {backgroundColor: theme.color.button2, marginTop: 12},
            ]}>
            <Text style={[styles.buttonTextBottom, {color: '#B93B3B'}]}>
              Cancel subscription
            </Text>
          </TouchableOpacity>
        </>
      );
    };

    const status = isSub;
    const pt = isSubObj.title ? isSubObj.title : 'annual';
    const pt2 = pt.charAt(0).toUpperCase() + pt.slice(1);

    let planType = '';

    if (pt == 'annual') {
      let amnt = toFixed(isSubObj.charges ? isSubObj.charges : 0, 2);
      planType = pt2 + ` ($${amnt}/mo)`;
    }
    if (pt == 'monthly') {
      let amnt = toFixed(isSubObj.charges ? isSubObj.charges : 0, 2);
      planType = pt2 + ` ($${amnt})`;
    }

    return (
      <View style={styles.section2}>
        <View style={styles.Fieldp}>
          <Text style={styles.FieldpTitle}>Current Plan:</Text>
          <View style={{width: '80%', marginLeft: 5}}>
            <Text
              style={[
                styles.FieldpTitle,
                {fontFamily: theme.fonts.fontBold, color: theme.color.title},
              ]}>
              {planType}
            </Text>
          </View>
        </View>
        <View style={[styles.Fieldp, {marginTop: 5}]}>
          <Text style={styles.FieldpTitle}>Card:</Text>
          <View
            style={{
              width: '80%',
              marginLeft: !loadCard ? 10 : 30,
              alignItems: 'flex-start',
            }}>
            {loadCard && (
              <ActivityIndicator size={20} color={theme.color.button1} />
            )}
            {!loadCard && (
              <Text
                style={[
                  styles.FieldpTitle,
                  {
                    fontFamily: theme.fonts.fontBold,
                    color: theme.color.title,
                    textTransform: 'capitalize',
                  },
                ]}>
                {crd}
              </Text>
            )}
          </View>
        </View>

        {renderButton()}
        {renderButton2()}
      </View>
    );
  };

  const renderMain3 = () => {
    const renderButton = () => {
      return (
        <>
          <TouchableOpacity
            onPress={() => props.navigation.navigate('Plan')}
            activeOpacity={0.7}
            style={styles.BottomButton}>
            <Text style={styles.buttonTextBottom}>Renew Subscription</Text>
          </TouchableOpacity>
        </>
      );
    };

    const status = isSub;
    const pt = isSubObj.title ? isSubObj.title : 'annual';

    let planType = pt + ' (' + status + ')';

    let txt =
      status == 'canceled'
        ? `Your subscription plan has been ${status} and will not be renewed at the end of your billing cycle. You will continue to have full access until your plan ends on`
        : `Your subscription plan has been ${status} at`;

    return (
      <View style={styles.section2}>
        <View style={styles.Field1}>
          <Text style={styles.FieldTitle1}>
            {txt}{' '}
            <Text
              style={[styles.FieldTitle1, {fontFamily: theme.fonts.fontBold}]}>
              {moment(endDate).format('MMMM DD, YYYY')}.
            </Text>
          </Text>
        </View>

        <View style={styles.Fieldp}>
          <Text style={styles.FieldpTitle}>Current plan:</Text>
          <View style={{width: '80%', marginLeft: 5}}>
            <Text
              style={[
                styles.FieldpTitle,
                {
                  fontFamily: theme.fonts.fontBold,
                  color: theme.color.title,
                  textTransform: 'capitalize',
                },
              ]}>
              {planType}
            </Text>
          </View>
        </View>
        <View style={[styles.Fieldp, {marginTop: 5}]}>
          <Text style={styles.FieldpTitle}>Card:</Text>
          <View
            style={{
              width: '80%',
              marginLeft: !loadCard ? 10 : 30,
              alignItems: 'flex-start',
            }}>
            {loadCard && (
              <ActivityIndicator size={20} color={theme.color.button1} />
            )}
            {!loadCard && (
              <Text
                style={[
                  styles.FieldpTitle,
                  {
                    fontFamily: theme.fonts.fontBold,

                    textTransform: 'capitalize',
                  },
                ]}>
                {crd}
              </Text>
            )}
          </View>
        </View>

        {renderButton()}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* {tagLine != '' && <utils.TagLine tagLine={tagLine} />} */}
      <utils.StackHeader bell={true} props={props} headerTitle={headerTitle} />
      {!internet && <utils.InternetMessage />}
      <SafeAreaView style={styles.container2}>
        <View style={styles.container3}>
          <KeyboardAvoidingView style={{flex: 1}} enabled>
            <ScrollView
              contentContainerStyle={{
                paddingHorizontal: 15,
                paddingVertical: 15,
              }}>
              {sub == 'freemium' && renderMain()}
              {sub == 'paid' && isSub == 'active' && renderMain2()}
              {sub == 'paid' && isSub !== 'active' && renderMain3()}
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
