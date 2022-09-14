import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Linking,
  ScrollView,
  TextInput as Ti,
  PermissionsAndroid,
  Dimensions,
  Alert,
  Keyboard,
  StatusBar,
  BackHandler,
  Modal,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import db from '../../database/index';
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
import {TextInput} from 'react-native-paper';
import Geolocation from 'react-native-geolocation-service';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import Geocoder from 'react-native-geocoding';
import ProgressiveFastImage from '@freakycoder/react-native-progressive-fast-image';
import RBSheet from 'react-native-raw-bottom-sheet';

export default observer(CheckoutEmpty);
function CheckoutEmpty(props) {
  const goBack = () => {
    props.navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.6} onPress={goBack}>
          <utils.vectorIcon.AntDesign
            name="close"
            color={theme.color.button1}
            size={20}
          />
        </TouchableOpacity>

        <Text style={styles.htitle}>Cart</Text>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollCon}>
        <Image
          source={require('../../assets/images/emptyCart/img.png')}
          style={styles.emptyImg}
        />
        <Text style={styles.t1}>Hungry?</Text>
        <Text style={styles.t2}>You haven't added anything to your cart</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={goBack}
          style={styles.BottomButton}>
          <Text style={styles.buttonTextBottom}>Browse</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
