import React, {useEffect, useState, useRef, memo} from 'react';
import {View, Pressable} from 'react-native';
import {styles} from './styles';
import utils from '../../../utils/index';

export default memo(CardDelete);

function CardDelete({item, index, refreshing, deleteChat}) {
  return (
    <Pressable
      // disabled={refreshing}
      onPress={() => {
        deleteChat(item.roomName, index);
      }}
      style={({pressed}) => [
        {opacity: pressed ? 0.7 : 1.0},
        [[styles.modalinfoConatinerdelete]],
      ]}>
      <View
        style={{
          width: 75,
          height: '100%',
          // backgroundColor: 'red',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <utils.vectorIcon.MaterialIcons
          name="delete-sweep"
          color={'red'}
          size={35}
        />
      </View>
    </Pressable>
  );
}
