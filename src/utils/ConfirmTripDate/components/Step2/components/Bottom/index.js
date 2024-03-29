import React from 'react';
import {View, Text, Pressable, ActivityIndicator} from 'react-native';
import {styles} from './styles';
import theme from '../../../../../../theme';

export default function Bottom({
  isMaxHeight,
  step,
  closeModal,
  confirmAndAccept,
  loader,
}) {
  const renderBack = () => {
    return (
      <Pressable
        disabled={loader}
        onPress={closeModal}
        style={({pressed}) => [
          styles.ButtonContainer,
          {
            opacity: pressed ? 0.8 : 1.0,
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

  const renderConfirm = () => {
    return (
      <Pressable
        disabled={loader}
        onPress={confirmAndAccept}
        style={({pressed}) => [
          {opacity: pressed ? 0.8 : 1.0},
          styles.ButtonContainer,
          {backgroundColor: theme.color.button1},
        ]}>
        {!loader ? (
          <Text
            style={[
              styles.ButtonText,
              {color: theme.color.buttonText, textTransform: 'none'},
            ]}>
            Confirm and Accept
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
          width: '30%',
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
          Step {step} of 2
        </Text>
      </View>

      <View
        style={{
          width: '65%',
          alignItems: 'flex-end',
        }}>
        <View
          style={
            isMaxHeight
              ? styles.modalBottomContainer
              : styles.modalBottomContainer2
          }>
          {renderBack()}
          {renderConfirm()}
        </View>
      </View>
    </View>
  );
}
