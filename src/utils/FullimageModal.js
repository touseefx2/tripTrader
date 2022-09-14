import React, {useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Modal,
  Image,
} from 'react-native';
import theme from '../theme/index';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import utils from '.';
import ProgressiveFastImage from '@freakycoder/react-native-progressive-fast-image';
import store from '../store/index';
import {observer} from 'mobx-react';
import NetInfo from '@react-native-community/netinfo';
import RBSheet from 'react-native-raw-bottom-sheet';

export default observer(FullimageModal);
function FullimageModal(props) {
  const show = props.show;
  const pv = props.pv;

  const [imgLoad, setimgLoad] = useState(false);

  const closeModal = () => {
    props.setshow(false);
    props.setpv('');
    setimgLoad(false);
  };

  const renderImage = () => {
    return (
      <Image
        onLoadStart={() => {
          setimgLoad(false);
        }}
        onLoad={() => {
          setimgLoad(true);
        }}
        style={styles.image}
        resizeMode="contain"
        source={{uri: pv}}
      />
    );
  };

  const renderCross = () => {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={closeModal}
        style={styles.crossContainer}>
        <utils.vectorIcon.Entypo name="cross" color="white" size={30} />
      </TouchableOpacity>
    );
  };

  const renderLoader = () => {
    return (
      <View style={{position: 'absolute', alignSelf: 'center', top: '45%'}}>
        <ActivityIndicator size={40} color={theme.color.button1} />
      </View>
    );
  };

  return (
    <Modal
      visible={show}
      transparent
      onRequestClose={() => {
        closeModal();
      }}>
      <View style={styles.container}>
        {renderImage()}
        {renderCross()}
        {!imgLoad && renderLoader()}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {position: 'absolute', top: 0, left: 0, bottom: 0, right: 0},
  crossContainer: {
    backgroundColor: theme.color.button1,
    borderRadius: 33 / 2,
    width: 33,
    height: 33,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: Platform.OS == 'ios' ? APPBAR_HEIGHT + 12 : 12,
    left: 12,
  },
});
