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
  Modal as MModal,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Pressable,
} from 'react-native';
import {styles} from './styles';
import {observer} from 'mobx-react';
import store from '../../../store';
import NetInfo from '@react-native-community/netinfo';
import theme from '../../../theme';
import utils from '../../../utils/index';
import moment from 'moment';
import ProgressiveFastImage from '@freakycoder/react-native-progressive-fast-image';

export default observer(Photos);

function Photos(props) {
  let headerTitle = 'Photos';
  let internet = store.General.isInternet;
  let user = store.User.user;
  let data = store.User.photos;
  const totalData = data.length;
  let loader = store.User.photosLoader;

  const [pvm, setpvm] = useState(false);
  const [pv, setpv] = useState('');

  const [getDataOnce, setgetDataOnce] = useState(false);
  const setGetDataOnce = C => {
    setgetDataOnce(C);
  };

  const [refreshing, setRefreshing] = React.useState(false);
  const setrefeshing = c => {
    setRefreshing(c);
  };
  const onRefresh = React.useCallback(() => {
    console.warn('onrefresh cal');
    setRefreshing(true);
    getDbData();
  }, []);

  const getDbData = c => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        const dt = [
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0OqjKG4QLGg-hvzwhf76mCB1shxkUchZN9Q&usqp=CAU',
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbyQRxBY8uSBj1VaS26kR0_7Uk6BJ-YNz4XQ&usqp=CAU',
          'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTV8fHRyYXZlbGxpbmd8ZW58MHx8MHx8&w=1000&q=80',
          'https://www.pixelstalk.net/wp-content/uploads/images6/4K-Travel-Wallpaper-HD-Free-download.jpg',
          'https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
          'https://wallpaperaccess.com/full/1534474.jpg',
          'https://images.wallpapersden.com/image/download/trip-night_a21tZmmUmZqaraWkpJRmbmdlrWZlbWU.jpg',
          'https://wallpaperaccess.com/full/412780.jpg',
        ];
        store.User.attemptToGetPhotos(
          user._id,
          setGetDataOnce,
          setrefeshing,
          dt,
        );
      } else {
        setrefeshing(false);
      }
    });
  };

  useEffect(() => {
    if (!getDataOnce && internet) {
      getDbData();
    }
    return () => {};
  }, [getDataOnce, internet]);

  const photoClick = c => {
    setpv(c);
    setpvm(true);
  };

  const crossClick = () => {};

  const renderShowRes = () => {
    return (
      <View style={{marginVertical: 5}}>
        <Text
          style={{
            fontSize: 13,
            color: theme.color.subTitleLight,
            fontFamily: theme.fonts.fontMedium,
          }}>
          Showing {data.length} of {totalData}
        </Text>
      </View>
    );
  };

  const renderLoader = () => {
    return (
      <View
        style={{
          position: 'absolute',
          top: '45%',
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'center',
        }}>
        <ActivityIndicator size={35} color={theme.color.button1} />
      </View>
    );
  };

  const renderMessage = c => {
    return (
      <View
        style={{
          marginTop: '45%',
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'center',
        }}>
        <Text
          style={{
            fontSize: 14,
            color: theme.color.subTitleLight,
            fontFamily: theme.fonts.fontMedium,
          }}>
          {c == 'empty' ? ' No photos added.' : 'Please connect internet.'}
        </Text>
      </View>
    );
  };

  const renderShowData = ({item, index}) => {
    let photo = item;

    const renderPhotoCross = () => {
      return (
        <Pressable
          style={({pressed}) => [
            {opacity: pressed ? 0.7 : 1.0},
            styles.crossContainer,
          ]}
          onPress={() => console.log('Pressed')}>
          <utils.vectorIcon.Entypo
            name="cross"
            color={'rgba(17, 17, 17, 0.6)'}
            size={17}
          />
        </Pressable>
      );
    };

    return (
      <Pressable
        style={({pressed}) => [
          {opacity: pressed ? 0.9 : 1.0},
          styles.ProfileImgContainer,
        ]}
        onPress={() => photoClick(photo)}>
        <ProgressiveFastImage
          useNativeDriver
          style={styles.ProfileImg}
          source={{uri: photo}}
          loadingImageStyle={styles.imageLoader}
          loadingSource={require('../../../assets/images/imgLoad/img.jpeg')}
          blurRadius={3}
        />
        {renderPhotoCross()}
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* {data.length > 0 && renderShowRes()} */}
      <ScrollView
        style={{marginTop: 10}}
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {getDataOnce && data.length <= 0 && !loader && renderMessage('empty')}
        {!getDataOnce &&
          !internet &&
          !loader &&
          data.length <= 0 &&
          renderMessage('internet')}

        {data.length >= 0 && (
          <FlatList
            showsVerticalScrollIndicator={false}
            // columnWrapperStyle={{justifyContent: 'space-between'}}
            numColumns={3}
            initialNumToRender={18}
            maxToRenderPerBatch={6}
            data={data}
            renderItem={renderShowData}
            keyExtractor={(item, index) => index.toString()}
            // ItemSeparatorComponent={() => {
            //   return (
            //     <View
            //       style={{
            //         height: '100%',
            //         width: '2%',
            //       }}
            //     />
            //   );
            // }}
          />
        )}
      </ScrollView>
      {!getDataOnce && loader && renderLoader()}
      <utils.FullimageModal
        show={pvm}
        pv={pv}
        setshow={c => setpvm(c)}
        setpv={c => setpv(c)}
      />
    </SafeAreaView>
  );
}
