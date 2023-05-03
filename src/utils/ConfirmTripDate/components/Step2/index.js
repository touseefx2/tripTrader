import React from 'react';
import {ScrollView, Alert} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import Bottom from './components/Bottom';
import Fields from './components/Fields';
import store from '../../../../store/index';
import moment from 'moment';

export default function Step2({
  modalObj,
  selectedDates,
  step,
  setStep,
  setmodalHeight,
  isMaxHeight,
  loader,
  offerSuccefullyConfirm,
  closeModal,
}) {
  const confirmAndAccept = () => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        let preferDate = [];
        let esd = [];
        //for sort and set format
        if (selectedDates) {
          Object.keys(selectedDates).forEach(function (key) {
            esd.push(key);
          });
        }
        if (esd.length > 0) {
          esd.sort(function (a, b) {
            return Number(new Date(a)) - Number(new Date(b));
          });
          esd.map(e => {
            preferDate.push(moment(e).format('MMM DD, YYYY'));
          });
        }

        let body = {
          tripDates: preferDate,
        };
        store.Offers.attemptToConfirmOffer(
          modalObj,
          body,
          offerSuccefullyConfirm,
          closeModal,
        );
      } else {
        Alert.alert('', 'Please connect internet');
      }
    });
  };

  const goBack = () => {
    setStep(1);
    setmodalHeight(0);
  };

  const renderFields = () => {
    return (
      <Fields
        modalObj={modalObj}
        selectedDates={selectedDates}
        goBack={goBack}
      />
    );
  };

  return (
    <>
      {isMaxHeight ? (
        <ScrollView
          contentContainerStyle={{paddingHorizontal: 15}}
          showsVerticalScrollIndicator={false}
          style={{flex: 1}}>
          {renderFields()}
        </ScrollView>
      ) : (
        <>{renderFields()}</>
      )}

      <Bottom
        isMaxHeight={isMaxHeight}
        step={step}
        closeModal={goBack}
        confirmAndAccept={confirmAndAccept}
        loader={loader}
      />
    </>
  );
}
