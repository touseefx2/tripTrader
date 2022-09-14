// import React, {useEffect, useState, useRef} from 'react';
// import {
//   View,
//   Text,
//   SafeAreaView,
//   TouchableOpacity,
//   Image,
//   TouchableHighlight,
//   StatusBar,
//   BackHandler,
//   Alert,
//   Linking,
//   PermissionsAndroid,
//   Platform,
//   Dimensions,
// } from 'react-native';
// // import Geolocation from 'react-native-geolocation-service';
// import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
// // import Geocoder from 'react-native-geocoding';
// import {styles} from './styles';
// import {observer} from 'mobx-react';
// import store from '../../store/index';
// import utils from '../../utils/index';
// import theme from '../../theme';
// // import DynamicTabView from 'react-native-dynamic-tab-view';
// // import ImageSlider from 'react-native-image-slider';
// // import FastImage from 'react-native-fast-image';
// import {
//   responsiveHeight,
//   responsiveWidth,
// } from 'react-native-responsive-dimensions';
// import NetInfo from '@react-native-community/netinfo';
// import Toast from 'react-native-easy-toast';

// import RBSheet from 'react-native-raw-bottom-sheet';
// import {ActivityIndicator} from 'react-native-paper';
// import {ScrollView} from 'react-native-gesture-handler';

// export default observer(Home);

// function Home(props) {
//   const toast = useRef(null);
//   const toastduration = 700;
//   const [Loader, setLoader] = useState(false);
//   let internet = store.General.isInternet;

//   let isSheetOpen = store.General.isSheetOpen;
//   useEffect(() => {
//     if (isSheetOpen) {
//       OpenSheet();
//       store.General.setisSheetOpen(false);
//     }
//   }, [isSheetOpen]);

//   const rbSheet = useRef(null);
//   const OpenSheet = () => {
//     rbSheet?.current?.open();
//   };
//   const CloseSheet = () => {
//     rbSheet?.current?.close();
//   };

//   let loc = store.User.location;
//   let cart = store.User.cart;
//   let totalItems = cart.data.length > 0 ? cart.totalitems : 0;
//   let tagLine = '';

//   const renderHeader = () => {
//     const setloader = c => {
//       setLoader(c);
//       setTimeout(() => {
//         setLoader(false);
//       }, 2500);
//     };

//     const onClickDrawer = () => {
//       props.navigation.openDrawer();
//     };

//     const onClickLoc = () => {
//       props.navigation.navigate('Map', {screen: 'home', setloader});
//     };

//     const onClickCart = () => {
//       if (cart.data.length <= 0) {
//         props.navigation.navigate('CheckoutEmpty', {screen: 'home'});
//         return;
//       }
//       props.navigation.navigate('Checkout', {screen: 'home'});
//     };

//     const renderDrawer = () => {
//       return (
//         <TouchableOpacity activeOpacity={0.4} onPress={onClickDrawer}>
//           <utils.vectorIcon.Octicons
//             name="three-bars"
//             color={theme.color.title}
//             size={22}
//           />
//         </TouchableOpacity>
//       );
//     };

//     const renderLoc = () => {
//       let adrs = loc.adrs;
//       let city = loc.city_name;

//       return (
//         <TouchableOpacity
//           activeOpacity={0.7}
//           onPress={onClickLoc}
//           style={styles.locContainer}>
//           <View style={{}}>
//             <Text style={styles.locText} numberOfLines={1} ellipsizeMode="tail">
//               {adrs}
//             </Text>
//             <Text
//               style={styles.locText2}
//               numberOfLines={1}
//               ellipsizeMode="tail">
//               {city}
//             </Text>
//           </View>

//           <utils.vectorIcon.Entypo
//             style={{marginLeft: 3}}
//             name="chevron-small-down"
//             color={theme.color.subTitleLight}
//             size={16}
//           />
//         </TouchableOpacity>
//       );
//     };

//     const renderCart = () => {
//       const renderCircle = () => {
//         return (
//           <View style={styles.circleC}>
//             <Text style={styles.circleCText}>
//               {totalItems > 99 ? '99+' : totalItems}
//             </Text>
//           </View>
//         );
//       };

//       return (
//         <TouchableOpacity activeOpacity={0.4} onPress={onClickCart}>
//           <utils.vectorIcon.Ionicons
//             name="ios-cart-outline"
//             color={theme.color.subTitle}
//             size={26}
//           />
//           {totalItems > 0 && renderCircle()}
//         </TouchableOpacity>
//       );
//     };

//     let styl =
//       Platform.OS == 'android'
//         ? {}
//         : {
//             shadowColor: '#000',
//             shadowOffset: {width: 0, height: 1},
//             shadowOpacity: 0.6,
//             shadowRadius: 1,
//           };

//     return (
//       <View style={[styles.headerConatainer, styl]}>
//         {renderDrawer()}
//         {renderLoc()}
//         {renderCart()}
//       </View>
//     );
//   };

//   const renderMain = () => {
//     const onclickDelivery = () => {
//       props.navigation.navigate('Home2', {screen: 'home', type: 'delivery'});
//     };

//     const onclickPickup = () => {
//       props.navigation.navigate('Home2', {screen: 'home', type: 'pickup'});
//     };

//     let styl =
//       Platform.OS == 'android'
//         ? {}
//         : {
//             shadowColor: '#000',
//             shadowOffset: {width: 0, height: 0.7},
//             shadowOpacity: 0.5,
//             shadowRadius: 1,
//           };

//     return (
//       <>
//         <TouchableOpacity
//           activeOpacity={0.7}
//           onPress={onclickDelivery}
//           style={[styles.boxContainer, styl]}>
//           <View style={styles.boxContainerSecton1}>
//             <Text style={styles.bcs1Text1}>Food Delivery</Text>
//             <Text style={styles.bcs1Text2}>
//               Order from your favorite restaurants and cafes
//             </Text>
//           </View>

//           <View style={styles.boxContainerSecton2}>
//             <Image
//               source={require('../../assets/images/typeDeliver/img.png')}
//               style={styles.bcs2Image}
//             />
//           </View>
//         </TouchableOpacity>

//         <TouchableOpacity
//           activeOpacity={0.7}
//           onPress={onclickPickup}
//           style={[styles.boxContainer2, styl]}>
//           <View style={styles.boxContainerSecton1}>
//             <Text style={styles.bcs1Text1}>Pick-up</Text>
//             <Text style={styles.bcs1Text2}>
//               Order from anywhere and pick-up by yourself
//             </Text>
//           </View>

//           <View style={styles.boxContainerSecton2}>
//             <Image
//               source={require('../../assets/images/typePickup/img.png')}
//               style={styles.bcs2Image}
//             />
//           </View>
//         </TouchableOpacity>
//       </>
//     );
//   };

//   const renderStatusBar = () => {
//     return (
//       <>
//         <StatusBar
//           translucent={false}
//           backgroundColor={theme.color.background}
//           barStyle={'dark-content'}
//         />
//       </>
//     );
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <utils.BottomModalLogin
//         rbSheet={rbSheet}
//         nav={props.navigation}
//         OpenSheet={() => OpenSheet()}
//         CloseSheet={() => CloseSheet()}
//         screen={'home'}
//       />
//       {renderStatusBar()}
//       <utils.Loader2 load={Loader} />
//       {!internet && (
//         <utils.InternetMessage
//           color={tagLine != '' ? 'red' : theme.color.button1}
//         />
//       )}
//       {tagLine != '' && <utils.TagLine tagLine={tagLine} />}
//       {renderHeader()}
//       <ScrollView contentContainerStyle={{padding: 20}}>
//         {renderMain()}
//       </ScrollView>
//       <Toast ref={toast} position="bottom" />
//     </SafeAreaView>
//   );
// }

import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TouchableHighlight,
  StatusBar,
  BackHandler,
  Alert,
  Linking,
  PermissionsAndroid,
  Platform,
  Dimensions,
} from 'react-native';
// import Geolocation from 'react-native-geolocation-service';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
// import Geocoder from 'react-native-geocoding';
import {styles} from './styles';
import {observer} from 'mobx-react';
import store from '../../store/index';
import utils from '../../utils/index';
import theme from '../../theme';
// import DynamicTabView from 'react-native-dynamic-tab-view';
// import ImageSlider from 'react-native-image-slider';
// import FastImage from 'react-native-fast-image';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-easy-toast';

import RBSheet from 'react-native-raw-bottom-sheet';
import {ActivityIndicator} from 'react-native-paper';
import {ScrollView} from 'react-native-gesture-handler';

export default observer(Home);

function Home(props) {
  const toast = useRef(null);
  const toastduration = 700;
  let headerTitle = 'Home';

  let internet = store.General.isInternet;
  let user = store.User.user;
  let goto = store.General.goto;
  let loc = store.User.location;
  let cart = store.User.cart;
  let totalItems = cart.data.length > 0 ? cart.totalitems : 0;
  let tagLine = '';

  useEffect(() => {
    if (goto == 'profile') {
      props.navigation.navigate('MyProfile');
    }
  }, []);

  const renderStatusBar = () => {
    return (
      <>
        <StatusBar
          translucent={false}
          backgroundColor={theme.color.backgroundGreen}
          barStyle={Platform.OS == 'android' ? 'light-content' : 'dark-content'}
        />
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* {tagLine != '' && <utils.TagLine tagLine={tagLine} />} */}
      <utils.DrawerHeader props={props} headerTitle={headerTitle} />
      {!internet && <utils.InternetMessage />}
      <ScrollView contentContainerStyle={{padding: 20}}>
        {/* {renderMain()} */}
      </ScrollView>

      {renderStatusBar()}
      <Toast ref={toast} position="bottom" />
      {/* <utils.Loader2 load={Loader} /> */}
      <utils.Footer
        nav={props.navigation}
        screen={headerTitle}
        focusScreen={store.General.focusScreen}
      />
    </SafeAreaView>
  );
}
