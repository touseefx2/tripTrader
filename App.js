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
  dsn: store.General.sentryDsn,
  debug: true,
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

export default Sentry.wrap(observer(App));

function App() {
  const {user} = store.User;
  const {
    Loading,
    setapiLevel,
    setappBuildNumber,
    setpackage,
    setappVersionNumber,
    setappState,
    setInternet,
  } = store.General;
  const Stack = createNativeStackNavigator();

  useEffect(() => {
    // crashlytics().crash();
    // Sentry.nativeCrash();
  }, []);

  useEffect(() => {
    GlobalFont.applyGlobal(theme.fonts.fontNormal);
    const unsubscribeAppState = AppState.addEventListener(
      'change',
      appState => {
        setappState(appState);
        if (appState === 'active') {
          NetInfo.fetch().then(state => {
            setInternet(state.isConnected ? true : false);
          });
        }
      },
    );

    const unsubscribeNetinfo = NetInfo.addEventListener(state => {
      setInternet(state.isConnected);
    });
    setDeviceInfo();

    return () => {
      unsubscribeAppState.remove();
      unsubscribeNetinfo();
    };
  }, []);

  const setDeviceInfo = () => {
    setapiLevel(DeviceInfo.getApiLevel());
    setappBuildNumber(DeviceInfo.getBuildNumber());
    setpackage(DeviceInfo.getBundleId());
    setappVersionNumber(DeviceInfo.getVersion());
  };

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {Loading && <Stack.Screen name="Splash" component={screens.Splash} />}

        {!Loading && !user && (
          <Stack.Screen name="AuthStack" component={stack.AuthStack} />
        )}

        {!Loading && user && (
          <Stack.Screen name="HomeStack" component={stack.HomeStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
