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
import {inject, observer} from 'mobx-react';
import store from '../../store/index';
import PushNotification from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';
import {create} from 'mobx-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import theme from '../../theme';
import ConnectivityManager from 'react-native-connectivity-status';
import utils from '../../utils/index';

const getToken = async () => {
  let tok = await messaging().getToken();
  console.log('token :::: ', tok);
  store.User.addnotificationToken(tok);
};
Platform.OS === 'android'
  ? PushNotification.configure({
      onRegister: function (token) {
        console.log('token :::: ', token.token);
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
    }, 1500);
    // checking();
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

    // await hydrate('Resturants', store.Resturants);
  };

  // const checking = async () => {
  //   await hydrateStores();
  //   checkIsUserLogin();
  //   if (store.General.isGLocation && Platform.OS == 'android') {
  //     isLocation();
  //   }
  // };

  // const isLocation = async () => {
  //   const locationServicesAvailable =
  //     await ConnectivityManager.areLocationServicesEnabled();
  //   store.General.setLocation(locationServicesAvailable);
  // };

  // const checkIsUserLogin = () => {
  //   let isLogin = store.User.user !== false ? true : false;
  //   let timeout = isLogin ? 1600 : 1200;
  //   if (isLogin) {
  //     store.User.getAllData('user');
  //   } else {
  //     store.User.getAllData('');
  //   }

  //   setTimeout(() => {
  //     store.General.setLoading(false);
  //   }, timeout);
  // };

  // render

  const StatusBarIos = ({backgroundColor, ...props}) => (
    <View style={[{backgroundColor, height: theme.window.STATUSBAR_HEIGHT}]}>
      <SafeAreaView>
        <StatusBar translucent backgroundColor={backgroundColor} {...props} />
      </SafeAreaView>
    </View>
  );

  const renderStatusBar = () => {
    return (
      <>
        <StatusBar
          translucent={true}
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
