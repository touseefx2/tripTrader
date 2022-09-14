import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Linking,
  ScrollView,
  StatusBar,
} from 'react-native';
import {styles} from './styles';
import {inject, observer} from 'mobx-react';
import store from '../../store/index';
import utils from '../../utils/index';
import theme from '../../theme';
import DynamicTabView from 'react-native-dynamic-tab-view';

export default observer(Terms);
function Terms(props) {
  // const data = props.route.params.food;
  let image = require('../../assets/images/logo/img.png');
  let title = 'Food Panda';
  let email = 'panda@gmail.com';
  let phone = '03076565665';

  const goBack = () => {
    props.navigation.goBack();
  };

  const onPressEmail = () => {
    Linking.openURL(`mailto:${email}`);
  };

  const onPressPhone = () => {
    Linking.openURL(`tel:${phone}`);
  };

  const renderLine = () => {
    return (
      <View
        style={{
          width: '100%',
          height: 0.6,
          backgroundColor: theme.color.subTitleLight,
          opacity: 0.5,
        }}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.back}>
          <TouchableOpacity activeOpacity={0.4} onPress={goBack}>
            <utils.vectorIcon.Ionicons
              name="chevron-back"
              color={theme.color.button1}
              size={24}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.htitle}>More</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity activeOpacity={0.4} style={styles.section1}>
          <Text style={styles.sectionText}>Terms & conditions</Text>
        </TouchableOpacity>
        {renderLine()}
        <TouchableOpacity activeOpacity={0.4} style={styles.section1}>
          <Text style={styles.sectionText}>Data policy</Text>
        </TouchableOpacity>
        {renderLine()}
      </ScrollView>
    </SafeAreaView>
  );
}
