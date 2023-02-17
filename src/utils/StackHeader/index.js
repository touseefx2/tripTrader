import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {styles} from './styles';
import {observer} from 'mobx-react';
import store from '../../store/index';
import theme from '../../theme';

export default observer(StackHeader);
function StackHeader(props) {
  let prop = props.props;
  let headerTitle = props.headerTitle || '';
  let bell = props.bell || false;
  let scrn = props.screen || '';
  const goBack = () => {
    prop.navigation.goBack();
  };

  let countRead = store.Notifications.unread;

  const render1 = () => {
    const onClick = () => {
      goBack();
    };
    let src = require('../../assets/images/back/img.png');
    return (
      <TouchableOpacity activeOpacity={0.5} onPress={onClick}>
        <Image
          source={src}
          style={{
            width: 20,
            height: 20,
            resizeMode: 'contain',
          }}
        />
      </TouchableOpacity>
    );
  };

  const render2 = () => {
    return (
      <View style={{width: '76%'}}>
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.headerTitle}>
          {headerTitle}
        </Text>
      </View>
    );
  };

  const render3 = () => {
    const onClick = () => {
      if (store.User.user != 'guest') {
        prop.navigation.navigate('Notifications', {screen: scrn});
      } else {
        prop.navigation.navigate('NotificationsGuest', {screen: scrn});
      }
    };
    let src = require('../../assets/images/bell/img.png');

    return (
      // <View style={{width: 22}} />
      <TouchableOpacity
        onPress={onClick}
        disabled={
          headerTitle == 'Notifications' || headerTitle == 'NotificationsGuest'
            ? true
            : false
        }
        activeOpacity={0.8}>
        <Image
          source={src}
          style={{
            width: 26,
            height: 26,
            resizeMode: 'contain',
          }}
        />
        {countRead > 0 && (
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 8 / 2,
              position: 'absolute',
              right: 3,
              top: 3,
              backgroundColor: theme.color.ntfctnClr,
            }}
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.headerConatainer}>
      {render1()}
      {render2()}
      {bell && render3()}
    </View>
  );
}
