import React from 'react';
import {View, Text, Image, Pressable, TextInput} from 'react-native';
import {styles} from '../styles';

export default function ListHeader({search, setsearch, data}) {
  const renderResult = () => {
    const length = data.length || 0;
    return (
      <View style={styles.resultContainer}>
        <Text style={styles.resultText}>{length} saved trip</Text>
      </View>
    );
  };

  const renderSearch = () => {
    return (
      <Image
        source={require('../../../assets/images/searchBar/search/img.png')}
        style={styles.Baricon}
      />
    );
  };

  const renderInput = () => {
    return (
      <View style={{width: '92%'}}>
        <TextInput
          onChangeText={c => {
            setsearch(c);
          }}
          value={search}
          style={styles.SerchBarInput}
          placeholder="Search"
        />
      </View>
    );
  };

  return (
    <View>
      <Pressable
        style={({pressed}) => [
          {opacity: pressed ? 0.9 : 1},
          [styles.SerchBarContainer],
        ]}>
        {renderSearch()}
        {renderInput()}
      </Pressable>
      {data.length > 0 && renderResult()}
    </View>
  );
}
