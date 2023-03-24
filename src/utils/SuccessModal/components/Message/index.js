import React from 'react';
import {View, Text, Image, ScrollView} from 'react-native';
import {styles} from './styles';
import Bottom from './components/Bottom';

export default function Message({modalObj, isMaxHeight, closeModal, props}) {
  const {item} = modalObj;
  const {firstName, lastName, email} = item.hostId;
  const userName = firstName + ' ' + lastName;
  const imageSrc = require('../../../../assets/images/msgSentDone/img.png');

  const goToInbox = () => {
    closeModal();
    props.navigation.navigate('Inbox');
  };

  const renderMain = () => {
    return (
      <>
        <View style={styles.mainContainer}>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>
            Message Sent
          </Text>
        </View>

        <View style={styles.mainContainer2}>
          <Image style={styles.image} source={imageSrc} />

          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.subTitle}>
            {userName}
          </Text>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.subTitle2}>
            @{email}
          </Text>
        </View>
      </>
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
        goToInbox={goToInbox}
      />
    </>
  );
}
