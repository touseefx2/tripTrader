import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {styles} from './styles';
import {observer} from 'mobx-react';
import store from '../../store/index';
import theme from '../../theme';
import Notifications from '../../screens/Notifications';

export default observer(DrawerHeader);
function DrawerHeader(props) {
  const prop = props.props;
  const headerTitle = props.headerTitle || '';
  const countRead = store.Notifications.unread;

  const [isShowNotifiction, setIsShowNotifiction] = useState(false);
  const [isShowGuestNotifiction, setIsShowGuestNotifiction] = useState(false);

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
      // prop.navigation.navigate('Notifications', {screen: headerTitle});
      // prop.navigation.navigate('NotificationsGuest', {screen: headerTitle});
      if (store.User.user != 'guest') setIsShowNotifiction(true);
      else setIsShowGuestNotifiction(true);
    };
    let src = require('../../assets/images/bell/img.png');
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={onClick}>
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
      {isShowNotifiction && (
        <Notifications
          props={prop}
          callingScreen={headerTitle}
          isShowModal={
            store.User.user != 'guest'
              ? isShowNotifiction
              : isShowGuestNotifiction
          }
          setIsShowModal={
            store.User.user != 'guest'
              ? setIsShowNotifiction
              : setIsShowGuestNotifiction
          }
        />
      )}
      {render1()}
      {render2()}
      {render3()}
    </View>
  );
}
