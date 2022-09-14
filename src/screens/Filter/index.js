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

export default observer(Filter);

function Filter(props) {
  const toast = useRef(null);
  const toastduration = 700;

  // let screen = props.route.params.screen || '';

  let internet = store.General.isInternet;
  let loc = store.User.location;

  let filter = store.Resturants.filter;

  const op = [
    {
      name: 'sort',
      d: [
        {name: 'recommended', isSel: true},
        {name: 'top rated', isSel: false},
        {name: 'distance', isSel: false},
      ],
      isMulti: false,
    },
    {
      name: 'cuisines',
      d: [
        {
          name: 'american',
          isSel: false,
        },
        {
          name: 'seafood',
          isSel: false,
        },
        {
          name: 'shawarma',
          isSel: false,
        },
        {
          name: 'bbq',
          isSel: false,
        },
        {
          name: 'chinese',
          isSel: false,
        },
        {
          name: 'pizza',
          isSel: false,
        },
        {
          name: 'fast food',
          isSel: false,
        },
        {
          name: 'indian',
          isSel: false,
        },
        {
          name: 'italian',
          isSel: false,
        },
        {
          name: 'pakistani',
          isSel: false,
        },
      ],
      isMulti: true,
    },
    {
      name: 'price',
      d: [
        {name: '$', isSel: false},
        {name: '$$', isSel: false},
        {name: '$$$', isSel: false},
      ],
      isMulti: true,
    },
  ];

  const [options, setoptions] = useState(filter.length > 0 ? filter : op);

  // const [so, setso] = useState(options[0]);

  const [FilterLength, setFilterLength] = useState(0);

  // const renderTopTab = () => {
  //   return (
  //     <>
  //       <View style={styles.topTabContainer}>
  //         {options.length > 0 &&
  //           options.map((e, i, a) => {
  //             return (
  //               <TouchableOpacity
  //                 activeOpacity={0.6}
  //                 onPress={() => setso(e)}
  //                 style={[
  //                   styles.topTabOption,
  //                   {borderBottomWidth: e.name == so.name ? 2 : 0},
  //                 ]}>
  //                 <Text
  //                   style={[
  //                     styles.topTabOptionText,
  //                     {
  //                       color:
  //                         e.name == so.name
  //                           ? theme.color.button1
  //                           : theme.color.title,
  //                     },
  //                   ]}>
  //                   {e.name}
  //                 </Text>
  //               </TouchableOpacity>
  //             );
  //           })}
  //       </View>
  //     </>
  //   );
  // };

  useEffect(() => {
    if (options.length > 0) {
      let l = 0;
      options.map((e, i, a) => {
        if (e.d.length > 0) {
          e.d.map((ee, ii, aa) => {
            if (ee.isSel == true) {
              if (ee.name != 'recommended') {
                l++;
              }
            }
          });
        }
      });
      setFilterLength(l);
    }
  }, [options]);

  const goBack = () => {
    props.navigation.goBack();
  };

  const renderHeader = () => {
    const renderBack = () => {
      return (
        <TouchableOpacity
          style={{width: '10%'}}
          activeOpacity={0.6}
          onPress={goBack}>
          <utils.vectorIcon.Ionicons
            name="arrow-back-sharp"
            color={theme.color.button1}
            size={24}
          />
        </TouchableOpacity>
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
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {renderBack()}
          <Text style={styles.headerTitle}>Filter</Text>
        </View>
        {/* {renderTopTab()} */}
      </View>
    );
  };

  const renderMain = () => {
    const clearAll = () => {
      setoptions(op);
    };

    const apply = () => {
      if (FilterLength <= 0) {
        store.Resturants.setfilter([]);
        goBack();
        return;
      }
      store.Resturants.setfilter(options);
      goBack();
    };

    const onselect = (fa, sa, isMulti) => {
      let dt = options.slice();
      if (!isMulti) {
        dt[fa].d.map((e, i, a) => {
          if (i == sa) {
            e.isSel = true;
          } else {
            e.isSel = false;
          }
        });

        setoptions(dt);
      }

      if (isMulti) {
        dt[fa].d[sa].isSel = !dt[fa].d[sa].isSel;
        setoptions(dt);
      }
    };

    const renderOptionData = (d, chk, f) => {
      return (
        <>
          {d.map((e, i, a) => {
            return (
              <>
                {(chk == 'sort' || chk == 'cuisines') && (
                  <TouchableOpacity
                    onPress={() => {
                      onselect(f, i, chk == 'sort' ? false : true);
                    }}
                    activeOpacity={0.5}
                    style={styles.optaionDataContainer}>
                    <View style={{width: '85%'}}>
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={[
                          styles.optaionDataContainerTitle,
                          {
                            fontFamily: !e.isSel
                              ? theme.fonts.fontNormal
                              : theme.fonts.fontMedium,
                          },
                        ]}>
                        {e.name}
                      </Text>
                    </View>

                    {chk == 'sort' && (
                      <utils.vectorIcon.MaterialCommunityIcons
                        name={
                          !e.isSel
                            ? 'checkbox-blank-circle-outline'
                            : 'record-circle'
                        }
                        color={theme.color.button1}
                        size={24}
                      />
                    )}

                    {chk == 'cuisines' && (
                      <>
                        {e.isSel ? (
                          <utils.vectorIcon.Ionicons
                            name={'ios-checkbox'}
                            color={theme.color.button1}
                            size={24}
                          />
                        ) : (
                          <utils.vectorIcon.Fontisto
                            name={'checkbox-passive'}
                            color={theme.color.button1}
                            size={20}
                          />
                        )}
                      </>
                    )}
                  </TouchableOpacity>
                )}

                {chk == 'price' && (
                  <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => {
                      onselect(f, i, true);
                    }}
                    style={[
                      styles.optaionDataContainerr,
                      {
                        backgroundColor: e.isSel
                          ? theme.color.button1
                          : theme.color.background,
                      },
                    ]}>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={[
                        styles.optaionDataContainerTitle,
                        {
                          fontFamily: !e.isSel
                            ? theme.fonts.fontNormal
                            : theme.fonts.fontMedium,
                          color: e.isSel
                            ? theme.color.buttonText
                            : theme.color.title,
                        },
                      ]}>
                      {e.name}
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            );
          })}
        </>
      );
    };

    const renderBottom = () => {
      const renderCircle = () => {
        return (
          <View style={styles.circleC}>
            <Text style={styles.circleCText}>
              {FilterLength > 99 ? '99+' : FilterLength}
            </Text>
          </View>
        );
      };

      return (
        <View style={styles.bottomConatiner}>
          {FilterLength > 0 && (
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => {
                clearAll();
              }}>
              <Text style={styles.bottomConatinerText}>Clear All</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            activeOpacity={0.6}
            onPress={apply}
            style={[
              styles.bottomConatinerButC,
              {width: FilterLength > 0 ? '72%' : '100%'},
            ]}>
            <Text style={styles.bottomConatinerButCText}>
              {FilterLength > 0 ? 'APPLY FILTERS' : 'Apply'}
            </Text>
            {FilterLength > 0 && renderCircle()}
          </TouchableOpacity>
        </View>
      );
    };

    return (
      <>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{padding: 20}}>
          {options.length > 0 &&
            options.map((e, i, a) => {
              return (
                <>
                  <Text style={styles.mainTitle}>{e.name}</Text>
                  <View style={{height: 15}} />
                  {e.d.length > 0 && (
                    <>
                      {(e.name == 'sort' || e.name == 'cuisines') &&
                        renderOptionData(e.d, e.name, i)}
                      {e.name == 'price' && (
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}>
                          {renderOptionData(e.d, e.name, i)}
                        </View>
                      )}
                    </>
                  )}
                  <View
                    style={{
                      paddingVertical: 15,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    {e.name != 'price' && (
                      <View
                        style={{
                          width: '100%',
                          height: 0.5,
                          opacity: 0.5,
                          backgroundColor: theme.color.subTitleLight,
                        }}
                      />
                    )}
                  </View>
                </>
              );
            })}
        </ScrollView>
        {renderBottom()}
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
