import React, {memo} from 'react';
import {View, Text, Image} from 'react-native';
import {styles} from './styles';
import utils from '../../../utils/index';
import theme from '../../../theme';

export default memo(MainInfo);

function MainInfo({item, isActive}) {
  let usr = item.hostId;

  if (usr) {
    let titlee = item.title || '';
    let locName = item.location.city + ', ' + item.location.state;
    let trade = item.returnActivity || '';

    const renderSec3c = () => {
      return (
        <View
          style={{
            width: '100%',
            marginTop: 12,
          }}>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 10,
            }}>
            <View style={{width: '90%'}}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.sec3T1}>
                {titlee}
              </Text>
              <View style={styles.sec3T2Container}>
                <Image
                  style={{
                    width: 20,
                    height: 20,
                    resizeMode: 'contain',
                  }}
                  source={require('../../../assets/images/location/img.png')}
                />
                <View style={{width: '95%'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={styles.sec3T2}>
                    {locName}
                  </Text>
                </View>
              </View>
            </View>

            <utils.vectorIcon.Entypo
              name="chevron-small-down"
              color={theme.color.subTitleLight}
              size={22}
            />
          </View>

          <View style={{marginTop: 10, paddingHorizontal: 10}}>
            <Text style={styles.sec3T31}>In Return For</Text>
            <Text style={styles.sec3T32}>{trade}</Text>
          </View>
        </View>
      );
    };

    return <View>{!isActive && renderSec3c()}</View>;
  } else {
    return null;
  }
}
