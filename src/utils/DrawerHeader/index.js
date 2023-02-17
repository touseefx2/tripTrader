import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  StatusBar,
  ScrollView,
  Modal,
  ActivityIndicator,
} from 'react-native';
import {styles} from './styles';
import {observer} from 'mobx-react';
import store from '../../store/index';
import theme from '../../theme';

export default observer(DrawerHeader);
function DrawerHeader(props) {
  let prop = props.props;
  let headerTitle = props.headerTitle || '';

  let countRead = store.Notifications.unread;

  const render1 = () => {
    const onClick = () => {
      prop.navigation.openDrawer();
    };
    let src = require('../../assets/images/drawers/img.png');
    return (
      <TouchableOpacity activeOpacity={0.5} onPress={onClick}>
        <Image
          source={src}
          style={{
            width: 24,
            height: 24,
            resizeMode: 'contain',
          }}
        />
      </TouchableOpacity>
    );
  };

  const render2 = () => {
    return (
      <View style={{width: '75%'}}>
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.headerTitle}>
          {headerTitle}
        </Text>
      </View>
    );
  };

  const render3 = () => {
    const onClick = () => {
      if (store.User.user != 'guest') {
        prop.navigation.navigate('Notifications', {screen: headerTitle});
      } else {
        prop.navigation.navigate('NotificationsGuest', {screen: headerTitle});
      }
    };
    let src = require('../../assets/images/bell/img.png');
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={onClick}>
        {/* <utils.vectorIcon.SimpleLineIcons
          name="bell"
          color={theme.color.backgroundGreenText}
          size={23}
        /> */}
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
      {render3()}
    </View>
  );
}
