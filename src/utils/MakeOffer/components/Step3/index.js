import React, {useState, useEffect} from 'react';
import {Text, ScrollView} from 'react-native';
import {styles} from './styles';
import utils from '../../../../utils';
import store from '../../../../store';
import {observer} from 'mobx-react';
import Bottom from './components/Bottom';
import RangeCalender from './components/RangeCalender';
import Fields from './components/Fields';

export default observer(Step3);
function Step3({
  step,
  setStep,
  setmodalHeight,
  isMaxHeight,
  speciesList,
  durationList,
  tripType,
  setTripType,
  city,
  setCity,
  selectedState,
  setSelectedState,
  selectedSpecies,
  setSelectedSpecies,
  durationNum,
  setDurationNum,
  duration,
  setDuration,
  availablityDates,
  setAvailablityDates,
  minDate,
  maxDate,
  rangeValue,
  unAvailable,
  setUnAvailble,
  unavailableText,
  note,
  setNote,
}) {
  const {tripLocation, activityList} = store.Filters;

  const [isShowCalender, setIsShowCalender] = useState(false);
  const [isShowUnAvailable, setIsShowUnAvailable] = useState(false);
  const [isDropDownTripType, setIsDropDownTripType] = useState(false);
  const [isDropDownState, setIsDropDownState] = useState(false);
  const [isDropDownSpecies, setIsDropDownSpecies] = useState(false);
  const [isDropDownDuration, setIsDropDownDuration] = useState(false);

  const [totalDays, setTotalDays] = useState(0);
  const [isDisable, setIsDisable] = useState(true);

  useEffect(() => {
    if (
      availablityDates &&
      durationNum != '' &&
      tripType != '' &&
      speciesList != '' &&
      city != '' &&
      selectedState
    )
      setIsDisable(false);
  }, [
    availablityDates,
    durationNum,
    tripType,
    speciesList,
    city,
    selectedState,
  ]);

  useEffect(() => {
    let num = 0;
    if (duration) {
      if (duration.title == 'days') num = durationNum;
      else if (duration.title == 'weeks') num = durationNum * 7;
      setTotalDays(num);
    }
  }, [duration, durationNum]);

  useEffect(() => {
    if (availablityDates) {
      let availablityDatesLength = Object.keys(availablityDates).length;
      let unAvailableDaysLength = 0;
      if (unAvailable)
        unAvailableDaysLength = unAvailable.allUnavailableDates.length;

      availablityDatesLength = availablityDatesLength - unAvailableDaysLength;
      if (availablityDatesLength < totalDays) {
        setUnAvailble(null);
        setAvailablityDates(null);
      }
    }
  }, [totalDays, availablityDates, unAvailable]);

  const closeAllDropDown = () => {
    setIsDropDownSpecies(false);
    setIsDropDownTripType(false);
    setIsDropDownState(false);
    setIsDropDownDuration(false);
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

  const goBack = () => {
    setStep(2);
    setmodalHeight(0);
    clearStep3Fields();
  };

  const goNext = () => {
    closeAllDropDown();
    setStep(4);
    setmodalHeight(0);
  };

  const renderTitle = () => {
    return (
      <Text style={styles.modalsubTitle}>
        Now, let's fill out the details of your offer.
      </Text>
    );
  };

  const renderShowDropDown = check => {
    const data =
      check == 'tt'
        ? activityList
        : check == 'state'
        ? tripLocation
        : check == 'spcs'
        ? speciesList
        : check == 'dur'
        ? durationList
        : [];

    const onclickSelect = obj => {
      if (check == 'tt') {
        setTripType(obj);
        if (tripType && tripType.name !== obj.name) setSelectedSpecies(null);
      }
      if (check == 'state') setSelectedState(obj);

      if (check == 'spcs') setSelectedSpecies(obj);

      if (check == 'dur') setDuration(obj);
    };

    return (
      <utils.DropDown
        search={true}
        data={data}
        onSelectItem={onclickSelect}
        setVisible={closeAllDropDown}
        c={check}
        absolute={false}
      />
    );
  };

  const openCalender = () => {
    setIsShowCalender(true);
  };

  const openUnAvailableModal = () => {
    setIsShowUnAvailable(true);
  };

  const renderField = () => {
    return (
      <Fields
        unavailableText={unavailableText}
        tripType={tripType}
        isDropDownTripType={isDropDownTripType}
        setIsDropDownTripType={setIsDropDownTripType}
        city={city}
        setCity={setCity}
        selectedState={selectedState}
        isDropDownState={isDropDownState}
        setIsDropDownState={setIsDropDownState}
        selectedSpecies={selectedSpecies}
        isDropDownSpecies={isDropDownSpecies}
        setIsDropDownSpecies={setIsDropDownSpecies}
        durationNum={durationNum}
        setDurationNum={setDurationNum}
        duration={duration}
        isDropDownDuration={isDropDownDuration}
        setIsDropDownDuration={setIsDropDownDuration}
        rangeValue={rangeValue}
        selectedDates={availablityDates}
        note={note}
        setNote={setNote}
        openUnAvailableModal={openUnAvailableModal}
        openCalender={openCalender}
        renderShowDropDown={renderShowDropDown}
        closeAllDropDown={closeAllDropDown}
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
          {renderTitle()}
          {renderField()}
        </ScrollView>
      ) : (
        <>
          {renderTitle()}
          {renderField()}
        </>
      )}

      <Bottom
        isMaxHeight={isMaxHeight}
        step={step}
        isDisable={isDisable}
        goBack={goBack}
        goNext={goNext}
      />

      {isShowCalender && (
        <RangeCalender
          isShowCalender={isShowCalender}
          setIsShowCalender={setIsShowCalender}
          availablityDates={availablityDates}
          setAvailablityDates={setAvailablityDates}
          setUnAvailble={setUnAvailble}
          title={duration.title}
          durationNum={durationNum}
          minDate={minDate != '' ? minDate : new Date()}
          totalDays={totalDays}
        />
      )}

      {isShowUnAvailable && (
        <utils.UnAvailableModal
          isModal={isShowUnAvailable}
          setIsModal={setIsShowUnAvailable}
          unAvailable={unAvailable}
          setUnAvailble={setUnAvailble}
          minDate={minDate}
          maxDate={maxDate}
          totalDays={totalDays}
        />
      )}
    </>
  );
}
