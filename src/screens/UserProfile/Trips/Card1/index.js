import React, {memo} from 'react';
import {View, Text} from 'react-native';
import {styles} from './styles';
import theme from '../../../../theme';
import moment from 'moment';
import utils from '../../../../utils';

export default memo(Card1);

function Card1({item, index, isActive, props}) {
  let title = item.tradeType || '';
  let offer = item.title || '';
  let trade = item.returnActivity || '';

  let status = item.status || '';
  let c = status == 'suspended' ? true : false;
  let tc = theme.color.boxTitle;
  let sd = utils.functions.DateWithoutFormat(item.availableFrom);
  let sdy = parseInt(new Date(sd).getFullYear());
  let ed = utils.functions.DateWithoutFormat(item.availableTo);
  let edy = parseInt(new Date(ed).getFullYear());
  let availability = '';
  if (sdy == edy) {
    availability =
      moment(sd).format('MMM DD') + ' - ' + moment(ed).format('MMM DD, YYYY');
  } else {
    availability =
      moment(sd).format('MMM DD, YYYY') +
      ' - ' +
      moment(ed).format('MMM DD, YYYY');
  }

  return (
    <>
      <View style={{paddingHorizontal: 12}}>
        {!isActive && (
          <>
            <View style={styles.field}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.filedTitle}>
                Offering
              </Text>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[
                  styles.filedTitle2,
                  {color: !c ? tc : theme.color.subTitleLight},
                ]}>
                {offer}
              </Text>
            </View>

            <View style={styles.field}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.filedTitle}>
                for trade
              </Text>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[
                  styles.filedTitle2,
                  {color: !c ? tc : theme.color.subTitleLight},
                ]}>
                {trade}
              </Text>
            </View>

            <View style={styles.fieldContainer}>
              <View style={{width: '60%'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles.filedTitle}>
                  TRIP AVAILABILITY
                </Text>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={[
                    styles.filedTitle2,
                    {color: !c ? tc : theme.color.subTitleLight},
                  ]}>
                  {availability}
                </Text>
              </View>
              <View
                // style={({pressed}) => [
                //   {opacity: pressed ? 0.8 : 1.0},
                //   styles.buttonContainer,
                // ]}
                style={[styles.buttonContainer]}
                // onPress={() => {}}
              >
                <Text style={styles.buttonText}>View Trip</Text>
              </View>
            </View>
          </>
        )}
      </View>
    </>
  );
}
