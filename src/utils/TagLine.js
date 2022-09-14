import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
} from 'react-native';
import theme from '../theme/index';
import utils from '../utils/index';
// import * as Animatable from 'react-native-animatable';

export default function TagLine(props) {
  const [isTaglineShow, setisTaglineShow] = useState(false);

  return (
    <>
      <utils.TagLineModal
        isTaglineShow={isTaglineShow}
        setisTaglineShow={c => setisTaglineShow(c)}
        title={props.tagLine}
      />
      <TouchableOpacity
        onPress={() => {
          setisTaglineShow(true);
        }}
        activeOpacity={0.9}
        style={{
          paddingVertical: 5,
          paddingHorizontal: 15,
          backgroundColor: theme.color.button1,
        }}>
        {/* <Animatable.Text
          // animation="pulse"
          // easing="ease-out"
          // iterationCount="infinite"
          style={{
            color: theme.color.buttonText,
            fontSize: 12,
            fontFamily: theme.fonts.fontBold,
            lineHeight: 17,
          }}
          animation="slideInDown"
          iterationCount={5}
          direction="alternate">
          {props.tagLine || ''}
        </Animatable.Text> */}
        <Text
          numberOfLines={2}
          ellipsizeMode="tail"
          style={{
            color: theme.color.buttonText,
            fontSize: 12,
            fontFamily: theme.fonts.fontMedium,
            lineHeight: 17,
          }}>
          {props.tagLine}
        </Text>
      </TouchableOpacity>
    </>
  );
}
