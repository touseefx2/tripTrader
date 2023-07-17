import React from 'react';
import {View, Text, Pressable, ActivityIndicator} from 'react-native';
import {styles} from './styles';
import theme from '../../../../../../theme';

export default function Bottom({isMaxHeight, step, goBack, goNext, loader}) {
  const renderBack = () => {
    return (
      <Pressable
        disabled={loader}
        onPress={goBack}
        style={({pressed}) => [
          styles.ButtonContainer,
          {
            opacity: pressed ? 0.9 : 1.0,
            borderWidth: 1,
            borderColor: theme.color.fieldBorder,
          },
        ]}>
        <Text style={[styles.ButtonText, {color: theme.color.button2Text}]}>
          Edit My Offer
        </Text>
      </Pressable>
    );
  };

  const renderConfrim = () => {
    return (
      <Pressable
        disabled={loader}
        onPress={goNext}
        style={({pressed}) => [
          {opacity: pressed ? 0.8 : 1.0},
          styles.ButtonContainer,
          {backgroundColor: theme.color.button1, marginLeft: 10},
        ]}>
        {!loader ? (
          <Text style={[styles.ButtonText, {color: theme.color.buttonText}]}>
            Confirm and Send
          </Text>
        ) : (
          <ActivityIndicator size={18} color={theme.color.buttonText} />
        )}
      </Pressable>
    );
  };

  return (
    <View style={isMaxHeight ? styles.bottomMax : styles.bottom}>
      <View
        style={{
          width: '25%',
          paddingLeft: isMaxHeight ? 15 : 0,
        }}>
        <Text
          style={[
            styles.ButtonText,
            {
              fontSize: 11,
              fontFamily: theme.fonts.fontNormal,
              color: theme.color.subTitleLight,
            },
          ]}>
          Step {step} of 4
        </Text>
      </View>

      <View
        style={{
          width: '70%',
          alignItems: 'flex-end',
        }}>
        <View
          style={
            isMaxHeight
              ? styles.modalBottomContainer
              : styles.modalBottomContainer2
          }>
          {renderBack()}
          {renderConfrim()}
        </View>
      </View>
    </View>
  );
}
