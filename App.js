import React, {useEffect} from 'react';
import {AppState} from 'react-native';
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
import crashlytics from '@react-native-firebase/crashlytics';
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://8f2c307cb0e547088a57b23622928be6@o4505512458452992.ingest.sentry.io/4505517120487424',
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production.
  tracesSampleRate: 1.0,
});

export default Sentry.wrap(observer(App));
function App() {
  const Stack = createNativeStackNavigator();
  const {user} = store.User;

  useEffect(() => {
    GlobalFont.applyGlobal(theme.fonts.fontNormal);
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

    const unsubscribeNetinfo = NetInfo.addEventListener(state => {
      store.General.setInternet(state.isConnected);
    });
    setDeviceInfo();

    return () => {
      unsubscribeAppState.remove();
      unsubscribeNetinfo();
    };
  }, []);

  // useEffect(() => {
  //   // Sentry.nativeCrash();
  //   // crashlytics().crash();
  // }, []);

  const setDeviceInfo = () => {
    store.General.setapiLevel(DeviceInfo.getApiLevel());
    store.General.setappBuildNumber(DeviceInfo.getBuildNumber());
    store.General.setpackage(DeviceInfo.getBundleId());
    store.General.setappVersionNumber(DeviceInfo.getVersion());
  };

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {store.General.Loading && (
          <Stack.Screen name="Splash" component={screens.Splash} />
        )}

        {!store.General.Loading && !user && (
          <Stack.Screen name="AuthStack" component={stack.AuthStack} />
        )}

        {!store.General.Loading && user && (
          <Stack.Screen name="HomeStack" component={stack.HomeStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
