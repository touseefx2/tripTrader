import React, {useState, useEffect} from 'react';
import {Text, ScrollView, Platform} from 'react-native';
import {styles} from './styles';
import utils from '../../../../utils';
import store from '../../../../store';
import {observer} from 'mobx-react';
import Bottom from './components/Bottom';
import RangeCalender from './components/RangeCalender';
import Fields from './components/Fields';
import moment from 'moment';

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

const repeatDurationList = [
  {
    _id: 0,
    is_active: true,
    title: 'weeks',
    type: 'durType',
  },
  {
    _id: 1,
    is_active: true,
    title: 'Days',
    type: 'durType',
  },
  {
    _id: 2,
    is_active: true,
    title: 'Months',
    type: 'durType',
  },
];

export default observer(Step3);
function Step3({step, setStep, setmodalHeight, isMaxHeight, selectedTrip}) {
  const {activity, species, tripLocation, activityList} = store.Filters;

  const [speciesList, setSpeciesList] = useState([]);

  const [location, setLocation] = useState(null);
  const [city, setCity] = useState('');
  const [selectedState, setSelectedState] = useState(null);
  const [tripType, setTripType] = useState(null);
  const [selectedSpecies, setSelectedSpecies] = useState(null);
  const [durationNum, setDurationNum] = useState(1);
  const [duration, setDuration] = useState(durationList[0]);
  const [note, setNote] = useState('');

  const [isShowCalender, setIsShowCalender] = useState(false);
  const [isShowUnAvailable, setIsShowUnAvailable] = useState(false);

  const [selectedDates, setSelectedDates] = useState(null);
  const [unAvailable, setUnAvailble] = useState(null);

  const [isDropDownTripType, setIsDropDownTripType] = useState(false);
  const [isDropDownState, setIsDropDownState] = useState(false);
  const [isDropDownSpecies, setIsDropDownSpecies] = useState(false);
  const [isDropDownDuration, setIsDropDownDuration] = useState(false);

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
      setLocation(location);
      setSelectedSpecies(specis);
      setDurationNum(selectedTrip.duration.value);
      setDuration(duration);
    }
  }, []);

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

  const closeAllDropDown = () => {
    setIsDropDownSpecies(false);
    setIsDropDownTripType(false);
    setIsDropDownState(false);
    setIsDropDownDuration(false);
  };

  const goBack = () => {
    setStep(2);
    setmodalHeight(0);
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

    let abs = Platform.OS == 'ios' ? false : true;
    return (
      <utils.DropDown
        search={true}
        data={data}
        onSelectItem={onclickSelect}
        setVisible={closeAllDropDown}
        c={check}
        absolute={check == 'dur' ? abs : false}
      />
    );
  };

  const openCalender = () => {
    setIsShowCalender(true);
  };

  const openUnAvailableModal = () => {
    setIsShowUnAvailable(true);

    // if (isSetUnavailable) {
    //   let d = isSetUnavailable;
    //   console.log('dddd : ', d);
    //   let ar = d.days_of_week;
    //   let ind = [];
    //   if (ar.length > 0) {
    //     ar.map((e, i, a) => {
    //       if (dw.length > 0) {
    //         ind.push(dw.findIndex(x => x.name === e));
    //       }
    //     });
    //   }
    //   let dw2 = dw.slice();
    //   if (ind.length > 0) {
    //     ind.map((e, i, a) => {
    //       dw2[e].isSel = true;
    //     });
    //   }
    //   setdow(dw2);
    //   setrdurNum(d.repeat_every.num);
    //   let tt = d.repeat_every.title;
    //   let index = repeatDurationList.findIndex(x => x.title === tt);
    //   setrdur(repeatDurationList[index]);
    //   siERpOn(d.repeat_every.endRepeatOn);
    //   let dt = d.exclude_specific_dates;
    //   let md = {};
    //   if (dt.length > 0) {
    //     dt.map((e, i, a) => {
    //       md[moment(e).format('YYYY-MM-DD')] = {
    //         customStyles: cs,
    //         marked: false,
    //         selected: true,
    //         selectedColor: theme.color.button1,
    //         disabled: false,
    //         disableTouchEvent: false,
    //       };
    //     });
    //   }
    //   setselunmarkedSLCTDates(md);
    //   setunavlblSLCTmarkedDates(md);
    // } else {
    //   let dw2 = dw.slice();
    //   if (dw2.length > 0) {
    //     dw2.map((e, i, a) => {
    //       e.isSel = false;
    //     });
    //   }
    //   setdow(dw2);
    //   setrdur(repeatDurationList[0]);
    //   setrdurNum(1);
    //   siERpOn(isSelDate2);
    //   setunavlblmarkedDates({});
    //   setselunmarkedSLCTDates({});
    //   setunavlblSLCTmarkedDates({});
    // }
    // setmodalHeight(0);
    // setisShowUnavliableModal(true);
  };

  const renderField = () => {
    return (
      <Fields
        unAvailable={unAvailable}
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
        selectedDates={selectedDates}
        note={note}
        setNote={setNote}
        openUnAvailableModal={openUnAvailableModal}
        openCalender={openCalender}
        renderShowDropDown={renderShowDropDown}
        closeAllDropDown={closeAllDropDown}
      />
    );
  };

  let isDisable = true;
  let rangeValue = '';
  let minDate = '';
  let maxDate = '';
  if (selectedDates) {
    const size = Object.keys(selectedDates).length;
    const startDate = Object.keys(selectedDates)[0];
    const endDate = Object.keys(selectedDates)[size - 1];
    if (startDate > endDate) {
      minDate = endDate;
      maxDate = startDate;
    } else {
      minDate = startDate;
      maxDate = endDate;
    }
    rangeValue =
      moment(minDate).format('MMM DD, YYYY') +
      '  -  ' +
      moment(maxDate).format('MMM DD, YYYY');
  }
  if (
    selectedDates &&
    durationNum != '' &&
    tripType != '' &&
    speciesList != '' &&
    location != false
  )
    isDisable = false;

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
          selectedDates={selectedDates}
          setSelectedDates={setSelectedDates}
          setUnAvailble={setUnAvailble}
          title={duration.title}
          durationNum={durationNum}
          minDate={minDate != '' ? minDate : new Date()}
        />
      )}

      {isShowUnAvailable && (
        <utils.UnAvailableModal
          isModal={isShowUnAvailable}
          setIsModal={setIsShowUnAvailable}
          step={step}
          unAvailable={unAvailable}
          setUnAvailble={setUnAvailble}
        />
      )}
    </>
  );
}
