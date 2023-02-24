import React from 'react';
import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import {styles} from './styles';
import theme from '../../../../../../theme';
import utils from '../../../../../../utils';

export default function Fields({
  unAvailable,
  tripType,
  isDropDownTripType,
  setIsDropDownTripType,
  city,
  setCity,
  selectedState,
  isDropDownState,
  setIsDropDownState,
  selectedSpecies,
  isDropDownSpecies,
  setIsDropDownSpecies,
  durationNum,
  setDurationNum,
  duration,
  isDropDownDuration,
  setIsDropDownDuration,
  rangeValue,
  selectedDates,
  note,
  setNote,
  openUnAvailableModal,
  openCalender,
  renderShowDropDown,
  closeAllDropDown,
}) {
  const activeOpacity = 0.8;
  const activitySrc = require('../../../../../../assets/images/filters/activity/img.png');
  const speciesSrc = require('../../../../../../assets/images/filters/species/img.png');

  let unavailableText = '';
  let text1 = '';
  let text2 = '';
  if (unAvailable) {
    text1 = unAvailable.wtxt;
    text2 = unAvailable.esd_text;

    if (text1 != '' && text2 != '') {
      unavailableText = text1 + ', ' + text2;
    }
    if (text1 == '' && text2 != '') {
      unavailableText = text2;
    } else if (text1 != '' && text2 == '') {
      unavailableText = text1;
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
              setIsDropDownTripType(!isDropDownTripType);
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
          {isDropDownTripType && renderShowDropDown('tt')}
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
                setCity(value);
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
                setIsDropDownState(!isDropDownState);
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
              setIsDropDownSpecies(!isDropDownSpecies);
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
          {isDropDownSpecies && renderShowDropDown('spcs')}
        </View>
      </View>

      <View style={[styles.fieldContainer]}>
        <Text style={styles.fieldText}>Trip Duration</Text>
        <View style={[styles.fieldContainer, {flexDirection: 'row'}]}>
          <View style={[styles.inputConatiner, {width: '23%'}]}>
            <TextInput
              keyboardType="number-pad"
              maxLength={5}
              defaultValue={durationNum.toString()}
              value={durationNum.toString()}
              onChangeText={d => {
                if (durationNum.length == 0 && d < parseInt(1)) return;
                setDurationNum(d.replace(/[^0-9]/, ''));
              }}
              style={styles.input}
            />
          </View>

          <View style={{width: '36%', marginLeft: 10}}>
            <TouchableOpacity
              onPress={() => {
                closeAllDropDown();
                setIsDropDownDuration(!isDropDownDuration);
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
                  style={[styles.dropDownText, {textTransform: 'capitalize'}]}>
                  {duration.title ? duration.title : ''}
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

            {isDropDownDuration && renderShowDropDown('dur')}
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
                  rangeValue == ''
                    ? theme.color.subTitleLight
                    : theme.color.title,
                fontFamily: theme.fonts.fontNormal,
                width: '85%',
              },
            ]}>
            {rangeValue == '' ? 'Choose a date range' : rangeValue}
          </Text>
          <View
            style={{
              width: '13%',
              alignItems: 'flex-end',
            }}>
            <Image
              source={require('../../../../../../assets/images/cal/img.png')}
              style={styles.inputIcon}
            />
          </View>
        </Pressable>
      </View>

      {selectedDates && (
        <View style={[styles.fieldContainer, {marginTop: 10}]}>
          <TouchableOpacity activeOpacity={0.8} onPress={openUnAvailableModal}>
            <Text style={styles.bottomText}>Set unavailable days</Text>
          </TouchableOpacity>
        </View>
      )}

      {unavailableText != '' && (
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
              onPress={openUnAvailableModal}>
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
              setNote(c);
            }}
            style={styles.textAreaInpt}
            placeholder="(optional)"
            multiline={true}
          />
        </View>
      </View>
    </>
  );
}
