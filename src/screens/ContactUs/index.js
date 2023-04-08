import React, {useEffect, useState, useRef} from 'react';
import {View, SafeAreaView} from 'react-native';

import {styles} from './styles';
import {observer} from 'mobx-react';
import store from '../../store/index';
import utils from '../../utils/index';

export default observer(ContactUs);

function ContactUs(props) {
  let headerTitle = 'Contact Us';
  let internet = store.General.isInternet;
  let user = store.User.user;

  const data = [];

  return (
    <>
      <View style={styles.container}>
        <utils.StackHeader
          bell={true}
          props={props}
          headerTitle={headerTitle}
        />
        {!internet && <utils.InternetMessage />}
        <SafeAreaView style={styles.container2}>
          <View style={styles.container3}></View>

          <utils.Footer
            nav={props.navigation}
            screen={headerTitle}
            focusScreen={store.General.focusScreen}
          />

          {store.Notifications.isShowNotifcation && <utils.ShowNotifications />}
        </SafeAreaView>
      </View>
    </>
  );
}
