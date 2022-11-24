import React, {useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Platform,
  StatusBar,
  ImageBackground,
  Image,
} from 'react-native';
import {styles} from './styles';
import {observer} from 'mobx-react';
import store from '../../store/index';
import PushNotification from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';
import {create} from 'mobx-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import theme from '../../theme';

const getToken = async () => {
  let tok = await messaging().getToken();
  console.log('token ios :::: ', tok);
  store.User.addnotificationToken(tok);
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

function Splash(props) {
  // hook

  useEffect(() => {
    store.User.setmessages([]);
    hydrateStores();
    setTimeout(() => {
      store.General.setLoading(false);
    }, 1000);
  }, []);

  // method

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

  // render

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

      <ImageBackground
        source={require('../../assets/images/background/imgS.png')}
        style={styles.container2}>
        <Image
          style={styles.logo}
          source={require('../../assets/images/logo/img.png')}
        />

        {/* <Text style={styles.title1}>{store.General.AppName}</Text> */}
      </ImageBackground>
    </View>
  );
}
