import React, {useEffect} from 'react';
import {AppState, Platform, UIManager} from 'react-native';
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
// import crashlytics from '@react-native-firebase/crashlytics';

export default observer(App);
function App() {
  const Stack = createNativeStackNavigator();
  const {user} = store.User;

  useEffect(() => {
    if (Platform.OS === 'android') {
      if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
      }
    }
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
  //   crashlytics().log('App mounted.');
  //   crashlytics().crash();
  // }, []);

  const setDeviceInfo = () => {
    store.General.setapiLevel(DeviceInfo.getApiLevel());
    store.General.setappBuildNumber(DeviceInfo.getBuildNumber());
    store.General.setpackage(DeviceInfo.getBundleId());
    store.General.setappVersionNumber(DeviceInfo.getVersion());
  };

  return (
    <SafeAreaProvider>
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
    </SafeAreaProvider>
  );
}
