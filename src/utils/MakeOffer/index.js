import React, {useState, useEffect} from 'react';
import {View, Modal, SafeAreaView} from 'react-native';
import {styles} from './styles';
import theme from '../../theme';
import Header from './components/Header';
import Step1 from './components/Step1';
import Step2 from './components/Step2';
import Step3 from './components/Step3';
import {set} from 'react-native-reanimated';

export default function MakeOffer({
  isModal,
  setIsModal,
  modalObj,
  setModalObj,
  loader,
}) {
  const maxModalHeight = theme.window.Height - 70;
  const [isMaxHeight, setIssMaxHeight] = useState(false);
  const [modalHeight, setmodalHeight] = useState(0);
  const [step, setStep] = useState(1);
  const [selectedDates, setSelectedDates] = useState(null); //1
  const [selectedTrip, setSelectedTrip] = useState(null); //2

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
            title={'Make Offer'}
            loader={loader}
            closeModal={closeModal}
            isMaxHeight={isMaxHeight}
          />
          {step == 1 && (
            <Step1
              modalObj={modalObj}
              step={step}
              setStep={setStep}
              setmodalHeight={setmodalHeight}
              isMaxHeight={isMaxHeight}
              selectedDates={selectedDates}
              setSelectedDates={setSelectedDates}
            />
          )}
          {step == 2 && (
            <Step2
              step={step}
              setStep={setStep}
              setmodalHeight={setmodalHeight}
              isMaxHeight={isMaxHeight}
              selectedTrip={selectedTrip}
              setSelectedTrip={setSelectedTrip}
            />
          )}
          {step == 3 && (
            <Step3
              step={step}
              setStep={setStep}
              setmodalHeight={setmodalHeight}
              isMaxHeight={isMaxHeight}
              selectedTrip={selectedTrip}
            />
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
}
