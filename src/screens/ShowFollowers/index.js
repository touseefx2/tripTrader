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
  Pressable,
  TextInput,
  FlatList,
  ScrollView,
  Keyboard,
  Modal,
} from 'react-native';
import ProgressiveFastImage from '@freakycoder/react-native-progressive-fast-image';
// import ImageSlider from 'react-native-image-slider';
import {styles} from './styles';
import {observer} from 'mobx-react';
import store from '../../store/index';
import utils from '../../utils/index';
import theme from '../../theme';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-easy-toast';
import {ActivityIndicator} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import {ImageSlider} from 'react-native-image-slider-banner';
import {Calendar} from 'react-native-calendars';
import moment, {duration} from 'moment/moment';

export default observer(ShowFollowers);

function ShowFollowers(props) {
  let maxModalHeight = theme.window.Height - 100;
  const [modalHeight, setmodalHeight] = useState(0);

  let chk = props.route.params.chk || '';
  // let data = chk == 'followers' ? store.User.followers : store.User.following;
  let headerTitle = props.route.params.user || '';

  let internet = store.General.isInternet;
  let user = store.User.user;

  let mloader = store.Trips.dLoader;

  const [modalObj, setmodalObj] = useState(false);
  const [modalChk, setmodalChk] = useState(false);
  const [isModal, setisModal] = useState(false);

  const [data, setdata] = useState([]);
  let total =
    chk == 'followers' ? store.User.totalfollowers : store.User.totalfollowing;

  useEffect(() => {
    const flwrs = [
      {
        first_name: 'micle',
        last_name: 'jakson',
        userName: 'mmouse',
        // photo:"",
        photo:
          'https://www.adobe.com/express/create/media_127540366421d3d5bfcaf8202527ca7d37741fd5d.jpeg?width=400&format=jpeg&optimize=medium',
        avg_rating: 3.8,
        total_reviews: 190,
        isVerified: true,
        location: 'Alaska',
      },
      {
        first_name: 'mike',
        last_name: 'monuse',
        userName: 'mmouse',
        // photo:"",
        photo:
          'https://expertphotography.b-cdn.net/wp-content/uploads/2020/08/social-media-profile-photos-10.jpg',
        avg_rating: 3.8,
        total_reviews: 190,
        isVerified: true,
        location: 'North Dakota',
      },
      {
        first_name: 'Kamran',
        last_name: 'Akbar',

        userName: 'mmouse',
        // photo:"",
        photo:
          'https://cdn140.picsart.com/76886237758523202417.png?type=webp&to=min&r=-1x-1',
        avg_rating: 3.8,
        total_reviews: 190,
        isVerified: true,
        location: 'Washington',
      },
      {
        first_name: 'James',
        last_name: 'Jhony',
        userName: 'mmouse',
        // photo:"",
        photo:
          'https://www.adobe.com/express/create/media_127540366421d3d5bfcaf8202527ca7d37741fd5d.jpeg?width=400&format=jpeg&optimize=medium',
        avg_rating: 3.8,
        total_reviews: 190,
        isVerified: true,
        location: 'Idaho',
      },
      {
        first_name: 'Tom',
        last_name: 'Jerry',
        userName: 'mmouse',
        // photo:"",
        photo:
          'https://www.adobe.com/express/create/media_127540366421d3d5bfcaf8202527ca7d37741fd5d.jpeg?width=400&format=jpeg&optimize=medium',
        avg_rating: 3.8,
        total_reviews: 190,
        isVerified: true,
      },
      {
        first_name: 'Hacker',
        last_name: 'Pro',
        userName: 'mmouse',
        // photo:"",
        photo:
          'https://www.adobe.com/express/create/media_127540366421d3d5bfcaf8202527ca7d37741fd5d.jpeg?width=400&format=jpeg&optimize=medium',
        avg_rating: 3.8,
        total_reviews: 190,
        isVerified: true,
      },
      {
        first_name: 'Pro',
        last_name: 'Killer',
        userName: 'mmouse',
        // photo:"",
        photo:
          'https://www.adobe.com/express/create/media_127540366421d3d5bfcaf8202527ca7d37741fd5d.jpeg?width=400&format=jpeg&optimize=medium',
        avg_rating: 3.8,
        total_reviews: 190,
        isVerified: true,
      },
      {
        first_name: 'Jungle',
        last_name: 'King',
        userName: 'mmouse',
        // photo:"",
        photo:
          'https://www.adobe.com/express/create/media_127540366421d3d5bfcaf8202527ca7d37741fd5d.jpeg?width=400&format=jpeg&optimize=medium',
        avg_rating: 3.8,
        total_reviews: 190,
        isVerified: true,
      },
      {
        first_name: 'Under',
        last_name: 'Taker',
        userName: 'mmouse',
        // photo:"",
        photo:
          'https://www.adobe.com/express/create/media_127540366421d3d5bfcaf8202527ca7d37741fd5d.jpeg?width=400&format=jpeg&optimize=medium',
        avg_rating: 3.8,
        total_reviews: 190,
        isVerified: true,
      },
      {
        first_name: 'Kamran',
        last_name: 'Khan',
        userName: 'mmouse',
        // photo:"",
        photo:
          'https://www.adobe.com/express/create/media_127540366421d3d5bfcaf8202527ca7d37741fd5d.jpeg?width=400&format=jpeg&optimize=medium',
        avg_rating: 3.8,
        total_reviews: 190,
        isVerified: true,
      },
    ];
    const flwng = [
      {
        first_name: 'micle',
        last_name: 'jakson',
        userName: 'mmouse',
        // photo:"",
        photo:
          'https://www.adobe.com/express/create/media_127540366421d3d5bfcaf8202527ca7d37741fd5d.jpeg?width=400&format=jpeg&optimize=medium',
        avg_rating: 3.8,
        total_reviews: 190,
        isVerified: true,
      },
      {
        first_name: 'mike',
        last_name: 'monuse',
        userName: 'mmouse',
        // photo:"",
        photo:
          'https://expertphotography.b-cdn.net/wp-content/uploads/2020/08/social-media-profile-photos-10.jpg',
        avg_rating: 3.8,
        total_reviews: 190,
        isVerified: true,
      },
      {
        first_name: 'Kamran',
        last_name: 'Akbar',

        userName: 'mmouse',
        // photo:"",
        photo:
          'https://cdn140.picsart.com/76886237758523202417.png?type=webp&to=min&r=-1x-1',
        avg_rating: 3.8,
        total_reviews: 190,
        isVerified: true,
      },
      {
        first_name: 'James',
        last_name: 'Jhony',
        userName: 'mmouse',
        // photo:"",
        photo:
          'https://www.adobe.com/express/create/media_127540366421d3d5bfcaf8202527ca7d37741fd5d.jpeg?width=400&format=jpeg&optimize=medium',
        avg_rating: 3.8,
        total_reviews: 190,
        isVerified: true,
      },
      {
        first_name: 'Tom',
        last_name: 'Jerry',
        userName: 'mmouse',
        // photo:"",
        photo:
          'https://www.adobe.com/express/create/media_127540366421d3d5bfcaf8202527ca7d37741fd5d.jpeg?width=400&format=jpeg&optimize=medium',
        avg_rating: 3.8,
        total_reviews: 190,
        isVerified: true,
      },
    ];

    if (chk == 'followers') {
      setdata(flwrs);
    } else {
      setdata(flwng);
    }
    return () => {};
  }, []);

  const ItemSeparatorView = () => {
    return (
      <View
        style={{
          height: 10,
        }}
      />
    );
  };

  const EmptyListMessage = ({item}) => {
    return (
      // Flat List Item
      <Text style={styles.emptyListStyle} onPress={() => getItem(item)}>
        No Data Found
      </Text>
    );
  };

  let src = require('../../assets/images/locationPin/img.png');
  const ItemView = ({item, index}) => {
    //user
    let photo = item.photo;
    let userName = item.first_name + ' ' + item.last_name;
    let location = item.location || 'Pakistan';

    const renderProfile = () => {
      return (
        <View style={styles.mProfileImgContainer}>
          <ProgressiveFastImage
            style={styles.mProfileImg}
            source={
              photo != ''
                ? {uri: photo}
                : require('../../assets/images/drawer/guest/img.png')
            }
            loadingImageStyle={styles.mimageLoader}
            loadingSource={require('../../assets/images/imgLoad/img.jpeg')}
            blurRadius={5}
          />
          {/* {isVeirfy && (
            <Image
              style={styles.miconVerify}
              source={require('../../assets/images/verified/img.png')}
            />
          )} */}
        </View>
      );
    };

    const renderText = () => {
      return (
        <View style={styles.mtextContainer}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              color: '#3C6B49',
              fontSize: 15,
              fontFamily: theme.fonts.fontBold,
              lineHeight: 23,
              textTransform: 'capitalize',
            }}>
            {userName}
          </Text>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Image
              source={src}
              style={{
                width: 20,
                height: 20,
                resizeMode: 'contain',
              }}
            />
            <View style={{width: '94%'}}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  color: theme.color.subTitleLight,
                  fontSize: 13,
                  top: 2,
                  fontFamily: theme.fonts.fontMedium,
                  textTransform: 'capitalize',
                  lineHeight: 25,
                }}>
                {location}
              </Text>
            </View>
          </View>
        </View>
      );
    };

    return (
      <View
        style={[styles.modalinfoConatiner, {marginTop: index == 0 ? 15 : 0}]}>
        {renderProfile()}
        {renderText()}
      </View>
    );
  };

  const ListHeader = () => {
    let t = chk == 'followers' ? 'Followers' : 'Following';
    let num = total;
    return (
      <View style={{width: '100%'}}>
        <Text
          style={{
            color: '#101B10',
            fontSize: 16,
            fontFamily: theme.fonts.fontBold,

            textTransform: 'capitalize',
          }}>
          {t} ({num})
        </Text>
      </View>
    );
  };

  const ListFooter = () => {
    return (
      <>
        <View>
          <View style={styles.listFooter}>
            <Text style={styles.listFooterT}>End of results</Text>
          </View>
        </View>
      </>
    );
  };

  return (
    <>
      <View style={styles.container}>
        <utils.StackHeader
          bell={true}
          props={props}
          headerTitle={headerTitle}
          screen={'followers'}
        />
        {!internet && <utils.InternetMessage />}
        <SafeAreaView style={styles.container2}>
          <View style={styles.container3}>
            <FlatList
              contentContainerStyle={{
                paddingVertical: 15,
                paddingHorizontal: 15,
              }}
              data={data}
              renderItem={ItemView}
              // keyExtractor={(item, index) => index.toString()}
              ListEmptyComponent={EmptyListMessage}
              ItemSeparatorComponent={ItemSeparatorView}
              ListHeaderComponent={ListHeader}
              // ListFooterComponent={ListFooter}
            />
          </View>

          <utils.Footer
            nav={props.navigation}
            screen={'Followers'}
            focusScreen={store.General.focusScreen}
          />
        </SafeAreaView>
      </View>
    </>
  );
}
