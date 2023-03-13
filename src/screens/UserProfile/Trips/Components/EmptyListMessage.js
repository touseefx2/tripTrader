import React from 'react';
import {Text} from 'react-native';
import {styles} from '../../../SavedTrips/styles';

export default function EmptyListMessage() {
  return (
    <>
      <Text
        style={{
          marginTop: '50%',
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'center',
          fontSize: 13,
          color: theme.color.title,
          fontFamily: theme.fonts.fontMedium,
          opacity: 0.4,
        }}>
        No any saved trip found
      </Text>
    </>
  );
}
