import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  TextInput,
  Pressable,
  FlatList,
} from 'react-native';
import {styles} from './styles';
import {observer} from 'mobx-react';
import Modal from 'react-native-modal';
import store from '../../store/index';
import utils from '../index';
import theme from '../../theme';
import FastImage from 'react-native-fast-image';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-easy-toast';
import MaskedView from '@react-native-community/masked-view';
import Svg, {Path} from 'react-native-svg';
import {responsiveHeight} from 'react-native-responsive-dimensions';
import {Utils} from '@react-native-firebase/app';

export default observer(ChatPhotoModal);

function ChatPhotoModal(props) {
  let isModalVisible = props.isVisible;
  const closeModal = () => {
    props.setisVisible(false);
    props.setpmessage('');
  };

  return (
    <>
      <Modal
        isVisible={isModalVisible}
        backdropOpacity={1}
        backdropColor="white"
        animationIn="fadeIn"
        animationOut="fadeOut"
        coverScreen={false}
        deviceHeight={Dimensions.get('screen').height}
        style={{padding: 0, margin: 0}}
        onBackButtonPress={closeModal}>
        <View style={styles.mainContainer}>
          <View
            style={{
              borderRadius: 12,
              width: '70%',
              height: 350,
              alignSelf: 'center',
              backgroundColor: theme.color.background,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.22,
              shadowRadius: 2.22,
              elevation: 3,
              padding: 20,
            }}>
            <Text>asas</Text>
          </View>
        </View>
      </Modal>
    </>
  );
}
