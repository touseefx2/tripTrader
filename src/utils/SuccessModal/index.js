import React, {useState, useEffect} from 'react';
import {View, Modal, SafeAreaView} from 'react-native';
import {styles} from './styles';
import theme from '../../theme';
import Offer from './components/Offer';
import Message from './components/Message';

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
    <Modal visible={isModal} transparent onRequestClose={closeModal}>
      <SafeAreaView style={styles.modalContainer}>
        <View
          onLayout={onViewLayout}
          style={[styles.modal, isMaxHeight && {height: maxModalHeight}]}>
          {check == 'OfferSend' && (
            <Offer
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
        </View>
      </SafeAreaView>
    </Modal>
  );
}