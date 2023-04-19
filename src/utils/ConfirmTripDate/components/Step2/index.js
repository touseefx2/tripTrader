import React, {useState} from 'react';
import {View, Text, Image, ScrollView, Pressable} from 'react-native';
import {styles} from './styles';
import utils from '../../..';
import ProgressiveFastImage from '@freakycoder/react-native-progressive-fast-image';
import Bottom from './components/Bottom';
import moment from 'moment';

export default function Step2({step, setStep, setmodalHeight, isMaxHeight}) {
  // const {item} = modalObj;
  // const {value} = item.hostTrip.duration;
  // const {image, firstName, lastName} = item.offeredBy;
  // const {species, tradeType} = item.hostTrip;
  // const photoSrc = image
  //   ? {uri: image}
  //   : require('../../../../assets/images/drawer/guest/img.png');
  // const userName = firstName + ' ' + lastName;
  // let firstDate = '';
  // let secondDate = '';
  // let fieldText = '';

  // if (selectedDates) {
  //   const size = Object.keys(selectedDates).length;
  //   firstDate = moment(Object.keys(selectedDates)[0]).format('MMM DD, YYYY');
  //   secondDate =
  //     size > 1
  //       ? moment(Object.keys(selectedDates)[size - 1]).format('MMM DD, YYYY')
  //       : '';
  //   if (secondDate != '') fieldText = firstDate + '  -  ' + secondDate;
  //   else fieldText = firstDate;
  // } else {
  //   fieldText =
  //     value <= 1 ? 'Choose a trip date' : 'Choose a trip date or date range';
  // }

  const goNext = () => {
    // setmodalHeight(0);
    // setStep(2);
  };

  const goBack = () => {
    setStep(1);
    setmodalHeight(0);
  };

  return (
    <>
      {isMaxHeight ? (
        <ScrollView
          contentContainerStyle={{paddingHorizontal: 15}}
          showsVerticalScrollIndicator={false}
          style={{flex: 1}}>
          {/* {renderInfo()}
          {renderField()} */}
        </ScrollView>
      ) : (
        <>
          {/* {renderInfo()}
          {renderField()} */}
        </>
      )}

      <Bottom
        isMaxHeight={isMaxHeight}
        step={step}
        closeModal={goBack}
        goNext={goNext}
      />
    </>
  );
}
