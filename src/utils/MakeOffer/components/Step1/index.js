import React, {useState} from 'react';
import {View, Text, Image, ScrollView, Pressable} from 'react-native';
import {styles} from './styles';
import DateCalender from './components/DateCalender';
import ProgressiveFastImage from '@freakycoder/react-native-progressive-fast-image';
import moment from 'moment';
import Bottom from './components/Bottom';

export default function Step1({
  modalObj,
  step,
  setStep,
  setmodalHeight,
  isMaxHeight,
  selectedDates,
  setSelectedDates,
}) {
  const {item} = modalObj;
  const {number, title} = item.duration;

  const [isChooseDateCalender, setIsChooseDateCalender] = useState(false);

  const photoSrc = item.user.image
    ? {uri: item.user.image}
    : require('../../../../assets/images/drawer/guest/img.png');
  const userName = item.user.firstName + ' ' + item.user.lastName;
  const titleFormat =
    number <= 1 ? title.substring(0, title.length - 1) : title;
  const durationTitle = number + ' ' + titleFormat;
  const species = item.species || '';
  let fieldText = '';
  let firstDate = '';
  let secondDate = '';
  let dates = [];
  if (selectedDates) {
    dates = Object.keys(selectedDates).map(function (key) {
      return key;
    });

    if (dates.length > 0) {
      firstDate = dates[0];
      if (dates.length > 1) {
        secondDate = dates[dates.length - 1];
        fieldText =
          moment(firstDate).format('MMM DD, YYYY') +
          ' - ' +
          moment(secondDate).format('MMM DD, YYYY');
      } else fieldText = moment(firstDate).format('MMM DD, YYYY');
    }
  } else {
    fieldText =
      number <= 1 ? 'Choose a trip date' : 'Choose a trip date or date range';
  }

  const goNext = () => {
    setmodalHeight(0);
    setStep(2);
  };

  const renderTitle = () => {
    return (
      <Text style={styles.modalsubTitle}>
        To get started, choose your preferred dates for this trip.
      </Text>
    );
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
            blurRadius={5}
          />
        </View>
      );
    };

    const renderText = () => {
      return (
        <View style={styles.mtextContainer}>
          <Text
            style={[styles.mtextContainertitle, {textTransform: 'capitalize'}]}>
            {species}
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
            numberOfLines={1}
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
          {renderTitle()}
          {renderInfo()}
          {renderField()}
        </ScrollView>
      ) : (
        <>
          {renderTitle()}
          {renderInfo()}
          {renderField()}
        </>
      )}

      <Bottom
        isMaxHeight={isMaxHeight}
        step={step}
        selectedDates={selectedDates}
        goNext={goNext}
      />
      {isChooseDateCalender && (
        <DateCalender
          modalObj={modalObj}
          isModal={isChooseDateCalender}
          setIsModal={setIsChooseDateCalender}
          selectedDates={selectedDates}
          setSelectedDates={setSelectedDates}
          durationTitle={durationTitle}
          minDate={firstDate}
          maxDate={secondDate}
        />
      )}
    </>
  );
}
