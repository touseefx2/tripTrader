import React from 'react';
import {View, Text, Pressable} from 'react-native';
import {styles} from './styles';
import theme from '../../../../../../../../theme';

export default function Bottom({
  totalDays,
  durationTitle,
  markedDates,
  onClickApply,
  closeModal,
}) {
  let isEnabled = false;
  if (markedDates && Object.keys(markedDates).length == totalDays)
    isEnabled = true;

  return (
    <View style={styles.bottomContainer}>
      <View style={styles.bottomWrapper1}>
        <Text style={styles.bottomWrapper1Text}>
          Duration : {durationTitle}
        </Text>
      </View>

      <View style={styles.bottomWrapper2}>
        <Pressable
          onPress={closeModal}
          style={({pressed}) => [
            styles.button,
            {
              opacity: pressed ? 0.9 : 1.0,
              borderWidth: 1,
              borderColor: theme.color.fieldBorder,
            },
          ]}>
          <Text style={[styles.buttonText, {color: theme.color.button2Text}]}>
            Cancel
          </Text>
        </Pressable>

        <Pressable
          onPress={onClickApply}
          disabled={!isEnabled ? true : false}
          style={({pressed}) => [
            styles.button,
            {
              opacity: pressed ? 0.9 : !isEnabled ? 0.5 : 1.0,
              backgroundColor: theme.color.button1,
            },
          ]}>
          <Text style={styles.buttonText}>Apply</Text>
        </Pressable>
      </View>
    </View>
  );
}
