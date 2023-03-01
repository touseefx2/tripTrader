import React from 'react';
import {View, Text, Image, ScrollView} from 'react-native';
import {styles} from './styles';
import Bottom from './components/Bottom';

export default function Trip({modalObj, isMaxHeight, closeModal}) {
  const {item} = modalObj;
  const {title} = item;

  const imageSrc = require('../../../../assets/images/tripSaveDone/img.png');

  const renderMain = () => {
    return (
      <>
        <View style={styles.mainContainer}>
          <Text style={styles.title}>Trip Saved</Text>
        </View>

        <View style={styles.mainContainer2}>
          <Image style={styles.image} source={imageSrc} />

          <Text style={styles.subTitle}>{`"${title}"`}</Text>
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

      <Bottom isMaxHeight={isMaxHeight} closeModal={closeModal} />
    </>
  );
}
