import React from 'react';
import {View, Text, Pressable} from 'react-native';
import {styles} from './styles';
import theme from '../../../../theme';

export default function Bottom({isMaxHeight, goBack, onClickSave}) {
  const renderBack = () => {
    return (
      <Pressable
        onPress={goBack}
        style={({pressed}) => [
          styles.ButtonContainer,
          {
            opacity: pressed ? 0.9 : 1.0,
            borderWidth: 1,
            borderColor: theme.color.fieldBorder,
            marginRight: 10,
          },
        ]}>
        <Text style={[styles.ButtonText, {color: theme.color.button2Text}]}>
          Back
        </Text>
      </Pressable>
    );
  };

  const renderSave = () => {
    return (
      <Pressable
        onPress={onClickSave}
        style={({pressed}) => [
          {opacity: pressed ? 0.8 : 1.0},
          styles.ButtonContainer,
          {backgroundColor: theme.color.button1},
        ]}>
        <Text style={[styles.ButtonText, {color: theme.color.buttonText}]}>
          Save and Continue
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={isMaxHeight ? styles.bottomMax : styles.bottom}>
      <View
        style={
          isMaxHeight
            ? styles.modalBottomContainer
            : styles.modalBottomContainer2
        }>
        {renderBack()}
        {renderSave()}
      </View>
    </View>
  );
}
