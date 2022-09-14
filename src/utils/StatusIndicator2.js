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

export default observer(StatusIndicator2);
function StatusIndicator2(props) {
  const data = props.data;
  const status = props.status.toLowerCase();

  let index = data.indexOf(status);
  console.log('index : ', index);

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        alignSelf: 'center',
        marginTop: 10,
      }}>
      {data.map((e, i, a) => {
        const st = e.toLowerCase();

        let bcColor = i <= index ? theme.color.button1 : '#D9D9D9';
        let textColor =
          i <= index ? theme.color.buttonText : theme.color.subTitle;
        let bcLineColor = i <= index ? theme.color.button1 : '#D9D9D9';
        let tc = i <= index + 1 ? theme.color.title : theme.color.subTitle;
        return (
          <View
            style={{
              width: '33.5%',
              // backgroundColor: 'yellow',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                width: '43%',
                height: 4,
                backgroundColor:
                  i == index + 1 ? theme.color.button1 : bcLineColor,

                position: 'absolute',
                right: '56%',
                bottom: '70%',
              }}
            />

            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 20 / 2,
                backgroundColor: i == index + 1 ? theme.color.button1 : bcColor,
                elevation: 1,
                marginBottom: 5,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: theme.fonts.fontNormal,
                  color: i == index + 1 ? theme.color.buttonText : textColor,
                  top: 1,
                }}>
                {i + 1}
              </Text>
            </View>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                fontSize: 10,
                fontFamily: theme.fonts.fontMedium,
                color: tc,
                textTransform: 'capitalize',
                lineHeight: 12,
              }}>
              {st}
            </Text>

            <View
              style={{
                width: '43%',
                height: 4,
                backgroundColor: bcLineColor,

                position: 'absolute',
                left: '58%',
                bottom: '70%',
              }}
            />
          </View>
        );
      })}
    </View>
  );
}
