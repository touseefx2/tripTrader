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

export default observer(Inbox);

function Inbox(props) {
  let maxModalHeight = theme.window.Height - 100;
  const [modalHeight, setmodalHeight] = useState(0);

  let headerTitle = 'Inbox';

  let internet = store.General.isInternet;
  let user = store.User.user;

  const [data, setdata] = useState([]);

  useEffect(() => {
    const dt = [
      {
        userName: 'Fransisco Fred',
        message: 'Hey! I had a question about trade...',
        createdAt: 'Just now',
        photo: '',

        isRead: false,
      },
      {
        userName: 'Mike Manuse',
        message: 'Hey, do you want to trade a turkey hunt?',
        createdAt: 'Mar 25',
        isRead: true,
        photo:
          'https://expertphotography.b-cdn.net/wp-content/uploads/2020/08/social-media-profile-photos-10.jpg',
      },
      {
        userName: 'Jack Maw',
        message: 'Hey! I had a question about your trade...',
        createdAt: 'Mar 7',
        isRead: true,
        photo:
          'https://cdn140.picsart.com/76886237758523202417.png?type=webp&to=min&r=-1x-1',
      },
      {
        userName: 'Dylan Brown',
        message: 'Hello, good morning :)',
        createdAt: 'Feb 13',
        isRead: true,
      },
    ];

    setdata(dt);

    return () => {};
  }, []);

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
    const renderResult = () => {
      let length = data.length || 0;
      return (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>{length} messages, 1 unread</Text>
        </View>
      );
    };

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
        {data.length > 0 && renderResult()}
      </View>
    );
  };

  let guest = require('../../assets/images/drawer/guest/img.png');

  const ItemView = ({item, index}) => {
    let photo = '';
    let title = item.userName || '';
    let subtitle = item.message || '';
    let create = item.createdAt || '';
    let isread = item.isRead;
    photo = item.photo && item.photo != '' ? {uri: item.photo} : guest;

    const renderProfile = () => {
      return (
        <>
          <View style={styles.mProfileImgContainer}>
            <ProgressiveFastImage
              style={styles.mProfileImg}
              source={photo}
              loadingImageStyle={styles.mimageLoader}
              loadingSource={require('../../assets/images/imgLoad/img.jpeg')}
              blurRadius={5}
            />
          </View>
        </>
      );
    };

    const renderText = () => {
      return (
        <View style={[styles.mtextContainer]}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{width: '74%'}}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  color: '#101B10',
                  fontSize: 16,
                  fontFamily: theme.fonts.fontBold,
                  lineHeight: 22.4,
                  textTransform: 'capitalize',
                }}>
                {title}
              </Text>
            </View>
            <View
              style={{
                width: '24%',

                alignItems: 'flex-end',
              }}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  color: isread ? theme.color.subTitleLight : '#3C6B49',
                  fontSize: 13,

                  fontFamily: theme.fonts.fontMedium,

                  lineHeight: 22.4,
                }}>
                {create}
              </Text>
            </View>
          </View>

          <View style={{marginTop: 3, width: '91%'}}>
            <Text
              numberOfLines={2}
              ellipsizeMode="tail"
              style={{
                color: isread ? theme.color.subTitleLight : '#101B10',
                fontSize: 14,

                fontFamily: theme.fonts.fontMedium,

                lineHeight: 21,
              }}>
              {subtitle}
            </Text>
          </View>
        </View>
      );
    };

    return (
      <Pressable
        onPress={() => {}}
        style={({pressed}) => [
          {opacity: pressed ? 0.8 : 1.0},
          [
            styles.modalinfoConatiner,
            {
              marginTop: index == 0 ? 10 : 0,
              borderBottomWidth: index == data.length - 1 ? 0.7 : 0,
              borderBottomColor: theme.color.fieldBorder,
              backgroundColor: isread ? theme.color.background : '#EAF1E3',
            },
          ],
        ]}>
        {renderProfile()}
        {renderText()}
      </Pressable>
    );
  };

  const ListFooter = () => {
    return (
      <>
        <View>
          <View style={styles.listFooter}>
            <Text style={styles.listFooterT}>End of messages</Text>
          </View>
        </View>
      </>
    );
  };

  return (
    <>
      <View style={styles.container}>
        <utils.DrawerHeader props={props} headerTitle={headerTitle} />
        {!internet && <utils.InternetMessage />}
        <SafeAreaView style={styles.container2}>
          <View style={styles.container3}>
            <FlatList
              contentContainerStyle={{
                paddingTop: 12,
                paddingBottom: 40,
              }}
              data={data}
              renderItem={ItemView}
              keyExtractor={(item, index) => index.toString()}
              ListEmptyComponent={EmptyListMessage}
              ItemSeparatorComponent={ItemSeparatorView}
              ListHeaderComponent={ListHeader}
              ListFooterComponent={ListFooter}
            />
          </View>

          <utils.Footer
            nav={props.navigation}
            screen={headerTitle}
            focusScreen={store.General.focusScreen}
          />
        </SafeAreaView>
      </View>
    </>
  );
}
