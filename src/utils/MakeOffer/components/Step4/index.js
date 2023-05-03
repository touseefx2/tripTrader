import React from 'react';
import {Text, ScrollView, View, Alert} from 'react-native';
import {styles} from './styles';
import NetInfo from '@react-native-community/netinfo';
import store from '../../../../store';
import utils from '../../../../utils';
import Bottom from './components/Bottom';
import ProgressiveFastImage from '@freakycoder/react-native-progressive-fast-image';
import moment from 'moment';

export default function Step4({
  modalObj,
  durationTitle,
  step,
  setStep,
  setmodalHeight,
  isMaxHeight,
  city,
  selectedState,
  selectedSpecies,
  durationNum,
  duration,
  rangeValue,
  unavailableText,
  note,
  tripType,
  selectedDates,
  minDate,
  maxDate,
  unAvailable,
  offerSuccefullySend,
  loader,
  closeModal,
  screen,
  props,
}) {
  const {item} = modalObj;
  const {firstName, lastName, image, _id} = item.hostId;
  const userName = firstName + ' ' + lastName;
  const photoSrc = image
    ? {uri: image}
    : require('../../../../assets/images/drawer/guest/img.png');
  const species = item.species + ' ' + item.tradeType || '';
  const locationName = city + ', ' + selectedState.name;

  const goBackMain = () => {
    if (screen == 'UserProfile') {
      props.navigation.goBack();
    }
  };

  const goBack = () => {
    setStep(3);
    setmodalHeight(0);
  };

  const confrimSendOffer = () => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        let preferDate = [];
        Object.keys(selectedDates).forEach(key => {
          preferDate.push(moment(key).format('MMM DD, YYYY'));
        });

        const title =
          durationNum +
          ' ' +
          utils.functions.formatTitle(durationNum, duration.title) +
          ' ' +
          selectedSpecies.name;

        const hostTrip = {
          title: title,
          tradeType: tripType.name,
          location: {
            city: city,
            state: selectedState.name,
          },
          species: selectedSpecies.name,
          duration: {
            value: durationNum,
            title: duration.title,
          },
          availableFrom: minDate,
          availableTo: maxDate,
        };
        if (unAvailable) {
          hostTrip.unAvailableDays = unAvailable;
        }

        const offeredTrip = {
          tripId: item._id,
          tradeType: item.tradeType,
          species: item.species,
          title: item.title,
          location: item.location,
          duration: item.duration,
          availableFrom: item.availableFrom,
          availableTo: item.availableTo,
          location: item.location,
        };
        if (item.unAvailableDays) {
          offeredTrip.unAvailableDays = item.unAvailableDays;
        }

        const object = {
          preferredDates: preferDate,
          note: note,
          offeredBy: store.User.user._id, //login user //hosttrip
          hostTrip: hostTrip,
          offeredTo: _id, //home user //offertrip
          offeredTrip: offeredTrip,
          status: 'pending',
        };

        store.User.attemptToOfferSend(
          object,
          offerSuccefullySend,
          closeModal,
          goBackMain,
        );
      } else {
        Alert.alert('', 'Please connect internet');
      }
    });
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
      <>
        <Text style={[styles.title, {marginTop: 10}]}>IN RETURN FOR</Text>
        <View style={styles.infoContainer}>
          {renderProfile()}
          {renderText()}
        </View>
      </>
    );
  };

  const renderField = () => {
    const titleFormat =
      durationNum <= 1
        ? duration.title.substring(0, duration.title.length - 1)
        : duration.title;
    const selectedDuration = durationNum + ' ' + titleFormat;

    return (
      <View style={{marginTop: 20}}>
        <View style={{width: '85%'}}>
          <Text style={styles.title}>YOUR OFFERING</Text>
          <Text style={[styles.subTitle, {color: theme.color.titleGreenForm}]}>
            {selectedSpecies?.name + ' ' + tripType?.name}
          </Text>
        </View>

        <View style={styles.fieldContainer}>
          <View style={{width: '49%'}}>
            <Text style={styles.title}>TRIP LOCATION</Text>
            <Text style={[styles.subTitle, {textTransform: 'none'}]}>
              {locationName}
            </Text>
          </View>

          <View style={{width: '48%'}}>
            <Text style={styles.title}>TRIP DURATION</Text>
            <Text style={[styles.subTitle, {textTransform: 'none'}]}>
              {selectedDuration}
            </Text>
          </View>
        </View>

        <View style={styles.fieldContainer}>
          <View style={{width: '49%'}}>
            <Text style={styles.title}>TRIP Availability</Text>
            <Text style={styles.subTitle}>{rangeValue}</Text>
          </View>

          <View style={{width: '48%'}}>
            <Text style={styles.title}>UNAVAILABLE DAYS</Text>
            <Text style={[styles.subTitle, {textTransform: 'none'}]}>
              {unavailableText == '' ? 'None' : unavailableText}
            </Text>
          </View>
        </View>

        {note != '' && (
          <View style={{width: '85%', marginTop: 20}}>
            <Text style={styles.title}>OFFER NOTE</Text>
            <Text
              style={[
                styles.subTitle,
                {
                  textTransform: 'none',
                  fontSize: 12,
                },
              ]}>
              {note}
            </Text>
          </View>
        )}
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
        goBack={goBack}
        goNext={confrimSendOffer}
        loader={loader}
      />
    </>
  );
}
