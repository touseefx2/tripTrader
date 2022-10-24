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
  FlatList,
  Pressable,
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

function Sep(props) {
  return <View style={{height: props.height || 20}} />;
}

export default observer(Filters);
function Filters(props) {
  let locSrc = require('../../assets/images/filters/location/img.png');
  let actSrc = require('../../assets/images/filters/activity/img.png');
  let spcSrc = require('../../assets/images/filters/species/img.png');
  const [isShowFilters, setisShowFilters] = useState(false);
  let activeOpacity = 0.8;
  let headerTitle = 'Filters';
  let isModalVisible = props.isVisible;
  let isApplyFilter = false;
  const [isDropDownLoc, setisDropDownLoc] = useState(false);
  const [isDropDownActivity, setisDropDownActivity] = useState(false);
  const [isDropDownSpecies, setisDropDownSpecies] = useState(false);
  const [loc, setloc] = useState(false);
  const [actvty, setactvty] = useState(false);
  const [spcs, setspcs] = useState(false);

  const closeModal = () => {
    props.setisVisible(false);
    closeAllDropDown();
    clearAllDrowdopField();
  };
  const closeAllDropDown = () => {
    setisDropDownLoc(false);
    setisDropDownActivity(false);
    setisDropDownSpecies(false);
  };
  const clearAllDrowdopField = () => {
    setloc(false);
    setactvty(false);
    setspcs(false);
  };
  let tripType = store.Filters.tripType;
  const settripType = c => {
    store.Filters.settripType(c);
  };
  let tripLoc = store.Filters.tripLocation;
  const setripLoc = c => {
    store.Filters.settripLocation(c);
  };
  let activity = store.Filters.activity;
  const setactivity = c => {
    store.Filters.setactivity(c);
  };
  let species = store.Filters.species;
  const setspecies = c => {
    store.Filters.setspecies(c);
  };
  let hostRating = store.Filters.hostRating;
  const sethostRating = c => {
    store.Filters.sethostRating(c);
  };

  const renderStatusBar = () => {
    return (
      <>
        <StatusBar
          translucent={false}
          backgroundColor={theme.color.background}
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
          <TouchableOpacity activeOpacity={activeOpacity}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={[
                styles.headerTitle2,
                {
                  color: isApplyFilter
                    ? theme.color.subTitle
                    : theme.color.subTitleLight,
                },
              ]}>
              Reset
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

    const renderTripTypes = () => {
      const ListHeader = () => {
        return (
          <View style={styles.itemHeader}>
            <View style={{width: '100%'}}>
              <Text
                style={{
                  fontSize: 17,
                  color: '#101B10',
                  fontFamily: theme.fonts.fontBold,
                }}>
                Trip Type
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
              ]}>
              <Text
                style={{
                  fontSize: 14,
                  color: '#30563A',
                  fontFamily: theme.fonts.fontMedium,
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
            numColumns={2}
            columnWrapperStyle={{justifyContent: 'space-between'}}
            data={tripType}
            renderItem={ItemView}
            keyExtractor={(item, index) => index.toString()}
          />
        </>
      );
    };

    const renderDropDownFields = () => {
      const renderShowDropDown = c => {
        let data = [];

        if (c == 'loc') {
          data = tripLoc;
        }
        if (c == 'actvty') {
          data = activity;
        }
        if (c == 'spcs') {
          data = species;
        }

        const onclickSelect = d => {
          if (c == 'loc') {
            setloc(d);
            return;
          }
          if (c == 'actvty') {
            setactvty(d);
            return;
          }
          if (c == 'spcs') {
            setspcs(d);
            return;
          }
        };

        let abs = Platform.OS == 'ios' ? false : true;
        return (
          <utils.DropDown
            search={true}
            data={data}
            onSelectItem={d => {
              onclickSelect(d);
            }}
            setVisible={d => {
              closeAllDropDown();
            }}
            c={c}
            // absolute={abs}
          />
        );
      };

      return (
        <>
          {/* location */}
          <View style={styles.dropDownMainConatiner}>
            <Text style={styles.dropdownFieldTitle}>Trip Location</Text>
            <View style={{width: '100%', marginTop: 5}}>
              <TouchableOpacity
                onPress={() => {
                  closeAllDropDown();
                  setisDropDownLoc(!isDropDownLoc);
                }}
                activeOpacity={activeOpacity}
                style={[styles.dropDowninputConatiner]}>
                <Image style={styles.dropDownIcon} source={locSrc} />

                <View style={{width: '79%'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={[
                      styles.dropDownText,
                      {
                        opacity: !loc ? 0.4 : 1,
                        textTransform: !loc ? 'none' : 'capitalize',
                      },
                    ]}>
                    {!loc ? 'Select state' : loc.name}
                  </Text>
                </View>
                <utils.vectorIcon.Fontisto
                  name="angle-down"
                  color={'#14181F'}
                  size={13}
                />
              </TouchableOpacity>
              {isDropDownLoc && renderShowDropDown('loc')}
            </View>
          </View>
          <Sep />
          {/* Activity */}
          <View style={styles.dropDownMainConatiner}>
            <Text style={styles.dropdownFieldTitle}>Activity</Text>
            <View style={{width: '100%', marginTop: 5}}>
              <TouchableOpacity
                onPress={() => {
                  closeAllDropDown();
                  setisDropDownActivity(!isDropDownActivity);
                }}
                activeOpacity={activeOpacity}
                style={[styles.dropDowninputConatiner]}>
                <Image style={styles.dropDownIcon} source={actSrc} />

                <View style={{width: '79%'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={[
                      styles.dropDownText,
                      {
                        opacity: !actvty ? 0.4 : 1,
                        textTransform: !actvty ? 'none' : 'capitalize',
                      },
                    ]}>
                    {!actvty ? 'Select activity' : !actvty.name}
                  </Text>
                </View>
                <utils.vectorIcon.Fontisto
                  name="angle-down"
                  color={'#14181F'}
                  size={13}
                />
              </TouchableOpacity>
              {isDropDownActivity && renderShowDropDown('actvty')}
            </View>
          </View>
          <Sep />
          {/* Species*/}
          <View style={styles.dropDownMainConatiner}>
            <Text style={styles.dropdownFieldTitle}>Species</Text>
            <View style={{width: '100%', marginTop: 5}}>
              <TouchableOpacity
                onPress={() => {
                  closeAllDropDown();
                  setisDropDownSpecies(!isDropDownSpecies);
                }}
                activeOpacity={activeOpacity}
                style={[styles.dropDowninputConatiner]}>
                <Image style={styles.dropDownIcon} source={spcSrc} />

                <View style={{width: '79%'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={[
                      styles.dropDownText,
                      {
                        opacity: !spcs ? 0.4 : 1,
                        textTransform: !spcs ? 'none' : 'capitalize',
                      },
                    ]}>
                    {!spcs ? 'Select species' : !spcs.name}
                  </Text>
                </View>
                <utils.vectorIcon.Fontisto
                  name="angle-down"
                  color={'#14181F'}
                  size={13}
                />
              </TouchableOpacity>
              {isDropDownSpecies && renderShowDropDown('spcs')}
            </View>
          </View>
          <Sep />
        </>
      );
    };

    const renderBottom = () => {
      return (
        <TouchableOpacity style={styles.bottomFullButtonContainer}>
          <Text style={styles.bottomFullButtonText}>Apply Filters</Text>
        </TouchableOpacity>
      );
    };

    return (
      <>
        {renderHeder()}
        <Sep />
        <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1}}>
          {tripType.length > 0 && renderTripTypes()}
          <Sep />
          {renderDropDownFields()}
          <Sep />
          {renderBottom()}
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
          <utils.Filters
            isVisible={isShowFilters}
            setisVisible={c => setisShowFilters(c)}
          />
        </View>
      </Modal>
    </>
  );
}
