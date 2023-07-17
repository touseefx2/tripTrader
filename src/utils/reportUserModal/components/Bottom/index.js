import React from 'react';
import {View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import {styles} from './styles';
import theme from '../../../../theme';

export default function Bottom({
  isMaxHeight,
  loader,
  closeModal,
  sendReoprt,
  message,
}) {
  const renderButton1 = () => {
    const disable = message == '' ? true : false;
    return (
      <>
        <TouchableOpacity
          disabled={loader || disable}
          onPress={sendReoprt}
          activeOpacity={0.7}
          style={[styles.ButtonContainer, {opacity: disable ? 0.5 : 1}]}>
          {!loader ? (
            <Text style={styles.ButtonText}>Report User</Text>
          ) : (
            <ActivityIndicator size={22} color={theme.color.buttonText} />
          )}
        </TouchableOpacity>
      </>
    );
  };

  const renderButton2 = () => {
    return (
      <>
        <TouchableOpacity
          disabled={loader}
          onPress={closeModal}
          activeOpacity={0.7}
          style={[
            styles.ButtonContainer,
            {
              backgroundColor: theme.color.button2,
              marginTop: 12,
            },
          ]}>
          <Text
            style={[
              styles.ButtonText,
              {
                color: theme.color.button2Text,
                textTransform: 'none',
              },
            ]}>
            Cancel
          </Text>
        </TouchableOpacity>
      </>
    );
  };

  return (
    <View
      style={{
        marginTop: isMaxHeight ? 15 : 40,
        marginBottom: isMaxHeight ? 15 : 0,
        paddingHorizontal: isMaxHeight ? 15 : 0,
      }}>
      {renderButton1()}
      {renderButton2()}
    </View>
  );
}
