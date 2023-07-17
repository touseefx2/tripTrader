import React, {memo} from 'react';
import {View, Text} from 'react-native';

import {styles} from './styles';

import theme from '../../../../theme';

export default memo(Card2);

function Card2({item, index, props}) {
  let title = item.tradeType || '';
  let offer = item.title || '';
  let trade = item.returnActivity || '';
  let availability = item.availableFrom || '';
  let status = item.status || '';
  let c = status == 'suspended' ? true : false;
  let tc = theme.color.boxTitle;

  return (
    <>
      <View style={{paddingHorizontal: 12}}>
        <Text
          style={[styles.title1, {color: !c ? tc : theme.color.subTitleLight}]}>
          {title} Trip
          {c && (
            <Text style={styles.title11}>
              {'  '}({status})
            </Text>
          )}
        </Text>
      </View>
    </>
  );
}
