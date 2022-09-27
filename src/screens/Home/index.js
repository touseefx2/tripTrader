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
} from 'react-native';
import ProgressiveFastImage from '@freakycoder/react-native-progressive-fast-image';

import {styles} from './styles';
import {observer} from 'mobx-react';
import store from '../../store/index';
import utils from '../../utils/index';
import theme from '../../theme';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-easy-toast';

export default observer(Home);

const data = [
  {
    _id: 31,
    user: {
      _id: 2,
      first_name: 'mike',
      last_name: 'monuse',
      // photo:"",
      photo:
        'https://www.adobe.com/express/create/media_127540366421d3d5bfcaf8202527ca7d37741fd5d.jpeg?width=400&format=jpeg&optimize=medium',
      avg_rating: 3.8,
      total_reviews: 190,
    },
    title: 'Hunting Trip',
    offer: '3 Day Central N.C. Whitetail Hunting In The Back Country',
    for_trade: 'Alligator or Osceola Turkey ',
    availability: new Date(),
    status: 'pending',
    photos: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHw%3D&w=1000&q=80',
      'https://wallpaperaccess.com/full/1534474.jpg',
      'https://images.wallpapersden.com/image/download/trip-night_a21tZmmUmZqaraWkpJRmbmdlrWZlbWU.jpg',
    ],
    loc: {
      name: 'Dylan, NC',
      coords: [],
    },
  },

  {
    _id: 32,
    user: {
      _id: 7,
      first_name: 'James',
      last_name: 'Bond',
      // photo:"",
      photo:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHw%3D&w=1000&q=80',

      avg_rating: 3.5,
      total_reviews: 100,
    },
    title: 'Fishing Trip',
    offer: '4 Day North Idaho Black Bear Spot and Stalk',
    for_trade: 'Alligator or Osceola Turkey',
    availability: new Date(),
    status: 'pending',
    photos: [
      'https://images.wallpapersden.com/image/download/trip-night_a21tZmmUmZqaraWkpJRmbmdlrWZlbWU.jpg',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHw%3D&w=1000&q=80',
      'https://wallpaperaccess.com/full/1534474.jpg',
    ],
    loc: {
      name: 'Tim, ID',
      coords: [],
    },
  },
];

function Home(props) {
  const toast = useRef(null);
  const toastduration = 700;
  let headerTitle = 'Home';
  let internet = store.General.isInternet;
  let user = store.User.user;
  let goto = store.General.goto;

  const [tripPhotos, settripPhotos] = useState([]);
  const [pvm, setpvm] = useState(false);

  let tagLine = '';

  useEffect(() => {
    if (goto == 'profile') {
      props.navigation.navigate('MyProfile');
    }
  }, []);

  const onClickSaveTrips = (dt, ind) => {};

  const renderStatusBar = () => {
    return (
      <>
        <StatusBar
          translucent={false}
          backgroundColor={theme.color.backgroundGreen}
          barStyle={'light-content'}
        />
      </>
    );
  };

  const ListHeader = () => {
    const onclickSearchBar = () => {};

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
        <View style={{width: '80%'}}>
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
        <TouchableOpacity onPress={onclick} disabled>
          <Image
            source={require('../../assets/images/searchBar/filter/img.png')}
            style={styles.Baricon}
          />
        </TouchableOpacity>
      );
    };

    return (
      <View>
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

  const renderResult = () => {
    let length = data.length || 0;
    return (
      <View style={styles.resultContainer}>
        <Text style={styles.resultText}>Showing {length} trades</Text>
      </View>
    );
  };

  const ItemSeparatorView = () => {
    return (
      <View
        style={{
          height: 20,
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

  const photoClick = dt => {
    settripPhotos(dt);
    setpvm(true);
  };

  const ItemView = ({item, index}) => {
    //user
    let photo = item.user.photo;
    let userName = item.user.first_name + ' ' + item.user.last_name;
    let avgRating = item.user.avg_rating;
    let totalReviews = item.user.total_reviews;
    //trip
    let tripPhotos = item.photos || [];
    let title = item.title || '';
    let offer = item.offer || '';
    let locName = item.loc ? item.loc.name : '';
    let trade = item.for_trade || '';
    let availability = item.availability || '';
    let status = item.status || '';

    const renderSec1 = () => {
      const renderProfile = () => {
        return (
          <View style={styles.ProfileImgContainer}>
            <ProgressiveFastImage
              style={styles.ProfileImg}
              source={
                photo != ''
                  ? {uri: photo}
                  : require('../../assets/images/drawer/guest/img.png')
              }
              loadingImageStyle={styles.imageLoader}
              loadingSource={require('../../assets/images/imgLoad/img.jpeg')}
              blurRadius={5}
            />
          </View>
        );
      };

      const renderText = () => {
        return (
          <View style={styles.textContainer}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.textContainertitle}>
              {userName}
            </Text>

            <View style={{flexDirection: 'row', marginTop: 1}}>
              <utils.vectorIcon.Entypo
                name="star"
                color={theme.color.rate}
                size={14}
              />
              <Text style={styles.textContainerRatetitle1}>
                {' '}
                {avgRating.toFixed(1)}
                {'  '}
              </Text>
              <Text style={styles.textContainerRatetitle2}>
                {totalReviews > 300 ? '300+' : totalReviews} reviews
              </Text>
            </View>
          </View>
        );
      };

      const rendericon = () => {
        return (
          <Pressable
            onPress={() => onClickSaveTrips(item, index)}
            style={({pressed}) => [
              {opacity: pressed ? 0.7 : 1.0},
              styles.iconContainer,
            ]}>
            <Image
              style={styles.iconSave}
              source={require('../../assets/images/addSave/img.png')}
            />
          </Pressable>
        );
      };

      return (
        <View style={styles.boxSection1}>
          {renderProfile()}
          {renderText()}
          {rendericon()}
        </View>
      );
    };

    const renderSec2 = () => {
      const renderTripImages = () => {
        let src =
          tripPhotos.length > 0
            ? {uri: tripPhotos[0]}
            : require('../../assets/images/imgLoad/img.jpeg');

        return (
          <Pressable
            style={({pressed}) => [
              {opacity: pressed ? 0.95 : 1.0},
              [styles.tripImageConatiner],
            ]}
            onPress={() => photoClick(tripPhotos)}>
            <ProgressiveFastImage
              style={styles.tripImg}
              source={src}
              loadingImageStyle={styles.imageLoader}
              loadingSource={require('../../assets/images/imgLoad/img.jpeg')}
              blurRadius={10}
            />
          </Pressable>
        );
      };

      return <View style={styles.boxSection2}>{renderTripImages()}</View>;
    };

    const renderSec3 = () => {
      return (
        <View style={styles.boxSection3}>
          <View style={{width: '100%'}}>
            <Text>{offer}</Text>
            <Text>{locName}</Text>
          </View>

          <View style={{width: '100%', marginTop: 5}}>
            <Text>In Return For</Text>
            <Text>{offer}</Text>
          </View>
        </View>
      );
    };

    return (
      <>
        <View style={[styles.boxContainer, {marginTop: index == 0 ? 7 : 0}]}>
          {renderSec1()}
          {renderSec2()}
          {renderSec3()}
        </View>
      </>
    );
  };

  return (
    <View style={styles.container}>
      {/* {tagLine != '' && <utils.TagLine tagLine={tagLine} />} */}
      <utils.DrawerHeader props={props} headerTitle={headerTitle} />
      {!internet && <utils.InternetMessage />}
      <SafeAreaView style={styles.container2}>
        <View style={styles.container3}>
          <FlatList
            contentContainerStyle={{padding: 15}}
            data={data}
            renderItem={ItemView}
            // keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={EmptyListMessage}
            ItemSeparatorComponent={ItemSeparatorView}
            ListHeaderComponent={ListHeader}
            // ListFooterComponent={ListFooter}
          />

          {/* <ScrollView
            contentContainerStyle={{
              paddingHorizontal: 15,
              paddingVertical: 15,
            }}>




            {renderSearchBar()}
            {renderResult()}
          </ScrollView> */}
        </View>
        <utils.Footer
          nav={props.navigation}
          screen={headerTitle}
          focusScreen={store.General.focusScreen}
        />
      </SafeAreaView>
      {renderStatusBar()}

      {pvm && (
        <utils.FullimageModal
          data={tripPhotos}
          si={0}
          show={pvm}
          pv={tripPhotos[0]}
          setshow={c => setpvm(c)}
          setpv={c => {}}
        />
      )}
      <Toast ref={toast} position="bottom" />
    </View>
  );
}
