import React from 'react';
import {View, Text, Pressable} from 'react-native';
import {styles} from './styles';
import theme from '../../../../../../../../theme';

export default function Bottom({
  title,
  durNum,
  isDisable,
  onClickApply,
  closeModal,
}) {
  let durationText = durNum < 1 ? title.substring(0, title.length - 1) : title;
  durationText = durNum + ' ' + durationText;

  return (
    <View style={styles.bottomContainer}>
      <View style={styles.bottomWrapper1}>
        <Text style={styles.bottomWrapper1Text}>Duration : {durationText}</Text>
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
          disabled={isDisable}
          style={({pressed}) => [
            styles.button,
            {
              opacity: pressed ? 0.9 : isDisable ? 0.5 : 1.0,
              backgroundColor: theme.color.button1,
            },
          ]}>
          <Text style={styles.buttonText}>Apply</Text>
        </Pressable>
      </View>
    </View>
  );
}
