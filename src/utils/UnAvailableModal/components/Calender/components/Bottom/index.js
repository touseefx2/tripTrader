import React from 'react';
import {View, Text, Pressable} from 'react-native';
import {styles} from './styles';
import theme from '../../../../../../theme';

export default function Bottom({onClickApply, closeModal}) {
  return (
    <View style={styles.bottomContainer}>
      <View style={styles.bottomWrapper}>
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
          style={({pressed}) => [
            styles.button,
            {
              opacity: pressed ? 0.9 : 1.0,
              backgroundColor: theme.color.button1,
            },
          ]}>
          <Text style={styles.buttonText}>Apply</Text>
        </Pressable>
      </View>
    </View>
  );
}
