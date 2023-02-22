import React from 'react';
import {View, Text, Pressable} from 'react-native';
import {styles} from './styles';
import theme from '../../../../../../theme';

export default function Bottom({isMaxHeight, step, selectedDates, goNext}) {
  const renderSteps = () => {
    return (
      <View>
        <Text
          style={[
            styles.ButtonText,
            {
              color: theme.color.title,
              opacity: 0.5,
              fontFamily: theme.fonts.fontNormal,
              textTransform: 'none',
            },
          ]}>
          Step {step} of 4
        </Text>
      </View>
    );
  };

  const renderContinue = () => {
    return (
      <Pressable
        disabled={!selectedDates}
        onPress={goNext}
        style={({pressed}) => [
          {opacity: pressed ? 0.8 : !selectedDates ? 0.5 : 1.0},
          styles.ButtonContainer,
          {backgroundColor: theme.color.button1},
        ]}>
        <Text style={[styles.ButtonText, {color: theme.color.buttonText}]}>
          Continue
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
        {renderSteps()}
        {renderContinue()}
      </View>
    </View>
  );
}
