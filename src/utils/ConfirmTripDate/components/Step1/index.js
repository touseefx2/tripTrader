import React, {useState} from 'react';
import {View, Text, Image, ScrollView, Pressable} from 'react-native';
import {styles} from './styles';
import utils from '../../../../utils';
import ProgressiveFastImage from '@freakycoder/react-native-progressive-fast-image';
import Bottom from './components/Bottom';
import moment from 'moment';

export default function Step1({
  modalObj,
  step,
  setStep,
  setmodalHeight,
  isMaxHeight,
  selectedDates,
  setSelectedDates,
  durationTitle,
  totalDays,
  closeModal,
  screen,
}) {
  const {item} = modalObj;
  const {value} = item.hostTrip.duration;
  const {image, firstName, lastName} = item.offeredBy;
  const {species, tradeType} = item.hostTrip;
  const photoSrc = image
    ? {uri: image}
    : require('../../../../assets/images/drawer/guest/img.png');
  const userName = firstName + ' ' + lastName;
  let firstDate = '';
  let secondDate = '';
  let fieldText = '';

  const [isChooseDateCalender, setIsChooseDateCalender] = useState(false);

  if (selectedDates) {
    fieldText = utils.functions.formatSelectedDates(selectedDates, '');
  } else {
    fieldText =
      value <= 1 ? 'Choose a trip date' : 'Choose a trip date or date range';
  }

  const goNext = () => {
    setmodalHeight(0);
    setStep(2);
  };

  const renderInfo = () => {
    const renderProfile = () => {
      return (
        <View style={styles.mProfileImgContainer}>
          <ProgressiveFastImage
            style={styles.mProfileImg}
            source={photoSrc}
            loadingImageStyle={styles.mimageLoader}
            loadingSource={require('../../../../assets/images/imgLoad/img.jpeg')}
            blurRadius={3}
          />
        </View>
      );
    };

    const renderText = () => {
      return (
        <View style={styles.mtextContainer}>
          <Text
            style={[styles.mtextContainertitle, {textTransform: 'capitalize'}]}>
            {species + ' ' + tradeType}
          </Text>

          <Text style={styles.textContainertitle2}>
            Duration: {durationTitle}
          </Text>

          <Text style={styles.textContainertitle3}>
            Hosted by{' '}
            <Text
              style={[
                styles.textContainertitle3,
                {textTransform: 'capitalize'},
              ]}>
              {userName}
            </Text>
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
      <View style={styles.modalFieldConatiner}>
        <Text style={styles.mfT1}>Preferred Trip Date</Text>
        <Pressable
          onPress={() => setIsChooseDateCalender(true)}
          style={({pressed}) => [
            {opacity: pressed ? 0.8 : 1.0},
            styles.mFieldContainer,
          ]}>
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={[styles.mfT2, {opacity: !selectedDates ? 0.4 : 1}]}>
            {fieldText}
          </Text>
          <View style={{width: '13%', alignItems: 'flex-end'}}>
            <Image
              source={require('../../../../assets/images/cal/img.png')}
              style={styles.mfT2icon}
            />
          </View>
        </Pressable>
      </View>
    );
  };

  return (
    <>
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
        step={step}
        selectedDates={selectedDates}
        closeModal={closeModal}
        goNext={goNext}
      />
      {isChooseDateCalender && (
        <utils.SelectionCalender
          modalObj={modalObj}
          isModal={isChooseDateCalender}
          setIsModal={setIsChooseDateCalender}
          selectedDates={selectedDates}
          setSelectedDates={setSelectedDates}
          durationTitle={durationTitle}
          minDate={firstDate}
          maxDate={secondDate}
          totalDays={totalDays}
          screen={screen}
        />
      )}
    </>
  );
}