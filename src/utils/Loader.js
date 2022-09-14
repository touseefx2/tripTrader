import React from 'react';
import {View, Modal, ActivityIndicator, Text, StatusBar} from 'react-native';
import {responsiveHeight} from 'react-native-responsive-dimensions';
import theme from '../theme/index';
import {spinner} from 'react-native-paper';

export default function Loader(props) {
  return (
    <Modal animationType="fade" transparent={true} visible={props.load}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator size={50} color={'white'} />
      </View>
    </Modal>
  );
}
