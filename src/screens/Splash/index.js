import React, {useEffect} from 'react';
import {View, Platform, StatusBar, Image} from 'react-native';
import {styles} from './styles';
import {observer} from 'mobx-react';
import store from '../../store/index';
import PushNotification from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';
import {create} from 'mobx-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getToken = async () => {
  const token = await messaging().getToken();
  store.User.addNotificationToken(token);
};
Platform.OS === 'android'
  ? PushNotification.configure({
      onRegister: function (token) {
        store.User.addNotificationToken(token.token);
      },
    })
  : getToken();

export default observer(Splash);

function Splash() {
  const {setLoading, setIsCurrentCahtId} = store.General;
  const {setMessages} = store.User;

  useEffect(() => {
    hydrateStores();
    setIsCurrentCahtId('');
    setMessages([]);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const hydrateStores = async () => {
    const hydrate = create({storage: AsyncStorage});
    await hydrate('General', store.General);
    await hydrate('User', store.User);
    await hydrate('Trips', store.Trips);
    await hydrate('Search', store.Search);
    await hydrate('Filters', store.Filters);
    await hydrate('Offers', store.Offers);
    await hydrate('Notifications', store.Notifications);
  };

  const renderStatusBar = () => {
    return (
      <>
        <StatusBar
          translucent={true}
          animated={false}
          backgroundColor={'transparent'}
          barStyle={'light-content'}
        />
      </>
    );
  };

  return (
    <View style={styles.container}>
      {renderStatusBar()}

      <Image
        source={require('../../assets/images/background/img.png')}
        style={styles.container2}
      />

      <View style={styles.main}>
        <Image
          style={styles.logo}
          source={require('../../assets/images/logo/img.png')}
        />
      </View>
    </View>
  );
}
