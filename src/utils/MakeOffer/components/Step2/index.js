import React, {useState} from 'react';
import {View, Text, ScrollView, Pressable} from 'react-native';
import {styles} from './styles';
import theme from '../../../../theme';
import utils from '../../../../utils';
import store from '../../../../store';
import {observer} from 'mobx-react';
import Bottom from './components/Bottom';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

export default observer(Step2);
function Step2({
  step,
  setStep,
  setmodalHeight,
  isMaxHeight,
  selectedTrip,
  setSelectedTrip,
  isTripRefresh,
  setIsTripRefresh,
}) {
  const {trips} = store.User;
  const [isDropDownTrip, setisDropDownTrip] = useState(false);

  const closeDropDown = () => {
    setisDropDownTrip(false);
  };

  const goBack = () => {
    setStep(1);
    setmodalHeight(0);
    setSelectedTrip(null);
  };

  const goNext = () => {
    closeDropDown();
    setStep(3);
    setmodalHeight(0);
    setIsTripRefresh(!isTripRefresh);
  };

  const renderTitle = () => {
    return (
      <Text style={styles.modalsubTitle}>
        Now, let's fill out the details of your offer.
      </Text>
    );
  };

  const renderShowDropDown = check => {
    const data = check == 'trip' ? trips : [];

    const onclickSelect = obj => {
      if (obj === 'customOffer') {
        setSelectedTrip(null);
        goNext();
        return;
      }
      if (check === 'trip') {
        setSelectedTrip(obj);
        return;
      }
    };

    return (
      <utils.DropDown
        search={true}
        data={data}
        onSelectItem={onclickSelect}
        setVisible={closeDropDown}
        c={check}
        footer={true}
        absolute={false}
      />
    );
  };

  const renderDropDown = () => {
    return (
      <View style={styles.dropDownMainConatiner}>
        <Text style={styles.dropdownFieldTitle}>
          What are you offering to trade?
        </Text>
        <View style={{width: '100%', marginTop: 5}}>
          <Pressable
            onPress={() => setisDropDownTrip(!isDropDownTrip)}
            style={({pressed}) => [
              styles.dropDowninputConatiner,
              {
                opacity: pressed ? 0.7 : 1.0,
              },
            ]}>
            <View style={{width: '91%'}}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[
                  styles.dropDownText,
                  {
                    color: selectedTrip
                      ? theme.color.title
                      : theme.color.subTitleLight,
                  },
                ]}>
                {selectedTrip
                  ? selectedTrip.species
                  : 'Select a trip or create custom offer...'}
              </Text>
            </View>

            <utils.vectorIcon.Fontisto
              name="angle-down"
              color={theme.color.title}
              size={12}
            />
          </Pressable>

          {isDropDownTrip && renderShowDropDown('trip')}
        </View>
      </View>
    );
  };

  return (
    <>
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        {isMaxHeight ? (
          <ScrollView
            contentContainerStyle={{paddingHorizontal: 15}}
            showsVerticalScrollIndicator={false}
            style={{flex: 1}}>
            {renderTitle()}
            {renderDropDown()}
          </ScrollView>
        ) : (
          <>
            {renderTitle()}
            {renderDropDown()}
          </>
        )}
      </KeyboardAwareScrollView>
      <Bottom
        isMaxHeight={isMaxHeight}
        step={step}
        selectedTrip={selectedTrip}
        goBack={goBack}
        goNext={goNext}
      />
    </>
  );
}
