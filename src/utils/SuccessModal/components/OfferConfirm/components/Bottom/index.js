import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {styles} from './styles';
import theme from '../../../../../../theme';

export default function Bottom({isMaxHeight, closeModal, goToConfirmTrips}) {
  const renderButton1 = () => {
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

  const renderButton2 = () => {
    return (
      <>
        <TouchableOpacity
          onPress={goToConfirmTrips}
          activeOpacity={0.7}
          style={[
            styles.ButtonContainer,
            {
              backgroundColor: theme.color.button2,

              marginTop: 12,
            },
          ]}>
          <Text
            style={[
              styles.ButtonText,
              {
                color: theme.color.button2Text,
                textTransform: 'none',
              },
            ]}>
            Go to Confirmed Trips
          </Text>
        </TouchableOpacity>
      </>
    );
  };

  return (
    <View style={[styles.bottom, {marginTop: isMaxHeight ? 15 : 40}]}>
      {renderButton1()}
      {renderButton2()}
    </View>
  );
}
