import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {styles} from './styles';
import {observer} from 'mobx-react';
import store from '../../store/index';
import theme from '../../theme';
import Notifications from '../../screens/Notifications';
import NotificationsGuest from '../../screens/NotificationsGuest';

export default observer(StackHeader);
function StackHeader(props) {
  const prop = props.props;
  const headerTitle = props.headerTitle || '';
  const isBell = props.bell || false;
  const isChat = props.chat || false;
  const countRead = store.Notifications.unread;

  const [isShowNotifiction, setIsShowNotifiction] = useState(false);
  const [isShowGuestNotifiction, setIsShowGuestNotifiction] = useState(false);

  const goBack = () => {
    if (headerTitle == 'Notifications') props.closeModal();
    else prop.navigation.goBack();
  };

  const render1 = () => {
    const onClick = () => {
      goBack();
    };
    const src = require('../../assets/images/back/img.png');
    return (
      <TouchableOpacity activeOpacity={0.5} onPress={onClick}>
        <Image source={src} style={styles.backIcon} />
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
      if (store.User.user != 'guest') setIsShowNotifiction(true);
      else setIsShowGuestNotifiction(true);
    };
    const src = require('../../assets/images/bell/img.png');
    let src2 = require('../../assets/images/vertical/img.png');

    return (
      <TouchableOpacity
        onPress={() => {
          if (isBell) onClick();

          if (isChat) props.openBottomSheet();
        }}
        disabled={
          headerTitle == 'Notifications' || headerTitle == 'NotificationsGuest'
            ? true
            : false
        }
        activeOpacity={0.8}>
        {isBell && (
          <>
            <Image source={src} style={styles.bellIcon} />
            {countRead > 0 && <View style={styles.dot} />}
          </>
        )}
        {!isBell && isChat && <Image source={src2} style={styles.bellIcon} />}
        {!isBell && !isChat && <View style={styles.bellIcon} />}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.headerConatainer}>
      {isShowNotifiction ? (
        <Notifications
          props={prop}
          callingScreen={headerTitle}
          isShowModal={isShowNotifiction}
          setIsShowModal={setIsShowNotifiction}
        />
      ) : (
        <NotificationsGuest
          props={prop}
          callingScreen={headerTitle}
          isShowModal={isShowGuestNotifiction}
          setIsShowModal={setIsShowGuestNotifiction}
        />
      )}
      {render1()}
      {render2()}
      {render3()}
    </View>
  );
}
