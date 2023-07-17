import React from 'react';
import {View, Text, Image, ScrollView} from 'react-native';
import {styles} from './styles';
import Bottom from './components/Bottom';

export default function Offer({modalObj, isMaxHeight, closeModal, props}) {
  const {item} = modalObj;
  const {firstName, lastName} = item.offeredBy;
  const userName = firstName + ' ' + lastName;
  const imageSrc = require('../../../../assets/images/offerSentDone/img.png');

  const goToConfirmTrips = () => {
    closeModal();
    props.navigation.navigate('ConfirmedTrips');
  };

  const renderMain = () => {
    return (
      <View style={styles.mainContainer}>
        <Image style={styles.image} source={imageSrc} />
        <Text style={styles.title}>You accepted an offer from</Text>
        <Text style={styles.subTitle}>{userName}</Text>
      </View>
    );
  };

  return (
    <>
      {isMaxHeight ? (
        <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1}}>
          {renderMain()}
        </ScrollView>
      ) : (
        <>{renderMain()}</>
      )}

      <Bottom
        isMaxHeight={isMaxHeight}
        closeModal={closeModal}
        goToConfirmTrips={goToConfirmTrips}
      />
    </>
  );
}
