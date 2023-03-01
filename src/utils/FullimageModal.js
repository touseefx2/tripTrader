import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Image,
  Pressable,
  SafeAreaView,
  Animated,
} from 'react-native';
import {responsiveWidth} from 'react-native-responsive-dimensions';
import {observer} from 'mobx-react';
import utils from './index';
import theme from '../../src/theme';

export default observer(FullimageModal);

const width = responsiveWidth(92);
let enableClr = theme.color.background;
let disableClr = 'rgba(250, 250,250, 0.6)';

function FullimageModal(props) {
  const flatListRef = React.useRef();
  let data = props.data || [];
  const show = props.show;
  let scrollEnable = data.length > 1 ? true : false;
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const imageW = width * 0.7;
  const imageH = imageW * 1.54;

  let pd = props.pd || '';
  let pdc = props.pdc || '';

  const [si, setsi] = useState(props.si || 0);

  const onViewRef2 = React.useRef(({viewableItems}) => {
    // Use viewable items in state or as intended

    if (viewableItems.length > 0) {
      let index = viewableItems[0].index;
      setsi(index);
    }
  });
  const viewConfigRef2 = React.useRef({viewAreaCoveragePercentThreshold: 30});

  const move = num => {
    flatListRef.current?.scrollToIndex({animated: true, index: num});
  };

  const closeModal = () => {
    props.closModal();
  };

  const nextPhoto = () => {
    let c = si + 1;
    setsi(c);
    move(c);
  };

  const prevPhoto = () => {
    let c = si - 1;
    setsi(c);
    move(c);
  };

  const renderLoader = () => {
    return (
      <View style={{position: 'absolute', alignSelf: 'center', top: '45%'}}>
        <ActivityIndicator size={40} color={theme.color.button1} />
      </View>
    );
  };

  const renderImageModal = () => {
    const renderCross = () => {
      return (
        <Pressable
          onPress={closeModal}
          style={({pressed}) => [
            {opacity: pressed ? 0.8 : 1},
            [styles.modalButtonContainer],
          ]}>
          <utils.vectorIcon.AntDesign
            name="close"
            color={theme.color.subTitleLight}
            size={16}
          />
        </Pressable>
      );
    };

    const renderImageArr = () => {
      const renderIndicatior = () => {
        return (
          <View style={styles.indicatorContainer}>
            {data.map((value, index) => {
              if (index == si) {
                return <View style={styles.activeIndicatorStyle} />;
              } else {
                return <View style={styles.inActiveIndicatorStyle} />;
              }
            })}
          </View>
        );
      };

      if (data.length > 0 && pdc == '') {
        return (
          <View style={styles.ImageContainer}>
            <>
              {data.map((val, ind) => {
                const inputRange = [
                  (ind - 1) * width,
                  ind * width,
                  (ind + 1) * width,
                ];
                const opacity = scrollX.interpolate({
                  inputRange,
                  outputRange: [0, 1, 0],
                });
                return (
                  <Animated.Image
                    key={ind}
                    source={{uri: val.uri ? val.uri : val}}
                    style={[styles.Image, {opacity}]}
                    blurRadius={0}
                  />
                );
              })}
            </>

            <>
              <Animated.FlatList
                data={data}
                keyExtractor={(_, index) => index.toString()}
                onScroll={Animated.event(
                  [{nativeEvent: {contentOffset: {x: scrollX}}}],
                  {useNativeDriver: false},
                )}
                ref={flatListRef}
                scrollEnabled={scrollEnable}
                horizontal
                pagingEnabled
                initialScrollIndex={si}
                onViewableItemsChanged={onViewRef2.current}
                viewabilityConfig={viewConfigRef2.current}
                pinchGestureEnabled={true}
                onScrollToIndexFailed={info => {
                  const wait = new Promise(resolve => setTimeout(resolve, 500));
                  wait.then(() => {
                    slider.current?.scrollToIndex({
                      index: info.index,
                      animated: true,
                    });
                  });
                }}
                showsHorizontalScrollIndicator={false}
                renderItem={({item, index}) => {
                  return (
                    <View style={styles.previewImagemainContainer}>
                      <View style={styles.previewImageContainerStyle}>
                        <Image
                          source={{
                            uri: item.uri ? item.uri : item,
                          }}
                          style={styles.previewImageStyle}
                        />
                      </View>
                    </View>
                  );
                }}
              />
            </>

            <>{data.length > 1 && renderIndicatior()}</>
          </View>
        );
      } else {
        let d = '';
        if (pdc == 'tp') {
          d = {uri: pd.uri ? pd.uri : pd};
        } else if (pdc == 'ph') {
          d = require('../assets/images/trip/img.jpeg');
        }

        return (
          <View style={styles.ImageContainer}>
            <>
              <Image
                source={d}
                style={styles.previewImageStyle}
                // style={[StyleSheet.absoluteFillObject, {opacity}]}
                blurRadius={0}
              />
            </>
          </View>
        );
      }
    };

    return (
      <View style={styles.modalImageContainer}>
        {renderImageArr()}
        {renderCross()}
      </View>
    );
  };

  return (
    <Modal visible={show} transparent onRequestClose={closeModal}>
      <SafeAreaView style={styles.modalContainer}>
        {renderImageModal()}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  previewImagemainContainer: {
    flex: 1,
  },
  previewImageContainerStyle: {
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImageStyle: {
    width: width,
    resizeMode: 'contain',
    height: '100%',
  },

  modalContainer: {
    flex: 1,
    backgroundColor: "'rgba(0,0,0,0.5)'",
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalImageContainer: {
    width: responsiveWidth(92),
    height: '90%',
    alignSelf: 'center',
  },
  ImageContainer: {
    backgroundColor: 'black',
    width: '100%',
    height: '93%',
    borderRadius: 9,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },

  Image: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    resizeMode: 'contain',
  },

  modalButtonContainer: {
    backgroundColor: theme.color.background,
    borderRadius: 35 / 2,
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  changeButtonContainer: {
    backgroundColor: theme.color.background,
    borderRadius: 35 / 2,
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    position: 'absolute',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    opacity: 1,
  },
  indicatorContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    position: 'absolute',
    bottom: 40,
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 5,
    borderRadius: 24.21,
    paddingVertical: 1,
  },

  activeIndicatorStyle: {
    height: 7,
    width: 20,
    borderRadius: 100,
    backgroundColor: 'white',
    margin: 3.5,
  },
  inActiveIndicatorStyle: {
    height: 7,
    width: 7,
    borderRadius: 7 / 2,
    backgroundColor: '#FFFFFF',
    margin: 3,
    opacity: 0.5,
  },
});
