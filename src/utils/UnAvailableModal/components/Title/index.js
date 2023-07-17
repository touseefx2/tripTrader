import React from 'react';
import {Text} from 'react-native';
import {styles} from './styles';

export default function Title() {
  return (
    <Text style={styles.modalsubTitle}>
      Choose the days when this trip is not available. The days you specify here
      will be unavailable to the host.
    </Text>
  );
}
