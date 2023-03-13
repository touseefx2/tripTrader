import React, {useEffect, useState, useRef} from 'react';
import {View, Text, Image} from 'react-native';
import {observer} from 'mobx-react';
import store from '../../store/index';
import theme from '../../theme';

export default observer(ShowNotifications);

function ShowNotifications(props) {
  const title = store.Notifications.NotifcationTitle || '';

  useEffect(() => {
    console.log('Show Notification Call');
    setTimeout(() => {
      store.Notifications.clearShowNotifications();
    }, 2000);

    return () => {
      store.Notifications.clearShowNotifications();
    };
  }, []);

  return (
    <>
      <View
        style={{
          width: '100%',
          backgroundColor: 'white',

          paddingHorizontal: 15,
          paddingVertical: 10,
          position: 'absolute',
          top: 0,
          borderWidth: 1,
          borderColor: theme.color.fieldBorder,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.3,
          shadowRadius: 4.65,
          elevation: 8,
        }}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{width: '15%'}}>
            <Image
              style={{width: 48, height: 48}}
              source={require('../../assets/gif/notify.gif')}
            />
          </View>

          <View style={{width: '83%', justifyContent: 'center'}}>
            <Text
              numberOfLines={2}
              ellipsizeMode="tail"
              style={{
                fontSize: 16,

                color: theme.color.title,
                fontFamily: theme.fonts.fontNormal,
              }}>
              {title}
            </Text>
          </View>
        </View>
      </View>
    </>
  );
}
