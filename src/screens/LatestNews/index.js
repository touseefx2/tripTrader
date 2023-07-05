import React, {useEffect} from 'react';
import {View, SafeAreaView} from 'react-native';

import {styles} from './styles';
import {observer} from 'mobx-react';
import store from '../../store/index';
import utils from '../../utils/index';

export default observer(LatestNews);

function LatestNews(props) {
  let headerTitle = 'Latest News';
  const {isInternet, setGoToScreen} = store.General;
  const {user, Logout} = store.User;

  useEffect(() => {
    if (user == 'guest') {
      setGoToScreen('guestaccess');
      Logout();
    }
  }, []);

  return (
    <>
      <View style={styles.container}>
        <utils.DrawerHeader props={props} headerTitle={headerTitle} />
        {!isInternet && <utils.InternetMessage />}
        <SafeAreaView style={styles.container2}>
          <View style={styles.container3}></View>

          <utils.Footer
            nav={props.navigation}
            screen={headerTitle}
            focusScreen={store.General.focusScreen}
          />
        </SafeAreaView>
      </View>
    </>
  );
}
