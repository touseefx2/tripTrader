import React, {useState, useEffect} from 'react';
import {View, SafeAreaView} from 'react-native';
import {styles} from './styles';
import theme from '../../theme';
import Offer from './components/Offer';
import OfferConfirm from './components/OfferConfirm';
import Message from './components/Message';
import Trip from './components/Trip';
import Report from './components/Report';
import Modal from 'react-native-modal';

export default function SuccessModal({
  isModal,
  setIsModal,
  modalObj,
  setModalObj,
  check,
  setCheck,
  props,
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
    setIsModal(false);
    setModalObj(null);
    setCheck('');
  };

  return (
    <Modal
      isVisible={isModal}
      hasBackdrop
      backdropOpacity={0.7}
      onRequestClose={closeModal}
      deviceHeight={theme.window.Height}
      deviceWidth={theme.window.Width}>
      <SafeAreaView style={styles.modalContainer}>
        <View
          onLayout={onViewLayout}
          style={[styles.modal, isMaxHeight && {height: maxModalHeight}]}>
          {check == 'TripSave' && (
            <Trip
              modalObj={modalObj}
              isMaxHeight={isMaxHeight}
              closeModal={closeModal}
            />
          )}

          {check == 'OfferSend' && (
            <Offer
              modalObj={modalObj}
              isMaxHeight={isMaxHeight}
              closeModal={closeModal}
              props={props}
            />
          )}

          {check == 'OfferConfirm' && (
            <OfferConfirm
              modalObj={modalObj}
              isMaxHeight={isMaxHeight}
              closeModal={closeModal}
              props={props}
            />
          )}

          {check == 'MessageSend' && (
            <Message
              modalObj={modalObj}
              isMaxHeight={isMaxHeight}
              closeModal={closeModal}
              props={props}
            />
          )}

          {check == 'ReportSend' && (
            <Report
              modalObj={modalObj}
              isMaxHeight={isMaxHeight}
              closeModal={closeModal}
            />
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
}
