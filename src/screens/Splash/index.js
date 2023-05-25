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
  console.log('token ios :::: ', token);
  store.User.addnotificationToken(token);
};
Platform.OS === 'android'
  ? PushNotification.configure({
      onRegister: function (token) {
        console.log('token android :::: ', token.token);
        store.User.addnotificationToken(token.token);
      },
    })
  : getToken();

export default observer(Splash);

function Splash() {
  const {setLoading} = store.General;

  useEffect(() => {
    store.General.setIsCurrentCahtId('');
    store.User.setmessages([]);
    hydrateStores();
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
