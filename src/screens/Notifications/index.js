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

export default observer(Notifications);

function Notifications(props) {
  let maxModalHeight = theme.window.Height - 100;
  const [modalHeight, setmodalHeight] = useState(0);

  let headerTitle = 'Notifications';

  let internet = store.General.isInternet;
  let user = store.User.user;

  let db = false;
  let previousScreen = props.route.params.screen || '';
  if (previousScreen == 'userprofile' || previousScreen == 'followers') {
    db = true;
  }

  const [data, setdata] = useState([]);

  useEffect(() => {
    const dt = [
      {
        title: 'Trip Confirmed',
        subTitle: `Congrats! You have a new Confirmed Trip!`,
        createdAt: 'Just now',
        isRead: false,
      },
      {
        title: 'Trip Created',
        subTitle: '3 Day Central N.C. in return for Florida Alligator Hunting',
        createdAt: '3 days ago',
        isRead: true,
      },
      {
        title: 'Profile Updated',
        subTitle: 'Your location was successfully updated',
        createdAt: 'Mar 27',
        isRead: true,
      },
      {
        title: 'Password Changed',
        subTitle: 'Your password was successfully changed',
        createdAt: 'Mar 27',
        isRead: true,
      },
      {
        title: 'Mike Manuse followed you',
        user: 'Mike Manuse',
        topic: 'userFollow',
        photo:
          'https://www.adobe.com/express/create/media_127540366421d3d5bfcaf8202527ca7d37741fd5d.jpeg?width=400&format=jpeg&optimize=medium',
        subTitle: '',
        photo: '',
        createdAt: 'Just now',
        isRead: true,
      },
      {
        title: 'Blake Edwards followed you',
        user: 'Blake Edwards',
        topic: 'userFollow',
        subTitle: '',
        photo: '',
        photo:
          'https://expertphotography.b-cdn.net/wp-content/uploads/2020/08/social-media-profile-photos-10.jpg',
        createdAt: 'Just now',
        isRead: true,
      },
    ];

    const dt2 = [
      {
        title: 'Get full access for free',
        subTitle:
          'As a member, you’ll unlock all features and benefits for the best experience.',
        createdAt: '3 mins ago',
        topic: 'fullaccess',
        isRead: false,
      },
      {
        title: 'Welcome to Trip Trader!',
        subTitle:
          'We’re excited you’re here. Feel free to browse the community as a guest before signing up.',
        createdAt: '10 mins ago',
        isRead: true,
      },
    ];

    setdata(user == 'guest' ? dt2 : dt);

    return () => {};
  }, []);

  const JoinNow = () => {
    store.General.setgoto('joinnow');
    store.User.Logout();
  };

  const onclickSearchBar = () => {};

  const ItemSeparatorView = () => {
    return (
      <View
        style={{
          height: 0.7,
          backgroundColor: theme.color.fieldBorder,
          width: '100%',
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

  const ListHeader = () => {
    const renderSearch = () => {
      return (
        <TouchableOpacity disabled>
          <Image
            source={require('../../assets/images/searchBar/search/img.png')}
            style={styles.Baricon}
          />
        </TouchableOpacity>
      );
    };

    const renderInput = () => {
      return (
        <View style={{width: '85%'}}>
          <TextInput
            editable={false}
            style={styles.SerchBarInput}
            placeholder="Search"
          />
        </View>
      );
    };

    const renderFilter = () => {
      const onclick = () => {};

      return (
        <TouchableOpacity style={styles.Baricon} onPress={onclick} disabled>
          {/* <Image
            source={require('../../assets/images/searchBar/filter/img.png')}
            style={styles.Baricon}
          /> */}
        </TouchableOpacity>
      );
    };

    return (
      <View style={{marginHorizontal: 15}}>
        <Pressable
          style={({pressed}) => [
            {opacity: pressed ? 0.9 : 1},
            [styles.SerchBarContainer],
          ]}
          onPress={onclickSearchBar}>
          {renderSearch()}
          {renderInput()}
          {renderFilter()}
        </Pressable>
      </View>
    );
  };

  let tripConf = require('../../assets/images/notification/TripConfirmed/img.png');
  let tripCrt = require('../../assets/images/notification/TripCreated/img.png');
  let profileupd = require('../../assets/images/notification/ProfileUpdated/img.png');
  let pswdchng = require('../../assets/images/notification/PasswordChanged/img.png');
  let guest = require('../../assets/images/drawer/guest/img.png');
  let ntfctn = require('../../assets/images/drawer/guest/img.png');

  const ItemView = ({item, index}) => {
    let photo = '';
    let title = item.title || '';
    let subtitle = item.subTitle || '';
    let topic = item.topic || '';
    let create = item.createdAt || '';
    let user = '';
    let userm = '';
    let isread = item.isRead || false;

    if (topic == 'userFollow') {
      user = item.user;
      userm = 'followed you';
      photo = item.photo != '' ? {uri: item.photo} : guest;
    } else {
      photo =
        title == 'Trip Confirmed'
          ? tripConf
          : title == 'Trip Created'
          ? tripCrt
          : title == 'Profile Updated'
          ? profileupd
          : title == 'Password Changed'
          ? pswdchng
          : ntfctn;
    }

    const renderProfile = () => {
      return (
        <>
          {topic == 'userFollow' && (
            <View style={styles.mProfileImgContainer}>
              <ProgressiveFastImage
                style={styles.mProfileImg}
                source={photo}
                loadingImageStyle={styles.mimageLoader}
                loadingSource={require('../../assets/images/imgLoad/img.jpeg')}
                blurRadius={5}
              />
            </View>
          )}

          {topic !== 'userFollow' && (
            <View style={[styles.mProfileImgContainer2]}>
              <Image style={styles.mProfileImg2} source={photo} />
            </View>
          )}
        </>
      );
    };

    const renderText = () => {
      return (
        <View style={[styles.mtextContainer]}>
          {topic == 'userFollow' && (
            <Text
              style={{
                color: '#3C6B49',
                fontSize: 16,
                fontFamily: theme.fonts.fontBold,
                lineHeight: 22.4,
                textTransform: 'capitalize',
              }}>
              {user}{' '}
              <Text
                style={{
                  color: '#101B10',
                  fontSize: 16,
                  fontFamily: theme.fonts.fontBold,
                  lineHeight: 22.4,
                  textTransform: 'none',
                }}>
                {userm}
              </Text>
            </Text>
          )}

          {topic != 'userFollow' && (
            <Text
              style={{
                color: '#101B10',
                fontSize: 16,
                fontFamily: theme.fonts.fontBold,
                lineHeight: 22.4,
                textTransform: 'capitalize',
              }}>
              {title}
            </Text>
          )}

          {subtitle != '' && (
            <View style={{marginTop: 3}}>
              <Text
                style={{
                  color: ' #101B10',
                  fontSize: 14,

                  fontFamily: theme.fonts.fontNormal,

                  lineHeight: 21,
                }}>
                {subtitle}
              </Text>
            </View>
          )}

          <View style={{marginTop: 3}}>
            <Text
              style={{
                color: isread ? theme.color.subTitleLight : '#3C6B49',
                fontSize: 13,

                fontFamily: theme.fonts.fontMedium,

                lineHeight: 19.5,
              }}>
              {create}
            </Text>
          </View>
        </View>
      );
    };

    return (
      <View
        style={[
          styles.modalinfoConatiner,
          {
            marginTop: index == 0 ? 15 : 0,
            borderBottomWidth: index == data.length - 1 ? 0.7 : 0,
            borderBottomColor: theme.color.fieldBorder,
            backgroundColor: isread ? theme.color.background : '#EAF1E3',
          },
        ]}>
        {renderProfile()}
        {renderText()}
      </View>
    );
  };

  const ItemView2 = ({item, index}) => {
    let title = item.title || '';
    let subtitle = item.subTitle || '';
    let topic = item.topic || '';
    let create = item.createdAt || '';
    let isread = item.isRead || false;
    let c = false;

    if (topic == 'fullaccess') {
      c = true;
    }

    let photo =
      title == 'Get full access for free'
        ? pswdchng
        : title == 'Welcome to Trip Trader!'
        ? profileupd
        : ntfctn;

    const renderProfile = () => {
      return (
        <>
          <View style={[styles.mProfileImgContainer2]}>
            <Image style={styles.mProfileImg2} source={photo} />
          </View>
        </>
      );
    };

    const renderText = () => {
      return (
        <View style={[styles.mtextContainer]}>
          <Text
            style={{
              color: '#101B10',
              fontSize: 16,
              fontFamily: theme.fonts.fontBold,
              lineHeight: 22.4,
              textTransform: 'capitalize',
            }}>
            {title}
          </Text>

          {subtitle != '' && (
            <View style={{marginTop: 3}}>
              <Text
                style={{
                  color: ' #101B10',
                  fontSize: 14,

                  fontFamily: theme.fonts.fontNormal,

                  lineHeight: 21,
                }}>
                {subtitle}{' '}
                {c && (
                  <Text
                    onPress={JoinNow}
                    style={{
                      color: theme.color.title,
                      fontSize: 14,
                      textDecorationLine: 'underline',
                      fontFamily: theme.fonts.fontBold,

                      lineHeight: 21,
                    }}>
                    Join now
                  </Text>
                )}
              </Text>
            </View>
          )}

          <View style={{marginTop: 3}}>
            <Text
              style={{
                color: isread ? theme.color.subTitleLight : '#3C6B49',
                fontSize: 13,

                fontFamily: theme.fonts.fontMedium,

                lineHeight: 19.5,
              }}>
              {create}
            </Text>
          </View>
        </View>
      );
    };

    return (
      <View
        style={[
          styles.modalinfoConatiner,
          {
            marginTop: index == 0 ? 15 : 0,
            borderBottomWidth: index == data.length - 1 ? 0.7 : 0,
            borderBottomColor: theme.color.fieldBorder,
            backgroundColor: isread ? theme.color.background : '#EAF1E3',
          },
        ]}>
        {renderProfile()}
        {renderText()}
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
        />
        {!internet && <utils.InternetMessage />}
        <SafeAreaView style={styles.container2}>
          <View style={styles.container3}>
            <FlatList
              contentContainerStyle={{
                paddingTop: 12,
                paddingBottom: 40,
              }}
              data={data}
              renderItem={user == 'guest' ? ItemView2 : ItemView}
              // keyExtractor={(item, index) => index.toString()}
              ListEmptyComponent={EmptyListMessage}
              ItemSeparatorComponent={ItemSeparatorView}
              ListHeaderComponent={ListHeader}
              // ListFooterComponent={ListFooter}
            />
          </View>

          <utils.Footer
            doubleBack={db}
            nav={props.navigation}
            screen={headerTitle}
            focusScreen={store.General.focusScreen}
          />
        </SafeAreaView>
      </View>
    </>
  );
}
