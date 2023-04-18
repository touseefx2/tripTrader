import React, {useEffect, useState, useRef} from 'react';
import {View, SafeAreaView} from 'react-native';
import {styles} from './styles';
import {observer} from 'mobx-react';
import store from '../../store/index';
import utils from '../../utils/index';
import Toast from 'react-native-easy-toast';
import {TabView, SceneMap} from 'react-native-tab-view';
import Received from './Received';
import Sent from './Sent';

export default observer(TradeOffers);

function TradeOffers(props) {
  const toast = useRef(null);
  const headerTitle = 'Trade Offers';
  const internet = store.General.isInternet;
  const user = store.User.user;

  const [isTabBarShow, setisTabBarShow] = useState(false);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'sent', title: 'Sent'},
    {key: 'received', title: 'Received'},
  ]);

  const renderScene = SceneMap({
    sent: Sent,
    received: Received,
  });

  useEffect(() => {
    if (user == 'guest') {
      store.General.setgoto('guestaccess');
      store.User.Logout();
      return;
    }
  }, []);

  useEffect(() => {
    store.User.setOfferProfileProps(props);
    if (user && user !== 'guest') {
      setTimeout(() => {
        setisTabBarShow(true);
      }, 100);
    }
  }, []);

  const renderTabBar = () => {
    return (
      <>
        <View
          style={{
            paddingHorizontal: 15,
            flex: 1,
            marginTop: 10,
          }}>
          <TabView
            navigationState={{index, routes}}
            renderScene={renderScene}
            onIndexChange={setIndex}
          />
        </View>

        <utils.Footer
          nav={props.navigation}
          screen={headerTitle}
          focusScreen={store.General.focusScreen}
        />
      </>
    );
  };

  return (
    <View style={styles.container}>
      <utils.DrawerHeader props={props} headerTitle={headerTitle} />
      {!internet && <utils.InternetMessage />}
      <SafeAreaView style={styles.container2}>
        <View style={styles.container3}>
          <View style={{flex: 1}}>{isTabBarShow && renderTabBar()}</View>
          <Toast ref={toast} position="bottom" />

          {!isTabBarShow && (
            <utils.Footer
              nav={props.navigation}
              screen={headerTitle}
              focusScreen={store.General.focusScreen}
            />
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}
