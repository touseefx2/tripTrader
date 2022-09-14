import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import theme from '../theme/index';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import utils from '.';
import ProgressiveFastImage from '@freakycoder/react-native-progressive-fast-image';
import store from '../store/index';
import {inject, observer} from 'mobx-react';
import Modal from 'react-native-modal';

export default observer(StatusIndicatorR);
function StatusIndicatorR(props) {
  const data = props.data;
  let status = props.status.toLowerCase();

  if (status == 'pending') {
    status = 'order accepted';
  }

  if (status == 'confirmed') {
    status = 'preparing food';
  }

  if (status == 'foodready') {
    status = 'ready to pick up';
  }

  if (status == 'delivered') {
    status = 'picked up';
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  let index = data.indexOf(status);
  console.log('index : ', index);

  return (
    <View
      style={{
        width: '100%',
        marginTop: 10,
      }}>
      {data.map((e, i, a) => {
        const st = e.toLowerCase();

        let bcColor = i < index + 1 ? theme.color.button1 : '#D9D9D9';
        let textColor =
          i < index + 1 ? theme.color.buttonText : theme.color.title;
        let bcLineColor = i < index + 1 ? theme.color.button1 : '#D9D9D9';

        let tc =
          i < index + 1 ? theme.color.button1 : theme.color.subTitleLight;
        return (
          <>
            {i > 0 && (
              <View
                style={{
                  width: 4,
                  height: 40,
                  backgroundColor: bcLineColor,
                  left: 10,
                }}
              />
            )}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 24 / 2,
                  backgroundColor: bcColor,
                  elevation: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: theme.fonts.fontBold,
                    color: textColor,
                  }}>
                  {i + 1}
                </Text>
              </View>

              <View style={{width: '90%'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{
                    fontSize: 13,
                    fontFamily: theme.fonts.fontBold,
                    color: tc,
                    lineHeight: 16,
                  }}>
                  {capitalizeFirstLetter(st)}
                </Text>
              </View>
            </View>
          </>
        );
      })}
    </View>
  );
}
