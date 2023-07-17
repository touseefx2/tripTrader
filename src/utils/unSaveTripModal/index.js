import React, {useState, useEffect} from 'react';
import {View, Modal, SafeAreaView, ScrollView, Text, Alert} from 'react-native';
import {styles} from './styles';
import theme from '../../theme';
import store from '../../store';
import Header from './components/Header';
import Bottom from './components/Bottom';
import ProgressiveFastImage from '@freakycoder/react-native-progressive-fast-image';
import NetInfo from '@react-native-community/netinfo';

export default function unSaveTripModal({
  isModal,
  setIsModal,
  modalObj,
  setModalObj,
  loader,
  screen,
  data,
  setdata,
  saveData,
  setSaveData,
}) {
  const maxModalHeight = theme.window.Height - 70;
  const {item, selIndex} = modalObj;
  const {title, returnActivity} = item;
  const {firstName, lastName, image} = item.hostId;
  const {attemptTounSaveTrip} = store.Trips;

  const [isMaxHeight, setIssMaxHeight] = useState(false);
  const [modalHeight, setmodalHeight] = useState(0);

  useEffect(() => {
    setIssMaxHeight(modalHeight >= maxModalHeight ? true : false);
  }, [modalHeight]);

  const onViewLayout = event => {
    if (!isMaxHeight) {
      const {height} = event.nativeEvent.layout;
      setmodalHeight(height);
    }
  };

  const closeModal = () => {
    if (!loader) {
      setIsModal(false);
      setModalObj(null);
    }
  };

  const removeTrip = () => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        attemptTounSaveTrip(
          screen,
          item,
          selIndex,
          closeModal,
          data,
          setdata,
          saveData,
          setSaveData,
        );
      } else Alert.alert('', 'Please connect internet');
    });
  };

  const renderInfo = () => {
    const userName = firstName + ' ' + lastName;
    const photoSrc = image
      ? {uri: image}
      : require('../../assets/images/drawer/guest/img.png');

    const renderProfile = () => {
      return (
        <View style={styles.mProfileImgContainer}>
          <ProgressiveFastImage
            style={styles.mProfileImg}
            source={photoSrc}
            loadingImageStyle={styles.mimageLoader}
            loadingSource={require('../../assets/images/imgLoad/img.jpeg')}
            blurRadius={5}
          />
          {/* {isVeirfy && (
            <Image
              style={styles.miconVerify}
              source={require('../../assets/images/verified/img.png')}
            />
          )} */}
        </View>
      );
    };

    const renderText = () => {
      return (
        <View style={{width: '77%'}}>
          <Text
            style={{
              color: theme.color.subTitleLight,
              fontSize: 12,
              fontFamily: theme.fonts.fontBold,
              textTransform: 'capitalize',
            }}>
            Member
          </Text>

          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              color: '#081A24',
              fontSize: 15,
              fontFamily: theme.fonts.fontBold,
              lineHeight: 23,
              textTransform: 'capitalize',
            }}>
            {userName}
          </Text>
        </View>
      );
    };

    return (
      <View style={styles.modalinfoConatiner}>
        {renderProfile()}
        {renderText()}
      </View>
    );
  };

  const renderField = () => {
    return (
      <>
        <View style={{paddingLeft: 10, paddingRight: 20}}>
          <View style={styles.field}>
            <Text style={styles.filedTitle}>Offering</Text>
            <Text style={[styles.filedTitle2, {color: theme.color.title}]}>
              {title}
            </Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.filedTitle}>for trade</Text>
            <Text style={[styles.filedTitle2, {color: theme.color.title}]}>
              {returnActivity}
            </Text>
          </View>
        </View>
      </>
    );
  };

  return (
    <Modal visible={isModal} transparent onRequestClose={closeModal}>
      <SafeAreaView style={styles.modalContainer}>
        <View
          onLayout={onViewLayout}
          style={[
            styles.modal,
            isMaxHeight
              ? {height: maxModalHeight, paddingTop: 0}
              : {padding: 15},
          ]}>
          <Header
            title={'Remove Saved Trip?'}
            loader={loader}
            closeModal={closeModal}
            isMaxHeight={isMaxHeight}
          />

          {isMaxHeight ? (
            <ScrollView
              contentContainerStyle={{paddingHorizontal: 15}}
              showsVerticalScrollIndicator={false}
              style={{flex: 1}}>
              {renderInfo()}
              {renderField()}
            </ScrollView>
          ) : (
            <>
              {renderInfo()}
              {renderField()}
            </>
          )}

          <Bottom
            isMaxHeight={isMaxHeight}
            loader={loader}
            closeModal={closeModal}
            removeTrip={removeTrip}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
}
