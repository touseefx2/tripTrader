import React from 'react';
import {View, Modal, Image} from 'react-native';

export default function Loader2(props) {
  return (
    <Modal animationType="fade" transparent={true} visible={props.load}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(129, 129, 150, 0.7)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 15,
        }}>
        <Image
          source={require('../assets/gif/lottie.gif')}
          style={{width: 300, height: 300, resizeMode: 'contain'}}
        />
      </View>
    </Modal>
  );
}
