import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StatusBar,
  ScrollView,
  Dimensions,
  FlatList,
  Pressable,
  Alert,
} from 'react-native';
import {styles} from './styles';
import {observer} from 'mobx-react';
import Modal from 'react-native-modal';
import store from '../../store/index';
import utils from '../index';
import theme from '../../theme';
import StarRating from 'react-native-star-rating';
import NetInfo from '@react-native-community/netinfo';

function Sep(props) {
  return <View style={{height: props.height || 20}} />;
}

export default observer(Filters);
function Filters(props) {
  let locSrc = require('../../assets/images/filters/location/img.png');
  let actSrc = require('../../assets/images/filters/activity/img.png');
  let spcSrc = require('../../assets/images/filters/species/img.png');
  let activeOpacity = 0.8;
  let headerTitle = 'Filters';
  let isModalVisible = props.isVisible;
  let isApplyFilter = store.Filters.isFilter;

  const {user} = store.User;
  const {isInternet} = store.General;

  const [rfrsh, setrfrsh] = useState(false);
  const [isFilter, setisFilter] = useState(false);

  const trptype = [...store.Filters.tripType];
  const settripType = c => {
    store.Filters.settripType(c);
  };
  const [isDropDownLoc, setisDropDownLoc] = useState(false);
  const [isDropDownActivity, setisDropDownActivity] = useState(false);
  const [isDropDownSpecies, setisDropDownSpecies] = useState(false);
  const [loc, setloc] = useState(false);
  const [actvty, setactvty] = useState(false);
  const [spcs, setspcs] = useState(false);
  const [host, sethost] = useState(0);
  const [vu, setvu] = useState(false);

  //general
  const tripLoc = store.Filters.tripLocation;
  const activity = store.Filters.activity;
  const species = store.Filters.species;
  //filters
  const stripType = store.Filters.stripType
    ? [...store.Filters.stripType]
    : false;
  const setstripType = c => {
    store.Filters.setstripType(c);
  };
  let stripLoc = store.Filters.stripLocation;
  const setstripLoc = c => {
    store.Filters.setstripLocation(c);
  };
  let sactivity = store.Filters.sactivity;
  const setsactivity = c => {
    store.Filters.setsactivity(c);
  };
  let sspecies = store.Filters.sspecies;
  const setsspecies = c => {
    store.Filters.setsspecies(c);
  };
  let shostRating = store.Filters.shostRating;
  const setshostRating = c => {
    store.Filters.setshostRating(c);
  };
  let svu = store.Filters.svu;
  const setsvu = c => {
    store.Filters.setsvu(c);
  };

  //selct trip khud hi chnage hta ja ra
  useEffect(() => {
    if (isApplyFilter && isModalVisible) {
      const stt = stripType != false ? [...stripType] : false;
      if (stt != false) {
        let ST = [];
        if (stt.length > 0) {
          stt.map((e, i, a) => {
            ST.push(e);
          });
        }

        const dt = [...trptype];

        if (dt.length > 0) {
          dt.map((e, i, a) => {
            if (ST.length > 0) {
              let index = ST.findIndex(d => d === e.name);
              if (index > -1) {
                dt[i].isSel = true;
              } else {
                dt[i].isSel = false;
              }
            }
          });
        }
      }

      if (stripLoc) {
        setloc(stripLoc);
      }

      if (sactivity) {
        if (activity.length > 0) {
          let index = activity.findIndex(e => e.name === sactivity);
          if (index > -1) {
            setactvty(activity[index]);
          }
        }
      }

      if (sspecies) {
        if (species.length > 0) {
          let index = species.findIndex(e => e.name === sspecies);
          if (index > -1) {
            setspcs(species[index]);
          }
        }
      }

      sethost(shostRating);
      setvu(svu);
    }
  }, [isApplyFilter, isModalVisible]);

  useEffect(() => {
    if (isModalVisible) {
      let chk = false;
      // const dt = [...trptype];
      // if (dt.length > 0) {
      //   dt.map((e, i, a) => {
      //     if (e.isSel == true) {
      //       chk = true;
      //       return;
      //     }
      //   });
      // }
      if (loc) {
        chk = true;
      }
      if (actvty) {
        chk = true;
      }
      if (spcs) {
        chk = true;
      }
      if (host > 0) {
        chk = true;
      }

      if (vu) {
        chk = true;
      }

      setisFilter(chk);
    }
  }, [isModalVisible, trptype, loc, actvty, spcs, host]);

  const onrefrshdata = () => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        if (user == 'guest') {
          store.User.attemptToGetHomeTripsGuest(c => props.setGetDataOnce(c));
        } else {
          store.User.attemptToGetHomeTripsSearch(
            c => props.setGetDataOnce(c),
            props.blckUser,
            '',
          );
        }
      } else {
        Alert.alert('Please connect internet');
      }
    });
  };

  const onClickApplyFilters = () => {
    if (isInternet) {
      let chk = false;
      // let tt = [];
      // const dt = [...trptype];
      // if (dt.length > 0) {
      //   dt.map((e, i, a) => {
      //     if (e.isSel == true) {
      //       tt.push(e.name);
      //     }
      //   });
      // }

      // if (tt.length > 0) {
      //   chk = true;
      //   setstripType(tt);
      // } else {
      //   setstripType(false);
      // }

      if (loc) {
        chk = true;
        setstripLoc(loc);
      } else {
        setstripLoc(false);
      }

      if (actvty) {
        chk = true;
        setsactivity(actvty.name);
      } else {
        setsactivity(false);
      }

      if (spcs) {
        chk = true;
        setsspecies(spcs.name);
      } else {
        setsspecies(false);
      }

      if (host > 0) {
        chk = true;
      }
      setshostRating(host);

      if (vu) {
        chk = true;
      }
      setsvu(vu);

      if (chk) {
        store.Filters.setisFilter(true);
        props.setisVisible(false);
        onrefrshdata();
      } else {
        store.Filters.setisFilter(false);
        props.setisVisible(false);
        store.Filters.clearFilters();
        onrefrshdata();
      }
    } else {
      Alert.alert('Please connect internet');
    }
  };

  const resetFilters = () => {
    closeAllDropDown();
    clearAllDrowdopField();
    sethost(0);
    setvu(false);
    const dt = [...trptype];
    if (dt.length > 0) {
      dt.map((e, i, a) => {
        e.isSel = false;
      });
    }
    settripType(dt);
  };

  const closeModal = () => {
    props.setisVisible(false);
    closeAllDropDown();
    clearAllDrowdopField();
    sethost(0);
    setvu(false);
    const dt = [...trptype];
    if (dt.length > 0) {
      dt.map((e, i, a) => {
        e.isSel = false;
      });
    }
    settripType(dt);
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

  console.log('isFilter : ', isFilter);

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
            onPress={resetFilters}
            disabled={isFilter ? false : true}
            activeOpacity={activeOpacity}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={[
                styles.headerTitle2,
                {
                  color: isFilter
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

    const renderVerifedchk = () => {
      return (
        <View style={styles.Field2}>
          <TouchableOpacity
            style={{
              width: 23,
              height: 23,
              borderRadius: 4,
              backgroundColor: !vu ? 'white' : theme.color.button1,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: theme.color.fieldBorder,
            }}
            activeOpacity={0.5}
            onPress={() => setvu(!vu)}>
            {vu && (
              <utils.vectorIcon.FontAwesome5
                name={'check'}
                color={theme.color.buttonText}
                size={11}
              />
            )}
          </TouchableOpacity>
          <Text style={styles.Field2Title}>Show verified users only</Text>
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
                Popular Filters
              </Text>
            </View>
          </View>
        );
      };

      const ItemView = ({item, index}) => {
        const onClickItem = () => {
          const dt = [...trptype];
          dt[index].isSel = !dt[index].isSel;
          settripType(dt);
          setrfrsh(!rfrsh);
        };

        let title = item.name;
        let isSel = item.isSel;
        return (
          <>
            <Pressable
              onPress={() => onClickItem(index)}
              style={({pressed}) => [
                {
                  opacity: pressed ? activeOpacity : 1,
                },

                [
                  styles.itemContainer2,
                  {
                    backgroundColor: !isSel
                      ? theme.color.button2
                      : theme.color.button1,
                  },
                ],
              ]}>
              <Text
                style={{
                  fontSize: 14,
                  color: !isSel ? '#30563A' : '#FAFAFA',
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
            extraData={rfrsh}
            columnWrapperStyle={{justifyContent: 'space-between'}}
            data={trptype}
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
                    {!actvty ? 'Select activity' : actvty.name}
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
                    {!spcs ? 'Select species' : spcs.name}
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
        </>
      );
    };

    const renderHosting = () => {
      const ListHeader = () => {
        return (
          <View style={styles.itemHeader}>
            <View style={{width: '100%'}}>
              <Text
                style={{
                  fontSize: 16,
                  color: '#101B10',
                  fontFamily: theme.fonts.fontBold,
                  textTransform: 'capitalize',
                }}>
                Host Rating
              </Text>
            </View>
          </View>
        );
      };

      const renderRating = () => {
        return (
          <View
            style={{
              width: '46%',
              marginTop: 10,
            }}>
            <StarRating
              starSize={27}
              disabled={false}
              maxStars={5}
              rating={host}
              selectedStar={rating => sethost(rating)}
              emptyStarColor={'rgba(17, 17, 17, 0.3)'}
              fullStarColor={'#FCBC17'}
              emptyStar={'star'}
              fullStar={'star'}
              iconSet={'FontAwesome'}
            />
          </View>
        );
      };

      return (
        <>
          {ListHeader()}
          {renderRating()}
        </>
      );
    };

    const renderBottom = () => {
      return (
        <TouchableOpacity
          onPress={onClickApplyFilters}
          style={[styles.bottomFullButtonContainer]}>
          <Text style={styles.bottomFullButtonText}>Apply Filters</Text>
        </TouchableOpacity>
      );
    };

    return (
      <>
        {renderHeder()}
        <Sep />
        <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1}}>
          {renderVerifedchk()}
          <Sep />
          {/* {trptype.length > 0 && renderTripTypes()} */}
          <Sep />
          {renderDropDownFields()}
          <Sep />
          {renderHosting()}
          <Sep height={30} />
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
        </View>
      </Modal>
    </>
  );
}
