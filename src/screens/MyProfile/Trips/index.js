import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TouchableHighlight,
  StatusBar,
  BackHandler,
  Alert,
  Linking,
  PermissionsAndroid,
  Platform,
  Dimensions,
  Modal as MModal,
  FlatList,
} from 'react-native';
import {styles} from './styles';
import {observer} from 'mobx-react';

export default observer(Trips);

function Trips(props) {
  let headerTitle = 'Trips';

  const data = [{v: headerTitle}, {v: headerTitle}, {v: headerTitle}];

  const renderShowData = ({item, index}) => {
    let v = item.v;
    return <Text style={{fontSize: 30, marginTop: 50}}>{v}</Text>;
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={data}
        renderItem={renderShowData}
        keyExtractor={(item, index) => index.toString()}
      />
    </SafeAreaView>
  );
}
