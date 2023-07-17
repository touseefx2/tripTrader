import React, {useState, useEffect} from 'react';
import {View, Modal, SafeAreaView} from 'react-native';
import {styles} from './styles';
import theme from '../../theme';
import utils from '../../utils';
import Header from './components/Header';
import Step1 from './components/Step1';
import Step2 from './components/Step2';

export default function ConfirmTripDate({
  isModal,
  setIsModal,
  modalObj,
  setModalObj,
  loader,
  setIsSuccessModal,
  setSuccessModalObj,
  setSuccessCheck,
  screen,
}) {
  const maxModalHeight = theme.window.Height - 70;
  const {item} = modalObj;

  const [isMaxHeight, setIssMaxHeight] = useState(false);
  const [modalHeight, setmodalHeight] = useState(0);
  const [step, setStep] = useState(1);
  const [selectedDates, setSelectedDates] = useState(null); //1

  let totalDays = 0;
  const {value, title} = item.hostTrip.duration;
  const titleFormat = utils.functions.formatTitle(value, title);
  const durationTitle = value + ' ' + titleFormat;
  if (title == 'days') totalDays = value;
  else if (title == 'weeks') totalDays = value * 7;

  useEffect(() => {
    setIssMaxHeight(modalHeight >= maxModalHeight ? true : false);
  }, [modalHeight]);

  const offerSuccefullyConfirm = () => {
    closeModal();
    setSuccessModalObj(modalObj);
    setSuccessCheck('OfferConfirm');
    setIsSuccessModal(true);
  };

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

  const goBack = () => {
    if (!loader) {
      if (step == 1) closeModal();

      if (step == 2) {
        setStep(1);
        setmodalHeight(0);
      }
    }
  };

  return (
    <Modal visible={isModal} transparent onRequestClose={goBack}>
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
            title={step == 1 ? 'Choose Trip Date' : 'Review Trade'}
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
              durationTitle={durationTitle}
              totalDays={totalDays}
              closeModal={closeModal}
              screen={screen}
            />
          )}
          {step == 2 && (
            <Step2
              modalObj={modalObj}
              selectedDates={selectedDates}
              step={step}
              setStep={setStep}
              setmodalHeight={setmodalHeight}
              isMaxHeight={isMaxHeight}
              loader={loader}
              offerSuccefullyConfirm={offerSuccefullyConfirm}
              closeModal={closeModal}
            />
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
}
