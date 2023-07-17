import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {styles} from './styles';

export default function Bottom({isMaxHeight, closeModal}) {
  const renderDone = () => {
    return (
      <>
        <TouchableOpacity
          onPress={closeModal}
          activeOpacity={0.7}
          style={styles.ButtonContainer}>
          <Text style={styles.ButtonText}>Done</Text>
        </TouchableOpacity>
      </>
    );
  };

  return (
    <View style={[styles.bottom, {marginTop: isMaxHeight ? 15 : 40}]}>
      {renderDone()}
    </View>
  );
}
