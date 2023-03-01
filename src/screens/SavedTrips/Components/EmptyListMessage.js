import React from 'react';
import {Text} from 'react-native';
import {styles} from '../styles';

export default function EmptyListMessage() {
  return (
    <>
      <Text style={styles.emptyMessage}>No any saved trip found</Text>
    </>
  );
}
