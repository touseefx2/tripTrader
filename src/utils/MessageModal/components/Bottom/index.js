import React from 'react';
import {View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import {styles} from './styles';
import theme from '../../../../theme';

export default function Bottom({isMaxHeight, loader, message, sendMessage}) {
  const renderMessaeg = () => {
    return (
      <>
        <TouchableOpacity
          disabled={loader || message == ''}
          onPress={sendMessage}
          activeOpacity={0.8}
          style={[styles.ButtonContainer, {opacity: message == '' ? 0.5 : 1}]}>
          {!loader ? (
            <Text style={styles.ButtonText}>Send Message</Text>
          ) : (
            <ActivityIndicator size={22} color={theme.color.buttonText} />
          )}
        </TouchableOpacity>
      </>
    );
  };

  return (
    <View
      style={{
        marginTop: isMaxHeight ? 12 : 24,
        marginBottom: isMaxHeight ? 15 : 0,
        paddingHorizontal: isMaxHeight ? 15 : 0,
      }}>
      {renderMessaeg()}
    </View>
  );
}
