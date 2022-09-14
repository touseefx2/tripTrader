import React, {useEffect} from 'react';
import {AppState, Alert, UIManager} from 'react-native';
import stack from './src/navigation/index';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import GlobalFont from 'react-native-global-font';
import theme from './src/theme';
import screens from './src/screens/index';
import DeviceInfo from 'react-native-device-info';
import NetInfo from '@react-native-community/netinfo';
import store from './src/store/index';
import {observer} from 'mobx-react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import ConnectivityManager from 'react-native-connectivity-status';

// import {  } from 'react-navigation';

export default observer(App);
function App(props) {
  const Stack = createNativeStackNavigator();
  let user = store.User.user;

  useEffect(() => {
    UIManager.setLayoutAnimationEnabledExperimental(true);
    GlobalFont.applyGlobal(theme.fonts.fontNormal);
    const unsubscribeNetinfo = NetInfo.addEventListener(state => {
      store.General.setInternet(state.isConnected);
    });
    const unsubscribeAppState = AppState.addEventListener(
      'change',
      appState => {
        store.General.setappState(appState);
        if (appState === 'active') {
          NetInfo.fetch().then(state => {
            store.General.setInternet(state.isConnected ? true : false);
          });
        }
      },
    );
    const unsubscribeConnectivityStatusSubscription =
      ConnectivityManager.addStatusListener(({eventType, status}) => {
        switch (eventType) {
          case 'location':
            store.General.setLocation(status);
            break;
        }
      });

    store.General.setapiLevel(DeviceInfo.getApiLevel());
    store.General.setappBuildNumber(DeviceInfo.getBuildNumber());
    store.General.setappVersionNumber(DeviceInfo.getVersion());
    return () => {
      unsubscribeConnectivityStatusSubscription.remove();
      unsubscribeNetinfo();
      // unsubscribeAppState();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          {store.General.Loading && (
            <Stack.Screen name="Splash" component={screens.Splash} />
          )}

          {/* {!store.General.Loading && (
            <Stack.Screen name="AuthStack" component={stack.AuthStack} />
          )} */}

          {!store.General.Loading && !user && (
            <Stack.Screen name="AuthStack" component={stack.AuthStack} />
          )}

          {!store.General.Loading && user && (
            <Stack.Screen name="HomeStack" component={stack.HomeStack} />
          )}

          {/* {!store.General.Loading && store.Resturants.isSetLocOnce && (
            <Stack.Screen name="HomeStack" component={stack.DrawerStack} />
          )} */}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
