import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Platform,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import {styles} from './styles';
import theme from '../../../../theme';
import utils from '../../../../utils';
import store from '../../../../store';
import {observer} from 'mobx-react';
import Bottom from './components/Bottom';

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

const activeOpacity = 0.8;
const activitySrc = require('../../../../assets/images/filters/activity/img.png');
const speciesSrc = require('../../../../assets/images/filters/species/img.png');

export default observer(Step3);
function Step3({
  modalObj,
  step,
  setStep,
  setmodalHeight,
  isMaxHeight,
  selectedTrip,
}) {
  const {activity, species, tripLocation} = store.Filters;

  const [activityList, setActivityList] = useState([]);
  const [speciesList, setSpeciesList] = useState([]);

  const [location, setlocation] = useState(null);
  const [city, setcity] = useState('');
  const [selectedState, setSelectedState] = useState(null);
  const [tripType, settripType] = useState(null);
  const [selectedSpecies, setSelectedSpecies] = useState(null);
  const [durNum, setdurNum] = useState(1);
  const [dur, setdur] = useState(durationList[0]);
  const [rdur, setrdur] = useState(repeatDurationList[0]);
  const [note, setnote] = useState('');

  const [isShowCalender, setIsshowCalender] = useState(false);
  const [isSelDate, setisSelDate] = useState(false);
  const [isSelDate1, setisSelDate1] = useState('');
  const [isSelDate2, setisSelDate2] = useState('');
  const [markedDates, setmarkedDates] = useState(null);
  const [selDates, setselDates] = useState(null);
  const [isSetUnavailable, setisSetUnavailable] = useState(false);

  const [isDropDownTT, setisDropDownTT] = useState(false);
  const [isDropDownState, setisDropDownState] = useState(false);
  const [isDropDownSpcs, setisDropDownSpcs] = useState(false);
  const [isDropDownDur, setisDropDownDur] = useState(false);

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
        setcity(location.city);
        setSelectedState(
          utils.functions.findItem(location.state || '', tripLocation, 'n'),
        );
      }
      settripType(tripType);
      setlocation(location);
      setSelectedSpecies(specis);
      setdurNum(selectedTrip.duration.value);
      setdur(duration);
      setisSelDate1('');
      setisSelDate2('');
      setisSelDate(false);
      setmarkedDates(null);
      setselDates(null);
      setisSetUnavailable(false);
    }
  }, []);

  useEffect(() => {
    if (activity.length > 0 && species.length > 0 && activityList.length <= 0) {
      let activityLists = [];
      activity.map(element => {
        for (let index = 0; index < species.length; index++) {
          const item = species[index];
          if (item.type && item.type._id === element._id) {
            activityLists.push(element);
            break;
          }
        }
      });

      setActivityList(activityLists);
    }
  }, [species, activity, activityList]);

  const closeAllDropDown = () => {
    setisDropDownSpcs(false);
    setisDropDownTT(false);
    setisDropDownState(false);
    setisDropDownDur(false);
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
    let data =
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
        settripType(obj);
        if (tripType && tripType.name !== obj.name) setSelectedSpecies(null);
      }
      if (check == 'state') setSelectedState(obj);

      if (check == 'spcs') setSelectedSpecies(obj);

      if (check == 'dur') setdur(obj);
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
    setIsshowCalender(true);
  };

  const closeCalender = () => {
    setIsshowCalender(false);
  };

  const renderField = () => {
    const onClickUnavailableDays = () => {
      // if (selDates) {
      //   if (isSetUnavailable) {
      //     let d = isSetUnavailable;
      //     console.log('dddd : ', d);
      //     let ar = d.days_of_week;
      //     let ind = [];
      //     if (ar.length > 0) {
      //       ar.map((e, i, a) => {
      //         if (dw.length > 0) {
      //           ind.push(dw.findIndex(x => x.name === e));
      //         }
      //       });
      //     }
      //     let dw2 = dw.slice();
      //     if (ind.length > 0) {
      //       ind.map((e, i, a) => {
      //         dw2[e].isSel = true;
      //       });
      //     }
      //     setdow(dw2);
      //     setrdurNum(d.repeat_every.num);
      //     let tt = d.repeat_every.title;
      //     let index = repeatDurationList.findIndex(x => x.title === tt);
      //     setrdur(repeatDurationList[index]);
      //     siERpOn(d.repeat_every.endRepeatOn);
      //     let dt = d.exclude_specific_dates;
      //     let md = {};
      //     if (dt.length > 0) {
      //       dt.map((e, i, a) => {
      //         md[moment(e).format('YYYY-MM-DD')] = {
      //           customStyles: cs,
      //           marked: false,
      //           selected: true,
      //           selectedColor: theme.color.button1,
      //           disabled: false,
      //           disableTouchEvent: false,
      //         };
      //       });
      //     }
      //     setselunmarkedSLCTDates(md);
      //     setunavlblSLCTmarkedDates(md);
      //   } else {
      //     let dw2 = dw.slice();
      //     if (dw2.length > 0) {
      //       dw2.map((e, i, a) => {
      //         e.isSel = false;
      //       });
      //     }
      //     setdow(dw2);
      //     setrdur(repeatDurationList[0]);
      //     setrdurNum(1);
      //     siERpOn(isSelDate2);
      //     setunavlblmarkedDates({});
      //     setselunmarkedSLCTDates({});
      //     setunavlblSLCTmarkedDates({});
      //   }
      //   setmodalHeight(0);
      //   setisShowUnavliableModal(true);
      // } else {
      //   Alert.alert('', 'Please select Trip Availability first');
      // }
    };

    let t = '';
    if (isSelDate1 != '' && isSelDate2 != '') {
      t =
        moment(isSelDate1).format('MMM DD, YYYY') +
        '  -  ' +
        moment(isSelDate2).format('MMM DD, YYYY');
    }

    let unavailableText = '';
    let t1 = '';
    let t2 = '';
    if (isSetUnavailable) {
      t1 = isSetUnavailable.wtxt;
      t2 = isSetUnavailable.esd_text;

      if (t1 != '' && t2 != '') {
        unavailableText = t1 + ', ' + t2;
      }
      if (t1 == '' && t2 != '') {
        unavailableText = t2;
      } else if (t1 != '' && t2 == '') {
        unavailableText = t1;
      }
    }

    return (
      <>
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldText}>You’re offering...</Text>
          {/* activity */}
          <View style={{width: '100%'}}>
            <TouchableOpacity
              onPress={() => {
                closeAllDropDown();
                setisDropDownTT(!isDropDownTT);
              }}
              activeOpacity={activeOpacity}
              style={[styles.dropDowninputConatiner]}>
              <Image style={styles.dropDownIcon} source={activitySrc} />

              <View style={{width: '82%'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={[
                    styles.dropDownText,
                    {
                      opacity: !tripType ? 0.4 : 1,
                      textTransform: !tripType ? 'none' : 'capitalize',
                    },
                  ]}>
                  {!tripType ? 'Select Activity' : tripType.name + ' Trip'}
                </Text>
              </View>
              <utils.vectorIcon.Fontisto
                name="angle-down"
                color={'#14181F'}
                size={11}
              />
            </TouchableOpacity>
            {isDropDownTT && renderShowDropDown('tt')}
          </View>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldText}>Located in...</Text>
          {/* location */}
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View style={[styles.inputConatiner, {width: '58%'}]}>
              <TextInput
                value={city}
                onChangeText={value => {
                  setcity(value);
                }}
                placeholder="Example: Southeastern"
                style={styles.input}
              />
            </View>
            {/* location */}
            <View style={{width: '40%'}}>
              <TouchableOpacity
                onPress={() => {
                  closeAllDropDown();
                  setisDropDownState(!isDropDownState);
                }}
                activeOpacity={activeOpacity}
                style={[styles.dropDowninputConatiner]}>
                <View style={{width: '82%'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={[
                      styles.dropDownText,
                      {
                        opacity: !selectedState ? 0.4 : 1,
                        textTransform: !selectedState ? 'none' : 'capitalize',
                      },
                    ]}>
                    {!selectedState ? 'State' : selectedState.name}
                  </Text>
                </View>
                <utils.vectorIcon.Fontisto
                  name="angle-down"
                  color={'#14181F'}
                  size={11}
                />
              </TouchableOpacity>
              {isDropDownState && renderShowDropDown('state')}
            </View>
          </View>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldText}>Please enter the species</Text>
          {/* species */}
          <View style={{width: '100%'}}>
            <TouchableOpacity
              disabled={!tripType ? true : false}
              onPress={() => {
                closeAllDropDown();
                setisDropDownSpcs(!isDropDownSpcs);
              }}
              activeOpacity={activeOpacity}
              style={[
                styles.dropDowninputConatiner,
                {opacity: !tripType ? 0.5 : 1},
              ]}>
              <Image style={styles.dropDownIcon} source={speciesSrc} />
              <View style={{width: '83%'}}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={[
                    styles.dropDownText,
                    {
                      opacity: !selectedSpecies ? 0.4 : 1,
                      textTransform: !selectedSpecies ? 'none' : 'capitalize',
                    },
                  ]}>
                  {!selectedSpecies ? 'Select species' : selectedSpecies.name}
                </Text>
              </View>
              <utils.vectorIcon.Fontisto
                style={{opacity: tripType == '' ? 0.5 : 1}}
                name="angle-down"
                color={'#14181F'}
                size={11}
              />
            </TouchableOpacity>
            {isDropDownSpcs && renderShowDropDown('spcs')}
          </View>
        </View>

        <View style={[styles.fieldContainer]}>
          <Text style={styles.fieldText}>Trip Duration</Text>
          <View style={[styles.fieldContainer, {flexDirection: 'row'}]}>
            <View style={[styles.inputConatiner, {width: '23%'}]}>
              <TextInput
                keyboardType="number-pad"
                maxLength={5}
                defaultValue={durNum.toString()}
                value={durNum.toString()}
                onChangeText={d => {
                  if (durNum.length == 0 && d < parseInt(1)) return;
                  setdurNum(d.replace(/[^0-9]/, ''));
                }}
                style={styles.input}
              />
            </View>

            <View style={{width: '36%', marginLeft: 10}}>
              <TouchableOpacity
                onPress={() => {
                  closeAllDropDown();
                  setisDropDownDur(!isDropDownDur);
                }}
                activeOpacity={0.6}
                style={[
                  styles.inputConatiner,
                  {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: 15,
                  },
                ]}>
                <View style={{width: '70%'}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={[
                      styles.dropDownText,
                      {textTransform: 'capitalize'},
                    ]}>
                    {dur.title ? dur.title : ''}
                  </Text>
                </View>
                <View
                  style={{
                    width: '27%',
                    alignItems: 'flex-end',
                  }}>
                  <utils.vectorIcon.Fontisto
                    name="angle-down"
                    color={'#14181F'}
                    size={11}
                  />
                </View>
              </TouchableOpacity>

              {isDropDownDur && renderShowDropDown('dur')}
            </View>
          </View>
        </View>

        <View style={[styles.fieldContainer]}>
          <Text style={styles.fieldText}>Trip Availability</Text>
          <Text
            style={[
              styles.fieldText,
              {
                color: theme.color.subTitle,
                fontSize: 12.5,
                fontFamily: theme.fonts.fontNormal,
              },
            ]}>
            Guests will be able to choose between these dates.
          </Text>

          <Pressable
            onPress={openCalender}
            style={({pressed}) => [
              {opacity: pressed ? 0.8 : 1.0},
              [
                styles.inputConatiner,
                {
                  width: '82%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                },
              ],
            ]}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={[
                styles.fieldText,
                {
                  color:
                    t == '' ? theme.color.subTitleLight : theme.color.title,
                  fontFamily: theme.fonts.fontNormal,
                  width: '85%',
                },
              ]}>
              {t == '' ? 'Choose a date range' : t}
            </Text>
            <View
              style={{
                width: '13%',
                alignItems: 'flex-end',
              }}>
              <Image
                source={require('../../../../assets/images/cal/img.png')}
                style={styles.inputIcon}
              />
            </View>
          </Pressable>
        </View>

        {!isSetUnavailable && (
          <View style={[styles.fieldContainer, {marginTop: 10}]}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onClickUnavailableDays}>
              <Text style={styles.bottomText}>Set unavailable days</Text>
            </TouchableOpacity>
          </View>
        )}

        {isSetUnavailable && (
          <View style={styles.fieldContainer}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text style={styles.fieldText}>Unavailable Days</Text>
              <TouchableOpacity
                activeOpacity={0.8}
                style={{marginLeft: 15}}
                onPress={onClickUnavailableDays}>
                <Text style={[styles.bottomText, {fontSize: 13.5}]}>Edit</Text>
              </TouchableOpacity>
            </View>
            <View style={{width: '100%', marginTop: 5}}>
              <Text style={styles.bottomText2}>{unavailableText}</Text>
            </View>
          </View>
        )}

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldText}>Offer Note</Text>
          <View style={styles.textArea}>
            <TextInput
              value={note}
              onChangeText={c => {
                setnote(c);
              }}
              style={styles.textAreaInpt}
              placeholder="(optional)"
              multiline={true}
            />
          </View>
        </View>
      </>
    );
  };

  let isDisable = true;
  if (
    isSelDate &&
    durNum != '' &&
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
    </>
  );
}
