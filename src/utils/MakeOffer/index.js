import React, {useState, useEffect} from 'react';
import {View, Modal} from 'react-native';
import {styles} from './styles';
import theme from '../../theme';
import utils from '../../utils';
import Header from './components/Header';
import Step1 from './components/Step1';
import Step2 from './components/Step2';
import Step3 from './components/Step3';
import Step4 from './components/Step4';
import {responsiveHeight} from 'react-native-responsive-dimensions';

export default function MakeOffer({
  isModal,
  setIsModal,
  modalObj,
  setModalObj,
  loader,
  activity,
  species,
  tripLocation,
  setIsSuccessModal,
  setSuccessModalObj,
  setSuccessCheck,
  screen,
  props,
}) {
  const maxModalHeight = theme.window.Height - responsiveHeight(9.5);
  const {item} = modalObj;
  const {value, title} = item.duration;

  const durationList = [
    {
      _id: 0,
      is_active: true,
      title: 'days',
      type: 'durType',
    },
    {
      _id: 1,
      is_active: true,
      title: 'weeks',
      type: 'durType',
    },
  ];

  const [isMaxHeight, setIssMaxHeight] = useState(false);
  const [modalHeight, setmodalHeight] = useState(0);
  const [step, setStep] = useState(1);
  const [selectedDates, setSelectedDates] = useState(null); //1
  const [selectedTrip, setSelectedTrip] = useState(null); //2
  const [isTripRefresh, setIsTripRefresh] = useState(null);

  //3
  const [speciesList, setSpeciesList] = useState([]);
  const [tripType, setTripType] = useState(null);
  const [city, setCity] = useState('');
  const [selectedState, setSelectedState] = useState(null);
  const [selectedSpecies, setSelectedSpecies] = useState(null);
  const [durationNum, setDurationNum] = useState(1);
  const [duration, setDuration] = useState(durationList[0]);
  const [availablityDates, setAvailablityDates] = useState(null);
  const [unAvailable, setUnAvailble] = useState(null);
  const [note, setNote] = useState('');

  let totalDays = 0;
  const titleFormat = utils.functions.formatTitle(value, title);
  const durationTitle = value + ' ' + titleFormat;
  let minDate;
  let maxDate;
  let rangeValue;
  let unavailableText;

  if (title == 'days') totalDays = value;
  else if (title == 'weeks') totalDays = value * 7;
  if (availablityDates) {
    const size = Object.keys(availablityDates).length;
    const startDate = Object.keys(availablityDates)[0];
    const endDate = Object.keys(availablityDates)[size - 1];
    if (startDate > endDate) {
      minDate = endDate;
      maxDate = startDate;
    } else {
      minDate = startDate;
      maxDate = endDate;
    }
    rangeValue = utils.functions.checkSameYearFormate(minDate, maxDate);
  } else {
    minDate = '';
    maxDate = '';
    rangeValue = '';
  }
  if (unAvailable) {
    const text1 = unAvailable.dayWeekText;
    const text2 = unAvailable.excludeDateText;
    if (text1 != '' && text2 != '') unavailableText = text1 + ', ' + text2;

    if (text1 == '' && text2 != '') unavailableText = text2;
    else if (text1 != '' && text2 == '') unavailableText = text1;
  } else unavailableText = '';

  useEffect(() => {
    setIssMaxHeight(modalHeight >= maxModalHeight ? true : false);
  }, [modalHeight]);

  useEffect(() => {
    if (selectedTrip) {
      const tripType = utils.functions.findItem(
        selectedTrip.tradeType || '',
        activity,
        'n',
      );
      const location = selectedTrip.location ? selectedTrip.location : null;
      const specis = utils.functions.findItem(
        selectedTrip.species || '',
        species,
        'n',
      );
      const duration = utils.functions.findItem(
        selectedTrip.duration.title || '',
        durationList,
        't',
      );
      if (location) {
        setCity(location.city);
        setSelectedState(
          utils.functions.findItem(location.state || '', tripLocation, 'n'),
        );
      }
      setTripType(tripType);
      setSelectedSpecies(specis);
      setDurationNum(selectedTrip.duration.value);
      setDuration(duration);
    }
  }, [selectedTrip, isTripRefresh]);

  useEffect(() => {
    if (tripType) {
      let list = [];
      if (species.length > 0) {
        species.map(item => {
          if (item.type) {
            if (item.type && item.type.name == tripType.name) list.push(item);
          }
        });
      }
      setSpeciesList(list);
    }
  }, [tripType]);

  const offerSuccefullySend = () => {
    closeModal();
    setSuccessModalObj(modalObj);
    setSuccessCheck('OfferSend');
    setIsSuccessModal(true);
  };

  const onViewLayout = event => {
    if (!isMaxHeight) {
      const {height} = event.nativeEvent.layout;
      setmodalHeight(height);
    }
  };

  const clearStep3Fields = () => {
    setTripType(null);
    setCity('');
    setSelectedState(null);
    setSelectedSpecies(null);
    setDurationNum(1);
    setDuration(durationList[0]);
    setAvailablityDates(null);
    setUnAvailble(null);
    setNote('');
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
        setSelectedTrip(null);
        setmodalHeight(0);
      }

      if (step == 3) {
        setStep(2);
        clearStep3Fields();
        setmodalHeight(0);
      }

      if (step == 4) {
        setStep(3);
        setmodalHeight(0);
      }
    }
  };

  return (
    <Modal visible={isModal} transparent onRequestClose={goBack}>
      <View style={styles.modalContainer}>
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
              durationTitle={durationTitle}
              totalDays={totalDays}
              screen={screen}
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
              isTripRefresh={isTripRefresh}
              setIsTripRefresh={setIsTripRefresh}
            />
          )}
          {step == 3 && (
            <Step3
              step={step}
              setStep={setStep}
              setmodalHeight={setmodalHeight}
              isMaxHeight={isMaxHeight}
              speciesList={speciesList}
              durationList={durationList}
              tripType={tripType}
              setTripType={setTripType}
              city={city}
              setCity={setCity}
              selectedState={selectedState}
              setSelectedState={setSelectedState}
              selectedSpecies={selectedSpecies}
              setSelectedSpecies={setSelectedSpecies}
              durationNum={durationNum}
              setDurationNum={setDurationNum}
              duration={duration}
              setDuration={setDuration}
              availablityDates={availablityDates}
              setAvailablityDates={setAvailablityDates}
              minDate={minDate}
              maxDate={maxDate}
              rangeValue={rangeValue}
              unAvailable={unAvailable}
              setUnAvailble={setUnAvailble}
              unavailableText={unavailableText}
              note={note}
              setNote={setNote}
              clearStep3Fields={clearStep3Fields}
            />
          )}

          {step == 4 && (
            <Step4
              modalObj={modalObj}
              durationTitle={durationTitle}
              step={step}
              setStep={setStep}
              setmodalHeight={setmodalHeight}
              isMaxHeight={isMaxHeight}
              city={city}
              selectedState={selectedState}
              selectedSpecies={selectedSpecies}
              durationNum={durationNum}
              duration={duration}
              rangeValue={rangeValue}
              unavailableText={unavailableText}
              note={note}
              tripType={tripType}
              selectedDates={selectedDates}
              minDate={minDate}
              maxDate={maxDate}
              unAvailable={unAvailable}
              offerSuccefullySend={offerSuccefullySend}
              loader={loader}
              closeModal={closeModal}
              screen={screen}
              props={props}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}
