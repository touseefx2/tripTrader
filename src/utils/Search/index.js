import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  TextInput,
  Pressable,
  FlatList,
} from 'react-native';
import {styles} from './styles';
import {observer} from 'mobx-react';
import Modal from 'react-native-modal';
import store from '../../store/index';
import utils from '../index';
import theme from '../../theme';
import FastImage from 'react-native-fast-image';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-easy-toast';
import MaskedView from '@react-native-community/masked-view';
import Svg, {Path} from 'react-native-svg';
import {responsiveHeight} from 'react-native-responsive-dimensions';
import {Utils} from '@react-native-firebase/app';

export default observer(Search);

function Sep(props) {
  return <View style={{height: props.height || 20}} />;
}

function Search(props) {
  const [isShowFilters, setisShowFilters] = useState(false);
  const [rfrsh, setrfrsh] = useState(false);
  const [modalHeight, setmodalHeight] = useState(0);
  let activeOpacity = 0.8;
  let headerTitle = 'Search';
  let isModalVisible = props.isVisible;
  let maxModalHeight = 280;
  const closeModal = () => {
    props.setisVisible(false);
    setSearch('');
    setmodalHeight(0);
  };

  let search = store.Search.search;
  const setSearch = c => {
    store.Search.setSearch(c);
  };
  let recentSearch = store.Search.recentSearch;
  const setrecentSearch = c => {
    store.Search.setrecentSearch(c);
  };
  let popularSearch = store.Search.popularSearch;
  const setpopularSearch = c => {
    store.Search.setpopularSearch(c);
  };

  const renderStatusBar = () => {
    return (
      <>
        <StatusBar
          translucent={false}
          backgroundColor={theme.color.backgroundConatiner}
          barStyle={'dark-content'}
        />
      </>
    );
  };

  const renderContent = () => {
    const renderHeder = () => {
      const render1 = () => {
        let src = require('../../assets/images/back/imgg.png');
        return (
          <TouchableOpacity activeOpacity={activeOpacity} onPress={closeModal}>
            <Image source={src} style={styles.headerIcon} />
          </TouchableOpacity>
        );
      };

      const render2 = () => {
        return (
          <View
            style={{
              width: '50%',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.headerTitle}>
              {headerTitle}
            </Text>
          </View>
        );
      };

      const render3 = () => {
        return (
          <TouchableOpacity
            onPress={() => setisShowFilters(true)}
            activeOpacity={activeOpacity}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.headerTitle2}>
              Filters
            </Text>
          </TouchableOpacity>
        );
      };

      return (
        <View style={styles.headerConatainer}>
          {render1()}
          {render2()}
          {render3()}
        </View>
      );
    };

    const renderSearchBar = () => {
      const renderSearchIcon = () => {
        let src = require('../../assets/images/searchBar/search/img.png');
        return <Image source={src} style={styles.SerchBaricon} />;
      };

      const renderInput = () => {
        return (
          <View style={{width: '91%'}}>
            <TextInput
              onSubmitEditing={() => {}}
              returnKeyType={'search'}
              style={styles.SerchBarInput}
              placeholder="Search"
              placeholderTextColor={theme.color.subTitleLight}
              value={search}
              onChangeText={t => setSearch(t)}
            />
          </View>
        );
      };

      return (
        <View style={styles.SerchBarContainer}>
          {renderSearchIcon()}
          {renderInput()}
        </View>
      );
    };

    const renderRecentSearch = () => {
      let c = modalHeight >= maxModalHeight ? true : false;
      let style = c ? {height: maxModalHeight} : {};

      const ItemSeparatorView = () => {
        return (
          <View
            style={{
              width: '100%',
              height: 1,
              backgroundColor: theme.color.fieldBorder,
            }}
          />
        );
      };

      const ListHeader = () => {
        return (
          <View style={styles.itemHeader}>
            <View style={{width: '70%'}}>
              <Text
                style={{
                  fontSize: 15.64,
                  color: theme.color.subTitleLight,
                  fontFamily: theme.fonts.fontNormal,
                }}>
                Recent searches
              </Text>
            </View>

            <Pressable
              onPress={clearAll}
              style={({pressed}) => [{opacity: pressed ? activeOpacity : 1}]}>
              <Text
                style={{
                  fontSize: 14,
                  color: theme.color.subTitle,
                  fontFamily: theme.fonts.fontBold,
                }}>
                Clear all
              </Text>
            </Pressable>
          </View>
        );
      };

      const clearSearch = index => {
        let dt = store.Search.recentSearch.slice();
        dt.splice(index, 1);
        setrecentSearch(dt);
        setrfrsh(!rfrsh);
      };

      const clearAll = () => {
        let dt = [];

        setrecentSearch(dt);
        setrfrsh(!rfrsh);
      };

      const ItemView = ({item, index}) => {
        let title = item;

        return (
          <>
            <View
              style={[
                styles.itemContainer,
                {
                  borderBottomWidth: index == recentSearch.length - 1 ? 1 : 0,
                  borderBottomColor: theme.color.fieldBorder,
                },
              ]}>
              <Pressable
                onPress={() => setSearch(item)}
                style={({pressed}) => [
                  {
                    opacity: pressed ? activeOpacity : 1,
                    width: '80%',
                  },
                ]}>
                <Text
                  style={{
                    fontSize: 15.64,
                    color: '#101B10',
                    fontFamily: theme.fonts.fontNormal,
                    textTransform: 'capitalize',
                  }}>
                  {title}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => clearSearch(index)}
                style={({pressed}) => [
                  {
                    opacity: pressed ? activeOpacity : 1,
                    width: '11%',
                  },
                ]}>
                <utils.vectorIcon.Ionicons
                  name="ios-close-outline"
                  color={theme.color.subTitleLight}
                  size={20}
                />
              </Pressable>
            </View>
          </>
        );
      };

      return (
        <>
          {ListHeader()}
          <View
            onLayout={event => {
              if (!c) {
                let {height} = event.nativeEvent.layout;

                setmodalHeight(height);
              }
            }}
            style={style}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={recentSearch}
              extraData={rfrsh}
              renderItem={ItemView}
              keyExtractor={(item, index) => index.toString()}
              ItemSeparatorComponent={ItemSeparatorView}
            />
          </View>
        </>
      );
    };

    const renderPopularSearch = () => {
      const ItemSeparatorView = () => {
        return (
          <View
            style={{
              width: 10,
            }}
          />
        );
      };

      const ListHeader = () => {
        return (
          <View style={styles.itemHeader}>
            <View style={{width: '100%'}}>
              <Text
                style={{
                  fontSize: 18,
                  color: '#313131',
                  fontFamily: theme.fonts.fontBold,
                }}>
                Popular Searches
              </Text>
            </View>
          </View>
        );
      };

      const ItemView = ({item, index}) => {
        let title = item;

        return (
          <>
            <Pressable
              style={({pressed}) => [
                {
                  opacity: pressed ? activeOpacity : 1,
                },

                styles.itemContainer2,
              ]}
              onPress={() => setSearch(item)}>
              <Text
                style={{
                  fontSize: 14,
                  color: '#FAFAFA',
                  fontFamily: theme.fonts.fontBold,
                  textTransform: 'capitalize',
                }}>
                {title}
              </Text>
            </Pressable>
          </>
        );
      };

      return (
        <>
          {ListHeader()}
          <FlatList
            contentContainerStyle={{flexShrink: 1, flexWrap: 'wrap'}}
            horizontal
            showsHorizontalScrollIndicator={false}
            data={popularSearch}
            renderItem={ItemView}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={ItemSeparatorView}
          />
        </>
      );
    };

    return (
      <>
        {renderHeder()}
        <Sep />
        <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1}}>
          {renderSearchBar()}
          <Sep />
          {recentSearch.length > 0 && renderRecentSearch()}
          <Sep />
          {popularSearch.length > 0 && renderPopularSearch()}
          <Sep />
        </ScrollView>
      </>
    );
  };

  return (
    <>
      <Modal
        isVisible={isModalVisible}
        backdropOpacity={1}
        backdropColor="white"
        animationIn="fadeIn"
        animationOut="fadeOut"
        coverScreen={false}
        deviceHeight={Dimensions.get('screen').height}
        style={{padding: 0, margin: 0}}
        onBackButtonPress={closeModal}>
        <View style={styles.mainContainer}>
          {renderStatusBar()}
          {renderContent()}
          {isShowFilters && (
            <utils.Filters
              isVisible={isShowFilters}
              setisVisible={c => setisShowFilters(c)}
            />
          )}
        </View>
      </Modal>
    </>
  );
}
