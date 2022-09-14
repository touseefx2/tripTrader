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
  FlatList,
  TextInput,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import Geocoder from 'react-native-geocoding';
import {styles} from './styles';
import {observer} from 'mobx-react';
import store from '../../store/index';
import utils from '../../utils/index';
import theme from '../../theme';
import DynamicTabView from 'react-native-dynamic-tab-view';
import ImageSlider from 'react-native-image-slider';
import FastImage from 'react-native-fast-image';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-easy-toast';
import MaskedView from '@react-native-community/masked-view';
import Svg, {Path} from 'react-native-svg';
import RBSheet from 'react-native-raw-bottom-sheet';

import {ScrollView} from 'react-native-gesture-handler';

export default observer(Search);
function Search(props) {
  const toast = useRef(null);
  const toastduration = 700;

  // let screen = props.route.params.screen || '';

  let internet = store.General.isInternet;
  let loc = store.User.location;

  const [search, setsearch] = useState('');
  const [data, setdata] = useState(props.route.params.data || []);
  const [filteredData, setfilteredData] = useState([]);

  const renderHeader = () => {
    const onClickBack = () => {
      props.navigation.goBack();
    };

    const renderBack = () => {
      return (
        <TouchableOpacity
          style={{width: '10%'}}
          activeOpacity={0.6}
          onPress={onClickBack}>
          <utils.vectorIcon.Ionicons
            name="arrow-back-sharp"
            color={theme.color.button1}
            size={24}
          />
        </TouchableOpacity>
      );
    };

    const Search = searchText => {
      setsearch(searchText);
      if (data.length > 0 && searchText != '') {
        let fd = data.filter(function (item) {
          console.log('name : ', item.name);
          console.log('s : ', searchText.toLowerCase());
          return item.name.toLowerCase().includes(searchText.toLowerCase());
        });
        setfilteredData(fd);
      } else {
        setfilteredData([]);
      }
    };

    const renderSearch = () => {
      return (
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for restaurants"
            defaultValue={search}
            value={search}
            onChangeText={t => {
              Search(t);
            }}
          />
          {search != '' && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => {
                setsearch('');
              }}>
              <View style={styles.clearButton2}>
                <utils.vectorIcon.Entypo
                  name="cross"
                  color={theme.color.subTitleLight}
                  size={15}
                />
              </View>
            </TouchableOpacity>
          )}
        </View>
      );
    };

    let styl =
      Platform.OS == 'android'
        ? styles.headerConatainer
        : [
            styles.headerConatainer,
            {
              shadowColor: '#000',
              shadowOffset: {width: 0, height: 1},
              shadowOpacity: 0.8,
              shadowRadius: 1,
            },
          ];
    return (
      <View style={styl}>
        {renderBack()}
        {renderSearch()}
      </View>
    );
  };

  const renderMain = () => {
    const renderResturants = (item, index, dt, c) => {
      let chk = c || '';
      let name = item.name || '';
      let ar = item.rating.average_rating || 0;
      let tr = item.rating.total_reviews;
      let type = item.type || '';
      let dc = item.delivery_charges || 0;
      let distance = item.distance || 0;
      let travel_time = item.travel_time || 0;
      let img = item.image;

      const rednerDistance = () => {
        return (
          <View style={styles.disContaniner}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.disContaninerText}>
              {travel_time} min
            </Text>
          </View>
        );
      };

      const renderHeart = () => {
        return (
          <View style={styles.heartContaniner}>
            <utils.vectorIcon.AntDesign
              name="hearto"
              color={theme.color.subTitle}
              size={15}
            />
          </View>
        );
      };

      let styl =
        chk == ''
          ? [
              styles.efcContainer,
              {
                marginLeft: index <= 0 ? 20 : 10,
                marginRight: index == dt.length - 1 ? 20 : 0,
              },
            ]
          : [
              styles.efcContainerAll,
              {
                // marginLeft: index <= 0 ? 20 : 10,
                // marginRight: index == dt.length - 1 ? 20 : 0,
              },
            ];
      let efc1sty = chk == '' ? styles.efc1 : styles.efc1All;

      return (
        <View style={styl}>
          <View style={efc1sty}>
            <Image source={img} style={styles.efcImage} />
            {rednerDistance()}
            {renderHeart()}
          </View>

          <View style={styles.efc2}>
            <View style={styles.efc21}>
              <View style={{width: '63%'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles.efc21Text1}>
                  {name}
                </Text>
              </View>
              <View
                style={{
                  width: '35%',
                  justifyContent: 'flex-end',
                  flexDirection: 'row',
                }}>
                <utils.vectorIcon.Entypo
                  name="star"
                  color={theme.color.rate}
                  size={14}
                />
                <Text style={styles.efc21Text2}>{ar}</Text>
                <Text
                  style={[
                    styles.efc21Text2,
                    {color: theme.color.subTitleLight},
                  ]}>
                  ({tr > 500 ? '500+' : tr})
                </Text>
              </View>
            </View>

            <View style={styles.efc22}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.efc22Text1}>
                $$ • {type}
              </Text>
            </View>

            <View style={styles.efc33}>
              <utils.vectorIcon.MaterialIcons
                name="delivery-dining"
                color={theme.color.subTitleLight}
                size={18}
              />
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.efc33Text1}>
                Rs. {dc}
              </Text>
            </View>
          </View>
        </View>
      );
    };

    return (
      <>
        {filteredData.length > 0 && (
          <>
            <Text style={styles.mainSecText}>
              {filteredData.length} resturants with "{search}"
            </Text>

            <FlatList
              contentContainerStyle={{paddingHorizontal: 20}}
              showsVerticalScrollIndicator
              data={filteredData}
              renderItem={({item, index}) =>
                renderResturants(item, index, filteredData, 'all')
              }
              keyExtractor={(item, index) => {
                return index.toString();
              }}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              removeClippedSubviews={true}
            />

            <View style={{height: 20}} />
          </>
        )}
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      {renderMain()}

      <Toast ref={toast} position="bottom" />
    </SafeAreaView>
  );
}
