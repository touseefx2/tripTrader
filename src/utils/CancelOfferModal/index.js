import React, {useState, useEffect} from 'react';
import {View, Modal, SafeAreaView, ScrollView, Text, Alert} from 'react-native';
import {styles} from './styles';
import theme from '../../theme';
import store from '../../store';
import Header from './components/Header';
import Bottom from './components/Bottom';
import NetInfo from '@react-native-community/netinfo';

export default function CancelOfferModal({
  isModal,
  setIsModal,
  modalObj,
  setModalObj,
  loader,
  check,
}) {
  const maxModalHeight = theme.window.Height - 70;

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

  const cancelOffer = () => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        if (check == 'decline') {
          store.Offers.attemptToDeclineOffer(modalObj, closeModal);
        } else {
          store.Offers.attemptToCancelOffer(modalObj, closeModal);
        }
      } else {
        Alert.alert('', 'Please connect internet');
      }
    });
  };

  const renderInfo = () => {
    return (
      <View style={styles.modalinfoConatiner}>
        <Text style={styles.modalInfoText}>
          {check == 'decline'
            ? 'Are you sure you would like to decline offer?'
            : 'Are you sure you would like to cancel your offer?'}
        </Text>
      </View>
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
            title={check == 'decline' ? 'Decline Offer?' : 'Cancel Offer?'}
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
            </ScrollView>
          ) : (
            <>{renderInfo()}</>
          )}

          <Bottom
            isMaxHeight={isMaxHeight}
            loader={loader}
            closeModal={closeModal}
            cancelOffer={cancelOffer}
            check={check}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
}
