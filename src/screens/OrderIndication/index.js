import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  TextInput,
  Image,
  StatusBar,
  PermissionsAndroid,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  BackHandler,
  Linking,
  Platform,
} from 'react-native';
import {observer} from 'mobx-react';
import styles from './styles';
import LinearGradient from 'react-native-linear-gradient';
import theme from '../../theme';
import store from '../../store';

export default observer(OrderIndicationt);

function OrderIndicationt(props) {
  let data = props.route.params.data.data;
  let orderId = data.orderId;
  let user = store.User.user;

  let msg = !user
    ? `Your order has been placed.\nYour order number is ${orderId}.\nOur team will contact you shortly to confirm your order.\nPlease stay connected.`
    : `Your order has been placed successfully.\nYour order number is ${orderId}.\nYou can view your order status in order history.\nOur rider will contact you shortly once the order is picked up.`;

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackButtonClick,
    );

    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );
      subscription.remove();
    };
  }, []);

  function handleBackButtonClick() {
    if (!props.navigation.isFocused()) {
      return false;
    }

    props.navigation.navigate('Home');
    return true;
  }

  return (
    <SafeAreaView style={styles.Container}>
      {/* <LinearGradient
        colors={[theme.color.button1, theme.color.button2]}
        style={styles.LinearGradient}> */}

      <View style={styles.LinearGradient}>
        <View style={styles.Body}>
          <Image
            source={require('../../assets/images/logo/img.png')}
            style={styles.logo}
          />

          <View style={{width: '100%'}}>
            <Text style={styles.title}>Thankyou!</Text>
          </View>

          <View style={{width: 300, marginTop: 10}}>
            <Text style={styles.Description}>{msg}</Text>
          </View>

          <TouchableOpacity
            style={styles.ContinueButton}
            onPress={() => {
              props.navigation.navigate('Home');
            }}>
            <Text style={styles.ContinueButtonText}>CONTINUE</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* </LinearGradient> */}
    </SafeAreaView>
  );
}
